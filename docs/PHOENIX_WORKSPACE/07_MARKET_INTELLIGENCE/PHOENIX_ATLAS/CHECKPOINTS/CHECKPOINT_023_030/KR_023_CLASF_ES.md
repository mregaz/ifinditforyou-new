# PHOENIX ATLAS — KNOWLEDGE RECORD 023

## Clasf.es

- Tracker ID: 23
- Country: Spain
- Marketplace type: Hybrid classifieds / aggregator
- Lifecycle: ACTIVE
- Research date: 2026-08-01
- Decision: GO CONDIZIONATO
- Indicative Strategic Score: 82 / 100

## Strategic findings

Clasf combines direct user listings with listings indexed from publicly accessible external websites. Phoenix must therefore distinguish the surface where a listing is found from its underlying origin.

Recommended provenance:
```text
listing_source = Clasf
origin_source = Clasf | external
origin_known = true | false
```

Clasf behaves as a hybrid marketplace, search surface and content aggregator. Phoenix taxonomy should therefore use capabilities rather than mutually exclusive source labels.

The Clasf international network also reinforces Provider Family architecture and locale reuse.

Clasf states that directly published listings are moderated, which can be preserved as Source Quality Evidence without converting it into a guarantee of listing trustworthiness.

No public general-purpose search API was identified during the research. A partnership surface exists, but a Phoenix-suitable authorized feed/API was not verified.

## Canonical Discoveries

- PD-057 — Mixed-Origin Marketplace
- PD-058 — Marketplace-as-Aggregator Hybrid
- PD-059 — Cross-Country Provider Family
- PD-060 — Moderation as Data Quality Signal

## Final Decision

GO CONDIZIONATO.

Clasf is strategically useful for provenance, hybrid-source classification and provider-family reuse. Production integration requires a separate access/permission check.
