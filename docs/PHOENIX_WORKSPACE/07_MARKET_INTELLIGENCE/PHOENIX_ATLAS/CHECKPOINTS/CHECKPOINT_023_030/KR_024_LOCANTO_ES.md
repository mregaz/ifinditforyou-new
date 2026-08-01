# PHOENIX ATLAS — KNOWLEDGE RECORD 024

## Locanto.es

- Tracker ID: 24
- Country: Spain
- Operator: Yalwa GmbH
- Provider Family: Locanto Global Network
- Pattern: Global Replicated Classifieds Network
- Research type: REUSE / LOCALE DIFFERENTIAL
- Decision: GO CONDIZIONATO — shared Locanto core + Spain locale/policy pack
- Indicative Strategic Score: 84 / 100
- Research date: 2026-08-01

## Reuse from Locanto.fr

Locanto.fr already established the shared provider-family model:
SharedGlobalCore + SharedTaxonomy + SharedComplianceBaseline + Locale Adapters.

Existing discoveries reused:
- PD-031 Global Replicated Marketplace Network
- PD-032 Locale Adapter Architecture
- PD-033 Sensitive Vertical Isolation
- PD-034 Marketplace Network Reuse Index
- PD-035 Partner Surface as Access Signal

Locanto.es does not justify a separate provider implementation.

## Spain-specific findings

Locanto Spain exposes broad categories including Buy/Sell, Community, Personals/Dating, Events, Industrial, Real Estate, Services, Jobs, Vehicles and Classes.

Its navigation is strongly geographic:
Spain → Autonomous Community → City/Municipality → Category → Listing.

Recommended Phoenix structure:

```text
LocationEvidence {
  country
  admin_level_1
  municipality
  locality
  source_label
  source_url
}
```

Sensitive/personals categories remain present, so Sensitive Vertical Isolation remains mandatory.

## Terms / compliance

The Spanish Terms identify Yalwa GmbH as operator and state that:
- Locanto provides the publishing platform;
- Yalwa is not party to user transactions;
- users are responsible for listing content;
- duplicate listings are prohibited;
- copying other users' listing content is prohibited;
- copying personal information without consent is prohibited;
- bypassing access restrictions is prohibited;
- excessive infrastructure load is prohibited;
- adult/personals access requires users to be at least 18 and legally eligible.

The Terms also state that listings may be published on Locanto and other Yalwa-owned websites.

## DSA scale evidence

Current Spanish Terms disclose an EU average of 2.42 million monthly active users for March 2025–January 2026.

This should be stored as time-bounded regulatory evidence.

## Critical new finding — XML partner feed

Locanto Spain exposes an official XML partner surface for external publishers to send listings into Locanto.

Observed characteristics:
- more than 1,000 listings required;
- supported verticals include vehicles, real estate, events and jobs;
- daily updates;
- periodic feed validation;
- traffic benefits for publishers.

Important:
This is an INBOUND feed into Locanto, not evidence of an export API/feed from Locanto to Phoenix.

## PD-061 — Partner Surface Directionality

A partnership/feed surface must record direction.

```text
PartnerSurface {
  provider
  surface_type
  data_direction
  commercial_direction
  supported_categories
  minimum_volume
  authorization_required
}
```

Possible values:
- publisher_to_marketplace
- marketplace_to_partner
- bidirectional
- referral_only
- unknown

For the verified Locanto Spain XML surface:
`data_direction = publisher_to_marketplace`

This prevents Phoenix from misreading every "partner/feed" page as a data-acquisition API.

## Reinforcement — Network syndication

The Terms allow listings to be published across Yalwa-owned sites, reinforcing:
- provider family architecture;
- cross-network duplicate risk;
- canonical-source ambiguity;
- family-level provenance.

Potential chain:
Original Publisher → XML → Locanto Spain → Yalwa network → Phoenix.

## Capability Impact

- locanto_global_provider
- spain_locale_adapter
- spain_policy_pack
- hierarchical_location_mapper
- sensitive_vertical_gate
- provider_network_registry
- family_syndication_provenance
- partner_surface_registry
- partner_surface_direction
- regulatory_scale_evidence
- feed_capability_metadata

## Reusable DevKit components

1. LocantoGlobalProvider
2. LocantoLocaleAdapter
3. LocantoSpainPolicyPack
4. HierarchicalLocationMapper
5. SensitiveVerticalGate
6. ProviderNetworkRegistry
7. PartnerSurfaceDirectionMapper
8. FeedCapabilityRegistry
9. RegulatoryEvidenceRegistry
10. FamilySyndicationResolver

## Access assessment

```text
public_search = available
public_detail = available
official_open_search_api = not_identified
partner_surface = verified
partner_surface_direction = inbound_to_locanto
xml_import = verified
xml_export_for_phoenix = not_verified
production_automation = requires legal/policy review
personal_contact_collection = forbidden_by_default
sensitive_vertical_ingestion = disabled_by_default
```

## Architecture decision

Do not create separate France and Spain providers.

Create one LocantoGlobalProvider with SharedCore, SharedTaxonomy, SharedCompliance and locale-specific configuration/policy packs.

## Final decision

GO CONDIZIONATO — FAMILY ADAPTER.

The principal new contribution is PD-061 — Partner Surface Directionality.

The official XML program proves structured feed infrastructure exists, but the verified flow is publisher → Locanto, not Locanto → Phoenix.

## Sources

- https://www.locanto.es/
- https://www.locanto.es/madrid/
- https://www.locanto.es/barcelona/
- https://www.locanto.es/g/info/terms/
- https://www.locanto.es/g/info/partner/
- Phoenix source: KR_017_LOCANTO_FR.md
