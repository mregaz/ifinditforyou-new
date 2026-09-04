#!/usr/bin/env bash

# ==============================================================================
# PHOENIX DEVKIT — PLUGIN CONTRIBUTIONS
# ==============================================================================
#
# Purpose:
#   Provide private Plugin contribution-coordination helpers.
#
# Responsibilities:
#   - Validate explicit transient Contribution Bindings
#   - Perform contribution preflight through approved public lower-layer APIs
#   - Apply validated contributions deterministically through approved public lower-layer registration APIs
#
# Non-responsibilities:
#   - Plugin Registry mutation
#   - Generator Definition semantics
#   - Validator Definition semantics
#   - Filesystem discovery
#   - Generic Plugin loading
#   - CLI handling
#
# Definitions supplied through this module are inert data.
#
# ==============================================================================

# ------------------------------------------------------------------------------
# Load Guard
# ------------------------------------------------------------------------------

if [[ -n "${PHOENIX_PLUGIN_CONTRIBUTIONS_LOADED:-}" ]]; then
  return 0 2>/dev/null || exit 0
fi

PHOENIX_PLUGIN_CONTRIBUTIONS_LOADED=1

# ------------------------------------------------------------------------------
# Controlled Module Dependencies
# ------------------------------------------------------------------------------

_PHOENIX_PLUGIN_CONTRIBUTIONS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "${_PHOENIX_PLUGIN_CONTRIBUTIONS_DIR}/definition.sh"

# ------------------------------------------------------------------------------
# Contribution Binding Validation
# ------------------------------------------------------------------------------

_phoenix::plugin_contribution_binding_validate() {
  local plugin_id="${1:-}"
  local contribution_type="${2:-}"
  local target_id="${3:-}"
  local target_definition="${4:-}"

  [[ -n "$plugin_id" ]] || return 1

  _phoenix::plugin_id_validate "$plugin_id" || return 1

  case "$contribution_type" in
    GENERATOR|VALIDATOR)
      ;;
    *)
      return 1
      ;;
  esac

  [[ -n "$target_id" ]] || return 1
  [[ -n "$target_definition" ]] || return 1

  _phoenix::plugin_contribution_validate \
    "${contribution_type}:${target_id}" || return 1

  return 0
}

# ------------------------------------------------------------------------------
# Contribution Binding Matching
# ------------------------------------------------------------------------------

_phoenix::plugin_contribution_binding_match_count() {
  local contribution_type="${1:-}"
  local target_id="${2:-}"
  shift 2

  local -a binding_types=()
  local -a binding_target_ids=()
  local argument
  local separator_seen=0
  local index
  local count=0

  [[ -n "$contribution_type" ]] || return 1
  [[ -n "$target_id" ]] || return 1

  for argument in "$@"; do
    if [[ "$argument" == "--" && "$separator_seen" -eq 0 ]]; then
      separator_seen=1
      continue
    fi

    if [[ "$separator_seen" -eq 0 ]]; then
      binding_types+=("$argument")
    else
      binding_target_ids+=("$argument")
    fi
  done

  [[ "$separator_seen" -eq 1 ]] || return 1

  [[ "${#binding_types[@]}" -eq "${#binding_target_ids[@]}" ]] || return 1

  for ((index = 0; index < ${#binding_types[@]}; index++)); do
    if [[ "${binding_types[$index]}" == "$contribution_type" ]] &&
       [[ "${binding_target_ids[$index]}" == "$target_id" ]]; then
      count=$((count + 1))
    fi
  done

  printf '%s\n' "$count"
  return 0
}

# ------------------------------------------------------------------------------
# Contribution Exact Binding Policy
# ------------------------------------------------------------------------------

_phoenix::plugin_contribution_binding_require_exact_one() {
  local contribution_type="${1:-}"
  local target_id="${2:-}"
  shift 2

  local count

  count="$(
    _phoenix::plugin_contribution_binding_match_count \
      "$contribution_type" \
      "$target_id" \
      "$@"
  )" || return 1

  [[ "$count" == "1" ]] || return 1

  return 0
}
# ------------------------------------------------------------------------------
# Whole Plugin Contribution Validation
# ------------------------------------------------------------------------------

_phoenix::plugin_contributions_validate() {
      [[ "$#" -ge 2 ]] || return 1
  local plugin_id="${1:-}"
  local plugin_definition="${2:-}"
  shift 2

  local -a binding_types=()
  local -a binding_target_ids=()
  local -a binding_definitions=()

  local -a declared_types=()
  local -a declared_target_ids=()

  local contribution_type
  local target_id
  local target_definition
  local line
  local value
  local index
  local candidate_index
  local match_count

  [[ -n "$plugin_id" ]] || return 1
  [[ -n "$plugin_definition" ]] || return 1

  _phoenix::plugin_definition_validate \
    "$plugin_id" \
    "$plugin_definition" || return 1

  [[ $(( $# % 3 )) -eq 0 ]] || return 1

  while [[ "$#" -gt 0 ]]; do
    contribution_type="$1"
    target_id="$2"
    target_definition="$3"
    shift 3

    _phoenix::plugin_contribution_binding_validate \
      "$plugin_id" \
      "$contribution_type" \
      "$target_id" \
      "$target_definition" || return 1

    binding_types+=("$contribution_type")
    binding_target_ids+=("$target_id")
    binding_definitions+=("$target_definition")
  done

  while IFS= read -r line; do
    case "$line" in
      CONTRIBUTION=*)
        value="${line#CONTRIBUTION=}"

        _phoenix::plugin_contribution_validate "$value" || return 1

        contribution_type="${value%%:*}"
        target_id="${value#*:}"

        declared_types+=("$contribution_type")
        declared_target_ids+=("$target_id")
        ;;
    esac
  done <<< "$plugin_definition"

  [[ "${#declared_types[@]}" -gt 0 ]] || return 1

  for ((index = 0; index < ${#declared_types[@]}; index++)); do
    match_count=0

    for ((candidate_index = 0; candidate_index < ${#binding_types[@]}; candidate_index++)); do
      if [[ "${binding_types[$candidate_index]}" == "${declared_types[$index]}" ]] &&
         [[ "${binding_target_ids[$candidate_index]}" == "${declared_target_ids[$index]}" ]]; then
        match_count=$((match_count + 1))
      fi
    done

    [[ "$match_count" -eq 1 ]] || return 1
  done

  for ((index = 0; index < ${#binding_types[@]}; index++)); do
    match_count=0

    for ((candidate_index = 0; candidate_index < ${#declared_types[@]}; candidate_index++)); do
      if [[ "${declared_types[$candidate_index]}" == "${binding_types[$index]}" ]] &&
         [[ "${declared_target_ids[$candidate_index]}" == "${binding_target_ids[$index]}" ]]; then
        match_count=$((match_count + 1))
      fi
    done

    [[ "$match_count" -eq 1 ]] || return 1
  done

  return 0
}
# ------------------------------------------------------------------------------
# Contribution Preflight
# ------------------------------------------------------------------------------

_phoenix::plugin_contributions_preflight() {
   [[ "$#" -ge 2 ]] || return 1

  local plugin_id="${1:-}"
  local plugin_definition="${2:-}"
  shift 2

  local -a binding_types=()
  local -a binding_target_ids=()
  local -a binding_definitions=()

  local contribution_type
  local target_id
  local target_definition

  if ! _phoenix::plugin_contributions_validate \
      "$plugin_id" \
      "$plugin_definition" \
      "$@"; then
    return 1
  fi
declare -F _phoenix::plugin_compatibility_check >/dev/null 2>&1 || return 1

_phoenix::plugin_compatibility_check \
  "$plugin_definition" || return 1

  while [[ "$#" -gt 0 ]]; do
    contribution_type="$1"
    target_id="$2"
    target_definition="$3"
    shift 3

    binding_types+=("$contribution_type")
    binding_target_ids+=("$target_id")
    binding_definitions+=("$target_definition")
  done

  local index

  for ((index = 0; index < ${#binding_types[@]}; index++)); do
    contribution_type="${binding_types[$index]}"
    target_id="${binding_target_ids[$index]}"

    case "$contribution_type" in
      GENERATOR)
        declare -F phoenix::generator_exists >/dev/null 2>&1 || return 1
        declare -F phoenix::generator_register >/dev/null 2>&1 || return 1

        if phoenix::generator_exists "$target_id"; then
          return 1
        fi
        ;;

      VALIDATOR)
        declare -F phoenix::validator_exists >/dev/null 2>&1 || return 1
        declare -F phoenix::validator_register >/dev/null 2>&1 || return 1

        if phoenix::validator_exists "$target_id"; then
          return 1
        fi
        ;;

      *)
        return 1
        ;;
    esac
  done

  return 0
}
_phoenix::plugin_contributions_apply() {
  [[ "$#" -ge 2 ]] || return 1

  local plugin_id="${1:-}"
  local plugin_definition="${2:-}"
  shift 2

  local -a binding_types=()
  local -a binding_target_ids=()
  local -a binding_definitions=()

  local contribution_type
  local target_id
  local target_definition
  local line
  local value
  local index

  _phoenix::plugin_contributions_preflight \
    "$plugin_id" \
    "$plugin_definition" \
    "$@" || return 1

  while [[ "$#" -gt 0 ]]; do
    contribution_type="$1"
    target_id="$2"
    target_definition="$3"
    shift 3

    binding_types+=("$contribution_type")
    binding_target_ids+=("$target_id")
    binding_definitions+=("$target_definition")
  done

  while IFS= read -r line; do
    [[ "$line" == CONTRIBUTION=* ]] || continue

    value="${line#CONTRIBUTION=}"
    contribution_type="${value%%:*}"
    target_id="${value#*:}"

    target_definition=""

    for ((index = 0; index < ${#binding_types[@]}; index++)); do
      if [[ "${binding_types[$index]}" == "$contribution_type" ]] &&
         [[ "${binding_target_ids[$index]}" == "$target_id" ]]; then
        target_definition="${binding_definitions[$index]}"
        break
      fi
    done

    [[ -n "$target_definition" ]] || return 1

    case "$contribution_type" in
      GENERATOR)
        phoenix::generator_register \
          "$target_id" \
          "$target_definition" || return 1
        ;;

      VALIDATOR)
        phoenix::validator_register \
          "$target_id" \
          "$target_definition" || return 1
        ;;

      *)
        return 1
        ;;
    esac
  done <<< "$plugin_definition"

  return 0
}
