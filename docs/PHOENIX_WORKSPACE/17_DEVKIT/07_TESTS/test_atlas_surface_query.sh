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

SCRIPT_DIR="$(
  cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 &&
  pwd
)"

DEVKIT_ROOT="$(
  cd "${SCRIPT_DIR}/.." >/dev/null 2>&1 &&
  pwd
)"

source "${DEVKIT_ROOT}/10_ATLAS_SDK/query.sh"

echo "===== IP-08 — MARKETPLACE SURFACE QUERY TESTS ====="

OUT="$(
  phoenix::atlas_surface_get ATLAS-SURFACE-001
)"
RC=$?

if [[ "$RC" -eq 0 ]] &&
   printf '%s\n' "$OUT" | grep -q '^SURFACE_ID=ATLAS-SURFACE-001$'; then
  pass "surface lookup succeeds for canonical Surface identity"
else
  fail "surface lookup succeeds for canonical Surface identity"
fi

if printf '%s\n' "$OUT" | grep -q '^MARKETPLACE=Subito.it$'; then
  pass "surface lookup preserves canonical marketplace"
else
  fail "surface lookup preserves canonical marketplace"
fi

if printf '%s\n' "$OUT" | grep -q '^COUNTRY=Italia$'; then
  pass "surface lookup preserves canonical country"
else
  fail "surface lookup preserves canonical country"
fi

if printf '%s\n' "$OUT" | grep -q '^PROVIDER_FAMILY=UNKNOWN$'; then
  pass "surface lookup preserves UNKNOWN provider family"
else
  fail "surface lookup preserves UNKNOWN provider family"
fi

if printf '%s\n' "$OUT" | grep -q '^ACCESS_STATE=UNKNOWN$'; then
  pass "surface lookup preserves UNKNOWN access state"
else
  fail "surface lookup preserves UNKNOWN access state"
fi

if printf '%s\n' "$OUT" | grep -q '^LIFECYCLE=UNKNOWN$'; then
  pass "surface lookup preserves UNKNOWN lifecycle"
else
  fail "surface lookup preserves UNKNOWN lifecycle"
fi

if printf '%s\n' "$OUT" |
   grep -q '^SOURCE_REFERENCE=PHOENIX_ATLAS_GLOBAL_TRACKER_001_061.csv$'; then
  pass "surface lookup preserves canonical source traceability"
else
  fail "surface lookup preserves canonical source traceability"
fi

assert_status \
  "unknown Surface identity returns NOT_FOUND" \
  3 \
  phoenix::atlas_surface_get ATLAS-SURFACE-999

assert_status \
  "empty Surface ID returns INVALID_ARGUMENT" \
  2 \
  phoenix::atlas_surface_get ""

assert_status \
  "malformed Surface ID returns INVALID_ARGUMENT" \
  2 \
  phoenix::atlas_surface_get surface-001

assert_status \
  "missing Surface argument returns INVALID_ARGUMENT" \
  2 \
  phoenix::atlas_surface_get

assert_status \
  "surplus Surface argument returns INVALID_ARGUMENT" \
  2 \
  phoenix::atlas_surface_get ATLAS-SURFACE-001 extra

assert_status \
  "surface list rejects undocumented positional argument" \
  2 \
  phoenix::atlas_surface_list extra

OUT1="$(phoenix::atlas_surface_get ATLAS-SURFACE-061)"
OUT2="$(phoenix::atlas_surface_get ATLAS-SURFACE-061)"

if [[ "$OUT1" == "$OUT2" ]]; then
  pass "surface lookup is deterministic"
else
  fail "surface lookup is deterministic"
fi

LIST1="$(phoenix::atlas_surface_list)"
LIST_RC=$?

if [[ "$LIST_RC" -eq 0 && -n "$LIST1" ]]; then
  pass "complete Surface list succeeds"
else
  fail "complete Surface list succeeds"
fi

LIST2="$(phoenix::atlas_surface_list)"

if [[ "$LIST1" == "$LIST2" ]]; then
  pass "Surface listing is deterministic"
else
  fail "Surface listing is deterministic"
fi

COUNT="$(
  printf '%s\n' "$LIST1" |
    grep -c '^SURFACE_ID='
)"

if [[ "$COUNT" -eq 61 ]]; then
  pass "Surface listing preserves all 61 canonical Surface records"
else
  fail "Surface listing preserves all 61 canonical Surface records"
fi

FIRST="$(
  printf '%s\n' "$LIST1" |
    grep '^SURFACE_ID=' |
    head -n 1
)"

LAST="$(
  printf '%s\n' "$LIST1" |
    grep '^SURFACE_ID=' |
    tail -n 1
)"

if [[ "$FIRST" == "SURFACE_ID=ATLAS-SURFACE-001" ]]; then
  pass "Surface listing begins with ATLAS-SURFACE-001"
else
  fail "Surface listing begins with ATLAS-SURFACE-001"
fi

if [[ "$LAST" == "SURFACE_ID=ATLAS-SURFACE-061" ]]; then
  pass "Surface listing ends with ATLAS-SURFACE-061"
else
  fail "Surface listing ends with ATLAS-SURFACE-061"
fi

if printf '%s\n' "$LIST1" | grep -q '/Users/'; then
  fail "Surface output exposes no machine-specific absolute path"
else
  pass "Surface output exposes no machine-specific absolute path"
fi

QUERY_FILE="${DEVKIT_ROOT}/10_ATLAS_SDK/query.sh"

if grep -E 'curl|wget|https?://' "$QUERY_FILE" >/dev/null 2>&1; then
  fail "Surface query implementation performs no network access"
else
  pass "Surface query implementation performs no network access"
fi

printf '\nTests passed: %s\n' "$TESTS_PASSED"
printf 'Tests failed: %s\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
