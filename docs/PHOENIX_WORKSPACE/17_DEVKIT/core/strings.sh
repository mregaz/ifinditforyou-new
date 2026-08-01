#!/usr/bin/env bash

# ==============================================================================
# Phoenix DevKit
# Module: Core Strings
# File: core/strings.sh
#
# Purpose:
# Provides deterministic and reusable string manipulation services.
#
# Status:
# Development
# ==============================================================================

# ==============================================================================
# Load Guard
# ==============================================================================

if [[ -n "${PHOENIX_STRINGS_LOADED:-}" ]]; then
  return 0
fi

readonly PHOENIX_STRINGS_LOADED=1

# ==============================================================================
# Readonly Constants
# ==============================================================================

# No readonly constants defined.

# ==============================================================================
# Private Functions
# ==============================================================================

# No private functions defined.

# ==============================================================================
# Public API
# ==============================================================================

# ------------------------------------------------------------------------------
# phoenix::trim
#
# Removes leading and trailing whitespace.
#
# Arguments:
#   $1 - Input string
#
# Returns:
#   0 - Success
# ------------------------------------------------------------------------------

phoenix::trim() {
  local value="${1:-}"

  printf '%s' "$value" |
    sed 's/^[[:space:]]*//;s/[[:space:]]*$//'
}

# ------------------------------------------------------------------------------
# phoenix::trim_left
#
# Removes leading whitespace.
#
# Arguments:
#   $1 - Input string
#
# Returns:
#   0 - Success
# ------------------------------------------------------------------------------

phoenix::trim_left() {
  local value="${1:-}"

  printf '%s' "$value" |
    sed 's/^[[:space:]]*//'
}

# ------------------------------------------------------------------------------
# phoenix::trim_right
#
# Removes trailing whitespace.
#
# Arguments:
#   $1 - Input string
#
# Returns:
#   0 - Success
# ------------------------------------------------------------------------------

phoenix::trim_right() {
  local value="${1:-}"

  printf '%s' "$value" |
    sed 's/[[:space:]]*$//'
}

# ------------------------------------------------------------------------------
# phoenix::to_upper
#
# Converts a string to uppercase.
#
# Arguments:
#   $1 - Input string
#
# Returns:
#   0 - Success
# ------------------------------------------------------------------------------

phoenix::to_upper() {
  local value="${1:-}"

  printf '%s' "$value" |
    tr '[:lower:]' '[:upper:]'
}

# ------------------------------------------------------------------------------
# phoenix::to_lower
#
# Converts a string to lowercase.
#
# Arguments:
#   $1 - Input string
#
# Returns:
#   0 - Success
# ------------------------------------------------------------------------------

phoenix::to_lower() {
  local value="${1:-}"

  printf '%s' "$value" |
    tr '[:upper:]' '[:lower:]'
}

# ------------------------------------------------------------------------------
# phoenix::contains
#
# Checks whether a string contains a substring.
#
# Arguments:
#   $1 - Input string
#   $2 - Substring
#
# Returns:
#   0 - Condition satisfied
#   1 - Condition not satisfied
# ------------------------------------------------------------------------------

phoenix::contains() {
  local value="${1:-}"
  local substring="${2:-}"

  [[ "$value" == *"$substring"* ]]
}

# ------------------------------------------------------------------------------
# phoenix::starts_with
#
# Checks whether a string starts with a prefix.
#
# Arguments:
#   $1 - Input string
#   $2 - Prefix
#
# Returns:
#   0 - Condition satisfied
#   1 - Condition not satisfied
# ------------------------------------------------------------------------------

phoenix::starts_with() {
  local value="${1:-}"
  local prefix="${2:-}"

  [[ "$value" == "$prefix"* ]]
}

# ------------------------------------------------------------------------------
# phoenix::ends_with
#
# Checks whether a string ends with a suffix.
#
# Arguments:
#   $1 - Input string
#   $2 - Suffix
#
# Returns:
#   0 - Condition satisfied
#   1 - Condition not satisfied
# ------------------------------------------------------------------------------

phoenix::ends_with() {
  local value="${1:-}"
  local suffix="${2:-}"

  [[ "$value" == *"$suffix" ]]
}

# ------------------------------------------------------------------------------
# phoenix::replace
#
# Replaces all occurrences of a substring.
#
# Arguments:
#   $1 - Input string
#   $2 - Search string
#   $3 - Replacement string
#
# Returns:
#   0 - Success
# ------------------------------------------------------------------------------

phoenix::replace() {
  local value="${1:-}"
  local search="${2:-}"
  local replacement="${3:-}"

  printf '%s' "${value//"$search"/$replacement}"
}

# ------------------------------------------------------------------------------
# phoenix::is_empty
#
# Checks whether a string is empty.
#
# Arguments:
#   $1 - Input string
#
# Returns:
#   0 - Condition satisfied
#   1 - Condition not satisfied
# ------------------------------------------------------------------------------

phoenix::is_empty() {
  local value="${1:-}"

  [[ -z "$value" ]]
}

# ------------------------------------------------------------------------------
# phoenix::is_blank
#
# Checks whether a string is empty or contains only whitespace.
#
# Arguments:
#   $1 - Input string
#
# Returns:
#   0 - Condition satisfied
#   1 - Condition not satisfied
# ------------------------------------------------------------------------------

phoenix::is_blank() {
  local value="${1:-}"

  [[ "$value" =~ ^[[:space:]]*$ ]]
}

# ------------------------------------------------------------------------------
# phoenix::slugify
#
# Converts a string into a lowercase hyphen-separated slug.
#
# Arguments:
#   $1 - Input string
#
# Returns:
#   0 - Success
# ------------------------------------------------------------------------------

phoenix::slugify() {
  local value="${1:-}"

  printf '%s' "$value" |
    tr '[:upper:]' '[:lower:]' |
    sed 's/[^[:alnum:]]\{1,\}/-/g; s/^-//; s/-$//'
}