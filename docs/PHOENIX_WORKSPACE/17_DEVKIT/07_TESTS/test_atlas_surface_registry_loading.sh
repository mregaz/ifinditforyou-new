#!/usr/bin/env bash

set -u

# ==============================================================================
# PHOENIX DEVKIT — ATLAS SDK SURFACE REGISTRY LOADING TESTS
# ==============================================================================
#
# Purpose:
# Validate IP-08 canonical Marketplace Surface Registry loader integration.
#
# ==============================================================================

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

assert_status() {
  local description="$1"
  local expected="$2"
  shift 2

  "$@" >/dev/null 2>&1
  local actual=$?

  if [[ "$actual" -eq "$expected" ]]; then
    pass "$description"
  else
    fail "$description"
    printf '  expected status: %s\n' "$expected"
    printf '  actual status:   %s\n' "$actual"
  fi
}

SCRIPT_DIR="$(
  cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 &&
  pwd
)"

DEVKIT_ROOT="$(
  cd "${SCRIPT_DIR}/.." >/dev/null 2>&1 &&
  pwd
)"

# Use the same Atlas SDK bootstrap boundary as the existing Atlas tests.
source "${DEVKIT_ROOT}/10_ATLAS_SDK/loader.sh"

echo "===== IP-08 — SURFACE REGISTRY LOADER TESTS ====="

EXPECTED_FILENAME="PHOENIX_ATLAS_MARKETPLACE_SURFACE_REGISTRY_v1.0.csv"

ACTUAL_FILENAME="$(
  _phoenix::atlas_source_filename SURFACE_REGISTRY
)"

assert_equals \
  "SURFACE_REGISTRY maps to frozen canonical filename" \
  "$EXPECTED_FILENAME" \
  "$ACTUAL_FILENAME"

assert_status \
  "SURFACE_REGISTRY resolves successfully" \
  0 \
  _phoenix::atlas_source_resolve SURFACE_REGISTRY

SURFACE_PATH="$(
  _phoenix::atlas_source_resolve SURFACE_REGISTRY
)"

if [[ -r "$SURFACE_PATH" ]]; then
  pass "SURFACE_REGISTRY is readable"
else
  fail "SURFACE_REGISTRY is readable"
fi

EXPECTED_HEADER="surface_id,tracker_id,marketplace,country,provider_family,access_state,lifecycle,source_reference"

ACTUAL_HEADER="$(
  head -n 1 "$SURFACE_PATH"
)"

assert_equals \
  "SURFACE_REGISTRY exposes frozen canonical header" \
  "$EXPECTED_HEADER" \
  "$ACTUAL_HEADER"

ACTUAL_RECORDS="$(
  awk 'END { print NR - 1 }' "$SURFACE_PATH"
)"

assert_equals \
  "SURFACE_REGISTRY exposes exactly 61 materialized records" \
  "61" \
  "$ACTUAL_RECORDS"

FIRST_ID="$(
  awk -F',' 'NR == 2 { print $1 }' "$SURFACE_PATH"
)"

LAST_ID="$(
  awk -F',' 'END { print $1 }' "$SURFACE_PATH"
)"

assert_equals \
  "first Surface identity is canonical" \
  "ATLAS-SURFACE-001" \
  "$FIRST_ID"

assert_equals \
  "last Surface identity is canonical" \
  "ATLAS-SURFACE-061" \
  "$LAST_ID"

assert_equals \
  "SURFACE_REGISTRY is OPTIONAL during initialization" \
  "OPTIONAL" \
  "$(_phoenix::atlas_source_requirement_for_initialize SURFACE_REGISTRY)"

echo
echo "TESTS_PASSED=$TESTS_PASSED"
echo "TESTS_FAILED=$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
