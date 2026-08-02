# PHOENIX ATLAS — KNOWLEDGE RECORD 031

## Yaencontre.com — Spain

- Tracker ID: 31
- Country: Spain
- Vertical: Real estate
- Canonical domain: https://www.yaencontre.com/
- Current owner/operator: Idealista, S.A.U.
- Provider family: idealista
- Lifecycle: ACTIVE
- Research date: 2026-08-01
- Decision: GO STRATEGICO — treat as an idealista-family surface; permissioned integration only
- Integration priority: HIGH for family intelligence, conditional for independent inventory
- Indicative Strategic Score: 91 / 100

## Executive Summary

Yaencontre remains an active Spanish real-estate search surface, but its current General Terms identify Idealista, S.A.U. as the owner of the web and apps.

This changes the Phoenix classification materially.

Yaencontre should not be treated as a fully independent provider immediately after idealista.com. It should be modeled as a distinct marketplace surface inside the broader idealista provider family until inventory, account, ranking, professional tooling and data relationships are mapped precisely.

Its search experience includes map search, structured filters, relevance ranking, alerts, favorites, fraud/error reporting and professional agency surfaces.

Current Terms also reveal substantial shared idealista governance and trust infrastructure, including machine-learning/AI moderation and tokenized user email interactions.

No separate public Yaencontre search API or export feed suitable for Phoenix was identified in this research.

## Ownership evidence

Current General Terms, updated 30 April 2025, state that Yaencontre's Web and Apps are owned by Idealista, S.A.U.

Recommended Phoenix model:

```text
ProviderFamily: idealista
├── idealista.com
└── yaencontre.com
```

This is ownership-level family evidence, stronger than visual similarity or cross-linking.

## PD-085 — Corporate Ownership Does Not Collapse Surface Identity

Two marketplaces owned by the same company may remain distinct user-facing surfaces.

Phoenix must preserve both:

```text
ProviderFamily
  └── MarketplaceSurface
      ├── brand
      ├── domain
      ├── search_behavior
      ├── inventory_relationship
      ├── ranking_policy
      ├── user_features
      └── access_policy
```

Do not automatically merge Yaencontre and idealista listings merely because ownership is shared.

First determine whether inventory is:
- identical;
- partially syndicated;
- independently sourced;
- differently ranked;
- differently enriched.

## PD-086 — Shared Governance Is Provider-Family Evidence

Yaencontre's current Terms explicitly describe idealista governance mechanisms including:
- moderation teams;
- machine-learning and AI detection;
- multimedia/text recognition;
- interaction monitoring;
- account/content enforcement.

This suggests that provider-family reuse can exist at the trust/governance layer even when consumer brands remain distinct.

Recommended capability:

```text
ProviderFamilySharedCapability {
  family
  capability
  applies_to_surface[]
  evidence
  observed_at
}
```

Possible shared capabilities:
- moderation;
- fraud detection;
- privacy;
- advertiser policy;
- ranking governance;
- identity/contact protection.

## PD-087 — Privacy-Preserving Contact Relay Is Trust Infrastructure

Yaencontre's Terms describe tokenization of user email addresses so interactions can occur without exposing the real email address.

Recommended Phoenix capability:

```text
ContactPrivacyCapability {
  direct_email_exposed
  tokenized_email
  internal_messaging
  monitored_interaction
}
```

This is a stronger trust signal than merely having a contact form.

It reinforces Personal-Data Minimization.

## PD-088 — Source Relevance Ranking Can Encode Quality Signals

Yaencontre documents default relevance ranking using signals including:
- publication date;
- completeness/quality of listing information;
- visibility of property location;
- advertiser type;
- energy certificate and other characteristics.

Therefore source ranking is not purely chronological.

Phoenix should preserve ranking-method evidence:

```text
SourceRankingMethod {
  provider
  ranking_mode
  publication_recency
  content_completeness
  location_quality
  seller_type
  certification_signals
  commercial_signals_known
}
```

Phoenix should still calculate its own Decision Score rather than inherit source relevance.

## Search and user capabilities

Current help documentation supports:
- map-drawn geographic search;
- filters for operation, property type, location, price, rooms, surface and equipment;
- sorting by relevance, price, publication date and surface;
- favorites;
- alerts;
- reporting sold/rented listings;
- reporting location errors;
- fraud/suspicion reporting.

This creates rich source-native evidence for freshness and quality workflows.

## Professional seller surface

Current agency pages expose:
- agency identity;
- location/address;
- listing count;
- phone/contact;
- optional website;
- agency inventory.

Phoenix can use this as seller/professional evidence without assuming that all exposed contact data should be collected.

## Historical professional tooling

Older Yaencontre material documents a professional product called Localgest with valuation, portfolio and contact-management capabilities.

This is historical evidence, not proof that Localgest remains a current product.

It demonstrates that Yaencontre has long operated as more than a consumer listing portal, but current capability decisions must rely on current surfaces.

## Access / compliance

Current Terms prohibit commercial exploitation or use/disposition of information outside the intended Yaencontre services and protect site/database/content rights.

No separate public Yaencontre search API or public export feed was identified.

Because the surface is owned by idealista and current use restrictions are strong, Phoenix should classify production access conservatively:

```text
public_html = yes
public_search_api = not_identified
public_export_feed = not_identified
provider_family_official_data_services = yes (idealista family)
yaencontre_specific_license = not_verified
unauthorized_production_collection = disabled
recommended_route = family-level commercial/API discussion
```

The existence of idealista data/API services does not automatically license Yaencontre inventory.

## Strategic implication for Phoenix partnerships

When contacting idealista, Phoenix should not ask only about idealista.com.

The partnership request should explicitly ask:

1. Does the licensed inventory/data scope include Yaencontre?
2. Are Yaencontre and idealista inventories technically distinct?
3. Is there cross-publication or syndication between the two?
4. Are identifiers shared across surfaces?
5. Are ranking/quality signals available via API?
6. Can a single commercial agreement cover multiple idealista-owned surfaces?
7. What deduplication rights/requirements apply across family surfaces?

This can convert a one-provider negotiation into a provider-family negotiation.

## Capability Impact

- corporate_provider_family
- marketplace_surface_identity
- family_shared_governance
- contact_privacy_capability
- source_ranking_method
- professional_seller_surface
- family_level_license_scope
- cross_surface_deduplication
- real_estate_vertical_pack

## Reusable DevKit Components

1. `CorporateProviderFamilyRegistry`
2. `MarketplaceSurfaceRegistry`
3. `ProviderFamilySharedCapabilityRegistry`
4. `ContactPrivacyCapabilityMapper`
5. `SourceRankingMethodMapper`
6. `CrossSurfaceInventoryResolver`
7. `FamilyLicenseScopeRegistry`
8. `ProfessionalSellerEvidenceMapper`
9. `RealEstateCapabilityPack`

## AI / Decision Engine Opportunities

Phoenix can use source-native evidence while remaining independent:
- infer stale/sold inventory from reports and observation;
- compare source relevance with Phoenix Decision Score;
- deduplicate across idealista-family surfaces;
- detect conflicting property attributes across surfaces;
- preserve advertiser/professional evidence;
- combine authorized family market intelligence with listings.

## Strategic Score

| Dimension | Score |
|---|---:|
| Spain real-estate relevance | 94 |
| Corporate-family intelligence | 100 |
| Architecture learning | 98 |
| Trust/governance intelligence | 96 |
| Ranking intelligence | 94 |
| Separate API readiness | 30 |
| Family partnership leverage | 98 |
| Decision Engine value | 92 |

Indicative Strategic Score: 91 / 100.

## Final Decision

GO STRATEGICO — IDEALISTA FAMILY SURFACE.

Yaencontre should not be implemented as a blindly independent scraper/provider.

First treat it as a distinct surface in the idealista corporate provider family and pursue family-level authorization/data discussions.

Most important conclusion:

> Provider consolidation must happen at the corporate/capability layer without erasing marketplace-surface identity.

Phoenix needs both:
- family-level reuse and licensing;
- surface-level provenance, ranking and deduplication.

## Canonical Discoveries

- PD-085 — Corporate Ownership Does Not Collapse Surface Identity
- PD-086 — Shared Governance Is Provider-Family Evidence
- PD-087 — Privacy-Preserving Contact Relay Is Trust Infrastructure
- PD-088 — Source Relevance Ranking Can Encode Quality Signals

Reinforced:
- PD-014 Promotion Provenance
- PD-015 Personal-Data Minimization
- PD-056 Trust Evidence, Not Trust Score
- PD-059 Cross-Country Provider Family
- PD-080 Provider Can Be Both Inventory Source and Intelligence Source

## Sources

Current official/current web research, 2026-08-01:
- https://www.yaencontre.com/
- https://www.yaencontre.com/condiciones-generales
- https://www.yaencontre.com/ayuda/contacto
- https://www.yaencontre.com/ayuda/busqueda-de-vivienda
- https://www.yaencontre.com/ayuda/busqueda-de-vivienda/como-buscar-en-yaencontre
- https://www.yaencontre.com/ayuda/busqueda-de-vivienda/como-ordenamos-los-resultados
- current Yaencontre professional agency pages

Historical source used only as historical evidence:
- Yaencontre article on Localgest professional software (2013)

Phoenix continuity:
- KR_030_IDEALISTA_ES.md
- Checkpoint 023–030 Discovery Ledger ending at PD-084

This is a strategic/technical assessment, not legal advice.
