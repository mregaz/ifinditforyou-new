# PHOENIX TEMPLATE ENGINE FUNCTION SPECIFICATION
## Version 1.0

**Status:** Specification

---

# 1. Purpose

This document defines the public function contracts of the Phoenix DevKit Template Engine.

The architecture defines the responsibilities and constraints of the module.

This specification defines exactly how callers interact with it.

Implementation must conform to this specification.

---

# 2. Module

Implementation file:

```text
core/template_engine.sh
```

Phoenix Template Engine v1.0 performs deterministic literal substitution using explicit variables.

---

# 3. Public API

Phoenix Template Engine v1.0 exposes exactly three public functions:

```text
phoenix::template_has_placeholders
phoenix::template_render
phoenix::template_render_file
```

No additional public API is required for version 1.0.

---

# 4. Variable Passing Contract

Variables are passed explicitly as additional function arguments using:

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

Output:

```text
Project: Phoenix / 1.0
```

Each variable argument is split on the first `=` character.

Therefore:

```text
URL=https://example.test/?a=1&b=2
```

produces:

```text
KEY   = URL
VALUE = https://example.test/?a=1&b=2
```

Additional `=` characters remain part of the value.

---

# 5. Variable Name Rules

Variable names must follow:

```text
[A-Z][A-Z0-9_]*
```

Valid examples:

```text
NAME
PROJECT_NAME
VERSION_2
OUTPUT_PATH
```

Invalid examples:

```text
name
ProjectName
PROJECT-NAME
_PROJECT
```

Invalid variable arguments must cause rendering failure.

---

# 6. Duplicate Variable Arguments

If the same variable is supplied more than once:

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

This matches the deterministic first-match policy used elsewhere in the Phoenix Core.

---

# 7. phoenix::template_has_placeholders

## Purpose

Determines whether template content contains at least one valid Phoenix placeholder.

## Signature

```bash
phoenix::template_has_placeholders <template_content>
```

## Arguments

| Argument | Required | Description |
|---|---|---|
| `$1` | Yes | Template content |

## Output

No stdout output.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | At least one valid placeholder exists |
| `1` | No valid placeholder exists |

## Placeholder Grammar

Only placeholders matching:

```text
{{[A-Z][A-Z0-9_]*}}
```

are considered valid.

Examples considered valid:

```text
{{NAME}}
{{PROJECT_NAME}}
{{VERSION_2}}
```

Examples not considered valid:

```text
{{name}}
{{ NAME }}
{{PROJECT-NAME}}
{{}}
```

---

# 8. phoenix::template_render

## Purpose

Renders template content using explicitly supplied variables.

## Signature

```bash
phoenix::template_render <template_content> [KEY=VALUE ...]
```

## Arguments

| Argument | Required | Description |
|---|---|---|
| `$1` | Yes | Template content |
| `$2...$n` | No | Explicit variable assignments |

## Output

On success, fully rendered content is written to stdout.

No additional output is written to stdout.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | Rendering completed successfully |
| `1` | Invalid variable input or unresolved valid placeholders remain |

---

# 9. Rendering Rules

Rendering follows these rules:

1. template content is treated as data;
2. each variable assignment is parsed using the first `=`;
3. variable names are validated;
4. the first supplied occurrence of a duplicate variable wins;
5. every occurrence of a matching placeholder is replaced;
6. replacement values are inserted literally;
7. replacement values are never evaluated;
8. after substitution, unresolved valid placeholders are checked;
9. if any valid placeholder remains, rendering fails;
10. failed rendering must not emit partial rendered content to stdout.

---

# 10. Templates Without Placeholders

Templates containing no valid placeholders render successfully without variables.

Example:

```bash
phoenix::template_render "Phoenix DevKit"
```

Output:

```text
Phoenix DevKit
```

Return code:

```text
0
```

---

# 11. Repeated Placeholders

Every occurrence of a supplied variable is replaced.

Example:

```text
{{NAME}} / {{NAME}} / {{NAME}}
```

with:

```text
NAME=Phoenix
```

becomes:

```text
Phoenix / Phoenix / Phoenix
```

---

# 12. Missing Variables

Missing variables cause rendering failure.

Example template:

```text
Project {{NAME}} version {{VERSION}}
```

Variables:

```text
NAME=Phoenix
```

Result:

```text
Return code: 1
stdout: empty
```

The partially rendered result must not be reported as successful output.

---

# 13. Empty Values

Empty replacement values are valid.

Example:

```bash
phoenix::template_render "{{DESCRIPTION}}" "DESCRIPTION="
```

returns success and writes an empty value.

---

# 14. Literal Replacement Values

Values containing shell syntax are treated literally.

Example:

```bash
phoenix::template_render \
    "{{COMMAND}}" \
    'COMMAND=$(touch /tmp/phoenix-danger)'
```

Output:

```text
$(touch /tmp/phoenix-danger)
```

The command must never execute.

---

# 15. Environment Isolation

The Template Engine must not use environment variables implicitly.

Example:

```bash
export NAME="Environment Phoenix"
```

Then:

```bash
phoenix::template_render "{{NAME}}"
```

must fail.

The caller must explicitly supply:

```text
NAME=Environment Phoenix
```

if that value is intended for rendering.

---

# 16. Invalid Variable Arguments

The following are invalid:

```text
NAME
=Phoenix
name=Phoenix
PROJECT-NAME=Phoenix
```

Invalid variable arguments cause rendering failure.

Rendering must not continue silently.

---

# 17. phoenix::template_render_file

## Purpose

Renders a template file into a destination file.

## Signature

```bash
phoenix::template_render_file \
    <template_path> \
    <destination_path> \
    [KEY=VALUE ...]
```

## Arguments

| Argument | Required | Description |
|---|---|---|
| `$1` | Yes | Source template path |
| `$2` | Yes | Destination file path |
| `$3...$n` | No | Explicit variable assignments |

## Output

No rendered content is written to stdout.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | Destination written successfully |
| `1` | Source invalid, rendering failed, destination invalid, or write failed |

---

# 18. File Rendering Contract

`template_render_file` must follow this sequence:

```text
Validate Source
      ↓
Read Source Completely
      ↓
Render Completely
      ↓
Verify Rendering Success
      ↓
Write Destination
```

The destination must not receive partially rendered content.

---

# 19. Destination Integrity on Failure

If rendering fails:

- a new destination file must not be created;
- an existing destination file must not be overwritten.

Example:

```text
destination contains: ORIGINAL
```

If rendering fails, destination must still contain:

```text
ORIGINAL
```

This is a mandatory v1.0 contract.

---

# 20. Source Preservation

The source template is read-only.

Successful or failed rendering must never modify the source template.

---

# 21. File Paths

The source template must reference a regular readable file.

An empty source path fails.

A directory used as source fails.

The destination path must be non-empty.

Parent-directory creation is not implicit in v1.0.

If the destination parent directory does not exist, rendering fails through normal filesystem behavior.

---

# 22. Security Contract

Template content and variable values are untrusted data.

The module must not render through:

```text
eval
source
bash -c
sh -c
```

Template content must never execute.

Replacement values must never execute.

Rendered content must never execute merely because it was produced.

---

# 23. Side Effects

`template_has_placeholders` and `template_render` are side-effect free.

`template_render_file` has exactly one permitted side effect on success:

```text
write the explicitly requested destination file
```

No unrelated filesystem state may be modified.

---

# 24. Dependencies

The implementation may use:

```text
core/filesystem.sh
core/strings.sh
```

No Manifest dependency is required for version 1.0.

---

# 25. Required Automated Tests

The test suite must verify at minimum:

1. placeholder detection succeeds for a valid placeholder;
2. placeholder detection fails when no placeholder exists;
3. invalid placeholder syntax is not detected;
4. rendering succeeds with one variable;
5. rendering succeeds with multiple variables;
6. repeated placeholders are all replaced;
7. missing variables cause failure;
8. failed rendering produces no partial stdout;
9. empty replacement values succeed;
10. values containing spaces are preserved;
11. values containing `=` are preserved;
12. duplicate variables use first-match-wins;
13. invalid variable assignment without `=` fails;
14. empty variable name fails;
15. invalid lowercase variable name fails;
16. templates without placeholders succeed;
17. environment variables are not imported implicitly;
18. shell-like replacement values are rendered literally;
19. shell-like replacement values are not executed;
20. shell-like template content is not executed;
21. file rendering succeeds;
22. rendered file contains expected content;
23. source template remains unchanged;
24. missing template file causes failure;
25. directory used as template causes failure;
26. empty destination path causes failure;
27. unresolved placeholder prevents destination creation;
28. unresolved placeholder preserves an existing destination;
29. invalid destination parent causes failure;
30. values containing additional `=` render correctly in file mode.

---

# 26. Public API Stability

After certification, these public names and behaviors form the Template Engine v1.0 API:

```text
phoenix::template_has_placeholders
phoenix::template_render
phoenix::template_render_file
```

Breaking changes require:

- architectural review;
- specification update;
- automated test update;
- API Reference update;
- version change where appropriate.

---

# 27. Definition of Done

```text
Architecture           COMPLETE
Function Specification COMPLETE
Implementation         PENDING
Syntax Validation      PENDING
Manual Tests           PENDING
Automated Tests        PENDING
Security Tests         PENDING
Code Review            PENDING
API Reference          PENDING
Certification          PENDING
```
