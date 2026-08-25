# PHOENIX ATLAS SDK ARCHITECTURE

## Version 1.0

**Status:** ARCHITECTURE REVIEWED

**Program:** Phoenix DevKit — Phase 8

**Phase:** Atlas Integration

**Deliverable:** Atlas SDK

---

# 1. Purpose

This document defines the architecture of the Phoenix DevKit Atlas SDK.

The Atlas SDK provides a controlled integration boundary between certified Phoenix Atlas intelligence assets and Phoenix DevKit consumers.

Its purpose is to expose certified Atlas-derived intelligence through explicit, deterministic and stable DevKit contracts without duplicating or redefining Atlas semantics.

The Atlas SDK is an integration layer.

It is not a replacement for Phoenix Atlas.

---

# 2. Architectural Mission

The Atlas SDK exists to make certified Phoenix Atlas intelligence safely consumable by the Phoenix DevKit.

The canonical responsibility boundary is:

```text
PHOENIX ATLAS
Canonical Intelligence Authority
        ↓
ATLAS SDK
Controlled Integration Boundary
        ↓
PHOENIX DEVKIT CONSUMERS
```

The Atlas SDK must preserve the distinction between:

```text
Atlas Intelligence Ownership
        ≠
DevKit Integration Ownership
```

Phoenix Atlas owns intelligence semantics.

Phoenix DevKit owns the mechanism used to consume that intelligence.

---

# 3. Phase 8 Scope

Phase 8 — Atlas Integration targets the following capability areas:

```text
Provider Intelligence
Marketplace Discovery
Knowledge Base integration boundary
Provider Cards
```

The Phase 8 deliverable is:

```text
Atlas SDK
```

Version 1.0 of the Atlas SDK must remain deliberately constrained to certified Atlas contracts already available in the canonical repository.

---

# 4. Certified Atlas Inputs

Atlas SDK v1.0 may consume only explicitly authorized canonical Atlas assets.

Initial certified inputs include:

```text
PHOENIX_ATLAS_FINAL_MASTER_v1.0.md

PHOENIX_ATLAS_FINAL_RECONCILIATION_v1.0.md

PHOENIX_ATLAS_GLOBAL_TRACKER_001_061.csv

PHOENIX_ATLAS_STRATEGIC_SYNTHESIS_v1.0.md

PHOENIX_ADAPTIVE_SEARCH_AND_EVIDENCE_ARCHITECTURE_v1.0.md

PHOENIX_PROVIDER_PLANNER_AND_SEARCH_STATE_SPECIFICATION_v1.0.md
```

Additional Atlas assets may become valid inputs only after their certification and explicit incorporation into the Atlas SDK architecture.

Candidate or draft Atlas material must not be consumed as if it were certified canonical data.

---

# 5. Canonical Intelligence Domains

The Atlas SDK v1 architecture may expose intelligence derived from certified Atlas domains including:

```text
Provider Lifecycle
Provider Family
Marketplace Surface
Provider Access
Marketplace Access
Provider / Marketplace Status
Marketplace Category
Country / Market
Atlas Record Status
Provider Intelligence Metadata
```

The following Atlas-derived registries are recognized as architectural candidates:

```text
ProviderLifecycleRegistry
ProviderFamilyRegistry
ProviderAccessSurfaceRegistry
ProviderAccessMatrix
MarketplaceSurfaceRegistry
```

These names describe Atlas intelligence responsibilities.

The exact runtime representation and function contracts are deferred to the Atlas SDK Function Specification.

---

# 6. Global Tracker Boundary

The canonical Atlas Global Tracker currently exposes a record shape equivalent to:

```text
tracker_id
country
marketplace
category
atlas_v1_status
evidence_note
```

The Atlas SDK may normalize this data into a stable DevKit-facing representation.

Normalization must preserve the original semantic meaning of each Atlas field.

The SDK must not reinterpret Atlas status values as runtime provider eligibility, ranking, reliability or recommendation scores unless a certified contract explicitly defines such semantics.

---

# 7. Atlas Ownership Boundary

Phoenix Atlas remains the authority for:

```text
Provider Intelligence
Marketplace Intelligence
Provider Lifecycle Intelligence
Provider Family Intelligence
Marketplace Surface Identity
Access / Compliance Intelligence
Atlas Research Evidence
Atlas Strategic Classification
Atlas-derived architectural decisions
```

The Atlas SDK must not redefine these concepts.

The SDK may validate, normalize, index and expose certified Atlas intelligence.

It must not originate new Atlas intelligence.

---

# 8. Atlas SDK Responsibilities

Atlas SDK v1.0 is responsible for:

```text
Canonical Atlas source resolution
Atlas input validation
Structural normalization
Stable record representation
Deterministic lookup
Deterministic listing
Controlled filtering
Provider intelligence access
Marketplace surface intelligence access
Lifecycle intelligence access
Access metadata exposure
Provider-card data composition
Stable public DevKit API
Failure classification
```

These responsibilities belong to the integration layer only.

---

# 9. Atlas SDK Non-Responsibilities

Atlas SDK v1.0 must not own:

```text
Provider Planner
Search Plan creation
Search Waves
Search State
STOP decisions
EXPAND decisions
Search Saturation
Adaptive Search Budget
Evidence Truth
Entity Resolution
Evidence Fusion
Conflict Resolution
Temporal Intelligence
Decision Intelligence
Recommendation Logic
Provider execution
Scraping
Network retrieval
Plugin discovery
Plugin lifecycle
```

The Atlas SDK must not absorb responsibilities owned by other Phoenix layers.

---

# 10. PASS 3A Boundary

The certified PASS 3A ownership chain remains:

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

Atlas SDK must not take ownership of any element in this chain.

The following invariant remains mandatory:

```text
Search Sufficiency ≠ Evidence Truth
```

The Atlas SDK may provide Atlas-derived configuration or intelligence to an authorized consumer.

It must not determine search planning policy.

---

# 11. PASS 2 Boundary

PASS 2 defines architectural domains including:

```text
Entity Resolution
Evidence Fusion
Evidence Conflict
Evidence Independence
Temporal Intelligence
Source Provenance
Decision Intelligence
```

Atlas SDK v1.0 must not implement these capabilities.

Atlas SDK may expose certified metadata required by future layers.

It must not collapse integration responsibilities into Evidence or Decision Intelligence.

---

# 12. PASS 3B Boundary

PASS 3B — Evidence Model & Provenance is not part of the initial Atlas SDK v1 repository baseline until its certified architecture is canonically materialized and incorporated into the repository.

Therefore Atlas SDK v1 architecture must not depend on PASS 3B-specific runtime contracts at this checkpoint.

Future Atlas SDK versions may expose PASS 3B-derived Evidence contracts only through an explicit architecture revision.

---

# 13. Knowledge Base Boundary

Phase 8 roadmap includes Knowledge Base support.

For Atlas SDK v1.0, Knowledge Base support means:

```text
controlled access to certified Atlas knowledge assets
```

It does not mean:

```text
Knowledge Graph reasoning
Evidence Fusion
Entity Resolution
Decision construction
AI-generated knowledge
```

Knowledge processing beyond certified Atlas record access remains deferred.

---

# 14. Provider Intelligence Model

Provider Intelligence represents certified Atlas knowledge about a provider or marketplace integration subject.

It may include:

```text
identity
market
country
category
lifecycle
family
surface
access metadata
Atlas status
research classification
canonical references
```

Provider Intelligence must remain separate from runtime provider execution state.

The existence of Atlas intelligence does not imply executable provider access.

---

# 15. Marketplace Surface Model

Marketplace Surface identity must remain explicit.

Provider-family reuse must not collapse distinct marketplace surfaces.

The Atlas SDK must preserve:

```text
Provider Family
        ≠
Marketplace Surface
```

Shared technical integration must not erase distinct:

```text
market identity
country
surface
access policy
lifecycle
Atlas classification
```

---

# 16. Provider Lifecycle Model

Atlas SDK may expose certified Provider Lifecycle information.

Lifecycle values may include states such as:

```text
ACTIVE
MIGRATING
ABSORBED
API_RETIRED
TRANSACTION_DISABLED
CLOSED
HISTORICAL
```

The exact canonical lifecycle taxonomy must be derived only from certified Atlas contracts.

The SDK must not invent lifecycle transitions.

---

# 17. Access Governance

Provider existence does not imply executable access.

Atlas SDK must preserve certified access and compliance intelligence.

The SDK may expose:

```text
access availability
access policy
authorized access status
API / feed / partnership information
known restrictions
```

But it must not convert technical availability into authorization.

The following principle is mandatory:

```text
Technical Availability ≠ Authorized Access
```

The SDK must never bypass provider access policy.

---

# 18. Structural Normalization

Atlas SDK may normalize certified Atlas data into predictable DevKit structures.

Normalization may include:

```text
field naming
ordering
record shape
empty-value representation
status serialization
stable identifiers
```

Normalization must not:

```text
reinterpret Atlas meaning
invent missing intelligence
merge distinct marketplace surfaces
convert unknown state into certainty
silently alter source classifications
```

Structural normalization is permitted.

Semantic reinterpretation is not.

---

# 19. Canonical Source Preservation

Atlas SDK must preserve traceability to canonical Atlas sources.

A normalized record should retain sufficient reference information to identify its Atlas origin.

The SDK must not produce normalized intelligence whose canonical source cannot be determined.

This requirement supports:

```text
traceability
debugging
auditability
future Atlas evolution
```

---

# 20. Determinism

Atlas SDK behavior must be deterministic.

Given the same:

```text
canonical Atlas inputs
SDK version
query parameters
```

the SDK must produce the same normalized result and ordering.

Atlas SDK must avoid:

```text
implicit environment input
opaque scoring
filesystem enumeration order
random ordering
network-dependent results
```

unless a future explicit contract authorizes them.

---

# 21. Read-Only Canonical Data Contract

Atlas SDK v1.0 treats canonical Atlas assets as read-only inputs.

The SDK must not:

```text
rewrite Atlas files
update Atlas records
change Atlas classifications
rename Atlas assets
delete Atlas assets
silently persist normalized state into Atlas
```

If future write capabilities are required, they must be defined as a separate architectural capability.

---

# 22. Dependency Direction

The allowed dependency direction is:

```text
DEVKIT CONSUMER
        ↓
ATLAS SDK
        ↓
CERTIFIED ATLAS ASSETS
```

The reverse direction is forbidden.

Certified Atlas architecture must not depend on DevKit Atlas SDK implementation.

Core Phoenix modules must not depend upward on Atlas SDK.

---

# 23. Public API Direction

Atlas SDK public functionality must use the canonical Phoenix public namespace:

```text
phoenix::atlas_*
```

Private Atlas SDK helpers must use:

```text
_phoenix::atlas_*
```

Exact public function names and signatures are intentionally deferred to:

```text
PHOENIX_ATLAS_SDK_FUNCTION_SPECIFICATION_v1.0.md
```

Public consumers must not depend on private Atlas SDK helpers.

---

# 24. Candidate Public Capability Families

The Atlas SDK Function Specification should define a minimal public surface covering capabilities equivalent to:

```text
Atlas availability / initialization
Provider intelligence lookup
Provider intelligence listing
Marketplace surface lookup
Marketplace surface listing
Lifecycle lookup
Access metadata lookup
Provider Card composition
Atlas record validation
```

These are capability directions only.

They are not frozen function names.

---

# 25. Provider Cards

Provider Cards are normalized read-only projections of certified Atlas intelligence.

A Provider Card may combine approved fields such as:

```text
provider identity
marketplace identity
country
category
provider family
marketplace surface
lifecycle
access metadata
Atlas status
source references
```

Provider Cards must not contain invented recommendations or runtime search policy.

They are intelligence projections, not decision objects.

---

# 26. Consumer Boundary

Potential Atlas SDK consumers include:

```text
CLI
Generators
Validators
future Automation layer
future application-specific modules
```

Consumers may use only the certified Atlas SDK public API.

Consumers must not parse canonical Atlas files independently when the SDK owns the relevant access contract.

This preserves one integration boundary.

---

# 27. CLI Boundary

The CLI remains an orchestration and presentation layer.

The CLI may eventually expose Atlas SDK capabilities through certified public Atlas SDK APIs.

The CLI must not:

```text
parse Atlas data directly
duplicate Atlas normalization
implement provider intelligence semantics
implement Atlas access policy
call Atlas SDK private helpers
```

Any CLI Atlas command family belongs to a future explicit CLI contract revision.

---

# 28. Generator Boundary

Generators may eventually consume Atlas SDK public APIs when generating Atlas-aware artifacts.

Generators must not:

```text
duplicate Atlas intelligence
modify Atlas canonical sources
invent provider classifications
depend on Atlas SDK private functions
```

Atlas SDK integration must not alter certified Generator semantics.

---

# 29. Validator Boundary

Validators may eventually validate Atlas-aware project artifacts.

Validation remains read-only.

Validators must not mutate Atlas canonical sources.

Generic Atlas source validation belongs to Atlas SDK only when explicitly defined by the Function Specification.

---

# 30. Failure Model

Atlas SDK must fail clearly and deterministically.

Failure classes should distinguish at minimum:

```text
Atlas source missing
Atlas source unreadable
Invalid canonical data
Unknown Atlas record
Unsupported Atlas status
Unsupported canonical version
Invalid lookup request
Internal SDK contract failure
```

Exact status codes and return semantics are deferred to the Function Specification.

Failures must not be hidden behind successful empty output where absence and failure have different meanings.

---

# 31. Fail-Fast Policy

Atlas SDK must detect invalid execution preconditions as early as possible.

Validation should occur before exposing normalized canonical output.

Invalid canonical input must not be partially accepted when doing so could produce inconsistent intelligence.

Fail-fast behavior must remain deterministic.

---

# 32. Security Boundary

Atlas inputs must be treated as data.

Atlas SDK must not:

```text
use eval
construct executable shell commands from Atlas content
source arbitrary Atlas files as shell code
execute provider metadata
perform uncontrolled filesystem discovery
follow arbitrary paths supplied by Atlas data
interpret Atlas field values as executable functions
```

All external or file-derived data must be considered untrusted until validated against the SDK contract.

---

# 33. Path Resolution

Canonical Atlas input paths must be resolved deterministically.

Atlas SDK must not depend on the caller's current working directory.

Source resolution must derive from explicit configuration or a stable DevKit/Workspace location contract.

Arbitrary recursive filesystem search must not be used as the primary canonical source-discovery mechanism.

---

# 34. Versioning

Atlas SDK versioning must remain distinct from:

```text
Phoenix Atlas document versions
Phoenix DevKit global version
CLI version
Generator version
Validator version
```

Version compatibility between SDK and canonical Atlas data must be explicit.

The SDK must fail or reject input when an unsupported canonical format would otherwise produce ambiguous behavior.

---

# 35. Extensibility

Atlas SDK must support future certified Atlas capabilities without requiring invasive Core modification.

Extension must occur through:

```text
explicit data contracts
public SDK APIs
versioned adapters
controlled normalization
```

Future Atlas capabilities must not be enabled through uncontrolled dynamic execution.

---

# 36. Plugin Boundary

The Phoenix Plugin and Extension Model remains a separate future DevKit phase.

Atlas SDK v1.0 must not require a Plugin System.

Future plugins may consume certified Atlas SDK public APIs.

They must not bypass Atlas SDK boundaries to access or reinterpret canonical Atlas intelligence.

---

# 37. PASS 3B and Future Evidence Integration

Future Atlas SDK architecture may expose certified Evidence and Provenance contracts after PASS 3B is canonically available in the repository.

That future integration must preserve:

```text
Atlas owns Evidence semantics
Atlas SDK exposes certified integration contracts
```

Atlas SDK must not become an Evidence reasoning engine.

---

# 38. Testing Direction

Atlas SDK tests should verify at minimum:

```text
canonical source resolution
valid source loading
invalid source rejection
deterministic normalization
deterministic ordering
provider lookup
marketplace surface lookup
lifecycle lookup
access metadata lookup
Provider Card projection
unknown record behavior
unsupported version behavior
read-only behavior
path safety
no eval / execution boundary
source traceability
```

The exact test suite belongs to implementation planning after architecture and function specification freeze.

---

# 39. Architectural Invariants

Atlas SDK v1.0 freezes the following candidate architectural invariants:

1. Phoenix Atlas remains the authority for Atlas intelligence semantics.
2. Atlas SDK is an integration layer, not a second intelligence authority.
3. Atlas SDK consumes only explicitly authorized canonical Atlas inputs.
4. Candidate or uncertified Atlas material must not be treated as canonical input.
5. Structural normalization must not reinterpret Atlas semantics.
6. Atlas SDK canonical access is read-only.
7. Provider Family and Marketplace Surface remain distinct.
8. Atlas intelligence does not imply executable provider access.
9. Technical availability does not imply authorization.
10. Atlas SDK does not own Provider Planner responsibilities.
11. Atlas SDK does not own Search State, STOP or EXPAND.
12. Atlas SDK does not own Entity Resolution.
13. Atlas SDK does not own Evidence Fusion.
14. Atlas SDK does not own Decision Intelligence.
15. Atlas SDK behavior must be deterministic.
16. Canonical source traceability must be preserved.
17. Public consumers use `phoenix::atlas_*` APIs only.
18. Private `_phoenix::atlas_*` helpers are not public contracts.
19. Core modules must not depend upward on Atlas SDK.
20. Atlas SDK must not use `eval` or data-driven command execution.
21. Canonical Atlas source discovery must be deterministic.
22. Atlas SDK v1.0 does not require the Plugin System.
23. Provider Cards are intelligence projections, not decision objects.
24. Failures must remain explicit where absence and failure differ.

---

# 40. Initial Physical Architecture Direction

The initial implementation architecture may introduce a dedicated Atlas SDK domain under the DevKit.

Candidate physical direction:

```text
17_DEVKIT/
└── 10_ATLAS_SDK/
    ├── README.md
    ├── atlas.sh
    ├── loader.sh
    ├── normalization.sh
    ├── query.sh
    └── provider_card.sh
```

This physical layout is a candidate architecture direction only.

Exact filenames must be reviewed before implementation freeze.

---

# 41. Implementation Boundary

Implementation must not begin until:

```text
Atlas SDK Architecture                REVIEWED
Atlas SDK Function Specification      REVIEWED
Public API                            FROZEN
Return Status Mapping                 FROZEN
Source Requirement Matrix             FROZEN
Canonical Serialization              FROZEN
Security Review                       PASS
Dependency Review                     PASS
Cross-document Consistency            PASS
Implementation Plan                   APPROVED
```

---

# 42. Architecture Success Criteria

The Atlas SDK Architecture phase is complete when:

```text
Purpose                          DEFINED
Atlas ownership boundary         DEFINED
Certified input boundary         DEFINED
Normalization boundary           DEFINED
Provider intelligence boundary   DEFINED
Marketplace surface boundary     DEFINED
Lifecycle boundary               DEFINED
Access governance                DEFINED
Provider Card boundary           DEFINED
Dependency direction             DEFINED
Public API direction             DEFINED
Failure model                    DEFINED
Security boundary                DEFINED
Determinism                      DEFINED
Read-only contract               DEFINED
PASS 3A boundary                 PRESERVED
PASS 2 boundary                  PRESERVED
Plugin boundary                  PRESERVED
Implementation                   COMPLETE
```

---

# 43. Architecture Status

Current Phase 8 state:

```text
PHASE 8 — ATLAS INTEGRATION

Atlas SDK Mission                  DEFINED
Atlas / DevKit Ownership Boundary  DEFINED
Canonical Input Boundary           DEFINED
Structural Normalization Boundary  DEFINED
Public API Direction               DEFINED
Dependency Direction               DEFINED
Forbidden Responsibility Boundary  DEFINED
Failure / Security Boundary        DEFINED

Function Specification             REVIEWED
Implementation                     COMPLETE
Final Architecture Certification   NOT STARTED
```

---

# Final Principle

> **Atlas owns intelligence. DevKit owns the integration mechanism.**

And:

> **The Atlas SDK consumes certified Atlas contracts; it does not redefine them.**

---

**PHOENIX ATLAS SDK ARCHITECTURE v1.0 — REVIEWED**