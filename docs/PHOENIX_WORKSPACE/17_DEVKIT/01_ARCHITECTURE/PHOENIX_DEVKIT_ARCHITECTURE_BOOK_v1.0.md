# PHOENIX DEVKIT ARCHITECTURE BOOK

**Version:** 1.0  
**Status:** Draft  
**Project:** Phoenix DevKit  
**Author:** Phoenix Engineering  
**Last Updated:** 2026-07-29

---

# Preface

The Phoenix DevKit Architecture Book is the authoritative technical reference for the Phoenix DevKit.

It defines the engineering principles, architectural rules, module responsibilities, dependency model, runtime behavior and evolution strategy of the DevKit.

Every implementation must conform to this document unless an Architecture Decision Record (ADR) explicitly approves an exception.

This book is intended to remain the single source of truth for the DevKit architecture throughout its lifecycle.

---

# Chapter 1 — Vision

The Phoenix DevKit is not simply a collection of Bash scripts.

It is an engineering platform whose purpose is to standardize, automate and safeguard the creation and evolution of Phoenix projects.

The DevKit exists to reduce repetitive work, increase engineering quality and ensure that every generated project follows the same architectural standards.

The guiding philosophy is:

> Build the architecture once. Reuse it forever.

---

# Chapter 2 — Core Engineering Principles

The DevKit follows five non-negotiable principles.

## 1. Architecture before implementation

Every significant component must be designed before it is implemented.

## 2. Safety before automation

Automation must never compromise the integrity of a project.

## 3. Simplicity before complexity

Solutions should remain understandable, maintainable and predictable.

## 4. Reuse before duplication

Engineering knowledge should be encapsulated into reusable modules.

## 5. Determinism before convenience

The same inputs must always produce the same outputs.
---

# Chapter 2 — Core Engine

The Core Engine is the runtime foundation of the Phoenix DevKit.

Every higher-level component depends directly or indirectly on the Core Engine.

Its responsibilities are intentionally limited to generic engineering capabilities.

The Core Engine must never contain project-specific logic.

---

## Core Engine Goals

The Core Engine provides:

- runtime initialization;
- logging;
- filesystem abstraction;
- string manipulation;
- manifest parsing;
- template rendering;
- shared runtime utilities.

Every module must be:

- deterministic;
- independently testable;
- reusable;
- platform independent whenever possible.

---

## Core Modules

The initial runtime consists of the following modules.

| Module | Responsibility |
|---------|----------------|
| runtime.sh| Runtime bootstrap and shared helpers |
| logger.sh | Structured logging |
| filesystem.sh | Safe filesystem operations |
| strings.sh | String utilities |
| manifest.sh | Manifest parsing |
| template_engine.sh | Template rendering |

Each module has a single responsibility.

No module should become a "catch-all" utility library.

---

## Dependency Direction

The dependency graph is strictly hierarchical.

```
runtime.sh
     ↑
logger.sh
     ↑
filesystem.sh
     ↑
strings.sh
     ↑
manifest.sh
     ↑
template_engine.sh
```

The Core Engine must never contain circular dependencies.

Dependencies always flow upward toward more fundamental modules.

---

## Public API Convention

Every public function uses the Phoenix namespace.

Examples:

```bash
phoenix::log_info
phoenix::create_directory
phoenix::template_render
phoenix::manifest_load
```

Internal helper functions use:

```bash
_phoenix::function_name
```

Private functions are implementation details and are not part of the compatibility contract.

---

## Design Philosophy

The Core Engine provides mechanisms.

It does **not** define project policies.

For example:

✔ create a directory

✔ render a template

✔ validate a manifest

✔ write a log entry

are Core Engine responsibilities.

Creating a specific Phoenix Provider or generating a business document belongs to higher architectural layers.
---
---

# Chapter 3 — Runtime Architecture

The Phoenix DevKit Runtime is the foundational execution layer of the entire DevKit.

Every higher-level capability—generators, validators, CLI commands and plugins—relies on the Runtime.

The Runtime provides only generic engineering services.

It never contains business logic or project-specific policies.

---

## 3.1 Runtime Philosophy

The Runtime is designed around four principles:

- Reliability
- Predictability
- Reusability
- Simplicity

A Runtime component must solve one engineering problem and solve it well.

---

## 3.2 Runtime Layers

The Runtime is organized as a layered architecture.

```
Applications
      │
      ▼
CLI Engine
      │
      ▼
Generator Engine
      │
      ▼
Validator Engine
      │
      ▼
Template Engine
      │
      ▼
Core Runtime
```

Each layer depends only on the layer immediately below it.

Lower layers must never depend on higher layers.

---

## 3.3 Runtime Domains

The Runtime is divided into six functional domains.

| Domain | Responsibility |
|---------|----------------|
| Runtime | Bootstrap and shared execution |
| Logging | Diagnostic output |
| Filesystem | Safe file operations |
| Strings | Text transformations |
| Manifest | Configuration loading |
| Templates | Template rendering |

Each domain owns its own public API.

Responsibilities must never overlap.

---

## 3.4 Dependency Model

Dependencies always point downward toward more fundamental modules.

```
template_engine.sh
        │
manifest.sh
        │
strings.sh
        │
filesystem.sh
        │
logger.sh
        │
common.sh
```

Circular dependencies are forbidden.

---

## 3.5 Runtime Boundaries

The Runtime is responsible for mechanisms.

Examples:

- reading files;
- writing files;
- parsing manifests;
- rendering templates;
- logging;
- validating runtime arguments.

The Runtime is **not** responsible for project policies.

Examples of project policy:

- generating a Provider;
- creating a Workspace;
- publishing a Release;
- deploying an application.

Those belong to higher architectural layers.

---

## 3.6 Runtime Stability

The Runtime is the most stable layer of the DevKit.

Changes to Runtime APIs must be:

- backward compatible whenever possible;
- documented;
- tested;
- reviewed.

Breaking changes require:

- version increment;
- migration notes;
- Architecture Decision Record (ADR).

---

## 3.7 Runtime Goals

The Runtime exists to make higher-level components simpler.

A Generator should focus on generating.

A Validator should focus on validating.

A CLI should focus on user interaction.

Whenever a higher-level component needs generic engineering functionality, that functionality belongs in the Runtime.

# Chapter 4 — Module Design Rules

Every Phoenix DevKit module must follow a common structural contract.

These rules ensure consistency, predictability and safe reuse across the entire runtime.

---

## 4.1 Single Responsibility

Each module must have one clearly defined responsibility.

Examples:

- `common.sh` manages runtime foundations;
- `logger.sh` manages logging;
- `filesystem.sh` manages filesystem operations;
- `strings.sh` manages string transformations;
- `manifest.sh` manages manifest data;
- `template_engine.sh` manages template rendering.

A module must not become a generic container for unrelated functions.

---

## 4.2 Module Header

Every runtime module must begin with:

```bash
#!/usr/bin/env bash
```

Each module must also include:

- module name;
- module purpose;
- public API description;
- dependency declaration;
- compatibility notes.

Example:

```bash
#!/usr/bin/env bash

# Phoenix DevKit
# Module: common.sh
# Purpose: Runtime bootstrap and shared foundational utilities.
# Public API:
#   phoenix::require_command
#   phoenix::assert_not_empty
#   phoenix::fail
```

---

## 4.3 Safe Module Loading

Every module must prevent duplicate initialization.

Example:

```bash
if [[ -n "${PHOENIX_COMMON_LOADED:-}" ]]; then
  return 0
fi

PHOENIX_COMMON_LOADED=1
```

The loading guard must be defined before module initialization logic.

A module may be sourced more than once without producing duplicate side effects.

---

## 4.4 Module Location Resolution

A module must resolve its own filesystem location.

It must never assume that the caller is executing from the DevKit root directory.

Recommended pattern:

```bash
PHOENIX_CORE_DIR="$(
  cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1
  pwd
)"
```

Imports must use resolved absolute paths.

Example:

```bash
source "${PHOENIX_CORE_DIR}/common.sh"
```

Forbidden pattern:

```bash
source ./common.sh
```

The forbidden pattern depends on the caller's current working directory and is therefore unreliable.

---

## 4.5 Public Functions

Public functions must use the Phoenix namespace:

```bash
phoenix::function_name
```

Examples:

```bash
phoenix::log_info
phoenix::create_directory
phoenix::manifest_load
```

Public functions form part of the compatibility contract.

Their parameters, output and return codes must be documented and tested.

---

## 4.6 Private Functions

Internal helper functions must use:

```bash
_phoenix::function_name
```

Example:

```bash
_phoenix::normalize_path
```

Private functions are implementation details.

Higher-level modules must not depend directly on private functions belonging to another module.

---

## 4.7 Function Arguments

Functions must validate required arguments before performing operations.

Example:

```bash
phoenix::example_function() {
  local value="${1:-}"

  if [[ -z "${value}" ]]; then
    return 2
  fi
}
```

Functions must not rely on undeclared positional arguments.

Optional arguments must have explicit default values.

---

## 4.8 Local Variables

Variables created inside functions must normally be declared with `local`.

Example:

```bash
phoenix::lowercase() {
  local value="${1:-}"
}
```

Global variables are allowed only for:

- module loading guards;
- runtime constants;
- explicit configuration;
- shared state documented by the architecture.

Global state must be minimized.

---

## 4.9 Variable Expansion

Variable expansions must be quoted unless intentional word splitting is required.

Correct:

```bash
printf '%s\n' "${value}"
```

Incorrect:

```bash
echo $value
```

Unquoted expansions may cause:

- word splitting;
- wildcard expansion;
- path corruption;
- unexpected command behavior.

---

## 4.10 Output Contract

Functions must distinguish between:

- returned data;
- diagnostic messages;
- return status.

Returned data must normally be written to standard output.

Warnings, errors and diagnostics must normally be written to standard error.

Example:

```bash
printf '%s\n' "${result}"
printf 'Error: invalid value\n' >&2
return 2
```

A function must not mix machine-readable output with decorative logging.

---

## 4.11 Return Codes

Core functions must return explicit status codes.

Initial conventions:

| Code | Meaning |
|------|---------|
| 0 | Success |
| 1 | Generic failure |
| 2 | Invalid usage or argument |
| 3 | Missing dependency |
| 4 | Invalid configuration |
| 5 | Filesystem failure |
| 6 | Validation failure |
| 7 | Template rendering failure |

Reusable library functions should normally use:

```bash
return
```

Top-level CLI commands may use:

```bash
exit
```

A reusable module must not unexpectedly terminate the caller's shell.

---

## 4.12 Side Effects

Every function with side effects must make them explicit.

Examples of side effects:

- creating files;
- modifying directories;
- deleting paths;
- changing permissions;
- updating runtime state.

Pure transformation functions should avoid side effects entirely.

---

## 4.13 Idempotency

Where practical, operations must be idempotent.

Running the same safe operation multiple times should not produce corruption or inconsistent results.

Example:

```bash
phoenix::create_directory "/tmp/example"
phoenix::create_directory "/tmp/example"
```

The second execution should succeed safely when the directory already exists.

---

## 4.14 Destructive Operations

Destructive functions require additional protection.

They must validate:

- that the target is not empty;
- that the target is not `/`;
- that the target is not the user's home directory;
- that the target is within an allowed scope;
- that destructive intent is explicit.

No destructive function may silently remove important data.

---

## 4.15 External Commands

Before using an external command, the responsible module must verify that it is available.

Example:

```bash
phoenix::require_command "git"
```

Dependencies on external commands must be documented.

Portable shell features should be preferred over external commands when the result remains clear and maintainable.

---

## 4.16 Bash Compatibility

The initial runtime target is Bash 3.2 or newer.

The implementation must avoid unsupported features such as associative arrays unless the minimum supported Bash version is changed through an approved architectural decision.

Platform-specific behavior must be isolated and tested.

---

## 4.17 Strict Mode

Reusable sourced modules must apply strict-mode options carefully.

The following options may alter the behavior of the calling shell:

```bash
set -e
set -u
set -o pipefail
```

Core modules must not silently impose global shell behavior on their caller.

Strict execution policy should normally be controlled by top-level executable scripts.

---

## 4.18 Documentation Contract

Every public function must document:

- purpose;
- arguments;
- standard output;
- standard error;
- return codes;
- side effects;
- usage example.

Example:

```bash
# phoenix::require_command
#
# Verifies that an executable command is available.
#
# Arguments:
#   $1 - Command name.
#
# Returns:
#   0 - Command exists.
#   3 - Command is unavailable.
#
# Side effects:
#   Writes an error message to stderr on failure.
```

---

## 4.19 Testing Contract

Every public function must have at least:

- one successful execution test;
- one invalid-input test;
- one edge-case test.

Functions with filesystem side effects must be tested inside temporary directories.

Tests must never modify the real Phoenix Workspace.

---

## 4.20 Module Completion Criteria

A module is complete only when:

- its responsibility is respected;
- its public API is documented;
- its dependencies are valid;
- argument validation exists;
- return codes are explicit;
- tests pass;
- no unsafe side effects remain;
- Bash compatibility has been verified.