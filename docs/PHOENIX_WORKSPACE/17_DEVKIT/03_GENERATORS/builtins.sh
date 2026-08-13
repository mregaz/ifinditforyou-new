#!/usr/bin/env bash

# ==============================================================================
# PHOENIX DEVKIT — BUILT-IN GENERATORS
# ==============================================================================
#
# Purpose:
# Register the official built-in Phoenix Generator Definitions.
#
# Responsibilities:
# - Read built-in Generator Definitions as inert data
# - Register built-in generators explicitly
#
# Non-responsibilities:
# - Generator discovery
# - Directory scanning
# - Planning
# - Rendering
# - Execution
# - Filesystem mutation
#
# ==============================================================================

# ------------------------------------------------------------------------------
# Load Guard
# ------------------------------------------------------------------------------

if [[ -n "${PHOENIX_GENERATOR_BUILTINS_LOADED:-}" ]]; then
    return 0 2>/dev/null || exit 0
fi

PHOENIX_GENERATOR_BUILTINS_LOADED=1

# ------------------------------------------------------------------------------
# Module Paths
# ------------------------------------------------------------------------------

PHOENIX_GENERATOR_BUILTINS_DIR="$(
    cd "$(dirname "${BASH_SOURCE[0]}")" && pwd
)"

PHOENIX_GENERATOR_BUILTINS_DEVKIT_ROOT="$(
    cd "${PHOENIX_GENERATOR_BUILTINS_DIR}/.." && pwd
)"

# ------------------------------------------------------------------------------
# Dependencies
# ------------------------------------------------------------------------------

source "${PHOENIX_GENERATOR_BUILTINS_DIR}/registry.sh"
source "${PHOENIX_GENERATOR_BUILTINS_DEVKIT_ROOT}/core/filesystem.sh"

# ------------------------------------------------------------------------------
# Public API
# ------------------------------------------------------------------------------

phoenix::generator_register_builtins() {
    local provider_definition_path
    local provider_definition
    local adr_definition_path
    local adr_definition
    local sprint_definition_path
    local sprint_definition

    provider_definition_path="${PHOENIX_GENERATOR_BUILTINS_DIR}/definitions/provider.definition"
    adr_definition_path="${PHOENIX_GENERATOR_BUILTINS_DIR}/definitions/adr.definition"
    sprint_definition_path="${PHOENIX_GENERATOR_BUILTINS_DIR}/definitions/sprint.definition"

    phoenix::is_file "$provider_definition_path" || return 1
    phoenix::is_file "$adr_definition_path" || return 1
    phoenix::is_file "$sprint_definition_path" || return 1

    provider_definition="$(
        phoenix::read_file "$provider_definition_path"
    )" || return 1

    adr_definition="$(
        phoenix::read_file "$adr_definition_path"
    )" || return 1

    sprint_definition="$(
        phoenix::read_file "$sprint_definition_path"
    )" || return 1

    phoenix::generator_register \
        "provider" \
        "$provider_definition" || return 1

    phoenix::generator_register \
        "adr" \
        "$adr_definition" || return 1

    phoenix::generator_register \
        "sprint" \
        "$sprint_definition"
}
