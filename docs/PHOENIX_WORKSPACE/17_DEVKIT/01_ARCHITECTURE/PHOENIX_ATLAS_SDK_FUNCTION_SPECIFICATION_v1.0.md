# PHOENIX ATLAS SDK FUNCTION SPECIFICATION

## Version 1.0

**Status:** FUNCTION SPECIFICATION REVIEWED

**Program:** Phoenix DevKit — Phase 8

**Phase:** Atlas Integration

**Upstream Architecture:** `PHOENIX_ATLAS_SDK_ARCHITECTURE_v1.0.md`

**Implementation:** NOT STARTED

---

# 1. Purpose

This document defines the public and private function contracts of the Phoenix DevKit Atlas SDK.

The Atlas SDK exposes certified Phoenix Atlas intelligence to DevKit consumers through explicit, deterministic, read-only and stable interfaces.

This specification defines:

- public API surface;
- private helper boundary;
- source resolution;
- initialization;
- canonical data loading;
- validation;
- normalization;
- provider lookup;
- provider listing;
- marketplace surface lookup;
- marketplace surface listing;
- lifecycle access;
- access metadata access;
- Provider Card composition;
- failure behavior;
- output contracts;
- determinism;
- path safety;
- version compatibility;
- read-only behavior.

The Atlas SDK must not redefine Phoenix Atlas semantics.

---

# 2. Architectural Contract

The function layer follows the reviewed Atlas SDK architectural direction:

```text
DEVKIT CONSUMER
        ↓
PUBLIC ATLAS SDK API
        ↓
ATLAS SDK INTERNALS
        ↓
CERTIFIED ATLAS ASSETS
```

The Atlas SDK is an integration mechanism.

Phoenix Atlas remains the intelligence authority.

The function layer must preserve:

```text
Atlas Intelligence Ownership
        ≠
DevKit Integration Ownership
```

---

# 3. Namespace

All public Atlas SDK functions use:

```text
phoenix::atlas_*
```

All private implementation helpers use:

```text
_phoenix::atlas_*
```

Private functions are not stable public API.

Consumers must not call `_phoenix::atlas_*` functions directly.

---

# 4. Public API Surface

Atlas SDK v1.0 exposes the following public functions:

```text
phoenix::atlas_initialize

phoenix::atlas_is_available

phoenix::atlas_validate

phoenix::atlas_provider_get

phoenix::atlas_provider_list

phoenix::atlas_surface_get

phoenix::atlas_surface_list

phoenix::atlas_lifecycle_get

phoenix::atlas_access_get

phoenix::atlas_provider_card
```

No additional public Atlas SDK API is required for version 1.0.

Additional public functions require explicit architecture and specification revision.

---

# 5. Public API Summary

| Function | Responsibility | Mutates Atlas | Output |
|---|---|---:|---|
| `phoenix::atlas_initialize` | Prepare Atlas SDK source state | No | none |
| `phoenix::atlas_is_available` | Check canonical Atlas availability | No | none |
| `phoenix::atlas_validate` | Validate canonical Atlas source state | No | deterministic validation result |
| `phoenix::atlas_provider_get` | Resolve one provider intelligence record | No | normalized provider record |
| `phoenix::atlas_provider_list` | List normalized provider records | No | deterministic record sequence |
| `phoenix::atlas_surface_get` | Resolve one marketplace surface | No | normalized surface record |
| `phoenix::atlas_surface_list` | List marketplace surfaces | No | deterministic record sequence |
| `phoenix::atlas_lifecycle_get` | Resolve provider lifecycle intelligence | No | normalized lifecycle result |
| `phoenix::atlas_access_get` | Resolve provider access intelligence | No | normalized access result |
| `phoenix::atlas_provider_card` | Compose read-only Provider Card | No | normalized Provider Card |

---

# 6. Public API General Rules

Every public Atlas SDK function must:

1. validate required arguments;
2. use deterministic source resolution;
3. treat Atlas content as data;
4. avoid shell evaluation;
5. preserve canonical source traceability;
6. avoid mutating Atlas assets;
7. return deterministic status;
8. distinguish failure from valid absence where required;
9. avoid network access;
10. avoid implicit recursive filesystem discovery;
11. avoid dependence on caller working directory;
12. avoid private cross-module dependencies.

Public functions must not silently reinterpret Atlas semantics.

---

# 7. SDK State Model

Atlas SDK v1.0 may maintain initialization state in memory.

Permitted state includes:

```text
Atlas SDK initialized flag
resolved canonical Atlas root
resolved source file paths
supported canonical format version
normalized in-memory records
validated source state
```

Initialization state must not alter canonical Atlas files.

Atlas SDK state must remain process-local unless a future specification explicitly defines persistence.

---

# 8. Canonical Source Set

Atlas SDK v1.0 recognizes the following initial source set:

```text
PHOENIX_ATLAS_FINAL_MASTER_v1.0.md

PHOENIX_ATLAS_FINAL_RECONCILIATION_v1.0.md

PHOENIX_ATLAS_GLOBAL_TRACKER_001_061.csv

PHOENIX_ATLAS_MARKETPLACE_SURFACE_REGISTRY_v1.0.csv

PHOENIX_ATLAS_STRATEGIC_SYNTHESIS_v1.0.md

PHOENIX_ADAPTIVE_SEARCH_AND_EVIDENCE_ARCHITECTURE_v1.0.md

PHOENIX_PROVIDER_PLANNER_AND_SEARCH_STATE_SPECIFICATION_v1.0.md
```

The Function Specification must not treat uncertified or candidate documents as canonical input.

---

# 9. Canonical Source Resolution Contract

Canonical Atlas source resolution must be deterministic.

Resolution must derive from:

```text
stable Phoenix Workspace layout
```

or from an explicitly authorized source-root argument defined by implementation planning.

Source resolution must not:

```text
scan arbitrary parent directories
search the complete filesystem
depend on caller PWD
follow paths embedded in Atlas content
guess alternate repository locations
```

If canonical source resolution fails, Atlas SDK must fail explicitly.

---

# 10. Default Atlas Root Direction

The default Atlas source location is conceptually:

```text
docs/
└── PHOENIX_WORKSPACE/
    └── 07_MARKET_INTELLIGENCE/
        └── PHOENIX_ATLAS/
            └── FINAL/
```

The exact runtime root-resolution implementation is deferred to implementation planning.

The contract is:

```text
source location must be stable and deterministic
```

---

# 11. phoenix::atlas_initialize

## Signature

```text
phoenix::atlas_initialize
```

## Purpose

Prepare Atlas SDK for deterministic read-only access to canonical Atlas sources.

## Responsibilities

`phoenix::atlas_initialize` must:

1. resolve the canonical Atlas root;
2. resolve required canonical source files;
3. verify required sources exist;
4. verify required sources are readable;
5. establish supported canonical version state;
6. load or prepare required normalized source state;
7. mark the Atlas SDK initialized only after successful validation.

## Mutation

```text
Canonical Atlas mutation: NO
Filesystem mutation:      NO
Process-local state:       YES
```

## Return

```text
0   initialization success
non-zero initialization failure
```

## Failure Conditions

Initialization must fail when:

```text
Atlas root cannot be resolved
required source is missing
required source is unreadable
canonical version is unsupported
required data is structurally invalid
```

Partial initialization must not be exposed as successful initialization.

---

# 12. phoenix::atlas_is_available

## Signature

```text
phoenix::atlas_is_available
```

## Purpose

Determine whether the minimum canonical Atlas source set required by Atlas SDK v1.0 is available.

## Output

No canonical stdout output is required.

## Return

```text
0   Atlas canonical source set is available
1   Atlas canonical source set is unavailable
```

Availability does not imply full semantic validation.

Availability means only that required canonical inputs can be resolved and accessed.

---

# 13. Availability Is Not Authorization

`phoenix::atlas_is_available` concerns SDK source availability.

It does not mean:

```text
Provider access authorized
Provider technically executable
Marketplace operational
Provider enabled
Search permitted
```

The distinction remains:

```text
Atlas Source Availability
        ≠
Provider Access Authorization
```

---

# 14. phoenix::atlas_validate

## Signature

```text
phoenix::atlas_validate
```

## Purpose

Validate the canonical Atlas inputs required by Atlas SDK v1.0.

## Responsibilities

Validation must verify at minimum:

```text
required source presence
required source readability
supported source version
tracker schema presence
required tracker fields
valid normalized identifiers
known required status syntax
source traceability
deterministic source resolution
```

Validation must remain read-only.

## Output

On success:

```text
ATLAS_VALID=1
```

On validation failure, the function must return failure and emit a diagnostic to stderr.

## Return

```text
0   valid
1   invalid
```

---

# 15. Tracker Schema Contract

Atlas SDK v1.0 recognizes the Global Tracker schema:

```text
tracker_id
country
marketplace
category
atlas_v1_status
evidence_note
```

All required columns must exist.

Column ordering may be normalized internally, but semantic field identity must be preserved.

Unknown additional columns may be ignored only if they do not conflict with a future reserved Atlas SDK contract.

---

# 16. Tracker Record Model

A normalized tracker record conceptually contains:

```text
ATLAS_TRACKER_ID
ATLAS_COUNTRY
ATLAS_MARKETPLACE
ATLAS_CATEGORY
ATLAS_STATUS
ATLAS_EVIDENCE_NOTE
ATLAS_SOURCE
```

`ATLAS_SOURCE` is SDK normalization metadata used for canonical traceability.

It must not replace the underlying Atlas source.

---

# 17. Record Identity Contract

Atlas SDK normalized record identity must be stable.

For tracker-derived provider intelligence, `tracker_id` is the canonical tracker record identifier when available.

Atlas SDK must not silently generate a replacement identity when a canonical Atlas identifier exists.

Derived SDK identifiers, if ever required, must be explicitly marked as derived.

---

# 18. Provider Intelligence Contract

A normalized Provider Intelligence record may expose:

```text
PROVIDER_ID
MARKETPLACE
COUNTRY
CATEGORY
ATLAS_STATUS
EVIDENCE_NOTE
PROVIDER_FAMILY
MARKETPLACE_SURFACE
LIFECYCLE
ACCESS_STATE
SOURCE_REFERENCE
```

Not every field must be populated for every provider.

Missing information must remain explicit.

Unknown must not become invented certainty.

---

# 19. Provider Intelligence Is Not Runtime State

Provider Intelligence must remain distinct from runtime provider state.

The Atlas SDK must not automatically emit:

```text
ENABLED
EXECUTABLE
SELECTED
CORE
FALLBACK
STOP
EXPAND
RANK
SCORE
```

unless those values are explicitly present as certified Atlas semantics for the requested contract.

Atlas SDK must not derive Search Planner policy.

---

# 20. phoenix::atlas_provider_get

## Signature

```text
phoenix::atlas_provider_get <provider-id>
```

## Purpose

Return one normalized Provider Intelligence record.

## Arguments

```text
provider-id
```

must be a non-empty explicit identifier.

## Behavior

The function must:

1. validate the identifier;
2. ensure Atlas SDK is initialized or initialize deterministically;
3. resolve the matching provider intelligence record;
4. normalize the record;
5. preserve source traceability;
6. serialize output deterministically.

## Success Output

Output uses deterministic line-oriented `KEY=VALUE` serialization.

Example contract direction:

```text
PROVIDER_ID=1
MARKETPLACE=Subito.it
COUNTRY=Italia
CATEGORY=Annunci generalisti
ATLAS_STATUS=EVIDENCED_COMPLETE
EVIDENCE_NOTE=Existing Atlas checkpoint / archived research
SOURCE_REFERENCE=PHOENIX_ATLAS_GLOBAL_TRACKER_001_061.csv
```

The exact optional field set may expand only through specification revision.

## Unknown Provider

Unknown provider identity is not equivalent to Atlas source failure.

Unknown provider must return a deterministic non-success status.

---

# 21. Provider Lookup Matching

Atlas SDK v1.0 must prefer explicit canonical identity lookup.

Provider lookup must not use:

```text
fuzzy matching
AI matching
approximate marketplace-name matching
opaque scoring
network search
```

unless explicitly added by a future specification.

Version 1.0 lookup should remain predictable.

---

# 22. phoenix::atlas_provider_list

## Signature

```text
phoenix::atlas_provider_list
```

## Purpose

Return normalized Provider Intelligence records in deterministic order.

## Ordering

Default ordering must be deterministic.

For tracker-backed provider records, the canonical default is:

```text
ascending tracker_id
```

unless the source contract later defines another explicit canonical order.

Filesystem order must never determine record order.

## Output Boundary

Records must be serialized in a deterministic format defined by implementation.

Record separation must be unambiguous.

The function must not rank providers by inferred strategic value.

---

# 23. Provider Listing Filters

Filtering is deliberately limited in v1.0.

Candidate explicit filters may include:

```text
country
category
Atlas status
provider family
marketplace surface
lifecycle
```

Exact filter syntax is deferred unless included in a later Function Specification revision.

Implicit semantic search is not part of v1.0.

---

# 24. Marketplace Surface Contract

Marketplace Surface must remain distinct from Provider Family.

Normalized surface intelligence may include:

```text
SURFACE_ID
MARKETPLACE
COUNTRY
PROVIDER_FAMILY
ACCESS_STATE
LIFECYCLE
SOURCE_REFERENCE
```

Shared provider-family technology must not collapse surface identity.

---

# 25. phoenix::atlas_surface_get

## Signature

```text
phoenix::atlas_surface_get <surface-id>
```

## Purpose

Return one normalized Marketplace Surface intelligence record.

## Behavior

The function must:

1. validate explicit surface identity;
2. resolve the surface from certified Atlas sources;
3. preserve family/surface distinction;
4. preserve access metadata;
5. preserve source traceability;
6. serialize deterministically.

## Unknown Surface

Unknown surface must return deterministic non-success status.

It must not be converted to a fabricated surface record.

---

# 26. phoenix::atlas_surface_list

## Signature

```text
phoenix::atlas_surface_list
```

## Purpose

Return known Marketplace Surface records in deterministic order.

## Rules

Listing must not:

```text
collapse surfaces belonging to the same provider family
infer missing surfaces
rank surfaces
perform provider execution
check live network availability
```

---

# 27. Provider Family Contract

Provider Family and Marketplace Surface remain separate dimensions.

Atlas SDK must preserve:

```text
Provider Family
        ≠
Marketplace Surface
```

Provider Family may describe shared:

```text
corporate ownership
technical integration
platform lineage
```

Marketplace Surface preserves the individual searchable market identity.

---

# 28. Lifecycle Contract

Lifecycle intelligence is read-only Atlas-derived metadata.

Canonical lifecycle values may include:

```text
ACTIVE
MIGRATING
ABSORBED
API_RETIRED
TRANSACTION_DISABLED
CLOSED
HISTORICAL
```

The SDK must validate lifecycle values against the certified taxonomy available to the implementation.

Unknown lifecycle values must not silently become `ACTIVE`.

---

# 29. phoenix::atlas_lifecycle_get

## Signature

```text
phoenix::atlas_lifecycle_get <provider-id>
```

## Purpose

Return lifecycle intelligence for one provider.

## Success Output Direction

```text
PROVIDER_ID=<id>
LIFECYCLE=<value>
SOURCE_REFERENCE=<canonical-source>
```

## Missing Lifecycle

Missing lifecycle data must remain explicit.

Valid provider identity with unknown lifecycle must not be misclassified as lookup failure.

---

# 30. Access Intelligence Contract

Access intelligence may represent:

```text
technical availability
access policy
authorization status
official API
feed
partnership
known restriction
surface-specific access condition
```

Atlas SDK must preserve:

```text
Technical Availability ≠ Authorized Access
```

It must also preserve:

```text
Provider Existence ≠ Executable Access
```

---

# 31. phoenix::atlas_access_get

## Signature

```text
phoenix::atlas_access_get <provider-id>
```

## Purpose

Return certified Atlas access intelligence for a provider or surface.

## Required Behavior

The function must not:

```text
test live provider connectivity
authenticate to providers
bypass policy
infer authorization from API existence
mark a provider executable
```

It returns intelligence only.

## Success Output Direction

```text
PROVIDER_ID=<id>
ACCESS_STATE=<state>
ACCESS_POLICY=<policy>
SOURCE_REFERENCE=<canonical-source>
```

Optional fields may remain absent when not canonically known.

---

# 32. Provider Card Contract

Provider Card is a normalized read-only projection.

Provider Card does not create new Atlas intelligence.

The Provider Card contract may combine approved Provider Intelligence fields.

Candidate fields:

```text
PROVIDER_ID
MARKETPLACE
COUNTRY
CATEGORY
PROVIDER_FAMILY
MARKETPLACE_SURFACE
LIFECYCLE
ACCESS_STATE
ATLAS_STATUS
EVIDENCE_NOTE
SOURCE_REFERENCE
```

---

# 33. phoenix::atlas_provider_card

## Signature

```text
phoenix::atlas_provider_card <provider-id>
```

## Purpose

Compose a stable Provider Card from certified Atlas-derived intelligence.

## Composition Rules

Provider Card composition may combine:

```text
provider base record
lifecycle intelligence
family intelligence
surface intelligence
access intelligence
canonical traceability
```

Composition must not:

```text
invent recommendation
calculate ranking
calculate confidence
decide runtime eligibility
perform search planning
execute provider
```

## Output

Output uses deterministic `KEY=VALUE` serialization.

---

# 34. Provider Card Missing Data

Provider Card generation must preserve missing information.

The SDK must not insert invented placeholders that imply certainty.

Permitted explicit representations may include:

```text
UNKNOWN
UNAVAILABLE
```

only where the Function Specification or implementation contract defines their semantic meaning.

Empty and unknown must not be conflated accidentally.

---

# 35. Source Traceability Contract

All normalized Atlas SDK intelligence must retain sufficient canonical source traceability.

At minimum, output records should be capable of identifying:

```text
canonical source asset
canonical record identity where applicable
```

Provider Cards must preserve source origin even when composed from multiple canonical Atlas inputs.

---

# 36. Normalization Contract

Normalization may transform:

```text
field names
field ordering
whitespace
serialization
explicit missing-value representation
stable record shape
```

Normalization must not transform:

```text
Atlas meaning
provider lifecycle meaning
access authorization meaning
provider family identity
marketplace surface identity
research classification
unknown into known
```

---

# 37. Canonical Serialization

Atlas SDK v1.0 defines one canonical textual serialization contract for all public Atlas query and listing functions.

Canonical serialization exists to ensure that successful Atlas SDK output is:

```text
deterministic
stable
machine-readable
line-oriented
traceable
shell-safe as data
unambiguous
```

The canonical serialization format is based on:

```text
KEY=VALUE
```

records.

Serialization is a presentation contract only.

It must not redefine Atlas semantics.

---

## 37.1 Canonical Record Form

A canonical Atlas SDK record consists of ordered `KEY=VALUE` lines.

Example:

```text
PROVIDER_ID=1
MARKETPLACE=Subito.it
COUNTRY=Italia
CATEGORY=Annunci generalisti
ATLAS_STATUS=EVIDENCED_COMPLETE
SOURCE_REFERENCE=PHOENIX_ATLAS_GLOBAL_TRACKER_001_061.csv
```

Each line represents exactly one field.

The first `=` separates:

```text
KEY
VALUE
```

Keys must not contain `=`.

---

## 37.2 Canonical Key Contract

Canonical keys must:

```text
use uppercase ASCII letters
use digits where required
use underscore separators
begin with an uppercase letter
```

Canonical key grammar:

```text
[A-Z][A-Z0-9_]*
```

Examples:

```text
PROVIDER_ID
MARKETPLACE
COUNTRY
CATEGORY
ATLAS_STATUS
SOURCE_REFERENCE
```

Invalid examples:

```text
provider_id
ProviderId
PROVIDER-ID
_PROVIDER
PROVIDER ID
```

Public field names are part of the serialization contract once frozen.

---

## 37.3 Canonical Value Contract

Values are UTF-8 textual data.

Values must be serialized as data and must never be interpreted as shell syntax or executable content.

Canonical values may contain:

```text
letters
digits
spaces
punctuation
Unicode text
URLs
descriptive notes
```

Values must not be evaluated.

The Atlas SDK must not perform:

```text
eval "$value"
source "$value"
bash -c "$value"
sh -c "$value"
```

or equivalent data-driven execution.

---

## 37.4 Line Terminator

Every canonical field line must end with exactly one newline:

```text
\n
```

Canonical public output must use LF line endings.

The SDK must not emit platform-dependent CRLF output.

A successful single-record result must end with a final newline.

---

## 37.5 Field Ordering

Field ordering is part of deterministic serialization.

A public function must emit fields in its frozen contract order.

Field order must not depend on:

```text
hash iteration
source column order
filesystem order
environment
locale
runtime insertion order
```

Each public record type must define one canonical order.

---

## 37.6 Provider Record Canonical Order

`phoenix::atlas_provider_get` records use this candidate canonical field order:

```text
PROVIDER_ID
MARKETPLACE
COUNTRY
CATEGORY
ATLAS_STATUS
EVIDENCE_NOTE
PROVIDER_FAMILY
MARKETPLACE_SURFACE
LIFECYCLE
ACCESS_STATE
SOURCE_REFERENCE
```

Optional fields remain in their canonical position when emitted.

Field ordering must not change based on which optional values are present.

---

## 37.7 Marketplace Surface Record Canonical Order

`phoenix::atlas_surface_get` records use this candidate canonical order:

```text
SURFACE_ID
MARKETPLACE
COUNTRY
PROVIDER_FAMILY
ACCESS_STATE
LIFECYCLE
SOURCE_REFERENCE
```

Marketplace Surface identity must remain distinct from Provider Family.

---

## 37.8 Lifecycle Record Canonical Order

`phoenix::atlas_lifecycle_get` records use:

```text
PROVIDER_ID
LIFECYCLE
SOURCE_REFERENCE
```

Missing lifecycle information must not silently become `ACTIVE`.

---

## 37.9 Access Record Canonical Order

`phoenix::atlas_access_get` records use:

```text
PROVIDER_ID
ACCESS_STATE
ACCESS_POLICY
SOURCE_REFERENCE
```

Additional access fields may be added only through explicit contract revision.

Serialization must preserve:

```text
Technical Availability ≠ Authorized Access
```

---

## 37.10 Provider Card Canonical Order

`phoenix::atlas_provider_card` uses:

```text
PROVIDER_ID
MARKETPLACE
COUNTRY
CATEGORY
PROVIDER_FAMILY
MARKETPLACE_SURFACE
LIFECYCLE
ACCESS_STATE
ATLAS_STATUS
EVIDENCE_NOTE
SOURCE_REFERENCE
```

Provider Card ordering must remain deterministic even when optional fields are absent.

Provider Cards remain intelligence projections, not decision objects.

---

## 37.11 Missing Optional Values

Atlas SDK must distinguish:

```text
field absent from the record contract
```

from:

```text
field present but canonically unknown
```

from:

```text
field present but unavailable
```

For fields defined by the record contract but lacking known canonical intelligence, Atlas SDK v1.0 may use only the following explicit sentinel values:

```text
UNKNOWN
UNAVAILABLE
```

These values must be used only when their semantic meaning is defined for that field.

The SDK must not invent a substitute value.

---

## 37.12 UNKNOWN Semantics

```text
UNKNOWN
```

means:

```text
the field belongs to the contract
but the canonical Atlas intelligence does not currently establish its value
```

`UNKNOWN` must not mean:

```text
source missing
source unreadable
record not found
invalid canonical data
```

Those states belong to the return-status contract.

---

## 37.13 UNAVAILABLE Semantics

```text
UNAVAILABLE
```

means:

```text
the field belongs to the contract
but the value cannot be supplied under the current valid capability context
```

`UNAVAILABLE` must not be used to hide source failure.

If a required source fails, the public function must fail through Section 40 rather than serialize `UNAVAILABLE` as a successful substitute.

---

## 37.14 Empty String Boundary

An empty value:

```text
KEY=
```

is permitted only when the field contract explicitly allows a meaningful empty string.

The SDK must not use an empty string as an undocumented replacement for:

```text
UNKNOWN
UNAVAILABLE
NOT_FOUND
SOURCE_MISSING
```

Empty and unknown are not automatically equivalent.

---

## 37.15 Multiline Value Escaping

Canonical `KEY=VALUE` records are line-oriented.

Therefore literal newline characters inside values must not be emitted directly.

Before serialization:

```text
\  → \\
LF → \n
CR → \r
TAB → \t
```

The canonical escape sequences are textual two-character sequences where applicable.

This ensures that every serialized field occupies exactly one physical output line.

---

## 37.16 Backslash Escaping

Backslash is the escape prefix.

A literal backslash in source data must be serialized as:

```text
\\
```

Escaping must occur before newline, carriage-return and tab escaping.

The decoder order, if one is ever introduced, must be the exact inverse.

Atlas SDK v1.0 does not require a public decode API.

---

## 37.17 Equals Sign in Values

The equals sign:

```text
=
```

may appear inside `VALUE`.

The first `=` on the physical line is the canonical separator between:

```text
KEY
VALUE
```

All subsequent `=` characters on the same physical line belong to `VALUE`.

Example:

```text
EVIDENCE_NOTE=source=a;status=verified
```

is parsed as:

```text
KEY   = EVIDENCE_NOTE
VALUE = source=a;status=verified
```

The equals sign is not an escaped character in Atlas SDK v1.0 canonical serialization.

Keys may never contain `=`.

This rule is deterministic because canonical keys follow:

```text
[A-Z][A-Z0-9_]*
```

and therefore cannot contain the separator character.

---

## 37.18 Canonical Whitespace

Values preserve meaningful leading and trailing spaces only when such whitespace is canonical source data.

Normalization must not arbitrarily trim semantic content.

Keys may not contain surrounding whitespace.

The serializer must not emit:

```text
KEY = VALUE
KEY= VALUE
 KEY=VALUE
```

unless spaces are intentionally part of the value after the separator.

Canonical form is:

```text
KEY=VALUE
```

---

## 37.19 Single-Record Output

Functions returning one canonical record emit:

```text
KEY=VALUE
KEY=VALUE
...
```

with no leading blank line and no trailing blank record separator.

Applicable functions include:

```text
phoenix::atlas_provider_get
phoenix::atlas_surface_get
phoenix::atlas_lifecycle_get
phoenix::atlas_access_get
phoenix::atlas_provider_card
```

Successful output ends with exactly one newline after the final field.

---

## 37.20 Multi-Record Output

Listing functions emit multiple canonical records.

Applicable functions:

```text
phoenix::atlas_provider_list
phoenix::atlas_surface_list
```

Records are separated by exactly one empty physical line.

Canonical form:

```text
KEY=VALUE
KEY=VALUE

KEY=VALUE
KEY=VALUE
```

There must be:

```text
no leading blank record
exactly one blank line between records
no extra trailing blank record
```

The final record ends with one newline.

---

## 37.21 Empty Listing Output

A successful empty listing is valid.

For an empty successful list:

```text
return status = 0
stdout = empty
```

The SDK must not emit:

```text
NOT_FOUND
EMPTY
NONE
[]
```

unless a future explicit serialization version defines such representation.

Return status distinguishes success from failure.

---

## 37.22 Record Ordering

Listing record order is independent from field order.

For tracker-derived provider records:

```text
tracker_id ascending
```

is the canonical initial record order.

Surface ordering must be defined deterministically by the implementation contract before freeze.

Filesystem enumeration order must never determine listing order.

---

## 37.23 Source Traceability

Every canonical intelligence record must retain source traceability.

Single-source records must emit:

```text
SOURCE_REFERENCE=<canonical-source>
```

where required by the record contract.

The reference must identify an authorized canonical Atlas asset.

It must not identify:

```text
temporary Work artifacts
draft files
backup copies
arbitrary local paths
uncertified sources
```

---

## 37.24 Multi-Source Traceability

When a result is composed from multiple canonical sources, one `SOURCE_REFERENCE` field is insufficient to represent all origins.

For multi-source compositions, canonical serialization may use:

```text
SOURCE_REFERENCE
SOURCE_REFERENCE_2
SOURCE_REFERENCE_3
...
```

in deterministic precedence order.

The first source is the primary/base canonical source.

Additional references follow the Source Precedence contract in Section 70.

Source numbering must be contiguous.

Example:

```text
SOURCE_REFERENCE=PHOENIX_ATLAS_GLOBAL_TRACKER_001_061.csv
SOURCE_REFERENCE_2=PHOENIX_ATLAS_FINAL_MASTER_v1.0.md
```

---

## 37.25 Source Reference Values

`SOURCE_REFERENCE` values must be canonical logical asset identities.

They must not expose machine-specific absolute paths such as:

```text
/Users/mauroregazzoni/...
```

Canonical serialization must remain portable across valid repository locations.

---

## 37.26 Canonical Identifier Preservation

Canonical Atlas identifiers must be serialized without silent reinterpretation.

Examples include:

```text
tracker_id
provider identity
surface identity
```

If a normalized field derives from a canonical identifier, its value must preserve deterministic traceability to that identifier.

The SDK must not silently replace canonical identity with display names.

---

## 37.27 Serialization and Status Contract

Canonical serialization occurs only after successful validation and resolution.

The canonical order is:

```text
argument validation
        ↓
initialization
        ↓
required-source validation
        ↓
record resolution
        ↓
normalization
        ↓
serialization
        ↓
stdout
```

On any failure before serialization:

```text
canonical successful stdout output = none
```

The corresponding Section 40 return status is used.

---

## 37.28 Partial Output Prohibition

Atlas SDK must not emit a partial canonical record and then return failure.

Once canonical stdout emission begins for a single-record operation, the operation must already have satisfied all failure conditions that could invalidate that record.

For multi-record operations, the complete result set must be validated sufficiently before canonical output begins.

This prevents ambiguous partial success.

---

## 37.29 stdout Exclusivity

Canonical public result data belongs to stdout.

stdout must not contain:

```text
debug logs
progress messages
warnings
human headings
timestamps
shell prompts
diagnostic prefixes
```

Example forbidden output:

```text
[INFO] Provider found
PROVIDER_ID=1
```

Canonical stdout must contain only the contracted result data.

---

## 37.30 stderr Exclusivity

Diagnostics belong to stderr.

stderr may contain:

```text
errors
warnings
debug output when explicitly enabled
```

stderr content must not alter canonical stdout serialization.

A consumer must be able to capture stdout as pure canonical result data.

---

## 37.31 No Shell Quoting Contract

Canonical serialization does not shell-quote values.

The serializer must not transform a value into:

```text
'VALUE'
"VALUE"
$'VALUE'
```

merely for shell convenience.

Consumers must treat the output as serialized data, not as executable shell assignments.

The presence of:

```text
KEY=VALUE
```

does not authorize:

```text
eval "$(phoenix::atlas_provider_get ...)"
```

Such evaluation remains forbidden.

---

## 37.32 Data Safety

Serialized Atlas values remain untrusted data.

A value containing:

```text
$(command)
`command`
; command
&& command
${VARIABLE}
```

must remain inert textual data after serialization.

The Atlas SDK must not remove or execute such content merely because it resembles shell syntax.

Escaping is for record integrity, not execution.

---

## 37.33 Locale Independence

Canonical serialization must not depend on locale for:

```text
key names
field ordering
record ordering
status names
sentinel values
```

Canonical keys and sentinel values remain stable ASCII contracts.

Source textual values may remain Unicode.

---

## 37.34 Time and Runtime Independence

Canonical serialization must not introduce incidental runtime values such as:

```text
current timestamp
process ID
temporary path
current working directory
hostname
```

unless an explicit future field contract requires them.

Identical canonical inputs and arguments must produce identical canonical output.

---

## 37.35 Serialization Version

Atlas SDK v1.0 canonical serialization is identified conceptually as:

```text
ATLAS_SDK_SERIALIZATION_V1
```

This identifier is an internal contract label unless a future public metadata field exposes it.

Breaking serialization changes require an explicit version revision.

---

## 37.36 Forward Compatibility

New optional fields may be appended to a record contract only through an explicit compatible specification revision.

Existing field meanings and canonical ordering must not silently change.

Consumers must not depend on private undocumented fields.

---

## 37.37 Backward Compatibility

Within Atlas SDK v1.0, frozen public field names must retain their meaning.

An incompatible change to:

```text
field name
field meaning
field order
escaping
record separator
sentinel semantics
source-reference semantics
```

requires explicit contract revision.

---

## 37.38 Serialization Error

A failure during canonical serialization returns:

```text
8 — INTERNAL_FAILURE
```

unless a more specific earlier canonical failure status applies.

Serialization failure must not produce partial successful stdout.

---

## 37.39 Provider Record Example

Canonical direction:

```text
PROVIDER_ID=1
MARKETPLACE=Subito.it
COUNTRY=Italia
CATEGORY=Annunci generalisti
ATLAS_STATUS=EVIDENCED_COMPLETE
EVIDENCE_NOTE=Existing Atlas checkpoint
PROVIDER_FAMILY=UNKNOWN
MARKETPLACE_SURFACE=Subito.it
LIFECYCLE=ACTIVE
ACCESS_STATE=UNKNOWN
SOURCE_REFERENCE=PHOENIX_ATLAS_GLOBAL_TRACKER_001_061.csv
SOURCE_REFERENCE_2=PHOENIX_ATLAS_FINAL_MASTER_v1.0.md
```

This is a serialization example, not a claim that every displayed value exists in the current canonical corpus.

---

## 37.40 Provider Card Example

Canonical direction:

```text
PROVIDER_ID=1
MARKETPLACE=Subito.it
COUNTRY=Italia
CATEGORY=Annunci generalisti
PROVIDER_FAMILY=UNKNOWN
MARKETPLACE_SURFACE=Subito.it
LIFECYCLE=ACTIVE
ACCESS_STATE=UNKNOWN
ATLAS_STATUS=EVIDENCED_COMPLETE
EVIDENCE_NOTE=Existing Atlas checkpoint
SOURCE_REFERENCE=PHOENIX_ATLAS_GLOBAL_TRACKER_001_061.csv
SOURCE_REFERENCE_2=PHOENIX_ATLAS_FINAL_MASTER_v1.0.md
```

Provider Card serialization must not add:

```text
RANK
SCORE
RECOMMENDATION
EXECUTABLE
SEARCH_ROLE
```

unless a future explicitly certified contract defines them.

---

## 37.41 Listing Example

Canonical direction:

```text
PROVIDER_ID=1
MARKETPLACE=Marketplace-A
COUNTRY=CH
CATEGORY=general
ATLAS_STATUS=COMPLETE
SOURCE_REFERENCE=PHOENIX_ATLAS_GLOBAL_TRACKER_001_061.csv

PROVIDER_ID=2
MARKETPLACE=Marketplace-B
COUNTRY=FR
CATEGORY=vehicles
ATLAS_STATUS=COMPLETE
SOURCE_REFERENCE=PHOENIX_ATLAS_GLOBAL_TRACKER_001_061.csv
```

Exactly one blank line separates records.

---

## 37.42 Canonical Serialization Tests

Tests must verify at minimum:

1. canonical key grammar;
2. deterministic field ordering;
3. deterministic record ordering;
4. LF line endings;
5. final newline;
6. exactly one blank line between list records;
7. no leading list separator;
8. no trailing blank record;
9. correct `UNKNOWN` semantics;
10. correct `UNAVAILABLE` semantics;
11. empty string is not silently used as unknown;
12. newline escaping;
13. carriage-return escaping;
14. tab escaping;
15. backslash escaping;
16. equals signs remain valid inside values;
17. no shell quoting is introduced;
18. shell-like content remains inert data;
19. stdout contains result data only;
20. stderr does not contaminate canonical stdout;
21. no partial output on failure;
22. empty successful listing emits empty stdout;
23. source traceability is preserved;
24. multi-source references are deterministic;
25. absolute local paths are not exposed;
26. repeated calls with identical inputs produce identical bytes.

---

## 37.43 Canonical Serialization Invariants

The canonical serialization contract freezes the following candidate invariants:

1. Canonical public records use line-oriented `KEY=VALUE`.
2. Keys follow `[A-Z][A-Z0-9_]*`.
3. Values are UTF-8 data, never executable code.
4. LF is the canonical line terminator.
5. Field ordering is deterministic.
6. Record ordering is deterministic.
7. Single records contain no blank record separator.
8. Multiple records use exactly one blank line separator.
9. Empty successful listings emit empty stdout.
10. Missing information is not silently invented.
11. `UNKNOWN` is distinct from source failure.
12. `UNAVAILABLE` is distinct from source failure.
13. Empty string is not an implicit unknown sentinel.
14. Newline, CR, TAB and backslash are escaped canonically.
15. `=` is permitted inside values.
16. stdout contains canonical result data only.
17. diagnostics remain on stderr.
18. Partial successful output before failure is forbidden.
19. Serialized data is never shell-evaluated.
20. Source traceability is preserved.
21. Multi-source origin remains distinguishable.
22. Machine-specific absolute paths are not canonical output.
23. Serialization does not introduce runtime-dependent data.
24. Breaking serialization changes require explicit revision.

---

## 37.44 Current Freeze State

```text
Record Format                       DEFINED
Canonical Key Grammar               DEFINED
Canonical Value Contract            DEFINED
Line Terminator                     DEFINED
Field Ordering                      DEFINED
Record Ordering                     DEFINED
Provider Serialization              DEFINED
Surface Serialization               DEFINED
Lifecycle Serialization             DEFINED
Access Serialization                DEFINED
Provider Card Serialization         DEFINED
Missing Value Semantics             DEFINED
UNKNOWN Semantics                   DEFINED
UNAVAILABLE Semantics               DEFINED
Escaping                            DEFINED
Single-Record Boundary              DEFINED
Multi-Record Boundary               DEFINED
Empty Listing Boundary              DEFINED
Source Traceability                 DEFINED
Multi-Source Traceability           DEFINED
stdout Boundary                     DEFINED
stderr Boundary                     DEFINED
Partial Output Prohibition          DEFINED
Security Boundary                   DEFINED
Compatibility Boundary              DEFINED
Test Contract                       DEFINED

Canonical Serialization             FROZEN
Implementation                      COMPLETE
```

Canonical Serialization is formally `FROZEN` following the successful P8-09 cross-contract consistency review.

---

# 38. stdout Contract

Successful public query functions write canonical result data to stdout.

Examples include:

```text
phoenix::atlas_provider_get
phoenix::atlas_provider_list
phoenix::atlas_surface_get
phoenix::atlas_surface_list
phoenix::atlas_lifecycle_get
phoenix::atlas_access_get
phoenix::atlas_provider_card
```

Diagnostic errors belong to stderr.

Successful result output and diagnostics must not be ambiguously mixed.

---

# 39. stderr Contract

Atlas SDK failures must emit clear diagnostic information to stderr where appropriate.

Error text must be:

```text
clear
deterministic
non-secret
actionable
```

Diagnostics must not expose:

```text
credentials
private tokens
unrelated environment variables
arbitrary filesystem contents
```

---


# 40. Return Status Model

Atlas SDK v1.0 defines one canonical return-status mapping for all public `phoenix::atlas_*` functions.

The mapping is:

```text
0   SUCCESS
2   INVALID_ARGUMENT
3   NOT_FOUND
4   SOURCE_MISSING
5   SOURCE_UNREADABLE
6   INVALID_CANONICAL_DATA
7   UNSUPPORTED_VERSION
8   INTERNAL_FAILURE
```

These numeric values are part of the Atlas SDK v1.0 public contract.

A public function must not assign a different semantic meaning to any of these values.

---

## 40.1 SUCCESS — 0

```text
0   SUCCESS
```

The requested operation completed successfully.

For query functions, canonical result data may be emitted to stdout.

Successful execution does not imply that optional intelligence fields are known.

A valid record containing explicit unknown or unavailable optional information is still a successful result.

---

## 40.2 INVALID_ARGUMENT — 2

```text
2   INVALID_ARGUMENT
```

The caller supplied an invalid request.

Examples include:

```text
missing required argument
empty required identifier
malformed identifier
unsupported argument form
invalid explicit filter
```

Argument validation occurs before canonical record resolution.

`INVALID_ARGUMENT` must not be used for an unknown but syntactically valid provider or surface identifier.

---

## 40.3 NOT_FOUND — 3

```text
3   NOT_FOUND
```

The request is valid, canonical Atlas sources are available and valid, but the requested canonical record cannot be resolved.

Examples include:

```text
unknown provider
unknown marketplace surface
unknown explicit canonical record identity
```

`NOT_FOUND` means:

```text
requested record absent
```

It does not mean:

```text
Atlas source missing
Atlas source unreadable
Atlas source invalid
optional field unknown
```

---

## 40.4 SOURCE_MISSING — 4

```text
4   SOURCE_MISSING
```

A canonical Atlas source required for the requested operation cannot be found at its deterministic authorized location.

This status applies only when the source is required for the requested capability.

An optional source that is not required for the requested operation must not automatically produce `SOURCE_MISSING`.

---

## 40.5 SOURCE_UNREADABLE — 5

```text
5   SOURCE_UNREADABLE
```

A required canonical Atlas source exists but cannot be read safely by the Atlas SDK.

Examples may include:

```text
insufficient filesystem permission
read failure
unsupported filesystem state preventing safe access
```

This status must remain distinct from `SOURCE_MISSING`.

---

## 40.6 INVALID_CANONICAL_DATA — 6

```text
6   INVALID_CANONICAL_DATA
```

A required canonical Atlas source is available and readable but violates a mandatory structural or semantic contract required by Atlas SDK v1.0.

Examples include:

```text
missing mandatory tracker column
invalid mandatory canonical identifier
unsupported mandatory status syntax
malformed required record
ambiguous required canonical structure
```

The SDK must not emit successful canonical query output from invalid mandatory canonical data.

---

## 40.7 UNSUPPORTED_VERSION — 7

```text
7   UNSUPPORTED_VERSION
```

The canonical Atlas source declares or requires a version that Atlas SDK v1.0 cannot interpret safely under its frozen contract.

The SDK must fail rather than silently reinterpret an unsupported canonical version.

Forward-compatible optional fields do not by themselves require this status when the v1.0 contract explicitly permits them.

---

## 40.8 INTERNAL_FAILURE — 8

```text
8   INTERNAL_FAILURE
```

The Atlas SDK encountered an internal failure that is not correctly represented by a more specific public status.

Examples may include:

```text
unexpected internal invariant violation
normalization subsystem failure
serialization subsystem failure
unexpected internal state corruption
```

`INTERNAL_FAILURE` is a fallback failure class.

It must not be used to hide:

```text
INVALID_ARGUMENT
NOT_FOUND
SOURCE_MISSING
SOURCE_UNREADABLE
INVALID_CANONICAL_DATA
UNSUPPORTED_VERSION
```

when one of those statuses accurately describes the failure.

---

## 40.9 Reserved Status

Return status:

```text
1
```

is reserved for generic boolean-style false results where an explicitly documented predicate function requires conventional shell semantics.

For Atlas SDK v1.0 this applies to:

```text
phoenix::atlas_is_available
```

with:

```text
0   canonical Atlas source set available
1   canonical Atlas source set unavailable
```

This predicate-specific `1` must not replace the canonical failure statuses of query, validation or initialization operations.

No other public Atlas SDK function may use status `1` unless explicitly added to the frozen Function Specification.

---

## 40.10 Predicate Exception

`phoenix::atlas_is_available` is intentionally a predicate.

Its contract remains:

```text
0   AVAILABLE
1   UNAVAILABLE
```

It answers only whether the minimum canonical source set can be resolved and accessed sufficiently for the availability predicate.

It does not perform the complete semantic validation contract of:

```text
phoenix::atlas_validate
```

Therefore:

```text
UNAVAILABLE
    ≠
INVALID_CANONICAL_DATA
```

The predicate must not be used as a substitute for full Atlas validation.

---

## 40.11 Validation Status Contract

`phoenix::atlas_validate` uses the canonical status mapping.

```text
0   valid
4   required source missing
5   required source unreadable
6   invalid canonical data
7   unsupported canonical version
8   internal validation failure
```

`NOT_FOUND` is not the normal result of whole-source validation.

`INVALID_ARGUMENT` applies only if a future explicitly supported validation argument is invalid.

---

## 40.12 Initialization Status Contract

`phoenix::atlas_initialize` uses the canonical status mapping.

```text
0   initialization successful
4   required source missing
5   required source unreadable
6   invalid canonical data
7   unsupported canonical version
8   internal initialization failure
```

Initialization must not report success when any mandatory initialization precondition has failed.

---

## 40.13 Query Status Contract

The following functions use the canonical query status model:

```text
phoenix::atlas_provider_get
phoenix::atlas_surface_get
phoenix::atlas_lifecycle_get
phoenix::atlas_access_get
phoenix::atlas_provider_card
```

Applicable statuses are:

```text
0   SUCCESS
2   INVALID_ARGUMENT
3   NOT_FOUND
4   SOURCE_MISSING
5   SOURCE_UNREADABLE
6   INVALID_CANONICAL_DATA
7   UNSUPPORTED_VERSION
8   INTERNAL_FAILURE
```

A valid provider with missing optional lifecycle or access intelligence is not automatically `NOT_FOUND`.

The function-specific contract determines whether that missing optional intelligence is serialized explicitly or returned as a successful partial projection.

---

## 40.14 Listing Status Contract

The following functions use the canonical listing status model:

```text
phoenix::atlas_provider_list
phoenix::atlas_surface_list
```

Applicable statuses are:

```text
0   SUCCESS
2   INVALID_ARGUMENT
4   SOURCE_MISSING
5   SOURCE_UNREADABLE
6   INVALID_CANONICAL_DATA
7   UNSUPPORTED_VERSION
8   INTERNAL_FAILURE
```

An empty but valid canonical result set is:

```text
SUCCESS
```

and must not automatically become:

```text
NOT_FOUND
```

---

## 40.15 stdout / stderr Relationship

Return status and output channel semantics are coupled.

On successful query or listing operations:

```text
status = 0
canonical result → stdout
diagnostics       → stderr only when required
```

On failure:

```text
status != 0
canonical successful result output must not be emitted
diagnostic information → stderr
```

A failure must not emit a partial result that can be mistaken for successful canonical Atlas SDK output.

---

## 40.16 Fail-Fast Relationship

When multiple failure conditions are theoretically possible, the status corresponds to the first failure reached through the canonical fail-fast order:

```text
argument validity
        ↓
SDK initialization
        ↓
canonical source availability
        ↓
canonical source validation
        ↓
record resolution
        ↓
normalization
        ↓
canonical serialization
```

This preserves deterministic failure classification.

---

## 40.17 Stability Contract

The following mapping is a candidate frozen Atlas SDK v1.0 contract:

```text
0   SUCCESS
1   PREDICATE_FALSE / UNAVAILABLE
2   INVALID_ARGUMENT
3   NOT_FOUND
4   SOURCE_MISSING
5   SOURCE_UNREADABLE
6   INVALID_CANONICAL_DATA
7   UNSUPPORTED_VERSION
8   INTERNAL_FAILURE
```

Once formally frozen, these numeric meanings must not change within Atlas SDK v1.0.

New failure classes must not reuse an existing numeric value with a different meaning.

Incompatible changes require an explicit contract revision.

---

## 40.18 Current Freeze State

```text
Return Status Semantics             DEFINED
Numeric Mapping                     DEFINED
Predicate Exception                 DEFINED
Validation Mapping                  DEFINED
Initialization Mapping              DEFINED
Query Mapping                       DEFINED
Listing Mapping                     DEFINED
stdout / stderr Relationship        DEFINED
Fail-Fast Relationship              DEFINED

Return Status Mapping               FROZEN
Implementation                      COMPLETE
```

The Return Status Mapping is formally `FROZEN` following the successful P8-09 cross-contract consistency review.

---

# 41. Failure Versus Absence

Atlas SDK must distinguish:

```text
valid record with missing optional data
```

from:

```text
unknown record
```

from:

```text
canonical source failure
```

These are different states.

A missing optional lifecycle field must not be treated as a missing provider.

A missing provider must not be treated as an unreadable Atlas source.

---

# 42. Fail-Fast Ordering

Atlas SDK public functions should validate in this order where applicable:

```text
argument validity
        ↓
SDK initialization
        ↓
canonical source availability
        ↓
canonical source validation
        ↓
record resolution
        ↓
normalization
        ↓
canonical output
```

Canonical result output must not be emitted before required validation succeeds.

---

# 43. Read-Only Contract

No Atlas SDK v1.0 public function may mutate canonical Atlas sources.

Forbidden operations include:

```text
rewrite
append
delete
rename
move
reclassify
persist normalization into Atlas
```

This rule applies to public functions and private helpers.

---

# 44. Filesystem Boundary

Atlas SDK may read only the canonical assets required by its contract.

It must not use arbitrary recursive filesystem discovery as a normal source-resolution mechanism.

It must not follow unvalidated paths derived from Atlas data.

It must not resolve files outside the authorized Atlas source boundary.

---

# 45. Shell Evaluation Boundary

Atlas data is never executable code.

Atlas SDK must not use:

```text
eval
source <Atlas-data-file>
bash -c <Atlas-data>
sh -c <Atlas-data>
dynamic function construction from Atlas values
dynamic command construction from Atlas values
```

Atlas values remain data.

---

# 46. Private Helper Direction

Candidate private helper families include:

```text
_phoenix::atlas_resolve_root
_phoenix::atlas_resolve_sources
_phoenix::atlas_require_initialized
_phoenix::atlas_load_tracker
_phoenix::atlas_validate_tracker
_phoenix::atlas_normalize_record
_phoenix::atlas_find_provider
_phoenix::atlas_find_surface
_phoenix::atlas_serialize_record
_phoenix::atlas_compose_provider_card
```

These names are implementation-direction candidates.

They are not stable public contracts.

Private helper naming may evolve without public API breakage.

---

# 47. Loader Contract

The Atlas loader layer is responsible for:

```text
source resolution
source readability
safe data loading
schema preparation
canonical version detection
```

The loader must not:

```text
perform Provider Planning
interpret runtime search policy
perform network access
execute source content
modify source content
```

---

# 48. Normalization Layer Contract

The normalization layer is responsible for:

```text
stable field naming
stable record ordering
explicit missing-state representation
canonical source reference attachment
deterministic textual serialization preparation
```

Normalization must remain semantically conservative.

---

# 49. Query Layer Contract

The query layer is responsible for explicit deterministic lookup and listing over normalized Atlas intelligence.

The query layer must not implement:

```text
fuzzy intelligence search
AI inference
semantic ranking
provider ranking
recommendation
search planning
```

Version 1.0 favors explicit identity and explicit filters.

---

# 50. Provider Card Layer Contract

The Provider Card layer composes existing certified intelligence.

It may not become a business-decision layer.

Provider Card composition must remain:

```text
READ
RESOLVE
COMPOSE
SERIALIZE
```

not:

```text
SCORE
RANK
RECOMMEND
DECIDE
```

---

# 51. Initialization Idempotency

Repeated successful calls to:

```text
phoenix::atlas_initialize
```

must be safe.

Initialization must not:

```text
duplicate canonical records
mutate Atlas inputs
produce divergent normalized state
```

for identical underlying canonical inputs.

---

# 52. Caller Working Directory Independence

Atlas SDK behavior must not depend on the caller's current working directory.

The same public function called from different working directories must resolve the same canonical Atlas sources when operating against the same DevKit repository and configuration.

---

# 53. Environment Input Boundary

Atlas SDK must not silently import arbitrary environment variables.

Any environment variable affecting Atlas SDK behavior must be explicitly documented and reserved.

Atlas SDK v1.0 should prefer no implicit environment configuration.

---

# 54. Network Boundary

Atlas SDK v1.0 performs no network retrieval.

It must not:

```text
fetch marketplace pages
call provider APIs
check live marketplace availability
query external research services
refresh Atlas intelligence automatically
```

Atlas SDK consumes repository-backed canonical Atlas intelligence.

---

# 55. PASS 3A Function Boundary

Atlas SDK functions must not expose commands that perform:

```text
plan search
start search wave
evaluate Search State
STOP
EXPAND
compute inventory sufficiency
compute search saturation
```

Those responsibilities remain outside Atlas SDK.

---

# 56. PASS 2 Function Boundary

Atlas SDK functions must not expose version 1.0 commands that perform:

```text
Entity Resolution
Evidence Fusion
Conflict Resolution
Temporal Intelligence reasoning
Decision Intelligence
```

The SDK may expose metadata only when explicitly defined.

---

# 57. PASS 3B Deferred Function Boundary

No PASS 3B-specific public runtime API is part of Atlas SDK v1.0 at this checkpoint.

Atlas Evidence and Provenance functions require explicit future incorporation of the certified PASS 3B canonical repository contract.

No placeholder public Evidence API should be frozen prematurely.

---

# 58. CLI Consumption Contract

The certified CLI may consume Atlas SDK only through public `phoenix::atlas_*` APIs after a future CLI contract revision authorizes Atlas commands.

CLI must not:

```text
read Atlas files directly
invoke _phoenix::atlas_* helpers
duplicate normalization
reinterpret Atlas statuses
```

Atlas SDK remains the integration boundary.

---

# 59. Generator Consumption Contract

Generators may consume Atlas SDK public APIs only when an explicit generator capability requires certified Atlas intelligence.

Atlas SDK must not change Generator Layer planning or execution semantics.

Generators must not write back into Atlas.

---

# 60. Validator Consumption Contract

Validators may consume Atlas SDK public APIs for Atlas-aware validation.

Validation must remain read-only.

Validators must not become an alternate Atlas parser.

---

# 61. Plugin Boundary

Atlas SDK v1.0 has no Plugin dependency.

Future Plugins may consume the certified public Atlas SDK API.

Plugins must not:

```text
replace Atlas source resolution
override Atlas canonical semantics
invoke Atlas SDK private helpers
mutate canonical Atlas inputs
```

---

# 62. Version Contract

Atlas SDK version is independent of Atlas document version.

Compatibility must be explicit.

The SDK must reject a canonical source version when continuing would create ambiguous interpretation.

Unsupported version must produce deterministic failure.

---

# 63. Forward Compatibility

Unknown optional fields may be tolerated only when:

```text
required v1.0 fields remain valid
unknown fields do not redefine existing fields
unknown fields do not require semantic interpretation
```

Unknown mandatory structural changes must not be silently accepted.

---

# 64. Backward Compatibility

Once Atlas SDK v1.0 public API is certified, incompatible changes to:

```text
function names
argument positions
success output fields
status semantics
```

require explicit versioning or architectural revision.

Private helper changes do not constitute public API breakage.

---

# 65. Canonical Ordering Contract

Where Atlas records have explicit canonical identifiers, ordering must prefer those identifiers.

For tracker-derived records:

```text
tracker_id ascending
```

is the initial deterministic order.

Alternative ordering requires explicit function or filter contract.

---

# 66. Duplicate Records

Atlas SDK must not silently discard duplicate-looking records when canonical Atlas sources distinguish them.

Potential duplication may reflect:

```text
distinct marketplace surfaces
historical state
research provenance
provider-family reuse
```

Duplicate elimination is not a generic Atlas SDK responsibility.

---

# 67. Unknown Status Contract

Unknown Atlas status values must not be automatically reclassified.

Possible behaviors include:

```text
reject unsupported mandatory status
preserve explicit UNKNOWN state
```

depending on the frozen implementation contract.

Silent mapping to a known value is forbidden.

---

# 68. Canonical Data Integrity

Atlas SDK must not emit a normalized record as canonical SDK intelligence when required source fields are structurally invalid.

Invalid mandatory data must fail validation before successful output.

Partial record success is permitted only when missing fields are defined as optional.

---

# 69. Source Failure Isolation

Failure in one optional source must not necessarily invalidate all Atlas SDK capabilities.

However, failure of a source required for a requested capability must fail that operation.

The required-source matrix must be explicit before implementation.

---

# 70. Source Requirement Matrix

Atlas SDK v1.0 defines an explicit source-requirement matrix for every public capability.

Each canonical Atlas source is classified per capability as:

```text
REQUIRED
OPTIONAL
CONTEXT_ONLY
NOT_USED
```

These classifications control:

```text
source loading
source validation
SOURCE_MISSING behavior
SOURCE_UNREADABLE behavior
capability availability
partial intelligence behavior
failure isolation
```

A source classified as `REQUIRED` for a capability must be available, readable and valid before that capability may return successful canonical output.

A source classified as `OPTIONAL` may enrich the capability but its absence alone must not fail the operation.

A source classified as `CONTEXT_ONLY` defines certified architecture or semantics but is not required as a runtime data source for that operation.

A source classified as `NOT_USED` must not be loaded merely because it exists.

---

## 70.1 Canonical Atlas Sources

Atlas SDK v1.0 recognizes the following canonical source identifiers:

```text
TRACKER
FINAL_MASTER
SURFACE_REGISTRY
FINAL_RECONCILIATION
STRATEGIC_SYNTHESIS
PASS_2_ARCHITECTURE
PASS_3A_SPECIFICATION
```

They map to:

```text
TRACKER
→ PHOENIX_ATLAS_GLOBAL_TRACKER_001_061.csv

FINAL_MASTER
→ PHOENIX_ATLAS_FINAL_MASTER_v1.0.md

SURFACE_REGISTRY
→ PHOENIX_ATLAS_MARKETPLACE_SURFACE_REGISTRY_v1.0.csv

FINAL_RECONCILIATION
→ PHOENIX_ATLAS_FINAL_RECONCILIATION_v1.0.md

STRATEGIC_SYNTHESIS
→ PHOENIX_ATLAS_STRATEGIC_SYNTHESIS_v1.0.md

PASS_2_ARCHITECTURE
→ PHOENIX_ADAPTIVE_SEARCH_AND_EVIDENCE_ARCHITECTURE_v1.0.md

PASS_3A_SPECIFICATION
→ PHOENIX_PROVIDER_PLANNER_AND_SEARCH_STATE_SPECIFICATION_v1.0.md
```

These logical identifiers are part of the Atlas SDK integration contract.

Exact implementation constants or variable names are deferred to implementation.

---

## 70.2 Classification Semantics

### REQUIRED

```text
REQUIRED
```

means the source is necessary to fulfill the public capability under the frozen v1.0 contract.

If a required source is:

```text
missing
unreadable
invalid
unsupported
```

the public operation must fail with the corresponding canonical status.

---

### OPTIONAL

```text
OPTIONAL
```

means the source may enrich or extend the result but is not necessary for the minimum valid response.

Missing optional data must remain explicit.

The SDK must not invent replacement intelligence.

---

### CONTEXT_ONLY

```text
CONTEXT_ONLY
```

means the source defines architectural semantics, boundaries or certified meaning used to design and validate the SDK contract.

It is not normally loaded as transactional runtime data by the public capability.

Failure to access a context-only document during a normal runtime query must not automatically cause the query to fail.

---

### NOT_USED

```text
NOT_USED
```

means the capability does not require that canonical source under Atlas SDK v1.0.

The SDK must not introduce unnecessary source dependencies.

---

# 70.3 Public Capability Matrix

The frozen candidate source matrix is:

| Public Capability | TRACKER | FINAL_MASTER | SURFACE_REGISTRY | FINAL_RECONCILIATION | STRATEGIC_SYNTHESIS | PASS_2_ARCHITECTURE | PASS_3A_SPECIFICATION |
|---|---|---|---|---|---|---|---|
| `phoenix::atlas_initialize` | REQUIRED | OPTIONAL | OPTIONAL | OPTIONAL | OPTIONAL | CONTEXT_ONLY | CONTEXT_ONLY |
| `phoenix::atlas_is_available` | REQUIRED | OPTIONAL | NOT_USED | NOT_USED | NOT_USED | NOT_USED | NOT_USED |
| `phoenix::atlas_validate` | REQUIRED | REQUIRED | OPTIONAL | OPTIONAL | OPTIONAL | CONTEXT_ONLY | CONTEXT_ONLY |
| `phoenix::atlas_provider_get` | REQUIRED | OPTIONAL | NOT_USED | OPTIONAL | OPTIONAL | CONTEXT_ONLY | CONTEXT_ONLY |
| `phoenix::atlas_provider_list` | REQUIRED | OPTIONAL | NOT_USED | OPTIONAL | OPTIONAL | CONTEXT_ONLY | CONTEXT_ONLY |
| `phoenix::atlas_surface_get` | REQUIRED | REQUIRED | REQUIRED | OPTIONAL | OPTIONAL | CONTEXT_ONLY | CONTEXT_ONLY |
| `phoenix::atlas_surface_list` | REQUIRED | REQUIRED | REQUIRED | OPTIONAL | OPTIONAL | CONTEXT_ONLY | CONTEXT_ONLY |
| `phoenix::atlas_lifecycle_get` | REQUIRED | REQUIRED | NOT_USED | OPTIONAL | OPTIONAL | CONTEXT_ONLY | CONTEXT_ONLY |
| `phoenix::atlas_access_get` | REQUIRED | REQUIRED | NOT_USED | OPTIONAL | OPTIONAL | CONTEXT_ONLY | CONTEXT_ONLY |
| `phoenix::atlas_provider_card` | REQUIRED | REQUIRED | NOT_USED | OPTIONAL | OPTIONAL | CONTEXT_ONLY | CONTEXT_ONLY |

---

# 70.4 Initialization Requirement

`phoenix::atlas_initialize` requires only the minimum Atlas SDK v1.0 initialization baseline:

```text
TRACKER
```

`TRACKER` is the only source required for successful minimum SDK initialization.

The following sources are optional during initialization:

```text
FINAL_MASTER
SURFACE_REGISTRY
FINAL_RECONCILIATION
STRATEGIC_SYNTHESIS
```

If available, they may be resolved, validated and prepared for later capability use.

Their absence alone must not prevent minimum Atlas SDK initialization.

PASS 2 and PASS 3A remain architectural context:

```text
PASS_2_ARCHITECTURE
PASS_3A_SPECIFICATION
```

They must not be parsed as transactional provider records during normal initialization.

Successful initialization establishes:

```text
minimum SDK readiness
```

It does not establish:

```text
availability of every Atlas SDK capability
```

Therefore:

```text
SDK INITIALIZED
        ≠
EVERY CAPABILITY AVAILABLE
```

Capability-specific required sources must be checked when the corresponding public capability is invoked.

For example:

```text
phoenix::atlas_provider_get
phoenix::atlas_provider_list
```

may operate from a valid `TRACKER` baseline.

Whereas:

```text
phoenix::atlas_surface_get
phoenix::atlas_surface_list
phoenix::atlas_lifecycle_get
phoenix::atlas_access_get
phoenix::atlas_provider_card
```

must additionally verify their capability-specific required canonical dependencies before returning successful canonical output. Surface capabilities require both `FINAL_MASTER` and `SURFACE_REGISTRY`; lifecycle, access and Provider Card capabilities retain the `FINAL_MASTER` dependency.

Initialization must not promote an optional capability source into a global requirement.

---

# 70.5 Availability Requirement

`phoenix::atlas_is_available` is intentionally narrow.

Its minimum required source is:

```text
TRACKER
```

`FINAL_MASTER` is optional for the availability predicate.

The predicate answers:

```text
Can the minimum Atlas SDK v1.0 initialization baseline be resolved and accessed?
```

The minimum initialization baseline is:

```text
TRACKER
```

Therefore successful Atlas SDK availability does not imply that every capability-specific source is available.

In particular:

```text
ATLAS SDK AVAILABLE
        ≠
EVERY ATLAS SDK CAPABILITY AVAILABLE
```

Capabilities requiring `FINAL_MASTER` must verify that dependency when invoked.

The availability predicate does not answer:

```text
Is FINAL_MASTER available for every capability?
Are all optional Atlas sources present?
Are all Atlas documents semantically valid?
Is PASS 2 loaded?
Is PASS 3A loaded?
Is every Provider Card enrichable?
```

Therefore optional and context-only sources must not cause the minimum availability predicate to return false.

---

# 70.6 Validation Requirement

`phoenix::atlas_validate` validates the required runtime source baseline:

```text
TRACKER
FINAL_MASTER
```

It may additionally validate available optional sources:

```text
SURFACE_REGISTRY
FINAL_RECONCILIATION
STRATEGIC_SYNTHESIS
```

An optional source that is absent must not fail validation solely because it is absent.

An optional source that is present but structurally invalid may be reported diagnostically.

Whether such invalid optional data blocks a capability depends on whether that capability actually consumes it.

PASS 2 and PASS 3A are not generic runtime data-validation inputs.

They remain certified architectural context.

---

# 70.7 Provider Lookup Requirement

`phoenix::atlas_provider_get` requires:

```text
TRACKER
```

The tracker provides the minimum canonical provider intelligence record set.

`FINAL_MASTER` is:

```text
OPTIONAL
```

for provider lookup because it may enrich provider intelligence but the minimum provider record can be resolved from the tracker.

The SDK must not fail a valid tracker-backed provider lookup solely because optional enrichment sources are absent.

---

# 70.8 Provider Listing Requirement

`phoenix::atlas_provider_list` requires:

```text
TRACKER
```

The canonical listing baseline derives from tracker records.

Default ordering remains:

```text
tracker_id ascending
```

Optional sources may enrich records but must not reorder the canonical provider list unless a future explicit contract defines a different ordering.

---

# 70.9 Marketplace Surface Requirement

The following capabilities require:

```text
TRACKER
FINAL_MASTER
SURFACE_REGISTRY
```

```text
phoenix::atlas_surface_get
phoenix::atlas_surface_list
```

The tracker identifies canonical marketplace/provider records.

The Final Master provides the architectural intelligence needed to preserve the distinction between:

```text
Provider Family
        ≠
Marketplace Surface
```

`SURFACE_REGISTRY` is the canonical runtime authority for materialized Marketplace Surface identity in Atlas SDK v1.0.

It provides the explicit surface identity required by `phoenix::atlas_surface_get` and `phoenix::atlas_surface_list`.

The registry must preserve deterministic traceability to the canonical Atlas provider/marketplace record from which each surface entry is derived.

The registry must not redefine Provider Family, lifecycle or access semantics.

A surface capability must not fabricate, infer or synthesize a `SURFACE_ID` when the required canonical surface registry record cannot be resolved.

## 70.9.1 Canonical Marketplace Surface Identity Rule

Atlas SDK v1.0 freezes a deterministic Marketplace Surface identity mapping for the canonical 61-record Tracker baseline.

Every materialized Marketplace Surface must have exactly one stable and unique `SURFACE_ID`.

The identities remain distinct:

```text
TRACKER_ID != PROVIDER_ID != SURFACE_ID
```

For Atlas v1.0 the authorized mapping is:

```text
SURFACE_ID = ATLAS-SURFACE-<three-digit canonical TRACKER_ID>
```

Examples:

```text
TRACKER_ID=1  -> SURFACE_ID=ATLAS-SURFACE-001
TRACKER_ID=9  -> SURFACE_ID=ATLAS-SURFACE-009
TRACKER_ID=61 -> SURFACE_ID=ATLAS-SURFACE-061
```

This mapping creates a distinct Surface identity; it does not redefine or replace Tracker identity.

The mapping must be deterministic, injective, stable across repeated materialization, independent of display names, locale, filesystem path and runtime order, and traceable to exactly one canonical Tracker record.

Materialization must fail when the originating `TRACKER_ID` is absent, invalid or duplicated, or when the derived `SURFACE_ID` collides.

`PROVIDER_ID` is not created by this rule and must not be silently inferred from `TRACKER_ID`.

Once materialized, `SURFACE_REGISTRY` is the runtime authority for stored `SURFACE_ID` values. Runtime Surface APIs must resolve stored registry identities and must not regenerate missing identities.


---

# 70.10 Lifecycle Requirement

`phoenix::atlas_lifecycle_get` requires:

```text
TRACKER
FINAL_MASTER
```

The tracker provides provider identity and current Atlas record context.

The Final Master provides the canonical lifecycle intelligence domain.

Optional reconciliation and synthesis sources may provide explanatory or historical enrichment.

They must not silently override canonical lifecycle data.

At the IP-09 baseline, no complete provider-specific Lifecycle Registry is materialized as a canonical Atlas runtime source.

Narrative, aggregate, historical or architectural lifecycle statements must not be converted into provider-specific runtime values unless an explicit deterministic mapping contract authorizes that conversion.

Therefore, when provider identity is valid and the required sources are available but no unambiguous provider-specific lifecycle value can be resolved under an authorized canonical mapping:

LIFECYCLE=UNKNOWN

UNKNOWN must not be interpreted as ACTIVE, inactive, closed, unavailable or any other lifecycle state.

---

# 70.11 Access Requirement

`phoenix::atlas_access_get` requires:

```text
TRACKER
FINAL_MASTER
```

The required baseline must preserve:

```text
Technical Availability ≠ Authorized Access
```

and:

```text
Provider Existence ≠ Executable Access
```

Optional sources may enrich access intelligence but must not independently create authorization.

No access result may be inferred solely from source presence.

At the IP-09 baseline, no complete provider-specific Access Registry or Access Matrix is materialized as a canonical Atlas runtime source.

Narrative references to APIs, feeds, partnerships, licensing, restrictions, technical availability or preferred integration routes must not be converted into provider-specific authorization or access-state values unless an explicit deterministic mapping contract authorizes that conversion.

Therefore, when provider identity is valid and the required sources are available but no unambiguous provider-specific access value can be resolved under an authorized canonical mapping:

ACCESS_STATE=UNKNOWN
ACCESS_POLICY=UNKNOWN

UNKNOWN must not be interpreted as authorized, unauthorized, technically available, executable or prohibited.

---

# 70.12 Provider Card Requirement

`phoenix::atlas_provider_card` requires:

```text
TRACKER
FINAL_MASTER
```

A Provider Card is a composed projection.

The minimum card must preserve:

```text
provider identity
marketplace identity
Atlas status
canonical source traceability
```

where those values are canonically available.

Optional sources may enrich:

```text
reconciliation context
strategic context
historical explanation
```

but absence of optional enrichment must not invalidate an otherwise valid Provider Card.

---

# 70.13 Context-Only Architecture Sources

The following sources are `CONTEXT_ONLY` for Atlas SDK v1.0 runtime queries:

```text
PASS_2_ARCHITECTURE
PASS_3A_SPECIFICATION
```

They define and constrain:

```text
ownership boundaries
evidence boundaries
planner boundaries
search-state boundaries
access semantics
provider-family semantics
marketplace-surface semantics
```

They are architectural authorities.

They are not runtime provider databases.

The SDK must not parse them as if they were provider-record stores.

---

# 70.14 PASS 3B Exclusion

PASS 3B is not part of the Atlas SDK v1.0 Source Requirement Matrix at this checkpoint.

No PASS 3B source is:

```text
REQUIRED
OPTIONAL
CONTEXT_ONLY
```

for the current runtime contract.

PASS 3B incorporation requires a future explicit Architecture and Function Specification revision after canonical repository materialization.

---

# 70.15 Optional Source Failure Rule

An absent optional source must not cause:

```text
SOURCE_MISSING
```

for a capability that does not require it.

An unreadable optional source must not automatically cause:

```text
SOURCE_UNREADABLE
```

unless the requested capability actually depends on that source for a field required by its contract.

Optional enrichment must remain optional in failure behavior as well as documentation.

---

# 70.16 Required Source Failure Rule

If a source marked `REQUIRED` for the requested capability is missing:

```text
return 4 — SOURCE_MISSING
```

If it exists but cannot be safely read:

```text
return 5 — SOURCE_UNREADABLE
```

If it is readable but violates required canonical structure:

```text
return 6 — INVALID_CANONICAL_DATA
```

If its canonical version is unsupported:

```text
return 7 — UNSUPPORTED_VERSION
```

This mapping must remain consistent with Section 40.

---

# 70.17 Capability-Local Failure Isolation

Source failure must be evaluated per capability.

Example:

```text
FINAL_MASTER missing
```

may cause:

```text
phoenix::atlas_surface_get      → SOURCE_MISSING
phoenix::atlas_lifecycle_get    → SOURCE_MISSING
phoenix::atlas_access_get       → SOURCE_MISSING
phoenix::atlas_provider_card    → SOURCE_MISSING
```

while still permitting:

```text
phoenix::atlas_provider_get
phoenix::atlas_provider_list
```

to succeed from a valid tracker baseline when their minimum contract is satisfiable.

This is intentional capability-local failure isolation.

---

# 70.18 No Implicit Source Promotion

An `OPTIONAL` source must not silently become `REQUIRED` because an implementation happens to use it.

Changing source classification requires an explicit Function Specification revision.

Implementation convenience must not redefine the frozen contract.

---

# 70.19 No Implicit Fallback Source

If a required canonical source is unavailable, Atlas SDK must not silently search for alternate files or research material.

Forbidden fallback behavior includes:

```text
using checkpoint research as replacement canonical data
using arbitrary markdown files
searching backup directories
using stale duplicates
using Work artifacts
using draft Atlas material
```

Canonical source failure must remain explicit.

---

# 70.20 Source Precedence

When multiple authorized sources provide related information, precedence must follow the explicit capability contract.

The minimum v1.0 direction is:

```text
identity / basic provider record
→ TRACKER

registry / lifecycle / access intelligence
→ FINAL_MASTER

materialized marketplace surface identity
→ SURFACE_REGISTRY

surface architectural semantics
→ FINAL_MASTER

reconciliation explanation
→ FINAL_RECONCILIATION

strategic explanation
→ STRATEGIC_SYNTHESIS

architectural semantics
→ PASS_2_ARCHITECTURE / PASS_3A_SPECIFICATION
```

Optional explanatory sources must not silently override required canonical record identity.

---

# 70.21 Traceability Across Sources

When a public result combines more than one canonical source, source traceability must remain explicit.

The SDK must be able to distinguish:

```text
base source
enrichment source
architectural context
```

Provider Card composition must not collapse multiple origins into an untraceable synthetic record.

---

# 70.22 Loading Discipline

Atlas SDK must load only the sources required or explicitly optional for the requested capability.

It must not blindly load every Atlas document for every call.

This supports:

```text
dependency clarity
failure isolation
performance
determinism
testability
```

---

# 70.23 Source Matrix and Initialization

Initialization may prepare common required sources.

However, initialization must not force every optional capability source to become globally mandatory.

The implementation may cache available optional sources after successful discovery.

Optional availability must remain distinct from required initialization success.
The minimum initialization baseline is `TRACKER`; capability-specific sources such as `FINAL_MASTER` are validated when required by the invoked public capability.

---

# 70.24 Source Matrix and Validation

Validation must be capability-aware.

A globally valid minimum Atlas SDK installation may still lack optional enrichment.

A capability requiring a source unavailable in that installation must fail explicitly when invoked.

Therefore:

```text
SDK initialized
        ≠
every Atlas SDK capability guaranteed available
```

unless all capability-specific required sources are present.

---

# 70.25 Source Matrix and Public API

The Source Requirement Matrix applies to all public Atlas SDK functions.

Public consumers must not bypass the matrix by reading canonical Atlas files directly.

The SDK remains the authoritative DevKit integration boundary for source dependency semantics.

---

# 70.26 Test Contract

Tests must verify at minimum:

1. every public function loads only authorized sources;
2. every required-source absence maps to `SOURCE_MISSING`;
3. required unreadable source maps to `SOURCE_UNREADABLE`;
4. invalid required data maps to `INVALID_CANONICAL_DATA`;
5. unsupported required version maps to `UNSUPPORTED_VERSION`;
6. optional source absence does not incorrectly fail the capability;
7. context-only source absence does not fail runtime query functions;
8. provider lookup can operate from the tracker minimum contract;
9. surface lookup fails when either required FINAL_MASTER or SURFACE_REGISTRY authority is unavailable;
10. lifecycle lookup fails when its required lifecycle source is unavailable;
11. access lookup does not infer authorization from partial sources;
12. Provider Card preserves multi-source traceability;
13. no arbitrary fallback source is used;
14. source requirements are independent of caller PWD;
15. repeated calls produce the same source-resolution behavior.

---

# 70.27 Source Requirement Invariants

The Source Requirement Matrix freezes the following candidate invariants:

1. Required sources are capability-specific.
2. Optional sources remain optional in failure behavior.
3. Context-only architecture documents are not runtime provider databases.
4. Atlas SDK does not treat every Atlas file as globally mandatory.
5. Required-source failure maps to the Section 40 status contract.
6. Provider lookup and listing require the tracker baseline.
7. Surface capabilities require TRACKER, FINAL_MASTER and SURFACE_REGISTRY; lifecycle, access and Provider Card capabilities retain the TRACKER and FINAL_MASTER baseline.
8. PASS 2 remains architectural context.
9. PASS 3A remains architectural context.
10. PASS 3B is excluded from the v1.0 runtime matrix at this checkpoint.
11. No arbitrary source fallback is allowed.
12. Source precedence is explicit.
13. Multi-source traceability is preserved.
14. Implementation convenience must not change source classification.
15. Consumers must not bypass the Atlas SDK source contract.

---

# 70.28 Current Freeze State

```text
Canonical Source Identifiers         DEFINED
Source Classification Semantics      DEFINED
Public Capability Matrix             DEFINED
Initialization Requirements          DEFINED
Availability Requirements            DEFINED
Validation Requirements              DEFINED
Provider Requirements                DEFINED
Surface Requirements                 DEFINED
Lifecycle Requirements               DEFINED
Access Requirements                  DEFINED
Provider Card Requirements           DEFINED
Context-Only Boundary                DEFINED
PASS 3B Exclusion                    DEFINED
Failure Isolation                    DEFINED
Source Precedence                    DEFINED
Traceability                         DEFINED
Test Contract                        DEFINED

Source Requirement Matrix            FROZEN
Implementation                       COMPLETE
```

The Source Requirement Matrix was formally `FROZEN` following the successful P8-09 cross-contract consistency review.

IP-08D performs one controlled post-freeze contract revision limited to Marketplace Surface authority materialization. The revision introduces `SURFACE_REGISTRY` as a capability-specific required canonical source for `phoenix::atlas_surface_get` and `phoenix::atlas_surface_list`.

This revision does not alter the source requirements of provider, lifecycle, access or Provider Card capabilities.

Following successful IP-08D contract verification, the revised Source Requirement Matrix returns to `FROZEN` state.
---

# 71. Performance Boundary

Atlas SDK v1.0 prioritizes:

```text
correctness
determinism
traceability
clarity
```

over premature optimization.

Caching may be introduced only if it preserves deterministic behavior and read-only canonical source semantics.

---

# 72. Cache Boundary

If in-memory caching is implemented:

```text
cache is process-local
cache does not rewrite Atlas
cache must preserve source identity
cache must not change semantic output
```

Persistent cache is outside v1.0 unless explicitly approved.

---

# 73. Concurrency Boundary

Atlas SDK v1.0 does not require a complex concurrency subsystem.

Because canonical access is read-only, concurrent reads must not introduce semantic mutation.

Any future shared mutable cache requires separate review.

---

# 74. Logging Boundary

Atlas SDK may use certified Phoenix logging services.

Logging must not modify functional stdout contracts.

Canonical result data belongs to stdout.

Diagnostics and logging must remain separable from canonical result serialization.

---

# 75. Error Message Direction

Errors should identify:

```text
operation
failure class
relevant canonical source or identifier
```

without exposing unrelated internal state.

Example direction:

```text
[ERROR] Atlas provider not found: 999
```

Exact formatting follows certified Phoenix logging conventions where applicable.

---

# 76. Required Tests — Initialization

Tests must verify at minimum:

1. valid initialization succeeds;
2. repeated initialization is safe;
3. missing Atlas root fails;
4. required source missing fails;
5. unreadable source fails;
6. unsupported source version fails;
7. initialization does not mutate sources;
8. caller PWD does not alter source resolution.

---

# 77. Required Tests — Validation

Tests must verify at minimum:

1. valid tracker passes;
2. missing required column fails;
3. structurally invalid tracker record fails where mandatory;
4. additional optional field handling is deterministic;
5. unknown mandatory status behavior is explicit;
6. validation remains read-only;
7. no partial canonical stdout precedes validation success.

---

# 78. Required Tests — Provider Query

Tests must verify:

1. provider lookup success;
2. unknown provider;
3. empty provider ID;
4. malformed provider ID;
5. deterministic output;
6. canonical source traceability;
7. missing optional fields remain explicit;
8. no fuzzy matching;
9. no ranking side effect.

---

# 79. Required Tests — Provider Listing

Tests must verify:

1. complete list success;
2. deterministic `tracker_id` ordering;
3. repeated calls produce identical output;
4. filesystem ordering does not influence output;
5. distinct marketplace surfaces are preserved;
6. duplicate-looking canonical records are not silently collapsed.

---

# 80. Required Tests — Surface Query

Tests must verify:

1. surface lookup success;
2. unknown surface;
3. Provider Family / Surface distinction;
4. deterministic surface listing;
5. access metadata preservation;
6. lifecycle metadata preservation where available.

---

# 81. Required Tests — Lifecycle

Tests must verify:

1. known lifecycle;
2. unknown lifecycle;
3. missing lifecycle;
4. unsupported lifecycle;
5. lifecycle is not inferred from marketplace availability;
6. lifecycle lookup does not mutate Atlas.

---

# 82. Required Tests — Access

Tests must verify:

1. known access state;
2. missing access intelligence;
3. technical availability does not imply authorization;
4. API existence does not imply authorized search;
5. access lookup performs no network access;
6. access lookup cannot modify access policy.

---

# 83. Required Tests — Provider Card

Tests must verify:

1. valid Provider Card;
2. deterministic field ordering;
3. canonical source references preserved;
4. missing optional values preserved;
5. no ranking;
6. no recommendation;
7. no execution state inference;
8. no Search Planner output.

---

# 84. Required Tests — Security

Tests must verify:

1. Atlas values are never executed;
2. `eval` is not used;
3. Atlas files are not sourced as shell code;
4. malicious field content remains inert data;
5. path traversal is rejected;
6. arbitrary source paths are rejected;
7. recursive filesystem discovery is not used;
8. canonical Atlas files remain unchanged.

---

# 85. Required Tests — Dependency Boundary

Tests or static verification must confirm:

```text
Core does not depend on Atlas SDK
Atlas SDK does not depend on CLI
Atlas SDK does not depend on Plugin System
Atlas SDK does not call private internals of unrelated DevKit modules
Consumers use public Atlas SDK API only
```

---

# 86. Public API Freeze

Atlas SDK v1.0 formally defines the following public API surface:

```text
phoenix::atlas_initialize

phoenix::atlas_is_available

phoenix::atlas_validate

phoenix::atlas_provider_get

phoenix::atlas_provider_list

phoenix::atlas_surface_get

phoenix::atlas_surface_list

phoenix::atlas_lifecycle_get

phoenix::atlas_access_get

phoenix::atlas_provider_card
```

These ten functions constitute the complete Atlas SDK v1.0 public API.

No additional public Atlas SDK function belongs to v1.0.

---

## 86.1 Public Namespace Contract

All public Atlas SDK functions must use:

```text
phoenix::atlas_*
```

No public Atlas SDK function may use:

```text
_phoenix::atlas_*
```

The `_phoenix::atlas_*` namespace remains private implementation space.

---

## 86.2 Frozen Public Function Set

The following public function names are frozen candidates for Atlas SDK v1.0:

```text
phoenix::atlas_initialize
phoenix::atlas_is_available
phoenix::atlas_validate
phoenix::atlas_provider_get
phoenix::atlas_provider_list
phoenix::atlas_surface_get
phoenix::atlas_surface_list
phoenix::atlas_lifecycle_get
phoenix::atlas_access_get
phoenix::atlas_provider_card
```

Once the P8-09 freeze gate passes, these names become stable public contracts.

Changing or removing one requires an explicit Atlas SDK contract revision.

---

## 86.3 Function Count Contract

Atlas SDK v1.0 public function count is:

```text
10
```

This count is part of the v1.0 API surface.

Private helper count is not part of the public contract.

---

## 86.4 Initialization API

```text
phoenix::atlas_initialize
```

Responsibility:

```text
prepare process-local Atlas SDK state
resolve minimum canonical source baseline
validate minimum initialization requirements
prepare available optional sources
```

It must not:

```text
perform provider execution
perform search planning
mutate Atlas
perform network retrieval
guarantee every capability-specific source exists
```

---

## 86.5 Availability API

```text
phoenix::atlas_is_available
```

Responsibility:

```text
answer whether the minimum Atlas SDK initialization baseline is available
```

Its predicate contract remains:

```text
0   AVAILABLE
1   UNAVAILABLE
```

It must not be interpreted as:

```text
all capabilities available
all canonical sources valid
provider access authorized
```

---

## 86.6 Validation API

```text
phoenix::atlas_validate
```

Responsibility:

```text
validate the Atlas SDK canonical runtime source baseline
```

It remains:

```text
read-only
deterministic
fail-fast
```

Validation must not mutate canonical Atlas assets.

---

## 86.7 Provider Lookup API

```text
phoenix::atlas_provider_get <provider-id>
```

Responsibility:

```text
resolve one normalized Provider Intelligence record
```

Lookup remains:

```text
explicit
identity-based
deterministic
non-fuzzy
non-ranking
```

---

## 86.8 Provider Listing API

```text
phoenix::atlas_provider_list
```

Responsibility:

```text
return the canonical normalized Provider Intelligence sequence
```

Default tracker-backed ordering remains:

```text
tracker_id ascending
```

Listing must not introduce:

```text
strategic ranking
recommendation ranking
filesystem-derived ordering
```

---

## 86.9 Marketplace Surface Lookup API

```text
phoenix::atlas_surface_get <surface-id>
```

Responsibility:

```text
resolve one normalized Marketplace Surface intelligence record
```

The API must preserve:

```text
Provider Family
        ≠
Marketplace Surface
```

---

## 86.10 Marketplace Surface Listing API

```text
phoenix::atlas_surface_list
```

Responsibility:

```text
return normalized Marketplace Surface records in deterministic order
```

Distinct surfaces must not be collapsed merely because they belong to one Provider Family.

---

## 86.11 Lifecycle API

```text
phoenix::atlas_lifecycle_get <provider-id>
```

Responsibility:

```text
return certified Atlas lifecycle intelligence for one provider
```

The API must not infer lifecycle from:

```text
marketplace availability
provider response
network reachability
runtime execution state
```

---

## 86.12 Access API

```text
phoenix::atlas_access_get <provider-id>
```

Responsibility:

```text
return certified Atlas access intelligence
```

It must preserve:

```text
Technical Availability ≠ Authorized Access
```

and:

```text
Provider Existence ≠ Executable Access
```

---

## 86.13 Provider Card API

```text
phoenix::atlas_provider_card <provider-id>
```

Responsibility:

```text
compose one normalized read-only Provider Card
```

Provider Card remains:

```text
intelligence projection
```

not:

```text
ranking
recommendation
decision
runtime eligibility
search role
```

---

## 86.14 Public Argument Shape Contract

Atlas SDK v1.0 public argument shapes are:

```text
phoenix::atlas_initialize
→ no public positional arguments

phoenix::atlas_is_available
→ no public positional arguments

phoenix::atlas_validate
→ no public positional arguments

phoenix::atlas_provider_get
→ exactly 1 required positional argument: provider-id

phoenix::atlas_provider_list
→ no required positional arguments

phoenix::atlas_surface_get
→ exactly 1 required positional argument: surface-id

phoenix::atlas_surface_list
→ no required positional arguments

phoenix::atlas_lifecycle_get
→ exactly 1 required positional argument: provider-id

phoenix::atlas_access_get
→ exactly 1 required positional argument: provider-id

phoenix::atlas_provider_card
→ exactly 1 required positional argument: provider-id
```

No optional public positional argument is frozen for v1.0.

---

## 86.15 Filter Boundary

Atlas SDK v1.0 does not freeze public list-filter syntax.

Therefore:

```text
phoenix::atlas_provider_list
phoenix::atlas_surface_list
```

remain zero-argument public APIs in the initial v1.0 contract.

Future filtering support requires explicit specification revision.

This avoids prematurely freezing an unstable filter grammar.

---

## 86.16 Return Status Contract

All public Atlas SDK functions must comply with Section 40.

Canonical mapping:

```text
0   SUCCESS
1   PREDICATE_FALSE / UNAVAILABLE
2   INVALID_ARGUMENT
3   NOT_FOUND
4   SOURCE_MISSING
5   SOURCE_UNREADABLE
6   INVALID_CANONICAL_DATA
7   UNSUPPORTED_VERSION
8   INTERNAL_FAILURE
```

Status `1` remains restricted to explicitly documented predicate semantics.

---

## 86.17 Serialization Contract

All public query and listing APIs must comply with Section 37 Canonical Serialization.

Successful canonical query/list output uses:

```text
KEY=VALUE
```

serialization.

Canonical stdout must not contain diagnostics.

Diagnostics remain on stderr.

---

## 86.18 Source Requirement Contract

All public functions must comply with Section 70 Source Requirement Matrix.

A public function must not silently promote:

```text
OPTIONAL
```

to:

```text
REQUIRED
```

and must not bypass capability-local source requirements.

---

## 86.19 Initialization Relationship

Public query functions may initialize the SDK deterministically when required.

Initialization establishes:

```text
minimum SDK readiness
```

not:

```text
every capability available
```

Capability-specific dependencies must still be validated before successful output.

---

## 86.20 Read-Only Contract

Every public Atlas SDK function is read-only with respect to canonical Atlas assets.

No public API may:

```text
rewrite
append
delete
rename
move
reclassify
persist normalized state into Atlas
```

---

## 86.21 Network Contract

No Atlas SDK v1.0 public function performs network retrieval.

The public API must not:

```text
fetch marketplace pages
call provider APIs
check live provider availability
refresh Atlas research
perform remote discovery
```

---

## 86.22 Planner Boundary

No public Atlas SDK v1.0 function may perform:

```text
Search Plan creation
Search Wave execution
Search State evaluation
STOP
EXPAND
inventory sufficiency
search saturation
```

These responsibilities remain outside Atlas SDK.

---

## 86.23 Evidence / Decision Boundary

No public Atlas SDK v1.0 function may perform:

```text
Entity Resolution
Evidence Fusion
Conflict Resolution
Temporal Intelligence reasoning
Decision Intelligence
recommendation generation
```

PASS 2 and future PASS 3B-derived runtime capabilities remain separate.

---

## 86.24 PASS 3B Boundary

No PASS 3B-specific public Evidence or Provenance API is part of Atlas SDK v1.0.

Forbidden premature examples include:

```text
phoenix::atlas_evidence_get
phoenix::atlas_provenance_get
phoenix::atlas_evidence_fuse
```

Future Evidence/Provenance exposure requires an explicit architecture and function-specification revision after canonical PASS 3B repository integration.

---

## 86.25 Plugin Boundary

No public Atlas SDK v1.0 function requires or exposes Plugin System semantics.

Atlas SDK remains usable without the future Plugin layer.

---

## 86.26 Forbidden Public API Names

Atlas SDK v1.0 must not expose functions equivalent to:

```text
phoenix::atlas_plan_search
phoenix::atlas_stop
phoenix::atlas_expand
phoenix::atlas_rank_provider
phoenix::atlas_resolve_entity
phoenix::atlas_fuse_evidence
phoenix::atlas_decide
phoenix::atlas_recommend
phoenix::atlas_scrape
phoenix::atlas_fetch_provider
phoenix::atlas_refresh_from_network
phoenix::atlas_evidence_get
phoenix::atlas_provenance_get
```

These names would cross established architectural boundaries.

---

## 86.27 Private Helper Boundary

Private helpers remain implementation details.

Candidate private helpers may include:

```text
_phoenix::atlas_resolve_root
_phoenix::atlas_resolve_sources
_phoenix::atlas_require_initialized
_phoenix::atlas_load_tracker
_phoenix::atlas_validate_tracker
_phoenix::atlas_normalize_record
_phoenix::atlas_find_provider
_phoenix::atlas_find_surface
_phoenix::atlas_serialize_record
_phoenix::atlas_compose_provider_card
```

These names are not part of the public API freeze.

They may evolve without a public API version change provided public contracts remain preserved.

---

## 86.28 Public API Compatibility

Once formally frozen, incompatible change includes:

```text
renaming a public function
removing a public function
changing required positional arguments
changing return-status meaning
changing canonical stdout field semantics
changing source-requirement semantics incompatibly
changing read-only behavior
adding network behavior
```

Such changes require explicit versioning or contract revision.

---

## 86.29 Compatible Evolution

Potential compatible evolution may include:

```text
private helper refactoring
internal caching
performance improvements
additional internal validation
additional diagnostics on stderr
```

provided that:

```text
public function names remain unchanged
argument contracts remain unchanged
return statuses remain unchanged
canonical stdout remains contract-compatible
source semantics remain preserved
determinism remains preserved
```

---

## 86.30 Public API Tests

Tests must verify at minimum:

1. exactly ten public Atlas SDK functions exist;
2. every public function uses `phoenix::atlas_*`;
3. private helpers are not required by consumers;
4. zero-argument APIs reject undocumented positional arguments when appropriate;
5. one-argument APIs reject missing required identifiers;
6. one-argument APIs reject surplus unsupported positional arguments;
7. `atlas_is_available` preserves predicate status semantics;
8. public query functions use Section 40 statuses;
9. public query/list functions use Section 37 serialization;
10. public functions comply with Section 70 source requirements;
11. all public APIs remain read-only;
12. no public API performs network retrieval;
13. no public API performs Planner responsibilities;
14. no public API performs Evidence Fusion or Decision Intelligence;
15. no PASS 3B Evidence API exists in v1.0;
16. forbidden public API names are absent;
17. private helper changes do not alter public contracts.

---

## 86.31 Public API Invariants

The Public API freeze defines the following candidate invariants:

1. Atlas SDK v1.0 exposes exactly ten public functions.
2. Public functions use `phoenix::atlas_*`.
3. `_phoenix::atlas_*` remains private.
4. Public function names are stable within v1.0.
5. Initialization, availability and validation expose no positional arguments.
6. Provider and surface identity lookups use one explicit identifier.
7. List APIs expose no frozen filter grammar in v1.0.
8. Return statuses follow Section 40.
9. Serialization follows Section 37.
10. Source requirements follow Section 70.
11. Public API remains read-only.
12. Public API performs no network retrieval.
13. Public API does not own Provider Planner behavior.
14. Public API does not own Search State, STOP or EXPAND.
15. Public API does not own Entity Resolution.
16. Public API does not own Evidence Fusion.
17. Public API does not own Decision Intelligence.
18. PASS 3B-specific Evidence APIs remain deferred.
19. Plugin System is not required.
20. Incompatible public changes require explicit contract revision.

---

## 86.32 Current Freeze State

```text
Public Namespace                     DEFINED
Public Function Set                  DEFINED
Public Function Count                DEFINED
Initialization API                   DEFINED
Availability API                     DEFINED
Validation API                       DEFINED
Provider Lookup API                  DEFINED
Provider Listing API                 DEFINED
Surface Lookup API                   DEFINED
Surface Listing API                  DEFINED
Lifecycle API                        DEFINED
Access API                           DEFINED
Provider Card API                    DEFINED
Argument Shapes                      DEFINED
Filter Boundary                      DEFINED
Return Status Dependency             DEFINED
Serialization Dependency             DEFINED
Source Matrix Dependency             DEFINED
Read-Only Boundary                   DEFINED
Network Boundary                     DEFINED
Planner Boundary                     DEFINED
Evidence / Decision Boundary         DEFINED
PASS 3B Boundary                     DEFINED
Plugin Boundary                      DEFINED
Compatibility Boundary               DEFINED
Test Contract                        DEFINED

Public API                           FROZEN
Implementation                       COMPLETE
```

The Public API is formally `FROZEN` following the successful P8-09 cross-contract consistency review.

---

# 87. Function Invariants

Atlas SDK v1.0 functions must preserve:

1. Atlas semantics remain owned by Phoenix Atlas.
2. Public APIs are `phoenix::atlas_*`.
3. Private helpers are `_phoenix::atlas_*`.
4. Canonical Atlas access is read-only.
5. Source resolution is deterministic.
6. Caller PWD does not control canonical source resolution.
7. Atlas content is data, never code.
8. No public function uses `eval`.
9. No public function performs network retrieval.
10. Provider lookup is explicit and deterministic.
11. Provider listing is deterministic.
12. Marketplace Surface remains distinct from Provider Family.
13. Technical availability does not imply authorization.
14. Atlas intelligence does not imply runtime executability.
15. Provider Cards are projections, not decisions.
16. Missing information remains explicit.
17. Canonical source traceability is preserved.
18. Failures remain distinguishable from valid absence.
19. PASS 3A planning ownership remains untouched.
20. PASS 2 evidence/decision ownership remains untouched.
21. PASS 3B runtime integration remains deferred.
22. Plugin System is not required.
23. Core does not depend upward on Atlas SDK.
24. Public result serialization is deterministic.

---

# 88. Forbidden Public Functions

Atlas SDK v1.0 must not expose functions equivalent to:

```text
phoenix::atlas_plan_search
phoenix::atlas_stop
phoenix::atlas_expand
phoenix::atlas_rank_provider
phoenix::atlas_resolve_entity
phoenix::atlas_fuse_evidence
phoenix::atlas_decide
phoenix::atlas_recommend
phoenix::atlas_scrape
phoenix::atlas_fetch_provider
phoenix::atlas_refresh_from_network
```

These would violate established architectural boundaries.

---

# 89. Initial Physical Function Mapping

Candidate implementation mapping:

```text
10_ATLAS_SDK/
├── README.md
├── atlas.sh
├── loader.sh
├── normalization.sh
├── query.sh
└── provider_card.sh
```

Conceptual responsibilities:

```text
atlas.sh
→ public API composition / initialization

loader.sh
→ canonical source resolution and safe loading

normalization.sh
→ structural normalization and serialization

query.sh
→ lookup / listing / lifecycle / access queries

provider_card.sh
→ Provider Card composition
```

Exact mapping remains subject to implementation planning.

---

# 90. Implementation Preconditions

Implementation must not begin until:

```text
Atlas SDK Architecture                REVIEWED
Atlas SDK Function Specification      REVIEWED
Public API                            FROZEN
Return Status Mapping                 FROZEN
Source Requirement Matrix             FROZEN
Canonical Serialization              FROZEN
Security Review                       PASS
Dependency Review                     PASS
Cross-document Consistency            PASS
Implementation Plan                   APPROVED
```

---

# 91. Function Specification Success Criteria

The Atlas SDK Function Specification is complete when:

```text
Public namespace                      DEFINED
Private namespace                     DEFINED
Public function surface               DEFINED
Initialization                        DEFINED
Availability                          DEFINED
Validation                            DEFINED
Provider lookup                       DEFINED
Provider listing                      DEFINED
Surface lookup                        DEFINED
Surface listing                       DEFINED
Lifecycle lookup                      DEFINED
Access lookup                         DEFINED
Provider Card                         DEFINED
stdout contract                       DEFINED
stderr contract                       DEFINED
Failure semantics                     DEFINED
Fail-fast order                       DEFINED
Read-only contract                    DEFINED
Source traceability                   DEFINED
Deterministic serialization           DEFINED
Security boundary                     DEFINED
Network boundary                      DEFINED
PASS 3A boundary                      PRESERVED
PASS 2 boundary                       PRESERVED
PASS 3B boundary                      PRESERVED
Plugin boundary                       PRESERVED
Implementation                        COMPLETE
```

---

# 92. Current Function Specification State

```text
PHOENIX DEVKIT — PHASE 8
ATLAS SDK FUNCTION SPECIFICATION

Public API Candidate                DEFINED
Namespace                           DEFINED
Initialization Contract             DEFINED
Availability Contract               DEFINED
Validation Contract                 DEFINED
Provider Query Contract             DEFINED
Marketplace Surface Contract        DEFINED
Lifecycle Contract                  DEFINED
Access Contract                     DEFINED
Provider Card Contract              DEFINED
Determinism                         DEFINED
Read-Only Contract                  DEFINED
Security Boundary                   DEFINED
Failure Model                       DEFINED
Testing Direction                   DEFINED

Public API Freeze                   FROZEN
Architecture / Function Review      PASS
Implementation                      COMPLETE
Final Certification                 NOT STARTED
```

---

# Final Functional Principle

> **Atlas SDK functions expose certified intelligence; they do not manufacture intelligence.**

And:

> **Read, validate, normalize, resolve, expose — never reinterpret, execute or decide.**

---

**PHOENIX ATLAS SDK FUNCTION SPECIFICATION v1.0 — REVIEWED**