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

definition_field() {
  local definition="$1"
  local field="$2"
  local line

  while IFS= read -r line; do
    case "$line" in
      "${field}="*)
        printf '%s\n' "${line#*=}"
        return 0
        ;;
    esac
  done <<< "$definition"

  return 1
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEVKIT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

source "${DEVKIT_ROOT}/03_GENERATORS/execution.sh"
source "${DEVKIT_ROOT}/03_GENERATORS/builtins.sh"

TEST_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/phoenix-sprint-generator.XXXXXX")"

cleanup() {
  rm -rf "$TEST_ROOT"
}

trap cleanup EXIT


# ------------------------------------------------------------------------------
# Registration
# ------------------------------------------------------------------------------

assert_success \
  "register built-in generators for Sprint test" \
  phoenix::generator_register_builtins

assert_success \
  "sprint generator is registered" \
  phoenix::generator_exists "sprint"

builtin_list="$(
  phoenix::generator_list
)"

expected_builtin_list="$(cat <<'LIST'
provider
adr
sprint
LIST
)"

assert_equals \
  "sprint generator is appended after existing built-ins" \
  "$expected_builtin_list" \
  "$builtin_list"


# ------------------------------------------------------------------------------
# Definition contract
# ------------------------------------------------------------------------------

sprint_definition="$(
  phoenix::generator_resolve "sprint" 2>/dev/null || true
)"

assert_equals \
  "sprint definition declares canonical ID" \
  "sprint" \
  "$(definition_field "$sprint_definition" "ID" 2>/dev/null || true)"

assert_equals \
  "sprint definition declares canonical purpose" \
  "Generate a canonical Phoenix Sprint document" \
  "$(definition_field "$sprint_definition" "PURPOSE" 2>/dev/null || true)"

assert_equals \
  "sprint definition declares exact required variables" \
  "SPRINT_ID,SPRINT_TITLE,SPRINT_SLUG" \
  "$(definition_field "$sprint_definition" "REQUIRED_VARIABLES" 2>/dev/null || true)"

assert_equals \
  "sprint definition declares scoped destination rule" \
  "scoped" \
  "$(definition_field "$sprint_definition" "DESTINATION_RULE" 2>/dev/null || true)"

assert_equals \
  "sprint definition denies overwrite requests" \
  "0" \
  "$(definition_field "$sprint_definition" "OVERWRITE_POLICY" 2>/dev/null || true)"

template_map_count="$(
  printf '%s\n' "$sprint_definition" |
    grep -c '^TEMPLATE_MAP=' || true
)"

assert_equals \
  "sprint definition declares exactly one template mapping" \
  "1" \
  "$template_map_count"

assert_equals \
  "sprint definition declares canonical template mapping" \
  "03_GENERATORS/templates/sprint/sprint.md.tpl=>SPRINT_{{SPRINT_ID}}_{{SPRINT_SLUG}}.md" \
  "$(definition_field "$sprint_definition" "TEMPLATE_MAP" 2>/dev/null || true)"


# ------------------------------------------------------------------------------
# Planning
# ------------------------------------------------------------------------------

SPRINT_DEST="${TEST_ROOT}/sprints"

sprint_plan="$(
  phoenix::generator_plan \
    "sprint" \
    "$SPRINT_DEST" \
    "SPRINT_ID=G06" \
    "SPRINT_TITLE=Sprint Generator" \
    "SPRINT_SLUG=SPRINT_GENERATOR" 2>/dev/null || true
)"

expected_sprint_plan="$(cat <<PLAN
STATUS=PLAN
GENERATOR=sprint
DESTINATION=${SPRINT_DEST}
OVERWRITE=0
DRY_RUN=0
ARTIFACT=${SPRINT_DEST}/SPRINT_G06_SPRINT_GENERATOR.md
PLAN
)"

assert_equals \
  "sprint generator produces canonical plan" \
  "$expected_sprint_plan" \
  "$sprint_plan"


# ------------------------------------------------------------------------------
# Missing required variables
# ------------------------------------------------------------------------------

assert_failure \
  "sprint generator rejects missing SPRINT_ID" \
  phoenix::generator_run \
    "sprint" \
    "${TEST_ROOT}/missing-id" \
    "SPRINT_TITLE=Sprint Generator" \
    "SPRINT_SLUG=SPRINT_GENERATOR"

assert_failure \
  "sprint generator rejects missing SPRINT_TITLE" \
  phoenix::generator_run \
    "sprint" \
    "${TEST_ROOT}/missing-title" \
    "SPRINT_ID=G06" \
    "SPRINT_SLUG=SPRINT_GENERATOR"

assert_failure \
  "sprint generator rejects missing SPRINT_SLUG" \
  phoenix::generator_run \
    "sprint" \
    "${TEST_ROOT}/missing-slug" \
    "SPRINT_ID=G06" \
    "SPRINT_TITLE=Sprint Generator"

if [[ ! -e "${TEST_ROOT}/missing-id" &&
      ! -e "${TEST_ROOT}/missing-title" &&
      ! -e "${TEST_ROOT}/missing-slug" ]]; then
  pass "failed Sprint requests perform zero filesystem mutation"
else
  fail "failed Sprint requests perform zero filesystem mutation"
fi


# ------------------------------------------------------------------------------
# Execution
# ------------------------------------------------------------------------------

sprint_result="$(
  phoenix::generator_run \
    "sprint" \
    "$SPRINT_DEST" \
    "SPRINT_ID=G06" \
    "SPRINT_TITLE=Sprint Generator" \
    "SPRINT_SLUG=SPRINT_GENERATOR" 2>/dev/null || true
)"

expected_sprint_result="$(cat <<RESULT
STATUS=SUCCESS
GENERATOR=sprint
DESTINATION=${SPRINT_DEST}
ARTIFACT=${SPRINT_DEST}/SPRINT_G06_SPRINT_GENERATOR.md
RESULT
)"

assert_equals \
  "sprint generator returns canonical execution result" \
  "$expected_sprint_result" \
  "$sprint_result"


SPRINT_FILE="${SPRINT_DEST}/SPRINT_G06_SPRINT_GENERATOR.md"

if [[ -f "$SPRINT_FILE" ]]; then
  pass "sprint generator creates canonical Sprint file"
else
  fail "sprint generator creates canonical Sprint file"
fi


# ------------------------------------------------------------------------------
# Generated content
# ------------------------------------------------------------------------------

actual_sprint_content="$(
  cat "$SPRINT_FILE" 2>/dev/null || true
)"

expected_sprint_content="$(cat <<'CONTENT'
# Sprint G06 — Sprint Generator

## Status

PLANNED

## Objective

TBD

## Scope

### In Scope

- TBD

### Out of Scope

- TBD

## Deliverables

- TBD

## Acceptance Criteria

- TBD

## Validation

### Automated

- TBD

### Manual

- TBD

## Closure

### Result

TBD

### Certification

NOT CERTIFIED
CONTENT
)"

assert_equals \
  "generated Sprint contains canonical v1.0 structure" \
  "$expected_sprint_content" \
  "$actual_sprint_content"


# ------------------------------------------------------------------------------
# Dry-run
# ------------------------------------------------------------------------------

DRY_DEST="${TEST_ROOT}/dry-sprint"

dry_result="$(
  phoenix::generator_run \
    "sprint" \
    "$DRY_DEST" \
    "SPRINT_ID=G07" \
    "SPRINT_TITLE=Dry Run Sprint" \
    "SPRINT_SLUG=DRY_RUN_SPRINT" \
    "PHOENIX_DRY_RUN=1" 2>/dev/null || true
)"

expected_dry_result="$(cat <<RESULT
STATUS=DRY_RUN
GENERATOR=sprint
DESTINATION=${DRY_DEST}
ARTIFACT=${DRY_DEST}/SPRINT_G07_DRY_RUN_SPRINT.md
RESULT
)"

assert_equals \
  "sprint dry-run returns canonical result" \
  "$expected_dry_result" \
  "$dry_result"

if [[ ! -e "$DRY_DEST" ]]; then
  pass "sprint dry-run performs zero filesystem mutation"
else
  fail "sprint dry-run performs zero filesystem mutation"
fi


# ------------------------------------------------------------------------------
# Overwrite protection
# ------------------------------------------------------------------------------

original_sprint_content="$(
  cat "$SPRINT_FILE" 2>/dev/null || true
)"

assert_failure \
  "sprint generator rejects existing target without overwrite" \
  phoenix::generator_run \
    "sprint" \
    "$SPRINT_DEST" \
    "SPRINT_ID=G06" \
    "SPRINT_TITLE=Changed Sprint Generator" \
    "SPRINT_SLUG=SPRINT_GENERATOR"

after_failed_overwrite_content="$(
  cat "$SPRINT_FILE" 2>/dev/null || true
)"

assert_equals \
  "failed Sprint overwrite preserves existing artifact" \
  "$original_sprint_content" \
  "$after_failed_overwrite_content"

assert_failure \
  "sprint definition rejects explicit overwrite request" \
  phoenix::generator_run \
    "sprint" \
    "$SPRINT_DEST" \
    "SPRINT_ID=G06" \
    "SPRINT_TITLE=Changed Sprint Generator" \
    "SPRINT_SLUG=SPRINT_GENERATOR" \
    "PHOENIX_OVERWRITE=1"


# ------------------------------------------------------------------------------
# Determinism
# ------------------------------------------------------------------------------

DET_DEST="${TEST_ROOT}/deterministic"

det_plan_a="$(
  phoenix::generator_plan \
    "sprint" \
    "$DET_DEST" \
    "SPRINT_ID=G08" \
    "SPRINT_TITLE=Deterministic Sprint" \
    "SPRINT_SLUG=DETERMINISTIC_SPRINT" 2>/dev/null || true
)"

det_plan_b="$(
  phoenix::generator_plan \
    "sprint" \
    "$DET_DEST" \
    "SPRINT_ID=G08" \
    "SPRINT_TITLE=Deterministic Sprint" \
    "SPRINT_SLUG=DETERMINISTIC_SPRINT" 2>/dev/null || true
)"

if [[ -n "$det_plan_a" && "$det_plan_a" == *"STATUS=PLAN"* ]]; then
  pass "determinism test operates on a valid Sprint plan"
else
  fail "determinism test operates on a valid Sprint plan"
fi

assert_equals \
  "identical Sprint request produces identical plan" \
  "$det_plan_a" \
  "$det_plan_b"


# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\n'
printf 'Sprint Generator End-to-End Tests\n'
printf '=================================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
