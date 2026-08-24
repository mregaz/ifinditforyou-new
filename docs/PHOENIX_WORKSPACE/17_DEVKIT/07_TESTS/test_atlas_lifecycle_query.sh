#!/usr/bin/env bash

set -u

TESTS_PASSED=0
TESTS_FAILED=0

pass() {
  printf "PASS: %s\n" "$1"
  TESTS_PASSED=$((TESTS_PASSED + 1))
}

fail() {
  printf "FAIL: %s\n" "$1"
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
    printf "  expected status: %s\n" "$expected"
    printf "  actual status:   %s\n" "$actual"
  fi
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
DEVKIT_ROOT="$(cd "${SCRIPT_DIR}/.." >/dev/null 2>&1 && pwd)"

source "${DEVKIT_ROOT}/10_ATLAS_SDK/query.sh"

echo "===== IP-09 — LIFECYCLE QUERY TESTS ====="

OUT="$(phoenix::atlas_lifecycle_get 1)"
RC=$?

if [[ "$RC" -eq 0 ]]; then
  pass "lifecycle lookup succeeds for canonical provider"
else
  fail "lifecycle lookup succeeds for canonical provider"
fi

if printf "%s\n" "$OUT" | grep -q "^PROVIDER_ID=1$"; then
  pass "lifecycle output preserves provider identity"
else
  fail "lifecycle output preserves provider identity"
fi

if printf "%s\n" "$OUT" | grep -q "^LIFECYCLE=UNKNOWN$"; then
  pass "unknown lifecycle remains UNKNOWN"
else
  fail "unknown lifecycle remains UNKNOWN"
fi

if printf "%s\n" "$OUT" | grep -q "^SOURCE_REFERENCE=PHOENIX_ATLAS_FINAL_MASTER_v1.0.md$"; then
  pass "lifecycle output preserves canonical source reference"
else
  fail "lifecycle output preserves canonical source reference"
fi

assert_status "unknown provider returns NOT_FOUND" 3 phoenix::atlas_lifecycle_get 999
assert_status "missing argument returns INVALID_ARGUMENT" 2 phoenix::atlas_lifecycle_get
assert_status "empty provider ID returns INVALID_ARGUMENT" 2 phoenix::atlas_lifecycle_get ""
assert_status "malformed provider ID returns INVALID_ARGUMENT" 2 phoenix::atlas_lifecycle_get abc
assert_status "surplus argument returns INVALID_ARGUMENT" 2 phoenix::atlas_lifecycle_get 1 extra

OUT2="$(phoenix::atlas_lifecycle_get 1)"

if [[ "$OUT" == "$OUT2" ]]; then
  pass "lifecycle lookup is deterministic"
else
  fail "lifecycle lookup is deterministic"
fi

if printf "%s\n" "$OUT" | grep -q "/Users/"; then
  fail "lifecycle output exposes no machine-specific path"
else
  pass "lifecycle output exposes no machine-specific path"
fi

if printf "%s\n" "$OUT" | grep -Eq "^LIFECYCLE=(ACTIVE|MIGRATING|ABSORBED|API_RETIRED|TRANSACTION_DISABLED|CLOSED|HISTORICAL)$"; then
  fail "lifecycle lookup inferred a positive lifecycle value"
else
  pass "lifecycle lookup performs no positive lifecycle inference"
fi

printf "\nTests passed: %s\n" "$TESTS_PASSED"
printf "Tests failed: %s\n" "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
