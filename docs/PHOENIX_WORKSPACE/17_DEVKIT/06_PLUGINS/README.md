# Phoenix DevKit — Plugins

This directory is reserved for the Phoenix DevKit Plugin and Extension Model.

## Status

PHASE 9 — IMPLEMENTATION COMPLETE / CERTIFICATION PENDING

The Plugin Registry, Plugin Definition Engine, dependency compatibility foundation, contribution coordination, preflight, application, and private bootstrap/orchestration workflow are implemented.

Runtime implementation is complete. Final Phase 9 regression, audit, certification, repository synchronization, and remote closure remain pending.

Final Phase 9 certification and remote closure have not yet occurred.


## Purpose

The Plugin domain provides a controlled extension mechanism for Phoenix DevKit capabilities.

Its purpose is to allow future functionality to be added without weakening the architectural boundaries, deterministic behavior, or security guarantees of the Core DevKit.

## Responsibilities

The Plugin and Extension Model addresses:

- explicit plugin registration;
- extension discovery policy;
- plugin identity and metadata;
- compatibility contracts;
- controlled capability exposure;
- dependency boundaries;
- lifecycle rules;
- failure isolation.

## Architectural Boundary

Plugins must extend Phoenix through explicit contracts.

They must not bypass or replace certified lower-level mechanisms belonging to:

- Core;
- Template Engine;
- Generator Framework;
- Validation Framework;
- CLI orchestration.

The Plugin layer must depend on stable public APIs rather than private implementation details.

## Dependencies

Plugin dependencies are defined by the frozen Plugin / Extension Model contract and must remain explicit, controlled, and compatible with the Phoenix dependency model.


## Safety

The extension mechanism must not introduce uncontrolled:

- code execution;
- filesystem access;
- dependency loading;
- path traversal;
- dynamic evaluation;
- mutation of certified DevKit components.

Security boundaries are defined by the frozen Plugin / Extension Model contract and enforced by the Phase 9 implementation.

## Implementation

Phase 9 runtime implementation is complete, but the Plugin / Extension Model is not yet finally certified at this checkpoint.


Architecture, contracts, implementation, testing, audit, and certification are being handled within Phoenix DevKit Phase 9.


## Limitations

This README defines the current domain boundary only.

The authoritative Plugin architecture and implementation contracts are defined by the frozen Phase 9 specifications.
