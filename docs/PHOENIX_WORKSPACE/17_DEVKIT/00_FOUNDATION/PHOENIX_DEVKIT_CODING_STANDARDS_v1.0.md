# PHOENIX DEVKIT CODING STANDARDS
## Version 1.0

---

# Purpose

Questo documento definisce gli standard di sviluppo del Phoenix DevKit.

L'obiettivo è garantire uniformità, leggibilità, qualità e manutenibilità dell'intero ecosistema.

Ogni nuovo script, libreria, template o generatore dovrà rispettare queste regole.

---

# 1. Naming Convention

I nomi devono essere:

- descrittivi
- coerenti
- prevedibili

Esempi:

GOOD

create_workspace.sh

validate_workspace.sh

template_engine.sh

provider_generator.sh

BAD

script.sh

test2.sh

new.sh

tool.sh

---

# 2. Directory Structure

Ogni modulo deve avere una posizione logica.

Esempio

tools/
core/
templates/
providers/
docs/
tests/

Mai creare directory duplicate.

Mai creare directory temporanee permanenti.

---

# 3. File Naming

Utilizzare sempre:

snake_case

Esempi

provider_generator.sh

template_engine.sh

workspace_validator.sh

Documentazione:

UPPER_CASE con underscore

PHOENIX_DEVKIT_ARCHITECTURE.md

ENGINEERING_PRINCIPLES.md

CODING_STANDARDS.md

---

# 4. Function Naming

Le funzioni devono essere descrittive.

GOOD

create_workspace()

validate_provider()

generate_template()

BAD

run()

main2()

exec()

test()

---

# 5. Function Size

Una funzione dovrebbe svolgere un solo compito.

Obiettivo:

20–40 righe

Eccezioni solo se realmente motivate.

---

# 6. Script Responsibilities

Ogni script deve avere una sola responsabilità.

NO

script che crea

valida

migra

installa

genera

tutto insieme

SI

uno script

una responsabilità

---

# 7. Comments

Commentare il "perché", non il "cosa".

BAD

# incrementa x

x=$((x+1))

GOOD

# Mantiene la compatibilità con Workspace v1

---

# 8. Logging

Utilizzare log uniformi.

Formato

[INFO]

[WARN]

[ERROR]

[SUCCESS]

Esempio

[INFO] Creating workspace...

[SUCCESS] Workspace created.

---

# 9. Error Handling

Ogni errore deve:

spiegare il problema

spiegare la causa

suggerire una soluzione

BAD

Error

GOOD

Workspace configuration file not found.

Run:

phoenix init

---

# 10. Exit Codes

Utilizzare exit code standard.

0

Success

1

Generic Error

2

Invalid Arguments

3

Configuration Error

4

Dependency Missing

5

Permission Error

---

# 11. Defensive Programming

Verificare sempre:

directory

file

permessi

input

dipendenze

prima dell'esecuzione.

Mai assumere che qualcosa esista.

---

# 12. Input Validation

Ogni parametro deve essere validato.

Controllare:

stringhe vuote

caratteri non validi

percorsi inesistenti

parametri duplicati

---

# 13. Configuration

Le configurazioni devono essere centralizzate.

Mai hardcodare:

directory

versioni

percorsi

estensioni

nomi

---

# 14. Reusable Libraries

Le funzioni condivise devono vivere nella Core Library.

Mai duplicare.

---

# 15. Template Standard

Ogni template deve essere:

versionato

documentato

facile da estendere

indipendente

---

# 16. Documentation Standard

Ogni nuovo componente deve avere:

README

esempio

descrizione

dipendenze

limitazioni

---

# 17. Testing

Ogni nuovo modulo dovrebbe essere verificabile.

Preferire:

piccoli test

ripetibili

automatici

---

# 18. Backward Compatibility

Prima di modificare un comportamento:

valutare

impatto

migrazione

compatibilità

---

# 19. Performance

Ottimizzare solo dopo aver misurato.

La leggibilità viene prima delle micro-ottimizzazioni.

---

# 20. Dependencies

Ridurre al minimo le dipendenze esterne.

Preferire strumenti già disponibili nel sistema.

Ogni nuova dipendenza deve essere giustificata.

---

# 21. Shell Compatibility

Gli script devono essere compatibili con:

bash

zsh

quando possibile.

Evitare costrutti dipendenti dalla shell.

---

# 22. Security

Mai:

eseguire input utente senza validazione

scrivere file fuori dal workspace

eliminare directory senza conferma

eseguire comandi dinamici non controllati

---

# 23. Idempotency

Quando possibile uno script deve poter essere eseguito più volte producendo lo stesso risultato.

Gli effetti collaterali devono essere minimizzati.

---

# 24. CLI User Experience

Ogni comando deve essere:

chiaro

prevedibile

autoesplicativo

con messaggi leggibili.

---

# 25. Versioning

Ogni componente deve riportare:

Versione

Autore

Ultimo aggiornamento

Compatibilità

---

# Code Review Checklist

Prima del merge verificare:

☐ Naming corretto

☐ Nessuna duplicazione

☐ Funzioni piccole

☐ Error handling

☐ Logging uniforme

☐ Documentazione aggiornata

☐ Nessun hardcoding

☐ Compatibilità mantenuta

☐ Sicurezza verificata

☐ Test eseguiti

---

# Final Statement

La qualità del Phoenix DevKit dipende dalla coerenza con cui vengono applicati questi standard.

Ogni riga di codice contribuisce alla sostenibilità dell'intero ecosistema.

L'obiettivo non è scrivere software rapidamente, ma costruire una piattaforma affidabile, estendibile e mantenibile nel tempo.