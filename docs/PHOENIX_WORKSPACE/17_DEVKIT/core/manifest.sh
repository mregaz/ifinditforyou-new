#!/usr/bin/env bash

# ==============================================================================
# Phoenix DevKit — Manifest Module
# ==============================================================================
# Purpose:
#   Provide deterministic, read-only access to Phoenix manifest metadata.
#
# Status:
#   Development
# ==============================================================================

# ------------------------------------------------------------------------------
# Load Guard
# ------------------------------------------------------------------------------

if [[ -n "${PHOENIX_MANIFEST_LOADED:-}" ]]; then
    return 0
fi

readonly PHOENIX_MANIFEST_LOADED=1

# ------------------------------------------------------------------------------
# Dependencies
# ------------------------------------------------------------------------------

readonly PHOENIX_MANIFEST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

source "${PHOENIX_MANIFEST_DIR}/filesystem.sh"
source "${PHOENIX_MANIFEST_DIR}/strings.sh"

# ------------------------------------------------------------------------------
# Private Functions
# ------------------------------------------------------------------------------

# No private functions defined.
# ------------------------------------------------------------------------------
# Public API
# ------------------------------------------------------------------------------

phoenix::manifest_exists() {
    local manifest_path="${1:-}"

    [[ -n "$manifest_path" ]] || return 1

    phoenix::is_file "$manifest_path"
}

phoenix::manifest_get() {
    local manifest_path="${1:-}"
    local requested_key="${2:-}"
    local line
    local parsed_key
    local parsed_value

    phoenix::manifest_exists "$manifest_path" || return 1

    requested_key="$(phoenix::trim "$requested_key")"
    [[ -n "$requested_key" ]] || return 1

    while IFS= read -r line || [[ -n "$line" ]]; do
        [[ -n "$(phoenix::trim "$line")" ]] || continue

        if [[ "$(phoenix::trim_left "$line")" == \#* ]]; then
            continue
        fi

        [[ "$line" == *"="* ]] || continue

        parsed_key="${line%%=*}"
        parsed_value="${line#*=}"

        parsed_key="$(phoenix::trim "$parsed_key")"
        parsed_value="$(phoenix::trim "$parsed_value")"

        [[ -n "$parsed_key" ]] || continue

        if [[ "$parsed_key" == "$requested_key" ]]; then
            printf '%s' "$parsed_value"
            return 0
        fi
    done < "$manifest_path"

    return 1
}

phoenix::manifest_has() {
    local manifest_path="${1:-}"
    local requested_key="${2:-}"

    phoenix::manifest_get "$manifest_path" "$requested_key" >/dev/null
}
