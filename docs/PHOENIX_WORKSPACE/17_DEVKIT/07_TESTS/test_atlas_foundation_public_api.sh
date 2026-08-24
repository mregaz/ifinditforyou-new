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
    printf '  expected: %s\n' "$expected"
    printf '  actual:   %s\n' "$actual"
  fi
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
DEVKIT_ROOT="$(cd "${SCRIPT_DIR}/.." >/dev/null 2>&1 && pwd)"

source "${DEVKIT_ROOT}/10_ATLAS_SDK/atlas.sh"

echo "===== IP-11 — FOUNDATION PUBLIC API TESTS ====="

# ---------------------------------------------------------------------------
# API identity
# ---------------------------------------------------------------------------

for fn in \
  phoenix::atlas_initialize \
  phoenix::atlas_is_available \
  phoenix::atlas_validate
do
  if declare -F "$fn" >/dev/null 2>&1; then
    pass "$fn is public and callable"
  else
    fail "$fn is public and callable"
  fi
done

# ---------------------------------------------------------------------------
# Zero-argument contract
# ---------------------------------------------------------------------------

assert_status \
  "atlas_initialize rejects undocumented positional argument" \
  2 \
  phoenix::atlas_initialize unexpected

assert_status \
  "atlas_is_available rejects undocumented positional argument" \
  2 \
  phoenix::atlas_is_available unexpected

assert_status \
  "atlas_validate rejects undocumented positional argument" \
  2 \
  phoenix::atlas_validate unexpected

# ---------------------------------------------------------------------------
# Availability predicate
# ---------------------------------------------------------------------------

assert_status \
  "atlas_is_available reports minimum canonical baseline available" \
  0 \
  phoenix::atlas_is_available

AVAILABLE_OUT="$(phoenix::atlas_is_available)"
AVAILABLE_RC=$?

if [[ "$AVAILABLE_RC" -eq 0 && -z "$AVAILABLE_OUT" ]]; then
  pass "atlas_is_available emits no canonical stdout"
else
  fail "atlas_is_available emits no canonical stdout"
fi

# ---------------------------------------------------------------------------
# Validation contract
# ---------------------------------------------------------------------------

VALIDATE_OUT="$(phoenix::atlas_validate)"
VALIDATE_RC=$?

if [[ "$VALIDATE_RC" -eq 0 ]]; then
  pass "atlas_validate succeeds"
else
  fail "atlas_validate succeeds"
fi

if [[ "$VALIDATE_OUT" == "ATLAS_VALID=1" ]]; then
  pass "atlas_validate emits exact canonical success output"
else
  fail "atlas_validate emits exact canonical success output"
  printf '  actual: %s\n' "$VALIDATE_OUT"
fi

# ---------------------------------------------------------------------------
# Initialization contract
# ---------------------------------------------------------------------------

PHOENIX_ATLAS_INITIALIZED=0

phoenix::atlas_initialize
INIT_RC=$?

if [[ "$INIT_RC" -eq 0 ]]; then
  pass "atlas_initialize succeeds"
else
  fail "atlas_initialize succeeds"
fi

if [[ "$PHOENIX_ATLAS_INITIALIZED" -eq 1 ]]; then
  pass "atlas_initialize establishes process-local initialized state"
else
  fail "atlas_initialize establishes process-local initialized state"
fi

# idempotency

phoenix::atlas_initialize
INIT2_RC=$?

if [[ "$INIT2_RC" -eq 0 && "$PHOENIX_ATLAS_INITIALIZED" -eq 1 ]]; then
  pass "atlas_initialize is idempotent"
else
  fail "atlas_initialize is idempotent"
fi

# ---------------------------------------------------------------------------
# Exact public API count
# ---------------------------------------------------------------------------

PUBLIC_COUNT="$(
  declare -F |
  awk '{print $3}' |
  grep '^phoenix::atlas_' |
  LC_ALL=C sort -u |
  wc -l |
  tr -d ' '
)"

if [[ "$PUBLIC_COUNT" -eq 10 ]]; then
  pass "exactly ten public Atlas SDK functions are exposed"
else
  fail "exactly ten public Atlas SDK functions are exposed"
  printf '  actual count: %s\n' "$PUBLIC_COUNT"
fi

# ---------------------------------------------------------------------------
# No forbidden public names
# ---------------------------------------------------------------------------

FORBIDDEN=0

for fn in \
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
  if declare -F "$fn" >/dev/null 2>&1; then
    FORBIDDEN=1
  fi
done

if [[ "$FORBIDDEN" -eq 0 ]]; then
  pass "no forbidden public Atlas API is exposed"
else
  fail "no forbidden public Atlas API is exposed"
fi

printf '\nTests passed: %s\n' "$TESTS_PASSED"
printf 'Tests failed: %s\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
