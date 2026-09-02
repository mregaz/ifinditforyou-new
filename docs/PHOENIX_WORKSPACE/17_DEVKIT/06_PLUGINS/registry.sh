#!/usr/bin/env bash

# ==============================================================================
# PHOENIX DEVKIT — PLUGIN REGISTRY
# ==============================================================================
#
# Purpose:
#   Maintain the explicit in-memory registry of Phoenix Plugin Definitions.
#
# Responsibilities:
#   - Check whether a Plugin is registered
#   - Resolve a Plugin ID to its exact accepted Plugin Definition
#   - List registered Plugin IDs in deterministic insertion order
#   - Provide the public registration boundary
#   - Enforce the private compatibility gate before registry mutation
# Non-responsibilities:
#   - Plugin Definition grammar implementation
#   - Lower-layer capability semantic authority
#   - Contribution application
#   - Plugin execution
#   - Filesystem discovery
#   - Generic Plugin loading
#   - CLI handling
#
# P9-I01 NOTE:
#   Registration is intentionally fail-closed until the Definition Engine
#   provides _phoenix::plugin_definition_validate.
#
# ==============================================================================

# ------------------------------------------------------------------------------
# Load Guard
# ------------------------------------------------------------------------------

if [[ -n "${PHOENIX_PLUGIN_REGISTRY_LOADED:-}" ]]; then
  return 0 2>/dev/null || exit 0
fi

PHOENIX_PLUGIN_REGISTRY_LOADED=1

# ------------------------------------------------------------------------------
# Controlled Module Dependencies
# ------------------------------------------------------------------------------

_PHOENIX_PLUGIN_REGISTRY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${_PHOENIX_PLUGIN_REGISTRY_DIR}/definition.sh"

# ------------------------------------------------------------------------------
# Registry State
# ------------------------------------------------------------------------------

# Indexed arrays preserve compatibility with Bash 3.2.
PHOENIX_PLUGIN_REGISTRY_IDS=()
PHOENIX_PLUGIN_REGISTRY_DEFINITIONS=()

# ------------------------------------------------------------------------------
# Internal Helpers
# ------------------------------------------------------------------------------

_phoenix::plugin_registry_index_of() {
  local plugin_id="${1:-}"
  local index

  [[ -n "$plugin_id" ]] || return 1

  for ((index = 0; index < ${#PHOENIX_PLUGIN_REGISTRY_IDS[@]}; index++)); do
    if [[ "${PHOENIX_PLUGIN_REGISTRY_IDS[$index]}" == "$plugin_id" ]]; then
      printf '%s\n' "$index"
      return 0
    fi
  done

  return 1
}
# ------------------------------------------------------------------------------
# Compatibility Helpers
# ------------------------------------------------------------------------------

_phoenix::plugin_capability_is_authorized() {
  local layer="${1:-}"
  local capability="${2:-}"

  [[ -n "$layer" ]] || return 1
  [[ -n "$capability" ]] || return 1

  case "${layer}:${capability}" in
    GENERATOR:register|VALIDATOR:register)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

_phoenix::plugin_required_dependencies_satisfied() {
  local definition="${1:-}"
  local line
  local dependency
  local requirement
  local remainder
  local layer
  local capability

  [[ -n "$definition" ]] || return 1

  while IFS= read -r line; do
    case "$line" in
      DEPENDENCY=*)
        dependency="${line#DEPENDENCY=}"
        requirement="${dependency%%:*}"
        remainder="${dependency#*:}"
        layer="${remainder%%:*}"
        capability="${remainder#*:}"

        if [[ "$requirement" == "REQUIRED" ]]; then
          _phoenix::plugin_capability_is_authorized \
            "$layer" \
            "$capability" || return 1
        fi
        ;;
    esac
  done <<< "$definition"

  return 0
}

_phoenix::plugin_compatibility_check() {
  local definition="${1:-}"

  [[ -n "$definition" ]] || return 1

  _phoenix::plugin_required_dependencies_satisfied "$definition"
}
# ------------------------------------------------------------------------------
# Public Registry API
# ------------------------------------------------------------------------------

phoenix::plugin_exists() {
  local plugin_id="${1:-}"

  [[ -n "$plugin_id" ]] || return 1

  _phoenix::plugin_registry_index_of "$plugin_id" >/dev/null
}

phoenix::plugin_register() {
  local plugin_id="${1:-}"
  local plugin_definition="${2:-}"

  if [[ -z "$plugin_id" ]]; then
    printf '%s\n' \
      "phoenix::plugin_register: plugin id is required" >&2
    return 1
  fi

  if [[ -z "$plugin_definition" ]]; then
    printf '%s\n' \
      "phoenix::plugin_register: plugin definition is required" >&2
    return 1
  fi

  if phoenix::plugin_exists "$plugin_id"; then
    printf '%s\n' \
      "phoenix::plugin_register: plugin already registered: $plugin_id" >&2
    return 1
  fi

  if ! _phoenix::plugin_definition_validate \
      "$plugin_id" \
      "$plugin_definition"; then
    printf '%s\n' \
      "phoenix::plugin_register: invalid plugin definition: $plugin_id" >&2
    return 1
  fi

  if ! _phoenix::plugin_compatibility_check \
      "$plugin_definition"; then
    printf '%s\n' \
      "phoenix::plugin_register: incompatible plugin definition: $plugin_id" >&2
    return 1
  fi
  PHOENIX_PLUGIN_REGISTRY_IDS+=("$plugin_id")
  PHOENIX_PLUGIN_REGISTRY_DEFINITIONS+=("$plugin_definition")

  return 0
}

phoenix::plugin_resolve() {
  local plugin_id="${1:-}"
  local plugin_index

  [[ -n "$plugin_id" ]] || return 1

  plugin_index="$(
    _phoenix::plugin_registry_index_of "$plugin_id"
  )" || return 1

  printf '%s\n' \
    "${PHOENIX_PLUGIN_REGISTRY_DEFINITIONS[$plugin_index]}"

  return 0
}

phoenix::plugin_list() {
  local plugin_id

  for plugin_id in "${PHOENIX_PLUGIN_REGISTRY_IDS[@]}"; do
    printf '%s\n' "$plugin_id"
  done

  return 0
}
