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
# Test Definitions
# ------------------------------------------------------------------------------

provider_definition="$(cat <<'DEF'
ID=provider
PURPOSE=Generate provider
TEMPLATE_MAP=templates/provider/index.sh=>index.sh
TEMPLATE_MAP=templates/provider/manifest.phoenix=>manifest.phoenix
REQUIRED_VARIABLES=PROVIDER_NAME,COUNTRY
DESTINATION_RULE=scoped
OVERWRITE_POLICY=1
DEF
)"

validator_definition="$(cat <<'DEF'
ID=validator
PURPOSE=Generate validator
TEMPLATE_MAP=templates/validator/index.sh=>index.sh
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
# Basic Request Validation
# ------------------------------------------------------------------------------

assert_failure \
  "plan without arguments fails" \
  phoenix::generator_plan

assert_failure \
  "plan without destination fails" \
  phoenix::generator_plan \
  "provider"

assert_failure \
  "plan with empty generator id fails" \
  phoenix::generator_plan \
  "" \
  "./output" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH"

assert_failure \
  "plan with empty destination fails" \
  phoenix::generator_plan \
  "provider" \
  "" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH"

assert_failure \
  "unknown generator fails" \
  phoenix::generator_plan \
  "unknown" \
  "./output"


# ------------------------------------------------------------------------------
# Required Variables
# ------------------------------------------------------------------------------

assert_failure \
  "missing required variables fail" \
  phoenix::generator_plan \
  "provider" \
  "./output"

assert_failure \
  "missing one required variable fails" \
  phoenix::generator_plan \
  "provider" \
  "./output" \
  "PROVIDER_NAME=Ricardo"

assert_success \
  "all required variables accepted" \
  phoenix::generator_plan \
  "provider" \
  "./output" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH"


# ------------------------------------------------------------------------------
# Request Argument Validation
# ------------------------------------------------------------------------------

assert_failure \
  "argument without KEY=VALUE format fails" \
  phoenix::generator_plan \
  "provider" \
  "./output" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH" \
  "INVALID"


# ------------------------------------------------------------------------------
# Reserved Options
# ------------------------------------------------------------------------------

assert_success \
  "dry-run zero accepted" \
  phoenix::generator_plan \
  "provider" \
  "./output" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH" \
  "PHOENIX_DRY_RUN=0"

assert_success \
  "dry-run one accepted" \
  phoenix::generator_plan \
  "provider" \
  "./output" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH" \
  "PHOENIX_DRY_RUN=1"

assert_failure \
  "invalid dry-run value fails" \
  phoenix::generator_plan \
  "provider" \
  "./output" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH" \
  "PHOENIX_DRY_RUN=yes"

assert_failure \
  "duplicate dry-run option fails" \
  phoenix::generator_plan \
  "provider" \
  "./output" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH" \
  "PHOENIX_DRY_RUN=0" \
  "PHOENIX_DRY_RUN=1"

assert_failure \
  "duplicate overwrite option fails" \
  phoenix::generator_plan \
  "provider" \
  "./output" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH" \
  "PHOENIX_OVERWRITE=0" \
  "PHOENIX_OVERWRITE=1"

assert_failure \
  "unknown reserved option fails" \
  phoenix::generator_plan \
  "provider" \
  "./output" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH" \
  "PHOENIX_UNKNOWN=1"


# ------------------------------------------------------------------------------
# Overwrite Policy
# ------------------------------------------------------------------------------

assert_success \
  "generator allowing overwrite accepts authorization" \
  phoenix::generator_plan \
  "provider" \
  "./output" \
  "PROVIDER_NAME=Ricardo" \
  "COUNTRY=CH" \
  "PHOENIX_OVERWRITE=1"

assert_failure \
  "generator denying overwrite rejects authorization" \
  phoenix::generator_plan \
  "validator" \
  "./output" \
  "VALIDATOR_NAME=Example" \
  "PHOENIX_OVERWRITE=1"


# ------------------------------------------------------------------------------
# Deterministic Plan Output
# ------------------------------------------------------------------------------

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


# ------------------------------------------------------------------------------
# Template Variable Duplicate Policy
# ------------------------------------------------------------------------------

duplicate_variable_plan="$(
  phoenix::generator_plan \
    "provider" \
    "./providers/ricardo" \
    "PROVIDER_NAME=First" \
    "PROVIDER_NAME=Second" \
    "COUNTRY=CH"
)"

if [[ -n "$duplicate_variable_plan" ]]; then
  pass "duplicate normal variables remain valid"
else
  fail "duplicate normal variables remain valid"
fi


# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\n'
printf 'Generator Planning Tests — Tranche 1\n'
printf '====================================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
