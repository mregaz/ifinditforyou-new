#!/usr/bin/env bash

# ==============================================================================
# PHOENIX DEVKIT — GENERATOR PLANNING ENGINE
# ==============================================================================
#
# Purpose:
#   Build deterministic generation plans from registered Generator Definitions.
#
# Responsibilities:
#   - Validate generation requests
#   - Resolve Generator Definitions
#   - Parse reserved generator options
#   - Validate required variables
#   - Validate artifact mappings
#   - Detect destination conflicts
#   - Produce deterministic textual plans
#
# Non-responsibilities:
#   - Generator execution
#   - Template rendering
#   - Filesystem mutation
#   - CLI handling
#
# ==============================================================================


# ------------------------------------------------------------------------------
# Load Guard
# ------------------------------------------------------------------------------

if [[ -n "${PHOENIX_GENERATOR_PLANNING_LOADED:-}" ]]; then
  return 0 2>/dev/null || exit 0
fi

PHOENIX_GENERATOR_PLANNING_LOADED=1


# ------------------------------------------------------------------------------
# Dependencies
# ------------------------------------------------------------------------------

PHOENIX_GENERATOR_PLANNING_DIR="$(
  cd "$(dirname "${BASH_SOURCE[0]}")" && pwd
)"

source "${PHOENIX_GENERATOR_PLANNING_DIR}/registry.sh"


# ------------------------------------------------------------------------------
# Internal Helpers
# ------------------------------------------------------------------------------

_phoenix::generator_definition_field() {
  local definition="${1:-}"
  local field="${2:-}"
  local line

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


_phoenix::generator_request_variable() {
  local variable_name="${1:-}"
  shift || true

  local argument
  local key
  local value

  for argument in "$@"; do
    case "$argument" in
      PHOENIX_*=*)
        continue
        ;;
      *=*)
        key="${argument%%=*}"
        value="${argument#*=}"

        if [[ "$key" == "$variable_name" ]]; then
          printf '%s\n' "$value"
          return 0
        fi
        ;;
    esac
  done

  return 1
}


_phoenix::generator_validate_required_variables() {
  local definition="${1:-}"
  shift || true

  local required_variables
  local variable_name

  required_variables="$(
    _phoenix::generator_definition_field \
      "$definition" \
      "REQUIRED_VARIABLES"
  )" || return 1

  [[ -z "$required_variables" ]] && return 0

  while IFS= read -r variable_name; do
    [[ -n "$variable_name" ]] || continue

    if ! _phoenix::generator_request_variable \
        "$variable_name" \
        "$@" >/dev/null; then
      return 1
    fi
  done <<EOF_VARS
$(printf '%s\n' "$required_variables" | tr ',' '\n')
EOF_VARS

  return 0
}


_phoenix::generator_validate_request_arguments() {
  local argument
  local key

  for argument in "$@"; do
    case "$argument" in
      *=*)
        key="${argument%%=*}"
        [[ -n "$key" ]] || return 1
        ;;
      *)
        return 1
        ;;
    esac
  done

  return 0
}


_phoenix::generator_parse_reserved_options() {
  local argument
  local key
  local value

  local dry_run="0"
  local overwrite="0"

  local dry_run_seen=0
  local overwrite_seen=0

  for argument in "$@"; do
    case "$argument" in

      PHOENIX_DRY_RUN=*)
        [[ "$dry_run_seen" -eq 0 ]] || return 1

        value="${argument#*=}"

        case "$value" in
          0|1)
            dry_run="$value"
            ;;
          *)
            return 1
            ;;
        esac

        dry_run_seen=1
        ;;

      PHOENIX_OVERWRITE=*)
        [[ "$overwrite_seen" -eq 0 ]] || return 1

        value="${argument#*=}"

        case "$value" in
          0|1)
            overwrite="$value"
            ;;
          *)
            return 1
            ;;
        esac

        overwrite_seen=1
        ;;

      PHOENIX_*=*)
        return 1
        ;;

      *=*)
        key="${argument%%=*}"

        case "$key" in
          PHOENIX_*)
            return 1
            ;;
        esac
        ;;

    esac
  done

  printf '%s\n' "$overwrite"
  printf '%s\n' "$dry_run"

  return 0
}


_phoenix::generator_join_path() {
  local destination="${1:-}"
  local mapping="${2:-}"

  if [[ "$destination" == "/" ]]; then
    printf '/%s\n' "$mapping"
    return 0
  fi

  while [[ "$destination" != "/" && "$destination" == */ ]]; do
    destination="${destination%/}"
  done

  printf '%s/%s\n' "$destination" "$mapping"
}


# ------------------------------------------------------------------------------
# Public API
# ------------------------------------------------------------------------------

phoenix::generator_plan() {
  local generator_id="${1:-}"
  local destination="${2:-}"

  if [[ "$#" -ge 2 ]]; then
    shift 2
  else
    return 1
  fi

  local definition
  local parsed_options
  local overwrite
  local dry_run

  local line
  local mapping
  local artifact_path

  local artifacts=""
  local overwrite_policy

  [[ -n "$generator_id" ]] || return 1
  [[ -n "$destination" ]] || return 1

  phoenix::generator_exists "$generator_id" || return 1

  definition="$(
    phoenix::generator_resolve "$generator_id"
  )" || return 1

  _phoenix::generator_validate_request_arguments "$@" || return 1

  parsed_options="$(
    _phoenix::generator_parse_reserved_options "$@"
  )" || return 1

  overwrite="$(printf '%s\n' "$parsed_options" | sed -n '1p')"
  dry_run="$(printf '%s\n' "$parsed_options" | sed -n '2p')"

  _phoenix::generator_validate_required_variables \
    "$definition" \
    "$@" || return 1

  overwrite_policy="$(
    _phoenix::generator_definition_field \
      "$definition" \
      "OVERWRITE_POLICY"
  )" || return 1

  if [[ "$overwrite" == "1" && "$overwrite_policy" != "1" ]]; then
    return 1
  fi

  while IFS= read -r line; do
    case "$line" in
      TEMPLATE_MAP=*)
        mapping="${line#TEMPLATE_MAP=}"
        mapping="${mapping#*=>}"

        artifact_path="$(
          _phoenix::generator_join_path \
            "$destination" \
            "$mapping"
        )" || return 1

        if [[ -e "$artifact_path" && "$overwrite" != "1" ]]; then
          return 1
        fi

        artifacts="${artifacts}ARTIFACT=${artifact_path}"$'\n'
        ;;
    esac
  done <<< "$definition"

  [[ -n "$artifacts" ]] || return 1

  # No stdout is emitted before all planning validation succeeds.

  printf 'STATUS=PLAN\n'
  printf 'GENERATOR=%s\n' "$generator_id"
  printf 'DESTINATION=%s\n' "$destination"
  printf 'OVERWRITE=%s\n' "$overwrite"
  printf 'DRY_RUN=%s\n' "$dry_run"
  printf '%s' "$artifacts"

  return 0
}
