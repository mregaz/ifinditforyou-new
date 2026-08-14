#!/usr/bin/env bash

# ==============================================================================
# PHOENIX DEVKIT — VALIDATOR REGISTRY
# ==============================================================================
#
# Purpose:
# Maintain the explicit registry of Phoenix Validator Definitions.
#
# Responsibilities:
# - Register Validator Definitions
# - Check whether a validator exists
# - Resolve a validator ID to its Validator Definition
# - List registered validator IDs
#
# Non-responsibilities:
# - Validator execution
# - Target inspection
# - Filesystem mutation
# - CLI handling
#
# ==============================================================================

# ------------------------------------------------------------------------------
# Load Guard
# ------------------------------------------------------------------------------

if [[ -n "${PHOENIX_VALIDATOR_REGISTRY_LOADED:-}" ]]; then
  return 0 2>/dev/null || exit 0
fi

PHOENIX_VALIDATOR_REGISTRY_LOADED=1

# ------------------------------------------------------------------------------
# Registry State
# ------------------------------------------------------------------------------

# Indexed arrays preserve compatibility with Bash 3.2.

PHOENIX_VALIDATOR_REGISTRY_IDS=()
PHOENIX_VALIDATOR_REGISTRY_DEFINITIONS=()

# ------------------------------------------------------------------------------
# Internal Helpers
# ------------------------------------------------------------------------------

_phoenix::validator_registry_index_of() {
  local validator_id="${1:-}"
  local index

  [[ -n "$validator_id" ]] || return 1

  for ((index = 0; index < ${#PHOENIX_VALIDATOR_REGISTRY_IDS[@]}; index++)); do
    if [[ "${PHOENIX_VALIDATOR_REGISTRY_IDS[$index]}" == "$validator_id" ]]; then
      printf '%s\n' "$index"
      return 0
    fi
  done

  return 1
}

_phoenix::validator_definition_validate() {
  local expected_id="${1:-}"
  local definition="${2:-}"

  local line
  local value

  local found_id=0
  local found_purpose=0
  local found_implementation=0

  [[ -n "$expected_id" ]] || return 1
  [[ -n "$definition" ]] || return 1

  while IFS= read -r line; do
    case "$line" in
      ID=*)
        value="${line#ID=}"
        [[ "$value" == "$expected_id" ]] || return 1
        found_id=1
        ;;

      PURPOSE=*)
        value="${line#PURPOSE=}"
        [[ -n "$value" ]] || return 1
        found_purpose=1
        ;;

      IMPLEMENTATION=*)
        value="${line#IMPLEMENTATION=}"
        [[ -n "$value" ]] || return 1
        found_implementation=1
        ;;
    esac
  done <<< "$definition"

  [[ "$found_id" -eq 1 ]] || return 1
  [[ "$found_purpose" -eq 1 ]] || return 1
  [[ "$found_implementation" -eq 1 ]] || return 1

  return 0
}

# ------------------------------------------------------------------------------
# Public / Infrastructure API
# ------------------------------------------------------------------------------

phoenix::validator_exists() {
  local validator_id="${1:-}"

  [[ -n "$validator_id" ]] || return 1

  _phoenix::validator_registry_index_of "$validator_id" >/dev/null
}

phoenix::validator_register() {
  local validator_id="${1:-}"
  local validator_definition="${2:-}"

  if [[ -z "$validator_id" ]]; then
    printf '%s\n' \
      "phoenix::validator_register: validator id is required" >&2
    return 1
  fi

  if [[ -z "$validator_definition" ]]; then
    printf '%s\n' \
      "phoenix::validator_register: validator definition is required" >&2
    return 1
  fi

  if phoenix::validator_exists "$validator_id"; then
    printf '%s\n' \
      "phoenix::validator_register: validator already registered: $validator_id" >&2
    return 1
  fi

  if ! _phoenix::validator_definition_validate \
      "$validator_id" \
      "$validator_definition"; then
    printf '%s\n' \
      "phoenix::validator_register: invalid validator definition: $validator_id" >&2
    return 1
  fi

  PHOENIX_VALIDATOR_REGISTRY_IDS+=("$validator_id")
  PHOENIX_VALIDATOR_REGISTRY_DEFINITIONS+=("$validator_definition")

  return 0
}

phoenix::validator_resolve() {
  local validator_id="${1:-}"
  local validator_index

  [[ -n "$validator_id" ]] || return 1

  validator_index="$(
    _phoenix::validator_registry_index_of "$validator_id"
  )" || return 1

  printf '%s\n' \
    "${PHOENIX_VALIDATOR_REGISTRY_DEFINITIONS[$validator_index]}"

  return 0
}

phoenix::validator_list() {
  local validator_id

  for validator_id in "${PHOENIX_VALIDATOR_REGISTRY_IDS[@]}"; do
    printf '%s\n' "$validator_id"
  done

  return 0
}
