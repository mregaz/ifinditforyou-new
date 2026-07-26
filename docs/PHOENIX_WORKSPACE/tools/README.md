# PHOENIX WORKSPACE TOOLKIT

Version: 1.0.0  
Status: Stable  
Last Update: 24 July 2026

---

# Overview

Il Phoenix Workspace Toolkit è l'insieme degli strumenti ufficiali utilizzati per creare, migrare, validare e mantenere la Phoenix Workspace.

Il suo obiettivo è garantire che la documentazione del progetto rimanga:

- ordinata;
- coerente;
- ripetibile;
- verificabile;
- facilmente evolvibile.

Il Toolkit rappresenta uno dei pilastri della governance documentale di Phoenix.

---

# Philosophy

La documentazione è parte integrante del prodotto.

Per questo motivo la sua gestione deve essere automatizzata quanto più possibile.

Ogni modifica alla Workspace deve poter essere:

- creata;
- migrata;
- validata;
- certificata.

Il Toolkit rende questo processo ripetibile e indipendente dal singolo sviluppatore.

---

# Toolkit Components

## create_workspace.sh

Responsabilità:

Crea automaticamente una nuova Workspace conforme allo standard Phoenix.

Funzioni principali:

- creazione della struttura ufficiale;
- generazione delle directory;
- creazione dei README iniziali;
- inizializzazione della Workspace.

---

## migrate_workspace.sh

Responsabilità:

Migra documentazione esistente verso la struttura ufficiale della Workspace.

Funzioni principali:

- spostamento dei documenti;
- applicazione delle regole definite in `workspace-map.conf`;
- mantenimento della struttura logica.

---

## validate_workspace.sh

Responsabilità:

Verifica la conformità della Workspace.

Controlli eseguiti:

- struttura delle directory;
- copertura README;
- doppie estensioni;
- nomi contenenti spazi;
- nomi contenenti tab;
- file `.DS_Store`;
- cartelle vuote;
- cartelle duplicate;
- permessi degli script;
- presenza dei file del Toolkit.

Lo script produce un report finale con:

- numero dei controlli;
- errori;
- warning;
- stato finale.

---

## workspace-map.conf

File di configurazione utilizzato dal processo di migrazione.

Definisce la corrispondenza tra la struttura legacy e la Workspace ufficiale.

---

# Official Workflow

Il ciclo ufficiale della Workspace è:

```text
Create
    ↓
Migrate
    ↓
Validate
    ↓
Certify
    ↓
Release
```

Ogni modifica significativa dovrebbe seguire questo processo.

---

# Design Principles

Il Toolkit segue alcuni principi fondamentali.

## Deterministic

A parità di input produce sempre lo stesso risultato.

---

## Non Destructive

Gli strumenti non devono modificare documenti in modo imprevedibile.

---

## Transparent

Ogni operazione deve essere leggibile e verificabile.

---

## Maintainable

Gli script devono rimanere semplici da comprendere e modificare.

---

## Extensible

Nuovi controlli possono essere aggiunti senza modificare la filosofia del Toolkit.

---

# Governance

Il Toolkit costituisce il sistema ufficiale di governance della documentazione Phoenix.

La Workspace non viene mantenuta manualmente.

Viene mantenuta attraverso strumenti verificabili.

---

# Future Evolution

Le future versioni potranno introdurre:

- validazione dei link interni;
- verifica dei riferimenti tra documenti;
- controllo della numerazione;
- verifica delle convenzioni di naming avanzate;
- report in formato JSON;
- modalità CI/CD;
- integrazione con GitHub Actions.

---

# Compatibility

Sistema operativo:

- macOS
- Linux

Shell:

- Bash

---

# Version History

| Version | Status | Description |
|----------|--------|-------------|
| 1.0.0 | Stable | Prima versione ufficiale del Phoenix Workspace Toolkit |

---

# Conclusion

Il Phoenix Workspace Toolkit rappresenta la base della governance documentale del progetto.

La sua funzione non è soltanto automatizzare attività operative, ma garantire che la conoscenza prodotta durante lo sviluppo rimanga ordinata, verificabile e sostenibile nel tempo.

Ogni evoluzione della Workspace dovrà continuare a rispettare i principi definiti in questo documento.

---

End of Document
# Working Convention

Tutti gli script del Phoenix Workspace Toolkit devono essere eseguiti dalla root della Workspace.

Esempio:

```bash
./tools/validate_workspace.sh
./tools/create_pds.sh
./tools/create_provider.sh
```

Gli script sono progettati assumendo che la directory di lavoro sia la root della Workspace.

Questo garantisce:

- percorsi coerenti;
- documentazione uniforme;
- riduzione degli errori;
- facilità di automazione futura.