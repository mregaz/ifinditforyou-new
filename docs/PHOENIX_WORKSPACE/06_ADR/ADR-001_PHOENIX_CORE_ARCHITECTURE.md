# ADR-001 — Phoenix Core Architecture

**Status:** Accepted

**Version:** 1.0

**Date:** July 2026

**Authors:** Phoenix Core Team

---

# Purpose

Questo Architecture Decision Record definisce l'architettura fondamentale di Phoenix.

Rappresenta la decisione più importante dell'intero progetto e costituisce il punto di riferimento per tutte le decisioni architetturali successive.

Gli ADR successivi (Provider SDK, Registry, Capability Resolution, Testing, Lifecycle...) estendono questa architettura ma non la sostituiscono.

---

# Context

Phoenix nasce come evoluzione del progetto iFindItForYou.

L'obiettivo iniziale era permettere agli utenti di cercare oggetti usati su marketplace differenti utilizzando un'unica interfaccia.

Durante le prime fasi di sviluppo è emerso un problema fondamentale.

Ogni marketplace presenta caratteristiche differenti:

- struttura HTML diversa;
- URL differenti;
- sistemi di ricerca differenti;
- dati differenti;
- categorie differenti;
- lingue differenti.

Integrare direttamente ogni marketplace all'interno del Finder Engine avrebbe creato un forte accoppiamento tra il Core e i provider.

Ogni nuovo provider avrebbe richiesto modifiche al Finder Engine, aumentando la complessità e rendendo il sistema sempre meno manutenibile.

È stato quindi necessario ripensare completamente l'architettura del progetto.

---

# Decision

Phoenix adotta un'architettura modulare basata su componenti indipendenti.

Il Finder Engine rappresenta il cuore del sistema, ma non conosce alcun provider specifico.

L'Engine orchestra esclusivamente il flusso di elaborazione, delegando ogni responsabilità ai componenti specializzati.

L'architettura ufficiale diventa:

```text
User Query
    ↓
Query Parser
    ↓
Capability Resolver
    ↓
Provider Resolver
    ↓
Provider Registry
    ↓
Provider Manager
    ↓
Provider SDK
    ↓
External Providers
    ↓
FinderResult
```

Ogni componente possiede una singola responsabilità.

---

# Architectural Principles

L'architettura di Phoenix si basa sui seguenti principi.

## 1. Separation of Concerns

Ogni componente deve avere una responsabilità unica e chiaramente definita.

Esempi:

- il Parser interpreta la query;
- il Capability Resolver determina la capability;
- il Provider Resolver seleziona i provider;
- il Provider Manager orchestra l'esecuzione;
- il Provider SDK implementa la logica del marketplace.

Nessun componente deve assumere responsabilità appartenenti ad altri livelli.

---

## 2. Loose Coupling

Il Phoenix Core non deve dipendere dall'implementazione di un provider specifico.

L'aggiunta, la rimozione o la modifica di un provider non devono richiedere modifiche al Finder Engine.

---

## 3. High Cohesion

Ogni modulo deve contenere esclusivamente funzionalità strettamente correlate tra loro.

Ad esempio:

- parser.ts interpreta i dati;
- validator.ts applica regole di qualità;
- mapper.ts converte nel formato FinderResult.

---

## 4. Extensibility

Phoenix deve poter integrare nuovi provider senza modificare l'architettura del Core.

L'espansione della piattaforma deve avvenire attraverso il Provider SDK e il Provider Registry.

---

## 5. Testability

Ogni componente critico deve poter essere verificato in isolamento mediante test automatici.

La qualità non dipende dalle verifiche manuali ma da una suite di test ripetibile.

---

## 6. Replaceability

Ogni provider deve poter essere sostituito senza modificare il resto del sistema.

Questo principio permette di reagire rapidamente ai cambiamenti dei marketplace esterni.
---

# Core Components

L'architettura di Phoenix è composta dai seguenti componenti principali.

| Component | Responsibility |
|-----------|----------------|
| Query Parser | Normalizza e interpreta la richiesta dell'utente. |
| Capability Resolver | Determina la capability richiesta (vehicles, watches, electronics, ecc.). |
| Provider Resolver | Seleziona i provider più adatti utilizzando il Registry. |
| Provider Registry | Mantiene l'elenco dei provider disponibili e dei relativi metadati. |
| Provider Manager | Coordina l'esecuzione dei provider, gestendo timeout, errori e raccolta dei risultati. |
| Provider SDK | Definisce la struttura standard che ogni provider deve implementare. |
| Finder Engine | Orchestration layer dell'intero processo di ricerca. |

---

# Consequences

L'adozione di questa architettura comporta numerosi vantaggi.

## Benefici

- Il Finder Engine rimane stabile nel tempo.
- I provider possono essere sviluppati in modo indipendente.
- L'aggiunta di un nuovo marketplace non richiede modifiche al Core.
- Ogni componente è facilmente testabile.
- La piattaforma può crescere senza aumentare la complessità architetturale.

## Trade-off

Questa architettura introduce un numero maggiore di componenti rispetto a una soluzione monolitica.

Tuttavia, la maggiore modularità rende il progetto più semplice da mantenere, estendere e testare nel lungo periodo.

---

# Related ADRs

Questo documento costituisce la base dell'intera architettura di Phoenix.

Le decisioni successive ne rappresentano un'estensione:

- ADR-002 — Provider SDK
- ADR-003 — Provider Registry & Resolver
- ADR-004 — Capability Resolution
- ADR-005 — Provider Certification
- ADR-006 — Testing Strategy
- ADR-007 — Provider Lifecycle

---

# Status

Accepted

Questa decisione rappresenta l'architettura ufficiale di Phoenix a partire dalla versione 1.0 della piattaforma.