# ADR-007 — Provider Lifecycle

**Status:** Accepted

**Version:** 1.0

**Date:** July 2026

**Authors:** Phoenix Core Team

---

# Purpose

Questo Architecture Decision Record definisce il ciclo di vita ufficiale dei provider all'interno della piattaforma Phoenix.

Ogni provider attraversa una serie di stati ben definiti dalla fase di scoperta fino all'eventuale ritiro.

L'obiettivo è garantire uno sviluppo controllato, una qualità costante e una gestione uniforme di tutti i marketplace integrati.

---

# Context

Phoenix è progettato per crescere progressivamente attraverso l'aggiunta di nuovi provider.

Ogni marketplace evolve nel tempo:

- modifica la struttura HTML;
- introduce nuove funzionalità;
- cambia le regole di ricerca;
- può diventare instabile o non più mantenuto.

Per evitare una gestione improvvisata dei provider viene introdotto un ciclo di vita ufficiale.

---

# Decision

Ogni provider deve seguire il medesimo percorso evolutivo.

Nessun provider può essere utilizzato direttamente in produzione senza aver attraversato le fasi previste dal Lifecycle.

Questo garantisce uniformità, qualità e tracciabilità durante tutta la vita del provider.

---

# Lifecycle

Il ciclo di vita ufficiale di un provider è il seguente.

```text
Discovery
    ↓
Approved
    ↓
Development
    ↓
Testing
    ↓
Certified
    ↓
Production
    ↓
Monitoring
    ↓
Disabled
    ↓
Deprecated
    ↓
Retired
```
---

# Lifecycle States

Ogni stato del Lifecycle ha uno scopo preciso.

## Discovery

Il marketplace è stato individuato e viene analizzato.

Attività principali:

- raccolta informazioni;
- studio della struttura;
- valutazione tecnica;
- decisione GO / NO GO.

---

## Approved

Il provider è stato approvato per lo sviluppo.

Sono stati definiti:

- obiettivi;
- priorità;
- capability supportate.

---

## Development

Il provider viene implementato seguendo il Provider SDK.

Componenti tipici:

- fetch.ts
- parser.ts
- validator.ts
- mapper.ts
- types.ts
- index.ts

---

## Testing

Il provider viene sottoposto a test automatici e verifiche funzionali.

Devono essere validati almeno:

- parser;
- validator;
- mapper;
- gestione degli errori;
- qualità dei FinderResult.

---

## Certified

Il provider soddisfa tutti gli standard definiti da Phoenix.

Può essere inserito nel Provider Registry come provider certificato.

---

## Production

Il provider è abilitato (`enabled`) nel Registry e può essere utilizzato dal Finder Engine.

---

## Monitoring

Il provider viene monitorato nel tempo.

Sono osservati:

- stabilità;
- tempi di risposta;
- qualità dei risultati;
- eventuali cambiamenti del marketplace.

---

## Disabled

Il provider viene temporaneamente disabilitato.

Cause possibili:

- modifiche del sito;
- problemi tecnici;
- manutenzione.

Il codice rimane disponibile ma il provider non viene eseguito.

---

## Deprecated

Il provider è ancora presente ma non è più raccomandato.

Può essere sostituito da una versione migliore o da un marketplace differente.

---

## Retired

Il provider viene rimosso definitivamente dalla piattaforma.

Lo stato viene utilizzato quando il marketplace non è più supportato o non soddisfa più gli standard qualitativi di Phoenix.

---

# Transition Rules

Le transizioni tra gli stati devono essere tracciabili.

Un provider non può saltare direttamente da Discovery a Production.

Ogni fase rappresenta un controllo di qualità che riduce il rischio di introdurre componenti non affidabili.

---

# Benefits

L'introduzione di un Lifecycle ufficiale permette di:

- standardizzare lo sviluppo dei provider;
- migliorare la qualità complessiva della piattaforma;
- facilitare la manutenzione;
- documentare chiaramente lo stato di ogni provider;
- pianificare l'evoluzione futura del progetto.

---

# Related ADRs

Questo documento completa il framework architetturale definito nei seguenti ADR:

- ADR-001 — Phoenix Core Architecture
- ADR-002 — Provider SDK
- ADR-003 — Provider Registry & Resolver
- ADR-004 — Capability Resolution
- ADR-005 — Provider Certification
- ADR-006 — Testing Strategy

---

# Status

Accepted

Il Provider Lifecycle rappresenta il processo ufficiale di gestione dell'intero ciclo di vita dei provider nella piattaforma Phoenix a partire dalla versione 1.0.