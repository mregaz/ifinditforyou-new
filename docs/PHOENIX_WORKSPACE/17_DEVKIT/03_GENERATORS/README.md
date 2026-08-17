# Phoenix DevKit — Generators

This directory contains the Phoenix DevKit Generator Framework.

## Purpose

The Generator Framework provides deterministic, controlled artifact generation based on explicit generator definitions, templates, validated request data, and filesystem-safe execution.

It transforms declarative generator contracts into reproducible Phoenix artifacts.

## Architecture

The Generator Framework is composed of:

- Registry
- Planning Engine
- Execution Engine
- Built-in Generator Loader
- Generator Definitions
- Generator Templates

The canonical architecture and function contracts are defined in:

01_ARCHITECTURE/PHOENIX_GENERATOR_LAYER_ARCHITECTURE_v1.0.md

01_ARCHITECTURE/PHOENIX_GENERATOR_LAYER_FUNCTION_SPECIFICATION_v1.0.md

## Built-in Generators

The current certified built-in generators are:

- provider
- adr
- sprint
- documentation
- template

## Responsibilities

The Generator Framework is responsible for:

- explicit generator registration;
- deterministic definition resolution;
- request validation;
- planning artifact creation;
- template rendering;
- safe artifact mapping;
- controlled filesystem execution;
- overwrite policy enforcement;
- dry-run support;
- deterministic output ordering.

## Dependencies

Generator modules depend only on lower-level Phoenix services such as:

- Filesystem
- Template Engine
- Generator Registry
- Generator Planning

Dependencies must follow the Phoenix downward dependency model.

## Usage

Higher-level tools should invoke the Generator Framework through its public APIs rather than bypassing planning or execution contracts.

Generated artifacts must always pass through validated definitions, deterministic planning, and controlled execution.

## Safety

The Generator Framework must prevent:

- unsafe path traversal;
- absolute artifact mappings where forbidden;
- uncontrolled overwrites;
- duplicate reserved options;
- dynamic execution of untrusted generator data.

## Limitations

This directory does not define Validation Framework policy, CLI command parsing, Plugin behavior, or release certification.

Those concerns belong to separate Phoenix DevKit layers.
