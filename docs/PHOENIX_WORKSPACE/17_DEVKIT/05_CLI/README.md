Phoenix DevKit — CLI

Status

CERTIFIED COMPLETE

The Phoenix DevKit CLI implementation is operational.

The canonical CLI Architecture and Function Specification are frozen and the current implementation is being validated against those contracts.

Final Phase 7 certification still requires:

final documentation consistency;

final regression evidence;

Master Record update;

Git checkpoint;

final technical certification.

Purpose

The CLI provides the user-facing command interface to certified Phoenix DevKit capabilities.

It exposes controlled access to lower-level services without duplicating their domain semantics.

The CLI is an orchestration and presentation layer.

Implemented Commands

Root

phoenix
phoenix help
phoenix --help
phoenix --version

Generate

phoenix generate --help
phoenix generate --list
phoenix generate <generator-id> <destination> [KEY=VALUE ...] [--dry-run] [--overwrite]

Validate

phoenix validate --help
phoenix validate --list
phoenix validate <validator-id> <target>

Physical Architecture

05_CLI/
├── phoenix
├── cli.sh
├── parsing.sh
├── commands.sh
└── README.md

phoenix

Executable process entry point.

Responsibilities:

resolve the CLI module location;

load cli.sh;

forward the original arguments;

propagate the canonical return status;

own process termination.

cli.sh

Reusable CLI lifecycle module.

Responsibilities:

CLI metadata;

subsystem bootstrap;

dispatch coordination;

canonical lifecycle;

result and status propagation.

parsing.sh

Reusable parser module.

Responsibilities:

root grammar;

Generate grammar;

Validate grammar;

normalized inert request construction;

duplicate CLI flag rejection;

CLI syntax validation.

commands.sh

Reusable command-handler module.

Responsibilities:

help presentation;

version presentation;

Generator listing;

Generator execution delegation;

Validator listing;

Validator execution delegation;

result classification and presentation.

Generator Integration

The CLI delegates generation to certified Generator public APIs.

The integration path is:

CLI
 ↓
phoenix::generator_register_builtins
 ↓
phoenix::generator_list
phoenix::generator_run

Implemented behavior includes:

Generator capability listing;

dry-run;

real artifact generation;

collision protection;

explicit overwrite request translation;

preservation of Generator overwrite policy;

unknown Generator failure handling.

CLI execution-control translation:

--dry-run   → PHOENIX_DRY_RUN=1
--overwrite → PHOENIX_OVERWRITE=1

The CLI does not implement Generator planning, rendering, destination policy, or overwrite semantics.

Those responsibilities remain owned by the Generator Layer.

Validator Integration

The CLI delegates validation to certified Validator public APIs.

The integration path is:

CLI
 ↓
phoenix::validator_register_builtins
 ↓
Validator implementations
 ↓
phoenix::validator_list
phoenix::validator_run

Built-in Validator capabilities exposed through the CLI are:

structure
naming
documentation
dependencies
standards

The canonical Validator result mapping is:

VALID    → exit 0
INVALID  → exit 6
ERROR    → exit 1

Unexpected or unclassified technical failures map to:

exit 1

The CLI does not determine whether a target is valid.

Validation semantics remain owned by the Validation Framework.

Security Boundary

CLI input is treated as untrusted data.

The implementation enforces:

no eval;

no dynamic shell command construction from user input;

no filesystem command discovery;

no lower-layer internal _phoenix::* API consumption;

explicit command dispatch;

preserved argument boundaries;

inert KEY=VALUE handling;

no process termination from reusable CLI modules.

Only 05_CLI/phoenix owns process exit.

Source Safety

The reusable CLI modules are:

cli.sh
parsing.sh
commands.sh

They are safe to source.

Repeated sourcing is supported through load guards.

Sourcing the reusable modules does not automatically execute CLI operations.

Bootstrap Model

Bootstrap is capability-specific.

Generator operations initialize the Generator Framework only when required.

Validator operations initialize the Validation Framework only when required.

Bootstrap operations are idempotent within the same sourced shell.

A subsystem is marked bootstrapped only after successful initialization.

Working Directory

CLI module resolution is independent of the caller working directory.

The CLI preserves the caller working directory.

User-supplied relative paths remain governed by caller-directory and lower-layer semantics.

Testing

Dedicated CLI test suites are:

07_TESTS/test_cli_parsing.sh
07_TESTS/test_cli_lifecycle.sh
07_TESTS/test_cli_generator.sh
07_TESTS/test_cli_validator.sh

Current dedicated CLI evidence:

CLI Parsing Tests      26 / 26 PASS
CLI Lifecycle Tests    14 / 14 PASS
CLI Generator Tests    20 / 20 PASS
CLI Validator Tests    14 / 14 PASS
-----------------------------------
CLI Dedicated Total    74 / 74 PASS

The dedicated suites cover:

command parsing;

canonical request construction;

invalid syntax rejection;

duplicate execution-control rejection;

literal user-input preservation;

command-substitution safety;

source safety;

double-source safety;

working-directory preservation;

bootstrap idempotency;

Generator listing;

Generator dry-run;

real Generator execution;

collision protection;

overwrite-policy preservation;

Validator listing;

VALID result mapping;

INVALID result mapping;

ERROR result mapping;

technical failure handling;

entry-point status propagation.

Full DevKit Regression

The complete DevKit regression was executed after CLI integration.

Current evidence:

Test scripts run: 27
Failed scripts:   0
FULL DEVKIT REGRESSION: PASS

This confirms that the current CLI implementation introduces no detected regression into previously certified DevKit behavior.

Implementation Audit

The current CLI implementation has passed the implementation audit.

Verified properties include:

CLI entry point executable                  PASS
Reusable CLI modules non-executable         PASS
Canonical Bash shebangs                     PASS
Bash syntax                                 PASS
git diff --check                            PASS
No operational eval                         PASS
No process exit in reusable CLI modules     PASS
No lower-layer internal API consumption     PASS
Working-directory preservation              PASS

Frozen Contracts

The canonical Phase 7 CLI contracts are:

01_ARCHITECTURE/PHOENIX_CLI_ARCHITECTURE_v1.0.md

01_ARCHITECTURE/PHOENIX_CLI_FUNCTION_SPECIFICATION_v1.0.md

The implementation must conform to these frozen contracts.

Any incompatible behavioral change requires an explicit architecture or function-specification revision.

Current Phase Boundary

Implemented and validated:

root help and version
Generate help
Generate list
Generate execution
Validate help
Validate list
Validate execution
Generator dry-run
Generator real artifact generation
Generator collision protection
Generator overwrite-policy preservation
Validator VALID / INVALID / ERROR mapping
source safety
bootstrap idempotency
working-directory preservation
security invariants
dedicated CLI regression
full DevKit regression
implementation audit

## Certification State

PHASE 7 — CLI

**PHOENIX CLI — CERTIFIED COMPLETE**

Final evidence:

- CLI dedicated regression: 74 / 74 PASS
- Full DevKit regression: 27 test scripts / 0 failures
- Final Technical Audit: PASS
- Repository synchronization: PASS
- Working tree at certification checkpoint: CLEAN