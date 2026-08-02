# PHOENIX TEMPLATE ENGINE API REFERENCE
## Version 1.0

**Status:** Stable Candidate

---

# 1. Purpose

This document defines the public API of the Phoenix DevKit Template Engine.

The Template Engine provides deterministic and secure text-template rendering using explicit Phoenix placeholders and caller-provided variables.

Implementation:

```text
core/template_engine.sh
```

---

# 2. Module Characteristics

The Template Engine is:

- deterministic;
- explicit-input driven;
- non-evaluating;
- environment-independent;
- side-effect free for content rendering;
- filesystem-aware for file rendering;
- strict about unresolved placeholders;
- designed for predictable generator infrastructure.

Templates and replacement values are always treated as data.

---

# 3. Placeholder Syntax

Phoenix Template Engine v1.0 uses:

```text
{{VARIABLE}}
```

Valid variable names follow:

```text
[A-Z][A-Z0-9_]*
```

Valid examples:

```text
{{NAME}}
{{PROJECT_NAME}}
{{VERSION_2}}
{{OUTPUT_PATH}}
```

Invalid examples:

```text
{{name}}
{{ProjectName}}
{{PROJECT-NAME}}
{{ NAME }}
{{}}
```

---

# 4. Variable Assignment Format

Variables are supplied explicitly using:

```text
KEY=VALUE
```

Example:

```bash
phoenix::template_render \
    "Project: {{PROJECT_NAME}} / {{VERSION}}" \
    "PROJECT_NAME=Phoenix" \
    "VERSION=1.0"
```

Result:

```text
Project: Phoenix / 1.0
```

Variable assignments are split on the first `=` character.

Therefore:

```text
URL=https://example.test/?a=1&b=2
```

is interpreted as:

```text
KEY   = URL
VALUE = https://example.test/?a=1&b=2
```

Additional `=` characters remain part of the value.

---

# 5. Public API

Phoenix Template Engine v1.0 exposes exactly three public functions:

```text
phoenix::template_has_placeholders
phoenix::template_render
phoenix::template_render_file
```

---

# 6. phoenix::template_has_placeholders

## Purpose

Checks whether template content contains at least one valid Phoenix placeholder.

## Signature

```bash
phoenix::template_has_placeholders <template_content>
```

## Arguments

| Argument | Description |
|---|---|
| `$1` | Template content |

## Output

No stdout output.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | At least one valid placeholder exists |
| `1` | No valid placeholder exists |

## Example

```bash
phoenix::template_has_placeholders "Hello {{NAME}}"
```

returns:

```text
0
```

while:

```bash
phoenix::template_has_placeholders "Hello Phoenix"
```

returns:

```text
1
```

---

# 7. phoenix::template_render

## Purpose

Renders template content using explicitly supplied variables.

## Signature

```bash
phoenix::template_render <template_content> [KEY=VALUE ...]
```

## Arguments

| Argument | Description |
|---|---|
| `$1` | Template content |
| `$2...$n` | Explicit variable assignments |

## Output

On success, fully rendered content is written to stdout.

No additional output is written to stdout.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | Rendering completed successfully |
| `1` | Invalid variable assignment or unresolved template placeholder |

---

# 8. Rendering Rules

Rendering follows these rules:

1. template content is treated as data;
2. variables are supplied explicitly;
3. assignments use `KEY=VALUE`;
4. variable names are validated;
5. assignments are split on the first `=`;
6. duplicate variables use first-match-wins;
7. every occurrence of a placeholder in the original template is replaced;
8. replacement values are inserted literally;
9. replacement values are not recursively interpreted as templates;
10. shell syntax is never evaluated;
11. unresolved placeholders in the original template cause rendering failure;
12. failed rendering produces no partial stdout output.

---

# 9. Duplicate Variables

When a variable is supplied more than once:

```bash
phoenix::template_render \
    "{{NAME}}" \
    "NAME=first" \
    "NAME=second"
```

the first supplied value wins.

Result:

```text
first
```

---

# 10. Repeated Placeholders

A placeholder may occur multiple times.

Example:

```bash
phoenix::template_render \
    "{{NAME}} / {{NAME}} / {{NAME}}" \
    "NAME=Phoenix"
```

Result:

```text
Phoenix / Phoenix / Phoenix
```

---

# 11. Empty Values

Empty values are valid.

Example:

```bash
phoenix::template_render "{{DESCRIPTION}}" "DESCRIPTION="
```

returns success and produces an empty value.

---

# 12. Missing Variables

Missing required variables cause rendering failure.

Example:

```text
{{NAME}} {{VERSION}}
```

with only:

```text
NAME=Phoenix
```

results in:

```text
Return code: 1
stdout: empty
```

Partial rendered content is not emitted.

---

# 13. Literal Replacement Contract

Replacement values are literal data.

For example:

```bash
phoenix::template_render \
    "{{NAME}}" \
    "NAME={{OTHER}}" \
    "OTHER=Phoenix"
```

returns:

```text
{{OTHER}}
```

and not:

```text
Phoenix
```

A placeholder-like sequence introduced by a replacement value is therefore not recursively rendered.

This behavior prevents replacement values from changing the structure or semantics of the original template.

---

# 14. Shell-Significant Content

Shell-significant replacement values remain literal.

Example:

```bash
phoenix::template_render \
    "{{COMMAND}}" \
    'COMMAND=$(touch /tmp/phoenix-danger)'
```

returns literally:

```text
$(touch /tmp/phoenix-danger)
```

No command is executed.

The same principle applies to shell-significant content including:

```text
$VARIABLE
${VARIABLE}
`command`
;
&
|
>
<
```

---

# 15. Environment Isolation

Environment variables are not imported implicitly.

Example:

```bash
export NAME="Environment Phoenix"

phoenix::template_render "{{NAME}}"
```

fails unless `NAME` is explicitly supplied as a rendering argument.

The Template Engine therefore has no implicit variable context.

---

# 16. Invalid Variable Assignments

Invalid examples include:

```text
NAME
=Phoenix
name=Phoenix
PROJECT-NAME=Phoenix
```

Invalid assignments cause rendering failure.

---

# 17. phoenix::template_render_file

## Purpose

Renders a template file into an explicitly requested destination file.

## Signature

```bash
phoenix::template_render_file \
    <template_path> \
    <destination_path> \
    [KEY=VALUE ...]
```

## Arguments

| Argument | Description |
|---|---|
| `$1` | Source template path |
| `$2` | Destination file path |
| `$3...$n` | Explicit variable assignments |

## Output

No rendered content is written to stdout.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | Rendering and destination write succeeded |
| `1` | Validation, rendering, source, destination, or write failure |

---

# 18. File Rendering Sequence

File rendering follows:

```text
Validate Source
      ↓
Read Source
      ↓
Render Completely
      ↓
Verify Rendering Success
      ↓
Write Destination
```

Rendering failure occurs before destination writing.

---

# 19. Destination Integrity

If rendering fails:

- a new destination file is not created;
- an existing destination file is not overwritten.

This prevents incomplete generated artifacts from being presented as successful output.

---

# 20. Source Preservation

The source template is read-only.

Successful and failed rendering must leave the source template unchanged.

---

# 21. File Path Behavior

The source must be an existing regular file.

The following fail:

- empty source path;
- missing source file;
- directory used as source.

The destination path must be non-empty.

Parent-directory creation is not implicit.

If the destination parent does not exist, the write fails through normal filesystem behavior.

---

# 22. Security Contract

Templates and replacement values are untrusted data.

Rendering must not use:

```text
eval
source
bash -c
sh -c
```

for interpretation of template content or replacement values.

Rendered output is data.

Producing rendered output does not execute it.

---

# 23. Side Effects

The following functions are content operations and have no filesystem side effects:

```text
phoenix::template_has_placeholders
phoenix::template_render
```

`phoenix::template_render_file` has one permitted side effect on success:

```text
write the explicitly requested destination file
```

The module must not create or modify unrelated files.

---

# 24. Dependencies

The Template Engine uses certified Phoenix Core services:

```text
core/filesystem.sh
core/strings.sh
```

Manifest is not a dependency of Template Engine v1.0.

---

# 25. Private Implementation

The module contains private implementation helpers under the:

```text
_phoenix::
```

namespace.

These functions are implementation details and are not part of the stable public API.

Callers must use only:

```text
phoenix::template_has_placeholders
phoenix::template_render
phoenix::template_render_file
```

---

# 26. Public API Summary

| Function | Type | Result Mechanism |
|---|---|---|
| `phoenix::template_has_placeholders` | Predicate | exit code |
| `phoenix::template_render` | Rendering | stdout + exit code |
| `phoenix::template_render_file` | File rendering | destination file + exit code |

---

# 27. Testing Status

Automated test suite:

```text
07_TESTS/unit/template_engine_test.sh
```

Validated result:

```text
Tests: 31
Passed: 31
Failed: 0
```

Coverage includes:

- placeholder detection;
- variable validation;
- single and multiple replacement;
- repeated placeholders;
- duplicate variables;
- first-match-wins;
- empty values;
- values containing spaces;
- values containing additional `=`;
- unresolved placeholders;
- no partial stdout on failure;
- environment isolation;
- literal shell-like values;
- non-execution security behavior;
- file rendering;
- source preservation;
- destination integrity;
- invalid paths;
- literal placeholder-like replacement values.

---

# 28. Security Validation

Manual and automated security tests confirm that shell-like content remains inert.

Example:

```text
$(touch /tmp/phoenix-template-danger)
```

is treated as text.

It is never executed by the Template Engine.

Regression testing also confirms that replacement content such as:

```text
{{OTHER}}
```

remains literal and is not recursively interpreted.

---

# 29. Stability Policy

After certification, the Template Engine v1.0 public API becomes stable.

Breaking changes require:

- architecture review;
- Function Specification update;
- implementation review;
- regression test update;
- API Reference update;
- version change where appropriate.

---

# 30. Certification State

```text
Architecture:        COMPLETE
Specification:       COMPLETE
Implementation:      COMPLETE
Syntax Validation:   PASS
Manual Testing:      PASS
Automated Testing:   31/31 PASS
Security Testing:    PASS
Regression Testing:  PASS
Code Review:         PASS
API Reference:       COMPLETE
Final Certification: CERTIFIED
```

---

# 31. Document Status

| Item | Value |
|---|---|
| Document | PHOENIX_TEMPLATE_ENGINE_API_REFERENCE_v1.0 |
| Version | 1.0 |
| Status | Stable Candidate |
| Module | core/template_engine.sh |
| Public API | 3 functions |
| Tests | 31/31 PASS |
| Certification | Approved |
| Last Updated | Sprint 001 |
