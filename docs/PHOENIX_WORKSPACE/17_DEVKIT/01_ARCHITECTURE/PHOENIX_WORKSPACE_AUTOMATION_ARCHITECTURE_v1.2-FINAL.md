# PHOENIX WORKSPACE AUTOMATION ARCHITECTURE v1.2

**Status:** DESIGN CANDIDATE — POST-REMEDIATION
**Workstream:** Phase 10 — A05 Workspace Automation
**Lifecycle:** READY FOR INDEPENDENT POST-REMEDIATION RE-REVIEW
**Implementation:** NOT AUTHORIZED
**Certification:** NOT CERTIFIED
**Formal Design Freeze:** NOT PERFORMED

---

# 1. Purpose

Phoenix Workspace Automation defines safe, deterministic and repeatable orchestration of workspace-specific engineering operations through existing certified or explicitly authorized Phoenix capabilities.

A05 does not create a new filesystem abstraction, workflow engine, validation framework, generator framework or authorization authority.

Its purpose is to establish the workspace-specific contract required to safely coordinate existing capabilities when operations may inspect, validate or mutate an explicitly resolved workspace.

Architectural objective:

```text
EXPLICIT VERIFIED WORKSPACE
        ↓
AUTHORIZED WORKFLOW
        ↓
AUTHORIZED SEMANTIC CAPABILITY
        ↓
BOUNDED OPERATION
        ↓
PRESERVED AUTHORITATIVE DOMAIN RESULT
```

Automation orchestrates. The owning domain remains authoritative.

# 2. Scope

A05 scope includes workspace claim and authoritative resolution; canonical workspace root; workspace context and scope; authorized targets and effects; effective filesystem target containment; workflow-specific mutation authorization; current authorization applicability; capability eligibility and semantic ownership; mutation dispatch gating; planning and validation preservation; preconditions and postconditions; conflict/overwrite preservation; repeatability; partial-state preservation; execution evidence provenance; destructive-operation bounding; and integration with A03.

A05 does not redefine Core Filesystem, Generator, Validation, Manifest, Logger, Plugin, Atlas, CLI, A03 workflow semantics, A04 certification authority, A06 recovery, A07 release, A08 CLI integration or A10 certification.

# 3. Governing Principles

```text
DECLARED WORKSPACE != VERIFIED WORKSPACE
MUTATION_MODE=MUTATING != MUTATION AUTHORITY
AUTHORITY_REFERENCE != VERIFIED AUTHORIZATION
LEXICAL PATH CONTAINMENT != EFFECTIVE TARGET CONTAINMENT
PREVIOUSLY VERIFIED AUTHORIZATION != CURRENTLY APPLICABLE AUTHORIZATION
TECHNICAL FILESYSTEM EQUIVALENCE != SEMANTIC AUTHORITY
OBSERVE != OWN
RECORD != AUTHORIZE
PRESERVE != CERTIFY
```

Only these public Automation result planes exist:

```text
RESULT_PLANE=REQUEST_FAILURE
RESULT_PLANE=ORCHESTRATION_FAILURE
RESULT_PLANE=DOMAIN_RESULT
```

A05 introduces no fourth RESULT_PLANE and no new A03 workflow state.

# 4. Workspace Claim and Resolution

```text
WorkspaceClaim
  claimedWorkspaceId
  claimedWorkspaceRoot
  sourceReference
```

A WorkspaceClaim is untrusted input.

```text
WorkspaceResolution
  workspaceId
  canonicalWorkspaceRoot
  resolutionSource
  resolutionSourceIdentity
  resolutionStatus
```

Candidate internal resolution statuses:

```text
VERIFIED
UNRESOLVED
AMBIGUOUS
CONFLICTED
INVALID
```

Only VERIFIED may proceed toward mutation-capable orchestration. These are internal A05 resolution states, not A03 workflow states or result planes.

A current working directory, caller path, environment variable, repository marker, nearest `.git`, writable directory or arbitrary filesystem discovery does not become authoritative merely by existence.

A conflicting or ambiguous resolution fails closed. A materially changed workspace resolution is a new authorization context even if textual `workspaceId` remains unchanged.

```text
WorkspaceContext
  workspaceId
  canonicalWorkspaceRoot
  workspaceKind
  workspaceResolution
```

Candidate v1.0 direction:

```text
ONE WORKSPACE
ONE CANONICAL ROOT
```

# 5. Workspace Scope

```text
WorkspaceScope
  workspaceId
  allowedTargets
  excludedTargets
  allowedEffects
```

Governing precedence:

```text
EXPLICIT EXCLUSION OVERRIDES INCLUSION
```

Ambiguous scope fails closed.

Target authorization does not imply effect authorization.

```text
CREATE != OVERWRITE
WRITE != REMOVE
READ != MUTATE
```

# 6. Workspace Request and Operation

```text
WorkspaceRequest
  requestId
  workflowId
  workflowVersion
  workspaceClaim
  requestedOperation
  targetCapability
  mutationMode
  target
  intendedEffect
  authorityReference
```

A request is input, not authority.

```text
WorkspaceOperation
  operationId
  workflowId
  stepId
  workspaceId
  targetCapability
  mutationMode
  target
  intendedEffect
  authorityReference
  preconditions
  postconditions
```

WorkspaceOperation specializes an A03 workflow step and does not create a second execution engine.

# 7. Capability Resolution and Semantic Ownership

Each operation resolves through explicit bounded mappings to an authoritative public Phoenix capability.

Forbidden: function-name construction, shell discovery, private helper discovery, filesystem scanning, inferred aliases and dynamic evaluation.

If a higher-level Phoenix domain semantically owns an operation, that domain remains authoritative.

Example:

```text
generate artifact -> Generator Framework
```

not direct Core write primitives.

A05 must not downgrade to a lower-level capability to escape planning, validation, conflict, overwrite, failure or authority semantics.

```text
SAME FINAL FILESYSTEM SHAPE
!= SAME AUTHORITY
!= SAME SEMANTICS
!= SAME CONTRACT
```

# 8. Direct Core Filesystem Mutation Boundary

Core Filesystem is not an implicit fallback.

If semantic ownership is unresolved:

```text
NO IMPLICIT CORE FALLBACK
```

and safe orchestration fails closed.

Candidate concept:

```text
CoreWorkspaceOperationClass
  operationClassId
  permittedCoreCapability
  permittedEffect
  scopeRequirements
  authorizationRequirements
  semanticJustification
  eligibilityStatus
```

Direct Core mutation requires all of:
1. explicit A05 Core workspace-operation classification;
2. certified/authorized Core capability;
3. owning-domain permission;
4. verified and currently applicable workflow authorization;
5. verified workspace scope, target and effect;
6. no bypass of a higher-level domain.

Authorization for one Core function does not authorize another.

# 9. Mutation Authorization

```text
WorkspaceMutationAuthorization
  authorizationId
  workflowId
  stepId
  workspaceResolutionIdentity
  workspaceId
  targetCapability
  targetScope
  allowedEffect
  authorityReference
  authorityBasis
  verificationStatus
  applicabilityStatus
```

```text
AUTHORIZATION EXISTS
!= AUTHORIZATION VERIFIED
!= AUTHORIZATION CURRENTLY APPLICABLE
```

Candidate applicability states:

```text
APPLICABLE
NOT_APPLICABLE
UNRESOLVED
STALE
```

Only VERIFIED + APPLICABLE may permit mutating dispatch.

Authorization applicability is cumulatively bound to workflow, step, verified workspace resolution, capability, target scope, effect and authority basis.

Same textual workspaceId is insufficient.

A05 must not silently refresh, broaden, transfer or rebind authorization.

# 10. Effective Target and Path Security

```text
WorkspaceTargetResolution
  declaredTarget
  normalizedTarget
  canonicalWorkspaceRoot
  effectiveTarget
  targetScope
  resolutionStatus
  observedAt
```

`observedAt` is provenance only, not hidden decision authority.

```text
LEXICAL CONTAINMENT != EFFECTIVE FILESYSTEM CONTAINMENT
```

Symlink, alias, indirection, mount or alternate representation must not permit escape from authorized scope.

At the mutation gate the effective target must remain inside:

```text
canonicalWorkspaceRoot
∩ authorized WorkspaceScope
∩ authorized targetScope
```

A previously safe target is not assumed currently safe after material resolution change.

For creation of an absent target, the effective existing parent path must remain in authorized scope.

A05 does not claim perfect TOCTOU elimination or transactional filesystem isolation.

# 11. Preconditions, Planning and Validation

Before mutation A05 must establish:
- verified workspace;
- verified scope;
- eligible semantic capability route;
- valid mutation mode;
- VERIFIED + APPLICABLE workflow authorization;
- authorized effective target;
- authorized effect;
- owning-domain preconditions;
- required planning;
- required validation.

Where required:

```text
PLAN FIRST
VALIDATE BEFORE MUTATION
EXECUTE EXPLICITLY
```

Dry-run/preflight is non-mutating and does not authorize later mutation.

# 12. Final Mutation Gate

```text
WORKSPACE VERIFIED
AND SCOPE VERIFIED
AND EFFECTIVE TARGET VERIFIED
AND EFFECT AUTHORIZED
AND SEMANTIC OWNER RESOLVED
AND CAPABILITY ELIGIBLE
AND NO DOWNGRADE BYPASS
AND WORKFLOW AUTHORIZATION VERIFIED
AND AUTHORIZATION CURRENTLY APPLICABLE
AND OWNING-DOMAIN PRECONDITIONS SATISFIED
AND REQUIRED PLANNING COMPLETE
AND REQUIRED VALIDATION COMPLETE

→ MUTATING DISPATCH MAY PROCEED
```

Otherwise: NO MUTATING DISPATCH.

# 13. Domain Result Preservation

Once an authoritative domain capability is dispatched and produces a valid result:

```text
RESULT_PLANE=DOMAIN_RESULT
```

remains authoritative.

A05 preserves authoritative domain machine-readable stdout and shell status unchanged and does not rename, synthesize, normalize or reinterpret domain semantics.

# 14. Postconditions and Post-Dispatch Semantics

```text
WorkspacePostconditionRecord
  operationId
  postconditionId
  expectedCondition
  observedCondition
  observationStatus
  observationSource
  observedAt
```

Candidate internal observation states:

```text
SATISFIED
NOT_SATISFIED
UNRESOLVED
OBSERVATION_ERROR
```

If an authoritative DOMAIN_RESULT exists and a required postcondition is NOT_SATISFIED or cannot be established:
- preserve DOMAIN_RESULT;
- preserve domain shell status;
- record postcondition evidence;
- preserve known partial state;
- stop later governed steps when safe continuation depends on it.

```text
AUTHORITATIVE DOMAIN RESULT
+
REQUIRED POSTCONDITION NOT SATISFIED
+
CONTINUATION NOT SAFE
=
WORKFLOW_STATUS=STOPPED
RESULT_PLANE=DOMAIN_RESULT
POSTCONDITION EVIDENCE PRESERVED
```

No retroactive ORCHESTRATION_FAILURE solely because of the postcondition result.

Observation does not grant retry, repair, rollback, cleanup, overwrite or regeneration authority.

# 15. Repeatability and Conflict Semantics

Equivalent valid requests against equivalent authorized state produce equivalent orchestration decisions.

Changed workspace state may legitimately produce different authoritative domain outcomes.

Owning-domain conflict and idempotency semantics remain authoritative.

Repeatability does not imply automatic success, overwrite, retry, resume, regeneration, repair or conflict resolution.

Higher-level conflicts must not be bypassed through lower-level capabilities.

# 16. Partial-State Model

A05 is not implicitly transactional.

Prior successful mutations remain real after later workflow stop/failure unless an independently authorized reversal occurs.

Execution evidence preserves completed steps, prior mutations, authoritative results, postcondition failures/uncertainty, known partial state, unknown state and NOT_ATTEMPTED later operations.

STOPPED does not imply rollback, recovery, transaction abort or restored workspace.

# 17. Evidence Provenance

```text
WorkspaceEvidenceRecord
  evidenceId
  workflowId
  stepId
  operationId
  evidenceKind
  evidenceSource
  evidenceSourceIdentity
  semanticOwner
  provenanceClass
  evidenceReference
  observationStatus
```

Candidate provenance classes:

```text
AUTHORITATIVE_DOMAIN
A05_OBSERVATION
A05_DERIVED
EXTERNAL_REFERENCE
UNRESOLVED
```

Authoritative domain evidence remains distinct from A05 observations and derived evidence.

Evidence remains bound to workflow/step/operation.

Caller declaration must not be elevated to authoritative evidence.

`AUTHORITY_REFERENCE`, verified authorization, and current applicability remain distinct.

Historical evidence must not be rewritten because the workflow stopped.

Execution evidence does not establish mutation, certification, recovery, release, remote closure or deployment authority.

# 18. Result and Failure Model

REQUEST_FAILURE applies to malformed/unsupported requests before authorized dispatch.

ORCHESTRATION_FAILURE applies when a structurally valid request cannot be safely or authoritatively orchestrated before an authoritative domain result owns the terminal condition.

DOMAIN_RESULT remains domain-owned after authoritative dispatch.

`WORKFLOW_STATUS=STOPPED` does not itself determine RESULT_PLANE.

No synthetic aggregate domain result and no fourth RESULT_PLANE exist.

# 19. Determinism

Equivalent valid requests against equivalent authorized state must produce equivalent orchestration decisions.

Decisions must not depend implicitly on current time, random values, unordered filesystem enumeration, undocumented environment state, private-helper availability, shell discovery or current-directory assumptions.

Provenance timestamps must not silently become decision authority.

# 20. Integration Boundaries

A03 owns workflow identity, step identity, ordering, workflow/step states, sequencing, terminal behavior and generic execution-record semantics.

Core Filesystem owns low-level filesystem semantics.

Generator owns generator planning, conflict, overwrite, validation and execution semantics.

Validation remains deterministic and read-only.

Manifest and Logger do not become mutation/authorization authorities.

Plugin integration preserves certified public/private and mutation boundaries.

A05 does not manufacture Atlas capability.

A04 certification boundary remains authoritative: A05 evidence is evidence only.

A06 owns backup/recovery.
A07 owns release.
A08 owns CLI integration.
A10 owns final certification.

# 21. Forbidden Behaviors

Forbidden:
1. implicit workspace selection;
2. workspace authority by caller declaration;
3. mutation authority by public visibility;
4. authority by filesystem accessibility;
5. capability downgrade bypass;
6. implicit Core fallback;
7. planning bypass;
8. validation bypass;
9. silent conflict resolution;
10. automatic overwrite;
11. universal idempotency assumption;
12. automatic retry/resume;
13. automatic repair;
14. invented rollback;
15. invented transactionality;
16. lexical-only path authorization;
17. path/symlink/alias escape;
18. dynamic shell execution;
19. dynamic capability discovery;
20. result reclassification;
21. synthetic fourth result plane;
22. evidence fabrication;
23. self-certification;
24. recovery inference;
25. release inference;
26. authority leakage across steps;
27. authority leakage across targets;
28. authority leakage across effects;
29. authority leakage across workspaces;
30. silent authorization rebinding;
31. cross-Core-capability escalation;
32. historical evidence rewriting.

# 22. Automation Public Interface Compatibility

A05 introduces no new public Automation function.

The sole public Automation v1.0 entry point remains:

```text

phoenix::automation_run

```


# 23. Candidate Internal Helpers

Possible responsibilities:
- validate workspace claim;
- resolve workspace;
- resolve scope;
- resolve effective target;
- verify containment;
- classify effect;
- resolve semantic owner;
- verify authorization/current applicability;
- observe postconditions;
- assemble provenance-preserving evidence.

Private helpers remain private and must not hide mutation.

# 24. Test Obligations

When implementation is later authorized, minimum testability must cover workspace resolution, root stability, scope/exclusion precedence, effects, traversal/symlink/alias escape, absent-target parent containment, authorization binding/staleness, semantic-owner resolution, Core fallback/downgrade rejection, planning/validation, dry-run non-authority, conflicts/overwrite, idempotency, changed-state repeatability, postcondition failure, DOMAIN_RESULT preservation, STOPPED+DOMAIN_RESULT, partial-state preservation, evidence provenance, result-plane preservation, shell-data safety and authority leakage.

A09 owns full Automation test design.

# 25. A05 Candidate Invariants

A05-I01 Workspace identity must be resolved explicitly.
A05-I02 Workspace root must be explicitly or authoritatively resolved by a higher-level workspace contract and not inferred by Core Filesystem.
A05-I03 Filesystem path validity or accessibility does not establish workspace authorization.
A05-I04 Public visibility, certification or technical callability of a mutation-capable function does not establish workflow-specific authorization.
A05-I05 Owning-domain mutation permission and workflow-specific mutation authorization are distinct cumulative requirements.
A05-I06 `MUTATION_MODE=MUTATING` does not grant mutation authority.
A05-I07 `AUTHORITY_REFERENCE` is authorization input/evidence, not authority by declaration.
A05-I08 No mutation-capable domain function may be dispatched before required mutation authority is verified.
A05-I09 A05 must preserve owning-domain mutation semantics, limits, preconditions and safeguards.
A05-I10 A05 must not reinterpret authoritative domain result fields or semantic outcomes.
A05-I11 A05 must preserve authoritative domain shell return status where A02/A03 applies.
A05-I12 A05 introduces no fourth public `RESULT_PLANE`.
A05-I13 `WORKFLOW_STATUS=STOPPED` does not itself imply `ORCHESTRATION_FAILURE`.
A05-I14 A valid authoritative domain terminal result may stop a workflow while preserving `RESULT_PLANE=DOMAIN_RESULT`.
A05-I15 Prior successful mutations and known partial-state evidence remain preserved after later stop/failure.
A05-I16 Workflow stop/failure must not imply rollback, compensation, transactionality or atomicity.
A05-I17 `WORKFLOW_STATUS=COMPLETED` does not establish domain success, workspace validity or certification.
A05-I18 Workflow completion does not establish release, remote closure or deployment authority.
A05-I19 A05 must not acquire A06 Recovery, A07 Release, A08 CLI or A10 Certification authority.
A05-I20 Safe repeatability preserves owning-domain conflict and idempotency semantics.
A05-I21 Repeatability does not imply automatic overwrite, regeneration, repair or conflict resolution.
A05-I22 A05 must not introduce automatic retry or resume outside A03.
A05-I23 Higher-level domain conflict/restriction must not be bypassed through lower-level mutation capability.
A05-I24 Explicit overwrite authorization remains bounded by owning-domain semantics and workflow-specific authorization.
A05-I25 Equivalent valid requests against equivalent authorized state produce equivalent orchestration decisions.
A05-I26 Changed workspace state may produce a different domain outcome without violating determinism.
A05-I27 Domain-defined idempotency remains domain-specific.
A05-I28 A05 preserves required planning, validation, precondition and execution sequencing.
A05-I29 Dry-run/preflight does not itself authorize subsequent mutation.
A05-I30 Unknown workspace/partial state remains unknown and is not fabricated as restored/completed.
A05-I31 Authorization for one workflow step does not silently authorize another.
A05-I32 Authorization for one target scope does not silently authorize another target.
A05-I33 Authorization for one effect does not silently authorize another effect.
A05-I34 Authorization for one workspace does not silently authorize another.
A05-I35 Target resolution prevents authorized mutation escaping canonical workspace boundary.
A05-I36 A05 preserves authoritative higher-level semantic owner when one exists.
A05-I37 Lower-level technical equivalence must not bypass higher-level rules.
A05-I38 Workspace request, target, capability and authority-reference data remain inert.
A05-I39 A05 fails closed when identity, scope, eligibility or mutation authorization cannot be established.
A05-I40 Workspace execution evidence does not establish certification, recovery, release or deployment authority.
A05-I41 Declared workspace identity/root/source does not establish verified workspace identity/root.
A05-I42 Previously verified authorization does not establish current authorization applicability.
A05-I43 Lexical path containment does not establish effective target containment.
A05-I44 Post-dispatch workspace observation failure must not erase/rewrite authoritative domain result.
A05-I45 Core Filesystem must not be implicit fallback when semantic ownership is unresolved.
A05-I46 Previously verified target applicability is not assumed current after material target-resolution change.
A05-I47 For absent-target creation, lexical destination is insufficient when effective parent escapes authorized boundary.
A05-I48 Workspace mutation authorization binds to verified WorkspaceResolution for current execution.
A05-I49 Authorization applicability preserves workflow, step, workspace-resolution, capability, target-scope, effect and authority-basis bindings.
A05-I50 A05 must not silently refresh, broaden, transfer or rebind authorization.
A05-I51 Workspace postcondition status is orchestration evidence distinct from domain result.
A05-I52 Required failed/unresolved postcondition prevents later governed steps where safe continuation depends on it.
A05-I53 Postcondition failure/uncertainty does not authorize repair, retry, rollback, cleanup, overwrite or mutation.
A05-I54 Every direct Core mutation belongs to explicitly recognized bounded A05 workspace operation class.
A05-I55 Higher-level semantic owner must not be reproduced through Core primitives.
A05-I56 Equivalent filesystem effect does not establish semantic equivalence, eligibility or authority.
A05-I57 Authorization for one Core mutation capability does not authorize another.
A05-I58 Explicit target exclusions override inclusions.
A05-I59 Ambiguous workspace scope applicability fails closed.
A05-I60 Target authorization does not imply all effects.
A05-I61 Material execution evidence preserves provenance classes.
A05-I62 Execution evidence remains bound to workflow/step/operation.
A05-I63 A05 does not elevate caller declarations, observations, derived conclusions or external references into authoritative domain evidence without contract.
A05-I64 Workflow stop/failure does not erase/rewrite authoritative results, mutations, partial-state evidence or observations.
A05-I65 Execution evidence does not itself establish mutation, certification, release, recovery, remote closure or deployment authority.

# 26. PASS 4 Findings / PASS 5 Remediation

A05-AR-F01 Workspace Authority Source Unresolved — MAJOR — REMEDIATED, PENDING INDEPENDENT RE-REVIEW.
A05-AR-F02 Symlink/Alias/Effective-Target Binding Incomplete — MAJOR — REMEDIATED, PENDING INDEPENDENT RE-REVIEW.
A05-AR-F03 Stale Authorization/Binding Incomplete — MAJOR — REMEDIATED, PENDING INDEPENDENT RE-REVIEW.
A05-AR-F04 Postcondition Failure Semantics Ambiguous — MAJOR — REMEDIATED, PENDING INDEPENDENT RE-REVIEW.
A05-AR-F05 Direct Core Filesystem Mutation Boundary Unresolved — MAJOR — REMEDIATED, PENDING INDEPENDENT RE-REVIEW.
A05-AR-F06 Workspace Scope Precedence Incomplete — MINOR — REMEDIATED, PENDING INDEPENDENT RE-REVIEW.
A05-AR-F07 Execution Evidence Provenance Incomplete — MINOR — REMEDIATED, PENDING INDEPENDENT RE-REVIEW.

Internal PASS 6 regression: F01-F07 PASS; A01/A02/A03/A04 boundaries PASS; result plane/workflow state/mutation authority/semantic ownership/fail-closed/determinism/evidence/certification boundaries PASS; new internal findings 0.

These are non-independent internal results only.

# 27. Open Questions for Independent Review

1. Is ONE WORKSPACE / ONE CANONICAL ROOT sufficiently bounded for v1.0?
2. Does WorkspaceResolution create hidden authority or circular trust?
3. Is effective-target architecture sufficient without falsely claiming race-freedom?
4. Is current authorization applicability strongly enough bound?
5. Does F04 preserve A02/A03 when DOMAIN_RESULT exists but postcondition fails?
6. Does CoreWorkspaceOperationClass accidentally create a second semantic authority?
7. Are scope exclusions/effects deterministic and fail-closed?
8. Is evidence provenance strong enough without becoming certification authority?
9. Do internal status vocabularies accidentally create public workflow states/result planes?
10. Do any remediation rules leak into A06/A07/A08/A10?

# 28. Lifecycle State

```text
PASS 1 FORENSIC DISCOVERY                 COMPLETE
PASS 2 CONTRACT MODEL                     COMPLETE
PASS 3A ARCHITECTURE SKELETON REVIEW      COMPLETE
PASS 3B ARCHITECTURE CANDIDATE            COMPLETE
PASS 4 ADVERSARIAL REVIEW                 COMPLETE — FAIL
PASS 5 REMEDIATION                         COMPLETE
PASS 6 INTERNAL REGRESSION                COMPLETE — PASS

F01-F07                                    REMEDIATED
INDEPENDENT CLOSURE                        PENDING
INDEPENDENT POST-REMEDIATION REVIEW        NOT PERFORMED
FORMAL DESIGN FREEZE                       NOT PERFORMED
A05 CERTIFICATION                          NOT CERTIFIED
IMPLEMENTATION                             NOT AUTHORIZED
A06                                        NOT STARTED
A10                                        NOT STARTED
PHASE 10                                   IN PROGRESS
```

No candidate completion, remediation completion or internal PASS creates formal freeze, certification, implementation authority or remote closure.
