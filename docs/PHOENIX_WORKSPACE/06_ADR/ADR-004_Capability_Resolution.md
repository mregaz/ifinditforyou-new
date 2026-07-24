# ADR-004 — Capability Resolution

Status
Accepted

Date
2026-07

---

# Context

Con l'introduzione del Provider Registry, il Finder Engine non deve più conoscere i provider concreti.

L'Engine riceve una query dell'utente ma deve poter scegliere automaticamente i provider più appropriati.

Senza un livello di astrazione, il Finder Engine dovrebbe contenere logica del tipo:

- se Vespa → Anibis
- se Rolex → Chrono24
- se MacBook → Marketplace

Questa soluzione introdurrebbe un forte accoppiamento tra il Finder Engine e i provider.

---

# Decision

Introdurre un Capability Resolver.

Il Capability Resolver analizza la query normalizzata e restituisce una ProviderCapability.

Esempio:

Query

↓

"vespa 300"

↓

Capability

↓

vehicles

↓

Resolver

↓

Provider Registry

↓

Provider Manager

---

# Alternatives Considered

## A

Finder Engine con if/else sui provider.

Scartata.

Motivo:

forte accoppiamento.

---

## B

Provider scelti manualmente.

Scartata.

Motivo:

non scalabile.

---

## C

Capability Resolver.

Scelta.

Motivo:

disaccoppia completamente Engine e Provider.

---

# Consequences

Positive

- Engine indipendente dai provider
- aggiunta di nuovi provider senza modificare il Finder Engine
- maggiore scalabilità
- migliore testabilità

Negative

- introduce un livello architetturale aggiuntivo
- richiede manutenzione del mapping keyword → capability

---

# Implementation

Componenti coinvolti

- capabilityResolver.ts
- resolver.ts
- registry.ts

Pipeline

Query

↓

Parser

↓

Capability Resolver

↓

Provider Resolver

↓

Registry

↓

Provider Manager

---

# Future Evolution

Il Capability Resolver potrà evolvere da semplice keyword matching a:

- NLP
- classificazione AI
- semantic search
- intent detection

senza modificare il Finder Engine.