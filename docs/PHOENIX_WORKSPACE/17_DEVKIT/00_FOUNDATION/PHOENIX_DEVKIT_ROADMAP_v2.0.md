# PHOENIX DEVKIT ROADMAP

## Version 2.0

**Status:** CURRENT FORWARD-PLANNING AUTHORITY
**Scope:** Phoenix DevKit evolution
**Historical Baseline:** `PHOENIX_DEVKIT_ROADMAP_v1.0.md`

---

# 1. Purpose

This document defines the current forward evolution roadmap of the Phoenix DevKit.

Phoenix DevKit is an engineering framework designed to standardize, automate, validate and safeguard the construction and evolution of Phoenix software systems.

Roadmap v2.0 exists because the real certified evolution of the DevKit diverged from the planning sequence originally described in Roadmap v1.0.

This document reconciles the forward roadmap with the certified engineering history without rewriting that history.

Roadmap v2.0 governs future planning.

It does not retroactively redefine completed work.

---

# 2. Authority and Status

This document is the current forward-planning authority for Phoenix DevKit evolution.

Its authority is limited to roadmap planning.

A roadmap entry does not by itself:

- authorize implementation;
- freeze an architecture;
- create a public API;
- redefine an existing domain contract;
- certify a component;
- authorize a release;
- authorize a deployment;
- supersede evidence recorded in the Phoenix Master Record.

Implementation authority must always be granted explicitly through the applicable engineering workflow.

The Master Record remains the historical evidence source for completed engineering and certification checkpoints.

Architecture specifications remain authoritative for the semantics and boundaries of their respective domains.

---

# 3. Relationship with Roadmap v1.0

`PHOENIX_DEVKIT_ROADMAP_v1.0.md` is preserved as the historical planning baseline of the DevKit.

Roadmap v1.0 recorded the original intended evolution sequence.

Subsequent engineering work evolved differently as architecture, implementation, testing and certification produced new evidence and priorities.

Roadmap v2.0 therefore supersedes Roadmap v1.0 only for current and future planning.

Roadmap v2.0 does not:

- rewrite Roadmap v1.0;
- invalidate Roadmap v1.0;
- alter historical certification records;
- retroactively renumber completed work;
- convert original plans into historical facts.

Historical planning remains historical planning.

Certified engineering history remains certified engineering history.

---

# 4. Historical Foundation Era

The early DevKit established the foundations required by all later certified layers.

This era includes work related to:

- DevKit Foundation;
- Charter;
- Engineering Principles;
- Coding Standards;
- Core Runtime;
- filesystem utilities;
- logging;
- string utilities;
- Template Engine;
- early CLI concepts;
- module architecture;
- dependency rules;
- testing discipline;
- documentation discipline.

Roadmap v1.0 contains the original phase numbering associated with this period.

Roadmap v2.0 intentionally does not reconstruct or reinterpret uncertain early phase numbering as a new certified lineage.

The original historical numbering remains preserved in Roadmap v1.0 and in the Master Record.

---

# 5. Certified Evolution Lineage

From Phase 5 onward, the repository contains sufficient engineering and certification evidence to establish a clear operational lineage.

## Phase 5 — Generator Framework

**Status:** COMPLETE

The Generator Framework established deterministic artifact-generation capabilities and the supporting Generator Registry, planning and execution model.

Its responsibilities remain owned by the Generator domain.

---

## Phase 6 — Validation Framework

**Status:** CERTIFIED COMPLETE

The Validation Framework established certified validation capabilities covering structural, naming, documentation, dependency and engineering-standard checks.

Validation semantics remain owned by the Validation Framework.

---

## Phase 7 — CLI

**Status:** CERTIFIED COMPLETE

The CLI established the controlled command-line surface through which certified DevKit capabilities can be exposed.

The CLI is an interface and dispatch layer.

It does not acquire the semantic authority of the lower layers it invokes.

---

## Phase 8 — Atlas SDK

**Status:** CERTIFIED COMPLETE
**Remote Closure:** COMPLETE

The Atlas SDK established the certified integration contract between Phoenix DevKit and Phoenix Atlas capabilities.

Atlas semantics remain owned by the Atlas contract.

Consumers must use certified Atlas public interfaces and preserve Atlas dependency boundaries.

---

## Phase 9 — Plugin / Extension Model

**Status:** CERTIFIED COMPLETE
**Remote Closure:** COMPLETE

The Plugin / Extension Model established controlled extension and contribution mechanisms for certified Phoenix capabilities.

The Plugin layer does not invent lower-layer capabilities.

Capability authority remains with the domain that owns the capability.

Certified Phase 9 boundaries must be preserved by all future DevKit evolution.

---

# 6. Current Platform State

Phoenix DevKit has evolved beyond its initial foundation stage.

The current platform contains established engineering capabilities including:

- Core Runtime;
- Template Engine;
- Generator Framework;
- Validation Framework;
- CLI;
- Atlas SDK;
- Plugin / Extension Model;
- documentation governance;
- testing and regression discipline;
- certified public interfaces;
- explicit dependency boundaries.

The next evolution must not duplicate these capabilities.

The next evolution must coordinate them.

The architectural transition is therefore:

```text
CERTIFIED CAPABILITIES
        ↓
CONTROLLED ORCHESTRATION
        ↓
REPEATABLE ENGINEERING WORKFLOWS
```

---

# 7. Forward Evolution Principles

All future DevKit evolution must preserve the existing engineering principles and certified contracts.

The following rules are mandatory.

## 7.1 Architecture Before Implementation

Every significant new DevKit capability must be architecturally defined before implementation.

## 7.2 Safety Before Automation

Automation must never compromise project integrity.

Automation must fail safely when required authority, evidence, dependencies or contracts are unavailable.

## 7.3 Determinism Before Convenience

Equivalent inputs and equivalent certified state must produce predictable behavior.

Convenience must not introduce hidden inference or uncontrolled behavior.

## 7.4 Preserve Certified Contracts

Higher layers may consume certified lower-layer public interfaces.

They must not bypass, redefine or silently replace lower-layer authority.

## 7.5 Explicit Authority

Every significant capability must have an identifiable authority owner.

Orchestration does not transfer semantic ownership.

## 7.6 No Silent Discovery

Future orchestration must not depend on uncontrolled filesystem discovery, dynamically constructed function names or hidden execution paths where certified explicit mechanisms exist.

## 7.7 Fail Fast

Missing mandatory requirements must surface before destructive or inconsistent execution occurs.

## 7.8 Documentation Is Part of Development

Architecture, behavior, limitations and usage must evolve with implementation.

## 7.9 Validation Is Mandatory

New capabilities must provide evidence appropriate to their scope before certification.

## 7.10 Roadmap Mention Is Not Authorization

The presence of a capability or phase in this roadmap does not authorize its implementation.

Explicit phase and implementation authorization remain required.

---

# 8. Phase 10 — Automation Layer

## Status

**DESIGN CANDIDATE — NOT YET AUTHORIZED FOR IMPLEMENTATION**

## Mission

Transform certified DevKit capabilities into safe, deterministic and repeatable engineering workflows.

The Automation Layer exists to reduce repetitive manual engineering operations without weakening architecture, validation, evidence or authority boundaries.

Its central principle is:

> **Automation orchestrates authority. Automation does not become authority.**

---

## 8.1 Automation Responsibilities

The Automation Layer may coordinate certified public capabilities belonging to other DevKit domains.

Potential responsibilities include:

- engineering workflow orchestration;
- certification workflow coordination;
- workspace workflow automation;
- backup and recovery coordination;
- controlled execution sequencing;
- precondition verification;
- failure propagation;
- evidence collection coordination;
- CLI-accessible automation workflows;
- future coordination with release capabilities through explicit contracts.

Automation must operate through certified or explicitly authorized interfaces.

---

## 8.2 Automation Non-Authority Boundary

The Automation Layer must not own or redefine:

- Core semantics;
- Template Engine semantics;
- Generator semantics;
- Validator semantics;
- Atlas semantics;
- Plugin semantics;
- CLI semantic authority;
- Release Engine semantics;
- operational deployment authority;
- PDS process authority;
- application business logic;
- product authority.

When Automation invokes another domain, semantic authority remains with that domain.

---

## 8.3 Candidate Phase 10 Workstreams

The current Phase 10 design candidate consists of:

### A01 — Automation Architecture

Define the Automation Layer architecture, dependency direction, ownership and security boundaries.

### A02 — Automation Function Specification

Define public interfaces, private helpers, inputs, outputs, failure semantics and compatibility contracts.

### A03 — Workflow Model

Define deterministic workflow representation, sequencing, state transitions and execution rules.

### A04 — Certification Automation

Investigate safe automation of certification mechanics while preserving independent certification authority.

Automation may collect, execute or organize evidence.

Automation must not self-certify.

### A05 — Workspace Automation

Define safe repeatable workflows for workspace operations through existing certified capabilities.

### A06 — Backup / Recovery Coordination

Define coordination of backup and recovery workflows without silently acquiring storage, recovery or operational authority.

### A07 — Release Coordination Boundary

Define the interface boundary between Automation and future Release capabilities.

This workstream does not implement or redefine the Release Engine.

### A08 — CLI Integration

Expose authorized Automation capabilities through the certified CLI architecture without bypassing existing CLI security and dispatch rules.

### A09 — Automation Tests

Provide targeted, failure-path, security, deterministic and regression coverage for the Automation Layer.

### A10 — Final Certification

Perform final technical audit, architecture verification, regression verification, documentation review and controlled certification.

---

# 9. Release Engine Boundary

The Release Engine is a separate DevKit architectural concern.

The DevKit Charter and historical roadmap contain explicit Release Engine and `phoenix release` concepts.

However, the detailed canonical Release Engine contract is not frozen by this roadmap.

Therefore:

```text
Release Engine             SEPARATE ARCHITECTURAL DOMAIN
Detailed Release Contract  NOT YET FROZEN
Automation Relationship    TO BE DEFINED
```

The Automation Layer must not assume Release Engine authority.

Automation may coordinate with future Release capabilities only through an explicit certified or otherwise formally authorized contract.

Engineering certification, Git remote closure, release and deployment must remain distinguishable states.

A component may legitimately be:

```text
CERTIFIED — NOT RELEASED
```

or:

```text
CERTIFIED — NOT DEPLOYED
```

Remote repository synchronization does not itself constitute a software release or deployment.

---

# 10. PDS Boundary

Phoenix Development System and Phoenix DevKit Automation address different concerns.

The intended boundary is:

```text
PDS
Engineering process discipline and governance

Automation Layer
Technical orchestration of authorized engineering mechanics
```

Therefore:

```text
PDS != Automation Layer
```

PDS may define or require engineering process states, evidence and gates.

Automation may execute or coordinate authorized technical mechanics supporting those requirements.

Automation must not decide that a PDS gate has passed merely because an automated operation completed successfully.

PDS must not redefine the semantic contracts of DevKit domains.

The detailed PDS contract remains governed by its own architecture and review process.

---

# 11. Future Evolution Domains

The following areas remain possible future evolution candidates:

- Release Engine;
- advanced documentation automation;
- workspace orchestration;
- provider development automation;
- extension distribution;
- marketplace integration tooling;
- advanced CLI evolution;
- engineering intelligence;
- additional certified integration layers.

These are candidates only.

They are not automatically authorized phases.

No future phase number is assigned by this section.

A future candidate becomes a roadmap phase only after sufficient evidence, scope definition and explicit authorization.

---

# 12. Phase Entry and Certification Rules

A future DevKit phase may become active only when:

1. its objective is explicit;
2. its authority owner is known or explicitly established;
3. its scope is bounded;
4. dependencies are identified;
5. relevant certified contracts are identified;
6. required predecessor work is complete;
7. architecture work is explicitly authorized.

Implementation requires an additional explicit implementation authorization after the required architecture or contract freeze.

Certification requires affirmative evidence appropriate to the scope.

No assumption, confidence level, repeated statement or AI consensus constitutes certification evidence.

A failed or blocked mandatory gate must not be silently bypassed.

Where a stage is legitimately not applicable, the omission must be explicit and justified according to the applicable governance process.

---

# 13. Roadmap Governance

This roadmap may evolve as Phoenix DevKit evolves.

Future revisions must preserve:

- historical traceability;
- certified engineering records;
- domain authority boundaries;
- compatibility contracts;
- dependency direction;
- explicit implementation authorization;
- explicit certification state.

A roadmap revision must never silently rewrite completed engineering history.

When planned evolution diverges from actual certified evolution, the correct response is to preserve the historical roadmap and create a new controlled roadmap revision.

---

# 14. Supersession Statement

`PHOENIX_DEVKIT_ROADMAP_v2.0.md` supersedes `PHOENIX_DEVKIT_ROADMAP_v1.0.md` for current and future DevKit planning.

`PHOENIX_DEVKIT_ROADMAP_v1.0.md` remains preserved as historical evidence of the original DevKit evolution plan.

Roadmap v2.0 does not supersede:

- the Phoenix DevKit Charter;
- Engineering Principles;
- Coding Standards;
- certified architecture specifications;
- certified function specifications;
- the Phoenix Master Record;
- domain-specific authority contracts.

Where a conflict exists between roadmap planning and an applicable certified domain contract, the certified domain contract governs domain semantics.

---

# Current Forward State

```text
HISTORICAL FOUNDATION ERA               PRESERVED

PHASE 5 — GENERATOR FRAMEWORK            COMPLETE
PHASE 6 — VALIDATION FRAMEWORK           CERTIFIED COMPLETE
PHASE 7 — CLI                            CERTIFIED COMPLETE
PHASE 8 — ATLAS SDK                      CERTIFIED COMPLETE
PHASE 8 — REMOTE CLOSURE                 COMPLETE
PHASE 9 — PLUGIN / EXTENSION MODEL       CERTIFIED COMPLETE
PHASE 9 — REMOTE CLOSURE                 COMPLETE

PHASE 10 — AUTOMATION LAYER              DESIGN CANDIDATE
PHASE 10 IMPLEMENTATION                  NOT AUTHORIZED

RELEASE ENGINE DETAILED CONTRACT         NOT YET FROZEN
PDS DETAILED CONTRACT                    EXTERNAL TO THIS ROADMAP

ROADMAP v1.0                             HISTORICAL BASELINE
ROADMAP v2.0                             CURRENT FORWARD-PLANNING AUTHORITY
```

---

> **Build the system that builds the project.**