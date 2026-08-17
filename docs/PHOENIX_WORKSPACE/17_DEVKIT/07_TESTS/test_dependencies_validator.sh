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

DEPENDENCIES_IMPLEMENTATION="${DEVKIT_ROOT}/04_VALIDATORS/implementations/dependencies.sh"

if [[ -f "$DEPENDENCIES_IMPLEMENTATION" ]]; then
  source "$DEPENDENCIES_IMPLEMENTATION"
fi

TEST_ROOT="$(mktemp -d "${TMPDIR:-/tmp}/phoenix-dependencies-validator.XXXXXX")"

cleanup() {
  rm -rf "$TEST_ROOT"
}

trap cleanup EXIT

# ------------------------------------------------------------------------------
# Test-only registration
# ------------------------------------------------------------------------------

dependencies_definition="$(cat <<'DEF'
ID=dependencies
PURPOSE=Validate Phoenix DevKit internal dependency integrity
IMPLEMENTATION=phoenix::validator_dependencies
DEF
)"

assert_success \
  "register dependencies validator for test" \
  phoenix::validator_register \
    "dependencies" \
    "$dependencies_definition"

# ------------------------------------------------------------------------------
# Missing target
# ------------------------------------------------------------------------------

missing_target="${TEST_ROOT}/does-not-exist"

actual="$(
  phoenix::validator_run \
    "dependencies" \
    "$missing_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=dependencies
TARGET=${missing_target}
CHECK=target-exists
MESSAGE=Validation target does not exist
EOF_EXPECTED
)"

assert_equals \
  "dependencies validator rejects missing target" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Target is not a directory
# ------------------------------------------------------------------------------

file_target="${TEST_ROOT}/target-file"
printf 'x\n' > "$file_target"

actual="$(
  phoenix::validator_run \
    "dependencies" \
    "$file_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=dependencies
TARGET=${file_target}
CHECK=target-directory
MESSAGE=Validation target is not a directory
EOF_EXPECTED
)"

assert_equals \
  "dependencies validator rejects regular file target" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Module without dependencies is valid
# ------------------------------------------------------------------------------

no_dependencies="${TEST_ROOT}/no-dependencies"
mkdir -p "${no_dependencies}/core"

cat > "${no_dependencies}/core/runtime.sh" <<'MODULE'
#!/usr/bin/env bash

phoenix::runtime_info() {
  printf 'runtime\n'
}
MODULE

actual="$(
  phoenix::validator_run \
    "dependencies" \
    "$no_dependencies" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=VALID
VALIDATOR=dependencies
TARGET=${no_dependencies}
EOF_EXPECTED
)"

assert_equals \
  "dependencies validator accepts module without dependencies" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Valid declared internal dependency
# ------------------------------------------------------------------------------

valid_dependency="${TEST_ROOT}/valid-dependency"
mkdir -p "${valid_dependency}/core"

cat > "${valid_dependency}/core/filesystem.sh" <<'MODULE'
#!/usr/bin/env bash
MODULE

cat > "${valid_dependency}/core/manifest.sh" <<'MODULE'
#!/usr/bin/env bash

# ------------------------------------------------------------------------------
# Dependencies
# ------------------------------------------------------------------------------

MODULE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${MODULE_DIR}/filesystem.sh"
MODULE

actual="$(
  phoenix::validator_run \
    "dependencies" \
    "$valid_dependency" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=VALID
VALIDATOR=dependencies
TARGET=${valid_dependency}
EOF_EXPECTED
)"

assert_equals \
  "dependencies validator accepts declared existing internal dependency" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Source without dependency declaration
# ------------------------------------------------------------------------------

missing_declaration="${TEST_ROOT}/missing-declaration"
mkdir -p "${missing_declaration}/core"

cat > "${missing_declaration}/core/filesystem.sh" <<'MODULE'
#!/usr/bin/env bash
MODULE

cat > "${missing_declaration}/core/manifest.sh" <<'MODULE'
#!/usr/bin/env bash

MODULE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${MODULE_DIR}/filesystem.sh"
MODULE

actual="$(
  phoenix::validator_run \
    "dependencies" \
    "$missing_declaration" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=dependencies
TARGET=${missing_declaration}
CHECK=dependency-declaration
MESSAGE=Dependency declaration is missing in module manifest.sh
EOF_EXPECTED
)"

assert_equals \
  "dependencies validator detects missing dependency declaration" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Missing dependency target
# ------------------------------------------------------------------------------

missing_dependency="${TEST_ROOT}/missing-dependency"
mkdir -p "${missing_dependency}/core"

cat > "${missing_dependency}/core/manifest.sh" <<'MODULE'
#!/usr/bin/env bash

# ------------------------------------------------------------------------------
# Dependencies
# ------------------------------------------------------------------------------

MODULE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${MODULE_DIR}/missing.sh"
MODULE

actual="$(
  phoenix::validator_run \
    "dependencies" \
    "$missing_dependency" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=dependencies
TARGET=${missing_dependency}
CHECK=dependency-target-exists
MESSAGE=Dependency target does not exist: missing.sh
EOF_EXPECTED
)"

assert_equals \
  "dependencies validator detects missing dependency target" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Lexical fail-fast
# ------------------------------------------------------------------------------

ordering_target="${TEST_ROOT}/ordering"
mkdir -p "${ordering_target}/core"

cat > "${ordering_target}/core/a_module.sh" <<'MODULE'
#!/usr/bin/env bash
MODULE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${MODULE_DIR}/missing-a.sh"
MODULE

cat > "${ordering_target}/core/z_module.sh" <<'MODULE'
#!/usr/bin/env bash
MODULE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${MODULE_DIR}/missing-z.sh"
MODULE

actual="$(
  phoenix::validator_run \
    "dependencies" \
    "$ordering_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=INVALID
VALIDATOR=dependencies
TARGET=${ordering_target}
CHECK=dependency-declaration
MESSAGE=Dependency declaration is missing in module a_module.sh
EOF_EXPECTED
)"

assert_equals \
  "dependencies validator fails on first lexical module violation" \
  "$expected" \
  "$actual"

# ------------------------------------------------------------------------------
# Dependency must not be executed
# ------------------------------------------------------------------------------

execution_guard="${TEST_ROOT}/execution-guard"
mkdir -p "${execution_guard}/core"

cat > "${execution_guard}/core/dependency.sh" <<'MODULE'
#!/usr/bin/env bash
printf 'EXECUTED\n' > "${PHOENIX_DEPENDENCY_EXECUTION_MARKER}"
MODULE

cat > "${execution_guard}/core/module.sh" <<'MODULE'
#!/usr/bin/env bash

# ------------------------------------------------------------------------------
# Dependencies
# ------------------------------------------------------------------------------

MODULE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${MODULE_DIR}/dependency.sh"
MODULE

marker="${execution_guard}/executed.marker"

PHOENIX_DEPENDENCY_EXECUTION_MARKER="$marker" \
phoenix::validator_run \
  "dependencies" \
  "$execution_guard" >/dev/null 2>&1 || true

if [[ ! -e "$marker" ]]; then
  pass "dependencies validator does not execute sourced dependency"
else
  fail "dependencies validator does not execute sourced dependency"
fi

# ------------------------------------------------------------------------------
# Test harness exclusion
# ------------------------------------------------------------------------------

test_harness_target="${TEST_ROOT}/test-harness-exclusion"

mkdir -p \
  "${test_harness_target}/core" \
  "${test_harness_target}/07_TESTS"

cat > "${test_harness_target}/core/runtime.sh" <<'MODULE'
#!/usr/bin/env bash
MODULE

cat > "${test_harness_target}/07_TESTS/test_example.sh" <<'MODULE'
#!/usr/bin/env bash

source ./test-helper.sh

pass() {
  return 0
}
MODULE

actual="$(
  phoenix::validator_run \
    "dependencies" \
    "$test_harness_target" 2>/dev/null || true
)"

expected="$(cat <<EOF_EXPECTED
STATUS=VALID
VALIDATOR=dependencies
TARGET=${test_harness_target}
EOF_EXPECTED
)"

assert_equals \
  "dependencies validator excludes test harness domain" \
  "$expected" \
  "$actual"
# ------------------------------------------------------------------------------
# Read-only guarantee
# ------------------------------------------------------------------------------

readonly_target="${TEST_ROOT}/readonly"
mkdir -p "${readonly_target}/core"

cat > "${readonly_target}/core/filesystem.sh" <<'MODULE'
#!/usr/bin/env bash
MODULE

cat > "${readonly_target}/core/manifest.sh" <<'MODULE'
#!/usr/bin/env bash

# ------------------------------------------------------------------------------
# Dependencies
# ------------------------------------------------------------------------------

MODULE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${MODULE_DIR}/filesystem.sh"
MODULE

before="$(
  find "$readonly_target" -type f -print -exec wc -c {} \; | sort
)"

readonly_result="$(
  phoenix::validator_run \
    "dependencies" \
    "$readonly_target" 2>/dev/null || true
)"

expected_readonly_result="$(cat <<EOF_EXPECTED
STATUS=VALID
VALIDATOR=dependencies
TARGET=${readonly_target}
EOF_EXPECTED
)"

assert_equals \
  "read-only test operates on real dependencies validation" \
  "$expected_readonly_result" \
  "$readonly_result"

after="$(
  find "$readonly_target" -type f -print -exec wc -c {} \; | sort
)"

assert_equals \
  "dependencies validation performs zero target mutation" \
  "$before" \
  "$after"

# ------------------------------------------------------------------------------
# Determinism
# ------------------------------------------------------------------------------

deterministic_target="${TEST_ROOT}/deterministic"
mkdir -p "${deterministic_target}/core"

cat > "${deterministic_target}/core/filesystem.sh" <<'MODULE'
#!/usr/bin/env bash
MODULE

cat > "${deterministic_target}/core/manifest.sh" <<'MODULE'
#!/usr/bin/env bash

# ------------------------------------------------------------------------------
# Dependencies
# ------------------------------------------------------------------------------

MODULE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "${MODULE_DIR}/filesystem.sh"
MODULE

result_one="$(
  phoenix::validator_run \
    "dependencies" \
    "$deterministic_target" 2>/dev/null || true
)"

result_two="$(
  phoenix::validator_run \
    "dependencies" \
    "$deterministic_target" 2>/dev/null || true
)"

if [[ "$result_one" == STATUS=VALID$'\n'* ]]; then
  pass "dependencies determinism test operates on valid result"
else
  fail "dependencies determinism test operates on valid result"
fi

assert_equals \
  "identical dependencies validation produces identical result" \
  "$result_one" \
  "$result_two"

# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\n'
printf 'Dependencies Validator Tests\n'
printf '============================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
