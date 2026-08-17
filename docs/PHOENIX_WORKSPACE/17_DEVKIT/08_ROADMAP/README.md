# Phoenix DevKit — Roadmap

This directory contains the Phoenix DevKit development roadmap and phase planning documentation.

## Purpose

The Roadmap domain records the planned evolution of the Phoenix DevKit while preserving a clear distinction between:

- certified capabilities;
- active development;
- planned work;
- future architectural candidates.

The roadmap provides direction without redefining certified architecture or implementation contracts.

## Responsibilities

The Roadmap domain is responsible for:

- identifying development phases;
- recording major implementation sequences;
- tracking certification boundaries;
- identifying candidate future capabilities;
- preserving the intended order of DevKit evolution.

## Current Development State

The Phoenix DevKit has completed certified work across:

- Core;
- Template Engine;
- Generator Framework;
- Validation Framework components.

The Validation Framework is currently undergoing final integrated certification.

## Next Development Boundary

The next planned development phase is:

PHASE 7 — CLI

CLI implementation must begin only after final certification of the Validation Framework.

## Future Domains

Additional domains, including the Plugin and Extension Model, remain future work.

Their architecture and implementation contracts must be defined before development begins.

## Roadmap Policy

A roadmap entry represents planned direction, not certified functionality.

Only completed and verified work may be described as CERTIFIED.

Changes to roadmap priorities must not silently modify existing architectural contracts.

## Relationship to the Master Record

The Roadmap describes future development direction.

The Phoenix Master Record preserves authoritative project state, strategic decisions, completed checkpoints, and certification history.

These responsibilities must remain distinct.

## Limitations

This directory does not contain production implementation code.

Roadmap documents do not supersede canonical architecture, function specifications, ADRs, tests, or certification records.
