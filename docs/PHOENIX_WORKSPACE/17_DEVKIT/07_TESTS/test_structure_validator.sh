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
source "${DEVKIT_ROOT}/04_VALIDATORS/execution.sh"

STRUCTURE_IMPLEMENTATION="${DEVKIT_ROOT}/04_VALIDATORS/implementations/structure.sh"

if [[ -f "$STRUCTURE_IMPLEMENTATION" ]]; then
  source "$STRUCTURE_IMPLEMENTATION"
fi

TEST_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/phoenix-structure-validator.XXXXXX")"

cleanup() {
  rm -rf "$TEST_ROOT"
}

trap cleanup EXIT

structure_definition="$(cat <<'DEF'
ID=structure
PURPOSE=Validate Phoenix DevKit structural requirements
IMPLEMENTATION=phoenix::validator_structure
DEF
)"

phoenix::validator_register \
  "structure" \
  "$structure_definition" >/dev/null 2>&1 || true


# ------------------------------------------------------------------------------
# Missing target
# ------------------------------------------------------------------------------

MISSING_TARGET="${TEST_ROOT}/does-not-exist"

missing_target_result="$(
  phoenix::validator_run \
    "structure" \
    "$MISSING_TARGET" 2>/dev/null || true
)"

expected_missing_target_result="$(cat <<RESULT
STATUS=INVALID
VALIDATOR=structure
TARGET=${MISSING_TARGET}
CHECK=target-exists
MESSAGE=Validation target does not exist
RESULT
)"

assert_equals \
  "structure validator rejects missing target" \
  "$expected_missing_target_result" \
  "$missing_target_result"


# ------------------------------------------------------------------------------
# Target is not a directory
# ------------------------------------------------------------------------------

FILE_TARGET="${TEST_ROOT}/target-file"
printf 'content\n' > "$FILE_TARGET"

file_target_result="$(
  phoenix::validator_run \
    "structure" \
    "$FILE_TARGET" 2>/dev/null || true
)"

expected_file_target_result="$(cat <<RESULT
STATUS=INVALID
VALIDATOR=structure
TARGET=${FILE_TARGET}
CHECK=target-directory
MESSAGE=Validation target is not a directory
RESULT
)"

assert_equals \
  "structure validator rejects regular file target" \
  "$expected_file_target_result" \
  "$file_target_result"


# ------------------------------------------------------------------------------
# Missing README
# ------------------------------------------------------------------------------

README_TARGET="${TEST_ROOT}/missing-readme"
mkdir -p \
  "${README_TARGET}/00_FOUNDATION" \
  "${README_TARGET}/01_ARCHITECTURE" \
  "${README_TARGET}/03_GENERATORS" \
  "${README_TARGET}/07_TESTS"

readme_result="$(
  phoenix::validator_run \
    "structure" \
    "$README_TARGET" 2>/dev/null || true
)"

expected_readme_result="$(cat <<RESULT
STATUS=INVALID
VALIDATOR=structure
TARGET=${README_TARGET}
CHECK=required-readme
MESSAGE=Required file README.md is missing
RESULT
)"

assert_equals \
  "structure validator detects missing README" \
  "$expected_readme_result" \
  "$readme_result"


# ------------------------------------------------------------------------------
# Missing Foundation directory
# ------------------------------------------------------------------------------

FOUNDATION_TARGET="${TEST_ROOT}/missing-foundation"
mkdir -p \
  "${FOUNDATION_TARGET}/01_ARCHITECTURE" \
  "${FOUNDATION_TARGET}/03_GENERATORS" \
  "${FOUNDATION_TARGET}/07_TESTS"
printf '# Test\n' > "${FOUNDATION_TARGET}/README.md"

foundation_result="$(
  phoenix::validator_run \
    "structure" \
    "$FOUNDATION_TARGET" 2>/dev/null || true
)"

expected_foundation_result="$(cat <<RESULT
STATUS=INVALID
VALIDATOR=structure
TARGET=${FOUNDATION_TARGET}
CHECK=required-foundation-directory
MESSAGE=Required directory 00_FOUNDATION is missing
RESULT
)"

assert_equals \
  "structure validator detects missing Foundation directory" \
  "$expected_foundation_result" \
  "$foundation_result"


# ------------------------------------------------------------------------------
# Missing Architecture directory
# ------------------------------------------------------------------------------

ARCHITECTURE_TARGET="${TEST_ROOT}/missing-architecture"
mkdir -p \
  "${ARCHITECTURE_TARGET}/00_FOUNDATION" \
  "${ARCHITECTURE_TARGET}/03_GENERATORS" \
  "${ARCHITECTURE_TARGET}/07_TESTS"
printf '# Test\n' > "${ARCHITECTURE_TARGET}/README.md"

architecture_result="$(
  phoenix::validator_run \
    "structure" \
    "$ARCHITECTURE_TARGET" 2>/dev/null || true
)"

expected_architecture_result="$(cat <<RESULT
STATUS=INVALID
VALIDATOR=structure
TARGET=${ARCHITECTURE_TARGET}
CHECK=required-architecture-directory
MESSAGE=Required directory 01_ARCHITECTURE is missing
RESULT
)"

assert_equals \
  "structure validator detects missing Architecture directory" \
  "$expected_architecture_result" \
  "$architecture_result"


# ------------------------------------------------------------------------------
# Missing Generators directory
# ------------------------------------------------------------------------------

GENERATORS_TARGET="${TEST_ROOT}/missing-generators"
mkdir -p \
  "${GENERATORS_TARGET}/00_FOUNDATION" \
  "${GENERATORS_TARGET}/01_ARCHITECTURE" \
  "${GENERATORS_TARGET}/07_TESTS"
printf '# Test\n' > "${GENERATORS_TARGET}/README.md"

generators_result="$(
  phoenix::validator_run \
    "structure" \
    "$GENERATORS_TARGET" 2>/dev/null || true
)"

expected_generators_result="$(cat <<RESULT
STATUS=INVALID
VALIDATOR=structure
TARGET=${GENERATORS_TARGET}
CHECK=required-generators-directory
MESSAGE=Required directory 03_GENERATORS is missing
RESULT
)"

assert_equals \
  "structure validator detects missing Generators directory" \
  "$expected_generators_result" \
  "$generators_result"


# ------------------------------------------------------------------------------
# Missing Tests directory
# ------------------------------------------------------------------------------

TESTS_TARGET="${TEST_ROOT}/missing-tests"
mkdir -p \
  "${TESTS_TARGET}/00_FOUNDATION" \
  "${TESTS_TARGET}/01_ARCHITECTURE" \
  "${TESTS_TARGET}/03_GENERATORS"
printf '# Test\n' > "${TESTS_TARGET}/README.md"

tests_result="$(
  phoenix::validator_run \
    "structure" \
    "$TESTS_TARGET" 2>/dev/null || true
)"

expected_tests_result="$(cat <<RESULT
STATUS=INVALID
VALIDATOR=structure
TARGET=${TESTS_TARGET}
CHECK=required-tests-directory
MESSAGE=Required directory 07_TESTS is missing
RESULT
)"

assert_equals \
  "structure validator detects missing Tests directory" \
  "$expected_tests_result" \
  "$tests_result"


# ------------------------------------------------------------------------------
# Valid structure
# ------------------------------------------------------------------------------

VALID_TARGET="${TEST_ROOT}/valid"

mkdir -p \
  "${VALID_TARGET}/00_FOUNDATION" \
  "${VALID_TARGET}/01_ARCHITECTURE" \
  "${VALID_TARGET}/03_GENERATORS" \
  "${VALID_TARGET}/07_TESTS"

printf '# Test\n' > "${VALID_TARGET}/README.md"

valid_result="$(
  phoenix::validator_run \
    "structure" \
    "$VALID_TARGET" 2>/dev/null || true
)"

expected_valid_result="$(cat <<RESULT
STATUS=VALID
VALIDATOR=structure
TARGET=${VALID_TARGET}
RESULT
)"

assert_equals \
  "structure validator accepts canonical valid structure" \
  "$expected_valid_result" \
  "$valid_result"


# ------------------------------------------------------------------------------
# Fail-fast ordering
# ------------------------------------------------------------------------------

FAIL_FAST_TARGET="${TEST_ROOT}/fail-fast"
mkdir -p "$FAIL_FAST_TARGET"

fail_fast_result="$(
  phoenix::validator_run \
    "structure" \
    "$FAIL_FAST_TARGET" 2>/dev/null || true
)"

expected_fail_fast_result="$(cat <<RESULT
STATUS=INVALID
VALIDATOR=structure
TARGET=${FAIL_FAST_TARGET}
CHECK=required-readme
MESSAGE=Required file README.md is missing
RESULT
)"

assert_equals \
  "structure validator fails on first canonical violation" \
  "$expected_fail_fast_result" \
  "$fail_fast_result"


# ------------------------------------------------------------------------------
# Read-only target contract
# ------------------------------------------------------------------------------

before_snapshot="$(
  find "$VALID_TARGET" -print | sort
)"

phoenix::validator_run \
  "structure" \
  "$VALID_TARGET" >/dev/null 2>&1 || true

after_snapshot="$(
  find "$VALID_TARGET" -print | sort
)"

assert_equals \
  "structure validation performs zero target mutation" \
  "$before_snapshot" \
  "$after_snapshot"


# ------------------------------------------------------------------------------
# Determinism
# ------------------------------------------------------------------------------

valid_result_again="$(
  phoenix::validator_run \
    "structure" \
    "$VALID_TARGET" 2>/dev/null || true
)"

if [[ -n "$valid_result" && "$valid_result" == *"STATUS=VALID"* ]]; then
  pass "structure determinism test operates on valid result"
else
  fail "structure determinism test operates on valid result"
fi

assert_equals \
  "identical structure validation produces identical result" \
  "$valid_result" \
  "$valid_result_again"


# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\n'
printf 'Structure Validator Tests\n'
printf '=========================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
