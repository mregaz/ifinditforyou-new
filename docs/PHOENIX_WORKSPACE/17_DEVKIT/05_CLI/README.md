# Phoenix DevKit — CLI

This directory is reserved for the Phoenix DevKit Command-Line Interface.

## Status

ARCHITECTURE AND FUNCTION SPECIFICATION FROZEN — IMPLEMENTATION NOT YET STARTED

CLI development begins after final certification of the Validation Framework.

## Purpose

The CLI will provide the user-facing command interface to certified Phoenix DevKit capabilities.

It will expose controlled access to lower-level services without duplicating their business logic.

## Planned Responsibilities

The CLI domain is expected to define:

- command contracts;
- argument parsing;
- command dispatch;
- exit-code behavior;
- error presentation;
- user-facing help;
- integration with certified DevKit subsystems.

## Architectural Boundary

The CLI is an orchestration and presentation layer.

It must not reimplement logic belonging to:

- Core;
- Template Engine;
- Generator Framework;
- Validation Framework.

CLI commands must delegate operations to the appropriate public Phoenix APIs.

## Dependencies

Dependencies will be defined and frozen during the CLI architecture phase.

The CLI must depend downward on certified DevKit capabilities and must not introduce reverse dependencies into lower-level layers.

## Safety

CLI input must be treated as untrusted input.

Command parsing and dispatch must not introduce uncontrolled command execution, path traversal, unsafe filesystem mutation, or dynamic evaluation.

## Implementation

No production CLI implementation is certified at this checkpoint.

The canonical CLI architecture, command model, and function contracts are frozen.

Production CLI implementation has not yet started.

## Next Phase

PHASE 7 — CLI

Implementation must not begin until the preceding Validation Framework final certification has been completed.
## Frozen Contracts

The canonical Phase 7 CLI contracts are:

- `01_ARCHITECTURE/PHOENIX_CLI_ARCHITECTURE_v1.0.md`
- `01_ARCHITECTURE/PHOENIX_CLI_FUNCTION_SPECIFICATION_v1.0.md`

Implementation must conform to these frozen contracts.

Any incompatible change requires an explicit architecture/specification revision.