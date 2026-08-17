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

assert_success() {
  local description="$1"
  shift

  if "$@" >/dev/null 2>&1; then
    pass "$description"
  else
    fail "$description"
  fi
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

source "${DEVKIT_ROOT}/04_VALIDATORS/registry.sh"
source "${DEVKIT_ROOT}/04_VALIDATORS/execution.sh"

STANDARDS_IMPLEMENTATION="${DEVKIT_ROOT}/04_VALIDATORS/implementations/standards.sh"

if [[ -f "$STANDARDS_IMPLEMENTATION" ]]; then
  source "$STANDARDS_IMPLEMENTATION"
fi

TEST_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/phoenix-standards-validator.XXXXXX")"

cleanup() {
  rm -rf "$TEST_ROOT"
}

trap cleanup EXIT

# ------------------------------------------------------------------------------
# Test-only registration
# ------------------------------------------------------------------------------

standards_definition="$(cat <<'DEF'
ID=standards
PURPOSE=Validate Phoenix DevKit shell module standards
IMPLEMENTATION=phoenix::validator_standards
DEF
)"

assert_success \
  "register standards validator for test" \
  phoenix::validator_register \
    "standards" \
    "$standards_definition"

# ------------------------------------------------------------------------------
# Missing target
# ------------------------------------------------------------------------------

missing_target="${TEST_ROOT}/does-not-exist"

actual="$(
  phoenix::validator_run \
    "standards" \
    "$missing_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=standards
TARGET=${missing_target}
CHECK=target-exists
MESSAGE=Validation target does not exist
EOF_EXPECTED
)"

assert_equals \
  "standards validator rejects missing target" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Regular file target
# ------------------------------------------------------------------------------

file_target="${TEST_ROOT}/target-file"
printf 'x\n' > "$file_target"

actual="$(
  phoenix::validator_run \
    "standards" \
    "$file_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=standards
TARGET=${file_target}
CHECK=target-directory
MESSAGE=Validation target is not a directory
EOF_EXPECTED
)"

assert_equals \
  "standards validator rejects regular file target" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Canonical valid module
# ------------------------------------------------------------------------------

valid_target="${TEST_ROOT}/valid"
mkdir -p "$valid_target"

cat > "${valid_target}/module.sh" <<'MODULE'
#!/usr/bin/env bash

_phoenix::helper() {
  return 0
}

phoenix::run() {
  _phoenix::helper
}
MODULE

actual="$(
  phoenix::validator_run \
    "standards" \
    "$valid_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=VALID
VALIDATOR=standards
TARGET=${valid_target}
EOF_EXPECTED
)"

assert_equals \
  "standards validator accepts canonical shell module" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Missing / invalid shebang
# ------------------------------------------------------------------------------

bad_shebang="${TEST_ROOT}/bad-shebang"
mkdir -p "$bad_shebang"

cat > "${bad_shebang}/module.sh" <<'MODULE'

#!/usr/bin/env bash

phoenix::run() {
  return 0
}
MODULE

actual="$(
  phoenix::validator_run \
    "standards" \
    "$bad_shebang" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=standards
TARGET=${bad_shebang}
CHECK=shell-module-shebang
MESSAGE=Invalid shell module shebang: module.sh
EOF_EXPECTED
)"

assert_equals \
  "standards validator rejects shell module without canonical first-line shebang" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Invalid public function namespace
# ------------------------------------------------------------------------------

bad_public="${TEST_ROOT}/bad-public"
mkdir -p "$bad_public"

cat > "${bad_public}/module.sh" <<'MODULE'
#!/usr/bin/env bash

run() {
  return 0
}
MODULE

actual="$(
  phoenix::validator_run \
    "standards" \
    "$bad_public" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=standards
TARGET=${bad_public}
CHECK=public-function-namespace
MESSAGE=Invalid public function namespace: run
EOF_EXPECTED
)"

assert_equals \
  "standards validator rejects unnamespaced public function" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Invalid private function namespace
# ------------------------------------------------------------------------------

bad_private="${TEST_ROOT}/bad-private"
mkdir -p "$bad_private"

cat > "${bad_private}/module.sh" <<'MODULE'
#!/usr/bin/env bash

_helper() {
  return 0
}
MODULE

actual="$(
  phoenix::validator_run \
    "standards" \
    "$bad_private" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=standards
TARGET=${bad_private}
CHECK=private-function-namespace
MESSAGE=Invalid private function namespace: _helper
EOF_EXPECTED
)"

assert_equals \
  "standards validator rejects invalid private function namespace" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Forbidden relative source
# ------------------------------------------------------------------------------

bad_source="${TEST_ROOT}/bad-source"
mkdir -p "$bad_source"

cat > "${bad_source}/module.sh" <<'MODULE'
#!/usr/bin/env bash

source ./other.sh

phoenix::run() {
  return 0
}
MODULE

cat > "${bad_source}/other.sh" <<'MODULE'
#!/usr/bin/env bash
MODULE

actual="$(
  phoenix::validator_run \
    "standards" \
    "$bad_source" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=standards
TARGET=${bad_source}
CHECK=forbidden-relative-source
MESSAGE=Forbidden relative source in module module.sh
EOF_EXPECTED
)"

assert_equals \
  "standards validator rejects current-directory relative source" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Parent relative source
# ------------------------------------------------------------------------------

parent_source="${TEST_ROOT}/parent-source"
mkdir -p "${parent_source}/sub"

cat > "${parent_source}/sub/module.sh" <<'MODULE'
#!/usr/bin/env bash

source ../other.sh

phoenix::run() {
  return 0
}
MODULE

cat > "${parent_source}/other.sh" <<'MODULE'
#!/usr/bin/env bash
MODULE

actual="$(
  phoenix::validator_run \
    "standards" \
    "$parent_source" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=standards
TARGET=${parent_source}
CHECK=forbidden-relative-source
MESSAGE=Forbidden relative source in module module.sh
EOF_EXPECTED
)"

assert_equals \
  "standards validator rejects parent-directory relative source" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Lexical fail-fast
# ------------------------------------------------------------------------------

ordering="${TEST_ROOT}/ordering"
mkdir -p "$ordering"

cat > "${ordering}/a_module.sh" <<'MODULE'

#!/usr/bin/env bash
MODULE

cat > "${ordering}/z_module.sh" <<'MODULE'
#!/usr/bin/env bash

bad() {
  return 0
}
MODULE

actual="$(
  phoenix::validator_run \
    "standards" \
    "$ordering" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=standards
TARGET=${ordering}
CHECK=shell-module-shebang
MESSAGE=Invalid shell module shebang: a_module.sh
EOF_EXPECTED
)"

assert_equals \
  "standards validator fails on first lexical module violation" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# .git exclusion
# ------------------------------------------------------------------------------

git_target="${TEST_ROOT}/git-exclusion"
mkdir -p "${git_target}/.git/internal"

cat > "${git_target}/module.sh" <<'MODULE'
#!/usr/bin/env bash

phoenix::run() {
  return 0
}
MODULE

cat > "${git_target}/.git/internal/bad.sh" <<'MODULE'
bad() {
  return 0
}
MODULE

actual="$(
  phoenix::validator_run \
    "standards" \
    "$git_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=VALID
VALIDATOR=standards
TARGET=${git_target}
EOF_EXPECTED
)"

assert_equals \
  "standards validator excludes git metadata tree" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Test harness exclusion
# ------------------------------------------------------------------------------

test_harness_target="${TEST_ROOT}/test-harness-exclusion"

mkdir -p \
  "${test_harness_target}/core" \
  "${test_harness_target}/07_TESTS"

cat > "${test_harness_target}/core/runtime.sh" <<'MODULE'
#!/usr/bin/env bash

phoenix::runtime_info() {
  return 0
}
MODULE

cat > "${test_harness_target}/07_TESTS/test_example.sh" <<'MODULE'
#!/usr/bin/env bash

pass() {
  return 0
}

source ./helper.sh
MODULE

actual="$(
  phoenix::validator_run \
    "standards" \
    "$test_harness_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=VALID
VALIDATOR=standards
TARGET=${test_harness_target}
EOF_EXPECTED
)"

assert_equals \
  "standards validator excludes test harness domain" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Read-only guarantee
# ------------------------------------------------------------------------------

readonly_target="${TEST_ROOT}/readonly"
mkdir -p "$readonly_target"

cat > "${readonly_target}/module.sh" <<'MODULE'
#!/usr/bin/env bash

phoenix::run() {
  return 0
}
MODULE

before="$(
  find "$readonly_target" -type f -print -exec wc -c {} \; | sort
)"

readonly_result="$(
  phoenix::validator_run \
    "standards" \
    "$readonly_target" 2>/dev/null || true
)"

expected_readonly="$(cat <<EOF_EXPECTED
STATUS=VALID
VALIDATOR=standards
TARGET=${readonly_target}
EOF_EXPECTED
)"

assert_equals \
  "read-only test operates on real standards validation" \
  "$expected_readonly" \
  "$readonly_result"

after="$(
  find "$readonly_target" -type f -print -exec wc -c {} \; | sort
)"

assert_equals \
  "standards validation performs zero target mutation" \
  "$before" \
  "$after"

# ------------------------------------------------------------------------------
# Determinism
# ------------------------------------------------------------------------------

deterministic_target="${TEST_ROOT}/deterministic"
mkdir -p "$deterministic_target"

cat > "${deterministic_target}/module.sh" <<'MODULE'
#!/usr/bin/env bash

_phoenix::helper() {
  return 0
}

phoenix::run() {
  _phoenix::helper
}
MODULE

result_one="$(
  phoenix::validator_run \
    "standards" \
    "$deterministic_target" 2>/dev/null || true
)"

result_two="$(
  phoenix::validator_run \
    "standards" \
    "$deterministic_target" 2>/dev/null || true
)"

if [[ "$result_one" == STATUS=VALID$'\n'* ]]; then
  pass "standards determinism test operates on valid result"
else
  fail "standards determinism test operates on valid result"
fi

assert_equals \
  "identical standards validation produces identical result" \
  "$result_one" \
  "$result_two"

# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\n'
printf 'Standards Validator Tests\n'
printf '=========================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
