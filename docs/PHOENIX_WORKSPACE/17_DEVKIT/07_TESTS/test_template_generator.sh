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
  "register built-in generators for Template test" \
  phoenix::generator_register_builtins

assert_success \
  "template generator is registered" \
  phoenix::generator_exists "template"

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
  "template generator is appended after existing built-ins" \
  "$expected_builtin_list" \
  "$builtin_list"


# ------------------------------------------------------------------------------
# Definition contract
# ------------------------------------------------------------------------------

template_definition="$(
  phoenix::generator_resolve "template" 2>/dev/null || true
)"

assert_equals \
  "template definition declares canonical ID" \
  "template" \
  "$(definition_field "$template_definition" "ID" 2>/dev/null || true)"

assert_equals \
  "template definition declares canonical purpose" \
  "Generate a reusable Phoenix template skeleton" \
  "$(definition_field "$template_definition" "PURPOSE" 2>/dev/null || true)"

assert_equals \
  "template definition declares exact required variables" \
  "TEMPLATE_FILE" \
  "$(definition_field "$template_definition" "REQUIRED_VARIABLES" 2>/dev/null || true)"

assert_equals \
  "template definition declares scoped destination rule" \
  "scoped" \
  "$(definition_field "$template_definition" "DESTINATION_RULE" 2>/dev/null || true)"

assert_equals \
  "template definition denies overwrite requests" \
  "0" \
  "$(definition_field "$template_definition" "OVERWRITE_POLICY" 2>/dev/null || true)"

template_map_count="$(
  printf '%s\n' "$template_definition" |
    grep -c '^TEMPLATE_MAP=' || true
)"

assert_equals \
  "template definition declares exactly one template mapping" \
  "1" \
  "$template_map_count"

assert_equals \
  "template definition declares canonical template mapping" \
  "03_GENERATORS/templates/template/template.tpl=>{{TEMPLATE_FILE}}" \
  "$(definition_field "$template_definition" "TEMPLATE_MAP" 2>/dev/null || true)"


# ------------------------------------------------------------------------------
# Planning
# ------------------------------------------------------------------------------

TEMPLATE_DEST="${TEST_ROOT}/templates"

template_plan="$(
  phoenix::generator_plan \
    "template" \
    "$TEMPLATE_DEST" \
    "TEMPLATE_FILE=service.sh.tpl" 2>/dev/null || true
)"

expected_template_plan="$(cat <<PLAN
STATUS=PLAN
GENERATOR=template
DESTINATION=${TEMPLATE_DEST}
OVERWRITE=0
DRY_RUN=0
ARTIFACT=${TEMPLATE_DEST}/service.sh.tpl
PLAN
)"

assert_equals \
  "template generator produces canonical plan" \
  "$expected_template_plan" \
  "$template_plan"


# ------------------------------------------------------------------------------
# Missing required variable
# ------------------------------------------------------------------------------

assert_failure \
  "template generator rejects missing TEMPLATE_FILE" \
  phoenix::generator_run \
    "template" \
    "${TEST_ROOT}/missing-file"

if [[ ! -e "${TEST_ROOT}/missing-file" ]]; then
  pass "failed Template request performs zero filesystem mutation"
else
  fail "failed Template request performs zero filesystem mutation"
fi


# ------------------------------------------------------------------------------
# Filename preservation
# ------------------------------------------------------------------------------

README_DEST="${TEST_ROOT}/readme-template"

readme_plan="$(
  phoenix::generator_plan \
    "template" \
    "$README_DEST" \
    "TEMPLATE_FILE=README.md.tpl" 2>/dev/null || true
)"

expected_readme_plan="$(cat <<PLAN
STATUS=PLAN
GENERATOR=template
DESTINATION=${README_DEST}
OVERWRITE=0
DRY_RUN=0
ARTIFACT=${README_DEST}/README.md.tpl
PLAN
)"

assert_equals \
  "template generator preserves caller-supplied filename" \
  "$expected_readme_plan" \
  "$readme_plan"


# ------------------------------------------------------------------------------
# Execution
# ------------------------------------------------------------------------------

template_result="$(
  phoenix::generator_run \
    "template" \
    "$TEMPLATE_DEST" \
    "TEMPLATE_FILE=service.sh.tpl" 2>/dev/null || true
)"

expected_template_result="$(cat <<RESULT
STATUS=SUCCESS
GENERATOR=template
DESTINATION=${TEMPLATE_DEST}
ARTIFACT=${TEMPLATE_DEST}/service.sh.tpl
RESULT
)"

assert_equals \
  "template generator returns canonical execution result" \
  "$expected_template_result" \
  "$template_result"

TEMPLATE_FILE="${TEMPLATE_DEST}/service.sh.tpl"

if [[ -f "$TEMPLATE_FILE" ]]; then
  pass "template generator creates caller-named template file"
else
  fail "template generator creates caller-named template file"
fi


# ------------------------------------------------------------------------------
# Artifact cardinality
# ------------------------------------------------------------------------------

artifact_count="$(
  find "$TEMPLATE_DEST" -type f 2>/dev/null | wc -l | tr -d ' '
)"

assert_equals \
  "template generator creates exactly one artifact" \
  "1" \
  "$artifact_count"


# ------------------------------------------------------------------------------
# Generated content
# ------------------------------------------------------------------------------

actual_template_content="$(
  cat "$TEMPLATE_FILE" 2>/dev/null || true
)"

assert_equals \
  "generated Template contains canonical neutral skeleton" \
  "TBD" \
  "$actual_template_content"


# ------------------------------------------------------------------------------
# Nested templating guard
# ------------------------------------------------------------------------------

if [[ -n "$actual_template_content" ]]; then
  pass "placeholder guard operates on generated Template content"
else
  fail "placeholder guard operates on generated Template content"
fi

if phoenix::template_has_placeholders "$actual_template_content"; then
  fail "generated Template contains no Phoenix placeholders"
else
  pass "generated Template contains no Phoenix placeholders"
fi


# ------------------------------------------------------------------------------
# Source template immutability
# ------------------------------------------------------------------------------

SOURCE_TEMPLATE="${DEVKIT_ROOT}/03_GENERATORS/templates/template/template.tpl"

if [[ -f "$SOURCE_TEMPLATE" ]]; then
  pass "Template source exists before immutability test"
else
  fail "Template source exists before immutability test"
fi

source_before="$(
  cat "$SOURCE_TEMPLATE" 2>/dev/null || true
)"

IMMUTABILITY_DEST="${TEST_ROOT}/immutability"

phoenix::generator_run \
  "template" \
  "$IMMUTABILITY_DEST" \
  "TEMPLATE_FILE=immutable.tpl" >/dev/null 2>&1 || true

source_after="$(
  cat "$SOURCE_TEMPLATE" 2>/dev/null || true
)"

assert_equals \
  "Template generation preserves source template content" \
  "$source_before" \
  "$source_after"


# ------------------------------------------------------------------------------
# Dry-run
# ------------------------------------------------------------------------------

DRY_DEST="${TEST_ROOT}/dry-template"

dry_result="$(
  phoenix::generator_run \
    "template" \
    "$DRY_DEST" \
    "TEMPLATE_FILE=dry-run.tpl" \
    "PHOENIX_DRY_RUN=1" 2>/dev/null || true
)"

expected_dry_result="$(cat <<RESULT
STATUS=DRY_RUN
GENERATOR=template
DESTINATION=${DRY_DEST}
ARTIFACT=${DRY_DEST}/dry-run.tpl
RESULT
)"

assert_equals \
  "template dry-run returns canonical result" \
  "$expected_dry_result" \
  "$dry_result"

if [[ ! -e "$DRY_DEST" ]]; then
  pass "template dry-run performs zero filesystem mutation"
else
  fail "template dry-run performs zero filesystem mutation"
fi


# ------------------------------------------------------------------------------
# Overwrite protection
# ------------------------------------------------------------------------------

original_template_content="$(
  cat "$TEMPLATE_FILE" 2>/dev/null || true
)"

assert_failure \
  "template generator rejects existing target without overwrite" \
  phoenix::generator_run \
    "template" \
    "$TEMPLATE_DEST" \
    "TEMPLATE_FILE=service.sh.tpl"

after_failed_overwrite_content="$(
  cat "$TEMPLATE_FILE" 2>/dev/null || true
)"

assert_equals \
  "failed Template overwrite preserves existing artifact" \
  "$original_template_content" \
  "$after_failed_overwrite_content"

assert_failure \
  "template definition rejects explicit overwrite request" \
  phoenix::generator_run \
    "template" \
    "$TEMPLATE_DEST" \
    "TEMPLATE_FILE=service.sh.tpl" \
    "PHOENIX_OVERWRITE=1"


# ------------------------------------------------------------------------------
# Determinism
# ------------------------------------------------------------------------------

DET_DEST="${TEST_ROOT}/deterministic"

det_plan_a="$(
  phoenix::generator_plan \
    "template" \
    "$DET_DEST" \
    "TEMPLATE_FILE=deterministic.tpl" 2>/dev/null || true
)"

det_plan_b="$(
  phoenix::generator_plan \
    "template" \
    "$DET_DEST" \
    "TEMPLATE_FILE=deterministic.tpl" 2>/dev/null || true
)"

if [[ -n "$det_plan_a" && "$det_plan_a" == *"STATUS=PLAN"* ]]; then
  pass "determinism test operates on a valid Template plan"
else
  fail "determinism test operates on a valid Template plan"
fi

assert_equals \
  "identical Template request produces identical plan" \
  "$det_plan_a" \
  "$det_plan_b"


# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\n'
printf 'Template Generator End-to-End Tests\n'
printf '===================================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
