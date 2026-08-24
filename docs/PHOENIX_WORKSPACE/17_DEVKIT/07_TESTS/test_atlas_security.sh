#!/usr/bin/env bash

set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
SDK="$ROOT/docs/PHOENIX_WORKSPACE/17_DEVKIT/10_ATLAS_SDK"

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

echo "===== IP-12 — ATLAS SDK SECURITY VERIFICATION TESTS ====="

echo
echo "===== 1. NO EVAL ====="

if grep -R -n -E \
  '(^|[[:space:];|&])eval([[:space:]]|$)' \
  "$SDK"/*.sh >/dev/null 2>&1; then
  fail "Atlas SDK contains eval"
else
  pass "Atlas SDK does not use eval"
fi

echo
echo "===== 2. NO BASH-C / SH-C ====="

if grep -R -n -E \
  '(^|[[:space:];|&])(bash|sh)[[:space:]]+-c([[:space:]]|$)' \
  "$SDK"/*.sh >/dev/null 2>&1; then
  fail "Atlas SDK contains bash -c or sh -c"
else
  pass "Atlas SDK does not use bash -c or sh -c"
fi

echo
echo "===== 3. CANONICAL DATA NEVER SOURCED ====="

if grep -R -n -E \
  '^[[:space:]]*(source|\.)[[:space:]]+.*(PHOENIX_ATLAS_GLOBAL_TRACKER|PHOENIX_ATLAS_FINAL_MASTER|PHOENIX_ATLAS_FINAL_RECONCILIATION|PHOENIX_ATLAS_STRATEGIC_SYNTHESIS|PHOENIX_ADAPTIVE_SEARCH_AND_EVIDENCE_ARCHITECTURE|PHOENIX_PROVIDER_PLANNER_AND_SEARCH_STATE_SPECIFICATION|SURFACE_REGISTRY)' \
  "$SDK"/*.sh >/dev/null 2>&1; then
  fail "Canonical Atlas data is sourced as executable shell code"
else
  pass "Canonical Atlas data is never sourced as executable shell code"
fi

echo
echo "===== 4. NO INDIRECT SHELL EXECUTION ====="

if grep -R -n -E \
  '(^|[[:space:];|&])(xargs|exec)[[:space:]].*(bash|sh)([[:space:]]|$)' \
  "$SDK"/*.sh >/dev/null 2>&1; then
  fail "Indirect shell execution primitive detected"
else
  pass "No indirect shell execution primitive detected"
fi

echo
echo "===== 5. NO NETWORK RETRIEVAL ====="

if grep -R -n -E \
  '(^|[[:space:];|&])(curl|wget|nc|netcat|ssh|scp|ftp|telnet)([[:space:]]|$)' \
  "$SDK"/*.sh >/dev/null 2>&1; then
  fail "Network-capable command detected"
else
  pass "Atlas SDK performs no network retrieval"
fi

echo
echo "===== 6. NO RECURSIVE SOURCE DISCOVERY ====="

if grep -R -n -E \
  '(^|[[:space:];|&])find[[:space:]].*(-name|-iname).*ATLAS|(^|[[:space:];|&])find[[:space:]].*PHOENIX_' \
  "$SDK"/*.sh >/dev/null 2>&1; then
  fail "Recursive canonical source discovery detected"
else
  pass "Canonical source discovery is not recursive"
fi

echo
echo "===== 7. NO FILESYSTEM MUTATION COMMANDS ====="

if grep -R -n -E \
  '^[[:space:]]*(rm|mv|cp|mkdir|rmdir|touch|chmod|chown|truncate)[[:space:]]' \
  "$SDK"/*.sh >/dev/null 2>&1; then
  fail "Filesystem mutation command detected in Atlas SDK"
else
  pass "Atlas SDK contains no filesystem mutation command"
fi

echo
echo "===== 8. NO IN-PLACE FILE REWRITE ====="

if grep -R -n -E \
  '(^|[[:space:];|&])sed[[:space:]]+-i([[:space:]]|$)|(^|[[:space:];|&])perl[[:space:]]+-[^[:space:]]*i([^[:alnum:]_]|$)' \
  "$SDK"/*.sh >/dev/null 2>&1; then
  fail "In-place rewrite primitive detected"
else
  pass "Atlas SDK performs no in-place source rewrite"
fi

echo
echo "===== 9. NO ARBITRARY PUBLIC SOURCE PATH API ====="

if grep -R -n -E \
  '^phoenix::atlas_[a-z_]+\([^)]*(path|file|filename|directory|root)' \
  "$SDK"/*.sh >/dev/null 2>&1; then
  fail "Public Atlas API exposes arbitrary filesystem input"
else
  pass "Public Atlas API exposes no arbitrary filesystem source input"
fi

echo
echo "===== 10. FORBIDDEN PUBLIC FUNCTIONS ABSENT ====="

FORBIDDEN=0

for fn in \
  atlas_plan_search \
  atlas_stop \
  atlas_expand \
  atlas_rank_provider \
  atlas_resolve_entity \
  atlas_fuse_evidence \
  atlas_decide \
  atlas_recommend \
  atlas_scrape \
  atlas_fetch_provider \
  atlas_refresh_from_network
do
  if grep -R -q "^phoenix::${fn}()" "$SDK"; then
    printf 'FAIL: forbidden API phoenix::%s detected\n' "$fn"
    FORBIDDEN=1
  fi
done

if [ "$FORBIDDEN" -eq 0 ]; then
  pass "No forbidden Atlas public API is implemented"
else
  FAILED=$((FAILED + 1))
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
