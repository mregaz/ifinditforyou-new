# PHOENIX FILESYSTEM FUNCTION SPECIFICATION
## Version 1.0

**Status:** Final

---

# 1. Purpose

This document defines the public function contracts of the Phoenix DevKit Filesystem module.

Implementation:

```text
core/filesystem.sh
```

The Filesystem provides deterministic and minimal filesystem operations for Phoenix DevKit components.

This specification documents the behavior of the already certified implementation.

---

# 2. Public API

Filesystem v1.0 exposes exactly ten public functions:

```text
phoenix::path_exists
phoenix::is_file
phoenix::is_directory
phoenix::create_directory
phoenix::remove_directory
phoenix::copy_file
phoenix::move_file
phoenix::remove_file
phoenix::read_file
phoenix::write_file
```

---

# 3. General Contract

Filesystem functions operate on explicit caller-provided paths.

General principles:

- paths are explicit;
- operations remain local to requested targets;
- predicate functions use return codes;
- mutation functions propagate operation success or failure;
- normal operations avoid unsolicited output;
- file content is treated as data;
- filesystem behavior remains close to native platform semantics.

---

# 4. Return Code Convention

Filesystem follows standard UNIX-compatible conventions:

```text
0     success / predicate true
non-0 failure / predicate false
```

Predicate functions are intended for natural shell control flow:

```bash
if phoenix::is_file "$path"; then
    ...
fi
```

---

# 5. phoenix::path_exists

## Purpose

Determines whether a filesystem path exists.

## Signature

```bash
phoenix::path_exists <path>
```

## Arguments

| Argument | Required | Description |
|---|---|---|
| `$1` | Yes | Filesystem path |

## Output

No normal stdout output.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | Path exists |
| `1` | Path does not exist or path argument is invalid |

## Side Effects

None.

The function is observational.

---

# 6. phoenix::is_file

## Purpose

Determines whether a path represents a regular file.

## Signature

```bash
phoenix::is_file <path>
```

## Arguments

| Argument | Required | Description |
|---|---|---|
| `$1` | Yes | Filesystem path |

## Output

No normal stdout output.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | Path is a regular file |
| `1` | Path is not a regular file |

A directory must return failure for this predicate.

## Side Effects

None.

---

# 7. phoenix::is_directory

## Purpose

Determines whether a path represents a directory.

## Signature

```bash
phoenix::is_directory <path>
```

## Arguments

| Argument | Required | Description |
|---|---|---|
| `$1` | Yes | Filesystem path |

## Output

No normal stdout output.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | Path is a directory |
| `1` | Path is not a directory |

A regular file must return failure for this predicate.

## Side Effects

None.

---

# 8. phoenix::create_directory

## Purpose

Creates a directory.

Missing parent directories are created automatically.

## Signature

```bash
phoenix::create_directory <directory_path>
```

## Arguments

| Argument | Required | Description |
|---|---|---|
| `$1` | Yes | Directory path |

## Output

No normal stdout output.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | Directory creation succeeded |
| non-0 | Directory creation failed |

## Behavior

The operation delegates directory creation to the platform.

Conceptually:

```text
directory path
     ↓
create directory tree
     ↓
success / failure
```

---

# 9. phoenix::remove_directory

## Purpose

Removes a directory recursively.

## Signature

```bash
phoenix::remove_directory <directory_path>
```

## Arguments

| Argument | Required | Description |
|---|---|---|
| `$1` | Yes | Directory path |

## Output

No normal stdout output.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | Directory removed or already absent |
| non-0 | Removal operation failed |

## Idempotency

The certified contract permits repeated cleanup.

Calling:

```bash
phoenix::remove_directory "$path"
phoenix::remove_directory "$path"
```

must not fail merely because the first call already removed the target.

---

# 10. phoenix::copy_file

## Purpose

Copies a source file to a destination.

## Signature

```bash
phoenix::copy_file <source_path> <destination_path>
```

## Arguments

| Argument | Required | Description |
|---|---|---|
| `$1` | Yes | Source file |
| `$2` | Yes | Destination path |

## Output

No normal stdout output.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | Copy succeeded |
| non-0 | Copy failed |

## Failure Conditions

Failures may include:

- missing source;
- invalid source;
- invalid destination;
- insufficient permissions;
- operating-system failure.

The function must not fabricate missing source content.

---

# 11. phoenix::move_file

## Purpose

Moves or renames a file.

## Signature

```bash
phoenix::move_file <source_path> <destination_path>
```

## Arguments

| Argument | Required | Description |
|---|---|---|
| `$1` | Yes | Source file |
| `$2` | Yes | Destination path |

## Output

No normal stdout output.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | Move succeeded |
| non-0 | Move failed |

## Behavior

The function delegates move/rename semantics to the operating system.

After successful movement, the source must no longer represent the original file at its previous location.

---

# 12. phoenix::remove_file

## Purpose

Removes a file.

## Signature

```bash
phoenix::remove_file <file_path>
```

## Arguments

| Argument | Required | Description |
|---|---|---|
| `$1` | Yes | File path |

## Output

No normal stdout output.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | File removed or already absent |
| non-0 | Removal operation failed |

## Idempotency

Repeated removal of an already missing file is permitted by the certified cleanup contract.

Example:

```bash
phoenix::remove_file "$path"
phoenix::remove_file "$path"
```

Both operations may succeed when the second call finds the target already absent.

---

# 13. phoenix::read_file

## Purpose

Reads the contents of a regular file.

## Signature

```bash
phoenix::read_file <file_path>
```

## Arguments

| Argument | Required | Description |
|---|---|---|
| `$1` | Yes | Source file |

## Output

On success:

```text
file content → stdout
```

No additional informational output should be mixed with file content.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | File read succeeded |
| non-0 | File could not be read |

## Failure Conditions

Examples include:

- missing file;
- invalid source;
- unreadable file;
- operating-system error.

## Side Effects

The source file must not be modified.

---

# 14. phoenix::write_file

## Purpose

Writes explicit content to an explicit destination file.

## Signature

```bash
phoenix::write_file <destination_path> <content>
```

## Arguments

| Argument | Required | Description |
|---|---|---|
| `$1` | Yes | Destination path |
| `$2` | Yes | Content to write |

## Output

No normal stdout output.

## Return Codes

| Code | Meaning |
|---|---|
| `0` | Write succeeded |
| non-0 | Write failed |

## Behavior

The supplied content is treated as data.

The function writes only to the explicitly requested destination.

It does not implicitly create unrelated artifacts.

---

# 15. Output Contract

The public Filesystem API follows this output model:

| Function | Normal stdout |
|---|---|
| `phoenix::path_exists` | none |
| `phoenix::is_file` | none |
| `phoenix::is_directory` | none |
| `phoenix::create_directory` | none |
| `phoenix::remove_directory` | none |
| `phoenix::copy_file` | none |
| `phoenix::move_file` | none |
| `phoenix::remove_file` | none |
| `phoenix::read_file` | file content |
| `phoenix::write_file` | none |

This contract allows safe use of:

```bash
content="$(phoenix::read_file "$path")"
```

without unrelated stdout contamination.

---

# 16. Path Contract

All paths are supplied explicitly by the caller.

Filesystem v1.0 does not implicitly determine:

- repository root;
- workspace root;
- project root;
- user home directory;
- temporary directory;
- output directory.

Path discovery belongs to higher-level components.

---

# 17. Content Contract

File content is data.

`phoenix::read_file` retrieves data.

`phoenix::write_file` persists data.

Neither operation interprets file content as executable shell code.

---

# 18. Security Contract

Filesystem v1.0 must not evaluate file contents or caller-provided content through mechanisms such as:

```text
eval
bash -c
sh -c
```

Reading a file does not source it.

Writing a file does not execute it.

Filesystem operations remain filesystem operations.

---

# 19. State Contract

Filesystem maintains no hidden mutable application state.

Results depend only on:

```text
explicit arguments
+
current filesystem state
```

There is no internal:

- path cache;
- file registry;
- operation history;
- destination registry.

---

# 20. Cleanup Contract

Cleanup operations are intentionally suitable for repeated execution.

Certified behavior includes idempotent handling of already absent targets for:

```text
phoenix::remove_directory
phoenix::remove_file
```

This reduces redundant caller-side existence checks.

---

# 21. Error Handling Contract

Filesystem does not conceal normal platform failures.

Typical failures include:

```text
missing source
invalid path
permission failure
destination failure
filesystem resource failure
operating-system error
```

The caller receives a non-zero return code and decides how to respond.

Filesystem does not automatically terminate the caller.

---

# 22. Dependency Contract

Filesystem v1.0 remains a low-level Core module.

Its responsibilities should rely on standard shell and operating-system filesystem primitives.

The module must not require higher-level Phoenix services merely to perform basic filesystem operations.

---

# 23. Relationship with Template Engine

Template Engine may use:

```text
phoenix::read_file
phoenix::write_file
```

for file-based rendering.

Responsibility remains separated:

```text
Filesystem      → I/O
Template Engine → rendering
```

Filesystem must never perform placeholder interpretation.

---

# 24. Required Test Coverage

The Filesystem test suite must cover the certified public contract, including:

1. existing path detection;
2. missing path detection;
3. regular-file detection;
4. directory detection;
5. directory creation;
6. directory removal;
7. repeated directory removal;
8. file copying;
9. copy failure;
10. file moving;
11. move failure;
12. file removal;
13. repeated file removal;
14. file reading;
15. read failure;
16. file writing;
17. written content verification;
18. invalid path behavior;
19. correct return codes;
20. filesystem state after mutation.

Current suite:

```text
07_TESTS/unit/filesystem_test.sh
```

Certified result:

```text
Tests: 20
Passed: 20
Failed: 0
```

---

# 25. Public API Stability

The certified Filesystem v1.0 API is:

```text
phoenix::path_exists
phoenix::is_file
phoenix::is_directory
phoenix::create_directory
phoenix::remove_directory
phoenix::copy_file
phoenix::move_file
phoenix::remove_file
phoenix::read_file
phoenix::write_file
```

Breaking changes require:

- architecture review;
- Function Specification update;
- regression test update;
- API Reference update;
- appropriate version change.

---

# 26. Definition of Done

Filesystem documentation is complete when:

```text
Architecture            COMPLETE
Function Specification  COMPLETE
Implementation          CERTIFIED
Syntax Validation       PASS
Automated Tests         20/20 PASS
API Review              PASS
API Reference           COMPLETE
Certification           EXISTING
```

---

# 27. Document Status

| Item | Value |
|---|---|
| Document | PHOENIX_FILESYSTEM_FUNCTION_SPECIFICATION_v1.0 |
| Version | 1.0 |
| Status | Final |
| Module | core/filesystem.sh |
| Public API | 10 functions |
| Tests | 20/20 PASS |
| Certification | Existing Core Certification |
| Audit | Core Consolidation Audit |
