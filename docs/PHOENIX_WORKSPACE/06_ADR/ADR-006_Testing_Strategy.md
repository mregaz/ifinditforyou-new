# ADR-006 — Testing Strategy

**Status:** Accepted  
**Date:** 2026-07  
**Decision Owners:** Phoenix Core Team

---

## Context

Phoenix sta evolvendo da un singolo Finder con provider statici a una piattaforma capace di orchestrare numerosi provider indipendenti.

La pipeline principale comprende diversi componenti critici:

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
External Marketplace
```

Ogni livello introduce possibili regressioni.

Una modifica al Capability Resolver potrebbe selezionare provider non pertinenti. Una modifica al Registry potrebbe alterare priorità o disponibilità. Un cambiamento nel parser di un provider potrebbe interrompere l’estrazione dei risultati senza produrre necessariamente un errore evidente.

Inoltre, i marketplace esterni possono modificare autonomamente:

- struttura HTML;
- nomi degli attributi;
- markup delle schede;
- sistemi di paginazione;
- URL;
- contenuti disponibili.

Affidarsi esclusivamente a verifiche manuali tramite browser o `curl` non è sufficiente per garantire stabilità, ripetibilità e scalabilità.

È quindi necessario definire una strategia di testing uniforme per il Phoenix Core e per tutti i provider.

---

## Decision

Phoenix adotta una strategia di testing automatizzato, progressivo e orientato ai confini architetturali.

Ogni componente critico deve essere verificabile in isolamento.

La suite di test ufficiale utilizza **Vitest**.

La strategia si articola su quattro livelli:

1. unit test;
2. provider contract test;
3. integration test;
4. build validation.

La certificazione di un provider richiede il superamento di tutti i test applicabili e una build di produzione verde.

---

## Testing Principles

### 1. Testare il comportamento, non l’implementazione interna

I test devono verificare ciò che il componente produce, non il modo specifico in cui è stato scritto.

Un refactoring interno non deve rompere i test quando il comportamento pubblico rimane invariato.

---

### 2. Test deterministici

I test automatici devono produrre lo stesso risultato a ogni esecuzione.

Per questo motivo, i test di parser, validator e mapper devono utilizzare fixture HTML o dati locali controllati, evitando per quanto possibile richieste reali ai marketplace.

---

### 3. Isolamento delle dipendenze esterne

Le dipendenze di rete non devono rendere instabile la suite principale.

Le chiamate live ai marketplace possono essere utilizzate per verifiche operative separate, ma non devono essere necessarie per eseguire i test standard.

---

### 4. Ogni regressione deve generare un test

Quando viene scoperto e corretto un bug, deve essere aggiunto un test che riproduca il problema.

Il test deve fallire prima della correzione e passare dopo la correzione.

---

### 5. Nessun provider è Production Ready senza test

Un provider che restituisce risultati durante una verifica manuale non è automaticamente considerato affidabile.

Deve prima soddisfare i requisiti definiti dalla Provider Certification.

---

## Testing Levels

### Level 1 — Unit Tests

Gli unit test verificano singole funzioni o moduli in isolamento.

Componenti prioritari:

- Query Parser;
- Capability Resolver;
- Provider Resolver;
- Validator;
- Mapper;
- utility di timeout e retry;
- funzioni di normalizzazione;
- deduplicazione e ranking, quando introdotti.

Esempio:

```text
"vespa 300 gts"
    ↓
vehicles
```

Il test deve verificare che una query relativa a una Vespa venga classificata con la capability `vehicles`.

---

### Level 2 — Provider Contract Tests

Ogni provider deve rispettare il contratto del Provider SDK.

La struttura prevista comprende:

```text
provider/
├── fetch.ts
├── parser.ts
├── validator.ts
├── mapper.ts
├── types.ts
├── index.ts
└── tests/
```

I test devono verificare almeno:

#### Parser

- estrae le schede valide;
- restituisce i campi attesi;
- gestisce HTML vuoto o incompleto;
- non produce duplicati non intenzionali.

#### Validator

- accetta record conformi;
- rifiuta record privi dei campi obbligatori;
- rifiuta URL non validi;
- rifiuta titoli placeholder o contenuti non pertinenti;
- separa correttamente record validi e rifiutati.

#### Mapper

- produce oggetti conformi a `FinderResult`;
- assegna la source corretta;
- costruisce URL assoluti;
- produce uno snippet utilizzabile;
- applica uno score valido;
- non espone strutture interne del marketplace.

#### Provider entry point

- implementa il contratto `SearchProvider`;
- espone un nome stabile;
- restituisce sempre un array;
- propaga o gestisce gli errori secondo le regole del Provider Manager.

---

### Level 3 — Integration Tests

Gli integration test verificano la collaborazione tra più componenti del Phoenix Core.

Flussi prioritari:

```text
ParsedQuery
    ↓
Capability Resolver
    ↓
Provider Resolver
    ↓
Selected Providers
```

e:

```text
Provider Raw Data
    ↓
Parser
    ↓
Validator
    ↓
Mapper
    ↓
FinderResult[]
```

Gli integration test devono verificare in particolare:

- selezione dei provider in base alla capability;
- rispetto del flag `enabled`;
- ordinamento tramite `priority`;
- compatibilità tra Registry e Resolver;
- isolamento degli errori nel Provider Manager;
- aggregazione dei risultati provenienti da più provider.

---

### Level 4 — Build Validation

La build di produzione costituisce una parte obbligatoria della strategia di testing.

Comando:

```bash
npm run build
```

La build deve verificare:

- correttezza TypeScript;
- validità degli import;
- compatibilità con Next.js;
- assenza di errori bloccanti;
- integrità generale dell’applicazione.

Una suite di test verde con build rossa non è sufficiente per considerare valida una modifica.

---

## Required Validation Commands

Prima della chiusura di uno sprint tecnico devono essere eseguiti:

```bash
npm test
npm run build
```

Durante lo sviluppo può essere utilizzata la modalità watch:

```bash
npm run test:watch
```

La verifica manuale dell’API può essere eseguita dopo l’avvio dell’ambiente locale:

```bash
npm run dev
```

e, da un secondo terminale:

```bash
curl -X POST http://localhost:3000/api/finder \
  -H "Content-Type: application/json" \
  -d '{"query":"vespa 300 gts usata","lang":"it","plan":"free"}'
```

La verifica manuale integra i test automatici, ma non li sostituisce.

---

## Test Fixtures

I parser devono essere testati preferibilmente attraverso fixture locali.

Esempio:

```text
tests/
├── fixtures/
│   ├── search-results.html
│   ├── empty-results.html
│   └── malformed-results.html
├── parser.test.ts
├── validator.test.ts
└── mapper.test.ts
```

Le fixture devono rappresentare casi realistici ma controllati.

Quando il markup reale del marketplace cambia:

1. si salva una nuova fixture rappresentativa;
2. si aggiorna il parser;
3. si aggiunge o modifica il test;
4. si verifica che la regressione sia coperta.

---

## External Provider Monitoring

I test locali non possono garantire che un marketplace esterno mantenga invariato il proprio sito.

Per questo motivo Phoenix distingue tra:

### Automated Test Suite

Verifica deterministica del codice utilizzando fixture e dati controllati.

### Live Provider Check

Verifica periodica contro il marketplace reale.

Il Live Provider Check può controllare:

- raggiungibilità;
- status HTTP;
- presenza di risultati;
- numero minimo di record estratti;
- percentuale di record validi;
- variazioni anomale del markup.

I Live Provider Check non devono rendere instabile la suite standard.

---

## Failure Policy

Un errore di un singolo provider non deve compromettere l’intero Finder.

Il Provider Manager deve:

- isolare il fallimento;
- registrare lo stato del provider;
- misurare la durata;
- restituire i risultati degli altri provider;
- produrre dati utili per logging e osservabilità.

I test devono verificare che:

```text
Provider A → success
Provider B → error
Provider C → success
```

produca comunque i risultati di A e C.

---

## Minimum Coverage by Component

### Phoenix Core

Obbligatori:

- Capability Resolver tests;
- Provider Resolver tests;
- Provider Manager tests;
- Registry behavior tests;
- utility tests per logica critica.

### Certified Provider

Obbligatori:

- parser tests;
- validator tests;
- mapper tests;
- provider pipeline test;
- build verde.

### Optional Provider

Può essere sviluppato in stato Draft o Beta, ma non può essere dichiarato Certified finché non soddisfa i requisiti minimi.

---

## Alternatives Considered

### Alternative A — Solo verifiche manuali

Eseguire browser test e richieste `curl` dopo ogni modifica.

**Scartata.**

Motivazioni:

- non ripetibile in modo affidabile;
- lenta;
- dipendente dall’operatore;
- insufficiente contro le regressioni;
- non scalabile con numerosi provider.

---

### Alternative B — Test end-to-end completi fin dall’inizio

Testare tutta l’applicazione esclusivamente attraverso il browser e marketplace reali.

**Scartata come strategia iniziale.**

Motivazioni:

- elevata complessità;
- esecuzione lenta;
- forte dipendenza dalla rete;
- fragilità rispetto ai siti esterni;
- diagnosi degli errori più difficile.

I test end-to-end potranno essere aggiunti quando il prodotto e il frontend saranno più maturi.

---

### Alternative C — Unit test e fixture senza integration test

Verificare ogni funzione isolatamente senza controllare il funzionamento della pipeline completa.

**Scartata.**

Motivazione:

i singoli componenti potrebbero funzionare correttamente in isolamento ma risultare incompatibili tra loro.

---

### Alternative D — Strategia multilivello con Vitest

Unit test, provider contract test, integration test e build validation.

**Scelta.**

Motivazioni:

- esecuzione rapida;
- buona capacità diagnostica;
- riduzione delle regressioni;
- compatibilità con TypeScript e Next.js;
- scalabilità con il numero di provider;
- integrazione futura con CI/CD.

---

## Consequences

### Positive

- maggiore stabilità del Phoenix Core;
- regressioni identificate più rapidamente;
- refactoring più sicuri;
- provider più uniformi;
- certificazione basata su criteri verificabili;
- minore dipendenza dai test manuali;
- maggiore fiducia durante l’espansione;
- preparazione naturale all’automazione CI/CD.

### Negative

- ogni nuova funzionalità richiede tempo aggiuntivo per i test;
- le fixture devono essere mantenute;
- i test possono richiedere aggiornamenti quando cambiano i contratti;
- i siti esterni richiedono verifiche live separate;
- una copertura numerica elevata non garantisce automaticamente una buona qualità dei test.

---

## Implementation

La strategia viene implementata utilizzando:

```text
Vitest
TypeScript
Local HTML fixtures
Provider-specific test directories
npm test
npm run build
```

Test già introdotti nel progetto:

- Capability Resolver;
- Provider Resolver;
- Anibis Validator;
- Anibis Mapper;
- componenti del Provider SDK.

Anibis rappresenta il primo provider sottoposto al processo di certificazione Phoenix.

---

## Definition of Done

Una modifica tecnica è considerata completata quando:

- il comportamento richiesto è implementato;
- i test esistenti continuano a passare;
- i nuovi comportamenti critici hanno test dedicati;
- gli errori noti sono coperti da test di regressione;
- `npm test` è verde;
- `npm run build` è verde;
- la documentazione rilevante è aggiornata;
- non sono presenti modifiche accidentali nel repository.

---

## Future Evolution

La strategia potrà evolvere includendo:

- test end-to-end con Playwright;
- coverage report;
- soglie minime di copertura;
- test automatici delle API;
- contract test condivisi tra tutti i provider;
- snapshot strutturali controllati;
- mutation testing;
- test di performance;
- test di carico;
- CI tramite GitHub Actions;
- provider health checks schedulati;
- alert automatici quando un parser smette di estrarre risultati;
- blocco automatico del merge quando test o build falliscono.

Il principio architetturale rimane invariato:

> Ogni comportamento critico di Phoenix deve essere verificabile in modo automatico, ripetibile e indipendente dalle verifiche manuali.

---

## Decision Outcome

Phoenix adotta ufficialmente una strategia di testing multilivello.

I test non sono considerati un’attività accessoria svolta dopo lo sviluppo.

Sono parte integrante:

- dell’implementazione;
- della certificazione dei provider;
- della chiusura degli sprint;
- della qualità del Phoenix Core.