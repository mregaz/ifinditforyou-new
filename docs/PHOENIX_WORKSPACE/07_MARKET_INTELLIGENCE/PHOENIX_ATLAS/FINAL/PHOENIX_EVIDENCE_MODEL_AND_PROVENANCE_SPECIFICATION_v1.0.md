# PHOENIX ATLAS — PASS 3B
## EVIDENCE MODEL & PROVENANCE
### Controlled Re-Materialization Candidate v0.1

**Status:** NEW CONTROLLED RE-MATERIALIZATION CANDIDATE — NOT CERTIFIED  
**Historical identity:** This document is not the lost Original Draft, Revision 1, Revision 2, or complete R2.1 artifact.  
**Highest directly verified historical state:** `PASS — READY FOR FINAL CERTIFICATION`  
**Final Certification:** NOT PERFORMED for this candidate  
**PASS 3B Certified Complete:** NO  
**PASS 3C:** NOT STARTED  
**Repository publication:** NOT PERFORMED
**Remediation level:** Authoring R1 + Architecture R1 + Evidence Model R1 + Provenance R2 + PASS 2 Compatibility R1 + Cross-Pass R1 + Temporal/Conflict R1

---

# 1. Document Governance and Provenance

This document is a newly authored controlled re-materialization candidate. It is derived only from the frozen `PASS 3B RECOVERY BASELINE INVENTORY`, the `PASS 3B FINAL ATTACHMENT-LEVEL RECOVERY RESULT`, and the approved `PASS 3B SOURCE-TO-CONTRACT MATRIX`. It does not claim to reproduce unavailable historical wording.

Every normative statement uses one of these provenance markers:

```text
[V]   VERBATIM — exact recovered canonical text
[C]   CONSTRAINED — newly composed wording bounded by recovered contracts
[N]   NEW-REVIEW-REQUIRED — explicit new architecture requiring renewed review
[H]   HISTORICAL-ONLY — status or review evidence; not a normative contract
[B]   BLOCKED — insufficient evidence; no contract authored
```

If a conflict exists between `[V]` text and any `[C]` or `[N]` text, `[V]` controls until review resolves the conflict. Historical summaries and unavailable attachment references are not normative sources.

---

# 2. Purpose

[N] PASS 3B defines a reviewable architecture for preserving observations as canonical Evidence with explicit subject, provenance, temporal context, independence, confidence boundaries, conflict semantics, historical preservation, and access-governance traceability.

[C] PASS 3B begins after provider planning and search execution have produced results. It governs Evidence semantics; it does not govern provider registries, planning, execution, Search State, STOP, or EXPAND.

[C] The architecture preserves these distinctions:

```text
Observation ≠ Evidence ≠ Fact ≠ Knowledge ≠ Decision
```

---

# 3. Scope

[N] This candidate covers:

```text
Observation
Evidence Type and Evidential Content
Evidence Subject
Information Provenance
Retrieval Provenance
Minimum Valid Provenance
Provenance Validation
Temporal Context
Canonical Evidence Admission
Evidence Identity
Entity Association Boundary
Evidence Independence
Confidence Boundaries
CONFLICT / CHANGE / UNKNOWN
Preservation and Supersession
Evidence Sufficiency and Expansion Boundaries
Access Governance Attachment
Initial Implementation Scope
```

[C] Scope does not imply implementation, serialization, scoring, Entity Resolution, Evidence Fusion, Knowledge construction, Decision Intelligence, or PASS 3C design.

---

# 4. Non-Scope and Deferred Capabilities

[C] The following remain deferred:

```text
Final Entity Resolution algorithms
PASS 2 confidence ↔ PASS 3B state mapping
Final CONFIRMED identity requirements
Evidence Fusion
Conflict-resolution policy
Automatic confidence computation
Source reliability / reputation
Fraud detection
Valuation inference
Knowledge construction
Decision Intelligence
Recommendation generation
Detailed Evidence Expansion planning
```

[C] Deferral means that PASS 3B may preserve the boundary needed by a future phase, but must not define the deferred capability's algorithm, final policy, score, or execution model.

---

# 5. PASS 3A Ownership Boundary

[C] PASS 3A retains ownership of:

```text
REGISTRY
   ↓
PLANNER
   ↓
EXECUTION
   ↓
SEARCH STATE
   ↓
STOP / EXPAND
```

[C] PASS 3B must not redefine Registry, Planner, Execution, Search State, STOP, EXPAND, `inventorySufficiency`, or `searchSaturation`.

[C] The following contracts are preserved:

```text
Search Sufficiency ≠ Evidence Truth
Inventory Sufficiency ≠ Evidence Sufficiency
Inventory Expansion ≠ Evidence Expansion
```

---

# 6. PASS 2 Compatibility Boundary

[N] PASS 3B specializes Evidence and Provenance semantics without modifying certified PASS 2 contracts. Any apparent contradiction with PASS 2 requires a dedicated compatibility review; this candidate cannot silently resolve it.

[C] PASS 2 Entity Resolution confidence and PASS 3B Entity Association state are separate semantic axes. PASS 3B does not define their final mapping.

[N] PASS 3B may own an Entity Association record, its local lifecycle state, and a selection designation for an Evidence-specific scope. It does not thereby own, originate, confirm, or supersede the referenced Entity Identity, the PASS 2 Entity Resolution result, or their external authorities.

[N] A PASS 3B association selection is not a resolved identity decision. No PASS 3B association state or selection designation may function as an implicit PASS 2 confidence result, an automatic mapping from PASS 2, or final Entity Resolution.

---

# 7. PASS 3C Boundary

[C] PASS 3C is not started. PASS 3B does not design final Entity Resolution, Evidence Fusion, conflict resolution, Knowledge construction, Decision Intelligence, or recommendation generation.

[C] PASS 3B may define stable Evidence inputs and explicit unresolved states that a future PASS 3C must preserve. That does not authorize PASS 3B to implement PASS 3C behavior.

[N] A future PASS 3C consumer references Canonical Evidence without silently mutating Evidence Identity, primary evidential content, Evidence Subject, provenance, Temporal Context, association history, independence state, represented conflicts, supersession history, or Access Governance. PASS 3C-derived artifacts use PASS 3C-owned identities and authorities and must not write derived Truth, Knowledge, Decision, resolution, Fusion, or recommendation state back into PASS 3B Evidence semantics.

[N] If downstream processing identifies a correction to Evidence meaning, it may request or support an authorized new-Evidence path; the correction creates a new Evidence Identity and explicit supersession under PASS 3B rules rather than retroactively mutating the consumed Evidence. This boundary does not define PASS 3C algorithms, schemas, policies, or execution.

---

# 8. Observation

[C] An Observation is the captured representation of something returned, reported, measured, or otherwise encountered before canonical Evidence admission.

[C] An Observation is not automatically Evidence. It may be incomplete, duplicate, conflicting, temporally ambiguous, poorly attributed, or associated with an unresolved subject.

[C] Admission to canonical Evidence requires all mandatory constituents and successful provenance validation.

---

# 9. Provider Result → Observation Boundary

[C] A Provider Result is an upstream execution output. PASS 3B may capture it as an Observation without redefining the provider, query plan, execution semantics, Search State, or upstream sufficiency decision.

[C] Provider Result capture must preserve available origin and retrieval context. Normalization must not erase the distinction between the upstream result and the resulting Observation.

[N] Every PASS 3A → PASS 3B delivery or capture attempt carries or references a semantic handoff record containing:

```text
the exact upstream Provider Result reference;
the producing PASS 3A execution/result authority;
the applicable execution, query, and result scope;
the upstream result state and effective context at handoff;
the receiving PASS 3B capture authority;
the handoff/capture attempt identity or stable reference;
the resulting Observation reference, or an explicit no-capture outcome;
the derivation relationship between Provider Result and Observation.
```

[N] One handoff/capture attempt references exactly one Provider Result and yields zero or one Observation capture. One Provider Result may participate in multiple delivery attempts. A repeated delivery either references the previously captured Observation as a duplicate with no new Observation, or creates a distinct Observation for a distinct capture event with an explicit replay/duplicate relationship to the earlier handoff and Observation. It must not overwrite or silently collapse prior Observation or Evidence history.

[N] A PASS 3B capture failure, no-capture outcome, failed provenance validation, or failed Canonical Evidence admission does not alter the upstream Provider Result, PASS 3A execution result, Registry, Planner, Search State, inventory sufficiency, search saturation, STOP, or EXPAND state. PASS 3B records its own outcome and retains the upstream reference where available.

[N] These are semantic traceability and ownership rules only. Transport, acknowledgment protocol, retry, orchestration, replay detection, and deduplication algorithms remain deferred and PASS 3A-owned where they concern upstream execution.

---

# 9A. Evidence Type and Evidential Content

[N] Every Canonical Evidence object represents one primary evidential unit derived from one originating Observation. The primary evidential unit is the smallest admitted assertion or occurrence that can be interpreted, compared, preserved, and superseded without requiring unrelated claims to share one Evidence Identity.

[N] Every primary evidential unit contains these semantic constituents:

```text
Evidence Type;
the proposition, attribute, event, or other typed content being evidenced;
the represented value or occurrence state, including an explicit
UNKNOWN or UNAVAILABLE state when a value cannot be supplied;
the Evidence Subject and proposition-relevant scope;
the originating Observation reference.
```

[N] Evidence Type declares the semantic form of the primary evidential unit. At minimum, the type authority must distinguish whether the content represents a proposition, an attribute/value assertion, an event or occurrence, or another explicitly governed Evidence kind. New types require an identified governing authority and must not acquire meaning solely from serialization or implementation convention.

[N] One Evidence object contains exactly one primary evidential unit. A controlled set of inseparable fields may constitute that unit only when the Evidence Type defines their joint meaning. A document, Provider Result, or Observation containing multiple independently interpretable claims must not be admitted as one undifferentiated Evidence assertion; each independently interpretable claim produces a separate Evidence object.

[N] `UNKNOWN` means the relevant value or occurrence state is not known. `UNAVAILABLE` means it is known that the required representation cannot currently be supplied. Neither state may be represented as an omitted mandatory semantic constituent, a false value, or an inferred value.

[N] This section defines semantic architecture only. Concrete type registries, field names, value encodings, serialization, validation syntax, and Evidence Fusion remain outside this candidate.

---

# 10. Evidence Subject

[C] Evidence Subject identifies what an Observation or Evidence object is about without necessarily asserting a resolved canonical Entity Identity.

[C] Evidence Subject is a mandatory Canonical Evidence admission constituent.

[C] A subject must remain meaningful while Entity Association is unresolved. Evidence Subject must not silently become the authoritative owner of resolved Entity Identity.

```text
Evidence Identity ≠ Entity Identity
```

[N] Every Evidence Subject contains these minimum semantic constituents:

```text
subject kind or domain;
subject-local reference or description;
scope relevant to the primary evidential unit;
resolution state: DESCRIBED, UNRESOLVED, or UNKNOWN.
```

[N] `DESCRIBED` means the subject is meaningfully described without asserting final Entity Identity. `UNRESOLVED` means a subject-local reference or description exists but no authoritative Entity Association is established. `UNKNOWN` means the subject cannot be more specifically identified; the mandatory subject constituent remains explicit rather than omitted.

[N] The subject-local reference or description is local to the Evidence meaning and is not an authoritative resolved Entity Identity. The proposition-relevant scope states which aspect, role, part, or context of the described subject the primary evidential unit concerns.

[N] Every Evidence Subject resolution state is explicitly qualified as belonging to the `EVIDENCE_SUBJECT_RESOLUTION` axis and identifies its recording authority. Its `UNRESOLVED` label is not equivalent to PASS 2 Entity Resolution confidence or PASS 3B Entity Association state.

[N] Concrete field names, identifier grammar, value encodings, and final Entity Resolution remain outside this candidate.

---

# 11. Information Provenance

[C] Information Provenance describes the informational origin and lineage of the observed content: where the information claims to originate, how it is attributed, and what lineage is available within the information itself.

[C] Information Provenance must preserve explicit unknown, incomplete, or conflicting lineage. It must not invent origin or certainty.

```text
Information Provenance ≠ Retrieval Provenance
```

[N] Every Information Provenance record state contains these minimum semantic constituents:

```text
a stable provenance record reference or identity;
the informational source/origin assertion, or its explicit unknown state;
a source reference or source description supporting that assertion when known;
available attribution and lineage from the information itself;
the authority responsible for recording the provenance state;
the provenance value state;
the production/publication time reference or explicit unknown state;
the state effective time or explicit EXPLICIT_UNKNOWN effective time.
```

[N] A known informational-origin reference is a durable reference or sufficiently discriminating description that identifies the asserted information source independently of the retrieval event. A provider name, retrieval URL, or capture event alone is not a known informational-origin reference unless it also identifies the asserted information source.

[N] Meaning-affecting normalization or transformation lineage is part of Information Provenance. Each such lineage step records or references its input, transformation kind, responsible authority or process, and relationship to its output. Representational normalization that does not change interpretation may be summarized, but it must not collapse origin or attribution.

[N] Concrete field names, identifier grammar, encoding, lineage serialization, and storage remain implementation decisions. They must not weaken these semantic constituents.

---

# 12. Retrieval Provenance

[C] Retrieval Provenance describes how, when, and through which retrieval context the Observation was obtained, where that context is available.

[C] Retrieval Provenance does not replace Information Provenance. A retrieval path may be known while informational origin is unknown, or informational origin may be stated while retrieval details are incomplete.

[N] Every Retrieval Provenance record state contains these minimum semantic constituents:

```text
a stable provenance record reference or identity;
a retrieval or capture event reference or explicit unknown state;
the historical retrieving/capturing authority or agent or explicit unknown state;
the provider-result, channel, endpoint, or equivalent retrieval-context
reference or explicit unknown state;
the retrieval/capture method or explicit unknown state;
the authoritative retrieval/capture time or explicit unknown state;
the authority responsible for recording the present provenance record state;
the provenance value state;
the state effective time or explicit EXPLICIT_UNKNOWN effective time.
```

[N] A known retrieval/capture reference is a durable event or context reference that identifies the retrieval or capture occurrence and its responsible authority or agent. A bare informational-source assertion without an identifiable retrieval/capture event or context is not a known retrieval/capture reference.

[N] The authority responsible for recording the present provenance record state is distinct from the historical retrieving/capturing authority or agent. The recording authority remains explicit even when the historical event, historical agent, or historical retrieval context is `EXPLICIT_UNKNOWN`; it attests only to the creation of the provenance record state and must not be represented as the unknown historical actor.

[N] When the Retrieval Provenance plane state is `EXPLICIT_UNKNOWN`, every unavailable historical retrieval constituent is recorded with its explicit unknown state. When the plane state is `KNOWN`, the record must contain a qualified retrieval/capture reference and must not use explicit unknown in place of the event and responsible historical authority information required by that qualified reference.

[N] Concrete field names, request/response details, query representation, identifier grammar, encoding, serialization, and storage remain implementation decisions. They must not redefine PASS 3A execution.

---

# 12A. Provenance Record Identity and Attachment

[N] A provenance record identity identifies one immutable provenance record state. Meaning-changing correction of an origin assertion, source reference, attribution/lineage, retrieval context, responsible authority, value state, or provenance-owned time creates a new provenance record state with a new stable reference and an explicit predecessor/successor relationship. The predecessor remains preserved.

[N] Every Canonical Evidence object references exactly one admitted Information Provenance record state and exactly one admitted Retrieval Provenance record state. Those two references are distinct even when maintained by the same authority. Multiple Evidence objects derived from one Observation may share the same immutable provenance record-state references.

[N] Multiple provenance assertions within one plane are represented inside the authoritative record state as explicit compatible lineage or `CONFLICTING` alternatives; they must not be collapsed into an ambiguous reference. A later provenance record may be linked to Evidence, but it must not replace the two admission-time record-state references.

[N] This attachment contract defines semantic identity, cardinality, and preservation only. Identifier syntax, physical snapshots, copy-on-write behavior, storage layout, and transfer encoding remain deferred.

---

# 13. Minimum Valid Provenance

[N] Minimum Valid Provenance is the minimum structurally sufficient provenance state required for Canonical Evidence admission.

[C] It must:

```text
permit explicitly incomplete provenance;
prohibit provenance-free Canonical Evidence;
distinguish UNKNOWN from absent or unrecorded provenance;
preserve Information Provenance ≠ Retrieval Provenance;
avoid invented certainty;
provide a deterministic admission gate.
```

[N] For this new candidate, Minimum Valid Provenance requires all of the following architectural constituents:

```text
1. a distinct Information Provenance record is present;
2. a distinct Retrieval Provenance record is present;
3. each record declares its value state explicitly as:
   KNOWN, EXPLICIT_UNKNOWN, CONFLICTING, or UNRECORDED;
4. at least one of the two records contains a known origin or retrieval/capture reference;
5. any unknown or conflicting value remains explicit and is not defaulted;
6. no mandatory provenance record is absent or silently unrecorded.
```

[N] `EXPLICIT_UNKNOWN` is a recorded provenance state. `UNRECORDED` means the required state was not captured. They are not equivalent.

[N] `KNOWN` requires the applicable qualified known reference defined by Section 11 or 12. `EXPLICIT_UNKNOWN` contains no claimed known reference and explicitly records that the plane value is unknown. `UNRECORDED` is not a valid admitted record state.

[N] A `CONFLICTING` provenance plane preserves at least two mutually incompatible origin, attribution, lineage, retrieval, capture, authority, or time alternatives; identifies the plane and semantic scope of conflict; and preserves a separate reference and value qualification for every alternative. A conflict state contains a qualified known reference for admission purposes only when at least one preserved alternative satisfies the applicable Section 11 or 12 known-reference definition. The alternatives remain unresolved and no winner is selected.

[N] Provenance is incomplete but structurally admissible when one provenance plane contains a qualified known reference and the other is present with `EXPLICIT_UNKNOWN` or `CONFLICTING`. It is also incomplete but structurally admissible when a `CONFLICTING` plane contains at least one qualified known alternative and the other plane is `EXPLICIT_UNKNOWN` or `CONFLICTING`. Provenance is not admissible when either provenance record is absent, a mandatory state is `UNRECORDED`, a `KNOWN` state lacks its applicable qualified reference, a `CONFLICTING` state does not preserve its required alternatives and scope, or both provenance planes lack any qualified known origin or retrieval/capture reference.

[N] These are new candidate decisions, not recovered historical field wording. Provenance Review must test their sufficiency and may refine terminology without weakening the admission boundary.

---

# 14. Provenance Validation

[C] Provenance Validation determines whether the available Information Provenance and Retrieval Provenance jointly satisfy the approved Minimum Valid Provenance contract.

[N] Provenance Validation uses three separate architectural dimensions:

```text
ADMISSION OUTCOME
  ADMISSIBLE
  NOT_ADMISSIBLE

COMPLETENESS QUALIFICATION
  COMPLETE
  INCOMPLETE_EXPLICIT

PROVENANCE VALUE STATE
  KNOWN
  EXPLICIT_UNKNOWN
  CONFLICTING
  UNRECORDED
```

[N] Every validation result records exactly one admission outcome, exactly one completeness qualification, and the value state of each provenance plane. Failure or qualification reasons are recorded separately and must identify the violated Minimum Valid Provenance rule rather than masquerading as additional outcomes.

[N] `ADMISSIBLE` requires both provenance record states to be present, no mandatory state to be `UNRECORDED`, every `KNOWN` or `CONFLICTING` state to satisfy its state-specific semantic rules, and at least one qualified known origin or retrieval/capture reference across the two planes. `NOT_ADMISSIBLE` applies when any condition fails. `CONFLICTING` may remain admissible only when its alternatives and scope are explicit and the minimum structural gate is otherwise satisfied.

[N] Completeness qualification is exhaustive and independent of admission outcome:

```text
COMPLETE
  both planes are KNOWN;
  each contains its applicable qualified known reference;
  every completeness-relevant semantic constituent in both planes
  has a known value or an explicitly valid no-lineage/no-additional-
  attribution condition;
  no completeness-relevant constituent is EXPLICIT_UNKNOWN,
  CONFLICTING, UNRECORDED, absent, or semantically invalid.

INCOMPLETE_EXPLICIT
  every other combination, including any plane or completeness-relevant
  constituent that is EXPLICIT_UNKNOWN, CONFLICTING, UNRECORDED,
  absent, or semantically invalid.
```

[N] Therefore `COMPLETE` may accompany only `ADMISSIBLE`. `INCOMPLETE_EXPLICIT` may accompany either `ADMISSIBLE` or `NOT_ADMISSIBLE`. Completeness does not override the admission outcome, and admission does not imply completeness.

[N] Completeness means completeness of provenance knowledge required by this architecture, not merely structural presence of fields. Explicitly valid absence of additional attribution or lineage is complete only when the record affirmatively states that no additional attribution or lineage is asserted or applicable; silence is not equivalent. An unknown method, historical actor, context, provenance-owned time, or state-effective time makes the result `INCOMPLETE_EXPLICIT` but does not by itself make it `NOT_ADMISSIBLE` when Minimum Valid Provenance is otherwise satisfied.

[N] This state model is proposed new architecture for Provenance Review and is not claimed as a recovered historical taxonomy.

[C] Failed validation must prevent Canonical Evidence admission.

[N] The underlying Observation should be retained when validation fails. This is a proposed lifecycle and retention rule requiring Evidence Lifecycle Review; it is not claimed as recovered historical architecture.

---

# 15. Temporal Context

[C] Temporal Context records the temporal meaning necessary to interpret an Observation as Evidence. It is mandatory before Canonical Evidence admission.

[N] The candidate proposes that Temporal Context distinguish, where supported:

```text
time of the observed condition or event;
time the information was produced or published;
time the information was retrieved;
unknown or unavailable temporal values.
```

[N] Every Temporal Context state contains these minimum semantic constituents:

```text
a stable Temporal Context state reference or identity;
the recording authority;
the Evidence-relevant temporal subject and semantic scope;
temporal kind: INSTANT or INTERVAL, when the value is known;
temporal value state: KNOWN, EXPLICIT_UNKNOWN, UNAVAILABLE, or CONFLICTING;
the instant value or interval bounds applicable to the kind and state;
open/closed bound meaning where applicable;
precision or granularity;
uncertainty or approximation qualification;
the calendar/time-zone or other authoritative temporal frame when required;
the reason for a non-KNOWN state;
the state-effective time or explicit EXPLICIT_UNKNOWN effective time.
```

[N] A Temporal Context state identity identifies one immutable state. Meaning-changing correction of temporal subject/scope, kind, value/bounds, precision, uncertainty, frame, or value state creates a new Temporal Context state with a new stable reference and an explicit predecessor/successor relationship. Admission-time Temporal Context remains preserved.

[N] Temporal Context validation has exactly one structural outcome, `VALID` or `NOT_VALID`, with explicit failure or qualification reasons:

```text
KNOWN / INSTANT
  requires a temporal value, applicable frame, precision, and uncertainty state.

KNOWN / INTERVAL
  requires at least one non-open bound; explicit open/closed semantics;
  compatible frame, precision, and uncertainty states; and start not later
  than end when both bounds are comparable.

EXPLICIT_UNKNOWN
  is VALID only when the temporal subject/scope, recording authority, explicit
  unknown value state, and unknown reason are present. It is not an empty record.

UNAVAILABLE
  is VALID only when the temporal subject/scope, recording authority, explicit
  unavailable state, and reason the value cannot be supplied are present.

CONFLICTING
  is VALID only when at least two incompatible temporal alternatives, their
  frames/qualifications, conflict scope, and references are preserved without
  selecting a winner.
```

[N] A `VALID` `EXPLICIT_UNKNOWN`, `UNAVAILABLE`, or `CONFLICTING` Temporal Context may satisfy the mandatory structural admission constituent, but remains explicitly temporally incomplete and constrains later comparison to `UNKNOWN` unless a reviewed relation is decidable from preserved alternatives. `NOT_VALID` prevents Canonical Evidence admission.

[N] Production/publication or retrieval/capture time may be referenced for interpretation but must not silently substitute for an unknown or unavailable Evidence-relevant observed/effective time. A fully unknown Temporal Context is admissible only through the explicit, scoped, authoritative `EXPLICIT_UNKNOWN` state defined above, never through omission or an empty payload.

[N] Temporal ownership is defined as follows:

```text
Information Provenance owns the authoritative production/publication time
reported for the information source.

Retrieval Provenance owns the authoritative retrieval/capture time for the
retrieval event.

Temporal Context owns the Evidence-relevant observed/effective time or interval.

Temporal Context references provenance-owned production/publication and
retrieval/capture times when they are relevant; it must not create divergent
authoritative duplicates.
```

[N] If a transferred Evidence representation includes a snapshot of a provenance-owned time, the snapshot must retain an explicit reference to its authoritative provenance record and must not silently override it. Disagreement is represented explicitly rather than resolved by precedence.

[N] Temporal comparison uses exactly one reviewed relation for a declared comparison scope:

```text
SAME
OVERLAPPING
DISJOINT
UNKNOWN
```

[N] `SAME` means the contexts denote the same time or interval within their declared precision and uncertainty. `OVERLAPPING` means their qualified possible ranges intersect without being the same. `DISJOINT` means the qualified possible ranges do not intersect. `UNKNOWN` means different frames, insufficient precision, uncertainty, open bounds, unknown/unavailable state, or conflicting alternatives prevent a supported relation.

[N] Instants are compared as qualified temporal points and intervals as qualified ranges. An instant relates to an interval by whether its qualified point is within, overlaps through uncertainty, or is disjoint from the interval’s qualified range. Precision and uncertainty broaden the qualified range used for the semantic relation; they must not be silently discarded. Concrete comparison algorithms and calendar conversion remain deferred.

[N] The exact historical temporal schema is unavailable. Concrete field names, encodings, parsing, precision scales, uncertainty calculations, calendar conversion, and storage remain implementation or separately reviewed decisions. They must not weaken the semantic state and validity rules above.

---

# 16. Canonical Evidence Admission

[V] This ordering preserves the canonical Evidence admission contract:

```text
OBSERVATION
    +
EVIDENCE SUBJECT
    +
MINIMUM VALID PROVENANCE
    +
TEMPORAL CONTEXT
    ↓
CANONICAL EVIDENCE
```

[V] `Temporal Context` is therefore established **before** Canonical Evidence admission.

[V] Canonical Evidence must not be created while any mandatory admission constituent remains absent.

[C] Admission establishes a canonical Evidence identity and preserves the admitted Observation, subject, provenance, and Temporal Context without claiming that the Evidence is true, independent, conflict-free, or resolved to a final entity.

[N] Admission also validates that the Evidence Type and primary evidential unit required by Section 9A are explicit and internally coherent. This validation does not alter or add a constituent to the verbatim admission ordering above: the typed evidential unit is the controlled evidential content derived from the admitted Observation, while Evidence Subject, Minimum Valid Provenance, and Temporal Context remain mandatory admission constituents.

[N] The admitted Evidence state preserves the exact Information Provenance and Retrieval Provenance record-state references that satisfied Minimum Valid Provenance. Later correction, enrichment, or transfer must not substitute different record states for those admission-time references.

---

# 17. Evidence Lifecycle

[C] The recoverable lifecycle constraint is:

```text
SOURCE
  ↓
OBSERVATION
  ↓
PROVENANCE CAPTURE
  ↓
MINIMUM PROVENANCE VALIDATION
  ↓
TEMPORAL CONTEXT
  ↓
CANONICAL EVIDENCE
  ↓
PRESERVATION / TRANSFER / ASSOCIATION
```

[C] Canonical Evidence must never precede mandatory Provenance or mandatory Temporal Context.

[N] Additional lifecycle states, transitions, deletion rules, retention rules, and error states require renewed Architecture and Evidence Model Reviews.

[N] Transfer preserves the authoritative admission-time Information and Retrieval Provenance references and their record-state identities. A transferred representation must not silently rewrite origin, attribution, lineage, retrieval context, responsible authority, provenance-owned time, or value state. Later provenance may be linked as a new explicitly related record state but must not replace or reattribute the historical state.

---

# 18. Canonical Evidence

[N] Canonical Evidence is an admitted, identifiable, preservable Evidence object containing exactly one primary evidential unit whose Evidence Type and mandatory subject, provenance, and temporal constituents have passed validation.

[C] Canonical status means structurally admitted, not verified as Truth.

```text
High Confidence ≠ Truth
```

[C] Canonical Evidence may remain incomplete, disputed, associated with an unresolved entity, or of unknown independence if those conditions are represented explicitly.

[N] One Observation may yield zero, one, or multiple Canonical Evidence objects. Every Canonical Evidence object references exactly one originating Observation. When one Observation contains multiple independently interpretable claims, each admitted claim receives a distinct Evidence Identity.

[N] Multiple Observations must not be composed into one Canonical Evidence object. Combining evidence from multiple Observations requires aggregation that preserves each Evidence Identity or a separately reviewed Evidence Fusion contract; admission must not perform Fusion implicitly.

---

# 19. Evidence Identity

[C] Every canonical Evidence object requires an Evidence Identity distinct from any Entity Identity.

```text
Evidence Identity ≠ Entity Identity
```

[N] Evidence Identity follows this minimum lifecycle contract:

```text
an Evidence Identity identifies one admitted canonical Evidence state;
the identity is immutable after admission;
a correction that changes admitted meaning creates a new Evidence Identity;
the new Evidence may supersede, but does not overwrite, the predecessor;
display versions or revision labels do not replace Evidence Identity;
identity continuity is represented through explicit relationships.
```

[N] Identifier syntax, generation, global uniqueness mechanism, collision handling, and serialization remain implementation decisions requiring Evidence Model Review. They must not weaken immutability or non-destructive supersession.

[N] Non-semantic metadata may be attached or enriched without creating a new Evidence Identity only when the change does not alter the primary evidential unit, Evidence Type, proposition, represented value or occurrence state, Evidence Subject or scope, provenance meaning, or Temporal Context. Any change to one of those semantic constituents creates a new Evidence Identity and is linked through explicit supersession; it must not be applied in place.

---

# 20. Entity Association

[N] Entity Association records the relationship between Evidence and a candidate or resolved entity without changing Evidence Identity or Evidence Subject.

[C] Association may occupy these recovered lifecycle/state labels:

```text
UNRESOLVED
CANDIDATE
PROBABLE
CONFIRMED
```

[C] Evidence remains valid when association is unresolved. High probabilistic matching alone must not establish `CONFIRMED`.

[N] Entity Association is the sole owner within PASS 3B of the association record, its `PASS_3B_ENTITY_ASSOCIATION_STATE`, and its Evidence-to-candidate-Entity relationship. The record retains the referenced Entity Identity together with its originating Entity Identity authority; PASS 3B does not become the authority for that Entity Identity merely by recording the reference. Evidence Subject owns the subject description or subject-local key needed to state what the Evidence concerns and does not duplicate the referenced Entity Identity as an independent authority.

[N] Evidence Subject may reference the applicable Entity Association record but must not copy an entity reference as an independent authority. An absent Entity Association means the Evidence remains valid with unresolved entity identity. Final `CONFIRMED` requirements remain deferred.

[N] One Entity Association record represents exactly one Evidence Identity ↔ candidate Entity Identity pair. One Evidence object may therefore retain zero, one, or multiple simultaneous candidate association records. Competing candidates must remain separately represented and must not overwrite or merge one another.

[N] At most one Entity Association record for an Evidence object may be designated `CURRENT_SELECTED_ASSOCIATION` for a declared PASS 3B association scope and effective context. The designation identifies only the candidate association currently selected for that local scope. It is not an authoritative or resolved Entity Identity, does not convert `CANDIDATE` or `PROBABLE` into `CONFIRMED`, does not erase competing candidates, and does not determine final Entity Resolution.

[N] A change in current selection preserves the previously selected association record, its axis-qualified state, selection authority, rationale, and effective context. Selection authority attests to the PASS 3B selection decision only; it does not attest to the truth or final resolution of the referenced Entity Identity. Final `CONFIRMED` requirements and resolution algorithms remain deferred.

[N] When PASS 2 supports an Entity Association, the association records or references the exact supporting PASS 2 Entity Resolution result, its result authority, its `PASS_2_ENTITY_RESOLUTION_CONFIDENCE` value, its resolution scope, and its effective context. PASS 3B consumes that referenced result without recomputing, renaming, reinterpreting, or superseding its confidence.

[N] A later or superseding PASS 2 result may support a new Entity Association record or a new `CURRENT_SELECTED_ASSOCIATION` designation. It must not silently mutate a prior association, automatically map or promote a PASS 3B association state, erase the former PASS 2 result reference, or convert selection into final Entity Resolution.

---

# 21. PASS 2 Confidence vs PASS 3B Association State

[C] PASS 2 Entity Resolution confidence taxonomy is recovered as:

```text
EXACT
STRONG
PROBABLE
WEAK
UNRESOLVED
```

[C] PASS 3B Entity Association lifecycle/state is recovered as:

```text
UNRESOLVED
CANDIDATE
PROBABLE
CONFIRMED
```

[C] These are distinct axes even where labels coincide. No automatic mapping, equivalence, promotion rule, or final resolution algorithm is defined here.

[N] Every confidence or state value is recorded or referenced with its semantic axis and owning authority. The required axis identities are:

```text
PASS_2_ENTITY_RESOLUTION_CONFIDENCE
PASS_3B_ENTITY_ASSOCIATION_STATE
EVIDENCE_SUBJECT_RESOLUTION
```

[N] A bare shared label such as `PROBABLE` or `UNRESOLVED` has no cross-axis meaning. Equality of label text does not authorize comparison, mapping, copying, promotion, or equivalence. References crossing a boundary retain the original axis, value, authority, scope, and effective context.

---

# 22. Evidence Independence

[C] Independence is an explicitly represented evidential property or assessment; it must not be inferred merely from the number of Evidence objects.

```text
Evidence Count ≠ Independent Evidence Count
Unknown Independence ≠ Confirmed Independence
```

[N] Independence-assessment methods, source-clustering rules, shared-origin detection, and thresholds require a dedicated Evidence Model Review and are not defined by this candidate.

[N] Every Canonical Evidence object carries or references an Evidence Independence assessment with exactly one of these minimum states:

```text
INDEPENDENT
DEPENDENT
UNKNOWN
```

[N] `INDEPENDENT` means the identified assessment authority has established independence for the declared comparison scope. `DEPENDENT` means a relevant dependency has been established for that scope. `UNKNOWN` means independence has not been established either way. Absence of assessment evidence defaults to `UNKNOWN`, never to `INDEPENDENT`.

[N] Every non-`UNKNOWN` independence state records or references its assessment authority, declared comparison scope, assessment basis, and assessment time or explicit `EXPLICIT_UNKNOWN` time. An `UNKNOWN` state records the reason it remains unknown where available. These are traceability requirements, not an independence algorithm.

---

# 23. Confidence

[C] Confidence must qualify a specific proposition or process.

```text
High Confidence ≠ Truth
```

[C] PASS 3B must not define a universal unexplained confidence score. Separate confidence-bearing propositions or processes must not be collapsed into one value merely for convenience.

[N] PASS 2 Entity Resolution confidence qualifies only its PASS 2 Entity Resolution proposition or process and remains on the `PASS_2_ENTITY_RESOLUTION_CONFIDENCE` axis unless a separately reviewed mapping is authorized. It must not be reused as Evidence confidence, Evidence Truth, provenance quality, source reliability, Evidence Independence, or `PASS_3B_ENTITY_ASSOCIATION_STATE`.

[N] Any PASS 3B confidence reference identifies its specific proposition or process, its distinct semantic axis, its authority, scope, and effective context. Referencing a PASS 2 result for traceability does not create a PASS 3B confidence value.

[N] Confidence value types, scales, provenance, computation, aggregation, and calibration require a separate reviewed contract. Automatic confidence computation remains deferred.

---

# 24. CONFLICT / CHANGE / UNKNOWN

[N] Conflict classification is evaluated against an explicit comparison key:

```text
Evidence Subject
+ proposition or attribute
+ semantic scope
+ relevant Temporal Context
```

[N] The candidate proposes the following reviewable definitions while preserving the recovered requirement that the three concepts remain distinct:

```text
CONFLICT — Evidence supports incompatible propositions for the same comparison
           key and the incompatibility is not explained as temporal Change.

CHANGE   — differing values may represent a real temporal transition rather
           than disagreement.

UNKNOWN  — available Evidence is insufficient to determine conflict, change,
           identity, value, or another required conclusion.
```

[C] A temporal change must not be classified as Conflict merely because values differ across time.

```text
Conflict ≠ Temporal Change
```

[N] Temporal classification is constrained as follows:

```text
CONFLICT
  requires SAME or OVERLAPPING Temporal Context for the declared comparison
  scope, incompatible propositions, and no supported transition explanation.

CHANGE
  requires temporally ordered, normally DISJOINT contexts and an explicit
  rationale that the differing values represent a transition. DISJOINT alone
  does not prove Change.

UNKNOWN
  is required when the temporal relation is UNKNOWN, the propositions or
  scopes are not sufficiently comparable, or available Evidence cannot
  support either Conflict or Change.
```

[N] `CONFLICTING` temporal alternatives are evaluated without selecting a winner. They support `CONFLICT` or `CHANGE` only when every material alternative leads to the same classification for the declared scope; otherwise classification remains `UNKNOWN` or `REVIEW_REQUIRED`.

[N] The definitions, comparison key, temporal relations, and classification constraints above are explicit new reviewable prose constrained by F-05. Concrete conflict detection algorithms, thresholds, and resolution policies are not defined.

---

# 25. Conflict Preservation

[N] When canonical Evidence supports incompatible propositions for a comparable key, the model preserves every Evidence object, its provenance, Temporal Context, and the comparison/conflict relationship without silently applying a credibility, confidence, Truth, or source-reliability filter and without selecting a winner.

[C] Conflict representation is not conflict resolution. Resolution policy remains deferred.

[N] Every comparison/conflict relationship state contains these minimum semantic constituents:

```text
a stable relationship-state reference or identity;
two or more distinct canonical Evidence endpoints;
the complete comparison key and declared conflict scope;
the reviewed temporal relation;
the classifying authority;
classification: CONFLICT, CHANGE, UNKNOWN, or REVIEW_REQUIRED;
the classification rationale and material alternatives;
the effective context and time or explicit EXPLICIT_UNKNOWN time;
preservation references for all endpoint Evidence, provenance, Temporal
Context, and applicable Access Governance;
the predecessor relationship-state reference when corrected or reclassified.
```

[N] `CONFLICT` requires at least two endpoints and the Section 24 conflict constraints. `CHANGE` records a supported temporal transition without erasing the compared Evidence. `UNKNOWN` records an evidence/temporal insufficiency. `REVIEW_REQUIRED` records that classification is not currently decidable under the reviewed rules. None is a winner-selection or Truth state.

[N] A relationship identity identifies one immutable relationship state. Correction or reclassification creates a new relationship state with a new stable reference and an explicit predecessor/successor relationship; all prior states and endpoints remain preserved. Relationship-state change does not mutate or erase Evidence.

[N] Credibility, confidence, provenance quality, and source reliability may be separately traceable inputs when later reviewed, but they cannot suppress preservation of a comparable incompatible canonical Evidence endpoint or silently prevent creation of `UNKNOWN`/`REVIEW_REQUIRED`. Conflict detection algorithms, scoring, resolution, and closure policy remain deferred.

---

# 26. Evidence Aggregation and Fusion Boundary

[C] Aggregation may assemble or present multiple Evidence objects while preserving each object's identity and provenance.

```text
Aggregation ≠ Evidence Fusion
```

[C] Evidence Fusion is deferred. Aggregation must not synthesize a new fused proposition, hide disagreement, or convert multiple objects into one asserted truth.

---

# 27. Preservation and Supersession

[C] Canonical Evidence must not be silently mutated when historical meaning would be lost.

[C] Supersession preserves the historical Evidence object and records that later Evidence or state has replaced it for a defined use or interpretation. Supersession does not erase provenance, Temporal Context, prior conflicts, or prior meaning.

```text
Historical age ≠ Evidential weakness
```

[N] The minimum Supersession relationship contains these semantic constituents:

```text
predecessor Evidence Identity;
successor Evidence Identity;
explicit supersession reason;
effective time or explicit EXPLICIT_UNKNOWN effective time;
scope in which the successor supersedes the predecessor;
non-destructive preservation of both Evidence objects and their provenance.
```

[N] A Supersession relationship must not make an Evidence object its own predecessor or successor and must not create a cycle. It changes applicable status or interpretation only within its declared scope; it does not erase history, provenance, conflicts, or access governance.

[N] Metadata enrichment is non-semantic only when it leaves unchanged the primary evidential unit, Evidence Type, proposition, represented value or occurrence state, Evidence Subject and scope, provenance meaning, and Temporal Context. A correction or enrichment that changes any of those constituents creates a successor with a new Evidence Identity and an explicit Supersession relationship. Labelling a change as metadata must not permit silent mutation of evidential meaning.

[N] Evidence supersession and transfer retain the exact admission-time provenance record-state references of every predecessor and successor. A successor may reference corrected or additional provenance only through new provenance record states and explicit relationships; it must not cause the predecessor's provenance to be rewritten or reattributed.

[N] `CHANGE` does not automatically supersede earlier Evidence. Supersession does not automatically resolve or close `CONFLICT`, `UNKNOWN`, or `REVIEW_REQUIRED`, and a Supersession relationship may coexist with a comparison/conflict relationship. Any relationship reclassification or later closure must be represented as a new explicit non-destructive relationship state under a separately reviewed policy. Newer Evidence is not automatically stronger, non-conflicting, or the winner.

[N] Concrete link schema, controlled reason vocabulary, retention duration, and storage behavior remain subject to Evidence Model Review.

---

# 28. Evidence Sufficiency

[C] Evidence Sufficiency concerns whether available Evidence adequately supports an Evidence-domain question or required downstream evaluation. It is distinct from whether provider inventory or search execution is sufficient.

```text
Inventory Sufficiency ≠ Evidence Sufficiency
```

[N] Every Evidence Sufficiency assessment must identify:

```text
the question or proposition being assessed;
the relevant Evidence set or explicit Evidence-set reference;
the evaluation context and applicable criteria;
the assessment outcome: SUFFICIENT, INSUFFICIENT, or UNKNOWN;
the assessor or authoritative assessment process;
the rationale and unresolved gaps.
```

[N] Sufficiency is always relative to the declared question and context. It does not assert Truth, does not authorize a recommendation, and does not automatically command PASS 3A expansion. Thresholds and automated assessment remain outside this architecture unless separately reviewed.

[N] The Evidence-set reference and rationale must explicitly declare whether superseded Evidence and Evidence participating in represented conflicts are included or excluded. When included, their superseded or conflicting status remains visible; when excluded, the rationale identifies the applicable scope or criterion. This declaration does not assign weights, resolve conflicts, select Truth, or define decision policy.

---

# 29. Evidence Expansion

[C] Evidence Expansion identifies a need for additional or different Evidence. It does not redefine PASS 3A search execution or automatically command provider expansion.

```text
Inventory Expansion ≠ Evidence Expansion
```

[N] An Evidence Expansion need is an advisory PASS 3B record containing these minimum semantic constituents:

```text
the Evidence-domain question or unresolved gap;
the supporting Evidence Sufficiency assessment reference;
desired Evidence characteristics without provider selection;
the PASS 3B recording authority;
the applicable scope and effective context;
an explicit ADVISORY_NON_COMMAND status;
the receiving PASS 3A authority or explicit unknown recipient;
the PASS 3A response reference when one exists.
```

[N] An Evidence Expansion need cannot mutate PASS 3A Registry, Planner, Execution, Search State, `inventorySufficiency`, `searchSaturation`, STOP, or EXPAND. It cannot select a provider, prescribe a query, create an execution plan, or require retrieval.

[N] PASS 3A exclusively decides whether to `ACCEPT`, `DEFER`, or `REJECT` the advisory need and owns any resulting provider selection, plan, execution, inventory decision, Search State transition, STOP, or EXPAND action. The PASS 3A response retains its PASS 3A authority, scope, effective context, and a reference to the advisory need; PASS 3B may reference but must not reinterpret that response as Evidence Truth or Evidence Sufficiency.

[N] Lack of a PASS 3A response leaves the advisory need pending or explicitly without response; it does not create an implicit acceptance or expansion. Detailed Evidence Expansion planning, transport, scheduling, retry, and PASS 3A execution remain deferred.

---

# 30. Access Governance

[C] Access Governance remains attached to Evidence where relevant.

[N] Every governed Evidence object carries an authoritative Access Governance attachment consisting architecturally of:

```text
a policy reference;
the policy version or immutable policy-state reference applicable at attachment;
the attachment authority;
an explicit state when governance is not applicable or is unknown.
```

[N] The Evidence object owns the attachment reference, not the external policy definition. Transfer and supersession must preserve the attachment and its policy-version reference. A later policy may be linked explicitly but must not silently rewrite the historical governance state attached to Evidence.

[N] Access Governance must not be treated as Evidence truth, provenance quality, confidence, or source reliability. Policy syntax, inheritance, authorization enforcement, and redaction behavior remain subject to Access Governance and Security Reviews.

---

# 31. Initial Implementation Scope

[V] The first technical implementation derived from Pass 3B should remain deliberately narrow.

[V] Recommended minimum:

```text
Provider Result
      ↓
Observation
      ↓
Evidence Subject
      ↓
Information Provenance
      +
Retrieval Provenance
      ↓
Minimum Provenance Validation
      ↓
Temporal Context
      ↓
Canonical Evidence
      ↓
Evidence Store / Transfer
```

[V] This ordering preserves the canonical Evidence admission contract:

```text
OBSERVATION
    +
EVIDENCE SUBJECT
    +
MINIMUM VALID PROVENANCE
    +
TEMPORAL CONTEXT
    ↓
CANONICAL EVIDENCE
```

[V] `Temporal Context` is therefore established **before** Canonical Evidence admission.

[V] Canonical Evidence must not be created while any mandatory admission constituent remains absent.

[V] Initial implementation does not require:

```text
full Entity Resolution
final CONFIRMED identity requirements
confidence scoring
automatic conflict resolution
Evidence Fusion
Decision Intelligence
```

[V] The first objective remains reliable Evidence preservation.

[V] No other Pass 3B architecture is modified by R2.1.

---

# 32. Canonical Serialization and Structural Schema

[B] No exact or constrained historical basis was recovered for a PASS 3B canonical serialization format or complete structural schema.

[B] This candidate therefore does not define:

```text
wire format
canonical field ordering
escaping rules
hashing rules
serialization version
complete object schema
storage encoding
transfer protocol
```

[B] Any such contract requires a separately authorized architectural decision and cannot be introduced as historical reconstruction.

---

# 33. Security, Trust, and Traceability Boundary

[C] Every canonical Evidence object requires provenance, and normalization must not collapse origin.

[C] Missing information must remain explicit. Confidence does not imply Truth. Access Governance does not imply evidential reliability. Retrieval does not establish informational origin.

[C] PASS 3B does not define source reputation, trust scoring, fraud detection, automatic truth adjudication, or automatic confidence computation.

[N] Threat model, tamper evidence, authorization enforcement, integrity protection, audit logging and security controls require a separate Security/Trust Boundary Review.

---

# 34. Architectural Invariants

[C] The controlled candidate must preserve and undergo renewed review against this recovered 18-invariant baseline:

```text
01. Observation ≠ Evidence ≠ Fact ≠ Knowledge ≠ Decision.

02. Every canonical Evidence object requires provenance.

03. Normalization may standardize representation; it must not collapse origin.

04. Information Provenance ≠ Retrieval Provenance.

05. Evidence Identity ≠ Entity Identity.

06. Evidence Count ≠ Independent Evidence Count.

07. Unknown Independence ≠ Confirmed Independence.

08. Confidence must qualify a specific proposition or process.

09. High Confidence ≠ Truth.

10. Conflict ≠ Temporal Change.

11. Aggregation ≠ Evidence Fusion.

12. Inventory Sufficiency ≠ Evidence Sufficiency.

13. Inventory Expansion ≠ Evidence Expansion.

14. Canonical Evidence must not be silently mutated when historical
    meaning would be lost.

15. Historical age ≠ Evidential weakness.

16. Missing information must remain explicit.

17. Access Governance remains attached to Evidence where relevant.

18. Canonical Evidence must not precede all mandatory admission constituents.
```

[H] The historical R2.1 Final Boundary Recheck #2 reported `18 / 18 PASS`. This candidate has not yet undergone that review and makes no equivalent claim.

---

# 35. Candidate Success Criteria and Review Gates

[H] The historical R2.1 checkpoint reported `20 / 20` sufficient success criteria, but the exact wording of all historical criteria is not recoverable.

[N] The following are newly authored candidate success criteria. They must not be represented as the lost historical 20:

```text
SC-01  Purpose and scope are explicit.
SC-02  PASS 3A ownership remains preserved.
SC-02A Provider Result handoff is traceable, replay-safe, and cannot mutate PASS 3A control state.
SC-03  PASS 2 compatibility is reviewed.
SC-04  Observation is distinct from Evidence.
SC-05  Evidence Type and one primary evidential unit are explicit.
SC-05A Evidence Subject is mandatory, semantically sufficient, and does not assert resolved identity.
SC-06  Information and Retrieval Provenance remain distinct.
SC-06A Both provenance planes have minimum semantic records, stable state references, and explicit attachment cardinality.
SC-07  Minimum Valid Provenance is explicit and uses qualified known-reference rules.
SC-08  Provenance admission and completeness validation are deterministic at the architectural level.
SC-08A CONFLICTING provenance preserves alternatives and does not perform resolution.
SC-09  Temporal Context has explicit identity, authority, value state, validity, and precedes Canonical Evidence admission.
SC-10  Canonical Evidence admission matches verbatim recovered Section 31.
SC-11  Evidence Identity remains distinct from Entity Identity.
SC-11A Observation-to-Evidence derivation and cardinality prevent implicit Fusion.
SC-12  Entity Association owns its record and local selection, not referenced Entity Identity authority or final resolution.
SC-12A CURRENT_SELECTED_ASSOCIATION cannot function as authoritative resolved identity.
SC-13  PASS 2 confidence, PASS 3B association state, and Evidence Subject state remain axis-qualified and separate.
SC-13A PASS 2-supported associations retain exact result traceability without automatic mapping or promotion.
SC-14  Independence has an explicit traceable state and is not inferred from count.
SC-15  Confidence qualifies an axis-specific proposition/process, does not imply Truth, and is not reused across PASS 2/PASS 3B semantics.
SC-16  CONFLICT, CHANGE, UNKNOWN, and REVIEW_REQUIRED are temporally constrained and non-resolving.
SC-16A Comparison/conflict relationships preserve endpoints, authority, rationale, and immutable state history.
SC-17  Preservation, enrichment, transfer, supersession, and relationship reclassification retain historical meaning and admission-time provenance.
SC-18  Aggregation remains distinct from Evidence Fusion.
SC-19  Inventory and Evidence sufficiency/expansion remain distinct, and sufficiency-set inclusion is explicit.
SC-19A Evidence Expansion is advisory; PASS 3A exclusively owns accept/defer/reject and execution consequences.
SC-20  Deferred capabilities remain deferred, PASS 3C remains not started, and future PASS 3C consumption cannot mutate PASS 3B Evidence.
SC-21  Access Governance remains attached where relevant.
SC-22  Missing information remains explicit.
SC-23  No serialization or structural schema is invented.
SC-24  Every normative statement has declared provenance class.
SC-25  F-01 through F-06 and R2-F01 are re-reviewed individually.
```

[N] Mandatory review sequence:

```text
Architecture Review
Evidence Model Review
Provenance Review
PASS 2 Compatibility Review
Cross-Pass Boundary Review
R2 Finding Remediation Review
R2.1 Admission Ordering Review
Temporal / Conflict Review
Confidence Review
Entity Association / Entity Resolution Boundary Review
Access Governance Review
Security / Trust Boundary Review
Success Criteria Review
Final Boundary Review
Final Certification — separate operation
```

Until every required review passes:

```text
Document Status:                 CONTROLLED RE-MATERIALIZATION CANDIDATE
Historical Revision Identity:    NOT CLAIMED
Final Boundary Review:           NOT PERFORMED
Final Certification:             NOT PERFORMED
PASS 3B Certified Complete:      NO
Repository Publication:          NOT AUTHORIZED
PASS 3C:                         NOT STARTED
```

---

# Appendix A — R2 Finding Traceability

| Finding | Historical defect | Candidate sections | Exact R2 patch recovered | Required review |
|---|---|---|---:|---|
| F-01 | Evidence preceded mandatory Provenance | 8, 11–18, 31 | NO | Provenance + R2 Finding Review |
| F-02 | Minimum Valid Provenance undefined | 11–16, 33 | NO | Provenance + R2 Finding Review |
| F-03 | Evidence Subject / Entity Association ownership overlap | 10, 19, 20 | NO | Evidence/Entity + R2 Finding Review |
| F-04 | PASS 2 confidence and PASS 3B association state not distinguished | 6, 20, 21, 23 | NO | PASS 2/Confidence + R2 Finding Review |
| F-05 | Temporal conflict insufficiently distinguished from Change/Unknown | 15, 24, 25 | NO | Temporal/Conflict + R2 Finding Review |
| F-06 | Confidence semantics duplicated | 21, 23, 33 | NO | Confidence + R2 Finding Review |
| R2-F01 | Section 31 admitted Canonical Evidence before Temporal Context | 16, 31 | Exact R2.1 replacement recovered | R2.1 Admission Ordering Review |

---

# Appendix B — Unresolved Architectural Decisions

The following are explicit candidate gaps, not silently reconstructed contracts:

```text
AD-01 Evidence Subject concrete field names, identifier grammar, and encoding
AD-02 Information Provenance field names, identifier grammar, encoding, and storage
AD-03 Retrieval Provenance field names, request details, encoding, and storage
AD-04 Minimum Valid Provenance terminology refinements that do not weaken the gate
AD-05 Provenance Validation physical representation and controlled reason vocabulary
AD-06 Temporal Context field names, encodings, parsing, precision scales, uncertainty calculations, and calendar conversion
AD-07 Evidence Identity generation, uniqueness mechanism, and serialization
AD-08 Entity Association concrete representation; final CONFIRMED boundary remains deferred
AD-09 CONFIRMED-state requirements — remains deferred unless separately authorized
AD-10 Independence assessment algorithms, clustering, and thresholds
AD-11 Confidence value representation
AD-12 Comparison/conflict physical representation, detection algorithms, thresholds, resolution and closure policy
AD-13 Supersession physical schema and controlled reason vocabulary
AD-14 Evidence Sufficiency domain criteria, weighting, and any automation boundary
AD-15 Access Governance policy syntax, inheritance, and enforcement
AD-16 Security, integrity and audit boundary
AD-17 Serialization and complete structural schema — BLOCKED / separate decision
```

No unresolved decision is resolved merely by the existence of this candidate.

---

# Appendix C — Authoring Result

```text
Candidate created:                     YES — v0.1 / Authoring R1 + Architecture R1 + Evidence Model R1 + Provenance R2 + PASS 2 Compatibility R1 + Cross-Pass R1 + Temporal/Conflict R1
Candidate identity:                    NEW CONTROLLED RE-MATERIALIZATION
Historical Original Draft claimed:     NO
Historical Revision 1 claimed:         NO
Historical Revision 2 claimed:         NO
Historical complete R2.1 claimed:      NO
Exact R2.1 Section 31 preserved:        YES
Missing R2 patch prose invented:        NO
Serialization contract invented:       NO
Final Certification inferred:          NO
PASS 3B state changed:                  NO
PASS 3C started:                        NO
Repository modified:                    NO
Master Record modified:                 NO

NEXT GATE:
CONTROLLED RE-MATERIALIZATION TEMPORAL / CONFLICT REVIEW — R1 RECHECK
```
