#!/usr/bin/env bash

# ==============================================================================
# PHOENIX DEVKIT — PLUGIN BOOTSTRAP
# ==============================================================================
#
# Purpose:
#   Provide private Plugin workflow orchestration.
#
# Responsibilities:
#   - Coordinate Plugin preflight, registration, and contribution application
#   - Preserve the canonical Phase 9 workflow order
#
# Non-responsibilities:
#   - Public Plugin API
#   - Filesystem discovery
#   - Lower-layer semantic authority
#   - Cross-registry rollback
#
# ==============================================================================

if [[ -n "${PHOENIX_PLUGIN_BOOTSTRAP_LOADED:-}" ]]; then
  return 0 2>/dev/null || exit 0
fi
PHOENIX_PLUGIN_BOOTSTRAP_LOADED=1

_phoenix::plugin_bootstrap() {
  [[ "$#" -ge 2 ]] || return 1

  local plugin_id="$1"
  local plugin_definition="$2"
  shift 2

  _phoenix::plugin_contributions_preflight \
    "$plugin_id" \
    "$plugin_definition" \
    "$@" || return 1

  phoenix::plugin_register \
    "$plugin_id" \
    "$plugin_definition" || return 1

  _phoenix::plugin_contributions_apply \
    "$plugin_id" \
    "$plugin_definition" \
    "$@" || return 1

  return 0
}
