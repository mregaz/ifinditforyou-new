# ADR-005 — Provider Certification

Status

Accepted

Date

2026-07

---

# Context

Con l'introduzione del Provider SDK, Phoenix può integrare un numero crescente di marketplace.

Tuttavia, senza uno standard comune, ogni provider rischierebbe di essere implementato con strutture, convenzioni e livelli di qualità differenti.

Questo renderebbe difficile:

- mantenere il codice;
- eseguire refactoring;
- aggiungere nuovi provider;
- garantire la qualità complessiva della piattaforma.

È quindi necessario definire un processo oggettivo che stabilisca quando un provider può essere considerato pronto per entrare a far parte del Phoenix Core.

---

# Decision

Ogni provider deve attraversare un processo di certificazione prima di essere considerato parte integrante della piattaforma.

La certificazione verifica che il provider:

- implementi completamente il Provider SDK;
- rispetti la separazione delle responsabilità;
- sia registrato nel Provider Registry;
- dichiari correttamente capability, paesi e lingue;
- superi tutti i test previsti;
- produca risultati conformi al modello FinderResult.

Solo i provider certificati possono essere considerati "Production Ready".

---

# Certification Requirements

Un provider Phoenix deve soddisfare tutti i seguenti requisiti.

## SDK

- fetch.ts
- parser.ts
- validator.ts
- mapper.ts
- types.ts
- index.ts

## Testing

- Validator Test
- Mapper Test
- Parser Test (quando applicabile)
- Build verde

## Registry

Provider registrato nel Registry con:

- id
- priority
- enabled
- countries
- languages
- capabilities

## Output

Il Mapper deve produrre esclusivamente oggetti FinderResult.

---

# Alternatives Considered

## A

Lasciare ogni provider libero di implementare la propria struttura.

Scartata.

Motivazione:

avrebbe generato un ecosistema eterogeneo difficile da mantenere.

---

## B

Creare uno standard SDK ma senza certificazione.

Scartata.

Motivazione:

manca un criterio oggettivo di qualità.

---

## C

Provider SDK + Provider Certification.

Scelta.

Motivazione:

garantisce uniformità, qualità e scalabilità.

---

# Consequences

Positive

- tutti i provider seguono lo stesso standard;
- onboarding più semplice;
- manutenzione più prevedibile;
- qualità misurabile;
- integrazione più rapida dei nuovi provider.

Negative

- richiede una fase aggiuntiva prima del rilascio;
- aumenta leggermente il lavoro iniziale di ogni provider.

---

# Implementation

La certificazione viene verificata tramite:

- checklist ufficiale;
- test automatici;
- build verde;
- review architetturale.

Lo stato del provider può essere:

- Draft
- Beta
- Certified

---

# Future Evolution

In futuro la certificazione potrà essere automatizzata.

Ad esempio:

- controllo automatico della struttura del provider;
- verifica dei test;
- verifica della copertura;
- certificazione CI/CD.

L'obiettivo è rendere la certificazione un processo ripetibile e completamente automatizzabile.