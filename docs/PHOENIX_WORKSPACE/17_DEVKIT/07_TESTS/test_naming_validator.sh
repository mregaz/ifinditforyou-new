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

assert_success() {
  local description="$1"
  shift

  if "$@" >/dev/null 2>&1; then
    pass "$description"
  else
    fail "$description"
  fi
}

assert_failure() {
  local description="$1"
  shift

  if "$@" >/dev/null 2>&1; then
    fail "$description"
  else
    pass "$description"
  fi
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEVKIT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

source "${DEVKIT_ROOT}/04_VALIDATORS/registry.sh"
source "${DEVKIT_ROOT}/04_VALIDATORS/execution.sh"

NAMING_IMPLEMENTATION="${DEVKIT_ROOT}/04_VALIDATORS/implementations/naming.sh"

if [[ -f "$NAMING_IMPLEMENTATION" ]]; then
  source "$NAMING_IMPLEMENTATION"
fi

TEST_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/phoenix-naming-validator.XXXXXX")"

cleanup() {
  rm -rf "$TEST_ROOT"
}

trap cleanup EXIT

# ------------------------------------------------------------------------------
# Test-only registration
# ------------------------------------------------------------------------------

naming_definition="$(cat <<'DEF'
ID=naming
PURPOSE=Validate Phoenix DevKit file naming requirements
IMPLEMENTATION=phoenix::validator_naming
DEF
)"

assert_success \
  "register naming validator for test" \
  phoenix::validator_register \
    "naming" \
    "$naming_definition"

# ------------------------------------------------------------------------------
# Missing target
# ------------------------------------------------------------------------------

missing_target="${TEST_ROOT}/does-not-exist"

actual="$(
  phoenix::validator_run "naming" "$missing_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=naming
TARGET=${missing_target}
CHECK=target-exists
MESSAGE=Validation target does not exist
EOF_EXPECTED
)"

assert_equals \
  "naming validator rejects missing target" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Regular file target
# ------------------------------------------------------------------------------

file_target="${TEST_ROOT}/target-file"
printf 'x\n' > "$file_target"

actual="$(
  phoenix::validator_run "naming" "$file_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=naming
TARGET=${file_target}
CHECK=target-directory
MESSAGE=Validation target is not a directory
EOF_EXPECTED
)"

assert_equals \
  "naming validator rejects regular file target" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Valid naming set
# ------------------------------------------------------------------------------

valid_target="${TEST_ROOT}/valid"

mkdir -p \
  "${valid_target}/00_FOUNDATION" \
  "${valid_target}/core" \
  "${valid_target}/definitions" \
  "${valid_target}/templates"

touch "${valid_target}/README.md"
touch "${valid_target}/00_FOUNDATION/PHOENIX_DEVKIT_ARCHITECTURE_v1.0.md"
touch "${valid_target}/core/template_engine.sh"
touch "${valid_target}/definitions/structure.definition"
touch "${valid_target}/templates/index.sh.tpl"
touch "${valid_target}/templates/manifest.phoenix.tpl"

actual="$(
  phoenix::validator_run "naming" "$valid_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=VALID
VALIDATOR=naming
TARGET=${valid_target}
EOF_EXPECTED
)"

assert_equals \
  "naming validator accepts canonical filenames" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Forbidden macOS metadata
# ------------------------------------------------------------------------------

ds_target="${TEST_ROOT}/ds-store"
mkdir -p "$ds_target"
touch "${ds_target}/.DS_Store"

actual="$(
  phoenix::validator_run "naming" "$ds_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=naming
TARGET=${ds_target}
CHECK=forbidden-macos-metadata
MESSAGE=Forbidden file .DS_Store is present
EOF_EXPECTED
)"

assert_equals \
  "naming validator rejects DS_Store metadata" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Invalid shell filename
# ------------------------------------------------------------------------------

shell_target="${TEST_ROOT}/shell"
mkdir -p "$shell_target"
touch "${shell_target}/BadScript.sh"

actual="$(
  phoenix::validator_run "naming" "$shell_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=naming
TARGET=${shell_target}
CHECK=shell-file-naming
MESSAGE=Invalid shell filename: BadScript.sh
EOF_EXPECTED
)"

assert_equals \
  "naming validator rejects invalid shell filename" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Invalid documentation filename
# ------------------------------------------------------------------------------

documentation_target="${TEST_ROOT}/documentation"
mkdir -p "$documentation_target"
touch "${documentation_target}/bad_document.md"

actual="$(
  phoenix::validator_run "naming" "$documentation_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=naming
TARGET=${documentation_target}
CHECK=documentation-file-naming
MESSAGE=Invalid documentation filename: bad_document.md
EOF_EXPECTED
)"

assert_equals \
  "naming validator rejects invalid documentation filename" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Invalid definition filename
# ------------------------------------------------------------------------------

definition_target="${TEST_ROOT}/definition"
mkdir -p "$definition_target"
touch "${definition_target}/BadDefinition.definition"

actual="$(
  phoenix::validator_run "naming" "$definition_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=naming
TARGET=${definition_target}
CHECK=definition-file-naming
MESSAGE=Invalid definition filename: BadDefinition.definition
EOF_EXPECTED
)"

assert_equals \
  "naming validator rejects invalid definition filename" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Template filenames are pass-through in V02
# ------------------------------------------------------------------------------

template_target="${TEST_ROOT}/template"
mkdir -p "$template_target"
touch "${template_target}/index.sh.tpl"
touch "${template_target}/manifest.phoenix.tpl"
touch "${template_target}/README.md.tpl"

actual="$(
  phoenix::validator_run "naming" "$template_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=VALID
VALIDATOR=naming
TARGET=${template_target}
EOF_EXPECTED
)"

assert_equals \
  "naming validator leaves template naming out of V02 scope" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# .git is excluded
# ------------------------------------------------------------------------------

git_target="${TEST_ROOT}/git-exclusion"
mkdir -p "${git_target}/.git/internal"
touch "${git_target}/README.md"
touch "${git_target}/.git/internal/BadScript.sh"
touch "${git_target}/.git/internal/.DS_Store"

actual="$(
  phoenix::validator_run "naming" "$git_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=VALID
VALIDATOR=naming
TARGET=${git_target}
EOF_EXPECTED
)"

assert_equals \
  "naming validator excludes git metadata tree" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Deterministic fail-fast ordering
# ------------------------------------------------------------------------------

ordering_target="${TEST_ROOT}/ordering"
mkdir -p "$ordering_target"

touch "${ordering_target}/zBad.sh"
touch "${ordering_target}/ABad.sh"

actual="$(
  phoenix::validator_run "naming" "$ordering_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=naming
TARGET=${ordering_target}
CHECK=shell-file-naming
MESSAGE=Invalid shell filename: ABad.sh
EOF_EXPECTED
)"

assert_equals \
  "naming validator fails on first lexical violation" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Read-only guarantee
# ------------------------------------------------------------------------------

readonly_target="${TEST_ROOT}/readonly"
mkdir -p "$readonly_target"
touch "${readonly_target}/BadScript.sh"

before="$(
  find "$readonly_target" -type f -print | sort
)"

readonly_result="$(
  phoenix::validator_run     "naming"     "$readonly_target" 2>/dev/null || true
)"

expected_readonly_result="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=naming
TARGET=${readonly_target}
CHECK=shell-file-naming
MESSAGE=Invalid shell filename: BadScript.sh
EOF_EXPECTED
)"

assert_equals   "read-only test operates on real naming validation"   "$expected_readonly_result"   "$readonly_result"

after="$(
  find "$readonly_target" -type f -print | sort
)"

assert_equals   "naming validation performs zero target mutation"   "$before"   "$after"

# ------------------------------------------------------------------------------
# Determinism
# ------------------------------------------------------------------------------

deterministic_target="${TEST_ROOT}/deterministic"
mkdir -p "$deterministic_target"
touch "${deterministic_target}/README.md"
touch "${deterministic_target}/runtime.sh"

result_one="$(
  phoenix::validator_run "naming" "$deterministic_target" 2>/dev/null || true
)"

result_two="$(
  phoenix::validator_run "naming" "$deterministic_target" 2>/dev/null || true
)"

if [[ "$result_one" == STATUS=VALID$'\n'* ]]; then
  pass "naming determinism test operates on valid result"
else
  fail "naming determinism test operates on valid result"
fi

assert_equals \
  "identical naming validation produces identical result" \
  "$result_one" \
  "$result_two"

# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\n'
printf 'Naming Validator Tests\n'
printf '======================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
