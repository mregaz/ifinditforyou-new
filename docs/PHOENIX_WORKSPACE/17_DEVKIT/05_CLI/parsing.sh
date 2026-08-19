#!/usr/bin/env bash

# ==============================================================================
# PHOENIX DEVKIT — CLI PARSING
# ==============================================================================
#
# Version: 1.0
#
# Purpose:
#   Parse Phoenix CLI grammar into inert normalized request data.
#
# Responsibilities:
#   - Recognize root CLI operations
#   - Reject unknown root commands
#   - Preserve original argv boundaries
#
# Non-responsibilities:
#   - Generator semantics
#   - Validator semantics
#   - Subsystem bootstrap
#   - Command execution
#   - Filesystem mutation
#   - Process termination
#
# ==============================================================================

# ------------------------------------------------------------------------------
# Load Guard
# ------------------------------------------------------------------------------

if [[ -n "${PHOENIX_CLI_PARSING_LOADED:-}" ]]; then
  return 0
fi

PHOENIX_CLI_PARSING_LOADED=1

# ------------------------------------------------------------------------------
# Internal API
# ------------------------------------------------------------------------------

_phoenix::cli_parse_generate() {
  if [[ "$#" -eq 1 ]]; then
    case "${1:-}" in
      --help)
        printf 'ACTION=GENERATE_HELP\n'
        return 0
        ;;
      --list)
        printf 'ACTION=GENERATE_LIST\n'
        return 0
        ;;
    esac
  fi

  [[ "$#" -ge 2 ]] || return 2

  local generator_id="${1:-}"
  local destination="${2:-}"

  [[ -n "$generator_id" ]] || return 2
  [[ -n "$destination" ]] || return 2

  shift 2

  local argument
  local dry_run_seen=0
  local overwrite_seen=0

  printf 'ACTION=GENERATE_RUN\n'
  printf 'GENERATOR=%s\n' "$generator_id"
  printf 'DESTINATION=%s\n' "$destination"

  for argument in "$@"; do
    case "$argument" in
      --dry-run)
        [[ "$dry_run_seen" -eq 0 ]] || return 2
        dry_run_seen=1
        printf 'DRY_RUN=1\n'
        ;;

      --overwrite)
        [[ "$overwrite_seen" -eq 0 ]] || return 2
        overwrite_seen=1
        printf 'OVERWRITE=1\n'
        ;;

      --*)
        return 2
        ;;

      *=*)
        [[ -n "${argument%%=*}" ]] || return 2
        printf 'ARGUMENT=%s\n' "$argument"
        ;;

      *)
        return 2
        ;;
    esac
  done

  return 0
}

_phoenix::cli_parse_validate() {
  if [[ "$#" -eq 1 ]]; then
    case "${1:-}" in
      --help)
        printf 'ACTION=VALIDATE_HELP\n'
        return 0
        ;;
      --list)
        printf 'ACTION=VALIDATE_LIST\n'
        return 0
        ;;
    esac
  fi

  [[ "$#" -eq 2 ]] || return 2

  local validator_id="${1:-}"
  local target="${2:-}"

  [[ -n "$validator_id" ]] || return 2
  [[ -n "$target" ]] || return 2

  printf 'ACTION=VALIDATE_RUN\n'
  printf 'VALIDATOR=%s\n' "$validator_id"
  printf 'TARGET=%s\n' "$target"

  return 0
}

_phoenix::cli_parse_root() {
  if [[ "$#" -eq 0 ]]; then
    printf 'ACTION=ROOT_HELP\n'
    return 0
  fi

  case "${1:-}" in
    help|--help)
      [[ "$#" -eq 1 ]] || return 2
      printf 'ACTION=ROOT_HELP\n'
      return 0
      ;;

    --version)
      [[ "$#" -eq 1 ]] || return 2
      printf 'ACTION=VERSION\n'
      return 0
      ;;

    generate)
      shift
      _phoenix::cli_parse_generate "$@"
      return $?
      ;;

    validate)
      shift
      _phoenix::cli_parse_validate "$@"
      return $?
      ;;

    *)
      return 2
      ;;
  esac
}

_phoenix::cli_parse() {
  _phoenix::cli_parse_root "$@"
}