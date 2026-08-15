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

DOCUMENTATION_IMPLEMENTATION="${DEVKIT_ROOT}/04_VALIDATORS/implementations/documentation.sh"

if [[ -f "$DOCUMENTATION_IMPLEMENTATION" ]]; then
  source "$DOCUMENTATION_IMPLEMENTATION"
fi

TEST_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/phoenix-documentation-validator.XXXXXX")"

cleanup() {
  rm -rf "$TEST_ROOT"
}

trap cleanup EXIT

# ------------------------------------------------------------------------------
# Test-only registration
# ------------------------------------------------------------------------------

documentation_definition="$(cat <<'DEF'
ID=documentation
PURPOSE=Validate Phoenix DevKit documentation presence and non-empty domain documentation
IMPLEMENTATION=phoenix::validator_documentation
DEF
)"

assert_success \
  "register documentation validator for test" \
  phoenix::validator_register \
    "documentation" \
    "$documentation_definition"

# ------------------------------------------------------------------------------
# Missing target
# ------------------------------------------------------------------------------

missing_target="${TEST_ROOT}/does-not-exist"

actual="$(
  phoenix::validator_run \
    "documentation" \
    "$missing_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=documentation
TARGET=${missing_target}
CHECK=target-exists
MESSAGE=Validation target does not exist
EOF_EXPECTED
)"

assert_equals \
  "documentation validator rejects missing target" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Target is not a directory
# ------------------------------------------------------------------------------

file_target="${TEST_ROOT}/target-file"
printf 'x\n' > "$file_target"

actual="$(
  phoenix::validator_run \
    "documentation" \
    "$file_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=documentation
TARGET=${file_target}
CHECK=target-directory
MESSAGE=Validation target is not a directory
EOF_EXPECTED
)"

assert_equals \
  "documentation validator rejects regular file target" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Missing root README
# ------------------------------------------------------------------------------

missing_root_readme="${TEST_ROOT}/missing-root-readme"

mkdir -p \
  "${missing_root_readme}/00_FOUNDATION"

printf '# Foundation\n' \
  > "${missing_root_readme}/00_FOUNDATION/README.md"

actual="$(
  phoenix::validator_run \
    "documentation" \
    "$missing_root_readme" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=documentation
TARGET=${missing_root_readme}
CHECK=required-root-readme
MESSAGE=Required root README.md is missing
EOF_EXPECTED
)"

assert_equals \
  "documentation validator detects missing root README" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Empty root README
# ------------------------------------------------------------------------------

empty_root_readme="${TEST_ROOT}/empty-root-readme"

mkdir -p \
  "${empty_root_readme}/00_FOUNDATION"

touch "${empty_root_readme}/README.md"

printf '# Foundation\n' \
  > "${empty_root_readme}/00_FOUNDATION/README.md"

actual="$(
  phoenix::validator_run \
    "documentation" \
    "$empty_root_readme" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=documentation
TARGET=${empty_root_readme}
CHECK=non-empty-root-readme
MESSAGE=Root README.md is empty
EOF_EXPECTED
)"

assert_equals \
  "documentation validator detects empty root README" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Missing numbered-domain README
# ------------------------------------------------------------------------------

missing_domain_readme="${TEST_ROOT}/missing-domain-readme"

mkdir -p \
  "${missing_domain_readme}/00_FOUNDATION" \
  "${missing_domain_readme}/01_ARCHITECTURE"

printf '# Phoenix DevKit\n' \
  > "${missing_domain_readme}/README.md"

printf '# Foundation\n' \
  > "${missing_domain_readme}/00_FOUNDATION/README.md"

actual="$(
  phoenix::validator_run \
    "documentation" \
    "$missing_domain_readme" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=documentation
TARGET=${missing_domain_readme}
CHECK=required-domain-readme
MESSAGE=Required README.md is missing in domain 01_ARCHITECTURE
EOF_EXPECTED
)"

assert_equals \
  "documentation validator detects missing numbered-domain README" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Empty numbered-domain README
# ------------------------------------------------------------------------------

empty_domain_readme="${TEST_ROOT}/empty-domain-readme"

mkdir -p \
  "${empty_domain_readme}/00_FOUNDATION" \
  "${empty_domain_readme}/01_ARCHITECTURE"

printf '# Phoenix DevKit\n' \
  > "${empty_domain_readme}/README.md"

printf '# Foundation\n' \
  > "${empty_domain_readme}/00_FOUNDATION/README.md"

touch "${empty_domain_readme}/01_ARCHITECTURE/README.md"

actual="$(
  phoenix::validator_run \
    "documentation" \
    "$empty_domain_readme" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=documentation
TARGET=${empty_domain_readme}
CHECK=non-empty-domain-readme
MESSAGE=README.md is empty in domain 01_ARCHITECTURE
EOF_EXPECTED
)"

assert_equals \
  "documentation validator detects empty numbered-domain README" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Valid documentation set
# ------------------------------------------------------------------------------

valid_target="${TEST_ROOT}/valid"

mkdir -p \
  "${valid_target}/00_FOUNDATION" \
  "${valid_target}/01_ARCHITECTURE" \
  "${valid_target}/02_TEMPLATE_ENGINE" \
  "${valid_target}/core"

printf '# Phoenix DevKit\n' \
  > "${valid_target}/README.md"

printf '# Foundation\n' \
  > "${valid_target}/00_FOUNDATION/README.md"

printf '# Architecture\n' \
  > "${valid_target}/01_ARCHITECTURE/README.md"

printf '# Template Engine\n' \
  > "${valid_target}/02_TEMPLATE_ENGINE/README.md"

actual="$(
  phoenix::validator_run \
    "documentation" \
    "$valid_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=VALID
VALIDATOR=documentation
TARGET=${valid_target}
EOF_EXPECTED
)"

assert_equals \
  "documentation validator accepts documented numbered domains" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# core is explicitly outside domain README policy
# ------------------------------------------------------------------------------

core_target="${TEST_ROOT}/core-exception"

mkdir -p \
  "${core_target}/00_FOUNDATION" \
  "${core_target}/core"

printf '# Phoenix DevKit\n' \
  > "${core_target}/README.md"

printf '# Foundation\n' \
  > "${core_target}/00_FOUNDATION/README.md"

actual="$(
  phoenix::validator_run \
    "documentation" \
    "$core_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=VALID
VALIDATOR=documentation
TARGET=${core_target}
EOF_EXPECTED
)"

assert_equals \
  "documentation validator does not require core README" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Nested directories are outside V03 domain policy
# ------------------------------------------------------------------------------

nested_target="${TEST_ROOT}/nested-exception"

mkdir -p \
  "${nested_target}/00_FOUNDATION/internal/deep"

printf '# Phoenix DevKit\n' \
  > "${nested_target}/README.md"

printf '# Foundation\n' \
  > "${nested_target}/00_FOUNDATION/README.md"

actual="$(
  phoenix::validator_run \
    "documentation" \
    "$nested_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=VALID
VALIDATOR=documentation
TARGET=${nested_target}
EOF_EXPECTED
)"

assert_equals \
  "documentation validator does not require nested README files" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Deterministic lexical fail-fast order
# ------------------------------------------------------------------------------

ordering_target="${TEST_ROOT}/ordering"

mkdir -p \
  "${ordering_target}/00_FOUNDATION" \
  "${ordering_target}/01_ARCHITECTURE" \
  "${ordering_target}/04_VALIDATORS"

printf '# Phoenix DevKit\n' \
  > "${ordering_target}/README.md"

printf '# Foundation\n' \
  > "${ordering_target}/00_FOUNDATION/README.md"

touch "${ordering_target}/01_ARCHITECTURE/README.md"
touch "${ordering_target}/04_VALIDATORS/README.md"

actual="$(
  phoenix::validator_run \
    "documentation" \
    "$ordering_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=documentation
TARGET=${ordering_target}
CHECK=non-empty-domain-readme
MESSAGE=README.md is empty in domain 01_ARCHITECTURE
EOF_EXPECTED
)"

assert_equals \
  "documentation validator fails on first lexical domain violation" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Read-only guarantee
# ------------------------------------------------------------------------------

readonly_target="${TEST_ROOT}/readonly"

mkdir -p \
  "${readonly_target}/00_FOUNDATION" \
  "${readonly_target}/01_ARCHITECTURE"

printf '# Phoenix DevKit\n' \
  > "${readonly_target}/README.md"

printf '# Foundation\n' \
  > "${readonly_target}/00_FOUNDATION/README.md"

touch "${readonly_target}/01_ARCHITECTURE/README.md"

before="$(
  find "$readonly_target" -type f -print -exec wc -c {} \; | sort
)"

readonly_result="$(
  phoenix::validator_run \
    "documentation" \
    "$readonly_target" 2>/dev/null || true
)"

expected_readonly_result="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=documentation
TARGET=${readonly_target}
CHECK=non-empty-domain-readme
MESSAGE=README.md is empty in domain 01_ARCHITECTURE
EOF_EXPECTED
)"

assert_equals \
  "read-only test operates on real documentation validation" \
  "$expected_readonly_result" \
  "$readonly_result"

after="$(
  find "$readonly_target" -type f -print -exec wc -c {} \; | sort
)"

assert_equals \
  "documentation validation performs zero target mutation" \
  "$before" \
  "$after"

# ------------------------------------------------------------------------------
# Determinism
# ------------------------------------------------------------------------------

deterministic_target="${TEST_ROOT}/deterministic"

mkdir -p \
  "${deterministic_target}/00_FOUNDATION" \
  "${deterministic_target}/01_ARCHITECTURE"

printf '# Phoenix DevKit\n' \
  > "${deterministic_target}/README.md"

printf '# Foundation\n' \
  > "${deterministic_target}/00_FOUNDATION/README.md"

printf '# Architecture\n' \
  > "${deterministic_target}/01_ARCHITECTURE/README.md"

result_one="$(
  phoenix::validator_run \
    "documentation" \
    "$deterministic_target" 2>/dev/null || true
)"

result_two="$(
  phoenix::validator_run \
    "documentation" \
    "$deterministic_target" 2>/dev/null || true
)"

if [[ "$result_one" == STATUS=VALID$'\n'* ]]; then
  pass "documentation determinism test operates on valid result"
else
  fail "documentation determinism test operates on valid result"
fi

assert_equals \
  "identical documentation validation produces identical result" \
  "$result_one" \
  "$result_two"

# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\n'
printf 'Documentation Validator Tests\n'
printf '=============================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
