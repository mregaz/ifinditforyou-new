# PHOENIX CLI FUNCTION SPECIFICATION

**Version:** 1.0
**Status:** FROZEN
**Date:** 2026-08-18
**Domain:** Phoenix DevKit — Command-Line Interface

---

# 1. Purpose

This document defines the function-level contracts of the Phoenix DevKit CLI.

It specifies:

- public CLI execution behavior;
- internal parsing responsibilities;
- normalized request semantics;
- subsystem bootstrap behavior;
- command-handler responsibilities;
- Generator CLI translation;
- Validator result handling;
- presentation boundaries;
- canonical status mapping;
- source-safety requirements;
- implementation constraints.

This specification implements the architectural boundaries defined by:

```text
PHOENIX_CLI_ARCHITECTURE_v1.0.md
```

It does not redefine Generator Framework or Validation Framework semantics.

---

# 2. Function Namespace

Phoenix CLI follows the canonical Phoenix namespace convention.

Public CLI functions use:

```text
phoenix::cli_*
```

Internal CLI functions use:

```text
_phoenix::cli_*
```

Lower-layer internal functions using `_phoenix::*` are not part of the CLI
integration surface.

---

# 3. Public Function Surface

The primary public CLI execution function is:

```text
phoenix::cli_run
```

The physical executable:

```text
05_CLI/phoenix
```

is a process entry point, not a reusable library API.

All other CLI functions are internal unless explicitly promoted by a future
specification revision.

---

# 4. phoenix::cli_run

## Purpose

Execute one Phoenix CLI request using the supplied shell argument vector.

## Signature

```bash
phoenix::cli_run [arguments...]
```

## Input

The function receives the original CLI argument vector.

Argument boundaries must be preserved.

The function must not reconstruct the request into an executable command
string.

## Responsibilities

`phoenix::cli_run` owns the top-level reusable CLI lifecycle:

```text
receive argv
 ↓
parse CLI request
 ↓
classify normalized action
 ↓
bootstrap required subsystem
 ↓
dispatch approved handler
 ↓
classify result
 ↓
present result
 ↓
return canonical status
```

## Return

The function returns a canonical CLI status.

It must not call `exit`.

## Side Effects

Direct CLI lifecycle behavior must not mutate user targets.

Delegated Generator execution may produce Generator-owned filesystem side
effects according to the certified Generator contract.

Validation remains read-only.

---

# 5. Public Entry-Point Contract

The executable:

```text
05_CLI/phoenix
```

must:

1. determine its own canonical module location;
2. source the CLI lifecycle module;
3. forward the original `"$@"`;
4. receive the return status from `phoenix::cli_run`;
5. terminate the process using that status.

Conceptually:

```text
process
 ↓
phoenix executable
 ↓
phoenix::cli_run "$@"
 ↓
status
 ↓
exit status
```

The executable must remain thin.

It must not contain Generator or Validator business logic.

---

# 6. Process Termination Ownership

Only the top-level executable may terminate the CLI process using:

```bash
exit
```

Reusable CLI functions use:

```bash
return
```

A sourced CLI module must never unexpectedly terminate the caller's shell.

---

# 7. Source-Safety Contract

The following modules must be safe to source:

```text
cli.sh
parsing.sh
commands.sh
```

Sourcing them must not:

- execute a CLI command;
- print help;
- print version information;
- register operational built-ins automatically;
- invoke a Generator;
- invoke a Validator;
- mutate a user target;
- call `exit`.

Module initialization must be limited to safe definitions, stable metadata,
and load guards.

---

# 8. CLI Version Metadata

The CLI owns a component-level version value:

```text
PHOENIX_CLI_VERSION
```

The value represents the CLI component.

It does not automatically represent the version of the entire Phoenix
DevKit.

The version must come from a canonical CLI metadata source.

It must not be inferred from:

- documentation filenames;
- Git state;
- arbitrary README content;
- unrelated subsystem metadata.

---

# 9. Internal Parser Surface

The candidate internal parser surface is:

```text
_phoenix::cli_parse
_phoenix::cli_parse_root
_phoenix::cli_parse_generate
_phoenix::cli_parse_validate
```

These names define the intended responsibility boundary.

Implementation may use additional private helpers where necessary, provided
the frozen behavior remains unchanged.

---

# 10. _phoenix::cli_parse

## Purpose

Transform the original argument vector into a normalized CLI request.

## Signature

```bash
_phoenix::cli_parse [arguments...]
```

## Input

Original shell argument vector.

## Output

A normalized request containing inert data.

## Success

```text
return 0
```

## Syntax Failure

```text
return 2
```

with a concise diagnostic intended for `stderr`.

## Side Effects

None.

The parser must not:

- mutate the filesystem;
- register capabilities;
- execute a Generator;
- execute a Validator;
- terminate the process.

---

# 11. Parser Ownership

The parser owns CLI syntax.

It may determine:

```text
recognized root operation
recognized command family
argument arity
recognized CLI options
duplicate CLI flags
KEY=VALUE syntactic validity
command-specific option scope
help/list exclusivity
```

The parser does not own domain semantics.

It must not determine:

```text
whether a Generator exists
whether a Validator exists
whether a Generator variable is required
whether overwrite is allowed
whether a template exists
whether a target is valid
whether a generated destination is semantically acceptable
```

---

# 12. Root Parsing

The root parser recognizes:

```text
empty argv
help
--help
--version
generate
validate
```

Conceptually:

```text
empty argv    → ROOT_HELP
help          → ROOT_HELP
--help        → ROOT_HELP
--version     → VERSION
generate ...  → generate parser
validate ...  → validate parser
other         → CLI_USAGE_ERROR
```

Unknown root commands are CLI syntax failures.

They return canonical usage status `2`.

---

# 13. Generate Grammar

The Phase 7 v1 Generate grammar is:

```text
generate --help
generate --list

generate <generator-id> <destination>
         [KEY=VALUE ...]
         [--dry-run]
         [--overwrite]
```

The operational form requires:

```text
generator-id
destination
```

After these positional arguments, accepted tokens are limited to:

```text
KEY=VALUE
--dry-run
--overwrite
```

---

# 14. Generate Parser Responsibilities

The Generate parser must verify:

- required positional arguments are present;
- remaining tokens belong to the accepted CLI grammar;
- `--dry-run` is not duplicated;
- `--overwrite` is not duplicated;
- unknown `--option` tokens are rejected;
- syntactically valid assignments are preserved.

It must not verify:

- Generator existence;
- Generator required variables;
- destination policy;
- overwrite permission;
- template mapping;
- artifact mapping;
- filesystem safety owned by the Generator Framework.

---

# 15. Generate Positional Arguments

For operational Generate requests:

```text
first positional     → generator-id
second positional    → destination
```

Their domain semantics remain owned by the Generator Framework.

The parser must preserve the supplied destination as request data.

It must not resolve the destination by changing the caller working directory.

---

# 16. Assignment Syntax

A Generator assignment has the syntactic form:

```text
KEY=VALUE
```

Requirements:

```text
KEY must not be empty
the first "=" separates key from value
VALUE may be empty
additional "=" characters belong to VALUE
```

Examples of syntactically acceptable assignments:

```text
NAME=Phoenix
EMPTY=
EXPRESSION=a=b=c
TITLE=Phoenix CLI Architecture
```

This is syntactically invalid:

```text
=value
```

because the key is empty.

---

# 17. Assignment Preservation

Assignment argument boundaries must be preserved.

For example:

```text
SPRINT_TITLE=CLI Architecture
```

when delivered by the shell as one argument must remain one assignment.

The parser and handlers must not:

- perform unquoted `$*` reconstruction;
- split values on whitespace;
- split values on additional `=`;
- evaluate assignment contents;
- execute assignment contents.

---

# 18. Duplicate Assignment Ownership

Duplicate normal Generator assignments are not a CLI duplicate-option error.

For example:

```text
NAME=first
NAME=second
```

may pass the CLI parser as two syntactically valid assignments.

The Generator Framework owns the semantic behavior of normal template
variable duplication.

The CLI must not replace the certified Generator duplicate-variable policy.

---

# 19. Duplicate CLI Flags

CLI-owned execution flags must not appear more than once.

Invalid:

```text
--dry-run --dry-run
```

Invalid:

```text
--overwrite --overwrite
```

Duplicate CLI flags produce:

```text
CLI_USAGE_ERROR
return 2
```

before Generator bootstrap.

---

# 20. Unknown Generate Options

An unrecognized option beginning with:

```text
--
```

must not be forwarded as Generator data.

For example:

```text
phoenix generate provider ./target --force
```

is a CLI syntax error when `--force` is not part of the frozen command
grammar.

The result is:

```text
return 2
```

before Generator bootstrap.

---

# 21. Generate Option Ordering

After the required Generator identifier and destination, assignments and
accepted execution flags may be interleaved.

For example:

```text
provider ./target --dry-run NAME=x --overwrite COUNTRY=CH
```

and:

```text
provider ./target NAME=x COUNTRY=CH --dry-run --overwrite
```

represent equivalent CLI execution-control intent while preserving assignment
ordering.

---

# 22. Generate Flag Translation

The CLI translates:

```text
--dry-run
```

to the certified Generator reserved execution-control assignment:

```text
PHOENIX_DRY_RUN=1
```

The CLI translates:

```text
--overwrite
```

to:

```text
PHOENIX_OVERWRITE=1
```

When an execution flag is absent, the CLI should rely on the Generator
Framework's certified default rather than unnecessarily redefining it.

The CLI does not interpret the semantic meaning of overwrite permission.

---

# 23. Reserved Generator Controls

CLI-owned execution flags and user-supplied Generator assignments have
different ownership.

The CLI must prevent its own syntax from creating duplicate execution-control
flags.

The Generator Framework remains authoritative for its reserved-variable
contract.

The CLI must not silently create conflicting execution-control requests.

---

# 24. Validate Grammar

The Phase 7 v1 Validate grammar is:

```text
validate --help
validate --list

validate <validator-id> <target>
```

The operational form requires exactly:

```text
validator-id
target
```

Extra positional arguments are rejected by the CLI parser.

---

# 25. Validate Parser Responsibilities

The Validate parser verifies:

- Validator identifier is present;
- target is present;
- no unexpected extra arguments exist.

It does not determine whether the Validator identifier is registered.

Therefore:

```text
phoenix validate unknown-validator ./target
```

is syntactically valid CLI input.

Validator existence belongs to the Validation Framework.

---

# 26. Help and List Exclusivity

Family operations:

```text
generate --help
generate --list
validate --help
validate --list
```

are terminal forms.

They must not be combined with operational arguments.

For example:

```text
generate --list provider
```

is invalid.

Likewise:

```text
validate --help structure
```

is invalid.

These failures are CLI usage errors.

---

# 27. Global Option Scope

Phase 7 v1 global options are:

```text
--help
--version
```

They operate at root scope.

The CLI does not automatically make root options valid inside every command
family.

For example:

```text
phoenix generate provider ./target --version
```

is not a valid Generate request under the frozen v1 grammar.

---

# 28. Short Options

Phase 7 v1 does not require short aliases such as:

```text
-h
-v
-g
```

The frozen grammar uses explicit long-form options.

Short aliases may be introduced only through a future compatible contract
revision.

---

# 29. Normalized Request

The parser produces a normalized request.

The normalized request must contain inert data only.

It must never contain an executable shell command assembled from user input.

Conceptual fields may include:

```text
ACTION
GENERATOR
DESTINATION
VALIDATOR
TARGET
DRY_RUN
OVERWRITE
ARGUMENT
```

The concrete Bash representation may vary provided it:

- remains Bash-baseline compatible;
- preserves argument boundaries;
- avoids executable-string construction;
- avoids unsafe evaluation;
- preserves the frozen semantics.

---

# 30. Internal Action Model

Normalized actions include the logical set:

```text
ROOT_HELP
VERSION
GENERATE_HELP
GENERATE_LIST
GENERATE_RUN
VALIDATE_HELP
VALIDATE_LIST
VALIDATE_RUN
```

The action model is internal.

It is not a dynamic function namespace.

Actions must be dispatched through an explicit whitelist.

---

# 31. Parser Security Contract

The parser must not use:

```text
eval
```

to interpret user input.

It must not generate a function name from an untrusted command token.

It must not discover commands by scanning files.

It must not source a user-controlled path.

It must not execute assignment contents.

The parser treats user input strictly as data.

---

# 32. Parser Failure Protocol

CLI syntax failures produce:

```text
classification  CLI_USAGE_ERROR
stream          stderr
canonical code  2
```

The diagnostic should be concise and actionable.

Exact human wording remains presentation policy and is not part of the
semantic parser contract.

---

# 33. Parser Side-Effect Contract

Parser functions must not:

```text
write files
create directories
remove files
change directories globally
mutate registries
register built-ins
execute subsystem operations
terminate the shell
```

Parser behavior must be independently unit-testable.

---

# 34. Bootstrap Surface

The candidate internal bootstrap surface is:

```text
_phoenix::cli_bootstrap_generator
_phoenix::cli_bootstrap_validator
```

A generic operational `bootstrap_everything` function is not required for
Phase 7 v1.

---

# 35. Bootstrap Ordering

Operational subsystem bootstrap occurs only after successful CLI parsing.

Canonical ordering:

```text
parse
 ↓
identify normalized action
 ↓
determine required capability
 ↓
bootstrap required capability
 ↓
dispatch
```

The CLI must not load and register every operational subsystem before it knows
which capability is required.

---

# 36. Bootstrap Matrix

The required bootstrap is:

```text
ROOT_HELP       → none operational
VERSION         → none operational
GENERATE_HELP   → none operational
GENERATE_LIST   → Generator
GENERATE_RUN    → Generator
VALIDATE_HELP   → none operational
VALIDATE_LIST   → Validator
VALIDATE_RUN    → Validator
```

Help and version must remain available without Generator or Validator
operational bootstrap.

---

# 37. Generator Bootstrap Contract

`_phoenix::cli_bootstrap_generator` prepares the certified Generator
Framework for CLI use.

Responsibilities include:

```text
load required certified Generator modules
load required certified dependencies
make built-in registration available
invoke explicit built-in registration
verify bootstrap success
record successful initialization state
```

Built-in registration must use:

```text
phoenix::generator_register_builtins
```

The CLI must not scan Generator definition directories to discover
capabilities.

---

# 38. Validator Bootstrap Contract

`_phoenix::cli_bootstrap_validator` prepares the certified Validation
Framework for CLI use.

Responsibilities include:

```text
load required certified Validator modules
load required certified dependencies
make built-in registration available
invoke explicit built-in registration
verify bootstrap success
record successful initialization state
```

Built-in registration must use:

```text
phoenix::validator_register_builtins
```

The CLI must not scan Validator definition or implementation directories to
discover capabilities.

---

# 39. Subsystem Ownership During Bootstrap

The CLI owns activation of the required subsystem.

The subsystem continues to own its internal architecture.

The CLI must not reproduce or reinterpret the lower-layer dependency graph
beyond what is necessary to load the certified public integration surface.

Where a canonical lower-layer loader exists, it should remain authoritative.

---

# 40. Bootstrap Idempotency

Repeated successful CLI invocation in one sourced shell must not fail merely
because official built-ins were already registered by an earlier CLI
bootstrap.

The CLI may maintain module-level initialization flags such as logical:

```text
GENERATOR_BOOTSTRAPPED
VALIDATOR_BOOTSTRAPPED
```

These flags represent subsystem initialization state only.

They must not contain mutable request data.

---

# 41. Bootstrap State Atomicity

Bootstrap state must be marked successful only after the complete bootstrap
operation succeeds.

Required sequence:

```text
load required modules
 ↓
register official built-ins
 ↓
verify success
 ↓
mark subsystem bootstrapped
 ↓
return success
```

If bootstrap fails, the successful-state marker must not be set.

Operation dispatch must not occur.

---

# 42. Bootstrap Failure

A failed required bootstrap produces:

```text
classification  BOOTSTRAP_ERROR
stream          stderr
canonical code  1
```

The CLI must not dispatch the requested Generator or Validator operation
after bootstrap failure.

The CLI does not invent registry rollback semantics.

---

# 43. Internal Path Resolution

CLI internal module resolution must not depend on the caller being inside:

```text
17_DEVKIT
```

or any other particular current working directory.

Internal module paths must be resolved from the canonical CLI/DevKit
installation location.

---

# 44. Caller Working Directory

Bootstrap must not globally change the caller working directory.

The CLI must not use a persistent:

```bash
cd "$DEVKIT_ROOT"
```

as a shortcut for internal module loading.

User-supplied relative target and destination paths must retain their intended
caller-working-directory semantics unless the owning lower-layer contract
explicitly states otherwise.

---

# 45. Command Handler Surface

The candidate internal command-handler surface is:

```text
_phoenix::cli_command_generate
_phoenix::cli_command_generate_list
_phoenix::cli_command_validate
_phoenix::cli_command_validate_list
_phoenix::cli_command_help
_phoenix::cli_command_version
```

Additional private helpers may be introduced if required without changing the
frozen responsibility boundaries.

---

# 46. Command Handler Preconditions

Command handlers consume normalized requests.

CLI syntax must already have been validated.

Required subsystem bootstrap must already have succeeded before an
operational subsystem handler is invoked.

Handlers must not become a second CLI parser.

---

# 47. Generate Handler

The Generate handler orchestrates one normalized Generator request.

Conceptual signature:

```bash
_phoenix::cli_command_generate <generator-id> <destination> [normalized-arguments...]
```

Its lower-layer execution API is:

```text
phoenix::generator_run
```

The handler must not replace this with CLI-owned planning and artifact
execution logic.

---

# 48. Generate Handler Responsibilities

The Generate handler may:

- receive normalized Generator request data;
- translate CLI execution flags to certified Generator controls;
- preserve user assignments;
- invoke `phoenix::generator_run`;
- capture the public Generator result;
- capture the Generator return status;
- pass classified information toward presentation/status handling.

It must not:

- inspect Generator definitions directly;
- parse `REQUIRED_VARIABLES`;
- enforce `DESTINATION_RULE`;
- enforce `OVERWRITE_POLICY`;
- resolve templates;
- render templates;
- create generated artifacts itself;
- invoke lower-layer `_phoenix::*` Generator internals.

---

# 49. Generate Assignment Forwarding

User Generator assignments must be forwarded:

```text
in original assignment order
with argument boundaries preserved
without VALUE reinterpretation
```

The handler must not:

```text
sort assignments
deduplicate normal assignments
split values
evaluate values
rename user variables
```

---

# 50. Generate Result Handling

Known successful Generator outcomes include:

```text
STATUS=SUCCESS
STATUS=DRY_RUN
```

Both represent successful CLI operation.

They map to canonical status `0`.

`DRY_RUN` must remain distinguishable from actual generation success.

A generic lower-layer failure without authoritative classification maps to
generic CLI failure `1`.

The CLI must not guess a more specific code.

---

# 51. Generate Direct and Delegated Side Effects

The Generate command handler must not directly create user artifacts.

Its direct side effects are therefore limited to CLI orchestration and
presentation-related behavior.

Filesystem mutation may occur only through delegated certified Generator
execution.

This preserves Generator ownership of artifact production.

---

# 52. Generate List Handler

Conceptual function:

```bash
_phoenix::cli_command_generate_list
```

Precondition:

```text
Generator bootstrap completed
```

Public lower-layer API:

```text
phoenix::generator_list
```

The handler must not hardcode Generator IDs.

Registry membership and deterministic ordering remain owned by the Generator
Framework.

---

# 53. Validate Handler

Conceptual function:

```bash
_phoenix::cli_command_validate <validator-id> <target>
```

Precondition:

```text
Validator bootstrap completed
```

Public lower-layer API:

```text
phoenix::validator_run
```

The CLI must preserve the Validation Framework public result protocol.

---

# 54. Validator Result Classification

The CLI recognizes the public Validator status values:

```text
VALID
INVALID
ERROR
```

They classify as:

```text
VALID    → VALID
INVALID  → VALIDATION_INVALID
ERROR    → SUBSYSTEM_ERROR
```

The CLI must not collapse `INVALID` and `ERROR` merely because both may
involve a non-zero lower-layer return.

---

# 55. Validator VALID

A public result containing:

```text
STATUS=VALID
```

represents successful validation.

CLI behavior:

```text
presentation stream  stdout
canonical status     0
```

The CLI does not add additional validity rules.

---

# 56. Validator INVALID

A public result containing:

```text
STATUS=INVALID
```

represents a completed validation operation that found an explicit rule
violation.

CLI behavior:

```text
classification       VALIDATION_INVALID
presentation stream  stdout
canonical status     6
```

`INVALID` must not be presented as a technical error.

---

# 57. Validator ERROR

A public result containing:

```text
STATUS=ERROR
```

represents technical failure of the validation operation.

CLI behavior:

```text
classification       SUBSYSTEM_ERROR
presentation stream  stderr
canonical status     1
```

A technical validation failure must never be presented as target invalidity.

---

# 58. Unexpected Validator Contract

If Validator execution produces a result that cannot be interpreted according
to the certified public result protocol, the CLI must fail safely.

Classification:

```text
UNEXPECTED_CONTRACT
```

Behavior:

```text
stream          stderr
canonical code  1
```

The CLI must not invent VALID or INVALID semantics.

---

# 59. Validate List Handler

Conceptual function:

```bash
_phoenix::cli_command_validate_list
```

Precondition:

```text
Validator bootstrap completed
```

Public lower-layer API:

```text
phoenix::validator_list
```

The CLI must not hardcode Validator IDs.

Registry membership and ordering remain owned by the Validation Framework.

---

# 60. Help Handler

Conceptual function:

```bash
_phoenix::cli_command_help <scope>
```

Supported logical scopes include:

```text
root
generate
validate
```

Help describes static CLI grammar and usage.

Help does not require operational Generator or Validator bootstrap.

Dynamic capability inventory belongs to `--list`, not to static help.

---

# 61. Version Handler

Conceptual function:

```bash
_phoenix::cli_command_version
```

The handler reads the canonical CLI component version.

It presents the Phoenix CLI version and returns success.

It must not:

- bootstrap Generator;
- bootstrap Validator;
- infer version from filenames;
- infer version from Git state;
- claim unrelated DevKit release metadata.

---

# 62. Explicit Command Dispatch

Normalized actions must resolve through explicit dispatch.

Conceptually:

```text
ROOT_HELP       → help handler
VERSION         → version handler
GENERATE_HELP   → help handler
GENERATE_LIST   → Generator list handler
GENERATE_RUN    → Generate handler
VALIDATE_HELP   → help handler
VALIDATE_LIST   → Validator list handler
VALIDATE_RUN    → Validate handler
```

Dispatch must not use direct user input to construct a callable function name.

---

# 63. Handler Failure Discipline

Handlers must not infer detailed failure classes from human-readable messages.

A lower-layer generic failure remains generic unless an authoritative public
contract provides stronger classification.

Forbidden classification techniques include:

```text
grep error message for "template"
grep stderr for "file"
match human wording for dependency names
guess from arbitrary text
```

---

# 64. Presentation Boundary

Command execution and human presentation are logically separate concerns.

The command/subsystem layer determines:

```text
what happened
```

The presentation layer determines:

```text
how that outcome is communicated
```

Presentation must not redefine the semantic result.

---

# 65. Presentation Surface

Candidate internal presentation helpers may include:

```text
_phoenix::cli_present_help
_phoenix::cli_present_version
_phoenix::cli_present_list
_phoenix::cli_present_generator_result
_phoenix::cli_present_validator_result
_phoenix::cli_present_error
_phoenix::cli_status_for_outcome
```

The exact helper decomposition is not frozen.

The behavioral boundary is frozen.

Logical separation does not require one physical file per presentation
responsibility.

---

# 66. Help Presentation

Root help must describe at least:

```text
usage
available Phase 7 v1 command families
global options
basic usage examples
```

Family help describes the grammar of the selected command family.

Help output uses:

```text
stdout
return 0
```

---

# 67. Version Presentation

Version output identifies the CLI component.

Conceptually:

```text
Phoenix CLI <version>
```

Exact cosmetic wording may evolve without changing the semantic contract.

Version output uses:

```text
stdout
return 0
```

---

# 68. List Presentation

Capability lists originate from the corresponding registry public API.

The CLI may add human-readable presentation but must not alter:

```text
capability membership
capability identifiers
registry-defined deterministic ordering
```

Successful list operations use:

```text
stdout
return 0
```

---

# 69. Generator Presentation

Generator public result semantics must be preserved.

`SUCCESS` represents real successful execution.

`DRY_RUN` represents successful non-mutating simulation.

The CLI must make the distinction visible to the user.

Both map to canonical status `0`.

---

# 70. Validation Presentation

Validation presentation preserves the public semantic distinction:

```text
VALID
INVALID
ERROR
```

`VALID` and `INVALID` are validation-domain results.

`ERROR` is a technical failure.

Presentation must not convert one class into another.

---

# 71. Stream Ownership

Successful informational and domain-result output uses `stdout`.

This includes:

```text
help
version
capability lists
Generator success
Generator dry-run
Validator VALID
Validator INVALID
```

Technical and CLI usage diagnostics use `stderr`.

This includes:

```text
CLI usage errors
bootstrap failures
Validator ERROR
unexpected subsystem contracts
unclassified technical failures
```

---

# 72. Canonical Status Mapping

The Phase 7 v1 mapping is:

```text
HELP                    → 0
VERSION                 → 0
LIST                    → 0
GENERATOR_SUCCESS       → 0
GENERATOR_DRY_RUN       → 0
VALID                   → 0
VALIDATION_INVALID      → 6
CLI_USAGE_ERROR         → 2
BOOTSTRAP_ERROR         → 1
SUBSYSTEM_ERROR         → 1
UNEXPECTED_CONTRACT     → 1
UNCLASSIFIED_FAILURE    → 1
```

---

# 73. Reserved Canonical Codes

The broader Phoenix canonical status namespace includes:

```text
0  Success
1  Generic failure
2  Invalid usage or argument
3  Missing dependency
4  Invalid configuration
5  Filesystem failure
6  Validation failure
7  Template rendering failure
```

Phase 7 v1 must not use `3`, `4`, `5`, or `7` merely by guessing the cause of
a lower-layer generic failure.

Those codes require authoritative classification.

---

# 74. No-Guessing Contract

If a lower layer returns generic failure and provides no authoritative
machine-readable classification, the CLI maps the failure to:

```text
UNCLASSIFIED_FAILURE
return 1
```

The CLI must not parse human-readable error text to synthesize a more specific
canonical status.

---

# 75. Failure Precedence

The earliest layer capable of authoritatively classifying a failure owns that
classification.

Examples:

```text
invalid CLI grammar
→ CLI_USAGE_ERROR
→ 2
→ no operational bootstrap
```

```text
valid CLI grammar
→ Validator executes
→ STATUS=INVALID
→ VALIDATION_INVALID
→ 6
```

CLI-owned failures must occur before invoking a lower layer unnecessarily.

---

# 76. Side-Effect Boundary

CLI parser functions are side-effect free.

CLI bootstrap may load certified modules and initialize official registries.

CLI handlers do not directly mutate user targets.

Generator mutation occurs only through the certified Generator execution
path.

Validation remains read-only.

Presentation must not mutate operation targets.

---

# 77. Working-Directory Preservation

Reusable CLI execution must preserve the caller's current working directory.

Internal module loading must not permanently change it.

Relative user paths must not accidentally become relative to the internal
DevKit directory because of CLI bootstrap behavior.

---

# 78. Request-State Contract

Request-specific data should remain invocation-local.

The CLI should not persist global mutable request state such as:

```text
current action
current Generator
current Validator
current target
current destination
current assignments
```

Module-global state is acceptable for:

```text
stable CLI metadata
load guards
successful bootstrap initialization flags
```

---

# 79. Bash Compatibility

All Phase 7 v1 functions must remain compatible with the certified DevKit
Bash baseline.

The specification does not require:

```text
associative arrays
nameref
mapfile
readarray
```

The normalized-request implementation must use mechanisms compatible with
that baseline.

---

# 80. Function-Level Security Invariants

The CLI function layer freezes the following security requirements:

1. User input is data.
2. `eval` must not be used to interpret CLI input.
3. User input must not become an executable function name.
4. Arbitrary source paths are forbidden.
5. Filesystem command discovery is forbidden.
6. Original argv boundaries must be preserved.
7. Assignment values must not be executed.
8. CLI syntax validation occurs before mutating subsystem execution.
9. Internal module resolution must not trust user target paths.
10. Technical failure must fail safely rather than invent semantics.

---

# 81. Function-Level Architectural Invariants

The function specification freezes these boundaries:

1. `phoenix::cli_run` is the primary reusable CLI entry.
2. Only the physical executable owns process `exit`.
3. Parser functions own syntax only.
4. Normalized requests contain inert data.
5. Operational bootstrap is capability-specific.
6. Built-in registration uses certified public registration APIs.
7. Repeated successful bootstrap is CLI-idempotent.
8. Generate delegates to `phoenix::generator_run`.
9. Validate delegates to `phoenix::validator_run`.
10. List operations use public registry list APIs.
11. CLI does not duplicate Generator semantics.
12. CLI does not duplicate Validator semantics.
13. VALID, INVALID, and ERROR remain distinct.
14. SUCCESS and DRY_RUN remain distinct.
15. Presentation follows classification.
16. Specific failures are not guessed from human text.
17. Reusable modules are source-safe.
18. Caller working directory is preserved.
19. Request state should remain invocation-local.
20. Implementation remains compatible with the DevKit Bash baseline.

---

# 82. Implementation Test Obligations

Implementation must provide regression evidence for at least:

```text
root help
root version
unknown root command
Generate help
Generate list
Generate required arity
Generate assignment preservation
Generate additional "=" preservation
Generate whitespace preservation
Generate dry-run translation
Generate overwrite translation
Generate duplicate CLI flag rejection
Generate unknown-option rejection
Generate public API delegation
Validate help
Validate list
Validate required arity
Validate extra-argument rejection
Validate public API delegation
Validator VALID mapping
Validator INVALID mapping
Validator ERROR mapping
unexpected Validator result
bootstrap failure
bootstrap idempotency
source safety
caller working-directory preservation
explicit dispatch
no eval
entry-point exit propagation
Bash compatibility
full DevKit regression
```

Tests must not modify the real Phoenix Workspace.

---

# 83. Implementation Boundary

The intended implementation surface remains:

```text
05_CLI/
├── phoenix
├── cli.sh
├── parsing.sh
├── commands.sh
└── README.md
```

Test files belong under the existing DevKit test domain.

Implementation may introduce additional internal helpers only when justified by
the frozen contracts.

It must not expand the Phase 7 v1 command surface without an architecture
revision.

---

# 84. Excluded Phase 7 v1 Functionality

The following are not part of this frozen function specification:

```text
plugin command discovery
dynamic CLI extension loading
JSON output
machine-output mode
interactive prompts
shell completion
short option aliases
parallel execution
auto-fix
release orchestration
workspace orchestration
provider-specific top-level commands
create alias family
init command
```

Their absence from v1 does not prohibit future architectural evolution.

---

# 85. Specification Status

At this checkpoint:

```text
Public Entry Contract             DEFINED
Parser Function Contracts         DEFINED
Normalized Request Contract       DEFINED
Bootstrap Contracts               DEFINED
Command Handler Contracts         DEFINED
Generator Translation             DEFINED
Validator Result Handling         DEFINED
Presentation Contract             DEFINED
Status Mapping                    DEFINED
Security Contract                 DEFINED
Source Safety                     DEFINED
Test Obligations                  DEFINED
Implementation                    NOT STARTED
```

This specification is a frozen candidate.

Final certification requires the Phase 7 cross-document consistency audit
against:

```text
PHOENIX_CLI_ARCHITECTURE_v1.0.md
```

and the applicable certified Phoenix DevKit subsystem contracts.

---

**PHOENIX CLI FUNCTION SPECIFICATION v1.0 — FROZEN**