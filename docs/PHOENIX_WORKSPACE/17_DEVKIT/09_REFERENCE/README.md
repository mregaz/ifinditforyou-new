# PHOENIX DEVKIT — REFERENCE LIBRARY

## Version 1.0

**Status:** Active

---

# Purpose

This directory contains the official API references and technical reference documentation for the Phoenix DevKit.

Reference documents describe the public interfaces of certified DevKit modules and provide the authoritative usage contract for their APIs.

---

# Reference Documents

## Core Modules

### Filesystem

**Document:** `PHOENIX_FILESYSTEM_API_REFERENCE_v1.0.md`

**Module:** `core/filesystem.sh`

**Status:** Certified

**Public API:** 10 functions

**Automated Tests:** 20/20 PASS

---

### Strings

**Document:** `PHOENIX_STRINGS_API_REFERENCE_v1.0.md`

**Module:** `core/strings.sh`

**Status:** Certified

**Public API:** 12 functions

**Automated Tests:** 45/45 PASS

---

# Reference Policy

A module API Reference should be considered authoritative only after:

1. the module implementation is complete;
2. syntax validation passes;
3. automated tests pass;
4. the public API has been reviewed;
5. the module has completed its certification process.

Modules still under development must not be presented here as certified APIs.

---

# Planned References

The following Core modules may receive dedicated API References after their respective certification and documentation phases:

- Runtime
- Logger
- Manifest
- Template Engine

---

# Directory Status

| Module | API Reference | Certification |
|---|---|---|
| Runtime | Pending | Certified |
| Logger | Pending | Certified |
| Filesystem | Available | Certified |
| Strings | Available | Certified |
| Manifest | Pending | Development |
| Template Engine | Pending | Development |

---

# Governance

The Reference Library documents the public contracts of the Phoenix DevKit.

Architecture defines **how the system is designed**.

The Reference Library defines **how the system is used**.

Changes to a certified public API must be reflected in its corresponding reference documentation.
