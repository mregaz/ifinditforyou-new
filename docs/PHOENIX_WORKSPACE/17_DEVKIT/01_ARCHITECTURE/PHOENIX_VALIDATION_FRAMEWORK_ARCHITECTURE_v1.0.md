# PHOENIX VALIDATION FRAMEWORK ARCHITECTURE v1.0

## Status

ARCHITECTURE FROZEN — V01

## 1. Purpose

The Phoenix Validation Framework provides deterministic, reusable, read-only validation capabilities for generic engineering rules across Phoenix DevKit.

The framework is designed to support validation domains including:

- structure;
- naming;
- documentation;
- dependencies;
- standards.

V01 establishes the Validation Framework core and proves the architecture with the first built-in validator:

```text
structure
```

The Validation Framework does not replace component-specific validation. Generation-specific validation remains owned by the Generator Layer, while generic reusable validation belongs to the Validator Layer.

---

## 2. Architectural Principle

The core principle is:

> Validate explicitly. Fail fast. Never mutate the validation target.

Validation is observation and decision, not repair.

The Validation Framework must remain deterministic, composable and independent from higher-level implementation details.

---

## 3. Architectural Context

Phoenix DevKit follows a layered architecture.

Conceptually:

```text
Applications
      │
      ▼
CLI Engine
      │
      ▼
Generator Engine
      │
      ▼
Validator Engine
      │
      ▼
Template Engine
      │
      ▼
Core Runtime
```

The Validator Layer remains separate but composable.

Higher-level layers may invoke validators.

Validators must not depend on:

- Generator internals;
- CLI internals;
- Documentation Engine internals;
- Release Engine internals.

Dependency direction is one-way.

Conceptually:

```text
Generator ─────┐
               │
CLI ───────────┼──► Validation Engine ───► Core Services
               │
Future Layers ─┘
```

The reverse dependency is forbidden.

---

## 4. Validation Ownership Boundary

Validation ownership is divided as follows.

### 4.1 Component-Specific Validation

Component-specific validation remains local to the component that owns the contract.

Examples:

```text
missing SPRINT_ID
invalid Generator request option
destination conflict
invalid Generator artifact mapping
```

These remain Generator Layer responsibilities.

### 4.2 Generic Reusable Validation

Generic reusable validation belongs to the Validator Layer.

Examples:

```text
required project structure
Phoenix naming conventions
documentation presence
required engineering dependencies
Phoenix standards compliance
```

The architecture must avoid embedding reusable validation rules independently into multiple higher-level components.

---

## 5. V01 Core Model

V01 uses:

> Registered, code-backed, read-only validators with deterministic fail-fast execution.

The core logical components are:

```text
Validation Framework
│
├── Validator Registry
├── Validation Execution Engine
├── Internal Result Protocol
├── Public Result Serialization
├── Built-in Validator Registration
└── Validator Implementations
```

V01 does not introduce a declarative rule DSL.

---

## 6. Validator Registry

The Validator Registry is a deterministic identity-to-definition map.

Its responsibilities are limited to:

```text
register
exists
resolve
list
```

The Registry must not:

- execute validators;
- inspect targets;
- read validation targets;
- mutate the filesystem;
- format CLI output;
- repair targets;
- depend on Generator internals.

Registry state may change only through explicit in-memory registration.

---

## 7. Validator Definition

A V01 validator definition contains exactly the architectural minimum required to identify and execute a validator.

Required fields:

```text
ID
PURPOSE
IMPLEMENTATION
```

Example:

```text
ID=structure
PURPOSE=Validate Phoenix DevKit structural requirements
IMPLEMENTATION=phoenix::validator_structure
```

### 7.1 ID

The validator ID must:

- be explicit;
- be non-empty;
- be unique in the registry;
- match the ID used during registration.

Aliases are out of scope in V01.

### 7.2 PURPOSE

`PURPOSE` must be non-empty and describe the validator capability.

### 7.3 IMPLEMENTATION

`IMPLEMENTATION` identifies the code-backed validator function.

The Registry stores the implementation reference as data.

The Registry must not execute it.

The implementation reference must never be shell-evaluated.

---

## 8. Registration Model

Registration is explicit.

V01 does not perform filesystem scanning or automatic validator discovery.

Duplicate registration fails.

Registration order is preserved deterministically.

Conceptually:

```text
structure
naming
documentation
dependencies
standards
```

V01 initially registers only:

```text
structure
```

Additional validators belong to later implementation tranches.

---

## 9. Bash Compatibility

The Validation Framework must remain compatible with Bash 3.2.

Registry state should therefore use indexed arrays rather than associative arrays.

Conceptually:

```text
PHOENIX_VALIDATOR_REGISTRY_IDS
PHOENIX_VALIDATOR_REGISTRY_DEFINITIONS
```

No Bash feature requiring a newer runtime may be introduced without architectural review.

---

## 10. Validation Execution

The Validation Execution Engine owns validator invocation and public result normalization.

Conceptually:

```text
Request
  │
  ▼
Validate Request
  │
  ▼
Resolve Validator
  │
  ▼
Resolve Implementation
  │
  ▼
Invoke Validator
  │
  ▼
Capture Internal Result
  │
  ▼
Validate Internal Protocol
  │
  ▼
Normalize Public Result
  │
  ▼
Serialize Canonically
```

No canonical public result may be emitted before internal execution and result validation are complete.

---

## 11. Validation Request

The V01 canonical execution request is:

```text
validator ID
target
```

Conceptually:

```bash
phoenix::validator_run <validator-id> <target>
```

The target is explicit and caller-supplied.

The Validation Engine treats the target as an opaque validation subject.

Target-specific semantics belong to the selected validator.

No implicit environment input is part of the V01 request.

---

## 12. Request Failure Boundary

The following are API request failures:

```text
missing validator ID
missing target
unknown validator
```

These failures return shell failure and do not emit a canonical validation result.

An explicit target that does not exist is not API misuse.

For the `structure` validator, target existence is itself a validation rule and therefore produces `INVALID`.

---

## 13. Read-Only Contract

The Validation Framework is read-only with respect to:

- validation targets;
- filesystem contents;
- project artifacts.

Validation may inspect:

- files;
- directories;
- permissions or metadata where a validator requires them;
- dependency state where a future validator requires it.

Validation must not:

```text
mkdir
touch
write
move
remove
chmod
normalize
repair
auto-fix
```

The Registry may mutate only its explicit in-memory registry state.

Validator implementations are subject to the same read-only target contract.

---

## 14. Fail-Fast Policy

V01 validation is fail-fast.

A validator stops at the first deterministic rule violation according to its frozen check order.

V01 does not implement collect-all validation.

This policy supports:

- deterministic diagnostics;
- early failure;
- simpler automation;
- predictable tests.

---

## 15. Validation States

V01 defines three canonical validation states:

```text
VALID
INVALID
ERROR
```

### 15.1 VALID

`VALID` means:

- the validation request was valid;
- the validator completed successfully;
- all required checks passed.

### 15.2 INVALID

`INVALID` means:

- the validator completed successfully;
- a specific validation rule was violated;
- the violation is explicit and deterministic.

### 15.3 ERROR

`ERROR` means:

- validation could not be completed reliably;
- no trustworthy validity decision can be made.

Technical failure must never be reported as `INVALID`.

Rule violation must never be reported as `ERROR`.

---

## 16. Internal Result Protocol

Validator implementations do not own public serialization.

They communicate with the Validation Execution Engine through a strict internal protocol.

### 16.1 Valid

```text
RESULT=VALID
```

### 16.2 Invalid

```text
RESULT=INVALID
CHECK=<stable-check-id>
MESSAGE=<single-line-message>
```

### 16.3 Error

```text
RESULT=ERROR
MESSAGE=<single-line-message>
```

Unknown fields are invalid in V01.

Duplicate fields are invalid.

Multi-line diagnostic values are invalid.

Malformed protocol produces public `ERROR`.

---

## 17. Implementation Output Boundary

Validator implementations must not emit arbitrary public stdout.

Implementation stdout is reserved for the internal result protocol.

Unexpected output contaminates the protocol and must be treated as an execution error.

Unexpected stderr also causes validation execution to become `ERROR`.

Higher-level public serialization remains owned exclusively by the Validation Execution Engine.

---

## 18. Public Result Serialization

Successful validation execution uses deterministic line-oriented `KEY=VALUE` output.

### 18.1 VALID

```text
STATUS=VALID
VALIDATOR=<validator-id>
TARGET=<target>
```

Canonical order:

```text
STATUS
VALIDATOR
TARGET
```

### 18.2 INVALID

```text
STATUS=INVALID
VALIDATOR=<validator-id>
TARGET=<target>
CHECK=<check-id>
MESSAGE=<message>
```

Canonical order:

```text
STATUS
VALIDATOR
TARGET
CHECK
MESSAGE
```

### 18.3 ERROR

```text
STATUS=ERROR
VALIDATOR=<validator-id>
TARGET=<target>
MESSAGE=<message>
```

Canonical order:

```text
STATUS
VALIDATOR
TARGET
MESSAGE
```

Partial public serialization is forbidden.

---

## 19. Shell Return Policy

V01 uses the standard Phoenix return convention:

```text
0 = success
1 = failure
```

Mapping:

```text
VALID      → 0
INVALID    → 1
ERROR      → 1
API misuse → 1
```

No additional public exit-code taxonomy is introduced in V01.

The semantic distinction between `INVALID` and `ERROR` is carried by `STATUS`.

---

## 20. Implementation Reference Security

Validator implementation references are data.

Execution must validate that the referenced implementation is available before invocation.

The implementation reference must never be executed through shell evaluation.

Forbidden:

```bash
eval "$implementation ..."
```

The implementation must be invoked as a validated function reference.

Target, check IDs and diagnostic messages must remain data.

---

## 21. Determinism

Given the same:

```text
validator ID
target
observable validation state
```

V01 must produce the same validation result.

No validator may introduce nondeterministic ordering for required checks.

No timestamps, random values or hidden environment state may alter canonical results unless explicitly introduced by a future contract.

---

## 22. First Built-in Validator — structure

V01 proves the framework using:

```text
ID=structure
PURPOSE=Validate Phoenix DevKit structural requirements
IMPLEMENTATION=phoenix::validator_structure
```

The `structure` validator target is an explicit Phoenix DevKit root path.

It is not automatically discovered from the current working directory or user home.

---

## 23. Structure Validator Check Order

The canonical fail-fast order is:

```text
1. target-exists
2. target-directory
3. required-readme
4. required-foundation-directory
5. required-architecture-directory
6. required-generators-directory
7. required-tests-directory
```

This order is part of the validator contract.

---

## 24. Structure Validator Checks

### 24.1 Target Exists

Failure:

```text
RESULT=INVALID
CHECK=target-exists
MESSAGE=Validation target does not exist
```

### 24.2 Target Is Directory

Failure:

```text
RESULT=INVALID
CHECK=target-directory
MESSAGE=Validation target is not a directory
```

### 24.3 README

Required:

```text
README.md
```

Failure:

```text
RESULT=INVALID
CHECK=required-readme
MESSAGE=Required file README.md is missing
```

### 24.4 Foundation Directory

Required:

```text
00_FOUNDATION
```

Failure:

```text
RESULT=INVALID
CHECK=required-foundation-directory
MESSAGE=Required directory 00_FOUNDATION is missing
```

### 24.5 Architecture Directory

Required:

```text
01_ARCHITECTURE
```

Failure:

```text
RESULT=INVALID
CHECK=required-architecture-directory
MESSAGE=Required directory 01_ARCHITECTURE is missing
```

### 24.6 Generators Directory

Required:

```text
03_GENERATORS
```

Failure:

```text
RESULT=INVALID
CHECK=required-generators-directory
MESSAGE=Required directory 03_GENERATORS is missing
```

### 24.7 Tests Directory

Required:

```text
07_TESTS
```

Failure:

```text
RESULT=INVALID
CHECK=required-tests-directory
MESSAGE=Required directory 07_TESTS is missing
```

### 24.8 Valid Structure

When all checks pass:

```text
RESULT=VALID
```

---

## 25. Structure Validator Non-Responsibilities

V01 `structure` does not validate:

- filename conventions;
- document contents;
- Master Record consistency;
- dependencies;
- Git state;
- permissions policy;
- test outcomes;
- naming standards;
- documentation quality;
- directory emptiness;
- file counts.

These concerns belong to later validators or later phases.

---

## 26. Error Semantics

The following produce `ERROR`, not `INVALID`:

```text
implementation unavailable
implementation execution failure
unexpected stderr
malformed internal protocol
unsupported RESULT value
unknown internal result field
duplicate protocol field
required diagnostic missing
target cannot be inspected reliably
```

An implementation technical failure must never become a target invalidity verdict.

---

## 27. Framework Composition

The Validation Framework must be usable independently.

It must not require loading:

- CLI Engine;
- Generator Engine;
- Documentation Engine;
- Release Engine.

Higher layers may explicitly compose validation.

Examples:

```text
CLI → Validation Engine
Generator → Validation Engine
```

V01 does not yet modify Generator execution to invoke validators automatically.

---

## 28. V01 Filesystem Direction

The concrete implementation is expected to use the following domain:

```text
04_VALIDATORS/
├── registry.sh
├── execution.sh
├── builtins.sh
├── definitions/
│   └── structure.definition
└── implementations/
    └── structure.sh
```

This structure separates validation from the already certified Generator Framework.

---

## 29. Scope

V01 includes:

```text
Validator Registry
Validation Execution Engine
Internal Result Protocol
Public Result Serialization
Built-in Validator Registration
Structure Validator
Certification Tests
```

V01 excludes:

```text
Naming Validator
Documentation Validator
Dependency Validator
Standards Validator
Declarative Rule DSL
Collect-all mode
Warnings and severity levels
Auto-fix
CLI integration
Generator integration
Plugin validators
Parallel validation
JSON output
Validation configuration files
```

---

## 30. Architectural Invariants

V01 freezes the following invariants:

1. Validators are explicitly registered.
2. Validator IDs are unique.
3. Registry order is deterministic.
4. Registry does not execute validators.
5. Validation requests contain explicit validator ID and target.
6. Unknown validators fail before execution.
7. Validator implementations are code-backed.
8. Implementation references are never shell-evaluated.
9. Validation is read-only with respect to target and filesystem.
10. Validation is fail-fast.
11. Implementations do not own public serialization.
12. Internal protocol is strict.
13. Technical failure never becomes `INVALID`.
14. Rule violation never becomes `ERROR`.
15. `VALID` is emitted only after complete result validation.
16. Public output ordering is deterministic.
17. No failed operation emits partial `VALID` output.
18. Higher layers may depend on Validation; Validation does not depend on higher-layer internals.
19. Generator Layer behavior remains unchanged in V01.
20. Bash 3.2 compatibility is preserved.

---

## 31. Architecture Freeze

The V01 architecture is frozen around:

```text
Registered Validators
Code-Backed Implementations
Read-Only Execution
Fail-Fast Policy
VALID / INVALID / ERROR
Strict Internal Protocol
Deterministic Public Serialization
Structure Validator
```

The following changes require Architecture Review reopening:

- declarative validation DSL;
- severity levels;
- collect-all behavior;
- auto-fix;
- validator-specific dispatch inside the engine;
- shell-evaluated implementation references;
- automatic discovery;
- Generator execution integration;
- CLI contract changes;
- mutation of validation targets.

---

## 32. Certification Direction

V01 may proceed to implementation only through:

```text
Architecture
→ Function Specification
→ Registry RED tests
→ Registry implementation
→ Execution RED tests
→ Execution implementation
→ Structure RED tests
→ Structure implementation
→ Built-in registration
→ Read-only and determinism hardening
→ Full regression
→ Security review
→ Documentation
→ Master Record
→ Commit / Push / Clean
```

---

## 33. Final Statement

The Phoenix Validation Framework v1.0 establishes validation as a first-class architectural layer while preserving strict separation of concerns.

> Validators validate. Generators generate. Higher layers compose explicitly.

V01 remains deliberately small, deterministic and read-only.
