#!/usr/bin/env bash

set -u

# ==============================================================================
# PHOENIX DEVKIT — ATLAS SDK SAFE SOURCE LOADING TESTS
# ==============================================================================
#
# Purpose:
# Validate IP-03 controlled read-only source loading.
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

source "${DEVKIT_ROOT}/10_ATLAS_SDK/loader.sh"

# ------------------------------------------------------------------------------
# Initialization Requirement Classification
# ------------------------------------------------------------------------------

assert_equals \
  "TRACKER is REQUIRED for initialization" \
  "REQUIRED" \
  "$(_phoenix::atlas_source_requirement_for_initialize TRACKER)"

assert_equals \
  "FINAL_MASTER is OPTIONAL for initialization" \
  "OPTIONAL" \
  "$(_phoenix::atlas_source_requirement_for_initialize FINAL_MASTER)"

assert_equals \
  "FINAL_RECONCILIATION is OPTIONAL for initialization" \
  "OPTIONAL" \
  "$(_phoenix::atlas_source_requirement_for_initialize FINAL_RECONCILIATION)"

assert_equals \
  "STRATEGIC_SYNTHESIS is OPTIONAL for initialization" \
  "OPTIONAL" \
  "$(_phoenix::atlas_source_requirement_for_initialize STRATEGIC_SYNTHESIS)"

assert_equals \
  "PASS_2_ARCHITECTURE is CONTEXT_ONLY for initialization" \
  "CONTEXT_ONLY" \
  "$(_phoenix::atlas_source_requirement_for_initialize PASS_2_ARCHITECTURE)"

assert_equals \
  "PASS_3A_SPECIFICATION is CONTEXT_ONLY for initialization" \
  "CONTEXT_ONLY" \
  "$(_phoenix::atlas_source_requirement_for_initialize PASS_3A_SPECIFICATION)"

assert_status \
  "unknown initialization source returns INVALID_ARGUMENT" \
  2 \
  _phoenix::atlas_source_requirement_for_initialize UNKNOWN_SOURCE

# ------------------------------------------------------------------------------
# Safe Loading
# ------------------------------------------------------------------------------

tracker_path="$(_phoenix::atlas_source_resolve TRACKER)"
tracker_before="$(shasum -a 256 "$tracker_path" | awk '{print $1}')"

loaded_tracker="$(_phoenix::atlas_source_load TRACKER)"
direct_tracker="$(cat "$tracker_path")"

assert_equals \
  "safe TRACKER load returns exact source content" \
  "$direct_tracker" \
  "$loaded_tracker"

assert_status \
  "TRACKER readability check succeeds" \
  0 \
  _phoenix::atlas_source_is_readable TRACKER

assert_status \
  "unknown source load returns INVALID_ARGUMENT" \
  2 \
  _phoenix::atlas_source_load UNKNOWN_SOURCE

# ------------------------------------------------------------------------------
# Caller PWD Independence
# ------------------------------------------------------------------------------

loaded_from_tmp="$(
  cd "${TMPDIR:-/tmp}" || exit 1
  _phoenix::atlas_source_load TRACKER
)"

assert_equals \
  "safe loading does not depend on caller PWD" \
  "$direct_tracker" \
  "$loaded_from_tmp"

# ------------------------------------------------------------------------------
# Initialization Preparation
# ------------------------------------------------------------------------------

assert_status \
  "required TRACKER prepares successfully" \
  0 \
  _phoenix::atlas_source_prepare_for_initialize TRACKER

assert_status \
  "available OPTIONAL FINAL_MASTER prepares successfully" \
  0 \
  _phoenix::atlas_source_prepare_for_initialize FINAL_MASTER

assert_status \
  "CONTEXT_ONLY PASS_2_ARCHITECTURE is not required for runtime preparation" \
  0 \
  _phoenix::atlas_source_prepare_for_initialize PASS_2_ARCHITECTURE

assert_status \
  "CONTEXT_ONLY PASS_3A_SPECIFICATION is not required for runtime preparation" \
  0 \
  _phoenix::atlas_source_prepare_for_initialize PASS_3A_SPECIFICATION

# ------------------------------------------------------------------------------
# Read-Only Preservation
# ------------------------------------------------------------------------------

tracker_after="$(shasum -a 256 "$tracker_path" | awk '{print $1}')"

assert_equals \
  "safe loading does not mutate canonical TRACKER" \
  "$tracker_before" \
  "$tracker_after"

# ------------------------------------------------------------------------------
# Forbidden Evaluation Boundary
# ------------------------------------------------------------------------------

if grep -nE \
  '(^|[[:space:]])eval([[:space:]]|$)|bash[[:space:]]+-c|sh[[:space:]]+-c' \
  "${DEVKIT_ROOT}/10_ATLAS_SDK/loader.sh" >/dev/null 2>&1
then
  fail "loader contains forbidden Atlas-data evaluation mechanism"
elif grep -nE \
  '^[[:space:]]*(source|\.)[[:space:]]+.*(PHOENIX_ATLAS_GLOBAL_TRACKER|PHOENIX_ATLAS_FINAL_MASTER|PHOENIX_ATLAS_FINAL_RECONCILIATION|PHOENIX_ATLAS_STRATEGIC_SYNTHESIS|PHOENIX_ADAPTIVE_SEARCH_AND_EVIDENCE_ARCHITECTURE|PHOENIX_PROVIDER_PLANNER_AND_SEARCH_STATE_SPECIFICATION)' \
  "${DEVKIT_ROOT}/10_ATLAS_SDK/loader.sh" >/dev/null 2>&1
then
  fail "loader sources canonical Atlas data as executable code"
else
  pass "loader contains no forbidden Atlas-data evaluation mechanism"
fi

# ==============================================================================
# IP-03 Controlled Failure Semantics
# ==============================================================================

# These tests override the private canonical-root helper only inside this test
# process. No canonical Atlas source is renamed, modified, or removed.

ORIGINAL_CANONICAL_ROOT="$(_phoenix::atlas_canonical_root)"

TEST_ATLAS_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/phoenix-atlas-ip03.XXXXXX")" || exit 1

cleanup_ip03_fixture() {
  chmod -R u+rwX "$TEST_ATLAS_ROOT" 2>/dev/null || true
  rm -rf "$TEST_ATLAS_ROOT"
}

trap cleanup_ip03_fixture EXIT

_phoenix::atlas_canonical_root() {
  printf '%s\n' "$TEST_ATLAS_ROOT"
}

# ------------------------------------------------------------------------------
# Required source missing -> SOURCE_MISSING
# ------------------------------------------------------------------------------

assert_status \
  "missing REQUIRED TRACKER returns SOURCE_MISSING" \
  4 \
  _phoenix::atlas_source_prepare_for_initialize TRACKER

# ------------------------------------------------------------------------------
# Optional source missing -> SUCCESS
# ------------------------------------------------------------------------------

assert_status \
  "missing OPTIONAL FINAL_MASTER is accepted" \
  0 \
  _phoenix::atlas_source_prepare_for_initialize FINAL_MASTER

# ------------------------------------------------------------------------------
# Required source unreadable -> SOURCE_UNREADABLE
# ------------------------------------------------------------------------------

TRACKER_FIXTURE="$TEST_ATLAS_ROOT/PHOENIX_ATLAS_GLOBAL_TRACKER_001_061.csv"

printf '%s\n' 'fixture' > "$TRACKER_FIXTURE"
chmod 000 "$TRACKER_FIXTURE"

# On privileged environments -r may still succeed. In that case the filesystem
# cannot represent the intended unreadable condition for this process.
if [[ -r "$TRACKER_FIXTURE" ]]; then
  pass "required unreadable fixture not representable for current user — safely skipped"
else
  assert_status \
    "unreadable REQUIRED TRACKER returns SOURCE_UNREADABLE" \
    5 \
    _phoenix::atlas_source_prepare_for_initialize TRACKER
fi

chmod 600 "$TRACKER_FIXTURE"

# Restore helper for any later test code in the same shell process.
_phoenix::atlas_canonical_root() {
  printf '%s\n' "$ORIGINAL_CANONICAL_ROOT"
}

# ------------------------------------------------------------------------------
# Result
# ------------------------------------------------------------------------------

printf '\nTests passed: %s\n' "$TESTS_PASSED"
printf 'Tests failed: %s\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0

