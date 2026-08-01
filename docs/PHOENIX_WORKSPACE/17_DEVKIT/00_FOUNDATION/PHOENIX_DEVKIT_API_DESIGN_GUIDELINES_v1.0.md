# PHOENIX_DEVKIT_API_GUIDELINES_v1.0

Version: 1.0

Status: Official

---

# Purpose

Questo documento definisce le linee guida ufficiali per la progettazione delle API del Phoenix DevKit.

Ogni funzione pubblica del DevKit dovrà rispettare queste regole.

L'obiettivo è costruire una libreria prevedibile, coerente, semplice da utilizzare e facile da mantenere nel lungo periodo.

---

# Principle 1 — Single Responsibility

Ogni funzione deve svolgere una sola responsabilità.

Una funzione deve poter essere descritta con una sola frase.

Preferire:

- phoenix::is_file()
- phoenix::copy_file()

Evitare:

- phoenix::check_and_copy_and_log()

---

# Principle 2 — Public API First

Le funzioni pubbliche costituiscono il contratto del DevKit.

L'implementazione interna può cambiare.

Il contratto pubblico deve rimanere stabile.

Schema consigliato:

Public API

↓

Private Functions

↓

System Calls

---

# Principle 3 — Private Implementation

Ogni logica condivisa deve essere implementata tramite funzioni private.

Le API pubbliche devono essere leggere.

Esempio:

phoenix::log_info()

↓

_phoenix::log()

---

# Principle 4 — No Output

I moduli Core non devono produrre output.

Eccezione:

Logger

Le funzioni devono comunicare esclusivamente tramite:

- return code
- valori restituiti quando previsto

Mai tramite echo non richiesti.

---

# Principle 5 — Return Codes

Le funzioni devono utilizzare le convenzioni UNIX.

Successo

return 0

Errore

return 1

Quando possibile utilizzare direttamente il return code dei comandi di sistema.

---

# Principle 6 — Simplicity First

Preferire sempre la soluzione più semplice.

Non introdurre codice aggiuntivo quando il comportamento è già fornito correttamente dalla piattaforma.

---

# Principle 7 — Trust the Platform

Quando Bash o il sistema operativo forniscono già un comportamento corretto e stabile, il DevKit deve riutilizzarlo.

Esempi:

mkdir -p

[[ -e ]]

[[ -f ]]

[[ -d ]]

cp

mv

rm

Non duplicare controlli inutili.

---

# Principle 8 — Idempotency

Le operazioni devono essere idempotenti quando possibile.

Esempio:

create_directory()

deve poter essere chiamata più volte senza produrre errori se lo stato desiderato è già raggiunto.

---

# Principle 9 — Deterministic Behaviour

Una funzione deve produrre sempre lo stesso risultato a parità di input.

Non devono esistere effetti collaterali nascosti.

---

# Principle 10 — Standard Module Layout

Ogni modulo deve seguire la stessa struttura.

Shebang

Header

Load Guard

Readonly Constants

Private Functions

Public API

---

# Principle 11 — Testability

Ogni API pubblica deve essere facilmente testabile.

Ogni nuova funzione deve essere accompagnata da:

- Syntax Check
- Manual Test
- Automated Test

---

# Principle 12 — Certification Workflow

Nessuna funzione può essere considerata completata senza aver superato il processo di certificazione.

Workflow ufficiale:

Design

↓

Implementation

↓

Syntax Check

↓

Manual Test

↓

Automated Test

↓

Code Review

↓

CERTIFIED

---

# Principle 13 — Consistency

Tutte le API devono utilizzare:

- naming uniforme
- documentazione uniforme
- commenti uniformi
- comportamento uniforme

La prevedibilità è una caratteristica fondamentale del DevKit.

---

# Final Rule

Ogni nuova API deve essere semplice da capire senza leggere il codice interno.

L'interfaccia pubblica rappresenta la documentazione principale del Phoenix DevKit.