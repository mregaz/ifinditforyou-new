# Phoenix Strings Module Architecture

**Version:** 1.0  
**Module:** `core/strings.sh`  
**Status:** Draft  
**Sprint:** 002

---

## Purpose

The Strings module provides a small, predictable, and reusable API for common string operations within the Phoenix DevKit.

The module centralizes string manipulation behavior so that generators, validators, manifests, templates, and CLI components can rely on consistent functions instead of implementing duplicate logic.

---

## Architectural Role

The Strings module belongs to the Phoenix DevKit Core Library.

It provides low-level string utilities and must remain independent from higher-level components.

The module may be used by:

- manifest processing;
- template generation;
- validators;
- CLI commands;
- generators;
- plugin infrastructure.

The module must not depend on:

- generators;
- validators;
- plugins;
- CLI components;
- manifest implementations;
- template engines.

---

## Engineering Principles

The module follows these Phoenix DevKit Engineering Principles:

- Simplicity First
- Single Responsibility
- Predictability over Cleverness
- Composition over Complexity
- Explicit is Better than Implicit
- Trust the Platform
- Test Everything That Matters
# Phoenix Strings Module Architecture

**Version:** 1.0  
**Module:** `core/strings.sh`  
**Status:** Draft  
**Sprint:** 002

---

# Purpose

The Strings module provides a simple, deterministic, and reusable API for string manipulation throughout the Phoenix DevKit.

Its primary objective is to eliminate duplicated string logic across generators, validators, templates, manifests, plugins, and CLI commands.

---

# Architectural Role

The Strings module is part of the Phoenix DevKit Core Library.

It provides low-level string utilities and must remain completely independent from higher-level components.

The module may be used by:

- CLI
- Generators
- Validators
- Template Engine
- Manifest
- Plugins

The module must never depend on those components.

Dependencies always point toward the Core, never away from it.
---

# Public API Design

The Strings module exposes a small and stable public API.

Each function performs one well-defined operation.

## Case Conversion

| Function | Purpose |
|----------|---------|
| phoenix::to_upper | Converts a string to uppercase. |
| phoenix::to_lower | Converts a string to lowercase. |

---

## Whitespace

| Function | Purpose |
|----------|---------|
| phoenix::trim | Removes leading and trailing whitespace. |
| phoenix::trim_left | Removes leading whitespace. |
| phoenix::trim_right | Removes trailing whitespace. |

---

## Search

| Function | Purpose |
|----------|---------|
| phoenix::contains | Checks whether a string contains a substring. |
| phoenix::starts_with | Checks whether a string starts with a prefix. |
| phoenix::ends_with | Checks whether a string ends with a suffix. |

---

## Replacement

| Function | Purpose |
|----------|---------|
| phoenix::replace | Replaces occurrences of a substring. |

---

## Validation

| Function | Purpose |
|----------|---------|
| phoenix::is_empty | Checks whether a string is empty. |
| phoenix::is_blank | Checks whether a string contains only whitespace. |

---

## Formatting

| Function | Purpose |
|----------|---------|
| phoenix::slugify | Generates a filesystem and URL friendly slug. |
---

# API Design Rules

All public functions exposed by the Strings module must follow a consistent behavioral contract.

## Function Naming

Every public function must use the official namespace.

Example:

```text
phoenix::trim
phoenix::replace
phoenix::contains
```

Private helper functions must never be exposed.

---

## Inputs

Functions receive input through positional parameters.

Input parameters must never be modified.

---

## Outputs

Functions return their result through standard output whenever applicable.

Functions performing validation return an appropriate UNIX exit status.

---

## Return Codes

| Code | Meaning |
|------|---------|
| 0 | Success / Condition satisfied |
| 1 | Failure / Condition not satisfied |

---

## Side Effects

Public functions must not:

- modify global variables;
- print debugging information;
- write temporary files;
- change shell options.

Functions must be deterministic.

Given the same input, they must always produce the same output.

---

## Error Handling

The module does not implement custom exception handling.

Whenever possible, native platform behavior is preferred.

---

## Dependency Rules

The module must not depend on:

- filesystem.sh
- logger.sh
- generators
- validators
- plugins
- CLI

The Strings module is a foundational Core component.
---

# Scope and Boundaries

The Strings module intentionally implements only the most common string operations required throughout the Phoenix DevKit.

Its purpose is to provide a compact and stable API rather than an exhaustive string manipulation library.

## Included

The module includes:

- case conversion;
- whitespace management;
- substring search;
- substring replacement;
- basic validation;
- slug generation.

These operations represent the core string functionality shared across multiple DevKit components.

## Excluded

The module intentionally does not implement:

- regular expression helpers;
- URL encoding or decoding;
- Base64 encoding;
- JSON manipulation;
- XML processing;
- template rendering;
- shell command parsing;
- advanced text formatting.

These features belong to dedicated modules when required.

## Evolution Strategy

New public functions may be introduced only when they satisfy all of the following conditions:

- reusable by multiple modules;
- generic in nature;
- independent from higher-level components;
- aligned with the Phoenix DevKit Engineering Principles.

This approach prevents API growth driven by isolated use cases and preserves long-term maintainability.
---

# Stability Policy

The Strings module is part of the Phoenix DevKit Core Library.

Because it is a foundational component, API stability has priority over feature growth.

## Public API

Once a public function is certified, its behavior must remain backward compatible.

Breaking changes are not permitted within the same major version.

## API Evolution

Existing functions may be:

- optimized internally;
- documented more clearly;
- covered by additional tests.

These improvements must not alter the public contract.

## New Functions

New public functions may be introduced only after:

- architectural review;
- implementation review;
- automated test coverage;
- API documentation;
- certification.

## Deprecation

If a public function must eventually be replaced:

1. it is first marked as deprecated;
2. documentation is updated;
3. a migration path is provided;
4. removal is postponed to the next major version.

## Engineering Goal

Applications built on top of the Phoenix DevKit should continue to work across minor releases without requiring source code changes.
---

# Design Decisions

The following architectural decisions define the long-term evolution of the Strings module.

## ADR-STR-001 — Keep the API Small

The public API must remain intentionally compact.

Adding new functions has a long-term maintenance cost and requires architectural justification.

Priority is given to stability over completeness.

---

## ADR-STR-002 — One Function, One Responsibility

Each public function performs exactly one operation.

Functions must not combine multiple transformations or validations.

---

## ADR-STR-003 — Platform Independence

The API must expose consistent behavior independently of the underlying implementation.

Internal implementations may evolve over time without changing the public contract.

---

## ADR-STR-004 — Reuse Before Creation

Before introducing a new function, existing APIs must be evaluated first.

If the required behavior can be composed using existing public functions, no new API should be added.

---

## ADR-STR-005 — Core Before Convenience

Only generic string operations belong to the Core Library.

Specialized helpers should be implemented in higher-level modules whenever possible.

---

## ADR-STR-006 — Documentation is Part of the Module

A module is not considered complete until its:

- architecture;
- implementation;
- automated tests;
- API reference;
- certification;

have all been completed.