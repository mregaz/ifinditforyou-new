# PHOENIX AUTOMATION WORKFLOW MODEL v1.0

STATUS: FORMALLY DESIGN FROZEN — NOT CERTIFIED

Implementation is NOT AUTHORIZED by this document.

Certification is NOT established by this document.

Phase 10 is NOT COMPLETE.

---

# 1. Purpose

This document defines the Phase 10 A03 Workflow Model for Phoenix Automation.

It defines the canonical v1.0 model for:

- workflow grammar;
- workflow identity;
- workflow representation;
- step representation;
- deterministic workflow sequencing;
- workflow execution state;
- workflow state transitions;
- workflow-level result aggregation;
- workflow-specific metadata;
- workflow-specific mutation authorization representation.

This document does not implement Automation.

It does not certify Automation.

It does not create certification authority, PDS process authority, release
authority, deployment authority, or cross-domain transaction authority.

The A03 Workflow Model is subordinate to the formally design-frozen A01
Automation Architecture and A02 Automation Function Specification.

Where A03 coordinates an invoked Phoenix domain, semantic authority remains
with that domain.

---

# 2. Authoritative Context

A03 inherits the following frozen Automation boundaries:

```text
A01 — Automation Architecture
A02 — Automation Function Specification
```

A01 establishes the architectural authority, security, sequencing, failure,
partial-state, and integration boundaries.

A02 establishes:

```text
phoenix::automation_run [arguments...]
```

as the sole reusable public Automation execution entry point in v1.0.

A02 intentionally delegates to A03:

- workflow grammar;
- workflow identity;
- workflow representation;
- workflow sequencing;
- workflow state transitions;
- workflow-level result aggregation.

A03 defines those deferred semantics without expanding the public Automation
API.

---

# 3. Core Principle

Phoenix Automation workflows are:

```text
explicit
bounded
declarative
deterministic
auditable
fail-closed
authority-preserving
```

A workflow describes orchestration.

A workflow is not executable shell code.

Workflow data must remain inert until validated.

Workflow data must never directly determine executable function names,
arbitrary shell commands, private integration surfaces, or hidden execution
paths.

The fundamental model is:

```text
DECLARED WORKFLOW
        |
        v
VALIDATE
        |
        v
AUTHORIZED EXPLICIT MAPPINGS
        |
        v
DETERMINISTIC STEP SEQUENCE
        |
        v
AUTHORITATIVE DOMAIN RESULTS
```

---

# 4. Non-Authority Boundary

Automation orchestrates authority.

Automation does not become authority.

A workflow declaration does not itself create:

- capability authority;
- mutation authority;
- certification authority;
- approval authority;
- PDS gate authority;
- release authority;
- deployment authority;
- rollback authority;
- compensation authority;
- transactionality;
- atomicity.

Technical callability is not architectural authorization.

Architectural authorization is not mutation authorization.

Workflow state is not semantic authority.

---

# 5. Public API Boundary

A03 introduces no new public Automation function.

The v1.0 public Automation execution surface remains exactly:

```text
phoenix::automation_run
```

A03 does not define:

```text
phoenix::automation_exists
phoenix::automation_register
phoenix::automation_resolve
phoenix::automation_list
```

A03 does not introduce a public Workflow Registry.

Any future public Automation API expansion requires explicit contract revision
and design review.

Private Automation implementation helpers, if later authorized, must use the
existing private namespace:

```text
_phoenix::automation_*
```

A03 does not authorize direct use of foreign private helpers.

---

# 6. Workflow Request Carrier

The A02 public signature remains:

```text
phoenix::automation_run [arguments...]
```

The shell argument vector is the transport carrier for the workflow request.

A03 assigns workflow semantics to validated arguments without weakening A02
argument-preservation requirements.

Shell argument boundaries must be preserved.

Automation must not reconstruct request arguments into executable shell text.

The request must not depend implicitly on:

- arbitrary environment variables;
- mutable hidden globals;
- caller working directory;
- filesystem capability discovery;
- dynamically sourced definitions;
- reconstructed command strings.

---

# 7. Workflow Representation

Phoenix Automation Workflow v1.0 uses a deliberately restricted declarative
representation.

The conceptual canonical form is line-oriented and `KEY=VALUE` compatible.

The representation is designed to remain:

- deterministic;
- machine-readable;
- portable;
- auditable;
- Bash 3.2 compatible;
- non-executable.

The workflow representation is not a general-purpose DSL.

It is not a shell scripting language.

---

# 8. Canonical Workflow Grammar

The conceptual v1.0 grammar is:

```text
WORKFLOW_ID=<canonical-workflow-id>
WORKFLOW_VERSION=1

STEP=<canonical-step-id>
TARGET_DOMAIN=<domain-id>
TARGET_CAPABILITY=<logical-public-capability-id>
MUTATION_MODE=<READ_ONLY|MUTATING>
AUTHORITY_REFERENCE=<NONE|explicit-authority-reference>
ARGUMENT=<key=value>
ARGUMENT=<key=value>

STEP=<canonical-step-id>
TARGET_DOMAIN=<domain-id>
TARGET_CAPABILITY=<logical-public-capability-id>
MUTATION_MODE=<READ_ONLY|MUTATING>
AUTHORITY_REFERENCE=<NONE|explicit-authority-reference>
ARGUMENT=<key=value>
```

`ARGUMENT=` may occur zero or more times for a step.

Repeated `ARGUMENT=` declaration order is preserved.

A new `STEP=` begins the next step declaration.

Unknown workflow fields are rejected in v1.0.

Unknown fields must not be silently ignored.

---

# 9. Canonical Field Order

The canonical workflow-level order is:

```text
WORKFLOW_ID
WORKFLOW_VERSION
```

Each step then uses:

```text
STEP
TARGET_DOMAIN
TARGET_CAPABILITY
MUTATION_MODE
AUTHORITY_REFERENCE
ARGUMENT*
```

Step declaration order is significant.

Argument declaration order within a step is significant.

Equivalent canonical workflow requests evaluated against equivalent authorized
domain state must produce equivalent capability selection and sequencing,
subject to authoritative lower-domain results.

---

# 10. Workflow Identity

Every valid workflow has one explicit canonical identity:

```text
WORKFLOW_ID=<canonical-workflow-id>
```

The v1.0 workflow identifier uses lowercase kebab-case.

Example:

```text
WORKFLOW_ID=validate-generator-artifact
```

Workflow identity must be:

- explicit;
- non-empty;
- syntactically valid;
- stable for the declared workflow definition.

Workflow identity must not be silently derived from:

- filenames;
- directory names;
- filesystem order;
- display names;
- current working directory;
- incidental registration order.

A missing or malformed required workflow identity makes the Automation request
invalid.

---

# 11. Workflow Version

Every valid v1.0 workflow declares:

```text
WORKFLOW_VERSION=1
```

Workflow version identifies the declared workflow representation version.

It does not redefine:

- Automation API version;
- invoked-domain API version;
- Phoenix release version;
- certification state.

Unsupported workflow representation versions must fail closed before domain
dispatch.

---

# 12. Step Identity

Each declared step begins with:

```text
STEP=<canonical-step-id>
```

Step identity must be:

- explicit;
- non-empty;
- unique within the workflow;
- stable within that workflow definition.

Step identity must not depend on its numeric position.

Example:

```text
STEP=validate-request
STEP=generate-artifact
STEP=validate-result
```

Duplicate step identifiers are invalid.

A malformed step declaration must fail before unauthorized dispatch.

---

# 13. Step Model

A workflow step represents one orchestrated invocation of an explicitly mapped
authorized public Phoenix capability.

The conceptual step model is:

```text
STEP_ID
TARGET_DOMAIN
TARGET_CAPABILITY
ARGUMENTS
MUTATION_MODE
AUTHORITY_REFERENCE
```

A step does not duplicate or replace the internal execution sequence owned by
the invoked domain.

If an invoked domain requires:

```text
plan
validate
precondition
execute
result validation
```

or another contract-defined sequence, Automation must preserve that sequence.

A03 must not decompose or bypass mandatory lower-domain sequencing through
private helper calls or alternative execution paths.

---

# 14. Target Domain

Each step declares:

```text
TARGET_DOMAIN=<domain-id>
```

The target domain identifies the Phoenix domain that owns the requested
capability.

Domain identity is descriptive integration data.

It is not an executable function name.

Domain identity does not by itself establish:

- public visibility;
- Automation integration eligibility;
- mutation permission;
- certification state.

---

# 15. Target Capability

Each step declares:

```text
TARGET_CAPABILITY=<logical-public-capability-id>
```

This value is a logical capability identity.

It is not executable code.

Automation must resolve the logical capability through an explicit bounded
mapping to an eligible public Phoenix capability.

Conceptually:

```text
validated workflow capability identity
        |
        v
explicit bounded Automation mapping
        |
        v
authorized public Phoenix capability
```

The following model is forbidden:

```text
workflow data
        |
        v
dynamic function-name construction
        |
        v
execution
```

Automation must not use:

- `eval`;
- data-derived `bash -c`;
- data-derived `sh -c`;
- dynamically constructed executable function names;
- filesystem-derived executable discovery;
- foreign private helpers.

---

# 16. Arguments

A step may declare zero or more:

```text
ARGUMENT=<key=value>
```

entries.

Arguments are inert data until validated.

Argument declaration order is preserved.

Automation may validate argument structure required by the Automation contract,
but semantic ownership of invoked-domain arguments remains with the invoked
domain.

Automation must not silently reinterpret domain argument semantics.

Arguments must not become executable shell text.

---

# 17. Mutation Mode

Each step explicitly declares:

```text
MUTATION_MODE=READ_ONLY
```

or:

```text
MUTATION_MODE=MUTATING
```

Mutation mode is an Automation orchestration declaration.

It does not override the owning-domain mutation contract.

A read-only declaration must not authorize mutation.

A mutating declaration does not itself grant mutation authority.

---

# 18. Authority Reference

Each step declares:

```text
AUTHORITY_REFERENCE=<value>
```

For a read-only step, the canonical no-mutation value is:

```text
AUTHORITY_REFERENCE=NONE
```

For a mutation-capable step, the workflow must provide an explicit authority
reference sufficient for the applicable authorization mechanism defined by
the authoritative Automation and owning-domain contracts.

An authority reference is evidence or input to authorization verification.

It is not authority merely because it appears in workflow data.

The following rule is fundamental:

```text
Owning-domain mutation contract
!=
workflow-specific mutation authorization
```

Both are required for mutation dispatch.

---

# 19. Mutation Authorization Gate

Before dispatching any mutation-capable step, Automation must establish all of
the following:

1. the requested logical capability has an explicit bounded mapping;
2. the mapped target is a public Phoenix capability;
3. the capability is certified or explicitly authorized for Automation use;
4. the owning-domain contract permits and bounds the requested mutation;
5. the specific workflow or request has explicit authority for the intended
   target and effects;
6. required owning-domain preconditions and safeguards are satisfied.

Failure of a required mutation authorization condition is an
`ORCHESTRATION_FAILURE`.

No mutation-capable domain function may be dispatched before required mutation
authority has been verified.

Workflow-specific authorization must not broaden, weaken, override, or
reinterpret the owning-domain contract.

---

# 20. Workflow Ordering

Workflow v1.0 uses one canonical sequencing rule:

```text
STEP DECLARATION ORDER
=
CANONICAL EXECUTION ORDER
```

Execution order must not be derived from:

- filesystem order;
- alphabetical step identity;
- target-domain identity;
- capability identity;
- incidental registration order;
- completion timing;
- hidden environment state.

The declared sequence is linear and deterministic.

---

# 21. Restricted v1.0 Control Model

Workflow v1.0 does not define a general control-flow language.

The following concepts are not part of the v1.0 workflow grammar:

```text
IF
ELSE
GOTO
LOOP
WHILE
PARALLEL
DEPENDS_ON
RETRY
ROLLBACK
COMPENSATE
SHELL
COMMAND
FUNCTION
SOURCE
EVAL
```

A03 does not define:

- branching;
- loops;
- parallel execution;
- DAG execution;
- implicit retry;
- dynamic dependency graphs;
- arbitrary executable workflow statements.

Future introduction of such behavior requires explicit contract revision.

---

# 22. Preflight Model

Automation must validate all workflow information that can authoritatively be
validated before execution.

Conceptually:

```text
validate workflow grammar
        |
        v
validate workflow identity
        |
        v
validate step identities
        |
        v
resolve explicit capability mappings
        |
        v
validate integration eligibility
        |
        v
validate statically checkable authority
        |
        v
validate statically checkable preconditions
        |
        v
establish canonical step order
        |
        v
execution may begin
```

Preflight does not authorize mutation merely by succeeding.

A lower-domain contract may require additional planning, validation, conflict
checking, dry-run, or other safeguards.

Those requirements remain authoritative.

---

# 23. Precondition Timing

A03 distinguishes:

```text
PREFLIGHT-CHECKABLE PRECONDITION
```

from:

```text
DISPATCH-TIME PRECONDITION
```

A preflight-checkable precondition can be authoritatively evaluated before
workflow execution begins.

A dispatch-time precondition can only be authoritatively evaluated when the
relevant step is reached.

A dispatch-time precondition may legitimately depend on state produced by an
earlier authorized step.

Every required precondition must be satisfied before the operation governed by
that precondition is dispatched.

Automation must not silently infer precondition satisfaction.

---

# 24. Workflow State Model

A03 defines a deliberately minimal workflow execution state model:

```text
DECLARED
   |
   | successful workflow validation
   v
READY
   |
   | execution begins
   v
RUNNING
   |
   +--------------------+
   |                    |
   | declared sequence  | execution stops
   | completes          | before completion
   v                    v
COMPLETED             STOPPED
```

The canonical workflow states are exactly:

```text
DECLARED
READY
RUNNING
COMPLETED
STOPPED
```

A03 does not define hidden workflow states.

---

# 25. Workflow State Semantics

## 25.1 DECLARED

`DECLARED` means the workflow has been structurally represented but has not yet
successfully completed required workflow validation.

It does not establish dispatch authority.

## 25.2 READY

`READY` means the workflow grammar, identity, declared steps, deterministic
mappings, and pre-execution requirements required for entry into execution
have been validated.

`READY` does not mean all future dispatch-time preconditions are already true.

`READY` does not mean mutation has been authorized beyond the explicit
authority checks applicable to each step.

## 25.3 RUNNING

`RUNNING` means execution of the declared workflow sequence has begun.

Workflow state must not be treated as semantic authority over invoked domains.

## 25.4 COMPLETED

`COMPLETED` means the declared required workflow sequence reached its normal
declared conclusion.

`COMPLETED` does not inherently mean:

```text
VALID
CERTIFIED
APPROVED
RELEASED
DEPLOYED
BUSINESS_SUCCESS
```

Those meanings belong to their authoritative domains or processes.

## 25.5 STOPPED

`STOPPED` means workflow execution terminated before the declared sequence
completed.

`STOPPED` preserves the fact of prior completed operations and any known
partial state.

`STOPPED` does not imply:

- rollback;
- compensation;
- atomic restoration;
- transactional failure;
- recovery completion.

---

# 26. Allowed Workflow State Transitions

The v1.0 transitions are:

```text
DECLARED -> READY
READY    -> RUNNING
RUNNING  -> COMPLETED
RUNNING  -> STOPPED
```

No other transition is implicit.

The following are not defined as valid v1.0 transitions:

```text
DECLARED  -> RUNNING
READY     -> COMPLETED
STOPPED   -> RUNNING
COMPLETED -> RUNNING
```

A03 v1.0 does not define generic workflow resume, restart, or retry semantics.

Such behavior requires a future explicit contract if introduced.

---

# 27. Workflow State Is Not Result State

Workflow execution state must remain distinct from result classification.

The following are not workflow lifecycle states:

```text
REQUEST_FAILURE
ORCHESTRATION_FAILURE
DOMAIN_RESULT
VALID
INVALID
SUCCESS
FAILURE
PARTIAL_SUCCESS
ROLLBACK
COMPENSATION
```

The fundamental separation is:

```text
WORKFLOW STATE
!=
STEP EXECUTION STATE
!=
DOMAIN RESULT
!=
RESULT_PLANE
```

A domain result must not silently become a workflow state.

A workflow state must not reinterpret a domain result.

---

# 28. Step Execution State

A03 defines only the minimum orchestration-level step execution states required
for deterministic workflow records:

```text
COMPLETED
DISPATCH_INCOMPLETE
NOT_ATTEMPTED
```

`COMPLETED` means the step was authoritatively dispatched and its invocation
completed according to the applicable integration contract.

It does not reinterpret the semantic meaning of the resulting domain outcome.

A valid authoritative domain result, including a domain-owned non-zero shell
status or a domain semantic result such as `INVALID`, is compatible with
`STEP_STATUS=COMPLETED` when the invocation completed according to the
applicable integration contract.

`DISPATCH_INCOMPLETE` means the step was authoritatively dispatched, but the
invocation did not complete according to the applicable integration contract
required to produce a valid authoritative domain result.

`DISPATCH_INCOMPLETE` is an Automation orchestration fact only.

It must not be interpreted as:

- a domain semantic failure;
- a synthetic domain result;
- `INVALID`;
- a non-zero domain result;
- rollback;
- compensation;
- proof that no governed effect occurred.

A `DISPATCH_INCOMPLETE` step has no valid authoritative domain result to
reference:

```text
STEP_STATUS=DISPATCH_INCOMPLETE
DOMAIN_RESULT_REFERENCE=NONE
```

Known effects or partial state associated with the dispatched invocation remain
observable evidence and must not be erased or reclassified.

`NOT_ATTEMPTED` means the step was not dispatched.

A step not reached because workflow execution stopped must not be represented
as a domain failure.

A03 does not define a generic persistent `FAILED` step lifecycle state.

---

# 29. Stop Conditions

Automation must stop further workflow dispatch when continuation would violate
an established contract or authority boundary, or when an authoritative domain
contract defines the current valid domain result as terminal for the workflow.

Stop conditions include:

- failed required preconditions;
- missing required authority;
- unresolved required capability mappings;
- forbidden integration surfaces;
- authoritative lower-domain terminal conditions requiring stop;
- contract-defined stop conditions;
- technical orchestration failures preventing safe continuation.

After stop, step execution records must reflect what actually occurred.

For an undispatched current step:

```text
current undispatched step -> NOT_ATTEMPTED
later steps -> NOT_ATTEMPTED
workflow -> STOPPED
```

For a step that was dispatched but did not complete according to its applicable
integration contract:

```text
current dispatched incomplete step -> DISPATCH_INCOMPLETE
later steps -> NOT_ATTEMPTED
workflow -> STOPPED
```

For a step that completed with a valid authoritative domain result whose
authoritative contract requires workflow termination:

```text
current terminal domain step -> COMPLETED
later steps -> NOT_ATTEMPTED
workflow -> STOPPED
```

`WORKFLOW_STATUS=STOPPED` does not by itself determine the public
`RESULT_PLANE`.

Automation must preserve known partial state.

---


# 30. Failure Is Not Rollback

A03 preserves the A01 and A02 failure model.

The following statements are invariant:

```text
FAIL-FAST != ROLLBACK
FAILURE != ATOMICITY
COMPENSATION != ROLLBACK
PARTIAL-SUCCESS != GENERIC TECHNICAL ERROR
```

Automation has no inherent cross-domain transaction boundary.

Automation must not invent:

- rollback;
- compensation;
- atomicity;
- transactionality;
- recovery guarantees.

Rollback may be invoked only where an authoritative domain contract explicitly
provides it and applicable authority exists.

Compensation requires its own contract and authority.

---

# 31. Partial State

A workflow may stop after earlier steps have already produced authoritative
results or mutations.

A03 must preserve that fact.

Conceptually:

```text
STEP-01  COMPLETED
STEP-02  COMPLETED
STEP-03  NOT_ATTEMPTED
STEP-04  NOT_ATTEMPTED

WORKFLOW_STATUS=STOPPED
```

Prior successful mutations remain real unless an authoritative contract
explicitly performs an authorized reversal.

Automation must not erase partial-state evidence merely because the overall
workflow stopped.

---

# 32. A02 Result Plane Preservation

A03 introduces no new public result plane.

The only Automation result planes remain:

```text
RESULT_PLANE=REQUEST_FAILURE
RESULT_PLANE=ORCHESTRATION_FAILURE
RESULT_PLANE=DOMAIN_RESULT
```

A03 must not introduce:

```text
RESULT_PLANE=WORKFLOW_RESULT
```

or any equivalent fourth result plane.

`RESULT_PLANE` remains the first mandatory stdout field and occurs exactly once
for every classified Automation result.

---

# 33. Request Failure

A malformed or unsupported workflow request before authorized dispatch is an
Automation-owned request failure.

Examples include:

- missing required workflow identity;
- malformed workflow identity;
- unsupported workflow version;
- malformed step declaration;
- duplicate step identity;
- unsupported required field value;
- unknown workflow field;
- structurally invalid workflow grammar.

The public result follows A02:

```text
RESULT_PLANE=REQUEST_FAILURE
AUTOMATION_STATUS=<non-zero decimal shell status>
```

No domain result may be fabricated.

No domain dispatch may occur for an invalid request.

---

# 34. Orchestration Failure

An orchestration failure occurs when a structurally valid Automation request
cannot be safely or authoritatively orchestrated.

Examples include:

- missing explicit capability mapping;
- unauthorized integration capability;
- forbidden private target;
- missing required workflow authority;
- failed required precondition;
- missing mutation authorization;
- technical orchestration failure.

The public result follows A02:

```text
RESULT_PLANE=ORCHESTRATION_FAILURE
AUTOMATION_STATUS=<non-zero decimal shell status>
```

Automation owns this result classification and shell status.

No fabricated domain result may be emitted.

---

# 35. Domain Result Preservation

When an authorized domain invocation produces an authoritative domain result,
Automation must preserve the A02 Domain Result contract.

The public envelope begins:

```text
RESULT_PLANE=DOMAIN_RESULT
```

The authoritative machine-readable stdout of the invoked domain follows
without semantic rewriting.

Automation must not:

- rename authoritative domain fields;
- reinterpret authoritative domain fields;
- delete authoritative domain fields;
- reorder authoritative domain fields;
- duplicate authoritative domain fields;
- synthesize a domain classification;
- infer domain classification from human-readable diagnostics.

If the domain defines no canonical machine-readable stdout, Automation must not
invent one.

---

# 36. Domain Return Status

For a public `DOMAIN_RESULT`, the invoked authoritative domain owns the shell
return status.

`phoenix::automation_run` must return that authoritative domain shell status
unchanged.

Automation must not:

- reserve domain status values;
- remap domain status values;
- normalize domain status values;
- infer semantic failure from a numeric status alone.

A domain semantic result such as `INVALID` must not automatically become an
Automation technical failure merely because its shell status is non-zero.

---

# 37. Workflow Execution Record

A03 requires Automation to maintain a deterministic execution record for each
declared workflow step.

The execution record is orchestration evidence.

It is not a new public result plane and must not reinterpret an authoritative
domain result.

For each declared step, the execution record contains at minimum:

```text
STEP_ID
STEP_INDEX
TARGET_DOMAIN
TARGET_CAPABILITY
STEP_STATUS
DOMAIN_RESULT_REFERENCE
```

`STEP_STATUS` is one of:

```text
COMPLETED
DISPATCH_INCOMPLETE
NOT_ATTEMPTED
```

For a step whose invocation completed according to the applicable integration
contract:

```text
STEP_STATUS=COMPLETED
```

When that completed invocation produced a valid authoritative domain result,
`DOMAIN_RESULT_REFERENCE` identifies the preserved authoritative domain result
associated with that step.

A valid authoritative domain result, including a domain-owned non-zero shell
status or domain semantic result such as `INVALID`, does not change
`STEP_STATUS=COMPLETED` when the invocation completed according to the
applicable integration contract.

For a step that was authoritatively dispatched but whose invocation did not
complete according to the applicable integration contract required to produce
a valid authoritative domain result:

```text
STEP_STATUS=DISPATCH_INCOMPLETE
DOMAIN_RESULT_REFERENCE=NONE
```

`DISPATCH_INCOMPLETE` records an Automation orchestration fact only.

It does not assert:

- a domain semantic failure;
- a synthetic domain result;
- `INVALID`;
- a domain-owned non-zero result;
- rollback;
- compensation;
- absence of partial effects.

Any known effects or partial state associated with that dispatched invocation
remain observable evidence.

For a step that was not dispatched:

```text
STEP_STATUS=NOT_ATTEMPTED
DOMAIN_RESULT_REFERENCE=NONE
```

A `NOT_ATTEMPTED` step has no authoritative domain result because no domain
invocation occurred.

The execution record must preserve declaration order.

Execution records must not:

- create a fourth A02 result plane;
- replace the public terminal result;
- synthesize domain results;
- reinterpret domain-owned shell status;
- infer semantic meaning from human-readable diagnostics;
- conceal known partial state.

---


# 38. Multi-Step Result Aggregation

Workflow-level aggregation in A03 is structural and orchestrative.

It is not synthetic semantic aggregation.

The canonical rule is:

```text
MULTI-STEP AGGREGATION
=
DETERMINISTIC EXECUTION-RECORD AGGREGATION
```

and not:

```text
MULTI-STEP AGGREGATION
=
SYNTHETIC DOMAIN-RESULT AGGREGATION
```

If a workflow invokes multiple authoritative domains, their results remain
separately attributable to their owning steps and domains.

Automation must not combine multiple domain outcomes into an invented
synthetic domain classification.

---

# 39. Terminal Result Ownership

One `phoenix::automation_run` invocation exposes one authoritative terminal
public result.

The terminal public result belongs to the authoritative condition that
terminates the invocation.

Workflow lifecycle state and public result ownership are separate dimensions.

In particular:

```text
WORKFLOW_STATUS=STOPPED
```

does not by itself determine:

```text
RESULT_PLANE=ORCHESTRATION_FAILURE
```

## 39.1 Request Failure Ownership

If the Automation request itself is invalid according to the A02 request
contract:

```text
RESULT_PLANE=REQUEST_FAILURE
```

Automation owns the result and shell status according to the authoritative A02
request-failure contract.

No workflow step is dispatched.

## 39.2 Automation-Owned Orchestration Failure

If Automation cannot safely or authoritatively continue because an
Automation-owned orchestration requirement cannot be satisfied, and no valid
authoritative domain result owns the terminal condition:

```text
RESULT_PLANE=ORCHESTRATION_FAILURE
```

Automation owns the result and shell status according to the authoritative A02
orchestration-failure contract.

This includes a dispatched invocation that does not complete according to the
applicable integration contract required to produce a valid authoritative
domain result.

In that case the dispatched step is recorded as:

```text
STEP_STATUS=DISPATCH_INCOMPLETE
DOMAIN_RESULT_REFERENCE=NONE
```

Later undispatched steps are recorded as:

```text
STEP_STATUS=NOT_ATTEMPTED
DOMAIN_RESULT_REFERENCE=NONE
```

The workflow enters:

```text
WORKFLOW_STATUS=STOPPED
```

Any prior authoritative domain results and any known partial-state evidence
remain preserved.

`WORKFLOW_STATUS=STOPPED` does not itself convert every terminal condition into
`ORCHESTRATION_FAILURE`.

## 39.3 Domain-Owned Terminal Result

If a valid authoritative domain result owns the terminal condition:

```text
RESULT_PLANE=DOMAIN_RESULT
```

The terminal invoked domain owns its authoritative output and shell return
status.

This includes a valid authoritative domain result whose authoritative domain
contract requires workflow termination before later declared steps are
dispatched.

In that case:

```text
terminal step -> COMPLETED
later steps -> NOT_ATTEMPTED
workflow -> STOPPED
RESULT_PLANE=DOMAIN_RESULT
```

The authoritative terminal domain stdout is preserved according to A02.

The authoritative terminal domain shell status is returned unchanged.

Automation must not reserve, remap, normalize, reinterpret, or replace that
domain-owned shell status.

A contract-defined domain-directed early stop must not be reclassified as
`ORCHESTRATION_FAILURE` merely because the workflow enters `STOPPED` or because
later declared steps are not dispatched.

Therefore the following is an explicit A03 rule:

```text
VALID AUTHORITATIVE DOMAIN RESULT
+ CONTRACT-DEFINED TERMINAL CONDITION
=
WORKFLOW_STATUS=STOPPED
RESULT_PLANE=DOMAIN_RESULT
```

This rule does not authorize Automation to infer terminal semantics from human
diagnostics, undocumented numeric status values, or implementation-specific
behavior.

The terminal condition must come from an authoritative contract already
permitted by the applicable integration boundary.

---


# 40. No Synthetic Aggregate Return Code

A03 does not define a synthetic multi-step shell return code.

Automation must not derive a workflow return code by:

- summing domain return codes;
- selecting the maximum return code;
- selecting the first non-zero return code;
- selecting the last non-zero return code merely because it is non-zero;
- converting all domain outcomes into Boolean success/failure;
- majority voting;
- normalization into Automation-specific domain semantics.

For a terminal `DOMAIN_RESULT`, the authoritative terminal domain status is
preserved.

For an Automation-owned terminal failure, Automation owns the non-zero status
according to A02.

---

# 41. Continue / Stop Decision

Automation must not decide whether to continue or stop a workflow from a
numeric shell status alone.

Continue / stop behavior must be determined by an explicit authoritative
contract applicable to the invoked domain capability.

Automation must not infer continue / stop semantics from:

- human-readable stdout;
- human-readable stderr;
- undocumented numeric status values;
- implementation-specific behavior;
- guessed domain semantics.

A domain semantic result remains owned by the invoked domain.

A valid authoritative domain result, including a domain-owned non-zero shell
status or semantic result such as `INVALID`, does not by itself constitute an
Automation orchestration failure.

Where a valid authoritative domain result satisfies a contract-defined
terminal condition, Automation must honor that condition without reclassifying
the underlying domain result.

In that case:

```text
terminal step -> COMPLETED
later steps -> NOT_ATTEMPTED
workflow -> STOPPED
RESULT_PLANE=DOMAIN_RESULT
```

The terminal domain stdout remains authoritative and is preserved according to
A02.

The terminal domain shell status remains domain-owned and is returned unchanged.

Therefore:

```text
WORKFLOW_STATUS=STOPPED
```

does not imply:

```text
RESULT_PLANE=ORCHESTRATION_FAILURE
```

Where Automation cannot continue because an Automation-owned orchestration
requirement cannot be satisfied, and no valid authoritative domain result owns
the terminal condition:

```text
workflow -> STOPPED
RESULT_PLANE=ORCHESTRATION_FAILURE
```

If the failure occurs after a step was authoritatively dispatched but before
that invocation completed according to the applicable integration contract
required to produce a valid authoritative domain result, the step is recorded
as:

```text
STEP_STATUS=DISPATCH_INCOMPLETE
DOMAIN_RESULT_REFERENCE=NONE
```

Later undispatched steps are:

```text
STEP_STATUS=NOT_ATTEMPTED
DOMAIN_RESULT_REFERENCE=NONE
```

This separation is mandatory:

```text
workflow lifecycle state
!=
public result ownership
```

Automation must preserve the authoritative distinction between:

- a domain-owned terminal result;
- an Automation-owned orchestration failure;
- a request failure.

No continue / stop decision may create a fourth A02 result plane.



---

# 42. Automation Metadata on Domain Results

A03 may define workflow-specific Automation metadata for a terminal
`DOMAIN_RESULT` only within the A02 metadata boundary.

The required ordering is:

```text
RESULT_PLANE=DOMAIN_RESULT
<authoritative terminal domain stdout>
<optional A03 Automation metadata>
```

Automation metadata must:

- follow the authoritative domain output;
- use documented Automation-owned field names;
- not duplicate `RESULT_PLANE`;
- not collide with authoritative domain fields;
- not overwrite authoritative domain fields;
- not alter domain classification;
- not alter domain return semantics.

Candidate A03 workflow metadata names are:

```text
AUTOMATION_WORKFLOW_ID
AUTOMATION_WORKFLOW_STATUS
AUTOMATION_TERMINAL_STEP_ID
AUTOMATION_TERMINAL_STEP_INDEX
AUTOMATION_STEP_COUNT
```

These names describe Automation orchestration only.

They do not redefine domain semantics.

---

# 43. Metadata Collision Rule

Authoritative domain output always retains semantic precedence over optional
Automation metadata.

If an Automation metadata field would collide with an authoritative domain
field, Automation must not:

- overwrite the domain field;
- rename the domain field;
- reinterpret the domain field;
- dynamically rename the Automation field and pretend compatibility;
- wrap or rewrite the domain output merely to avoid collision.

The conflicting optional Automation metadata must not be emitted.

The authoritative domain result remains unchanged.

---

# 44. Rejected Public Payload Framing

A03 explicitly rejects public domain-output wrapping such as:

```text
DOMAIN_OUTPUT_LENGTH=<n>
DOMAIN_OUTPUT=<wrapped-domain-output>
```

when such wrapping would change the A02-prescribed public `DOMAIN_RESULT`
structure.

A03 must not transform authoritative domain stdout into an opaque replacement
field merely for workflow aggregation.

Internal implementation techniques are not authorized or frozen by this
statement.

Any future internal representation must still preserve the public A02 contract.

---

# 45. Canonical Aggregation Order

Workflow execution records follow canonical step declaration order.

They must not be reordered by:

- result classification;
- target domain;
- alphabetical step identity;
- completion duration;
- filesystem state;
- incidental registry state.

Conceptually:

```text
workflow metadata

step 1 execution record
step 2 execution record
...
step N execution record
```

This ordering concerns workflow execution records.

It does not authorize reordering of authoritative domain stdout.

---

# 46. Evidence Coordination

Automation may collect, label, correlate, and organize technical evidence
produced by authorized workflow execution.

Evidence may include:

- workflow identity;
- step identity;
- capability identity;
- execution order;
- authoritative result references;
- observed partial state;
- mutation evidence provided by authoritative domains.

Evidence coordination does not establish:

- certification;
- approval;
- PDS PASS;
- release authorization;
- deployment authorization;
- rollback completion;
- transaction completion.

Those meanings remain owned by their authoritative processes.

---

# 47. Determinism Contract

Given equivalent canonical workflow input and equivalent authorized domain
state, Automation must deterministically preserve:

- workflow identity;
- workflow version;
- step identities;
- step declaration order;
- capability mappings;
- argument order;
- mutation declarations;
- applicable authority references;
- state-transition rules;
- execution-record ordering.

Authoritative lower-domain results may reflect domain-owned external state.

Automation determinism does not require Automation to fabricate identical
domain outcomes where the owning domain legitimately observes different
external state.

---

# 48. Security Contract

Workflow data is untrusted until validated.

A03 preserves the following security rules:

```text
NO eval
NO data-derived bash -c
NO data-derived sh -c
NO dynamic executable function construction
NO foreign private helper dispatch
NO filesystem capability discovery
NO hidden execution aliases
NO dynamically sourced untrusted workflow code
```

Logical workflow identities may influence execution only through explicit,
bounded, validated mappings authorized by Automation contracts.

Arguments remain data.

Workflow definitions remain data.

Authority references remain data until authoritatively verified.

---

# 49. Bash 3.2 Compatibility

The A03 model must remain implementable under the Phoenix Bash 3.2
compatibility requirement.

A03 does not require:

- associative arrays;
- namerefs;
- Bash 4+ map types;
- dynamic code evaluation;
- shell-generated executable programs.

The specification defines semantics rather than mandating a private
implementation data structure.

---

# 50. Foreign Domain Boundary

A03 does not redefine the semantics of:

- Core;
- Runtime;
- Logger;
- Filesystem;
- Strings;
- Template Engine;
- Generator;
- Validator;
- Atlas SDK;
- Plugin;
- CLI;
- Release;
- Operations;
- PDS;
- product logic.

Automation consumes only eligible public capabilities.

Foreign private helpers matching:

```text
_phoenix::<other-domain>_*
```

are forbidden integration surfaces.

---

# 51. Certification Boundary

A03 defines workflow orchestration mechanics only.

It does not define:

- certification mechanics;
- certification evidence sufficiency;
- certification approval;
- automated certification authority.

Those concerns belong to:

```text
A04 — Certification Automation
```

A workflow reaching `COMPLETED` must not be interpreted as certification.

---

# 52. Workspace Automation Boundary

A03 defines the generic Workflow Model.

It does not define workspace-specific automation workflows.

Those concerns belong to:

```text
A05 — Workspace Automation
```

A03 must not silently encode Workspace mutation policy into the generic
Workflow Model.

---

# 53. Backup / Recovery Boundary

A03 does not define:

- backup workflows;
- recovery workflows;
- restore semantics;
- recovery authority;
- recovery completion;
- recovery rollback.

Those concerns belong to:

```text
A06 — Backup / Recovery Coordination
```

`STOPPED` does not imply recovery is required or completed.

---

# 54. Release Boundary

A03 creates no Release Engine authority.

Release coordination remains unresolved until its authoritative contract is
defined and explicitly authorized.

Those concerns belong to:

```text
A07 — Release Coordination Boundary
```

Workflow completion must not imply:

- release approval;
- remote closure;
- deployment authorization;
- production readiness.

---

# 55. CLI Boundary

A03 does not define CLI parsing, presentation, command grammar, or user-facing
Automation command behavior.

CLI integration belongs to:

```text
A08 — CLI Integration
```

CLI consumption must not broaden Automation authority or reinterpret workflow
semantics.

---

# 56. Testing Boundary

A03 defines design requirements that later tests must verify.

Full Automation test design and implementation belong to:

```text
A09 — Automation Tests
```

A03 does not claim that the Workflow Model has been implemented or tested.

---

# 57. Final Certification Boundary

Phase 10 final Automation certification belongs to:

```text
A10 — Final Certification
```

A03 design completion or formal design freeze does not certify Automation.

Phase 10 remains incomplete until its required later workstreams are
authoritatively completed.

---

# 58. Workflow Validation Requirements

A valid A03 workflow request must establish at minimum:

1. exactly one valid `WORKFLOW_ID`;
2. exactly one supported `WORKFLOW_VERSION`;
3. at least one valid step;
4. unique step identities;
5. canonical field structure;
6. valid mutation-mode values;
7. required authority-reference structure;
8. valid explicit capability identities;
9. deterministic declaration order;
10. no unsupported workflow fields;
11. no forbidden executable workflow constructs.

Validation of workflow structure does not replace owning-domain validation.

---

# 59. Fail-Closed Requirements

Automation must fail closed when required workflow information cannot be
authoritatively established.

Examples include:

- unknown required field;
- unsupported workflow version;
- duplicate step identity;
- unresolved capability mapping;
- unauthorized public capability;
- forbidden private capability;
- missing required authority;
- ambiguous mutation permission;
- failed required precondition;
- invalid deterministic mapping.

Fail-closed behavior must not invent rollback of prior effects.

---

# 60. Forbidden Patterns

The following patterns are forbidden by A03 v1.0:

## 60.1 Executable Workflow Data

Workflow data must not become executable shell source.

## 60.2 Dynamic Dispatch

Executable function names must not be constructed from workflow identities.

## 60.3 Hidden Capability Discovery

Filesystem state must not substitute for explicit capability mappings.

## 60.4 Foreign Private Integration

Automation must not invoke private helpers owned by another domain.

## 60.5 Semantic Reimplementation

Automation must not reimplement or reinterpret lower-domain semantics.

## 60.6 Implicit Mutation

Mutation must not occur under read-only declaration or inferred permission.

## 60.7 Synthetic Domain Aggregation

Multiple domain results must not be flattened into an invented domain result.

## 60.8 Synthetic Aggregate Return Code

Multiple domain shell statuses must not be normalized into invented workflow
domain semantics.

## 60.9 Invented Rollback

Workflow failure or stop must not imply rollback, compensation, atomicity, or
transactionality.

## 60.10 Self-Certification

Workflow completion must not establish certification or PDS PASS.

## 60.11 Release Inference

Workflow completion must not establish release, remote closure, or deployment
authority.

---


# 61. A03 Invariants

The A03 Workflow Model defines the following candidate invariants.

### A03-I01

A workflow is declarative data, not executable shell code.

### A03-I02

A03 introduces no public Automation API beyond
`phoenix::automation_run`.

### A03-I03

A03 introduces no public Workflow Registry.

### A03-I04

Workflow identity is explicit and canonical.

### A03-I05

Step identity is explicit and unique within a workflow.

### A03-I06

Step declaration order is canonical execution order.

### A03-I07

Target capabilities resolve only through explicit bounded mappings.

### A03-I08

Workflow data must never dynamically construct executable targets.

### A03-I09

A workflow step does not replace or bypass mandatory lower-domain sequencing.

### A03-I10

Mutation mode is explicit.

### A03-I11

Workflow-specific mutation authorization and owning-domain mutation authority
are distinct cumulative requirements.

### A03-I12

Required preconditions must pass before their governed operation is dispatched.

### A03-I13

Workflow state is not semantic domain authority.

### A03-I14

Workflow states are limited to
`DECLARED`, `READY`, `RUNNING`, `COMPLETED`, and `STOPPED`.

### A03-I15

A03 does not define generic resume, retry, branching, loops, parallelism, or
DAG execution.

### A03-I16

A03 introduces no fourth `RESULT_PLANE`.

### A03-I17

Authoritative domain results must be preserved without semantic rewriting.

### A03-I18

Workflow aggregation is structural execution-record aggregation, not synthetic
domain-result aggregation.

### A03-I19

One `automation_run` invocation exposes one authoritative terminal public
result.

### A03-I20

A terminal `DOMAIN_RESULT` preserves the terminal invoked domain shell status
unchanged.

### A03-I21

Automation-owned terminal failures use Automation-owned non-zero status
according to A02.

### A03-I22

Numeric domain shell status alone must not determine domain semantics or
workflow failure classification.

### A03-I23

Optional Automation metadata must follow authoritative domain output and must
not collide with it.

### A03-I24

Public length-wrapping or equivalent rewriting of authoritative domain output
is not part of A03 v1.0.

### A03-I25

Partial state must remain observable when workflow execution stops.

### A03-I26

Fail-fast does not imply rollback.

### A03-I27

A03 creates no certification, PDS, release, deployment, rollback,
compensation, transaction, or atomicity authority.

### A03-I28

A04 through A10 ownership boundaries remain intact.
### A03-I29

A dispatched step that does not complete according to the applicable
integration contract required to produce a valid authoritative domain result
must be recorded as `DISPATCH_INCOMPLETE`, not `COMPLETED` or
`NOT_ATTEMPTED`.

`DISPATCH_INCOMPLETE` is an Automation orchestration fact only.

It must not be interpreted as:

- a domain semantic failure;
- a synthetic domain result;
- `INVALID`;
- a domain-owned non-zero result;
- rollback;
- compensation;
- proof that no governed effect occurred.

A dispatched incomplete step has:

```text
STEP_STATUS=DISPATCH_INCOMPLETE
DOMAIN_RESULT_REFERENCE=NONE
```

Known effects or partial state associated with that dispatched invocation remain
observable evidence.

### A03-I30

A valid authoritative domain result that satisfies a contract-defined terminal
condition remains:

```text
RESULT_PLANE=DOMAIN_RESULT
```

even when it causes:

```text
WORKFLOW_STATUS=STOPPED
```

before later declared steps are dispatched.

In that case:

```text
terminal step -> COMPLETED
later steps -> NOT_ATTEMPTED
workflow -> STOPPED
RESULT_PLANE=DOMAIN_RESULT
```

The terminal domain stdout and shell status remain domain-owned and are
preserved according to the authoritative A02 contract.

`WORKFLOW_STATUS=STOPPED` must not by itself be interpreted as
`RESULT_PLANE=ORCHESTRATION_FAILURE`.

---

# 62. Cross-Contract Reconciliation Record

A03 design passes P1 through P7 established the initial Workflow Model.

A03-P8 performed a cross-contract consistency review against the formally
design-frozen A01 Automation Architecture and A02 Automation Function
Specification.

The initial P8 review identified:

```text
A03-P8-F01
Severity: BLOCKER
```

The initial A03 output-framing proposal would have wrapped authoritative domain
stdout using a length-framed payload.

That proposal conflicted with the A02 requirement that authoritative domain
stdout follow `RESULT_PLANE=DOMAIN_RESULT` without semantic rewriting and that
optional Automation metadata follow the preserved domain output.

The finding was accepted.

Bounded remediation established:

```text
WORKFLOW EXECUTION RECORD
!=
PUBLIC AUTOMATION RESULT
```

and:

```text
MULTI-STEP AGGREGATION
=
DETERMINISTIC EXECUTION-RECORD AGGREGATION
```

rather than synthetic domain-output wrapping.

Public length-framed domain payload representation was rejected.

Terminal result ownership was defined so that:

- request failure remains Automation-owned;
- orchestration failure remains Automation-owned;
- terminal domain result remains domain-owned;
- terminal domain stdout remains authoritative;
- terminal domain shell status remains unchanged.

Disposition:

```text
A03-P8-F01: CLOSED BY REMEDIATION
```

The post-remediation A03 cross-contract review disposition is:

```text
PASS
```

At the conclusion of A03-P8, no open A03 freeze blocker was known.

This statement records the historical post-P8 disposition only. It does not
supersede findings from subsequent internal or independent review passes.

---



# 63. Known Limitations

Workflow v1.0 deliberately does not define:

- branching;
- loops;
- parallel execution;
- DAG execution;
- generic retry;
- generic resume;
- generic restart;
- generic rollback;
- generic compensation;
- cross-domain transactionality;
- Workflow Registry;
- dynamic workflow discovery;
- dynamic executable dispatch;
- certification mechanics;
- workspace-specific workflows;
- backup/recovery workflows;
- Release coordination;
- CLI integration;
- Automation test implementation;
- final Automation certification.

These limitations are intentional boundaries, not implicit future authority.

---

# 64. A03 Design Status

Current A03 design state:

```text
A03-P1  Forensic Baseline / Contract Discovery     PASS

A03-P2  Existing Model Precedents                   PASS

A03-P3  Workflow State Model                        PASS

A03-P4  Step / Sequencing Model                     PASS

A03-P5  Grammar / Canonical Representation          PASS

A03-P6  Workflow Result Aggregation                 PASS — RECONCILED

A03-P7  Output Framing                              PASS — RECONCILED

A03-P8  Cross-Contract Consistency Review           PASS

A03-P8-F01                                       CLOSED BY REMEDIATION

A03-P10 Final Internal Document Audit               PASS

A03 INITIAL INDEPENDENT REVIEW                      FAIL

A03-IR-F01                                          CLOSED BY REMEDIATION

A03-IR-F02                                          CLOSED BY REMEDIATION

A03 INDEPENDENT POST-REMEDIATION RE-REVIEW          PASS

OPEN REVIEW FINDINGS                                0

FORMAL DESIGN FREEZE                                PASS
```

This document is now:

```text
FORMALLY DESIGN FROZEN — NOT CERTIFIED

---

# 65. Lifecycle Status

The following lifecycle statements are authoritative for this candidate:

```text
A01 ARCHITECTURE                    FORMALLY DESIGN FROZEN
A01 CERTIFICATION                   NOT CERTIFIED

A02 FUNCTION SPECIFICATION          FORMALLY DESIGN FROZEN
A02 CERTIFICATION                   NOT CERTIFIED

A03 WORKFLOW MODEL                  FORMALLY DESIGN FROZEN
A03 CERTIFICATION                   NOT CERTIFIED
A03-IR-F01                          CLOSED BY REMEDIATION
A03-IR-F02                          CLOSED BY REMEDIATION
A03 INDEPENDENT RE-REVIEW           PASS

AUTOMATION IMPLEMENTATION           NOT AUTHORIZED
A04                                NOT STARTED
A05                                NOT STARTED
A06                                NOT STARTED
A07                                NOT STARTED
A08                                NOT STARTED
A09                                NOT STARTED
A10                                NOT STARTED
PHASE 10                            NOT COMPLETE
```

A01-F02 remains:

```text
OPEN — MINOR — NON-BLOCKING
```

A03 does not remediate or redefine that Generator documentation finding.

---

# 66. Formal Design Freeze Record

The A03 formal design freeze is based on completion of:

1. structural verification;
2. repository-state verification;
3. whitespace and diff verification;
4. final A03 internal consistency audit;
5. invariant audit;
6. A01 compatibility audit;
7. A02 compatibility audit;
8. deferred-boundary audit;
9. independent read-only review;
10. bounded remediation of `A03-IR-F01` and `A03-IR-F02`;
11. independent post-remediation re-review;
12. disposition of all A03 independent-review findings.

The independent post-remediation re-review disposition was:

```text
A03-IR-F01                          CLOSED BY REMEDIATION
A03-IR-F02                          CLOSED BY REMEDIATION
A03 INDEPENDENT RE-REVIEW           PASS
FORMAL DESIGN FREEZE RECOMMENDATION YES.

---

# END OF DOCUMENT