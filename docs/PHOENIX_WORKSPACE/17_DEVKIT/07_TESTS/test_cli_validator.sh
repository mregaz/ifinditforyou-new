#!/usr/bin/env bash

set -u

# ==============================================================================
# PHOENIX DEVKIT — CLI VALIDATOR TESTS
# ==============================================================================
#
# Purpose:
# Validate Validator capabilities exposed through the Phoenix CLI.
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

CLI="${DEVKIT_ROOT}/05_CLI/phoenix"
CLI_MODULE="${DEVKIT_ROOT}/05_CLI/cli.sh"

TEST_ROOT="$(
  mktemp -d "${TMPDIR:-/tmp}/phoenix-cli-validator.XXXXXX"
)" || exit 1

cleanup() {
  rm -rf "$TEST_ROOT"
}

trap cleanup EXIT

# ------------------------------------------------------------------------------
# Validator List
# ------------------------------------------------------------------------------

validator_list="$(
  "$CLI" validate --list
)"
validator_list_status=$?

expected_validator_list="$(cat <<'LIST'
structure
naming
documentation
dependencies
standards
LIST
)"

assert_equals \
  "validate --list returns success" \
  "0" \
  "$validator_list_status"

assert_equals \
  "validate --list preserves canonical Validator order" \
  "$expected_validator_list" \
  "$validator_list"

# ------------------------------------------------------------------------------
# VALID
# ------------------------------------------------------------------------------

valid_result="$(
  "$CLI" validate structure "$DEVKIT_ROOT"
)"
valid_status=$?

assert_equals \
  "VALID Validator result maps to exit 0" \
  "0" \
  "$valid_status"

if printf '%s\n' "$valid_result" | grep -q '^STATUS=VALID$'; then
  pass "VALID result exposes STATUS=VALID"
else
  fail "VALID result exposes STATUS=VALID"
fi

if printf '%s\n' "$valid_result" | grep -q '^VALIDATOR=structure$'; then
  pass "VALID result identifies structure Validator"
else
  fail "VALID result identifies structure Validator"
fi

# ------------------------------------------------------------------------------
# INVALID
# ------------------------------------------------------------------------------

INVALID_TARGET="${TEST_ROOT}/invalid"
mkdir -p "$INVALID_TARGET"

invalid_result="$(
  "$CLI" validate structure "$INVALID_TARGET"
)"
invalid_status=$?

assert_equals \
  "INVALID Validator result maps to exit 6" \
  "6" \
  "$invalid_status"

if printf '%s\n' "$invalid_result" | grep -q '^STATUS=INVALID$'; then
  pass "INVALID result exposes STATUS=INVALID"
else
  fail "INVALID result exposes STATUS=INVALID"
fi

if printf '%s\n' "$invalid_result" | grep -q '^CHECK=required-readme$'; then
  pass "INVALID structure result exposes failing check"
else
  fail "INVALID structure result exposes failing check"
fi

# ------------------------------------------------------------------------------
# Controlled ERROR
# ------------------------------------------------------------------------------

controlled_error_result="$(
  bash -c '
    source "$1"

    _phoenix::cli_bootstrap_validator_execution || exit 99

    phoenix::validator_test_cli_error() {
      printf "RESULT=ERROR\n"
      printf "MESSAGE=Controlled CLI validator error\n"
      return 0
    }

    test_definition="$(cat <<DEFINITION
ID=test-cli-error
PURPOSE=Controlled CLI ERROR mapping test
IMPLEMENTATION=phoenix::validator_test_cli_error
DEFINITION
)"

    phoenix::validator_register \
      "test-cli-error" \
      "$test_definition" || exit 98

    request="$(cat <<REQUEST
ACTION=VALIDATE_RUN
VALIDATOR=test-cli-error
TARGET=/tmp
REQUEST
)"

    _phoenix::cli_command_validate "$request"
  ' bash "$CLI_MODULE" 2>&1
)"
controlled_error_status=$?

assert_equals \
  "ERROR Validator result maps to exit 1" \
  "1" \
  "$controlled_error_status"

if printf '%s\n' "$controlled_error_result" | grep -q '^STATUS=ERROR$'; then
  pass "ERROR result exposes STATUS=ERROR"
else
  fail "ERROR result exposes STATUS=ERROR"
fi

if printf '%s\n' "$controlled_error_result" |
    grep -q '^MESSAGE=Controlled CLI validator error$'; then
  pass "ERROR result preserves Validator message"
else
  fail "ERROR result preserves Validator message"
fi

# ------------------------------------------------------------------------------
# Unknown Validator / Unexpected Contract
# ------------------------------------------------------------------------------

unknown_output="$(
  "$CLI" validate does-not-exist "$TEST_ROOT" 2>&1
)"
unknown_status=$?

assert_equals \
  "unknown Validator maps to technical failure exit 1" \
  "1" \
  "$unknown_status"

if printf '%s\n' "$unknown_output" |
    grep -q '^phoenix: unexpected Validator result contract$'; then
  pass "unknown Validator exposes controlled contract failure"
else
  fail "unknown Validator exposes controlled contract failure"
fi

# ------------------------------------------------------------------------------
# Repository Safety
# ------------------------------------------------------------------------------

if [[ ! -e "${DEVKIT_ROOT}/test-cli-error" ]]; then
  pass "controlled ERROR test creates no repository artifact"
else
  fail "controlled ERROR test creates no repository artifact"
fi

# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\n'
printf 'CLI Validator Tests\n'
printf '===================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
