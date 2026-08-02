# PHOENIX LOGGER FUNCTION SPECIFICATION
## Version 1.0

**Status:** Final

---

# 1. Purpose

This document defines the public function contracts of the Phoenix DevKit Logger module.

Implementation:

```text
core/logger.sh
```

The Logger provides deterministic and standardized terminal logging for Phoenix DevKit components.

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

All shared internal formatting behavior remains private implementation detail.

---

# 3. General Message Contract

Every public Logger function accepts a message supplied by the caller.

General signature:

```bash
phoenix::log_<level> <message>
```

Logger output follows:

```text
[LEVEL] message
```

The Logger:

- formats the message;
- selects the appropriate output channel;
- emits the resulting line;
- does not execute message content;
- does not terminate the calling process.

---

# 4. Output Channel Contract

Logger v1.0 uses the following destinations:

| Function | Level | Destination |
|---|---|---|
| `phoenix::log_info` | INFO | stdout |
| `phoenix::log_ok` | OK | stdout |
| `phoenix::log_warn` | WARN | stderr |
| `phoenix::log_error` | ERROR | stderr |
| `phoenix::log_debug` | DEBUG | stdout |

This destination contract is part of Logger v1.0 behavior.

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

Expected output:

```text
[INFO] Starting Phoenix DevKit
```

## Side Effects

None beyond stdout output.

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

Expected output:

```text
[OK] Validation passed
```

## Side Effects

None beyond stdout output.

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

The function reports a warning.

It does not automatically terminate execution.

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

Logging an error does not automatically:

```text
exit
return failure from the caller
terminate the shell
perform recovery
```

Process-control policy remains the responsibility of the caller.

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

Expected output:

```text
[DEBUG] Manifest path resolved
```

---

# 10. Return Code Contract

Logger functions perform message emission.

Successful logging follows standard shell success behavior.

The semantic level of the message does not redefine the return code.

In particular:

```text
ERROR message ≠ Logger execution failure
WARN message  ≠ Logger execution failure
```

The Logger reports information; the caller owns execution policy.

---

# 11. Message Handling

Logger messages are treated as textual data.

The Logger must preserve caller-provided message content without interpreting it as executable shell syntax.

Example input:

```text
$(touch /tmp/phoenix-logger-test)
```

must remain message content.

It must not be executed.

---

# 12. Empty Message Behavior

Logger v1.0 permits the implementation's established handling of an empty message.

An empty message must not cause evaluation of unrelated environment state or shell commands.

Any future change to empty-message semantics requires corresponding test and specification updates.

---

# 13. Formatting Contract

The standard format is:

```text
[LEVEL] message
```

Requirements:

- level is uppercase;
- level is enclosed in square brackets;
- one space separates the level prefix from the message;
- output is emitted as a line;
- no timestamp is added;
- no color formatting is required by the v1.0 contract.

---

# 14. Separation from Runtime Failure

Logger and Runtime failure are separate contracts.

Logger:

```text
communicates
```

Runtime failure:

```text
signals execution failure
```

Therefore:

```bash
phoenix::log_error "Operation failed"
```

must not implicitly behave as:

```bash
phoenix::fail "Operation failed"
```

unless the caller explicitly chooses that control flow.

---

# 15. State Contract

Logger functions must not maintain hidden mutable state between calls.

Logger v1.0 has no:

- message history;
- log counters;
- output buffer;
- logging session;
- persistent destination state.

Each call is independent.

---

# 16. Filesystem Contract

Logger v1.0 does not write log files.

Calling any public Logger function must not implicitly:

- create files;
- modify files;
- create directories;
- rotate logs.

Filesystem persistence is outside the Logger v1.0 contract.

---

# 17. Environment Contract

Logger behavior must not depend implicitly on environment variables for:

- log level filtering;
- destination selection;
- formatting;
- color;
- verbosity.

Such behavior may only be introduced through an explicit future architectural change.

---

# 18. Security Contract

Caller-provided messages are data.

Logger v1.0 must not evaluate messages through mechanisms such as:

```text
eval
bash -c
sh -c
```

The Logger must not execute shell-like message content.

---

# 19. Dependency Contract

Logger v1.0 should remain dependency-light.

Its public behavior requires only terminal output primitives.

It must not require:

- Manifest;
- Template Engine;
- Filesystem;
- external logging services.

This preserves the Logger as a low-level Core service.

---

# 20. Private Implementation Contract

Common formatting may be delegated to private functions under:

```text
_phoenix::
```

Private functions:

- are implementation details;
- are not stable public API;
- must not be used as external integration points.

Only functions under the certified:

```text
phoenix::
```

Logger API are public.

---

# 21. Required Test Coverage

The Logger test suite must validate at minimum:

1. INFO formatting and destination;
2. OK formatting and destination;
3. WARN formatting and destination;
4. ERROR formatting and destination;
5. DEBUG formatting and destination.

Current suite:

```text
07_TESTS/unit/logger_test.sh
```

Certified result:

```text
Tests: 5
Passed: 5
Failed: 0
```

---

# 22. Public API Stability

The certified Logger v1.0 API is:

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
- automated test update;
- API Reference update;
- appropriate version change.

---

# 23. Definition of Done

Logger documentation is complete when:

```text
Architecture            COMPLETE
Function Specification  COMPLETE
Implementation          CERTIFIED
Syntax Validation       PASS
Automated Tests         5/5 PASS
API Review              PASS
API Reference           COMPLETE
Certification           EXISTING
```

---

# 24. Document Status

| Item | Value |
|---|---|
| Document | PHOENIX_LOGGER_FUNCTION_SPECIFICATION_v1.0 |
| Version | 1.0 |
| Status | Final |
| Module | core/logger.sh |
| Public API | 5 functions |
| Tests | 5/5 PASS |
| Certification | Existing Core Certification |
| Audit | Core Consolidation Audit |
