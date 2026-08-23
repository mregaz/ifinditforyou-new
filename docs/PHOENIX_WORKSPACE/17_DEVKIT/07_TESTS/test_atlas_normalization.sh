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

source "${DEVKIT_ROOT}/10_ATLAS_SDK/normalization.sh"

TRACKER="$(_phoenix::atlas_source_resolve TRACKER)"
TRACKER_HASH_BEFORE="$(shasum -a 256 "$TRACKER" | awk '{print $1}')"

echo "===== IP-05 — STRUCTURAL NORMALIZATION TESTS ====="

# ------------------------------------------------------------------------------
# Canonical logical source reference
# ------------------------------------------------------------------------------

assert_equals \
  "TRACKER source reference is canonical logical asset identity" \
  "PHOENIX_ATLAS_GLOBAL_TRACKER_001_061.csv" \
  "$(_phoenix::atlas_normalized_source_reference TRACKER)"

assert_status \
  "unknown normalization source reference returns INVALID_ARGUMENT" \
  2 \
  _phoenix::atlas_normalized_source_reference UNKNOWN_SOURCE

# ------------------------------------------------------------------------------
# Structural field states
# ------------------------------------------------------------------------------

assert_equals \
  "present field remains PRESENT" \
  $'ATLAS_COUNTRY\tPRESENT\tItalia' \
  "$(_phoenix::atlas_normalized_field ATLAS_COUNTRY Italia)"

assert_equals \
  "missing field is explicit and not converted to UNKNOWN" \
  $'ATLAS_EVIDENCE_NOTE\tMISSING\t' \
  "$(_phoenix::atlas_normalized_field ATLAS_EVIDENCE_NOTE "")"

assert_status \
  "invalid lowercase normalized key is rejected" \
  2 \
  _phoenix::atlas_normalized_field atlas_country Italia

# ------------------------------------------------------------------------------
# Canonical tracker record
# ------------------------------------------------------------------------------

RECORD='1,Italia,Subito.it,Annunci generalisti,EVIDENCED_COMPLETE,Existing Atlas checkpoint / archived research'

NORMALIZED="$(
  _phoenix::atlas_normalize_tracker_record "$RECORD" TRACKER
)"

EXPECTED="$(
cat <<'EXPECTED_RECORD'
ATLAS_TRACKER_ID	PRESENT	1
ATLAS_COUNTRY	PRESENT	Italia
ATLAS_MARKETPLACE	PRESENT	Subito.it
ATLAS_CATEGORY	PRESENT	Annunci generalisti
ATLAS_STATUS	PRESENT	EVIDENCED_COMPLETE
ATLAS_EVIDENCE_NOTE	PRESENT	Existing Atlas checkpoint / archived research
ATLAS_SOURCE	PRESENT	PHOENIX_ATLAS_GLOBAL_TRACKER_001_061.csv
EXPECTED_RECORD
)"

assert_equals \
  "tracker record uses canonical normalized field order" \
  "$EXPECTED" \
  "$NORMALIZED"

# ------------------------------------------------------------------------------
# Semantic preservation
# ------------------------------------------------------------------------------

UNKNOWN_RECORD='99,Italia,Example.test,Test category,UNKNOWN,  semantic whitespace  '

UNKNOWN_NORMALIZED="$(
  _phoenix::atlas_normalize_tracker_record \
    "$UNKNOWN_RECORD" TRACKER
)"

if printf '%s\n' "$UNKNOWN_NORMALIZED" |
   grep -F $'ATLAS_STATUS\tPRESENT\tUNKNOWN' >/dev/null
then
  pass "UNKNOWN status is preserved without reinterpretation"
else
  fail "UNKNOWN status was reinterpreted"
fi

if printf '%s\n' "$UNKNOWN_NORMALIZED" |
   grep -F $'ATLAS_EVIDENCE_NOTE\tPRESENT\t  semantic whitespace  ' >/dev/null
then
  pass "semantic whitespace is preserved"
else
  fail "semantic whitespace was trimmed or rewritten"
fi

# ------------------------------------------------------------------------------
# CRLF structural handling
# ------------------------------------------------------------------------------

CRLF_RECORD=$'2,Italia,Bakeca.it,Annunci generalisti,EVIDENCED_COMPLETE,note\r'

CRLF_NORMALIZED="$(
  _phoenix::atlas_normalize_tracker_record \
    "$CRLF_RECORD" TRACKER
)"

if printf '%s\n' "$CRLF_NORMALIZED" |
   grep -F $'ATLAS_EVIDENCE_NOTE\tPRESENT\tnote' >/dev/null
then
  pass "CRLF terminator is normalized structurally"
else
  fail "CRLF terminator leaked into normalized value"
fi

# ------------------------------------------------------------------------------
# Determinism
# ------------------------------------------------------------------------------

NORMALIZED_AGAIN="$(
  _phoenix::atlas_normalize_tracker_record "$RECORD" TRACKER
)"

assert_equals \
  "single-record normalization is deterministic" \
  "$NORMALIZED" \
  "$NORMALIZED_AGAIN"

# ------------------------------------------------------------------------------
# Whole tracker normalization
# ------------------------------------------------------------------------------

FULL_ONE="$(_phoenix::atlas_normalize_source TRACKER)"
FULL_TWO="$(_phoenix::atlas_normalize_source TRACKER)"

assert_equals \
  "whole TRACKER normalization is deterministic" \
  "$FULL_ONE" \
  "$FULL_TWO"

FIRST_ID="$(
  printf '%s\n' "$FULL_ONE" |
    awk -F '\t' '$1 == "ATLAS_TRACKER_ID" { print $3; exit }'
)"

LAST_ID="$(
  printf '%s\n' "$FULL_ONE" |
    awk -F '\t' '$1 == "ATLAS_TRACKER_ID" { value=$3 } END { print value }'
)"

assert_equals \
  "normalized TRACKER begins with tracker_id 1" \
  "1" \
  "$FIRST_ID"

assert_equals \
  "normalized TRACKER ends with tracker_id 61" \
  "61" \
  "$LAST_ID"

NORMALIZED_RECORD_COUNT="$(
  printf '%s\n' "$FULL_ONE" |
    grep -c '^ATLAS_TRACKER_ID'
)"

assert_equals \
  "all 61 canonical tracker records are preserved" \
  "61" \
  "$NORMALIZED_RECORD_COUNT"

# ------------------------------------------------------------------------------
# No duplicate elimination
# ------------------------------------------------------------------------------

DUPLICATE_SAMPLE="$(
  _phoenix::atlas_normalize_tracker_record "$RECORD" TRACKER
  printf '%s\n' "--"
  _phoenix::atlas_normalize_tracker_record "$RECORD" TRACKER
)"

DUPLICATE_COUNT="$(
  printf '%s\n' "$DUPLICATE_SAMPLE" |
    grep -c '^ATLAS_TRACKER_ID'
)"

assert_equals \
  "normalization does not silently deduplicate records" \
  "2" \
  "$DUPLICATE_COUNT"

# ------------------------------------------------------------------------------
# No public serialization leakage
# ------------------------------------------------------------------------------

if printf '%s\n' "$NORMALIZED" | grep -q '^ATLAS_TRACKER_ID='; then
  fail "IP-05 prematurely emitted public KEY=VALUE serialization"
else
  pass "IP-05 does not prematurely implement KEY=VALUE serialization"
fi

# ------------------------------------------------------------------------------
# Read-only preservation
# ------------------------------------------------------------------------------

TRACKER_HASH_AFTER="$(shasum -a 256 "$TRACKER" | awk '{print $1}')"

assert_equals \
  "normalization does not mutate canonical TRACKER" \
  "$TRACKER_HASH_BEFORE" \
  "$TRACKER_HASH_AFTER"

# ------------------------------------------------------------------------------
# Invalid source handling
# ------------------------------------------------------------------------------

assert_status \
  "missing normalization source returns INVALID_ARGUMENT" \
  2 \
  _phoenix::atlas_normalize_source

assert_status \
  "unsupported normalization source returns INVALID_ARGUMENT" \
  2 \
  _phoenix::atlas_normalize_source FINAL_MASTER

printf '\nTests passed: %s\n' "$TESTS_PASSED"
printf 'Tests failed: %s\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
