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

EXECUTION="${DEVKIT_ROOT}/04_VALIDATORS/execution.sh"

if [[ -f "$EXECUTION" ]]; then
  source "$EXECUTION"
fi

# ------------------------------------------------------------------------------
# Test validator implementations
# ------------------------------------------------------------------------------

phoenix::validator_test_valid() {
  local target="${1:-}"
  printf 'RESULT=VALID\n'
  return 0
}

phoenix::validator_test_invalid() {
  local target="${1:-}"
  printf 'RESULT=INVALID\n'
  printf 'CHECK=required-file\n'
  printf 'MESSAGE=Required file README.md is missing\n'
  return 0
}

phoenix::validator_test_error() {
  local target="${1:-}"
  printf 'RESULT=ERROR\n'
  printf 'MESSAGE=Unable to inspect validation target\n'
  return 0
}

valid_definition="$(cat <<'DEF'
ID=test-valid
PURPOSE=Test valid validator
IMPLEMENTATION=phoenix::validator_test_valid
DEF
)"

invalid_definition="$(cat <<'DEF'
ID=test-invalid
PURPOSE=Test invalid validator
IMPLEMENTATION=phoenix::validator_test_invalid
DEF
)"

error_definition="$(cat <<'DEF'
ID=test-error
PURPOSE=Test error validator
IMPLEMENTATION=phoenix::validator_test_error
DEF
)"

phoenix::validator_register "test-valid" "$valid_definition" >/dev/null 2>&1 || true
phoenix::validator_register "test-invalid" "$invalid_definition" >/dev/null 2>&1 || true
phoenix::validator_register "test-error" "$error_definition" >/dev/null 2>&1 || true

TARGET="/tmp/phoenix-validator-target"

# ------------------------------------------------------------------------------
# Request validation
# ------------------------------------------------------------------------------

assert_failure \
  "validator run without arguments fails" \
  phoenix::validator_run

assert_failure \
  "validator run without target fails" \
  phoenix::validator_run \
    "test-valid"

assert_failure \
  "validator run rejects unknown validator" \
  phoenix::validator_run \
    "unknown" \
    "$TARGET"

# ------------------------------------------------------------------------------
# VALID
# ------------------------------------------------------------------------------

valid_result="$(
  phoenix::validator_run \
    "test-valid" \
    "$TARGET" 2>/dev/null || true
)"

expected_valid_result="$(cat <<RESULT
STATUS=VALID
VALIDATOR=test-valid
TARGET=${TARGET}
RESULT
)"

assert_equals \
  "valid validator returns canonical VALID result" \
  "$expected_valid_result" \
  "$valid_result"

# ------------------------------------------------------------------------------
# INVALID
# ------------------------------------------------------------------------------

invalid_result="$(
  phoenix::validator_run \
    "test-invalid" \
    "$TARGET" 2>/dev/null || true
)"

expected_invalid_result="$(cat <<RESULT
STATUS=INVALID
VALIDATOR=test-invalid
TARGET=${TARGET}
CHECK=required-file
MESSAGE=Required file README.md is missing
RESULT
)"

assert_equals \
  "invalid validator returns canonical INVALID result" \
  "$expected_invalid_result" \
  "$invalid_result"

# ------------------------------------------------------------------------------
# ERROR
# ------------------------------------------------------------------------------

error_result="$(
  phoenix::validator_run \
    "test-error" \
    "$TARGET" 2>/dev/null || true
)"

expected_error_result="$(cat <<RESULT
STATUS=ERROR
VALIDATOR=test-error
TARGET=${TARGET}
MESSAGE=Unable to inspect validation target
RESULT
)"

assert_equals \
  "error validator returns canonical ERROR result" \
  "$expected_error_result" \
  "$error_result"

# ------------------------------------------------------------------------------
# Protocol hardening
# ------------------------------------------------------------------------------

phoenix::validator_test_missing_implementation() {
  local target="${1:-}"
  printf 'RESULT=VALID\n'
  return 0
}

missing_implementation_definition="$(cat <<'DEF'
ID=test-missing-implementation
PURPOSE=Test unavailable implementation
IMPLEMENTATION=phoenix::validator_does_not_exist
DEF
)"

phoenix::validator_register \
  "test-missing-implementation" \
  "$missing_implementation_definition" >/dev/null 2>&1 || true

missing_implementation_result="$(
  phoenix::validator_run \
    "test-missing-implementation" \
    "$TARGET" 2>/dev/null || true
)"

expected_missing_implementation_result="$(cat <<RESULT
STATUS=ERROR
VALIDATOR=test-missing-implementation
TARGET=${TARGET}
MESSAGE=Validator implementation is unavailable
RESULT
)"

assert_equals \
  "missing validator implementation returns canonical ERROR" \
  "$expected_missing_implementation_result" \
  "$missing_implementation_result"


# ------------------------------------------------------------------------------
# Operational implementation failure
# ------------------------------------------------------------------------------

phoenix::validator_test_operational_failure() {
  local target="${1:-}"
  printf 'RESULT=INVALID\n'
  printf 'CHECK=should-not-propagate\n'
  printf 'MESSAGE=Should not become INVALID\n'
  return 1
}

operational_failure_definition="$(cat <<'DEF'
ID=test-operational-failure
PURPOSE=Test operational failure
IMPLEMENTATION=phoenix::validator_test_operational_failure
DEF
)"

phoenix::validator_register \
  "test-operational-failure" \
  "$operational_failure_definition" >/dev/null 2>&1 || true

operational_failure_result="$(
  phoenix::validator_run \
    "test-operational-failure" \
    "$TARGET" 2>/dev/null || true
)"

expected_operational_failure_result="$(cat <<RESULT
STATUS=ERROR
VALIDATOR=test-operational-failure
TARGET=${TARGET}
MESSAGE=Validator execution failed
RESULT
)"

assert_equals \
  "non-zero implementation status becomes ERROR" \
  "$expected_operational_failure_result" \
  "$operational_failure_result"


# ------------------------------------------------------------------------------
# Unexpected stderr
# ------------------------------------------------------------------------------

phoenix::validator_test_stderr() {
  local target="${1:-}"
  printf 'RESULT=VALID\n'
  printf 'unexpected diagnostic\n' >&2
  return 0
}

stderr_definition="$(cat <<'DEF'
ID=test-stderr
PURPOSE=Test unexpected stderr
IMPLEMENTATION=phoenix::validator_test_stderr
DEF
)"

phoenix::validator_register \
  "test-stderr" \
  "$stderr_definition" >/dev/null 2>&1 || true

stderr_result="$(
  phoenix::validator_run \
    "test-stderr" \
    "$TARGET" 2>/dev/null || true
)"

expected_stderr_result="$(cat <<RESULT
STATUS=ERROR
VALIDATOR=test-stderr
TARGET=${TARGET}
MESSAGE=Validator execution failed
RESULT
)"

assert_equals \
  "unexpected validator stderr becomes ERROR" \
  "$expected_stderr_result" \
  "$stderr_result"


# ------------------------------------------------------------------------------
# Missing RESULT
# ------------------------------------------------------------------------------

phoenix::validator_test_missing_result() {
  local target="${1:-}"
  printf 'CHECK=required-file\n'
  printf 'MESSAGE=Missing result field\n'
  return 0
}

missing_result_definition="$(cat <<'DEF'
ID=test-missing-result
PURPOSE=Test missing RESULT
IMPLEMENTATION=phoenix::validator_test_missing_result
DEF
)"

phoenix::validator_register \
  "test-missing-result" \
  "$missing_result_definition" >/dev/null 2>&1 || true

missing_result="$(
  phoenix::validator_run \
    "test-missing-result" \
    "$TARGET" 2>/dev/null || true
)"

expected_invalid_contract_result="$(cat <<RESULT
STATUS=ERROR
VALIDATOR=test-missing-result
TARGET=${TARGET}
MESSAGE=Validator returned an invalid result contract
RESULT
)"

assert_equals \
  "missing RESULT becomes ERROR" \
  "$expected_invalid_contract_result" \
  "$missing_result"


# ------------------------------------------------------------------------------
# Unsupported RESULT
# ------------------------------------------------------------------------------

phoenix::validator_test_unsupported_result() {
  local target="${1:-}"
  printf 'RESULT=WARNING\n'
  return 0
}

unsupported_result_definition="$(cat <<'DEF'
ID=test-unsupported-result
PURPOSE=Test unsupported RESULT
IMPLEMENTATION=phoenix::validator_test_unsupported_result
DEF
)"

phoenix::validator_register \
  "test-unsupported-result" \
  "$unsupported_result_definition" >/dev/null 2>&1 || true

unsupported_result="$(
  phoenix::validator_run \
    "test-unsupported-result" \
    "$TARGET" 2>/dev/null || true
)"

expected_unsupported_result="$(cat <<RESULT
STATUS=ERROR
VALIDATOR=test-unsupported-result
TARGET=${TARGET}
MESSAGE=Validator returned an invalid result contract
RESULT
)"

assert_equals \
  "unsupported RESULT becomes ERROR" \
  "$expected_unsupported_result" \
  "$unsupported_result"


# ------------------------------------------------------------------------------
# Unknown protocol field
# ------------------------------------------------------------------------------

phoenix::validator_test_unknown_field() {
  local target="${1:-}"
  printf 'RESULT=VALID\n'
  printf 'UNKNOWN=value\n'
  return 0
}

unknown_field_definition="$(cat <<'DEF'
ID=test-unknown-field
PURPOSE=Test unknown protocol field
IMPLEMENTATION=phoenix::validator_test_unknown_field
DEF
)"

phoenix::validator_register \
  "test-unknown-field" \
  "$unknown_field_definition" >/dev/null 2>&1 || true

unknown_field_result="$(
  phoenix::validator_run \
    "test-unknown-field" \
    "$TARGET" 2>/dev/null || true
)"

expected_unknown_field_result="$(cat <<RESULT
STATUS=ERROR
VALIDATOR=test-unknown-field
TARGET=${TARGET}
MESSAGE=Validator returned an invalid result contract
RESULT
)"

assert_equals \
  "unknown protocol field becomes ERROR" \
  "$expected_unknown_field_result" \
  "$unknown_field_result"


# ------------------------------------------------------------------------------
# Duplicate RESULT
# ------------------------------------------------------------------------------

phoenix::validator_test_duplicate_result() {
  local target="${1:-}"
  printf 'RESULT=VALID\n'
  printf 'RESULT=INVALID\n'
  return 0
}

duplicate_result_definition="$(cat <<'DEF'
ID=test-duplicate-result
PURPOSE=Test duplicate RESULT
IMPLEMENTATION=phoenix::validator_test_duplicate_result
DEF
)"

phoenix::validator_register \
  "test-duplicate-result" \
  "$duplicate_result_definition" >/dev/null 2>&1 || true

duplicate_result="$(
  phoenix::validator_run \
    "test-duplicate-result" \
    "$TARGET" 2>/dev/null || true
)"

expected_duplicate_result="$(cat <<RESULT
STATUS=ERROR
VALIDATOR=test-duplicate-result
TARGET=${TARGET}
MESSAGE=Validator returned an invalid result contract
RESULT
)"

assert_equals \
  "duplicate RESULT becomes ERROR" \
  "$expected_duplicate_result" \
  "$duplicate_result"


# ------------------------------------------------------------------------------
# Duplicate CHECK
# ------------------------------------------------------------------------------

phoenix::validator_test_duplicate_check() {
  local target="${1:-}"
  printf 'RESULT=INVALID\n'
  printf 'CHECK=first\n'
  printf 'CHECK=second\n'
  printf 'MESSAGE=Duplicate check\n'
  return 0
}

duplicate_check_definition="$(cat <<'DEF'
ID=test-duplicate-check
PURPOSE=Test duplicate CHECK
IMPLEMENTATION=phoenix::validator_test_duplicate_check
DEF
)"

phoenix::validator_register \
  "test-duplicate-check" \
  "$duplicate_check_definition" >/dev/null 2>&1 || true

duplicate_check_result="$(
  phoenix::validator_run \
    "test-duplicate-check" \
    "$TARGET" 2>/dev/null || true
)"

expected_duplicate_check_result="$(cat <<RESULT
STATUS=ERROR
VALIDATOR=test-duplicate-check
TARGET=${TARGET}
MESSAGE=Validator returned an invalid result contract
RESULT
)"

assert_equals \
  "duplicate CHECK becomes ERROR" \
  "$expected_duplicate_check_result" \
  "$duplicate_check_result"


# ------------------------------------------------------------------------------
# Duplicate MESSAGE
# ------------------------------------------------------------------------------

phoenix::validator_test_duplicate_message() {
  local target="${1:-}"
  printf 'RESULT=INVALID\n'
  printf 'CHECK=required-file\n'
  printf 'MESSAGE=First message\n'
  printf 'MESSAGE=Second message\n'
  return 0
}

duplicate_message_definition="$(cat <<'DEF'
ID=test-duplicate-message
PURPOSE=Test duplicate MESSAGE
IMPLEMENTATION=phoenix::validator_test_duplicate_message
DEF
)"

phoenix::validator_register \
  "test-duplicate-message" \
  "$duplicate_message_definition" >/dev/null 2>&1 || true

duplicate_message_result="$(
  phoenix::validator_run \
    "test-duplicate-message" \
    "$TARGET" 2>/dev/null || true
)"

expected_duplicate_message_result="$(cat <<RESULT
STATUS=ERROR
VALIDATOR=test-duplicate-message
TARGET=${TARGET}
MESSAGE=Validator returned an invalid result contract
RESULT
)"

assert_equals \
  "duplicate MESSAGE becomes ERROR" \
  "$expected_duplicate_message_result" \
  "$duplicate_message_result"


# ------------------------------------------------------------------------------
# INVALID missing CHECK
# ------------------------------------------------------------------------------

phoenix::validator_test_invalid_missing_check() {
  local target="${1:-}"
  printf 'RESULT=INVALID\n'
  printf 'MESSAGE=Missing check\n'
  return 0
}

invalid_missing_check_definition="$(cat <<'DEF'
ID=test-invalid-missing-check
PURPOSE=Test INVALID without CHECK
IMPLEMENTATION=phoenix::validator_test_invalid_missing_check
DEF
)"

phoenix::validator_register \
  "test-invalid-missing-check" \
  "$invalid_missing_check_definition" >/dev/null 2>&1 || true

invalid_missing_check_result="$(
  phoenix::validator_run \
    "test-invalid-missing-check" \
    "$TARGET" 2>/dev/null || true
)"

expected_invalid_missing_check_result="$(cat <<RESULT
STATUS=ERROR
VALIDATOR=test-invalid-missing-check
TARGET=${TARGET}
MESSAGE=Validator returned an invalid result contract
RESULT
)"

assert_equals \
  "INVALID without CHECK becomes ERROR" \
  "$expected_invalid_missing_check_result" \
  "$invalid_missing_check_result"


# ------------------------------------------------------------------------------
# INVALID missing MESSAGE
# ------------------------------------------------------------------------------

phoenix::validator_test_invalid_missing_message() {
  local target="${1:-}"
  printf 'RESULT=INVALID\n'
  printf 'CHECK=required-file\n'
  return 0
}

invalid_missing_message_definition="$(cat <<'DEF'
ID=test-invalid-missing-message
PURPOSE=Test INVALID without MESSAGE
IMPLEMENTATION=phoenix::validator_test_invalid_missing_message
DEF
)"

phoenix::validator_register \
  "test-invalid-missing-message" \
  "$invalid_missing_message_definition" >/dev/null 2>&1 || true

invalid_missing_message_result="$(
  phoenix::validator_run \
    "test-invalid-missing-message" \
    "$TARGET" 2>/dev/null || true
)"

expected_invalid_missing_message_result="$(cat <<RESULT
STATUS=ERROR
VALIDATOR=test-invalid-missing-message
TARGET=${TARGET}
MESSAGE=Validator returned an invalid result contract
RESULT
)"

assert_equals \
  "INVALID without MESSAGE becomes ERROR" \
  "$expected_invalid_missing_message_result" \
  "$invalid_missing_message_result"


# ------------------------------------------------------------------------------
# ERROR with forbidden CHECK
# ------------------------------------------------------------------------------

phoenix::validator_test_error_with_check() {
  local target="${1:-}"
  printf 'RESULT=ERROR\n'
  printf 'CHECK=forbidden\n'
  printf 'MESSAGE=Error with check\n'
  return 0
}

error_with_check_definition="$(cat <<'DEF'
ID=test-error-with-check
PURPOSE=Test ERROR with CHECK
IMPLEMENTATION=phoenix::validator_test_error_with_check
DEF
)"

phoenix::validator_register \
  "test-error-with-check" \
  "$error_with_check_definition" >/dev/null 2>&1 || true

error_with_check_result="$(
  phoenix::validator_run \
    "test-error-with-check" \
    "$TARGET" 2>/dev/null || true
)"

expected_error_with_check_result="$(cat <<RESULT
STATUS=ERROR
VALIDATOR=test-error-with-check
TARGET=${TARGET}
MESSAGE=Validator returned an invalid result contract
RESULT
)"

assert_equals \
  "ERROR with CHECK becomes contract ERROR" \
  "$expected_error_with_check_result" \
  "$error_with_check_result"


# ------------------------------------------------------------------------------
# VALID with forbidden MESSAGE
# ------------------------------------------------------------------------------

phoenix::validator_test_valid_with_message() {
  local target="${1:-}"
  printf 'RESULT=VALID\n'
  printf 'MESSAGE=Forbidden message\n'
  return 0
}

valid_with_message_definition="$(cat <<'DEF'
ID=test-valid-with-message
PURPOSE=Test VALID with MESSAGE
IMPLEMENTATION=phoenix::validator_test_valid_with_message
DEF
)"

phoenix::validator_register \
  "test-valid-with-message" \
  "$valid_with_message_definition" >/dev/null 2>&1 || true

valid_with_message_result="$(
  phoenix::validator_run \
    "test-valid-with-message" \
    "$TARGET" 2>/dev/null || true
)"

expected_valid_with_message_result="$(cat <<RESULT
STATUS=ERROR
VALIDATOR=test-valid-with-message
TARGET=${TARGET}
MESSAGE=Validator returned an invalid result contract
RESULT
)"

assert_equals \
  "VALID with MESSAGE becomes ERROR" \
  "$expected_valid_with_message_result" \
  "$valid_with_message_result"
# ------------------------------------------------------------------------------
# Determinism
# ------------------------------------------------------------------------------

valid_result_again="$(
  phoenix::validator_run \
    "test-valid" \
    "$TARGET" 2>/dev/null || true
)"
if [[ -n "$valid_result" && "$valid_result" == *"STATUS=VALID"* ]]; then
  pass "determinism test operates on a valid validation result"
else
  fail "determinism test operates on a valid validation result"
fi
assert_equals \
  "identical validation request produces identical result" \
  "$valid_result" \
  "$valid_result_again"

# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\n'
printf 'Validator Execution Tests\n'
printf '=========================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
