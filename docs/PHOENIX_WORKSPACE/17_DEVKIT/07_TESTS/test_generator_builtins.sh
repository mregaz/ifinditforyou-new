#!/usr/bin/env bash

set -u

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

source "${DEVKIT_ROOT}/03_GENERATORS/builtins.sh"

PROVIDER_DEFINITION_PATH="${DEVKIT_ROOT}/03_GENERATORS/definitions/provider.definition"


# ------------------------------------------------------------------------------
# Definition file
# ------------------------------------------------------------------------------

if [[ -f "$PROVIDER_DEFINITION_PATH" ]]; then
  pass "provider definition exists"
else
  fail "provider definition exists"
fi


# ------------------------------------------------------------------------------
# Built-in registration
# ------------------------------------------------------------------------------

assert_success \
  "register built-in generators" \
  phoenix::generator_register_builtins

assert_success \
  "provider built-in is registered" \
  phoenix::generator_exists "provider"


# ------------------------------------------------------------------------------
# Resolution
# ------------------------------------------------------------------------------

resolved_provider="$(
  phoenix::generator_resolve "provider"
)"

expected_provider="$(
  cat "$PROVIDER_DEFINITION_PATH"
)"

assert_equals \
  "provider resolves to definition file content" \
  "$expected_provider" \
  "$resolved_provider"


# ------------------------------------------------------------------------------
# Registry listing
# ------------------------------------------------------------------------------

registry_list="$(
  phoenix::generator_list
)"

assert_equals \
  "built-in registry contains provider" \
  "provider" \
  "$registry_list"


# ------------------------------------------------------------------------------
# Explicit loading / no duplicate registration
# ------------------------------------------------------------------------------

assert_failure \
  "second built-in registration fails on duplicate provider" \
  phoenix::generator_register_builtins


# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\n'
printf 'Generator Built-in Tests\n'
printf '========================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
