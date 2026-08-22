# PHOENIX ATLAS SDK IMPLEMENTATION PLAN

## Version 1.0

**Status:** IMPLEMENTATION PLAN APPROVED

**Program:** Phoenix DevKit — Phase 8

**Phase:** Atlas Integration

**Deliverable:** Atlas SDK Implementation Plan

**Architecture:** `PHOENIX_ATLAS_SDK_ARCHITECTURE_v1.0.md`

**Function Specification:** `PHOENIX_ATLAS_SDK_FUNCTION_SPECIFICATION_v1.0.md`

**Implementation:** NOT STARTED

---

# 1. Purpose

This document defines the controlled implementation plan for the Phoenix DevKit Atlas SDK.

The plan translates the reviewed Atlas SDK Architecture, Function Specification and formally frozen contracts into an ordered implementation sequence.

It does not redefine Atlas intelligence semantics.

It does not redefine the frozen Atlas SDK contracts.

It does not authorize implementation until the complete pre-implementation gate has passed.

---

# 2. Governing Principle

> **Atlas owns intelligence. DevKit owns the integration mechanism.**

The Atlas SDK consumes certified Atlas contracts.

It must not become a second Atlas intelligence authority.

Implementation decisions must preserve this ownership boundary.

---

# 3. Upstream Authorities

Implementation is governed by:

```text
PHOENIX_ATLAS_SDK_ARCHITECTURE_v1.0.md

PHOENIX_ATLAS_SDK_FUNCTION_SPECIFICATION_v1.0.md
```

The following Atlas SDK v1.0 contracts are formally frozen:

```text
Public API                     FROZEN

Return Status Mapping          FROZEN

Source Requirement Matrix      FROZEN

Canonical Serialization        FROZEN
```

Implementation must conform to these contracts.

Implementation must not silently reinterpret, extend or weaken them.

---

# 4. Pre-Implementation Review State

The implementation plan is prepared after completion of:

```text
Architecture Review                PASS

Function Specification Review      PASS

Cross-Contract Consistency         PASS

Security Review                    PASS

Dependency Review                  PASS
```

The implementation itself remains:

```text
NOT STARTED
```

until this plan is reviewed and approved and the final pre-implementation gate passes.

---

# 5. Scope

Atlas SDK v1.0 implementation includes:

```text
canonical Atlas source resolution

safe read-only loading

canonical source validation

structural normalization

canonical serialization

provider lookup

provider listing

marketplace surface lookup

marketplace surface listing

lifecycle intelligence lookup

access intelligence lookup

Provider Card composition

public Atlas SDK API composition

security verification

dependency-boundary verification

frozen-contract regression

DevKit regression

documentation and certification preparation
```

---

# 6. Non-Scope

Atlas SDK v1.0 implementation does not include:

```text
Provider Planner

Search State

STOP / EXPAND logic

Entity Resolution

Evidence Fusion

Decision Intelligence

provider ranking

recommendation logic

marketplace scraping

live provider execution

network retrieval

remote Atlas refresh

Atlas canonical-data mutation

Plugin System implementation

PASS 3B runtime integration
```

Any addition to this scope requires explicit architecture and specification review.

---

# 7. Dependency Direction

The implementation must preserve:

```text
DEVKIT CONSUMER
        ↓
ATLAS SDK
        ↓
CERTIFIED ATLAS ASSETS
```

The following dependency directions are forbidden:

```text
CORE → ATLAS SDK

ATLAS SDK → CLI

ATLAS SDK → PLUGIN SYSTEM

ATLAS SDK → unrelated private DevKit internals

CONSUMER → _phoenix::atlas_* private helpers
```

Public consumers must use:

```text
phoenix::atlas_*
```

Private implementation helpers use:

```text
_phoenix::atlas_*
```

Private helpers are not public contracts.

---

# 8. Security Boundary

Atlas canonical content is:

```text
DATA
```

and never:

```text
CODE
```

Implementation must not:

```text
use eval

execute Atlas-derived shell syntax

construct commands from Atlas content

source Atlas canonical data as shell code

use data-driven function dispatch

perform uncontrolled recursive filesystem discovery

accept unauthorized canonical-source paths

perform network retrieval

mutate canonical Atlas sources
```

All canonical access remains read-only.

---

# 9. Canonical Source Boundary

Atlas SDK v1.0 recognizes the frozen canonical source identifiers:

```text
TRACKER

FINAL_MASTER

FINAL_RECONCILIATION

STRATEGIC_SYNTHESIS

PASS_2_ARCHITECTURE

PASS_3A_SPECIFICATION
```

The implementation must preserve the frozen classifications:

```text
REQUIRED

OPTIONAL

CONTEXT_ONLY

NOT_USED
```

No source may be promoted implicitly from optional or context-only status into a required runtime dependency.

PASS 3B remains outside the Atlas SDK v1.0 runtime Source Requirement Matrix.

---

# 10. Physical Implementation Baseline

The initial implementation baseline is:

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

This plan approves this layout as the initial Atlas SDK v1.0 implementation baseline.

Implementation may introduce test files under the existing DevKit test domain.

Any material change to module responsibility or public contract requires review before adoption.

---

# 11. Module Responsibilities

## 11.1 atlas.sh

Primary responsibilities:

```text
public API composition

initialization orchestration

availability orchestration

validation orchestration

public/private boundary
```

It must not become a monolithic implementation module.

---

## 11.2 loader.sh

Primary responsibilities:

```text
canonical root resolution

canonical source-path resolution

source availability checks

source readability checks

safe read-only loading

source metadata preparation
```

It must not interpret Atlas intelligence semantics beyond what is required for controlled loading and structural validation.

---

## 11.3 normalization.sh

Primary responsibilities:

```text
structural normalization

canonical key handling

canonical field ordering

canonical record ordering

canonical escaping

canonical serialization
```

Normalization must not reinterpret Atlas intelligence semantics.

---

## 11.4 query.sh

Primary responsibilities:

```text
provider lookup

provider listing

marketplace surface lookup

marketplace surface listing

lifecycle lookup

access lookup
```

Query behavior must preserve the frozen Source Requirement Matrix and Return Status Mapping.

---

## 11.5 provider_card.sh

Primary responsibilities:

```text
Provider Card composition

canonical field projection

source traceability preservation

optional enrichment composition
```

Provider Cards remain intelligence projections.

They are not decision or recommendation objects.

---

# 12. Public API Baseline

Implementation must expose exactly the frozen Atlas SDK v1.0 public API:

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

No additional public `phoenix::atlas_*` function may be introduced during implementation without explicit contract revision.

---

# 13. Return Status Baseline

Implementation must preserve:

```text
0   SUCCESS

1   PREDICATE_FALSE / UNAVAILABLE

2   INVALID_ARGUMENT

3   NOT_FOUND

4   SOURCE_MISSING

5   SOURCE_UNREADABLE

6   INVALID_CANONICAL_DATA

7   UNSUPPORTED_VERSION

8   INTERNAL_FAILURE
```

Status `1` remains restricted to the documented predicate contract.

Failure classes must not be collapsed for implementation convenience.

---

# 14. Implementation Sequence

Implementation is divided into sixteen controlled tranches.

Each tranche must satisfy its exit criteria before dependent work proceeds.

---

# 15. IP-01 — Domain Skeleton and Documentation

Create the Atlas SDK implementation domain.

Expected baseline:

```text
10_ATLAS_SDK/

README.md

atlas.sh

loader.sh

normalization.sh

query.sh

provider_card.sh
```

## Entry Criteria

```text
Implementation Plan APPROVED

Pre-Implementation Gate PASS
```

## Work

```text
create physical module structure

create canonical README

establish module headers

establish sourcing direction

establish namespace conventions
```

## Exit Criteria

```text
structure exists

README documents purpose and boundaries

no runtime behavior implemented prematurely

no public contract deviation

DevKit structural validation PASS
```

---

# 16. IP-02 — Canonical Root and Source Resolution

Implement deterministic canonical source resolution.

## Work

```text
resolve repository-relative canonical Atlas root

resolve authorized source identifiers

reject unauthorized paths

reject traversal

avoid caller-PWD dependence

avoid recursive discovery
```

## Exit Criteria

```text
deterministic root resolution

authorized source mapping only

path traversal tests PASS

arbitrary-path rejection PASS

missing-source classification PASS
```

---

# 17. IP-03 — Safe Source Loading

Implement controlled read-only source loading.

## Work

```text
availability checks

readability checks

safe file reads

source metadata preparation

required / optional distinction
```

## Exit Criteria

```text
no canonical mutation

SOURCE_MISSING behavior PASS

SOURCE_UNREADABLE behavior PASS

optional-source absence behavior PASS

read-only tests PASS
```

---

# 18. IP-04 — Canonical Source Validation

Implement canonical structural validation.

## Work

```text
source identity validation

supported-version validation

required structural-field validation

invalid canonical-data detection

capability-local validation
```

## Exit Criteria

```text
INVALID_CANONICAL_DATA behavior PASS

UNSUPPORTED_VERSION behavior PASS

fail-fast behavior PASS

no partial successful output
```

---

# 19. IP-05 — Structural Normalization

Implement deterministic structural normalization.

## Work

```text
canonical keys

canonical values

field normalization

record normalization

deterministic ordering

traceability preservation
```

## Exit Criteria

```text
normalization deterministic

semantic reinterpretation absent

source traceability preserved

normalization tests PASS
```

---

# 20. IP-06 — Canonical Serialization

Implement the frozen Canonical Serialization contract.

## Work

```text
KEY=VALUE serialization

canonical key ordering

record ordering

newline escaping

CR escaping

TAB escaping

backslash escaping

equals-sign handling

stdout discipline
```

## Exit Criteria

```text
serialization contract PASS

escaping tests PASS

ordering tests PASS

empty-listing behavior PASS

partial-output prohibition PASS

shell-inert value tests PASS
```

---

# 21. IP-07 — Provider Query Layer

Implement:

```text
phoenix::atlas_provider_get

phoenix::atlas_provider_list
```

Minimum runtime source baseline:

```text
TRACKER
```

## Exit Criteria

```text
provider lookup PASS

provider NOT_FOUND PASS

provider listing PASS

tracker ordering PASS

optional enrichment isolation PASS
```

---

# 22. IP-08 — Marketplace Surface Layer

Implement:

```text
phoenix::atlas_surface_get

phoenix::atlas_surface_list
```

Required runtime baseline:

```text
TRACKER

FINAL_MASTER
```

The implementation must preserve:

```text
Provider Family ≠ Marketplace Surface
```

## Exit Criteria

```text
surface lookup PASS

surface listing PASS

surface identity preserved

required-source failure behavior PASS
```

---

# 23. IP-09 — Lifecycle and Access Layer

Implement:

```text
phoenix::atlas_lifecycle_get

phoenix::atlas_access_get
```

The implementation must preserve:

```text
Technical Availability ≠ Authorized Access

Provider Existence ≠ Executable Access
```

## Exit Criteria

```text
lifecycle lookup PASS

access lookup PASS

UNKNOWN semantics PASS

UNAVAILABLE semantics PASS

source failure not converted into successful UNAVAILABLE
```

---

# 24. IP-10 — Provider Card Composition

Implement:

```text
phoenix::atlas_provider_card
```

Provider Cards must preserve:

```text
provider identity

marketplace identity

Atlas status

canonical source traceability
```

where canonically available.

## Exit Criteria

```text
Provider Card composition PASS

deterministic field ordering PASS

traceability PASS

optional enrichment isolation PASS

no ranking logic

no recommendation logic
```

---

# 25. IP-11 — Public API Composition

Complete:

```text
phoenix::atlas_initialize

phoenix::atlas_is_available

phoenix::atlas_validate
```

and integrate all ten frozen public functions through the public Atlas SDK module.

## Exit Criteria

```text
exactly 10 public functions

private helpers remain private

initialization baseline PASS

availability predicate PASS

validation PASS

return-status mapping PASS

public API contract regression PASS
```

---

# 26. IP-12 — Security Verification

Execute the implementation-level security suite.

Required verification includes:

```text
no eval

no bash -c / sh -c execution path

no Atlas data sourcing

no data-driven command execution

path traversal rejection

arbitrary source-path rejection

canonical source immutability

shell-inert serialized values

no network retrieval

no partial successful output on failure
```

## Exit Criteria

```text
Security Tests PASS

Security Review Implementation Check PASS
```

---

# 27. IP-13 — Dependency Boundary Verification

Verify:

```text
Core does not depend on Atlas SDK

Atlas SDK does not depend on CLI

Atlas SDK does not depend on Plugin System

Atlas SDK does not depend on unrelated private DevKit internals

consumers do not call private Atlas helpers
```

## Exit Criteria

```text
Dependency Tests PASS

Dependency Direction PASS
```

---

# 28. IP-14 — Frozen Contract Regression

Regression must prove implementation compliance with:

```text
Public API

Return Status Mapping

Source Requirement Matrix

Canonical Serialization
```

No frozen contract may be modified merely to make implementation tests pass.

If implementation reveals a genuine contract defect:

```text
STOP IMPLEMENTATION

OPEN CONTRACT REVIEW

DO NOT PATCH AROUND THE CONTRACT
```

## Exit Criteria

```text
Public API Regression PASS

Return Status Regression PASS

Source Matrix Regression PASS

Serialization Regression PASS
```

---

# 29. IP-15 — Full DevKit Regression

Run the complete DevKit regression suite.

Atlas SDK integration must not regress:

```text
Core

Template Engine

Generator Layer

Validation Framework

CLI
```

## Exit Criteria

```text
Atlas SDK tests PASS

existing DevKit tests PASS

full regression PASS

working tree reviewed
```

---

# 30. IP-16 — Documentation and Certification Preparation

Complete implementation documentation and certification evidence.

Required work includes:

```text
Atlas SDK README finalization

usage examples

limitations

public API examples

failure examples

source-requirement documentation

security notes

dependency notes

test evidence

Master Record update

final architecture consistency review

final function-specification consistency review
```

## Exit Criteria

```text
documentation complete

implementation evidence complete

Master Record ready

Final Technical Audit ready

Final Certification ready
```

---

# 31. Test Strategy

Testing must be introduced incrementally.

Tests must not be deferred until the end of implementation.

Each implementation tranche must include the tests necessary to prove its own exit criteria.

The final suite must include:

```text
unit tests

contract tests

negative tests

security tests

dependency tests

determinism tests

serialization tests

source-failure tests

full regression
```

---

# 32. Fail-Fast Implementation Policy

Any tranche must stop if:

```text
a frozen contract is contradicted

a required source semantic is ambiguous

a security boundary cannot be preserved

dependency direction would be violated

canonical serialization cannot be preserved

return-status semantics cannot be preserved

Atlas semantics would need reinterpretation
```

Implementation must not hide architectural defects behind compatibility code.

---

# 33. Change-Control Policy

The following are frozen and cannot be changed by ordinary implementation work:

```text
Public API

Return Status Mapping

Source Requirement Matrix

Canonical Serialization
```

A proposed incompatible change requires:

```text
explicit issue identification

architecture review

function-specification review

contract revision decision

regression impact review
```

Implementation convenience is not sufficient justification for contract revision.

---

# 34. Commit Strategy

Implementation should use bounded checkpoints.

Recommended checkpoint classes:

```text
structure

loader / source resolution

normalization / serialization

query capabilities

Provider Card

public API

security / dependency validation

full regression

certification
```

Each checkpoint must remain reviewable and internally coherent.

---

# 35. Documentation Policy

Documentation is part of implementation.

Every implemented capability must document:

```text
purpose

usage

inputs

outputs

return statuses

source requirements

limitations

examples
```

Documentation debt must not be deferred to final certification.

---

# 36. Master Record Policy

The Master Record must not claim Atlas SDK implementation completion before implementation and regression evidence exist.

Phase 8 certification requires an explicit final Master Record update after technical certification.

---

# 37. Implementation Completion Criteria

Atlas SDK implementation is complete only when:

```text
physical implementation complete

10 public APIs implemented

all required private primitives implemented

source resolution verified

source loading verified

validation verified

normalization verified

serialization verified

provider queries verified

surface queries verified

lifecycle verified

access verified

Provider Card verified

security tests PASS

dependency tests PASS

frozen-contract regression PASS

full DevKit regression PASS

documentation complete
```

Implementation completion does not by itself imply Phase 8 certification.

---

# 38. Final Certification Boundary

After implementation completion, Phase 8 still requires:

```text
Final Technical Audit

Architecture Conformance Review

Function Specification Conformance Review

Frozen Contract Conformance Review

Security Certification

Dependency Certification

Regression Certification

Documentation Review

Master Record Update

Git Checkpoint

Final Phase Certification
```

Until these gates pass:

```text
PHOENIX DEVKIT PHASE 8 ≠ CERTIFIED COMPLETE
```

---

# 39. Implementation Plan Approval Criteria

This Implementation Plan may be approved when:

```text
Scope                              REVIEWED

Non-Scope                          REVIEWED

Physical Baseline                  REVIEWED

Module Responsibilities            REVIEWED

Implementation Sequence            REVIEWED

Entry / Exit Criteria              REVIEWED

Security Integration               REVIEWED

Dependency Integration             REVIEWED

Frozen Contract Traceability       REVIEWED

Testing Strategy                   REVIEWED

Change Control                     REVIEWED

Certification Boundary             REVIEWED
```

---

# 40. Current State

```text
PHOENIX DEVKIT — PHASE 8
ATLAS SDK IMPLEMENTATION PLAN

Architecture Review                 PASS

Function Specification Review       PASS

Public API                          FROZEN

Return Status Mapping               FROZEN

Source Requirement Matrix           FROZEN

Canonical Serialization             FROZEN

Cross-Contract Consistency          PASS

Security Review                     PASS

Dependency Review                   PASS

Implementation Plan                 APPROVED

Implementation                      NOT STARTED

Final Certification                 NOT STARTED
```

---

# Final Implementation Principle

> **Implement the frozen contract; do not redesign it during implementation.**

And:

> **If implementation contradicts a frozen contract, stop and review the contract rather than silently changing its meaning.**

---

**PHOENIX ATLAS SDK IMPLEMENTATION PLAN v1.0 — APPROVED**