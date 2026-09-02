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

source "${DEVKIT_ROOT}/06_PLUGINS/registry.sh"

plugin_definition="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
PURPOSE=Registry foundation test
DEPENDENCY=REQUIRED:GENERATOR:register
CONTRIBUTION=GENERATOR:provider
DEF
)"

second_definition="$(cat <<'DEF'
ID=second-plugin
CONTRACT_VERSION=1.0
PURPOSE=Second registry foundation test
DEPENDENCY=REQUIRED:VALIDATOR:register
CONTRIBUTION=VALIDATOR:structure
DEF
)"

# ------------------------------------------------------------------------------
# Initial State
# ------------------------------------------------------------------------------

assert_failure \
  "unknown plugin does not exist" \
  phoenix::plugin_exists "unknown"

assert_failure \
  "exists without plugin id fails" \
  phoenix::plugin_exists ""

assert_failure \
  "resolve unknown plugin fails" \
  phoenix::plugin_resolve "unknown"

assert_failure \
  "resolve without plugin id fails" \
  phoenix::plugin_resolve ""

# ------------------------------------------------------------------------------
# Production Definition Engine Integration
# ------------------------------------------------------------------------------

assert_success   "production definition validator is available through registry"   command -v _phoenix::plugin_definition_validate

assert_success   "register valid plugin through production definition engine"   phoenix::plugin_register     "example-plugin"     "$plugin_definition"

assert_success   "registered plugin exists"   phoenix::plugin_exists "example-plugin"

resolved_plugin="$(
  phoenix::plugin_resolve "example-plugin"
)"

assert_equals   "resolve returns exact registered definition"   "$plugin_definition"   "$resolved_plugin"

# ------------------------------------------------------------------------------
# Duplicate Protection
# ------------------------------------------------------------------------------

changed_definition="$(cat <<'DEF'
ID=example-plugin
CONTRACT_VERSION=1.0
PURPOSE=Changed definition must not overwrite original
CONTRIBUTION=GENERATOR:provider
DEF
)"

assert_failure \
  "duplicate plugin registration fails" \
  phoenix::plugin_register \
    "example-plugin" \
    "$changed_definition"

resolved_after_duplicate="$(
  phoenix::plugin_resolve "example-plugin"
)"

assert_equals \
  "duplicate registration preserves original definition" \
  "$plugin_definition" \
  "$resolved_after_duplicate"

# ------------------------------------------------------------------------------
# Compatibility Gate
# ------------------------------------------------------------------------------

incompatible_definition="$(cat <<'DEF'
ID=blocked-plugin
CONTRACT_VERSION=1.0
PURPOSE=Required dependency compatibility failure test
DEPENDENCY=REQUIRED:GENERATOR:registration
CONTRIBUTION=GENERATOR:provider
DEF
)"

optional_definition="$(cat <<'DEF'
ID=optional-plugin
CONTRACT_VERSION=1.0
PURPOSE=Optional unavailable dependency compatibility test
DEPENDENCY=OPTIONAL:CORE:runtime
CONTRIBUTION=GENERATOR:provider
DEF
)"

registry_ids_before_incompatible="${#PHOENIX_PLUGIN_REGISTRY_IDS[@]}"
registry_definitions_before_incompatible="${#PHOENIX_PLUGIN_REGISTRY_DEFINITIONS[@]}"

assert_failure \
  "required unauthorized dependency prevents registration" \
  phoenix::plugin_register \
    "blocked-plugin" \
    "$incompatible_definition"

assert_failure \
  "compatibility failure leaves plugin unregistered" \
  phoenix::plugin_exists "blocked-plugin"

assert_equals \
  "compatibility failure preserves plugin id registry" \
  "$registry_ids_before_incompatible" \
  "${#PHOENIX_PLUGIN_REGISTRY_IDS[@]}"

assert_equals \
  "compatibility failure preserves plugin definition registry" \
  "$registry_definitions_before_incompatible" \
  "${#PHOENIX_PLUGIN_REGISTRY_DEFINITIONS[@]}"

assert_success \
  "optional unavailable dependency does not prevent registration" \
  phoenix::plugin_register \
    "optional-plugin" \
    "$optional_definition"

assert_success \
  "plugin with optional unavailable dependency is registered" \
  phoenix::plugin_exists "optional-plugin"

# ------------------------------------------------------------------------------
# Deterministic Ordering
# ------------------------------------------------------------------------------

assert_success \
  "register second plugin" \
  phoenix::plugin_register \
    "second-plugin" \
    "$second_definition"

plugin_list="$(
  phoenix::plugin_list
)"

expected_list="$(cat <<'LIST'
example-plugin
optional-plugin
second-plugin
LIST
)"

assert_equals \
  "plugin id registry count is deterministic" \
  "3" \
  "${#PHOENIX_PLUGIN_REGISTRY_IDS[@]}"

assert_equals \
  "plugin definition registry count matches id registry" \
  "3" \
  "${#PHOENIX_PLUGIN_REGISTRY_DEFINITIONS[@]}"

# ------------------------------------------------------------------------------
# Registry State Integrity
# ------------------------------------------------------------------------------

assert_equals \
  "plugin id registry count is deterministic" \
  "3" \
  "${#PHOENIX_PLUGIN_REGISTRY_IDS[@]}"

assert_equals \
  "plugin definition registry count matches id registry" \
  "3" \
  "${#PHOENIX_PLUGIN_REGISTRY_DEFINITIONS[@]}"

# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\n'
printf 'Plugin Registry Foundation Tests\n'
printf '================================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
