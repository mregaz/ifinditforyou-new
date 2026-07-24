# PROVIDER DEVELOPMENT GUIDE
## Version 1.0

**Project:** Phoenix Core

**Document Type:** Engineering Guide

**Status:** Active

**Author:** Mauro Regazzoni & ChatGPT

**Related Documents**

- Phoenix Engineering Handbook
- Provider Certification Manual
- Provider SDK Specification

---

# Purpose

Questo documento definisce il metodo ufficiale per sviluppare un nuovo Provider Phoenix.

Ogni provider deve seguire esattamente questo processo.

L'obiettivo non è semplicemente "far funzionare uno scraper", ma costruire componenti standardizzati, testabili e certificabili.

---
## Engineering Principle

A provider is not finished when it returns results.

A provider is finished when it can be trusted.

Trust is achieved through:

- architecture;
- testing;
- documentation;
- certification;
- continuous improvement.
# Development Workflow

Ogni nuovo provider segue sempre questo percorso.

```

Idea

↓

Discovery

↓

Architecture Review

↓

Implementation

↓

Testing

↓

Certification

↓

Production

```

Non sono ammesse eccezioni.

---

# Step 1 — Discovery

Prima di scrivere codice bisogna conoscere il marketplace.

Checklist Discovery

□ URL di ricerca

□ Parametri di ricerca

□ Rendering

□ HTML o JSON

□ Identificazione annunci

□ ID stabile

□ URL annunci

□ Prezzo

□ Località

□ Descrizione

□ Immagini

□ Paginazione

□ Robots

□ Anti Bot

Alla fine della Discovery viene prodotto:

```

MARKET_DISCOVERY_REPORT.md

```

---

# Step 2 — Provider Structure

Ogni provider nasce SEMPRE dal Provider Template.

Struttura ufficiale:

```

provider-name/

fetch.ts

parser.ts

validator.ts

mapper.ts

types.ts

index.ts

README.md

tests/

```

Mai copiare un provider esistente.

Il template è l'unico punto di partenza.

---

# Step 3 — Fetch

Responsabilità:

scaricare i dati.

Il Fetch NON interpreta mai i dati.

Restituisce solamente:

HTML

oppure

JSON

Regole

Mai fare parsing.

Mai validare.

Mai creare FinderResult.
### Best Practices

- Download only the required resource.
- Avoid unnecessary redirects.
- Always define an explicit timeout.
- Retry only transient failures.
- Keep the Fetch layer free from business logic.

### Common Mistakes

- Parsing HTML inside fetch.ts
- Returning FinderResult directly
- Performing validation
- Logging excessive information

### Real Example

Provider:
Anibis

Responsibilities:

✓ Download HTML

✓ Return raw response

Nothing else.
---

# Step 4 — Parser

Responsabilità:

estrarre dati grezzi.

Output:

MarketplaceListing

Il Parser non elimina risultati.

Non assegna score.

Non crea FinderResult.
### Edge Cases

A parser should correctly handle:

- missing price
- missing location
- malformed HTML
- duplicated cards
- advertisement blocks
- pagination

### Real Example

Anibis Parser

Input:

HTML

↓

Output:

MarketplaceListing[]
---

# Step 5 — Validator

Responsabilità:

verificare la qualità dei dati.

Controlli minimi:

ID presente

Titolo presente

URL presente

URL valido

Titolo non vuoto

Il Validator restituisce:

valid

rejected
### Validation Philosophy

Reject incomplete data.

Never "guess" missing information.

Better 18 valid listings than 25 unreliable ones.

Quality always comes before quantity.
---

# Step 6 — Mapper

Responsabilità:

convertire MarketplaceListing in FinderResult.

Qui vengono assegnati:

source

score iniziale

snippet

Il Mapper non deve mai conoscere il marketplace.
### Score Strategy

Initial score should reflect listing quality.

Ranking may later adjust this score.

The Mapper only assigns the initial relevance.

### Snippet Strategy

Prefer:

description

↓

price + location

↓

title
---

# Step 7 — Tests

Ogni provider deve avere almeno:

Parser Test

Validator Test

Mapper Test

I test devono usare fixture locali.

Mai dipendere dal sito online.

---

# Step 8 — Registry

Il provider viene registrato nel Registry.

Ogni provider definisce:

id

priority

enabled

countries

languages

categories

capabilities
### Registry Rules

Every provider must define:

- unique id
- priority
- enabled
- countries
- languages
- categories
- capabilities

The Registry is the single source of truth for provider discovery.
---

# Step 9 — Capability

Ogni provider dichiara cosa sa cercare.

Esempio:

vehicles

electronics

watches

general-marketplace

Il Finder Engine sceglie automaticamente il provider corretto.

---

# Step 10 — Certification

Prima della produzione il provider deve superare la checklist ufficiale.

Requisiti minimi:

✓ Discovery completata

✓ SDK completo

✓ Registry

✓ Resolver

✓ Tests

✓ Build verde

✓ Review

Solo allora diventa:

Phoenix Certified Provider
### Certification Scorecard

| Item | Status |
|-------|--------|
| Discovery | ✓ |
| Fetch | ✓ |
| Parser | ✓ |
| Validator | ✓ |
| Mapper | ✓ |
| Tests | ✓ |
| Registry | ✓ |
| Documentation | ✓ |
| Build | ✓ |

Result:

Phoenix Certified Provider
---

# Provider Directory Standard

Ogni cartella provider deve avere questa struttura.

```

provider/

README.md

fetch.ts

parser.ts

validator.ts

mapper.ts

types.ts

index.ts

tests/

fixtures/

```

Le fixture HTML fanno parte del provider.

---

# Naming Convention

MarketplaceListing

MarketplaceValidationResult

fetchMarketplace()

parseMarketplaceHtml()

validateMarketplaceListings()

mapMarketplaceListing()

La nomenclatura deve essere uniforme.

---

# Error Handling

Ogni errore deve essere classificato.

Network Error

↓

Parsing Error

↓

Validation Error

↓

Mapper Error

Mai usare catch generici senza logging.

---

# Logging

Ogni provider produce log coerenti.

Esempio:

```

[annonces]

fetch OK

20 listings downloaded

18 valid

2 rejected

```

Mai log rumorosi.

---

# Performance

Obiettivi:

ridurre richieste HTTP

riutilizzare parser

minimizzare memoria

timeout controllati

retry limitati

---

# Code Review Checklist

Prima del merge verificare:

□ Template rispettato

□ Responsabilità corrette

□ Nessun codice duplicato

□ Nessun marketplace hardcoded

□ Build verde

□ Test verdi

□ README aggiornato

---

# Golden Rules

Un provider deve essere:

semplice

prevedibile

modulare

testabile

documentato

certificabile

---

# Anti Patterns

Mai fare:

Fetch + Parser nello stesso file

Parser che crea FinderResult

Validator che modifica dati

Mapper che scarica HTML

Provider che conosce altri provider

Duplicazione di codice tra marketplace

---

# Philosophy

Phoenix non cresce aggiungendo provider.

Phoenix cresce migliorando il modo con cui vengono costruiti.

Ogni provider nuovo deve essere migliore del precedente.

Questo documento è lo standard ufficiale per ogni sviluppo futuro.