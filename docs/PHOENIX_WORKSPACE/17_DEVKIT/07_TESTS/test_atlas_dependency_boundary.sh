#!/usr/bin/env bash

set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
DEVKIT="$ROOT/docs/PHOENIX_WORKSPACE/17_DEVKIT"
SDK="$DEVKIT/10_ATLAS_SDK"
TESTS="$DEVKIT/07_TESTS"

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

echo "===== IP-13 — ATLAS SDK DEPENDENCY BOUNDARY TESTS ====="

echo
echo "===== CORE DOES NOT DEPEND ON ATLAS SDK ====="

CORE="$DEVKIT/core"

if grep -R -n -E \
  '10_ATLAS_SDK|phoenix::atlas_|_phoenix::atlas_' \
  "$CORE" >/dev/null 2>&1; then
  fail "Core depends upward on Atlas SDK"
else
  pass "Core does not depend on Atlas SDK"
fi

echo
echo "===== ATLAS SDK DOES NOT DEPEND ON CLI ====="

if grep -R -n -E \
  '05_CLI|phoenix::cli_|_phoenix::cli_' \
  "$SDK"/*.sh >/dev/null 2>&1; then
  fail "Atlas SDK depends on CLI"
else
  pass "Atlas SDK does not depend on CLI"
fi

echo
echo "===== ATLAS SDK DOES NOT DEPEND ON PLUGIN SYSTEM ====="

if grep -R -n -E \
  'plugins/|plugin\.sh|phoenix::plugin_|_phoenix::plugin_' \
  "$SDK"/*.sh >/dev/null 2>&1; then
  fail "Atlas SDK depends on Plugin System"
else
  pass "Atlas SDK does not depend on Plugin System"
fi

echo
echo "===== ATLAS SDK INTERNAL IMPORT SET ====="

IMPORT_FAIL=0

while IFS= read -r line
do
  case "$line" in
    *'source "${_ATLAS_SDK_DIR}/loader.sh"'|\
    *'source "${_ATLAS_SDK_DIR}/normalization.sh"'|\
    *'source "${_ATLAS_SDK_DIR}/query.sh"'|\
    *'source "${PHOENIX_ATLAS_NORMALIZATION_MODULE_DIR}/loader.sh"'|\
    *'source "${PHOENIX_ATLAS_QUERY_MODULE_DIR}/normalization.sh"'|\
    *'source "${PHOENIX_ATLAS_LOADER_DEVKIT_ROOT}/core/filesystem.sh"')
      ;;
    *)
      printf 'UNEXPECTED IMPORT: %s\n' "$line"
      IMPORT_FAIL=1
      ;;
  esac
done < <(
  grep -R -h -E \
    '^[[:space:]]*(source|\.)[[:space:]]+' \
    "$SDK"/*.sh
)

if [ "$IMPORT_FAIL" -eq 0 ]; then
  pass "Atlas SDK imports only authorized internal/core modules"
else
  fail "Unexpected Atlas SDK dependency detected"
fi

echo
echo "===== NO UNRELATED PRIVATE DEVKIT HELPERS ====="

if grep -R -n -E \
  '_phoenix::(generator|validator|cli|template|registry|plugin|runtime|logger)_' \
  "$SDK"/*.sh >/dev/null 2>&1; then
  fail "Atlas SDK calls unrelated private DevKit helpers"
else
  pass "Atlas SDK does not call unrelated private DevKit helpers"
fi

echo
echo "===== RUNTIME CONSUMERS DO NOT CALL PRIVATE ATLAS HELPERS ====="

PRIVATE_CONSUMER_HITS="$(
  find "$DEVKIT" \
    -type f \
    -name '*.sh' \
    ! -path "$SDK/*" \
    ! -name 'test_atlas_*.sh' \
    -print0 |
  xargs -0 grep -n -H -E \
    '_phoenix::atlas_[A-Za-z0-9_]+' \
    2>/dev/null || true
)"

if [ -z "$PRIVATE_CONSUMER_HITS" ]; then
  pass "Runtime consumers do not call private Atlas helpers"
else
  printf '%s\n' "$PRIVATE_CONSUMER_HITS"
  fail "Runtime consumer calls private Atlas helper"
fi

echo
echo "===== NO DIRECT SDK INTERNAL PATH CONSUMPTION ====="

DIRECT_PATH_HITS="$(
  find "$DEVKIT" \
    -type f \
    -name '*.sh' \
    ! -path "$SDK/*" \
    ! -name 'test_atlas_*.sh' \
    -print0 |
  xargs -0 grep -n -H -E \
    '10_ATLAS_SDK/(loader|normalization|query|provider_card)\.sh' \
    2>/dev/null || true
)"

if [ -z "$DIRECT_PATH_HITS" ]; then
  pass "Runtime consumers do not import Atlas SDK private modules directly"
else
  printf '%s\n' "$DIRECT_PATH_HITS"
  fail "Runtime consumer imports Atlas SDK private module directly"
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
