#!/usr/bin/env bash

set -u

TEST_DIR="$(
  cd "$(dirname "${BASH_SOURCE[0]}")" && pwd
)"

SDK_DIR="${TEST_DIR}/../10_ATLAS_SDK"

source "${SDK_DIR}/query.sh"

passed=0
failed=0

pass() {
  printf 'PASS: %s\n' "$1"
  passed=$((passed + 1))
}

fail() {
  printf 'FAIL: %s\n' "$1"
  failed=$((failed + 1))
}

assert_status() {
  local description="$1"
  local expected="$2"
  shift 2

  "$@" >/dev/null 2>/dev/null
  local actual=$?

  if [[ "$actual" -eq "$expected" ]]; then
    pass "$description"
  else
    fail "$description"
    printf '  expected status: %s\n' "$expected"
    printf '  actual status:   %s\n' "$actual"
  fi
}

echo "===== IP-07 — PROVIDER QUERY TESTS ====="

output="$(phoenix::atlas_provider_get 1)"
rc=$?

if [[ "$rc" -eq 0 ]] &&
   printf '%s\n' "$output" | grep -q '^PROVIDER_ID=1$'
then
  pass "provider lookup succeeds for canonical tracker identity"
else
  fail "provider lookup succeeds for canonical tracker identity"
fi

assert_status \
  "unknown provider returns NOT_FOUND" \
  3 \
  phoenix::atlas_provider_get 999999

assert_status \
  "empty provider ID returns INVALID_ARGUMENT" \
  2 \
  phoenix::atlas_provider_get ""

assert_status \
  "malformed provider ID returns INVALID_ARGUMENT" \
  2 \
  phoenix::atlas_provider_get abc

assert_status \
  "missing provider argument returns INVALID_ARGUMENT" \
  2 \
  phoenix::atlas_provider_get

assert_status \
  "surplus provider argument returns INVALID_ARGUMENT" \
  2 \
  phoenix::atlas_provider_get 1 extra

assert_status \
  "provider list rejects undocumented positional argument" \
  2 \
  phoenix::atlas_provider_list extra

output1="$(phoenix::atlas_provider_get 1)"
output2="$(phoenix::atlas_provider_get 1)"

if [[ "$output1" == "$output2" ]]; then
  pass "provider lookup is deterministic"
else
  fail "provider lookup is deterministic"
fi

if printf '%s\n' "$output1" |
   grep -q '^SOURCE_REFERENCE=PHOENIX_ATLAS_GLOBAL_TRACKER_001_061.csv$'
then
  pass "provider lookup preserves canonical source traceability"
else
  fail "provider lookup preserves canonical source traceability"
fi

if ! printf '%s\n' "$output1" |
   grep -Eq '^(/|.*Users/|.*Documents/)'
then
  pass "provider output exposes no machine-specific absolute path"
else
  fail "provider output exposes no machine-specific absolute path"
fi

list1="$(phoenix::atlas_provider_list)"
list_rc=$?

if [[ "$list_rc" -eq 0 ]]; then
  pass "complete provider list succeeds"
else
  fail "complete provider list succeeds"
fi

list2="$(phoenix::atlas_provider_list)"

if [[ "$list1" == "$list2" ]]; then
  pass "provider listing is deterministic"
else
  fail "provider listing is deterministic"
fi

provider_count="$(
  printf '%s\n' "$list1" |
    grep -c '^PROVIDER_ID='
)"

if [[ "$provider_count" -eq 61 ]]; then
  pass "provider listing preserves all 61 canonical tracker records"
else
  fail "provider listing preserves all 61 canonical tracker records"
  printf '  actual count: %s\n' "$provider_count"
fi

first_provider="$(
  printf '%s\n' "$list1" |
    grep '^PROVIDER_ID=' |
    head -n 1
)"

last_provider="$(
  printf '%s\n' "$list1" |
    grep '^PROVIDER_ID=' |
    tail -n 1
)"

if [[ "$first_provider" == "PROVIDER_ID=1" ]]; then
  pass "provider listing begins with tracker identity 1"
else
  fail "provider listing begins with tracker identity 1"
fi

if [[ "$last_provider" == "PROVIDER_ID=61" ]]; then
  pass "provider listing ends with tracker identity 61"
else
  fail "provider listing ends with tracker identity 61"
fi

ids="$(
  printf '%s\n' "$list1" |
    sed -n 's/^PROVIDER_ID=//p'
)"

sorted_ids="$(
  printf '%s\n' "$ids" |
    LC_ALL=C sort -n
)"

if [[ "$ids" == "$sorted_ids" ]]; then
  pass "provider listing uses deterministic tracker_id ascending order"
else
  fail "provider listing uses deterministic tracker_id ascending order"
fi

if ! awk '
  /^[[:space:]]*#/ { next }
  { print }
' "$SDK_DIR/query.sh" |
  grep -Eq 'fuzzy|approximate marketplace|opaque scoring|network search'
then
  pass "provider query implementation contains no fuzzy matching mechanism"
else
  fail "provider query implementation contains forbidden fuzzy matching mechanism"
fi

if ! awk '
  /^[[:space:]]*#/ { next }
  { print }
' "$SDK_DIR/query.sh" |
  grep -Eq '(^|[^A-Za-z_])(rank|ranking|score|scoring)([^A-Za-z_]|$)'
then
  pass "provider query implementation contains no ranking mechanism"
else
  fail "provider query implementation contains forbidden ranking mechanism"
fi

if ! grep -Eq \
  '(^|[^A-Za-z_])eval[[:space:]]' \
  "$SDK_DIR/query.sh"
then
  pass "provider query implementation contains no data evaluation mechanism"
else
  fail "provider query implementation contains forbidden data evaluation mechanism"
fi

if ! grep -Eq \
  'curl|wget|https?://' \
  "$SDK_DIR/query.sh"
then
  pass "provider query implementation performs no network access"
else
  fail "provider query implementation contains network access mechanism"
fi

tracker="$(
  _phoenix::atlas_source_resolve TRACKER
)"

before="$(
  shasum -a 256 "$tracker" |
    awk '{print $1}'
)"

phoenix::atlas_provider_get 1 >/dev/null
phoenix::atlas_provider_list >/dev/null

after="$(
  shasum -a 256 "$tracker" |
    awk '{print $1}'
)"

if [[ "$before" == "$after" ]]; then
  pass "provider queries do not mutate canonical TRACKER"
else
  fail "provider queries mutate canonical TRACKER"
fi

echo
echo "Tests passed: $passed"
echo "Tests failed: $failed"

if [[ "$failed" -eq 0 ]]; then
  exit 0
fi

exit 1
