# PHOENIX FILESYSTEM MODULE ARCHITECTURE
## Version 1.0

**Status:** Final

---

# 1. Purpose

This document defines the architecture of the Phoenix DevKit Filesystem module.

Implementation:

```text
core/filesystem.sh
```

The Filesystem module provides a minimal, deterministic abstraction over common filesystem operations required by Phoenix DevKit components.

It intentionally remains close to native operating-system behavior.

---

# 2. Architectural Role

The Filesystem belongs to the Phoenix DevKit Core service layer.

Conceptually:

```text
Phoenix DevKit Components
          │
          ▼
      Filesystem
          │
          ▼
Operating System Filesystem
```

The module provides a stable Phoenix API while delegating actual filesystem operations to established platform primitives.

---

# 3. Design Principles

Filesystem v1.0 follows the Phoenix DevKit Engineering Principles.

Its design emphasizes:

- simplicity;
- deterministic behavior;
- explicit paths;
- UNIX-compatible return codes;
- minimal abstraction;
- no hidden state;
- no unsolicited output;
- platform-native operations;
- predictable failure propagation;
- Trust the Platform.

The module must not attempt to reproduce functionality already provided reliably by the operating system.

---

# 4. Responsibilities

Filesystem v1.0 provides four categories of operations:

```text
Path Inspection
Directory Operations
File Operations
File Content Operations
```

The certified public API contains ten functions:

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

# 5. Non-Responsibilities

Filesystem v1.0 does not provide:

- virtual filesystems;
- filesystem caching;
- transactional filesystem operations;
- automatic backup;
- automatic rollback;
- file locking;
- remote filesystem access;
- archive management;
- permission management;
- ownership management;
- filesystem watching;
- recursive search;
- implicit path discovery.

These concerns require separate architectural decisions if needed later.

---

# 6. Module Structure

The Filesystem follows the standard Phoenix Core module structure:

```text
Header
  ↓
Load Guard
  ↓
Readonly Constants
  ↓
Private Functions
  ↓
Public API
```

Only functionality required by the certified public API should exist in the module.

---

# 7. Load Guard

The Filesystem uses a module load guard to prevent unnecessary repeated initialization.

Repeated sourcing must remain safe and predictable.

The load guard represents module initialization state only.

It must not become application state.

---

# 8. Dependency Model

Filesystem v1.0 is designed as a low-level Core service.

Conceptually:

```text
filesystem.sh
      │
      ▼
Operating System
```

Its behavior should rely on standard shell and operating-system filesystem primitives rather than higher-level Phoenix modules.

This keeps the dependency graph simple and reduces the risk of circular dependencies.

---

# 9. Public API

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

These functions constitute the certified Filesystem public contract.

---

# 10. Path Inspection API

The path inspection layer contains:

```text
phoenix::path_exists
phoenix::is_file
phoenix::is_directory
```

These functions are predicates.

They communicate their primary result through UNIX-compatible return codes.

Conceptually:

```text
Path
 │
 ▼
Inspection
 │
 ├── exists?
 ├── regular file?
 └── directory?
```

Normal predicate checks should not produce unsolicited output.

---

# 11. phoenix::path_exists

Architectural responsibility:

```text
determine whether a filesystem path exists
```

The function does not distinguish between file and directory when determining existence.

More specific classification belongs to:

```text
phoenix::is_file
phoenix::is_directory
```

---

# 12. phoenix::is_file

Architectural responsibility:

```text
determine whether a path represents a regular file
```

A directory must not be reported as a regular file.

The function is observational and must not modify the filesystem.

---

# 13. phoenix::is_directory

Architectural responsibility:

```text
determine whether a path represents a directory
```

A regular file must not be reported as a directory.

The function is observational and must not modify the filesystem.

---

# 14. Directory Operations

Filesystem v1.0 provides:

```text
phoenix::create_directory
phoenix::remove_directory
```

These functions intentionally expose simple directory lifecycle operations.

---

# 15. phoenix::create_directory

Architectural responsibility:

```text
create the requested directory
```

Missing parent directories may be created as part of the operation.

Conceptually:

```text
Requested Path
      │
      ▼
Directory Creation
      │
      ▼
Requested Directory Exists
```

The operation should delegate to the operating system rather than implementing custom directory-tree logic.

---

# 16. phoenix::remove_directory

Architectural responsibility:

```text
remove a directory recursively
```

The certified behavior is idempotent for an already missing target.

Conceptually:

```text
Directory Exists?
      │
   ┌──┴──┐
  Yes    No
   │      │
Remove  Success
   │      │
   └──┬───┘
      ▼
   Success
```

This allows cleanup operations to remain predictable.

---

# 17. File Operations

Filesystem v1.0 provides:

```text
phoenix::copy_file
phoenix::move_file
phoenix::remove_file
```

These functions delegate core file lifecycle behavior to operating-system primitives.

---

# 18. phoenix::copy_file

Architectural responsibility:

```text
copy a source file to a destination
```

The operation requires an appropriate source file and destination path.

Filesystem errors must propagate as operation failures.

The module must not silently fabricate missing source content.

---

# 19. phoenix::move_file

Architectural responsibility:

```text
move or rename a file
```

The operation delegates move semantics to the platform.

It does not maintain an internal representation of file location.

---

# 20. phoenix::remove_file

Architectural responsibility:

```text
remove a file
```

Cleanup semantics are intentionally predictable.

Removal of an already missing target is treated according to the certified module contract rather than introducing unnecessary caller-side existence checks.

---

# 21. File Content Operations

Filesystem v1.0 provides:

```text
phoenix::read_file
phoenix::write_file
```

These functions form the basic content I/O layer used by higher-level components.

For example:

```text
Template Engine
      │
      ▼
Filesystem
      │
      ▼
Template / Destination Files
```

---

# 22. phoenix::read_file

Architectural responsibility:

```text
read file contents
```

On success, file content is emitted through stdout.

The function must not modify the source file.

A missing or invalid source must produce failure rather than fabricated content.

---

# 23. phoenix::write_file

Architectural responsibility:

```text
write explicit content to an explicit destination file
```

The caller supplies:

```text
destination path
content
```

The function performs the requested write and reports success or failure through the standard shell return-code mechanism.

It must not write unrelated files.

---

# 24. Return Code Policy

Filesystem follows standard UNIX-compatible conventions:

```text
0     success / predicate true
non-0 failure / predicate false
```

Predicate APIs use return codes naturally:

```bash
if phoenix::is_file "$path"; then
    ...
fi
```

Mutation APIs also propagate operation success or failure through return codes.

---

# 25. Output Contract

Filesystem functions avoid unsolicited output.

Predicate operations:

```text
no normal stdout
```

Mutation operations:

```text
no normal stdout
```

Content read operation:

```text
phoenix::read_file → stdout
```

Errors are represented primarily through return codes and native operation failure behavior.

This makes the Filesystem suitable for composition in scripts and command substitutions.

---

# 26. State Model

Filesystem v1.0 maintains no hidden application state.

Each operation acts on:

```text
explicit caller input
+
current filesystem state
```

There is no:

- internal file registry;
- path cache;
- operation history;
- implicit current project path;
- hidden destination state.

---

# 27. Path Model

Filesystem paths are explicit caller inputs.

The module must not silently infer project paths or redirect operations to unrelated locations.

This preserves local reasoning:

```text
input path
    ↓
operation
    ↓
that path
```

Higher-level path discovery belongs to higher-level DevKit components.

---

# 28. Error Handling

Filesystem failures should remain:

- explicit;
- predictable;
- observable;
- local to the requested operation.

Typical failure causes include:

```text
missing source
invalid path
insufficient permissions
destination conflict
invalid parent path
operating-system error
```

The module should not conceal these failures through speculative recovery.

---

# 29. Trust the Platform

Filesystem v1.0 follows the principle:

```text
Trust the Platform
```

Where established operating-system primitives already provide correct behavior, Phoenix should delegate rather than reproduce them.

This reduces:

- implementation complexity;
- maintenance burden;
- behavioral divergence;
- platform surprises.

The Phoenix abstraction exists to stabilize the API, not to replace the filesystem.

---

# 30. Idempotent Cleanup

Cleanup operations should be safe when repeated where defined by the certified contract.

Examples validated by the Filesystem certification suite include repeated removal behavior for already missing targets.

This supports reliable cleanup sequences such as:

```text
cleanup
cleanup again
```

without requiring every caller to perform redundant existence checks.

---

# 31. Security Model

Filesystem operates only on explicit paths and content supplied by callers.

Filesystem v1.0 must not interpret file content as executable shell code.

Reading content means:

```text
data retrieval
```

not:

```text
execution
```

Writing content means:

```text
data persistence
```

not:

```text
execution
```

The module does not require:

```text
eval
bash -c
sh -c
```

for its public responsibilities.

---

# 32. Side Effects

Filesystem side effects are explicit and operation-specific.

Observational functions:

```text
path_exists
is_file
is_directory
read_file
```

do not intentionally modify filesystem state.

Mutation functions:

```text
create_directory
remove_directory
copy_file
move_file
remove_file
write_file
```

modify only filesystem targets explicitly involved in the requested operation.

---

# 33. Relationship with Template Engine

The Template Engine depends on Filesystem services for file-based rendering.

Conceptually:

```text
Template Engine
      │
      ├── read_file
      │
      └── write_file
              │
              ▼
          Filesystem
```

The responsibility boundary remains strict:

```text
Template Engine → rendering semantics
Filesystem      → filesystem I/O
```

Filesystem must not acquire template-processing logic.

---

# 34. Relationship with Other Core Modules

Filesystem responsibilities remain distinct from:

```text
Runtime          → execution environment
Logger           → message emission
Strings          → text manipulation
Manifest         → metadata access
Template Engine  → template rendering
```

Cross-module responsibility leakage should be rejected during review.

---

# 35. Testing Architecture

Filesystem has a dedicated unit test suite:

```text
07_TESTS/unit/filesystem_test.sh
```

Certified result:

```text
Tests: 20
Passed: 20
Failed: 0
```

Testing covers the public API and important filesystem edge cases.

---

# 36. Certification Coverage

The certification suite validates behaviors including:

- existing path detection;
- missing path detection;
- regular-file detection;
- directory detection;
- directory creation;
- directory removal;
- repeated cleanup;
- file copying;
- file moving;
- file removal;
- file reading;
- file writing;
- expected failures for invalid operations.

The implementation must remain aligned with this certified behavior.

---

# 37. Extension Rules

Before adding Filesystem functionality, determine whether it belongs to this low-level abstraction.

Potential additions such as:

```text
recursive traversal
permissions
file metadata
temporary files
locking
watching
archive handling
```

require explicit architectural review.

The Filesystem must not become a generic operating-system utility collection.

---

# 38. Public API Stability

The certified Filesystem v1.0 public API consists of:

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
- automated test update;
- API Reference update;
- version change where appropriate.

---

# 39. Architectural Constraints

Filesystem v1.0 must remain:

```text
Minimal
Explicit
Stateless
Deterministic
Platform-native
Non-evaluating
Predictable
```

The module provides filesystem primitives, not application policy.

---

# 40. Architecture Status

```text
Module:          core/filesystem.sh
Architecture:    COMPLETE
Implementation:  CERTIFIED
Public API:      10 functions
Automated Tests: 20/20 PASS
API Reference:   COMPLETE
Security Model:  DEFINED
Status:          FINAL
```

---

# 41. Document Status

| Item | Value |
|---|---|
| Document | PHOENIX_FILESYSTEM_MODULE_ARCHITECTURE_v1.0 |
| Version | 1.0 |
| Status | Final |
| Module | core/filesystem.sh |
| Public API | 10 functions |
| Tests | 20/20 PASS |
| Certification | Existing Core Certification |
| Audit | Core Consolidation Audit |
