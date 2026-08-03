# PHOENIX GENERATOR LAYER ARCHITECTURE
## Version 1.0

**Status:** Architecture Definition

---

# 1. Purpose

This document defines the architecture of the Phoenix DevKit Generator Layer.

The Generator Layer transforms explicit generation requests into concrete project artifacts by composing certified Phoenix Core services.

Its primary responsibility is:

> Produce deterministic filesystem artifacts from explicit inputs, templates, and generation rules.

The Generator Layer sits above the certified Core and below higher-level orchestration such as the CLI.

---

# 2. Architectural Role

The Generator Layer belongs to the first higher-level service layer above the Phoenix Core.

Conceptually:

```text
CLI
 │
 ▼
Generator Layer
 │
 ├── Runtime
 ├── Logger
 ├── Filesystem
 ├── Strings
 ├── Manifest
 └── Template Engine
```

The Generator Layer orchestrates Core capabilities.

It must not duplicate Core responsibilities.

---

# 3. Dependency Direction

The allowed dependency direction is:

```text
CLI
 ↓
Generators
 ↓
Certified Core
```

Generators may depend on:

```text
Runtime
Logger
Filesystem
Strings
Manifest
Template Engine
```

Generators must not depend on:

```text
CLI
Plugins
future application-specific business layers
```

This prevents upward dependency leakage.

---

# 4. Primary Responsibility

A Generator is responsible for producing one defined class of artifact.

Examples may include:

```text
module
provider
validator
plugin skeleton
configuration bundle
documentation bundle
project component
```

Each generator must have one clearly defined output responsibility.

---

# 5. Non-Responsibilities

Generators must not:

- become general filesystem utilities;
- implement generic string processing;
- parse manifests independently;
- implement their own template engine;
- execute arbitrary template content;
- perform interactive CLI prompting internally;
- contain unrelated business logic;
- silently infer user intent;
- manage plugin discovery;
- bypass validation policy.

These responsibilities belong to other layers.

---

# 6. Generator Definition

A Phoenix Generator is a deterministic orchestration unit that combines:

```text
Generation Request
+
Generator Definition
+
Templates
+
Variables
+
Destination Policy
```

to produce:

```text
Generated Artifacts
```

A Generator is not merely a shell script that writes files.

It is a component governed by an explicit generation contract.

---

# 7. Generation Request

A generation request must be explicit.

Conceptually:

```text
Generator ID
Target Name
Destination
Variables
Options
```

The exact request contract is defined later in the Generator Function Specification.

The architecture does not permit hidden request state.

---

# 8. Generator Identity

Each generator must have a stable identity.

Example conceptual IDs:

```text
module
provider
validator
plugin
```

Generator identity is separate from the user-visible artifact name.

Example:

```text
Generator ID: provider
Artifact Name: Ricardo
```

---

# 9. Generator Definition Model

Each generator should define at minimum:

```text
identity
purpose
template source
required variables
output mapping
destination rules
overwrite policy
```

Future versions may add:

```text
version
capabilities
validation metadata
optional variables
post-generation hooks
```

These must not be introduced implicitly.

---

# 10. Template Model

Generators consume templates through the certified Template Engine.

A generator must not implement its own placeholder replacement.

Conceptually:

```text
Generator
   │
   ▼
Template Engine
   │
   ▼
Rendered Content
```

Template content remains data.

---

# 11. Manifest Interaction

Generators may use Manifest metadata where explicitly required.

Conceptually:

```text
Generator Definition
      │
      ▼
Manifest Module
      │
      ▼
Metadata
```

Manifest access must use the certified Manifest public API.

Generators must not:

```text
source manifest files
eval manifest content
implement duplicate manifest parsing
```

---

# 12. Input Validation Boundary

Generation begins with input validation.

Conceptually:

```text
Generation Request
      │
      ▼
Input Validation
      │
   ┌──┴───┐
 valid   invalid
   │       │
   ▼       ▼
continue  fail
```

No filesystem mutation should occur before required generation inputs are validated.

---

# 13. Generation Pipeline

The canonical Generator Layer pipeline is:

```text
Generation Request
        │
        ▼
Request Validation
        │
        ▼
Generator Resolution
        │
        ▼
Definition / Manifest Read
        │
        ▼
Template Resolution
        │
        ▼
Variable Preparation
        │
        ▼
Template Rendering
        │
        ▼
Destination Policy Check
        │
        ▼
Filesystem Write
        │
        ▼
Post-Generation Validation
        │
        ▼
Generation Result
```

This pipeline defines responsibility ordering.

---

# 14. Pre-Mutation Rule

Phoenix follows:

> Validate before mutation.

Before the first filesystem write, the Generator Layer should know:

```text
which generator
which templates
which variables
which destination
whether destination policy allows generation
```

Where practical, rendering should also be completed before filesystem mutation.

---

# 15. Destination Model

Every generated artifact must have an explicit destination.

Generators must not silently choose unrelated filesystem locations.

Destination behavior must be predictable from:

```text
generation request
+
generator definition
```

Higher-level callers may supply workspace-relative or absolute destinations according to the later API contract.

---

# 16. Output Mapping

A generator may produce:

```text
one file
multiple files
directory trees
```

The mapping between source templates and output paths must be explicit.

Conceptually:

```text
template A → output A
template B → output B
template C → output C
```

Hidden output creation is prohibited.

---

# 17. Overwrite Policy

Generation must never overwrite existing user artifacts silently.

Version 1.0 must define an explicit overwrite policy.

Conceptual policies may include:

```text
DENY
ALLOW
```

Default architectural direction:

```text
DENY
```

Existing targets should cause generation failure unless overwrite has been explicitly authorized.

Exact semantics belong to the Function Specification.

---

# 18. Destination Integrity

If generation fails before completion, Phoenix should avoid presenting incomplete output as successful generation.

Preferred direction:

```text
Prepare Completely
      ↓
Validate Completely
      ↓
Write Deliberately
```

rather than:

```text
write
write
fail
leave ambiguous state
```

Where multi-file generation cannot be fully atomic, failure behavior must be explicitly documented.

---

# 19. Dry-Run Model

The Generator Layer should support a dry-run capability.

Dry-run means:

```text
perform generation planning
without filesystem mutation
```

A dry-run may report:

```text
generator selected
templates resolved
destinations planned
files that would be created
conflicts detected
```

Dry-run must not:

```text
create files
modify files
remove files
```

Exact output/result structure belongs to the Function Specification.

---

# 20. Generation Result

Generators should return a structured conceptual result rather than relying only on terminal text.

A Generation Result may contain:

```text
status
generator ID
artifacts
destination paths
warnings
failure reason
```

The shell-level representation is defined later.

Logger output must not substitute for the generation result contract.

---

# 21. Logging Boundary

Generators may use Logger to communicate execution progress.

Examples:

```text
generation started
template resolved
artifact created
generation failed
```

Logging is observational.

The generation result remains the authoritative execution outcome.

---

# 22. Error Model

Generator failures must be explicit and attributable.

Failure categories may include:

```text
invalid request
unknown generator
missing template
invalid variable
rendering failure
destination conflict
filesystem failure
validation failure
```

The Generator Layer must not hide failure causes behind a generic success result.

---

# 23. Validation Boundary

The Generator Layer may perform generation-specific validation.

However, generic reusable validation belongs to the Validator Layer.

Conceptually:

```text
Generator
   │
   ├── request-specific checks
   │
   └── invoke Validators where appropriate
```

The architecture must avoid embedding every validation rule directly into generators.

---

# 24. Post-Generation Validation

Generated output may be validated after creation.

Examples:

```text
required files exist
generated syntax is valid
manifest is structurally correct
directory layout matches contract
```

A generation operation must not be reported as fully successful if mandatory post-generation validation fails.

---

# 25. Idempotency

Generator idempotency must be explicit.

A generator should not assume repeated execution is safe.

With default overwrite policy:

```text
first generation  → success
second generation → destination conflict
```

unless explicit overwrite or regeneration behavior has been requested.

This protects existing artifacts.

---

# 26. Determinism

Given identical:

```text
generator definition
templates
variables
options
destination state
```

the Generator Layer should produce the same planned artifacts.

Generators must avoid hidden nondeterministic inputs.

Examples of prohibited implicit inputs include:

```text
random values
current time
environment variables
network data
```

unless explicitly part of the generation contract.

---

# 27. Environment Isolation

Generators must not silently import arbitrary environment variables as template variables.

Variable context must remain explicit.

If environment-derived values are ever supported, they must be deliberately mapped into the generation request by the caller.

---

# 28. Security Model

Generators orchestrate data transformation and filesystem writes.

They must not execute:

```text
template content
manifest content
replacement values
artifact names
generation variables
```

as shell code.

Generator implementation must not use untrusted generation data through:

```text
eval
source
bash -c
sh -c
```

unless a future explicitly designed execution feature requires a separate security architecture.

---

# 29. Path Security

Destination paths are security-sensitive inputs.

The Generator Layer must prevent accidental writes outside the explicitly authorized destination scope.

Future specifications must define:

```text
destination normalization
workspace boundary behavior
relative path handling
path traversal policy
```

These concerns must not be left implicit.

---

# 30. Source Template Preservation

Templates are source assets.

Generation must not modify source templates.

The flow is:

```text
read template
render copy
write destination
```

never:

```text
modify source template in place
```

---

# 31. Generator Registry Direction

The Generator Layer will require a controlled mechanism for resolving generators by ID.

Conceptually:

```text
Generator Registry
      │
      ├── module
      ├── provider
      ├── validator
      └── ...
```

The registry should be explicit.

Implicit directory scanning is not required for v1.0 unless separately approved.

---

# 32. Generator Discovery

Generator discovery and Generator execution are separate responsibilities.

Conceptually:

```text
Registry / Resolver
       ↓
Generator Definition
       ↓
Generation Engine
```

This separation allows future CLI and Plugin layers to discover generators without changing generation semantics.

---

# 33. Public API Direction

The Generator Layer will require capabilities equivalent to:

```text
generator_exists
generator_plan
generator_run
```

Potential supporting concepts may include:

```text
generation request
generation result
artifact plan
```

Exact public API names and signatures are intentionally deferred to the Function Specification.

Architecture defines capabilities.

Specification defines contracts.

---

# 34. Generator Plan

A generation plan represents intended filesystem mutations before they occur.

Conceptually:

```text
Artifact Plan
├── source template
├── destination path
├── variables
└── conflict state
```

Planning supports:

```text
dry-run
conflict detection
pre-generation validation
predictable execution
```

---

# 35. Planning vs Execution

The architecture should separate:

```text
PLAN
```

from:

```text
EXECUTE
```

Conceptually:

```text
Request
  ↓
Plan
  ↓
Review / Validate
  ↓
Execute
```

This separation is central to safe generator behavior.

---

# 36. Core Dependencies

The Generator Layer may consume the certified Core APIs:

```text
Runtime
Logger
Filesystem
Strings
Manifest
Template Engine
```

Each dependency should be used only for its documented responsibility.

Examples:

```text
Runtime         → execution prerequisites
Logger          → progress/error communication
Filesystem      → artifact I/O
Strings         → naming normalization
Manifest        → metadata retrieval
Template Engine → rendering
```

---

# 37. Dependency Restrictions

Generators must not bypass certified Core services by reimplementing the same concern without architectural justification.

Examples:

```text
custom template parser inside generator      → reject
custom manifest parser inside generator      → reject
duplicate filesystem wrapper                 → reject
ad-hoc logger implementation                 → reject
```

Reuse is a design requirement, not merely a convenience.

---

# 38. Generator-Specific Logic

A generator may contain logic unique to the artifact it produces.

Example conceptual responsibilities:

```text
Provider Generator
  ├── provider naming
  ├── provider template mapping
  └── provider-specific required variables
```

But generic generation mechanics belong to the Generator Layer itself.

This distinction prevents copy-pasted orchestration across generators.

---

# 39. Layer Structure Direction

A likely future structure is:

```text
03_GENERATORS/
├── engine/
├── registry/
├── definitions/
├── templates/
└── README.md
```

This is architectural direction, not yet a frozen filesystem contract.

The concrete structure will be decided before implementation.

---

# 40. Validator Integration

The Generator Layer and Validator Layer must remain separate but composable.

Conceptually:

```text
Generator
   ↓
Generated Artifact
   ↓
Validator
```

Generators may invoke validators.

Validators must not depend on generator internals.

---

# 41. CLI Integration

CLI sits above the Generator Layer.

Conceptually:

```text
User
 ↓
CLI
 ↓
Generator API
 ↓
Generation Result
```

CLI responsibilities include:

```text
argument parsing
user interaction
presentation
exit behavior
```

Generator responsibilities remain:

```text
planning
rendering
artifact production
generation result
```

This boundary must remain strict.

---

# 42. Plugin Integration

Future plugins may register additional generators.

Conceptually:

```text
Plugin
  ↓
Generator Registration Contract
  ↓
Generator Registry
```

Plugins must extend the Generator Layer through explicit contracts.

They must not patch internal generator engine behavior directly.

---

# 43. Testing Strategy

Generator testing must operate at multiple levels.

## Unit Tests

Validate:

```text
request validation
registry behavior
planning
conflict detection
result construction
```

## Integration Tests

Validate:

```text
template rendering
filesystem output
multi-file generation
destination policy
Core interaction
```

## Security Tests

Validate:

```text
template content remains inert
variables remain inert
path handling
no implicit environment injection
no unauthorized writes
```

---

# 44. Required Initial Test Coverage

The initial Generator Layer test suite should cover at minimum:

1. known generator resolution;
2. unknown generator rejection;
3. valid generation request;
4. invalid generation request;
5. artifact planning;
6. dry-run without mutation;
7. successful generation;
8. destination conflict;
9. explicit overwrite behavior;
10. missing template failure;
11. rendering failure;
12. source template preservation;
13. expected artifact creation;
14. multi-artifact generation where supported;
15. destination integrity on pre-write failure;
16. no implicit environment variable use;
17. shell-like values remain inert;
18. invalid paths are rejected;
19. generation result accuracy;
20. post-generation validation failure propagation.

---

# 45. Observability

Generator execution should be observable without coupling correctness to logs.

Conceptually:

```text
Generation Result = authoritative
Logs              = diagnostic
```

Tests should assert generation results and filesystem state rather than depend primarily on terminal messages.

---

# 46. Extensibility

The Generator Layer must support future generator types without requiring Core modification.

New generator definitions should plug into:

```text
registry
planning
execution
validation
```

through stable contracts.

The generation engine itself should not require per-generator conditional branches such as:

```text
if generator == provider
if generator == plugin
if generator == validator
```

as the system grows.

---

# 47. Version 1.0 Scope

Generator Layer v1.0 should remain intentionally constrained.

In scope:

```text
explicit generator registry
explicit generation request
artifact planning
template-based generation
dry-run
destination conflict policy
filesystem writes
generation result
```

Not automatically in scope:

```text
interactive prompts
remote templates
network generation
arbitrary execution hooks
complex plugin lifecycle
template programming logic
transactional rollback engine
```

---

# 48. Definition of Done

The Generator Layer Architecture phase is complete when:

```text
Layer responsibility      DEFINED
Dependency direction      DEFINED
Generation pipeline       DEFINED
Planning boundary         DEFINED
Execution boundary        DEFINED
Overwrite direction       DEFINED
Dry-run model             DEFINED
Security boundary         DEFINED
Validation boundary       DEFINED
CLI boundary              DEFINED
Plugin boundary           DEFINED
Function Specification    NEXT
Implementation            NOT STARTED
```

---

# 49. Current Status

```text
Architecture            DEFINED
Function Specification  PENDING
Implementation          NOT STARTED
Tests                   NOT STARTED
API Reference           PENDING
Certification           PENDING
```

---

# 50. Architectural Decision

Phoenix Generator Layer v1.0 is a deterministic planning-and-execution layer above the certified Core.

Its central architectural principle is:

> Plan first. Validate before mutation. Execute explicitly.

Generators compose certified Core services rather than duplicate them.

CLI, Validators, and Plugins remain separate architectural layers.
