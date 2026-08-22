#!/usr/bin/env bash

set -u

# ==============================================================================
# PHOENIX DEVKIT — ATLAS SDK SOURCE RESOLUTION TESTS
# ==============================================================================
#
# Purpose:
# Validate IP-02 deterministic canonical Atlas root and source resolution.
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

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEVKIT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
REPOSITORY_ROOT="$(cd "${DEVKIT_ROOT}/../../.." && pwd)"

source "${DEVKIT_ROOT}/10_ATLAS_SDK/loader.sh"

EXPECTED_ATLAS_ROOT="${REPOSITORY_ROOT}/docs/PHOENIX_WORKSPACE/07_MARKET_INTELLIGENCE/PHOENIX_ATLAS/FINAL"

# ------------------------------------------------------------------------------
# Canonical Root
# ------------------------------------------------------------------------------

root_result="$(_phoenix::atlas_canonical_root)"

assert_equals \
  "canonical Atlas root is deterministic" \
  "$EXPECTED_ATLAS_ROOT" \
  "$root_result"

# ------------------------------------------------------------------------------
# Frozen Source Mapping
# ------------------------------------------------------------------------------

assert_equals \
  "TRACKER maps to frozen canonical filename" \
  "PHOENIX_ATLAS_GLOBAL_TRACKER_001_061.csv" \
  "$(_phoenix::atlas_source_filename TRACKER)"

assert_equals \
  "FINAL_MASTER maps to frozen canonical filename" \
  "PHOENIX_ATLAS_FINAL_MASTER_v1.0.md" \
  "$(_phoenix::atlas_source_filename FINAL_MASTER)"

assert_equals \
  "FINAL_RECONCILIATION maps to frozen canonical filename" \
  "PHOENIX_ATLAS_FINAL_RECONCILIATION_v1.0.md" \
  "$(_phoenix::atlas_source_filename FINAL_RECONCILIATION)"

assert_equals \
  "STRATEGIC_SYNTHESIS maps to frozen canonical filename" \
  "PHOENIX_ATLAS_STRATEGIC_SYNTHESIS_v1.0.md" \
  "$(_phoenix::atlas_source_filename STRATEGIC_SYNTHESIS)"

assert_equals \
  "PASS_2_ARCHITECTURE maps to frozen canonical filename" \
  "PHOENIX_ADAPTIVE_SEARCH_AND_EVIDENCE_ARCHITECTURE_v1.0.md" \
  "$(_phoenix::atlas_source_filename PASS_2_ARCHITECTURE)"

assert_equals \
  "PASS_3A_SPECIFICATION maps to frozen canonical filename" \
  "PHOENIX_PROVIDER_PLANNER_AND_SEARCH_STATE_SPECIFICATION_v1.0.md" \
  "$(_phoenix::atlas_source_filename PASS_3A_SPECIFICATION)"

# ------------------------------------------------------------------------------
# Authorized Resolution
# ------------------------------------------------------------------------------

for source_id in \
  TRACKER \
  FINAL_MASTER \
  FINAL_RECONCILIATION \
  STRATEGIC_SYNTHESIS \
  PASS_2_ARCHITECTURE \
  PASS_3A_SPECIFICATION
do
  assert_success \
    "${source_id} resolves successfully" \
    _phoenix::atlas_source_resolve "$source_id"
done

# ------------------------------------------------------------------------------
# Invalid / Unauthorized Input
# ------------------------------------------------------------------------------

assert_status \
  "missing source identifier returns INVALID_ARGUMENT" \
  2 \
  _phoenix::atlas_source_resolve

assert_status \
  "unknown source identifier returns INVALID_ARGUMENT" \
  2 \
  _phoenix::atlas_source_resolve UNKNOWN_SOURCE

assert_status \
  "relative traversal is rejected" \
  2 \
  _phoenix::atlas_source_resolve ../TRACKER

assert_status \
  "nested traversal is rejected" \
  2 \
  _phoenix::atlas_source_resolve ../../etc/passwd

assert_status \
  "absolute path is rejected" \
  2 \
  _phoenix::atlas_source_resolve /etc/passwd

assert_status \
  "canonical filename cannot bypass logical identifier contract" \
  2 \
  _phoenix::atlas_source_resolve PHOENIX_ATLAS_GLOBAL_TRACKER_001_061.csv

assert_status \
  "PASS 3B document is not silently admitted into frozen v1.0 source set" \
  2 \
  _phoenix::atlas_source_resolve PHOENIX_EVIDENCE_MODEL_AND_PROVENANCE_SPECIFICATION_v1.0.md

# ------------------------------------------------------------------------------
# Caller PWD Independence
# ------------------------------------------------------------------------------

original_root="$(_phoenix::atlas_canonical_root)"

pwd_independent_root="$(
  cd "${TMPDIR:-/tmp}" || exit 1
  _phoenix::atlas_canonical_root
)"

assert_equals \
  "canonical root does not depend on caller PWD" \
  "$original_root" \
  "$pwd_independent_root"

tracker_from_tmp="$(
  cd "${TMPDIR:-/tmp}" || exit 1
  _phoenix::atlas_source_resolve TRACKER
)"

expected_tracker="${EXPECTED_ATLAS_ROOT}/PHOENIX_ATLAS_GLOBAL_TRACKER_001_061.csv"

assert_equals \
  "source resolution does not depend on caller PWD" \
  "$expected_tracker" \
  "$tracker_from_tmp"

# ------------------------------------------------------------------------------
# Missing Canonical Source Classification
# ------------------------------------------------------------------------------

missing_source_fixture() (
  local fixture_root

  fixture_root="$(mktemp -d "${TMPDIR:-/tmp}/phoenix-atlas-missing.XXXXXX")" || return 8

  trap 'rm -rf "$fixture_root"' EXIT

  mkdir -p     "${fixture_root}/docs/PHOENIX_WORKSPACE/17_DEVKIT" || return 8

  PHOENIX_ATLAS_LOADER_DEVKIT_ROOT="${fixture_root}/docs/PHOENIX_WORKSPACE/17_DEVKIT"

  _phoenix::atlas_source_resolve TRACKER
)

assert_status   "missing canonical TRACKER returns SOURCE_MISSING"   4   missing_source_fixture

# ------------------------------------------------------------------------------
# Result
# ------------------------------------------------------------------------------

printf '\nTests passed: %s\n' "$TESTS_PASSED"
printf 'Tests failed: %s\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
