# PHOENIX PLUGIN / EXTENSION MODEL FUNCTION SPECIFICATION

## Version 1.0

**Status:** FROZEN
**Program:** Phoenix DevKit — Phase 9
**Phase:** Plugin / Extension Model
**Implementation:** NOT STARTED

---

# 1. Purpose

This document defines the function-level contract for the Phoenix DevKit
Plugin / Extension Model v1.0.

The Plugin System provides a controlled extension coordination layer
above certified Phoenix DevKit subsystems.

Its purpose is to allow additional capabilities to be registered through
explicit contracts without weakening architectural ownership, dependency
direction, deterministic behavior, public API stability, security
boundaries, or lower-layer certification.

The Plugin System coordinates extensions. It does not own the execution
semantics of the subsystems being extended.

---

# 2. Scope

Plugin / Extension Model v1.0 covers:

-   plugin identity;
-   plugin definitions;
-   explicit plugin registration;
-   plugin registry state;
-   plugin resolution;
-   deterministic plugin listing;
-   compatibility evaluation;
-   dependency validation;
-   contribution declaration;
-   Generator contribution coordination;
-   Validator contribution coordination;
-   contribution preflight;
-   contribution failure containment;
-   controlled capability exposure;
-   security boundaries;
-   public/private API separation.

The following are not part of Plugin v1.0:

-   generic arbitrary-code plugin loading;
-   automatic filesystem plugin discovery;
-   recursive plugin scanning;
-   CLI grammar extension;
-   dynamic CLI command registration;
-   plugin activation, deactivation, shutdown, or unloading services;
-   persistent FAILED plugin lifecycle state;
-   transactional cross-registry rollback;
-   network-based plugin installation;
-   plugin marketplace behavior.

---

# 3. Architectural Contract

The Plugin System owns extension coordination. It does not own
lower-layer semantics.

Conceptually:

```text
Plugin System
     |
     +--> Generator public registration contract
     |
     +--> Validator public registration contract
     |
     +--> certified lower-layer public APIs when explicitly required
```

The Plugin System must not replace or redefine Core semantics, Template
Engine semantics, Generator planning or execution semantics, Validator
execution semantics, CLI parsing/dispatch semantics, or Atlas
intelligence semantics.

Lower layers must not depend upward on the Plugin System. The dependency
graph must remain acyclic.

---

# 4. Namespace

Plugin v1.0 uses the Phoenix namespace convention:

```text
phoenix::plugin_*      public Plugin API
_phoenix::plugin_*     private Plugin implementation
```

Only explicitly specified `phoenix::plugin_*` functions are part of the
stable public compatibility contract. Private `_phoenix::plugin_*`
helpers are implementation details.

Consumers must not depend on private Plugin helpers. Plugins must not
consume lower-layer `_phoenix::*` helpers.

---

# 5. Public API Surface

Plugin v1.0 defines exactly four public functions:

```text
phoenix::plugin_exists
phoenix::plugin_register
phoenix::plugin_resolve
phoenix::plugin_list
```

No additional public Plugin API is required for v1.0.

In particular, the following are not public Plugin v1.0 APIs:

```text
phoenix::plugin_run
phoenix::plugin_activate
phoenix::plugin_deactivate
phoenix::plugin_shutdown
phoenix::plugin_unload
phoenix::plugin_discover
phoenix::plugin_load
phoenix::plugin_scan
phoenix::plugin_is_compatible
```

Adding a public Plugin API after certification requires explicit
contract revision.

---

# 6. Private Helper Boundary

Candidate private implementation responsibilities include registry
lookup, definition field extraction and validation, contract-version
validation, compatibility evaluation, dependency validation,
contribution validation/preflight/application, and failure attribution.

Candidate helper names may include:

```text
_phoenix::plugin_registry_index_of
_phoenix::plugin_definition_field
_phoenix::plugin_definition_validate
_phoenix::plugin_contract_validate
_phoenix::plugin_compatibility_check
_phoenix::plugin_dependency_validate
_phoenix::plugin_contributions_validate
_phoenix::plugin_contributions_preflight
_phoenix::plugin_contributions_apply
```

These names are not frozen public API. Private helper naming and
decomposition may evolve without public API breakage provided public
behavior remains contract-compatible.

---

# 7. Plugin Identity

Every Plugin must have one explicit Plugin ID.

Plugin identity must be non-empty, stable for the registered definition,
explicit, and unique within Plugin Registry state.

A Plugin ID must not be inferred from filename, directory name,
filesystem discovery order, implementation function name, or caller
working directory.

The exact Plugin ID grammar is implementation-specification controlled
and must be deterministic. Duplicate Plugin IDs are forbidden.

---

# 8. Plugin Definition Contract

A Plugin is registered from an explicit Plugin Definition. Plugin
Definition content is inert data and must never be shell-evaluated.

The v1.0 Plugin Definition must provide enough information to determine:

```text
ID
CONTRACT_VERSION
CONTRIBUTION
```

Dependency information may also be declared through repeatable
`DEPENDENCY` fields when required by the Plugin.

The authoritative serialization, field cardinality, and repeatable-field
semantics are defined by the Frozen Plugin Definition Grammar v1.0 below.

Conceptually:

```text
ID=<plugin-id>
CONTRACT_VERSION=1.0
CONTRIBUTION=<type>:<target-id>
DEPENDENCY=<requirement>:<layer>:<capability>
```

`CONTRIBUTION` and `DEPENDENCY` are singular repeatable fields. Their
serialization is explicit, deterministic, inert, and Bash 3.2-compatible.

`PURPOSE` or other descriptive metadata may be supported as inert
metadata but is not required for core runtime semantics unless
separately frozen.

Plugin Definitions must not contain generic executable-path authority. A
metadata path must never cause Phoenix to execute or source an arbitrary
supplied path.

## Frozen Plugin Definition Grammar v1.0

Plugin Definition v1.0 uses a deterministic, line-oriented, inert `KEY=VALUE` format.

```text
KEY=VALUE
```

Field names match `[A-Z][A-Z0-9_]*`. The value is all literal text after the first `=`.
Additional `=` characters belong to the value. Definition data is never shell code and
must not acquire quoting, expansion, command-substitution, `eval`, `source`, `bash -c`,
or `sh -c` semantics.

### Plugin ID Grammar

Plugin IDs match exactly:

```text
[a-z][a-z0-9-]*
```

IDs are explicit, case-sensitive, stable, unique, and never inferred from filenames,
directories, function names, or paths.

### Supported Contract Version

Plugin v1.0 accepts exactly:

```text
CONTRACT_VERSION=1.0
```

No version ranges, aliases, implicit compatibility, or SemVer-range interpretation exists
in v1.0. Any other value fails deterministically before successful registration.

### Canonical Fields and Cardinality

```text
ID=<plugin-id>                                      REQUIRED; exactly one
CONTRACT_VERSION=1.0                               REQUIRED; exactly one
CONTRIBUTION=<type>:<target-id>                    REQUIRED; one or more; repeatable
DEPENDENCY=<requirement>:<layer>:<capability>       OPTIONAL; zero or more; repeatable
PURPOSE=<descriptive-text>                          OPTIONAL; zero or one
```

Repeated-field declaration order is significant and preserved. Unknown fields fail Plugin
v1.0 definition validation and must not silently acquire behavior.

### Contribution Serialization

```text
CONTRIBUTION=<TYPE>:<TARGET_ID>
```

Allowed v1.0 types are exactly `GENERATOR` and `VALIDATOR`.

```text
CONTRIBUTION=GENERATOR:<generator-id>
CONTRIBUTION=VALIDATOR:<validator-id>
```

Contribution declarations contain no executable function reference, shell command,
filesystem path, or private helper reference. Generator contributions are applied only
through `phoenix::generator_register`; Validator contributions only through
`phoenix::validator_register`. Lower layers retain their own validation and execution
semantics.

### Dependency Serialization

```text
DEPENDENCY=<REQUIREMENT>:<LAYER>:<CAPABILITY>
```

`REQUIREMENT` is exactly `REQUIRED` or `OPTIONAL`. Recognized dependency layers are exactly
`CORE`, `TEMPLATE`, `GENERATOR`, `VALIDATOR`, and `ATLAS`. `CLI` is not a valid Plugin
dependency target in v1.0.

An unavailable or incompatible `REQUIRED` dependency makes the Plugin incompatible and
registration fails. An unavailable `OPTIONAL` dependency does not alone make the Plugin
incompatible, but a contribution requiring that unavailable capability cannot be treated
as compatible.

Dependency declarations are inert compatibility metadata. They must not trigger filesystem
discovery, dynamic sourcing, package installation, shell execution, or lower-layer mutation.
### Capability Authority Matrix

Dependency-layer recognition and capability authorization are distinct contracts.

Recognition of a dependency layer in the Plugin Definition Grammar does not imply that
arbitrary capability identifiers are authorized for that layer.

Capability semantics remain owned by the certified or frozen contract of the dependency
target domain. Plugin does not create, redefine, infer, or extend lower-layer capability
semantics.

For Plugin v1.0, the canonical dependency capability matrix is:

| Layer | Capability | Plugin v1.0 status |
| --- | --- | --- |
| `GENERATOR` | `register` | CANONICAL |
| `VALIDATOR` | `register` | CANONICAL |
| `CORE` | — | NO CANONICAL PLUGIN CAPABILITY |
| `TEMPLATE` | — | NO CANONICAL PLUGIN CAPABILITY |
| `ATLAS` | — | NO AUTHORIZED PLUGIN DEPENDENCY-ID MAPPING |

`GENERATOR:register` derives its semantic authority from the Generator public
registration contract.

`VALIDATOR:register` derives its semantic authority from the Validator public
registration contract.

`CORE` and `TEMPLATE` remain recognized dependency-layer grammar tokens, but Plugin
v1.0 defines no canonical capability identifier for either layer.

Atlas owns an independently certified public capability surface. Plugin v1.0 does not
define or infer dependency capability identifiers from that surface. In particular,
umbrella aliases such as `ATLAS:public-api` are not authorized by this contract.

The Plugin Compatibility Layer may maintain an explicit deterministic mirror of the
canonical identifiers authorized above solely for satisfiability evaluation. That mirror
is not semantic authority and must not become a global capability registry.

The compatibility implementation must not derive capability availability from filesystem
state, executable discovery, private helper presence, dynamically constructed function
names, or guessed mappings from public function names.

For Plugin v1.0, a `REQUIRED` dependency is satisfiable only when its exact
`LAYER:CAPABILITY` pair is authorized by this matrix. An unavailable or unauthorized
`REQUIRED` pair makes the Plugin incompatible before registry mutation.

An unavailable or unauthorized `OPTIONAL` pair does not alone make the Plugin
incompatible. This does not authorize application of a contribution that requires the
unavailable capability.

### Canonical Example

```text
ID=marketplace-pack
CONTRACT_VERSION=1.0
PURPOSE=Register marketplace Generator and Validator extensions
DEPENDENCY=REQUIRED:GENERATOR:register
DEPENDENCY=REQUIRED:VALIDATOR:register
CONTRIBUTION=GENERATOR:provider
CONTRIBUTION=VALIDATOR:dependencies
```

This serialization is the Plugin Definition Grammar v1.0 contract.

---

# 9. Plugin Definition Validation

A Plugin Definition is invalid when any mandatory contract condition
fails.

At minimum, validation must reject:

```text
empty expected Plugin ID
empty definition
missing ID
definition ID mismatch
missing CONTRACT_VERSION
unsupported CONTRACT_VERSION
missing mandatory contribution declaration
malformed contribution declaration
unsupported contribution type
forbidden private lower-layer dependency
forbidden executable path authority
malformed dependency declaration
```

Definition validation must not execute or source definition content, use
`eval`, invoke arbitrary functions named by untrusted metadata, mutate
Plugin Registry state, or mutate lower-layer registries.

---

# 10. Plugin Registry State

Plugin v1.0 uses explicit in-memory Registry state.

Conceptually:

```text
PHOENIX_PLUGIN_REGISTRY_IDS
PHOENIX_PLUGIN_REGISTRY_DEFINITIONS
```

The implementation names are not part of the public contract.

Registry requirements:

1.  insertion order must be preserved;
2.  Plugin IDs must be unique;
3.  the exact accepted Plugin Definition must remain resolvable;
4.  Registry state must be deterministic;
5.  Registry state must use Bash 3.2-compatible mechanisms;
6.  Registry state must not require associative arrays;
7.  Registry operations must not mutate the filesystem.

Runtime Plugin resolution operates against registered state and must not
rescan the filesystem.

---

# 11. `phoenix::plugin_exists`

## Signature

```bash
phoenix::plugin_exists <plugin-id>
```

Exactly one Plugin ID is required.

Return `0` when the Plugin ID is registered. Return `1` when the Plugin
ID is empty, unknown, or unsupported positional arguments are supplied.

No public stdout output is required. Mutation: none.

---

# 12. `phoenix::plugin_register`

## Signature

```bash
phoenix::plugin_register \
  <plugin-id> \
  <plugin-definition>
```

Validates and explicitly registers one Plugin Definition.

Registration does not execute or activate the Plugin and does not imply
contribution execution unless a separately specified registration
workflow explicitly coordinates contribution application.

Before successful Plugin Registry mutation, all mandatory registration
preconditions must succeed:

```text
Plugin ID present
Plugin Definition present
Plugin ID not already registered
definition structurally valid
definition ID matches requested Plugin ID
Plugin contract version supported
required dependencies satisfiable
declared contribution types supported
mandatory contribution declarations structurally valid
security boundary preserved
```

On success, append the Plugin ID and exact accepted Plugin Definition to
Plugin Registry state and return `0`.

Return `1` when any mandatory precondition fails.

A duplicate Plugin ID must fail and the original registration must
remain unchanged. Direct duplicate registration is not idempotent.

A higher-level bootstrap coordinator may avoid attempting duplicate
registration of known built-ins, but that does not weaken strict
`phoenix::plugin_register` semantics.

Filesystem mutation is forbidden.

---

# 13. `phoenix::plugin_resolve`

## Signature

```bash
phoenix::plugin_resolve <plugin-id>
```

On success, return `0` and print the exact registered Plugin Definition
to stdout.

Return `1` when the Plugin ID is empty, unknown, or unsupported
positional arguments are supplied.

Mutation: none. Resolution must not read or rescan arbitrary Plugin
directories.

---

# 14. `phoenix::plugin_list`

## Signature

```bash
phoenix::plugin_list
```

Return `0` and print one Plugin ID per line in registration order.

An empty Plugin Registry produces no Plugin IDs and returns success.

Mutation: none. Filesystem enumeration order must never determine Plugin
listing order.

---

# 15. Registration Validation Order

Plugin registration is fail-fast.

The v1.0 validation direction is:

```text
1. validate argument count
2. validate Plugin ID presence
3. validate Plugin Definition presence
4. reject duplicate Plugin ID
5. validate Plugin Definition structure
6. validate definition ID match
7. validate Plugin contract version
8. validate dependencies
9. validate contribution declarations
10. validate contribution compatibility
11. append Plugin Registry state
```

No Plugin Registry mutation may occur before mandatory Plugin-level
preconditions succeed.

---

# 16. Compatibility Contract

Plugin compatibility is explicit and must not be inferred from
filenames, approximate version similarity, current working directory,
undocumented environment variables, optimistic fallback, or implicit
Semantic Versioning assumptions.

Compatibility evaluation must determine whether the Plugin Definition
can be safely consumed by the supported Plugin contract and required
lower-layer public APIs.

`COMPATIBLE` and `INCOMPATIBLE` are evaluation outcomes, not stored
lifecycle states.

---

# 17. Plugin Contract Version

Plugin release identity and Plugin contract version are separate
concepts.

A Plugin's own release version must not automatically determine
compatibility with Phoenix.

Plugin v1.0 requires an explicit supported Plugin contract version.
Unsupported contract versions must fail deterministically.

Plugin v1.0 must not silently assume Semantic Versioning ranges,
major/minor compatibility, forward compatibility, or backward
compatibility unless explicitly frozen by a later contract revision.

The exact supported Plugin contract version grammar must be explicit
before implementation is certified.

---

# 18. Dependency Contract

Plugin dependencies must remain explicit, controlled,
architecture-compatible, minimal, and capability-aware.

A Plugin must not depend on private lower-layer implementation details.

Forbidden dependencies include lower-layer `_phoenix::*` helpers, direct
Generator or Validator Registry arrays, CLI internals, Atlas private
helpers, and filesystem discovery as dependency resolution.

Required dependencies must be available before successful registration
or mandatory contribution application. Optional or irrelevant capability
dependencies must not silently become globally required.

---

# 19. Contribution Model

Plugin v1.0 coordinates declared contributions. It does not execute
lower-layer semantics itself.

Initial contribution domains are:

```text
GENERATOR
VALIDATOR
```

A contribution declaration must identify an explicitly supported
contribution type and sufficient inert data to validate the target
lower-layer registration contract.

Unknown contribution types must fail. Contribution order must be
deterministic.

---

# 20. Generator Contribution Contract

Generator contributions use the certified Generator public registration
contract.

```text
Plugin
  ↓
validated Generator contribution
  ↓
phoenix::generator_register
  ↓
Generator Registry
```

Plugin must not patch Generator internals, invoke private
`_phoenix::generator_*` helpers, mutate Generator Registry arrays
directly, redefine Generator planning/execution, or reinterpret
Generator Definition semantics.

Generator remains owner of Generator semantics.

---

# 21. Validator Contribution Contract

Validator contributions use the certified Validator public registration
contract.

```text
Plugin
  ↓
validated Validator contribution
  ↓
phoenix::validator_register
  ↓
Validator Registry
```

Plugin must not patch Validator execution, invoke private
`_phoenix::validator_*` helpers, mutate Validator Registry arrays
directly, reinterpret Validator result semantics, or execute Validator
Definition data itself.

Validator remains owner of validation semantics. Any executable
implementation-reference behavior remains governed by the certified
Validator contract, not generic Plugin metadata semantics.

---

# 22. Contribution Preflight

Before mutating lower-layer registries, Plugin coordination must perform
all reasonably available deterministic preflight validation.

Preflight must validate, as applicable:

```text
contribution type
contribution identity
definition presence
definition structure
target lower-layer public API availability
duplicate conditions detectable before mutation
required dependencies
contract compatibility
security constraints
```

If mandatory preflight fails: `STOP`.

No lower-layer contribution should be attempted after the failing
mandatory precondition.

Preflight minimizes partial cross-registry state. It does not create a
transactional rollback engine.

---

# 23. Contribution Application

After successful mandatory preflight, contributions may be applied
through approved lower-layer public APIs.

Application order must be deterministic.

On first mandatory contribution failure: `STOP`. Subsequent mandatory
contributions must not be attempted.

A successful individual lower-layer registration remains governed by the
lower-layer contract.

---

# 24. Partial Contribution Policy

Plugin v1.0 does not require cross-registry transactional rollback.

If contribution A succeeds and contribution B fails, the global
contribution operation must return failure. Earlier valid lower-layer
registrations may remain present.

This is not lower-layer Registry corruption.

Partial completion must never be reported as complete Plugin success.

No implementation may claim rollback unless rollback is explicitly
implemented and separately specified.

---

# 25. Failure Containment

Plugin failures must remain attributable and contained.

A Plugin failure must not corrupt or redefine Core, Template Engine,
Generator Registry invariants, Validator Registry invariants, CLI, Atlas
SDK, or certified lower-layer contracts.

Failure attribution should preserve enough information to determine
Plugin identity, failed operation, contribution type, contribution
identity, and underlying lower-layer failure.

Exact diagnostic wording is not part of the stable public compatibility
contract unless separately frozen.

Plugin contribution failure does not automatically change the persistent
Plugin lifecycle state to `FAILED`.

---

# 26. Lifecycle Boundary

Plugin v1.0 uses a deliberately minimal lifecycle:

```text
UNREGISTERED
     |
     | successful explicit registration
     v
REGISTERED
```

`COMPATIBLE`, `INCOMPATIBLE`, `FAILED`, `LOADED`, `UNLOADED`, `ACTIVE`,
and `INACTIVE` are not persistent Plugin lifecycle states.

Compatibility and failure are operation outcomes. Plugin v1.0 does not
implement a service-manager lifecycle.

---

# 27. Discovery Boundary

Plugin v1.0 discovery is explicit. A Plugin becomes known to Phoenix
through explicit registration.

Filesystem presence alone does not register a Plugin.

Forbidden v1.0 discovery mechanisms include automatic directory
scanning, recursive plugin discovery, glob-order registration,
register-every-file behavior, and filesystem rescanning during resolve
or list.

Built-in Plugin definitions, if introduced, must be explicitly
enumerated.

---

# 28. Filesystem Boundary

Plugin Registry operations must not mutate the filesystem.

Plugin v1.0 must not use unrestricted filesystem traversal to locate
Plugin implementations.

Internal DevKit module paths and external/user-derived paths have
different trust boundaries.

Internal module paths must be resolved through stable DevKit-owned
location contracts. Caller working directory must not silently redefine
internal Plugin module resolution.

---

# 29. Shell Evaluation Boundary

Plugin Definition and metadata are inert data.

Plugin implementation must not evaluate untrusted Plugin data using:

```text
eval
bash -c
sh -c
```

Plugin data must never become arbitrary shell syntax. Shell-like
metadata values must remain inert.

---

# 30. Source / Code Loading Boundary

Controlled sourcing of known internal DevKit modules is permitted.

Arbitrary or Plugin-controlled sourcing is forbidden in Plugin v1.0.

The following is forbidden:

```bash
source "$path_from_plugin_metadata"
```

Generic third-party shell-code loading is not part of Plugin v1.0.

Plugin v1.0 is an extension-contract system, not a generic
arbitrary-code loader.

Any future external executable Plugin model requires a separate explicit
security architecture and contract revision.

---

# 31. Executable Reference Boundary

Untrusted Plugin metadata must not directly construct arbitrary callable
function names.

A function-reference mechanism may exist only when an explicitly
certified lower-layer contract owns and validates that reference.

```text
arbitrary Plugin metadata function name      FORBIDDEN
eval-based invocation                        FORBIDDEN
data-driven shell command construction       FORBIDDEN
certified lower-layer function reference     LOWER-LAYER CONTRACT OWNED
```

Plugin v1.0 introduces no generic executable-function-reference field.

---

# 32. Private Lower-Layer API Boundary

Plugin may consume only approved stable lower-layer public APIs.

Plugin must not call:

```text
_phoenix::generator_*
_phoenix::validator_*
_phoenix::atlas_*
_phoenix::cli_*
```

or other lower-layer private helpers.

Plugin must not mutate lower-layer internal arrays or state directly.

Public contracts, not implementation structure, define extension
authority.

---

# 33. Determinism Contract

Given the same Plugin Registry baseline, Plugin Definition, supported
Plugin contract version, lower-layer public contract state, and
dependency state, Plugin validation and registration must produce the
same outcome.

Plugin v1.0 must avoid behavior dependent on filesystem enumeration
order, random ordering, implicit environment discovery, caller PWD for
internal modules, network state, or unstable shell glob order.

Plugin listing order and contribution application order must be
deterministic.

---

# 34. Bash Compatibility

Plugin v1.0 must remain compatible with the Phoenix DevKit Bash
baseline.

Minimum target:

```text
Bash 3.2 or newer
```

Implementation must avoid unsupported Bash features unless the DevKit
baseline is changed through explicit architecture revision.

Associative arrays must not be required by Plugin v1.0. Indexed arrays
and Bash 3.2-compatible constructs must be used where registry state is
required.

---

# 35. Public API Stability

After Plugin v1.0 certification, the public API becomes a compatibility
contract.

Incompatible changes include removing or renaming a public function,
changing required arguments or return semantics, changing registry
ordering or definition-resolution semantics, weakening security
boundaries, introducing implicit discovery, or introducing arbitrary
code loading.

Such changes require explicit versioning or contract revision.

Compatible internal evolution may include private helper refactoring,
additional internal validation, performance improvements, additional
diagnostics, and internal implementation decomposition, provided frozen
public behavior remains unchanged.

---

# 36. Required Automated Tests

Plugin implementation certification must include tests for at least:

1.  unknown Plugin does not exist;
2.  valid Plugin registration succeeds;
3.  registered Plugin exists;
4.  duplicate Plugin registration fails;
5.  duplicate failure preserves original registration;
6.  missing Plugin ID fails;
7.  missing Plugin Definition fails;
8.  definition ID mismatch fails;
9.  malformed definition fails;
10. unsupported Plugin contract version fails;
11. incompatible required dependency fails;
12. unsupported contribution type fails;
13. valid resolve returns exact registered definition;
14. unknown resolve fails;
15. Plugin list preserves registration order;
16. empty Plugin list succeeds;
17. Registry operations do not mutate filesystem;
18. Plugin metadata remains inert;
19. no operational `eval` exists in Plugin runtime;
20. no Plugin-data-driven `bash -c` or `sh -c` exists;
21. no arbitrary Plugin-data-driven `source` exists;
22. Plugin runtime does not require lower-layer private helpers;
23. Plugin runtime does not mutate lower-layer Registry arrays directly;
24. compatibility failure leaves Plugin unregistered;
25. failed mandatory preflight prevents contribution application;
26. contribution application stops after first mandatory failure;
27. partial contribution completion is not reported as success;
28. deterministic Plugin listing;
29. deterministic contribution order;
30. Bash 3.2 compatibility;
31. lower certified layers remain independent of Plugin;
32. Atlas SDK dependency boundary remains intact;
33. CLI contract remains unchanged by Plugin v1.0.

---

# 37. Out-of-Scope v1 Functionality

Plugin v1.0 does not provide plugin
activation/deactivation/shutdown/unloading APIs, generic plugin
execution, filesystem auto-discovery, an external plugin marketplace,
network installation, a dependency package manager, CLI command
injection, dynamic CLI grammar, an automatic rollback transaction
manager, an arbitrary shell script loader, a persistent plugin health
daemon, or a plugin sandbox process manager.

These require separate architecture decisions if introduced later.

---

# 38. Definition of Done

Plugin / Extension Model implementation is complete only when:

```text
Architecture reviewed
Function Specification frozen
Public API frozen
Plugin Definition grammar frozen
Registry contract implemented
Compatibility contract implemented
Dependency contract implemented
Contribution contracts implemented
Security boundary verified
Failure containment verified
Bash 3.2 compatibility verified
Required tests PASS
Full DevKit regression PASS
Dependency-direction audit PASS
Security audit PASS
Documentation complete
Master Record updated
Repository clean
Local main synchronized with origin/main
```

---

# 39. Implementation Boundary

Plugin runtime implementation must not begin until all of the following
future implementation-gate conditions have been satisfied.

The values below are required gate states, not the current Phase 9 status:

```text
Plugin Function Specification              REVIEWED
Public API                                  FROZEN
Plugin Definition Contract                  FROZEN
Registration Validation Order              FROZEN
Compatibility Contract                      FROZEN
Contribution Contract                       FROZEN
Failure Containment                         FROZEN
Security Boundary                           FROZEN
Dependency Direction                        FROZEN
Cross-Contract Review                       PASS
Implementation Plan                         APPROVED
```

Current Phase 9 status is authoritative only in Section 42,
`Specification Status`.

Until those conditions are satisfied:

```text
PLUGIN IMPLEMENTATION = NOT STARTED
```

---

# 40. Frozen Invariants

Plugin v1.0 freezes the following invariants:

1.  Plugin System owns extension coordination, not lower-layer
    semantics.
2.  Lower layers do not depend upward on Plugin.
3.  Plugin uses approved public lower-layer APIs only.
4.  Plugin public namespace is `phoenix::plugin_*`.
5.  Plugin private namespace is `_phoenix::plugin_*`.
6.  Plugin v1.0 exposes exactly four public functions.
7.  Plugin registration is explicit.
8.  Plugin discovery is not filesystem scanning.
9.  Plugin Registry is deterministic and insertion ordered.
10. Duplicate Plugin IDs fail.
11. Plugin Definitions are inert data.
12. Compatibility is explicit.
13. Compatibility is evaluated before successful registration.
14. `COMPATIBLE` and `INCOMPATIBLE` are not lifecycle states.
15. Registration does not imply execution.
16. Registration does not imply activation.
17. Initial contribution types are Generator and Validator.
18. Contributions use lower-layer public registration contracts.
19. Plugin does not patch lower-layer engines.
20. Contribution processing is deterministic and fail-fast.
21. Mandatory preflight occurs before contribution application where
    possible.
22. Partial completion is never reported as overall success.
23. Cross-registry transactional rollback is not required for v1.0.
24. Plugin failure does not corrupt certified lower layers.
25. `eval` on Plugin data is forbidden.
26. Plugin-data-driven `bash -c` / `sh -c` is forbidden.
27. Plugin-controlled arbitrary `source` is forbidden.
28. Generic arbitrary third-party shell-code loading is out of scope.
29. Plugin does not consume lower-layer `_phoenix::*` helpers.
30. Plugin does not mutate lower-layer Registry arrays directly.
31. Internal path authority remains architecture-controlled.
32. Plugin behavior is deterministic.
33. Plugin v1.0 remains Bash 3.2-compatible.
34. Associative arrays are not required.
35. CLI Plugin extension is out of scope for v1.0.
36. Atlas SDK remains independently usable without Plugin.

---

## Freeze Decisions — Plugin Specification v1.0

The remaining review items are resolved as architectural decisions rather than runtime compatibility contracts.

### Private Helper Decomposition

Private `_phoenix::plugin_*` helper naming, decomposition, and internal organization are implementation-controlled.
They are not part of the Plugin public API or compatibility surface.

### Diagnostics Wording

Exact human-readable diagnostic wording is implementation-controlled and is not part of the Plugin public compatibility contract.
Failure classification, return-status semantics, deterministic failure behavior, mutation guarantees, and failure attribution remain contractual.

### Built-in Plugin Policy

Plugin v1.0 defines no built-in Plugins.
Plugin registration is explicit. No Plugin may become registered through implicit directory scanning, recursive discovery, filename inference, or hidden bootstrap behavior.
Any future built-in Plugin set requires explicit architectural enumeration and contract revision before certification.

---

# 41. Specification Freeze Gate

The previously identified residual review items are resolved by the
Freeze Decisions above.

```text
No remaining runtime contract blockers.
Residual review items are resolved by the Freeze Decisions above.
```

No unresolved runtime grammar, compatibility, dependency, contribution,
failure-containment, security, or public-API item remains in this section.

The final cross-contract review has passed and the explicit Function
Specification freeze decision is recorded in Sections 42 and 43.

---

<!-- P9-F09 / P9-F10 / P9-F11 documentary remediation applied. -->

<!-- STEP 11B.5 FORMAL FUNCTION SPECIFICATION FREEZE -->

# 42. Specification Status

```text
Phase 9 Architectural Forensics             COMPLETE
Scope & Ownership                           DEFINED
Dependency Direction                        DEFINED
Public API Boundary                         DEFINED
Lifecycle                                   DEFINED
Registration / Discovery                    DEFINED
Failure Containment                         DEFINED
Security Boundary                           DEFINED
Compatibility Model                         DEFINED
Specification Synthesis                     COMPLETE

Public API                              FROZEN
Function Signatures                     FROZEN
Registry Model                          FROZEN
Plugin Definition                       FROZEN
Compatibility Contract                  FROZEN
Contribution Contract                   FROZEN
Failure Containment                     FROZEN
Security Boundary                       FROZEN
Bash Compatibility                      FROZEN
Cross-Contract Review                   PASS — COMPLETE
Implementation Plan                         NOT STARTED
Plugin Runtime Implementation               NOT STARTED

FUNCTION SPECIFICATION                  FROZEN
```

---

# 43. Specification Decision

This document is the frozen Phase 9 Plugin / Extension Model Function
Specification v1.0.

The final cross-contract review has passed.

```text
FUNCTION SPECIFICATION = FROZEN
CROSS-CONTRACT REVIEW = PASS — COMPLETE
OPEN CONTRACT BLOCKERS = 0
OPEN SECURITY BLOCKERS = 0
OPEN DEPENDENCY BLOCKERS = 0
OPEN GRAMMAR BLOCKERS = 0
PLUGIN RUNTIME IMPLEMENTATION = NOT STARTED
IMPLEMENTATION PLAN = NOT STARTED
```

This freeze authorizes the next planning activity. It does not authorize
Plugin runtime implementation.

Any change to the frozen public API, Plugin Definition Grammar,
registration semantics, compatibility contract, contribution contract,
failure-containment rules, security boundary, or dependency direction
requires explicit contract revision before implementation.

The next mandatory activity is the Phase 9 Plugin implementation plan.
