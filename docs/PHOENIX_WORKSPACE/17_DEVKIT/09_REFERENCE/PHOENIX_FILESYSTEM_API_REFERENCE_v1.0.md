# Phoenix DevKit — Filesystem API Reference

## Version 1.0

---

## 1. Purpose

The Filesystem module provides a small, predictable and reusable API for common filesystem operations required by the Phoenix DevKit.

The module follows the Phoenix DevKit engineering principles:

- Simplicity First
- Single Responsibility
- Predictable APIs
- UNIX-compatible return codes
- Trust the Platform
- No unsolicited output

The module is implemented in:

```text
core/filesystem.sh
```

# 2. Usage

Load the module before calling its functions:

```bash
source core/filesystem.sh
```

All public functions are exposed through the Phoenix namespace:

```text
phoenix::
```

Example:

```bash
source core/filesystem.sh

phoenix::create_directory "/tmp/example"
```

---

# 3. Return Codes

All filesystem functions follow standard UNIX conventions.

| Return Code | Meaning |
|-------------|---------|
| `0` | Operation completed successfully |
| `1` | Operation failed |

The module does not redefine or translate operating-system return codes.

Instead, it relies on the underlying platform command whenever possible.
---

# 4. Detection API

The Detection API provides functions that inspect the filesystem without modifying it.

These functions are safe to call at any time and never change the state of the filesystem.

---

## 4.1 `phoenix::path_exists`

Checks whether a filesystem path exists.

### Signature

```bash
phoenix::path_exists PATH
```

### Arguments

| Argument | Description |
|----------|-------------|
| `$1` | File or directory path |

### Returns

| Code | Meaning |
|------|---------|
| `0` | Path exists |
| `1` | Path does not exist |

### Example

```bash
if phoenix::path_exists "/tmp/example"; then
    printf "Path exists\n"
fi
```

---

## 4.2 `phoenix::is_file`

Checks whether a path is a regular file.

### Signature

```bash
phoenix::is_file FILE
```

### Arguments

| Argument | Description |
|----------|-------------|
| `$1` | File path |

### Returns

| Code | Meaning |
|------|---------|
| `0` | Path is a regular file |
| `1` | Path is not a regular file |

### Example

```bash
if phoenix::is_file "/tmp/example.txt"; then
    printf "Regular file\n"
fi
```

---

## 4.3 `phoenix::is_directory`

Checks whether a path is a directory.

### Signature

```bash
phoenix::is_directory DIRECTORY
```

### Arguments

| Argument | Description |
|----------|-------------|
| `$1` | Directory path |

### Returns

| Code | Meaning |
|------|---------|
| `0` | Path is a directory |
| `1` | Path is not a directory |

### Example

```bash
if phoenix::is_directory "/tmp/example"; then
    printf "Directory exists\n"
fi
```

# 5. Directory API

The Directory API provides functions that create and remove directories.

These functions operate directly on the filesystem while following the UNIX philosophy of delegating the actual work to the operating system.

---

## 5.1 `phoenix::create_directory`

Creates a directory.

Missing parent directories are created automatically.

### Signature

```bash
phoenix::create_directory DIRECTORY
```

### Arguments

| Argument | Description |
|----------|-------------|
| `$1` | Directory path |

### Returns

| Code | Meaning |
|------|---------|
| `0` | Directory created successfully |
| `1` | Directory creation failed |

### Example

```bash
phoenix::create_directory "/tmp/phoenix/example"
```

### Notes

- Existing directories do not generate an error.
- Parent directories are created automatically.

---

## 5.2 `phoenix::remove_directory`

Removes a directory recursively.

### Signature

```bash
phoenix::remove_directory DIRECTORY
```

### Arguments

| Argument | Description |
|----------|-------------|
| `$1` | Directory path |

### Returns

| Code | Meaning |
|------|---------|
| `0` | Directory removed successfully |
| `1` | Directory removal failed |

### Example

```bash
phoenix::remove_directory "/tmp/phoenix/example"
```

### Warning

This operation permanently removes the target directory and all of its contents.``
---

# 6. File API

The File API provides functions for common file operations.

These functions delegate the actual work to the operating system while exposing a simple and predictable interface.

---

## 6.1 `phoenix::copy_file`

Copies a file.

### Signature

```bash
phoenix::copy_file SOURCE DESTINATION
```

### Arguments

| Argument | Description |
|----------|-------------|
| `$1` | Source file |
| `$2` | Destination file |

### Returns

| Code | Meaning |
|------|---------|
| `0` | File copied successfully |
| `1` | Copy failed |

---

## 6.2 `phoenix::move_file`

Moves or renames a file.

### Signature

```bash
phoenix::move_file SOURCE DESTINATION
```

### Arguments

| Argument | Description |
|----------|-------------|
| `$1` | Source file |
| `$2` | Destination file |

### Returns

| Code | Meaning |
|------|---------|
| `0` | File moved successfully |
| `1` | Move failed |

---

## 6.3 `phoenix::remove_file`

Removes a file.

### Signature

```bash
phoenix::remove_file FILE
```

### Arguments

| Argument | Description |
|----------|-------------|
| `$1` | File path |

### Returns

| Code | Meaning |
|------|---------|
| `0` | File removed successfully |
| `1` | Remove failed |

---

## 6.4 `phoenix::read_file`

Reads the complete contents of a file.

### Signature

```bash
phoenix::read_file FILE
```

### Arguments

| Argument | Description |
|----------|-------------|
| `$1` | File path |

### Output

The complete file contents are written to standard output.

### Returns

| Code | Meaning |
|------|---------|
| `0` | File read successfully |
| `1` | Read failed |

---

## 6.5 `phoenix::write_file`

Writes content to a file.

### Signature

```bash
phoenix::write_file FILE CONTENT
```

### Arguments

| Argument | Description |
|----------|-------------|
| `$1` | File path |
| `$2` | Content |

### Behavior

- Creates the file if it does not exist.
- Replaces existing contents.
- Does not append.
- Does not automatically add a newline.

### Returns

| Code | Meaning |
|------|---------|
| `0` | Write completed successfully |
| `1` | Write failed |
---

## Error Handling

The Filesystem API follows standard UNIX command behavior.

Filesystem functions do not implement custom error messages or internal exception handling.

Each public function delegates execution to the underlying operating system command and returns its exit status.

### Error Sources

Typical failures may include:

- missing source files;
- invalid file or directory paths;
- insufficient permissions;
- destination conflicts;
- unavailable filesystem resources;
- operating system errors.

### Return Behavior

A successful operation returns:

```text
0
```

## Design Constraints

The Filesystem module intentionally provides a minimal abstraction over the operating system.

### Design Goals

- predictable behavior;
- minimal implementation;
- no hidden logic;
- platform-native execution;
- reusable API;
- low maintenance cost.

### Non Goals

The module intentionally does **not** provide:

- file synchronization;
- recursive copy logic beyond native commands;
- progress reporting;
- permission management;
- path normalization;
- logging;
- exception handling.

These responsibilities belong to higher-level components of the Phoenix DevKit.

### Engineering Principles

The module follows the official Phoenix DevKit Engineering Principles:

- Simplicity First
- Single Responsibility
- Trust the Platform
- Predictability over Cleverness
- Composition over Complexity
- Explicit is Better than Implicit
---

## Certification

### Module Status

**CERTIFIED**

### Certification Checklist

| Item | Status |
|------|:------:|
| Architecture Approved | ✅ |
| Implementation Complete | ✅ |
| Syntax Check | ✅ |
| Manual Tests | ✅ |
| Automated Tests | ✅ |
| Code Review | ✅ |
| API Reference | ✅ |

### Test Results

```text
Tests Executed : 20
Tests Passed   : 20
Tests Failed   : 0
```


---

## Module Inventory

### Public API

| Function | Description |
|----------|-------------|
| phoenix::path_exists | Checks whether a filesystem path exists. |
| phoenix::is_file | Checks whether a path is a regular file. |
| phoenix::is_directory | Checks whether a path is a directory. |
| phoenix::create_directory | Creates a directory. |
| phoenix::remove_directory | Removes a directory recursively. |
| phoenix::copy_file | Copies a file. |
| phoenix::move_file | Moves or renames a file. |
| phoenix::remove_file | Deletes a file. |
| phoenix::read_file | Reads the contents of a file. |
| phoenix::write_file | Writes content to a file. |

### Module Characteristics

- Stateless
- Deterministic
- Platform-native
- Production-ready

---

## Document Status

| Item | Value |
|------|-------|
| Document | PHOENIX_FILESYSTEM_API_REFERENCE_v1.0 |
| Version | 1.0 |
| Status | Final |
| Module | core/filesystem.sh |
| Certification | Approved |
| Last Updated | Sprint 001 |
