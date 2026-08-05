#!/usr/bin/env bash

# ==============================================================================
# PHOENIX DEVKIT — GENERATOR REGISTRY
# ==============================================================================
#
# Purpose:
#   Maintain the explicit registry of Phoenix Generator Definitions.
#
# Responsibilities:
#   - Register Generator Definitions
#   - Check whether a generator exists
#   - Resolve a generator ID to its Generator Definition
#   - List registered generator IDs
#
# Non-responsibilities:
#   - Generator execution
#   - Rendering
#   - Filesystem mutation
#   - Template processing
#   - CLI handling
#
# ==============================================================================


# ------------------------------------------------------------------------------
# Load Guard
# ------------------------------------------------------------------------------

if [[ -n "${PHOENIX_GENERATOR_REGISTRY_LOADED:-}" ]]; then
  return 0 2>/dev/null || exit 0
fi

PHOENIX_GENERATOR_REGISTRY_LOADED=1


# ------------------------------------------------------------------------------
# Registry State
# ------------------------------------------------------------------------------

# Indexed arrays preserve compatibility with Bash 3.2.

PHOENIX_GENERATOR_REGISTRY_IDS=()
PHOENIX_GENERATOR_REGISTRY_DEFINITIONS=()


# ------------------------------------------------------------------------------
# Internal Helpers
# ------------------------------------------------------------------------------

_phoenix::generator_registry_index_of() {
  local generator_id="${1:-}"
  local index

  for ((index = 0; index < ${#PHOENIX_GENERATOR_REGISTRY_IDS[@]}; index++)); do
    if [[ "${PHOENIX_GENERATOR_REGISTRY_IDS[$index]}" == "$generator_id" ]]; then
      printf '%s\n' "$index"
      return 0
    fi
  done

  return 1
}


_phoenix::generator_definition_validate() {
  local expected_id="${1:-}"
  local definition="${2:-}"

  local line
  local value
  local template_source
  local artifact_mapping

  local found_id=0
  local found_purpose=0
  local found_template_map=0
  local found_required_variables=0
  local found_destination_rule=0
  local found_overwrite_policy=0

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

      TEMPLATE_MAP=*)
        value="${line#TEMPLATE_MAP=}"

        case "$value" in
          *'=>'*)
            template_source="${value%%=>*}"
            artifact_mapping="${value#*=>}"
            ;;
          *)
            return 1
            ;;
        esac

        [[ -n "$template_source" ]] || return 1
        [[ -n "$artifact_mapping" ]] || return 1

        case "$artifact_mapping" in
          /*)
            return 1
            ;;
        esac

        case "/$artifact_mapping/" in
          *"/../"*)
            return 1
            ;;
        esac

        found_template_map=1
        ;;

      REQUIRED_VARIABLES=*)
        found_required_variables=1
        ;;

      DESTINATION_RULE=*)
        value="${line#DESTINATION_RULE=}"

        [[ -n "$value" ]] || return 1
        found_destination_rule=1
        ;;

      OVERWRITE_POLICY=*)
        value="${line#OVERWRITE_POLICY=}"

        case "$value" in
          0|1)
            ;;
          *)
            return 1
            ;;
        esac

        found_overwrite_policy=1
        ;;

    esac
  done <<< "$definition"

  [[ "$found_id" -eq 1 ]] || return 1
  [[ "$found_purpose" -eq 1 ]] || return 1
  [[ "$found_template_map" -eq 1 ]] || return 1
  [[ "$found_required_variables" -eq 1 ]] || return 1
  [[ "$found_destination_rule" -eq 1 ]] || return 1
  [[ "$found_overwrite_policy" -eq 1 ]] || return 1

  return 0
}


# ------------------------------------------------------------------------------
# Public Registry API
# ------------------------------------------------------------------------------

phoenix::generator_exists() {
  local generator_id="${1:-}"

  [[ -n "$generator_id" ]] || return 1

  _phoenix::generator_registry_index_of "$generator_id" >/dev/null
}


phoenix::generator_register() {
  local generator_id="${1:-}"
  local generator_definition="${2:-}"

  if [[ -z "$generator_id" ]]; then
    printf '%s\n' \
      "phoenix::generator_register: generator id is required" >&2
    return 1
  fi

  if [[ -z "$generator_definition" ]]; then
    printf '%s\n' \
      "phoenix::generator_register: generator definition is required" >&2
    return 1
  fi

  if phoenix::generator_exists "$generator_id"; then
    printf '%s\n' \
      "phoenix::generator_register: generator already registered: $generator_id" >&2
    return 1
  fi

  if ! _phoenix::generator_definition_validate \
      "$generator_id" \
      "$generator_definition"; then
    printf '%s\n' \
      "phoenix::generator_register: invalid generator definition: $generator_id" >&2
    return 1
  fi

  PHOENIX_GENERATOR_REGISTRY_IDS+=("$generator_id")
  PHOENIX_GENERATOR_REGISTRY_DEFINITIONS+=("$generator_definition")

  return 0
}


phoenix::generator_resolve() {
  local generator_id="${1:-}"
  local generator_index

  [[ -n "$generator_id" ]] || return 1

  generator_index="$(
    _phoenix::generator_registry_index_of "$generator_id"
  )" || return 1

  printf '%s\n' \
    "${PHOENIX_GENERATOR_REGISTRY_DEFINITIONS[$generator_index]}"

  return 0
}


phoenix::generator_list() {
  local generator_id

  for generator_id in "${PHOENIX_GENERATOR_REGISTRY_IDS[@]}"; do
    printf '%s\n' "$generator_id"
  done

  return 0
}
