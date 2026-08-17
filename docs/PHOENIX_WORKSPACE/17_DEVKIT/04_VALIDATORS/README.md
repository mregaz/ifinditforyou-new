# Phoenix DevKit — Validators

This directory contains the Phoenix DevKit Validation Framework.

## Purpose

The Validation Framework provides deterministic, read-only validation of Phoenix DevKit structures, conventions, documentation, dependencies, and engineering standards.

Validators inspect a target and return structured validation results without modifying the target.

## Architecture

The Validation Framework is composed of:

- Validator Registry
- Validation Execution Engine
- Built-in Validator Loader
- Validator Definitions
- Validator Implementations

Canonical architectural contracts are defined in the Phoenix DevKit Architecture domain.

## Built-in Validators

The current certified built-in validators are:

- structure
- naming
- documentation
- dependencies
- standards

## Responsibilities

The Validation Framework is responsible for:

- explicit validator registration;
- deterministic validator resolution;
- controlled validator execution;
- canonical validation result formatting;
- deterministic failure behavior;
- read-only target inspection;
- built-in validator loading.

## Validation Result Model

A validator returns a structured result beginning with a status such as:

STATUS=VALID

or:

STATUS=INVALID

Invalid results may additionally identify the failed check and provide a diagnostic message.

## Safety

Validation must remain read-only.

Validators must not mutate the validation target, execute uncontrolled target content, or interpret definition files as executable shell code.

## Determinism

Given the same validator, target, and filesystem state, validation must produce the same result.

Where multiple violations exist, validators use deterministic inspection rules to identify the reported failure.

## Current Certification

The following validators have been individually certified:

- V01 Structure Validator
- V02 Naming Validator
- V03 Documentation Validator
- V04 Dependencies Validator
- V05 Standards Validator

Final integrated Validation Framework certification is performed separately.

## Limitations

This directory does not implement Generator behavior, CLI command handling, Plugin loading, or release packaging.

Those concerns belong to separate Phoenix DevKit layers.
