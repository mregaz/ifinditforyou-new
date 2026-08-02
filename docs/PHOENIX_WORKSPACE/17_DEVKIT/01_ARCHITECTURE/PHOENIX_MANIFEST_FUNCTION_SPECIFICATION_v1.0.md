# PHOENIX MANIFEST FUNCTION SPECIFICATION
## Version 1.0

**Status:** Specification

---

# 1. Purpose

This document defines the public function contracts of the Phoenix DevKit Manifest Module.

Architecture defines the responsibilities and boundaries of the module.

This specification defines exactly how callers interact with it.

Implementation must conform to this specification.

---

# 2. Module

Implementation file:

```text
core/manifest.sh
```

The module is read-only and operates on line-oriented `KEY=VALUE` manifest files.

---

# 3. Public API

Phoenix Manifest v1.0 exposes exactly three public functions:

```text
phoenix::manifest_exists
phoenix::manifest_get
phoenix::manifest_has
```

No additional public API is required for version 1.0.

---

# 4. phoenix::manifest_exists

## Purpose

Determines whether a manifest path references an existing regular file.

## Signature

```bash
phoenix::manifest_exists <manifest_path>
```

## Arguments

| Argument | Required | Description |
|---|---|---|
| `$1` | Yes | Path to the manifest file |

## Output

No stdout output.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | Manifest exists and is a regular file |
| `1` | Manifest is missing, path is invalid, or argument is empty |

## Examples

```bash
phoenix::manifest_exists "/tmp/phoenix.manifest"
```

```bash
if phoenix::manifest_exists "$manifest"; then
    printf '%s\n' "Manifest found"
fi
```

## Constraints

The function must not modify the filesystem.

---

# 5. phoenix::manifest_get

## Purpose

Retrieves the value associated with a manifest key.

## Signature

```bash
phoenix::manifest_get <manifest_path> <key>
```

## Arguments

| Argument | Required | Description |
|---|---|---|
| `$1` | Yes | Path to the manifest |
| `$2` | Yes | Key to retrieve |

## Output

On success, the value is written to stdout.

No additional text is written to stdout.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | Key found and value returned |
| `1` | Manifest unavailable, key invalid, or key not found |

## Parsing Contract

For every manifest line:

1. blank lines are ignored;
2. lines whose first non-whitespace character is `#` are ignored;
3. lines without `=` are ignored;
4. the first `=` separates key and value;
5. surrounding whitespace is removed from the parsed key;
6. surrounding whitespace is removed from the parsed value;
7. entries with an empty parsed key are ignored;
8. key comparison is exact and case-sensitive;
9. the first matching valid key wins;
10. additional `=` characters remain part of the value.

## Example Manifest

```text
name=phoenix-example
version = 1.0.0
description = Phoenix DevKit Example
endpoint=https://example.test/?a=1&b=2
```

Example:

```bash
phoenix::manifest_get "/tmp/phoenix.manifest" "version"
```

Output:

```text
1.0.0
```

Example:

```bash
phoenix::manifest_get "/tmp/phoenix.manifest" "endpoint"
```

Output:

```text
https://example.test/?a=1&b=2
```

## Security Contract

Manifest values are data.

The function must never execute, evaluate, interpolate, or source manifest content.

The implementation must not use manifest data with:

```text
eval
source
```

---

# 6. phoenix::manifest_has

## Purpose

Determines whether a valid manifest key exists.

## Signature

```bash
phoenix::manifest_has <manifest_path> <key>
```

## Arguments

| Argument | Required | Description |
|---|---|---|
| `$1` | Yes | Path to the manifest |
| `$2` | Yes | Key to test |

## Output

No stdout output.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | Key exists |
| `1` | Manifest unavailable, key invalid, or key does not exist |

## Matching Rules

`manifest_has` follows exactly the same parsing and key-matching rules as `manifest_get`.

A key with an empty value still exists.

Example manifest:

```text
description=
```

Then:

```bash
phoenix::manifest_has "$manifest" "description"
```

returns:

```text
0
```

while:

```bash
phoenix::manifest_get "$manifest" "description"
```

returns success and writes an empty value to stdout.

---

# 7. Key Rules

Manifest keys are treated as opaque strings after surrounding whitespace is removed.

Version 1.0 does not introduce a complex key grammar.

The following rules apply:

- an empty key is invalid;
- comparison is case-sensitive;
- surrounding whitespace is ignored;
- internal key characters are preserved;
- duplicate valid keys are resolved using first-match-wins behavior.

Example:

```text
name=first
name=second
```

Querying `name` returns:

```text
first
```

---

# 8. Value Rules

Values:

- may be empty;
- may contain spaces;
- may contain additional `=` characters;
- are trimmed only at the outer boundaries;
- are returned as data;
- are never executed.

Example:

```text
command=$(touch /tmp/phoenix-danger)
```

Retrieving `command` must return the literal value:

```text
$(touch /tmp/phoenix-danger)
```

and must not create or modify `/tmp/phoenix-danger`.

---

# 9. Invalid Lines

The following lines are ignored:

```text

# comment
    # indented comment
this line has no separator
=value-with-empty-key
    = another-empty-key
```

Ignoring malformed lines must not prevent subsequent valid entries from being queried.

---

# 10. Side Effects

All three public functions are read-only.

They must not:

- modify manifest files;
- create files;
- remove files;
- change environment variables;
- change the current directory;
- execute manifest values;
- mutate persistent global state.

---

# 11. Dependencies

The implementation may use certified Phoenix Core modules where appropriate:

```text
core/filesystem.sh
core/strings.sh
```

The implementation should not duplicate existing Core functionality without justification.

---

# 12. Required Automated Tests

The test suite must verify at minimum:

1. `manifest_exists` succeeds for an existing regular file;
2. `manifest_exists` fails for a missing path;
3. `manifest_exists` fails for a directory;
4. `manifest_exists` fails for an empty argument;
5. `manifest_get` retrieves an existing value;
6. `manifest_get` fails for a missing key;
7. `manifest_get` handles surrounding whitespace;
8. `manifest_get` ignores comments;
9. `manifest_get` ignores blank lines;
10. `manifest_get` preserves additional `=` characters;
11. `manifest_get` ignores empty keys;
12. duplicate keys use first-match-wins;
13. key matching is case-sensitive;
14. an empty value is retrieved successfully;
15. `manifest_has` succeeds for an existing key;
16. `manifest_has` fails for a missing key;
17. `manifest_has` succeeds for a key with an empty value;
18. malformed lines do not prevent later valid lookup;
19. shell-like manifest values are returned literally;
20. shell-like manifest values are never executed.

---

# 13. Public API Stability

After certification, these function names and contracts form the Manifest v1.0 public API.

Breaking changes require:

- architectural review;
- specification update;
- test update;
- API Reference update;
- appropriate version change.

---

# 14. Definition of Done

```text
Architecture          COMPLETE
Function Specification COMPLETE
Implementation        PENDING
Syntax Validation     PENDING
Automated Tests       PENDING
Security Tests        PENDING
API Review            PENDING
API Reference         PENDING
Certification         PENDING
```
