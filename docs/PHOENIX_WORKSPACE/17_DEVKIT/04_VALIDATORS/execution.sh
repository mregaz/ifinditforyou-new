#!/usr/bin/env bash

# ==============================================================================
# PHOENIX DEVKIT — VALIDATION EXECUTION ENGINE
# ==============================================================================
#
# Purpose:
# Execute registered Phoenix Validators and normalize their results.
#
# Responsibilities:
# - Validate explicit validation requests
# - Resolve registered validator implementations
# - Invoke validators without shell evaluation
# - Validate the V01 internal result protocol
# - Serialize canonical public validation results
#
# Non-responsibilities:
# - Validator registration
# - Target repair or mutation
# - CLI handling
# - Generator-specific validation
#
# ==============================================================================

# ------------------------------------------------------------------------------
# Load Guard
# ------------------------------------------------------------------------------

if [[ -n "${PHOENIX_VALIDATOR_EXECUTION_LOADED:-}" ]]; then
  return 0 2>/dev/null || exit 0
fi

PHOENIX_VALIDATOR_EXECUTION_LOADED=1

# ------------------------------------------------------------------------------
# Module Paths
# ------------------------------------------------------------------------------

PHOENIX_VALIDATOR_EXECUTION_DIR="$(
  cd "$(dirname "${BASH_SOURCE[0]}")" && pwd
)"

# ------------------------------------------------------------------------------
# Dependencies
# ------------------------------------------------------------------------------

source "${PHOENIX_VALIDATOR_EXECUTION_DIR}/registry.sh"

# ------------------------------------------------------------------------------
# Internal Helpers
# ------------------------------------------------------------------------------

_phoenix::validator_definition_field() {
  local definition="${1:-}"
  local field="${2:-}"
  local line

  [[ -n "$definition" ]] || return 1
  [[ -n "$field" ]] || return 1

  while IFS= read -r line; do
    case "$line" in
      "${field}="*)
        printf '%s\n' "${line#*=}"
        return 0
        ;;
    esac
  done <<< "$definition"

  return 1
}

_phoenix::validator_result_field() {
  local result="${1:-}"
  local field="${2:-}"
  local line
  local found=0
  local value=""

  [[ -n "$result" ]] || return 1
  [[ -n "$field" ]] || return 1

  while IFS= read -r line; do
    case "$line" in
      "${field}="*)
        [[ "$found" -eq 0 ]] || return 1
        value="${line#*=}"
        found=1
        ;;
    esac
  done <<< "$result"

  [[ "$found" -eq 1 ]] || return 1

  printf '%s\n' "$value"
}

_phoenix::validator_result_has_only_known_fields() {
  local result="${1:-}"
  local line

  [[ -n "$result" ]] || return 1

  while IFS= read -r line; do
    case "$line" in
      RESULT=*|CHECK=*|MESSAGE=*)
        ;;
      *)
        return 1
        ;;
    esac
  done <<< "$result"

  return 0
}

# ------------------------------------------------------------------------------
# Public API
# ------------------------------------------------------------------------------

phoenix::validator_run() {
  local validator_id="${1:-}"
  local target="${2:-}"

  [[ "$#" -eq 2 ]] || return 1
  [[ -n "$validator_id" ]] || return 1
  [[ -n "$target" ]] || return 1

  local definition
  local implementation
  local internal_result
  local result_type
  local check
  local message

  definition="$(
    phoenix::validator_resolve "$validator_id"
  )" || return 1

  implementation="$(
    _phoenix::validator_definition_field \
      "$definition" \
      "IMPLEMENTATION"
  )" || return 1

  [[ -n "$implementation" ]] || return 1

  declare -F "$implementation" >/dev/null 2>&1 || {
    printf 'STATUS=ERROR\n'
    printf 'VALIDATOR=%s\n' "$validator_id"
    printf 'TARGET=%s\n' "$target"
    printf 'MESSAGE=Validator implementation is unavailable\n'
    return 1
  }

  local combined_output
  local implementation_status
  local implementation_stderr_present=0
  local captured_line

  internal_result=""

  combined_output="$(
    "$implementation" "$target" \
      2> >(
        while IFS= read -r captured_line || [[ -n "$captured_line" ]]; do
          printf '__PHOENIX_VALIDATOR_STDERR__%s\n' "$captured_line"
        done
      )
  )"

  implementation_status=$?

  while IFS= read -r captured_line; do
    case "$captured_line" in
      __PHOENIX_VALIDATOR_STDERR__*)
        implementation_stderr_present=1
        ;;
      *)
        if [[ -n "$internal_result" ]]; then
          internal_result="${internal_result}"$'\n'"${captured_line}"
        else
          internal_result="$captured_line"
        fi
        ;;
    esac
  done <<< "$combined_output"

  if [[ "$implementation_status" -ne 0 ||
        "$implementation_stderr_present" -ne 0 ]]; then
    printf 'STATUS=ERROR\n'
    printf 'VALIDATOR=%s\n' "$validator_id"
    printf 'TARGET=%s\n' "$target"
    printf 'MESSAGE=Validator execution failed\n'
    return 1
  fi

  if ! _phoenix::validator_result_has_only_known_fields "$internal_result"; then
    printf 'STATUS=ERROR\n'
    printf 'VALIDATOR=%s\n' "$validator_id"
    printf 'TARGET=%s\n' "$target"
    printf 'MESSAGE=Validator returned an invalid result contract\n'
    return 1
  fi

  result_type="$(
    _phoenix::validator_result_field \
      "$internal_result" \
      "RESULT"
  )" || {
    printf 'STATUS=ERROR\n'
    printf 'VALIDATOR=%s\n' "$validator_id"
    printf 'TARGET=%s\n' "$target"
    printf 'MESSAGE=Validator returned an invalid result contract\n'
    return 1
  }

  case "$result_type" in
    VALID)
      if _phoenix::validator_result_field "$internal_result" "CHECK" >/dev/null 2>&1 ||
         _phoenix::validator_result_field "$internal_result" "MESSAGE" >/dev/null 2>&1; then
        printf 'STATUS=ERROR\n'
        printf 'VALIDATOR=%s\n' "$validator_id"
        printf 'TARGET=%s\n' "$target"
        printf 'MESSAGE=Validator returned an invalid result contract\n'
        return 1
      fi

      printf 'STATUS=VALID\n'
      printf 'VALIDATOR=%s\n' "$validator_id"
      printf 'TARGET=%s\n' "$target"
      return 0
      ;;

    INVALID)
      check="$(
        _phoenix::validator_result_field \
          "$internal_result" \
          "CHECK"
      )" || {
        printf 'STATUS=ERROR\n'
        printf 'VALIDATOR=%s\n' "$validator_id"
        printf 'TARGET=%s\n' "$target"
        printf 'MESSAGE=Validator returned an invalid result contract\n'
        return 1
      }

      message="$(
        _phoenix::validator_result_field \
          "$internal_result" \
          "MESSAGE"
      )" || {
        printf 'STATUS=ERROR\n'
        printf 'VALIDATOR=%s\n' "$validator_id"
        printf 'TARGET=%s\n' "$target"
        printf 'MESSAGE=Validator returned an invalid result contract\n'
        return 1
      }

      [[ -n "$check" && -n "$message" ]] || {
        printf 'STATUS=ERROR\n'
        printf 'VALIDATOR=%s\n' "$validator_id"
        printf 'TARGET=%s\n' "$target"
        printf 'MESSAGE=Validator returned an invalid result contract\n'
        return 1
      }

      printf 'STATUS=INVALID\n'
      printf 'VALIDATOR=%s\n' "$validator_id"
      printf 'TARGET=%s\n' "$target"
      printf 'CHECK=%s\n' "$check"
      printf 'MESSAGE=%s\n' "$message"
      return 1
      ;;

    ERROR)
      if _phoenix::validator_result_field "$internal_result" "CHECK" >/dev/null 2>&1; then
        printf 'STATUS=ERROR\n'
        printf 'VALIDATOR=%s\n' "$validator_id"
        printf 'TARGET=%s\n' "$target"
        printf 'MESSAGE=Validator returned an invalid result contract\n'
        return 1
      fi

      message="$(
        _phoenix::validator_result_field \
          "$internal_result" \
          "MESSAGE"
      )" || {
        printf 'STATUS=ERROR\n'
        printf 'VALIDATOR=%s\n' "$validator_id"
        printf 'TARGET=%s\n' "$target"
        printf 'MESSAGE=Validator returned an invalid result contract\n'
        return 1
      }

      [[ -n "$message" ]] || {
        printf 'STATUS=ERROR\n'
        printf 'VALIDATOR=%s\n' "$validator_id"
        printf 'TARGET=%s\n' "$target"
        printf 'MESSAGE=Validator returned an invalid result contract\n'
        return 1
      }

      printf 'STATUS=ERROR\n'
      printf 'VALIDATOR=%s\n' "$validator_id"
      printf 'TARGET=%s\n' "$target"
      printf 'MESSAGE=%s\n' "$message"
      return 1
      ;;

    *)
      printf 'STATUS=ERROR\n'
      printf 'VALIDATOR=%s\n' "$validator_id"
      printf 'TARGET=%s\n' "$target"
      printf 'MESSAGE=Validator returned an invalid result contract\n'
      return 1
      ;;
  esac
}
