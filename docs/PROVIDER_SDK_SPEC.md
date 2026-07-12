Provider SDK Specification
Obiettivo

Il Provider SDK definisce lo standard che ogni provider di Phoenix deve rispettare.

Ogni provider deve poter essere aggiunto senza modificare:

Finder Engine
Provider Manager
Frontend
API
Architettura
SearchProvider

↓

Fetch

↓

Parser

↓

Validator

↓

Mapper

↓

FinderResult
Struttura delle cartelle
provider/

fetch.ts

parser.ts

validator.ts

mapper.ts

types.ts

index.ts
Responsabilità
fetch.ts

Responsabilità:

effettuare la richiesta HTTP
gestire gli errori HTTP
restituire HTML grezzo

Non deve:

interpretare HTML
validare dati
creare FinderResult
parser.ts

Responsabilità:

leggere il DOM
estrarre informazioni
costruire Listing

Non deve:

filtrare risultati
assegnare score
creare FinderResult
validator.ts

Responsabilità:

verificare qualità dati

Campi obbligatori:

id
title
url

Campi opzionali:

image
location
price
description
mapper.ts

Responsabilità:

convertire

ProviderListing

in

FinderResult

Non deve:

fare fetch
leggere HTML
validare dati
index.ts

Pipeline ufficiale

fetch

↓

parse

↓

validate

↓

map

↓

FinderResult[]
Regole

Ogni provider deve:

✔ usare SearchProvider

✔ restituire FinderResult

✔ usare validator

✔ usare mapper

✔ non conoscere il Finder Engine

✔ essere indipendente dagli altri provider

Logging

Ogni provider deve produrre metriche compatibili con ProviderManager.

Error handling

Un provider non deve mai interrompere l'esecuzione degli altri provider.

Gli errori devono essere gestiti localmente.

Convenzioni

Naming:

fetchMarketplace()

parseMarketplace()

validateMarketplaceListings()

mapMarketplaceListing()
Obiettivo finale

Aggiungere un nuovo provider deve richiedere solamente:

creare cartella

↓

implementare 6 file

↓

registrare il provider

↓
---

# Checklist Provider

Prima di registrare un nuovo provider verificare:

- [ ] fetch.ts implementato
- [ ] parser.ts implementato
- [ ] validator.ts implementato
- [ ] mapper.ts implementato
- [ ] types.ts implementato
- [ ] index.ts implementato

- [ ] Build verde

- [ ] Restituisce FinderResult[]

- [ ] Nessun log temporaneo

- [ ] Nessun TODO aperto

- [ ] Gestione errori presente

- [ ] Test manuale con curl eseguito

- [ ] Provider registrato in providers/index.ts

- [ ] ProviderManager compatibile
fine