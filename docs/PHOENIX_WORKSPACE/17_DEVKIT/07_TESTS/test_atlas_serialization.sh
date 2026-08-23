#!/usr/bin/env bash

TESTS_PASSED=0
TESTS_FAILED=0

TEST_DIR="$(
  cd "$(dirname "${BASH_SOURCE[0]}")" && pwd
)"

DEVKIT_DIR="$(
  cd "${TEST_DIR}/.." && pwd
)"

source "${DEVKIT_DIR}/10_ATLAS_SDK/normalization.sh"

pass() {
  TESTS_PASSED=$((TESTS_PASSED + 1))
  printf 'PASS: %s\n' "$1"
}

fail() {
  TESTS_FAILED=$((TESTS_FAILED + 1))
  printf 'FAIL: %s\n' "$1"
}

assert_status() {
  local name="$1"
  local expected="$2"
  shift 2

  "$@" >/dev/null 2>&1
  local actual=$?

  if [[ "$actual" -eq "$expected" ]]; then
    pass "$name"
  else
    fail "$name"
    printf '  expected status: %s\n' "$expected"
    printf '  actual status:   %s\n' "$actual"
  fi
}

echo "===== IP-06 — CANONICAL SERIALIZATION TESTS ====="

value="$(_phoenix::atlas_serialize_value 'source=a;status=verified')"
if [[ "$value" == 'source=a;status=verified' ]]; then
  pass "equals signs inside values are preserved"
else
  fail "equals signs inside values are preserved"
fi

raw_value=$'alpha\\beta\nline2\rline3\tend'
escaped="$(_phoenix::atlas_serialize_value "$raw_value")"

if [[ "$escaped" == 'alpha\\beta\nline2\rline3\tend' ]]; then
  pass "backslash LF CR TAB escaping is canonical"
else
  fail "backslash LF CR TAB escaping is canonical"
fi

field=$'EVIDENCE_NOTE\tPRESENT\tsource=a;status=verified'
serialized="$(_phoenix::atlas_serialize_normalized_field "$field")"

if [[ "$serialized" == 'EVIDENCE_NOTE=source=a;status=verified' ]]; then
  pass "normalized PRESENT field serializes as KEY=VALUE"
else
  fail "normalized PRESENT field serializes as KEY=VALUE"
fi

assert_status \
  "MISSING structural field is not silently serialized" \
  6 \
  _phoenix::atlas_serialize_normalized_field \
  $'EVIDENCE_NOTE\tMISSING\t'

assert_status \
  "invalid lowercase serialization key is rejected" \
  6 \
  _phoenix::atlas_serialize_normalized_field \
  $'provider_id\tPRESENT\t1'

assert_status \
  "unknown structural state is rejected" \
  6 \
  _phoenix::atlas_serialize_normalized_field \
  $'PROVIDER_ID\tUNKNOWN_STATE\t1'

record=$'PROVIDER_ID\tPRESENT\t1\nMARKETPLACE\tPRESENT\tSubito.it\nCOUNTRY\tPRESENT\tItalia'

serialized_record="$(
  _phoenix::atlas_serialize_normalized_record "$record"
)"
rc=$?

if [[ "$rc" -eq 0 ]]; then
  pass "single normalized record serializes successfully"
else
  fail "single normalized record serializes successfully"
fi

expected_record=$'PROVIDER_ID=1\nMARKETPLACE=Subito.it\nCOUNTRY=Italia'

if [[ "$serialized_record" == "$expected_record" ]]; then
  pass "single-record field order is preserved"
else
  fail "single-record field order is preserved"
fi

if printf '%s\n' "$serialized_record" | LC_ALL=C grep -q $'\r'; then
  fail "canonical single-record output contains no CR"
else
  pass "canonical single-record output contains no CR"
fi

multi=$'PROVIDER_ID\tPRESENT\t1\nMARKETPLACE\tPRESENT\tOne\n--\nPROVIDER_ID\tPRESENT\t2\nMARKETPLACE\tPRESENT\tTwo\n--'

serialized_multi="$(
  _phoenix::atlas_serialize_normalized_records "$multi"
)"
rc=$?

if [[ "$rc" -eq 0 ]]; then
  pass "multi-record serialization succeeds"
else
  fail "multi-record serialization succeeds"
fi

expected_multi=$'PROVIDER_ID=1\nMARKETPLACE=One\n\nPROVIDER_ID=2\nMARKETPLACE=Two'

if [[ "$serialized_multi" == "$expected_multi" ]]; then
  pass "multi-record output uses exactly one blank line separator"
else
  fail "multi-record output uses exactly one blank line separator"
fi

empty="$(_phoenix::atlas_serialize_normalized_records "")"
rc=$?

if [[ "$rc" -eq 0 && -z "$empty" ]]; then
  pass "successful empty listing emits empty stdout"
else
  fail "successful empty listing emits empty stdout"
fi

normalized_tracker="$(_phoenix::atlas_normalize_source TRACKER)"
rc=$?

if [[ "$rc" -eq 0 ]]; then
  pass "canonical TRACKER normalizes before serialization"
else
  fail "canonical TRACKER normalizes before serialization"
fi

serialized_tracker="$(
  _phoenix::atlas_serialize_normalized_records "$normalized_tracker"
)"
rc=$?

if [[ "$rc" -eq 0 ]]; then
  pass "canonical TRACKER serializes successfully"
else
  fail "canonical TRACKER serializes successfully"
fi

provider_count="$(
  printf '%s\n' "$serialized_tracker" |
    grep -c '^ATLAS_TRACKER_ID='
)"

if [[ "$provider_count" -eq 61 ]]; then
  pass "all 61 canonical TRACKER records are serialized"
else
  fail "all 61 canonical TRACKER records are serialized"
fi

first_id="$(
  printf '%s\n' "$serialized_tracker" |
    grep '^ATLAS_TRACKER_ID=' |
    head -n 1
)"

last_id="$(
  printf '%s\n' "$serialized_tracker" |
    grep '^ATLAS_TRACKER_ID=' |
    tail -n 1
)"

if [[ "$first_id" == "ATLAS_TRACKER_ID=1" ]]; then
  pass "serialized TRACKER begins with canonical tracker_id 1"
else
  fail "serialized TRACKER begins with canonical tracker_id 1"
fi

if [[ "$last_id" == "ATLAS_TRACKER_ID=61" ]]; then
  pass "serialized TRACKER ends with canonical tracker_id 61"
else
  fail "serialized TRACKER ends with canonical tracker_id 61"
fi

if printf '%s\n' "$serialized_tracker" |
  grep -q '^ATLAS_SOURCE=PHOENIX_ATLAS_GLOBAL_TRACKER_001_061.csv$'; then
  pass "serialized source reference remains logical and portable"
else
  fail "serialized source reference remains logical and portable"
fi

if printf '%s\n' "$serialized_tracker" |
  grep -q '/Users/'; then
  fail "canonical serialization exposes machine-specific absolute path"
else
  pass "canonical serialization exposes no machine-specific absolute path"
fi

serialized_tracker_2="$(
  _phoenix::atlas_serialize_source TRACKER
)"
rc=$?

if [[ "$rc" -eq 0 && "$serialized_tracker" == "$serialized_tracker_2" ]]; then
  pass "TRACKER serialization is deterministic"
else
  fail "TRACKER serialization is deterministic"
fi

assert_status \
  "missing serialization source returns INVALID_ARGUMENT" \
  2 \
  _phoenix::atlas_serialize_source

assert_status \
  "unsupported serialization source returns INVALID_ARGUMENT" \
  2 \
  _phoenix::atlas_serialize_source FINAL_MASTER

TRACKER="$(_phoenix::atlas_source_resolve TRACKER)"
before_hash="$(shasum -a 256 "$TRACKER" | awk '{print $1}')"

_phoenix::atlas_serialize_source TRACKER >/dev/null
rc=$?

after_hash="$(shasum -a 256 "$TRACKER" | awk '{print $1}')"

if [[ "$rc" -eq 0 && "$before_hash" == "$after_hash" ]]; then
  pass "serialization does not mutate canonical TRACKER"
else
  fail "serialization does not mutate canonical TRACKER"
fi

if grep -Eq \
  '(^|[[:space:]])eval([[:space:]]|$)|source[[:space:]]+"\$value"([[:space:]]|$)|bash[[:space:]]+-c([[:space:]]|$)|sh[[:space:]]+-c([[:space:]]|$)' \
  "${DEVKIT_DIR}/10_ATLAS_SDK/normalization.sh"; then
  fail "serialization contains forbidden data evaluation mechanism"
else
  pass "serialization contains no forbidden data evaluation mechanism"
fi

printf '\nTests passed: %s\n' "$TESTS_PASSED"
printf 'Tests failed: %s\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
