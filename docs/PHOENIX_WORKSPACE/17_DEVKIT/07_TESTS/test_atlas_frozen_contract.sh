#!/usr/bin/env bash

set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
DEVKIT="$ROOT/docs/PHOENIX_WORKSPACE/17_DEVKIT"
SDK="$DEVKIT/10_ATLAS_SDK"
SPEC="$DEVKIT/01_ARCHITECTURE/PHOENIX_ATLAS_SDK_FUNCTION_SPECIFICATION_v1.0.md"

PASSED=0
FAILED=0

pass() {
  printf 'PASS: %s\n' "$1"
  PASSED=$((PASSED + 1))
}

fail() {
  printf 'FAIL: %s\n' "$1"
  FAILED=$((FAILED + 1))
}

echo "===== IP-14 — ATLAS SDK FROZEN CONTRACT REGRESSION ====="

echo
echo "===== PUBLIC API EXACT SET ====="

EXPECTED_API="$(mktemp)"
ACTUAL_API="$(mktemp)"

printf '%s\n' \
  "phoenix::atlas_initialize" \
  "phoenix::atlas_is_available" \
  "phoenix::atlas_validate" \
  "phoenix::atlas_provider_get" \
  "phoenix::atlas_provider_list" \
  "phoenix::atlas_surface_get" \
  "phoenix::atlas_surface_list" \
  "phoenix::atlas_lifecycle_get" \
  "phoenix::atlas_access_get" \
  "phoenix::atlas_provider_card" \
  | LC_ALL=C sort > "$EXPECTED_API"

grep -R -h -E \
  '^phoenix::atlas_[A-Za-z0-9_]+\(\)' \
  "$SDK"/*.sh |
  sed 's/[[:space:]]*().*$//' |
  LC_ALL=C sort -u > "$ACTUAL_API"

if diff -u "$EXPECTED_API" "$ACTUAL_API" >/dev/null; then
  pass "Frozen public API set remains exact"
else
  fail "Frozen public API set changed"
fi

rm -f "$EXPECTED_API" "$ACTUAL_API"

echo
echo "===== PUBLIC API COUNT ====="

PUBLIC_COUNT="$(
  grep -R -h -E \
    '^phoenix::atlas_[A-Za-z0-9_]+\(\)' \
    "$SDK"/*.sh |
  sed 's/[[:space:]]*().*$//' |
  LC_ALL=C sort -u |
  wc -l |
  tr -d ' '
)"

if [ "$PUBLIC_COUNT" -eq 10 ]; then
  pass "Frozen public API count remains 10"
else
  fail "Frozen public API count changed"
fi

echo
echo "===== FORBIDDEN PUBLIC API ABSENCE ====="

FORBIDDEN=0

for symbol in \
  phoenix::atlas_plan_search \
  phoenix::atlas_stop \
  phoenix::atlas_expand \
  phoenix::atlas_rank_provider \
  phoenix::atlas_resolve_entity \
  phoenix::atlas_fuse_evidence \
  phoenix::atlas_decide \
  phoenix::atlas_recommend \
  phoenix::atlas_scrape \
  phoenix::atlas_fetch_provider \
  phoenix::atlas_refresh_from_network
do
  if grep -R -q -F "${symbol}()" "$SDK"/*.sh; then
    printf 'FAIL: forbidden public symbol implemented: %s\n' "$symbol"
    FORBIDDEN=1
  fi
done

if [ "$FORBIDDEN" -eq 0 ]; then
  pass "Frozen forbidden API set remains absent"
else
  FAILED=$((FAILED + 1))
fi

echo
echo "===== FROZEN SPEC MARKERS ====="

MARKER_FAIL=0

for marker in \
  "Public API Freeze" \
  "Return Status Mapping" \
  "Source Requirement Matrix" \
  "Canonical Serialization"
do
  if grep -q "$marker" "$SPEC"; then
    printf 'PASS: marker present: %s\n' "$marker"
  else
    printf 'FAIL: marker missing: %s\n' "$marker"
    MARKER_FAIL=1
  fi
done

if [ "$MARKER_FAIL" -eq 0 ]; then
  pass "Frozen contract markers remain present"
else
  FAILED=$((FAILED + 1))
fi

echo
echo "===== FROZEN STATE VALUES ====="

STATE_FAIL=0

if ! grep -E \
  'Public API Freeze[[:space:]]+FROZEN' \
  "$SPEC" >/dev/null; then
  STATE_FAIL=1
fi

if ! grep -E \
  'Return Status Mapping[[:space:]]+FROZEN' \
  "$SPEC" >/dev/null; then
  STATE_FAIL=1
fi

if ! grep -E \
  'Canonical Serialization[[:space:]]+FROZEN' \
  "$SPEC" >/dev/null; then
  STATE_FAIL=1
fi

if [ "$STATE_FAIL" -eq 0 ]; then
  pass "Frozen contract states remain FROZEN"
else
  fail "One or more frozen contract states changed"
fi

echo
echo "===== IMPLEMENTATION STATE ====="

if grep -E \
  'Implementation[[:space:]]+COMPLETE' \
  "$SPEC" >/dev/null; then
  pass "Implementation state remains COMPLETE"
else
  fail "Implementation state no longer COMPLETE"
fi

echo
echo "===== FINAL CERTIFICATION STATE ====="

if grep -E \
  '^Final Certification[[:space:]]+COMPLETE$' \
  "$SPEC" >/dev/null; then
  pass "Final Certification is COMPLETE"
else
  fail "Final Certification is not COMPLETE"
fi

echo
echo "===== SECURITY BOUNDARY STILL FROZEN ====="

if grep -R -E \
  '(^|[[:space:];|&])eval([[:space:]]|$)|(^|[[:space:];|&])(bash|sh)[[:space:]]+-c([[:space:]]|$)' \
  "$SDK"/*.sh >/dev/null 2>&1; then
  fail "Forbidden dynamic execution mechanism appeared"
else
  pass "Security execution boundary remains intact"
fi

echo
echo "===== NETWORK BOUNDARY STILL FROZEN ====="

if grep -R -E \
  '(^|[[:space:];|&])(curl|wget|nc|netcat|ssh|scp|ftp|telnet)([[:space:]]|$)' \
  "$SDK"/*.sh >/dev/null 2>&1; then
  fail "Network retrieval mechanism appeared"
else
  pass "Network boundary remains intact"
fi

echo
echo "===== DEPENDENCY DIRECTION STILL FROZEN ====="

if grep -R -E \
  '05_CLI|phoenix::cli_|_phoenix::cli_|plugins/|phoenix::plugin_|_phoenix::plugin_' \
  "$SDK"/*.sh >/dev/null 2>&1; then
  fail "Forbidden upward dependency appeared"
else
  pass "Dependency direction remains intact"
fi

echo
echo "===== TEST SUMMARY ====="
echo "TESTS_PASSED=$PASSED"
echo "TESTS_FAILED=$FAILED"

if [ "$FAILED" -eq 0 ]; then
  echo "TEST_RC=0"
  echo "RESULT=PASS"
  exit 0
fi

echo "TEST_RC=1"
echo "RESULT=FAIL"
exit 1
