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


# ------------------------------------------------------------------------------
# Temporary Fixtures
# ------------------------------------------------------------------------------

TEST_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/phoenix-execution.XXXXXX")" || exit 1

cleanup() {
  rm -rf "$TEST_ROOT"
}

trap cleanup EXIT

INDEX_TEMPLATE="${TEST_ROOT}/index.tpl"
MANIFEST_TEMPLATE="${TEST_ROOT}/manifest.tpl"

cat > "$INDEX_TEMPLATE" <<'TPL'
provider={{PROVIDER_NAME}}
country={{COUNTRY}}
TPL

cat > "$MANIFEST_TEMPLATE" <<'TPL'
name={{PROVIDER_NAME}}
TPL


# ------------------------------------------------------------------------------
# Generator Definition
# ------------------------------------------------------------------------------

provider_definition="$(cat <<DEF
ID=execution-provider
PURPOSE=Execution provider test
TEMPLATE_MAP=${INDEX_TEMPLATE}=>index.sh
TEMPLATE_MAP=${MANIFEST_TEMPLATE}=>manifest.phoenix
REQUIRED_VARIABLES=PROVIDER_NAME,COUNTRY
DESTINATION_RULE=scoped
OVERWRITE_POLICY=1
DEF
)"

phoenix::generator_register \
  "execution-provider" \
  "$provider_definition" >/dev/null || exit 1


# ------------------------------------------------------------------------------
# Tranche 1 — Core Execution Contract
# ------------------------------------------------------------------------------

assert_failure \
  "run without arguments fails" \
  phoenix::generator_run

assert_failure \
  "run without destination fails" \
  phoenix::generator_run "execution-provider"

assert_failure \
  "unknown generator fails" \
  phoenix::generator_run \
  "unknown-generator" \
  "${TEST_ROOT}/unknown"


NORMAL_DEST="${TEST_ROOT}/normal"

normal_result="$(
  phoenix::generator_run \
    "execution-provider" \
    "$NORMAL_DEST" \
    "PROVIDER_NAME=Ricardo" \
    "COUNTRY=CH"
)"

expected_normal_result="$(cat <<RESULT
STATUS=SUCCESS
GENERATOR=execution-provider
DESTINATION=${NORMAL_DEST}
ARTIFACT=${NORMAL_DEST}/index.sh
ARTIFACT=${NORMAL_DEST}/manifest.phoenix
RESULT
)"

assert_equals \
  "successful execution returns canonical result" \
  "$expected_normal_result" \
  "$normal_result"


if [[ -f "${NORMAL_DEST}/index.sh" ]]; then
  pass "successful execution creates first artifact"
else
  fail "successful execution creates first artifact"
fi

if [[ -f "${NORMAL_DEST}/manifest.phoenix" ]]; then
  pass "successful execution creates second artifact"
else
  fail "successful execution creates second artifact"
fi


index_content="$(cat "${NORMAL_DEST}/index.sh" 2>/dev/null || true)"

expected_index_content="$(cat <<'CONTENT'
provider=Ricardo
country=CH
CONTENT
)"

assert_equals \
  "first artifact contains rendered content" \
  "$expected_index_content" \
  "$index_content"


manifest_content="$(cat "${NORMAL_DEST}/manifest.phoenix" 2>/dev/null || true)"

assert_equals \
  "second artifact contains rendered content" \
  "name=Ricardo" \
  "$manifest_content"


DRY_DEST="${TEST_ROOT}/dry-run"

dry_result="$(
  phoenix::generator_run \
    "execution-provider" \
    "$DRY_DEST" \
    "PROVIDER_NAME=Ricardo" \
    "COUNTRY=CH" \
    "PHOENIX_DRY_RUN=1"
)"

expected_dry_result="$(cat <<RESULT
STATUS=DRY_RUN
GENERATOR=execution-provider
DESTINATION=${DRY_DEST}
ARTIFACT=${DRY_DEST}/index.sh
ARTIFACT=${DRY_DEST}/manifest.phoenix
RESULT
)"

assert_equals \
  "dry-run returns canonical dry-run result" \
  "$expected_dry_result" \
  "$dry_result"


if [[ ! -e "$DRY_DEST" ]]; then
  pass "dry-run does not create destination"
else
  fail "dry-run does not create destination"
fi


assert_failure \
  "missing required variable fails execution" \
  phoenix::generator_run \
  "execution-provider" \
  "${TEST_ROOT}/missing-variable" \
  "PROVIDER_NAME=Ricardo"


if [[ ! -e "${TEST_ROOT}/missing-variable" ]]; then
  pass "failed planning causes zero mutation"
else
  fail "failed planning causes zero mutation"
fi

# ------------------------------------------------------------------------------
# Tranche 2 — Security, Overwrite and Pre-Mutation Hardening
# ------------------------------------------------------------------------------

# ------------------------------------------------------------------------------
# Overwrite denied without explicit authorization
# ------------------------------------------------------------------------------

OVERWRITE_DEST="${TEST_ROOT}/overwrite"
mkdir -p "$OVERWRITE_DEST"

printf '%s' 'ORIGINAL-CONTENT' > "${OVERWRITE_DEST}/index.sh"

assert_failure \
  "existing artifact is not overwritten without authorization" \
  phoenix::generator_run \
  "execution-provider" \
  "$OVERWRITE_DEST" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH"

overwrite_denied_content="$(
  cat "${OVERWRITE_DEST}/index.sh"
)"

assert_equals \
  "denied overwrite preserves existing artifact" \
  "ORIGINAL-CONTENT" \
  "$overwrite_denied_content"


# ------------------------------------------------------------------------------
# Explicit overwrite
# ------------------------------------------------------------------------------

assert_success \
  "explicit overwrite authorization succeeds" \
  phoenix::generator_run \
  "execution-provider" \
  "$OVERWRITE_DEST" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH" \
  "PHOENIX_OVERWRITE=1"

overwrite_content="$(
  cat "${OVERWRITE_DEST}/index.sh"
)"

expected_overwrite_content="$(cat <<'CONTENT'
provider=Ricardo
country=CH
CONTENT
)"

assert_equals \
  "authorized overwrite replaces planned artifact" \
  "$expected_overwrite_content" \
  "$overwrite_content"


# ------------------------------------------------------------------------------
# Shell-like values remain literal
# ------------------------------------------------------------------------------

SHELL_MARKER="${TEST_ROOT}/shell-value-executed"

shell_value='$(touch '"${SHELL_MARKER}"')'

SHELL_DEST="${TEST_ROOT}/shell-value"

assert_success \
  "shell-like template value is accepted as literal data" \
  phoenix::generator_run \
  "execution-provider" \
  "$SHELL_DEST" \
  "PROVIDER_NAME=$shell_value" \
  "COUNTRY=CH"

if [[ ! -e "$SHELL_MARKER" ]]; then
  pass "shell-like template value is not executed"
else
  fail "shell-like template value is not executed"
fi

shell_rendered_content="$(
  cat "${SHELL_DEST}/index.sh"
)"

expected_shell_content="$(cat <<CONTENT
provider=${shell_value}
country=CH
CONTENT
)"

assert_equals \
  "shell-like value is rendered literally" \
  "$expected_shell_content" \
  "$shell_rendered_content"


# ------------------------------------------------------------------------------
# Environment isolation
# ------------------------------------------------------------------------------

export PROVIDER_NAME="FROM_ENVIRONMENT"

ENV_DEST="${TEST_ROOT}/environment"

assert_failure \
  "required variable is not imported from environment" \
  phoenix::generator_run \
  "execution-provider" \
  "$ENV_DEST" \
  "COUNTRY=CH"

if [[ ! -e "$ENV_DEST" ]]; then
  pass "environment isolation failure causes zero mutation"
else
  fail "environment isolation failure causes zero mutation"
fi

unset PROVIDER_NAME


# ------------------------------------------------------------------------------
# Render-all-before-first-write
# ------------------------------------------------------------------------------

VALID_PREWRITE_TEMPLATE="${TEST_ROOT}/prewrite-valid.tpl"
BROKEN_PREWRITE_TEMPLATE="${TEST_ROOT}/prewrite-broken.tpl"

cat > "$VALID_PREWRITE_TEMPLATE" <<'TPL'
first={{NAME}}
TPL

cat > "$BROKEN_PREWRITE_TEMPLATE" <<'TPL'
second={{MISSING_VALUE}}
TPL

prewrite_definition="$(cat <<DEF
ID=prewrite-test
PURPOSE=Pre-mutation rendering test
TEMPLATE_MAP=${VALID_PREWRITE_TEMPLATE}=>first.txt
TEMPLATE_MAP=${BROKEN_PREWRITE_TEMPLATE}=>second.txt
REQUIRED_VARIABLES=NAME
DESTINATION_RULE=scoped
OVERWRITE_POLICY=0
DEF
)"

phoenix::generator_register \
  "prewrite-test" \
  "$prewrite_definition" >/dev/null || exit 1

PREWRITE_DEST="${TEST_ROOT}/prewrite"

assert_failure \
  "multi-artifact rendering failure fails execution" \
  phoenix::generator_run \
  "prewrite-test" \
  "$PREWRITE_DEST" \
  "NAME=Phoenix"

if [[ ! -e "$PREWRITE_DEST" ]]; then
  pass "rendering failure occurs before first filesystem mutation"
else
  fail "rendering failure occurs before first filesystem mutation"
fi


# ------------------------------------------------------------------------------
# Failed execution must never report success
# ------------------------------------------------------------------------------

failure_output="$(
  phoenix::generator_run \
    "prewrite-test" \
    "${TEST_ROOT}/failure-result" \
    "NAME=Phoenix" 2>/dev/null || true
)"

case "$failure_output" in
  *"STATUS=SUCCESS"*)
    fail "failed execution never reports STATUS=SUCCESS"
    ;;
  *)
    pass "failed execution never reports STATUS=SUCCESS"
    ;;
esac


# ------------------------------------------------------------------------------
# Dry-run with existing artifact and overwrite authorization
# ------------------------------------------------------------------------------

DRY_OVERWRITE_DEST="${TEST_ROOT}/dry-overwrite"
mkdir -p "$DRY_OVERWRITE_DEST"

printf '%s' 'KEEP-ME' > "${DRY_OVERWRITE_DEST}/index.sh"

assert_success \
  "dry-run validates existing artifact with overwrite authorization" \
  phoenix::generator_run \
  "execution-provider" \
  "$DRY_OVERWRITE_DEST" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH" \
  "PHOENIX_OVERWRITE=1" \
  "PHOENIX_DRY_RUN=1"

dry_overwrite_content="$(
  cat "${DRY_OVERWRITE_DEST}/index.sh"
)"

assert_equals \
  "dry-run never overwrites existing artifact" \
  "KEEP-ME" \
  "$dry_overwrite_content"

# ------------------------------------------------------------------------------
# Tranche 3 — Certification
# ------------------------------------------------------------------------------

# ------------------------------------------------------------------------------
# Artifact order preservation
# ------------------------------------------------------------------------------

ORDER_DEST="${TEST_ROOT}/order"

order_result="$(
  phoenix::generator_run \
    "execution-provider" \
    "$ORDER_DEST" \
    "PROVIDER_NAME=Ricardo" \
    "COUNTRY=CH"
)"

expected_order_result="$(cat <<RESULT
STATUS=SUCCESS
GENERATOR=execution-provider
DESTINATION=${ORDER_DEST}
ARTIFACT=${ORDER_DEST}/index.sh
ARTIFACT=${ORDER_DEST}/manifest.phoenix
RESULT
)"

assert_equals \
  "execution result preserves Generator Definition artifact order" \
  "$expected_order_result" \
  "$order_result"


# ------------------------------------------------------------------------------
# Duplicate variables: first match wins
# ------------------------------------------------------------------------------

DUPLICATE_DEST="${TEST_ROOT}/duplicate-variable"

assert_success \
  "duplicate normal variables remain valid in execution" \
  phoenix::generator_run \
  "execution-provider" \
  "$DUPLICATE_DEST" \
  "PROVIDER_NAME=First" \
  "PROVIDER_NAME=Second" \
  "COUNTRY=CH"

duplicate_content="$(
  cat "${DUPLICATE_DEST}/index.sh"
)"

expected_duplicate_content="$(cat <<'CONTENT'
provider=First
country=CH
CONTENT
)"

assert_equals \
  "execution preserves first-match-wins variable policy" \
  "$expected_duplicate_content" \
  "$duplicate_content"


# ------------------------------------------------------------------------------
# Missing template propagation
# ------------------------------------------------------------------------------

missing_execution_definition="$(cat <<DEF
ID=execution-missing-template
PURPOSE=Missing template execution test
TEMPLATE_MAP=${TEST_ROOT}/missing-template.tpl=>output.txt
REQUIRED_VARIABLES=NAME
DESTINATION_RULE=scoped
OVERWRITE_POLICY=0
DEF
)"

phoenix::generator_register \
  "execution-missing-template" \
  "$missing_execution_definition" >/dev/null || exit 1

MISSING_EXEC_DEST="${TEST_ROOT}/missing-template-output"

assert_failure \
  "missing template fails execution" \
  phoenix::generator_run \
  "execution-missing-template" \
  "$MISSING_EXEC_DEST" \
  "NAME=Phoenix"

if [[ ! -e "$MISSING_EXEC_DEST" ]]; then
  pass "missing template failure causes zero mutation"
else
  fail "missing template failure causes zero mutation"
fi


# ------------------------------------------------------------------------------
# Overwrite only planned artifacts
# ------------------------------------------------------------------------------

SCOPED_DEST="${TEST_ROOT}/scoped-overwrite"
mkdir -p "$SCOPED_DEST"

printf '%s' 'OLD-INDEX' > "${SCOPED_DEST}/index.sh"
printf '%s' 'UNRELATED' > "${SCOPED_DEST}/unrelated.txt"

assert_success \
  "overwrite succeeds for planned artifacts only" \
  phoenix::generator_run \
  "execution-provider" \
  "$SCOPED_DEST" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH" \
  "PHOENIX_OVERWRITE=1"

unrelated_content="$(
  cat "${SCOPED_DEST}/unrelated.txt"
)"

assert_equals \
  "overwrite leaves unrelated artifact untouched" \
  "UNRELATED" \
  "$unrelated_content"


# ------------------------------------------------------------------------------
# Deterministic successful result
# ------------------------------------------------------------------------------

DET_A="${TEST_ROOT}/det-a"
DET_B="${TEST_ROOT}/det-b"

det_result_a="$(
  phoenix::generator_run \
    "execution-provider" \
    "$DET_A" \
    "PROVIDER_NAME=Ricardo" \
    "COUNTRY=CH"
)"

rm -rf "$DET_A"

det_result_b="$(
  phoenix::generator_run \
    "execution-provider" \
    "$DET_A" \
    "PROVIDER_NAME=Ricardo" \
    "COUNTRY=CH"
)"

assert_equals \
  "identical execution request produces identical result" \
  "$det_result_a" \
  "$det_result_b"


# ------------------------------------------------------------------------------
# Complex multiline content preservation
# ------------------------------------------------------------------------------

MULTILINE_TEMPLATE="${TEST_ROOT}/multiline.tpl"

cat > "$MULTILINE_TEMPLATE" <<'TPL'
line1={{NAME}}

line3={{COUNTRY}}
literal=$HOME
TPL

multiline_definition="$(cat <<DEF
ID=execution-multiline
PURPOSE=Multiline preservation test
TEMPLATE_MAP=${MULTILINE_TEMPLATE}=>multiline.txt
REQUIRED_VARIABLES=NAME,COUNTRY
DESTINATION_RULE=scoped
OVERWRITE_POLICY=0
DEF
)"

phoenix::generator_register \
  "execution-multiline" \
  "$multiline_definition" >/dev/null || exit 1

MULTILINE_DEST="${TEST_ROOT}/multiline-output"

assert_success \
  "complex multiline artifact executes successfully" \
  phoenix::generator_run \
  "execution-multiline" \
  "$MULTILINE_DEST" \
  "NAME=Phoenix" \
  "COUNTRY=CH"

multiline_content="$(
  cat "${MULTILINE_DEST}/multiline.txt"
)"

expected_multiline_content="$(cat <<'CONTENT'
line1=Phoenix

line3=CH
literal=$HOME
CONTENT
)"

assert_equals \
  "complex multiline content is preserved exactly" \
  "$expected_multiline_content" \
  "$multiline_content"
# ------------------------------------------------------------------------------
# G05 — Rendered Artifact Mapping Execution
# ------------------------------------------------------------------------------

DYNAMIC_EXEC_TEMPLATE="${TEST_ROOT}/dynamic-exec.tpl"

cat > "$DYNAMIC_EXEC_TEMPLATE" <<'TPL'
title={{ADR_TITLE}}
TPL

dynamic_exec_definition="$(cat <<DEF
ID=execution-dynamic-mapping
PURPOSE=Rendered artifact mapping execution test
TEMPLATE_MAP=${DYNAMIC_EXEC_TEMPLATE}=>ADR-{{ADR_NUMBER}}_{{ADR_FILE_TITLE}}.md
REQUIRED_VARIABLES=ADR_NUMBER,ADR_TITLE,ADR_FILE_TITLE
DESTINATION_RULE=scoped
OVERWRITE_POLICY=0
DEF
)"

phoenix::generator_register \
  "execution-dynamic-mapping" \
  "$dynamic_exec_definition" >/dev/null || exit 1

DYNAMIC_EXEC_DEST="${TEST_ROOT}/dynamic-execution"

dynamic_exec_result="$(
  phoenix::generator_run \
    "execution-dynamic-mapping" \
    "$DYNAMIC_EXEC_DEST" \
    "ADR_NUMBER=013" \
    "ADR_TITLE=Generator Artifact Naming" \
    "ADR_FILE_TITLE=GENERATOR_ARTIFACT_NAMING"
)"

expected_dynamic_exec_result="$(cat <<RESULT
STATUS=SUCCESS
GENERATOR=execution-dynamic-mapping
DESTINATION=${DYNAMIC_EXEC_DEST}
ARTIFACT=${DYNAMIC_EXEC_DEST}/ADR-013_GENERATOR_ARTIFACT_NAMING.md
RESULT
)"

assert_equals \
  "execution returns rendered artifact mapping" \
  "$expected_dynamic_exec_result" \
  "$dynamic_exec_result"

DYNAMIC_EXEC_FILE="${DYNAMIC_EXEC_DEST}/ADR-013_GENERATOR_ARTIFACT_NAMING.md"

if [[ -f "$DYNAMIC_EXEC_FILE" ]]; then
  pass "execution writes rendered artifact filename"
else
  fail "execution writes rendered artifact filename"
fi

dynamic_exec_content="$(
  cat "$DYNAMIC_EXEC_FILE" 2>/dev/null || true
)"

assert_equals \
  "rendered artifact contains expected content" \
  "title=Generator Artifact Naming" \
  "$dynamic_exec_content"


# ------------------------------------------------------------------------------
# Rendered path safety propagates through execution
# ------------------------------------------------------------------------------

DYNAMIC_PATH_TEMPLATE="${TEST_ROOT}/dynamic-path.tpl"

cat > "$DYNAMIC_PATH_TEMPLATE" <<'TPL'
name={{NAME}}
TPL

dynamic_path_definition="$(cat <<DEF
ID=execution-dynamic-path
PURPOSE=Rendered execution path safety test
TEMPLATE_MAP=${DYNAMIC_PATH_TEMPLATE}=>{{ARTIFACT_PATH}}
REQUIRED_VARIABLES=NAME,ARTIFACT_PATH
DESTINATION_RULE=scoped
OVERWRITE_POLICY=0
DEF
)"

phoenix::generator_register \
  "execution-dynamic-path" \
  "$dynamic_path_definition" >/dev/null || exit 1

DYNAMIC_PATH_DEST="${TEST_ROOT}/dynamic-path-output"

assert_failure \
  "execution rejects rendered traversal artifact path" \
  phoenix::generator_run \
  "execution-dynamic-path" \
  "$DYNAMIC_PATH_DEST" \
  "NAME=Phoenix" \
  "ARTIFACT_PATH=../escape.md"

if [[ ! -e "$DYNAMIC_PATH_DEST" ]]; then
  pass "rendered traversal failure causes zero mutation"
else
  fail "rendered traversal failure causes zero mutation"
fi

assert_failure \
  "execution rejects rendered absolute artifact path" \
  phoenix::generator_run \
  "execution-dynamic-path" \
  "$DYNAMIC_PATH_DEST" \
  "NAME=Phoenix" \
  "ARTIFACT_PATH=/tmp/phoenix-execution-escape.md"


# ------------------------------------------------------------------------------
# Shell-like artifact mapping values remain inert during execution
# ------------------------------------------------------------------------------

DYNAMIC_EXEC_SHELL_MARKER="${TEST_ROOT}/dynamic-exec-shell-marker"
dynamic_exec_shell_value='$(touch '"${DYNAMIC_EXEC_SHELL_MARKER}"')'

SHELL_DYNAMIC_DEST="${TEST_ROOT}/dynamic-shell"

assert_success \
  "execution accepts shell-like mapping value as literal data" \
  phoenix::generator_run \
  "execution-dynamic-path" \
  "$SHELL_DYNAMIC_DEST" \
  "NAME=Phoenix" \
  "ARTIFACT_PATH=${dynamic_exec_shell_value}"

if [[ ! -e "$DYNAMIC_EXEC_SHELL_MARKER" ]]; then
  pass "execution does not execute shell-like artifact mapping value"
else
  fail "execution does not execute shell-like artifact mapping value"
fi

SHELL_DYNAMIC_FILE="${SHELL_DYNAMIC_DEST}/${dynamic_exec_shell_value}"

if [[ -f "$SHELL_DYNAMIC_FILE" ]]; then
  pass "execution preserves shell-like artifact filename literally"
else
  fail "execution preserves shell-like artifact filename literally"
fi
# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\n'
printf 'Generator Execution Tests — Tranche 1 + 2 + 3\n'
printf '=====================================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
