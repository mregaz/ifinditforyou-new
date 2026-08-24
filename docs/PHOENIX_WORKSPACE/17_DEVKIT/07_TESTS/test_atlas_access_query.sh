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

echo "===== IP-09 — ACCESS QUERY TESTS ====="

OUT="$(phoenix::atlas_access_get 1)"
RC=$?

if [[ "$RC" -eq 0 ]]; then
  pass "access lookup succeeds for canonical provider"
else
  fail "access lookup succeeds for canonical provider"
fi

if printf "%s\n" "$OUT" | grep -q "^PROVIDER_ID=1$"; then
  pass "access output preserves provider identity"
else
  fail "access output preserves provider identity"
fi

if printf "%s\n" "$OUT" | grep -q "^ACCESS_STATE=UNKNOWN$"; then
  pass "unknown access state remains UNKNOWN"
else
  fail "unknown access state remains UNKNOWN"
fi

if printf "%s\n" "$OUT" | grep -q "^ACCESS_POLICY=UNKNOWN$"; then
  pass "unknown access policy remains UNKNOWN"
else
  fail "unknown access policy remains UNKNOWN"
fi

if printf "%s\n" "$OUT" | grep -q "^SOURCE_REFERENCE=PHOENIX_ATLAS_FINAL_MASTER_v1.0.md$"; then
  pass "access output preserves canonical source reference"
else
  fail "access output preserves canonical source reference"
fi

assert_status "unknown provider returns NOT_FOUND" 3 phoenix::atlas_access_get 999
assert_status "missing argument returns INVALID_ARGUMENT" 2 phoenix::atlas_access_get
assert_status "empty provider ID returns INVALID_ARGUMENT" 2 phoenix::atlas_access_get ""
assert_status "malformed provider ID returns INVALID_ARGUMENT" 2 phoenix::atlas_access_get abc
assert_status "surplus argument returns INVALID_ARGUMENT" 2 phoenix::atlas_access_get 1 extra

OUT2="$(phoenix::atlas_access_get 1)"

if [[ "$OUT" == "$OUT2" ]]; then
  pass "access lookup is deterministic"
else
  fail "access lookup is deterministic"
fi

if printf "%s\n" "$OUT" | grep -q "/Users/"; then
  fail "access output exposes machine-specific path"
else
  pass "access output exposes no machine-specific path"
fi

if printf "%s\n" "$OUT" | grep -Eq "^ACCESS_STATE=(AUTHORIZED|AVAILABLE|EXECUTABLE|OFFICIAL_API|PARTNERSHIP)$"; then
  fail "access lookup inferred authorization or availability"
else
  pass "access lookup performs no authorization inference"
fi

printf "\nTests passed: %s\n" "$TESTS_PASSED"
printf "Tests failed: %s\n" "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
