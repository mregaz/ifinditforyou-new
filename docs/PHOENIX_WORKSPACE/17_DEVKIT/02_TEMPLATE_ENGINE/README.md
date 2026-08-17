# Phoenix DevKit — Template Engine

This directory represents the Phoenix DevKit Template Engine domain.

## Purpose

The Template Engine provides deterministic and secure rendering of Phoenix text templates using explicit placeholders and caller-provided variables.

It is a foundational service used by higher-level DevKit components, including generators.

## Responsibilities

The Template Engine is responsible for:

- validating template variable assignments;
- detecting Phoenix placeholders;
- rendering template content deterministically;
- rendering template files through controlled filesystem operations;
- rejecting invalid template variable names and assignments;
- preserving predictable output behavior.

## Architecture

The canonical architecture and function contracts are defined in:

01_ARCHITECTURE/PHOENIX_TEMPLATE_ENGINE_MODULE_ARCHITECTURE_v1.0.md

01_ARCHITECTURE/PHOENIX_TEMPLATE_ENGINE_FUNCTION_SPECIFICATION_v1.0.md

The implementation lives in:

core/template_engine.sh

## Dependencies

The Template Engine depends on lower-level Core services, including:

- Filesystem
- Strings

Dependencies must follow the Phoenix downward dependency model and must not create circular relationships.

## Usage

Higher-level components should use the public Template Engine API rather than implementing independent rendering logic.

Template rendering must remain explicit, deterministic, and free from uncontrolled code execution.

## Limitations

This directory does not contain Generator definitions, Validator implementations, CLI commands, or Plugin logic.

It represents the Template Engine domain and its documentation boundary.
