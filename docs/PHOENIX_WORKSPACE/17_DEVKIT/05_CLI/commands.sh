#!/usr/bin/env bash

# ==============================================================================
# PHOENIX DEVKIT — CLI COMMANDS
# ==============================================================================
#
# Version: 1.0
#
# Purpose:
#   Implement approved CLI command handlers and public API delegation.
#
# Responsibilities:
#   - Present root help
#   - Present CLI version
#
# Non-responsibilities:
#   - CLI parsing
#   - Generator semantics
#   - Validator semantics
#   - Process termination
#
# ==============================================================================

# ------------------------------------------------------------------------------
# Load Guard
# ------------------------------------------------------------------------------

if [[ -n "${PHOENIX_CLI_COMMANDS_LOADED:-}" ]]; then
  return 0
fi

PHOENIX_CLI_COMMANDS_LOADED=1

# ------------------------------------------------------------------------------
# Internal Command Handlers
# ------------------------------------------------------------------------------

_phoenix::cli_command_help() {
  local scope="${1:-root}"

  case "$scope" in
    root)
      cat <<'EOF'
Phoenix CLI

Usage:
  phoenix
  phoenix help
  phoenix --help
  phoenix --version
  phoenix generate ...
  phoenix validate ...

Commands:
  generate    Run Phoenix Generator capabilities
  validate    Run Phoenix Validator capabilities
  help        Show CLI help

Global options:
  --help      Show CLI help
  --version   Show CLI version
EOF
      return 0
      ;;

    generate)
      cat <<'EOF'
Phoenix CLI — Generate

Usage:
  phoenix generate --help
  phoenix generate --list
  phoenix generate <generator-id> <destination> [KEY=VALUE ...] [--dry-run] [--overwrite]

Options:
  --help       Show Generate help
  --list       List registered Generators
  --dry-run    Plan generation without producing artifacts
  --overwrite  Request overwrite behavior

Examples:
  phoenix generate provider ./target PROVIDER_NAME=anibis COUNTRY=CH
  phoenix generate provider ./target PROVIDER_NAME=anibis COUNTRY=CH --dry-run
EOF
      return 0
      ;;

    validate)
      cat <<'EOF'
Phoenix CLI — Validate

Usage:
  phoenix validate --help
  phoenix validate --list
  phoenix validate <validator-id> <target>

Options:
  --help       Show Validate help
  --list       List registered Validators

Examples:
  phoenix validate structure ./target
  phoenix validate naming ./target
EOF
      return 0
      ;;

        *)
      return 1
      ;;
  esac
}

_phoenix::cli_command_version() {
  local version="${PHOENIX_CLI_VERSION:-}"

  [[ -n "$version" ]] || return 1

  printf 'Phoenix CLI %s\n' "$version"
  return 0
}

_phoenix::cli_command_generate_list() {
  phoenix::generator_list
  }

  _phoenix::cli_command_generate() {
  local request="${1:-}"

  [[ -n "$request" ]] || return 1

  local generator_id=""
  local destination=""
  local dry_run=0
  local overwrite=0
  local line

  local -a arguments=()
  local -a generator_request=()

  while IFS= read -r line; do
    case "$line" in
      GENERATOR=*)
        generator_id="${line#GENERATOR=}"
        ;;

      DESTINATION=*)
        destination="${line#DESTINATION=}"
        ;;

      ARGUMENT=*)
        arguments+=("${line#ARGUMENT=}")
        ;;

      DRY_RUN=1)
        dry_run=1
        ;;

      OVERWRITE=1)
        overwrite=1
        ;;
    esac
  done <<< "$request"

  [[ -n "$generator_id" ]] || return 1
  [[ -n "$destination" ]] || return 1

  generator_request=(
    "$generator_id"
    "$destination"
  )

  if [[ "${#arguments[@]}" -gt 0 ]]; then
    generator_request+=("${arguments[@]}")
  fi

  if [[ "$dry_run" -eq 1 ]]; then
    generator_request+=("PHOENIX_DRY_RUN=1")
  fi

  if [[ "$overwrite" -eq 1 ]]; then
    generator_request+=("PHOENIX_OVERWRITE=1")
  fi

  local generator_result

    generator_result="$(
    phoenix::generator_run "${generator_request[@]}"
  )" || {
    printf 'phoenix: Generator execution failed\n' >&2
    return 1
  }

  printf '%s\n' "$generator_result"
  return 0
}

_phoenix::cli_command_validate_list() {
  phoenix::validator_list
}
_phoenix::cli_command_validate() {
  local request="${1:-}"

  [[ -n "$request" ]] || return 1

  local validator_id=""
  local target=""
  local line
  local validator_result
  local validator_status

  while IFS= read -r line; do
    case "$line" in
      VALIDATOR=*)
        validator_id="${line#VALIDATOR=}"
        ;;

      TARGET=*)
        target="${line#TARGET=}"
        ;;
    esac
  done <<< "$request"

  [[ -n "$validator_id" ]] || return 1
  [[ -n "$target" ]] || return 1

  validator_result="$(
    phoenix::validator_run "$validator_id" "$target"
  )"

  validator_status="$(
    printf '%s\n' "$validator_result" |
      sed -n 's/^STATUS=//p' |
      head -n 1
  )"

  case "$validator_status" in
    VALID)
      printf '%s\n' "$validator_result"
      return 0
      ;;

    INVALID)
      printf '%s\n' "$validator_result"
      return 6
      ;;

    ERROR)
      printf '%s\n' "$validator_result" >&2
      return 1
      ;;

    *)
      printf 'phoenix: unexpected Validator result contract\n' >&2
      return 1
      ;;
  esac
}