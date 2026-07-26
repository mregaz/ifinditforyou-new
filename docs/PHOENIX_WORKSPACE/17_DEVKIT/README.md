# Phoenix DevKit

> **Build the system that builds the project.**

---

| Field | Value |
|---|---|
| Project | Phoenix DevKit |
| Status | Foundation |
| Version | 0.1 |
| Type | Engineering Framework |
| First Reference Project | iFindItForYou |

---

## 1. Overview

Phoenix DevKit is an engineering framework designed to standardize, automate, document, validate, and evolve professional software projects.

It transforms recurring engineering activities into reusable systems based on:

- conventions;
- templates;
- generators;
- validators;
- shared libraries;
- governance;
- documentation.

Phoenix DevKit is not application business logic.

It is the system used to build and maintain application projects.

---

## 2. Mission

Reduce the time and complexity required to create professional software by providing a repeatable engineering method.

The DevKit helps projects begin with:

- clear architecture;
- consistent documentation;
- standardized workflows;
- automated generation;
- verifiable structures;
- maintainable conventions.

---

## 3. Core Principle

> **Build the system that builds the project.**

The objective is not to automate everything.

The objective is to automate recurring work that benefits from consistency, traceability, and validation.

---

## 4. Phoenix Ecosystem

```text
PHOENIX ECOSYSTEM
│
├── Phoenix DevKit
│   └── Engineering framework and development system
│
└── iFindItForYou
    └── Intelligent multi-marketplace search platform
---
---

# 4. Phoenix Ecosystem

```text
PHOENIX ECOSYSTEM
│
├── Phoenix DevKit
│   └── Engineering framework and development system
│
└── iFindItForYou
    └── Intelligent multi-marketplace search platform
```

Phoenix DevKit defines and automates the engineering method.

iFindItForYou is the first production project used to validate that method.

---

# 5. Current Capabilities

The first certified DevKit tools are:

```text
tools/create_pds.sh
tools/create_provider.sh
tools/create_adr.sh
tools/create_sprint.sh
```

These tools currently provide:

- Phoenix Development System generation
- Provider scaffolding
- ADR creation
- Sprint workspace creation

The next evolution will progressively migrate these generators to a common Core Engine.

---

# 6. Target Architecture

```text
Phoenix CLI
│
├── Generators
├── Validators
├── Migrations
│
└── Core Engine
    ├── Template Engine
    ├── Manifest Parser
    ├── Shared Libraries
    ├── Filesystem
    ├── Logger
    └── Configuration
```

The Core Engine will become the reusable foundation shared by every Phoenix generator, ensuring consistency, maintainability and scalability across the entire engineering ecosystem.
---

# 7. DevKit Documentation Map

```text
17_DEVKIT/
│
├── 00_FOUNDATION/
│   ├── PHOENIX_DEVKIT_CHARTER_v0.1.md
│   ├── PHOENIX_DEVKIT_ARCHITECTURE_v1.0.md
│   └── README.md
│
├── 01_ARCHITECTURE/
├── 02_TEMPLATE_ENGINE/
├── 03_GENERATORS/
├── 04_VALIDATORS/
├── 05_CLI/
├── 06_PLUGINS/
├── 07_TESTS/
├── 08_ROADMAP/
├── 09_REFERENCE/
│
└── README.md
```

---

# 8. Engineering Principles

Phoenix DevKit follows these engineering principles:

1. Method before implementation.
2. Convention over configuration.
3. One source of truth.
4. Templates describe, engines generate.
5. Documentation is part of the software.
6. Every component must be testable.
7. The Core Engine must remain small and stable.
8. Automation must solve real recurring problems.
9. Every module has a single responsibility.
10. Long-term maintainability is more important than short-term speed.

---

# 9. Development Strategy

Phoenix DevKit evolves through four controlled phases.

## Phase 1 — Foundation

- Charter
- Architecture
- Documentation
- Engineering Principles

## Phase 2 — Core Engine

- Shared Libraries
- Template Engine
- Manifest Parser
- Filesystem Utilities
- Logging

## Phase 3 — Generator Migration

- Provider Generator
- ADR Generator
- Sprint Generator
- Release Generator

## Phase 4 — Unified CLI

```bash
phoenix init
phoenix create provider
phoenix create sprint
phoenix create adr
phoenix validate
phoenix release
```
---

# 10. Current Status

Phoenix DevKit is currently in the **Foundation Phase**.

The initial engineering framework has been defined, together with its mission, architecture and documentation structure.

The next milestone is:

```text
Sprint 001
Core Engine
```

The objective of Sprint 001 is to build the reusable engine that will progressively power every Phoenix generator.

---

# 11. Foundation Documents

The Foundation Pack currently includes:

- Phoenix DevKit Charter
- Phoenix DevKit Architecture
- DevKit README

Additional documents will be added as the project evolves.

---

# 12. Governance

Every significant DevKit change should include, where applicable:

- updated documentation;
- Architecture Decision Records (ADR);
- tests;
- validation;
- changelog updates;
- version updates.

No engineering component is considered complete until its purpose, behavior and usage are documented.

---

# 13. Long-Term Vision

Phoenix DevKit aims to evolve from a local engineering toolkit into a reusable development platform.

The long-term goal is to allow a new software project to start with a single command:

```bash
phoenix init my-project
```

That command should generate:

- a complete engineering workspace;
- project documentation;
- architecture templates;
- governance documents;
- validation tools;
- initial project structure.

The generated project should follow Phoenix engineering standards from day one.

---

# Final Statement

Phoenix DevKit is not designed to build applications directly.

It is designed to build the engineering system that enables applications to be created faster, more consistently and with higher quality.

**Build the system that builds the project.**
