# PHOENIX AUTOMATION ARCHITECTURE v1.0

STATUS: **FORMALLY DESIGN FROZEN — NOT CERTIFIED**

IMPLEMENTATION: **NOT AUTHORIZED**

PUBLIC AUTOMATION API: **NOT DEFINED BY A01**

## 1. Purpose

This document freezes the candidate architecture boundary for the Phoenix DevKit Automation layer. It defines Automation responsibilities, non-authority boundaries, integration eligibility, mutation controls, execution and failure rules, and relationships with existing domains. It does not authorize implementation, define a public Automation API, certify the architecture, or complete Phase 10.

The central principle is: **Automation orchestrates authority. Automation does not become authority.**

## 2. Architectural Authority

### 2.1 Governing Sources

This architecture is governed by certified or explicitly authorized public contracts owned by Phoenix DevKit domains, the frozen A01 evidence from Passes 1–4, and the boundary decisions recorded here. A mention, example, private helper, filesystem artifact, or technically callable function is not a governing public contract.

### 2.2 Automation Authority

Automation owns only authorized workflow orchestration: explicit dispatch, deterministic sequencing, precondition coordination, evidence coordination, and faithful propagation of domain results. It has no inherent authority to mutate state, certify outcomes, approve process gates, release artifacts, deploy systems, or redefine lower-layer semantics.

### 2.3 Semantic Authority Preservation

When Automation invokes another domain, semantic authority remains with that domain. Automation must preserve the invoked domain's inputs, preconditions, sequencing requirements, result classifications, failure behavior, mutation behavior, and documented limitations.

### 2.4 Architecture vs Implementation Authorization

This document freezes an architecture candidate only. Architectural authorization identifies which integration relationships may be valid; it does not authorize implementation or any particular mutation. Implementation remains **NOT AUTHORIZED**, and A01 defines no public Automation API.

## 3. Position in Phoenix DevKit

### 3.1 Layer Position

Automation is a higher-level orchestration concern above the public surfaces it coordinates.

```text
CALLER / CLI / AUTHORIZED PROCESS
               |
               v
        AUTOMATION LAYER
               |
               v
    AUTHORIZED PUBLIC SURFACES
               |
     +---------+---------+
     |         |         |
     v         v         v
 Generator  Validator  Atlas ...
     Core / Template / Plugin as authorized
```

### 3.2 Dependency Direction

Dependencies flow from callers into Automation and from Automation into explicitly authorized public surfaces. Lower domains must not depend on Automation merely because Automation orchestrates them. Automation must not become a semantic dependency of lower certified domains.

### 3.3 Relationship with Existing Certified Domains

Automation consumes eligible capabilities without absorbing their ownership. Certification of a domain does not automatically make every capability in that domain eligible, and eligibility must be determined by capability class rather than by domain name alone.

### 3.4 Higher-Level Consumers

A caller, CLI, or authorized process may eventually consume a frozen public Automation surface. Such consumption cannot expand Automation authority, bypass workflow authorization, or transfer semantic authority from an invoked domain. A public Automation surface is deferred to A02.

## 4. Automation Responsibilities

### 4.1 Workflow Orchestration

Automation coordinates authorized capabilities into explicit workflows while preserving ownership boundaries and lower-domain contracts.

### 4.2 Execution Sequencing

Automation executes declared steps in deterministic order and preserves any plan, validate, precondition, and execute sequence required by the invoked domain.

### 4.3 Preconditions

Automation evaluates or delegates documented preconditions before invocation. It must stop when a required precondition is absent or fails and must not silently infer satisfaction.

### 4.4 Evidence Coordination

Automation may collect, label, and organize technical evidence emitted by authorized operations. Evidence coordination does not confer authority to interpret that evidence as certification, release authorization, deployment authorization, or PDS PASS.

### 4.5 Failure Propagation

Automation preserves domain-defined failure and partial-state information. It may add workflow context but must not erase, flatten, or reclassify meaningful lower-layer outcomes.

### 4.6 CLI-Accessible Automation

Future Automation capabilities may be exposed through CLI only after A02 freezes a public Automation contract. CLI accessibility will not make CLI the semantic owner of Automation workflows.

## 5. Non-Authority Boundary

### 5.1 Core

Automation does not own Core semantics and must not classify Core globally as orchestrable. Eligibility is determined per capability.

### 5.2 Template Engine

Automation does not own rendering, placeholder, escaping, or template interpretation semantics. Template content remains data and must not become executable shell content.

### 5.3 Generator

Automation does not own Generator planning, validation, execution, registration, conflict, or result semantics.

### 5.4 Validator

Automation does not own validation rules or the meanings of `VALID`, `INVALID`, and `ERROR`.

### 5.5 Atlas

Automation does not own Atlas SDK semantics and may not manufacture APIs for responsibilities excluded from the frozen Atlas surface.

### 5.6 Plugin

Automation does not own Plugin discovery, query, bootstrap, contribution, registry, or partial-state semantics.

### 5.7 CLI

Automation does not own command-line presentation, parsing, or user-facing dispatch. CLI does not own Automation workflow semantics.

### 5.8 Release Engine

Automation does not own Release Engine semantics or authority. The detailed canonical Release Engine contract remains unfrozen.

### 5.9 Operations / Deployment

Automation has no inherent operational deployment authority and technical workflow success does not authorize deployment.

### 5.10 PDS

Automation does not own PDS process governance, gates, certification decisions, or authority assignment.

### 5.11 Product / Business Logic

Automation must not contain application business logic or become product authority.

## 6. Public Integration Boundary

### 6.1 Public Contract Requirement

Automation may integrate only through a public contract owned by the invoked domain.

### 6.2 Authorized Surface Requirement

The owning domain must have certified or explicitly authorized the public capability for Automation use. Public visibility alone is insufficient when use is restricted or unresolved.

### 6.3 Private Helper Prohibition

Direct invocation of another domain's private helpers, bootstrap internals, contribution helpers, hidden paths, or private state is forbidden.

### 6.4 Callability vs Authorization

The following concepts are separate and must never be collapsed:

```text
Technical callability
!= public authority
!= orchestration eligibility
!= mutation authorization
```

- **Technical callability** means a function or capability physically exists and can technically be invoked.
- **Public authority** means the owning domain exposes it through a public contract.
- **Orchestration eligibility** means Automation is architecturally permitted to invoke that public capability.
- **Mutation authorization** means the specific workflow is authorized to permit that capability's side effects.

### 6.5 Domain Contract Preservation

Automation must invoke an eligible capability according to its owning contract and preserve its mandatory inputs, ordering, classifications, effects, and guarantees. Eligibility never permits semantic reinterpretation.

## 7. Orchestration Eligibility Model

These four states are exhaustive for Automation architecture and do not redefine the underlying capability's semantic meaning.

### 7.1 ORCHESTRABLE

A certified or explicitly authorized public capability suitable for Automation use without additional mutation authority beyond its normal read-only or deterministic contract.

### 7.2 CONDITIONAL

A public capability that may mutate files, registries, runtime state, or other governed state, or otherwise requires explicit workflow authority.

### 7.3 FORBIDDEN

A capability Automation must not consume, including private helpers, hidden paths, dynamic dispatch, filesystem-inferred capabilities, and explicitly prohibited interfaces.

### 7.4 UNRESOLVED

A capability whose public authority, integration contract, or ownership is not sufficiently frozen to permit Automation integration.

### 7.5 Eligibility Decision Rules

For each capability, Automation must establish in order: a real public contract, owning-domain authorization for integration, eligibility classification, and—when the operation is CONDITIONAL—workflow-specific mutation authority. Unresolved evidence produces `UNRESOLVED`, not inferred permission. Private or prohibited mechanisms produce `FORBIDDEN`, regardless of technical callability.

### 7.6 Eligibility Does Not Transfer Authority

Eligibility belongs to Automation architecture. It neither changes the capability's semantics nor transfers authority from the owning domain to Automation.

## 8. Read / Mutation Boundary

### 8.1 Read-Only Operations

Certified read-only deterministic public capabilities are preferred when they satisfy the engineering objective and may be `ORCHESTRABLE`.

### 8.2 Pure Transformations

Pure transformations with explicit inputs, deterministic outputs, and no governed-state effects may be `ORCHESTRABLE` when their public contract authorizes Automation use.

### 8.3 State Mutation

Operations that mutate runtime or governed state are `CONDITIONAL` and require explicit workflow authority.

### 8.4 Filesystem Mutation

Creation, modification, movement, or deletion of files is mutation. A public filesystem-mutating capability remains `CONDITIONAL` even when its result is deterministic.

### 8.5 Registry Mutation

Registration and other registry changes are `CONDITIONAL`. Automation must use the owning domain's public mutation surface and preserve its state and result semantics.

### 8.6 Destructive Operations

Destructive operations require explicit, bounded workflow authority and applicable lower-domain safeguards. Automation must not broaden targets or infer destructive permission.

### 8.7 Explicit Mutation Authorization

Mutation-capable operations require authorization for the specific workflow and effects. Architectural eligibility does not establish mutation authorization. Preference for read-only capability does not prohibit authorized mutation when mutation is required by the workflow.

## 9. Planning and Preflight Boundary

### 9.1 Mandatory Lower-Layer Planning

When an invoked domain requires planning, Automation must obtain and preserve that plan before execution.

### 9.2 Validation

Automation must perform or invoke mandatory validation before mutation and must preserve validation outcomes without semantic flattening.

### 9.3 Preconditions

Documented lower-domain and workflow preconditions must be checked before dispatch. Missing authority is a failed precondition, not a reason to infer permission.

### 9.4 Dry-Run

Where a domain exposes dry-run or an equivalent non-mutating mode, Automation may use it for preflight and evidence collection. Dry-run is not mandatory unless the owning contract requires it and does not itself authorize later mutation.

### 9.5 Conflict Detection

Automation must preserve domain-defined conflict detection and stop or result behavior. It must not silently resolve conflicts outside an explicit contract.

### 9.6 No Planning Bypass

Automation must not bypass required planning, validation, precondition, or execution sequencing through direct helper calls or alternative dispatch paths.

## 10. Workflow Execution Boundary

### 10.1 Deterministic Sequencing

Given equivalent declared input and certified state, Automation must select and sequence the same authorized steps.

### 10.2 Explicit Dispatch

Dispatch must use an explicit, bounded whitelist of eligible public capabilities. No inferred or dynamically constructed executable target is permitted.

### 10.3 Invocation State

Automation may track declared workflow state needed for coordination, but must not directly mutate another domain's private internal state or treat workflow state as semantic authority.

### 10.4 Lower-Layer Result Preservation

Domain-defined success, failure, partial-success, validation, and mutation results must be retained. Workflow summaries may add context without replacing those results.

### 10.5 Stop Conditions

Automation stops on failed required preconditions, missing authority, unresolved required capabilities, forbidden paths, lower-domain terminal failures, and any contract-defined stop condition. It must preserve partial state when stopping.

## 11. Failure and Partial-State Model

### 11.1 Failure Propagation

Failure propagation reports a lower-layer failure through the workflow without disguising its domain classification. It is distinct from fail-fast behavior.

### 11.2 Partial Mutation

Partial mutation means some governed state changed before failure. Automation must report and preserve that fact according to the lower contract.

### 11.3 Partial Success

Partial success is a domain or workflow classification indicating that only part of an operation succeeded. Automation must not rewrite it as complete success or generic failure.

### 11.4 Rollback

Rollback reverses prior effects. Automation may claim or invoke rollback only when an authorized domain contract explicitly provides it.

### 11.5 Compensation

Compensation is a subsequent action addressing prior effects and is not equivalent to rollback. It requires its own contract and authority.

### 11.6 Transactionality

Transactionality and atomicity are guarantees about grouped effects. Automation has no inherent transaction boundary across invoked domains.

### 11.7 No Invented Guarantees

Fail-fast, failure propagation, partial mutation, partial success, rollback, compensation, and transactionality are not synonyms. Automation must preserve invoked-domain failure and mutation semantics and must not invent rollback, compensation, atomicity, or transaction guarantees absent from that contract.

## 12. Security Boundary

### 12.1 Untrusted Input

Workflow, user, template, filesystem, and inferred definition data are untrusted until validated under an owning public contract. Untrusted data must never determine executable code paths outside explicit whitelists.

### 12.2 No eval

`eval` is forbidden for Automation dispatch, workflow interpretation, or execution.

### 12.3 No Dynamic Executable Construction

Automation must not construct executable function names, `bash -c` commands, or `sh -c` commands from user or workflow data. It must not `source` untrusted or inferred definition data.

### 12.4 No Filesystem Capability Discovery

Filesystem scanning or naming conventions must not be used to discover executable capabilities where explicit certified registration is required.

### 12.5 No Hidden Execution Paths

Undocumented aliases, indirect entry points, fallback execution routes, and other hidden dispatch paths are forbidden.

### 12.6 No Foreign Private Helpers

Automation must not call another domain's private helpers or directly mutate its private internal state.

### 12.7 Explicit Whitelisted Dispatch

All dispatch must map declared operations to a bounded set of eligible, certified or explicitly authorized public capabilities. Unknown entries fail closed.

## 13. Determinism

### 13.1 Equivalent Input / Certified State

Equivalent workflow input and equivalent certified domain state must produce equivalent capability selection, ordering, and orchestration outcomes, subject to explicit lower-domain results.

### 13.2 Stable Sequencing

Ordering must be declared and stable; directory order, incidental registration order, and hidden environmental discovery must not control execution.

### 13.3 Explicit Dependencies

Workflow dependencies and required public capabilities must be explicit and validated before execution.

### 13.4 No Silent Inference

Automation must not silently infer authority, capability availability, mutation permission, success, certification, release, deployment, or process-gate outcomes.

### 13.5 Fail Fast

Automation fails fast before further dispatch when a required dependency, authority, precondition, or deterministic mapping is missing. Fail-fast does not imply rollback of effects already produced.

## 14. CLI Boundary

### 14.1 CLI vs Automation

CLI and Automation are distinct architectural concerns. CLI is a consumer and adapter; Automation is an orchestration layer.

### 14.2 Presentation / Parsing Authority

CLI owns command-line presentation, parsing, help, and explicit user-facing dispatch under its own contract.

### 14.3 Automation Invocation

CLI may invoke future public Automation APIs only after A02 freezes and authorizes them. A direct private-module call is not an acceptable substitute.

### 14.4 No Semantic Duplication

Automation must not duplicate CLI parsing semantics, and CLI must not reimplement Automation workflow semantics.

### 14.5 Exit / Return Ownership

Automation owns its future domain return contract; CLI owns mapping that contract to command-line output and exit behavior, subject to the frozen public contracts of both domains. A01 defines neither mapping.

## 15. PDS Boundary

### 15.1 PDS != Automation

**PDS != Automation.** They are separate concerns and neither becomes the other through technical integration.

### 15.2 Process Authority

PDS owns engineering process governance. Automation does not decide PDS process states, gate outcomes, certification, or authority ownership.

### 15.3 Technical Mechanics

Automation may execute explicitly authorized technical mechanics that support a PDS-governed process while the invoked domains retain semantic authority.

### 15.4 Evidence Support

Automation may collect and organize evidence showing which authorized public boundaries and technical steps were used. Higher-level consumers remain responsible for providing evidence required by PDS.

### 15.5 Automated Success != PDS PASS

Automated technical success does not create PDS PASS, PDS certification, or PDS authority. The Core PDS architecture is formally design frozen, while PDS certification remains NOT READY / NOT CERTIFIED and implementation remains NOT AUTHORIZED; this architecture imports no unfrozen PDS implementation details, and PDS does not design Automation APIs.

## 16. Certification Boundary

### 16.1 Evidence Collection

Automation may collect deterministic evidence produced by eligible operations.

### 16.2 Test Execution

Automation may orchestrate authorized test execution when the test capability is eligible and any effects are authorized.

### 16.3 Evidence Organization

Automation may label, correlate, and organize evidence without changing its underlying meaning or provenance.

### 16.4 Independent Certification Authority

Certification decisions remain with the separately authorized certification process or authority. Evidence production and decision authority are distinct.

### 16.5 No Self-Certification

Automation must not self-certify its architecture, implementation, workflows, invoked domains, or outcomes. Successful execution is evidence, not certification.

## 17. Release Engine Boundary

### 17.1 Separate Architectural Domain

Release Engine is a separate architectural domain with authority that Automation does not inherit.

### 17.2 Current Unfrozen Contract

The detailed canonical Release Engine contract is not frozen. A01 must not infer its APIs, workflow, state, or semantics.

### 17.3 UNRESOLVED Release Capabilities

All prospective Release Engine capabilities are `UNRESOLVED` for Automation integration until an authoritative contract identifies and authorizes specific public surfaces.

### 17.4 Future Explicit Integration Contract

Future integration requires an explicit, certified or formally authorized Release Engine contract and a corresponding Automation eligibility decision. Technical callability or a suggestive name is insufficient.

### 17.5 Certification != Remote Closure != Release != Deployment

**CERTIFICATION != REMOTE CLOSURE != RELEASE != DEPLOYMENT.** Automation must preserve each boundary and must not infer one authority or outcome from another.

## 18. Domain Integration Matrix

Eligibility applies to capability classes, not whole domains.

| Domain | Capability class | Eligibility | Preserved boundary |
| --- | --- | --- | --- |
| Core | Certified pure/read-only/deterministic public capability | ORCHESTRABLE | Preserve each Core function contract |
| Core | Filesystem, destructive, or explicit runtime-state mutation | CONDITIONAL | Requires explicit workflow mutation authority |
| Template Engine | Pure rendering or placeholder inspection | ORCHESTRABLE | Template content remains data |
| Template Engine | Rendering to a destination file | CONDITIONAL | Filesystem write requires authority |
| Generator | Public planning and non-mutating dry-run/preflight | ORCHESTRABLE | Plan first; preserve Generator contract |
| Generator | Execution or registration | CONDITIONAL | Validate before mutation; execute explicitly |
| Validator | Frozen read-only deterministic validation | ORCHESTRABLE | Preserve `VALID`, `INVALID`, and `ERROR` |
| Atlas SDK | Actual frozen read-only public APIs | ORCHESTRABLE | Only frozen Atlas SDK v1.0 surface |
| Atlas SDK | Excluded, example, or manufactured responsibilities | FORBIDDEN | No inferred Atlas capability |
| Plugin | Public query/read capability | ORCHESTRABLE | Preserve Plugin semantics |
| Plugin | Public registry mutation | CONDITIONAL | Preserve public Plugin registration semantics |
| Plugin | Private bootstrap or contribution helper | FORBIDDEN | No private integration surface |
| CLI | Future frozen public Automation consumer path | UNRESOLVED | A02 must define Automation API |
| Release Engine | Any prospective integration | UNRESOLVED | Canonical contract not frozen |
| PDS | Any prospective direct Automation integration | UNRESOLVED | PDS is governance context; no public PDS-Automation runtime contract is frozen |

### 18.1 Core

Core is not globally orchestrable. Certified pure, read-only, deterministic capabilities may be `ORCHESTRABLE`; filesystem mutation, destructive operations, and explicit runtime-state mutation are `CONDITIONAL`.

### 18.2 Template Engine

Pure rendering and placeholder inspection may be `ORCHESTRABLE`. Rendering to files is `CONDITIONAL`. Automation must not introduce shell evaluation or execution into rendering.

### 18.3 Generator

Generator planning is a natural `ORCHESTRABLE` surface, and dry-run may support non-mutating preflight. Mutating execution and registration are `CONDITIONAL`. Automation preserves: plan first, validate before mutation, execute explicitly.

### 18.4 Validator

Validator execution is read-only and deterministic and may be `ORCHESTRABLE`. Automation must not mutate validation targets or convert `INVALID` into generic execution `ERROR`.

### 18.5 Atlas SDK

Automation may use only actual frozen Atlas SDK v1.0 read-only public APIs. Search Planner, Search State, STOP / EXPAND, Evidence Fusion, Entity Resolution, Decision Intelligence, recommendations, scraping, provider network retrieval, and Atlas refresh are not manufactured integration surfaces. Specification mentions and forbidden/example names do not make functions public.

### 18.6 Plugin

Public query/read capabilities may be `ORCHESTRABLE`; public Plugin registry mutation through the owning public contract is `CONDITIONAL`; private bootstrap and contribution helpers are `FORBIDDEN`. Plugin contribution application and its cross-registry partial-state workflow are not Automation integration surfaces in A01. Automation must not invoke, reproduce, or infer that private coordination workflow. Any future public contribution-coordination capability remains `UNRESOLVED` until the Plugin owner explicitly exposes and authorizes such a contract.

### 18.7 CLI

CLI and Automation remain distinct. Future CLI integration is `UNRESOLVED` until A02 freezes public Automation APIs. CLI presentation and parsing do not become Automation semantics.

### 18.8 Release Engine

Release Engine integration is `UNRESOLVED`. Automation must not infer public APIs, authority, or semantics while its detailed canonical contract remains unfrozen.

### 18.9 PDS

PDS is a governance context, not an invoked Automation runtime domain. Technical mechanics supporting a PDS-governed process remain owned, authorized, and classified under their actual DevKit domains. Any prospective direct PDS-Automation integration remains `UNRESOLVED` until an authoritative public contract is frozen and explicitly authorized. Unfrozen PDS internals are outside A01.

## 19. Architectural Invariants

### A01-I01

Automation orchestrates authority. Automation does not become authority.

### A01-I02

Semantic authority remains with the invoked domain.

### A01-I03

Automation may consume only public integration surfaces that the owning domain has certified or explicitly authorized for that use.

### A01-I04

Automation must never depend directly on private helpers belonging to another domain.

### A01-I05

Technical callability does not establish architectural authorization.

### A01-I06

Architectural authorization does not establish mutation authorization.

### A01-I07

When an engineering objective can be satisfied through a certified read-only deterministic capability, Automation should prefer that capability over a mutating alternative. This preference does not prohibit authorized mutation when mutation is required by the workflow.

### A01-I08

Mutation-capable operations require explicit workflow authority.

### A01-I09

Automation must preserve mandatory planning, validation, precondition, and execution sequencing defined by the invoked domain. Where a domain exposes dry-run or an equivalent non-mutating mode, Automation may use it for preflight and evidence collection but must not reinterpret it as mandatory unless the owning domain contract requires it.

### A01-I10

Automation must preserve domain-defined success, failure, partial-success, and result classifications.

### A01-I11

Automation must not invent rollback, compensation, transactionality, or atomicity guarantees absent from the invoked domain contract.

### A01-I12

Filesystem capability discovery, dynamically constructed executable function names, and hidden execution paths are forbidden integration mechanisms.

### A01-I13

Automated technical success does not create certification authority, PDS gate PASS, release authorization, or deployment authorization.

### A01-I14

Automation must not assume Release Engine authority while the detailed canonical Release Engine contract remains unfrozen.

### A01-I15

Automation does not own PDS process authority.

## 20. Forbidden Patterns

### 20.1 Private Cross-Layer Calls

Direct calls to another domain's private helpers, internal bootstrap paths, contribution helpers, or private state are forbidden.

### 20.2 Dynamic Dispatch

Executable targets must not be built dynamically from workflow or user data, invoked through `eval`, or routed through data-derived `bash -c` or `sh -c` commands.

### 20.3 Filesystem Discovery

Filesystem scanning, filenames, or directory layout must not substitute for explicit certified capability registration.

### 20.4 Semantic Reimplementation

Automation must not copy, approximate, override, or reinterpret semantics owned by Core, Template Engine, Generator, Validator, Atlas, Plugin, CLI, Release Engine, Operations, PDS, or product logic.

### 20.5 Implicit Mutation

No mutation may occur as an undeclared side effect, under read-only authority, or through inferred workflow permission.

### 20.6 Invented Rollback

Automation must not claim rollback, compensation, cross-domain atomicity, or transactional guarantees not provided by the invoked contracts.

### 20.7 Self-Certification

Automation must not treat its own technical results or evidence as authority to self-certify.

### 20.8 PDS Gate Inference

Automation must not infer PDS PASS, certification, or process authority from successful commands, tests, or evidence collection.

### 20.9 Release Authority Assumption

Automation must not infer remote closure, release, deployment, or Release Engine authority from certification or technical success.

## 21. Known Limitations and Open Boundaries

### 21.1 Release Contract Not Frozen

The detailed canonical Release Engine contract is unfrozen; Release integration remains `UNRESOLVED`.

### 21.2 PDS Detailed Contract External

The Core PDS architecture is formally design frozen, while PDS certification remains NOT READY / NOT CERTIFIED and implementation remains NOT AUTHORIZED. Only stable boundary compatibility is used here; no unfrozen PDS internals are imported.

### 21.3 A01-F02 Generator Documentation Drift

`A01-F02 — Generator Public API Summary Count Drift` is classified as **DOCUMENTATION CONTRACT DRIFT**, severity **MINOR**, with **NONE OBSERVED** runtime impact and **NO** freeze-blocker status. One Generator specification summary says three public capabilities, while explicit contracts also define `generator_register` as public. The owning Generator contract remains authoritative. This finding is recorded but is not remediated in this pass, and Automation must not infer the public surface from inconsistent summary counts.

### 21.4 Future Capabilities Not Authorized

Future, proposed, example, or discoverable capabilities are not authorized by this architecture. They remain `UNRESOLVED` or `FORBIDDEN` until their owning contracts and Automation eligibility are explicitly established.

## 22. Evolution and Compatibility Rules

### 22.1 Architecture Revision

Changes to frozen responsibilities, authority boundaries, eligibility states, or invariants require a versioned architecture review and independent certification; implementation must not silently revise architecture.

### 22.2 New Domain Integration

Each new domain integration requires an identified owner, frozen or formally authorized public contract, capability-level eligibility decision, dependency-direction check, and mutation classification.

### 22.3 New Public Automation Surface

New public Automation capabilities require explicit API design and freeze in the authorized workstream. A01 does not define or authorize them.

### 22.4 Eligibility Reclassification

Reclassification requires authoritative evidence of changed public authority, integration suitability, ownership, or mutation behavior. Technical availability alone is insufficient.

### 22.5 Contract Change Handling

When an invoked domain contract changes, affected Automation eligibility and workflow assumptions must be revalidated before use. Automation must fail closed rather than silently adapt through inference.

## 23. Architecture Decision

### 23.1 Frozen Responsibilities

The frozen candidate responsibilities are authorized workflow orchestration, deterministic sequencing, precondition coordination, evidence coordination, explicit bounded dispatch, and faithful failure/result propagation across eligible public domain surfaces.

### 23.2 Frozen Non-Responsibilities

Automation does not own lower-domain semantics, private integration paths, mutation authority by default, certification, PDS governance, release, remote closure, deployment, application business logic, or product authority.

### 23.3 Implementation Authorization State

Implementation is **NOT AUTHORIZED**. The A01 architecture is **FORMALLY DESIGN FROZEN — NOT CERTIFIED**. The formal design-freeze decision is `PASS` for the independently reviewed A01 architecture candidate with SHA-256 `a5c1b840d12a32757de0880e15c576510941bf01ae75654fcb23373facc41c89` (663 lines; 32,447 bytes). Independent review disposition: **PASS WITH NON-BLOCKING FINDINGS**; open finding `A01-F02 — Generator Public API Summary Count Drift` remains **MINOR / NON-BLOCKING**. This formal design freeze does not claim certification, implementation authorization, implementation completion, public Automation API authorization, A02 authorization, or Phase 10 completion.

### 23.4 Next Workstream

The next architecture workstream is A02, which may define and freeze a public Automation API only under separate explicit authorization. No implementation or API design is performed by this A01 candidate.
