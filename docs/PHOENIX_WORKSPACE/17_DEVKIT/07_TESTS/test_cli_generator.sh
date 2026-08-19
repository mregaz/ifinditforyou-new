#!/usr/bin/env bash

set -u

# ==============================================================================
# PHOENIX DEVKIT — CLI GENERATOR TESTS
# ==============================================================================
#
# Purpose:
# Validate Generator capabilities exposed through the Phoenix CLI.
#
# ==============================================================================

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

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEVKIT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

CLI="${DEVKIT_ROOT}/05_CLI/phoenix"

TEST_ROOT="$(
  mktemp -d "${TMPDIR:-/tmp}/phoenix-cli-generator.XXXXXX"
)" || exit 1

cleanup() {
  rm -rf "$TEST_ROOT"
}

trap cleanup EXIT

# ------------------------------------------------------------------------------
# Generator List
# ------------------------------------------------------------------------------

generator_list="$(
  "$CLI" generate --list
)"
generator_list_status=$?

expected_generator_list="$(cat <<'LIST'
provider
adr
sprint
documentation
template
LIST
)"

assert_equals \
  "generate --list returns success" \
  "0" \
  "$generator_list_status"

assert_equals \
  "generate --list preserves canonical Generator order" \
  "$expected_generator_list" \
  "$generator_list"

# ------------------------------------------------------------------------------
# Dry Run
# ------------------------------------------------------------------------------

DRY_DEST="${TEST_ROOT}/dry-run"

dry_result="$(
  "$CLI" generate \
    provider \
    "$DRY_DEST" \
    PROVIDER_NAME=anibis \
    COUNTRY=CH \
    --dry-run
)"
dry_status=$?

assert_equals \
  "Generator dry-run returns success" \
  "0" \
  "$dry_status"

if [[ ! -e "$DRY_DEST" ]]; then
  pass "Generator dry-run does not create destination"
else
  fail "Generator dry-run does not create destination"
fi

if printf '%s\n' "$dry_result" | grep -q '^STATUS='; then
  pass "Generator dry-run returns canonical status"
else
  fail "Generator dry-run returns canonical status"
fi

# ------------------------------------------------------------------------------
# Real Generation
# ------------------------------------------------------------------------------

REAL_DEST="${TEST_ROOT}/real"

real_result="$(
  "$CLI" generate \
    provider \
    "$REAL_DEST" \
    PROVIDER_NAME=anibis \
    COUNTRY=CH
)"
real_status=$?

assert_equals \
  "real Generator execution returns success" \
  "0" \
  "$real_status"

if [[ -f "${REAL_DEST}/index.sh" ]]; then
  pass "real Generator execution creates index.sh"
else
  fail "real Generator execution creates index.sh"
fi

if [[ -f "${REAL_DEST}/manifest.phoenix" ]]; then
  pass "real Generator execution creates manifest.phoenix"
else
  fail "real Generator execution creates manifest.phoenix"
fi

if printf '%s\n' "$real_result" | grep -q '^STATUS=SUCCESS$'; then
  pass "real Generator execution returns STATUS=SUCCESS"
else
  fail "real Generator execution returns STATUS=SUCCESS"
fi

if printf '%s\n' "$real_result" |
    grep -q "^GENERATOR=provider$"; then
  pass "real Generator execution identifies provider Generator"
else
  fail "real Generator execution identifies provider Generator"
fi

# ------------------------------------------------------------------------------
# Generated Content
# ------------------------------------------------------------------------------

if grep -q '^# PHOENIX PROVIDER — anibis$' "${REAL_DEST}/index.sh"; then
  pass "generated provider renders PROVIDER_NAME"
else
  fail "generated provider renders PROVIDER_NAME"
fi

if grep -q '^# Country: CH$' "${REAL_DEST}/index.sh"; then
  pass "generated provider renders COUNTRY"
else
  fail "generated provider renders COUNTRY"
fi

# ------------------------------------------------------------------------------
# Collision Protection
# ------------------------------------------------------------------------------

index_before="$(
  shasum "${REAL_DEST}/index.sh" |
    awk '{print $1}'
)"

manifest_before="$(
  shasum "${REAL_DEST}/manifest.phoenix" |
    awk '{print $1}'
)"

"$CLI" generate \
  provider \
  "$REAL_DEST" \
  PROVIDER_NAME=changed \
  COUNTRY=FR \
  >/dev/null 2>&1

collision_status=$?

assert_equals \
  "Generator collision returns failure" \
  "1" \
  "$collision_status"

index_after="$(
  shasum "${REAL_DEST}/index.sh" |
    awk '{print $1}'
)"

manifest_after="$(
  shasum "${REAL_DEST}/manifest.phoenix" |
    awk '{print $1}'
)"

assert_equals \
  "collision preserves existing index.sh" \
  "$index_before" \
  "$index_after"

assert_equals \
  "collision preserves existing manifest.phoenix" \
  "$manifest_before" \
  "$manifest_after"

# ------------------------------------------------------------------------------
# Overwrite Policy Preservation
# ------------------------------------------------------------------------------

"$CLI" generate \
  provider \
  "$REAL_DEST" \
  PROVIDER_NAME=changed \
  COUNTRY=FR \
  --overwrite \
  >/dev/null 2>&1

overwrite_status=$?

assert_equals \
  "CLI preserves Generator overwrite policy result" \
  "1" \
  "$overwrite_status"

index_after_overwrite="$(
  shasum "${REAL_DEST}/index.sh" |
    awk '{print $1}'
)"

manifest_after_overwrite="$(
  shasum "${REAL_DEST}/manifest.phoenix" |
    awk '{print $1}'
)"

assert_equals \
  "rejected overwrite preserves index.sh" \
  "$index_before" \
  "$index_after_overwrite"

assert_equals \
  "rejected overwrite preserves manifest.phoenix" \
  "$manifest_before" \
  "$manifest_after_overwrite"

# ------------------------------------------------------------------------------
# Invalid Generator
# ------------------------------------------------------------------------------

"$CLI" generate \
  does-not-exist \
  "${TEST_ROOT}/unknown" \
  TEST=value \
  >/dev/null 2>&1

unknown_status=$?

assert_equals \
  "unknown Generator returns execution failure" \
  "1" \
  "$unknown_status"

if [[ ! -e "${TEST_ROOT}/unknown" ]]; then
  pass "unknown Generator produces no destination"
else
  fail "unknown Generator produces no destination"
fi

# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\n'
printf 'CLI Generator Tests\n'
printf '===================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
