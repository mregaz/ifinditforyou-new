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
ADR_DEFINITION_PATH="${DEVKIT_ROOT}/03_GENERATORS/definitions/adr.definition"
SPRINT_DEFINITION_PATH="${DEVKIT_ROOT}/03_GENERATORS/definitions/sprint.definition"
DOCUMENTATION_DEFINITION_PATH="${DEVKIT_ROOT}/03_GENERATORS/definitions/documentation.definition"


# ------------------------------------------------------------------------------
# Definition files
# ------------------------------------------------------------------------------

if [[ -f "$PROVIDER_DEFINITION_PATH" ]]; then
  pass "provider definition exists"
else
  fail "provider definition exists"
fi

if [[ -f "$ADR_DEFINITION_PATH" ]]; then
  pass "adr definition exists"
else
  fail "adr definition exists"
fi

if [[ -f "$SPRINT_DEFINITION_PATH" ]]; then
  pass "sprint definition exists"
else
  fail "sprint definition exists"
fi

if [[ -f "$DOCUMENTATION_DEFINITION_PATH" ]]; then
  pass "documentation definition exists"
else
  fail "documentation definition exists"
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

assert_success \
  "adr built-in is registered" \
  phoenix::generator_exists "adr"

assert_success \
  "sprint built-in is registered" \
  phoenix::generator_exists "sprint"

assert_success \
  "documentation built-in is registered" \
  phoenix::generator_exists "documentation"


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


resolved_adr="$(
  phoenix::generator_resolve "adr"
)"

expected_adr="$(
  cat "$ADR_DEFINITION_PATH"
)"

assert_equals \
  "adr resolves to definition file content" \
  "$expected_adr" \
  "$resolved_adr"

resolved_sprint="$(
  phoenix::generator_resolve "sprint"
)"

expected_sprint="$(
  cat "$SPRINT_DEFINITION_PATH"
)"

assert_equals \
  "sprint resolves to definition file content" \
  "$expected_sprint" \
  "$resolved_sprint"

resolved_documentation="$(
  phoenix::generator_resolve "documentation"
)"

expected_documentation="$(
  cat "$DOCUMENTATION_DEFINITION_PATH"
)"

assert_equals \
  "documentation resolves to definition file content" \
  "$expected_documentation" \
  "$resolved_documentation"


# ------------------------------------------------------------------------------
# Registry listing
# ------------------------------------------------------------------------------

registry_list="$(
  phoenix::generator_list
)"

expected_registry_list="$(cat <<'LIST'
provider
adr
sprint
documentation
template
LIST
)"

assert_equals \
  "built-in registry preserves canonical generator order" \
  "$expected_registry_list" \
  "$registry_list"


# ------------------------------------------------------------------------------
# Explicit loading / no duplicate registration
# ------------------------------------------------------------------------------

assert_failure \
  "second built-in registration fails on duplicate generator" \
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
