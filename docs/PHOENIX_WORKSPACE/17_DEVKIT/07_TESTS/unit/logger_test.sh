#!/usr/bin/env bash

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEVKIT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

source "$DEVKIT_ROOT/core/logger.sh"

tests_run=0
tests_passed=0

assert_equals() {
    local expected="${1:-}"
    local actual="${2:-}"
    local test_name="${3:-Unnamed test}"

    tests_run=$((tests_run + 1))

    if [[ "$actual" == "$expected" ]]; then
        printf 'PASS: %s\n' "$test_name"
        tests_passed=$((tests_passed + 1))
    else
        printf 'FAIL: %s\n' "$test_name"
        printf '  Expected: %s\n' "$expected"
        printf '  Actual:   %s\n' "$actual"
    fi
}

info_output="$(phoenix::log_info "Info message")"
assert_equals \
    "[INFO ] Info message" \
    "$info_output" \
    "log_info writes formatted message"

ok_output="$(phoenix::log_ok "Success message")"
assert_equals \
    "[OK   ] Success message" \
    "$ok_output" \
    "log_ok writes formatted message"

warn_output="$(phoenix::log_warn "Warning message" 2>&1)"
assert_equals \
    "[WARN ] Warning message" \
    "$warn_output" \
    "log_warn writes formatted message to stderr"

error_output="$(phoenix::log_error "Error message" 2>&1)"
assert_equals \
    "[ERROR] Error message" \
    "$error_output" \
    "log_error writes formatted message to stderr"

debug_output="$(phoenix::log_debug "Debug message")"
assert_equals \
    "[DEBUG] Debug message" \
    "$debug_output" \
    "log_debug writes formatted message"

printf '\nTests: %d | Passed: %d | Failed: %d\n' \
    "$tests_run" \
    "$tests_passed" \
    "$((tests_run - tests_passed))"

if [[ "$tests_run" -eq "$tests_passed" ]]; then
    exit 0
fi

exit 1