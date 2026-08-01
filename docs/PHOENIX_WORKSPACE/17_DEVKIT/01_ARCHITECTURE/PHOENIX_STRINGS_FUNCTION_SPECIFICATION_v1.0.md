# Phoenix Strings Function Specification

**Version:** 1.0  
**Module:** `core/strings.sh`  
**Status:** Draft  
**Sprint:** 002

---

# Purpose

This document defines the behavioral contract of every public function exposed by the Phoenix Strings module.

It specifies:

- function purpose;
- input parameters;
- output behavior;
- return codes;
- dependencies;
- side effects;
- edge cases;
- required test scenarios.

The specification must be completed before implementation begins.

---

# Specification Rules

Each public function must:

- have one clearly defined responsibility;
- receive input through positional parameters;
- return transformed values through standard output;
- use UNIX exit codes for validation results;
- avoid global state;
- avoid filesystem side effects;
- remain deterministic;
- have explicit edge-case coverage.

Implementation details are intentionally excluded from this document.

The specification defines what each function must do, not how it must be implemented.
---

# Function Specifications

## phoenix::trim

### Purpose

Removes leading and trailing whitespace from a string.

---

### Signature

```text
phoenix::trim <string>
```

---

### Input

| Parameter | Description |
|----------|-------------|
| string | Input string to trim. |

---

### Output

Returns the input string with leading and trailing whitespace removed.

The output is written to standard output.

---

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Operation completed successfully. |

---

### Dependencies

None.

---

### Side Effects

None.

The function:

- does not modify global variables;
- does not write files;
- does not print debug information.

---

### Deterministic

**Yes**

The same input always produces the same output.

---

### Edge Cases

The implementation must correctly handle:

- empty string;
- string containing only spaces;
- string containing tabs;
- string containing mixed whitespace;
- already trimmed string;
- string without whitespace.

---

### Required Test Cases

- Empty string
- Spaces only
- Tabs only
- Mixed whitespace
- Leading whitespace
- Trailing whitespace
- Leading and trailing whitespace
- Already trimmed
- No whitespace
---

# Search API Family

The Search API provides deterministic string comparison functions.

These functions do not modify the input string.

They answer a single question and return their result using UNIX exit codes.

## Common Characteristics

### Input

All Search API functions receive:

- a source string;
- a comparison string.

### Output

No textual output is produced.

The result is expressed exclusively through the function exit code.

### Return Codes

| Code | Meaning |
|------|---------|
| 0 | Condition satisfied |
| 1 | Condition not satisfied |

### Side Effects

None.

The functions:

- do not modify global variables;
- do not write files;
- do not produce logging output.

### Deterministic

Yes.

The same inputs always produce the same result.