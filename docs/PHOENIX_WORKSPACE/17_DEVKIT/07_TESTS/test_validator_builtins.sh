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

source "${DEVKIT_ROOT}/04_VALIDATORS/registry.sh"

BUILTINS="${DEVKIT_ROOT}/04_VALIDATORS/builtins.sh"
STRUCTURE_DEFINITION="${DEVKIT_ROOT}/04_VALIDATORS/definitions/structure.definition"
STRUCTURE_IMPLEMENTATION="${DEVKIT_ROOT}/04_VALIDATORS/implementations/structure.sh"

if [[ -f "$STRUCTURE_IMPLEMENTATION" ]]; then
  source "$STRUCTURE_IMPLEMENTATION"
fi

if [[ -f "$BUILTINS" ]]; then
  source "$BUILTINS"
fi

# ------------------------------------------------------------------------------
# Assets
# ------------------------------------------------------------------------------

if [[ -f "$STRUCTURE_DEFINITION" ]]; then
  pass "structure validator definition exists"
else
  fail "structure validator definition exists"
fi

if [[ -f "$STRUCTURE_IMPLEMENTATION" ]]; then
  pass "structure validator implementation exists"
else
  fail "structure validator implementation exists"
fi

# ------------------------------------------------------------------------------
# Built-in registration
# ------------------------------------------------------------------------------

assert_success \
  "register built-in validators" \
  phoenix::validator_register_builtins

assert_success \
  "structure validator is registered" \
  phoenix::validator_exists \
    "structure"

# ------------------------------------------------------------------------------
# Definition contract
# ------------------------------------------------------------------------------

expected_structure_definition="$(cat <<'DEF'
ID=structure
PURPOSE=Validate Phoenix DevKit structural requirements
IMPLEMENTATION=phoenix::validator_structure
DEF
)"

resolved_structure="$(
  phoenix::validator_resolve "structure" 2>/dev/null || true
)"

assert_equals \
  "structure resolves to canonical definition" \
  "$expected_structure_definition" \
  "$resolved_structure"

# ------------------------------------------------------------------------------
# Canonical built-in order
# ------------------------------------------------------------------------------

validator_list="$(
  phoenix::validator_list 2>/dev/null || true
)"

assert_equals \
  "built-in validator list contains structure" \
  "structure" \
  "$validator_list"

# ------------------------------------------------------------------------------
# Implementation availability
# ------------------------------------------------------------------------------

if declare -F phoenix::validator_structure >/dev/null 2>&1; then
  pass "structure validator implementation is available"
else
  fail "structure validator implementation is available"
fi

# ------------------------------------------------------------------------------
# Duplicate built-in registration
# ------------------------------------------------------------------------------

assert_failure \
  "second built-in registration fails on duplicate validator" \
  phoenix::validator_register_builtins

# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\n'
printf 'Validator Built-in Tests\n'
printf '========================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
