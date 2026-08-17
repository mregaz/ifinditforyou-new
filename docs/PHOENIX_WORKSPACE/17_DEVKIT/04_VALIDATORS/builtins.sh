#!/usr/bin/env bash

# ==============================================================================
# PHOENIX DEVKIT — BUILT-IN VALIDATORS
# ==============================================================================
#
# Purpose:
# Register the official built-in Phoenix Validator Definitions.
#
# Responsibilities:
# - Read built-in Validator Definitions as inert data
# - Register built-in validators explicitly
#
# Non-responsibilities:
# - Validator discovery
# - Directory scanning
# - Validation execution
# - Target inspection
# - Filesystem mutation
# - CLI handling
#
# ==============================================================================

if [[ -n "${PHOENIX_VALIDATOR_BUILTINS_LOADED:-}" ]]; then
  return 0 2>/dev/null || exit 0
fi

PHOENIX_VALIDATOR_BUILTINS_LOADED=1

PHOENIX_VALIDATOR_BUILTINS_DIR="$(
  cd "$(dirname "${BASH_SOURCE[0]}")" && pwd
)"

PHOENIX_VALIDATOR_BUILTINS_DEVKIT_ROOT="$(
  cd "${PHOENIX_VALIDATOR_BUILTINS_DIR}/.." && pwd
)"

# ------------------------------------------------------------------------------
# Dependencies
# ------------------------------------------------------------------------------
source "${PHOENIX_VALIDATOR_BUILTINS_DIR}/registry.sh"
source "${PHOENIX_VALIDATOR_BUILTINS_DEVKIT_ROOT}/core/filesystem.sh"

phoenix::validator_register_builtins() {
  local structure_definition_path
  local structure_definition

  local naming_definition_path
  local naming_definition

  local documentation_definition_path
  local documentation_definition

  local dependencies_definition_path
  local dependencies_definition
  local standards_definition_path
  local standards_definition

  structure_definition_path="${PHOENIX_VALIDATOR_BUILTINS_DIR}/definitions/structure.definition"
  naming_definition_path="${PHOENIX_VALIDATOR_BUILTINS_DIR}/definitions/naming.definition"
  documentation_definition_path="${PHOENIX_VALIDATOR_BUILTINS_DIR}/definitions/documentation.definition"
  dependencies_definition_path="${PHOENIX_VALIDATOR_BUILTINS_DIR}/definitions/dependencies.definition"
  standards_definition_path="${PHOENIX_VALIDATOR_BUILTINS_DIR}/definitions/standards.definition"

  phoenix::is_file "$structure_definition_path" || return 1
  phoenix::is_file "$naming_definition_path" || return 1
  phoenix::is_file "$documentation_definition_path" || return 1
  phoenix::is_file "$dependencies_definition_path" || return 1
  phoenix::is_file "$standards_definition_path" || return 1

  structure_definition="$(
    phoenix::read_file "$structure_definition_path"
  )" || return 1

  naming_definition="$(
    phoenix::read_file "$naming_definition_path"
  )" || return 1

  documentation_definition="$(
    phoenix::read_file "$documentation_definition_path"
  )" || return 1

  dependencies_definition="$(
    phoenix::read_file "$dependencies_definition_path"
  )" || return 1

standards_definition="$(
  phoenix::read_file "$standards_definition_path"
)" || return 1 

  phoenix::validator_register \
    "structure" \
    "$structure_definition" || return 1

  phoenix::validator_register \
    "naming" \
    "$naming_definition" || return 1

phoenix::validator_register \
  "documentation" \
  "$documentation_definition" || return 1

phoenix::validator_register \
  "dependencies" \
  "$dependencies_definition" || return 1

phoenix::validator_register \
  "standards" \
  "$standards_definition"
}