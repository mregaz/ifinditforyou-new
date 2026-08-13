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

TEST_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/phoenix-documentation-generator.XXXXXX")"

cleanup() {
  rm -rf "$TEST_ROOT"
}

trap cleanup EXIT


# ------------------------------------------------------------------------------
# Registration
# ------------------------------------------------------------------------------

assert_success \
  "register built-in generators for Documentation test" \
  phoenix::generator_register_builtins

assert_success \
  "documentation generator is registered" \
  phoenix::generator_exists "documentation"

builtin_list="$(
  phoenix::generator_list
)"

expected_builtin_list="$(cat <<'LIST'
provider
adr
sprint
documentation
template
LIST
)"

assert_equals \
  "documentation generator preserves canonical built-in order" \
  "$expected_builtin_list" \
  "$builtin_list"


# ------------------------------------------------------------------------------
# Definition contract
# ------------------------------------------------------------------------------

documentation_definition="$(
  phoenix::generator_resolve "documentation" 2>/dev/null || true
)"

assert_equals \
  "documentation definition declares canonical ID" \
  "documentation" \
  "$(definition_field "$documentation_definition" "ID" 2>/dev/null || true)"

assert_equals \
  "documentation definition declares canonical purpose" \
  "Generate a canonical Phoenix documentation skeleton" \
  "$(definition_field "$documentation_definition" "PURPOSE" 2>/dev/null || true)"

assert_equals \
  "documentation definition declares exact required variables" \
  "DOCUMENT_TITLE,DOCUMENT_SLUG" \
  "$(definition_field "$documentation_definition" "REQUIRED_VARIABLES" 2>/dev/null || true)"

assert_equals \
  "documentation definition declares scoped destination rule" \
  "scoped" \
  "$(definition_field "$documentation_definition" "DESTINATION_RULE" 2>/dev/null || true)"

assert_equals \
  "documentation definition denies overwrite requests" \
  "0" \
  "$(definition_field "$documentation_definition" "OVERWRITE_POLICY" 2>/dev/null || true)"

template_map_count="$(
  printf '%s\n' "$documentation_definition" |
    grep -c '^TEMPLATE_MAP=' || true
)"

assert_equals \
  "documentation definition declares exactly one template mapping" \
  "1" \
  "$template_map_count"

assert_equals \
  "documentation definition declares canonical template mapping" \
  "03_GENERATORS/templates/documentation/documentation.md.tpl=>{{DOCUMENT_SLUG}}.md" \
  "$(definition_field "$documentation_definition" "TEMPLATE_MAP" 2>/dev/null || true)"


# ------------------------------------------------------------------------------
# Planning
# ------------------------------------------------------------------------------

DOCUMENT_DEST="${TEST_ROOT}/documentation"

documentation_plan="$(
  phoenix::generator_plan \
    "documentation" \
    "$DOCUMENT_DEST" \
    "DOCUMENT_TITLE=Generator Security Model" \
    "DOCUMENT_SLUG=GENERATOR_SECURITY_MODEL" 2>/dev/null || true
)"

expected_documentation_plan="$(cat <<PLAN
STATUS=PLAN
GENERATOR=documentation
DESTINATION=${DOCUMENT_DEST}
OVERWRITE=0
DRY_RUN=0
ARTIFACT=${DOCUMENT_DEST}/GENERATOR_SECURITY_MODEL.md
PLAN
)"

assert_equals \
  "documentation generator produces canonical plan" \
  "$expected_documentation_plan" \
  "$documentation_plan"


# ------------------------------------------------------------------------------
# Missing required variables
# ------------------------------------------------------------------------------

assert_failure \
  "documentation generator rejects missing DOCUMENT_TITLE" \
  phoenix::generator_run \
    "documentation" \
    "${TEST_ROOT}/missing-title" \
    "DOCUMENT_SLUG=MISSING_TITLE"

assert_failure \
  "documentation generator rejects missing DOCUMENT_SLUG" \
  phoenix::generator_run \
    "documentation" \
    "${TEST_ROOT}/missing-slug" \
    "DOCUMENT_TITLE=Missing Slug"

if [[ ! -e "${TEST_ROOT}/missing-title" &&
      ! -e "${TEST_ROOT}/missing-slug" ]]; then
  pass "failed Documentation requests perform zero filesystem mutation"
else
  fail "failed Documentation requests perform zero filesystem mutation"
fi


# ------------------------------------------------------------------------------
# Execution
# ------------------------------------------------------------------------------

documentation_result="$(
  phoenix::generator_run \
    "documentation" \
    "$DOCUMENT_DEST" \
    "DOCUMENT_TITLE=Generator Security Model" \
    "DOCUMENT_SLUG=GENERATOR_SECURITY_MODEL" 2>/dev/null || true
)"

expected_documentation_result="$(cat <<RESULT
STATUS=SUCCESS
GENERATOR=documentation
DESTINATION=${DOCUMENT_DEST}
ARTIFACT=${DOCUMENT_DEST}/GENERATOR_SECURITY_MODEL.md
RESULT
)"

assert_equals \
  "documentation generator returns canonical execution result" \
  "$expected_documentation_result" \
  "$documentation_result"


DOCUMENT_FILE="${DOCUMENT_DEST}/GENERATOR_SECURITY_MODEL.md"

if [[ -f "$DOCUMENT_FILE" ]]; then
  pass "documentation generator creates canonical Markdown file"
else
  fail "documentation generator creates canonical Markdown file"
fi


# ------------------------------------------------------------------------------
# Artifact cardinality
# ------------------------------------------------------------------------------

artifact_count="$(
  find "$DOCUMENT_DEST" -type f 2>/dev/null | wc -l | tr -d ' '
)"

assert_equals \
  "documentation generator creates exactly one artifact" \
  "1" \
  "$artifact_count"


# ------------------------------------------------------------------------------
# Generated content
# ------------------------------------------------------------------------------

actual_documentation_content="$(
  cat "$DOCUMENT_FILE" 2>/dev/null || true
)"

expected_documentation_content="$(cat <<'CONTENT'
# Generator Security Model

## Status

DRAFT

## Purpose

TBD

## Scope

TBD

## Responsibilities

- TBD

## Non-Responsibilities

- TBD

## Contract

TBD

## Usage

TBD

## Validation

### Automated

- TBD

### Manual

- TBD
CONTENT
)"

assert_equals \
  "generated Documentation contains canonical v1.0 structure" \
  "$expected_documentation_content" \
  "$actual_documentation_content"


# ------------------------------------------------------------------------------
# Dry-run
# ------------------------------------------------------------------------------

DRY_DEST="${TEST_ROOT}/dry-documentation"

dry_result="$(
  phoenix::generator_run \
    "documentation" \
    "$DRY_DEST" \
    "DOCUMENT_TITLE=Dry Run Document" \
    "DOCUMENT_SLUG=DRY_RUN_DOCUMENT" \
    "PHOENIX_DRY_RUN=1" 2>/dev/null || true
)"

expected_dry_result="$(cat <<RESULT
STATUS=DRY_RUN
GENERATOR=documentation
DESTINATION=${DRY_DEST}
ARTIFACT=${DRY_DEST}/DRY_RUN_DOCUMENT.md
RESULT
)"

assert_equals \
  "documentation dry-run returns canonical result" \
  "$expected_dry_result" \
  "$dry_result"

if [[ ! -e "$DRY_DEST" ]]; then
  pass "documentation dry-run performs zero filesystem mutation"
else
  fail "documentation dry-run performs zero filesystem mutation"
fi


# ------------------------------------------------------------------------------
# Overwrite protection
# ------------------------------------------------------------------------------

original_documentation_content="$(
  cat "$DOCUMENT_FILE" 2>/dev/null || true
)"

assert_failure \
  "documentation generator rejects existing target without overwrite" \
  phoenix::generator_run \
    "documentation" \
    "$DOCUMENT_DEST" \
    "DOCUMENT_TITLE=Changed Security Model" \
    "DOCUMENT_SLUG=GENERATOR_SECURITY_MODEL"

after_failed_overwrite_content="$(
  cat "$DOCUMENT_FILE" 2>/dev/null || true
)"

assert_equals \
  "failed Documentation overwrite preserves existing artifact" \
  "$original_documentation_content" \
  "$after_failed_overwrite_content"

assert_failure \
  "documentation definition rejects explicit overwrite request" \
  phoenix::generator_run \
    "documentation" \
    "$DOCUMENT_DEST" \
    "DOCUMENT_TITLE=Changed Security Model" \
    "DOCUMENT_SLUG=GENERATOR_SECURITY_MODEL" \
    "PHOENIX_OVERWRITE=1"


# ------------------------------------------------------------------------------
# Determinism
# ------------------------------------------------------------------------------

DET_DEST="${TEST_ROOT}/deterministic"

det_plan_a="$(
  phoenix::generator_plan \
    "documentation" \
    "$DET_DEST" \
    "DOCUMENT_TITLE=Deterministic Document" \
    "DOCUMENT_SLUG=DETERMINISTIC_DOCUMENT" 2>/dev/null || true
)"

det_plan_b="$(
  phoenix::generator_plan \
    "documentation" \
    "$DET_DEST" \
    "DOCUMENT_TITLE=Deterministic Document" \
    "DOCUMENT_SLUG=DETERMINISTIC_DOCUMENT" 2>/dev/null || true
)"

if [[ -n "$det_plan_a" && "$det_plan_a" == *"STATUS=PLAN"* ]]; then
  pass "determinism test operates on a valid Documentation plan"
else
  fail "determinism test operates on a valid Documentation plan"
fi

assert_equals \
  "identical Documentation request produces identical plan" \
  "$det_plan_a" \
  "$det_plan_b"


# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\n'
printf 'Documentation Generator End-to-End Tests\n'
printf '========================================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
