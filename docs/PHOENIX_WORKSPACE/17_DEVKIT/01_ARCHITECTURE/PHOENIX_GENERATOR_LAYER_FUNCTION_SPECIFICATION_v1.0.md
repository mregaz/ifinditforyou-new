# PHOENIX GENERATOR LAYER FUNCTION SPECIFICATION
## Version 1.0

**Status:** Specification

---

# 1. Purpose

This document defines the public contracts of the Phoenix DevKit Generator Layer.

The Generator Layer architecture defines responsibilities, dependency direction, planning, execution, dry-run behavior, overwrite policy, and security boundaries.

This specification defines exactly how callers interact with the Generator Layer.

Implementation must conform to this specification.

---

# 2. Scope

Generator Layer v1.0 provides three primary capabilities:

```text
Generator Discovery
Generation Planning
Generation Execution
```

These capabilities are exposed through the public API:

```text
phoenix::generator_exists
phoenix::generator_register
phoenix::generator_plan
phoenix::generator_run
```

No additional public Generator Layer API beyond these four functions is required for version 1.0.

---

# 3. Core Principle

The Generator Layer follows:

> Plan first. Validate before mutation. Execute explicitly.

The execution sequence is:

```text
Request
  ↓
Validate
  ↓
Resolve Generator
  ↓
Plan
  ↓
Check Conflicts
  ↓
Render
  ↓
Execute
  ↓
Validate Result
  ↓
Return Result
```

Filesystem mutation must never occur before planning and required validation have succeeded.

---

# 4. Generator Identity

Every generator has a stable Generator ID.

Generator IDs follow:

```text
[a-z][a-z0-9_-]*
```

Valid examples:

```text
module
provider
validator
plugin
provider-sdk
```

Invalid examples:

```text
Provider
MODULE
_provider
provider sdk
```

Generator IDs are case-sensitive.

---

# 5. Generator Registry Contract

Generator v1.0 uses an explicit registry.

The registry associates:

```text
Generator ID
        ↓
Generator Definition
```

Conceptually:

```text
module    → module generator definition
provider  → provider generator definition
validator → validator generator definition
```

Implicit directory scanning is not part of v1.0.

---

# 6. Generator Definition

A Generator Definition must provide enough information to plan generation.

Required conceptual fields:

```text
id
template mapping
required variables
destination mapping
overwrite policy
```

The exact internal Bash representation is implementation detail.

Generator Definition data must not be exposed as executable shell content.

---

# 7. Generation Request

A Generation Request is explicit caller input.

Version 1.0 uses positional arguments plus explicit `KEY=VALUE` options rather than hidden global state.

Conceptually:

```text
generator_id
destination
variables
options
```

Example:

```bash
phoenix::generator_run \
    "provider" \
    "./providers/ricardo" \
    "PROVIDER_NAME=Ricardo" \
    "COUNTRY=CH"
```

---

# 8. Request Variables

Generation variables use the existing Template Engine assignment contract:

```text
KEY=VALUE
```

Variable names follow:

```text
[A-Z][A-Z0-9_]*
```

Examples:

```text
NAME=Phoenix
PROVIDER_NAME=Ricardo
COUNTRY=CH
URL=https://example.test/?a=1&b=2
```

Additional `=` characters belong to the value.

---

# 9. Reserved Generator Options

Generator options must not collide with template variables.

Version 1.0 reserves option names prefixed with:

```text
PHOENIX_
```

Examples:

```text
PHOENIX_DRY_RUN=1
PHOENIX_OVERWRITE=1
```

Generator-specific template variables must not use the reserved `PHOENIX_` namespace unless explicitly defined by architecture.

---

# 10. Dry-Run Option

Dry-run is requested with:

```text
PHOENIX_DRY_RUN=1
```

Accepted values:

```text
0
1
```

Default:

```text
0
```

Invalid values cause request failure.

Dry-run performs planning and validation without filesystem mutation.

---

# 11. Overwrite Option

Overwrite authorization is requested with:

```text
PHOENIX_OVERWRITE=1
```

Accepted values:

```text
0
1
```

Default:

```text
0
```

Default policy is therefore:

```text
DENY OVERWRITE
```

If a planned destination already exists and overwrite is not explicitly enabled, generation fails.

---

# 12. Option Parsing

Reserved options are parsed separately from template variables.

Example:

```bash
phoenix::generator_run \
    "provider" \
    "./providers/ricardo" \
    "PROVIDER_NAME=Ricardo" \
    "PHOENIX_DRY_RUN=1"
```

`PROVIDER_NAME` is a template variable.

`PHOENIX_DRY_RUN` is generator execution control.

## Duplicate Reserved Options

Reserved Generator options must not appear more than once in the same request.

The following is invalid:

```text
PHOENIX_DRY_RUN=0
PHOENIX_DRY_RUN=1
```

The following is also invalid:

```text
PHOENIX_OVERWRITE=0
PHOENIX_OVERWRITE=1
```

Duplicate reserved options cause request failure.

This differs intentionally from normal template-variable behavior.

Normal template variables use:

```text
first match wins
```

Reserved execution-control options use:

```text
duplicate option → invalid request
```

This prevents ambiguous mutation-control behavior.
---

# 13. phoenix::generator_exists

## Purpose

Determines whether a registered generator exists.

## Signature

```bash
phoenix::generator_exists <generator_id>
```

## Arguments

| Argument | Required | Description |
|---|---|---|
| `$1` | Yes | Generator ID |

## Output

No stdout output.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | Generator exists |
| `1` | Generator does not exist or ID is invalid |

## Side Effects

None.

---

# 14. phoenix::generator_plan

## Purpose

Builds and validates a generation plan without modifying the filesystem.

## Signature

```bash
phoenix::generator_plan \
    <generator_id> \
    <destination> \
    [KEY=VALUE ...]
```

## Arguments

| Argument | Required | Description |
|---|---|---|
| `$1` | Yes | Generator ID |
| `$2` | Yes | Requested destination |
| `$3...$n` | No | Template variables and reserved generator options |

---

# 15. generator_plan Output

On success, `generator_plan` writes a deterministic textual plan to stdout.

Version 1.0 uses a line-oriented result format.

Each planned artifact is represented as:

```text
ARTIFACT=<destination_path>
```
Example:

```text
STATUS=PLAN
GENERATOR=provider
DESTINATION=./providers/ricardo
OVERWRITE=0
DRY_RUN=0
ARTIFACT=./providers/ricardo/index.sh
ARTIFACT=./providers/ricardo/manifest.phoenix
The output order is part of the v1.0 public contract:

```text
STATUS
GENERATOR
DESTINATION
OVERWRITE
DRY_RUN
ARTIFACT...
```

The exact order is stable and forms part of the v1.0 contract.

---

# 16. generator_plan Return Codes

| Code | Meaning |
|---|---|
| `0` | Plan built successfully |
| `1` | Invalid request, unknown generator, invalid variables, template failure, path failure, or conflict |

Planning failure must not produce a successful partial plan.

---

# 17. Plan Determinism

Given identical:

```text
generator definition
request
variables
options
destination state
```

`generator_plan` must produce identical output.

The plan must not depend implicitly on:

```text
current time
random values
environment variables
network responses
```

unless future architecture explicitly introduces them.

---

# 18. Planning Is Non-Mutating

`phoenix::generator_plan` must not:

- create files;
- overwrite files;
- create directories;
- remove files;
- modify templates;
- modify manifests.

Planning is observational and preparatory only.

---

# 19. Plan Validation

Before returning success, planning must validate:

1. generator ID;
2. generator registration;
3. destination argument;
4. reserved options;
5. required variables;
6. template availability;
7. output mapping;
8. destination conflicts;
9. path safety rules;
10. rendering feasibility where practical.

---

# 20. Unknown Generator

Example:

```bash
phoenix::generator_plan \
    "generator-that-does-not-exist" \
    "./output"
```

must return:

```text
1
```

and must not modify the filesystem.

---

# 21. Destination Contract

The destination must be explicit and non-empty.

Version 1.0 must reject:

```text
empty destination
```

Path normalization and workspace boundary rules must be applied consistently by implementation.

The Generator Layer must not silently redirect output elsewhere.

---

# 22. Path Traversal Contract

Generator artifact mappings must always be relative paths.

Valid examples:

```text
index.sh
src/provider.sh
config/manifest.phoenix
```

Invalid examples:

```text
../secret.txt
../../outside.txt
/absolute/output.txt
```

The caller-provided destination may be absolute or relative.

The final artifact path is formed conceptually as:

```text
destination
+
safe relative artifact mapping
```

Artifact mappings must not:

- be absolute paths;
- contain `..` path traversal segments;
- escape the authorized destination scope.

If a mapping violates these rules:

```text
generator_plan → return 1
generator_run  → return 1
```

No filesystem mutation may occur.

Path traversal validation must therefore happen before execution.

---

# 23. Artifact Mapping

A generation plan may contain one or multiple artifacts.

Conceptually:

```text
template_a → destination_a
template_b → destination_b
template_c → destination_c
```

Every artifact must be explicitly represented in the plan.

Hidden artifact creation is forbidden.
## Artifact Ordering Contract

Artifact ordering is deterministic and part of the Generator Layer v1.0 public contract.

Artifacts must appear in the same order declared by the Generator Definition.

Example Generator Definition order:

```text
index.sh
manifest.phoenix
README.md
```

The plan and execution result must preserve that order:

```text
ARTIFACT=<destination>/index.sh
ARTIFACT=<destination>/manifest.phoenix
ARTIFACT=<destination>/README.md
```

The Generator Layer must not:

- sort artifacts alphabetically;
- reorder artifacts based on filesystem state;
- reorder artifacts based on template discovery order;
- depend on shell glob ordering;
- depend on directory traversal order.

The Generator Definition is the authoritative ordering source.

## Rendered Artifact Mapping Contract

Generator artifact mappings may contain Template Engine placeholders.

Example:

```text
ADR-{{ADR_NUMBER}}_{{ADR_FILE_TITLE}}.md
```

Artifact mappings containing placeholders must be rendered using the certified:

```text
phoenix::template_render
```

API.

Artifact mapping rendering is non-mutating.

The rendered artifact mapping becomes the authoritative relative output mapping used by planning and execution.

The rendered mapping must be validated for path safety after rendering.

The rendered artifact mapping must:

- be non-empty;
- remain a relative path;
- not contain `..` traversal segments;
- not escape the caller-provided destination scope.

If artifact mapping rendering fails, or if the rendered mapping violates path safety:

```text
generator_plan → return 1
generator_run  → return 1
```

No filesystem mutation may occur.

Artifact mapping values remain data.

Rendered artifact mapping must never execute values through:

```text
eval
source
bash -c
sh -c
```

Artifact ordering continues to follow Generator Definition declaration order.

---

# 24. Destination Conflict Policy

A conflict exists when a planned output target already exists.

Default behavior:

```text
PHOENIX_OVERWRITE=0

# 25. Explicit Overwrite

When:

```text
PHOENIX_OVERWRITE=1
```

planned existing files may be replaced if the generator definition permits overwrite behavior.

Overwrite authorization applies only to explicitly planned artifact paths.

It does not authorize unrelated filesystem mutation.

---

# 26. phoenix::generator_run

## Purpose

Executes an already valid generation request.

## Signature

```bash
phoenix::generator_run \
    <generator_id> \
    <destination> \
    [KEY=VALUE ...]
```

## Arguments

The argument contract is identical to `generator_plan`.

---

# 27. generator_run Execution Model

`generator_run` follows:

```text
Validate Request
      ↓
Build Plan
      ↓
Validate Plan
      ↓
Dry-Run?
  ┌───┴────┐
 Yes       No
  │         │
  ▼         ▼
Return    Render
Plan       ↓
        Write Artifacts
            ↓
       Post-Validation
            ↓
       Generation Result
```

`generator_run` must not bypass planning.

---

# 28. Dry-Run Behavior

When:

```text
PHOENIX_DRY_RUN=1
```

`generator_run`:

- builds the same plan as `generator_plan`;
- validates the request;
- validates conflicts;
- returns success if the plan is valid;
- does not create or modify filesystem artifacts.

Dry-run output may use the same plan format.

---

# 29. Normal Execution Behavior

When:

```text
PHOENIX_DRY_RUN=0
```

and planning succeeds:

1. templates are rendered;
2. rendered output is validated;
3. destination policy is rechecked where required;
4. artifacts are written;
5. required post-generation validation is executed;
6. a generation result is returned.

---

# 30. Generation Result

On successful execution, `generator_run` writes a deterministic result to stdout.

Version 1.0 result format:

```text
STATUS=SUCCESS
GENERATOR=<generator_id>
DESTINATION=<destination>
ARTIFACT=<path>
ARTIFACT=<path>
```

Example:

```text
STATUS=SUCCESS
GENERATOR=provider
DESTINATION=./providers/ricardo
ARTIFACT=./providers/ricardo/index.sh
ARTIFACT=./providers/ricardo/manifest.phoenix
```

---

# 31. Dry-Run Result

A successful dry-run returns:

```text
STATUS=DRY_RUN
GENERATOR=<generator_id>
DESTINATION=<destination>
ARTIFACT=<path>
ARTIFACT=<path>
```

No artifact is written.

---

# 32. Failure Output

Failed generation must not emit:

```text
STATUS=SUCCESS
```

A failed operation returns:

```text
1
```

User-facing diagnostic messages may be emitted through Logger/stderr.

The authoritative success/failure contract remains the return code plus successful result format.

---

# 33. Partial Mutation Policy

Version 1.0 follows:

> Avoid mutation before all preconditions are known.

For multi-file generation, implementation must render and validate all artifacts before the first write where practical.

If a filesystem failure occurs during multi-file writing, the Generator Layer must:

- return failure;
- never report success;
- expose the failure clearly.

Full transactional rollback is not required for v1.0 unless explicitly implemented.

---

# 34. Rendering Contract

All template rendering must use:

```text
phoenix::template_render
```

or:

```text
phoenix::template_render_file
```

according to the implementation design.

Generators must not implement independent placeholder parsing.

Replacement values remain literal according to the certified Template Engine contract.

---

# 35. Template Source Preservation

Generator templates are read-only assets.

Generation must not modify source templates.

The generation flow is:

```text
read template
render content
write destination
```
## Template Source Resolution Contract

Generator template sources may be expressed as absolute or relative paths.

Absolute template source paths are used as provided.

Relative template source paths are resolved against the Phoenix DevKit root.

The DevKit root must be derived deterministically from the Generator Layer module location and must not depend on the caller's current working directory.

Template source resolution is read-only.

If a resolved template source:

- does not exist;
- is not a regular file;

then:

```text
generator_plan → return 1
generator_run  → return 1
```

Template source resolution must not modify templates or other filesystem state.

---

# 36. Required Variables

Each Generator Definition declares required template variables.

Missing required variables cause planning failure.

Example:

```text
Required:
PROVIDER_NAME
COUNTRY
```

If `COUNTRY` is missing:

```text
generator_plan → return 1
generator_run  → return 1
```

---

# 37. Unknown Variables

Version 1.0 may accept additional valid template variables even when not declared as required, provided they do not violate reserved namespace rules.

Version 1.0 may accept additional valid template variables even when not declared as required, provided they do not violate reserved namespace rules.

Unused variables do not implicitly create behavior.

---

# 38. Invalid Variable Assignments

The following are invalid:

```text
NAME
=Phoenix
name=Phoenix
PROJECT-NAME=Phoenix
```

Invalid assignments cause planning and execution failure.

---

# 39. Duplicate Variables

Generator variable handling follows the Template Engine deterministic policy:

```text
first match wins
```

Example:

```text
NAME=first
NAME=second
```

resolves to:

```text
first
```

---

# 40. Environment Isolation

The Generator Layer must not import arbitrary environment variables as template variables.

Example:

```bash
export PROVIDER_NAME="Environment Value"
```

If `PROVIDER_NAME` is required but not explicitly passed in the Generation Request, planning must fail.

---

# 41. Security Contract

Generator inputs are data.

The Generator Layer must never execute:

```text
generator ID
destination
template content
template variables
manifest values
artifact names
```

as shell code.

Rendering/execution logic must not use untrusted data through:

```text
eval
source
bash -c
sh -c
```

---

# 42. Shell-Like Variable Values

Example:

```text
DESCRIPTION=$(touch /tmp/phoenix-generator-danger)
```

must remain literal data when rendered.

No `/tmp/phoenix-generator-danger` file may be created merely because the value was supplied.

---

# 43. Registry Contract

The Generator Registry must provide deterministic generator resolution.

Conceptually:

```text
generator ID → exactly one definition
```

Duplicate generator IDs are invalid.

Unknown IDs fail.

Registry ordering must not affect resolution semantics.

---

# 44. Generator Definition Validation

A registered definition must be rejected if required structural information is missing.

Examples:

```text
missing ID
missing template mapping
invalid destination mapping
invalid required-variable declaration
duplicate generator ID
```

Malformed definitions must not become executable generators.

---

# 45. Post-Generation Validation

A generator may declare mandatory post-generation checks.

If mandatory validation fails:

```text
generator_run → return 1
```

The operation must not report:

```text
STATUS=SUCCESS
```

The Validator Layer may provide reusable validators in future phases.

---

# 46. Logging Contract

Generator Layer may use:

```text
phoenix::log_info
phoenix::log_ok
phoenix::log_warn
phoenix::log_error
phoenix::log_debug
```

for diagnostics.

Logs are not the authoritative programmatic result.

Callers must rely on:

```text
return code
+
generation result
```

---

# 47. Runtime Contract

Generators may use Runtime services for explicit execution prerequisites.

Example:

```text
required platform command
```

Runtime checks must occur before filesystem mutation when the command is required for generation.

---

# 48. Filesystem Contract

All filesystem mutation must use certified Filesystem services where the required operation is available.

Generators must not introduce redundant wrappers for:

```text
create_directory
copy_file
move_file
remove_file
read_file
write_file
```

without explicit architectural justification.

---

# 49. Strings Contract

Generators may use certified Strings services for deterministic naming transformations.

Examples:

```text
trim
case conversion
slugify
validation predicates
```

Naming behavior should not be reimplemented independently per generator.

---

# 50. Manifest Contract

Generators may use Manifest for explicit metadata retrieval.

Manifest content must remain data.

Generators must not source manifest files.

# Output Serialization Contract

All successful Generator Layer stdout contracts use deterministic line-oriented `KEY=VALUE` serialization.

Recognized status values are:

```text
STATUS=PLAN
STATUS=DRY_RUN
STATUS=SUCCESS
```

The canonical output order is:

```text
STATUS
GENERATOR
DESTINATION
OVERWRITE
DRY_RUN
ARTIFACT...
```

For execution results where `OVERWRITE` or `DRY_RUN` are not otherwise required by a caller, the values must still remain deterministic if emitted.

`ARTIFACT` may occur multiple times.

Repeated `ARTIFACT` lines preserve Generator Definition order.

No other successful stdout fields are part of the v1.0 public contract unless explicitly added through architectural review.
---

# 51. Public API Summary

Generator Layer v1.0 public API:

| Function | Purpose | Mutation |
|---|---|---|
| `phoenix::generator_exists` | Generator discovery | No |
| `phoenix::generator_plan` | Build validated artifact plan | No |
| `phoenix::generator_run` | Execute generation | Yes, unless dry-run |

---

# 52. Return Code Policy

Generator Layer follows:

```text
0 = success
1 = failure
```

Predicate behavior follows the same convention.

No additional public return-code taxonomy is introduced in v1.0.

---

# 53. Required Automated Tests

The Generator Layer v1.0 test suite must verify at minimum:

1. known generator exists;
2. unknown generator does not exist;
3. invalid generator ID rejected;
4. valid request planning succeeds;
5. unknown generator planning fails;
6. empty destination fails;
7. missing required variable fails;
8. invalid variable assignment fails;
9. duplicate variable uses first match;
10. valid artifact plan contains expected destinations;
11. plan produces no filesystem mutation;
12. dry-run succeeds;
13. dry-run produces no filesystem mutation;
14. successful generator run creates expected artifact;
15. generated artifact contains expected rendered content;
16. source template remains unchanged;
17. destination conflict fails by default;
18. destination conflict preserves existing content;
19. overwrite succeeds when explicitly authorized;
20. overwrite affects only planned artifacts;
21. missing template fails;
22. template rendering failure fails generation;
23. shell-like replacement values remain literal;
24. shell-like values are not executed;
25. environment variables are not implicitly imported;
26. path traversal attempt fails;
27. invalid output mapping fails;
28. successful result contains correct generator ID;
29. successful result contains expected artifact paths;
30. dry-run result reports `STATUS=DRY_RUN`;
31. normal success reports `STATUS=SUCCESS`;
32. failed operation never reports success;
33. malformed generator definition rejected;
34. duplicate generator ID rejected;
35. post-generation validation failure propagates;
36. multi-artifact planning lists every artifact;
37. multi-artifact rendering succeeds where supported;
38. additional `=` characters in variable values are preserved;
39. empty variable values render when allowed;
40. explicit overwrite default remains disabled.

---

# 54. Definition of Done

Generator Layer v1.0 may be certified only when:

```text
Architecture             COMPLETE
Function Specification   COMPLETE
Registry Contract        IMPLEMENTED
Planning Engine          IMPLEMENTED
Execution Engine         IMPLEMENTED
Dry-Run                   IMPLEMENTED
Overwrite Policy         IMPLEMENTED
Syntax Validation        PASS
Manual Tests             PASS
Automated Tests          PASS
Security Tests           PASS
Code Review              PASS
API Reference            COMPLETE
Certification            APPROVED
Master Record            UPDATED
```

---

# 55. Public API Stability

After certification, the Generator Layer v1.0 public API becomes:

```text
phoenix::generator_exists
phoenix::generator_plan
phoenix::generator_run
```

Breaking changes require:

- architecture review;
- Function Specification update;
- automated test update;
- API Reference update;
- version change where appropriate.

---

# 56. Current Status

```text
Architecture:           COMPLETE
Function Specification: COMPLETE
Implementation:         NOT STARTED
Registry:               NOT STARTED
Planning:               NOT STARTED
Execution:              NOT STARTED
Tests:                  NOT STARTED
API Reference:          PENDING
Certification:          PENDING
```

---

# 57. Specification Decision

Phoenix Generator Layer v1.0 exposes three public capabilities:

```text
generator_exists
generator_plan
generator_run
```

The layer separates planning from execution, denies overwrite by default, supports explicit dry-run, treats all generator inputs as data, and performs no implicit environment-variable import.

The Generator Layer must always follow:

> Plan first. Validate before mutation. Execute explicitly.

---

## Public Registration Contract — `phoenix::generator_register`

### Purpose

Registers one explicit Generator Definition in the Generator Registry.

This function is the public Generator Registration Contract used by
authorized extension layers, including the Phoenix Plugin / Extension
Model.

Registration does not execute a generator.

### Signature

```bash
phoenix::generator_register \
  <generator-id> \
  <generator-definition>
```

### Success Preconditions

All of the following must be true:

```text
generator ID is non-empty
generator definition is non-empty
generator ID is not already registered
generator definition satisfies the certified Generator Definition contract
definition ID matches the requested generator ID
```

### Success Effect

The Generator ID and exact accepted Generator Definition are appended to
the in-memory Generator Registry.

Registration order remains deterministic.

### Failure

Return `1` when any mandatory registration precondition fails.

A failed registration must not append a partial Generator Registry entry.

### Duplicate Registration

A duplicate Generator ID must fail.

The previously registered Generator Definition must remain unchanged.

### Output

No public stdout output is required on successful registration.

Diagnostics may be written to stderr.

### Mutation Boundary

`phoenix::generator_register` may mutate only Generator Registry state.

It must not:

```text
generate artifacts
modify generated destination files
execute templates
execute Plugin behavior
patch Generator engine internals
perform implicit filesystem discovery
```

### Extension Contract

Future extension layers may register Generator Definitions only through
this public registration contract.

They must not mutate Generator Registry arrays directly or call private
`_phoenix::generator_*` helpers.

This section formalizes the Generator Registration Contract already
defined by the Generator Layer Architecture. It does not introduce new
runtime behavior.

