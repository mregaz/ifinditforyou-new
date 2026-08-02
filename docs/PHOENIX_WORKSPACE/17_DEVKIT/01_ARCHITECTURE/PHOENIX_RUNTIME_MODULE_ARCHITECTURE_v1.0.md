# PHOENIX RUNTIME MODULE ARCHITECTURE
## Version 1.0

**Status:** Final

---

# 1. Purpose

This document defines the architecture of the Phoenix DevKit Runtime module.

The Runtime provides the foundational execution services required by the Phoenix DevKit Core.

Implementation:

```text
core/runtime.sh
```

The Runtime is intentionally small.

Its responsibility is not to implement application logic, filesystem operations, logging, templating, or configuration parsing.

Its responsibility is to provide basic execution-environment services upon which other DevKit components may rely.

---

# 2. Architectural Role

The Runtime belongs to the foundational layer of the Phoenix DevKit Core.

Conceptually:

```text
Phoenix DevKit
      │
      ▼
Higher-Level Components
      │
      ▼
Core Services
      │
      ▼
Runtime
      │
      ▼
Shell / Operating Environment
```

The Runtime therefore acts as a minimal boundary between Phoenix DevKit code and the shell execution environment.

---

# 3. Design Principles

The Runtime follows the Phoenix DevKit Engineering Principles.

Its design emphasizes:

- simplicity;
- deterministic behavior;
- explicit failure;
- minimal abstraction;
- UNIX-compatible return codes;
- no hidden state;
- no unnecessary dependencies;
- predictable stdout/stderr behavior;
- stable public contracts.

The module must remain small and focused.

---

# 4. Responsibilities

The Runtime is responsible for:

1. identifying the Phoenix Runtime;
2. detecting command availability;
3. enforcing required command availability;
4. providing a standardized runtime failure primitive.

These responsibilities correspond to the certified public API:

```text
phoenix::runtime_info
phoenix::is_command_available
phoenix::require_command
phoenix::fail
```

---

# 5. Non-Responsibilities

The Runtime must not become a generic collection of unrelated utilities.

The following responsibilities belong elsewhere:

```text
Logging              → core/logger.sh
Filesystem           → core/filesystem.sh
String manipulation  → core/strings.sh
Manifest access      → core/manifest.sh
Template rendering   → core/template_engine.sh
```

This separation prevents the Runtime from becoming an uncontrolled `common.sh` utility module.

---

# 6. Architectural Decision — Runtime vs Common

The original generic module concept:

```text
core/common.sh
```

was rejected in favor of:

```text
core/runtime.sh
```

Reasoning:

- `runtime` communicates responsibility;
- `common` does not define a meaningful architectural boundary;
- generic common modules tend to accumulate unrelated functions;
- explicit module responsibility improves maintainability;
- the Runtime name better represents foundational execution services.

This decision is part of the established Phoenix DevKit architecture.

---

# 7. Module Structure

The Runtime follows the standard Phoenix Core module structure:

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

Sections may remain intentionally empty when the module does not require private helpers or additional constants.

Structural consistency is preferred over unnecessary implementation.

---

# 8. Load Guard

The Runtime uses:

```text
PHOENIX_RUNTIME_LOADED
```

as its load guard.

Purpose:

- prevent repeated module initialization;
- allow safe repeated sourcing;
- provide predictable module-loading behavior.

Repeated sourcing must not redefine or reinitialize Runtime state unnecessarily.

---

# 9. Dependency Model

Runtime v1.0 has no Phoenix Core module dependencies.

Conceptually:

```text
runtime.sh
    │
    └── shell environment
```

This is intentional.

The foundational Runtime should not depend on higher-level Core services.

This avoids dependency cycles and preserves a clear Core dependency hierarchy.

---

# 10. Public API

Runtime v1.0 exposes exactly four public functions:

```text
phoenix::runtime_info
phoenix::is_command_available
phoenix::require_command
phoenix::fail
```

The public namespace is:

```text
phoenix::
```

No additional public functions are required for Runtime v1.0.

---

# 11. Runtime Information

`phoenix::runtime_info` provides a stable human-readable Runtime identification string.

Current Runtime identity:

```text
Phoenix DevKit Runtime v0.1
```

The function is informational.

It must not modify system state.

---

# 12. Command Detection

`phoenix::is_command_available` determines whether a named command can be resolved by the current execution environment.

The Runtime delegates command resolution to the shell/platform rather than maintaining its own command registry.

Conceptually:

```text
Command Name
     ↓
Runtime
     ↓
Shell Command Resolution
     ↓
Available / Unavailable
```

This follows the Phoenix principle of trusting established platform primitives where appropriate.

---

# 13. Required Commands

`phoenix::require_command` provides explicit dependency enforcement.

Conceptually:

```text
Required Command
       ↓
Availability Check
       ↓
   ┌───┴────┐
   │        │
Available  Missing
   │        │
   ▼        ▼
Success   stderr
          failure
```

A missing required command is an execution failure and must be observable through a non-zero return code.

---

# 14. Runtime Failure Primitive

`phoenix::fail` provides a standardized Runtime failure mechanism.

Its responsibilities are intentionally limited:

```text
Receive Error Message
        ↓
Format Runtime Error
        ↓
Write to stderr
        ↓
Return Failure
```

It does not:

- terminate the caller automatically;
- execute recovery logic;
- log to external systems;
- mutate application state.

The caller retains control of process termination and recovery policy.

---

# 15. Output Channels

Runtime output follows explicit channel semantics.

Informational Runtime identity:

```text
stdout
```

Runtime errors:

```text
stderr
```

Predicate functions use return codes rather than textual boolean output.

This allows Runtime functions to compose naturally with shell control flow.

---

# 16. Return Code Policy

Runtime follows standard shell conventions:

```text
0     success / true
non-0 failure / false
```

Predicate-style APIs such as:

```text
phoenix::is_command_available
```

communicate their result primarily through the return code.

This makes constructs such as the following natural:

```bash
if phoenix::is_command_available git; then
    ...
fi
```

---

# 17. State Model

Runtime v1.0 is effectively stateless after module initialization.

The load guard is module-loading state, not application state.

Runtime functions must not maintain hidden mutable state between calls.

This supports:

- deterministic behavior;
- testability;
- composability;
- predictable execution.

---

# 18. Error Handling

Runtime errors should be:

- explicit;
- local;
- observable;
- non-destructive.

The Runtime returns failures to callers rather than imposing global process-control policy.

This separation allows higher-level components to decide whether a failure should:

- be propagated;
- be logged;
- trigger cleanup;
- terminate execution;
- be transformed into another error.

---

# 19. Security Model

Runtime functions operate only on explicit caller input and shell command discovery.

Runtime v1.0 must not interpret caller-provided strings as executable shell programs.

The Runtime architecture does not require:

```text
eval
bash -c
sh -c
```

for its public responsibilities.

Command availability checks resolve command names but do not execute the resolved command.

---

# 20. Side Effects

Runtime side effects are intentionally minimal.

`phoenix::runtime_info`:

```text
stdout only
```

`phoenix::is_command_available`:

```text
no intentional output
```

`phoenix::require_command`:

```text
stderr on failure
```

`phoenix::fail`:

```text
stderr on failure
```

The Runtime must not modify unrelated filesystem or application state.

---

# 21. Extension Rules

New Runtime functionality may be introduced only when it clearly belongs to the execution-environment boundary.

Before adding a public Runtime function, ask:

1. Is this truly a Runtime responsibility?
2. Does another Core module already own this concern?
3. Would adding it turn Runtime into a generic utility module?
4. Can the shell/platform already provide the required primitive?
5. Does the new behavior justify expanding the stable public API?

If responsibility is unclear, the function should not be added to Runtime.

---

# 22. Dependency Direction

The architectural dependency direction must remain:

```text
Higher-Level DevKit Components
             ↓
        Core Modules
             ↓
          Runtime
             ↓
     Shell Environment
```

Runtime must not depend upward on specialized Core modules.

This prevents circular dependencies.

---

# 23. Testing Architecture

Runtime has a dedicated unit certification suite:

```text
07_TESTS/unit/runtime_test.sh
```

The suite validates the certified Runtime behavior, including:

- Runtime information;
- command detection;
- successful required-command validation;
- missing required-command detection;
- Runtime failure behavior.

Testing must remain deterministic and must not depend on optional external services.

---

# 24. Public API Stability

The certified Runtime v1.0 API consists of:

```text
phoenix::runtime_info
phoenix::is_command_available
phoenix::require_command
phoenix::fail
```

After certification, breaking changes require:

- architectural review;
- Function Specification update;
- automated test update;
- API Reference update;
- version change where appropriate.

---

# 25. Architectural Constraints

Runtime v1.0 must remain:

```text
Small
Explicit
Dependency-light
Stateless
Predictable
Shell-native
Non-destructive
```

The Runtime must never become a dumping ground for functions that lack a clear module owner.

---

# 26. Architecture Status

```text
Module:          core/runtime.sh
Architecture:    COMPLETE
Implementation:  CERTIFIED
Public API:      4 functions
Unit Tests:      CERTIFIED
Security Model:  DEFINED
Status:          FINAL
```

---

# 27. Document Status

| Item | Value |
|---|---|
| Document | PHOENIX_RUNTIME_MODULE_ARCHITECTURE_v1.0 |
| Version | 1.0 |
| Status | Final |
| Module | core/runtime.sh |
| Public API | 4 functions |
| Certification | Existing Core Certification |
| Audit | Core Consolidation Audit |
