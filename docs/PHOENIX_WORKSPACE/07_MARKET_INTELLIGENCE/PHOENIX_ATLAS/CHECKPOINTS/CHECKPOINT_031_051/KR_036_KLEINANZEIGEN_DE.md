# PHOENIX ATLAS — KNOWLEDGE RECORD 036

## Kleinanzeigen.de — Germany

- Tracker ID: 36
- Country: Germany
- Vertical: Horizontal classifieds / second-hand / local commerce
- Canonical domain: https://www.kleinanzeigen.de/
- Operator: kleinanzeigen.de GmbH
- Lifecycle: ACTIVE
- Research date: 2026-08-01
- Decision: GO STRATEGICO CONDIZIONATO — written authorization / partnership required for search collection
- Integration priority: VERY HIGH
- Indicative Strategic Score: 96 / 100

## Executive Summary

Kleinanzeigen is one of Germany's largest online classifieds platforms. Its official current company page reports more than 32 million monthly visitors and more than 58 million simultaneously available listings, with predominantly second-hand commerce.

The platform combines local classifieds with messaging, follows/saved searches, recommendation systems, professional seller products, optional payment with buyer protection, shipping integrations and AI-assisted listing creation.

For Phoenix it is a Tier-1 strategic source.

However, its current Terms explicitly prohibit use of crawlers, spiders, scrapers or other automated mechanisms to access the services and collect content without Kleinanzeigen's express written consent. Kleinanzeigen also documents IP blocking for unauthorized automated mechanisms.

Therefore Phoenix must not implement unauthorized production scraping.

The correct route is a formal partnership / written permission / authorized data interface.

## Current scale

Official Kleinanzeigen facts currently report:

- >32 million monthly visitors;
- >58 million simultaneously available listings;
- >291 million app downloads since September 2009;
- >449,000 commercial users in H2 2025 under the company's stated measurement definition.

These are time-bounded official observations.

## Marketplace model

Kleinanzeigen is primarily a contact/discovery marketplace. Its Terms state that it enables users to publish offers and requests, view listings and exchange messages, while Kleinanzeigen itself is not the provider of the advertised products.

Current functionality includes:
- offers and wanted ads;
- local/radius search;
- messaging;
- saved searches;
- favorites/following;
- seller/user ratings;
- professional accounts;
- promoted visibility;
- shipping options;
- optional integrated payment;
- buyer protection for eligible integrated-payment transactions.

Auctions are not supported.

## PD-109 — Payment Protection Depends on Payment Rail

Kleinanzeigen's current payment terms provide buyer protection when the integrated payment function is used.

Its help documentation also states that there is no general buyer protection for ordinary in-person/private deals.

Therefore:

```text
ProtectionEvidence {
  marketplace
  payment_rail
  transaction_mode
  protection_available
  protection_terms
}
```

Trust/protection cannot be attached merely to the marketplace or listing.

The exact transaction rail matters.

This strongly reinforces PD-096 Protection Eligibility Is Listing/Transaction Context.

## PD-110 — Marketplace Transaction Role Can Be Delegated

Kleinanzeigen integrates payment into its product, but the payment-processing contract is performed through a payment service provider.

Current payment terms identify Adyen N.V. as the payment processor.

Recommended:

```text
TransactionRoleEvidence {
  marketplace
  payment_processor
  escrow_or_hold_behavior
  marketplace_coordination_role
  seller_contract_party
  buyer_contract_party
}
```

A marketplace can orchestrate transaction state without itself being the regulated payment processor.

This refines PD-090 Transaction Capability Is a Ladder.

## PD-111 — Ranking Promotion Can Preserve Original Listing Age

Kleinanzeigen's Top Ad product places promoted listings in first/second result positions, rotating them when necessary.

Crucially, official help documentation states that buying Top Ad does not update the listing's original posting date.

This creates useful evidence separation:

```text
ListingVisibilityEvidence {
  source_position
  promotion_type
  promotion_active
  source_published_at
  published_at_mutated_by_promotion
}
```

For Kleinanzeigen Top Ad:

`published_at_mutated_by_promotion = false`

This contrasts with marketplaces where renewal/resurfacing changes apparent recency.

Phoenix must model promotion mechanics per provider rather than assume one universal resurfacing behavior.

## PD-112 — Marketplace AI Can Generate Structured Listing Inputs

Kleinanzeigen currently offers an AI-assisted listing-creation feature on supported mobile categories.

The feature can use the first uploaded image plus optional user hints to propose:
- title;
- category;
- description;
- some attributes when inferable from the proposed title.

The seller still provides/reviews information, and the feature does not currently support every vertical.

Recommended:

```text
ListingContentProvenance {
  field
  source
  ai_generated
  ai_inferred
  user_confirmed
  user_edited
  confidence
}
```

This goes beyond generic AI text provenance because AI can influence **structured marketplace fields**, not only prose.

Phoenix should avoid assuming that source category/title/attributes were necessarily manually entered by the seller.

## PD-113 — Professional Import Interfaces Can Be Vertical-Specific

Kleinanzeigen publicly documents software interfaces/import support for real-estate professionals using OpenImmo.

This is evidence of structured professional ingestion infrastructure, but it does not establish a general-purpose search/export API for Phoenix.

Recommended:

```text
ProfessionalInterface {
  provider
  vertical
  direction
  schema
  eligibility
  commercial_package_required
}
```

For the verified real-estate interface:

```text
vertical = real_estate
direction = professional_software_to_marketplace
schema = OpenImmo
```

This reinforces PD-061 Partner Surface Directionality and shows that access capabilities can vary materially by vertical within one marketplace.

## Recommendation and behavioral intelligence

Kleinanzeigen's Terms state that automated recommendations may use signals such as:
- previous searches;
- browsing behavior;
- location;
- special/time-limited offers.

Phoenix should therefore preserve source recommendation/ranking provenance and not interpret recommended items as organically relevant.

This reinforces behavior-aware ranking discovered earlier in Atlas.

## Professional ecosystem

Kleinanzeigen PRO currently supports category-specific commercial packages for:
- goods;
- vehicles;
- vehicle accessories;
- services;
- jobs.

Professional capabilities include:
- automatic bumping;
- business profile/shop URL;
- listing statistics;
- professional listing management;
- Top Ads and other visibility products.

This creates strong B2B/partnership evidence.

## Access / compliance

Current General Terms explicitly prohibit, without express written consent:
- crawlers;
- spiders;
- scrapers;
- other automated mechanisms used to access Kleinanzeigen services and collect content.

The Terms also prohibit bypassing measures designed to prevent/restrict access and unauthorized reuse/distribution of content.

Kleinanzeigen separately documents temporary IP blocking where unauthorized crawler/spider/scraper activity is detected.

Therefore:

```text
public_html = yes
public_general_search_api = not_identified
professional_import_interfaces = yes, vertical-specific
unauthorized_scraping = EXPLICIT NO-GO
written_permission_route = required
production_provider = disabled until authorized
```

## Strategic partnership questions

Phoenix should eventually ask Kleinanzeigen:

1. Is there a licensed search/catalog API or partner feed?
2. Can third-party comparison/discovery services display listing metadata and deep links?
3. Are delta/update/deletion feeds available?
4. Are professional inventory interfaces available beyond inbound publishing?
5. Can access span goods, vehicles and real estate?
6. What caching/storage rules apply?
7. Can Phoenix receive promotion/ranking provenance?
8. Can transaction/protection eligibility be surfaced programmatically?

## Capability Impact

- horizontal_classifieds_pack
- payment_rail_protection
- delegated_transaction_roles
- provider_specific_promotion_mechanics
- structured_ai_content_provenance
- vertical_specific_professional_interface
- behavior_aware_recommendation
- professional_seller_capabilities

## Reusable DevKit Components

1. `ProtectionEvidenceMapper`
2. `TransactionRoleEvidenceMapper`
3. `ListingVisibilityEvidenceMapper`
4. `ListingContentProvenanceMapper`
5. `ProfessionalInterfaceRegistry`
6. `RecommendationProvenanceMapper`
7. `MarketplaceAccessPolicyGate`
8. `HorizontalClassifiedsCapabilityPack`

## Strategic Score

| Dimension | Score |
|---|---:|
| Germany marketplace relevance | 100 |
| Inventory breadth | 100 |
| Second-hand relevance | 100 |
| Trust/transaction intelligence | 97 |
| Architecture learning | 99 |
| Professional infrastructure | 94 |
| Partnership strategic value | 98 |
| Public search API readiness | 25 |
| Unauthorized scraping suitability | 0 |
| Decision Engine value | 96 |

**Indicative Strategic Score: 96 / 100**

## Final Decision

### GO STRATEGICO CONDIZIONATO — WRITTEN AUTHORIZATION / PARTNERSHIP

Kleinanzeigen is a Tier-1 Phoenix target, but not an unauthorized scraping target.

Most important conclusions:

1. Protection depends on the transaction/payment rail.
2. Marketplaces can orchestrate payments while delegating regulated processing.
3. Promotion mechanics differ by source; Top Ad does not necessarily alter listing age.
4. AI-generated marketplace content can affect structured listing fields.
5. Professional data interfaces may exist only for specific verticals/directions.
6. Kleinanzeigen explicitly requires consent for automated content collection.

## Canonical Discoveries

- PD-109 — Payment Protection Depends on Payment Rail
- PD-110 — Marketplace Transaction Role Can Be Delegated
- PD-111 — Ranking Promotion Can Preserve Original Listing Age
- PD-112 — Marketplace AI Can Generate Structured Listing Inputs
- PD-113 — Professional Import Interfaces Can Be Vertical-Specific

Reinforced:
- PD-009 Protection-Aware Decisioning
- PD-014 Promotion Provenance
- PD-061 Partner Surface Directionality
- PD-065 Commercial Resurfacing ≠ Freshness
- PD-090 Transaction Capability Is a Ladder, Not a Boolean
- PD-092 AI-Generated Source Content Needs Provenance
- PD-096 Protection Eligibility Is Listing/Transaction Context

## Sources

Phoenix tracker:
- PHOENIX_ATLAS_PROVIDER_TRACKER_UPDATED_020.csv — Tracker ID 36 = Kleinanzeigen.de, Germany, general classifieds.

Canonical Discovery continuity:
- KR_035_GOBID_ES.md — PD-104 through PD-108.

Official/current Kleinanzeigen research, 2026-08-01:
- https://themen.kleinanzeigen.de/ueber-uns/
- https://themen.kleinanzeigen.de/nutzungsbedingungen/
- https://www.kleinanzeigen.de/bezahlfunktion-nutzungsbedingungen
- https://hilfe.kleinanzeigen.de/hc/de/articles/17121075228828-Wie-funktioniert-Kleinanzeigen
- https://themen.kleinanzeigen.de/ip-eingeschraenkt/
- https://hilfe.kleinanzeigen.de/hc/de/articles/21292312320412-Was-ist-die-KI-Beschreibungsfunktion-und-wie-nutze-ich-sie
- https://themen.kleinanzeigen.de/pro-infopoint/
- Kleinanzeigen professional-interface documentation for OpenImmo real-estate imports
- Kleinanzeigen Top Ad help documentation

This is a strategic/technical assessment, not legal advice.
