# ADR-002
# Provider SDK

Status: Accepted

Date: 15 July 2026

---

# Context

Ogni marketplace utilizza strutture HTML differenti.

Era necessario definire uno standard comune.

---

# Decision

Ogni provider implementa sempre la pipeline:

Fetch

↓

Parser

↓

Validator

↓

Mapper

↓

FinderResult

Nessun provider può discostarsi da questa struttura.

---

# Motivation

Separazione delle responsabilità.

Riduzione della complessità.

Maggiore riuso.

Facilità di testing.

---

# Consequences

Ogni provider risulta:

modulare

testabile

certificabile

prevedibile

---

# Status

Accepted.