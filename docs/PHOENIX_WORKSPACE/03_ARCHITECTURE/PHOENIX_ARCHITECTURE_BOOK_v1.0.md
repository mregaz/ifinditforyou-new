Part I — Vision
# PHOENIX ARCHITECTURE BOOK
## Version 1.0

**Project:** Phoenix Core

**Status:** Active

**Author:** Mauro Regazzoni & ChatGPT

---

# Chapter 1 — Architectural Vision

## 1.1 Purpose

Phoenix was created with a clear objective:

to build a platform capable of querying multiple online marketplaces through a single, coherent and extensible architecture.

The challenge is not simply retrieving data.

The real challenge is retrieving data while keeping the platform maintainable, scalable and resilient over time.

Architecture is the foundation that makes this possible.

---

## 1.2 The Architectural Problem

Every marketplace is different.

Each one has its own:

- HTML structure
- Search mechanism
- URL conventions
- Pagination model
- Data organization
- Naming conventions

Developing each provider independently would quickly lead to duplicated logic, inconsistent behavior and increasing maintenance costs.

Phoenix solves this problem by introducing a common abstraction layer that isolates marketplace-specific implementations from the Core architecture.

---

## 1.3 Phoenix Core

The Phoenix Core is completely independent from external marketplaces.

It has no knowledge of:

- Anibis
- annonces.ch
- Ricardo
- Tutti
- eBay
- or any future provider.

Instead, it communicates exclusively through stable interfaces and contracts.

Each marketplace is simply considered an external data source.

This architectural independence allows the Core to remain stable while the ecosystem of providers continuously evolves.

---

## 1.4 Layered Architecture

Phoenix follows a strict layered architecture.

```text
                 User
                  │
                  ▼
             Frontend UI
                  │
                  ▼
             REST API Layer
                  │
                  ▼
            Finder Engine
                  │
                  ▼
        Capability Resolver
                  │
                  ▼
         Provider Resolver
                  │
                  ▼
         Provider Manager
                  │
                  ▼
            Provider SDK
                  │
                  ▼
     External Marketplaces
```

Each layer communicates only with the layer immediately below it.

Cross-layer dependencies are intentionally avoided to preserve modularity and simplify future evolution.

---

## 1.5 Separation of Concerns

Every architectural component has exactly one responsibility.

Examples:

- The Engine orchestrates the search process.
- The Capability Resolver selects the search domain.
- The Provider Resolver chooses the appropriate providers.
- The Provider Manager executes providers safely.
- Fetch retrieves raw HTML.
- Parser extracts structured information.
- Validator verifies data quality.
- Mapper converts marketplace-specific objects into standardized Finder results.

Keeping responsibilities isolated makes every component easier to understand, test and maintain.

---

## 1.6 Stable Contracts

Communication between architectural layers is based on stable contracts.

Examples include:

- ParsedQuery
- SearchProvider
- MarketplaceListing
- FinderResult

These contracts define the common language of the platform.

As long as contracts remain stable, implementations may evolve independently.

---

## 1.7 Evolution Strategy

Phoenix is designed for continuous growth.

New functionality should be introduced by adding new components rather than modifying existing ones whenever possible.

This philosophy minimizes regressions, protects the stability of the Core and allows the platform to scale organically over time.

---

## 1.8 Long-Term Vision

The long-term objective of Phoenix is to become a unified search orchestration platform capable of:

- querying dozens of marketplaces;
- ranking heterogeneous results;
- removing duplicate listings;
- suggesting relevant alternatives;
- learning from user behavior and preferences;
- integrating additional search intelligence over time.

Achieving these goals depends on preserving a stable and modular architecture.

---

## Chapter Summary

Phoenix is not built around marketplaces.

It is built around architectural principles.

Marketplaces will change.

Technologies will evolve.

Providers will come and go.

The architecture must remain stable.

This principle guides every technical decision within the Phoenix project.

---

## Document Status

**Version:** 1.0

**Status:** Stable

**Related Documents**

- PHOENIX_ENGINEERING_HANDBOOK_v1.0
- PROVIDER_DEVELOPMENT_GUIDE_v1.0
- ADR-001
- ADR-002

Part II — Core Architecture

# Chapter 2 — Phoenix Global Architecture

## 2.1 Overview

Phoenix is organized as a collection of independent architectural layers.

Each layer has a single responsibility and communicates with the next layer through stable contracts.

This modular design allows the platform to evolve without affecting the Core.

---

## 2.2 High-Level Flow

A typical search follows this sequence:

```text
User Request
      │
      ▼
Frontend
      │
      ▼
REST API
      │
      ▼
Finder Engine
      │
      ▼
Capability Resolver
      │
      ▼
Provider Resolver
      │
      ▼
Provider Manager
      │
      ▼
Provider SDK
      │
      ▼
Marketplace
      │
      ▼
Provider SDK
      │
      ▼
Provider Manager
      │
      ▼
Finder Engine
      │
      ▼
API Response
      │
      ▼
Frontend
```

The Engine coordinates the entire process without depending on any marketplace implementation.

---

## 2.3 Architectural Layers

Phoenix is composed of the following major layers.

### Frontend

Responsible for user interaction.

Its only responsibility is collecting user input and displaying results.

Business logic is intentionally excluded.

---

### REST API

Acts as the entry point of the backend.

Responsibilities:

- validate requests;
- invoke the Finder Engine;
- return standardized responses.

---

### Finder Engine

The Finder Engine is the orchestration layer.

Responsibilities include:

- coordinating searches;
- invoking the Capability Resolver;
- executing providers;
- collecting results;
- producing the final FinderResponse.

The Engine never communicates directly with marketplaces.

---

### Capability Resolver

Determines which search capability best matches the user query.

Examples:

- vehicles
- watches
- electronics
- general-marketplace

This decision influences which providers will be executed.

---

### Provider Resolver

Selects the providers capable of handling the requested capability.

The selection is based on the Provider Registry.

---

### Provider Manager

Responsible for safely executing providers.

Responsibilities:

- timeout management;
- retry strategy;
- execution logging;
- error isolation;
- execution reports.

Failures of individual providers never stop the global search.

---

### Provider SDK

The Provider SDK defines the standard pipeline implemented by every provider.

```
Fetch
    ↓
Parser
    ↓
Validator
    ↓
Mapper
```

Every provider follows exactly this structure.

---

### External Marketplace

Each marketplace remains an independent external system.

Phoenix never assumes internal knowledge about marketplace implementations beyond what is exposed through each provider.

---

## 2.4 Architectural Dependency Rule

Dependencies always point downward.

Allowed:

Frontend → API

API → Engine

Engine → Resolver

Resolver → Provider Manager

Provider Manager → Provider SDK

Forbidden:

Provider → Engine

Marketplace → Engine

Parser → API

Cross-layer dependencies are intentionally prohibited.

---

## 2.5 Benefits

This architecture provides:

- modularity;
- maintainability;
- scalability;
- resilience;
- testability;
- provider independence;
- long-term evolution.

Every architectural decision within Phoenix supports one or more of these goals.
# Chapter 3 — Finder Engine

## 3.1 Purpose

The Finder Engine is the central orchestration component of Phoenix.

It coordinates the complete search workflow while remaining completely independent from marketplace implementations.

Its responsibility is not to retrieve data directly.

Its responsibility is to orchestrate the entire search process.

---

## 3.2 Responsibilities

The Finder Engine is responsible for:

- receiving a parsed query;
- determining the search capability;
- requesting the appropriate providers;
- coordinating provider execution;
- collecting normalized results;
- sorting results;
- generating the final response.

Every search performed by Phoenix passes through the Finder Engine.

---

## 3.3 What the Engine Does Not Know

The Engine never contains marketplace-specific logic.

It has no knowledge of:

- HTML structures;
- CSS selectors;
- marketplace URLs;
- pagination models;
- provider implementations.

These responsibilities belong entirely to the Provider SDK.

This separation guarantees long-term maintainability.

---

## 3.4 Search Workflow

The execution flow can be summarized as follows.

```text
Incoming Query
      │
      ▼
Parse Query
      │
      ▼
Capability Resolver
      │
      ▼
Provider Resolver
      │
      ▼
Provider Manager
      │
      ▼
Collect Results
      │
      ▼
Sort Results
      │
      ▼
Generate FinderResponse
```

The Engine acts as the conductor of the entire search pipeline.

---

## 3.5 Orchestration Philosophy

The Finder Engine follows a strict orchestration model.

It delegates every specialized task to dedicated components.

Examples:

- capability selection → Capability Resolver
- provider selection → Provider Resolver
- execution management → Provider Manager
- data extraction → Provider SDK

This minimizes coupling and keeps the Engine simple.

---

## 3.6 Stability

The Finder Engine is expected to change very rarely.

Adding a new marketplace should never require modifications to the Engine.

Instead, new functionality is introduced by extending the Provider ecosystem.

This design protects the stability of the Core architecture.

---

## 3.7 Benefits

Keeping the Engine independent provides several advantages:

- predictable behavior;
- simplified testing;
- easier maintenance;
- provider scalability;
- reduced regression risk;
- long-term architectural stability.

---

## Chapter Summary

The Finder Engine is the brain of Phoenix.

It orchestrates every search without knowing how individual marketplaces work.

This strict separation between orchestration and implementation is one of the fundamental principles of the Phoenix architecture.
# Chapter 4 — Capability Resolver

## 4.1 Purpose

The Capability Resolver is responsible for determining the nature of the user's search.

Its objective is to classify every query into one of the supported search capabilities before any provider is selected.

This represents the first decision made by the Finder Engine after receiving a parsed query.

---

## 4.2 Why a Capability Resolver?

Different marketplaces specialize in different categories.

Some providers focus on:

- vehicles
- watches
- electronics
- real estate
- jobs
- general marketplaces

Selecting providers before understanding the search intent would lead to unnecessary executions and lower-quality results.

The Capability Resolver solves this problem by identifying the most appropriate search domain.

---

## 4.3 Current Capabilities

At the current stage of Phoenix, the supported capabilities are:

- general-marketplace
- vehicles
- watches
- electronics

Additional capabilities can be introduced without modifying the Finder Engine.

---

## 4.4 Resolution Process

The resolver analyzes the normalized query and evaluates keywords, patterns and predefined rules.

Example:

```text
"vespa 300 gts usata"
        │
        ▼
Capability
        │
        ▼
vehicles
```

Another example:

```text
"rolex submariner"
        │
        ▼
Capability
        │
        ▼
watches
```

The output of the resolver is a single capability identifier.

---

## 4.5 Architectural Role

The Capability Resolver does not know:

- providers
- marketplaces
- countries
- execution logic

Its only responsibility is classification.

Once a capability has been identified, the decision is passed to the Provider Resolver.

This strict separation keeps the architecture modular.

---

## 4.6 Extensibility

New capabilities can be introduced at any time.

Examples:

- bicycles
- musical instruments
- books
- collectibles
- industrial equipment
- boats
- services

The Finder Engine remains completely unchanged.

Only the resolver rules and provider registrations evolve.

---

## 4.7 Future Evolution

The current implementation is rule-based.

Future versions may introduce:

- Natural Language Processing (NLP)
- Machine Learning classifiers
- semantic query understanding
- multilingual intent recognition
- user personalization

These improvements will remain internal to the resolver and will not affect the surrounding architecture.

---

## 4.8 Benefits

Introducing a dedicated Capability Resolver provides:

- better provider selection;
- reduced execution time;
- fewer unnecessary requests;
- improved scalability;
- easier maintenance;
- complete independence between classification and execution.

---

## Chapter Summary

The Capability Resolver answers the first architectural question of every search:

**"What is the user looking for?"**

By determining the search capability before selecting providers, Phoenix ensures that every search starts with the correct execution strategy while preserving the independence of the Core architecture.
# Chapter 5 — Provider Resolver

## 5.1 Purpose

The Provider Resolver is responsible for selecting which providers should participate in a search.

Unlike the Capability Resolver, which determines *what* the user is looking for, the Provider Resolver determines *where* Phoenix should search.

The selection is entirely based on metadata registered in the Provider Registry.

---

## 5.2 Architectural Position

Within the search pipeline, the Provider Resolver operates immediately after the Capability Resolver.

```text
Parsed Query
      │
      ▼
Capability Resolver
      │
      ▼
Provider Resolver
      │
      ▼
Provider Manager
```

Its output is a collection of providers that satisfy the requested search capability.

---

## 5.3 Provider Registry

The Provider Resolver never contains hardcoded knowledge about providers.

Instead, every provider is declared inside the Provider Registry.

Each registration includes metadata such as:

- provider identifier;
- enabled status;
- execution priority;
- supported countries;
- supported languages;
- supported capabilities.

The resolver simply evaluates this information.

---

## 5.4 Selection Process

The Provider Resolver performs several filtering steps.

Typical evaluation criteria include:

- provider enabled;
- matching capability;
- supported country;
- supported language;
- execution priority.

Only providers satisfying all required conditions are selected.

---

## 5.5 Example

Suppose the user searches:

```text
vespa 300 gts
```

The Capability Resolver identifies:

```text
vehicles
```

The Provider Resolver then evaluates every registered provider.

Example:

```text
Anibis
Capability: vehicles
Country: CH
Enabled: Yes

Result:
Selected
```

Another provider supporting only watches would simply be ignored.

---

## 5.6 Independence

The Provider Resolver never executes providers.

It never downloads HTML.

It never parses data.

Its only responsibility is deciding which providers should be executed.

Execution is delegated entirely to the Provider Manager.

---

## 5.7 Future Evolution

The Provider Resolver has been designed to support increasingly sophisticated selection strategies.

Future versions may consider:

- user subscription plan;
- preferred countries;
- marketplace reputation;
- historical provider performance;
- provider availability;
- provider health monitoring;
- execution cost.

These additions can be implemented without changing the Finder Engine.

---

## 5.8 Geographic Resolution

The current implementation already supports provider metadata describing countries.

This architectural decision prepares Phoenix for future geographic search modes such as:

- Country Search
- European Search
- Global Search

The Provider Resolver will automatically select providers belonging to the requested geographic scope.

No changes to the Finder Engine will be required.

---

## 5.9 Benefits

Separating provider selection from provider execution provides several advantages:

- modularity;
- scalability;
- provider independence;
- simplified testing;
- centralized decision making;
- easier maintenance.

The architecture remains stable even as the number of supported providers continues to grow.

---

## Chapter Summary

The Provider Resolver answers the second architectural question of every search:

**"Where should Phoenix search?"**

By selecting providers through metadata instead of hardcoded logic, Phoenix remains flexible, extensible and capable of supporting an ever-growing ecosystem of marketplaces.
# Chapter 6 — Provider Manager

## 6.1 Purpose

The Provider Manager is responsible for executing providers in a safe, controlled and resilient manner.

Its objective is to isolate provider execution from the rest of the system while ensuring that failures never compromise the overall search process.

The Finder Engine delegates every provider execution to the Provider Manager.

---

## 6.2 Responsibilities

The Provider Manager is responsible for:

- executing selected providers;
- monitoring execution time;
- enforcing execution timeouts;
- collecting execution metrics;
- isolating provider failures;
- generating execution reports;
- returning normalized results to the Finder Engine.

It acts as the execution layer of the Phoenix architecture.

---

## 6.3 Execution Workflow

Every search follows the same execution sequence.

```text
Provider Resolver
        │
        ▼
Selected Providers
        │
        ▼
Provider Manager
        │
        ├────────► Provider A
        │
        ├────────► Provider B
        │
        ├────────► Provider C
        │
        ▼
Execution Report
        │
        ▼
Finder Engine
```

The Provider Manager coordinates execution while remaining completely independent from provider implementations.

---

## 6.4 Failure Isolation

One of the most important architectural principles is failure isolation.

If one provider:

- becomes unavailable;
- returns invalid HTML;
- exceeds the timeout;
- throws an exception;

the remaining providers continue executing normally.

The search is never interrupted because of a single provider failure.

---

## 6.5 Timeout Management

Every provider execution is protected by a timeout.

If the timeout expires:

- execution is aborted;
- the provider is marked as failed;
- the remaining providers continue normally.

Timeout protection prevents a slow marketplace from degrading the user experience.

---

## 6.6 Execution Reports

After every search, the Provider Manager produces an execution report.

Each provider generates information such as:

- provider name;
- execution status;
- execution duration;
- number of results;
- possible errors.

Example:

```text
Provider: anibis
Status: Success
Duration: 1284 ms
Results: 5
```

These reports are fundamental for monitoring system health.

---

## 6.7 Logging

The Provider Manager integrates structured logging.

Execution logs allow developers to understand:

- which providers executed;
- how long they required;
- which providers failed;
- how many results were produced.

Logging is an essential diagnostic tool during development and production.

---

## 6.8 Resilience

The Provider Manager is designed around resilience.

Its philosophy is simple:

A provider may fail.

The search must not.

This principle ensures that Phoenix remains operational even when external marketplaces experience problems.

---

## 6.9 Future Evolution

The current implementation provides a solid execution framework.

Future improvements may include:

- parallel execution optimization;
- adaptive timeout policies;
- automatic retry strategies;
- provider health scoring;
- execution statistics;
- circuit breakers;
- intelligent provider scheduling.

These improvements can be introduced without changing the Finder Engine.

---

## 6.10 Benefits

The Provider Manager provides:

- execution safety;
- provider isolation;
- predictable behaviour;
- improved diagnostics;
- better scalability;
- production readiness.

Without this layer, Phoenix would become increasingly fragile as the number of providers grows.

---

## Chapter Summary

The Provider Manager is the execution backbone of Phoenix.

It transforms a collection of independent providers into a reliable and resilient search platform by ensuring that failures remain isolated and execution remains controlled under all circumstances.
# Chapter 7 — Provider Registry

## 7.1 Purpose

The Provider Registry is the central catalog of every provider available within Phoenix.

Its purpose is to describe providers through metadata rather than hardcoded logic.

The Registry allows the system to discover providers dynamically without modifying the Finder Engine.

---

## 7.2 Why a Registry?

Without a registry, every new provider would require changes throughout the codebase.

This approach does not scale.

Phoenix instead registers every provider once and allows the architecture to make decisions using provider metadata.

The Registry therefore becomes the single source of truth for provider discovery.

---

## 7.3 Registered Provider

Each provider is represented by a metadata object.

Typical information includes:

- unique identifier;
- provider implementation;
- enabled status;
- execution priority;
- supported countries;
- supported languages;
- supported capabilities.

Example:

```text
ID: anibis

Enabled: true

Priority: 90

Countries:
- CH

Languages:
- de
- fr
- it

Capabilities:
- general-marketplace
- vehicles
```

The registry stores only metadata.

Business logic remains inside the provider itself.

---

## 7.4 Architectural Role

The Registry does not execute providers.

It does not parse HTML.

It does not classify queries.

Its only responsibility is describing available providers.

Other architectural components use this information to make decisions.

---

## 7.5 Dynamic Discovery

When a search begins:

```text
Finder Engine
        │
        ▼
Capability Resolver
        │
        ▼
Provider Resolver
        │
        ▼
Provider Registry
        │
        ▼
Matching Providers
```

This mechanism allows providers to be added or removed without affecting the Core architecture.

---

## 7.6 Provider Metadata

Metadata allows Phoenix to make intelligent decisions.

Examples include:

- provider availability;
- supported countries;
- supported languages;
- supported categories;
- execution priority.

Future versions may introduce additional metadata such as:

- provider reliability;
- average response time;
- quality score;
- maintenance status.

The architecture can evolve simply by extending provider metadata.

---

## 7.7 Extensibility

Adding a new provider follows a predictable process:

1. Develop the provider.
2. Register it.
3. Enable it.

No changes to the Finder Engine are required.

This principle significantly reduces maintenance costs.

---

## 7.8 Future Evolution

The Registry has been designed to support future capabilities such as:

- geographic search;
- marketplace reputation;
- provider health monitoring;
- subscription-based provider selection;
- AI-assisted provider ranking.

Because these decisions are metadata-driven, the surrounding architecture remains unchanged.

---

## 7.9 Benefits

The Provider Registry provides:

- centralized provider management;
- simplified scalability;
- dynamic provider discovery;
- cleaner architecture;
- lower maintenance costs;
- future-proof extensibility.

It represents one of the key architectural foundations of Phoenix.

---

## Chapter Summary

The Provider Registry transforms providers from hardcoded components into configurable architectural resources.

By describing providers through metadata instead of embedding knowledge inside the Engine, Phoenix achieves a flexible architecture capable of growing without increasing complexity.
# Chapter 8 — Provider SDK

Part III — Provider Engineering

## 8.1 Purpose

The Provider SDK defines the architectural standard that every Phoenix provider must follow.

Its purpose is to guarantee consistency, maintainability and interoperability across all providers, regardless of the marketplace they integrate.

Every provider implements the same execution pipeline.

This standardization is one of the fundamental principles of the Phoenix architecture.

---

## 8.2 Why an SDK?

Every marketplace exposes information differently.

Without a common development standard, each provider would evolve independently, resulting in inconsistent implementations and increasing maintenance costs.

The Provider SDK eliminates this problem by defining a single architecture shared by every provider.

---

## 8.3 Standard Pipeline

Every provider follows exactly the same execution flow.

```text
Incoming Query
       │
       ▼
Fetch
       │
       ▼
Parser
       │
       ▼
Validator
       │
       ▼
Mapper
       │
       ▼
FinderResult[]
```

No provider is allowed to bypass any stage of the pipeline.

---

## 8.4 Fetch

The Fetch component is responsible for retrieving raw data from the marketplace.

Typical responsibilities include:

- building search URLs;
- performing HTTP requests;
- handling response status codes;
- returning raw HTML.

No parsing occurs at this stage.

---

## 8.5 Parser

The Parser transforms raw marketplace content into structured marketplace objects.

Responsibilities include:

- locating listing cards;
- extracting raw fields;
- collecting marketplace-specific data.

The Parser never performs validation or business decisions.

---

## 8.6 Validator

The Validator verifies that extracted data satisfies Phoenix quality requirements.

Typical validation rules include:

- identifier present;
- title present;
- valid URL;
- supported URL format;
- duplicate rejection;
- invalid listing rejection.

Only valid marketplace objects continue through the pipeline.

---

## 8.7 Mapper

The Mapper converts marketplace-specific objects into the standardized Phoenix format.

Every provider produces exactly the same output type:

```text
MarketplaceListing
        │
        ▼
FinderResult
```

This normalization allows the Finder Engine to process results without knowing their origin.

---

## 8.8 Standard Output

Regardless of the marketplace, every provider ultimately returns:

- id;
- title;
- source;
- url;
- snippet;
- score.

Additional marketplace information may be preserved internally, but the public contract always remains consistent.

---

## 8.9 Benefits

The Provider SDK provides:

- implementation consistency;
- simplified onboarding;
- reusable development patterns;
- isolated responsibilities;
- easier debugging;
- predictable behaviour.

Every provider behaves exactly like every other provider.

---

## 8.10 Provider Certification

A provider is considered production-ready only when every SDK stage operates correctly.

Certification requires verification that:

- Fetch retrieves data correctly;
- Parser extracts complete objects;
- Validator rejects invalid objects;
- Mapper produces valid FinderResult instances;
- automated tests pass successfully.

Only certified providers should be enabled inside the Provider Registry.

---

## 8.11 Extensibility

The SDK has been designed to evolve.

Future providers may integrate:

- REST APIs;
- GraphQL services;
- XML feeds;
- JSON endpoints;
- browser automation;
- AI-assisted extraction.

Regardless of the underlying technology, every provider must still expose the same standardized pipeline.

---

## Chapter Summary

The Provider SDK defines the engineering standard of Phoenix.

Rather than allowing every provider to evolve independently, Phoenix enforces a common development model based on a predictable execution pipeline.

This guarantees consistency, maintainability and long-term scalability across the entire provider ecosystem.
# Chapter 9 — Provider Pipeline

## 9.1 Purpose

The Provider Pipeline defines the complete lifecycle of data inside every Phoenix provider.

Rather than mixing data retrieval, parsing, validation and normalization into a single component, Phoenix separates the entire process into distinct stages.

Each stage has one responsibility and one responsibility only.

This architecture improves readability, maintainability and testability.

---

## 9.2 Pipeline Overview

Every provider follows exactly the same execution pipeline.

```text
               User Query
                    │
                    ▼
                Fetch Stage
                    │
                    ▼
             Raw HTML Response
                    │
                    ▼
               Parser Stage
                    │
                    ▼
          Marketplace Listings
                    │
                    ▼
             Validator Stage
                    │
                    ▼
             Valid Listings
                    │
                    ▼
               Mapper Stage
                    │
                    ▼
             FinderResult[]
```

Each stage produces the input for the next stage.

No stage skips another.

---

# 9.3 Fetch Stage

## Purpose

The Fetch stage retrieves raw data from the external marketplace.

Its only responsibility is communication with the remote system.

Typical responsibilities include:

- building search URLs;
- sending HTTP requests;
- handling HTTP status codes;
- managing request headers;
- returning raw HTML.

The Fetch stage never performs parsing.

It simply retrieves data.

---

## Example

```text
Input

"vespa 300 gts"

↓

HTTP GET

↓

https://marketplace/search?q=vespa+300+gts

↓

Raw HTML
```

---

# 9.4 Parser Stage

## Purpose

The Parser transforms raw HTML into structured marketplace objects.

This stage understands the internal HTML structure of a marketplace.

Typical operations include:

- locating listing cards;
- extracting titles;
- extracting URLs;
- extracting prices;
- extracting locations;
- extracting descriptions;
- extracting marketplace identifiers.

The Parser never validates extracted data.

---

## Example

```text
HTML

↓

Listing Card

↓

MarketplaceListing
```

---

# 9.5 Validator Stage

## Purpose

The Validator ensures that extracted data satisfies Phoenix quality requirements.

Only valid listings continue through the pipeline.

Typical validation rules include:

- identifier exists;
- title exists;
- URL exists;
- supported URL format;
- duplicate rejection;
- invalid entries removed.

The Validator protects the Core from malformed marketplace data.

---

## Example

```text
MarketplaceListing

↓

Missing URL

↓

Rejected
```

---

# 9.6 Mapper Stage

## Purpose

The Mapper converts marketplace-specific objects into the universal Phoenix format.

Every marketplace has different internal structures.

The Mapper hides these differences.

Example:

```text
AnibisListing

↓

FinderResult
```

or

```text
RicardoListing

↓

FinderResult
```

The Finder Engine always receives the same object type.

---

# 9.7 Separation of Responsibilities

Each pipeline stage owns a single responsibility.

| Stage | Responsibility |
|--------|----------------|
| Fetch | Retrieve data |
| Parser | Extract information |
| Validator | Verify quality |
| Mapper | Normalize objects |

This separation dramatically simplifies debugging.

---

# 9.8 Error Isolation

Failures remain isolated.

Examples:

A Fetch failure never affects parsing logic.

A Parser bug never modifies validation rules.

A Validator bug never changes mapping behaviour.

This isolation makes providers easier to maintain.

---

# 9.9 Example — Anibis Provider

The Anibis provider follows the complete SDK pipeline.

```text
fetch.ts
      │
      ▼
parser.ts
      │
      ▼
validator.ts
      │
      ▼
mapper.ts
      │
      ▼
FinderResult[]
```

This provider serves as the reference implementation for future providers.

---

# 9.10 Future Pipeline Evolution

The pipeline has been designed to support additional stages if required.

Possible future extensions include:

- HTML cleaning;
- AI-assisted extraction;
- duplicate detection;
- image analysis;
- translation;
- marketplace enrichment;
- semantic scoring.

New stages can be introduced without modifying the surrounding architecture.

---

# 9.11 Benefits

The Provider Pipeline provides:

- predictable behaviour;
- isolated responsibilities;
- reusable development patterns;
- simplified testing;
- easier maintenance;
- provider consistency;
- long-term scalability.

Every provider developed for Phoenix follows the same engineering standard.

---

## Chapter Summary

The Provider Pipeline is the engineering backbone of every Phoenix provider.

By separating retrieval, extraction, validation and normalization into independent stages, Phoenix achieves a clean, modular and highly maintainable architecture.

This standardized pipeline allows every provider to integrate seamlessly with the Finder Engine while remaining completely independent from every other provider.
# Chapter 10 — Testing & Quality Assurance

Part IV — Engineering Excellence

## 10.1 Purpose

A robust architecture is valuable only if its behaviour remains stable over time.

Phoenix therefore integrates testing and quality assurance into its engineering process rather than treating them as optional activities.

Every architectural layer must be verifiable.

---

## 10.2 Quality Philosophy

Phoenix follows a simple engineering principle:

> **Every architectural decision should be testable.**

Testing is not an afterthought.

It is part of the architecture itself.

This philosophy enables the project to grow while maintaining confidence in every change.

---

## 10.3 Testing Strategy

Testing occurs at multiple levels.

```text
                 Unit Tests
                      │
                      ▼
            Component Validation
                      │
                      ▼
             Provider Certification
                      │
                      ▼
              Build Verification
                      │
                      ▼
           Production Readiness
```

Each level increases confidence before new code reaches production.

---

## 10.4 Unit Testing

Individual components are tested independently.

Examples include:

- Capability Resolver
- Provider Resolver
- Parser
- Validator
- Mapper

Unit tests verify that each component behaves correctly in isolation.

---

## 10.5 Provider Certification

A provider is considered ready only after completing the entire SDK pipeline successfully.

Certification verifies:

- Fetch retrieves marketplace data.
- Parser extracts valid objects.
- Validator rejects invalid entries.
- Mapper produces valid `FinderResult` objects.
- Integration with the Provider Manager succeeds.

Only certified providers should be enabled in the Provider Registry.

---

## 10.6 Validation Rules

Phoenix enforces strict validation before data reaches the Finder Engine.

Typical checks include:

- identifier present;
- title present;
- valid URL;
- supported URL format;
- duplicate detection;
- malformed object rejection.

Validation protects the Core against inconsistent marketplace data.

---

## 10.7 Execution Monitoring

Every search generates execution metrics.

Typical information includes:

- provider name;
- execution status;
- execution duration;
- number of returned results;
- detected failures.

These metrics provide immediate visibility into provider behaviour.

---

## 10.8 Structured Logging

Phoenix records execution events using structured logging.

Typical logs include:

```text
Provider: anibis

Status: Success

Duration: 1326 ms

Results: 5
```

Structured logs simplify debugging, performance analysis and operational monitoring.

---

## 10.9 Build Verification

Every architectural change must preserve system integrity.

Before code is considered complete:

- TypeScript compilation succeeds.
- Tests pass.
- Provider Registry remains valid.
- The application builds successfully.

A successful build confirms that all architectural contracts remain intact.

---

## 10.10 Regression Prevention

As Phoenix grows, preventing regressions becomes increasingly important.

Automated testing ensures that:

- existing providers continue working;
- new providers do not introduce failures;
- architectural contracts remain stable.

Regression testing protects previous work while allowing continuous evolution.

---

## 10.11 Continuous Improvement

Testing evolves together with the architecture.

Future quality improvements may include:

- performance benchmarks;
- load testing;
- provider health monitoring;
- automated quality scoring;
- contract testing;
- end-to-end integration testing.

The testing framework is designed to expand alongside the platform.

---

## 10.12 Benefits

The Phoenix quality strategy provides:

- architectural stability;
- predictable behaviour;
- safer refactoring;
- easier debugging;
- faster development;
- higher confidence during releases.

Quality assurance becomes an architectural capability rather than a development task.

---

## Chapter Summary

Testing is an integral part of the Phoenix architecture.

By combining automated testing, provider certification, structured logging and build verification, Phoenix ensures that architectural quality is maintained as the platform evolves.

A scalable platform is not defined only by how it grows, but also by how safely it can continue to evolve.

Part V — Governance (da completare)

# Chapter 11 — Architectural Governance

## 11.1 Purpose

Architecture does not remain healthy by accident.

As Phoenix evolves, new features, providers and contributors will continuously introduce change.

Architectural Governance defines the principles, processes and responsibilities that ensure the architecture evolves without losing consistency.

Governance protects the long-term integrity of the platform.

---

## 11.2 Governance Philosophy

Phoenix follows one fundamental principle:

> Architecture evolves intentionally, never accidentally.

Every significant technical decision should reinforce the architectural vision rather than compromise it.

Governance exists to preserve this discipline.

---

## 11.3 Engineering Principles

Every architectural decision should respect the following principles:

- Single Responsibility
- Separation of Concerns
- Stable Contracts
- Provider Independence
- Metadata over Hardcoding
- Fail Safe
- Test Before Trust
- Evolution without Breaking Changes
- Documentation is Architecture

These principles act as architectural guardrails for the entire project.

---

## 11.4 Architectural Decision Records (ADR)

Phoenix documents major architectural decisions using Architectural Decision Records.

Each ADR captures:

- Context
- Decision
- Alternatives
- Consequences
- Related Documents

ADRs explain not only what was decided, but why.

---

## 11.5 When an ADR is Required

An ADR should be created whenever a decision:

- introduces a new architectural component;
- changes the execution flow;
- modifies architectural contracts;
- introduces a new design pattern;
- changes long-term project direction.

Routine implementation details do not require ADRs.

---

## 11.6 Architectural Review

Before introducing significant architectural changes, every proposal should answer the following questions:

- Does it respect existing contracts?
- Does it preserve provider independence?
- Does it increase complexity?
- Can it be tested?
- Is an ADR required?

Only after this review should implementation begin.

---

## 11.7 Documentation Governance

Architecture documentation evolves together with the codebase.

Whenever architecture changes:

- documentation is updated;
- ADRs are reviewed;
- diagrams are revised;
- affected chapters are synchronized.

Documentation is considered part of the implementation.

---

## 11.8 Benefits

Architectural Governance provides:

- long-term consistency;
- engineering discipline;
- safer evolution;
- easier onboarding;
- better collaboration;
- lower maintenance costs.

---

## Chapter Summary

Architectural Governance defines how Phoenix evolves.

By combining engineering principles, documentation discipline and Architectural Decision Records, Phoenix preserves architectural quality while remaining flexible enough to support continuous innovation.


Future Architecture


# Chapter 12 — Future Architecture

## 12.1 Purpose

The current Phoenix architecture has been designed not only to solve today's problems, but also to support tomorrow's challenges.

Every major architectural decision has been made with long-term evolution in mind.

Future Architecture describes the strategic direction of the platform while preserving the stability of its Core.

---

## 12.2 Architectural Vision

Phoenix is designed to become a universal search orchestration platform.

Rather than integrating a fixed number of marketplaces, the architecture aims to support an ever-growing ecosystem of providers operating across multiple countries, technologies and data sources.

The objective is simple:

> **One query. One architecture. Unlimited providers.**

---

## 12.3 Multi-Country Search

The current Provider Registry already contains country metadata.

This prepares Phoenix for country-aware searches.

Future users will be able to select:

- Switzerland
- Germany
- France
- Italy
- Austria
- Europe
- Global

The search experience will no longer be limited by geographic boundaries.

---

## 12.4 Search Scope Resolver

A future Search Scope Resolver will determine where searches should be executed.

Example:

```text
User Query
      │
      ▼
Capability Resolver
      │
      ▼
Search Scope Resolver
      │
      ▼
Provider Resolver
```

This component will optimize provider selection according to geographic scope.

---

## 12.5 Intelligent Provider Selection

Provider selection may eventually become adaptive.

Possible decision criteria include:

- provider health;
- historical performance;
- average response time;
- data quality;
- user subscription;
- marketplace specialization.

The architecture already supports metadata-driven decision making, making this evolution natural.

---

## 12.6 Provider Health Monitoring

Future versions of Phoenix may continuously evaluate provider reliability.

Metrics may include:

- uptime;
- timeout frequency;
- parsing success rate;
- average execution time;
- data quality score.

Providers with poor health may be temporarily deprioritized without modifying the Finder Engine.

---

## 12.7 AI-Assisted Classification

Capability classification may evolve beyond rule-based logic.

Artificial Intelligence could identify:

- user intent;
- semantic meaning;
- multilingual expressions;
- implicit categories.

This evolution would improve provider selection without affecting the remaining architecture.

---

## 12.8 Semantic Search

Future searches may become intent-driven rather than keyword-driven.

Instead of matching words, Phoenix could understand concepts.

Examples:

- "family electric SUV"

- "vintage diving watch"

- "entry-level gaming laptop"

The architecture has been designed to accommodate this evolution.

---

## 12.9 API Providers

Future providers will not necessarily rely on HTML parsing.

Phoenix has been designed to integrate:

- REST APIs;
- GraphQL services;
- JSON endpoints;
- XML feeds;
- commercial APIs.

Regardless of the underlying technology, all providers will continue to expose the same standardized SDK interface.

---

## 12.10 Browser Automation

Certain marketplaces require JavaScript execution.

Future providers may integrate browser automation technologies while remaining compatible with the existing Provider SDK.

The Finder Engine will remain completely unaware of the implementation details.

---

## 12.11 Distributed Execution

As the provider ecosystem grows, execution may be distributed across multiple workers or services.

Possible future architecture:

```text
Finder Engine
      │
      ▼
Execution Queue
      │
      ├── Worker 1
      ├── Worker 2
      ├── Worker 3
      └── Worker N
```

This approach would improve scalability while preserving the existing architectural model.

---

## 12.12 Evolution Without Disruption

The architecture has been intentionally designed so that new capabilities can be introduced without redesigning the Core.

Future innovation should occur through extension rather than modification.

This principle protects the long-term stability of Phoenix.

---

## Chapter Summary

Phoenix has not been designed as a static application.

It has been designed as an evolving platform.

Every architectural layer has been created to support continuous growth while preserving simplicity, stability and maintainability.

The architecture of tomorrow begins with the decisions made today.



Phoenix Engineering Principles


# Appendix A — Phoenix Engineering Principles

## Purpose

These engineering principles define the architectural philosophy of Phoenix.

Every architectural decision, implementation choice and future evolution should respect these principles.

They act as permanent engineering guidelines for the project.

---

# Principle 1 — Single Responsibility

Every component should have one clearly defined responsibility.

A component that performs multiple unrelated tasks should be refactored.

Examples:

- Finder Engine orchestrates.
- Parser extracts.
- Validator validates.
- Mapper normalizes.

---

# Principle 2 — Separation of Concerns

Responsibilities must remain isolated.

Business logic, provider logic, parsing, validation and orchestration should never be mixed.

Clear boundaries simplify maintenance.

---

# Principle 3 — Stable Contracts

Interfaces are long-term agreements.

Internal implementations may evolve.

Public contracts should remain stable whenever possible.

Breaking changes require strong justification.

---

# Principle 4 — Provider Independence

The Finder Engine must never know provider implementation details.

Providers are interchangeable modules.

The Core orchestrates.

Providers execute.

---

# Principle 5 — Metadata over Hardcoding

Architectural decisions should rely on metadata whenever possible.

Examples include:

- Provider Registry
- Capabilities
- Countries
- Languages
- Priorities

Metadata improves flexibility and scalability.

---

# Principle 6 — Fail Safe

External systems are unreliable.

The architecture must assume that:

- providers fail;
- networks fail;
- marketplaces change.

Failures should remain isolated.

The platform must continue operating.

---

# Principle 7 — Test Before Trust

Code is considered complete only after verification.

Testing validates behaviour.

Assumptions do not.

Quality is demonstrated through repeatable tests.

---

# Principle 8 — Composition over Coupling

Components should collaborate through composition rather than tight dependencies.

Loose coupling enables future evolution.

---

# Principle 9 — Evolution Without Breaking Changes

New functionality should extend the architecture.

It should not require redesigning existing components.

Growth through extension preserves long-term stability.

---

# Principle 10 — Documentation is Architecture

Architecture exists in both code and documentation.

Whenever architecture changes:

- documentation changes;
- diagrams change;
- ADRs are updated.

Documentation is part of the implementation.

---

# Principle 11 — Simplicity Before Optimization

Prefer simple, understandable solutions.

Optimize only when supported by measurable evidence.

Complexity should never be introduced prematurely.

---

# Principle 12 — Long-Term Thinking

Every architectural decision should be evaluated not only for today's requirements but also for its impact on future evolution.

Phoenix is designed as a platform, not as a temporary application.

---

## Summary

These principles guide every architectural decision within Phoenix.

Technology may evolve.

Programming languages may change.

Frameworks may be replaced.

These principles should remain stable.


Validate Before Automating

# Appendix B — Phoenix Glossary

## Purpose

This glossary defines the terminology used throughout the Phoenix Architecture Book and the broader Knowledge Base.

The objective is to establish a common vocabulary for all contributors and ensure consistent communication across documentation and source code.

---

# A

## ADR

Architectural Decision Record.

A document describing the context, decision, consequences and rationale behind a significant architectural choice.

---

## API

Application Programming Interface.

A structured interface that allows Phoenix to communicate with external services without HTML parsing.

---

# B

## Build Verification

The process of confirming that the application compiles successfully and all architectural contracts remain valid.

---

# C

## Capability

A search category recognized by Phoenix.

Examples include:

- vehicles
- watches
- electronics
- general-marketplace

Capabilities are determined by the Capability Resolver.

---

## Capability Resolver

The architectural component responsible for identifying what the user is searching for.

---

## Core

The central architecture of Phoenix.

The Core orchestrates the search process but never performs provider-specific logic.

---

# D

## Documentation Governance

The process that ensures documentation evolves together with the architecture.

---

# E

## Engine

See **Finder Engine**.

---

## Execution Report

A structured report generated after provider execution.

Typically includes:

- provider
- status
- duration
- result count

---

# F

## Fetch

The first stage of the Provider Pipeline.

Responsible only for retrieving raw marketplace data.

---

## Finder Engine

The orchestration component of Phoenix.

Coordinates the complete search process without knowing provider implementation details.

---

## FinderResult

The standardized search result object returned by every provider.

---

# G

## Governance

The collection of engineering principles and processes that guide the evolution of Phoenix.

---

# H

## HTML Parser

The component responsible for extracting structured marketplace data from raw HTML.

---

# L

## Logging

Structured recording of execution events for diagnostics and monitoring.

---

# M

## Mapper

The pipeline stage responsible for converting marketplace-specific objects into standardized Phoenix objects.

---

## Marketplace

An external platform integrated through a provider.

Examples:

- Anibis
- Ricardo
- Tutti
- Chrono24

---

## Metadata

Descriptive information used to drive architectural decisions.

Examples include:

- countries
- languages
- capabilities
- priority

---

# P

## Parser

The Provider Pipeline stage responsible for extracting structured information from raw marketplace content.

---

## Pipeline

The standardized execution flow followed by every provider.

Fetch → Parser → Validator → Mapper

---

## Provider

An independent integration module responsible for searching a specific marketplace.

---

## Provider Manager

The architectural component responsible for safely executing providers.

---

## Provider Registry

The centralized catalog describing all available providers through metadata.

---

## Provider Resolver

The component responsible for selecting which providers should execute.

---

## Provider SDK

The engineering standard implemented by every provider.

---

# Q

## Query

The user search request processed by the Finder Engine.

---

# R

## Registry

See **Provider Registry**.

---

## Resolver

A component responsible for making architectural decisions.

Examples:

- Capability Resolver
- Provider Resolver
- Search Scope Resolver (future)

---

# S

## Search Scope

The geographical area where searches should be executed.

Possible future values:

- Switzerland
- Germany
- Europe
- Global

---

## Search Scope Resolver

A future architectural component responsible for determining geographical search boundaries.

---

## SDK

Software Development Kit.

Within Phoenix, the Provider SDK defines the engineering standard every provider must implement.

---

# T

## Timeout

The maximum execution time allowed for a provider.

Timeout protection prevents slow providers from blocking searches.

---

# U

## Unit Test

An automated test verifying the behaviour of a single component in isolation.

---

# V

## Validator

The pipeline stage responsible for ensuring extracted marketplace data satisfies Phoenix quality requirements.

---

## Vision

The long-term architectural direction of Phoenix.

---

# W

## Worker

A future execution unit capable of processing provider requests independently in a distributed architecture.

---

# Glossary Maintenance

Whenever new architectural concepts are introduced, this glossary should be updated to maintain a consistent vocabulary across the entire Phoenix documentation.

# Appendix C — Acronyms

## Purpose

This appendix provides a reference for the abbreviations and acronyms used throughout the Phoenix Architecture Book and the associated engineering documentation.

Using a standardized set of acronyms improves readability and ensures consistent communication across the project.

---

| Acronym | Meaning | Description |
|----------|---------|-------------|
| ADR | Architectural Decision Record | Documents significant architectural decisions. |
| AI | Artificial Intelligence | Future capability for classification, ranking and semantic understanding. |
| API | Application Programming Interface | Standard interface for external services. |
| CI | Continuous Integration | Automated process for building and testing code. |
| CLI | Command Line Interface | Text-based interface used for development tools. |
| CPU | Central Processing Unit | Executes application instructions. Mentioned in performance discussions. |
| CSS | Cascading Style Sheets | Language used to style web pages. |
| DTO | Data Transfer Object | Object used to transfer structured data between components. |
| GraphQL | Graph Query Language | API technology supported by future providers. |
| HTML | HyperText Markup Language | Format retrieved during the Fetch stage. |
| HTTP | HyperText Transfer Protocol | Communication protocol used by providers. |
| HTTPS | HyperText Transfer Protocol Secure | Secure version of HTTP. |
| JSON | JavaScript Object Notation | Standard format for structured data exchange. |
| KB | Knowledge Base | Collection of Phoenix documentation. |
| MVP | Minimum Viable Product | Earliest version used to validate ideas. |
| NLP | Natural Language Processing | Future AI capability for understanding user intent. |
| REST | Representational State Transfer | API architecture supported by future providers. |
| SDK | Software Development Kit | Standard architecture implemented by every provider. |
| SQL | Structured Query Language | Database query language. |
| SVG | Scalable Vector Graphics | Vector image format used for diagrams and assets. |
| UI | User Interface | Visual layer presented to the user. |
| URL | Uniform Resource Locator | Web address used by providers. |
| UX | User Experience | Overall interaction quality experienced by users. |
| XML | eXtensible Markup Language | Structured data format supported by future providers. |

---

# Phoenix-Specific Acronyms

| Acronym | Meaning | Description |
|----------|---------|-------------|
| FE | Finder Engine | Central orchestration component of Phoenix. |
| PM | Provider Manager | Executes providers safely and collects execution metrics. |
| PR | Provider Registry | Metadata catalog of all available providers. |
| PRR | Provider Resolver | Selects providers based on metadata and capabilities. |
| CR | Capability Resolver | Determines what the user is searching for. |
| SSR | Search Scope Resolver *(future)* | Determines the geographical scope of a search. |
| SDK Pipeline | Fetch → Parser → Validator → Mapper | Standard provider execution workflow. |

---

# Naming Conventions

Phoenix documentation follows these conventions:

- Component names are written in **PascalCase**.
- Architectural layers are written in **Title Case**.
- Source code identifiers follow the project coding standards.
- Acronyms remain uppercase.
- Public interfaces should use consistent terminology across code and documentation.

Examples:

- Finder Engine
- Provider Manager
- Provider Registry
- Capability Resolver
- Provider SDK
- FinderResult
- ParsedQuery

---

# Terminology Guidelines

To maintain consistency, Phoenix avoids interchangeable terminology.

Preferred terms include:

| Preferred | Avoid |
|-----------|-------|
| Finder Engine | Search Engine |
| Provider | Scraper |
| Provider Registry | Provider List |
| Provider Pipeline | Workflow |
| Capability | Type |
| FinderResult | Search Item |
| ParsedQuery | Input Object |

Using consistent terminology improves both documentation quality and code readability.

---

## Appendix Summary

This appendix serves as the official reference for abbreviations, naming conventions and preferred terminology used throughout the Phoenix project.

Maintaining consistent language is considered part of Phoenix's architectural governance.



PHOENIX ARCHITECTURE BOOK

Preface
Introduction

PART I — Vision
  Chapter 1

PART II — Core Architecture
  Chapters 2–7

PART III — Provider Engineering
  Chapters 8–9

PART IV — Engineering Excellence
  Chapter 10

PART V — Architectural Governance
  Chapters 11–12

Appendix A
Engineering Principles

Appendix B
Glossary

Appendix C
Acronyms

Index (future)

Revision History (future)

