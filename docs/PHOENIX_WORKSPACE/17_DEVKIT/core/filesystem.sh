#!/usr/bin/env bash

# ==============================================================================
# Phoenix DevKit
# Module: Core Filesystem
# File: core/filesystem.sh
#
# Purpose:
# Provides filesystem abstraction services for the Phoenix DevKit.
#
# Status:
# Initial implementation
# ==============================================================================

# ==============================================================================
# Load Guard
# ==============================================================================

if [[ -n "${PHOENIX_FILESYSTEM_LOADED:-}" ]]; then
    return 0
fi

readonly PHOENIX_FILESYSTEM_LOADED=1

# ==============================================================================
# Readonly Constants
# ==============================================================================

# (reserved)

# ==============================================================================
# Private Functions
# ==============================================================================

# (none)

# ==============================================================================
# Public API
# ------------------------------------------------------------------------------
# # ------------------------------------------------------------------------------
# phoenix::path_exists
#
# Checks whether a filesystem path exists.
#
# Arguments:
#   $1 - Path
#
# Returns:
#   0 if the path exists
#   1 otherwise
# ------------------------------------------------------------------------------

phoenix::path_exists() {
    local path="${1:-}"

    [[ -e "$path" ]]
}

# ------------------------------------------------------------------------------
# phoenix::is_file
#
# Checks whether a path is a regular file.
#
# Arguments:
#   $1 - Path
#
# Returns:
#   0 if the path is a regular file
#   1 otherwise
# ------------------------------------------------------------------------------

phoenix::is_file() {
    local path="${1:-}"

    [[ -f "$path" ]]
}
# ------------------------------------------------------------------------------
# phoenix::is_directory
#
# Checks whether a path is a directory.
#
# Arguments:
#   $1 - Path
#
# Returns:
#   0 if the path is a directory
#   1 otherwise
# ------------------------------------------------------------------------------

phoenix::is_directory() {
    local path="${1:-}"

    [[ -d "$path" ]]
}
# ------------------------------------------------------------------------------
# phoenix::create_directory
#
# Creates a directory if it does not already exist.
#
# Arguments:
#   $1 - Directory path
#
# Returns:
#   0 on success
#   1 on failure
# ------------------------------------------------------------------------------

phoenix::create_directory() {
    local path="${1:-}"

    mkdir -p "$path"
}
# ------------------------------------------------------------------------------
# # ------------------------------------------------------------------------------
# remove_directory
# ------------------------------------------------------------------------------
#
# Removes a directory recursively if it exists.
#
# Arguments:
#   $1 - Directory path
#
# Returns:
#   0 on success
#   1 on failure
# ------------------------------------------------------------------------------

phoenix::remove_directory() {
    local path="${1:-}"

    rm -rf "$path"
}
# ------------------------------------------------------------------------------
# phoenix::copy_file
#
# Copies a file.
#
# Arguments:
#   $1 - Source file
#   $2 - Destination file
#
# Returns:
#   0 on success
#   1 on failure
# ------------------------------------------------------------------------------

phoenix::copy_file() {
    local source="${1:-}"
    local destination="${2:-}"

    cp "$source" "$destination"
}
# ------------------------------------------------------------------------------
# phoenix::move_file
#
# Moves a file.
#
# Arguments:
#   $1 - Source file
#   $2 - Destination file
#
# Returns:
#   0 on success
#   1 on failure
# ------------------------------------------------------------------------------

phoenix::move_file() {
    local source="${1:-}"
    local destination="${2:-}"

    mv "$source" "$destination"
}
# ------------------------------------------------------------------------------
# phoenix::remove_file
#
# Removes a file if it exists.
#
# Arguments:
#   $1 - File path
#
# Returns:
#   0 on success
#   1 on failure
# ------------------------------------------------------------------------------

phoenix::remove_file() {
    local file="${1:-}"

    rm -f "$file"
}
# ------------------------------------------------------------------------------
# phoenix::read_file
#
# Reads a file and writes its content to standard output.
#
# Arguments:
#   $1 - File path
#
# Returns:
#   0 - Success
#   1 - Failure
# ------------------------------------------------------------------------------

phoenix::read_file() {
    local file="${1:-}"

    cat "$file"
}
# ------------------------------------------------------------------------------
# phoenix::write_file
#
# Writes content to a file.
#
# Arguments:
#   $1 - File path
#   $2 - File content
#
# Returns:
#   0 - Success
#   1 - Failure
# ------------------------------------------------------------------------------

phoenix::write_file() {
    local file="${1:-}"
    local content="${2:-}"

    printf '%s' "$content" > "$file"
}