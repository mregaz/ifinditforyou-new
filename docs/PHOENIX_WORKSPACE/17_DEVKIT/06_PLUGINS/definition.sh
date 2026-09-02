#!/usr/bin/env bash

# ==============================================================================
# PHOENIX DEVKIT — PLUGIN DEFINITION ENGINE
# ==============================================================================
#
# Purpose:
#   Validate inert Phoenix Plugin Definitions against the frozen v1.0 grammar.
#
# Definition grammar:
#   KEY=VALUE
#
# Required fields:
#   ID=<plugin-id>
#   CONTRACT_VERSION=1.0
#   CONTRIBUTION=<type>:<target-id>     (one or more)
#
# Optional fields:
#   DEPENDENCY=<requirement>:<layer>:<capability>   (repeatable)
#   PURPOSE=<descriptive-text>                      (zero or one)
#
# Security:
#   Definitions are inert data. This module does not evaluate, source, execute,
#   expand, dispatch, discover, or interpret definition values as shell code.
#
# ==============================================================================

# ------------------------------------------------------------------------------
# Load Guard
# ------------------------------------------------------------------------------

if [[ -n "${PHOENIX_PLUGIN_DEFINITION_LOADED:-}" ]]; then
  return 0 2>/dev/null || exit 0
fi

PHOENIX_PLUGIN_DEFINITION_LOADED=1

# ------------------------------------------------------------------------------
# Internal Grammar Helpers
# ------------------------------------------------------------------------------

_phoenix::plugin_id_validate() {
  local LC_ALL=C
  local plugin_id="${1:-}"

  [[ -n "$plugin_id" ]] || return 1

  case "$plugin_id" in
    [a-z]*)
      ;;
    *)
      return 1
      ;;
  esac

  case "$plugin_id" in
    *[!a-z0-9-]*)
      return 1
      ;;
  esac

  case "$plugin_id" in
    *--*|-*|*-)
      return 1
      ;;
  esac

  return 0
}

_phoenix::plugin_contribution_validate() {
  local contribution="${1:-}"
  local contribution_type
  local target_id

  [[ -n "$contribution" ]] || return 1

  case "$contribution" in
    *:*)
      contribution_type="${contribution%%:*}"
      target_id="${contribution#*:}"
      ;;
    *)
      return 1
      ;;
  esac

  # Exactly one separator is permitted in v1.0.
  case "$target_id" in
    *:*)
      return 1
      ;;
  esac

  case "$contribution_type" in
    GENERATOR|VALIDATOR)
      ;;
    *)
      return 1
      ;;
  esac

  _phoenix::plugin_id_validate "$target_id"
}

_phoenix::plugin_dependency_validate() {
  local dependency="${1:-}"
  local requirement
  local remainder
  local layer
  local capability

  [[ -n "$dependency" ]] || return 1

  case "$dependency" in
    *:*:*)
      requirement="${dependency%%:*}"
      remainder="${dependency#*:}"
      layer="${remainder%%:*}"
      capability="${remainder#*:}"
      ;;
    *)
      return 1
      ;;
  esac

  [[ -n "$requirement" ]] || return 1
  [[ -n "$layer" ]] || return 1
  [[ -n "$capability" ]] || return 1

  # Exactly two separators are permitted in v1.0.
  case "$capability" in
    *:*)
      return 1
      ;;
  esac

  case "$requirement" in
    REQUIRED|OPTIONAL)
      ;;
    *)
      return 1
      ;;
  esac

  case "$layer" in
    CORE|TEMPLATE|GENERATOR|VALIDATOR|ATLAS)
      ;;
    *)
      return 1
      ;;
  esac

  return 0
}

# ------------------------------------------------------------------------------
# Frozen Definition Validator
# ------------------------------------------------------------------------------

_phoenix::plugin_definition_validate() {
  local expected_id="${1:-}"
  local definition="${2:-}"
  local line
  local key
  local value
  local found_id=0
  local found_contract_version=0
  local found_contribution=0
  local found_purpose=0

  [[ -n "$expected_id" ]] || return 1
  [[ -n "$definition" ]] || return 1

  _phoenix::plugin_id_validate "$expected_id" || return 1

  while IFS= read -r line; do
    [[ -n "$line" ]] || return 1

    case "$line" in
      *=*)
        key="${line%%=*}"
        value="${line#*=}"
        ;;
      *)
        return 1
        ;;
    esac

    [[ -n "$key" ]] || return 1

    case "$key" in
      [A-Z]*)
        ;;
      *)
        return 1
        ;;
    esac

    case "$key" in
      *[!A-Z0-9_]*)
        return 1
        ;;
    esac

    case "$key" in
      ID)
        [[ "$found_id" -eq 0 ]] || return 1
        [[ -n "$value" ]] || return 1
        _phoenix::plugin_id_validate "$value" || return 1
        [[ "$value" == "$expected_id" ]] || return 1
        found_id=1
        ;;

      CONTRACT_VERSION)
        [[ "$found_contract_version" -eq 0 ]] || return 1
        [[ "$value" == "1.0" ]] || return 1
        found_contract_version=1
        ;;

      CONTRIBUTION)
        [[ -n "$value" ]] || return 1
        _phoenix::plugin_contribution_validate "$value" || return 1
        found_contribution=$((found_contribution + 1))
        ;;

      DEPENDENCY)
        [[ -n "$value" ]] || return 1
        _phoenix::plugin_dependency_validate "$value" || return 1
        ;;

      PURPOSE)
        [[ "$found_purpose" -eq 0 ]] || return 1
        [[ -n "$value" ]] || return 1
        found_purpose=1
        ;;

      *)
        return 1
        ;;
    esac
  done <<< "$definition"

  [[ "$found_id" -eq 1 ]] || return 1
  [[ "$found_contract_version" -eq 1 ]] || return 1
  [[ "$found_contribution" -ge 1 ]] || return 1

  return 0
}
