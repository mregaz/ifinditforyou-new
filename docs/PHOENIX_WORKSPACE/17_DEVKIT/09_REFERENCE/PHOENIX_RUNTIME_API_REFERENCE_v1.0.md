# PHOENIX RUNTIME API REFERENCE
## Version 1.0

**Status:** Final

---

# 1. Purpose

This document defines the public API of the Phoenix DevKit Runtime module.

The Runtime provides foundational execution-environment services used by the Phoenix DevKit Core.

Implementation:

```text
core/runtime.sh
```

---

# 2. Public API

Runtime v1.0 exposes exactly four public functions:

```text
phoenix::runtime_info
phoenix::is_command_available
phoenix::require_command
phoenix::fail
```

---

# 3. phoenix::runtime_info

## Purpose

Returns the Phoenix DevKit Runtime identification string.

## Signature

```bash
phoenix::runtime_info
```

## Arguments

None.

## Output

Writes the Runtime identity to stdout.

Current value:

```text
Phoenix DevKit Runtime v0.1
```

## Return Code

| Code | Meaning |
|---|---|
| `0` | Success |

## Example

```bash
phoenix::runtime_info
```

Output:

```text
Phoenix DevKit Runtime v0.1
```

---

# 4. phoenix::is_command_available

## Purpose

Checks whether a command is available in the current shell environment.

## Signature

```bash
phoenix::is_command_available <command_name>
```

## Arguments

| Argument | Description |
|---|---|
| `$1` | Command name |

## Output

No stdout output.

No stderr output is produced during normal availability checks.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | Command is available |
| `1` | Command is unavailable or argument is empty |

## Example

```bash
if phoenix::is_command_available git; then
    printf '%s\n' "git available"
fi
```

## Notes

Command resolution uses the shell environment.

The target command is not executed.

---

# 5. phoenix::require_command

## Purpose

Ensures that a required command is available.

## Signature

```bash
phoenix::require_command <command_name>
```

## Arguments

| Argument | Description |
|---|---|
| `$1` | Required command name |

## Success Behavior

When the command exists:

```text
Return code: 0
stderr: empty
```

## Failure Behavior

When the command is unavailable:

```text
Return code: 1
```

and the Runtime writes an error to stderr.

Expected format:

```text
[Phoenix Runtime] Missing required command: <command_name>
```

## Example

```bash
phoenix::require_command git
```

---

# 6. phoenix::fail

## Purpose

Provides a standard Runtime failure primitive.

## Signature

```bash
phoenix::fail <message>
```

## Arguments

| Argument | Description |
|---|---|
| `$1` | Optional failure message |

## Output

Writes an error message to stderr.

Expected format:

```text
[Phoenix Runtime] <message>
```

## Empty Message

If no message is supplied:

```bash
phoenix::fail
```

the Runtime emits:

```text
[Phoenix Runtime] Unknown runtime error.
```

## Return Code

```text
1
```

`phoenix::fail` always returns failure.

## Process Control

The function does not terminate the calling shell.

The caller decides whether to:

- return;
- exit;
- recover;
- propagate the error.

---

# 7. Public API Summary

| Function | Type | stdout | stderr | Return |
|---|---|---|---|---|
| `phoenix::runtime_info` | Information | Runtime identity | none | `0` |
| `phoenix::is_command_available` | Predicate | none | none | `0/1` |
| `phoenix::require_command` | Validation | none | failure message | `0/1` |
| `phoenix::fail` | Failure primitive | none | failure message | `1` |

---

# 8. Return Code Policy

Runtime follows UNIX-compatible conventions:

```text
0 = success / condition satisfied
1 = failure / condition not satisfied
```

Predicate-style functions expose their result through exit status rather than textual boolean output.

---

# 9. Dependencies

Runtime v1.0 has no Phoenix Core module dependencies.

It relies only on the shell execution environment and Bash primitives required by its implementation.

---

# 10. State Model

Runtime is effectively stateless after module initialization.

The load guard prevents unnecessary repeated initialization.

Public functions do not maintain hidden mutable application state.

---

# 11. Security Contract

Runtime inputs are treated as data.

The public Runtime API does not require:

```text
eval
bash -c
sh -c
```

for its behavior.

Command availability checks resolve command names but do not execute those commands.

---

# 12. Side Effects

Runtime side effects are limited to documented output channels:

```text
runtime_info          → stdout
is_command_available  → none
require_command       → stderr on failure
fail                  → stderr
```

The module does not intentionally modify filesystem or application state.

---

# 13. Testing Status

Certification suite:

```text
07_TESTS/unit/runtime_test.sh
```

Validated behaviors include:

- Runtime identity;
- available-command detection;
- unavailable-command rejection;
- successful required-command validation;
- missing required-command failure;
- Runtime failure primitive.

Certification status:

```text
CERTIFIED
```

---

# 14. Public API Stability

The certified Runtime v1.0 API consists of:

```text
phoenix::runtime_info
phoenix::is_command_available
phoenix::require_command
phoenix::fail
```

Breaking changes require:

- architecture review;
- Function Specification update;
- regression test update;
- API Reference update;
- version change where appropriate.

---

# 15. Certification State

```text
Architecture:        COMPLETE
Specification:       COMPLETE
Implementation:      CERTIFIED
Syntax Validation:   PASS
Automated Testing:   CERTIFIED
Code Review:         PASS
API Reference:       COMPLETE
Final Certification: EXISTING
```

---

# 16. Document Status

| Item | Value |
|---|---|
| Document | PHOENIX_RUNTIME_API_REFERENCE_v1.0 |
| Version | 1.0 |
| Status | Final |
| Module | core/runtime.sh |
| Public API | 4 functions |
| Certification | Approved |
| Audit | Core Consolidation Audit |
