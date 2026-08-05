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
    printf '  expected: %s\n' "$expected"
    printf '  actual:   %s\n' "$actual"
  fi
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEVKIT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

source "${DEVKIT_ROOT}/03_GENERATORS/registry.sh"


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


# ------------------------------------------------------------------------------
# Initial State
# ------------------------------------------------------------------------------

assert_failure \
  "unknown generator does not exist" \
  phoenix::generator_exists "unknown"


# ------------------------------------------------------------------------------
# Valid Registration
# ------------------------------------------------------------------------------

assert_success \
  "register valid provider definition" \
  phoenix::generator_register \
  "provider" \
  "$provider_definition"

assert_success \
  "registered provider exists" \
  phoenix::generator_exists "provider"


# ------------------------------------------------------------------------------
# Resolution
# ------------------------------------------------------------------------------

resolved_provider="$(
  phoenix::generator_resolve "provider"
)"

assert_equals \
  "resolve returns complete provider definition" \
  "$provider_definition" \
  "$resolved_provider"


# ------------------------------------------------------------------------------
# Duplicate Protection
# ------------------------------------------------------------------------------

assert_failure \
  "duplicate generator registration fails" \
  phoenix::generator_register \
  "provider" \
  "$provider_definition"

resolved_provider_after_duplicate="$(
  phoenix::generator_resolve "provider"
)"

assert_equals \
  "duplicate registration does not overwrite definition" \
  "$provider_definition" \
  "$resolved_provider_after_duplicate"


# ------------------------------------------------------------------------------
# Required Structural Validation
# ------------------------------------------------------------------------------

assert_failure \
  "registration without id fails" \
  phoenix::generator_register \
  "" \
  "$provider_definition"

assert_failure \
  "registration without definition fails" \
  phoenix::generator_register \
  "empty" \
  ""

missing_purpose_definition="$(cat <<'DEF'
ID=broken
TEMPLATE_MAP=templates/broken/index.sh=>index.sh
REQUIRED_VARIABLES=NAME
DESTINATION_RULE=scoped
OVERWRITE_POLICY=0
DEF
)"

assert_failure \
  "definition missing purpose fails" \
  phoenix::generator_register \
  "broken" \
  "$missing_purpose_definition"

wrong_id_definition="$(cat <<'DEF'
ID=other
PURPOSE=Wrong ID
TEMPLATE_MAP=templates/other/index.sh=>index.sh
REQUIRED_VARIABLES=NAME
DESTINATION_RULE=scoped
OVERWRITE_POLICY=0
DEF
)"

assert_failure \
  "definition id must match registry id" \
  phoenix::generator_register \
  "wrong" \
  "$wrong_id_definition"

missing_template_definition="$(cat <<'DEF'
ID=no-template
PURPOSE=Missing template
REQUIRED_VARIABLES=NAME
DESTINATION_RULE=scoped
OVERWRITE_POLICY=0
DEF
)"

assert_failure \
  "definition missing template mapping fails" \
  phoenix::generator_register \
  "no-template" \
  "$missing_template_definition"

missing_required_variables_definition="$(cat <<'DEF'
ID=no-vars
PURPOSE=Missing required variables field
TEMPLATE_MAP=templates/no-vars/index.sh=>index.sh
DESTINATION_RULE=scoped
OVERWRITE_POLICY=0
DEF
)"

assert_failure \
  "definition missing required variables declaration fails" \
  phoenix::generator_register \
  "no-vars" \
  "$missing_required_variables_definition"

missing_destination_rule_definition="$(cat <<'DEF'
ID=no-destination
PURPOSE=Missing destination rule
TEMPLATE_MAP=templates/no-destination/index.sh=>index.sh
REQUIRED_VARIABLES=NAME
OVERWRITE_POLICY=0
DEF
)"

assert_failure \
  "definition missing destination rule fails" \
  phoenix::generator_register \
  "no-destination" \
  "$missing_destination_rule_definition"

invalid_overwrite_definition="$(cat <<'DEF'
ID=bad-overwrite
PURPOSE=Invalid overwrite policy
TEMPLATE_MAP=templates/bad-overwrite/index.sh=>index.sh
REQUIRED_VARIABLES=NAME
DESTINATION_RULE=scoped
OVERWRITE_POLICY=yes
DEF
)"

assert_failure \
  "invalid overwrite policy fails" \
  phoenix::generator_register \
  "bad-overwrite" \
  "$invalid_overwrite_definition"


# ------------------------------------------------------------------------------
# Artifact Mapping Safety
# ------------------------------------------------------------------------------

absolute_mapping_definition="$(cat <<'DEF'
ID=absolute-map
PURPOSE=Absolute artifact mapping
TEMPLATE_MAP=templates/source.sh=>/tmp/output.sh
REQUIRED_VARIABLES=NAME
DESTINATION_RULE=scoped
OVERWRITE_POLICY=0
DEF
)"

assert_failure \
  "absolute artifact mapping fails" \
  phoenix::generator_register \
  "absolute-map" \
  "$absolute_mapping_definition"

traversal_mapping_definition="$(cat <<'DEF'
ID=traversal-map
PURPOSE=Traversal artifact mapping
TEMPLATE_MAP=templates/source.sh=>../outside.sh
REQUIRED_VARIABLES=NAME
DESTINATION_RULE=scoped
OVERWRITE_POLICY=0
DEF
)"

assert_failure \
  "path traversal artifact mapping fails" \
  phoenix::generator_register \
  "traversal-map" \
  "$traversal_mapping_definition"


# ------------------------------------------------------------------------------
# Multiple Definitions and Ordering
# ------------------------------------------------------------------------------

assert_success \
  "register valid validator definition" \
  phoenix::generator_register \
  "validator" \
  "$validator_definition"

registry_list="$(
  phoenix::generator_list
)"

expected_list="$(cat <<'LIST'
provider
validator
LIST
)"

assert_equals \
  "generator list preserves registration order" \
  "$expected_list" \
  "$registry_list"


# ------------------------------------------------------------------------------
# Definition Ordering Integrity
# ------------------------------------------------------------------------------

resolved_provider_order="$(
  phoenix::generator_resolve "provider"
)"

assert_equals \
  "template mapping order is preserved in resolved definition" \
  "$provider_definition" \
  "$resolved_provider_order"


# ------------------------------------------------------------------------------
# Unknown Resolution
# ------------------------------------------------------------------------------

assert_failure \
  "resolve unknown generator fails" \
  phoenix::generator_resolve "unknown"

assert_failure \
  "resolve without generator id fails" \
  phoenix::generator_resolve ""


# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\n'
printf 'Generator Registry Tests\n'
printf '========================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
