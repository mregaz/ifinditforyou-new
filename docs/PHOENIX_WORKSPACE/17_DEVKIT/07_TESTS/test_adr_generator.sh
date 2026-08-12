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

source "${DEVKIT_ROOT}/03_GENERATORS/execution.sh"
source "${DEVKIT_ROOT}/03_GENERATORS/builtins.sh"

TEST_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/phoenix-adr-generator.XXXXXX")"

cleanup() {
  rm -rf "$TEST_ROOT"
}

trap cleanup EXIT


# ------------------------------------------------------------------------------
# Registration
# ------------------------------------------------------------------------------

assert_success \
  "register built-in generators for ADR test" \
  phoenix::generator_register_builtins

assert_success \
  "adr generator is registered" \
  phoenix::generator_exists "adr"


# ------------------------------------------------------------------------------
# Planning
# ------------------------------------------------------------------------------

ADR_DEST="${TEST_ROOT}/adr"

adr_plan="$(
  phoenix::generator_plan \
    "adr" \
    "$ADR_DEST" \
    "ADR_NUMBER=013" \
    "ADR_TITLE=Generator Artifact Naming" \
    "ADR_FILE_TITLE=GENERATOR_ARTIFACT_NAMING" \
    "ADR_STATUS=Proposed" \
    "ADR_DATE=2026-08-12"
)"

expected_adr_plan="$(cat <<PLAN
STATUS=PLAN
GENERATOR=adr
DESTINATION=${ADR_DEST}
OVERWRITE=0
DRY_RUN=0
ARTIFACT=${ADR_DEST}/ADR-013_GENERATOR_ARTIFACT_NAMING.md
PLAN
)"

assert_equals \
  "adr generator produces canonical plan" \
  "$expected_adr_plan" \
  "$adr_plan"


# ------------------------------------------------------------------------------
# Execution
# ------------------------------------------------------------------------------

adr_result="$(
  phoenix::generator_run \
    "adr" \
    "$ADR_DEST" \
    "ADR_NUMBER=013" \
    "ADR_TITLE=Generator Artifact Naming" \
    "ADR_FILE_TITLE=GENERATOR_ARTIFACT_NAMING" \
    "ADR_STATUS=Proposed" \
    "ADR_DATE=2026-08-12"
)"

expected_adr_result="$(cat <<RESULT
STATUS=SUCCESS
GENERATOR=adr
DESTINATION=${ADR_DEST}
ARTIFACT=${ADR_DEST}/ADR-013_GENERATOR_ARTIFACT_NAMING.md
RESULT
)"

assert_equals \
  "adr generator returns canonical execution result" \
  "$expected_adr_result" \
  "$adr_result"


ADR_FILE="${ADR_DEST}/ADR-013_GENERATOR_ARTIFACT_NAMING.md"

if [[ -f "$ADR_FILE" ]]; then
  pass "adr generator creates dynamically named ADR file"
else
  fail "adr generator creates dynamically named ADR file"
fi


# ------------------------------------------------------------------------------
# Generated content
# ------------------------------------------------------------------------------

actual_adr_content="$(
  cat "$ADR_FILE" 2>/dev/null || true
)"

expected_adr_content="$(cat <<'CONTENT'
# ADR-013 — Generator Artifact Naming

**Status:** Proposed

**Date:** 2026-08-12

---

# Context

TODO

---

# Decision

TODO

---

# Consequences

TODO
CONTENT
)"

assert_equals \
  "generated ADR contains canonical v1.0 structure" \
  "$expected_adr_content" \
  "$actual_adr_content"


# ------------------------------------------------------------------------------
# Dry-run
# ------------------------------------------------------------------------------

DRY_DEST="${TEST_ROOT}/dry-adr"

dry_result="$(
  phoenix::generator_run \
    "adr" \
    "$DRY_DEST" \
    "ADR_NUMBER=014" \
    "ADR_TITLE=Dry Run ADR" \
    "ADR_FILE_TITLE=DRY_RUN_ADR" \
    "ADR_STATUS=Proposed" \
    "ADR_DATE=2026-08-12" \
    "PHOENIX_DRY_RUN=1"
)"

expected_dry_result="$(cat <<RESULT
STATUS=DRY_RUN
GENERATOR=adr
DESTINATION=${DRY_DEST}
ARTIFACT=${DRY_DEST}/ADR-014_DRY_RUN_ADR.md
RESULT
)"

assert_equals \
  "adr dry-run returns canonical result" \
  "$expected_dry_result" \
  "$dry_result"

if [[ ! -e "$DRY_DEST" ]]; then
  pass "adr dry-run performs zero filesystem mutation"
else
  fail "adr dry-run performs zero filesystem mutation"
fi


# ------------------------------------------------------------------------------
# Missing required variable
# ------------------------------------------------------------------------------

MISSING_DEST="${TEST_ROOT}/missing-variable"

assert_failure \
  "adr generator rejects missing required variable" \
  phoenix::generator_run \
    "adr" \
    "$MISSING_DEST" \
    "ADR_NUMBER=015" \
    "ADR_TITLE=Incomplete ADR" \
    "ADR_FILE_TITLE=INCOMPLETE_ADR" \
    "ADR_STATUS=Proposed"

if [[ ! -e "$MISSING_DEST" ]]; then
  pass "failed ADR request performs zero mutation"
else
  fail "failed ADR request performs zero mutation"
fi


# ------------------------------------------------------------------------------
# Determinism
# ------------------------------------------------------------------------------

DET_DEST="${TEST_ROOT}/deterministic"

det_plan_a="$(
  phoenix::generator_plan \
    "adr" \
    "$DET_DEST" \
    "ADR_NUMBER=016" \
    "ADR_TITLE=Deterministic ADR" \
    "ADR_FILE_TITLE=DETERMINISTIC_ADR" \
    "ADR_STATUS=Accepted" \
    "ADR_DATE=2026-08-12"
)"

det_plan_b="$(
  phoenix::generator_plan \
    "adr" \
    "$DET_DEST" \
    "ADR_NUMBER=016" \
    "ADR_TITLE=Deterministic ADR" \
    "ADR_FILE_TITLE=DETERMINISTIC_ADR" \
    "ADR_STATUS=Accepted" \
    "ADR_DATE=2026-08-12"
)"

assert_equals \
  "identical ADR request produces identical plan" \
  "$det_plan_a" \
  "$det_plan_b"


# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\n'
printf 'ADR Generator End-to-End Tests\n'
printf '==============================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
