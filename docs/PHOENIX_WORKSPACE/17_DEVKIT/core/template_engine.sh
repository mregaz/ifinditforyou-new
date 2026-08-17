#!/usr/bin/env bash

# ==============================================================================
# Phoenix DevKit — Template Engine
# ==============================================================================
# Purpose:
#   Provide deterministic and secure text-template rendering using explicit
#   Phoenix placeholders and caller-provided variables.
#
# Status:
#   Development
# ==============================================================================

# ------------------------------------------------------------------------------
# Load Guard
# ------------------------------------------------------------------------------

if [[ -n "${PHOENIX_TEMPLATE_ENGINE_LOADED:-}" ]]; then
    return 0
fi

readonly PHOENIX_TEMPLATE_ENGINE_LOADED=1

# ------------------------------------------------------------------------------
# Readonly Constants
# ------------------------------------------------------------------------------

readonly PHOENIX_TEMPLATE_ENGINE_DIR="$(
    cd "$(dirname "${BASH_SOURCE[0]}")" && pwd
)"

# ------------------------------------------------------------------------------
# Dependencies
# ------------------------------------------------------------------------------

source "${PHOENIX_TEMPLATE_ENGINE_DIR}/filesystem.sh"
source "${PHOENIX_TEMPLATE_ENGINE_DIR}/strings.sh"

# ------------------------------------------------------------------------------
# Private Functions
# ------------------------------------------------------------------------------

_phoenix::template_variable_name_is_valid() {
    local variable_name="${1:-}"

    [[ "$variable_name" =~ ^[A-Z][A-Z0-9_]*$ ]]
}

_phoenix::template_assignment_get() {
    local requested_name="${1:-}"
    shift || return 1

    local assignment
    local variable_name
    local variable_value

    for assignment in "$@"; do
        [[ "$assignment" == *"="* ]] || return 1

        variable_name="${assignment%%=*}"
        variable_value="${assignment#*=}"

        _phoenix::template_variable_name_is_valid "$variable_name" || return 1

        if [[ "$variable_name" == "$requested_name" ]]; then
            printf '%s' "$variable_value"
            return 0
        fi
    done

    return 1
}

_phoenix::template_assignments_are_valid() {
    local assignment
    local variable_name

    for assignment in "$@"; do
        [[ "$assignment" == *"="* ]] || return 1

        variable_name="${assignment%%=*}"

        _phoenix::template_variable_name_is_valid "$variable_name" || return 1
    done

    return 0
}

# ------------------------------------------------------------------------------
# Public API
# ------------------------------------------------------------------------------

phoenix::template_has_placeholders() {
    local template_content="${1:-}"

    [[ "$template_content" =~ \{\{[A-Z][A-Z0-9_]*\}\} ]]
}

phoenix::template_render() {
    local template_content="${1:-}"
    shift || true

    local -a assignments=("$@")
    local remaining="$template_content"
    local rendered=""
    local placeholder
    local variable_name
    local variable_value
    local prefix

    _phoenix::template_assignments_are_valid "${assignments[@]}" || return 1

    while [[ "$remaining" =~ \{\{[A-Z][A-Z0-9_]*\}\} ]]; do
        placeholder="${BASH_REMATCH[0]}"
        variable_name="${placeholder:2:${#placeholder}-4}"

        variable_value="$(
            _phoenix::template_assignment_get \
                "$variable_name" \
                "${assignments[@]}"
        )" || return 1

        prefix="${remaining%%"$placeholder"*}"

        rendered+="$prefix"
        rendered+="$variable_value"

        remaining="${remaining#*"$placeholder"}"
    done

    rendered+="$remaining"

    printf '%s' "$rendered"
}

phoenix::template_render_file() {
    local template_path="${1:-}"
    local destination_path="${2:-}"

    [[ -n "$template_path" ]] || return 1
    [[ -n "$destination_path" ]] || return 1

    shift 2 || return 1

    phoenix::is_file "$template_path" || return 1

    local template_content
    local rendered_content

    template_content="$(phoenix::read_file "$template_path")" || return 1

    rendered_content="$(
        phoenix::template_render \
            "$template_content" \
            "$@"
    )" || return 1

    phoenix::write_file "$destination_path" "$rendered_content"
}


