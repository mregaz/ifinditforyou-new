#!/usr/bin/env bash

set -u

# ==============================================================================
# PHOENIX DEVKIT — CLI PARSING TESTS
# ==============================================================================
#
# Purpose:
# Validate the Phoenix CLI parsing contract independently from Generator and
# Validator execution.
#
# ==============================================================================

TESTS_PASSED=0
TESTS_FAILED=0

pass() {
  printf 'PASS: %s\n' "$1"
  TESTS_PASSED=$((TESTS_PASSED + 1))
}

fail() {
  printf 'FAIL: %s\n' "$1"
  TESTS_FAILED=$((TESTS_FAILED + 1))
}

assert_success() {
  local description="$1"
  shift

  if "$@" >/dev/null 2>&1; then
    pass "$description"
  else
    fail "$description"
  fi
}

assert_failure() {
  local description="$1"
  shift

  if "$@" >/dev/null 2>&1; then
    fail "$description"
  else
    pass "$description"
  fi
}

assert_equals() {
  local description="$1"
  local expected="$2"
  local actual="$3"

  if [[ "$expected" == "$actual" ]]; then
    pass "$description"
  else
    fail "$description"
    printf '  expected:\n%s\n' "$expected"
    printf '  actual:\n%s\n' "$actual"
  fi
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEVKIT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

source "${DEVKIT_ROOT}/05_CLI/parsing.sh"

# ------------------------------------------------------------------------------
# Root Parsing
# ------------------------------------------------------------------------------

root_result="$(
  _phoenix::cli_parse
)"

assert_equals \
  "empty CLI request resolves to root help" \
  "ACTION=ROOT_HELP" \
  "$root_result"

help_result="$(
  _phoenix::cli_parse help
)"

assert_equals \
  "help command resolves to root help" \
  "ACTION=ROOT_HELP" \
  "$help_result"

long_help_result="$(
  _phoenix::cli_parse --help
)"

assert_equals \
  "--help resolves to root help" \
  "ACTION=ROOT_HELP" \
  "$long_help_result"

version_result="$(
  _phoenix::cli_parse --version
)"

assert_equals \
  "--version resolves to version action" \
  "ACTION=VERSION" \
  "$version_result"

assert_failure \
  "unknown root command fails parsing" \
  _phoenix::cli_parse banana

# ------------------------------------------------------------------------------
# Generate Parsing
# ------------------------------------------------------------------------------

generate_help_result="$(
  _phoenix::cli_parse generate --help
)"

assert_equals \
  "generate --help resolves to Generate help" \
  "ACTION=GENERATE_HELP" \
  "$generate_help_result"

generate_list_result="$(
  _phoenix::cli_parse generate --list
)"

assert_equals \
  "generate --list resolves to Generate list" \
  "ACTION=GENERATE_LIST" \
  "$generate_list_result"

generate_result="$(
  _phoenix::cli_parse \
    generate \
    provider \
    ./target \
    PROVIDER_NAME=anibis \
    COUNTRY=CH
)"

expected_generate_result="$(cat <<'RESULT'
ACTION=GENERATE_RUN
GENERATOR=provider
DESTINATION=./target
ARGUMENT=PROVIDER_NAME=anibis
ARGUMENT=COUNTRY=CH
RESULT
)"

assert_equals \
  "generate request preserves canonical argument order" \
  "$expected_generate_result" \
  "$generate_result"

generate_dry_run_result="$(
  _phoenix::cli_parse \
    generate \
    provider \
    ./target \
    PROVIDER_NAME=anibis \
    COUNTRY=CH \
    --dry-run
)"

expected_generate_dry_run_result="$(cat <<'RESULT'
ACTION=GENERATE_RUN
GENERATOR=provider
DESTINATION=./target
ARGUMENT=PROVIDER_NAME=anibis
ARGUMENT=COUNTRY=CH
DRY_RUN=1
RESULT
)"

assert_equals \
  "generate --dry-run normalizes execution control" \
  "$expected_generate_dry_run_result" \
  "$generate_dry_run_result"

generate_overwrite_result="$(
  _phoenix::cli_parse \
    generate \
    provider \
    ./target \
    PROVIDER_NAME=anibis \
    COUNTRY=CH \
    --overwrite
)"

expected_generate_overwrite_result="$(cat <<'RESULT'
ACTION=GENERATE_RUN
GENERATOR=provider
DESTINATION=./target
ARGUMENT=PROVIDER_NAME=anibis
ARGUMENT=COUNTRY=CH
OVERWRITE=1
RESULT
)"

assert_equals \
  "generate --overwrite normalizes execution control" \
  "$expected_generate_overwrite_result" \
  "$generate_overwrite_result"

generate_both_result="$(
  _phoenix::cli_parse \
    generate \
    provider \
    ./target \
    PROVIDER_NAME=anibis \
    COUNTRY=CH \
    --dry-run \
    --overwrite
)"

expected_generate_both_result="$(cat <<'RESULT'
ACTION=GENERATE_RUN
GENERATOR=provider
DESTINATION=./target
ARGUMENT=PROVIDER_NAME=anibis
ARGUMENT=COUNTRY=CH
DRY_RUN=1
OVERWRITE=1
RESULT
)"

assert_equals \
  "generate preserves both execution controls" \
  "$expected_generate_both_result" \
  "$generate_both_result"

assert_failure \
  "generate without generator id fails parsing" \
  _phoenix::cli_parse generate

assert_failure \
  "generate without destination fails parsing" \
  _phoenix::cli_parse generate provider

assert_failure \
  "generate rejects unknown option" \
  _phoenix::cli_parse \
    generate \
    provider \
    ./target \
    --unknown

assert_failure \
  "generate rejects duplicate --dry-run" \
  _phoenix::cli_parse \
    generate \
    provider \
    ./target \
    --dry-run \
    --dry-run

assert_failure \
  "generate rejects duplicate --overwrite" \
  _phoenix::cli_parse \
    generate \
    provider \
    ./target \
    --overwrite \
    --overwrite

assert_failure \
  "generate rejects malformed template variable" \
  _phoenix::cli_parse \
    generate \
    provider \
    ./target \
    INVALID_ARGUMENT

# ------------------------------------------------------------------------------
# Validate Parsing
# ------------------------------------------------------------------------------

validate_help_result="$(
  _phoenix::cli_parse validate --help
)"

assert_equals \
  "validate --help resolves to Validate help" \
  "ACTION=VALIDATE_HELP" \
  "$validate_help_result"

validate_list_result="$(
  _phoenix::cli_parse validate --list
)"

assert_equals \
  "validate --list resolves to Validate list" \
  "ACTION=VALIDATE_LIST" \
  "$validate_list_result"

validate_result="$(
  _phoenix::cli_parse \
    validate \
    structure \
    ./target
)"

expected_validate_result="$(cat <<'RESULT'
ACTION=VALIDATE_RUN
VALIDATOR=structure
TARGET=./target
RESULT
)"

assert_equals \
  "validate request returns canonical request" \
  "$expected_validate_result" \
  "$validate_result"

assert_failure \
  "validate without validator id fails parsing" \
  _phoenix::cli_parse validate

assert_failure \
  "validate without target fails parsing" \
  _phoenix::cli_parse \
    validate \
    structure

assert_failure \
  "validate rejects extra positional argument" \
  _phoenix::cli_parse \
    validate \
    structure \
    ./target \
    extra

assert_failure \
  "validate rejects unknown option" \
  _phoenix::cli_parse \
    validate \
    structure \
    ./target \
    --unknown

# ------------------------------------------------------------------------------
# Security / Input Preservation
# ------------------------------------------------------------------------------

literal_result="$(
  _phoenix::cli_parse \
    generate \
    provider \
    ./target \
    'PROVIDER_NAME=$(touch /tmp/phoenix-cli-must-not-execute)'
)"

if [[ ! -e /tmp/phoenix-cli-must-not-execute ]]; then
  pass "parser does not execute command substitution from user input"
else
  fail "parser does not execute command substitution from user input"
  rm -f /tmp/phoenix-cli-must-not-execute
fi

expected_literal_result="$(cat <<'RESULT'
ACTION=GENERATE_RUN
GENERATOR=provider
DESTINATION=./target
ARGUMENT=PROVIDER_NAME=$(touch /tmp/phoenix-cli-must-not-execute)
RESULT
)"

assert_equals \
  "parser preserves template variable value literally" \
  "$expected_literal_result" \
  "$literal_result"

# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\n'
printf 'CLI Parsing Tests\n'
printf '=================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
