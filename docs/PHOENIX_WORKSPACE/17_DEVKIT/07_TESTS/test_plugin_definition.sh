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

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEVKIT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

source "${DEVKIT_ROOT}/06_PLUGINS/definition.sh"

valid_definition="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
PURPOSE=Example Plugin definition
CONTRIBUTION=GENERATOR:provider
CONTRIBUTION=VALIDATOR:structure
DEPENDENCY=REQUIRED:GENERATOR:registration
DEPENDENCY=OPTIONAL:ATLAS:public-api
DEF
)"

assert_success \
  "valid definition passes" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$valid_definition"

assert_failure \
  "missing expected plugin id fails" \
  _phoenix::plugin_definition_validate \
    "" \
    "$valid_definition"

assert_failure \
  "empty definition fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    ""

missing_id="$(cat <<'DEF'
CONTRACT_VERSION=1.0
CONTRIBUTION=GENERATOR:provider
DEF
)"

assert_failure \
  "definition missing ID fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$missing_id"

duplicate_id="$(cat <<'DEF'
ID=example-plugin
ID=example-plugin
CONTRACT_VERSION=1.0
CONTRIBUTION=GENERATOR:provider
DEF
)"

assert_failure \
  "duplicate ID fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$duplicate_id"

wrong_id="$(cat <<'DEF'
ID=other-plugin
CONTRACT_VERSION=1.0
CONTRIBUTION=GENERATOR:provider
DEF
)"

assert_failure \
  "definition ID mismatch fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$wrong_id"

invalid_upper_id="$(cat <<'DEF'
ID=Example-plugin
CONTRACT_VERSION=1.0
CONTRIBUTION=GENERATOR:provider
DEF
)"

assert_failure \
  "uppercase plugin ID fails" \
  _phoenix::plugin_definition_validate \
    "Example-plugin" \
    "$invalid_upper_id"

invalid_leading_dash="$(cat <<'DEF'
ID=-example
CONTRACT_VERSION=1.0
CONTRIBUTION=GENERATOR:provider
DEF
)"

assert_failure \
  "plugin ID with leading dash fails" \
  _phoenix::plugin_definition_validate \
    "-example" \
    "$invalid_leading_dash"

invalid_double_dash="$(cat <<'DEF'
ID=example--plugin
CONTRACT_VERSION=1.0
CONTRIBUTION=GENERATOR:provider
DEF
)"

assert_failure \
  "plugin ID with double dash fails" \
  _phoenix::plugin_definition_validate \
    "example--plugin" \
    "$invalid_double_dash"

missing_contract="$(cat <<'DEF'
ID=example-plugin
CONTRIBUTION=GENERATOR:provider
DEF
)"

assert_failure \
  "missing CONTRACT_VERSION fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$missing_contract"

duplicate_contract="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
CONTRACT_VERSION=1.0
CONTRIBUTION=GENERATOR:provider
DEF
)"

assert_failure \
  "duplicate CONTRACT_VERSION fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$duplicate_contract"

unsupported_contract="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=2.0
CONTRIBUTION=GENERATOR:provider
DEF
)"

assert_failure \
  "unsupported CONTRACT_VERSION fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$unsupported_contract"

missing_contribution="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
PURPOSE=No contribution
DEF
)"

assert_failure \
  "definition without CONTRIBUTION fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$missing_contribution"

empty_contribution="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
CONTRIBUTION=
DEF
)"

assert_failure \
  "empty CONTRIBUTION fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$empty_contribution"

malformed_contribution="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
CONTRIBUTION=GENERATOR
DEF
)"

assert_failure \
  "CONTRIBUTION without target separator fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$malformed_contribution"

unknown_contribution="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
CONTRIBUTION=CLI:command
DEF
)"

assert_failure \
  "unknown contribution type fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$unknown_contribution"

bad_contribution_target="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
CONTRIBUTION=GENERATOR:Provider
DEF
)"

assert_failure \
  "invalid contribution target id fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$bad_contribution_target"

extra_contribution_separator="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
CONTRIBUTION=GENERATOR:provider:extra
DEF
)"

assert_failure \
  "CONTRIBUTION with extra separator fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$extra_contribution_separator"

malformed_dependency="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
CONTRIBUTION=GENERATOR:provider
DEPENDENCY=REQUIRED:GENERATOR
DEF
)"

assert_failure \
  "malformed DEPENDENCY fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$malformed_dependency"

unknown_requirement="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
CONTRIBUTION=GENERATOR:provider
DEPENDENCY=MAYBE:GENERATOR:registration
DEF
)"

assert_failure \
  "unknown dependency requirement fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$unknown_requirement"

unknown_layer="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
CONTRIBUTION=GENERATOR:provider
DEPENDENCY=REQUIRED:PLUGIN:registry
DEF
)"

assert_failure \
  "unknown dependency layer fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$unknown_layer"

cli_dependency="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
CONTRIBUTION=GENERATOR:provider
DEPENDENCY=REQUIRED:CLI:command
DEF
)"

assert_failure \
  "CLI dependency fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$cli_dependency"

empty_dependency_capability="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
CONTRIBUTION=GENERATOR:provider
DEPENDENCY=REQUIRED:GENERATOR:
DEF
)"

assert_failure \
  "empty dependency capability fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$empty_dependency_capability"

extra_dependency_separator="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
CONTRIBUTION=GENERATOR:provider
DEPENDENCY=REQUIRED:GENERATOR:registration:extra
DEF
)"

assert_failure \
  "DEPENDENCY with extra separator fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$extra_dependency_separator"

duplicate_purpose="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
PURPOSE=First
PURPOSE=Second
CONTRIBUTION=GENERATOR:provider
DEF
)"

assert_failure \
  "duplicate PURPOSE fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$duplicate_purpose"

empty_purpose="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
PURPOSE=
CONTRIBUTION=GENERATOR:provider
DEF
)"

assert_failure \
  "empty PURPOSE fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$empty_purpose"

unknown_field="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
CONTRIBUTION=GENERATOR:provider
EXECUTABLE=/tmp/run.sh
DEF
)"

assert_failure \
  "unknown field fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$unknown_field"

lowercase_field="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
contribution=GENERATOR:provider
DEF
)"

assert_failure \
  "lowercase field name fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$lowercase_field"

missing_equals="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
CONTRIBUTION GENERATOR:provider
DEF
)"

assert_failure \
  "line without equals fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$missing_equals"

blank_line="$(cat <<'DEF'
ID=example-plugin

CONTRACT_VERSION=1.0
CONTRIBUTION=GENERATOR:provider
DEF
)"

assert_failure \
  "blank definition line fails" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$blank_line"

literal_value_definition="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
PURPOSE=$(printf should-not-run)
CONTRIBUTION=GENERATOR:provider
DEF
)"

assert_success \
  "shell-looking PURPOSE remains inert literal data" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$literal_value_definition"

literal_equals_definition="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
PURPOSE=literal=value=preserved
CONTRIBUTION=GENERATOR:provider
DEF
)"

assert_success \
  "value may contain additional equals characters" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$literal_equals_definition"

multiple_contributions="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
CONTRIBUTION=GENERATOR:provider
CONTRIBUTION=VALIDATOR:structure
CONTRIBUTION=GENERATOR:documentation
DEF
)"

assert_success \
  "multiple CONTRIBUTION declarations are accepted" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$multiple_contributions"

multiple_dependencies="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
CONTRIBUTION=GENERATOR:provider
DEPENDENCY=REQUIRED:CORE:runtime
DEPENDENCY=OPTIONAL:TEMPLATE:rendering
DEPENDENCY=REQUIRED:VALIDATOR:registration
DEPENDENCY=OPTIONAL:ATLAS:public-api
DEF
)"

assert_success \
  "multiple DEPENDENCY declarations are accepted" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$multiple_dependencies"

field_order_definition="$(cat <<'DEF'
CONTRIBUTION=GENERATOR:provider
PURPOSE=Order independent structural validation
DEPENDENCY=OPTIONAL:ATLAS:public-api
CONTRACT_VERSION=1.0
ID=example-plugin
CONTRIBUTION=VALIDATOR:structure
DEF
)"

assert_success \
  "valid declarations remain valid regardless of field order" \
  _phoenix::plugin_definition_validate \
    "example-plugin" \
    "$field_order_definition"

printf '\n'
printf 'Plugin Definition Engine Tests\n'
printf '==============================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
