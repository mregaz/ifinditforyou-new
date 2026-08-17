# Phoenix DevKit — Tests

This directory contains the automated test suite for the Phoenix DevKit.

## Purpose

The Test domain provides repeatable verification of DevKit behavior, contracts, regressions, determinism, safety, and compatibility.

Tests are part of the Phoenix certification process.

## Scope

The suite covers certified Phoenix DevKit components including:

- Core modules;
- Template Engine;
- Generator Registry;
- Generator Planning Engine;
- Generator Execution Engine;
- Built-in Generators;
- Validator Registry;
- Validation Execution Engine;
- Built-in Validators.

## Test Categories

The directory contains:

- Core unit tests;
- Generator framework tests;
- built-in Generator tests;
- Validator framework tests;
- individual Validator tests;
- integration and regression checks.

## Engineering Principles

Tests must be:

- deterministic;
- repeatable;
- isolated where practical;
- explicit about expected behavior;
- safe to execute;
- capable of detecting regressions in certified contracts.

## Certification

A component is not considered certified merely because its implementation exists.

Certification requires its applicable tests to pass together with the relevant regression suite.

Full regression testing is used to verify that new development does not break previously certified behavior.

## Failure Policy

A failing test must be investigated before certification proceeds.

Tests must not be weakened, removed, or bypassed merely to obtain a passing regression result.

When a test reveals a genuine architectural or implementation defect, the defect must be corrected at its source.

## Test Data

Temporary test artifacts should be isolated from production DevKit assets and cleaned up after execution.

Tests must not depend on uncontrolled external state when deterministic local verification is possible.

## Relationship to Architecture

Tests verify implementation against the applicable Phoenix architecture, specifications, and certified behavioral contracts.

They do not replace those contracts.

## Limitations

This directory contains verification assets.

Production implementations belong to their respective Phoenix DevKit domains.
