#!/usr/bin/env bash

# ==============================================================================
# Phoenix DevKit
# Module: Core Runtime
# File: core/runtime.sh
#
# Purpose:
# Provides foundational runtime services used by the Phoenix DevKit Core Engine.
#
# Status:
# Initial implementation
# ==============================================================================

if [[ -n "${PHOENIX_RUNTIME_LOADED:-}" ]]; then
  return 0
fi

readonly PHOENIX_RUNTIME_LOADED=1

# ==============================================================================
# Readonly Constants
# ==============================================================================


# ==============================================================================
# Private Functions
# ==============================================================================


# ==============================================================================
# Public API
# ==============================================================================

# ------------------------------------------------------------------------------
# phoenix::runtime_info
#
# Prints the Phoenix DevKit Runtime version.
#
# Arguments:
#   None
#
# Returns:
#   0
# ------------------------------------------------------------------------------

phoenix::runtime_info() {
  printf '%s\n' "Phoenix DevKit Runtime v0.1"
}

# ------------------------------------------------------------------------------
# phoenix::is_command_available
#
# Checks whether a command exists in the current environment.
#
# Arguments:
#   $1 - Command name
#
# Returns:
#   0 if available
#   1 if unavailable or empty
# ------------------------------------------------------------------------------

phoenix::is_command_available() {
  local command_name="${1:-}"

  [[ -n "$command_name" ]] || return 1

  command -v "$command_name" >/dev/null 2>&1
}

# ------------------------------------------------------------------------------
# phoenix::require_command
#
# Verifies that a required command is available.
#
# Arguments:
#   $1 - Command name
#
# Returns:
#   0 if available
#   1 if missing or empty
# ------------------------------------------------------------------------------

phoenix::require_command() {
  local command_name="${1:-}"

  if [[ -z "$command_name" ]]; then
    printf '%s\n' "[Phoenix Runtime] Missing command name." >&2
    return 1
  fi

  if phoenix::is_command_available "$command_name"; then
    return 0
  fi

  printf '%s\n' "[Phoenix Runtime] Missing required command: $command_name" >&2
  return 1
}

# ------------------------------------------------------------------------------
# phoenix::fail
#
# Prints a runtime error message.
#
# Arguments:
#   $1 - Error message
#
# Returns:
#   1
# ------------------------------------------------------------------------------

phoenix::fail() {
  local message="${1:-}"

  if [[ -z "$message" ]]; then
    message="Unknown runtime error."
  fi

  printf '%s\n' "[Phoenix Runtime] $message" >&2
  return 1
}