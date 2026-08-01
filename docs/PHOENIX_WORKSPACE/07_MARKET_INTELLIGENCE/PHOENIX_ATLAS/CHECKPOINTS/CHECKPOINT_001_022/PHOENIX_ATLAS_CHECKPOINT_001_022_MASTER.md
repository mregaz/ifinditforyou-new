# PHOENIX ATLAS — CHECKPOINT 001–022

**Checkpoint date:** 2026-08-01  
**Purpose:** Consolidate the first Atlas research block, reconcile tracker state, preserve discoveries, and identify missing records without inventing data.

## Executive Status

The checkpoint found that the visible progress counter and the original marketplace tracker were using different numbering concepts.

There are three distinct identifiers:

1. **Tracker ID** — fixed marketplace ID in the 61-source catalog.
2. **Research Record sequence** — order in which dossiers/knowledge records were produced.
3. **Discovery ID (PD-xxx)** — cross-project intelligence ledger.

These MUST remain separate.

## Verified research records available

| Research Record | Marketplace | Tracker ID | Status |
|---|---|---:|---|
| 001 | Subito.it | 1 | Archived dossier available |
| 002 | Bakeca.it | 2 | Archived dossier available |
| 010 | Catawiki | 10 | Archived dossier available |
| 011 | Leboncoin | 11 | Archived dossier available |
| 012 | Vinted | 59 | Archived dossier available |
| 013 | Vivastreet.fr | 12 | Archived dossier available |
| 014 | ParuVendu.fr | 13 | Archived dossier available |
| 015 | Topannonces.fr | 14 | Archived dossier available |
| 016 | Economique.fr | 15 | Archived dossier available |
| KR-017 | Locanto.fr | 16 | Archived knowledge record available |
| KR-018 | eBay.fr | 17 | Archived knowledge record available |
| KR-019 | Milanuncios.com | 18 | Archived knowledge record available |
| KR-020 | Wallapop | 19 | Archived knowledge record available |
| KR-021 | Trovit.es | 20 | Archived/current dossier available |
| 021-family | Mitula | 21 | Research completed in chat; standalone dossier not yet archived |
| 022 | Anuto | 22 | Current dossier available |

## Gaps

Tracker IDs **3–9** do not currently have verified archived PAA dossiers in the File Library checkpoint evidence:

- 3 Kijiji.it
- 4 Secondamano.it
- 5 AnnunciPrivati.com
- 6 Immobiliare.it
- 7 Casa.it
- 8 Idealista.it
- 9 eBay.it

These entries MUST NOT be marked completed until their original research is recovered or a controlled reconstruction is performed.

## Verified state for tracker IDs 1–22

- Evidenced as completed/researched: **15**
- Evidenced gap requiring recovery/reconstruction: **7**
- Archived/non-operational among completed records: **1** (Economique.fr)
- Additional completed strategic record outside tracker IDs 1–22: **Vinted (tracker ID 59)**

Therefore, the earlier conversational label “22/61” should NOT be interpreted as verified contiguous completion of tracker IDs 1 through 22.

## Strategic synthesis

The first research block has already established several core Phoenix architecture themes:

- permissioned provider architecture;
- source ranking provenance;
- behavior-aware ranking;
- reputation provenance;
- protection-aware decisioning;
- search/transaction separation;
- vertical heterogeneity;
- personal-data minimization;
- universal listing envelope;
- vertical capability packs;
- provider-family architecture;
- lifecycle intelligence;
- global replicated marketplace networks;
- service-eligibility matrices;
- corporate portfolio intelligence;
- local-first to networked commerce;
- aggregator/competitor duality;
- marketplace-surface migration;
- renewal-aware freshness;
- cross-marketplace provenance.

## Architectural conclusion

Phoenix Atlas is no longer a list of marketplaces.

It is becoming a structured intelligence system describing:

```text
Marketplace Identity
  ↓
Lifecycle
  ↓
Access / Compliance
  ↓
Provider Family / Corporate Group
  ↓
Data Model / Vertical Capabilities
  ↓
Trust / Protection / Reputation
  ↓
Provenance / Deduplication
  ↓
Knowledge
  ↓
Decision Intelligence
```

## Checkpoint rule going forward

Every future Atlas record must include:

- tracker_id
- research_record_id
- canonical marketplace identity
- current domain/surface
- lifecycle state
- provider family / corporate group
- access mode
- final decision
- discovery IDs
- reusable DevKit components
- ADR candidates
- source/evidence timestamp

And before every new marketplace:

1. validate current marketplace existence;
2. verify tracker identity;
3. check for provider-family reuse;
4. check for prior research;
5. allocate Discovery IDs from the canonical ledger only.

## Next Atlas marketplace

After reconciliation, the next unresearched tracker entry after ID 22 is:

**ID 23 — Clasf (Spain)**

However, the recommended operational sequence is:

1. preserve this checkpoint;
2. recover/reconstruct IDs 3–9 later as a dedicated gap-repair operation;
3. continue forward with ID 23 to avoid blocking the current research stream.
