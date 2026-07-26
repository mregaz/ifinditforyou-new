# PHOENIX DEVKIT CHARTER

> **Build the system that builds the project.**

---

| Document | PHOENIX_DEVKIT_CHARTER |
|-----------|------------------------|
| Version | 0.1 |
| Status | Foundation |
| Created | 2026-07-25 |
| Author | Phoenix Team |
| Document Type | Project Charter |

---

# 1. Purpose

Phoenix DevKit nasce per definire un metodo professionale, ripetibile e scalabile per progettare, sviluppare, documentare e mantenere software.

Non è un framework applicativo.

Non è una libreria.

Non è una raccolta di script.

Phoenix DevKit è un **Engineering Framework** progettato per costruire progetti software di alta qualità attraverso automazione, standardizzazione e governance.

---

# 2. Mission

Ridurre il tempo necessario per costruire software professionale fornendo strumenti che automatizzano la struttura, la documentazione, i processi e le convenzioni di sviluppo.

Ogni progetto dovrebbe poter iniziare con solide fondamenta invece di reinventare ogni volta la stessa architettura.

---

# 3. Vision

Creare un ecosistema in cui lo sviluppo software sia guidato da metodo, qualità e ripetibilità.

Il DevKit non sostituisce lo sviluppatore.

Lo rende più efficace.

---

# 4. Philosophy

Phoenix DevKit si basa su una convinzione semplice.

> Il valore di un progetto non dipende solo dal codice che produce, ma anche dal metodo con cui viene costruito.

Per questo motivo il DevKit considera documentazione, architettura, processi e validazione come componenti dello stesso sistema.

---

# 5. Core Values

## Simplicity

La soluzione più semplice è quasi sempre la migliore.

---

## Consistency

Le convenzioni devono prevalere sulle preferenze personali.

---

## Automation

Ciò che viene ripetuto deve essere automatizzato.

---

## Documentation

La documentazione è parte integrante del software.

---

## Quality

Ogni componente deve poter essere verificato.

---

## Sustainability

Ogni decisione deve rendere il progetto più facile da mantenere nel tempo.

---

# 6. The Ten Laws

## I

Il metodo viene prima del codice.

## II

Nessuna duplicazione.

## III

I template descrivono.

Il motore genera.

## IV

Ogni automazione nasce da un problema reale.

## V

Ogni componente deve essere certificabile.

## VI

La documentazione evolve insieme al software.

## VII

Il Core deve rimanere piccolo e stabile.

## VIII

Ogni modulo deve avere una sola responsabilità.

## IX

Le convenzioni riducono gli errori.

## X

Il DevKit deve poter sopravvivere ai suoi creatori.

---

# 7. Scope

Phoenix DevKit comprende:

- Workspace
- Template Engine
- Generator Engine
- Validator Engine
- Documentation Engine
- Release Engine
- CLI
- Plugin System
- Shared Libraries

Non comprende la logica di business dei progetti che utilizza.

---

# 8. Governance

Ogni nuova funzionalità del DevKit deve rispettare i principi definiti in questo Charter.

Ogni modifica significativa dovrà essere accompagnata da:

- documentazione aggiornata;
- ADR quando necessario;
- validazione;
- test.

---

# 9. Relationship with Projects

Phoenix DevKit è indipendente dai progetti che lo utilizzano.

Può essere impiegato per sviluppare:

- SaaS
- Marketplace
- AI Platforms
- CLI Tools
- API
- Mobile Applications
- Enterprise Software

iFindItForYou rappresenta il primo progetto sviluppato con questo metodo e costituisce il principale banco di prova del DevKit.

---

# 10. Long-Term Vision

L'obiettivo finale è trasformare Phoenix DevKit in una piattaforma completa per l'ingegneria del software.

Una singola installazione dovrà permettere di creare un nuovo progetto professionale attraverso pochi comandi.

Esempio:

```bash
phoenix init my-project

phoenix create sprint

phoenix create adr

phoenix validate

phoenix release
```

---

# 11. Motto

> **Build the system that builds the project.**

---

# Final Statement

Phoenix DevKit nasce con l'obiettivo di trasformare l'esperienza accumulata nello sviluppo software in un sistema condivisibile, automatizzabile e riutilizzabile.

Ogni progetto costruito con Phoenix DevKit contribuisce a migliorare il metodo stesso.

Il DevKit non costruisce prodotti.

Costruisce il modo migliore per costruirli.