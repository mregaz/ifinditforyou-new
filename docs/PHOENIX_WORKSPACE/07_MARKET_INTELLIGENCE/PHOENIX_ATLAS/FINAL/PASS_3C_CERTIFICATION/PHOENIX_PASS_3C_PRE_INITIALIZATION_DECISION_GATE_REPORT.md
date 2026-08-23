# PHOENIX ATLAS — PASS 3C
## PRE-INITIALIZATION DECISION GATE REPORT

**Mode:** DEEP ARCHITECTURAL DECISION ANALYSIS / READ-ONLY  
**Date:** 2026-08-22  
**Gate status:** COMPLETE — PROPOSAL ONLY  
**PASS 3C:** NOT STARTED  
**Authorization effect:** NONE

> **PROPOSED — NOT YET AUTHORIZED**  
> **PASS 3C NOT STARTED**

---

# 1. Executive Decision

The narrowest coherent mission that uses the certified predecessor architecture without manufacturing a new product mandate is:

> **Define final Entity Resolution and provenance-preserving Evidence Fusion contracts that convert explicit PASS 3B Evidence associations into separately identified, auditable downstream resolution and fusion products, while preserving all constituent Evidence, provenance, temporal context, independence state, conflicts, supersession history, and governance.**

Recommended canonical title:

> **PHOENIX ENTITY RESOLUTION AND EVIDENCE FUSION SPECIFICATION v1.0**

This is a recommendation for user charter approval, not an approved charter. It does not initialize PASS 3C.

The recommended mission includes final Entity Resolution contract semantics, final `CONFIRMED` admission requirements, Evidence Fusion, independence-aware composition, temporal/conflict interpretation necessary to preserve fused products, and an advisory Evidence Expansion interface. It excludes Truth adjudication, Knowledge Architecture, Decision Intelligence, recommendation generation, automatic winner selection, provider execution, Search State control, universal confidence scoring, storage, security implementation, and canonical serialization.

**Decision-gate verdict: READY FOR USER CHARTER APPROVAL.**

---

# 2. Decision Basis and Forensic Controls

## 2.1 Immediate input

The completed `PHOENIX_PASS_3C_PRE_INITIALIZATION_DEEP_READINESS_STUDY.md` is the immediate analysis input. Its verdict was:

> READY WITH EXPLICIT PRE-INITIALIZATION DECISIONS

The study identified 19 deferred-capability register entries, 12 downstream decisions, three potential ownership collisions, no present architectural conflict, and no blocking forensic evidence gap.

## 2.2 Repository verification basis

Every proposal in this report was checked against:

- `docs/00_MASTER_RECORD.md`;
- `PHOENIX_ADAPTIVE_SEARCH_AND_EVIDENCE_ARCHITECTURE_v1.0.md`;
- `PHOENIX_PROVIDER_PLANNER_AND_SEARCH_STATE_SPECIFICATION_v1.0.md`;
- `PHOENIX_EVIDENCE_MODEL_AND_PROVENANCE_SPECIFICATION_v1.0.md`;
- the complete 16-report PASS 3B certification chain;
- the certified PASS 3B digests and cross-pass conclusions;
- materially relevant Atlas reconciliation, discovery, and tracker evidence.

The certified repository says PASS 3C is not started. PASS 3B §7 names final Entity Resolution, Evidence Fusion, conflict resolution, Knowledge construction, Decision Intelligence, and recommendations as outside PASS 3B. It also requires future PASS 3C artifacts to use PASS 3C-owned identities and authorities and prohibits write-back into PASS 3B Evidence semantics. PASS 3A owns Search State, STOP/EXPAND, provider planning, and execution. PASS 2’s Entity Resolution confidence authority is preserved by PASS 3B certification.

No unavailable historical wording was reconstructed. No roadmap phase was treated as an already-authorized PASS 3C contract.

---

# 3. D1 — PASS 3C Mission Options

## Option A — Evidence Fusion Contract Only

**Architectural purpose:** define a provenance-preserving derived product from multiple Canonical Evidence objects.

**Included:** fused-product identity, constituent lineage, conflict/temporal preservation, independence handling, governance propagation, auditability.

**Excluded:** final Entity Resolution, Knowledge, Decision Intelligence, Truth adjudication, recommendations, search control.

**Predecessor dependencies:** PASS 3B Evidence/provenance/lifecycle; PASS 2 “Fuse, Never Flatten.”

**Downstream dependencies:** relies on an external reliable entity-correspondence decision before evidence can safely be fused.

**Ownership risk:** low cross-pass risk, but the input entity-match authority remains unresolved. Fusion cannot safely determine that multiple Evidence objects concern the same entity merely by consuming PASS 3B candidate associations.

**Complexity:** medium.

**Certification burden:** Architecture, Fusion, Provenance, Temporal/Conflict, Confidence/Independence boundary, Cross-Pass, Access, Success, Final Boundary, Certification.

**Assessment:** viable but incomplete. It pushes the most important Fusion precondition into an undefined external contract.

## Option B — Entity Resolution and Evidence Fusion

**Architectural purpose:** define an explicit final Entity Resolution product and use only sufficiently authorized resolution results to support provenance-preserving Evidence Fusion.

**Included:** final resolution-result semantics; `CONFIRMED` requirements; resolution confidence consumption; fused-product identity; lineage; independence; temporal/conflict preservation and interpretation; supersession behavior; governance propagation; advisory expansion need.

**Excluded:** PASS 2 confidence redefinition; mutation of PASS 3B associations; conflict winner selection; Truth/Knowledge/Decision; recommendations; search execution; implementation/schema/security.

**Predecessor dependencies:** PASS 2 Entity Resolution doctrine and confidence axis; PASS 3A search authority; PASS 3B Evidence, association history, provenance, temporal, conflict, independence, supersession, sufficiency, expansion, and governance contracts.

**Downstream dependencies:** future Knowledge and Decision architectures may consume resolution/fusion products but remain separate.

**Ownership risk:** medium but containable through a strict boundary: PASS 2 retains confidence-axis meaning; PASS 3B retains association history; PASS 3C owns only its resolution decision record and fused product.

**Complexity:** medium-high.

**Certification burden:** all scope-specific reviews proposed in §16.

**Assessment:** **RECOMMENDED.** It is the narrowest complete architecture in which Fusion has an explicit entity-correspondence authority.

## Option C — Entity Resolution, Fusion, Knowledge and Decision Intelligence

**Architectural purpose:** complete the strategic pipeline from Evidence to recommendations.

**Included:** Option B plus Truth/Fact/Knowledge admission, ranking, decisions, explanations, and recommendations.

**Excluded:** potentially only implementation.

**Predecessor dependencies:** all predecessors plus product policy, user objectives, ranking, knowledge ontology, Truth authority, and explanation contracts that do not presently exist.

**Downstream dependencies:** operational/product implementation.

**Ownership risk:** very high; Evidence Sufficiency could become Decision Intelligence, confidence could become Truth, and PASS 3C could absorb future passes without repository authority.

**Complexity:** extreme.

**Certification burden:** substantially larger than the available evidence supports.

**Assessment:** viable only as a new product/architecture policy decision. It is not supported as the default PASS 3C charter and is not recommended.

## D1 recommendation

Recommend **Option B**, subject to explicit user approval. No option is silently approved.

---

# 4. D2 — Proposed Canonical Title

**Recommended title:**

> PHOENIX ENTITY RESOLUTION AND EVIDENCE FUSION SPECIFICATION v1.0

**Proposed canonical filename:**

`PHOENIX_ENTITY_RESOLUTION_AND_EVIDENCE_FUSION_SPECIFICATION_v1.0.md`

The title names exactly the two owned architectural products. It does not claim Knowledge, Truth, Decision Intelligence, recommendations, implementation, storage, or security.

---

# 5. D3 — Capability Allocation

The readiness study’s register is normalized here to the requested 19 decision entries. Conflict-resolution policy and conflict detection/closure are evaluated together as one conflict-capability family so that the substantive register remains complete without double-counting.

| # | Deferred capability | Allocation | Repository evidence | Rationale |
|---:|---|---|---|---|
| 1 | Final Entity Resolution algorithms/contracts | **IN PASS 3C** | PASS 2 §§9/37; PASS 3A §27; PASS 3B §§4/7/14/33 | Required to supply a final entity-correspondence authority for Fusion; algorithm implementation remains out. |
| 2 | Final `CONFIRMED` requirements | **IN PASS 3C** | PASS 3B §20/AD-09 | PASS 3B explicitly defers final confirmation; PASS 3C must distinguish confirmed resolution from candidate association. |
| 3 | PASS 2 confidence ↔ PASS 3B state mapping | **EXPLICITLY OUT OF PASS 3C** | PASS 3B §§6/23; Confidence and Entity Boundary Reviews | Automatic mapping is prohibited. PASS 3C may reference both qualified axes but cannot merge them. |
| 4 | Evidence Fusion | **IN PASS 3C** | PASS 2 §§10/34/37; PASS 3A §27; PASS 3B §§4/7/24/33 | Core recommended responsibility; requires its own product identity and non-flattening lineage. |
| 5 | Conflict detection, interpretation, resolution policy, thresholds, closure | **PARTLY IN PASS 3C; ADJUDICATION DEFERRED TO LATER PASS** | PASS 2 §11; PASS 3B §§22/33/AD-12 | Detection and interpretation needed to preserve Fusion; winner selection, Truth adjudication, and destructive closure remain out. |
| 6 | Automatic confidence computation | **REQUIRES SEPARATE ARCHITECTURAL DECISION** | PASS 3B §§23/33/AD-11 | PASS 3C must define confidence ownership/boundaries, but a scoring algorithm is not required for the core semantic contract. |
| 7 | Source reliability / reputation | **DEFERRED TO LATER PASS** | PASS 3B §§4/23/30 | Trust/reliability is contextual Evidence and needs a dedicated trust architecture. |
| 8 | Fraud detection | **DEFERRED TO LATER PASS** | PASS 3B §4 | Specialized risk capability, unnecessary for core resolution/fusion. |
| 9 | Valuation inference | **DEFERRED TO LATER PASS** | PASS 2 temporal/decision roadmap; PASS 3B §4 | Decision/market reasoning, not evidence composition. |
| 10 | Knowledge construction | **DEFERRED TO LATER PASS** | PASS 2 §§33–37; PASS 3B §§4/7 | Strategic downstream destination; no admission ontology exists. |
| 11 | Decision Intelligence | **DEFERRED TO LATER PASS** | PASS 2 §§33–37; PASS 3A §27; PASS 3B §§4/7 | Explicitly downstream but not assigned to PASS 3C. |
| 12 | Recommendation generation | **DEFERRED TO LATER PASS** | PASS 3B §§4/7 | Requires Knowledge, user policy, ranking, and decision authority. |
| 13 | Detailed Evidence Expansion planning/transport/scheduling | **EXPLICITLY OUT OF PASS 3C** | PASS 3B §29; PASS 3A §§15–18 | PASS 3C may emit an advisory need; PASS 3A alone owns accept/defer/reject and execution. |
| 14 | Evidence Sufficiency criteria, weighting, thresholds, automation | **REQUIRES SEPARATE ARCHITECTURAL DECISION** | PASS 3B §§25/33/AD-14 | PASS 3C may consume question-relative sufficiency; automation is not necessary to define resolution/fusion. |
| 15 | Independence algorithms, clustering, thresholds | **IN PASS 3C AT CONTRACT LEVEL** | PASS 2 §12; PASS 3B §§21/33/AD-10 | Fusion must avoid false independent confirmation; implementation and production thresholds remain separate. |
| 16 | Temporal schema detail, precision, uncertainty, calendars | **IN PASS 3C ONLY AS REQUIRED SEMANTICS; PHYSICAL SCHEMA DEFERRED** | PASS 3B §§19–22/AD-06 | Fusion comparison needs temporal semantics; serialization/parsing/storage stay out. |
| 17 | Access-governance syntax, inheritance, enforcement | **DEFERRED TO LATER PASS** | PASS 3B §29/AD-15; Access Review | PASS 3C must propagate attachments but does not design enforcement. |
| 18 | Security threat model, audit controls, cryptographic integrity | **DEFERRED TO LATER PASS** | PASS 3B §30/AD-16; Security/Trust Review | Certified boundary expressly makes no security guarantee. |
| 19 | Canonical serialization and physical schema | **REQUIRES SEPARATE ARCHITECTURAL DECISION** | PASS 3B AD-17 | Semantic architecture must not silently freeze physical representation. |

## Allocation totals

- **Allocated to PASS 3C:** 6 entries wholly or at bounded contract level: 1, 2, 4, 5 (partial), 15, 16.
- **Explicitly out of PASS 3C:** 2 entries: 3, 13.
- **Deferred to later pass:** 8 entries: 5 (adjudicative portion), 7–12, 17–18.
- **Separate architectural decision:** 3 entries: 6, 14, 19.
- **Insufficient evidence to assign:** 0.

Partial allocations do not authorize the deferred portion.

---

# 6. D4 — Entity Resolution Boundary

## Proposed ownership model

| Layer | Owner | May do | Must not do |
|---|---|---|---|
| Entity Resolution confidence axis | PASS 2 | Define the meaning and qualification of PASS 2 Entity Resolution confidence | Become generic Evidence confidence, Truth, provenance quality, or PASS 3B association state |
| Evidence ↔ candidate Entity Association | PASS 3B | Preserve zero/multiple candidates, states, selection designation, references, and complete history | Implicitly declare final identity; overwrite competing candidates; automatically promote high probability to `CONFIRMED` |
| Final Entity Resolution result | Proposed PASS 3C | Produce a separately identified resolution decision referencing input associations, Evidence, qualified PASS 2 confidence, authority, method/policy version, time, alternatives, unknowns, and rationale | Redefine PASS 2 confidence; mutate PASS 3B associations; use Evidence Identity as Entity Identity; claim Truth; erase alternatives |

## Decision

Final Entity Resolution **belongs in the recommended PASS 3C mission** because Evidence Fusion must have a deterministic and auditable authority for deciding whether Evidence objects may be composed as referring to the same real-world entity.

PASS 3C may:

- define a PASS 3C-owned Resolution Result identity and lifecycle;
- define admissible resolution states, including unresolved and competing outcomes;
- define the evidence and qualified PASS 2 confidence references required for a final decision;
- define final `CONFIRMED` requirements without reinterpreting PASS 3B association state;
- define when Fusion must be prohibited because correspondence is insufficient;
- issue a new resolution result when inputs or policy change, preserving prior results.

PASS 3C must not:

- alter the semantics or values of the PASS 2 confidence axis;
- turn a PASS 3B current selection into final resolution automatically;
- rewrite or delete PASS 3B association records;
- equate Evidence Identity and Entity Identity;
- equate high confidence or `CONFIRMED` with Truth about every evidential proposition.

---

# 7. D5 — Evidence Fusion Decision

Evidence Fusion **belongs in the recommended PASS 3C mission**. PASS 2 explicitly commits to “Fuse, Never Flatten”; PASS 3A and PASS 3B defer Fusion; PASS 3B supplies the stable inputs and immutable boundaries a Fusion contract requires.

PASS 3C must answer, at minimum, the following architectural questions without implementing them in this gate:

1. **Fused-product identity:** a Fusion Product has a PASS 3C-owned identity distinct from every Evidence Identity and Entity Identity.
2. **Provenance preservation:** both informational and retrieval provenance remain traceable per constituent; normalized output cannot reattribute origin.
3. **Source-Evidence lineage:** every derived assertion references its contributing Evidence identities and transformation/interpretation authority.
4. **Independence preservation:** constituent independence state, basis, unknowns, and clusters survive; source count never substitutes for independence.
5. **Conflict preservation:** conflicts remain explicit relationships or states; Fusion cannot manufacture consensus.
6. **Temporal semantics:** comparison uses scoped temporal context, precision, uncertainty, and Change/Conflict/Unknown distinctions.
7. **Supersession behavior:** new Fusion results supersede or relate to old results without mutating Evidence or prior products.
8. **Access Governance:** every constituent restriction is preserved or conservatively composed; strategic value never grants access.
9. **Confidence ownership:** any Fusion confidence is a PASS 3C-qualified proposition/process axis and cannot reuse PASS 2 confidence or imply Truth.
10. **Reversibility/auditability:** an auditor can reconstruct which immutable Evidence and policies produced the result and can inspect preserved disagreements.

This gate does not design field names, algorithms, storage, schemas, thresholds, or scoring.

---

# 8. D6 — Conflict Resolution Boundary

| Function | PASS 3C allocation | Boundary |
|---|---|---|
| Conflict detection | IN, if required by Fusion | Detect candidate incompatibility using explicit comparison scope and temporal context. |
| Conflict representation | CONSUME from PASS 3B; MAY PRODUCE derived relationships | Never rewrite constituent conflict state. |
| Conflict preservation | MANDATORY IN | All credible disagreement remains inspectable. |
| Conflict interpretation | IN | May classify simultaneous contradiction, temporal Change, Unknown, or non-comparable scope. |
| Conflict resolution | LIMITED IN | May record a policy-qualified operational disposition while retaining all conflicting Evidence. |
| Winner selection | OUT | Requires a separate authority and must never be implicit in Fusion. |
| Truth adjudication | OUT | No certified Truth admission contract exists. |

“Resolution” in PASS 3C, if the term is retained, means an explicit derived disposition for a declared question and policy context. It does **not** mean that losing Evidence is false, deleted, overwritten, or removed from the Fusion lineage. Automatic winner selection is forbidden.

---

# 9. D7 — Knowledge / Decision Boundary

The following remain **outside PASS 3C** under the recommended charter:

- Knowledge Architecture;
- Fact or Truth admission/adjudication;
- Decision Intelligence;
- ranking policy;
- recommendation generation;
- valuation inference;
- fraud determination.

Repository evidence establishes these as downstream strategic destinations, not as default PASS 3C responsibilities. A later pass may consume PASS 3C Resolution Results and Fusion Products through separate identities and authorities.

---

# 10. D8 — Evidence Expansion Boundary

PASS 3C may produce an **Evidence Expansion Need** or a reference-compatible specialization of the PASS 3B advisory need when resolution or Fusion remains underdetermined.

## Proposed feedback contract

```text
PASS 3C Resolution/Fusion analysis
        ↓
Advisory Evidence Expansion Need
  - need identity
  - originating question/resolution/fusion context
  - missing evidence class or independence/temporal deficit
  - supporting Evidence references
  - urgency/priority as advice, not command
        ↓
PASS 3A ACCEPT / DEFER / REJECT
        ↓
If accepted: PASS 3A planning, provider selection, execution,
Inventory Sufficiency, Search State, STOP / EXPAND
        ↓
New Provider Results → PASS 3B admission path → new Evidence
        ↓
Optional new PASS 3C analysis; no mutation of prior results
```

The contract is feedback, but authority remains one-way at each edge:

- PASS 3C describes an evidential deficit; it cannot select providers, prescribe queries, create execution plans, or command retrieval.
- PASS 3A alone accepts, defers, or rejects and owns all operational consequences.
- PASS 3C may reference the response but cannot reinterpret it as Truth, Evidence Sufficiency, or Fusion success.
- New information returns only through the PASS 3B Observation/Evidence admission path.

---

# 11. D9 — Predecessor Contract Freeze

## 11.1 Classification rules

- **IMMUTABLE PREDECESSOR CONTRACT:** PASS 3C cannot change semantics, ownership, lifecycle, or authority.
- **CONSUMABLE CONTRACT:** PASS 3C may use the output under its certified meaning.
- **REFERENCE-ONLY CONTRACT:** context or strategic direction, not an executable input.
- **OUTSIDE PASS 3C AUTHORITY:** operational or policy domain PASS 3C cannot control.

## 11.2 PASS 2 freeze

| Contract | Classification |
|---|---|
| Preserve Duplicate Evidence | IMMUTABLE PREDECESSOR CONTRACT |
| Fuse, Never Flatten | IMMUTABLE PREDECESSOR CONTRACT |
| Preserve Historical Intelligence | IMMUTABLE PREDECESSOR CONTRACT |
| Trust Is Contextual Evidence | IMMUTABLE PREDECESSOR CONTRACT |
| Source Count ≠ Independent Evidence Count | IMMUTABLE PREDECESSOR CONTRACT |
| Entity Resolution confidence meaning/axis | IMMUTABLE PREDECESSOR CONTRACT; CONSUMABLE |
| Strategic pipeline and implementation progression | REFERENCE-ONLY CONTRACT |
| Decision Intelligence destination | REFERENCE-ONLY; OUTSIDE recommended PASS 3C AUTHORITY |

## 11.3 PASS 3A freeze

| Contract | Classification |
|---|---|
| Registry, Provider Family, Marketplace Surface | CONSUMABLE / OUTSIDE PASS 3C AUTHORITY |
| Provider Planner, waves, execution | OUTSIDE PASS 3C AUTHORITY |
| Inventory Sufficiency and Search Saturation | IMMUTABLE; OUTSIDE PASS 3C AUTHORITY |
| Search State, STOP, EXPAND | IMMUTABLE; OUTSIDE PASS 3C AUTHORITY |
| Access/availability gate | IMMUTABLE; CONSUMABLE constraint |
| Accept/defer/reject Evidence Expansion advice | OUTSIDE PASS 3C AUTHORITY |
| Deterministic planning and failure isolation | REFERENCE-ONLY for PASS 3C design quality |

## 11.4 PASS 3B freeze — 18 inherited invariants

| # | Invariant | Classification |
|---:|---|---|
| 1 | Observation ≠ Evidence ≠ Fact ≠ Knowledge ≠ Decision | IMMUTABLE |
| 2 | Provenance is mandatory for Canonical Evidence | IMMUTABLE; CONSUMABLE |
| 3 | Normalization must not collapse informational origin | IMMUTABLE |
| 4 | Informational Provenance ≠ Retrieval Provenance | IMMUTABLE; CONSUMABLE |
| 5 | Evidence Identity ≠ Entity Identity | IMMUTABLE |
| 6 | Evidence Count ≠ Independent Evidence Count | IMMUTABLE |
| 7 | Unknown Independence ≠ Confirmed Independence | IMMUTABLE |
| 8 | Confidence is proposition- and process-specific | IMMUTABLE |
| 9 | High Confidence ≠ Truth | IMMUTABLE |
| 10 | Conflict ≠ Temporal Change | IMMUTABLE |
| 11 | Aggregation ≠ Evidence Fusion | IMMUTABLE |
| 12 | Inventory Sufficiency ≠ Evidence Sufficiency | IMMUTABLE |
| 13 | Inventory Expansion ≠ Evidence Expansion | IMMUTABLE |
| 14 | Canonical Evidence must not be silently mutated | IMMUTABLE |
| 15 | Age ≠ weakness | IMMUTABLE |
| 16 | Missing/unknown values remain explicit | IMMUTABLE |
| 17 | Access Governance remains attached where applicable | IMMUTABLE; CONSUMABLE |
| 18 | Canonical Evidence must not precede mandatory admission constituents | IMMUTABLE; CONSUMABLE |

## 11.5 Additional PASS 3B contracts

- Exact R2.1 admission ordering: **IMMUTABLE**.
- Evidence Subject and one-Evidence-to-one-candidate Entity Association records: **CONSUMABLE; MUST NOT REDEFINE**.
- Complete association and current-selection history: **CONSUMABLE; IMMUTABLE history**.
- Evidence lifecycle, identity, preservation, transfer, and supersession: **IMMUTABLE**.
- Temporal Context and Change/Conflict/Unknown semantics: **CONSUMABLE; MUST NOT REDEFINE**.
- Evidence Sufficiency semantics: **CONSUMABLE; MUST NOT REDEFINE**.
- Advisory Evidence Expansion need: **CONSUMABLE; operational effects OUTSIDE PASS 3C AUTHORITY**.
- Governance attachments: **CONSUMABLE; enforcement OUTSIDE PASS 3C AUTHORITY**.
- PASS 3C no-write-back rule and PASS 3C-owned identities: **IMMUTABLE**.

---

# 12. D10 — Forbidden-Scope Register

| Forbidden scope | Status | Reason |
|---|---|---|
| Truth adjudication | FORBIDDEN | No Truth admission authority; High Confidence ≠ Truth. |
| Knowledge Architecture | OUT OF SCOPE | Downstream, not assigned to PASS 3C. |
| Decision Intelligence | OUT OF SCOPE | Strategic destination only. |
| Recommendation generation | FORBIDDEN | Requires decision/user-policy authority. |
| Provider execution | FORBIDDEN | PASS 3A-owned. |
| Search State control, STOP, EXPAND | FORBIDDEN | PASS 3A-owned. |
| Provider selection/planning | FORBIDDEN | PASS 3A-owned. |
| PASS 2 confidence redefinition or automatic mapping | FORBIDDEN | Certified cross-pass boundary. |
| PASS 3B Evidence/provenance redefinition | FORBIDDEN | Certified predecessor contract. |
| Silent Evidence or association mutation | FORBIDDEN | Violates identity/lifecycle/history. |
| Destructive/flattening Fusion | FORBIDDEN | Violates provenance and conflict preservation. |
| Automatic winner selection | FORBIDDEN | Would become hidden adjudication. |
| Universal confidence/trust/reliability score | FORBIDDEN | Confidence is scoped; trust is contextual Evidence. |
| Serialization/physical schema | OUT unless separately authorized | AD-17 separate/blocked domain. |
| Security implementation or guarantees | OUT OF SCOPE | Boundary only; no threat model/control certification. |
| Storage implementation | OUT OF SCOPE | Architecture is semantic, not implementation. |
| Historical R2/R2.1 reconstruction | FORBIDDEN | Unavailable history cannot be inferred. |
| Direct creation of PASS 3B Evidence by Fusion | FORBIDDEN | Any new Evidence uses the PASS 3B admission path. |

---

# 13. Collision Analysis

| Collision | Owner A | Owner B | Colliding responsibility | Proposed boundary | Residual risk | Decision status |
|---|---|---|---|---|---|---|
| C-01 | PASS 2 | PASS 3C | Entity Resolution confidence vs final resolution result | PASS 2 owns confidence semantics; PASS 3C consumes qualified values and owns a separate Resolution Result identity/authority | Medium: poorly named fields could imply remapping | **CONTAINED — USER CHARTER APPROVAL REQUIRED** |
| C-02 | PASS 3A | PASS 3C | STOP/EXPAND and provider execution vs evidence-driven need | PASS 3C emits advisory deficit only; PASS 3A accepts/defers/rejects and alone plans/executes | Low: interface could accidentally carry commands | **CONTAINED — USER CHARTER APPROVAL REQUIRED** |
| C-03 | PASS 3B | PASS 3C | Immutable Evidence semantics vs derived resolution/fusion/knowledge state | PASS 3C products have distinct identities and never write back; corrections create new Evidence through PASS 3B | Medium: denormalized views could obscure authority | **CONTAINED — USER CHARTER APPROVAL REQUIRED** |

All three collisions are contained by the proposed charter. None remains an architectural conflict in the predecessor baseline.

---

# 14. Risk Disposition

The readiness study’s two provenance-loss blocker formulations are treated as one substantive risk family here, preserving the requested baseline of nine prospective BLOCKER risks.

## 14.1 Prospective BLOCKER risks

| # | Risk | Proposed charter treatment | Disposition |
|---:|---|---|---|
| B-01 | Evidence becomes Truth | Truth/Knowledge explicitly excluded; separate identity types mandatory | PREVENTED BY SCOPE |
| B-02 | Confidence becomes Truth | Qualified axes only; High Confidence ≠ Truth inherited | CONTROLLED BY BOUNDARY |
| B-03 | PASS 3C rewrites PASS 2 authority | PASS 2 confidence frozen; separate Resolution Result | CONTROLLED BY BOUNDARY |
| B-04 | Fusion/provenance lineage is destroyed | Constituent-retaining product and audit lineage are mandatory | REQUIRES PASS 3C ARCHITECTURE |
| B-05 | Conflict resolution destroys disagreement | Winner selection/Truth adjudication excluded; conflicts immutable | CONTROLLED BY BOUNDARY |
| B-06 | Supersession becomes mutation | Append-only new resolution/fusion products; PASS 3B Evidence immutable | CONTROLLED BY BOUNDARY |
| B-07 | PASS 3C controls PASS 3A expansion | Advisory-only feedback contract | CONTROLLED BY BOUNDARY |
| B-08 | Access/security governance is bypassed | Governance propagation mandatory; enforcement not claimed | REQUIRES PASS 3C ARCHITECTURE |
| B-09 | Unknown values become invented certainty | Explicit unknown and unresolved outputs mandatory | CONTROLLED BY BOUNDARY |

**Prevented/controlled by charter:** 7.  
**Requires PASS 3C architecture:** 2.  
**Remaining unresolved:** 0.

## 14.2 Prospective MAJOR risks

| # | Risk | Proposed charter treatment | Disposition |
|---:|---|---|---|
| M-01 | Entity Association becomes final resolution | Separate PASS 3C Resolution Result and admission requirements | REQUIRES PASS 3C ARCHITECTURE |
| M-02 | Temporal Change becomes Conflict | Inherited semantic distinction and temporal specialist review | REQUIRES PASS 3C ARCHITECTURE |
| M-03 | Independence is assumed implicitly | Unknown-by-default; clustering basis required | REQUIRES PASS 3C ARCHITECTURE |
| M-04 | Evidence Sufficiency becomes Decision Intelligence | Decision Intelligence excluded; typed states separate | PREVENTED BY SCOPE |
| M-05 | Historical Evidence is rewritten/aged into weakness | Evidence immutable; age and relevance remain separate | CONTROLLED BY BOUNDARY |
| M-06 | Decision Intelligence enters without Knowledge contracts | Knowledge/Decision excluded | PREVENTED BY SCOPE |
| M-07 | Trust/reliability becomes universal source score | Source reliability deferred; governance/confidence distinct | PREVENTED BY SCOPE |

**Prevented/controlled by charter:** 4.  
**Requires PASS 3C architecture:** 3.  
**Remaining unresolved:** 0.

---

# 15. D11 — Proposed Success Conditions

These are new proposed PASS 3C conditions, not reused PASS 3B certification criteria.

## 15.1 MANDATORY

1. A stable PASS 3C Resolution Result contract exists with its own identity, authority, time, policy/method reference, input associations/Evidence, alternatives, unknowns, and lifecycle.
2. Final `CONFIRMED` requirements are explicit and cannot be satisfied by PASS 3B current selection or high confidence alone.
3. PASS 2 confidence semantics remain unchanged and axis-qualified.
4. PASS 3B Entity Association records and history remain immutable and inspectable.
5. A stable Fusion Product contract exists with its own identity and complete constituent lineage.
6. Fusion preserves informational and retrieval provenance, temporal context, independence state/basis, conflicts, supersession, and Access Governance.
7. Fusion cannot proceed when entity correspondence is below the authorized resolution state.
8. Conflict, Change, Unknown, non-comparability, interpretation, and limited disposition remain distinct.
9. No winner selection, Truth adjudication, Knowledge, Decision, ranking, or recommendation state is produced.
10. Resolution and Fusion never mutate or overwrite Canonical Evidence or PASS 3B association history.
11. Corrections create new PASS 3C products; Evidence corrections use new PASS 3B Evidence and explicit supersession.
12. Advisory Evidence Expansion cannot select providers or control Search State; PASS 3A accept/defer/reject is authoritative.
13. All 18 PASS 3B invariants pass unchanged.
14. Every included capability has deterministic semantic inputs, outputs, authority, failure/unknown states, and audit requirements.
15. Every excluded/deferred capability remains explicitly absent.

## 15.2 SPECIALIST-REVIEW DEPENDENT

1. Entity Resolution Boundary invariants pass.
2. Fusion and Provenance Preservation invariants pass.
3. Temporal/Conflict/Independence scenarios pass.
4. Confidence axes remain separated and Truth-neutral.
5. Governance propagation and security/trust boundary checks pass.
6. Cross-pass ownership tests pass with no regression.
7. All findings are closed through separate remediation/recheck operations.
8. Final Boundary Review and separate Final Certification pass.

## 15.3 DEFERRED

- Confidence scoring algorithms and calibration.
- Evidence Sufficiency automation.
- Production independence thresholds/clustering implementation.
- Conflict Truth adjudication and winner policy.
- Knowledge/Decision/recommendation success criteria.
- Security enforcement, threat model, cryptographic integrity, storage, serialization, and implementation tests.

## 15.4 NOT APPLICABLE

- Provider coverage, wave planning, Search State, STOP/EXPAND, Inventory Sufficiency, provider availability, and execution success.
- Truth accuracy, recommendation quality, ranking quality, valuation accuracy, or fraud detection.

---

# 16. D12 — Minimum Sufficient Review Architecture

| Order | Gate | Required? | Justification |
|---:|---|---|---|
| 1 | Initialization/Authoring Audit | YES | Confirms approved charter, predecessor digests, scope markers, and no implementation leakage. |
| 2 | Architecture Review | YES | Establishes coherence of resolution/fusion identities, lifecycles, authorities, and unknown states. |
| 3 | Entity Resolution Boundary Review | YES | Final resolution is in recommended scope and collides potentially with PASS 2/PASS 3B. |
| 4 | Evidence Fusion Review | YES | Fusion is a core deliverable. |
| 5 | Provenance Preservation Review | YES | Fusion creates the highest lineage-loss risk; this warrants a distinct specialist gate. |
| 6 | Temporal / Conflict / Independence Review | YES, combined | The three concerns interact within Fusion and can be reviewed coherently as one specialist gate. |
| 7 | Confidence Review | YES, boundary-focused | Confirms PASS 2 axis preservation and any PASS 3C-qualified confidence semantics. |
| 8 | Search Interaction / PASS 3A Compatibility Review | YES | Advisory Evidence Expansion creates a cross-pass feedback edge. |
| 9 | Access Governance / Security-Trust Boundary Review | YES, combined boundary gate | Governance propagation is in scope; enforcement/security implementation are excluded. |
| 10 | Cross-Pass Boundary Review | YES | Rechecks all three certified predecessors and excluded future domains. |
| 11 | Success Criteria Review | YES | Evaluates only the newly approved PASS 3C criteria. |
| 12 | Final Boundary Review | YES | Confirms findings, exclusions, digests, invariants, and no scope leakage. |
| 13 | Final Certification | YES, separate | Certification must never be inferred from readiness. |

Remediation and recheck are not standing review gates. They occur only when an authorized review produces findings. Any BLOCKER, MAJOR, or MINOR finding stops progression; remediation requires separate authorization and is followed by an affected-gate recheck against a new candidate digest.

No Knowledge, Decision Intelligence, recommendation, ranking, implementation, storage, or serialization specialist review is justified under the recommended scope.

---

# 17. Proposed PASS 3C Initialization Brief

> **PROPOSED — NOT YET AUTHORIZED**  
> **PASS 3C NOT STARTED**

## Canonical title

**PHOENIX ENTITY RESOLUTION AND EVIDENCE FUSION SPECIFICATION v1.0**

## Mission

Define final Entity Resolution and provenance-preserving Evidence Fusion contracts that consume certified PASS 3B Evidence and association histories, preserve PASS 2 confidence authority and PASS 3A search authority, and produce separately identified, reversible, auditable downstream products without adjudicating Truth or creating Knowledge, Decisions, or recommendations.

## Architectural objective

Establish the smallest complete bridge from immutable Evidence and candidate Entity Associations to an explicit Resolution Result and a non-destructive Fusion Product suitable for later Knowledge/Decision architectures.

## In scope

- PASS 3C Resolution Result identity, authority, states, lifecycle, and final `CONFIRMED` requirements.
- Qualified consumption of PASS 2 Entity Resolution confidence.
- Consumption and preservation of PASS 3B association history.
- Fusion Product identity, constituent lineage, provenance, independence, temporal, conflict, supersession, governance, and audit semantics.
- Conflict detection/interpretation and non-destructive, policy-qualified disposition necessary for Fusion.
- Contract-level independence treatment.
- PASS 3C-specific confidence boundaries; automatic scoring only if separately decided during architecture.
- Advisory Evidence Expansion feedback compatible with PASS 3A.

## Out of scope

- Truth/Fact/Knowledge admission or adjudication.
- Decision Intelligence, ranking, valuation, fraud detection, recommendations.
- Automatic conflict winner selection.
- PASS 2 confidence redefinition or automatic cross-axis mapping.
- PASS 3B Evidence/provenance/association mutation.
- Registry, Planner, provider selection/execution, Search State, STOP/EXPAND.
- Source reliability/reputation architecture.
- Security enforcement, storage, implementation, canonical serialization, and physical schema unless separately authorized.
- Historical R2/R2.1 reconstruction.

## Inherited contracts

- PASS 2 constitutional principles and confidence authority.
- PASS 3A planning, execution, Search State, access, and expansion authority.
- PASS 3B Evidence Model, exact R2.1 admission ordering, all 18 invariants, immutable lifecycle/history, provenance, temporal/conflict, independence, sufficiency/expansion, supersession, and governance contracts.

## Ownership boundaries

- PASS 2 owns confidence-axis meaning.
- PASS 3B owns Evidence and association records/history.
- PASS 3C owns distinct Resolution Result and Fusion Product identities and their derivation lifecycle.
- PASS 3A owns every operational search decision.
- Later passes own Knowledge, Truth, Decision, and recommendation authorities.

## Deferred capabilities

- Knowledge Architecture, Decision Intelligence, recommendation generation, valuation, fraud detection, source reliability/reputation.
- Winner selection and Truth adjudication.
- Confidence/sufficiency automation unless separately authorized.
- Security enforcement, storage, implementation, schema, and serialization.

## Forbidden assumptions

- Roadmap phase equals authorized PASS 3C scope.
- Association or current selection equals final resolution.
- Confidence equals Truth.
- Evidence Identity equals Entity Identity.
- Aggregation equals Fusion.
- Source count equals independent confirmation.
- Unknown equals negative or confirmed.
- Different values across time automatically conflict.
- Conflict disposition may erase disagreement.
- Fusion may flatten provenance or mutate Evidence.
- Evidence Expansion advice commands PASS 3A.
- Unavailable historical wording may be reconstructed.

## Open architectural questions

1. Exact Resolution Result state model and final `CONFIRMED` admission requirements.
2. Fusion Product semantic unit and derivation graph.
3. Minimum entity-resolution state required for each Fusion class.
4. Independence clustering basis and explicit unknown behavior.
5. Temporal comparison scope, uncertainty handling, and non-comparability.
6. Difference between conflict interpretation and permitted operational disposition.
7. Whether PASS 3C defines a distinct Fusion confidence axis without an automatic scoring algorithm.
8. Governance composition when constituent restrictions differ.
9. Resolution/Fusion supersession, policy-version change, and replay behavior.
10. Exact advisory Evidence Expansion message semantics.

## Success conditions

The 15 mandatory and eight specialist-dependent conditions in §15, with deferred and not-applicable categories preserved.

## Review chain

The 13-gate scope-specific chain in §16, with separate remediation/recheck only when findings occur and Final Certification always executed separately.

## Entry conditions

1. User explicitly approves this title, mission, scope allocation, ownership boundaries, exclusions, success-condition families, and review architecture.
2. A separate operation is explicitly authorized to initialize PASS 3C.
3. That initialization records the certified predecessor artifacts and frozen PASS 3B digests.
4. PASS 3C remains NOT STARTED until the separate initialization operation actually begins.
5. Repository or Master Record modification, if later required, receives separate explicit authorization.

---

# 18. Decision Gate Verdict

## READY FOR USER CHARTER APPROVAL

The predecessor evidence supports one recommended narrow and coherent charter. Alternative A remains viable but leaves Entity Resolution authority external and incomplete; Alternative C is too broad and requires a product-policy decision unsupported by predecessor contracts. The report therefore recommends Option B without approving it.

No architectural conflict and no insufficient-evidence condition prevents user approval. Three capability details—automatic confidence computation, Evidence Sufficiency automation, and canonical serialization—remain separate architectural decisions and are not prerequisites because the proposed charter either defers their implementation or treats them as explicitly gated optional scope.

User approval of this proposal would approve the charter decision set only. It would **not** initialize PASS 3C, create canonical architecture, modify the repository, or authorize implementation.

---

===== PHOENIX ATLAS — PASS 3C PRE-INITIALIZATION DECISION GATE =====

Recommended PASS 3C title: PHOENIX ENTITY RESOLUTION AND EVIDENCE FUSION SPECIFICATION v1.0  
Recommended mission: Define final Entity Resolution and provenance-preserving Evidence Fusion contracts, with distinct PASS 3C-owned products, immutable predecessor inputs, preserved uncertainty/conflict/lineage/governance, and no Truth, Knowledge, Decision, recommendation, search-control, or implementation authority.

Deferred capabilities evaluated: 19  
Allocated to PASS 3C: 6 wholly or at bounded contract level  
Deferred beyond PASS 3C: 10 explicit-out or later-pass allocations, including the deferred portion of conflict adjudication  
Unresolved allocation: 3 separate architectural decisions — automatic confidence computation, Evidence Sufficiency automation, canonical serialization/physical schema

Predecessor contracts frozen: PASS 2 constitutional/confidence contracts; PASS 3A planning/Search State/access/expansion authority; PASS 3B Evidence, association, provenance, temporal/conflict, independence, confidence-boundary, supersession, sufficiency/expansion, governance, admission, and no-write-back contracts  
PASS 3B invariants inherited: 18 / 18

Ownership collisions: 3  
Resolved/contained: 3  
Unresolved: 0

Prospective blocker risks: 9  
Prevented/controlled: 7  
Remaining: 2 require PASS 3C architecture; 0 unresolved at charter level

Prospective major risks: 7  
Prevented/controlled: 4  
Remaining: 3 require PASS 3C architecture; 0 unresolved at charter level

Proposed success conditions: 15 mandatory; 8 specialist-review dependent; deferred and not-applicable sets explicit  
Proposed review gates: 13, including separate Final Certification

Decision gate verdict: READY FOR USER CHARTER APPROVAL

PASS 3C: NOT STARTED  
Repository modified: NO  
Master Record modified: NO  
Git operations performed: NO

USER APPROVAL REQUIRED FOR:
- recommended canonical title and Option B mission;
- the complete 19-entry capability allocation, including partial conflict scope and three separately gated decisions;
- the PASS 2 / PASS 3B / proposed PASS 3C Entity Resolution ownership boundary;
- inclusion of Evidence Fusion and its mandatory preservation questions;
- exclusion of Truth, Knowledge, Decision Intelligence, recommendations, provider/Search State control, implementation, security, storage, and serialization by default;
- the advisory-only Evidence Expansion feedback contract;
- the predecessor contract freeze, proposed success conditions, and 13-gate certification architecture.

Recommended next authorized operation: USER CHARTER APPROVAL of the proposed decision set. If approved, perform a separate explicitly authorized PASS 3C INITIALIZATION operation; approval of this gate alone must leave PASS 3C NOT STARTED.

===== END =====
