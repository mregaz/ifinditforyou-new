# Phoenix Atlas SDK

## Status

IMPLEMENTATION — COMPLETE

FINAL CERTIFICATION — NOT STARTED

## Purpose

The Phoenix Atlas SDK provides the DevKit implementation boundary for controlled read-only access to certified Phoenix Atlas intelligence artifacts.

It implements the frozen Atlas SDK Architecture, Function Specification, Public API, Return Status Mapping, Source Requirement Matrix, and Canonical Serialization contracts.

The SDK exposes certified intelligence. It does not manufacture intelligence, execute provider operations, perform network retrieval, rank providers, or make planning or decision-intelligence choices.

## Module Structure

```text
10_ATLAS_SDK/
├── README.md
├── atlas.sh
├── loader.sh
├── normalization.sh
├── query.sh
└── provider_card.sh
```

## Module Responsibilities

### atlas.sh

Public API composition and initialization boundary.

Responsibilities:
- public API composition;
- initialization orchestration;
- availability orchestration;
- validation orchestration;
- preservation of the public/private boundary.

### loader.sh

Controlled read-only canonical-source loading boundary.

Responsibilities:
- deterministic Atlas root resolution;
- canonical source-path resolution;
- source availability and readability checks;
- safe read-only loading;
- canonical source validation support;
- source metadata preparation.

Atlas content is treated as data, never as executable shell code.

### normalization.sh

Structural normalization and canonical serialization boundary.

Responsibilities:
- structural normalization;
- canonical key handling;
- canonical field ordering;
- canonical record ordering;
- canonical escaping;
- deterministic serialization.

Normalization does not reinterpret Atlas intelligence semantics.

### query.sh

Atlas intelligence query boundary.

Responsibilities:
- provider lookup;
- provider listing;
- Marketplace Surface lookup;
- Marketplace Surface listing;
- lifecycle lookup;
- access lookup;
- Provider Card composition through the public query surface.

Query behavior preserves the frozen Source Requirement Matrix, Return Status Mapping, Canonical Serialization contract, and source traceability.

### provider_card.sh

Reserved Provider Card projection module boundary.

Provider Card behavior remains an intelligence projection. A Provider Card is not a runtime decision, provider ranking, recommendation, Planner decision, or authorization decision.

## Public API

Atlas SDK v1.0 exposes exactly ten public functions:

```text
phoenix::atlas_initialize
phoenix::atlas_is_available
phoenix::atlas_validate
phoenix::atlas_provider_get
phoenix::atlas_provider_list
phoenix::atlas_surface_get
phoenix::atlas_surface_list
phoenix::atlas_lifecycle_get
phoenix::atlas_access_get
phoenix::atlas_provider_card
```

Public functions use the `phoenix::atlas_*` namespace.

Private implementation helpers use `_phoenix::atlas_*` and are not consumer APIs.

## Basic Usage

Load the Atlas SDK entrypoint:

```bash
source docs/PHOENIX_WORKSPACE/17_DEVKIT/10_ATLAS_SDK/atlas.sh
```

Check whether the canonical Atlas source set is available:

```bash
phoenix::atlas_is_available
```

Validate the canonical Atlas source state:

```bash
phoenix::atlas_validate
```

Initialize deterministic process-local Atlas state:

```bash
phoenix::atlas_initialize
```

List provider intelligence:

```bash
phoenix::atlas_provider_list
```

Retrieve one provider by explicit canonical identity:

```bash
phoenix::atlas_provider_get 1
```

List Marketplace Surface intelligence:

```bash
phoenix::atlas_surface_list
```

Retrieve one Marketplace Surface:

```bash
phoenix::atlas_surface_get ATLAS-SURFACE-001
```

Retrieve lifecycle intelligence:

```bash
phoenix::atlas_lifecycle_get 1
```

Retrieve access intelligence:

```bash
phoenix::atlas_access_get 1
```

Compose a Provider Card projection:

```bash
phoenix::atlas_provider_card 1
```

## Output Contract

Successful query output uses deterministic line-oriented `KEY=VALUE` serialization.

Canonical output preserves explicit unknown or unavailable information and source traceability. Missing information must not be converted into invented certainty.

List ordering is deterministic and must never depend on filesystem enumeration order.

Machine-specific absolute paths must not be exposed as canonical source references.

## Return Status Mapping

Atlas SDK v1.0 uses the frozen public return-status mapping:

```text
0  SUCCESS
2  INVALID_ARGUMENT
3  NOT_FOUND
4  SOURCE_MISSING
5  SOURCE_UNREADABLE
6  INVALID_CANONICAL_DATA
7  UNSUPPORTED_VERSION
8  INTERNAL_FAILURE
```

These numeric meanings are part of the frozen v1.0 public contract.

Valid absence and operational failure remain distinguishable.

## Canonical Source Requirements

Atlas SDK source resolution is deterministic and derives from the stable Phoenix Workspace layout.

The recognized canonical source set includes:

```text
PHOENIX_ATLAS_FINAL_MASTER_v1.0.md
PHOENIX_ATLAS_FINAL_RECONCILIATION_v1.0.md
PHOENIX_ATLAS_GLOBAL_TRACKER_001_061.csv
PHOENIX_ATLAS_MARKETPLACE_SURFACE_REGISTRY_v1.0.csv
PHOENIX_ATLAS_STRATEGIC_SYNTHESIS_v1.0.md
PHOENIX_ADAPTIVE_SEARCH_AND_EVIDENCE_ARCHITECTURE_v1.0.md
PHOENIX_PROVIDER_PLANNER_AND_SEARCH_STATE_SPECIFICATION_v1.0.md
```

Capability-specific required and optional source behavior remains governed by the frozen Source Requirement Matrix.

The SDK must not treat drafts, temporary Work artifacts, backups, arbitrary local files, or uncertified candidate documents as canonical intelligence sources.

## Security Boundary

The Atlas SDK is read-only.

It must not:
- mutate canonical Atlas artifacts;
- execute Atlas content as shell code;
- use `eval` for public behavior;
- construct executable commands from Atlas data;
- perform network retrieval;
- recursively discover canonical sources through arbitrary filesystem scanning;
- depend on caller PWD for canonical source resolution;
- expose arbitrary source-path control through the public API.

Atlas content is data, never code.

## Dependency Boundary

Dependency direction is constrained:

```text
Core → must not depend on Atlas SDK
Atlas SDK → may use explicitly authorized lower-level Core facilities
Atlas SDK → must not depend on CLI
Atlas SDK → must not depend on Plugin System
Consumers → must not call private _phoenix::atlas_* helpers
Consumers → must not import private Atlas SDK modules directly
```

Plugin System integration is not required by Atlas SDK v1.0.

## Architectural Boundaries

The Atlas SDK exposes intelligence but does not own higher-level planning, evidence-fusion, decision, or runtime-provider policy.

The following responsibilities remain outside the Atlas SDK:

- Provider Planner decisions;
- Search State STOP or EXPAND decisions;
- provider ranking;
- entity resolution;
- Evidence Fusion;
- Decision Intelligence;
- scraping;
- provider network fetching;
- network refresh;
- PASS 3B-specific runtime Evidence APIs.

Technical availability does not imply authorization.

Atlas intelligence does not imply runtime executability.

Marketplace Surface remains distinct from Provider Family.

## Failure Examples

An invalid public argument returns:

```text
2  INVALID_ARGUMENT
```

An explicit identity that is valid in shape but absent from canonical intelligence returns:

```text
3  NOT_FOUND
```

A required canonical source that does not exist returns:

```text
4  SOURCE_MISSING
```

Structurally invalid canonical source data returns:

```text
6  INVALID_CANONICAL_DATA
```

Unsupported canonical source version returns:

```text
7  UNSUPPORTED_VERSION
```

Failures must not emit partial successful canonical output.

## Limitations

Atlas SDK v1.0 deliberately does not provide:

- fuzzy provider matching;
- AI-based provider matching;
- semantic provider search;
- inferred provider ranking;
- network discovery;
- network retrieval;
- scraping;
- mutation of Atlas intelligence;
- runtime provider execution;
- Planner behavior;
- Evidence Fusion;
- Decision Intelligence;
- PASS 3B runtime integration.

Public list APIs expose no frozen filter grammar in v1.0.

Unknown intelligence remains explicit rather than being inferred.

## Validation and Test Evidence

The Atlas SDK implementation is protected by dedicated regression coverage for:

- canonical source resolution;
- canonical source loading;
- canonical source validation;
- normalization;
- deterministic serialization;
- provider queries;
- Marketplace Surface registry loading and queries;
- lifecycle queries;
- access queries;
- Provider Card behavior;
- foundation public API behavior;
- security boundaries;
- dependency boundaries;
- frozen-contract invariants.

At the IP-16A documentation baseline, the repository contains 15 dedicated `test_atlas_*.sh` regression files.

Final Phase 8 certification remains separate from implementation completion.

## Contract Governance

The following Atlas SDK v1.0 contracts are frozen and must not be changed through README maintenance:

- Public API;
- Return Status Mapping;
- Source Requirement Matrix;
- Canonical Serialization.

Incompatible changes require explicit contract revision and versioning.

## Current State

```text
PHOENIX DEVKIT — PHASE 8
ATLAS SDK

Implementation                      COMPLETE
Public API                          FROZEN
Return Status Mapping               FROZEN
Source Requirement Matrix           FROZEN
Canonical Serialization             FROZEN
Security Verification               PASS
Dependency Boundary Verification    PASS
Final Certification                 NOT STARTED
```

Final Certification must remain `NOT STARTED` until the dedicated Phase 8 final certification gate is successfully completed.

## Functional Principle

> Atlas SDK functions expose certified intelligence; they do not manufacture intelligence.

> Read, validate, normalize, resolve, expose — never reinterpret, execute or decide.
