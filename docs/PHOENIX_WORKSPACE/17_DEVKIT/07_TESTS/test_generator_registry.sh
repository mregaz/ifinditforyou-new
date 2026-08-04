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
    printf '  expected: %s\n' "$expected"
    printf '  actual:   %s\n' "$actual"
  fi
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEVKIT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

source "${DEVKIT_ROOT}/03_GENERATORS/registry.sh"


# ------------------------------------------------------------------------------
# Initial State
# ------------------------------------------------------------------------------

assert_failure \
  "unknown generator does not exist" \
  phoenix::generator_exists "unknown"


# ------------------------------------------------------------------------------
# Registration
# ------------------------------------------------------------------------------

assert_success \
  "register component generator" \
  phoenix::generator_register \
  "component" \
  "phoenix::generator_component"

assert_success \
  "registered component exists" \
  phoenix::generator_exists "component"

assert_failure \
  "duplicate generator registration fails" \
  phoenix::generator_register \
  "component" \
  "phoenix::generator_component_v2"

assert_failure \
  "registration without id fails" \
  phoenix::generator_register \
  "" \
  "phoenix::generator_invalid"

assert_failure \
  "registration without handler fails" \
  phoenix::generator_register \
  "invalid" \
  ""


# ------------------------------------------------------------------------------
# Resolution
# ------------------------------------------------------------------------------

resolved_component="$(
  phoenix::generator_resolve "component"
)"

assert_equals \
  "resolve component generator" \
  "phoenix::generator_component" \
  "$resolved_component"

assert_failure \
  "resolve unknown generator fails" \
  phoenix::generator_resolve "unknown"

assert_failure \
  "resolve without generator id fails" \
  phoenix::generator_resolve ""


# ------------------------------------------------------------------------------
# Multiple Registrations
# ------------------------------------------------------------------------------

assert_success \
  "register next-api generator" \
  phoenix::generator_register \
  "next-api" \
  "phoenix::generator_next_api"

assert_success \
  "register library generator" \
  phoenix::generator_register \
  "library" \
  "phoenix::generator_library"

resolved_next_api="$(
  phoenix::generator_resolve "next-api"
)"

assert_equals \
  "resolve next-api generator" \
  "phoenix::generator_next_api" \
  "$resolved_next_api"


# ------------------------------------------------------------------------------
# Listing
# ------------------------------------------------------------------------------

registry_list="$(
  phoenix::generator_list
)"

expected_list="$(cat <<'LIST'
component
next-api
library
LIST
)"

assert_equals \
  "generator list returns registered ids in registration order" \
  "$expected_list" \
  "$registry_list"


# ------------------------------------------------------------------------------
# Registry Integrity
# ------------------------------------------------------------------------------

resolved_component_after_duplicate="$(
  phoenix::generator_resolve "component"
)"

assert_equals \
  "duplicate registration does not overwrite existing handler" \
  "phoenix::generator_component" \
  "$resolved_component_after_duplicate"


# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\n'
printf 'Generator Registry Tests\n'
printf '========================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
