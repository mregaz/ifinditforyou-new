# PHOENIX PROVIDER PLANNER AND SEARCH STATE SPECIFICATION

## Version 1.0

**Status:** CERTIFIED
**Program:** Phoenix Atlas — Pass 3A
**Scope:** Provider Planning, Search Waves, Search Sufficiency, Adaptive Expansion
**Upstream:** `PHOENIX_ADAPTIVE_SEARCH_AND_EVIDENCE_ARCHITECTURE_v1.0.md`

---

# 1. Purpose

This specification defines how Phoenix transforms a normalized user query into an executable provider search plan and determines whether additional search is required.

The Provider Planner answers four questions:

1. Which providers are relevant?
2. Which relevant providers are executable?
3. Which providers should execute first?
4. After execution, should Phoenix stop or expand?

Canonical principle:

> **Search breadth must be earned by information need.**

Phoenix preserves a broad searchable universe without executing every available provider for every query.

---

# 2. Scope and Boundaries

Pass 3A defines:

* provider selection;
* provider eligibility;
* search roles;
* provider families and marketplace surfaces;
* search waves;
* rare-query behavior;
* inventory sufficiency;
* search saturation;
* expansion policy;
* search stopping;
* adaptive search budget.

Pass 3A does **not** implement:

* Entity Resolution;
* Evidence Fusion;
* Evidence Independence;
* Confidence Architecture;
* Conflict Detection;
* Temporal Intelligence;
* Trust Intelligence;
* final ranking;
* Decision Intelligence.

Pass 3A evaluates **search sufficiency, not evidence truth**.

---

# 3. Architectural Position

```text
USER QUERY
    ↓
QUERY UNDERSTANDING
    ↓
PROVIDER PLANNER
    ↓
SEARCH PLAN
    ↓
EXECUTION
    ↓
SEARCH STATE
    ↓
STOP / EXPAND
```

Responsibilities remain separated:

```text
REGISTRY
What exists?

PLANNER
What should be searched?

EXECUTION
Run the plan.

SEARCH STATE
Was the search sufficient?

RANKING
How should results be ordered?

DECISION INTELLIGENCE
What do the accumulated evidences mean?
```

---

# 4. Core Doctrine

Phoenix Provider Planning follows:

```text
BROAD COVERAGE
      +
SELECTIVE DEPTH
      +
ADAPTIVE SEARCH
```

Phoenix must minimize unnecessary provider execution without minimizing the searchable universe.

A provider may therefore remain strategically important without participating in every search.

---

# 5. Query Context

The Planner consumes a normalized Query Context.

Conceptually:

```text
QueryContext {
    rawQuery
    normalizedQuery
    intent
    vertical
    geography
    language
    constraints
    rarityEstimate
}
```

Initial intent classes may include:

```text
GENERAL
PROPERTY
AUTOMOTIVE
AUCTION
COLLECTIBLES
FASHION
RECOMMERCE
RARE_ITEM
```

Unknown intent must have deterministic fallback behavior.

Geography may be represented as:

```text
LOCAL
COUNTRY
REGIONAL
CROSS_BORDER
GLOBAL
```

Explicit user geographic constraints must never be silently widened.

---

# 6. Provider Search Roles

Every searchable marketplace surface has one Search Role:

```text
CORE
STANDARD
EXTENDED
SPECIALIST
NONE
```

**CORE** — high-value primary coverage.

**STANDARD** — useful normal-market coverage.

**EXTENDED** — conditional secondary or long-tail coverage.

**SPECIALIST** — high-value source for a specific vertical, object type or intent.

**NONE** — retained for intelligence, lifecycle or historical purposes but excluded from live search.

Search Role is not universal execution order.

A relevant SPECIALIST may execute in the first wave.

---

# 7. Provider Family and Marketplace Surface

Phoenix distinguishes:

```text
Provider Family
      ↓
Marketplace Surface
      ↓
Access Surface
      ↓
Technical Adapter
```

Example:

```text
eBay
├── EBAY_IT
├── EBAY_FR
├── EBAY_ES
├── EBAY_DE
└── EBAY_GB
```

Technical integration may be shared across a Provider Family.

Search planning operates on Marketplace Surfaces.

Surface identity must remain preserved for:

* geography;
* access governance;
* attribution;
* provenance;
* later evidence processing.

---

# 8. Desired and Executable Provider Sets

Provider selection follows:

```text
Desired Provider Set
        ↓
Availability Gate
        ↓
Executable Provider Set
```

The **Desired Provider Set** represents strategically relevant surfaces for the Query Context.

The **Availability Gate** verifies:

```text
surface active
capability available
access authorized
integration operational
```

Only providers passing the gate enter the **Executable Provider Set**.

Therefore:

```text
Strategic Importance
        ≠
Execution Eligibility
```

Unavailable providers must not cause search failure when viable alternatives exist.

---

# 9. Query-Specific Provider Selection

Provider execution priority is query-dependent.

Relevant dimensions include:

```text
Search Role
Capability Match
Geographic Match
Language Match
Rare Query Value
Vertical Depth
Evidence Value
Effective Availability
```

Therefore:

```text
Provider Strategic Value
        ≠
Query-Specific Execution Priority
```

Version 1.0 should prefer explicit deterministic rules over opaque scoring formulas.

---

# 10. Search Waves

Provider execution is organized into four conceptual waves:

| Wave             | Purpose                         | Typical Sources                                      |
| ---------------- | ------------------------------- | ---------------------------------------------------- |
| L0 — PRIMARY     | Minimum credible search         | CORE + directly relevant SPECIALIST                  |
| L1 — COVERAGE    | Normal coverage expansion       | STANDARD + additional specialists                    |
| L2 — EXPANSION   | Conditional additional coverage | EXTENDED + long-tail + family surfaces               |
| L3 — DEEP SEARCH | Difficult/rare searches         | cross-border + niche + historical/advanced expansion |

Waves are planning stages, not provider-quality ratings.

Phoenix may skip waves when Query Context makes deeper search immediately appropriate.

A highly specific rare query may therefore place high-RQV specialists or cross-border surfaces directly into L0.

---

# 11. Rare Query Behavior

Phoenix defines:

```text
RQP — Rare Query Probability
```

Initial deterministic classes:

```text
LOW
MEDIUM
HIGH
VERY_HIGH
```

Potential signals:

* exact model/reference;
* unusual variant;
* specialist vocabulary;
* narrow constraints;
* historical terminology;
* scarce category;
* restrictive geography.

Higher RQP may increase:

* initial provider breadth;
* specialist participation;
* high-RQV provider participation;
* geographic expansion eligibility;
* permitted search depth;
* Adaptive Search Budget.

Rare queries should not be forced through predictably unproductive shallow waves.

---

# 12. Search State

After each execution wave Phoenix evaluates Search State.

Canonical future model:

```text
SearchState {
    inventorySufficiency
    evidenceSufficiency
    evidenceIndependence
    entityConfidence
    conflictLevel
    searchSaturation
}
```

Pass 3A operationally owns only:

```text
inventorySufficiency
searchSaturation
```

The remaining fields are extension points for subsequent Evidence Architecture phases.

The Planner must not calculate evidence truth or confidence in Pass 3A.

---

# 13. Inventory Sufficiency

Inventory Sufficiency answers:

> Has Phoenix discovered enough relevant opportunity to satisfy the search objective?

Initial states:

```text
INSUFFICIENT
PARTIAL
SUFFICIENT
STRONG
```

It must not depend exclusively on raw result count.

Potential signals include:

```text
relevant result count
estimated unique inventory
provider diversity
constraint satisfaction
geographic coverage
```

As Entity Resolution matures, unique-entity information should progressively replace raw listing counts.

---

# 14. Search Saturation

Search Saturation measures diminishing returns from additional search.

Example:

```text
L0 → 42 useful results
L1 → +17 useful results
L2 → +3 useful results
```

Phoenix defines:

```text
MCG — Marginal Coverage Gain
```

MCG represents the additional relevant coverage contributed by another provider or wave.

Over time Phoenix should observe MCG by:

```text
provider
category
country
query rarity
```

Initial implementation may use Atlas-derived estimates.

High saturation means further search is unlikely to materially improve coverage.

---

# 15. Expansion Policy

When Search State is insufficient, Phoenix selects the expansion type that addresses the identified deficit.

| Condition                       | Preferred Expansion               |
| ------------------------------- | --------------------------------- |
| Inventory insufficient          | Provider Expansion                |
| Local coverage insufficient     | Geographic Expansion              |
| Relevant family surfaces remain | Provider-Family Expansion         |
| Vertical depth insufficient     | Specialist Expansion              |
| Query rarity high               | Deep Search                       |
| Evidence insufficient           | Deferred to Evidence Architecture |

Canonical future expansion universe remains:

```text
Provider Expansion
Provider-Family Expansion
Geographic Expansion
Semantic Expansion
Specialist Expansion
Historical Expansion
Evidence Expansion
Independent-Evidence Expansion
```

Pass 3A directly governs the first four operational search-expansion mechanisms.

---

# 16. Expansion Constraints

Expansion must respect:

```text
user constraints
access governance
provider availability
remaining search budget
expected marginal value
```

Geographic expansion must never violate explicit user geography.

Provider-family expansion must preserve Marketplace Surface identity.

Expansion must never activate an unauthorized source.

---

# 17. Adaptive Search Budget

Each search may operate under:

```text
AdaptiveSearchBudget {
    maxWaves
    maxProviderExecutions
    latencyBudget
}
```

The budget limits search depth without embedding commercial policy directly inside the Planner.

External product or operational policy may configure these limits.

Rare-query classification may justify a larger budget.

Budget exhaustion is a valid search termination condition.

---

# 18. Stop Decision

Phoenix stops expanding when one of the following is true:

```text
SEARCH SUFFICIENT

or

SEARCH SATURATED

or

BUDGET EXHAUSTED

or

NO USEFUL EXPANSION REMAINS
```

The decision may consider:

```text
Inventory Sufficiency
Search Saturation
Rare Query Probability
Remaining Provider Value
Adaptive Search Budget
```

No universal raw-result threshold is sufficient.

---

# 19. Failure Handling

Individual provider failure must not automatically terminate the search.

Canonical behavior:

```text
PROVIDER FAILURE
      ↓
record execution state
      ↓
remove from current availability
      ↓
re-evaluate remaining plan
      ↓
continue when useful alternatives exist
```

Phoenix distinguishes:

```text
PROVIDER UNAVAILABLE
```

from:

```text
SEARCH IMPOSSIBLE
```

---

# 20. Determinism

Given identical:

```text
Query Context
Registry State
Marketplace Surface State
Access State
Planner Policy
```

the initial Search Plan must be deterministic.

Subsequent plans may change only as a deterministic consequence of explicit Search State produced by previous waves.

This supports:

* reproducibility;
* automated testing;
* debugging;
* explainability.

---

# 21. Explainability

Planner decisions must be explainable.

Example provider selection:

```text
Surface:
AUTOTRADER_GB

Selected because:
AUTOMOTIVE intent
+
UK geography
+
SPECIALIST role
+
high vertical relevance
+
effective availability
```

Example expansion:

```text
Inventory Sufficiency = PARTIAL
Search Saturation = LOW
High-value eligible surfaces remain

Decision = EXPAND
```

Opaque scoring must not be the sole basis of planning decisions.

---

# 22. Planner Input Contract

Conceptually:

```text
PlannerInput {
    queryContext
    registryState
    surfaceState
    accessState
    plannerPolicy
    searchState?
}
```

The exact implementation type is deferred.

---

# 23. Planner Output Contract

Conceptually:

```text
SearchPlan {
    wave
    selectedSurfaces
    deferredSurfaces
    unavailableSurfaces
    expansionPolicy
    budget
}
```

Each selected surface should preserve at minimum:

```text
surfaceId
providerFamilyId
searchRole
capabilityMatch
selectionReason
```

---

# 24. Wave Result Contract

Execution returns a normalized wave summary:

```text
SearchWaveResult {
    wave
    providerExecutions
    rawResultCount
    relevantResultCount
    uniqueEntityEstimate
    failures
    duration
}
```

The summary feeds Search State evaluation.

Execution remains responsible for provider invocation.

The Planner remains responsible for deciding what happens next.

---

# 25. State Transition

Canonical lifecycle:

```text
PLAN
 ↓
EXECUTE
 ↓
OBSERVE
 ↓
EVALUATE
 ↓
STOP
```

or:

```text
PLAN
 ↓
EXECUTE
 ↓
OBSERVE
 ↓
EVALUATE
 ↓
EXPAND
 ↓
PLAN NEXT WAVE
```

This loop terminates when the Stop Decision becomes true.

---

# 26. Initial Implementation Scope

The first implementation derived from Pass 3A should remain deliberately small:

```text
Query Context
      ↓
Capability Filtering
      ↓
Search Role Filtering
      ↓
Availability Gate
      ↓
L0 Planning
      ↓
Execution
      ↓
Inventory Sufficiency
      ↓
STOP or L1
```

This establishes adaptive behavior without prematurely implementing the complete Evidence or Decision Architecture.

---

# 27. Deferred Capabilities

Explicitly deferred:

```text
full Entity Resolution
Evidence Fusion
Evidence Independence
Conflict Detection
Temporal Intelligence
Trust / Transaction Intelligence
historical comparable reasoning
dynamic provider learning
advanced semantic expansion
evidence-driven expansion
Decision Intelligence
```

These are architectural commitments, not Pass 3A implementation requirements.

---

# 28. Validation Requirements

Future automated tests should cover at minimum:

* CORE selection;
* immediate SPECIALIST selection;
* unavailable-provider exclusion;
* `NONE` exclusion;
* capability mismatch;
* geographic filtering;
* deterministic ordering;
* L0 planning;
* L1 expansion;
* sufficient-search stop;
* insufficient-search expansion;
* rare-query deeper planning;
* provider-family expansion;
* budget exhaustion;
* no useful expansion remaining;
* isolated provider failure.

---

# 29. Access Governance

Provider planning is subordinate to access governance.

A provider may simultaneously have:

```text
Search Role = CORE
```

and:

```text
Effective Availability = FALSE
```

Strategic importance never authorizes access.

> **No Planner decision may override provider access policy.**

---

# 30. Relationship to Registry, Execution and Ranking

The boundaries are canonical:

```text
REGISTRY
What exists?
      ↓
PLANNER
What should be searched?
      ↓
EXECUTION
Run it.
```

The Planner must not contain provider-discovery metadata that belongs to Registry or Atlas-derived configuration.

Likewise:

```text
Provider Planning
        ≠
Result Ranking
```

Search Role must never become an implicit listing-ranking weight.

A result from an EXTENDED source may rank above one from a CORE source.

---

# 31. Architectural Invariants

The following invariants are mandatory:

1. `SearchRole.NONE` never enters a live Search Plan.
2. Unauthorized or unavailable surfaces never enter the executable set.
3. SPECIALIST surfaces may execute before STANDARD or EXTENDED surfaces.
4. Provider Family reuse must preserve Marketplace Surface identity.
5. Expansion must derive from Query Context or Search State.
6. Explicit user geography must never be silently widened.
7. Identical inputs and policy state must produce deterministic planning.
8. Search Role must never become final-result ranking weight.
9. Individual provider failure must not automatically terminate the search.
10. Access governance always overrides strategic priority.

---

# 32. Pass 3A Success Criteria

Pass 3A is architecturally complete when stable contracts exist for:

```text
Provider Selection
Search Roles
Provider Families
Marketplace Surfaces
Availability Gate
Search Waves
Rare Query Behavior
Inventory Sufficiency
Search Saturation
Expansion Policy
Stop Decision
Adaptive Search Budget
```

Implementation remains a separate milestone.

---

# 33. Next Architectural Step

After Pass 3A certification:

```text
PHOENIX ATLAS — PASS 3B
```

will define:

**PHOENIX EVIDENCE MODEL AND PROVENANCE SPECIFICATION v1.0**

Primary scope:

```text
Evidence
Source Provenance
Entity Evidence
Temporal Context
Evidence Independence
Confidence
Conflict Representation
```

This will provide the next contract required for the progression:

```text
Adaptive Search
      ↓
Evidence Architecture
      ↓
Knowledge Architecture
      ↓
Decision Intelligence
```

---

# Final Principle

> **Phoenix does not search every available source. It constructs the smallest credible search plan, measures what that search has learned, and expands only when additional search is expected to materially improve the user's information state.**

---

## PHOENIX ATLAS — PASS 3A STATUS

```text
Provider Planner Architecture    DEFINED
Search Roles                     DEFINED
Search Waves                     DEFINED
Search State Foundation          DEFINED
Expansion Policy                 DEFINED
Stop Policy                      DEFINED
Access Governance                DEFINED
Implementation                   NOT STARTED
Final Certification              PASS
```

**Document Status:** CERTIFIED
**Next Action:** PASS 3B — Evidence Model & Provenance

---

**END OF PHOENIX PROVIDER PLANNER AND SEARCH STATE SPECIFICATION v1.0**
