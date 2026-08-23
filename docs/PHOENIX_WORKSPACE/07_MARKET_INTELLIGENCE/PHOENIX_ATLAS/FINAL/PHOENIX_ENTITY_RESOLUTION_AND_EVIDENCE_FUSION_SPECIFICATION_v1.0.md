# PHOENIX ENTITY RESOLUTION AND EVIDENCE FUSION SPECIFICATION v1.0

**PHOENIX ATLAS — PASS 3C**  
**Artifact class:** CONTROLLED ARCHITECTURE CANDIDATE  
**Candidate version:** v0.4  
**Remediation level:** Architecture R1 + Entity Resolution Boundary R1 + Evidence Fusion R1 — EF-3C-01/02  
**Authoring state:** EVIDENCE FUSION REMEDIATED — SPECIALIST R1 RECHECK NOT PERFORMED  
**Architecture Review:** COMPLETE / PASS — R1 RECHECK PASS  
**Implementation:** NOT STARTED  
**PASS 3C state:** STARTED / INITIALIZED

---

# 1. Document Authority and Status

This candidate is the first complete architecture authoring output for PASS 3C under the approved and frozen charter recorded by `PHOENIX_PASS_3C_INITIALIZATION_REPORT.md`.

It defines semantic architecture only. It does not define implementation, storage, a physical schema, canonical serialization, security enforcement, cryptographic controls, ranking, Knowledge, Decision Intelligence, recommendations, or PASS 4.

This document is not certified. Authoring completion does not constitute Architecture Review, specialist review, Final Boundary Review, or Final Certification.

Normative terms are used as follows:

- **MUST / MUST NOT:** mandatory candidate contract.
- **MAY:** permitted behavior within the declared boundary.
- **DEFERRED:** deliberately not defined by this candidate.
- **OPEN — REVIEW REQUIRED:** an architectural choice to be assessed during the approved review sequence.
- **SEPARATELY GATED:** excluded from default scope unless separately authorized.
- **BLOCKED BY SCOPE:** prohibited by the approved charter.

---

# 2. Mission

PASS 3C defines final Entity Resolution and provenance-preserving Evidence Fusion contracts that consume certified PASS 3B Evidence and association histories, preserve PASS 2 confidence authority and PASS 3A search authority, and produce separately identified, reversible, auditable downstream products without adjudicating Truth or creating Knowledge, Decisions, or recommendations.

---

# 3. Architectural Objectives

This specification establishes:

1. a PASS 3C-owned Resolution Result;
2. final `CONFIRMED` requirements that cannot arise by implicit promotion;
3. a PASS 3C-owned Fusion Product;
4. bounded conflict detection, preservation, interpretation, and policy-qualified disposition required by Fusion;
5. independence-aware composition at the architectural-contract level;
6. temporal semantics required to compare and fuse Evidence safely;
7. complete provenance and derivation lineage;
8. non-destructive lifecycle, supersession, replay, transfer, reversibility, and auditability;
9. conservative Access Governance propagation;
10. an advisory-only Evidence Expansion feedback contract to PASS 3A.

---

# 4. Scope

## 4.1 In Scope

- Resolution Result semantic identity, ownership, inputs, outcomes, lifecycle, and audit contract.
- Final `CONFIRMED` admission requirements.
- Fusion Product semantic identity, ownership, inputs, outcomes, lifecycle, and audit contract.
- Evidence-to-resolution and Evidence-to-fusion derivation lineage.
- Preservation of PASS 3B Informational Provenance and Retrieval Provenance.
- Explicit temporal comparison semantics necessary for Fusion.
- Explicit independence basis and unknown-independence handling.
- Conflict detection, preservation, interpretation, and limited policy-qualified disposition.
- PASS 3C-specific confidence boundaries, without automatic confidence computation.
- Access Governance propagation without enforcement design.
- Advisory Evidence Expansion needs without search authority.

## 4.2 Out of Scope

- Truth or Fact admission and adjudication.
- Knowledge Architecture or Knowledge construction.
- Decision Intelligence, ranking, recommendation generation, valuation, or fraud detection.
- Automatic conflict winner selection.
- Universal confidence, trust, reliability, or reputation scoring.
- Automatic mapping between PASS 2 confidence and PASS 3B association state.
- Provider Registry, provider selection, query construction, planning, retrieval, and execution.
- Search State, Inventory Sufficiency, Search Saturation, STOP, and EXPAND control.
- Storage architecture, physical schema, canonical serialization, and implementation.
- Security enforcement, threat modeling, or cryptographic implementation.
- Reconstruction of unavailable historical R2/R2.1 material.
- PASS 4 architecture.

---

# 5. Predecessor Authority

## 5.1 PASS 2

PASS 2 owns the semantic meaning and qualification of PASS 2 Entity Resolution confidence. PASS 3C MAY reference a qualified PASS 2 confidence result but MUST NOT alter, remap, or reuse it as Evidence confidence, Fusion confidence, Truth, provenance quality, source reliability, independence, or PASS 3B association state.

PASS 3C preserves the PASS 2 principles:

- Preserve Duplicate Evidence.
- Fuse, Never Flatten.
- Preserve Historical Intelligence.
- Trust Is Contextual Evidence.
- Source Count ≠ Independent Evidence Count.

## 5.2 PASS 3A

PASS 3A owns Registry, Planner, provider selection, Search Waves, provider execution, Inventory Sufficiency, Search Saturation, Search State, STOP, EXPAND, and ACCEPT/DEFER/REJECT authority for Evidence Expansion needs.

PASS 3C MUST NOT directly or indirectly command any PASS 3A-owned operation.

## 5.3 PASS 3B

PASS 3B owns Observation, Canonical Evidence, Evidence Subject, Evidence Identity, Entity Association records and history, Informational Provenance, Retrieval Provenance, Temporal Context, Evidence Independence representation, confidence boundaries, conflict representation, Evidence Preservation, Supersession, Evidence Sufficiency, advisory Evidence Expansion semantics, and Access Governance attachment.

PASS 3C consumes these contracts without redefining or mutating them. PASS 3C-derived artifacts use PASS 3C-owned identities and authorities.

---

# 6. Constitutional Type Separation

The following semantic domains are distinct:

```text
Observation
    ≠
Canonical Evidence
    ≠
Evidence Subject
    ≠
Evidence Identity
    ≠
Entity Association
    ≠
Entity Identity
    ≠
Resolution Result
    ≠
Fusion Product
    ≠
Fact / Truth
    ≠
Knowledge
    ≠
Decision / Recommendation
```

A reference between domains does not transfer authority. No label, confidence level, selection designation, data shape, or implementation convenience may collapse these distinctions.

---

# 7. Shared Semantic Conventions

## 7.1 Explicit Unknown

Every required constituent has one of these semantic conditions:

```text
KNOWN
EXPLICIT_UNKNOWN
NOT_APPLICABLE
```

Absence is not a substitute for `EXPLICIT_UNKNOWN`. `NOT_APPLICABLE` requires a declared scope that makes the constituent irrelevant. A required authority, identity, or lifecycle reference cannot be `NOT_APPLICABLE` merely because it is unavailable.

## 7.2 Authority Reference

Every Resolution Result and Fusion Product identifies the authority responsible for creating that artifact state. This authority attests to the artifact and its declared process; it does not become the origin authority of constituent Evidence. A Resolution Result additionally MUST reference the applicable Resolution Authority Mandate in §8.5. A Fusion Product or attempt additionally MUST reference the applicable Fusion Authority Mandate in §15.3. Identity of an actor/process is not evidence that it is authorized to decide a declared Resolution scope or perform a declared Fusion operation.

## 7.3 Policy and Method Reference

Every derived artifact references the policy/method identity and version applied. The reference supports repeatability and audit; it does not authorize an algorithm not defined by this candidate.

## 7.4 Scope

Every comparison, resolution, Fusion, conflict interpretation, and confidence statement declares its semantic scope. Results with different scopes MUST NOT be treated as interchangeable without a separately recorded relationship.

---

# 8. Resolution Result Identity

## 8.1 Definition

A **Resolution Result** is a PASS 3C-owned, immutable, separately identified record of an authorized Entity Resolution process applied to a declared set of candidate Entity identities, Entity Association records, and supporting Evidence references for a declared resolution question and scope.

A Resolution Result is not:

- an Entity Identity;
- an Evidence Identity;
- a PASS 3B Entity Association;
- a PASS 3B current-selection designation;
- a PASS 2 confidence value;
- Evidence, Fact, Truth, Knowledge, Decision, or recommendation.

## 8.2 Minimum Semantic Constituents

A Resolution Result MUST contain or reference:

1. its PASS 3C Resolution Result identity;
2. resolution question and scope;
3. result authority and the applicable Resolution Authority Mandate Reference in §8.5;
4. creation/effective time and applicable temporal qualification;
5. policy/method identity and version;
6. all candidate Entity identities considered through the authoritative Entity Identity reference envelope in §8.4;
7. all PASS 3B Entity Association records materially considered;
8. all supporting or counter-supporting Canonical Evidence identities materially considered;
9. qualified PASS 2 Entity Resolution confidence references, where supplied;
10. explicit input completeness state;
11. resolution outcome;
12. selected Entity Identity through the same authoritative reference envelope only when the outcome permits it;
13. competing or excluded candidates with explicit disposition and rationale references;
14. unresolved constituents and explicit unknowns;
15. applicable conflict and temporal-comparison references;
16. independence assessment references used in the result;
17. Access Governance composition state;
18. predecessor/successor relationships where applicable;
19. derivation and audit references.

Concrete field names, encodings, identifiers, schema, serialization, and storage are outside this candidate.

## 8.3 Identity Rules

- One Resolution Result identity represents one immutable result state for one declared resolution question, scope, input set, authority, and policy/method version.
- A semantic change to the question, scope, input set, authority, policy/method, outcome, selected identity, candidate disposition, conflict interpretation, or governing restriction creates a new Resolution Result identity.
- Reformatting that does not alter semantic meaning MAY preserve identity only under a separately governed representation layer.
- A Resolution Result MUST NOT reuse an Evidence Identity or Entity Identity.

## 8.4 Authoritative Entity Identity Reference Envelope

Every candidate or selected Entity Identity reference used by PASS 3C MUST identify or explicitly reference:

1. the Entity identity namespace or governed identity domain;
2. the authority that issues or governs identities in that namespace/domain;
3. the applicable authority, ontology, or identity-policy version when the authority is versioned;
4. the exact Entity Identity value/reference under that authority;
5. the authoritative target identity lifecycle value/reference for the resolution effective time and one lifecycle-knowledge state: `KNOWN_APPLICABLE`, `KNOWN_NOT_APPLICABLE_TO_DECLARED_SCOPE`, or `EXPLICIT_UNKNOWN_OR_UNAVAILABLE`;
6. material merge, split, supersession, predecessor, successor, alias, or retirement relationships and exactly one relationship-knowledge state: `KNOWN_NONE_APPLICABLE`, `KNOWN_RELATIONSHIPS_PRESENT`, or `EXPLICIT_UNKNOWN_OR_UNAVAILABLE`;
7. the authoritative time or version at which the identity reference and lifecycle state apply;
8. any Access Governance reference constraining use or representation of the Entity Identity reference.

The PASS 3C Resolution authority consumes this envelope but MUST NOT become, impersonate, or redefine the Entity Identity issuing/governing authority. PASS 3C MAY record that two differently governed identity references are candidates for correspondence, but it MUST NOT treat syntactic equality across namespaces as identity equality.

`KNOWN_NONE_APPLICABLE` means that the governing authority has established that no material identity relationship applies to the declared scope/effective time. It MUST NOT be used when relationship information is merely missing or unavailable. `KNOWN_RELATIONSHIPS_PRESENT` requires every material known relationship reference. `EXPLICIT_UNKNOWN_OR_UNAVAILABLE` preserves the unknown and MUST NOT be treated as known-none.

An inactive, merged, split, superseded, retired, or lifecycle-unknown Entity Identity MAY remain a historical candidate. For current/final authoritative target resolution, final `CONFIRMED` requires `KNOWN_APPLICABLE` lifecycle qualification and either `KNOWN_NONE_APPLICABLE` or `KNOWN_RELATIONSHIPS_PRESENT`, with every material relationship incorporated into target interpretation.

For an explicitly historical resolution scope only, `EXPLICIT_UNKNOWN_OR_UNAVAILABLE` lifecycle or relationship state MAY coexist with `CONFIRMED` only when a reviewed, mandate-permitted confirmation policy establishes that the uncertainty cannot alter the identity target for that exact historical scope/effective time and records the uncertainty through `INPUT_SET_CLOSED_WITH_DECLARED_NON_MATERIAL_OMISSIONS`. The omission assessment MUST identify the unknown state, basis, authority, policy/version, historical scope, and why all categorically ineligible uncertainty is absent. Otherwise the result remains unresolved or blocked.

A later Entity Identity lifecycle event creates a new Resolution Result when it changes the resolved target or interpretation; it MUST NOT rewrite the prior result.

Domain-specific ontology content, merge/split algorithms, Entity Registry implementation, identifier grammar, schema, serialization, and storage remain outside this candidate.

## 8.5 Resolution Authority Mandate Reference

Every Resolution Result MUST contain or reference an immutable mandate state establishing that its result authority is authorized to issue the declared outcome. The mandate state requires:

1. mandate identity/reference;
2. issuing or governing authority;
3. delegated PASS 3C Resolution authority;
4. authorized Entity identity namespace/domain;
5. authorized resolution question and scope;
6. authorized outcome classes, including explicit authority for `CONFIRMED` when that outcome is issued;
7. authorized policy/method family and applicable version or version range;
8. effective time/version, start, and expiry where applicable;
9. revocation state and revocation-effective time where applicable;
10. complete delegation chain and material delegation constraints;
11. mandate knowledge/validity state;
12. lifecycle, predecessor/successor, and historical-preservation references.

Mandate knowledge/validity state is exactly one of:

```text
KNOWN_VALID_AND_APPLICABLE
KNOWN_EXPIRED
KNOWN_REVOKED
KNOWN_SCOPE_MISMATCH
KNOWN_OUTCOME_NOT_AUTHORIZED
KNOWN_POLICY_METHOD_MISMATCH
KNOWN_INVALID_DELEGATION
EXPLICIT_UNKNOWN_OR_UNAVAILABLE
```

Only `KNOWN_VALID_AND_APPLICABLE` may support a final outcome authorized by that mandate. Final `CONFIRMED` additionally requires explicit mandate authorization for `CONFIRMED`, the exact Entity namespace/domain, question/scope, policy/method version, and resolution effective time.

Absent, `EXPLICIT_UNKNOWN_OR_UNAVAILABLE`, expired, revoked, scope-mismatched, outcome-unauthorized, policy/method-mismatched, or delegation-invalid mandate state MUST NOT produce `CONFIRMED`. It produces `BLOCKED_INVALID_INPUT` when the attempted authority is invalid or inapplicable, or another explicit non-final/failed outcome when the process cannot establish mandate validity. It MUST NOT be converted into low confidence, rejection of Entity correspondence, or implicit permission.

A mandate expiry, revocation, delegation change, scope change, or policy/method authorization change does not rewrite a historical Resolution Result that was valid under its effective-time mandate. Any new evaluation creates a new Resolution Result and references the prior mandate/result history. A mandate does not confer Entity Identity issuing authority, PASS 2 confidence authority, PASS 3B association authority, Access Governance permission, Truth authority, or security authorization.

Authority Registry implementation, IAM, enforcement, mandate identifier grammar, physical schema, storage, serialization, and cryptographic verification remain outside this candidate.

---

# 9. Resolution Inputs and Input Closure

## 9.1 Admissible Inputs

Resolution MAY consume:

- PASS 3B Canonical Evidence;
- PASS 3B Entity Association records and current-selection history;
- qualified PASS 2 Entity Resolution confidence results;
- prior PASS 3C Resolution Results as historical inputs, never as silent replacements;
- explicit policies, ontologies, or entity-domain references authorized for the resolution scope.

## 9.2 Input Closure State

Before producing a final outcome, the process records one of:

```text
INPUT_SET_CLOSED_FOR_SCOPE
INPUT_SET_CLOSED_WITH_DECLARED_NON_MATERIAL_OMISSIONS
INPUT_SET_OPEN
INPUT_SET_PARTIAL
INPUT_SET_UNKNOWN
```

`INPUT_SET_CLOSED_FOR_SCOPE` means only that the declared process has completed every mandatory input requirement for its declared scope and policy. It does not mean that all Evidence in the world has been discovered.

`INPUT_SET_CLOSED_WITH_DECLARED_NON_MATERIAL_OMISSIONS` is a closed state, not an alias for open, partial, or unknown. It is admissible only when an immutable omission assessment contains or references:

1. omission-assessment identity or stable address within the Resolution Result;
2. omission-classification authority distinct from any missing source authority;
3. confirmation policy identity and version authorizing that omission class;
4. a complete register of every known omitted input, candidate, Evidence class, temporal gap, independence gap, conflict-checking gap, or governance-relevant gap;
5. the basis and rationale for classifying each registered omission as non-material to the declared resolution question and scope;
6. the Evidence and process references supporting that classification;
7. explicit confirmation that no categorically ineligible omission is present;
8. effective time, governance state, and predecessor/successor relationships for the assessment;
9. an auditable declaration that the omission does not conceal an unknown candidate universe, material counter-Evidence, material unresolved conflict, required provenance, material temporal uncertainty, material unknown independence, or unresolved governance permission.

The following are categorically ineligible for non-material treatment when applicable to the declared resolution question: absent, unknown, expired, revoked, mismatched, outcome-unauthorized, or delegation-invalid Resolution Authority Mandate; absent mandatory PASS 3B provenance; an unqualified authoritative Entity Identity target; lifecycle or identity-relationship `EXPLICIT_UNKNOWN_OR_UNAVAILABLE` for current/final authoritative target resolution; historical lifecycle/relationship uncertainty that could alter the identity target; a material competing candidate; material counter-supporting Evidence; a material unresolved conflict; a material unknown independence state used as confirmation; a material temporal `UNKNOWN` or `NON_COMPARABLE` relation; and partial, conflicting, unknown, or blocking Access Governance composition for the resolution operation.

`INPUT_SET_OPEN`, `INPUT_SET_PARTIAL`, and `INPUT_SET_UNKNOWN` MAY support only unresolved, competing, blocked, failed, or otherwise non-final outcomes. They MUST NOT satisfy final `CONFIRMED` through policy exception, confidence, selection, or apparent consensus.

Domain-specific confirmation extensions MAY add stricter inputs and categorical prohibitions. They MUST NOT remove, weaken, reinterpret, or bypass this cross-domain closure contract.

---

# 10. Resolution Outcomes

A Resolution Result records exactly one primary outcome:

```text
CONFIRMED
REJECTED_CORRESPONDENCE
COMPETING_CANDIDATES
UNRESOLVED_INSUFFICIENT_EVIDENCE
UNRESOLVED_CONFLICT
UNRESOLVED_IDENTITY_ABSENT
NON_COMPARABLE_SCOPE
BLOCKED_GOVERNANCE
BLOCKED_INVALID_INPUT
FAILED_PROCESS
```

## 10.1 CONFIRMED

The declared Evidence/association subject is resolved to one Entity Identity under the declared scope, authority, and policy, and every mandatory confirmation requirement in Section 11 is satisfied.

## 10.2 REJECTED_CORRESPONDENCE

The process determines that a declared candidate correspondence does not satisfy the applicable resolution contract. Rejection is scoped and does not assert that the candidate can never correspond under another scope or later Evidence.

## 10.3 COMPETING_CANDIDATES

Two or more candidate Entity identities remain materially viable. All candidates and supporting/counter-supporting inputs remain explicit. No current selection is silently converted into a winner.

## 10.4 UNRESOLVED States

Unresolved outcomes preserve why a final decision is unavailable. Insufficient Evidence, credible conflict, absent candidate identity, or another declared cause MUST remain distinguishable.

## 10.5 NON_COMPARABLE_SCOPE

Inputs cannot be validly compared under the declared semantic or temporal scope. Non-comparability is not conflict, rejection, or missing Evidence.

## 10.6 BLOCKED and FAILED States

Blocked states indicate that governance or input validity prevents authorized resolution. `FAILED_PROCESS` records a process failure. None of these states may be treated as rejection, confirmation, or Truth.

---

# 11. Final CONFIRMED Contract

`CONFIRMED` is admissible only when all of the following are explicit and satisfied:

1. the resolution question and scope are declared;
2. the PASS 3C result authority has a §8.5 mandate in `KNOWN_VALID_AND_APPLICABLE` state that explicitly authorizes `CONFIRMED` for the exact Entity namespace/domain, question/scope, policy/method version, and effective time;
3. one candidate Entity Identity is selected using the complete authoritative Entity Identity reference envelope in §8.4;
4. for current/final authoritative target resolution, lifecycle is `KNOWN_APPLICABLE` and relationship knowledge is `KNOWN_NONE_APPLICABLE` or `KNOWN_RELATIONSHIPS_PRESENT`; for explicitly historical resolution, any `EXPLICIT_UNKNOWN_OR_UNAVAILABLE` is admissible only through the narrow historical uncertainty rule in §8.4 and the closed omission state in §9.2;
5. every materially considered candidate and association remains referenced;
6. the input set is `INPUT_SET_CLOSED_FOR_SCOPE` or `INPUT_SET_CLOSED_WITH_DECLARED_NON_MATERIAL_OMISSIONS`; the latter satisfies this condition only through the complete omission assessment and categorical prohibitions in §9.2;
7. every required supporting Evidence reference is Canonical Evidence admitted under PASS 3B;
8. supporting and counter-supporting Evidence lineage is complete;
9. informational and retrieval provenance remain accessible for every material Evidence input;
10. temporal comparison has classified material value differences as Change, Conflict, Unknown, or Non-Comparable rather than ignoring them;
11. material conflicts are absent, explicitly non-dispositive under the declared policy, or retained with a policy-qualified disposition that does not adjudicate Truth;
12. the independence state and basis of supporting Evidence are explicit;
13. `EXPLICIT_UNKNOWN` independence is not counted as independent confirmation;
14. any PASS 2 confidence input remains qualified on its PASS 2 axis;
15. no automatic mapping from PASS 2 confidence or PASS 3B association state occurs;
16. Access Governance composition permits the resolution operation and representation, or the result is not `CONFIRMED`;
17. the method/policy identity and version are explicit and match the authority mandate;
18. the result rationale is auditable from its immutable inputs;
19. no forbidden scope operation is used as a hidden confirmation mechanism.

`CONFIRMED` MUST NOT follow automatically from:

- high PASS 2 confidence;
- a PASS 3B current selection;
- a PASS 3B association state;
- source count;
- Evidence count;
- apparent consensus;
- repeated propagation of one origin;
- absence of a detected conflict;
- a prior Resolution Result;
- a Fusion Product;
- age, freshness, trust claims, or access status alone.

`CONFIRMED` establishes only the declared Entity Resolution outcome. It does not establish the Truth of constituent Evidence or every proposition about the Entity.

---

# 12. Resolution Confidence Boundary

## 12.1 PASS 2 Confidence

PASS 2 Entity Resolution confidence remains owned and semantically defined by PASS 2. PASS 3C preserves it as a qualified input reference.

## 12.2 PASS 3C Resolution Confidence

If a Resolution Result requires a PASS 3C confidence concept, it uses a separate axis:

```text
PASS_3C_RESOLUTION_RESULT_CONFIDENCE
```

This axis qualifies only the declared PASS 3C Resolution Result under its scope, method, input set, and authority. It MUST NOT be represented as:

- PASS 2 Entity Resolution confidence;
- Evidence confidence;
- Fusion Product confidence;
- Truth probability;
- provenance quality;
- source reliability;
- independence;
- governance permission;
- PASS 3B association state.

Automatic computation, calibration, numeric scale, thresholds, and mapping are **SEPARATELY GATED**. The absence of a computed value MUST be explicit and MUST NOT block use of a categorical resolution outcome when every applicable semantic requirement is satisfied.

---

# 13. Resolution Lifecycle

The minimum lifecycle is:

```text
INPUTS_IDENTIFIED
        ↓
INPUTS_VALIDATED
        ↓
AUTHORITY_MANDATE_VALIDATED
        ↓
COMPARISON_PERFORMED
        ↓
OUTCOME_RECORDED
        ↓
ACTIVE
        ↓
SUPERSEDED or RETAINED_HISTORICAL
```

At any pre-outcome stage, processing may produce `BLOCKED_INVALID_INPUT`, `BLOCKED_GOVERNANCE`, or `FAILED_PROCESS`. An absent, unknown, expired, revoked, mismatched, outcome-unauthorized, policy/method-mismatched, or delegation-invalid Resolution Authority Mandate prevents final outcome authorization and MUST be recorded before outcome creation.

Lifecycle transitions MUST be explicit and auditable. They MUST NOT mutate PASS 2 or PASS 3B inputs. A later input, changed policy, corrected Evidence, or new authority decision produces a new Resolution Result identity and an explicit relationship to the earlier result.

---

# 14. Resolution Supersession and Replay

## 14.1 Supersession

A Resolution Result may be superseded by a new Resolution Result when:

- new or corrected Canonical Evidence becomes available;
- a new or superseding PASS 2 result is supplied;
- association history changes through new PASS 3B records;
- the policy/method version changes;
- the Resolution Authority Mandate, mandate version, delegation, effective period, expiry, revocation, authorized scope, authorized outcomes, or policy/method authorization changes;
- the Entity Identity lifecycle or material relationship state changes;
- the declared scope changes;
- governance changes the permissible representation or use;
- an error in the prior PASS 3C derivation is identified.

Supersession MUST preserve the predecessor, its inputs, rationale, authority, policy, time, and outcome. It MUST NOT rewrite the predecessor.

## 14.2 Replay

Replay re-executes a declared process against an explicitly identified input set and policy/method version. The replay result:

- receives a new identity if it is a new authoritative result state;
- references the replayed result and complete input snapshot identities;
- records whether output is semantically equivalent, different, blocked, or failed;
- does not imply that the prior result was invalid;
- does not replace admission-time provenance.

Deterministic equivalence is an audit observation, not permission to merge histories.

---

# 15. Fusion Product Identity

## 15.1 Definition

A **Fusion Product** is a PASS 3C-owned, immutable, separately identified derived artifact that composes a declared set of Canonical Evidence for a declared Entity Resolution Result, question, scope, and policy while preserving every material constituent, derivation relationship, uncertainty, conflict, temporal qualification, independence state, and governance constraint.

A Fusion Product is not:

- Canonical Evidence;
- an aggregate container merely grouping Evidence;
- an Entity Identity;
- a Resolution Result;
- Fact, Truth, Knowledge, Decision, ranking, or recommendation;
- a replacement for its constituent Evidence.

## 15.2 Minimum Semantic Constituents

A Fusion Product MUST contain or reference:

1. Fusion Product identity;
2. Fusion question and scope;
3. Fusion authority and the applicable Fusion Authority Mandate Reference in §15.3;
4. creation/effective time;
5. method/policy identity and version;
6. the governing Resolution Result identity;
7. the resolved Entity Identity reference when applicable;
8. every constituent Canonical Evidence identity materially used;
9. the role of every constituent in the derivation;
10. complete informational and retrieval provenance references per constituent;
11. temporal comparison state per material comparison;
12. independence state, basis, and cluster/relationship references;
13. conflict relationships and interpretations;
14. explicit unknown and non-comparable constituents;
15. derived statements or structured synthesis units, each with constituent lineage;
16. Access Governance composition state;
17. confidence state, if any, on a PASS 3C-qualified axis;
18. Fusion input-closure state and any omission-assessment reference under §16.3;
19. overall Fusion outcome state;
20. predecessor/successor/replay relationships;
21. reversal and audit references.

No derived statement may exist without an explicit lineage to its supporting, counter-supporting, or constraining constituent Evidence.

## 15.3 Fusion Authority Mandate Reference

Every Fusion Product or retained Fusion attempt MUST contain or reference an immutable mandate state establishing that its Fusion authority is authorized to perform the declared operation. The mandate state requires:

1. mandate identity/reference;
2. issuing or governing authority;
3. delegated PASS 3C Fusion authority;
4. authorized Entity namespace/domain and candidate scope where applicable;
5. authorized Fusion question and scope;
6. authorized Fusion classes and input classes;
7. authorized transformation and synthesis-unit families;
8. authorized outcome classes, including explicit authority for `COMPLETE_FOR_DECLARED_SCOPE` when that outcome is issued;
9. authorized policy/method family and applicable version or version range;
10. effective time/version, start, and expiry where applicable;
11. revocation state and revocation-effective time where applicable;
12. complete delegation chain and material delegation constraints;
13. mandate knowledge/validity state;
14. lifecycle, predecessor/successor, and historical-preservation references.

Fusion mandate knowledge/validity state is exactly one of:

```text
KNOWN_VALID_AND_APPLICABLE
KNOWN_EXPIRED
KNOWN_REVOKED
KNOWN_SCOPE_OR_CLASS_MISMATCH
KNOWN_OUTCOME_NOT_AUTHORIZED
KNOWN_TRANSFORMATION_NOT_AUTHORIZED
KNOWN_POLICY_METHOD_MISMATCH
KNOWN_INVALID_DELEGATION
EXPLICIT_UNKNOWN_OR_UNAVAILABLE
```

Only `KNOWN_VALID_AND_APPLICABLE` may authorize successful Fusion. `COMPLETE_FOR_DECLARED_SCOPE` additionally requires explicit mandate authorization for the exact domain/candidate scope, Fusion question/scope, Fusion class, input and transformation/synthesis families, outcome, policy/method version, and effective time.

An absent, unknown, expired, revoked, scope/class-mismatched, outcome-unauthorized, transformation-unauthorized, policy/method-mismatched, or delegation-invalid mandate MUST NOT authorize synthesis. The attempt produces `BLOCKED_INVALID_INPUT`, or `FAILED_PROCESS` when mandate validation itself fails, through `NO_SYNTHESIS_ATTEMPT`; it MUST NOT produce a derived synthesis unit or be converted into low confidence, partial permission, implicit authorization, or successful Fusion.

A valid Resolution Authority Mandate or governing Resolution Result does not delegate Fusion authority. Access Governance permission does not establish Fusion actor/process authority. A Fusion mandate does not confer Entity Identity issuing authority, Resolution authority, PASS 2 confidence authority, PASS 3B Evidence/association authority, Access Governance permission, Truth authority, or security authorization.

Expiry, revocation, delegation change, scope/class change, input/transformation/outcome authorization change, or policy/method authorization change does not rewrite a historical Fusion Product valid under its effective-time mandate. A new attempt or evaluation receives a new Fusion Product identity and preserves the prior mandate/product history.

Authority Registry implementation, IAM, enforcement, mandate identifier grammar, physical schema, storage, serialization, and cryptographic verification remain outside this candidate.

---

# 16. Fusion Preconditions

Fusion is permitted only when:

1. all proposed constituents are valid PASS 3B Canonical Evidence;
2. constituent Evidence identities are preserved;
3. a governing Resolution Result establishes an admissible entity correspondence for the Fusion class;
4. the Fusion authority has a §15.3 mandate whose state and authorization are applicable to the attempted class, scope, inputs, transformations, outcome ceiling, policy/method, and effective time;
5. the Fusion question and scope are declared;
6. the Fusion input universe and closure state in §16.3 are explicit;
7. material Evidence types and semantic units are compatible or explicitly non-comparable;
8. informational and retrieval provenance are accessible or explicitly unknown under PASS 3B rules;
9. Temporal Context is available in its authoritative state, including explicit unknown;
10. independence state and basis are retained;
11. conflicts are detected or explicitly not assessed, never assumed absent;
12. Access Governance permits the attempted operation and output, or the product is blocked;
13. the method/policy and responsible authority are explicit and match the Fusion mandate;
14. no forbidden scope operation is required to manufacture an output.

Fusion MUST NOT use an unresolved, competing, blocked, failed, or non-comparable Resolution Result as if it were `CONFIRMED`. A bounded Fusion class MAY operate on an explicitly non-final Resolution Result only if its output remains `PARTIAL`, `UNRESOLVED`, or `UNCERTAIN`, identifies the unresolved entity correspondence, and cannot be consumed as confirmed entity-level Fusion.

## 16.1 Minimum Fusion-Class Register

Every Fusion attempt declares exactly one semantic class:

```text
CONFIRMED_ENTITY_FUSION
CANDIDATE_COMPARATIVE_FUSION
UNRESOLVED_CONFLICT_PRESERVING_FUSION
NO_SYNTHESIS_ATTEMPT
```

### CONFIRMED_ENTITY_FUSION

Composes Evidence at the level of one authoritative Entity Identity target. It requires a `CONFIRMED` Resolution Result satisfying §11 and MAY produce `COMPLETE_FOR_DECLARED_SCOPE` or any more conservative non-success outcome in §17.

### CANDIDATE_COMPARATIVE_FUSION

Compares Evidence within explicitly labeled candidate scopes without declaring that the candidates identify one entity. It MUST retain the authoritative Entity Identity reference envelope of every candidate and MUST label every synthesis unit by candidate scope. It MAY produce only `PARTIAL`, `UNRESOLVED_ENTITY`, `UNRESOLVED_CONFLICT`, `UNCERTAIN_INDEPENDENCE`, `UNKNOWN_TEMPORAL_RELATION`, or `NON_COMPARABLE`. It MUST NOT produce `COMPLETE_FOR_DECLARED_SCOPE` and MUST NOT be represented as entity-level synthesis.

### UNRESOLVED_CONFLICT_PRESERVING_FUSION

Preserves and interprets conflict relationships for a declared unresolved scope without selecting a winner or asserting a fused entity proposition. It MAY produce only `UNRESOLVED_CONFLICT`, `PARTIAL`, `UNKNOWN_TEMPORAL_RELATION`, `UNCERTAIN_INDEPENDENCE`, or `NON_COMPARABLE`. Any synthesis unit is limited to conflict structure, comparison basis, uncertainty, or evidential relationship; it MUST NOT assert a resolved entity-level value.

### NO_SYNTHESIS_ATTEMPT

Records an attempted Fusion scope for which synthesis is prohibited. It contains diagnostic and audit lineage only and MUST NOT contain a derived synthesis unit. Its outcome is limited to `UNRESOLVED_ENTITY`, `NON_COMPARABLE`, `BLOCKED_GOVERNANCE`, `BLOCKED_INVALID_INPUT`, or `FAILED_PROCESS`, consistent with the governing Resolution Result and failure cause.

## 16.2 Resolution-Outcome Eligibility Matrix

| Resolution Result outcome | Confirmed Entity Fusion | Candidate Comparative Fusion | Unresolved Conflict-Preserving Fusion | No-Synthesis Attempt |
|---|---|---|---|---|
| `CONFIRMED` | PERMITTED; maximum `COMPLETE_FOR_DECLARED_SCOPE` | PERMITTED only for explicitly distinct candidate comparison; maximum `PARTIAL` | PERMITTED only when material conflict remains preserved; maximum `UNRESOLVED_CONFLICT` | PERMITTED only for an independent Fusion blocker/failure |
| `COMPETING_CANDIDATES` | PROHIBITED | PERMITTED; maximum `UNRESOLVED_ENTITY` or `PARTIAL` | PERMITTED when conflict is material; maximum `UNRESOLVED_CONFLICT` | PERMITTED |
| `UNRESOLVED_INSUFFICIENT_EVIDENCE` | PROHIBITED | PERMITTED when at least one qualified candidate scope exists; maximum `UNRESOLVED_ENTITY` or `PARTIAL` | PERMITTED only for a represented material conflict; maximum `UNRESOLVED_CONFLICT` | PERMITTED |
| `UNRESOLVED_CONFLICT` | PROHIBITED | PERMITTED; maximum `UNRESOLVED_CONFLICT` or `PARTIAL` | PERMITTED; maximum `UNRESOLVED_CONFLICT` | PERMITTED |
| `UNRESOLVED_IDENTITY_ABSENT` | PROHIBITED | PROHIBITED unless candidate Entity Identity envelopes exist; otherwise maximum `UNRESOLVED_ENTITY` | PROHIBITED unless a material conflict is independently represented | PERMITTED |
| `REJECTED_CORRESPONDENCE` | PROHIBITED for rejected common-entity scope | PERMITTED only to compare explicitly non-corresponding candidate scopes; maximum `PARTIAL` | PERMITTED only to preserve a conflict supporting rejection; maximum `UNRESOLVED_CONFLICT` | PERMITTED |
| `NON_COMPARABLE_SCOPE` | PROHIBITED | PROHIBITED for the same non-comparable scope | PROHIBITED for the same non-comparable scope | REQUIRED if an attempt record is retained; outcome `NON_COMPARABLE` |
| `BLOCKED_GOVERNANCE` | PROHIBITED | PROHIBITED | PROHIBITED | REQUIRED if an authorized diagnostic record is permitted; outcome `BLOCKED_GOVERNANCE` |
| `BLOCKED_INVALID_INPUT` | PROHIBITED | PROHIBITED | PROHIBITED | REQUIRED if an attempt record is retained; outcome `BLOCKED_INVALID_INPUT` |
| `FAILED_PROCESS` | PROHIBITED | PROHIBITED | PROHIBITED | REQUIRED if an attempt record is retained; outcome `FAILED_PROCESS` |

“Maximum” is an outcome ceiling, not a required result. Any class MAY yield a more conservative permitted outcome when temporal, conflict, independence, provenance, governance, or process conditions require it.

Every non-confirmed Fusion Product MUST carry a machine-distinguishable semantic declaration that it is not confirmed entity-level Fusion. A presentation or downstream consumer MUST NOT remove that declaration. Candidate Comparative and Unresolved Conflict-Preserving products MUST NOT be consumed as input asserting one resolved Entity Identity. A No-Synthesis Attempt is not a Fusion synthesis and MUST NOT be counted as a successful or partial synthesis.

## 16.3 Fusion Input Closure and Omission Assessment

Every Fusion Product or retained attempt records exactly one input-closure state:

```text
FUSION_INPUT_SET_CLOSED_FOR_SCOPE
FUSION_INPUT_SET_CLOSED_WITH_DECLARED_NON_MATERIAL_OMISSIONS
FUSION_INPUT_SET_OPEN
FUSION_INPUT_SET_PARTIAL
FUSION_INPUT_SET_UNKNOWN
```

The applicable input universe is defined by the declared Fusion class, question, scope, governing Resolution Result, authorized policy/method, effective time, applicable PASS 3B Canonical Evidence and association histories, required semantic units, and every material supporting, counter-supporting, contextual, temporal, conflict, independence, provenance, and governance input required by that contract. The process MUST NOT define closure only by reference to the inputs it happened to propose or use.

`FUSION_INPUT_SET_CLOSED_FOR_SCOPE` means every mandatory applicable input and assessment in that declared universe has been identified and processed. It does not mean universal completeness or that future Evidence cannot exist.

`FUSION_INPUT_SET_CLOSED_WITH_DECLARED_NON_MATERIAL_OMISSIONS` is admissible only when an immutable omission assessment contains or references:

1. omission-assessment identity or stable address within the Fusion Product;
2. omission-classification authority;
3. Fusion policy/method identity and version authorizing the omission class;
4. the declared Fusion class, question, scope, governing Resolution Result, effective time, and applicable input universe;
5. a complete register of every known omitted Evidence input, candidate scope, semantic unit, counter-supporting input, temporal gap, conflict-checking gap, independence gap, provenance gap, governance gap, transformation input, or unavailable applicable input;
6. the basis, Evidence/process references, and rationale establishing why each omission is non-material to the declared outcome;
7. explicit confirmation that no categorically ineligible omission is present;
8. the governance-composition state applicable to the assessment;
9. lifecycle and predecessor/successor/replay relationships;
10. an auditable declaration that the omissions cannot change the product’s declared synthesis meaning, outcome, uncertainty, conflict, temporal, independence, provenance, or governance interpretation.

The following are categorically ineligible for non-material omission when applicable: invalid or non-canonical Evidence; an ineligible or invalid governing Resolution Result; an absent, unknown, expired, revoked, mismatched, unauthorized, or delegation-invalid Fusion Authority Mandate; mandatory Informational or Retrieval Provenance gaps; material counter-supporting Evidence; material unresolved Conflict; material temporal `UNKNOWN` or `NON_COMPARABLE`; material `EXPLICIT_UNKNOWN` independence; partial, conflicting, unknown, or blocking governance material to the operation; an unknown applicable Evidence universe; and any omission that could alter a synthesis unit, outcome, or required restriction.

Only `FUSION_INPUT_SET_CLOSED_FOR_SCOPE` or the fully audited `FUSION_INPUT_SET_CLOSED_WITH_DECLARED_NON_MATERIAL_OMISSIONS` may support `COMPLETE_FOR_DECLARED_SCOPE`. The latter is ineligible when any categorical prohibition applies.

`FUSION_INPUT_SET_OPEN`, `FUSION_INPUT_SET_PARTIAL`, and `FUSION_INPUT_SET_UNKNOWN` MUST NOT produce `COMPLETE_FOR_DECLARED_SCOPE`. They yield an applicable conservative outcome from §17; missing, unavailable, excluded, and unknown inputs remain explicit. These states do not prohibit an authorized comparative, conflict-preserving, partial, unresolved, uncertain, non-comparable, blocked, failed, or no-synthesis record when its class and eligibility matrix permit it.

Domain-specific policies MAY strengthen this closure floor but MUST NOT weaken it, treat unknown as known-none, or reclassify categorically ineligible omissions as non-material.

---

# 17. Fusion Outcomes

A Fusion Product records exactly one primary outcome:

```text
COMPLETE_FOR_DECLARED_SCOPE
PARTIAL
UNRESOLVED_ENTITY
UNRESOLVED_CONFLICT
UNCERTAIN_INDEPENDENCE
UNKNOWN_TEMPORAL_RELATION
NON_COMPARABLE
BLOCKED_GOVERNANCE
BLOCKED_INVALID_INPUT
FAILED_PROCESS
```

## 17.1 COMPLETE_FOR_DECLARED_SCOPE

The Fusion Authority Mandate explicitly authorizes the class, scope, inputs, transformations, outcome, policy/method, and effective time; the input state is `FUSION_INPUT_SET_CLOSED_FOR_SCOPE` or the fully audited `FUSION_INPUT_SET_CLOSED_WITH_DECLARED_NON_MATERIAL_OMISSIONS`; and all lineage, provenance, temporal, independence, conflict, and governance requirements are satisfied. “Complete” does not mean Truth, universal completeness, absence of future Evidence, or decision readiness.

## 17.2 PARTIAL

Some authorized synthesis is available, but one or more declared components remain absent, unknown, blocked, non-comparable, or unresolved. The closure state and every known missing, unavailable, excluded, and unknown part are explicit. `PARTIAL` is not permitted when the Fusion mandate itself is absent, invalid, unknown, expired, revoked, or inapplicable.

## 17.3 Unresolved and Uncertain Outcomes

Entity, conflict, independence, and temporal uncertainty remain distinct. One MUST NOT be substituted for another.

## 17.4 Blocked and Failed Outcomes

Blocked products preserve the attempted scope and admissible diagnostic lineage without exposing prohibited content. Failed products record process failure and MUST NOT be treated as Evidence or successful Fusion.

---

# 18. Fusion Derivation Contract

## 18.1 Constituent Roles

Each constituent Evidence reference has one or more explicit roles:

```text
SUPPORTING
COUNTER_SUPPORTING
CONTEXTUAL
TEMPORAL_PREDECESSOR
TEMPORAL_SUCCESSOR
CONFLICTING
NON_COMPARABLE
INDEPENDENCE_RELATED
GOVERNANCE_CONSTRAINING
```

Roles describe participation in a Fusion derivation; they do not alter the Evidence object.

## 18.2 Derived Synthesis Unit

A Fusion Product MAY contain one or more derived synthesis units. Each unit declares:

- a stable semantic address scoped by the owning Fusion Product identity;
- its semantic question/scope;
- contributing and counter-contributing Evidence identities;
- the transformation or interpretation method reference;
- temporal and independence treatment;
- conflict state;
- unknown/non-comparable inputs;
- applicable governance;
- a PASS 3C-specific confidence state if authorized;
- the responsible derivation authority.

The stable address identifies exactly one synthesis-unit semantic state within one Fusion Product. It is not an Evidence Identity, Entity Identity, Resolution Result identity, or independently transferable global identity. Physical address grammar and serialization remain separately gated.

When a successor Fusion Product contains a semantically corresponding synthesis unit, the successor unit records the predecessor unit’s owning Fusion Product identity and stable address. Unit evolution records whether the unit is `PRESERVED_EQUIVALENT`, `CHANGED`, `SPLIT`, `MERGED`, `ADDED`, or `REMOVED`. A `SPLIT` or `MERGED` relationship references every material predecessor and successor unit. Counter-supporting, constraining, conflict, temporal, independence, provenance, and governance lineage MUST survive the relationship.

A semantic change to any synthesis unit contributes to a new Fusion Product identity. Transfer MAY preserve the same authoritative Fusion Product and unit addresses only when semantics are unchanged and the transferred representation remains explicitly linked to the authoritative product. A reduced presentation MUST NOT reuse the authoritative address as if it were the complete unit.

A derived synthesis unit is not Canonical Evidence or Truth. It cannot be admitted into PASS 3B by relabeling. If downstream processing identifies a new evidential proposition, it must follow an authorized PASS 3B Observation/Evidence admission path with a new Evidence Identity.

---

# 19. Provenance Preservation

## 19.1 Dual Provenance Planes

For every constituent Evidence object, the Fusion Product preserves references to the exact PASS 3B admission-time:

- Informational Provenance record state; and
- Retrieval Provenance record state.

PASS 3C MUST NOT replace either plane with:

- the Fusion authority;
- the Resolution authority;
- a normalized source label;
- a provider-family label;
- a current retrieval path;
- a derived statement’s authority;
- a later provenance record.

## 19.2 Normalization and Transformation

Representation may be normalized for comparison only when the original value, unit/representation, provenance, temporal qualification, and transformation lineage remain recoverable. Meaning-affecting transformations MUST be explicit in derivation lineage.

## 19.3 Unknown and Conflicting Provenance

`EXPLICIT_UNKNOWN`, incomplete, and `CONFLICTING` provenance remain visible. Fusion MUST NOT infer origin from retrieval path, marketplace surface, seller identity, provider family, or apparent duplication.

---

# 20. Provenance Behavior Across Fusion Lifecycle

## 20.1 Creation

Creation references every admission-time provenance record state of every material constituent and records PASS 3C derivation authority separately.

## 20.2 Evolution

New Evidence, policy, scope, resolution, or interpretation creates a new Fusion Product identity. A new product may add lineage but cannot rewrite the provenance of an earlier product or constituent.

## 20.3 Correction

A correction to the Fusion derivation creates a successor Fusion Product. A correction to Evidence meaning follows the PASS 3B new-Evidence and explicit-supersession path.

## 20.4 Supersession

Supersession preserves predecessor Fusion Product identity, complete constituent set, provenance references, method, authority, time, outcome, and conflicts.

## 20.5 Replay

Replay identifies the exact Evidence, Resolution Result, method/policy, and governance states replayed. It records equivalence or difference without collapsing histories.

## 20.6 Transfer

Transfer preserves all identity and lineage references and retains governance applicable to the transferred representation. The transfer authority does not become informational origin.

## 20.7 Partial or Failed Fusion

Partial, blocked, or failed Fusion preserves provenance for every input that the process was authorized to record. Diagnostics MUST NOT expose content prohibited by governance. Failure does not erase the attempt or its permissible audit record.

---

# 21. Constituent Preservation and Reversibility

## 21.1 Non-Destructive Composition

Fusion MUST NOT:

- delete, overwrite, merge, or replace constituent Evidence;
- collapse multiple Evidence identities into one Evidence identity;
- discard counter-supporting Evidence;
- hide duplicate propagation paths;
- erase explicit unknowns;
- remove conflicts after disposition;
- detach governance or provenance;
- use a derived value as a silent replacement for observed values.

## 21.2 Reversal Contract

For every Fusion Product, an authorized auditor MUST be able to recover:

1. the complete list of constituent Evidence identities;
2. each constituent’s declared role;
3. the governing Resolution Result;
4. method/policy and authority;
5. every material transformation step;
6. provenance, temporal, independence, conflict, and governance states;
7. explicit unknown and excluded inputs;
8. the Fusion input universe, closure state, and omission assessment;
9. the Fusion Authority Mandate state and historical authorization basis;
10. the derivation of each synthesis unit.

Reversibility means derivational inspectability, not that a lossy external presentation can regenerate unavailable source content or bypass governance.

---

# 22. Temporal Comparison Semantics

## 22.1 Qualified Comparison

Before two Evidence values participate in the same comparative synthesis unit, PASS 3C identifies:

- the Evidence-relevant time or explicit unknown;
- event/effective/observation temporal role as defined by the Evidence context;
- instant or interval character;
- precision and uncertainty;
- timezone/calendar qualification where available;
- comparison question and scope;
- whether the values claim simultaneity, succession, overlap, or unknown relation.

Retrieval time MUST NOT silently substitute for unknown Evidence-relevant time.

## 22.2 Comparison States

Every material comparison records one of:

```text
CONSISTENT_SAME_SCOPE
CHANGE
CONFLICT
UNKNOWN
NON_COMPARABLE
```

### CHANGE

Different values are compatible with a time-ordered change under the declared scope. Change does not establish which value is universally correct; both remain time-scoped Evidence.

### CONFLICT

Credible values assert incompatible propositions for materially overlapping semantic and temporal scope.

### UNKNOWN

Available information is insufficient to determine consistency, change, conflict, or comparability.

### NON_COMPARABLE

The semantic units, scopes, time bases, precision, or governing definitions do not support a valid comparison. Non-comparability is not Conflict or Unknown.

## 22.3 Age and Relevance

Age may affect temporal relevance for a declared question but MUST NOT automatically weaken Evidence reliability, provenance quality, or Truth status. Historical Evidence remains preserved.

Concrete calendar conversion, parsing, uncertainty algorithms, precision scales, and physical encoding are **DEFERRED / SEPARATELY GATED**.

---

# 23. Conflict Capability

## 23.1 Detection

Conflict detection evaluates whether Evidence makes incompatible claims under a declared semantic and temporal comparison scope. Detection MUST retain the inputs and comparison basis.

Failure to detect a conflict does not establish consensus or Truth.

## 23.2 Representation

PASS 3C references PASS 3B conflict representations and MAY create a PASS 3C derived Conflict Interpretation/Disposition associated with a Resolution Result or Fusion Product. It MUST be either:

- a separately identified immutable PASS 3C artifact; or
- a mandatory immutable subrecord with a stable semantic address scoped by its owning Resolution Result or Fusion Product identity.

The chosen form MUST contain or reference:

1. its PASS 3C identity, or its owning artifact identity plus stable semantic address;
2. interpretation/disposition authority;
3. declared semantic and temporal comparison scope;
4. policy/method identity and version;
5. creation/effective time;
6. every material PASS 3B conflict identity/relationship and constituent Evidence identity considered;
7. comparison basis, including temporal qualification and explicit unknown/non-comparable inputs;
8. interpretation state from §23.3;
9. policy-qualified disposition and its precise effect on the owning Resolution Result or Fusion Product;
10. rationale and supporting/counter-supporting lineage;
11. applicable Access Governance composition reference;
12. lifecycle state and predecessor/successor/replay relationships.

The PASS 3C identity/address does not replace, merge, close, or rewrite any PASS 3B conflict identity or history.

## 23.3 Interpretation States

```text
PRESERVED_UNRESOLVED
NON_DISPOSITIVE_FOR_DECLARED_SCOPE
DISPOSITIVE_BLOCKING
TEMPORAL_CHANGE_NOT_CONFLICT
UNKNOWN_RELATION
NON_COMPARABLE
```

## 23.4 Policy-Qualified Disposition

A disposition states how an identified conflict affects a declared Resolution Result or Fusion Product under a named policy. It MAY block, limit, or permit a scoped derived output while retaining the conflict.

A disposition MUST NOT:

- declare a universal winner;
- adjudicate Truth;
- delete or weaken losing Evidence;
- change Evidence confidence or provenance;
- close a conflict outside its declared scope;
- mutate historical interpretations.

Automatic winner selection and Truth adjudication are **BLOCKED BY SCOPE**.

## 23.5 Conflict Interpretation / Disposition Lifecycle

The minimum lifecycle is:

```text
INPUT_CONFLICTS_IDENTIFIED
        ↓
COMPARISON_BASIS_VALIDATED
        ↓
INTERPRETATION_RECORDED
        ↓
DISPOSITION_RECORDED or PRESERVED_UNRESOLVED
        ↓
ACTIVE
        ↓
SUPERSEDED or RETAINED_HISTORICAL
```

A change to authority, scope, input conflict set, comparison basis, policy/method version, interpretation state, disposition, rationale, temporal qualification, or governance composition creates a new Conflict Interpretation/Disposition identity or stable address and, when embedded, a new owning Resolution Result or Fusion Product identity. The predecessor remains immutable.

Replay references the exact prior conflict inputs, comparison basis, policy/method version, authority, and governance state. It records semantic equivalence or difference and MUST NOT collapse historical interpretations. Transfer preserves the authoritative identity/address and lifecycle lineage when semantics are unchanged; otherwise it creates or references a new owning artifact.

---

# 24. Evidence Independence Contract

## 24.1 Independence States

Each constituent or relevant set-level relationship records one of:

```text
CONFIRMED_INDEPENDENT
CONFIRMED_DEPENDENT
PARTIALLY_DEPENDENT
EXPLICIT_UNKNOWN
NON_APPLICABLE_TO_SCOPE
```

`EXPLICIT_UNKNOWN` MUST NOT be counted as independent. Multiple acquisition paths, providers, marketplace surfaces, documents, listings, or Evidence objects do not alone prove independence.

## 24.2 Independence Basis

Every non-unknown independence state references its assessment basis, authority, scope, time, and policy/method. Possible evidence may include common informational origin, transformation lineage, syndication, provider-family propagation, shared seller/agent, shared document, or independently produced observation paths. This list is illustrative, not an algorithm.

## 24.3 Fusion Behavior

- Fusion retains each constituent’s independence state and basis.
- Dependent Evidence may remain valuable and MUST NOT be discarded merely because it is dependent.
- Dependent propagation MUST NOT inflate confirmation, confidence, or apparent consensus.
- Partial dependence remains explicit.
- Unknown independence produces `UNCERTAIN_INDEPENDENCE` when material to the Fusion question.
- Clustering, thresholds, and automatic computation remain outside implementation scope and subject to review.

---

# 25. Fusion Confidence Boundary

If required, PASS 3C defines a separate axis:

```text
PASS_3C_FUSION_PRODUCT_CONFIDENCE
```

It qualifies only a declared synthesis unit or Fusion Product under its scope, constituent set, method, temporal treatment, independence treatment, conflict state, and authority.

It MUST NOT be reused as:

- PASS 2 Entity Resolution confidence;
- PASS 3C Resolution Result confidence;
- Evidence confidence;
- Truth probability;
- provenance quality;
- source reliability or trust;
- independence;
- governance permission;
- Evidence Sufficiency or Decision readiness.

Automatic calculation, numeric scales, weighting, calibration, and thresholds are **SEPARATELY GATED**. A Fusion Product MUST be able to represent confidence as `EXPLICIT_UNKNOWN` or omit a calculated value through an explicit non-calculated state without inventing certainty.

---

# 26. Access Governance Propagation

## 26.1 Resolution Results

A Resolution Result references the Access Governance states attached to every material Evidence input. It records or references the immutable governance-composition decision contract in §26.3 describing whether the result may be created, retained, transferred, or presented for its declared scope.

## 26.2 Fusion Products

A Fusion Product preserves constituent governance references and policy versions and records or references the immutable governance-composition decision contract in §26.3. Composition MUST NOT silently weaken a restriction because another constituent is less restrictive.

Governance composition records one of:

```text
COMPOSITION_DETERMINED
COMPOSITION_PARTIAL
COMPOSITION_CONFLICTING
COMPOSITION_UNKNOWN
BLOCKED_GOVERNANCE
```

When composition is partial, conflicting, or unknown, the artifact remains explicitly constrained and MUST NOT be represented as generally usable.

## 26.3 Governance-Composition Decision Contract

Every governance composition used by a Resolution Result, Fusion Product, Conflict Interpretation/Disposition, or synthesis unit MUST be an immutable decision record or mandatory stably addressed subrecord containing or referencing:

1. its identity or owning artifact identity plus stable semantic address;
2. composition authority;
3. the exact operation, creation, retention, presentation, transfer, and audience scope evaluated;
4. every applicable constituent governance reference and historical policy version actually evaluated;
5. the composition state from §26.2;
6. every effective constraint determinable for the declared scope;
7. every unresolved, conflicting, partial, or unknown constraint and the affected operation;
8. explicit absence of a determinable effective constraint when none can be established;
9. rationale and policy/method reference for `COMPOSITION_DETERMINED` or any other state;
10. effective time and applicable policy-time qualification;
11. predecessor/successor/replay relationships;
12. the permitted operations, explicitly prohibited operations, and operations for which authorization remains unknown.

The effective-state rule is conservative:

- `COMPOSITION_DETERMINED` MAY authorize an operation only when every applicable determinate constituent constraint explicitly authorizes that operation for the declared scope and no applicable conflicting, partial, unknown, or blocking constraint remains material to it.
- `COMPOSITION_PARTIAL`, `COMPOSITION_CONFLICTING`, and `COMPOSITION_UNKNOWN` MUST NOT authorize an operation unless every applicable determinate constituent constraint explicitly authorizes it and the unresolved portion is itself explicitly established as non-applicable to that operation by an identified governance authority. Otherwise the operation remains prohibited or authorization-unknown.
- `BLOCKED_GOVERNANCE` prohibits the declared operation.
- Absence of a policy, response, prohibition, or detected conflict MUST NOT be interpreted as authorization.
- A more permissive constituent MUST NOT weaken a more restrictive applicable constituent.

This contract defines semantic effective state and traceability only. It does not define policy syntax, inheritance algorithms, enforcement, redaction, storage security, or cryptographic controls.

## 26.4 Historical State and Lifecycle

Later policy may be linked but MUST NOT rewrite the historical governance state used by a Resolution Result or Fusion Product. Transfer and supersession preserve historical policy-version references.

A change to composition authority, scope, input governance references/versions, effective constraints, unresolved constraints, rationale, time, or permitted/prohibited operations creates a new governance-composition identity/address and a new owning Resolution Result, Fusion Product, or Conflict Interpretation/Disposition where the composition is embedded and material. The predecessor remains immutable. Replay references the exact prior policies and records equivalence or difference without rewriting history.

## 26.5 Boundary

PASS 3C defines propagation and semantic composition only. Policy syntax, inheritance algorithm, authorization enforcement, redaction implementation, storage security, and cryptographic controls remain outside scope.

---

# 27. Fusion Lifecycle

The minimum lifecycle is:

```text
SCOPE_DECLARED
       ↓
INPUTS_IDENTIFIED
       ↓
RESOLUTION_VALIDATED
       ↓
FUSION_AUTHORITY_VALIDATED
       ↓
INPUT_CLOSURE_CLASSIFIED
       ↓
PROVENANCE_AND_GOVERNANCE_VALIDATED
       ↓
TEMPORAL_CONFLICT_INDEPENDENCE_ASSESSED
       ↓
DERIVATION_PERFORMED
       ↓
OUTCOME_RECORDED
       ↓
ACTIVE
       ↓
SUPERSEDED or RETAINED_HISTORICAL
```

At any stage the process may yield a partial, unresolved, blocked, non-comparable, or failed outcome. An invalid or inapplicable Fusion Authority Mandate yields only a no-synthesis blocked/failed record. Open, partial, or unknown Fusion input closure cannot yield `COMPLETE_FOR_DECLARED_SCOPE`. A later stage MUST NOT conceal an earlier blocking condition.

Lifecycle progression does not imply increasing Truth. It records process state only.

---

# 28. Fusion Supersession, Correction, and Transfer

## 28.1 Supersession

A new Fusion Product supersedes or relates to a prior product when its input universe, closure/omission assessment, Resolution Result, scope, policy/method, authority, Fusion Authority Mandate or authorization state, conflict interpretation, temporal treatment, independence basis, governance composition, or derived synthesis changes semantically.

Supersession preserves both artifacts and never erases constituent lineage.

## 28.2 Correction

- Fusion-derivation correction → new Fusion Product identity.
- Resolution correction → new Resolution Result identity and, where relevant, new Fusion Product.
- Evidence correction → new PASS 3B Evidence identity and explicit PASS 3B supersession, followed by new PASS 3C products if reprocessed.

## 28.3 Transfer

Transfer preserves identity, provenance, derivation lineage, temporal state, independence, conflict, supersession, and governance. A transferred presentation may be reduced only when the reduction is explicit, governance-authorized, and linked to the complete authoritative product. It MUST NOT masquerade as the complete Fusion Product.

---

# 29. Failure, Blocking, and Non-Resolution

PASS 3C treats inability to resolve or fuse as a first-class result rather than a process embarrassment to be hidden.

Minimum causes include:

- invalid or non-canonical Evidence input;
- absent, unknown, invalid, expired, revoked, mismatched, unauthorized, or delegation-invalid Fusion Authority Mandate;
- unresolved or competing Entity correspondence;
- open, partial, or unknown Fusion input closure;
- missing mandatory provenance;
- unknown or incompatible temporal scope;
- material unresolved conflict;
- material unknown independence;
- governance prohibition or unknown composition;
- method/policy unavailable;
- process failure;
- forbidden-scope dependency.

Each cause is recorded separately. A failure state MUST NOT be automatically converted to rejection, absence, negative evidence, or low confidence.

---

# 30. Auditability Contract

An authorized audit MUST be able to determine:

1. who or what authority created the Resolution Result or Fusion Product;
2. which policy/method version was applied;
3. the declared question and scope;
4. every materially considered candidate, association, and Evidence identity;
5. every materially excluded input and reason, where governance permits recording it;
6. every PASS 2 confidence reference and its unchanged semantic axis;
7. the exact PASS 3B provenance record-state references;
8. temporal comparison bases and results;
9. independence states and bases;
10. conflicts and policy-qualified dispositions;
11. all explicit unknowns and non-comparable elements;
12. governance composition and historical policy references;
13. each derived synthesis unit’s lineage;
14. lifecycle, supersession, replay, correction, and transfer relationships;
15. why a result was confirmed, partial, unresolved, blocked, rejected, or failed.
16. the authoritative Entity Identity namespace, governing authority, version, lifecycle state, and material merge/split/supersession relationships used by a Resolution Result;
17. every declared non-material omission, its authority, policy/version, basis, categorical-eligibility check, and lifecycle;
18. the Fusion class, governing Resolution outcome, eligibility-matrix rule, outcome ceiling, and non-confirmed consumption restriction;
19. every Conflict Interpretation/Disposition identity/address, authority, inputs, comparison basis, policy/version, lifecycle, and effect;
20. every synthesis-unit stable address and its preserved/changed/split/merged/added/removed relationships across Fusion Product versions;
21. every governance-composition identity/address, authority, scope, evaluated policies, effective constraints, unresolved constraints, rationale, time, and permitted/prohibited/unknown operations.
22. the Resolution Authority Mandate identity, issuer, delegate, authorized domain/scope/outcome/policy-method range, effective period, expiry/revocation/delegation state, and lifecycle used to authorize the result;
23. whether Entity Identity lifecycle and relationship knowledge were known-applicable, known-none, known-present, or unknown/unavailable, and the exact historical-scope uncertainty rule used when applicable.
24. the Fusion input universe, closure state, omission-assessment identity/authority/policy, complete known omission register, categorical-eligibility result, basis, governance, time, and lifecycle;
25. the Fusion Authority Mandate identity, issuer, delegate, authorized domain/scope/class/inputs/transformations/outcome/policy-method range, effective period, expiry/revocation/delegation state, and lifecycle used to authorize the product or attempt.

Auditability does not grant access beyond governance. An audit representation may record the existence and category of a restricted input without exposing restricted content, under an authorized policy.

---

# 31. Advisory Evidence Expansion Interaction

## 31.1 Trigger

PASS 3C MAY identify an evidential deficit when a Resolution Result or Fusion Product is partial, unresolved, uncertain, non-comparable, or blocked by missing Evidence rather than by governance.

## 31.2 Advisory Need

PASS 3C may emit an advisory Evidence Expansion Need containing or referencing:

1. need identity;
2. originating Resolution Result or Fusion Product;
3. declared question and scope;
4. missing Evidence class, temporal context, independence basis, entity-disambiguating input, or conflict-checking input;
5. supporting Evidence and association references;
6. reason and expected informational effect;
7. urgency/priority as advice only;
8. governance constraints;
9. originating PASS 3C authority and time;
10. status: `PENDING`, `RESPONDED`, `WITHDRAWN`, or `SUPERSEDED`.

## 31.3 PASS 3A Authority

PASS 3A alone responds:

```text
ACCEPT
DEFER
REJECT
```

PASS 3C MUST NOT:

- select a provider;
- construct a provider query;
- create a Search Plan;
- execute retrieval;
- alter Inventory Sufficiency or Search Saturation;
- control Search State;
- command STOP or EXPAND;
- interpret no response as acceptance;
- interpret acceptance as Evidence Truth or eventual resolution success.

## 31.4 Return Path

New Provider Results follow PASS 3A execution and then the PASS 3B Observation and Canonical Evidence admission lifecycle. PASS 3C may consume only the resulting admitted Evidence. Reprocessing creates new Resolution Results and Fusion Products; it never mutates prior artifacts.

---

# 32. Cross-Pass Interaction Model

```text
PASS 2
Qualified Entity Resolution confidence
        │
        ▼
PASS 3B
Canonical Evidence + Entity Associations + provenance +
Temporal Context + independence + conflicts + governance
        │
        ▼
PASS 3C
Resolution Result
        │
        ▼
Fusion Product
        │
        ├──► Advisory Evidence Expansion Need ──► PASS 3A
        │                                         │
        │                           ACCEPT / DEFER / REJECT
        │                                         │
        │                     if accepted: search execution
        │                                         │
        └──────── new admitted Evidence ◄── PASS 3B admission

Future Knowledge / Decision architectures may consume PASS 3C products
through separate identities and authorities; they are not defined here.
```

No arrow transfers ownership of the upstream contract.

---

# 33. Immutability and No-Write-Back Rules

PASS 3C MUST NOT silently mutate:

- Observation;
- Canonical Evidence Identity or primary evidential content;
- Evidence Subject;
- Informational or Retrieval Provenance;
- Temporal Context;
- Entity Association records, candidates, states, or history;
- Evidence Independence state;
- PASS 3B conflicts;
- Evidence Preservation or Supersession history;
- Evidence Sufficiency;
- Access Governance.

PASS 3C-derived resolution, Fusion, conflict interpretation, confidence, or expansion state MUST NOT be written into PASS 3B semantics as though PASS 3B owned it.

Denormalized views MAY reference derived state only when authority and identity domains remain explicit and the authoritative source remains recoverable.

---

# 34. Transfer and Presentation Boundary

A presentation may summarize a Resolution Result or Fusion Product, but it MUST preserve or link to:

- authoritative artifact identity;
- scope and outcome;
- material uncertainty and conflict;
- provenance/lineage availability;
- governance restrictions;
- the fact that the artifact is derived and not Truth or Canonical Evidence.

Presentation convenience MUST NOT convert `PARTIAL`, `UNRESOLVED`, `UNKNOWN`, `NON_COMPARABLE`, `BLOCKED`, or `FAILED` into a successful conclusion.

---

# 35. Security and Trust Boundary

This candidate provides semantic traceability and governance propagation. It does not claim:

- tamper resistance;
- cryptographic integrity;
- authentication or authorization enforcement;
- secure storage;
- confidentiality;
- non-repudiation;
- source reliability;
- universal trustworthiness.

Provenance is not proof of Truth. Governance is not reliability. Confidence is not trust. Security implementation is outside scope.

---

# 36. Architectural Decision Register

| ID | Decision | Status | Consequence |
|---|---|---|---|
| AD-3C-01 | Concrete Resolution Result field names, identifier grammar, and physical representation | SEPARATELY GATED | Semantic identity is defined; schema/serialization cannot be certified here. |
| AD-3C-02 | Resolution outcome encoding and machine-state representation | OPEN — REVIEW REQUIRED | Review must verify that the semantic outcomes remain distinct. |
| AD-3C-03 | Exact final `CONFIRMED` domain-specific Evidence requirements | RESOLVED AT CROSS-DOMAIN FLOOR — EXTENSIONS GOVERNED | §9.2/§11 define deterministic closure and omission rules; vertical extensions may strengthen but never weaken them. |
| AD-3C-04 | PASS 3C Resolution Confidence scale and computation | SEPARATELY GATED | Confidence axis exists conditionally; automatic calculation remains absent. |
| AD-3C-05 | Fusion Product physical schema and canonical serialization | SEPARATELY GATED | Fusion semantics are implementation-neutral. |
| AD-3C-06 | Permitted Fusion classes and minimum Resolution Result state per class | RESOLVED — ARCHITECTURE R1 | §16.1–16.2 define the minimum class register, eligibility matrix, outcome ceilings, and consumption restrictions. |
| AD-3C-07 | Synthesis-unit taxonomy and lifecycle addressability | PARTIALLY RESOLVED — TAXONOMY EXTENSIBLE | §18.2 defines stable addressing and evolution relationships; new synthesis kinds still require governing authority and lineage. |
| AD-3C-08 | Independence clustering algorithm and production thresholds | DEFERRED | Unknown remains explicit; no automated independence claim is authorized. |
| AD-3C-09 | Temporal parsing, calendar conversion, precision scales, and uncertainty calculation | DEFERRED | Qualified temporal semantics remain mandatory without an implementation algorithm. |
| AD-3C-10 | Conflict detection thresholds | OPEN — REVIEW REQUIRED | Absence of detection cannot mean absence of conflict; candidate rules require specialist review. |
| AD-3C-11 | Conflict winner selection and Truth adjudication | BLOCKED BY SCOPE | Conflict remains preserved; no automatic winner exists. |
| AD-3C-12 | PASS 3C Fusion Confidence scale and computation | SEPARATELY GATED | No universal or automatic Fusion score is defined. |
| AD-3C-13 | Governance composition semantics, policy inheritance algorithm, and enforcement | SEMANTIC CONTRACT RESOLVED — ALGORITHM/ENFORCEMENT DEFERRED | §26.3–26.5 define authority, effective constraints, conservative behavior, and lifecycle; syntax and enforcement remain external. |
| AD-3C-14 | Audit-event schema, retention, and storage | DEFERRED | Semantic auditability is mandatory; implementation is not defined. |
| AD-3C-15 | Evidence Sufficiency automation and thresholds | SEPARATELY GATED | PASS 3C may reference sufficiency and emit advice; no automated decision is authorized. |
| AD-3C-16 | Evidence Expansion transport, scheduling, retries, provider/query selection | BLOCKED BY SCOPE | PASS 3A retains exclusive operational authority. |
| AD-3C-17 | Knowledge, Truth, Decision, ranking, and recommendation consumption contracts | DEFERRED | Later passes require separate identities, authorities, and admission contracts. |
| AD-3C-18 | Security threat model and cryptographic controls | DEFERRED | No security guarantee is made by this architecture. |
| AD-3C-19 | Authoritative Entity Identity envelope, lifecycle knowledge, domain ontologies, and merge/split governance | AUTHORITY/LIFECYCLE ENVELOPE RESOLVED — DOMAIN CONTENT OPEN | §8.4 freezes namespace, authority, version, lifecycle/relationship knowledge states, and historical uncertainty rule; ontology content/algorithms remain external. |
| AD-3C-20 | Resolution/Fusion policy-version compatibility and migration | OPEN — REVIEW REQUIRED | New policy versions create new artifacts; compatibility semantics require review. |
| AD-3C-21 | Conflict Interpretation/Disposition identity and lifecycle | RESOLVED — ARCHITECTURE R1 | §23.2/§23.5 define immutable identity/address, authority, inputs, state, disposition, governance, supersession, replay, and transfer. |
| AD-3C-22 | Resolution Authority Mandate identity, applicability, delegation, and lifecycle | RESOLVED — ENTITY RESOLUTION BOUNDARY R1 | §8.5/§11 define mandate authority, authorized domain/scope/outcomes/policy-method range, effective period, expiry, revocation, delegation, invalid behavior, and historical preservation. |
| AD-3C-23 | Fusion input universe, closure, and omission eligibility | RESOLVED — EVIDENCE FUSION R1 | §16.3/§17 define explicit closure states, immutable omission assessment, categorical prohibitions, and complete-outcome eligibility. |
| AD-3C-24 | Fusion Authority Mandate identity, applicability, delegation, and lifecycle | RESOLVED — EVIDENCE FUSION R1 | §15.3/§16/§17 define authority, authorized scope/class/inputs/transformations/outcomes/method, effective time, invalid behavior, and historical preservation. |

No listed open decision prevents authoring completeness. Each is either an intended subject for architecture/specialist review, a separately gated domain, deferred, or blocked by scope. None authorizes silent invention.

---

# 37. Candidate Architectural Invariants

The following PASS 3C candidate invariants are mandatory in addition to the inherited PASS 3B invariants:

1. Resolution Result Identity ≠ Evidence Identity ≠ Entity Identity.
2. Resolution Result ≠ Entity Association.
3. PASS 2 Confidence ≠ PASS 3C Resolution Confidence.
4. `CONFIRMED` Entity Resolution ≠ Truth.
5. Current Association Selection ≠ Final Resolution.
6. Fusion Product Identity ≠ Resolution Result Identity ≠ Evidence Identity.
7. Fusion Product ≠ Canonical Evidence ≠ Truth.
8. Fusion MUST retain every material constituent Evidence identity.
9. Fusion MUST retain informational and retrieval provenance per constituent.
10. Fusion MUST retain temporal qualification, independence state, conflict state, and governance.
11. Fusion completeness is scoped and does not mean universal completeness or Decision readiness.
12. Conflict disposition ≠ winner selection ≠ Truth adjudication.
13. Change ≠ Conflict ≠ Unknown ≠ Non-Comparable.
14. Unknown Independence ≠ Confirmed Independence.
15. Dependent Evidence remains Evidence and MUST NOT be discarded merely for dependence.
16. A new semantic result requires a new PASS 3C identity and explicit predecessor relationship.
17. PASS 3C correction MUST NOT mutate PASS 3B Evidence.
18. Evidence Expansion Need is advisory and MUST NOT command PASS 3A.
19. Governance composition uncertainty MUST remain explicit.
20. Failure or non-resolution MUST NOT be converted into rejection, absence, or low confidence.
21. A derived synthesis unit MUST have complete constituent lineage.
22. Presentation MUST NOT erase uncertainty, conflict, scope, derivation status, or governance.
23. A Resolution Result MUST qualify every candidate and selected Entity Identity by its governing authority envelope and MUST NOT become the Entity Identity authority.
24. `INPUT_SET_OPEN`, `INPUT_SET_PARTIAL`, and `INPUT_SET_UNKNOWN` MUST NOT satisfy final `CONFIRMED`; declared non-material omissions require the closed audited state in §9.2.
25. Fusion class and Resolution-outcome eligibility MUST constrain the maximum Fusion outcome and downstream representation.
26. Every material Conflict Interpretation/Disposition MUST have immutable identity/address and lifecycle without rewriting PASS 3B conflict history.
27. Every synthesis unit MUST have a stable address within its Fusion Product and explicit evolution lineage.
28. Governance composition MUST use an authoritative conservative effective-state decision and MUST NOT infer authorization from absence, uncertainty, or a more permissive constituent.
29. Final `CONFIRMED` MUST be issued only under a known, applicable, non-expired, non-revoked, scope/method-matched Resolution Authority Mandate explicitly authorizing `CONFIRMED`.
30. Entity Identity lifecycle/relationship unknown MUST NOT equal known-none; current/final `CONFIRMED` requires known applicable state, and historical uncertainty requires the explicit scoped omission contract.
31. `COMPLETE_FOR_DECLARED_SCOPE` MUST require closed Fusion inputs under §16.3; open, partial, unknown, or categorically material omission MUST remain non-complete and explicit.
32. Successful Fusion MUST be issued only under a known, valid, applicable, non-expired, non-revoked, class/scope/input/transformation/outcome/method-matched Fusion Authority Mandate.

---

# 38. Inherited PASS 3B Invariants

PASS 3C preserves all 18 certified PASS 3B invariants in semantic effect:

1. Observation ≠ Evidence ≠ Fact ≠ Knowledge ≠ Decision.
2. Provenance is mandatory for Canonical Evidence.
3. Normalization must not collapse informational origin.
4. Informational Provenance ≠ Retrieval Provenance.
5. Evidence Identity ≠ Entity Identity.
6. Evidence Count ≠ Independent Evidence Count.
7. Unknown Independence ≠ Confirmed Independence.
8. Confidence is proposition- and process-specific.
9. High Confidence ≠ Truth.
10. Conflict ≠ Temporal Change.
11. Aggregation ≠ Evidence Fusion.
12. Inventory Sufficiency ≠ Evidence Sufficiency.
13. Inventory Expansion ≠ Evidence Expansion.
14. Canonical Evidence must not be silently mutated.
15. Age ≠ weakness.
16. Missing and unknown values remain explicit.
17. Access Governance remains attached where applicable.
18. Canonical Evidence must not precede all mandatory admission constituents.

---

# 39. Candidate Success Criteria

These are newly authored PASS 3C candidate criteria. They are not recovered historical criteria and do not replace predecessor success criteria.

## 39.1 Resolution Result and CONFIRMED

- **SC-3C-01:** Resolution Result has a PASS 3C-owned identity distinct from Evidence Identity, Entity Identity, Entity Association, and confidence values.
- **SC-3C-02:** Resolution Result declares question, scope, authority, time, policy/method, complete material inputs, outcome, unknowns, governance, and lineage.
- **SC-3C-03:** All required unresolved, competing, rejected, non-comparable, blocked, and failed outcomes are distinguishable.
- **SC-3C-04:** `CONFIRMED` requires all Section 11 conditions and cannot arise through automatic promotion.
- **SC-3C-05:** PASS 2 confidence remains unchanged and qualified.
- **SC-3C-06:** PASS 3B Entity Association history remains immutable and complete.
- **SC-3C-07:** Resolution supersession/replay creates new immutable results and preserves predecessors.

## 39.2 Fusion Product

- **SC-3C-08:** Fusion Product has a PASS 3C-owned identity distinct from Resolution Result, Evidence, and Entity identities.
- **SC-3C-09:** Fusion is permitted only after every applicable Section 16 precondition is evaluated.
- **SC-3C-10:** Complete, partial, unresolved, uncertain, non-comparable, blocked, and failed Fusion outcomes remain distinct.
- **SC-3C-11:** Every material constituent Evidence identity and role is preserved.
- **SC-3C-12:** Every synthesis unit has complete supporting, counter-supporting, contextual, and constraining lineage.
- **SC-3C-13:** Fusion never creates Canonical Evidence or Truth by relabeling a derived product.
- **SC-3C-14:** Fusion correction, supersession, replay, and transfer preserve history and never mutate constituents.

## 39.3 Provenance and Auditability

- **SC-3C-15:** Informational and Retrieval Provenance remain distinct and traceable per constituent.
- **SC-3C-16:** Admission-time provenance references are never replaced by PASS 3C authority or later provenance.
- **SC-3C-17:** Meaning-affecting normalization/transformation has explicit lineage.
- **SC-3C-18:** Partial, blocked, and failed products retain authorized provenance/audit traces.
- **SC-3C-19:** An authorized auditor can reconstruct all material inputs, policies, transformations, outcomes, uncertainty, and lifecycle relationships.
- **SC-3C-20:** Reversibility exposes derivation without bypassing governance.

## 39.4 Temporal, Conflict, and Independence

- **SC-3C-21:** Every material comparison distinguishes consistency, Change, Conflict, Unknown, and Non-Comparable.
- **SC-3C-22:** Retrieval time never silently substitutes for unknown Evidence-relevant time.
- **SC-3C-23:** Age and temporal relevance remain separate from reliability.
- **SC-3C-24:** Conflicts remain visible after interpretation or disposition.
- **SC-3C-25:** Automatic winner selection and Truth adjudication are absent.
- **SC-3C-26:** Evidence Count and source/path count never substitute for Independent Evidence Count.
- **SC-3C-27:** Unknown independence never becomes confirmed independence.
- **SC-3C-28:** Dependence does not erase Evidence; it constrains interpretation and confidence only within scope.

## 39.5 Confidence and Governance

- **SC-3C-29:** PASS 2, PASS 3C Resolution, and PASS 3C Fusion confidence axes remain distinct.
- **SC-3C-30:** No confidence axis implies Truth, provenance quality, reliability, independence, governance, or Decision readiness.
- **SC-3C-31:** Automatic confidence computation remains absent unless separately gated.
- **SC-3C-32:** Resolution Results and Fusion Products preserve every material governance reference and historical policy version.
- **SC-3C-33:** Partial, conflicting, unknown, or blocking governance composition remains explicit.
- **SC-3C-34:** No security or enforcement claim is inferred from governance propagation.

## 39.6 PASS 3A and Cross-Pass Integrity

- **SC-3C-35:** Evidence Expansion needs remain advisory and contain no provider/query/plan/execution command.
- **SC-3C-36:** PASS 3A exclusively owns ACCEPT/DEFER/REJECT and all search consequences.
- **SC-3C-37:** Newly obtained information passes through PASS 3B admission before PASS 3C consumption.
- **SC-3C-38:** PASS 2, PASS 3A, and PASS 3B ownership boundaries remain unchanged.
- **SC-3C-39:** All 18 PASS 3B invariants remain satisfied.

## 39.7 Scope Exclusion

- **SC-3C-40:** Truth, Fact, Knowledge, Decision Intelligence, ranking, recommendation, valuation, fraud, and source-reputation semantics are absent.
- **SC-3C-41:** Provider execution, Search State control, STOP, and EXPAND authority are absent.
- **SC-3C-42:** Storage, physical schema, canonical serialization, security implementation, cryptographic implementation, and PASS 4 architecture are absent.
- **SC-3C-43:** Unavailable historical R2/R2.1 material is not reconstructed or certified by inference.

## 39.8 Remediation Closure Criteria

- **SC-3C-44:** Every candidate and selected Entity Identity uses the §8.4 authority envelope; PASS 3C never assumes Entity Identity issuing authority.
- **SC-3C-45:** Final `CONFIRMED` accepts only `INPUT_SET_CLOSED_FOR_SCOPE` or the fully audited `INPUT_SET_CLOSED_WITH_DECLARED_NON_MATERIAL_OMISSIONS`; open, partial, and unknown states remain ineligible.
- **SC-3C-46:** Domain-specific confirmation extensions may strengthen but never weaken the cross-domain closure, provenance, identity, conflict, independence, temporal, or governance floor.
- **SC-3C-47:** Every Fusion Product declares a §16.1 class and complies with the §16.2 Resolution-outcome eligibility, outcome ceiling, labeling, synthesis-unit, and downstream-consumption rules.
- **SC-3C-48:** Every material Conflict Interpretation/Disposition satisfies §23.2/§23.5 identity/address, authority, input, lifecycle, supersession, replay, preservation, and non-Truth requirements.
- **SC-3C-49:** Every synthesis unit has a stable address and explicit preserved/changed/split/merged/added/removed evolution lineage, and every semantic unit change creates a new Fusion Product identity.
- **SC-3C-50:** Every governance composition satisfies §26.3–26.5 authority, scope, evaluated-policy, effective-constraint, unresolved-constraint, rationale, time, lifecycle, and conservative-authorization rules.
- **SC-3C-51:** AR-3C-01 through AR-3C-06 are traceably addressed without changing the frozen charter, predecessor boundaries, or forbidden scope.
- **SC-3C-52:** Every Resolution Result references a §8.5 Resolution Authority Mandate; final `CONFIRMED` requires `KNOWN_VALID_AND_APPLICABLE` mandate state explicitly authorizing the exact domain, scope, outcome, policy/method, and effective time.
- **SC-3C-53:** Current/final `CONFIRMED` requires known applicable Entity Identity lifecycle and known-none or known-present material relationships; unknown/unavailable never equals known-none and is admissible only under the explicit historical-scope rule.
- **SC-3C-54:** Every Fusion Product declares the §16.3 input universe and closure state; `COMPLETE_FOR_DECLARED_SCOPE` requires a closed state and rejects every categorically material omission, while open, partial, and unknown states remain non-complete.
- **SC-3C-55:** Every Fusion Product or retained attempt references a §15.3 Fusion Authority Mandate; successful Fusion requires known valid/applicable authority matching the exact scope, class, inputs, transformations, outcome, policy/method, and effective time.

Candidate success criteria total: **55**.

---

# 40. Validation Scenarios Required for Review

The approved review sequence should test at minimum:

1. one candidate Entity with sufficient independent Evidence and no material conflict;
2. multiple competing Entity candidates with one current PASS 3B selection;
3. high PASS 2 confidence with insufficient PASS 3C confirmation inputs;
4. many Evidence objects propagated from one informational origin;
5. values that differ because of temporal Change;
6. overlapping-scope credible Conflict;
7. unknown temporal relation;
8. semantically non-comparable Evidence;
9. unknown independence material to Fusion;
10. dependent Evidence that remains valuable;
11. Fusion with counter-supporting Evidence;
12. a new Evidence successor requiring new Resolution and Fusion products;
13. policy-version change without new Evidence;
14. conflicting governance restrictions;
15. blocked Fusion with governance-safe audit diagnostics;
16. replay under the same and under a different method version;
17. advisory Evidence Expansion accepted, deferred, rejected, and unanswered;
18. newly retrieved information attempting to bypass PASS 3B admission;
19. attempted automatic winner selection;
20. attempted Evidence-to-Truth or Fusion-to-Knowledge promotion.
21. two syntactically equal Entity Identity values from different governing namespaces;
22. a selected Entity Identity that is merged, split, superseded, retired, or lifecycle-unknown at the resolution effective time;
23. declared non-material omissions, including rejection of each categorically ineligible omission type;
24. every Resolution Result outcome against every Fusion class and its maximum permitted Fusion outcome;
25. Conflict Interpretation replay and supersession with unchanged and changed policy/comparison basis;
26. synthesis-unit preservation, change, split, merge, addition, and removal across Fusion Product versions;
27. determined, partial, conflicting, unknown, and blocked governance composition, including attempted authorization from silence or a more permissive constituent.
28. valid, absent, unknown, expired, revoked, scope-mismatched, outcome-unauthorized, policy/method-mismatched, and delegation-invalid Resolution Authority Mandates, including historical mandate preservation;
29. current and explicitly historical resolution with `KNOWN_NONE_APPLICABLE`, `KNOWN_RELATIONSHIPS_PRESENT`, and `EXPLICIT_UNKNOWN_OR_UNAVAILABLE` lifecycle/relationship states, including attempted unknown-to-known-none substitution.
30. Fusion input closure across closed, closed-with-omissions, open, partial, and unknown states, including every categorical omission and attempted complete-outcome promotion;
31. valid, absent, unknown, expired, revoked, scope/class-mismatched, outcome-unauthorized, transformation-unauthorized, policy/method-mismatched, and delegation-invalid Fusion Authority Mandates, including historical authorization preservation and attempted Resolution-to-Fusion authority transfer.

These are review requirements, not review results.

---

# 41. Approved Review Architecture

PASS 3C follows the frozen 13-gate chain:

1. Initialization/Authoring Audit.
2. Architecture Review.
3. Entity Resolution Boundary Review.
4. Evidence Fusion Review.
5. Provenance Preservation Review.
6. Temporal / Conflict / Independence Review.
7. Confidence Boundary Review.
8. Search Interaction / PASS 3A Compatibility Review.
9. Access Governance / Security-Trust Boundary Review.
10. Cross-Pass Boundary Review.
11. Success Criteria Review.
12. Final Boundary Review.
13. Final Certification.

Remediation and recheck occur only if a finding is produced and require the applicable authorization. The Initialization/Authoring Audit, Architecture Review, and Entity Resolution Boundary Review gates are complete and PASS. The Evidence Fusion Review produced EF-3C-01 and EF-3C-02; this candidate contains the separately authorized Evidence Fusion R1 remediation. The Evidence Fusion R1 Recheck has not been performed.

---

# 42. Implementation Boundary

This specification does not define:

- classes, tables, database records, APIs, messages, or storage;
- identifier formats or generation algorithms;
- serialization or schema languages;
- confidence, independence, conflict, or temporal algorithms;
- machine-learning models;
- provider integrations;
- authorization enforcement;
- logging/telemetry infrastructure;
- deployment, migration, or backward-compatibility implementation.

An implementation may later realize these semantics only after separate authorization and review. Implementation convenience MUST NOT weaken this architecture.

---

# 43. Final Candidate Declaration

This candidate defines the complete first-pass semantic architecture required by the approved PASS 3C charter:

```text
Final Entity Resolution Contract        DEFINED
Final CONFIRMED Requirements            DEFINED
Evidence Fusion Contract                DEFINED
Bounded Conflict Capability             DEFINED
Evidence Independence Contract          DEFINED
Temporal Fusion Semantics               DEFINED
Provenance and Lineage Preservation     DEFINED
Confidence Boundaries                   DEFINED
Access Governance Propagation           DEFINED
PASS 3A Advisory Interaction            DEFINED
Decision Register                       PRESENT
Candidate Success Criteria              55
Candidate Architectural Invariants      32
Architectural Decisions Registered      24
Validation Scenarios                    31

Architecture Review R0                  FAIL — 6 FINDINGS
Architecture Remediation R1             COMPLETE — SELF-CHECK ONLY
Architecture Review R1 Recheck          PASS
Entity Resolution Boundary Review       FAIL — 2 FINDINGS
Entity Resolution Boundary Remediation  R1 COMPLETE — SELF-CHECK ONLY
Entity Resolution Boundary R1 Recheck   PASS
Evidence Fusion Review                  FAIL — 2 FINDINGS
Evidence Fusion Remediation R1          COMPLETE — SELF-CHECK ONLY
Evidence Fusion R1 Recheck              NOT PERFORMED
Remaining Specialist Reviews            NOT PERFORMED
Final Certification                     NOT PERFORMED
Implementation                          NOT STARTED
```

The remediated candidate is ready only for the separately authorized PASS 3C Evidence Fusion Review R1 Recheck. Remediation self-check is not a specialist-review PASS and is not architecture certification.

---

## END OF CONTROLLED ARCHITECTURE CANDIDATE
