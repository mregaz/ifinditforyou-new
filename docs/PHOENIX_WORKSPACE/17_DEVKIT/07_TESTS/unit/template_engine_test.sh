#!/usr/bin/env bash

source "$(dirname "$0")/../../core/template_engine.sh"

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
# Fixtures
# ------------------------------------------------------------------------------

template_file="/tmp/phoenix-template-engine-test.tpl"
destination_file="/tmp/phoenix-template-engine-output.txt"
existing_destination="/tmp/phoenix-template-engine-existing.txt"
security_target="/tmp/phoenix-template-engine-security-test"
template_security_target="/tmp/phoenix-template-content-security-test"

rm -f \
    "$template_file" \
    "$destination_file" \
    "$existing_destination" \
    "$security_target" \
    "$template_security_target"

cat > "$template_file" <<'EOF'
Project: {{PROJECT_NAME}}
Version: {{VERSION}}
URL: {{URL}}
EOF

original_template_content="$(cat "$template_file")"

# ------------------------------------------------------------------------------
# 1. Placeholder Detection
# ------------------------------------------------------------------------------

phoenix::template_has_placeholders "Hello {{NAME}}"
assert_status 0 "$?" "detects valid placeholder"

# ------------------------------------------------------------------------------
# 2. No Placeholder Detection
# ------------------------------------------------------------------------------

phoenix::template_has_placeholders "Hello Phoenix"
assert_status 1 "$?" "returns false when template has no placeholder"

# ------------------------------------------------------------------------------
# 3. Invalid Placeholder Syntax
# ------------------------------------------------------------------------------

phoenix::template_has_placeholders "Hello {{name}}"
assert_status 1 "$?" "does not detect invalid lowercase placeholder"

# ------------------------------------------------------------------------------
# 4. Single Variable Rendering
# ------------------------------------------------------------------------------

assert_equals \
    "Hello Phoenix" \
    "$(phoenix::template_render "Hello {{NAME}}" "NAME=Phoenix")" \
    "renders one variable"

# ------------------------------------------------------------------------------
# 5. Multiple Variable Rendering
# ------------------------------------------------------------------------------

assert_equals \
    "Phoenix 1.0" \
    "$(phoenix::template_render "{{PROJECT}} {{VERSION}}" "PROJECT=Phoenix" "VERSION=1.0")" \
    "renders multiple variables"

# ------------------------------------------------------------------------------
# 6. Repeated Placeholders
# ------------------------------------------------------------------------------

assert_equals \
    "Phoenix / Phoenix / Phoenix" \
    "$(phoenix::template_render "{{NAME}} / {{NAME}} / {{NAME}}" "NAME=Phoenix")" \
    "replaces repeated placeholders"

# ------------------------------------------------------------------------------
# 7. Missing Variable Failure
# ------------------------------------------------------------------------------

missing_output="$(phoenix::template_render "{{NAME}} {{VERSION}}" "NAME=Phoenix")"
missing_status=$?

assert_status \
    1 \
    "$missing_status" \
    "fails when required variable is missing"

# ------------------------------------------------------------------------------
# 8. No Partial stdout on Failure
# ------------------------------------------------------------------------------

assert_equals \
    "" \
    "$missing_output" \
    "failed rendering produces no partial stdout"

# ------------------------------------------------------------------------------
# 9. Empty Replacement Value
# ------------------------------------------------------------------------------

empty_output="$(phoenix::template_render "{{DESCRIPTION}}" "DESCRIPTION=")"
empty_status=$?

if [[ "$empty_status" -eq 0 && -z "$empty_output" ]]; then
    empty_value_result=0
else
    empty_value_result=1
fi

assert_status \
    0 \
    "$empty_value_result" \
    "empty replacement value succeeds"

# ------------------------------------------------------------------------------
# 10. Values Containing Spaces
# ------------------------------------------------------------------------------

assert_equals \
    "Phoenix DevKit Core" \
    "$(phoenix::template_render "{{NAME}}" "NAME=Phoenix DevKit Core")" \
    "preserves spaces in replacement value"

# ------------------------------------------------------------------------------
# 11. Values Containing Equals
# ------------------------------------------------------------------------------

assert_equals \
    "https://example.test/?a=1&b=2" \
    "$(phoenix::template_render "{{URL}}" "URL=https://example.test/?a=1&b=2")" \
    "preserves equals characters in replacement value"

# ------------------------------------------------------------------------------
# 12. Duplicate Variables — First Match Wins
# ------------------------------------------------------------------------------

assert_equals \
    "first" \
    "$(phoenix::template_render "{{NAME}}" "NAME=first" "NAME=second")" \
    "duplicate variables use first match"

# ------------------------------------------------------------------------------
# 13. Replacement Values Containing Placeholders Stay Literal
# ------------------------------------------------------------------------------

assert_equals \
    "{{OTHER}}" \
    "$(phoenix::template_render "{{NAME}}" "NAME={{OTHER}}" "OTHER=Phoenix")" \
    "replacement values containing placeholders remain literal"
# ------------------------------------------------------------------------------
# 13. Invalid Assignment Without Equals
# ------------------------------------------------------------------------------

phoenix::template_render "{{NAME}}" "NAME" >/dev/null
assert_status \
    1 \
    "$?" \
    "rejects variable assignment without equals"

# ------------------------------------------------------------------------------
# 14. Empty Variable Name
# ------------------------------------------------------------------------------

phoenix::template_render "{{NAME}}" "=Phoenix" >/dev/null
assert_status \
    1 \
    "$?" \
    "rejects empty variable name"

# ------------------------------------------------------------------------------
# 15. Invalid Lowercase Variable Name
# ------------------------------------------------------------------------------

phoenix::template_render "{{NAME}}" "name=Phoenix" >/dev/null
assert_status \
    1 \
    "$?" \
    "rejects lowercase variable name"

# ------------------------------------------------------------------------------
# 16. Template Without Placeholders
# ------------------------------------------------------------------------------

assert_equals \
    "Phoenix DevKit" \
    "$(phoenix::template_render "Phoenix DevKit")" \
    "renders template without placeholders unchanged"

# ------------------------------------------------------------------------------
# 17. Environment Isolation
# ------------------------------------------------------------------------------

export NAME="Environment Phoenix"

environment_output="$(phoenix::template_render "{{NAME}}")"
environment_status=$?

assert_status \
    1 \
    "$environment_status" \
    "does not import environment variables implicitly"

unset NAME

# ------------------------------------------------------------------------------
# 18. Shell-like Replacement Value Is Literal
# ------------------------------------------------------------------------------

danger_value='$(touch /tmp/phoenix-template-engine-security-test)'

assert_equals \
    "$danger_value" \
    "$(phoenix::template_render "{{COMMAND}}" "COMMAND=$danger_value")" \
    "renders shell-like replacement value literally"

# ------------------------------------------------------------------------------
# 19. Shell-like Replacement Value Is Not Executed
# ------------------------------------------------------------------------------

if [[ -e "$security_target" ]]; then
    replacement_security_status=1
else
    replacement_security_status=0
fi

assert_status \
    0 \
    "$replacement_security_status" \
    "shell-like replacement value is never executed"

# ------------------------------------------------------------------------------
# 20. Shell-like Template Content Is Not Executed
# ------------------------------------------------------------------------------

template_shell_content='$(touch /tmp/phoenix-template-content-security-test)'

template_shell_output="$(phoenix::template_render "$template_shell_content")"
template_shell_status=$?

if [[ \
    "$template_shell_status" -eq 0 && \
    "$template_shell_output" == "$template_shell_content" && \
    ! -e "$template_security_target" \
]]; then
    template_security_status=0
else
    template_security_status=1
fi

assert_status \
    0 \
    "$template_security_status" \
    "shell-like template content remains inert"

# ------------------------------------------------------------------------------
# 21. File Rendering Succeeds
# ------------------------------------------------------------------------------

phoenix::template_render_file \
    "$template_file" \
    "$destination_file" \
    "PROJECT_NAME=Phoenix" \
    "VERSION=1.0" \
    "URL=https://example.test/?a=1&b=2"

file_render_status=$?

assert_status \
    0 \
    "$file_render_status" \
    "template_render_file succeeds"

# ------------------------------------------------------------------------------
# 22. Rendered File Content
# ------------------------------------------------------------------------------

expected_file_content=$'Project: Phoenix\nVersion: 1.0\nURL: https://example.test/?a=1&b=2'
actual_file_content="$(cat "$destination_file")"

assert_equals \
    "$expected_file_content" \
    "$actual_file_content" \
    "rendered file contains expected content"

# ------------------------------------------------------------------------------
# 23. Source Template Preservation
# ------------------------------------------------------------------------------

assert_equals \
    "$original_template_content" \
    "$(cat "$template_file")" \
    "source template remains unchanged"

# ------------------------------------------------------------------------------
# 24. Missing Template File
# ------------------------------------------------------------------------------

phoenix::template_render_file \
    "/tmp/phoenix-template-does-not-exist.tpl" \
    "$destination_file" \
    "NAME=Phoenix"

assert_status \
    1 \
    "$?" \
    "missing template file causes failure"

# ------------------------------------------------------------------------------
# 25. Directory Used as Template
# ------------------------------------------------------------------------------

phoenix::template_render_file \
    "/tmp" \
    "$destination_file" \
    "NAME=Phoenix"

assert_status \
    1 \
    "$?" \
    "directory used as template causes failure"

# ------------------------------------------------------------------------------
# 26. Empty Destination Path
# ------------------------------------------------------------------------------

phoenix::template_render_file \
    "$template_file" \
    "" \
    "PROJECT_NAME=Phoenix" \
    "VERSION=1.0" \
    "URL=test"

assert_status \
    1 \
    "$?" \
    "empty destination path causes failure"

# ------------------------------------------------------------------------------
# 27. Unresolved Placeholder Prevents Destination Creation
# ------------------------------------------------------------------------------

rm -f "$destination_file"

phoenix::template_render_file \
    "$template_file" \
    "$destination_file" \
    "PROJECT_NAME=Phoenix"

unresolved_create_status=$?

if [[ "$unresolved_create_status" -eq 1 && ! -e "$destination_file" ]]; then
    unresolved_destination_status=0
else
    unresolved_destination_status=1
fi

assert_status \
    0 \
    "$unresolved_destination_status" \
    "unresolved placeholder prevents destination creation"

# ------------------------------------------------------------------------------
# 28. Existing Destination Preserved on Failure
# ------------------------------------------------------------------------------

printf '%s' "ORIGINAL" > "$existing_destination"

phoenix::template_render_file \
    "$template_file" \
    "$existing_destination" \
    "PROJECT_NAME=Phoenix"

preserve_status=$?

if [[ \
    "$preserve_status" -eq 1 && \
    "$(cat "$existing_destination")" == "ORIGINAL" \
]]; then
    existing_destination_status=0
else
    existing_destination_status=1
fi

assert_status \
    0 \
    "$existing_destination_status" \
    "failed rendering preserves existing destination"

# ------------------------------------------------------------------------------
# 29. Invalid Destination Parent
# ------------------------------------------------------------------------------

invalid_destination="/tmp/phoenix-directory-that-does-not-exist/output.txt"

rm -rf "/tmp/phoenix-directory-that-does-not-exist"

phoenix::template_render_file \
    "$template_file" \
    "$invalid_destination" \
    "PROJECT_NAME=Phoenix" \
    "VERSION=1.0" \
    "URL=test"

assert_status \
    1 \
    "$?" \
    "invalid destination parent causes failure"

# ------------------------------------------------------------------------------
# 30. Equals Characters in File Mode
# ------------------------------------------------------------------------------

file_equals_template="/tmp/phoenix-template-equals.tpl"
file_equals_output="/tmp/phoenix-template-equals-output.txt"

printf '%s' '{{URL}}' > "$file_equals_template"

phoenix::template_render_file \
    "$file_equals_template" \
    "$file_equals_output" \
    "URL=https://example.test/?a=1&b=2"

file_equals_status=$?

if [[ \
    "$file_equals_status" -eq 0 && \
    "$(cat "$file_equals_output")" == "https://example.test/?a=1&b=2" \
]]; then
    file_equals_result=0
else
    file_equals_result=1
fi

assert_status \
    0 \
    "$file_equals_result" \
    "file rendering preserves additional equals characters"

# ------------------------------------------------------------------------------
# Cleanup
# ------------------------------------------------------------------------------

rm -f \
    "$template_file" \
    "$destination_file" \
    "$existing_destination" \
    "$security_target" \
    "$template_security_target" \
    "$file_equals_template" \
    "$file_equals_output"

# ------------------------------------------------------------------------------
# Summary
# ------------------------------------------------------------------------------

printf '\nTests: %s\n' "$tests"
printf 'Passed: %s\n' "$passed"
printf 'Failed: %s\n' "$failed"

if [[ "$failed" -gt 0 ]]; then
    exit 1
fi
