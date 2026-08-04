#!/usr/bin/env bash

# ==============================================================================
# PHOENIX DEVKIT — GENERATOR REGISTRY
# ==============================================================================
#
# Purpose:
#   Maintain the registry of available Phoenix generators.
#
# Responsibilities:
#   - Register generator identifiers
#   - Check whether a generator exists
#   - Resolve a generator identifier to its handler function
#   - List registered generators
#
# Non-responsibilities:
#   - Generator execution
#   - Rendering
#   - Filesystem operations
#   - Template processing
#   - CLI handling
#
# Status:
#   Sprint G01 — Initial implementation
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
# Internal Registry State
# ------------------------------------------------------------------------------

# Parallel indexed arrays are used instead of associative arrays to preserve
# compatibility with Bash 3.2, which remains the default Bash version on many
# macOS installations.

PHOENIX_GENERATOR_REGISTRY_IDS=()
PHOENIX_GENERATOR_REGISTRY_HANDLERS=()


# ------------------------------------------------------------------------------
# Internal Functions
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


# ------------------------------------------------------------------------------
# Public API
# ------------------------------------------------------------------------------

phoenix::generator_exists() {
  local generator_id="${1:-}"

  if [[ -z "$generator_id" ]]; then
    return 1
  fi

  _phoenix::generator_registry_index_of "$generator_id" >/dev/null
}


phoenix::generator_register() {
  local generator_id="${1:-}"
  local generator_handler="${2:-}"

  if [[ -z "$generator_id" ]]; then
    printf '%s\n' \
      "phoenix::generator_register: generator id is required" >&2
    return 1
  fi

  if [[ -z "$generator_handler" ]]; then
    printf '%s\n' \
      "phoenix::generator_register: generator handler is required" >&2
    return 1
  fi

  if phoenix::generator_exists "$generator_id"; then
    printf '%s\n' \
      "phoenix::generator_register: generator already registered: $generator_id" >&2
    return 1
  fi

  PHOENIX_GENERATOR_REGISTRY_IDS+=("$generator_id")
  PHOENIX_GENERATOR_REGISTRY_HANDLERS+=("$generator_handler")

  return 0
}


phoenix::generator_resolve() {
  local generator_id="${1:-}"
  local generator_index

  if [[ -z "$generator_id" ]]; then
    return 1
  fi

  generator_index="$(
    _phoenix::generator_registry_index_of "$generator_id"
  )" || return 1

  printf '%s\n' \
    "${PHOENIX_GENERATOR_REGISTRY_HANDLERS[$generator_index]}"

  return 0
}


phoenix::generator_list() {
  local generator_id

  for generator_id in "${PHOENIX_GENERATOR_REGISTRY_IDS[@]}"; do
    printf '%s\n' "$generator_id"
  done

  return 0
}
