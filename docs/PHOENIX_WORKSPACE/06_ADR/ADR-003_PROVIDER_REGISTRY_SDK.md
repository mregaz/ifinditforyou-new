# ADR-003
# Provider Registry

Status: Accepted

Date: 15 July 2026

---

# Decision

Il Registry rappresenta l'unica sorgente ufficiale della configurazione provider.

Ogni provider dichiara:

id

priority

enabled

countries

languages

categories

capabilities

Il Finder Engine non mantiene alcuna lista statica.

---

# Consequences

Aggiungere un provider significa solamente registrarlo.

Nessun altro componente deve essere modificato.

---

# Status

Accepted.