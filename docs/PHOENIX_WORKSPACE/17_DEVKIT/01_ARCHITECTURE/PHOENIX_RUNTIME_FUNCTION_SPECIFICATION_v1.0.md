# PHOENIX RUNTIME FUNCTION SPECIFICATION
## Version 1.0

**Status:** Final

---

# 1. Purpose

This document defines the public function contracts of the Phoenix DevKit Runtime module.

Implementation:

```text
core/runtime.sh
```

The Runtime exposes foundational execution-environment services used by the Phoenix DevKit Core.

---

# 2. Public API

Runtime v1.0 exposes exactly four public functions:

```text
phoenix::runtime_info
phoenix::is_command_available
phoenix::require_command
phoenix::fail
```

No additional public API is part of Runtime v1.0.

---

# 3. phoenix::runtime_info

## Purpose

Returns the current Phoenix DevKit Runtime identification string.

## Signature

```bash
phoenix::runtime_info
```

## Arguments

None.

## Output

Writes the Runtime identification string to stdout.

Current value:

```text
Phoenix DevKit Runtime v0.1
```

## Return Code

| Code | Meaning |
|---|---|
| `0` | Success |

## Side Effects

None beyond stdout output.

---

# 4. phoenix::is_command_available

## Purpose

Determines whether a command is available in the current shell execution environment.

## Signature

```bash
phoenix::is_command_available <command_name>
```

## Arguments

| Argument | Required | Description |
|---|---|---|
| `$1` | Yes | Command name to resolve |

## Output

No stdout output.

No stderr output is expected for normal availability checks.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | Command is available |
| `1` | Command is unavailable or argument is empty |

## Matching Behavior

The implementation delegates command discovery to the shell/platform.

The command is resolved through:

```text
command -v
```

The command itself is not executed.

## Examples

```bash
phoenix::is_command_available git
```

```bash
if phoenix::is_command_available bash; then
    printf '%s\n' "bash available"
fi
```

---

# 5. phoenix::require_command

## Purpose

Ensures that a required command is available.

## Signature

```bash
phoenix::require_command <command_name>
```

## Arguments

| Argument | Required | Description |
|---|---|---|
| `$1` | Yes | Required command name |

## Success Behavior

When the command is available:

- no error message is emitted;
- return code is `0`.

## Failure Behavior

When the command is unavailable or invalid:

- an error message is written to stderr;
- return code is non-zero.

Expected Runtime error format:

```text
[Phoenix Runtime] Missing required command: <command_name>
```

## Return Codes

| Code | Meaning |
|---|---|
| `0` | Required command is available |
| `1` | Required command is unavailable or invalid |

## Side Effects

None beyond stderr output on failure.

---

# 6. phoenix::fail

## Purpose

Provides a standardized Runtime failure primitive.

## Signature

```bash
phoenix::fail <message>
```

## Arguments

| Argument | Required | Description |
|---|---|---|
| `$1` | No | Error message |

## Output

Writes a Runtime-formatted error message to stderr.

Expected format:

```text
[Phoenix Runtime] <message>
```

## Empty Message Behavior

If no message is supplied, the function uses:

```text
Unknown runtime error.
```

Expected output:

```text
[Phoenix Runtime] Unknown runtime error.
```

## Return Code

| Code | Meaning |
|---|---|
| `1` | Runtime failure |

`phoenix::fail` always returns failure.

## Process Behavior

The function does not terminate the calling shell automatically.

The caller remains responsible for deciding whether to:

- return;
- exit;
- recover;
- propagate the failure.

---

# 7. Output Channel Contract

The Runtime uses explicit output channels:

| Function | stdout | stderr | Return Code |
|---|---|---|---|
| `phoenix::runtime_info` | Runtime identity | none | `0` |
| `phoenix::is_command_available` | none | none | `0/1` |
| `phoenix::require_command` | none | failure message | `0/1` |
| `phoenix::fail` | none | failure message | `1` |

---

# 8. Return Code Policy

Runtime follows UNIX-compatible conventions.

```text
0 = success / condition satisfied
1 = failure / condition not satisfied
```

Predicate behavior is communicated through exit status rather than textual boolean values.

---

# 9. Input Rules

Runtime v1.0 follows these input rules:

- empty command names are invalid;
- command names are supplied explicitly;
- messages are treated as text;
- command discovery does not execute the target command.

The Runtime does not infer commands from environment-specific configuration beyond normal shell resolution.

---

# 10. Security Contract

Runtime input must not be treated as executable shell code.

The public API does not require:

```text
eval
bash -c
sh -c
```

for its behavior.

`phoenix::is_command_available` and `phoenix::require_command` resolve command names but do not execute those commands.

---

# 11. State Contract

Runtime functions must not maintain hidden mutable application state.

The module load guard is permitted initialization state.

Public function results must remain deterministic for the same execution environment and inputs.

---

# 12. Dependencies

Runtime v1.0 has no Phoenix Core module dependencies.

It relies only on Bash/shell primitives required by the implementation.

This preserves its position as a foundational Core module.

---

# 13. Required Test Coverage

The Runtime certification suite must verify at minimum:

1. `runtime_info` returns the expected Runtime identification;
2. an available command is detected successfully;
3. an invalid or unavailable command is rejected;
4. `require_command` succeeds for an available command;
5. `require_command` fails for an unavailable command;
6. failure behavior is written to stderr;
7. `phoenix::fail` returns failure;
8. `phoenix::fail` emits the expected Runtime-formatted error.

The existing Runtime certification suite is:

```text
07_TESTS/unit/runtime_test.sh
```

---

# 14. Public API Stability

The certified Runtime v1.0 public API is:

```text
phoenix::runtime_info
phoenix::is_command_available
phoenix::require_command
phoenix::fail
```

Breaking changes require:

- architecture review;
- Function Specification update;
- test update;
- API Reference update;
- appropriate version change.

---

# 15. Definition of Done

Runtime is considered fully documented when:

```text
Architecture            COMPLETE
Function Specification  COMPLETE
Implementation          CERTIFIED
Syntax Validation       PASS
Automated Tests         CERTIFIED
API Review              PASS
API Reference           COMPLETE
Certification           EXISTING
```

---

# 16. Document Status

| Item | Value |
|---|---|
| Document | PHOENIX_RUNTIME_FUNCTION_SPECIFICATION_v1.0 |
| Version | 1.0 |
| Status | Final |
| Module | core/runtime.sh |
| Public API | 4 functions |
| Certification | Existing Core Certification |
| Audit | Core Consolidation Audit |
