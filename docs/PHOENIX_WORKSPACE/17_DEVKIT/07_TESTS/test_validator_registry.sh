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

REGISTRY="${DEVKIT_ROOT}/04_VALIDATORS/registry.sh"

if [[ -f "$REGISTRY" ]]; then
  source "$REGISTRY"
fi

# ------------------------------------------------------------------------------
# Unknown validator
# ------------------------------------------------------------------------------

assert_failure \
  "unknown validator does not exist" \
  phoenix::validator_exists "unknown"

# ------------------------------------------------------------------------------
# Valid registration
# ------------------------------------------------------------------------------

structure_definition="$(cat <<'DEF'
ID=structure
PURPOSE=Validate Phoenix DevKit structural requirements
IMPLEMENTATION=phoenix::validator_structure
DEF
)"

assert_success \
  "register valid structure validator" \
  phoenix::validator_register \
    "structure" \
    "$structure_definition"

assert_success \
  "registered structure validator exists" \
  phoenix::validator_exists "structure"

# ------------------------------------------------------------------------------
# Resolution
# ------------------------------------------------------------------------------

resolved_structure="$(
  phoenix::validator_resolve "structure" 2>/dev/null || true
)"

assert_equals \
  "resolve returns exact structure definition" \
  "$structure_definition" \
  "$resolved_structure"

# ------------------------------------------------------------------------------
# Duplicate registration
# ------------------------------------------------------------------------------

duplicate_definition="$(cat <<'DEF'
ID=structure
PURPOSE=Changed purpose
IMPLEMENTATION=phoenix::validator_changed
DEF
)"

assert_failure \
  "duplicate validator registration fails" \
  phoenix::validator_register \
    "structure" \
    "$duplicate_definition"

resolved_after_duplicate="$(
  phoenix::validator_resolve "structure" 2>/dev/null || true
)"

assert_equals \
  "duplicate registration preserves original definition" \
  "$structure_definition" \
  "$resolved_after_duplicate"

# ------------------------------------------------------------------------------
# Missing registration arguments
# ------------------------------------------------------------------------------

assert_failure \
  "registration without validator id fails" \
  phoenix::validator_register \
    "" \
    "$structure_definition"

assert_failure \
  "registration without definition fails" \
  phoenix::validator_register \
    "missing-definition" \
    ""

# ------------------------------------------------------------------------------
# Definition validation
# ------------------------------------------------------------------------------

missing_id_definition="$(cat <<'DEF'
PURPOSE=Validate something
IMPLEMENTATION=phoenix::validator_missing_id
DEF
)"

assert_failure \
  "definition missing ID fails" \
  phoenix::validator_register \
    "missing-id" \
    "$missing_id_definition"

id_mismatch_definition="$(cat <<'DEF'
ID=different
PURPOSE=Validate something
IMPLEMENTATION=phoenix::validator_mismatch
DEF
)"

assert_failure \
  "definition ID mismatch fails" \
  phoenix::validator_register \
    "expected" \
    "$id_mismatch_definition"

missing_purpose_definition="$(cat <<'DEF'
ID=missing-purpose
IMPLEMENTATION=phoenix::validator_missing_purpose
DEF
)"

assert_failure \
  "definition missing PURPOSE fails" \
  phoenix::validator_register \
    "missing-purpose" \
    "$missing_purpose_definition"

empty_purpose_definition="$(cat <<'DEF'
ID=empty-purpose
PURPOSE=
IMPLEMENTATION=phoenix::validator_empty_purpose
DEF
)"

assert_failure \
  "definition empty PURPOSE fails" \
  phoenix::validator_register \
    "empty-purpose" \
    "$empty_purpose_definition"

missing_implementation_definition="$(cat <<'DEF'
ID=missing-implementation
PURPOSE=Validate something
DEF
)"

assert_failure \
  "definition missing IMPLEMENTATION fails" \
  phoenix::validator_register \
    "missing-implementation" \
    "$missing_implementation_definition"

empty_implementation_definition="$(cat <<'DEF'
ID=empty-implementation
PURPOSE=Validate something
IMPLEMENTATION=
DEF
)"

assert_failure \
  "definition empty IMPLEMENTATION fails" \
  phoenix::validator_register \
    "empty-implementation" \
    "$empty_implementation_definition"

# ------------------------------------------------------------------------------
# Deterministic listing
# ------------------------------------------------------------------------------

naming_definition="$(cat <<'DEF'
ID=naming
PURPOSE=Validate Phoenix naming requirements
IMPLEMENTATION=phoenix::validator_naming
DEF
)"

documentation_definition="$(cat <<'DEF'
ID=documentation
PURPOSE=Validate Phoenix documentation requirements
IMPLEMENTATION=phoenix::validator_documentation
DEF
)"

assert_success \
  "register naming validator" \
  phoenix::validator_register \
    "naming" \
    "$naming_definition"

assert_success \
  "register documentation validator" \
  phoenix::validator_register \
    "documentation" \
    "$documentation_definition"

validator_list="$(
  phoenix::validator_list 2>/dev/null || true
)"

expected_validator_list="$(cat <<'LIST'
structure
naming
documentation
LIST
)"

assert_equals \
  "validator list preserves registration order" \
  "$expected_validator_list" \
  "$validator_list"

# ------------------------------------------------------------------------------
# Resolve failures
# ------------------------------------------------------------------------------

assert_failure \
  "resolve unknown validator fails" \
  phoenix::validator_resolve \
    "not-registered"

assert_failure \
  "resolve without validator id fails" \
  phoenix::validator_resolve \
    ""

# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\n'
printf 'Validator Registry Tests\n'
printf '========================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0