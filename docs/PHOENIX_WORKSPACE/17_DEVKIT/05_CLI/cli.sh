#!/usr/bin/env bash

# ==============================================================================
# PHOENIX DEVKIT — CLI LIFECYCLE
# ==============================================================================
#
# Version: 1.0
#
# Purpose:
#   Coordinate parsing, command dispatch, presentation, and canonical status.
#
# Responsibilities:
#   - Load reusable CLI modules
#   - Execute the reusable CLI lifecycle
#   - Preserve canonical return semantics
#
# Non-responsibilities:
#   - Process termination
#   - Generator business logic
#   - Validator business logic
#
# ==============================================================================

# ------------------------------------------------------------------------------
# Load Guard
# ------------------------------------------------------------------------------

if [[ -n "${PHOENIX_CLI_LOADED:-}" ]]; then
  return 0
fi

PHOENIX_CLI_LOADED=1

# ------------------------------------------------------------------------------
# Module Paths
# ------------------------------------------------------------------------------

PHOENIX_CLI_DIR="$(
  cd "$(dirname "${BASH_SOURCE[0]}")" && pwd
)"
PHOENIX_CLI_DEVKIT_ROOT="$(
  cd "${PHOENIX_CLI_DIR}/.." && pwd
)"
# ------------------------------------------------------------------------------
# Metadata
# ------------------------------------------------------------------------------

PHOENIX_CLI_VERSION="1.0"

PHOENIX_CLI_GENERATOR_BOOTSTRAPPED=0
PHOENIX_CLI_GENERATOR_EXECUTION_BOOTSTRAPPED=0
PHOENIX_CLI_VALIDATOR_BOOTSTRAPPED=0
PHOENIX_CLI_VALIDATOR_EXECUTION_BOOTSTRAPPED=0

# ------------------------------------------------------------------------------
# Dependencies
# ------------------------------------------------------------------------------

source "${PHOENIX_CLI_DIR}/parsing.sh"
source "${PHOENIX_CLI_DIR}/commands.sh"

# ------------------------------------------------------------------------------
# Generator Bootstrap
# ------------------------------------------------------------------------------

_phoenix::cli_bootstrap_generator() {
  if [[ "${PHOENIX_CLI_GENERATOR_BOOTSTRAPPED:-0}" -eq 1 ]]; then
    return 0
  fi

  source "${PHOENIX_CLI_DEVKIT_ROOT}/03_GENERATORS/builtins.sh" || {
    printf 'phoenix: failed to load Generator Framework\n' >&2
    return 1
  }

  phoenix::generator_register_builtins || {
    printf 'phoenix: failed to register built-in Generators\n' >&2
    return 1
  }

  PHOENIX_CLI_GENERATOR_BOOTSTRAPPED=1
  return 0
}

# ------------------------------------------------------------------------------
# Generator Execution Bootstrap
# ------------------------------------------------------------------------------

_phoenix::cli_bootstrap_generator_execution() {
  if [[ "${PHOENIX_CLI_GENERATOR_EXECUTION_BOOTSTRAPPED:-0}" -eq 1 ]]; then
    return 0
  fi

  _phoenix::cli_bootstrap_generator || return 1

  source "${PHOENIX_CLI_DEVKIT_ROOT}/03_GENERATORS/execution.sh" || {
    printf 'phoenix: failed to load Generator Execution Framework\n' >&2
    return 1
  }

  declare -F phoenix::generator_run >/dev/null 2>&1 || {
    printf 'phoenix: Generator execution API is unavailable\n' >&2
    return 1
  }

  PHOENIX_CLI_GENERATOR_EXECUTION_BOOTSTRAPPED=1
  return 0
}

# ------------------------------------------------------------------------------
# Validator Bootstrap
# ------------------------------------------------------------------------------

_phoenix::cli_bootstrap_validator() {
  if [[ "${PHOENIX_CLI_VALIDATOR_BOOTSTRAPPED:-0}" -eq 1 ]]; then
    return 0
  fi

  source "${PHOENIX_CLI_DEVKIT_ROOT}/04_VALIDATORS/builtins.sh" || {
    printf 'phoenix: failed to load Validation Framework\n' >&2
    return 1
  }

  phoenix::validator_register_builtins || {
    printf 'phoenix: failed to register built-in Validators\n' >&2
    return 1
  }

  declare -F phoenix::validator_list >/dev/null 2>&1 || {
    printf 'phoenix: Validator list API is unavailable\n' >&2
    return 1
  }

  PHOENIX_CLI_VALIDATOR_BOOTSTRAPPED=1
  return 0
}

# ------------------------------------------------------------------------------
# Validator Execution Bootstrap
# ------------------------------------------------------------------------------

_phoenix::cli_bootstrap_validator_execution() {
  if [[ "${PHOENIX_CLI_VALIDATOR_EXECUTION_BOOTSTRAPPED:-0}" -eq 1 ]]; then
    return 0
  fi

  _phoenix::cli_bootstrap_validator || return 1

  source "${PHOENIX_CLI_DEVKIT_ROOT}/04_VALIDATORS/execution.sh" || {
    printf 'phoenix: failed to load Validator Execution Framework\n' >&2
    return 1
  }

  source "${PHOENIX_CLI_DEVKIT_ROOT}/04_VALIDATORS/implementations/structure.sh" || {
    printf 'phoenix: failed to load Structure Validator implementation\n' >&2
    return 1
  }

  source "${PHOENIX_CLI_DEVKIT_ROOT}/04_VALIDATORS/implementations/naming.sh" || {
    printf 'phoenix: failed to load Naming Validator implementation\n' >&2
    return 1
  }

  source "${PHOENIX_CLI_DEVKIT_ROOT}/04_VALIDATORS/implementations/documentation.sh" || {
    printf 'phoenix: failed to load Documentation Validator implementation\n' >&2
    return 1
  }

  source "${PHOENIX_CLI_DEVKIT_ROOT}/04_VALIDATORS/implementations/dependencies.sh" || {
    printf 'phoenix: failed to load Dependencies Validator implementation\n' >&2
    return 1
  }

  source "${PHOENIX_CLI_DEVKIT_ROOT}/04_VALIDATORS/implementations/standards.sh" || {
    printf 'phoenix: failed to load Standards Validator implementation\n' >&2
    return 1
  }

  declare -F phoenix::validator_run >/dev/null 2>&1 || {
    printf 'phoenix: Validator execution API is unavailable\n' >&2
    return 1
  }

  PHOENIX_CLI_VALIDATOR_EXECUTION_BOOTSTRAPPED=1
  return 0
}
phoenix::cli_run() {
  local parsed_request
  local action

  parsed_request="$(
    _phoenix::cli_parse "$@"
  )" || {
    printf 'phoenix: invalid command or arguments\n' >&2
    return 2
  }

  action="$(
    printf '%s\n' "$parsed_request" |
      sed -n 's/^ACTION=//p' |
      head -n 1
  )"

  case "$action" in
    ROOT_HELP)
      _phoenix::cli_command_help root
      return $?
      ;;

    VERSION)
      _phoenix::cli_command_version
      return $?
      ;;

    GENERATE_HELP)
      _phoenix::cli_command_help generate
      return $?
      ;;

    VALIDATE_HELP)
      _phoenix::cli_command_help validate
      return $?
      ;;

    GENERATE_LIST)
  _phoenix::cli_bootstrap_generator || return 1
  _phoenix::cli_command_generate_list
  return $?
    ;;

    GENERATE_RUN)
  _phoenix::cli_bootstrap_generator_execution || return 1
  _phoenix::cli_command_generate "$parsed_request"
  return $?
  ;;

    VALIDATE_LIST)
  _phoenix::cli_bootstrap_validator || return 1
  _phoenix::cli_command_validate_list
  return $?
  ;;

    VALIDATE_RUN)
  _phoenix::cli_bootstrap_validator_execution || return 1
  _phoenix::cli_command_validate "$parsed_request"
  return $?
  ;;

    *)
      printf 'phoenix: internal CLI action error\n' >&2
      return 1
      ;;
  esac
}
