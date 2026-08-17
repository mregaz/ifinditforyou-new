# Phoenix DevKit — Architecture

This directory contains the canonical architecture and function specifications of the Phoenix DevKit.

## Purpose

The Architecture domain defines the contracts, responsibilities, boundaries, and public behavior of the DevKit subsystems before implementation.

Architecture documents are normative engineering references.

Implementation must conform to the applicable architecture and function specifications unless an approved architectural decision explicitly defines an exception.

## Contents

The directory includes specifications for:

- Runtime
- Logger
- Filesystem
- Strings
- Manifest
- Template Engine
- Generator Layer
- Validation Framework
- Phoenix DevKit Architecture Book

## Usage

Architecture documents are used to:

- define module responsibilities;
- freeze public API contracts;
- establish dependency boundaries;
- guide implementation;
- design automated tests;
- support certification and architectural review.

## Engineering Rule

Architecture precedes implementation.

A new subsystem must not be implemented before its responsibilities and boundaries are sufficiently defined.

## Limitations

This directory contains architecture and specification documents.

It does not contain runtime implementations, tests, generators, validators, CLI commands, or plugin code.
