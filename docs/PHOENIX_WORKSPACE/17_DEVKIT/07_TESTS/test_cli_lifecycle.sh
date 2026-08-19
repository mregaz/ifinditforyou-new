#!/usr/bin/env bash

set -u

# ==============================================================================
# PHOENIX DEVKIT — CLI LIFECYCLE TESTS
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

assert_success() {
  local description="$1"
  shift

  if "$@" >/dev/null 2>&1; then
    pass "$description"
  else
    fail "$description"
  fi
}

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEVKIT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

CLI="${DEVKIT_ROOT}/05_CLI/phoenix"
CLI_MODULE="${DEVKIT_ROOT}/05_CLI/cli.sh"
CLI_PARSING="${DEVKIT_ROOT}/05_CLI/parsing.sh"
CLI_COMMANDS="${DEVKIT_ROOT}/05_CLI/commands.sh"

# ------------------------------------------------------------------------------
# Source Safety
# ------------------------------------------------------------------------------

source_result="$(
  bash -c "
    source '${CLI_MODULE}'
    printf 'loaded\n'
  "
)"

assert_equals \
  "cli.sh can be sourced without executing CLI behavior" \
  "loaded" \
  "$source_result"

double_source_result="$(
  bash -c "
    source '${CLI_MODULE}'
    source '${CLI_MODULE}'
    printf 'loaded-twice\n'
  "
)"

assert_equals \
  "cli.sh can be sourced twice safely" \
  "loaded-twice" \
  "$double_source_result"

if bash -c "
  source '${CLI_MODULE}'
  declare -F phoenix::cli_run >/dev/null 2>&1
"; then
  pass "phoenix::cli_run is available after sourcing cli.sh"
else
  fail "phoenix::cli_run is available after sourcing cli.sh"
fi

# ------------------------------------------------------------------------------
# Reusable Module Exit Safety
# ------------------------------------------------------------------------------

exit_matches="$(
  grep -nE '(^|[[:space:];])exit([[:space:];]|$)' \
    "$CLI_MODULE" \
    "$CLI_PARSING" \
    "$CLI_COMMANDS" \
    2>/dev/null || true
)"

assert_equals \
  "reusable CLI modules contain no process exit" \
  "" \
  "$exit_matches"

# ------------------------------------------------------------------------------
# Eval Safety
# ------------------------------------------------------------------------------

eval_matches="$(
  grep -nE '(^|[[:space:];])eval([[:space:];]|$)' \
    "$CLI" \
    "$CLI_MODULE" \
    "$CLI_PARSING" \
    "$CLI_COMMANDS" \
    2>/dev/null || true
)"

assert_equals \
  "CLI implementation contains no eval" \
  "" \
  "$eval_matches"

# ------------------------------------------------------------------------------
# Lower-Layer Internal API Safety
# ------------------------------------------------------------------------------

lower_internal_matches="$(
  grep -nE '_phoenix::generator_|_phoenix::validator_' \
    "$CLI_MODULE" \
    "$CLI_PARSING" \
    "$CLI_COMMANDS" \
    2>/dev/null || true
)"

assert_equals \
  "CLI does not consume lower-layer internal Generator or Validator APIs" \
  "" \
  "$lower_internal_matches"

# ------------------------------------------------------------------------------
# Working Directory Preservation
# ------------------------------------------------------------------------------

cwd_result="$(
  bash -c "
    before=\"\$(pwd)\"
    source '${CLI_MODULE}'
    after=\"\$(pwd)\"
    printf '%s\n%s\n' \"\$before\" \"\$after\"
  "
)"

cwd_before="$(printf '%s\n' "$cwd_result" | sed -n '1p')"
cwd_after="$(printf '%s\n' "$cwd_result" | sed -n '2p')"

assert_equals \
  "sourcing cli.sh preserves caller working directory" \
  "$cwd_before" \
  "$cwd_after"

run_cwd_result="$(
  bash -c "
    before=\"\$(pwd)\"
    source '${CLI_MODULE}'
    phoenix::cli_run --version >/dev/null 2>&1
    after=\"\$(pwd)\"
    printf '%s\n%s\n' \"\$before\" \"\$after\"
  "
)"

run_cwd_before="$(printf '%s\n' "$run_cwd_result" | sed -n '1p')"
run_cwd_after="$(printf '%s\n' "$run_cwd_result" | sed -n '2p')"

assert_equals \
  "phoenix::cli_run preserves caller working directory" \
  "$run_cwd_before" \
  "$run_cwd_after"

# ------------------------------------------------------------------------------
# Generator Bootstrap Idempotency
# ------------------------------------------------------------------------------

generator_bootstrap_result="$(
  bash -c "
    source '${CLI_MODULE}'

    _phoenix::cli_bootstrap_generator
    first=\$?

    _phoenix::cli_bootstrap_generator
    second=\$?

    printf '%s\n%s\n' \"\$first\" \"\$second\"
  "
)"

assert_equals \
  "Generator bootstrap is idempotent" \
  "$(printf '0\n0')" \
  "$generator_bootstrap_result"

# ------------------------------------------------------------------------------
# Validator Bootstrap Idempotency
# ------------------------------------------------------------------------------

validator_bootstrap_result="$(
  bash -c "
    source '${CLI_MODULE}'

    _phoenix::cli_bootstrap_validator
    first=\$?

    _phoenix::cli_bootstrap_validator
    second=\$?

    printf '%s\n%s\n' \"\$first\" \"\$second\"
  "
)"

assert_equals \
  "Validator bootstrap is idempotent" \
  "$(printf '0\n0')" \
  "$validator_bootstrap_result"

validator_execution_bootstrap_result="$(
  bash -c "
    source '${CLI_MODULE}'

    _phoenix::cli_bootstrap_validator_execution
    first=\$?

    _phoenix::cli_bootstrap_validator_execution
    second=\$?

    printf '%s\n%s\n' \"\$first\" \"\$second\"
  "
)"

assert_equals \
  "Validator execution bootstrap is idempotent" \
  "$(printf '0\n0')" \
  "$validator_execution_bootstrap_result"

# ------------------------------------------------------------------------------
# Entry-Point Exit Propagation
# ------------------------------------------------------------------------------

"$CLI" --version >/dev/null 2>&1
version_status=$?

assert_equals \
  "entry point propagates version success status" \
  "0" \
  "$version_status"

"$CLI" banana >/dev/null 2>&1
unknown_status=$?

assert_equals \
  "entry point propagates CLI usage error status" \
  "2" \
  "$unknown_status"

"$CLI" validate structure "${DEVKIT_ROOT}" >/dev/null 2>&1
valid_status=$?

assert_equals \
  "entry point propagates VALID status" \
  "0" \
  "$valid_status"

# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\n'
printf 'CLI Lifecycle Tests\n'
printf '===================\n'
printf 'Passed: %d\n' "$TESTS_PASSED"
printf 'Failed: %d\n' "$TESTS_FAILED"

if [[ "$TESTS_FAILED" -ne 0 ]]; then
  exit 1
fi

exit 0
