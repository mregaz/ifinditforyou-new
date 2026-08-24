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

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
DEVKIT_ROOT="$(cd "${SCRIPT_DIR}/.." >/dev/null 2>&1 && pwd)"

source "${DEVKIT_ROOT}/10_ATLAS_SDK/query.sh"

echo "===== IP-10 — PROVIDER CARD TESTS ====="

OUT="$(phoenix::atlas_provider_card 1)"
RC=$?

if [[ "$RC" -eq 0 ]]; then
  pass "Provider Card succeeds for canonical provider"
else
  fail "Provider Card succeeds for canonical provider"
fi

assert_line() {
  local description="$1"
  local expected="$2"

  if printf '%s\n' "$OUT" | grep -Fqx "$expected"; then
    pass "$description"
  else
    fail "$description"
    printf '  expected line: %s\n' "$expected"
  fi
}

assert_line \
  "Provider Card preserves provider identity" \
  "PROVIDER_ID=1"

assert_line \
  "Provider Card preserves marketplace" \
  "MARKETPLACE=Subito.it"

assert_line \
  "Provider Card preserves country" \
  "COUNTRY=Italia"

assert_line \
  "Provider Card preserves category" \
  "CATEGORY=Annunci generalisti"

assert_line \
  "Provider Family remains UNKNOWN" \
  "PROVIDER_FAMILY=UNKNOWN"

assert_line \
  "Marketplace Surface remains UNKNOWN" \
  "MARKETPLACE_SURFACE=UNKNOWN"

assert_line \
  "Lifecycle remains UNKNOWN" \
  "LIFECYCLE=UNKNOWN"

assert_line \
  "Access state remains UNKNOWN" \
  "ACCESS_STATE=UNKNOWN"

assert_line \
  "Provider Card preserves Atlas status" \
  "ATLAS_STATUS=EVIDENCED_COMPLETE"

assert_line \
  "Provider Card preserves evidence note" \
  "EVIDENCE_NOTE=Existing Atlas checkpoint / archived research"

assert_line \
  "Provider Card preserves primary Tracker source" \
  "SOURCE_REFERENCE=PHOENIX_ATLAS_GLOBAL_TRACKER_001_061.csv"

assert_line \
  "Provider Card preserves secondary Final Master source" \
  "SOURCE_REFERENCE_2=PHOENIX_ATLAS_FINAL_MASTER_v1.0.md"

EXPECTED_KEYS="$(cat <<'KEYS'
PROVIDER_ID
MARKETPLACE
COUNTRY
CATEGORY
PROVIDER_FAMILY
MARKETPLACE_SURFACE
LIFECYCLE
ACCESS_STATE
ATLAS_STATUS
EVIDENCE_NOTE
SOURCE_REFERENCE
SOURCE_REFERENCE_2
KEYS
)"

ACTUAL_KEYS="$(
  printf '%s\n' "$OUT" |
  awk -F= '{print $1}'
)"

if [[ "$ACTUAL_KEYS" == "$EXPECTED_KEYS" ]]; then
  pass "Provider Card field order is canonical and deterministic"
else
  fail "Provider Card field order is canonical and deterministic"
  printf '%s\n' "--- expected keys ---"
  printf '%s\n' "$EXPECTED_KEYS"
  printf '%s\n' "--- actual keys ---"
  printf '%s\n' "$ACTUAL_KEYS"
fi

LINE_COUNT="$(
  printf '%s\n' "$OUT" |
  awk 'END { print NR }'
)"

if [[ "$LINE_COUNT" -eq 12 ]]; then
  pass "Provider Card exposes exactly 12 canonical fields"
else
  fail "Provider Card exposes exactly 12 canonical fields"
  printf '  actual lines: %s\n' "$LINE_COUNT"
fi

OUT2="$(phoenix::atlas_provider_card 1)"

if [[ "$OUT" == "$OUT2" ]]; then
  pass "Provider Card output is deterministic"
else
  fail "Provider Card output is deterministic"
fi

assert_status \
  "unknown provider returns NOT_FOUND" \
  3 \
  phoenix::atlas_provider_card 999

assert_status \
  "missing Provider Card argument returns INVALID_ARGUMENT" \
  2 \
  phoenix::atlas_provider_card

assert_status \
  "empty Provider Card ID returns INVALID_ARGUMENT" \
  2 \
  phoenix::atlas_provider_card ""

assert_status \
  "malformed Provider Card ID returns INVALID_ARGUMENT" \
  2 \
  phoenix::atlas_provider_card abc

assert_status \
  "surplus Provider Card argument returns INVALID_ARGUMENT" \
  2 \
  phoenix::atlas_provider_card 1 extra

if printf '%s\n' "$OUT" | grep -q '/Users/'; then
  fail "Provider Card exposes no machine-specific absolute path"
else
  pass "Provider Card exposes no machine-specific absolute path"
fi

if printf '%s\n' "$OUT" |
  grep -Eq '^(RANK|SCORE|RECOMMENDATION|EXECUTABLE|SEARCH_ROLE)='; then
  fail "Provider Card emits forbidden decision/runtime fields"
else
  pass "Provider Card emits no forbidden decision/runtime fields"
fi

if printf '%s\n' "$OUT" |
  grep -Eq '^LIFECYCLE=(ACTIVE|MIGRATING|ABSORBED|API_RETIRED|TRANSACTION_DISABLED|CLOSED|HISTORICAL)$'; then
  fail "Provider Card inferred lifecycle"
else
  pass "Provider Card performs no lifecycle inference"
fi

if printf '%s\n' "$OUT" |
  grep -Eq '^ACCESS_STATE=(AUTHORIZED|AVAILABLE|EXECUTABLE|OFFICIAL_API|PARTNERSHIP)$'; then
  fail "Provider Card inferred access authorization"
else
  pass "Provider Card performs no access inference"
fi

printf '\nTests passed: %s\n' "$TESTS_PASSED"
printf 'Tests failed: %s\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
