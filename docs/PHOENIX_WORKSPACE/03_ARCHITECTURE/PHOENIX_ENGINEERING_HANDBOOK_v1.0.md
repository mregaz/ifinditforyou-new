# PHOENIX ENGINEERING HANDBOOK Part I

Engineering Manifesto
## Version 1.0

**Project:** Phoenix Core

**Status:** Active

**Author:** Mauro Regazzoni & ChatGPT

**Last Update:** July 2026

---

# Preface

Phoenix non è semplicemente un motore di ricerca.

Phoenix è una piattaforma software progettata per interrogare, analizzare e unificare marketplace eterogenei attraverso un'architettura modulare, resiliente e facilmente estendibile.

L'obiettivo del progetto non è sviluppare "uno scraper", ma costruire un'infrastruttura che renda semplice aggiungere nuovi provider mantenendo elevati standard qualitativi.

Questo documento definisce i principi che guidano ogni evoluzione del progetto.

---

# 1. Vision

Phoenix vuole diventare il layer di ricerca universale tra l'utente e i marketplace.

L'utente esprime un bisogno.

Phoenix decide automaticamente:

- dove cercare;
- come cercare;
- come normalizzare i dati;
- come ordinarli;
- come eliminare i duplicati;
- come presentare il miglior risultato.

---

# 2. Mission

Costruire il miglior motore europeo per la ricerca intelligente di annunci online.

Non il più grande.

Il più affidabile.

---

# 3. Core Principles

## 3.1 Simplicity

Ogni componente deve essere semplice da comprendere.

La semplicità è una caratteristica progettuale.

Mai aggiungere complessità non necessaria.

---

## 3.2 Single Responsibility

Ogni modulo svolge un solo compito.

Esempio:

Fetch

↓

Parser

↓

Validator

↓

Mapper

↓

FinderResult

Ogni passaggio può essere modificato senza influenzare gli altri.

---

## 3.3 Modularity

Ogni provider è indipendente.

L'aggiunta di un nuovo marketplace non deve richiedere modifiche al Finder Engine.

---

## 3.4 Testability

Ogni componente critico deve poter essere testato in isolamento.

Nessuna logica importante deve dipendere esclusivamente da test manuali.

---

## 3.5 Scalability

Phoenix deve poter crescere da:

1 provider

a

100 provider

senza cambiare architettura.

---

# 4. Phoenix Core

Phoenix Core è l'insieme dei componenti permanenti della piattaforma.

Comprende:

- Finder Engine
- Capability Resolver
- Provider Resolver
- Provider Registry
- Provider Manager
- Provider SDK
- Ranking
- Deduplication
- Intelligence Layer

I provider non fanno parte del Core.

Sono estensioni del Core.

---

# 5. Provider Lifecycle

Ogni provider attraversa sempre lo stesso ciclo di vita.

Idea

↓

Discovery

↓

Approved

↓

Development

↓

Testing

↓

Certified

↓

Production

Nessuna eccezione.

---

# 6. Provider SDK

Ogni provider implementa sempre la stessa pipeline.

Fetch

↓

Parser

↓

Validator

↓

Mapper

↓

FinderResult

Questa pipeline è obbligatoria.

---
# 7. Coding Standards

Phoenix code must be clear, predictable and easy to maintain.

Coding standards are not cosmetic rules.

They exist to reduce ambiguity, prevent defects and make collaboration easier.

The objective is not to write clever code.

The objective is to write code that another developer can understand, test and modify safely.

---

## 7.1 General Principles

Every contribution must follow these principles:

- clarity before cleverness;
- simplicity before abstraction;
- correctness before optimization;
- explicit behavior before hidden behavior;
- stable contracts before implementation details;
- small changes before large rewrites.

Code should communicate intent without requiring unnecessary explanation.

---

## 7.2 Single Responsibility

Every file, function and module should have one clear responsibility.

A module should change for one primary reason.

Examples:

- `fetch.ts` retrieves remote content;
- `parser.ts` extracts raw marketplace data;
- `validator.ts` verifies extracted data;
- `mapper.ts` converts valid data into `FinderResult`;
- `index.ts` exposes the provider contract.

Business logic must not be distributed randomly across unrelated files.

A parser should not perform network requests.

A mapper should not validate HTML.

A provider registry should not execute providers.

---

## 7.3 File Organization

Files should be organized by responsibility and domain.

Provider implementations should follow the standard structure:

```text
provider-name/
├── fetch.ts
├── parser.ts
├── validator.ts
├── mapper.ts
├── types.ts
├── index.ts
└── tests/
```

Additional files may be introduced when justified, but the standard structure should remain recognizable.

Large files should be divided when they contain multiple responsibilities or become difficult to review.

File organization should reflect the architectural model of Phoenix.

---

## 7.4 Naming Conventions

Names must describe purpose clearly.

### Files

Use lowercase descriptive names.

Examples:

```text
providerManager.ts
capabilityResolver.ts
withTimeout.ts
finderLogger.ts
```

Provider pipeline files use standardized names:

```text
fetch.ts
parser.ts
validator.ts
mapper.ts
types.ts
index.ts
```

### Variables and Functions

Use `camelCase`.

Examples:

```ts
parsedQuery
providerResults
resolveProviders
validateListing
```

Boolean variables should communicate a condition.

Preferred:

```ts
isEnabled
hasResults
canRetry
isValid
```

Avoid:

```ts
enabledFlag
resultCheck
validDataStatus
```

### Types, Interfaces and Classes

Use `PascalCase`.

Examples:

```ts
FinderResult
ParsedQuery
SearchProvider
ProviderExecution
```

### Constants

Use descriptive names.

Project-level constants may use `UPPER_SNAKE_CASE` when they represent fixed configuration values.

Example:

```ts
const PROVIDER_TIMEOUT_MS = 3000;
```

Avoid abbreviations unless they are widely understood within Phoenix.

---

## 7.5 Function Design

Functions should be small and focused.

A function should:

- perform one task;
- have a clear name;
- minimize side effects;
- return predictable values;
- expose explicit inputs and outputs.

Preferred:

```ts
function normalizeTitle(title: string): string {
  return title.trim().replace(/\s+/g, " ");
}
```

Avoid functions that perform unrelated operations such as:

- fetching data;
- parsing HTML;
- validating objects;
- logging;
- writing to storage;

all within the same function.

When a function becomes difficult to name precisely, it probably has too many responsibilities.

---

## 7.6 TypeScript Standards

Phoenix uses TypeScript to make contracts explicit and reduce runtime defects.

Avoid `any` unless there is a documented and unavoidable reason.

Preferred:

```ts
type ProviderExecutionStatus = "success" | "error";
```

Avoid:

```ts
let status: any;
```

Function parameters and return values should be typed explicitly when the type is not immediately obvious.

Example:

```ts
export function mapListing(
  listing: ValidatedListing,
  index: number,
): FinderResult {
  // ...
}
```

Shared domain types should be defined centrally and reused.

Do not create duplicate types that represent the same business concept.

Use union types for controlled values.

Example:

```ts
type FinderPlan = "free" | "pro";
```

Use optional properties only when the value can genuinely be absent.

---

## 7.7 Imports and Dependencies

Imports should be easy to scan.

Recommended order:

1. external libraries;
2. shared project types and contracts;
3. local modules.

Example:

```ts
import * as cheerio from "cheerio";

import type { FinderResult, ParsedQuery } from "../../types";
import type { SearchProvider } from "../../contracts/SearchProvider";

import { fetchMarketplace } from "./fetch";
import { parseMarketplaceHtml } from "./parser";
```

Unused imports must be removed.

Circular dependencies must be avoided.

A low-level module must not depend on a higher-level orchestration module.

Dependencies must follow the architectural direction defined in the Architecture Book.

---

## 7.8 Error Handling

Errors must never disappear silently.

Every recoverable error should be:

- intercepted;
- classified;
- logged;
- returned or transformed explicitly.

Preferred:

```ts
if (!response.ok) {
  throw new Error(`Provider request failed with status ${response.status}`);
}
```

Avoid:

```ts
try {
  await provider.search(query);
} catch {
  return [];
}
```

unless the error is logged and intentionally isolated by the Provider Manager.

Error messages should include useful context without exposing secrets.

Do not log:

- passwords;
- tokens;
- private keys;
- database credentials;
- personal data without justification.

---

## 7.9 Logging

Logging must be structured and useful.

Logs should answer:

- what happened;
- where it happened;
- which provider was involved;
- how long the operation took;
- whether the operation succeeded;
- how many results were produced.

Preferred:

```ts
finderLogger.info("provider execution completed", {
  provider: provider.name,
  status: "success",
  durationMs,
  resultCount: results.length,
});
```

Avoid vague logs:

```ts
console.log("done");
console.log("error");
```

Temporary debugging logs must be removed before completion unless they provide permanent operational value.

---

## 7.10 Comments

Comments should explain why, not repeat what the code already says.

Useful comment:

```ts
// Preserve a minimum score of 1 so valid results are never ranked as zero.
const score = Math.max(1, 70 - index);
```

Unnecessary comment:

```ts
// Set score to 70 minus index.
const score = 70 - index;
```

Comments must remain accurate.

Outdated comments are more dangerous than missing comments.

Complex architectural decisions should be documented in an ADR rather than hidden inside source code comments.

---

## 7.11 Formatting

Formatting should be consistent across the repository.

Code should follow the project formatter and linting configuration.

Avoid manual formatting styles that conflict with repository standards.

Before committing:

- remove unused code;
- remove commented-out experiments;
- remove temporary logs;
- verify indentation;
- verify import order;
- run the formatter when available;
- run the build and tests.

Formatting should never become the main subject of code review.

Automation should handle formatting wherever possible.

---

## 7.12 Immutability and Side Effects

Prefer immutable transformations where practical.

Preferred:

```ts
const sortedResults = [...results].sort(
  (a, b) => b.score - a.score,
);
```

Avoid unexpected mutation of shared input:

```ts
results.sort((a, b) => b.score - a.score);
```

Side effects should be isolated and obvious.

Network access belongs in fetch modules.

Logging belongs in dedicated infrastructure.

Database writes belong in explicit persistence boundaries.

Pure functions should be preferred for parsing, validation and mapping because they are easier to test.

---

## 7.13 Configuration

Configuration values should not be scattered throughout the codebase.

Preferred:

```ts
const PROVIDER_TIMEOUT_MS = 3000;
const MAX_PROVIDER_RETRIES = 2;
```

Avoid unexplained magic numbers:

```ts
await withTimeout(provider.search(query), 3000);
```

Configuration should be centralized when shared by multiple modules.

Environment-specific values must use environment variables.

Secrets must never be committed to Git.

---

## 7.14 Backward Compatibility

Existing public contracts should not be changed casually.

Before modifying:

- `FinderResult`;
- `ParsedQuery`;
- `SearchProvider`;
- API response structures;
- provider registry metadata;

the impact on existing modules and tests must be evaluated.

Breaking changes require:

- explicit justification;
- migration planning;
- updated tests;
- updated documentation;
- an ADR when architecturally significant.

Prefer additive changes over destructive changes.

---

## 7.15 Dead Code and Temporary Code

Unused code must be removed.

Phoenix must not accumulate:

- abandoned functions;
- unused imports;
- obsolete provider experiments;
- commented-out implementation blocks;
- duplicate files;
- unexplained backup files.

Temporary experiments should be isolated and deleted or documented after evaluation.

The repository must represent the current system, not its abandoned history.

Git already preserves previous versions.

---

## 7.16 Code Review Readiness

Before code is considered ready for review, the contributor must verify:

- the code has one clear purpose;
- naming is understandable;
- types are explicit;
- errors are handled;
- logs are meaningful;
- tests cover the critical behavior;
- the build succeeds;
- documentation is updated;
- no secrets or temporary files are included;
- `git status` contains only intentional changes.

Code should reach review in a clean and understandable state.

---

## 7.17 Standard Validation Checklist

Before every commit involving code:

```text
□ Read the modified files from beginning to end
□ Remove temporary logs
□ Remove unused imports
□ Verify TypeScript types
□ Run relevant tests
□ Run the production build
□ Review git diff
□ Verify git status
□ Update documentation when required
```

---

## 7.18 Coding Standard Summary

Phoenix code must be:

- readable;
- modular;
- typed;
- testable;
- explicit;
- resilient;
- documented;
- consistent with the architecture.

The most important coding rule is simple:

> Code should make the system easier to understand and safer to change.

If a contribution increases complexity, that complexity must provide clear and measurable value.

---

# 8. Architecture Rules

Il Finder Engine non conosce i provider.

Il Provider Manager non conosce i marketplace.

Ogni provider comunica esclusivamente tramite il contratto definito dal Provider SDK.

---

# 9. Testing Strategy

Testing is a fundamental engineering activity within Phoenix.

Every critical component must be validated before it becomes part of the production platform.

Testing exists to detect regressions, verify expected behavior and ensure that architectural contracts remain stable over time.

Quality is built continuously, not inspected at the end.

---

## 9.1 Testing Philosophy

Phoenix follows a simple principle:

> If a component is important enough to exist, it is important enough to be tested.

Testing should provide confidence rather than merely increasing coverage statistics.

Good tests are:

- deterministic;
- isolated;
- repeatable;
- easy to understand;
- fast to execute.

---

## 9.2 Test Levels

Phoenix uses multiple complementary levels of testing.

### Unit Tests

Validate individual functions or modules in isolation.

Examples:

- parser
- validator
- mapper
- capability resolver
- provider resolver

---

### Integration Tests

Validate collaboration between multiple modules.

Examples:

- complete Provider SDK pipeline;
- Finder Engine execution;
- Provider Manager execution.

---

### End-to-End Validation

Verify that the complete request lifecycle behaves correctly.

Typical flow:

```
User Request
↓

Finder Engine

↓

Provider Manager

↓

Provider SDK

↓

Results

↓

Ranking

↓

Response
```

End-to-end tests should validate real execution scenarios whenever practical.

---

## 9.3 Provider Certification

Every provider must successfully complete a minimum certification process before production use.

Required validations include:

- Fetch
- Parser
- Validator
- Mapper
- Result generation
- Error handling

A provider is considered certified only after all mandatory tests succeed.

---

## 9.4 Parser Testing

The parser is responsible for extracting structured marketplace information.

Parser tests should verify:

- title extraction;
- URL extraction;
- identifier extraction;
- image extraction;
- price extraction;
- location extraction;
- duplicate handling.

Malformed HTML should not cause unexpected failures.

---

## 9.5 Validator Testing

Validators ensure extracted information satisfies Phoenix quality requirements.

Tests should verify:

- required fields;
- URL validation;
- duplicate rejection;
- invalid listings;
- malformed values.

Validators should reject incomplete data rather than allowing incorrect information into the system.

---

## 9.6 Mapper Testing

Mapper tests verify the transformation into the Phoenix domain model.

Typical assertions include:

- correct FinderResult generation;
- score calculation;
- snippet generation;
- source assignment;
- identifier preservation.

Every mapped object should satisfy the FinderResult contract.

---

## 9.7 Engine Testing

Finder Engine tests should verify:

- provider selection;
- provider execution;
- aggregation;
- ranking;
- sorting;
- summary generation.

The engine must remain independent from individual provider implementations.

---

## 9.8 Provider Manager Testing

Provider Manager tests should validate:

- concurrent execution;
- timeout handling;
- retry logic;
- execution reporting;
- provider isolation.

A failing provider must never prevent successful providers from returning results.

---

## 9.9 Error Testing

Failure scenarios deserve the same attention as successful executions.

Examples:

- timeout;
- network failure;
- malformed HTML;
- empty responses;
- invalid provider output;
- unexpected exceptions.

Phoenix should fail gracefully whenever recovery is possible.

---

## 9.10 Regression Testing

Whenever a bug is fixed, a corresponding automated test should be added whenever feasible.

This prevents the same defect from reappearing in future releases.

Regression tests gradually increase platform stability.

---

## 9.11 Build Verification

Before merging significant changes, contributors should verify:

- TypeScript compilation;
- production build;
- automated tests;
- linting (when enabled).

A successful build is a minimum requirement, not proof of correctness.

---

## 9.12 Test Data

Test data should be:

- representative;
- deterministic;
- minimal;
- documented.

Avoid depending on live marketplace data whenever static fixtures provide sufficient coverage.

Mock data should reflect realistic scenarios.

---

## 9.13 Continuous Improvement

Testing evolves together with the platform.

As Phoenix grows:

- new providers introduce new test cases;
- architectural changes require additional validation;
- previously manual checks should become automated whenever practical.

Testing is never considered complete.

---

## 9.14 Testing Checklist

Before approving a significant implementation:

```text
□ Unit tests pass
□ Provider tests pass
□ Integration tests pass
□ Build succeeds
□ No regression introduced
□ Error scenarios validated
□ Documentation updated
```

---

## 9.15 Testing Summary

Phoenix does not measure quality by the amount of code written.

Quality is measured by confidence.

Every successful test increases confidence that the platform behaves as intended.

Testing protects the architecture, supports future development and enables continuous evolution without sacrificing reliability.

---

## 10. Documentation Policy

Documentation is an integral part of the Phoenix engineering process.

A feature is not considered complete until both its implementation and its documentation have been updated.

Documentation preserves architectural knowledge, supports future development and ensures that engineering decisions remain understandable over time.

Code explains how the system works.

Documentation explains why it exists.

---

## 10.1 Documentation Principles

Phoenix documentation follows five fundamental principles:

- accuracy;
- clarity;
- consistency;
- traceability;
- maintainability.

Documentation should always reflect the current state of the platform.

Outdated documentation is considered a defect.

---

## 10.2 Documentation Hierarchy

Phoenix documentation is organized into multiple complementary levels.

### Architecture Documentation

Defines long-term architectural decisions.

Examples:

- Architecture Book
- ADRs
- Architecture Diagrams

---

### Engineering Documentation

Defines development standards.

Examples:

- Engineering Handbook
- Coding Standards
- Testing Strategy
- Provider Development Guide

---

### Operational Documentation

Tracks the daily evolution of the project.

Examples:

- Master Record
- Sprint Reports
- Decision Log
- Roadmap

---

### Project Documentation

Supports contributors and users.

Examples:

- README
- Installation Guide
- Deployment Notes
- Release Notes

---

## 10.3 Master Record

The Master Record represents the official historical timeline of Phoenix.

It summarizes every completed Sprint by recording:

- objectives;
- implemented features;
- architectural decisions;
- validated results;
- next mission.

The Master Record should provide enough context for any contributor to understand the current project status.

---

## 10.4 Architecture Decision Records (ADR)

Architectural decisions with long-term impact should be documented using ADRs.

Typical ADR topics include:

- architectural patterns;
- infrastructure changes;
- provider framework evolution;
- public API contracts;
- major refactoring.

Each ADR should explain:

- the context;
- the decision;
- the rationale;
- the consequences.

ADRs should not document temporary implementation details.

---

## 10.5 Sprint Documentation

Each significant Sprint should produce a concise engineering summary.

Typical Sprint documentation includes:

- completed objectives;
- files created or modified;
- architectural changes;
- validation performed;
- remaining work;
- recommended next steps.

Sprint reports create continuity between development sessions.

---

## 10.6 Knowledge Base

The Phoenix Knowledge Base serves as the permanent repository of engineering knowledge.

Its purpose is to organize information that should remain useful beyond individual development sessions.

Typical contents include:

- Architecture Book;
- Engineering Handbook;
- ADR collection;
- Provider Guides;
- Sprint archive;
- future planning;
- engineering notes.

The Knowledge Base should evolve continuously while remaining well structured and easy to navigate.

---

## 10.7 README

Every repository should include a clear and concise README.

At minimum it should explain:

- project purpose;
- installation;
- project structure;
- development workflow;
- useful commands;
- contribution guidelines.

The README is the primary entry point for new contributors.

---

## 10.8 Release Notes

Every important release should include Release Notes.

Release Notes should summarize:

- new features;
- improvements;
- bug fixes;
- breaking changes;
- migration instructions when necessary.

Release Notes should focus on changes relevant to users and contributors.

---

## 10.9 Documentation Maintenance

Documentation must evolve together with the software.

Whenever a significant change is introduced, contributors should verify whether documentation also requires updates.

Typical triggers include:

- new provider architecture;
- new SDK features;
- public API changes;
- workflow modifications;
- new engineering standards.

Documentation should never lag significantly behind implementation.

---

## 10.10 Versioning

Major documents should maintain explicit version numbers.

Example:

```
Architecture Book v1.0
Engineering Handbook v1.0
```

Major revisions should preserve historical versions whenever practical.

Version identifiers should remain consistent across the Knowledge Base.

---

## 10.11 Documentation Review

Documentation should periodically be reviewed for:

- obsolete information;
- duplicate content;
- inconsistent terminology;
- broken references;
- outdated workflows.

Reviewing documentation is part of maintaining software quality.

---

## 10.12 Documentation Checklist

Before closing a significant Sprint, verify:

```text
□ Master Record updated
□ Sprint summary completed
□ ADR created if required
□ Architecture documentation updated
□ Engineering Handbook updated when standards changed
□ README updated if needed
□ Release Notes prepared (when applicable)
□ Knowledge Base remains consistent
```

---

## 10.13 Documentation Summary

Phoenix treats documentation as a first-class engineering artifact.

Well-written documentation reduces onboarding time, preserves architectural intent and supports long-term maintainability.

The goal is simple:

> Future contributors should understand the system without needing to reconstruct its history from the source code alone.

---

# 11. Error Philosophy

Errors are an unavoidable part of every software system.

The objective of Phoenix is not to eliminate every error, but to detect, understand, isolate and recover from them whenever possible.

A resilient system is not one that never fails.

A resilient system is one that fails predictably, transparently and safely.

---

## 11.1 Core Principles

Phoenix follows five fundamental principles for error management:

- detect errors early;
- isolate failures;
- preserve system stability;
- provide useful diagnostics;
- recover whenever possible.

Errors should never propagate silently through the platform.

---

## 11.2 Error Categories

Phoenix distinguishes different categories of errors.

### Provider Errors

Examples:

- network timeout;
- marketplace unavailable;
- malformed HTML;
- invalid response.

Provider errors affect only the failing provider.

They must never interrupt execution of other providers.

---

### System Errors

Examples:

- configuration problems;
- missing environment variables;
- dependency failures;
- internal infrastructure failures.

These errors may affect the entire platform and require immediate attention.

---

### User Errors

Examples:

- invalid query;
- unsupported language;
- malformed request.

These should generate clear validation messages rather than unexpected failures.

---

### Programming Errors

Examples:

- null references;
- invalid assumptions;
- uncaught exceptions;
- contract violations.

Programming errors should be corrected, not hidden.

---

## 11.3 Fail Fast

Whenever an unrecoverable condition is detected, Phoenix should fail immediately.

Early failure prevents corrupted state from propagating through the system.

Example:

```ts
if (!provider.url) {
  throw new Error("Provider URL is missing.");
}
```

Failing immediately is often safer than continuing with invalid assumptions.

---

## 11.4 Error Isolation

One failing provider must never compromise the overall search process.

Example:

```
Provider A  ✓

Provider B  ✗

Provider C  ✓

↓

Results from A and C are still returned.
```

Isolation is one of the primary responsibilities of the Provider Manager.

---

## 11.5 Structured Logging

Every significant error should generate structured log entries.

Logs should answer:

- what happened;
- where it happened;
- which provider was involved;
- when it happened;
- why it happened;
- whether recovery succeeded.

Example:

```ts
finderLogger.error("provider execution failed", {
  provider: provider.name,
  durationMs,
  error,
});
```

Logs should support investigation without requiring code modification.

---

## 11.6 Error Messages

Error messages should be:

- precise;
- actionable;
- understandable.

Preferred:

```text
Provider timeout after 3000 ms.
```

Avoid:

```text
Unexpected error.
```

Messages intended for users should remain simple.

Messages intended for developers should include useful technical context.

---

## 11.7 Exception Handling

Exceptions should only be caught when meaningful recovery is possible.

Avoid:

```ts
try {
    ...
} catch {
}
```

Preferred:

```ts
try {
    ...
} catch (error) {
    finderLogger.error(...);

    return [];
}
```

Silent exception handling is prohibited.

---

## 11.8 Timeouts

Every network request should have a maximum execution time.

Infinite waiting is never acceptable.

Example:

```ts
withTimeout(provider.search(query), PROVIDER_TIMEOUT_MS);
```

Timeout values should remain configurable.

---

## 11.9 Retry Strategy

Retries should only be applied when failures are likely to be temporary.

Suitable cases include:

- transient network failures;
- temporary marketplace unavailability;
- connection resets.

Retries should not be applied to permanent validation errors.

Retry count must remain limited.

---

## 11.10 Observability

Phoenix should make system behavior observable.

Operational metrics may include:

- provider execution time;
- provider success rate;
- timeout frequency;
- retry count;
- number of returned results;
- rejected listings;
- validation failures.

Observability enables continuous improvement.

---

## 11.11 Resilience

Phoenix prioritizes graceful degradation.

When partial functionality remains available, the platform should continue operating.

Examples:

- unavailable provider;
- failed parser;
- temporary network issue.

The user should receive the best available result rather than no result whenever possible.

---

## 11.12 Monitoring

Future versions of Phoenix may include centralized monitoring dashboards.

Potential indicators include:

- provider health;
- average response time;
- provider availability;
- certification status;
- historical failures.

Monitoring complements logging.

Logging explains individual events.

Monitoring identifies long-term trends.

---

## 11.13 Error Documentation

Recurring failures should be documented.

Documentation may include:

- root cause;
- affected provider;
- mitigation;
- permanent solution;
- related ADR.

Knowledge gained from incidents should improve future reliability.

---

## 11.14 Error Checklist

Before approving a new provider verify:

```text
□ Network failures handled
□ Timeout implemented
□ Retry implemented where appropriate
□ Errors logged
□ Exceptions documented
□ Invalid data rejected
□ Provider isolation verified
□ Tests cover failure scenarios
```

---

## 11.15 Error Philosophy Summary

Phoenix does not fear errors.

Phoenix prepares for them.

Every error should increase understanding of the platform.

Every incident should improve future resilience.

Reliability is achieved not by avoiding failure, but by learning from it and engineering the system to recover safely.

---

# 12. Performance

Phoenix privilegia:

- affidabilità;
- stabilità;
- qualità dei risultati.

L'ottimizzazione viene dopo la correttezza.

---

# 13. Security

Security is a fundamental engineering responsibility.

Every component of Phoenix must be designed with security in mind from the beginning, rather than treating security as a later addition.

The objective is not only to protect infrastructure, but also to preserve user trust, provider relationships and long-term platform integrity.

Security is everyone's responsibility.

---

## 13.1 Security Principles

Phoenix follows six fundamental security principles:

- least privilege;
- secure by default;
- defense in depth;
- explicit authorization;
- data minimization;
- continuous monitoring.

Every engineering decision should consider its security implications.

---

## 13.2 Secrets Management

Sensitive information must never be stored in source code.

Examples include:

- API keys;
- database passwords;
- authentication tokens;
- private certificates;
- encryption keys.

Secrets must be stored using environment variables or dedicated secret management systems.

Example:

```text
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
```

Secrets must never be committed to Git.

---

## 13.3 Environment Configuration

Phoenix should separate configuration from implementation.

Typical environments include:

- Development
- Testing
- Staging
- Production

Each environment may use different:

- credentials;
- endpoints;
- logging levels;
- feature flags.

Configuration should remain centralized and documented.

---

## 13.4 Authentication

Authentication verifies user identity.

Future authentication mechanisms may include:

- email/password;
- OAuth providers;
- magic links;
- multi-factor authentication (MFA).

Authentication logic should remain centralized.

Credentials should never be processed outside trusted authentication modules.

---

## 13.5 Authorization

Authorization determines what an authenticated user is allowed to do.

Phoenix should apply the principle of least privilege.

Examples:

- anonymous users;
- registered users;
- Pro subscribers;
- administrators.

Permissions should always be explicit.

Implicit privilege escalation is prohibited.

---

## 13.6 Input Validation

All external input must be considered untrusted.

Examples include:

- user queries;
- HTTP requests;
- provider responses;
- environment variables;
- imported files.

Validation should occur before processing.

Invalid input should be rejected with clear error messages.

---

## 13.7 Provider Security

Marketplace providers operate outside Phoenix control.

Every provider implementation should:

- validate received data;
- reject malformed content;
- verify required fields;
- isolate failures;
- avoid executing untrusted content.

Provider code should never assume that marketplace responses are valid.

---

## 13.8 Network Security

Network communication should follow secure practices.

Recommended principles:

- HTTPS whenever available;
- explicit request timeouts;
- retry limits;
- certificate validation;
- secure headers.

Unencrypted communication should be avoided unless explicitly required.

---

## 13.9 Rate Limiting

Phoenix should respect marketplace resources.

Provider implementations should avoid excessive request frequency.

Rate limiting protects:

- marketplace stability;
- Phoenix reputation;
- long-term provider availability.

Responsible engineering builds sustainable integrations.

---

## 13.10 robots.txt and Marketplace Policies

Whenever applicable, providers should respect:

- robots.txt;
- published terms of service;
- documented API usage policies.

Phoenix aims to cooperate with marketplaces rather than abuse them.

Long-term sustainability is preferred over short-term gains.

---

## 13.11 Logging Security

Logs must never expose confidential information.

Avoid logging:

- passwords;
- authentication tokens;
- session identifiers;
- payment information;
- private personal data.

Operational logs should contain enough information for diagnosis without creating additional security risks.

---

## 13.12 Dependency Security

External dependencies should be minimized.

Before introducing a new dependency, contributors should evaluate:

- maintenance activity;
- security history;
- license compatibility;
- project maturity;
- long-term viability.

Unused dependencies should be removed.

Dependency updates should be reviewed regularly.

---

## 13.13 Data Protection

Phoenix should collect only information required to provide its services.

Examples:

- user accounts;
- search history;
- provider metadata.

Data retention should remain proportional to operational needs.

Personal information should be protected throughout its lifecycle.

---

## 13.14 Secure Development

Security should be integrated into the engineering workflow.

Before merging significant changes verify:

- input validation;
- authentication impact;
- authorization impact;
- logging safety;
- dependency review;
- documentation updates.

Security reviews should become part of normal development rather than exceptional events.

---

## 13.15 Incident Response

Security incidents should be handled systematically.

Typical response process:

```
Detection

↓

Isolation

↓

Investigation

↓

Mitigation

↓

Recovery

↓

Post-Incident Review
```

Every significant incident should improve future security.

---

## 13.16 Security Checklist

Before approving a major feature verify:

```text
□ No secrets committed
□ Environment variables documented
□ Inputs validated
□ Authorization verified
□ Logging reviewed
□ Provider validation implemented
□ HTTPS used where applicable
□ Dependencies reviewed
□ Documentation updated
```

---

## 13.17 Security Summary

Phoenix treats security as a continuous engineering discipline.

Good security is rarely visible.

Its success is measured by the absence of preventable incidents.

The ultimate objective is simple:

> Build a platform that users, contributors and partners can trust for the long term.

---

# 14. Long-Term Vision

L'obiettivo finale è costruire una piattaforma capace di:

- interrogare decine di marketplace;
- classificare i risultati;
- deduplicare automaticamente gli annunci;
- suggerire alternative pertinenti;
- apprendere dalle preferenze degli utenti.

---

# 15. Phoenix Values

Technology changes.

Programming languages evolve.

Frameworks come and go.

The values behind Phoenix are intended to remain stable.

These values guide architectural decisions, engineering practices and everyday development.

They define not only how Phoenix is built, but also why it is built this way.

---

## 15.1 Build for the Long Term

Phoenix is designed to last.

Every engineering decision should improve the platform's ability to evolve over many years.

Temporary shortcuts are acceptable only when they do not compromise long-term maintainability.

We build foundations before adding complexity.

---

## 15.2 Simplicity Creates Strength

Complex systems are difficult to understand, maintain and improve.

Whenever two solutions solve the same problem, Phoenix prefers the simpler one.

Simplicity is not the absence of sophistication.

It is the result of careful engineering.

---

## 15.3 Architecture Before Features

New functionality should never weaken the architecture.

Every feature should integrate naturally into the existing design.

Architecture is not documentation.

Architecture is the structure that allows continuous evolution.

---

## 15.4 Quality Before Speed

Fast development is valuable.

Reliable development is essential.

A feature delivered one week later but correctly engineered is more valuable than a feature delivered quickly with technical debt.

Quality is an investment, not a cost.

---

## 15.5 Continuous Learning

Every Sprint should improve both the software and the engineers building it.

Mistakes are expected.

Ignoring mistakes is unacceptable.

Every problem solved becomes knowledge for the future.

---

## 15.6 Documentation Preserves Knowledge

Code explains implementation.

Documentation preserves intent.

Knowledge should never depend on the memory of a single contributor.

Every important architectural decision should remain understandable years after it was made.

---

## 15.7 Testing Protects the Future

Tests are not written to prove that code works today.

They are written to ensure that tomorrow's changes do not silently break yesterday's achievements.

Every successful test protects future development.

---

## 15.8 Respect External Systems

Phoenix interacts with external marketplaces.

These platforms are partners in the ecosystem.

Providers should respect:

- published policies;
- reasonable request rates;
- platform stability;
- responsible engineering practices.

Long-term trust is more valuable than short-term gains.

---

## 15.9 Small Improvements Matter

Large transformations are built from many small improvements.

Every contribution should leave the project slightly better than before.

Examples include:

- clearer names;
- simpler functions;
- better tests;
- improved documentation;
- cleaner architecture.

Continuous improvement compounds over time.

---

## 15.10 Engineering Over Heroics

Phoenix should never depend on individual brilliance.

The system should remain understandable by any competent contributor.

Good engineering creates systems that are easy to maintain.

Great engineering creates systems that remain simple even as they grow.

---

## 15.11 Shared Ownership

Every contributor shares responsibility for:

- code quality;
- architecture;
- documentation;
- testing;
- security;
- maintainability.

Quality is not delegated.

Quality belongs to everyone.

---

## 15.12 Leave the Project Better

Every commit should improve at least one aspect of the platform.

This improvement may be:

- cleaner code;
- stronger architecture;
- better documentation;
- additional tests;
- improved reliability.

The cumulative effect of many small improvements creates exceptional software.

---

## 15.13 The Phoenix Engineering Manifesto

We build software that solves real problems.

We prefer clarity over cleverness.

We prefer architecture over shortcuts.

We prefer stability over speed.

We document what we build.

We test what we change.

We automate only what has proven its value.

We respect the platforms we integrate with.

We improve continuously.

We leave the project better than we found it.

---

## 15.14 Final Principle

The success of Phoenix will not be measured by the amount of code written.

It will be measured by the value created, the quality maintained and the trust earned.

Every architectural decision...

Every line of code...

Every provider...

Every document...

should contribute to one objective:

> Build a platform that becomes stronger every time it evolves.

---

# Conclusion

Phoenix non cresce aggiungendo codice.

Phoenix cresce mantenendo ordine.

Ogni riga di codice deve rendere la piattaforma più semplice da evolvere, non più difficile da mantenere.

L'architettura è il patrimonio più importante del progetto.