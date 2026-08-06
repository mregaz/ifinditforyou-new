# PHOENIX ADAPTIVE SEARCH AND EVIDENCE ARCHITECTURE

## Version 1.0

**Status:** CANONICAL ARCHITECTURE SPECIFICATION
**Origin:** Phoenix Atlas v1.0 — Pass 2
**Scope:** Adaptive Search, Evidence Architecture and Decision Intelligence
**Atlas baseline:** 61 canonical marketplace/provider records

---

# 1. Purpose

This document defines the canonical Phoenix architecture for transforming marketplace search into adaptive, evidence-driven decision intelligence.

Phoenix must not operate as a conventional metasearch engine that simply queries a fixed set of providers and aggregates their results.

The system must determine:

* what the user is actually searching for;
* which providers are relevant;
* which marketplace surfaces are available;
* how much search coverage is sufficient;
* what evidence is missing;
* when the search should expand;
* how duplicate listings relate to the same real-world entity;
* how evidence from multiple sources should be fused;
* how provenance must be preserved;
* how historical information should be interpreted;
* how trust and transaction evidence should be represented;
* when additional search has diminishing value;
* and when Phoenix has enough information to support a decision.

The canonical progression is:

```text
SEARCH
   ↓
UNDERSTANDING
   ↓
EVIDENCE
   ↓
KNOWLEDGE
   ↓
DECISION INTELLIGENCE
```

---

# 2. Architectural Doctrine

Phoenix follows three complementary strategic principles:

```text
BROAD COVERAGE
      +
SELECTIVE DEPTH
      +
ADAPTIVE SEARCH
```

Broad Coverage ensures that Phoenix does not artificially restrict the searchable universe.

Selective Depth prevents the system from building and executing deep integrations for every available source.

Adaptive Search determines dynamically when broader or deeper search is justified.

Therefore:

> Phoenix must minimize unnecessary provider execution without minimizing the searchable universe.

---

# 3. Canonical Search Pipeline

The canonical Phoenix search pipeline is:

```text
USER QUERY
    │
    ▼
QUERY UNDERSTANDING
    │
    ├── Intent
    ├── Vertical
    ├── Geography
    ├── Language
    ├── Constraints
    └── Rare Query Probability
    │
    ▼
PROVIDER PLANNING
    │
    ├── Provider Capabilities
    ├── Provider Families
    ├── Marketplace Surfaces
    ├── Access Policies
    ├── Search Roles
    └── Effective Availability
    │
    ▼
INITIAL SEARCH PLAN
    │
    ▼
SEARCH EXECUTION
    │
    ▼
ENTITY RESOLUTION
    │
    ▼
EVIDENCE COVERAGE
    │
    ▼
EVIDENCE FUSION
    │
    ▼
TEMPORAL ALIGNMENT
    │
    ▼
TRUST / TRANSACTION EVIDENCE
    │
    ▼
SEARCH STATE EVALUATION
    │
    ├── Inventory Sufficiency
    ├── Evidence Sufficiency
    ├── Evidence Independence
    ├── Entity Confidence
    ├── Conflict Level
    └── Search Saturation
    │
    ▼
ADAPTIVE EXPANSION DECISION
    │
    ├── Provider Expansion
    ├── Provider-Family Expansion
    ├── Geographic Expansion
    ├── Semantic Expansion
    ├── Specialist Expansion
    ├── Historical Expansion
    ├── Evidence Expansion
    └── Independent-Evidence Expansion
    │
    ▼
NEXT WAVE / STOP
    │
    ▼
RANKING
    │
    ▼
DECISION INTELLIGENCE
```

---

# 4. Provider Priority Is Not Query Priority

Phoenix must distinguish global provider importance from query-specific provider relevance.

A provider may be strategically important while being irrelevant to a specific query.

Therefore:

```text
Provider Priority
        ≠
Query Provider Priority
```

Query Provider Priority should conceptually depend on:

```text
Provider Capability
×
Query Intent
×
Vertical
×
Geography
×
Language
×
Query Rarity
×
Access Availability
×
Expected Information Gain
```

Provider execution must therefore be planned dynamically rather than controlled only by a static global priority.

---

# 5. Provider Evaluation Dimensions

Phoenix Atlas Pass 2 establishes the following evaluation dimensions.

## 5.1 CV — Coverage Value

Measures the provider's ability to contribute broad relevant inventory.

## 5.2 UIV — Unique Inventory Value

Measures the likelihood that the provider contributes inventory not already available through other sources.

## 5.3 RQV — Rare Query Value

Measures the provider's potential value when normal search coverage is insufficient.

## 5.4 VD — Vertical Depth

Measures the provider's strength within a particular vertical or specialist domain.

## 5.5 EV — Evidence Value

Measures the provider's contribution to understanding and evaluating an entity rather than merely discovering it.

## 5.6 TEV — Trust Evidence Value

Measures the provider's contribution to transaction-specific trust evidence.

## 5.7 TXV — Transaction Evidence Value

Measures the provider's ability to expose useful transaction-path information.

## 5.8 PFL — Provider Family Leverage

Measures how much searchable surface coverage can be obtained through reusable family-level integration.

## 5.9 MCG — Marginal Coverage Gain

Measures the additional relevant information obtained by executing another provider or search wave.

## 5.10 RQP — Rare Query Probability

Estimates the probability that a query requires deeper-than-normal search.

## 5.11 ASB — Adaptive Search Budget

Defines the amount of provider execution, latency, API usage, compute and other resources justified for a search.

---

# 6. Estimated Scores vs Observed Scores

Atlas classifications provide architectural starting points.

They must not be treated as permanent empirical truth.

Phoenix distinguishes:

```text
ATLAS ESTIMATED SCORE
          ↓
INITIAL SEARCH POLICY
          ↓
PRODUCTION TELEMETRY
          ↓
PHOENIX OBSERVED SCORE
          ↓
ADAPTIVE POLICY
```

Over time, provider strategy should increasingly be informed by observed contribution.

Possible observed dimensions include:

* unique inventory contribution;
* category-specific contribution;
* geographic contribution;
* rare-query success;
* evidence contribution;
* latency;
* execution cost;
* duplicate rate;
* failure rate;
* search expansion value.

---

# 7. Search Coverage

Search Coverage answers:

> Have we found enough relevant opportunities?

It must not be reduced to raw result count.

Possible inputs include:

```text
relevant entity count
+
provider diversity
+
inventory uniqueness
+
geographic coverage
+
price coverage
+
result quality
```

Search Coverage is primarily concerned with discovery.

It does not establish whether Phoenix has sufficient evidence to support a decision.

---

# 8. Evidence Coverage

Evidence Coverage answers:

> Do we understand the discovered entities well enough?

Potential evidence dimensions include:

```text
identity
price
history
condition
valuation
comparables
location
seller
trust
transaction
provenance
market context
```

Therefore:

```text
RESULT COUNT
      ≠
EVIDENCE QUALITY
```

A search containing many listings may still have poor Evidence Coverage.

A smaller set of strongly evidenced entities may provide greater decision value.

---

# 9. Entity Resolution

Phoenix must distinguish listings from the entities they describe.

Multiple listings may refer to one real-world entity.

Canonical model:

```text
Listing A ─┐
Listing B ─┼──► ENTITY
Listing C ─┘
```

Duplicates must therefore not automatically be discarded.

The correct progression is:

```text
duplicate candidates
        ↓
entity resolution
        ↓
evidence consolidation
        ↓
provenance preservation
```

Entity resolution confidence must be explicit.

Possible levels include:

```text
EXACT
STRONG
PROBABLE
WEAK
UNRESOLVED
```

Evidence must not be fused when entity correspondence is insufficiently reliable.

---

# 10. Evidence Fusion

Evidence from multiple sources must be combined without destroying its origin or context.

Canonical evidence structure should preserve at least:

```text
Evidence
├── type
├── value
├── source
├── provenance
├── observedAt
├── confidence
└── entityMatchConfidence
```

Where applicable it should additionally preserve:

```text
validFrom
validUntil
eventTime
acquisitionMethod
```

Evidence Fusion must never silently transform conflicting observations into artificial certainty.

---

# 11. Evidence Conflict

When credible evidence conflicts, Phoenix must preserve the conflict.

Example:

```text
Current listing:
Mileage = 82,000 km

Historical evidence:
Mileage = 118,000 km
```

Phoenix must not arbitrarily choose one value.

The correct state is:

```text
EVIDENCE CONFLICT
```

The conflict itself becomes decision evidence.

High-value conflicts may trigger:

```text
INDEPENDENT-EVIDENCE EXPANSION
```

---

# 12. Evidence Independence

Multiple acquisition paths do not necessarily represent independent evidence.

Example:

```text
Original Portal
     │
     ├── Aggregator A
     ├── Aggregator B
     └── Aggregator C
```

This does not constitute four independent confirmations.

It represents:

```text
1 origin evidence
+
3 propagation paths
```

Therefore:

```text
SOURCE COUNT
      ≠
INDEPENDENT EVIDENCE COUNT
```

Evidence Independence must eventually contribute to confidence evaluation.

---

# 13. Temporal Intelligence

Historical information must remain available after inventory becomes inactive.

Canonical distinction:

```text
ACTIVE INVENTORY
        ≠
HISTORICAL EVIDENCE
```

A completed auction, expired listing or previous transaction may remain valuable for:

* valuation;
* comparables;
* rarity analysis;
* price history;
* lifecycle analysis;
* market interpretation.

Historical evidence must preserve temporal context.

Phoenix must distinguish:

```text
Evidence Reliability
        ≠
Temporal Relevance
```

An old record may be highly reliable but weakly representative of the current market.

---

# 14. Auction Evidence

Auction environments require richer state representation.

Potential states include:

```text
UPCOMING
LIVE
CLOSED
PROVISIONAL
AWARDED
UNSOLD
WITHDRAWN
CANCELLED
```

Price concepts must remain distinct:

```text
estimate_low
estimate_high
starting_bid
current_bid
reserve_price
hammer_price
buyer_premium
final_transaction_cost
```

A hammer price must never automatically be represented as total acquisition cost.

Historical auction results should remain available as comparable evidence.

---

# 15. Trust Evidence

Phoenix follows the doctrine:

> Trust Evidence, Not Trust Score.

Phoenix must not collapse heterogeneous trust signals into an unexplained universal score.

Trust evidence may include:

```text
identity verification
professional seller status
transaction reputation
authentication eligibility
authentication outcome
buyer protection eligibility
payment protection
tracked shipping
return eligibility
```

Every trust claim must remain scoped to its actual source and context.

---

# 16. Authentication Evidence

Authentication is not a simple boolean.

Phoenix must distinguish:

```text
authentication available
authentication eligible
authentication required
authentication performed
authentication successful
```

Where possible authentication evidence should preserve:

```text
performedBy
performedWhen
verificationScope
outcome
confidence
```

Eligibility for authentication must never be represented as completed authentication.

---

# 17. Transaction Evidence

The acquisition path can materially change decision value.

Potential transaction states include:

```text
OFFER
ACCEPTANCE
PAYMENT_INITIATED
PAYMENT_HELD
ITEM_SHIPPED
ITEM_DELIVERED
ISSUE_REPORTED
PAYMENT_RELEASED
RETURN
REFUND
DISPUTE
```

Phoenix does not need to execute these transactions in order to reason about their implications.

Transaction Evidence allows the system to explain how an acquisition may proceed and what protections or frictions apply.

---

# 18. Protection Eligibility

Marketplace-level protection claims must not automatically be applied to every transaction.

Phoenix should model transaction-specific eligibility based on factors such as:

```text
listing eligibility
seller eligibility
payment method
shipping method
geography
category
transaction type
exclusions
```

Therefore:

```text
Marketplace Offers Protection
             ≠
This Transaction Is Protected
```

---

# 19. Total Acquisition Cost

Phoenix must distinguish advertised price from total economic acquisition cost.

Conceptually:

```text
advertised price
+
platform fees
+
buyer premium
+
payment fees
+
shipping
+
insurance
+
export costs
+
import duties
+
tax
+
registration
+
required repairs
────────────────
TOTAL ACQUISITION COST
```

The exact components vary by vertical and transaction.

Decision ranking should eventually be capable of considering Total Acquisition Cost rather than headline price alone.

---

# 20. Provider Families

Phoenix must separate:

```text
PROVIDER FAMILY
      ↓
MARKETPLACE SURFACE
      ↓
ACCESS SURFACE
      ↓
TECHNICAL ADAPTER
```

Multiple country surfaces must not automatically require multiple independent integrations.

Example:

```text
eBay Provider Family
├── EBAY_IT
├── EBAY_FR
├── EBAY_ES
├── EBAY_DE
└── EBAY_GB
```

A shared adapter may support multiple surfaces while preserving their independent identity.

---

# 21. Marketplace Surface

Marketplace Surface should conceptually preserve:

```text
id
providerFamily
country
locale
currency
capabilities
accessPolicy
lifecycle
```

A provider family may be active while individual surfaces have different:

* lifecycle states;
* capabilities;
* access rules;
* transaction policies;
* inventory;
* languages;
* currencies.

Family-level reuse must therefore never erase surface-level semantics.

---

# 22. Effective Provider Availability

Provider existence does not imply executable access.

Phoenix should conceptually evaluate:

```text
Provider Exists
×
Surface Active
×
Capability Available
×
Access Authorized
×
Integration Operational
──────────────────────────
Effective Provider Availability
```

The Provider Planner must distinguish:

```text
DESIRED PROVIDER SET
```

from:

```text
AVAILABLE PROVIDER SET
```

When a desired provider is unavailable, the Planner should calculate an alternative Search Plan rather than fail the entire request.

---

# 23. Source Provenance Chain

Phoenix must preserve the complete acquisition path where known.

Examples:

```text
Phoenix
  ↓
eBay API
  ↓
EBAY_ES
  ↓
Seller
```

```text
Phoenix
  ↓
Aggregator
  ↓
Original Marketplace
  ↓
Seller
```

```text
Phoenix
  ↓
Auction Platform
  ↓
Auction House
  ↓
Auction Event
  ↓
Lot
```

This structure is the:

```text
SOURCE PROVENANCE CHAIN
```

It is required for:

* attribution;
* deduplication;
* evidence independence;
* trust analysis;
* licensing reasoning;
* ranking;
* confidence;
* entity resolution.

---

# 24. Long-Tail Providers

Long-tail providers must not automatically be classified as weak providers.

Their canonical role is:

```text
SEARCH EXPANSION ASSET
```

Their characteristic value may be:

```text
LOW / MEDIUM average utility
            +
HIGH conditional utility
```

especially for rare queries.

Phoenix should therefore activate long-tail sources according to expected marginal information gain rather than general marketplace popularity.

---

# 25. Rare Query Probability

Rare Query Probability estimates whether deeper search is likely to be required.

Possible signals include:

```text
query specificity
number of constraints
object age
model / variant specificity
category rarity
restricted geography
specialist terminology
part numbers
historical terminology
```

RQP influences the initial Search Plan.

Low RQP may justify:

```text
CORE + SPECIALIST
```

High RQP may justify immediate inclusion of:

```text
CORE
+
SPECIALIST
+
HIGH-RQV PROVIDERS
+
broader geography
```

rather than waiting for multiple failed search waves.

---

# 26. Marginal Coverage Gain

Additional providers must be evaluated according to the new relevant information they contribute.

A provider returning many duplicate results may have lower marginal value than a smaller provider contributing unique entities.

Therefore Phoenix should eventually observe:

```text
Provider
×
Category
×
Country
×
Query Rarity
→ Marginal Contribution
```

This allows static Atlas estimates to evolve into empirical provider intelligence.

---

# 27. Search Saturation

Phoenix must observe diminishing returns across search waves.

Example:

```text
Wave 0
42 unique relevant entities

Wave 1
+17

Wave 2
+3
```

This indicates increasing search saturation.

However, saturation must be interpreted relative to query rarity.

For a highly rare query, one additional valid entity may remain extremely valuable.

Therefore the stopping decision must consider both:

```text
Marginal Information Gain
+
Rare Query Probability
```

---

# 28. Adaptive Search Budget

Every search may have a dynamic execution budget.

Potential budget dimensions include:

```text
provider executions
latency
API quota
API cost
compute
commercial access cost
```

The budget may depend on:

```text
query rarity
user plan
vertical
expected information gain
search state
```

Product differentiation should not mean:

```text
FREE = bad search
PRO  = good search
```

A better model is:

```text
FREE
credible primary search

PRO
deeper adaptive search
+
evidence expansion
+
cross-border expansion
+
historical intelligence
+
advanced decision support
```

---

# 29. Semantic Expansion

Search Expansion does not mean only executing additional providers.

Phoenix may also expand the query.

Possible controlled transformations include:

```text
synonyms
translations
model codes
part numbers
historical names
category terminology
manufacturer terminology
```

Example:

```text
Vespa GS 150 carburatore
Vespa GS150 carburetor
Vespa GS Vergaser
Vespa GS carburateur
Dell'Orto UB23S3
```

Semantic expansion must remain controlled so that recall increases without destroying precision.

---

# 30. Multidimensional Search Expansion

Phoenix defines Search Expansion as a multidimensional process.

Canonical expansion types:

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

The system must choose the expansion type according to the deficiency detected.

Examples:

```text
Inventory insufficient
→ Provider / Geographic / Semantic Expansion

Evidence insufficient
→ Evidence / Specialist / Historical Expansion

Entity confidence low
→ Identity Evidence Expansion

Evidence conflict high
→ Independent-Evidence Expansion
```

There is no single universal fallback strategy.

---

# 31. Search State

After each execution wave Phoenix should conceptually evaluate:

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

Search State determines whether Phoenix should:

```text
STOP
```

or:

```text
EXPAND
```

and, if expanding, **how**.

---

# 32. Ranking Evolution

Phoenix ranking must evolve beyond simple query/listing relevance.

Potential decision dimensions include:

```text
Query Relevance
Evidence Completeness
Evidence Confidence
Evidence Independence
Freshness
Price Attractiveness
Total Acquisition Cost
Seller Evidence
Trust Evidence
Transaction Feasibility
User Constraints
```

Phoenix should avoid opaque universal scores whenever explainable multidimensional evidence provides a better representation.

---

# 33. Decision Intelligence

The purpose of Phoenix is not merely to maximize result count.

The system should progressively answer:

```text
What exists?
Where is it?
Is it the same entity?
What do we know about it?
Where does that knowledge come from?
How current is it?
Does independent evidence support it?
Are there conflicts?
What would acquisition actually cost?
What protections apply?
What risks remain?
Which alternatives best satisfy the user's constraints?
```

Decision Intelligence is therefore downstream of Search and Evidence Architecture.

---

# 34. Constitutional Principles

## Principle 1 — Evidence-Driven Expansion

> Phoenix expands search when evidence is insufficient, not merely because additional providers exist.

## Principle 2 — Preserve Duplicate Evidence

> Duplicate listings may describe the same real-world entity. Phoenix must resolve the entity, consolidate useful evidence and preserve provenance rather than blindly discard duplicates.

## Principle 3 — Fuse, Never Flatten

> Phoenix must fuse evidence without erasing provenance, confidence, temporal context or credible conflicts.

## Principle 4 — Preserve Historical Intelligence

> A source does not stop being valuable when its listing stops being actionable. Historical outcomes must remain time-scoped evidence and must never be confused with current inventory.

## Principle 5 — Trust Is Contextual Evidence

> Marketplace trust claims, authentication, reputation and protection must be represented as contextual evidence rather than universal guarantees.

## Principle 6 — Maximize Surface Coverage, Minimize Integration Duplication

> Phoenix must maximize searchable marketplace surfaces while minimizing redundant technical integrations. Provider-family reuse must preserve surface identity, access policy and provenance.

## Principle 7 — Long-Tail Is Conditional Intelligence

> Long-tail providers are conditional search assets. Their activation should depend on query rarity, expected marginal information gain and search saturation.

---

# 35. Canonical Strategic Model

The final Atlas Pass 2 model is:

```text
QUERY
  ↓
UNDERSTANDING
  ↓
PLANNING
  ↓
SEARCH COVERAGE
  ↓
ENTITY RESOLUTION
  ↓
EVIDENCE COVERAGE
  ↓
EVIDENCE FUSION
  ↓
TEMPORAL INTELLIGENCE
  ↓
TRUST / TRANSACTION INTELLIGENCE
  ↓
SEARCH STATE
  ↓
ADAPTIVE EXPANSION
  ↓
RANKING
  ↓
DECISION INTELLIGENCE
```

---

# 36. Relationship to Phoenix Atlas

Phoenix Atlas v1.0 established the external intelligence foundation:

```text
61 canonical provider records
        ↓
provider lifecycle
        ↓
access intelligence
        ↓
provider families
        ↓
vertical capabilities
        ↓
trust / transaction intelligence
        ↓
provenance
        ↓
historical intelligence
```

Pass 2 converts that research into architectural requirements.

Therefore:

```text
ATLAS
  ↓
SEARCH ARCHITECTURE
  ↓
KNOWLEDGE ARCHITECTURE
  ↓
DECISION ARCHITECTURE
```

Atlas remains the intelligence source.

This specification defines how Phoenix should use that intelligence.

---

# 37. Implementation Doctrine

This document defines architecture, not immediate implementation scope.

The concepts described here must not all be implemented simultaneously.

Recommended progression:

```text
PHASE 1
Provider Planning
Search Waves
Search Sufficiency

PHASE 2
Entity Resolution
Provenance

PHASE 3
Evidence Model
Evidence Coverage

PHASE 4
Adaptive Search Expansion
Observed Provider Metrics

PHASE 5
Evidence Fusion
Conflict Detection
Temporal Intelligence

PHASE 6
Trust / Transaction Intelligence

PHASE 7
Decision Intelligence
```

Implementation must remain consistent with Phoenix engineering principles:

```text
simplicity first
explicit contracts
deterministic behavior
testability
incremental evolution
```

Architecture should anticipate the complete system without forcing premature implementation complexity.

---

# 38. Final Declaration

Phoenix Atlas began by asking:

> Which marketplaces should Phoenix search?

Atlas Pass 2 produces a more mature question:

> What information does Phoenix need to answer the user's request well, where can that information be obtained, how trustworthy and independent is it, and when has the system searched enough?

This changes the nature of Phoenix.

```text
METASEARCH
    ↓
ADAPTIVE SEARCH
    ↓
EVIDENCE SYSTEM
    ↓
KNOWLEDGE SYSTEM
    ↓
DECISION INTELLIGENCE
```

Phoenix should not attempt to search everything all the time.

Phoenix should know:

```text
WHERE TO SEARCH
WHAT TO SEARCH FOR
HOW DEEP TO SEARCH
WHAT EVIDENCE IS MISSING
HOW SOURCES RELATE
WHEN INFORMATION CONFLICTS
WHEN TO EXPAND
WHEN TO STOP
HOW TO EXPLAIN THE RESULT
```

That is the architectural purpose of Adaptive Search and Evidence Intelligence.

---

# FINAL PRINCIPLE

> **Phoenix does not create value by searching the greatest number of sources. Phoenix creates value by finding the right evidence, understanding how that evidence relates, knowing when more information is required, and turning that knowledge into an explainable decision.**

---

**END OF PHOENIX ADAPTIVE SEARCH AND EVIDENCE ARCHITECTURE v1.0**

