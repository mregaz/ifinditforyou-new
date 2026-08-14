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

source "${PHOENIX_VALIDATOR_BUILTINS_DIR}/registry.sh"
source "${PHOENIX_VALIDATOR_BUILTINS_DEVKIT_ROOT}/core/filesystem.sh"

phoenix::validator_register_builtins() {
  local structure_definition_path
  local structure_definition

  structure_definition_path="${PHOENIX_VALIDATOR_BUILTINS_DIR}/definitions/structure.definition"

  phoenix::is_file "$structure_definition_path" || return 1

  structure_definition="$(
    phoenix::read_file "$structure_definition_path"
  )" || return 1

  phoenix::validator_register \
    "structure" \
    "$structure_definition"
}
