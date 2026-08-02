#!/usr/bin/env bash

source "$(dirname "$0")/../../core/manifest.sh"

tests=0
passed=0
failed=0

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
        printf '  Expected status: %s\n' "$expected"
        printf '  Actual status:   %s\n' "$actual"
    fi
}

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

# ------------------------------------------------------------------------------
# Test fixtures
# ------------------------------------------------------------------------------

manifest_file="/tmp/phoenix-manifest-test.manifest"
security_target="/tmp/phoenix-manifest-security-test"

rm -f "$manifest_file" "$security_target"

cat > "$manifest_file" <<'EOF'
# Phoenix Manifest Test

name=phoenix-example
version = 1.0.0
description=
endpoint=https://example.test/?a=1&b=2

    # indented comment

invalid line without separator
=value-with-empty-key
    = another-empty-key

duplicate=first
duplicate=second

CaseKey=CaseSensitive
after-malformed=valid

danger=$(touch /tmp/phoenix-manifest-security-test)
EOF

# ------------------------------------------------------------------------------
# manifest_exists
# ------------------------------------------------------------------------------

phoenix::manifest_exists "$manifest_file"
assert_status 0 "$?" "manifest_exists succeeds for existing manifest"

phoenix::manifest_exists "/tmp/phoenix-manifest-does-not-exist"
assert_status 1 "$?" "manifest_exists fails for missing manifest"

phoenix::manifest_exists "/tmp"
assert_status 1 "$?" "manifest_exists fails for directory"

phoenix::manifest_exists ""
assert_status 1 "$?" "manifest_exists fails for empty argument"

# ------------------------------------------------------------------------------
# manifest_get
# ------------------------------------------------------------------------------

assert_equals \
    "phoenix-example" \
    "$(phoenix::manifest_get "$manifest_file" "name")" \
    "manifest_get retrieves existing value"

phoenix::manifest_get "$manifest_file" "missing-key" >/dev/null
assert_status 1 "$?" "manifest_get fails for missing key"

assert_equals \
    "1.0.0" \
    "$(phoenix::manifest_get "$manifest_file" "  version  ")" \
    "manifest_get handles surrounding key and value whitespace"

assert_equals \
    "phoenix-example" \
    "$(phoenix::manifest_get "$manifest_file" "name")" \
    "manifest_get ignores comments"

assert_equals \
    "1.0.0" \
    "$(phoenix::manifest_get "$manifest_file" "version")" \
    "manifest_get ignores blank lines"

assert_equals \
    "https://example.test/?a=1&b=2" \
    "$(phoenix::manifest_get "$manifest_file" "endpoint")" \
    "manifest_get preserves additional equals characters"

phoenix::manifest_get "$manifest_file" "" >/dev/null
assert_status 1 "$?" "manifest_get rejects empty key"

assert_equals \
    "first" \
    "$(phoenix::manifest_get "$manifest_file" "duplicate")" \
    "manifest_get uses first matching duplicate key"

phoenix::manifest_get "$manifest_file" "casekey" >/dev/null
assert_status 1 "$?" "manifest_get key matching is case-sensitive"

assert_equals \
    "CaseSensitive" \
    "$(phoenix::manifest_get "$manifest_file" "CaseKey")" \
    "manifest_get retrieves correctly cased key"

empty_value="$(phoenix::manifest_get "$manifest_file" "description")"
empty_value_status=$?

assert_status \
    0 \
    "$empty_value_status" \
    "manifest_get succeeds for empty value"

assert_equals \
    "" \
    "$empty_value" \
    "manifest_get returns empty value"

assert_equals \
    "valid" \
    "$(phoenix::manifest_get "$manifest_file" "after-malformed")" \
    "malformed lines do not prevent later lookup"

# ------------------------------------------------------------------------------
# manifest_has
# ------------------------------------------------------------------------------

phoenix::manifest_has "$manifest_file" "name"
assert_status 0 "$?" "manifest_has succeeds for existing key"

phoenix::manifest_has "$manifest_file" "missing-key"
assert_status 1 "$?" "manifest_has fails for missing key"

phoenix::manifest_has "$manifest_file" "description"
assert_status 0 "$?" "manifest_has succeeds for key with empty value"

# ------------------------------------------------------------------------------
# Security
# ------------------------------------------------------------------------------

danger_value="$(phoenix::manifest_get "$manifest_file" "danger")"
danger_status=$?

assert_status \
    0 \
    "$danger_status" \
    "manifest_get retrieves shell-like value"

assert_equals \
    '$(touch /tmp/phoenix-manifest-security-test)' \
    "$danger_value" \
    "manifest_get returns shell-like value literally"

if [[ -e "$security_target" ]]; then
    security_status=1
else
    security_status=0
fi

assert_status \
    0 \
    "$security_status" \
    "manifest content is never executed"

# ------------------------------------------------------------------------------
# Cleanup
# ------------------------------------------------------------------------------

rm -f "$manifest_file" "$security_target"

# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\nTests: %s\n' "$tests"
printf 'Passed: %s\n' "$passed"
printf 'Failed: %s\n' "$failed"

if [[ "$failed" -gt 0 ]]; then
    exit 1
fi
