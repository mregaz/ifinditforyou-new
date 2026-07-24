# NAMING STRATEGY

**Document ID:** PHX-ID-006

**Version:** 1.0

**Status:** APPROVED

**Owner:** Phoenix Project

**Category:** Identity

**Directory:** `/docs/14_IDENTITY/`

**Filename:** `06_NAMING_STRATEGY.md`

**Created:** 2026-07-22

**Last Updated:** 2026-07-22

**Related Documents**

- 01_PHOENIX_BRAND_BOOK_v1.0.md
- 03_PHOENIX_VALUES.md
- 04_PRODUCT_PRINCIPLES.md
- 05_COMMUNICATION_GUIDELINES.md

---

# Table of Contents

1. Purpose
2. Scope
3. Does NOT Cover
4. General Naming Principles
5. Naming Conventions
6. Naming Checklist
7. Operational Impact
8. Related Documents
9. Revision History

---

# 1. Purpose

## 1.1 Objective

This document defines the official naming conventions used throughout the Phoenix project.

A consistent naming strategy improves readability, reduces ambiguity, and makes the project easier to maintain as it grows.

Every repository, file, component, database object, API endpoint, and document should follow these conventions.

---

# 2. Scope

This strategy applies to:

- Repositories
- Directories
- Files
- React Components
- TypeScript Types
- Interfaces
- Functions
- Variables
- Constants
- Database Tables
- Database Columns
- API Routes
- Providers
- Documentation
- ADRs
- Sprint Documents
- Git Branches
- Git Tags
- Releases

---

# 3. Does NOT Cover

This document does not define:

- Product terminology
- Marketing language
- Brand identity
- UI writing guidelines

These subjects are covered in their respective documents.

---

# 4. General Naming Principles

Every name should be:

- Clear
- Descriptive
- Consistent
- Predictable
- Stable over time

Avoid abbreviations unless they are universally recognized.

Prefer explicit names over short names.

One concept should always have one official name.

---

# 5. Naming Conventions

## 5.1 Repositories

Examples:

- ifinditforyou-phoenix
- phoenix-docs
- phoenix-playbooks

Rules:

- lowercase
- hyphens

---

## 5.2 Directories

Examples:

- providers
- contracts
- documentation
- playbooks
- identity
- architecture

Rules:

- lowercase
- plural where appropriate

---

## 5.3 Files

Examples:

- ProviderManager.ts
- FinderEngine.ts
- SearchProvider.ts

Rules:

- PascalCase for source files containing classes, components or types.
- kebab-case only where required by framework conventions.
- Numbered Markdown documents where applicable (`01_...`, `02_...`).

---

## 5.4 React Components

Examples:

- FinderForm
- SearchResults
- EmailGateModal
- ProviderCard

Rule:

Always use PascalCase.

---

## 5.5 Functions

Examples:

- parseQuery()
- runFinderEngine()
- resolveProviders()
- validateListing()

Rules:

- camelCase
- Start with a verb

---

## 5.6 Variables

Examples:

- providerName
- results
- executionTime
- creditsRemaining

Rules:

- camelCase
- Avoid abbreviations

---

## 5.7 Constants

Examples:

- MAX_RESULTS
- DEFAULT_TIMEOUT
- FREE_PLAN_LIMIT

Rule:

UPPER_SNAKE_CASE

---

## 5.8 TypeScript Types

Examples:

- FinderResult
- ProviderExecution
- ParsedQuery

Rule:

PascalCase

---

## 5.9 Interfaces

Examples:

- SearchProvider
- ProviderRegistry

Rules:

- PascalCase
- Do not prefix with "I"

---

## 5.10 Database Tables

Examples:

- users
- providers
- searches
- saved_searches

Rules:

- plural
- snake_case

---

## 5.11 Database Columns

Examples:

- created_at
- updated_at
- provider_id
- user_id

Rule:

snake_case

---

## 5.12 API Routes

Examples:

- /api/finder
- /api/search
- /api/providers
- /api/account

Rules:

- lowercase
- nouns whenever possible

---

## 5.13 Documentation

Examples:

- 01_PHOENIX_BRAND_BOOK.md
- 02_PHOENIX_MANIFESTO.md
- 03_PHOENIX_VALUES.md

Rules:

- numbered
- uppercase filename
- markdown

---

## 5.14 ADR

Examples:

- ADR-001
- ADR-002
- ADR-003

Rules:

- sequential numbering
- never reuse IDs

---

## 5.15 Sprint

Examples:

- Sprint-014
- Sprint-015
- Sprint-016

Rule:

Sequential numbering

---

## 5.16 Git Branches

Examples:

- feature/provider-ricardo
- feature/ranking-engine
- fix/parser-annonces
- docs/identity
- refactor/provider-manager

---

## 5.17 Git Commits

Follow Conventional Commits.

Examples:

- feat:
- fix:
- docs:
- refactor:
- test:
- chore:

---

## 5.18 Releases

Examples:

- v1.0.0
- v1.1.0
- v2.0.0

Rule:

Semantic Versioning

---

# 6. Naming Checklist

Before introducing a new name ask:

- □ Is it clear?
- □ Is it descriptive?
- □ Is it consistent with existing names?
- □ Will it still make sense in two years?
- □ Does it follow this strategy?

---

# 7. Operational Impact

This document influences:

- Source code
- Database schema
- API design
- Documentation
- Git workflow
- Provider development
- Code reviews
- Project consistency

---

# 8. Related Documents

- 03_PHOENIX_VALUES.md
- 04_PRODUCT_PRINCIPLES.md
- 05_COMMUNICATION_GUIDELINES.md

---

# 9. Revision History

| Version | Date | Description |
|----------|------------|-----------------|
| 1.0 | 2026-07-22 | Initial Release |




