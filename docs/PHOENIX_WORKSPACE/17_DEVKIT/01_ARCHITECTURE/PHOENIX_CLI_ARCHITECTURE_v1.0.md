# PHOENIX CLI ARCHITECTURE

**Version:** 1.0
**Status:** FROZEN
**Date:** 2026-08-18
**Domain:** Phoenix DevKit — Command-Line Interface

---

# 1. Purpose

The Phoenix CLI provides the user-facing command interface to certified
Phoenix DevKit capabilities.

The CLI is an orchestration and presentation layer.

It exposes controlled access to lower-level Phoenix services without
duplicating their business logic.

The CLI does not own Generator semantics, Validator semantics, template
rendering, filesystem primitives, or lower-level runtime behavior.

---

# 2. Architectural Position

The CLI is a higher-level orchestration layer.

Conceptually:

```text
                         USER
                           │
                           ▼
                    PHOENIX CLI
                    /         \
                   ▼           ▼
          Generator API     Validator API
                   │           │
                   └─────┬─────┘
                         ▼
                Certified DevKit
```
The CLI consumes certified public APIs.

Lower-level Phoenix layers must never depend on the CLI.

---

# 3. Dependency Direction

Dependencies flow downward.

Allowed:

```text
CLI → Generator public API
CLI → Validator public API
CLI → certified Core/runtime services when explicitly required
```

Forbidden:

```text
Generator → CLI
Validator → CLI
Core → CLI
Template Engine → CLI
```

The CLI may directly compose a certified lower-level public API when an
existing subsystem architecture explicitly permits higher-level composition.

This does not permit access to lower-level implementation internals.

---

# 4. Public API Boundary

Phoenix uses the following namespace convention:

```text
phoenix::*       public API
_phoenix::*      internal implementation API
```

The CLI may consume approved `phoenix::*` APIs.

The CLI must not consume lower-layer `_phoenix::*` APIs.

The CLI must not manipulate Generator or Validator registry arrays directly.

---

# 5. Certified Lower-Layer Surfaces

## 5.1 Generator Framework

Relevant public Generator APIs include:

```text
phoenix::generator_register_builtins
phoenix::generator_list
phoenix::generator_run
```

Additional certified Generator public APIs remain owned by the Generator
Framework.

The CLI must not reproduce Generator planning, rendering, overwrite policy,
template resolution, artifact mapping, or filesystem mutation behavior.

## 5.2 Validation Framework

Relevant public Validator APIs include:

```text
phoenix::validator_register_builtins
phoenix::validator_list
phoenix::validator_run
```

The CLI must preserve the public Validation result distinction:

```text
VALID
INVALID
ERROR
```

`INVALID` is a domain validation outcome.

`ERROR` is a technical validation failure.

They are not interchangeable.

---

# 6. CLI Command Model

The Phase 7 CLI v1 command families are:

```text
phoenix
├── generate
├── validate
├── help
├── --help
└── --version
```

Supported grammar:

```text
phoenix
phoenix help
phoenix --help
phoenix --version

phoenix generate --help
phoenix generate --list
phoenix generate <generator-id> <destination> [KEY=VALUE ...] [--dry-run] [--overwrite]

phoenix validate --help
phoenix validate --list
phoenix validate <validator-id> <target>
```

---

# 7. Commands Outside Phase 7 v1

Historical planning documents contain candidate commands such as:

```text
phoenix init
phoenix create
phoenix release
phoenix provider
phoenix workspace
```

These references represent earlier planned direction.

They are not part of the frozen Phase 7 v1 command contract unless backed by
a certified subsystem and explicitly incorporated into a future CLI
architecture revision.

Phase 7 v1 does not implement them.

---

# 8. Command-to-Subsystem Mapping

The primary mappings are:

```text
phoenix generate
      │
      ▼
phoenix::generator_run
```

and:

```text
phoenix validate
      │
      ▼
phoenix::validator_run
```

Capability listing uses:

```text
phoenix generate --list
      │
      ▼
phoenix::generator_list
```

and:

```text
phoenix validate --list
      │
      ▼
phoenix::validator_list
```

Capability membership must come from the corresponding registry.

The CLI must not hardcode the registered Generator or Validator inventory.

---

# 9. Generator CLI Translation

CLI execution-control flags are presentation-layer syntax.

The CLI may translate:

```text
--dry-run
```

to:

```text
PHOENIX_DRY_RUN=1
```

and:

```text
--overwrite
```

to:

```text
PHOENIX_OVERWRITE=1
```

The CLI does not interpret the Generator overwrite policy.

The CLI does not determine required Generator variables.

The CLI does not perform Generator planning.

The CLI translates accepted CLI syntax and delegates semantics to the
Generator Framework.

---

# 10. Parser Boundary

The parser owns CLI grammar only.

It may validate:

```text
command recognition
argument arity
CLI option recognition
duplicate CLI flags
KEY=VALUE syntactic form
command-specific option scope
```

It must not validate:

```text
Generator existence
Validator existence
Generator required variables
Generator overwrite policy
template availability
target validity
Validator semantics
```

A syntactically valid unknown Generator or Validator identifier must be
delegated to the owning registry/subsystem.

---

# 11. Parser Security

All CLI input is untrusted.

The parser and dispatcher must not use:

```text
eval
dynamic shell command construction
arbitrary source
filesystem command discovery
user-controlled function invocation
```

User input must remain inert data.

Original shell argument boundaries must be preserved.

The CLI must operate on `"$@"`, not on reconstructed command strings.

---

# 12. Explicit Dispatch

Top-level command dispatch uses an explicit whitelist.

Conceptual internal actions include:

```text
ROOT_HELP
VERSION
GENERATE_HELP
GENERATE_LIST
GENERATE_RUN
VALIDATE_HELP
VALIDATE_LIST
VALIDATE_RUN
```

These are internal action classifications, not user-facing commands.

An action must resolve through explicit dispatch logic.

User input must never be converted directly into a callable function name.

---

# 13. Component Model

The logical CLI architecture contains these responsibilities:

```text
Entry Point
Bootstrap
Parser
Command Model
Dispatcher
Presentation
Status Mapping
```

These are logical responsibilities.

They do not require one physical file per responsibility.

---

# 14. Physical Module Architecture

The Phase 7 v1 physical architecture is:

```text
05_CLI/
├── phoenix
├── cli.sh
├── parsing.sh
├── commands.sh
└── README.md
```

Responsibilities:

```text
phoenix
    process entry and process exit

cli.sh
    CLI lifecycle
    capability-specific bootstrap
    presentation coordination
    status mapping
    CLI version metadata

parsing.sh
    pure CLI grammar and normalized request construction

commands.sh
    approved command handlers
    CLI-to-public-API translation
    public subsystem invocation
```

---

# 15. Entry Point

`05_CLI/phoenix` is the executable entry point.

It must remain thin.

Its responsibilities are limited to:

```text
resolve CLI module location
load cli.sh
forward original argv
receive canonical return status
exit with that status
```

The entry point must not contain Generator or Validator business logic.

Only the executable entry point owns process termination.

---

# 16. Public CLI API

The CLI exposes one primary public execution API:

```text
phoenix::cli_run
```

Reusable CLI functions must use `return`.

They must not terminate the caller's shell.

Internal CLI helpers use the `_phoenix::cli_*` namespace.

---

# 17. Bootstrap Architecture

Operational bootstrap occurs only after successful CLI syntax validation.

Bootstrap is capability-specific:

```text
Generator bootstrap
Validator bootstrap
```

Root help, family help, and version do not require operational subsystem
bootstrap.

Generator bootstrap uses:

```text
phoenix::generator_register_builtins
```

Validator bootstrap uses:

```text
phoenix::validator_register_builtins
```

The CLI must not discover built-ins by scanning definition directories.

---

# 18. Bootstrap Idempotency

Repeated CLI execution in the same sourced shell must not fail merely because
official built-ins were registered during an earlier successful invocation.

CLI bootstrap may maintain initialization-state flags.

Bootstrap state must be marked successful only after complete initialization.

A failed bootstrap must prevent operation dispatch.

The CLI does not invent registry rollback semantics.

---

# 19. Path Resolution

Internal DevKit module paths and user-supplied target paths have different
ownership.

Internal module paths must be resolved relative to the installed CLI/DevKit
location.

User target and destination paths remain governed by user working-directory
semantics and lower-layer contracts.

The CLI must not globally change the caller's working directory during
bootstrap.

---

# 20. Execution Lifecycle

The canonical lifecycle is:

```text
argv
 ↓
global recognition
 ↓
command parsing
 ↓
CLI contract validation
 ↓
required subsystem bootstrap
 ↓
explicit dispatch
 ↓
public DevKit API
 ↓
result classification
 ↓
presentation
 ↓
status mapping
 ↓
process exit
```

CLI-owned syntax failure occurs before operational subsystem bootstrap.

---

# 21. Side-Effect Zones

## Zone A — Pure CLI

```text
argv handling
parsing
command resolution
CLI validation
argument translation
```

No user-target mutation is permitted.

## Zone B — Subsystem Preparation

```text
module loading
explicit built-in registration
registry queries
```

No user-target mutation is permitted.

## Zone C — Operation

```text
Generator execution
Validator execution
```

Generator execution may mutate according to the Generator contract.

Validation remains read-only.

The CLI must not mutate user targets directly.

---

# 22. Generate Lifecycle

Operational generation follows:

```text
CLI syntax validation
 ↓
Generator bootstrap
 ↓
CLI option translation
 ↓
phoenix::generator_run
 ↓
Generator-owned planning
 ↓
Generator-owned rendering
 ↓
Generator-owned mutation when applicable
 ↓
public Generator result
 ↓
CLI presentation/status
```

The CLI must complete all CLI-owned validation before invoking a mutating
lower-layer operation.

---

# 23. Validate Lifecycle

Operational validation follows:

```text
CLI syntax validation
 ↓
Validator bootstrap
 ↓
phoenix::validator_run
 ↓
VALID | INVALID | ERROR
 ↓
CLI classification
 ↓
presentation
 ↓
canonical status
```

The CLI does not decide target validity.

---
# 24. Validation Result Integrity

The CLI preserves:

```text
VALID
INVALID
ERROR
```

Mapping:

```text
VALID    → success
INVALID  → validation failure
ERROR    → technical failure
```

A Validator technical failure must never be presented as target invalidity.

---

# 25. Generator Result Integrity

Known successful Generator outcomes include:

```text
DRY_RUN
SUCCESS
```

They are successful CLI executions.

`DRY_RUN` must remain visibly distinguishable from real generation success.

An unclassified Generator `return 1` must not be guessed to represent a
specific failure class.

---

# 26. Canonical Return Codes

Phoenix canonical status conventions are:

```text
0  Success
1  Generic failure
2  Invalid usage or argument
3  Missing dependency
4  Invalid configuration
5  Filesystem failure
6  Validation failure
7  Template rendering failure
```

CLI v1 mappings include:

```text
help                    → 0
version                 → 0
list                    → 0
Generator success       → 0
Generator dry-run       → 0
Validator VALID         → 0
Validator INVALID       → 6
CLI usage error         → 2
bootstrap error         → 1
technical subsystem     → 1
unexpected contract     → 1
unclassified failure    → 1
```

Codes `3`, `4`, `5`, and `7` remain reserved until an authoritative public
result allows reliable classification.

---

# 27. No-Guessing Rule

The CLI must not infer specific error semantics from:

```text
generic return code
human-readable error wording
substring matching
stderr wording
```

Specific canonical status codes may be used only when authoritative
classification exists.

An unclassified lower-layer failure maps to generic failure.

---

# 28. Stream Contract

`stdout` is used for:

```text
help
version
capability lists
successful generation results
VALID validation results
INVALID validation results
```

`stderr` is used for:

```text
CLI usage errors
bootstrap errors
technical subsystem failures
unexpected result contracts
unclassified technical failures
```

`INVALID` remains a domain result on stdout even though its canonical process
status is `6`.

---

# 29. Presentation Boundary

The subsystem determines what happened.

The CLI determines how to communicate it.

Presentation may change form but must not change meaning.

Presentation occurs after semantic classification.

Command handlers should not own final human formatting.

This separation preserves future compatibility with additional output modes.

---

# 30. Help Architecture

Supported help operations include:

```text
phoenix
phoenix help
phoenix --help
phoenix generate --help
phoenix validate --help
```

Root and family help describe CLI grammar.

Dynamic capability membership belongs to:

```text
phoenix generate --list
phoenix validate --list
```

Help must not duplicate the registered capability inventory.

---

# 31. Version Architecture

Phase 7 owns a CLI component version source.

The canonical CLI metadata is represented by:

```text
PHOENIX_CLI_VERSION
```

The CLI must not infer its version from documentation filenames.

The CLI must not claim that its component version is automatically the
version of the entire DevKit.

Version display identifies the Phoenix CLI component.

---

# 32. Source Safety

Reusable CLI modules must be safe to source.

Sourcing:

```text
cli.sh
parsing.sh
commands.sh
```

must not:

```text
execute a command
print help automatically
perform operational built-in registration
mutate user targets
call exit
```

CLI modules must use load guards consistent with the rest of the DevKit.

---

# 33. Request State

Request-specific state should remain local to the invocation.

The CLI should not persist mutable global request fields such as:

```text
current command
current Generator
current Validator
current target
current destination
```

Module-level state is acceptable only where required for stable metadata or
bootstrap initialization state.

---

# 34. Bash Compatibility

CLI v1 must remain compatible with the DevKit Bash baseline.

The architecture does not require:

```text
associative arrays
nameref
mapfile
readarray
```

Implementation should use Bash 3.2-compatible mechanisms unless the DevKit
baseline is explicitly changed by a future architectural decision.

---

# 35. Failure Precedence

The earliest layer capable of authoritatively identifying a failure owns the
failure classification.

Example:

```text
invalid CLI syntax
 ↓
CLI_USAGE_ERROR
 ↓
return 2
```

The Generator or Validator subsystem must not be bootstrapped merely to
diagnose syntax already known to be invalid.

Once CLI syntax is valid, semantic ownership passes to the relevant
subsystem.

---

# 36. Architectural Invariants

The Phase 7 CLI freezes these invariants:

1. The CLI is an orchestration and presentation layer.
2. Lower layers must not depend on CLI.
3. CLI consumes public Phoenix APIs only.
4. Lower-layer `_phoenix::*` internals are forbidden to CLI.
5. User input is untrusted.
6. CLI must not use `eval`.
7. CLI must not construct executable command strings from user input.
8. Command dispatch is explicit and whitelisted.
9. Filesystem command discovery is forbidden.
10. CLI parsing is side-effect free.
11. CLI syntax validation precedes operational bootstrap.
12. Bootstrap is capability-specific.
13. Built-in registration is explicit.
14. CLI does not duplicate Generator semantics.
15. CLI does not duplicate Validator semantics.
16. CLI does not directly mutate user targets.
17. Validator VALID, INVALID, and ERROR remain distinct.
18. Generator DRY_RUN and SUCCESS remain distinct.
19. Unclassified lower-layer failures are not guessed.
20. Only the executable entry point owns `exit`.
21. Reusable CLI modules use `return`.
22. CLI modules are source-safe.
23. Caller working directory is preserved.
24. Request state should remain invocation-local.
25. Implementation remains compatible with the DevKit Bash baseline.

---

# 37. Planned Test Domains

Implementation certification is expected to cover at least:

```text
CLI parsing
command dispatch
bootstrap behavior
Generator command integration
Validator command integration
result classification
stdout/stderr behavior
canonical return codes
source safety
entry-point behavior
security rejection paths
Bash compatibility
regression protection
```

Tests must not modify the real Phoenix Workspace.

---

# 38. Physical Implementation Boundary

The frozen candidate implementation boundary is:

```text
05_CLI/
├── phoenix
├── cli.sh
├── parsing.sh
├── commands.sh
└── README.md
```

Production implementation must not begin until both the CLI Architecture and
CLI Function Specification have passed the Phase 7 freeze audit.

---

# 39. Certification State

At this checkpoint:

```text
Existing-State Audit             COMPLETE
Architectural Boundary           COMPLETE
Command Model                    COMPLETE
Execution Lifecycle              COMPLETE
Physical Module Architecture     COMPLETE
Security Boundary                COMPLETE
Failure Boundary                 COMPLETE
Function Specification           FROZEN
CLI Implementation               NOT STARTED
```

This document is a frozen architecture candidate.

Final Phase 7 architecture certification requires cross-document consistency
with the canonical CLI Function Specification.

---

**PHOENIX CLI ARCHITECTURE v1.0 — FROZEN**