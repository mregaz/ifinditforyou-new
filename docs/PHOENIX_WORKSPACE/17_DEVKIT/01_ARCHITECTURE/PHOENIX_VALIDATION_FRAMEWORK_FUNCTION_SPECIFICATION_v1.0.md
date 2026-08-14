# PHOENIX VALIDATION FRAMEWORK FUNCTION SPECIFICATION v1.0

## Status

V01 FUNCTION SPECIFICATION — FROZEN FOR IMPLEMENTATION

## 1. Purpose

This specification defines the functional contracts required to implement V01 of the Phoenix Validation Framework.

It covers:

- Validator Registry behavior;
- validator definition validation;
- Validation Execution;
- internal result protocol;
- public result serialization;
- built-in registration;
- the first built-in `structure` validator;
- failure semantics;
- deterministic and read-only behavior.

The specification does not define CLI behavior or automatic Generator integration.

---

## 2. Return Code Convention

All V01 public functions follow:

```text
0 = success
1 = failure
```

No additional public return code taxonomy is introduced.

---

## 3. Validator Definition Format

A valid validator definition must contain:

```text
ID=<validator-id>
PURPOSE=<non-empty-purpose>
IMPLEMENTATION=<function-reference>
```

Example:

```text
ID=structure
PURPOSE=Validate Phoenix DevKit structural requirements
IMPLEMENTATION=phoenix::validator_structure
```

Required fields:

```text
ID
PURPOSE
IMPLEMENTATION
```

---

## 4. Validator Definition Validation

A definition is invalid when:

```text
expected validator ID is empty
definition is empty
ID is missing
ID does not match expected registration ID
PURPOSE is missing
PURPOSE is empty
IMPLEMENTATION is missing
IMPLEMENTATION is empty
```

Unknown definition fields may be ignored by the V01 Registry unless a later specification tightens the definition grammar.

The Registry must not execute `IMPLEMENTATION`.

---

## 5. Registry State

Registry state must preserve insertion order.

Bash 3.2-compatible indexed arrays are expected.

Conceptually:

```text
PHOENIX_VALIDATOR_REGISTRY_IDS
PHOENIX_VALIDATOR_REGISTRY_DEFINITIONS
```

Duplicate IDs are forbidden.

---

## 6. `phoenix::validator_exists`

Signature:

```bash
phoenix::validator_exists <validator-id>
```

### Success

Return `0` when the validator ID is registered.

### Failure

Return `1` when:

```text
validator ID is empty
validator ID is unknown
```

### Output

No public stdout output is required.

### Mutation

None.

---

## 7. `phoenix::validator_register`

Signature:

```bash
phoenix::validator_register \
  <validator-id> \
  <validator-definition>
```

### Success Preconditions

All must be true:

```text
validator ID non-empty
definition non-empty
validator ID not already registered
definition valid
definition ID matches validator ID
PURPOSE non-empty
IMPLEMENTATION non-empty
```

### Success Effect

Append validator ID and exact definition to in-memory Registry state.

### Failure

Return `1` when any precondition fails.

### Duplicate Registration

A duplicate validator ID must fail.

The original registration must remain unchanged.

### Filesystem Mutation

Forbidden.

---

## 8. `phoenix::validator_resolve`

Signature:

```bash
phoenix::validator_resolve <validator-id>
```

### Success

Return `0`.

Print the exact registered definition to stdout.

### Failure

Return `1` when:

```text
validator ID empty
validator unknown
```

### Mutation

None.

---

## 9. `phoenix::validator_list`

Signature:

```bash
phoenix::validator_list
```

### Success

Return `0`.

Print one validator ID per line in registration order.

### Empty Registry

An empty Registry may produce no output and return success.

### Mutation

None.

---

## 10. Built-in Registration

Built-in validator registration is explicit.

V01 must not scan validator directories automatically.

The first built-in is:

```text
structure
```

Built-in registration must:

1. identify `structure.definition`;
2. verify the definition file exists;
3. read it as inert data;
4. register it explicitly through `phoenix::validator_register`.

A second registration attempt must fail through duplicate registration semantics.

---

## 11. Structure Definition

The canonical V01 structure definition is:

```text
ID=structure
PURPOSE=Validate Phoenix DevKit structural requirements
IMPLEMENTATION=phoenix::validator_structure
```

---

## 12. `phoenix::validator_run`

Signature:

```bash
phoenix::validator_run \
  <validator-id> \
  <target>
```

V01 accepts exactly the explicit validator ID and target.

No options are defined.

---

## 13. Request Validation Order

`phoenix::validator_run` must validate in this order:

```text
1. argument count
2. validator ID non-empty
3. target non-empty
4. validator exists
5. validator definition resolves
6. IMPLEMENTATION field resolves
7. implementation reference is available
```

API misuse must fail before validator invocation.

---

## 14. API Misuse

The following are request-level failures:

```text
missing validator ID
missing target
unknown validator
```

Behavior:

```text
return 1
no canonical STATUS result on stdout
no validator invocation
no filesystem mutation
```

An explicit target path that does not exist is not API misuse.

That condition belongs to the `structure` validator.

---

## 15. Definition Field Extraction

Execution must deterministically extract:

```text
IMPLEMENTATION
```

from the resolved validator definition.

Missing or empty `IMPLEMENTATION` at execution time causes public `ERROR` only after a syntactically valid request has entered execution.

The implementation reference must never be passed through `eval`.

---

## 16. Implementation Availability

Before invocation, Execution must verify that the referenced implementation function is available.

Unavailable implementation produces:

```text
STATUS=ERROR
VALIDATOR=<validator-id>
TARGET=<target>
MESSAGE=Validator implementation is unavailable
```

Return:

```text
1
```

---

## 17. Implementation Invocation

The implementation must be invoked with exactly the explicit target required by V01.

Conceptually:

```bash
"$implementation" "$target"
```

No shell evaluation is permitted.

Execution must capture:

```text
implementation stdout
implementation stderr
implementation return status
```

Canonical public stdout must not be emitted before all three have been evaluated.

---

## 18. Internal Result Protocol

The implementation stdout protocol is strict.

Allowed fields:

```text
RESULT
CHECK
MESSAGE
```

No other fields are accepted.

Duplicate fields are forbidden.

---

## 19. Internal `RESULT=VALID`

Canonical internal output:

```text
RESULT=VALID
```

Rules:

```text
RESULT required
CHECK forbidden
MESSAGE forbidden
unknown fields forbidden
duplicate fields forbidden
```

The implementation must complete operationally without stderr.

---

## 20. Internal `RESULT=INVALID`

Canonical internal output:

```text
RESULT=INVALID
CHECK=<check-id>
MESSAGE=<message>
```

Rules:

```text
RESULT required
CHECK required and non-empty
MESSAGE required and non-empty
unknown fields forbidden
duplicate fields forbidden
multi-line MESSAGE forbidden
```

The implementation must complete operationally without unexpected stderr.

---

## 21. Internal `RESULT=ERROR`

Canonical internal output:

```text
RESULT=ERROR
MESSAGE=<message>
```

Rules:

```text
RESULT required
MESSAGE required and non-empty
CHECK forbidden
unknown fields forbidden
duplicate fields forbidden
multi-line MESSAGE forbidden
```

---

## 22. Unsupported Internal Result

Any unsupported result value, including:

```text
RESULT=WARNING
RESULT=SKIPPED
RESULT=UNKNOWN
```

must produce public:

```text
STATUS=ERROR
VALIDATOR=<validator-id>
TARGET=<target>
MESSAGE=Validator returned an invalid result contract
```

Return:

```text
1
```

---

## 23. Malformed Internal Protocol

The following must produce public `ERROR`:

```text
missing RESULT
duplicate RESULT
duplicate CHECK
duplicate MESSAGE
unknown field
required CHECK missing for INVALID
required MESSAGE missing for INVALID
CHECK present for VALID
MESSAGE present for VALID
CHECK present for ERROR
empty required field
malformed line
unexpected extra stdout
```

Canonical diagnostic:

```text
MESSAGE=Validator returned an invalid result contract
```

---

## 24. Implementation Operational Failure

When the implementation:

```text
returns non-zero unexpectedly
emits unexpected stderr
cannot be invoked reliably
```

Execution must not interpret the target as invalid.

Public result:

```text
STATUS=ERROR
VALIDATOR=<validator-id>
TARGET=<target>
MESSAGE=Validator execution failed
```

Return:

```text
1
```

The internal protocol does not override an operational execution failure.

---

## 25. Public `VALID` Serialization

When internal execution is valid and returns:

```text
RESULT=VALID
```

public stdout must be exactly:

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

Return:

```text
0
```

---

## 26. Public `INVALID` Serialization

When internal execution validly returns:

```text
RESULT=INVALID
CHECK=<check-id>
MESSAGE=<message>
```

public stdout must be exactly:

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

Return:

```text
1
```

---

## 27. Public `ERROR` Serialization

When validation cannot complete reliably, public stdout must be:

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

Return:

```text
1
```

---

## 28. `INVALID` and `ERROR` Separation

The following invariant is mandatory:

```text
explicit rule violation
→ INVALID
```

```text
technical or protocol failure
→ ERROR
```

Technical failure must never be serialized as `INVALID`.

Rule violation must never be serialized as `ERROR`.

---

## 29. No Partial Result

Execution must not emit public result fields incrementally.

Forbidden behavior:

```text
STATUS=VALID
VALIDATOR=structure
```

followed by discovery of an error.

Execution must validate the complete internal result first and emit public stdout only after the canonical result is fully known.

---

## 30. Read-Only Execution Contract

Neither the Validation Execution Engine nor validator implementations may mutate the validation target or filesystem.

Forbidden operations include:

```text
create
write
move
remove
chmod
normalize
repair
auto-fix
```

Registry mutation is limited to explicit in-memory registration state.

---

## 31. Determinism Contract

For identical:

```text
validator ID
target
observable target state
```

Execution must produce identical canonical output.

V01 must not inject:

```text
timestamps
random values
implicit environment variables
unstable discovery order
```

into public results.

---

## 32. Environment Isolation

V01 validation requests are completely defined by explicit function arguments and registered definitions.

The Validation Engine must not import arbitrary environment variables as hidden validation inputs.

Environment-dependent behavior requires future explicit architecture.

---

## 33. Structure Validator API

Implementation signature:

```bash
phoenix::validator_structure <target>
```

The implementation returns only the internal result protocol.

It must not produce public `STATUS`, `VALIDATOR` or `TARGET` fields.

---

## 34. Structure Check Order

The exact fail-fast order is:

```text
1. target-exists
2. target-directory
3. required-readme
4. required-foundation-directory
5. required-architecture-directory
6. required-generators-directory
7. required-tests-directory
```

The first failed check determines the internal invalid result.

---

## 35. Structure — Missing Target

If the explicit target path does not exist:

```text
RESULT=INVALID
CHECK=target-exists
MESSAGE=Validation target does not exist
```

Return operational success for a successfully computed validator verdict, subject to the Execution Engine's internal protocol contract.

---

## 36. Structure — Target Not Directory

If target exists but is not a directory:

```text
RESULT=INVALID
CHECK=target-directory
MESSAGE=Validation target is not a directory
```

---

## 37. Structure — Missing README

Required file:

```text
README.md
```

Failure:

```text
RESULT=INVALID
CHECK=required-readme
MESSAGE=Required file README.md is missing
```

---

## 38. Structure — Missing Foundation Directory

Required directory:

```text
00_FOUNDATION
```

Failure:

```text
RESULT=INVALID
CHECK=required-foundation-directory
MESSAGE=Required directory 00_FOUNDATION is missing
```

---

## 39. Structure — Missing Architecture Directory

Required directory:

```text
01_ARCHITECTURE
```

Failure:

```text
RESULT=INVALID
CHECK=required-architecture-directory
MESSAGE=Required directory 01_ARCHITECTURE is missing
```

---

## 40. Structure — Missing Generators Directory

Required directory:

```text
03_GENERATORS
```

Failure:

```text
RESULT=INVALID
CHECK=required-generators-directory
MESSAGE=Required directory 03_GENERATORS is missing
```

---

## 41. Structure — Missing Tests Directory

Required directory:

```text
07_TESTS
```

Failure:

```text
RESULT=INVALID
CHECK=required-tests-directory
MESSAGE=Required directory 07_TESTS is missing
```

---

## 42. Structure — Valid Target

If every required check succeeds:

```text
RESULT=VALID
```

No additional internal fields are permitted.

---

## 43. Structure Read-Only Contract

The structure validator may inspect:

```text
target existence
target type
required file existence
required directory existence
```

It must not create missing files or directories.

A missing invariant must produce `INVALID`, never automatic repair.

---

## 44. Built-in Structure Registration

V01 must register `structure` explicitly.

Expected built-in list:

```text
structure
```

No automatic discovery.

A repeated built-in registration attempt must fail because the validator ID is already registered.

---

## 45. Registry Required Tests

The V01 Registry suite must verify at minimum:

1. unknown validator does not exist;
2. valid validator registration succeeds;
3. registered validator exists;
4. resolve returns exact definition;
5. duplicate registration fails;
6. duplicate registration preserves original definition;
7. registration without ID fails;
8. registration without definition fails;
9. definition missing ID fails;
10. definition ID mismatch fails;
11. definition missing PURPOSE fails;
12. definition empty PURPOSE fails;
13. definition missing IMPLEMENTATION fails;
14. definition empty IMPLEMENTATION fails;
15. list preserves registration order;
16. resolve unknown fails;
17. resolve without ID fails.

---

## 46. Execution Required Tests

The V01 Execution suite must verify at minimum:

1. run without arguments fails;
2. run without target fails;
3. unknown validator fails;
4. valid implementation produces `STATUS=VALID`;
5. explicit invalid result produces `STATUS=INVALID`;
6. explicit error result produces `STATUS=ERROR`;
7. missing implementation produces `ERROR`;
8. implementation operational failure produces `ERROR`;
9. unexpected stderr produces `ERROR`;
10. malformed internal protocol produces `ERROR`;
11. unknown internal field produces `ERROR`;
12. duplicate RESULT produces `ERROR`;
13. duplicate CHECK produces `ERROR`;
14. duplicate MESSAGE produces `ERROR`;
15. VALID output order is canonical;
16. INVALID output order is canonical;
17. ERROR output order is canonical;
18. no partial public output is emitted;
19. identical request and state produce identical result;
20. implementation reference is not shell-evaluated.

---

## 47. Structure Validator Required Tests

The V01 Structure suite must verify at minimum:

1. explicit missing target path produces `target-exists`;
2. regular file target produces `target-directory`;
3. missing README produces `required-readme`;
4. missing `00_FOUNDATION` produces `required-foundation-directory`;
5. missing `01_ARCHITECTURE` produces `required-architecture-directory`;
6. missing `03_GENERATORS` produces `required-generators-directory`;
7. missing `07_TESTS` produces `required-tests-directory`;
8. valid structure produces `VALID`;
9. fail-fast order is deterministic;
10. validation performs zero target mutation;
11. repeated validation over unchanged state produces identical result.

---

## 48. Built-in Required Tests

The V01 Built-in suite must verify:

```text
structure.definition exists
built-in registration succeeds
structure exists
structure resolves to exact definition
validator list contains structure
second built-in registration fails
```

---

## 49. Implementation Guard

V01 implementation must not require changes to the certified Generator Framework.

Protected files include:

```text
03_GENERATORS/registry.sh
03_GENERATORS/planning.sh
03_GENERATORS/execution.sh
03_GENERATORS/builtins.sh
```

Protected Core files include:

```text
core/template_engine.sh
core/filesystem.sh
core/runtime.sh
```

If implementation requires changing these contracts, Architecture Review must reopen.

---

## 50. Candidate Filesystem Layout

V01 implementation is expected to create:

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

Tests:

```text
07_TESTS/test_validator_registry.sh
07_TESTS/test_validator_execution.sh
07_TESTS/test_validator_builtins.sh
07_TESTS/test_structure_validator.sh
```

---

## 51. Implementation Sequence

V01 must proceed in controlled order:

```text
1. Architecture document
2. Function Specification
3. Registry RED tests
4. Registry implementation
5. Registry GREEN
6. Execution RED tests
7. Execution implementation
8. Execution GREEN
9. Structure validator RED tests
10. Structure implementation
11. Built-in registration
12. Structure GREEN
13. Read-only and determinism hardening
14. Full DevKit regression
15. Security and code review
16. Documentation update
17. Master Record update
18. Commit
19. Push
20. clean and synchronized repository verification
```

---

## 52. Definition of Done

V01 may be certified only when:

```text
Architecture                    COMPLETE
Function Specification          COMPLETE

Validator Registry              IMPLEMENTED
Validation Execution            IMPLEMENTED
Internal Result Protocol        IMPLEMENTED
Public Serialization            IMPLEMENTED

Structure Validator             IMPLEMENTED
Built-in Registration           IMPLEMENTED

Read-Only Guarantee             PASS
Fail-Fast Behavior              PASS
Determinism                     PASS
INVALID / ERROR Separation      PASS
Malformed Protocol Handling     PASS
Security Review                 PASS
Bash 3.2 Compatibility          PASS

Generator Layer Modifications   NONE
Full DevKit Regression          PASS
Master Record                   UPDATED
Repository                      CLEAN + SYNCED
```

---

## 53. V01 Out of Scope

The following are explicitly deferred:

```text
Naming Validator
Documentation Validator
Dependency Validator
Standards Validator
Declarative Rule DSL
Collect-All Mode
Warnings
Severity Levels
Auto-Fix
CLI Integration
Generator Integration
Plugin Validators
Parallel Validation
JSON Output
Configuration Files
```

---

## 54. Final Contract

V01 is implemented around five core contracts:

```text
Explicit Validator Registration
Deterministic Validation Execution
Strict Internal Result Protocol
Canonical Public Result Serialization
Read-Only Fail-Fast Validation
```

The first implementation proof is the built-in `structure` validator.

> A validator may declare a target invalid only through an explicit, valid rule-violation result. Technical failure is never target invalidity.
