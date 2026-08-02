# PHOENIX LOGGER API REFERENCE
## Version 1.0

**Status:** Final

---

# 1. Purpose

This document defines the public API of the Phoenix DevKit Logger module.

The Logger provides deterministic and standardized terminal logging for Phoenix DevKit components.

Implementation:

```text
core/logger.sh
```

---

# 2. Public API

Logger v1.0 exposes exactly five public functions:

```text
phoenix::log_info
phoenix::log_ok
phoenix::log_warn
phoenix::log_error
phoenix::log_debug
```

---

# 3. Logging Format

All public Logger functions emit messages using:

```text
[LEVEL] message
```

The level is:

- uppercase;
- enclosed in square brackets;
- followed by one space;
- followed by caller-provided message content.

Examples:

```text
[INFO] Starting operation
[OK] Operation completed
[WARN] Optional dependency missing
[ERROR] Operation failed
[DEBUG] Diagnostic information
```

---

# 4. Output Channel Contract

Logger v1.0 uses the following output channels:

| Function | Level | Destination |
|---|---|---|
| `phoenix::log_info` | INFO | stdout |
| `phoenix::log_ok` | OK | stdout |
| `phoenix::log_warn` | WARN | stderr |
| `phoenix::log_error` | ERROR | stderr |
| `phoenix::log_debug` | DEBUG | stdout |

This destination contract is part of the stable Logger API.

---

# 5. phoenix::log_info

## Purpose

Emits a general informational message.

## Signature

```bash
phoenix::log_info <message>
```

## Arguments

| Argument | Description |
|---|---|
| `$1` | Message to emit |

## Output

Destination:

```text
stdout
```

Format:

```text
[INFO] <message>
```

## Example

```bash
phoenix::log_info "Starting Phoenix DevKit"
```

Output:

```text
[INFO] Starting Phoenix DevKit
```

---

# 6. phoenix::log_ok

## Purpose

Emits a successful-operation or positive-state message.

## Signature

```bash
phoenix::log_ok <message>
```

## Arguments

| Argument | Description |
|---|---|
| `$1` | Message to emit |

## Output

Destination:

```text
stdout
```

Format:

```text
[OK] <message>
```

## Example

```bash
phoenix::log_ok "Validation passed"
```

Output:

```text
[OK] Validation passed
```

---

# 7. phoenix::log_warn

## Purpose

Emits a non-fatal warning message.

## Signature

```bash
phoenix::log_warn <message>
```

## Arguments

| Argument | Description |
|---|---|
| `$1` | Warning message |

## Output

Destination:

```text
stderr
```

Format:

```text
[WARN] <message>
```

## Example

```bash
phoenix::log_warn "Optional configuration missing"
```

Expected stderr:

```text
[WARN] Optional configuration missing
```

## Control Flow

The Logger reports a warning.

It does not terminate execution automatically.

---

# 8. phoenix::log_error

## Purpose

Emits an error message.

## Signature

```bash
phoenix::log_error <message>
```

## Arguments

| Argument | Description |
|---|---|
| `$1` | Error message |

## Output

Destination:

```text
stderr
```

Format:

```text
[ERROR] <message>
```

## Example

```bash
phoenix::log_error "Generation failed"
```

Expected stderr:

```text
[ERROR] Generation failed
```

## Control Flow

Logging an error does not automatically terminate the calling process.

Execution policy remains the caller's responsibility.

---

# 9. phoenix::log_debug

## Purpose

Emits diagnostic information.

## Signature

```bash
phoenix::log_debug <message>
```

## Arguments

| Argument | Description |
|---|---|
| `$1` | Diagnostic message |

## Output

Destination:

```text
stdout
```

Format:

```text
[DEBUG] <message>
```

## Example

```bash
phoenix::log_debug "Manifest path resolved"
```

Output:

```text
[DEBUG] Manifest path resolved
```

---

# 10. Public API Summary

| Function | Type | stdout | stderr |
|---|---|---|---|
| `phoenix::log_info` | Information | formatted message | none |
| `phoenix::log_ok` | Success information | formatted message | none |
| `phoenix::log_warn` | Warning | none | formatted message |
| `phoenix::log_error` | Error information | none | formatted message |
| `phoenix::log_debug` | Diagnostic | formatted message | none |

---

# 11. Return Code Philosophy

Logger functions perform message emission.

Successful emission follows normal shell success behavior.

The semantic meaning of a log level does not redefine execution status.

In particular:

```text
WARN  does not imply Logger failure
ERROR does not imply Logger failure
```

The Logger communicates.

The caller controls execution.

---

# 12. Separation from Runtime Failure

Logger and Runtime failure are intentionally separate.

```text
Logger
  └── communicates messages

Runtime
  └── communicates execution failure
```

Therefore:

```bash
phoenix::log_error "Operation failed"
```

does not implicitly call:

```bash
phoenix::fail "Operation failed"
```

---

# 13. Message Data Contract

Caller-provided messages are treated as data.

Shell-like content remains textual.

For example:

```text
$(touch /tmp/phoenix-logger-danger)
```

must remain message content.

It must not execute.

---

# 14. Security Contract

Logger v1.0 does not require message evaluation through:

```text
eval
bash -c
sh -c
```

for its public behavior.

The Logger must not execute caller-provided message content.

---

# 15. State Model

Logger v1.0 is stateless after module initialization.

It does not maintain:

- message history;
- message counters;
- log sessions;
- persistent buffers;
- implicit destinations.

Each call is independent.

---

# 16. Filesystem Behavior

Logger v1.0 does not write log files.

Public Logger calls do not implicitly:

- create files;
- modify files;
- create directories;
- rotate logs.

Persistence is outside the v1.0 contract.

---

# 17. Environment Behavior

Logger v1.0 does not implicitly read environment variables to control:

- formatting;
- verbosity;
- filtering;
- output destination;
- color;
- timestamps.

Any such behavior requires an explicit future architecture change.

---

# 18. Dependencies

Logger v1.0 is dependency-light.

Its public behavior requires terminal output primitives only.

It does not require:

```text
Manifest
Template Engine
Filesystem
external logging services
```

---

# 19. Private Implementation

Common formatting may use private functions under:

```text
_phoenix::
```

Private functions are implementation details.

They are not part of the stable public API.

Only the certified:

```text
phoenix::log_*
```

functions are public.

---

# 20. Testing Status

Unit test suite:

```text
07_TESTS/unit/logger_test.sh
```

Certified result:

```text
Tests: 5
Passed: 5
Failed: 0
```

Validated behaviors:

- INFO formatting and stdout destination;
- OK formatting and stdout destination;
- WARN formatting and stderr destination;
- ERROR formatting and stderr destination;
- DEBUG formatting and stdout destination.

---

# 21. Public API Stability

The certified Logger v1.0 API consists of:

```text
phoenix::log_info
phoenix::log_ok
phoenix::log_warn
phoenix::log_error
phoenix::log_debug
```

Breaking changes require:

- architecture review;
- Function Specification update;
- regression test update;
- API Reference update;
- version change where appropriate.

---

# 22. Certification State

```text
Architecture:        COMPLETE
Specification:       COMPLETE
Implementation:      CERTIFIED
Syntax Validation:   PASS
Automated Testing:   5/5 PASS
Code Review:         PASS
API Reference:       COMPLETE
Final Certification: EXISTING
```

---

# 23. Document Status

| Item | Value |
|---|---|
| Document | PHOENIX_LOGGER_API_REFERENCE_v1.0 |
| Version | 1.0 |
| Status | Final |
| Module | core/logger.sh |
| Public API | 5 functions |
| Tests | 5/5 PASS |
| Certification | Approved |
| Audit | Core Consolidation Audit |
