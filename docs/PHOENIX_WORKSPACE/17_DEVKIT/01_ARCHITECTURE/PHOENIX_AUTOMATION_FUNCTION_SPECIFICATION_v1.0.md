# PHOENIX AUTOMATION FUNCTION SPECIFICATION v1.0

STATUS: FORMALLY DESIGN FROZEN — NOT CERTIFIED
IMPLEMENTATION: NOT AUTHORIZED
CERTIFICATION: NOT CERTIFIED
PHASE: 10 — AUTOMATION LAYER
WORKSTREAM: A02 — AUTOMATION FUNCTION SPECIFICATION

---
# 1. Purpose

This specification defines the public function contract, private helper boundary,
input contract, output contract, failure semantics, compatibility rules, and
security constraints of the Phoenix DevKit Automation Layer v1.0.

It is governed by the formally design-frozen
`PHOENIX_AUTOMATION_ARCHITECTURE_v1.0.md`
and by certified or explicitly authorized public contracts of invoked Phoenix
domains.

This document does not implement Automation, define the Workflow Model, certify
Automation, authorize implementation, or complete Phase 10.

---

# 2. Scope

A02 defines:

- public Automation API;
- public signature;
- request carrier contract;
- output and return semantics;
- failure semantics;
- private helper boundary;
- compatibility rules;
- security constraints.

A02 does not define:

- workflow grammar;
- workflow representation;
- workflow state transitions;
- certification automation mechanics;
- workspace workflows;
- backup/recovery workflows;
- Release integration;
- CLI integration;
- Automation tests;
- final certification.

---

# 3. Authority Principle

Automation owns authorized orchestration mechanics only.

Automation does not become semantic authority for invoked domains.

When Automation invokes another Phoenix domain, that domain retains authority
over its inputs, validation, sequencing, results, failures, mutations, conflict
behavior, partial-state semantics, guarantees, and limitations.

Public visibility or technical callability does not by itself authorize
Automation integration or mutation.

---

# 4. Public Namespace

The public Automation namespace is:

`phoenix::automation_*`

Only functions explicitly listed by this specification are public.

A function does not become public merely because it exists or is technically
callable.

---

# 5. Public API Surface

Automation v1.0 defines exactly one public function:

`phoenix::automation_run`

No other public Automation function is part of v1.0.

In particular, A02 does not define:

- `phoenix::automation_exists`
- `phoenix::automation_register`
- `phoenix::automation_resolve`
- `phoenix::automation_list`

These names must not be inferred as implemented or reserved APIs.

Adding any new public Automation function requires explicit specification
revision and design freeze.

---

# 6. Public Entry Point

## 6.1 Function

`phoenix::automation_run`

## 6.2 Purpose

`phoenix::automation_run` receives one explicit Automation request through a
shell argument vector and coordinates that request through authorized public
Phoenix boundaries.

It is the sole reusable public Automation execution entry point in v1.0.

## 6.3 Signature

`phoenix::automation_run [arguments...]`

The exact workflow grammar carried by `[arguments...]` is not defined by A02.

Workflow representation belongs to A03 — Workflow Model.

---
# 7. Input Contract

## 7.1 Request Carrier

`phoenix::automation_run` receives its request as an explicit shell argument
vector:

`[arguments...]`

The argument vector is a transport contract only.

A02 does not assign workflow grammar, workflow identity, workflow serialization,
step representation, or state-transition semantics to those arguments.

Those semantics belong to A03 — Workflow Model.

## 7.2 Argument Preservation

Automation must preserve shell argument boundaries.

It must not reconstruct the received arguments into executable shell text.

Equivalent valid requests evaluated against equivalent authorized state must
produce deterministic orchestration behavior.

## 7.3 Input Validation

All request input is inert until validated.

Automation must reject malformed or unsupported requests before dispatch.

Invalid request data must not:

- determine executable code;
- construct executable function names;
- trigger arbitrary filesystem discovery;
- select private integration surfaces;
- bypass authority checks;
- create implicit mutation authority.

## 7.4 Hidden Request Inputs

The following must not act as implicit Automation request inputs:

- arbitrary environment variables;
- mutable global shell state;
- current-working-directory inference;
- filesystem-derived capability discovery;
- dynamically sourced request definitions;
- reconstructed shell command strings.

Any future use of environment or filesystem state must be explicitly specified,
bounded, validated, and authorized by the owning contract.

---

# 8. Dispatch Contract

## 8.1 Explicit Dispatch

Automation dispatch must use explicit, bounded mappings to authorized public
Phoenix capabilities.

Executable targets must not be inferred directly from user input, workflow data,
filenames, environment values, or filesystem contents.

## 8.2 Authorization Before Dispatch

Before invoking a domain capability, Automation must establish that:

1. the requested capability is explicitly mapped;
2. the target is a public Phoenix capability;
3. the capability is certified or explicitly authorized for Automation use;
4. required preconditions are satisfied;
5. the requested operation is permitted by the owning domain contract.

Failure of any required condition is an Automation-owned orchestration failure.

## 8.3 Foreign Private Boundaries

Automation must not directly invoke private helpers belonging to another Phoenix
domain.

Therefore interfaces matching:

`_phoenix::<other-domain>_*`

are forbidden Automation integration surfaces.

Automation may use its own private helpers:

`_phoenix::automation_*`

but those helpers do not become public API.

---

# 9. Security Contract

Automation must treat request data and workflow-derived data as untrusted until
validated.

The following are forbidden:

- `eval`;
- executable shell text derived from request data;
- `bash -c` or `sh -c` derived from request data;
- dynamically constructed executable function names;
- arbitrary command execution selected by request data;
- filesystem command discovery;
- undocumented aliases or fallback execution routes;
- direct invocation of foreign private helpers;
- sourcing untrusted or inferred definitions as executable code.

Dispatch must remain bounded by explicit Automation-controlled mappings.

Security restrictions defined by invoked domains remain authoritative and must
not be weakened by Automation.

---

# 10. Private Helper Boundary

Private Automation helpers use the namespace:

`_phoenix::automation_*`

Private helpers may support responsibilities such as:

- request validation;
- precondition checking;
- capability mapping;
- authority checking;
- bounded dispatch;
- result collection;
- failure attribution;
- evidence coordination.

Private helper names, decomposition, and internal organization are implementation
details and are not part of the public compatibility surface.

Private Automation helpers must not redefine the semantics of invoked public
domain capabilities.

---
# 11. Output Contract

## 11.1 General Principle

Automation output must be deterministic, machine-readable, and suitable for
consumption by other Phoenix layers.

The v1.0 output contract uses a line-oriented `KEY=VALUE` envelope.

Every invocation of `phoenix::automation_run` that produces a classified result
must begin its stdout result envelope with exactly one mandatory field:

```text
RESULT_PLANE=REQUEST_FAILURE
```

or:

```text
RESULT_PLANE=ORCHESTRATION_FAILURE
```

or:

```text
RESULT_PLANE=DOMAIN_RESULT
```

`RESULT_PLANE` is the authoritative Automation-level discriminator for the
result plane.

It must occur exactly once and must be the first field of the Automation result
envelope.

Duplicate `RESULT_PLANE` fields are forbidden.

Automation must not infer `RESULT_PLANE` from human-readable diagnostics or from
a domain shell status alone.

A02 does not define workflow-specific output fields.

Fields describing workflow identity, workflow steps, transitions, workflow
state, or workflow-level aggregation belong to A03 — Workflow Model.

## 11.2 Automation-Owned Failure Output

For `REQUEST_FAILURE` and `ORCHESTRATION_FAILURE`, Automation owns the result
envelope.

The minimum public stdout envelope is:

```text
RESULT_PLANE=<REQUEST_FAILURE|ORCHESTRATION_FAILURE>
AUTOMATION_STATUS=<non-zero decimal shell status>
```

The fields must appear in that order and exactly once.

`AUTOMATION_STATUS` records the shell status returned by
`phoenix::automation_run` for the Automation-owned failure.

Additional Automation metadata may follow only when defined by an authoritative
Automation contract.

Such metadata must:

- use documented field names;
- follow the mandatory fields;
- not duplicate mandatory fields;
- not alter the meaning of the mandatory fields.

Human-readable Automation diagnostics belong on stderr.

Human-readable diagnostics must not be required to determine the result plane
or authoritative status.

Automation-owned failures must not fabricate domain output or a domain result.

## 11.3 Domain Result Preservation

When an authorized domain has been invoked and produces an authoritative domain
result, Automation must emit:

```text
RESULT_PLANE=DOMAIN_RESULT
```

as the first stdout field.

After that discriminator, authoritative machine-readable stdout produced by the
invoked domain must be preserved without semantic rewriting.

Automation must not rename, reinterpret, delete, reorder, or duplicate
authoritative domain fields.

Automation must not synthesize a domain classification that the invoked domain
did not produce.

The shell return status of `phoenix::automation_run` for `DOMAIN_RESULT` must be
the authoritative shell return status produced by the invoked domain.

Automation-owned request and orchestration statuses therefore do not reserve,
reinterpret, or remap domain return-code values.

Numeric return-code collisions are permitted because `RESULT_PLANE`, not the
numeric shell status alone, is the authoritative discriminator between an
Automation-owned failure and a domain result.

Domain classifications such as success, failure, validation result,
partial-success, mutation result, or other contract-defined outcomes must not be
silently replaced by an Automation-specific interpretation.

Human-readable domain stderr may be forwarded without semantic interpretation.

Automation must not parse human-readable stdout or stderr to infer a domain
classification.

If an invoked domain contract defines no canonical machine-readable stdout,
Automation must not invent one.

The result remains `DOMAIN_RESULT`, and the domain shell return status remains
authoritative.

## 11.4 Automation Metadata on Domain Results

Automation metadata added to a `DOMAIN_RESULT` is optional in A02.

When added, it must:

- follow the preserved authoritative domain output;
- use field names explicitly defined by an authoritative Automation contract;
- not duplicate `RESULT_PLANE`;
- not collide with or overwrite authoritative domain fields;
- not change domain classification or return semantics.

A03 may define workflow-specific metadata and aggregation only within these
constraints.

## 11.5 Evidence Output

Automation may collect, label, correlate, and organize evidence produced during
authorized orchestration.

Evidence output must obey the same result-envelope and authority rules defined
by this specification.

Evidence output must not by itself imply:

- certification;
- approval;
- PDS PASS;
- release authorization;
- deployment authorization;
- rollback completion;
- transactional completion.

Those meanings belong to their authoritative owning processes.

---

# 12. Return Semantics

`phoenix::automation_run` has two return-status ownership modes.

For `REQUEST_FAILURE` and `ORCHESTRATION_FAILURE`, Automation owns the shell
return status.

Automation-owned failures must return a non-zero decimal shell status.

That same value must be emitted as `AUTOMATION_STATUS` in the Automation-owned
result envelope.

A02 does not assign semantic meaning to individual non-zero Automation-owned
numeric values.

Callers must use `RESULT_PLANE` and the documented machine-readable envelope
rather than infer failure ownership from the numeric status alone.

For `DOMAIN_RESULT`, the invoked authoritative domain owns the shell return
status.

`phoenix::automation_run` must return that domain shell status unchanged.

Automation must not reserve, remap, normalize, or reinterpret a domain return
code merely because the same numeric value may also occur for an
Automation-owned failure.

The mandatory `RESULT_PLANE` field resolves that ownership distinction.

A domain semantic result must not be reclassified merely because its shell
status is non-zero.

In particular, a domain-defined semantic result such as `INVALID` must not be
automatically converted into an Automation technical error.

A02 does not define a workflow-level aggregation rule for multiple domain
results.

Such aggregation depends on the Workflow Model and is deferred to A03.

---

# 13. Failure Model

Automation recognizes exactly three result planes:

1. `REQUEST_FAILURE`
2. `ORCHESTRATION_FAILURE`
3. `DOMAIN_RESULT`

These planes are publicly and machine-readably distinguished by the mandatory
`RESULT_PLANE` field defined in Section 11.

Shell return status alone is not a result-plane discriminator.

## 13.1 Request Failure

A request failure occurs when the Automation request itself is malformed,
unsupported, incomplete, or otherwise invalid before authorized dispatch.

Request failure is owned and classified by Automation.

A request failure must:

- fail before domain dispatch;
- emit `RESULT_PLANE=REQUEST_FAILURE`;
- emit `AUTOMATION_STATUS=<non-zero decimal shell status>`;
- return that same non-zero shell status;
- produce no fabricated domain result;
- perform no unauthorized mutation.

## 13.2 Orchestration Failure

An orchestration failure occurs when Automation cannot safely or authoritatively
perform required orchestration.

Examples include:

- missing required authority;
- missing authorized capability;
- failed precondition;
- missing explicit dispatch mapping;
- forbidden integration surface;
- technical orchestration failure.

Orchestration failure is owned and classified by Automation.

An orchestration failure must:

- emit `RESULT_PLANE=ORCHESTRATION_FAILURE`;
- emit `AUTOMATION_STATUS=<non-zero decimal shell status>`;
- return that same non-zero shell status;
- not fabricate or reinterpret a domain result.

Automation must fail fast when continued execution would violate an established
contract or authority boundary.

## 13.3 Domain Result

A domain result is a semantic outcome produced by an invoked authoritative
Phoenix domain.

The invoked domain owns its classification and shell return status.

A domain result must:

- emit `RESULT_PLANE=DOMAIN_RESULT` as the Automation envelope discriminator;
- preserve authoritative domain machine-readable output according to Section 11;
- return the authoritative domain shell status unchanged.

Automation must preserve the domain classification faithfully.

Automation must not infer domain semantics by parsing human-readable messages.

The earliest layer capable of authoritatively classifying a condition owns that
classification.

Workflow-level aggregation of multiple domain results remains deferred to A03.

---

# 14. Failure Is Not Rollback

Fail-fast behavior does not imply rollback.

Failure does not imply atomicity.

Compensation does not imply rollback.

Partial-success does not imply complete success and must not be collapsed into a
generic technical error.

Automation must not invent rollback, compensation, transactionality, atomicity,
or recovery guarantees that are absent from the authoritative domain contract.

A03 may define workflow sequencing and state semantics, but it may not silently
create guarantees forbidden by this contract.

---
# 15. Compatibility Contract

The following elements are compatibility-sensitive public contract:

- public function name;
- public function signature;
- request transport semantics;
- argument-boundary preservation;
- public output semantics;
- return semantics;
- failure ownership and classification rules;
- authority boundaries;
- dispatch restrictions;
- security guarantees.

Changes to these elements require explicit specification review and revision.

The following are not public compatibility surface:

- private helper names;
- private helper decomposition;
- internal helper organization;
- internal implementation structure;
- implementation-local data representation that does not alter public behavior.

Refactoring private Automation internals is compatible only when the public
contract remains unchanged.

---

# 16. Public and Private Integration Rules

Automation may integrate only through authoritative public Phoenix capabilities
that are certified or explicitly authorized for Automation use.

Public visibility alone does not establish orchestration authority.

Automation must not depend on:

- foreign private helpers;
- undocumented implementation details;
- private bootstrap functions;
- private contribution coordination;
- hidden registry state;
- inferred aliases;
- filesystem-discovered executable capabilities.

If an integration requires a capability not present in an authoritative public
contract, that integration remains unresolved until the owning contract is
explicitly revised and authorized.

---

# 17. Mutation Authority

Automation does not acquire mutation authority merely by invoking a public
function.

Mutation authority requires two distinct and cumulative conditions:

1. the authoritative owning-domain contract permits and bounds the requested
   type of mutation;
2. the specific Automation workflow or request has explicit authority for the
   intended target and effects.

These conditions are not equivalent.

```text
Owning-domain mutation contract
!= workflow-specific mutation authorization
```

Before dispatching any mutation-capable operation, Automation must establish
that:

- the target is a public Phoenix capability;
- the capability is certified or explicitly authorized for Automation
  integration;
- the authoritative owning-domain contract permits and bounds the mutation;
- the specific workflow or request is explicitly authorized for the intended
  target and effects;
- all owning-domain preconditions and safeguards are satisfied.

Absence of workflow-specific mutation authority is an
`ORCHESTRATION_FAILURE`.

No mutation-capable domain function may be dispatched before that authority has
been verified.

The owning domain retains authority over mutation semantics and limits,
including:

- mutation preconditions;
- conflict rules;
- overwrite rules;
- failure behavior;
- partial-state behavior;
- guarantees and limitations.

Workflow-specific authorization grants permission to exercise an already
permitted mutation capability.

It does not redefine, broaden, weaken, or override the owning-domain contract.

Automation must not infer mutation authority from:

- public visibility;
- technical callability;
- integration eligibility alone;
- the existence of a mutation-capable public function;
- the fact that the owning-domain contract defines mutation semantics.

Automation must not broaden mutation authority.

---

# 18. Determinism

Equivalent valid Automation requests operating against equivalent authorized
state must produce equivalent orchestration decisions.

Dispatch selection must not depend on:

- filesystem enumeration order;
- undocumented environment state;
- dynamically discovered executable functions;
- arbitrary shell expansion;
- hidden fallback routes.

Any ordering semantics belonging to workflows are deferred to A03.

---

# 19. Bash Compatibility

Automation v1.0 must remain compatible with the Phoenix DevKit Bash 3.2
baseline.

The public request carrier therefore uses the ordinary shell argument vector.

The public contract must not require Bash features unavailable in the supported
baseline, including associative-array or nameref-based request interfaces.

Implementation details remain subject to the DevKit coding and compatibility
standards.

---

# 20. Deferred Boundaries

A02 intentionally does not define work owned by later Phase 10 workstreams.

## A03 — Workflow Model

Deferred:

- workflow grammar;
- workflow identity;
- workflow representation;
- workflow sequencing;
- workflow state transitions;
- workflow-level result aggregation.

## A04 — Certification Automation

Deferred:

- certification mechanics;
- certification evidence rules;
- automated certification coordination.

## A05 — Workspace Automation

Deferred:

- workspace-specific automation workflows.

## A06 — Backup / Recovery Coordination

Deferred:

- backup workflows;
- recovery workflows;
- recovery coordination semantics.

## A07 — Release Coordination Boundary

Release integration remains unresolved until its authoritative contract is
defined and authorized.

A02 does not create Release authority.

## A08 — CLI Integration

CLI consumption of Automation is deferred until the Automation public contract
is formally design frozen and the A08 integration contract is defined.

## A09 — Automation Tests

Full Automation test design and implementation are deferred.

## A10 — Final Certification

Final Automation certification is deferred.

---

# 21. Forbidden Interpretations

This specification must not be interpreted as:

- Automation implementation authorization;
- Automation certification;
- Phase 10 completion;
- Workflow Model definition;
- Release authorization;
- deployment authorization;
- PDS certification authority;
- permission to invoke foreign private helpers;
- permission to dynamically execute request-derived code;
- permission to invent rollback or transactional guarantees.

---

# 22. A02 Design Decisions

A02 v1.0 candidate establishes:

1. exactly one public Automation function:
   `phoenix::automation_run`;
2. explicit shell argv as the public request carrier;
3. workflow grammar and representation deferred to A03;
4. `_phoenix::automation_*` as private Automation namespace;
5. foreign private helpers forbidden as integration surfaces;
6. explicit bounded dispatch required;
7. request, orchestration, and domain-result planes kept distinct;
8. authoritative domain classifications preserved;
9. no invented rollback, atomicity, compensation, or transactionality;
10. public compatibility surface explicitly bounded;
11. Bash 3.2 compatibility preserved;
12. new public Automation API requires explicit specification revision.

---

# 23. Formal Design Freeze Status

This document is the formally design-frozen A02 Automation Function
Specification v1.0.

It records the contract conclusions established by A02 forensic and design
passes P1 through P7, the final A02 internal audit, the initial independent
review, the bounded remediation of A02-IR-F01 and A02-IR-F02, and the
independent post-remediation re-review.

The exact candidate independently accepted as suitable for formal design
freeze was:

```text
Lines: 840
Bytes: 23430
SHA-256:
5e43e4ae304b2842f9701d23f5687f1373a934c854704dfe8896ad88ede55b03
```

Independent post-remediation disposition:

```text
PASS WITH NON-BLOCKING FINDINGS — SUITABLE FOR FORMAL DESIGN FREEZE
```

Finding disposition at freeze:

- A02-IR-F01: CLOSED BY REMEDIATION
- A02-IR-F02: CLOSED BY REMEDIATION
- A01-F02: OPEN — MINOR — NON-BLOCKING

The formal design freeze changes lifecycle and provenance records only.
It does not alter the reviewed A02 functional contract.

Therefore:

- A02 DESIGN: FORMALLY DESIGN FROZEN
- A02 FORMAL DESIGN FREEZE: PASS
- A02 CERTIFICATION: NOT CERTIFIED
- AUTOMATION IMPLEMENTATION: NOT AUTHORIZED
- A03: NOT STARTED
- PHASE 10: NOT COMPLETE

A01 remains formally design frozen and not certified.

A01-F02 remains OPEN — MINOR — NON-BLOCKING and is not remediated by A02.

No later Phase 10 workstream is declared complete by this specification.

---

END OF PHOENIX AUTOMATION FUNCTION SPECIFICATION v1.0
