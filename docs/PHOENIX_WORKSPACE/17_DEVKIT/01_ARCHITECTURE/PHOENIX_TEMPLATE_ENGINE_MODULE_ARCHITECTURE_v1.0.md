# PHOENIX TEMPLATE ENGINE MODULE ARCHITECTURE
## Version 1.0

**Status:** Architecture Definition

---

# 1. Purpose

The Template Engine provides the Phoenix DevKit with a small, deterministic mechanism for rendering text templates using explicit variable substitution.

Its primary responsibility is to transform:

```text
Template + Variables
```

into:

```text
Rendered Output
```

without executing template content or introducing hidden behavior.

The Template Engine is a foundational service for future Phoenix generators.

---

# 2. Architectural Role

The Template Engine belongs to the Phoenix DevKit Core infrastructure layer.

```text
Phoenix DevKit
│
├── Core
│   ├── Runtime
│   ├── Logger
│   ├── Filesystem
│   ├── Strings
│   └── Manifest
│
├── Template Engine
├── Generators
├── Validators
├── CLI
└── Plugins
```

The Template Engine consumes certified Core services and provides rendering capabilities to higher-level components.

It must remain independent from Generators, CLI, Plugins, and business-specific logic.

---

# 3. Primary Responsibility

The Template Engine has one responsibility:

> Replace explicitly defined placeholders in template content with explicitly supplied values.

It may:

- identify valid placeholders;
- replace placeholders with values;
- detect unresolved placeholders;
- render template content;
- render a template file into an output file.

---

# 4. Non-Responsibilities

The Template Engine must not:

- execute shell code;
- evaluate expressions;
- interpret programming logic;
- provide loops;
- provide conditionals;
- access environment variables implicitly;
- fetch network resources;
- load plugins;
- infer missing values;
- generate business-specific content;
- modify source templates.

Phoenix Template Engine v1.0 is intentionally not a programming language.

---

# 5. Design Principles

## Simplicity First

The rendering model must remain understandable without a complex parser.

## Explicit Inputs

Only values explicitly supplied by the caller may participate in rendering.

## Determinism

The same template and the same variables must always produce the same output.

## No Hidden Context

Environment variables, shell variables, filesystem state, and global application state must not become template variables implicitly.

## Fail Explicitly

Unresolved required placeholders must not silently disappear.

## Composition

The module should reuse certified Phoenix Core services rather than duplicate them.

---

# 6. Placeholder Syntax

Phoenix Template Engine v1.0 uses:

```text
{{VARIABLE}}
```

Example:

```text
Project: {{PROJECT_NAME}}
Version: {{VERSION}}
```

Given:

```text
PROJECT_NAME=Phoenix
VERSION=1.0
```

the rendered result is:

```text
Project: Phoenix
Version: 1.0
```

---

# 7. Placeholder Naming Rules

Version 1.0 placeholders use a deliberately restricted grammar:

```text
[A-Z][A-Z0-9_]*
```

Examples of valid placeholders:

```text
{{NAME}}
{{PROJECT_NAME}}
{{VERSION_2}}
{{OUTPUT_PATH}}
```

Examples not considered valid placeholders:

```text
{{name}}
{{ProjectName}}
{{PROJECT-NAME}}
{{ PROJECT_NAME }}
{{}}
```

A restricted grammar keeps parsing predictable and avoids ambiguous template semantics.

---

# 8. Variable Model

Variables are supplied explicitly by the caller.

The engine must not automatically import:

- environment variables;
- shell variables;
- manifest values;
- process state.

Manifest integration, when needed, belongs to the caller or a higher-level component.

The Template Engine only renders the variables it receives.

---

# 9. Rendering Model

Rendering follows this conceptual flow:

```text
Template
   │
   ▼
Placeholder Detection
   │
   ▼
Explicit Variable Lookup
   │
   ├── Found ─────► Literal Replacement
   │
   └── Missing ───► Rendering Failure
   │
   ▼
Unresolved Placeholder Check
   │
   ▼
Rendered Output
```

The engine must never evaluate replacement values.

---

# 10. Missing Variables

Missing variables are errors in version 1.0.

Example:

```text
Hello {{NAME}}
Version {{VERSION}}
```

If only `NAME` is supplied, rendering fails because:

```text
{{VERSION}}
```

remains unresolved.

The engine must not:

- replace it with an empty string;
- guess a value;
- read an environment variable automatically;
- silently preserve it while reporting success.

This behavior protects generators from producing incomplete files unnoticed.

---

# 11. Duplicate Placeholders

A placeholder may appear multiple times.

Example:

```text
{{NAME}}
Project {{NAME}}
Generated for {{NAME}}
```

A supplied `NAME` value replaces every occurrence.

---

# 12. Literal Replacement Values

Replacement values are always data.

Example value:

```text
$(touch /tmp/phoenix-template-danger)
```

must be rendered literally as:

```text
$(touch /tmp/phoenix-template-danger)
```

and must never execute.

The same rule applies to:

```text
`command`
${VARIABLE}
$VARIABLE
;
|
&
>
<
```

and other shell-significant content.

---

# 13. Security Boundary

Templates and replacement values are untrusted data.

The Template Engine must never use template content or replacement values with:

```text
eval
source
bash -c
sh -c
```

for rendering.

It must not perform shell expansion on rendered content.

Rendering is text transformation, not command execution.

This is a mandatory architectural constraint.

---

# 14. Template File Rendering

The engine may support rendering directly from a template file.

Conceptual flow:

```text
Template File
     │
     ▼
Filesystem Read
     │
     ▼
Template Rendering
     │
     ▼
Rendered Content
     │
     ▼
Filesystem Write
     │
     ▼
Output File
```

The source template must remain unchanged.

---

# 15. Output File Behavior

When file rendering succeeds:

- the destination receives the fully rendered content;
- the source template remains unchanged.

When rendering fails because of unresolved placeholders:

- incomplete rendered output must not be presented as successful output;
- the engine should avoid producing a misleading partially rendered destination.

Exact file-writing behavior is defined by the Function Specification.

---

# 16. Dependencies

Expected certified dependencies:

```text
core/filesystem.sh
core/strings.sh
```

Manifest is not a required dependency of Template Engine v1.0.

Runtime and Logger should only be introduced if required by an explicit implementation need.

---

# 17. Public API Direction

The architecture requires capabilities equivalent to:

```text
template_has_placeholders
template_render
template_render_file
```

Exact public names, arguments, return codes, and variable-passing contracts are defined by the Function Specification.

Architecture defines capabilities.

Specification defines API.

---

# 18. Return Model

Phoenix/UNIX conventions apply.

```text
0 = success / condition satisfied
1 = failure / condition not satisfied
```

Retrieval or rendering functions may return rendered content through stdout when successful.

Predicate functions communicate through exit status.

User-facing error presentation belongs to higher layers.

---

# 19. Side Effects

Content rendering must be side-effect free.

File rendering has one permitted side effect:

```text
write the explicitly requested destination file
```

The module must not:

- execute rendered content;
- mutate source templates;
- modify environment variables;
- change the caller's working directory;
- create unrelated files;
- perform network operations.

---

# 20. Atomicity Direction

For file rendering, Phoenix should prefer:

```text
Render Completely
        ↓
Validate Completely
        ↓
Write Destination
```

rather than:

```text
Write Partial Output
        ↓
Discover Error
```

This protects callers from incomplete generated artifacts.

The Function Specification will define the exact v1.0 contract.

---

# 21. Escaping Scope

Phoenix Template Engine v1.0 does not introduce a general-purpose escaping language.

The engine performs literal variable substitution only.

Specialized escaping for:

- JSON;
- YAML;
- HTML;
- shell scripts;
- SQL;
- programming languages

belongs to callers, specialized generators, or future explicit capabilities.

The Template Engine must not guess the semantic format of a template.

---

# 22. Testing Strategy

Automated tests must cover at minimum:

- detection of placeholders;
- templates without placeholders;
- successful single-variable rendering;
- multiple-variable rendering;
- repeated placeholders;
- missing-variable failure;
- empty replacement values;
- values containing spaces;
- values containing `=`;
- values containing shell syntax;
- template shell syntax remaining inert;
- source template preservation;
- successful file rendering;
- failed file rendering;
- destination integrity on rendering failure;
- invalid or missing template files;
- invalid destination paths where applicable;
- no implicit environment-variable lookup.

Security behavior is part of the module contract.

---

# 23. Extensibility

Future versions may introduce explicitly designed capabilities such as:

- optional placeholders;
- default values;
- typed template contexts;
- structured variable maps;
- template metadata;
- escaping helpers;
- reusable template packs.

They must not be added implicitly to v1.0.

Any expansion of template semantics requires architectural review.

---

# 24. Architectural Constraints

The following constraints are mandatory:

- Bash-compatible implementation;
- deterministic rendering;
- explicit variables only;
- restricted placeholder grammar;
- no `eval`;
- no sourcing of templates;
- no shell execution;
- no implicit environment lookup;
- no loops;
- no conditionals;
- no expression language;
- no hidden mutable global state;
- no network access;
- source templates remain unchanged;
- incomplete rendering must not be reported as success.

---

# 25. Definition of Done

The Template Engine may be certified only when:

- architecture is approved;
- function specification is complete;
- implementation is complete;
- Bash syntax validation passes;
- manual tests pass;
- automated tests pass;
- security behavior is verified;
- public API is reviewed;
- API Reference is complete;
- Master Record is updated.

---

# 26. Current Status

```text
Architecture           DEFINED
Function Specification PENDING
Implementation         NOT STARTED
Syntax Validation      PENDING
Manual Tests           PENDING
Automated Tests        PENDING
Security Tests         PENDING
API Reference          PENDING
Certification          PENDING
```

---

# 27. Architectural Decision

Phoenix Template Engine v1.0 is a deterministic text-substitution engine, not a template programming language.

It uses explicit `{{VARIABLE}}` placeholders, explicit caller-provided values, strict unresolved-placeholder failure, and literal non-executing replacement semantics.

Complex template logic is intentionally excluded from the Core.
