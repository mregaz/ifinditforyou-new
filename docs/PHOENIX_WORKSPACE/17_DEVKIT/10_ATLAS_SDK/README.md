# Phoenix Atlas SDK

## Status

IMPLEMENTATION — IP-01 DOMAIN SKELETON

## Purpose

The Phoenix Atlas SDK provides the DevKit implementation boundary for
controlled read-only access to Phoenix Atlas intelligence artifacts.

This domain implements the frozen Atlas SDK Architecture, Function
Specification, Public API, Return Status Mapping, Source Requirement
Matrix, and Canonical Serialization contracts.

## Module Structure

10_ATLAS_SDK/
- README.md
- atlas.sh
- loader.sh
- normalization.sh
- query.sh
- provider_card.sh

## Module Responsibilities

### atlas.sh

Public API composition and orchestration boundary.

Responsibilities:
- public API composition;
- initialization orchestration;
- availability orchestration;
- validation orchestration;
- preservation of the public/private boundary.

It must not become a monolithic implementation module.

### loader.sh

Controlled read-only Atlas source loading boundary.

Responsibilities:
- canonical root resolution;
- canonical source-path resolution;
- source availability checks;
- source readability checks;
- safe read-only loading;
- source metadata preparation.

It must not reinterpret Atlas intelligence semantics.

### normalization.sh

Structural normalization boundary.

Responsibilities:
- structural normalization;
- canonical key handling;
- canonical field ordering;
- canonical record ordering;
- canonical escaping;
- canonical serialization.

Normalization must not reinterpret Atlas intelligence semantics.

### query.sh

Atlas query boundary.

Responsibilities:
- provider lookup;
- provider listing;
- marketplace surface lookup;
- marketplace surface listing;
- lifecycle lookup;
- access lookup.

Query behavior must preserve the frozen Source Requirement Matrix and
Return Status Mapping.

### provider_card.sh

Provider Card projection boundary.

Responsibilities:
- Provider Card composition;
- canonical field projection;
- source traceability preservation;
- optional enrichment composition.

Provider Cards are intelligence projections.
They are not decision or recommendation objects.

## Sourcing Direction

atlas.sh may compose:
- loader.sh
- normalization.sh
- query.sh
- provider_card.sh

Internal modules must not source atlas.sh.

Cross-module sourcing must remain explicit and deterministic.

## Namespace

Public functions:

phoenix::atlas_*

Private functions:

_phoenix::atlas_*

User-controlled input must never be used to construct function names
for dynamic dispatch.

## Implementation Boundary

IP-01 establishes structure and documentation only.

No substantive runtime behavior is implemented in this checkpoint.

Later checkpoints must remain conformant with the frozen Atlas SDK
Architecture, Function Specification, Public API, Return Status Mapping,
Source Requirement Matrix, and Canonical Serialization contract.
