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

source "${DEVKIT_ROOT}/03_GENERATORS/planning.sh"


# ------------------------------------------------------------------------------
# Temporary Test Fixtures
# ------------------------------------------------------------------------------

TEST_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/phoenix-planning.XXXXXX")" || exit 1

cleanup() {
  rm -rf "$TEST_ROOT"
}

trap cleanup EXIT

PROVIDER_INDEX_TEMPLATE="${TEST_ROOT}/provider-index.sh"
PROVIDER_MANIFEST_TEMPLATE="${TEST_ROOT}/provider-manifest.phoenix"
VALIDATOR_TEMPLATE="${TEST_ROOT}/validator-index.sh"

cat > "$PROVIDER_INDEX_TEMPLATE" <<'TPL'
provider={{PROVIDER_NAME}}
country={{COUNTRY}}
TPL

cat > "$PROVIDER_MANIFEST_TEMPLATE" <<'TPL'
name={{PROVIDER_NAME}}
TPL

cat > "$VALIDATOR_TEMPLATE" <<'TPL'
validator={{VALIDATOR_NAME}}
TPL


# ------------------------------------------------------------------------------
# Generator Definitions
# ------------------------------------------------------------------------------

provider_definition="$(cat <<DEF
ID=provider
PURPOSE=Generate provider
TEMPLATE_MAP=${PROVIDER_INDEX_TEMPLATE}=>index.sh
TEMPLATE_MAP=${PROVIDER_MANIFEST_TEMPLATE}=>manifest.phoenix
REQUIRED_VARIABLES=PROVIDER_NAME,COUNTRY
DESTINATION_RULE=scoped
OVERWRITE_POLICY=1
DEF
)"

validator_definition="$(cat <<DEF
ID=validator
PURPOSE=Generate validator
TEMPLATE_MAP=${VALIDATOR_TEMPLATE}=>index.sh
REQUIRED_VARIABLES=VALIDATOR_NAME
DESTINATION_RULE=scoped
OVERWRITE_POLICY=0
DEF
)"

phoenix::generator_register \
  "provider" \
  "$provider_definition" >/dev/null || exit 1

phoenix::generator_register \
  "validator" \
  "$validator_definition" >/dev/null || exit 1


# ------------------------------------------------------------------------------
# Tranche 1 — Regression
# ------------------------------------------------------------------------------

assert_failure \
  "plan without arguments fails" \
  phoenix::generator_plan

assert_failure \
  "plan without destination fails" \
  phoenix::generator_plan "provider"

assert_failure \
  "plan with empty generator id fails" \
  phoenix::generator_plan \
  "" "./output" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH"

assert_failure \
  "plan with empty destination fails" \
  phoenix::generator_plan \
  "provider" "" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH"

assert_failure \
  "unknown generator fails" \
  phoenix::generator_plan \
  "unknown" "./output"

assert_failure \
  "missing required variables fail" \
  phoenix::generator_plan \
  "provider" "./output"

assert_failure \
  "missing one required variable fails" \
  phoenix::generator_plan \
  "provider" "./output" \
  "PROVIDER_NAME=Ricardo"

assert_success \
  "all required variables accepted" \
  phoenix::generator_plan \
  "provider" "./output" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH"

assert_failure \
  "argument without KEY=VALUE format fails" \
  phoenix::generator_plan \
  "provider" "./output" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH" \
  "INVALID"

assert_success \
  "dry-run zero accepted" \
  phoenix::generator_plan \
  "provider" "./output" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH" \
  "PHOENIX_DRY_RUN=0"

assert_success \
  "dry-run one accepted" \
  phoenix::generator_plan \
  "provider" "./output" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH" \
  "PHOENIX_DRY_RUN=1"

assert_failure \
  "invalid dry-run value fails" \
  phoenix::generator_plan \
  "provider" "./output" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH" \
  "PHOENIX_DRY_RUN=yes"

assert_failure \
  "duplicate dry-run option fails" \
  phoenix::generator_plan \
  "provider" "./output" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH" \
  "PHOENIX_DRY_RUN=0" \
  "PHOENIX_DRY_RUN=1"

assert_failure \
  "duplicate overwrite option fails" \
  phoenix::generator_plan \
  "provider" "./output" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH" \
  "PHOENIX_OVERWRITE=0" \
  "PHOENIX_OVERWRITE=1"

assert_failure \
  "unknown reserved option fails" \
  phoenix::generator_plan \
  "provider" "./output" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH" \
  "PHOENIX_UNKNOWN=1"

assert_success \
  "generator allowing overwrite accepts authorization" \
  phoenix::generator_plan \
  "provider" "./output" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH" \
  "PHOENIX_OVERWRITE=1"

assert_failure \
  "generator denying overwrite rejects authorization" \
  phoenix::generator_plan \
  "validator" "./output" \
  "VALIDATOR_NAME=Example" \
  "PHOENIX_OVERWRITE=1"


actual_plan="$(
  phoenix::generator_plan \
    "provider" \
    "./providers/ricardo" \
    "PROVIDER_NAME=Ricardo" \
    "COUNTRY=CH"
)"

expected_plan="$(cat <<'PLAN'
STATUS=PLAN
GENERATOR=provider
DESTINATION=./providers/ricardo
OVERWRITE=0
DRY_RUN=0
ARTIFACT=./providers/ricardo/index.sh
ARTIFACT=./providers/ricardo/manifest.phoenix
PLAN
)"

assert_equals \
  "plan output follows canonical v1.0 order" \
  "$expected_plan" \
  "$actual_plan"

second_plan="$(
  phoenix::generator_plan \
    "provider" \
    "./providers/ricardo" \
    "PROVIDER_NAME=Ricardo" \
    "COUNTRY=CH"
)"

assert_equals \
  "identical request produces identical plan" \
  "$actual_plan" \
  "$second_plan"

assert_success \
  "duplicate normal variables remain valid" \
  phoenix::generator_plan \
  "provider" "./duplicate-vars" \
  "PROVIDER_NAME=First" \
  "PROVIDER_NAME=Second" \
  "COUNTRY=CH"


# ------------------------------------------------------------------------------
# Tranche 2 — Hardening
# ------------------------------------------------------------------------------

missing_template_definition="$(cat <<DEF
ID=missing-template
PURPOSE=Missing template test
TEMPLATE_MAP=${TEST_ROOT}/does-not-exist.tpl=>output.txt
REQUIRED_VARIABLES=NAME
DESTINATION_RULE=scoped
OVERWRITE_POLICY=0
DEF
)"

phoenix::generator_register \
  "missing-template" \
  "$missing_template_definition" >/dev/null || exit 1

assert_failure \
  "missing template source fails planning" \
  phoenix::generator_plan \
  "missing-template" \
  "${TEST_ROOT}/missing-output" \
  "NAME=Phoenix"


mkdir "${TEST_ROOT}/template-directory"

directory_template_definition="$(cat <<DEF
ID=directory-template
PURPOSE=Directory template test
TEMPLATE_MAP=${TEST_ROOT}/template-directory=>output.txt
REQUIRED_VARIABLES=NAME
DESTINATION_RULE=scoped
OVERWRITE_POLICY=0
DEF
)"

phoenix::generator_register \
  "directory-template" \
  "$directory_template_definition" >/dev/null || exit 1

assert_failure \
  "template source must be regular file" \
  phoenix::generator_plan \
  "directory-template" \
  "${TEST_ROOT}/directory-output" \
  "NAME=Phoenix"


BROKEN_TEMPLATE="${TEST_ROOT}/broken.tpl"

cat > "$BROKEN_TEMPLATE" <<'TPL'
name={{MISSING_VALUE}}
TPL

broken_render_definition="$(cat <<DEF
ID=broken-render
PURPOSE=Rendering feasibility test
TEMPLATE_MAP=${BROKEN_TEMPLATE}=>output.txt
REQUIRED_VARIABLES=NAME
DESTINATION_RULE=scoped
OVERWRITE_POLICY=0
DEF
)"

phoenix::generator_register \
  "broken-render" \
  "$broken_render_definition" >/dev/null || exit 1

assert_failure \
  "unresolved template placeholder fails planning" \
  phoenix::generator_plan \
  "broken-render" \
  "${TEST_ROOT}/broken-output" \
  "NAME=Phoenix"


CONFLICT_DESTINATION="${TEST_ROOT}/conflict"
mkdir "$CONFLICT_DESTINATION"
printf 'existing\n' > "${CONFLICT_DESTINATION}/index.sh"

assert_failure \
  "existing artifact conflicts when overwrite disabled" \
  phoenix::generator_plan \
  "provider" \
  "$CONFLICT_DESTINATION" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH"

assert_success \
  "existing artifact accepted with explicit overwrite authorization" \
  phoenix::generator_plan \
  "provider" \
  "$CONFLICT_DESTINATION" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH" \
  "PHOENIX_OVERWRITE=1"


NO_MUTATION_DESTINATION="${TEST_ROOT}/must-not-exist"

assert_success \
  "planning succeeds for nonexistent destination without creating it" \
  phoenix::generator_plan \
  "provider" \
  "$NO_MUTATION_DESTINATION" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH"

if [[ ! -e "$NO_MUTATION_DESTINATION" ]]; then
  pass "planning does not create destination"
else
  fail "planning does not create destination"
fi


# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\n'
printf 'Generator Planning Tests\n'
printf '========================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
