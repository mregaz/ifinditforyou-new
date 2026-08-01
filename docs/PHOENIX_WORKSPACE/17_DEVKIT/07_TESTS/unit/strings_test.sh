#!/usr/bin/env bash

source "$(dirname "$0")/../../core/strings.sh"

tests=0
passed=0
failed=0

assert_equals() {
    local expected="$1"
    local actual="$2"
    local description="$3"

    tests=$((tests + 1))

    if [[ "$actual" == "$expected" ]]; then
        passed=$((passed + 1))
        printf 'PASS: %s\n' "$description"
    else
        failed=$((failed + 1))
        printf 'FAIL: %s\n' "$description"
        printf '  Expected: [%s]\n' "$expected"
        printf '  Actual:   [%s]\n' "$actual"
    fi
}
assert_status() {
    local expected="$1"
    local actual="$2"
    local description="$3"

    tests=$((tests + 1))

    if [[ "$actual" -eq "$expected" ]]; then
        passed=$((passed + 1))
        printf 'PASS: %s\n' "$description"
    else
        failed=$((failed + 1))
        printf 'FAIL: %s\n' "$description"
        printf '  Expected status: [%s]\n' "$expected"
        printf '  Actual status:   [%s]\n' "$actual"
    fi
}
assert_equals "" "$(phoenix::trim "")" "trim handles empty string"
assert_equals "" "$(phoenix::trim "   ")" "trim handles spaces only"
assert_equals "" "$(phoenix::trim $'\t\t')" "trim handles tabs only"
assert_equals "Phoenix" "$(phoenix::trim "   Phoenix")" "trim removes leading whitespace"
assert_equals "Phoenix" "$(phoenix::trim "Phoenix   ")" "trim removes trailing whitespace"
assert_equals "Phoenix DevKit" "$(phoenix::trim "   Phoenix DevKit   ")" "trim removes both sides"
assert_equals "Phoenix" "$(phoenix::trim "Phoenix")" "trim preserves clean input"
assert_equals "" "$(phoenix::trim_left "")" "trim_left handles empty string"
assert_equals "" "$(phoenix::trim_left "   ")" "trim_left handles spaces only"
assert_equals "" "$(phoenix::trim_left $'\t\t')" "trim_left handles tabs only"
assert_equals "Phoenix   " "$(phoenix::trim_left "   Phoenix   ")" "trim_left removes leading whitespace only"
assert_equals "Phoenix" "$(phoenix::trim_left "Phoenix")" "trim_left preserves clean input"
assert_equals "" "$(phoenix::trim_right "")" "trim_right handles empty string"
assert_equals "" "$(phoenix::trim_right "   ")" "trim_right handles spaces only"
assert_equals "" "$(phoenix::trim_right $'\t\t')" "trim_right handles tabs only"
assert_equals "   Phoenix" "$(phoenix::trim_right "   Phoenix   ")" "trim_right removes trailing whitespace only"
assert_equals "Phoenix" "$(phoenix::trim_right "Phoenix")" "trim_right preserves clean input"
assert_equals "PHOENIX DEVKIT" "$(phoenix::to_upper "Phoenix DevKit")" "to_upper converts lowercase text"
assert_equals "PHOENIX 123" "$(phoenix::to_upper "Phoenix 123")" "to_upper preserves numbers"
assert_equals "" "$(phoenix::to_upper "")" "to_upper handles empty input"
assert_equals "phoenix devkit" "$(phoenix::to_lower "PHOENIX DEVKIT")" "to_lower converts uppercase text"
assert_equals "phoenix 123" "$(phoenix::to_lower "PHOENIX 123")" "to_lower preserves numbers"
assert_equals "" "$(phoenix::to_lower "")" "to_lower handles empty input"
# ------------------------------------------------------------------------------
# Search API
# ------------------------------------------------------------------------------

phoenix::contains "Phoenix DevKit" "DevKit"
contains_match_status=$?

assert_status \
    0 \
    "$contains_match_status" \
    "contains returns 0 when substring exists"

phoenix::contains "Phoenix DevKit" "Toolkit"
contains_missing_status=$?

assert_status \
    1 \
    "$contains_missing_status" \
    "contains returns 1 when substring does not exist"

phoenix::starts_with "Phoenix DevKit" "Phoenix"
starts_with_match_status=$?

assert_status \
    0 \
    "$starts_with_match_status" \
    "starts_with returns 0 for matching prefix"

phoenix::starts_with "Phoenix DevKit" "DevKit"
starts_with_missing_status=$?

assert_status \
    1 \
    "$starts_with_missing_status" \
    "starts_with returns 1 for non-matching prefix"

phoenix::ends_with "Phoenix DevKit" "DevKit"
ends_with_match_status=$?

assert_status \
    0 \
    "$ends_with_match_status" \
    "ends_with returns 0 for matching suffix"

phoenix::ends_with "Phoenix DevKit" "Phoenix"
ends_with_missing_status=$?

assert_status \
    1 \
    "$ends_with_missing_status" \
    "ends_with returns 1 for non-matching suffix"

# ------------------------------------------------------------------------------
# replace
# ------------------------------------------------------------------------------

assert_equals \
    "Hello Phoenix" \
    "$(phoenix::replace "Hello World" "World" "Phoenix")" \
    "replace replaces one occurrence"

assert_equals \
    "1 two 1" \
    "$(phoenix::replace "one two one" "one" "1")" \
    "replace replaces all occurrences"

assert_equals \
    "Phoenix DevKit" \
    "$(phoenix::replace "Phoenix DevKit" "Toolkit" "Core")" \
    "replace preserves input when search is absent"

assert_equals \
    "" \
    "$(phoenix::replace "" "Phoenix" "DevKit")" \
    "replace handles empty input"

# ------------------------------------------------------------------------------
# Validation
# ------------------------------------------------------------------------------

phoenix::is_empty ""
assert_status \
    0 \
    "$?" \
    "is_empty returns 0 for empty string"

phoenix::is_empty "Phoenix"
assert_status \
    1 \
    "$?" \
    "is_empty returns 1 for non-empty string"

phoenix::is_empty "   "
assert_status \
    1 \
    "$?" \
    "is_empty returns 1 for whitespace-only string"

phoenix::is_blank ""
assert_status \
    0 \
    "$?" \
    "is_blank returns 0 for empty string"

phoenix::is_blank "   "
assert_status \
    0 \
    "$?" \
    "is_blank returns 0 for whitespace-only string"

phoenix::is_blank $'\t'
assert_status \
    0 \
    "$?" \
    "is_blank returns 0 for tab-only string"

phoenix::is_blank "Phoenix"
assert_status \
    1 \
    "$?" \
    "is_blank returns 1 for non-blank string"
# ------------------------------------------------------------------------------
# slugify
# ------------------------------------------------------------------------------

assert_equals \
    "phoenix-devkit-core" \
    "$(phoenix::slugify "Phoenix DevKit Core")" \
    "slugify converts words to lowercase slug"

assert_equals \
    "hello-world" \
    "$(phoenix::slugify "  Hello   World  ")" \
    "slugify collapses whitespace"

assert_equals \
    "phoenix-devkit-v1-0" \
    "$(phoenix::slugify "Phoenix_DEVKIT v1.0")" \
    "slugify replaces non-alphanumeric characters"

assert_equals \
    "phoenix-devkit" \
    "$(phoenix::slugify "---Phoenix---DevKit---")" \
    "slugify removes leading and trailing separators"

assert_equals \
    "" \
    "$(phoenix::slugify "")" \
    "slugify handles empty input"

printf '\nTests: %s\n' "$tests"
printf 'Passed: %s\n' "$passed"
printf 'Failed: %s\n' "$failed"

if [[ "$failed" -gt 0 ]]; then
    exit 1
fi