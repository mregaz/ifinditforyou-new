#!/usr/bin/env bash

# ==============================================================================
# PHOENIX DEVKIT — STRUCTURE VALIDATOR
# ==============================================================================
#
# Purpose:
# Validate the canonical Phoenix DevKit structural requirements.
#
# Responsibilities:
# - Validate explicit target existence
# - Validate target directory type
# - Validate required DevKit file and directories
# - Return deterministic fail-fast internal validation results
#
# Non-responsibilities:
# - Public result serialization
# - Registry operations
# - Filesystem mutation
# - Naming validation
# - Documentation content validation
# - Dependency validation
# - Standards validation
#
# ==============================================================================

if [[ -n "${PHOENIX_VALIDATOR_STRUCTURE_LOADED:-}" ]]; then
  return 0 2>/dev/null || exit 0
fi

PHOENIX_VALIDATOR_STRUCTURE_LOADED=1

phoenix::validator_structure() {
  local target="${1:-}"

  if [[ ! -e "$target" ]]; then
    printf 'RESULT=INVALID\n'
    printf 'CHECK=target-exists\n'
    printf 'MESSAGE=Validation target does not exist\n'
    return 0
  fi

  if [[ ! -d "$target" ]]; then
    printf 'RESULT=INVALID\n'
    printf 'CHECK=target-directory\n'
    printf 'MESSAGE=Validation target is not a directory\n'
    return 0
  fi

  if [[ ! -f "${target}/README.md" ]]; then
    printf 'RESULT=INVALID\n'
    printf 'CHECK=required-readme\n'
    printf 'MESSAGE=Required file README.md is missing\n'
    return 0
  fi

  if [[ ! -d "${target}/00_FOUNDATION" ]]; then
    printf 'RESULT=INVALID\n'
    printf 'CHECK=required-foundation-directory\n'
    printf 'MESSAGE=Required directory 00_FOUNDATION is missing\n'
    return 0
  fi

  if [[ ! -d "${target}/01_ARCHITECTURE" ]]; then
    printf 'RESULT=INVALID\n'
    printf 'CHECK=required-architecture-directory\n'
    printf 'MESSAGE=Required directory 01_ARCHITECTURE is missing\n'
    return 0
  fi

  if [[ ! -d "${target}/03_GENERATORS" ]]; then
    printf 'RESULT=INVALID\n'
    printf 'CHECK=required-generators-directory\n'
    printf 'MESSAGE=Required directory 03_GENERATORS is missing\n'
    return 0
  fi

  if [[ ! -d "${target}/07_TESTS" ]]; then
    printf 'RESULT=INVALID\n'
    printf 'CHECK=required-tests-directory\n'
    printf 'MESSAGE=Required directory 07_TESTS is missing\n'
    return 0
  fi

  printf 'RESULT=VALID\n'
  return 0
}
