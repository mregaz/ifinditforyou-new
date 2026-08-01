# PHOENIX ATLAS — GAPS & RECONCILIATION

## 1. Missing dossier block

The following tracker records do not currently have verified archived PAA files in the available File Library evidence:

| Tracker ID | Marketplace | Current action |
|---:|---|---|
| 3 | Kijiji.it | Recover prior research or reconstruct |
| 4 | Secondamano.it | Recover prior research or reconstruct |
| 5 | AnnunciPrivati.com | Recover prior research or reconstruct |
| 6 | Immobiliare.it | Recover prior research or reconstruct |
| 7 | Casa.it | Recover prior research or reconstruct |
| 8 | Idealista.it | Recover prior research or reconstruct |
| 9 | eBay.it | Recover prior research or reconstruct |

## 2. Mitula

Mitula research was completed conversationally, but a standalone archived dossier was not found during this checkpoint.

Action:
- create canonical `KR_022_MITULA.md` during the next consolidation pass;
- preserve its role as part of the LIFULL Connect family;
- use canonical Discovery IDs PD-050 through PD-052.

## 3. Numbering problem found

The project has mixed:
- tracker IDs,
- research record IDs,
- discovery IDs.

This caused apparent progress inflation and Discovery-ID collisions.

### Corrective rule

Never derive one identifier from another.

Recommended metadata:

```yaml
tracker_id: 20
research_record_id: KR-021
marketplace: Trovit.es
discovery_ids:
  - PD-046
  - PD-047
  - PD-048
  - PD-049
```

## 4. Trovit collision

Legacy/current Trovit dossier contains local PD labels overlapping Milanuncios.

Canonical replacements:
- old/local PD-037 -> PD-046
- old/local PD-038 -> PD-047
- old/local PD-039 -> PD-048
- old/local PD-040 -> PD-049

## 5. Mitula collision

Conversation-local Mitula labels overlapped Wallapop.

Canonical replacements:
- old/local PD-042 -> PD-050
- old/local PD-043 -> PD-051
- old/local PD-044 -> PD-052

## 6. Anuto collision

Current Anuto dossier overlaps Wallapop/Trovit numbering.

Canonical replacements:
- old/local PD-045 -> PD-053
- old/local PD-046 -> PD-054
- old/local PD-047 -> PD-055
- old/local PD-048 -> PD-056

## 7. Progress interpretation

Do not use “22/61” as a claim that tracker IDs 1–22 are all complete.

Current evidence:
- 15 of tracker IDs 1–22 are researched/completed/archived;
- 7 require recovery/reconstruction;
- Vinted (tracker ID 59) is additionally complete.

## 8. Recommendation

Continue the forward research stream with tracker ID 23 (Clasf), while treating IDs 3–9 as a separate **Atlas Gap Repair Sprint**.

This preserves momentum without losing data integrity.
