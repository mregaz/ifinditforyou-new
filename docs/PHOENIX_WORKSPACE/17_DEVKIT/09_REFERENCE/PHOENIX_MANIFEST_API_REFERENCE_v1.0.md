# PHOENIX MANIFEST API REFERENCE
## Version 1.0

**Status:** Stable Candidate

---

# 1. Purpose

This document defines the public API of the Phoenix DevKit Manifest Module.

The module provides deterministic, read-only access to line-oriented Phoenix manifest metadata.

Implementation:

```text
core/manifest.sh
```

---

# 2. Module Characteristics

The Manifest Module is:

- read-only;
- deterministic;
- side-effect free;
- case-sensitive for keys;
- non-evaluating;
- safe against execution of manifest content.

Manifest data is always treated as data.

---

# 3. Manifest Format

Phoenix Manifest v1.0 uses:

```text
KEY=VALUE
```

Example:

```text
name=phoenix-example
version=1.0.0
description=Example generator
```

The first `=` separates the key from the value.

Additional `=` characters remain part of the value.

---

# 4. Public API

Phoenix Manifest v1.0 exposes exactly three public functions:

```text
phoenix::manifest_exists
phoenix::manifest_get
phoenix::manifest_has
```

---

# 5. phoenix::manifest_exists

## Purpose

Checks whether a manifest path points to an existing regular file.

## Signature

```bash
phoenix::manifest_exists <manifest_path>
```

## Arguments

| Argument | Description |
|---|---|
| `$1` | Manifest path |

## Output

No stdout output.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | Manifest exists and is a regular file |
| `1` | Manifest missing, invalid, directory, or empty argument |

---

# 6. phoenix::manifest_get

## Purpose

Retrieves the value associated with a manifest key.

## Signature

```bash
phoenix::manifest_get <manifest_path> <key>
```

## Arguments

| Argument | Description |
|---|---|
| `$1` | Manifest path |
| `$2` | Key |

## Output

On success, the value is written to stdout.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | Key found |
| `1` | Manifest unavailable, invalid key, or key missing |

## Parsing Rules

The function:

1. reads the manifest line by line;
2. ignores blank lines;
3. ignores comments whose first non-whitespace character is `#`;
4. ignores lines without `=`;
5. uses the first `=` as separator;
6. trims surrounding whitespace from keys and values;
7. ignores empty keys;
8. matches keys exactly and case-sensitively;
9. returns the first matching valid key;
10. preserves additional `=` characters in the value.

## Example

Manifest:

```text
version = 1.0.0
endpoint=https://example.test/?a=1&b=2
```

Query:

```bash
phoenix::manifest_get "/tmp/example.manifest" "version"
```

Output:

```text
1.0.0
```

---

# 7. phoenix::manifest_has

## Purpose

Checks whether a valid key exists in a manifest.

## Signature

```bash
phoenix::manifest_has <manifest_path> <key>
```

## Arguments

| Argument | Description |
|---|---|
| `$1` | Manifest path |
| `$2` | Key |

## Output

No stdout output.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | Key exists |
| `1` | Manifest unavailable, invalid key, or key missing |

A key with an empty value still exists.

Example:

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

---

# 8. Duplicate Keys

Duplicate valid keys use:

```text
FIRST MATCH WINS
```

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

# 9. Empty Values

Empty values are valid.

Example:

```text
description=
```

`phoenix::manifest_get` returns success and writes an empty value.

---

# 10. Security Contract

Manifest content is never executed.

The module does not use manifest files or manifest values with:

```text
eval
source
```

Example manifest value:

```text
danger=$(touch /tmp/phoenix-danger)
```

Retrieving `danger` returns literally:

```text
$(touch /tmp/phoenix-danger)
```

No command is executed.

---

# 11. Side Effects

The module does not:

- modify manifests;
- create files;
- remove files;
- mutate caller state;
- change directories;
- execute manifest content;
- access the network.

---

# 12. Dependencies

The module uses certified Core services:

```text
core/filesystem.sh
core/strings.sh
```

---

# 13. Public API Summary

| Function | Type | Result Mechanism |
|---|---|---|
| `phoenix::manifest_exists` | Predicate | exit code |
| `phoenix::manifest_get` | Retrieval | stdout + exit code |
| `phoenix::manifest_has` | Predicate | exit code |

---

# 14. Testing Status

Automated test suite:

```text
07_TESTS/unit/manifest_test.sh
```

Validated result:

```text
Tests: 23
Passed: 23
Failed: 0
```

Security tests confirm that shell-like manifest values remain inert.

---

# 15. Stability Policy

After certification, the documented Manifest v1.0 API becomes stable.

Breaking changes require:

- architecture review;
- specification update;
- regression test update;
- API Reference update;
- version change where appropriate.

---

# 16. Certification State

```text
Architecture:        COMPLETE
Specification:       COMPLETE
Implementation:      COMPLETE
Syntax Validation:   PASS
Manual Testing:      PASS
Automated Testing:   23/23 PASS
Security Testing:    PASS
Code Review:         PASS
API Reference:       COMPLETE
Final Certification: CERTIFIED
```
