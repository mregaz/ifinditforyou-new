#!/usr/bin/env bash

# ==============================================================================
# Phoenix DevKit
# Module: Core Logger
# File: core/logger.sh
#
# Purpose:
# Provides centralized logging services for the Phoenix DevKit.
#
# Status:
# Initial implementation
# ==============================================================================

# ==============================================================================
# Load Guard
# ==============================================================================

if [[ -n "${PHOENIX_LOGGER_LOADED:-}" ]]; then
  return 0
fi

readonly PHOENIX_LOGGER_LOADED=1

# ==============================================================================
# Readonly Constants
# ==============================================================================
readonly PHOENIX_LOG_LEVEL_INFO="INFO"
readonly PHOENIX_LOG_LEVEL_OK="OK"
readonly PHOENIX_LOG_LEVEL_WARN="WARN"
readonly PHOENIX_LOG_LEVEL_ERROR="ERROR"
readonly PHOENIX_LOG_LEVEL_DEBUG="DEBUG"

readonly PHOENIX_LOG_DEST_STDOUT="stdout"
readonly PHOENIX_LOG_DEST_STDERR="stderr"

# ==============================================================================
# Private Functions
# ==============================================================================
# ------------------------------------------------------------------------------
# _phoenix::log
#
# Formats and writes a log message.
#
# Arguments:
#   $1 - Log level
#   $2 - Output destination: stdout or stderr
#   $3 - Message
#
# Returns:
#   0 on success
#   1 on invalid destination
# ------------------------------------------------------------------------------

_phoenix::log() {
  local level="${1:-}"
  local destination="${2:-}"
  local message="${3:-}"

  case "$destination" in
    stdout)
      printf '[%-5s] %s\n' "$level" "$message"
      ;;
    stderr)
      printf '[%-5s] %s\n' "$level" "$message" >&2
      ;;
    *)
      printf '%s\n' "[Phoenix Logger] Invalid output destination: $destination" >&2
      return 1
      ;;
  esac

  return 0
}

# ==============================================================================
# Public API
# ==============================================================================
# ------------------------------------------------------------------------------
# phoenix::log_info
#
# Writes an informational message to stdout.
#
# Arguments:
#   $1 - Message
#
# Returns:
#   0 on success
# ------------------------------------------------------------------------------

phoenix::log_info() {
    _phoenix::log \
        "$PHOENIX_LOG_LEVEL_INFO" \
        "$PHOENIX_LOG_DEST_STDOUT" \
        "${1:-}"
}
# ------------------------------------------------------------------------------
# phoenix::log_ok
#
# Writes a success message to stdout.
# ------------------------------------------------------------------------------

phoenix::log_ok() {
    _phoenix::log \
        "$PHOENIX_LOG_LEVEL_OK" \
        "$PHOENIX_LOG_DEST_STDOUT" \
        "${1:-}"
}
# ------------------------------------------------------------------------------
# phoenix::log_warn
#
# Writes a warning message to stderr.
# ------------------------------------------------------------------------------

phoenix::log_warn() {
    _phoenix::log \
        "$PHOENIX_LOG_LEVEL_WARN" \
        "$PHOENIX_LOG_DEST_STDERR" \
        "${1:-}"
}

# ------------------------------------------------------------------------------
# phoenix::log_error
#
# Writes an error message to stderr.
# ------------------------------------------------------------------------------

phoenix::log_error() {
    _phoenix::log \
        "$PHOENIX_LOG_LEVEL_ERROR" \
        "$PHOENIX_LOG_DEST_STDERR" \
        "${1:-}"
}

# ------------------------------------------------------------------------------
# phoenix::log_debug
#
# Writes a debug message to stdout.
# ------------------------------------------------------------------------------

phoenix::log_debug() {
    _phoenix::log \
        "$PHOENIX_LOG_LEVEL_DEBUG" \
        "$PHOENIX_LOG_DEST_STDOUT" \
        "${1:-}"
}

