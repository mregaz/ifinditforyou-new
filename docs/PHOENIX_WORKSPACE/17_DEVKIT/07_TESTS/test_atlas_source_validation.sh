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

FIXTURE_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/phoenix-atlas-ip04.XXXXXX")" || return 1

cleanup_ip04() {
  rm -rf "$FIXTURE_ROOT"
}

trap cleanup_ip04 EXIT

make_tracker() {
  local name="$1"
  local header="$2"
  local record="$3"

  printf '%s\n%s\n' \
    "$header" \
    "$record" \
    > "${FIXTURE_ROOT}/${name}"
}

CANONICAL_HEADER="tracker_id,country,marketplace,category,atlas_v1_status,evidence_note"
CANONICAL_RECORD="1,Italia,Subito.it,Annunci generalisti,EVIDENCED_COMPLETE,fixture"

echo "===== IP-04 — CANONICAL SOURCE VALIDATION TESTS ====="

# ------------------------------------------------------------------------------
# Real canonical source
# ------------------------------------------------------------------------------

assert_status \
  "real canonical TRACKER validates successfully" \
  0 \
  _phoenix::atlas_validate_source TRACKER

REAL_TRACKER="$(_phoenix::atlas_source_resolve TRACKER)"
REAL_BEFORE="$(shasum -a 256 "$REAL_TRACKER" | awk '{print $1}')"

assert_status \
  "real tracker file validates directly" \
  0 \
  _phoenix::atlas_validate_tracker_file "$REAL_TRACKER"

REAL_AFTER="$(shasum -a 256 "$REAL_TRACKER" | awk '{print $1}')"

if [[ "$REAL_BEFORE" == "$REAL_AFTER" ]]; then
  pass "validation is read-only"
else
  fail "validation mutated canonical TRACKER"
fi

# ------------------------------------------------------------------------------
# Required schema
# ------------------------------------------------------------------------------

make_tracker \
  missing_column.csv \
  "tracker_id,country,marketplace,category,atlas_v1_status" \
  "1,Italia,Subito.it,Annunci generalisti,EVIDENCED_COMPLETE"

assert_status \
  "missing mandatory tracker column returns INVALID_CANONICAL_DATA" \
  6 \
  _phoenix::atlas_validate_tracker_file "$FIXTURE_ROOT/missing_column.csv"

# ------------------------------------------------------------------------------
# Unsupported version
# ------------------------------------------------------------------------------

make_tracker \
  unsupported_version.csv \
  "tracker_id,country,marketplace,category,atlas_v2_status,evidence_note" \
  "1,Italia,Subito.it,Annunci generalisti,EVIDENCED_COMPLETE,fixture"

assert_status \
  "unsupported tracker version returns UNSUPPORTED_VERSION" \
  7 \
  _phoenix::atlas_validate_tracker_file "$FIXTURE_ROOT/unsupported_version.csv"

# ------------------------------------------------------------------------------
# Missing version marker
# ------------------------------------------------------------------------------

make_tracker \
  missing_version.csv \
  "tracker_id,country,marketplace,category,status,evidence_note" \
  "1,Italia,Subito.it,Annunci generalisti,EVIDENCED_COMPLETE,fixture"

assert_status \
  "missing canonical version marker returns INVALID_CANONICAL_DATA" \
  6 \
  _phoenix::atlas_validate_tracker_file "$FIXTURE_ROOT/missing_version.csv"

# ------------------------------------------------------------------------------
# Invalid canonical identifier
# ------------------------------------------------------------------------------

make_tracker \
  invalid_identifier.csv \
  "$CANONICAL_HEADER" \
  "NOT_AN_ID,Italia,Subito.it,Annunci generalisti,EVIDENCED_COMPLETE,fixture"

assert_status \
  "invalid tracker_id returns INVALID_CANONICAL_DATA" \
  6 \
  _phoenix::atlas_validate_tracker_file "$FIXTURE_ROOT/invalid_identifier.csv"

# ------------------------------------------------------------------------------
# Invalid mandatory status syntax
# ------------------------------------------------------------------------------

make_tracker \
  invalid_status.csv \
  "$CANONICAL_HEADER" \
  "1,Italia,Subito.it,Annunci generalisti,evidenced complete,fixture"

assert_status \
  "invalid mandatory status syntax returns INVALID_CANONICAL_DATA" \
  6 \
  _phoenix::atlas_validate_tracker_file "$FIXTURE_ROOT/invalid_status.csv"

# ------------------------------------------------------------------------------
# Malformed required record
# ------------------------------------------------------------------------------

make_tracker \
  malformed_record.csv \
  "$CANONICAL_HEADER" \
  "1,,Subito.it,Annunci generalisti,EVIDENCED_COMPLETE,fixture"

assert_status \
  "malformed required record returns INVALID_CANONICAL_DATA" \
  6 \
  _phoenix::atlas_validate_tracker_file "$FIXTURE_ROOT/malformed_record.csv"

# ------------------------------------------------------------------------------
# Header only
# ------------------------------------------------------------------------------

printf '%s\n' "$CANONICAL_HEADER" > "$FIXTURE_ROOT/header_only.csv"

assert_status \
  "tracker without records returns INVALID_CANONICAL_DATA" \
  6 \
  _phoenix::atlas_validate_tracker_file "$FIXTURE_ROOT/header_only.csv"

# ------------------------------------------------------------------------------
# Forward-compatible optional field
# ------------------------------------------------------------------------------

make_tracker \
  optional_field.csv \
  "${CANONICAL_HEADER},future_optional_field" \
  "${CANONICAL_RECORD},future-value"

assert_status \
  "unknown optional field does not invalidate v1 tracker" \
  0 \
  _phoenix::atlas_validate_tracker_file "$FIXTURE_ROOT/optional_field.csv"

# ------------------------------------------------------------------------------
# Fail-fast / no partial output
# ------------------------------------------------------------------------------

OUTPUT="$(
  _phoenix::atlas_validate_tracker_file "$FIXTURE_ROOT/invalid_identifier.csv"
)"
RC=$?

if [[ "$RC" -eq 6 && -z "$OUTPUT" ]]; then
  pass "invalid canonical data fails without partial successful output"
else
  fail "invalid canonical data exposed partial successful output"
fi

# ------------------------------------------------------------------------------
# Invalid source argument
# ------------------------------------------------------------------------------

assert_status \
  "missing source validation argument returns INVALID_ARGUMENT" \
  2 \
  _phoenix::atlas_validate_source

assert_status \
  "unsupported source validation request returns INVALID_ARGUMENT" \
  2 \
  _phoenix::atlas_validate_source FINAL_MASTER

printf '\nTests passed: %s\n' "$TESTS_PASSED"
printf 'Tests failed: %s\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
