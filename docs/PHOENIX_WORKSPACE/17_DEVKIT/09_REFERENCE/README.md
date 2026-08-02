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

### Manifest

**Document:** `PHOENIX_MANIFEST_API_REFERENCE_v1.0.md`

**Module:** `core/manifest.sh`

**Status:** Certified

**Public API:** 3 functions

**Automated Tests:** 23/23 PASS

---

### Template Engine

**Document:** `PHOENIX_TEMPLATE_ENGINE_API_REFERENCE_v1.0.md`

**Module:** `core/template_engine.sh`

**Status:** Certified

**Public API:** 3 functions

**Automated Tests:** 31/31 PASS

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

The following certified Core modules do not yet have dedicated API Reference documents:

- Runtime
- Logger

Their certification remains valid.

Dedicated API References may be added during a future documentation consolidation cycle.

---

# Directory Status

| Module | API Reference | Certification |
|---|---|---|
| Runtime | Pending | Certified |
| Logger | Pending | Certified |
| Filesystem | Available | Certified |
| Strings | Available | Certified |
| Manifest | Available | Certified |
| Template Engine | Available | Certified |

---

# Core Reference Coverage

Certified Core modules:

```text
6