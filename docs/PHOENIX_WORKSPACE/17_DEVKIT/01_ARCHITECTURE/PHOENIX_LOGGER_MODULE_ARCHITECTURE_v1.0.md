# PHOENIX LOGGER MODULE ARCHITECTURE
## Version 1.0

**Status:** Final

---

# 1. Purpose

This document defines the architecture of the Phoenix DevKit Logger module.

Implementation:

```text
core/logger.sh
```

The Logger provides a minimal and predictable logging abstraction for Phoenix DevKit components.

Its responsibility is to provide standardized log levels, formatting, and output-channel behavior without introducing external logging infrastructure or hidden state.

---

# 2. Architectural Role

The Logger belongs to the Phoenix DevKit Core service layer.

Conceptually:

```text
Phoenix DevKit Components
          │
          ▼
        Logger
          │
     ┌────┴────┐
     ▼         ▼
   stdout    stderr
```

The Logger provides a common communication contract between DevKit components and terminal output.

---

# 3. Design Principles

Logger v1.0 follows these principles:

- simple public API;
- deterministic formatting;
- explicit log levels;
- predictable output channels;
- no external dependencies;
- no hidden mutable state;
- no automatic persistence;
- no unsolicited side effects;
- shell-native behavior.

The Logger intentionally remains small.

---

# 4. Responsibilities

The Logger is responsible for five logging categories:

```text
INFO
OK
WARN
ERROR
DEBUG
```

These correspond to the certified public API:

```text
phoenix::log_info
phoenix::log_ok
phoenix::log_warn
phoenix::log_error
phoenix::log_debug
```

---

# 5. Non-Responsibilities

Logger v1.0 does not provide:

- log-file persistence;
- log rotation;
- remote logging;
- telemetry;
- metrics;
- tracing;
- structured JSON transport;
- timestamps;
- automatic exception handling;
- process termination;
- application recovery.

Those concerns require separate architectural decisions if introduced later.

---

# 6. Module Structure

The Logger follows the standard Phoenix Core module organization:

```text
Header
  ↓
Load Guard
  ↓
Readonly Constants
  ↓
Private Functions
  ↓
Public API
```

The public API delegates common formatting behavior to a private logging primitive.

This avoids duplication while keeping the public contract explicit.

---

# 7. Load Guard

The Logger uses a module load guard to prevent unnecessary repeated initialization.

The load guard ensures that repeated sourcing does not repeatedly redefine module-level state.

The Logger must remain safe to load alongside other Phoenix Core modules.

---

# 8. Log Levels

Logger v1.0 defines five semantic levels:

```text
INFO
OK
WARN
ERROR
DEBUG
```

Each level communicates intent rather than application control flow.

The Logger reports information.

It does not decide how the caller must react.

---

# 9. Output Model

Logger output is divided between standard output and standard error.

The certified channel model is:

```text
INFO   → stdout
OK     → stdout
WARN   → stderr
ERROR  → stderr
DEBUG  → stdout
```

This separation allows shell callers to distinguish normal diagnostic information from warning/error conditions.

---

# 10. Message Format

Logger messages follow a stable level-prefix format.

Conceptually:

```text
[LEVEL] message
```

Examples:

```text
[INFO] Starting operation
[OK] Operation completed
[WARN] Optional dependency missing
[ERROR] Operation failed
[DEBUG] Internal diagnostic information
```

Formatting is deterministic.

---

# 11. Public API

Logger v1.0 exposes exactly five public functions:

```text
phoenix::log_info
phoenix::log_ok
phoenix::log_warn
phoenix::log_error
phoenix::log_debug
```

No additional public Logger functions are part of version 1.0.

---

# 12. Private API

Shared internal logging behavior is implemented under the private Phoenix namespace:

```text
_phoenix::
```

Private helpers are implementation details.

They are not part of the stable public API and must not be called directly by external DevKit components.

---

# 13. phoenix::log_info

Architectural role:

```text
general informational message
```

Output channel:

```text
stdout
```

Expected prefix:

```text
[INFO]
```

This function must not imply success or failure by itself.

---

# 14. phoenix::log_ok

Architectural role:

```text
successful operation or positive completion state
```

Output channel:

```text
stdout
```

Expected prefix:

```text
[OK]
```

The function reports success information but does not alter caller control flow.

---

# 15. phoenix::log_warn

Architectural role:

```text
non-fatal warning condition
```

Output channel:

```text
stderr
```

Expected prefix:

```text
[WARN]
```

Warnings communicate a condition requiring attention without automatically terminating execution.

---

# 16. phoenix::log_error

Architectural role:

```text
error information
```

Output channel:

```text
stderr
```

Expected prefix:

```text
[ERROR]
```

Logging an error does not itself define process termination policy.

The caller decides whether execution continues.

---

# 17. phoenix::log_debug

Architectural role:

```text
diagnostic or development information
```

Output channel:

```text
stdout
```

Expected prefix:

```text
[DEBUG]
```

Logger v1.0 does not define automatic debug filtering or environment-controlled enablement unless explicitly implemented and specified in a future version.

---

# 18. Separation of Logging and Failure

Logging and Runtime failure are separate concerns.

Conceptually:

```text
Logger
  │
  └── communicates information

Runtime
  │
  └── communicates execution failure
```

For example:

```text
phoenix::log_error
```

must not become an implicit alias for:

```text
phoenix::fail
```

This separation keeps logging independent from process-control policy.

---

# 19. Return Code Philosophy

Logger functions exist primarily for message emission.

Logging success should follow normal shell success semantics.

The presence of an:

```text
[ERROR]
```

message does not automatically mean that the logging function itself failed.

The semantic error belongs to the message; execution policy belongs to the caller.

---

# 20. State Model

Logger v1.0 is stateless after module initialization.

It must not maintain:

- message history;
- counters;
- global logging sessions;
- hidden buffers;
- implicit destinations.

Each call operates independently.

---

# 21. Dependency Model

Logger v1.0 should remain dependency-light.

Its fundamental responsibilities require only shell output primitives.

Conceptually:

```text
logger.sh
    │
    └── stdout / stderr
```

The Logger should not depend on specialized higher-level Phoenix modules.

This helps preserve a clear Core dependency hierarchy.

---

# 22. Side Effects

Logger side effects are restricted to documented output.

Permitted:

```text
stdout
stderr
```

Not permitted implicitly:

```text
filesystem writes
network access
environment mutation
process termination
external command execution
```

---

# 23. Security Model

Logger messages are data.

Logger v1.0 must not evaluate message content as shell code.

Logging does not require:

```text
eval
bash -c
sh -c
```

Caller-provided message content must remain inert.

---

# 24. Determinism

Given the same:

```text
log level
message
```

the Logger should produce the same formatted output.

Logger v1.0 intentionally excludes dynamic metadata such as timestamps from the core contract.

This keeps unit testing straightforward and output predictable.

---

# 25. Testing Architecture

Logger has a dedicated unit test suite:

```text
07_TESTS/unit/logger_test.sh
```

Current certified result:

```text
Tests: 5
Passed: 5
Failed: 0
```

The suite validates:

- INFO formatting and destination;
- OK formatting and destination;
- WARN formatting and stderr destination;
- ERROR formatting and stderr destination;
- DEBUG formatting and destination.

---

# 26. Extension Rules

Before extending Logger, determine whether the proposed behavior belongs to the logging responsibility.

Potential future capabilities such as:

```text
timestamps
JSON logs
log files
verbosity filtering
log levels configuration
remote sinks
```

must not be added casually.

They require explicit architecture and specification updates.

---

# 27. Public API Stability

The certified Logger v1.0 public API consists of:

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
- version change where appropriate.

---

# 28. Architectural Constraints

Logger v1.0 must remain:

```text
Simple
Stateless
Deterministic
Dependency-light
Shell-native
Non-executing
Non-persistent
```

Logging must remain separate from application control flow.

---

# 29. Architecture Status

```text
Module:          core/logger.sh
Architecture:    COMPLETE
Implementation:  CERTIFIED
Public API:      5 functions
Automated Tests: 5/5 PASS
Security Model:  DEFINED
Status:          FINAL
```

---

# 30. Document Status

| Item | Value |
|---|---|
| Document | PHOENIX_LOGGER_MODULE_ARCHITECTURE_v1.0 |
| Version | 1.0 |
| Status | Final |
| Module | core/logger.sh |
| Public API | 5 functions |
| Tests | 5/5 PASS |
| Certification | Existing Core Certification |
| Audit | Core Consolidation Audit |
