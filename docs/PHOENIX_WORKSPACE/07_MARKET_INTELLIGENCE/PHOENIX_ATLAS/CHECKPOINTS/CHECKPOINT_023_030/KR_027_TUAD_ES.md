# PHOENIX ATLAS — KNOWLEDGE RECORD 027

## Tuad.es

- Tracker ID: 27
- Country: Spain
- Canonical domain: https://tuad.es
- Lifecycle: ACTIVE
- Marketplace type: Horizontal classifieds / local contact marketplace
- Operator: Eduard Dalmau (self-employed), Girona, Spain
- Founded/site copyright lineage: 2013–2026
- Research date: 2026-08-01
- Decision: GO STRATEGICO CONDIZIONATO — partnership/API discussion strongly recommended
- Integration priority: MEDIUM-HIGH
- Indicative Strategic Score: 88 / 100

## Executive Summary

Tuad is an active Spanish classifieds marketplace with four current top-level verticals: Real Estate, Vehicles, Products and Services.

It offers local search, online chat, email alerts, professional plans, VIP accounts, promoted listings and automatic XML publication.

The strategically exceptional finding is that Tuad now advertises an AI-based search layer. Its public LinkedIn profile states that it deployed conversational natural-language search using the ChatGPT API, with examples such as searching for a family car under a budget in Barcelona or a furnished apartment near the center.

For Phoenix this changes Tuad's role:

Tuad is not only a potential provider. It is also a small but direct product-pattern competitor demonstrating that conversational AI search is already entering classifieds.

## Current product surface

The current homepage exposes:
- AI-based search;
- Real Estate;
- Vehicles;
- Products;
- Services;
- latest listings;
- promoted listings;
- PRO plans;
- VIP accounts;
- XML automatic publication;
- local-area discovery;
- per-listing chat;
- email alerts;
- AI functions.

Current listing pages distinguish professional sellers and can expose seller inventory counts and ratings.

## Professional XML ingestion

Tuad documents XML feed ingestion for professional users.

Supported feed families include:
- Real Estate — Tuad format and Kyero;
- Vehicles — Tuad format;
- Products — Tuad format;
- Services — Tuad format.

The professional account supplies a feed URL that Tuad imports.

Direction:

publisher/professional -> XML feed -> Tuad

This reinforces PD-061 Partner Surface Directionality.

It is not evidence of a public Tuad-to-Phoenix export feed.

## PD-069 — AI-Native Marketplace Search

Marketplace search itself is evolving from keyword/filter search to conversational intent interpretation.

Recommended Phoenix capability model:

```text
MarketplaceSearchCapability {
  keyword_search
  structured_filters
  natural_language_search
  conversational_search
  ai_query_interpretation
  recommendation_layer
}
```

This capability must be tracked in competitive intelligence.

Strategic implication:
Phoenix cannot assume that "AI search" alone is a durable moat.

Phoenix differentiation must continue upward into cross-source knowledge and decision intelligence.

## PD-070 — Competitor Capability Convergence

A marketplace can progressively acquire capabilities that were previously part of Phoenix's differentiation.

Recommended model:

```text
CompetitorCapabilityTimeline {
  marketplace
  capability
  first_observed_at
  evidence
  strategic_overlap
}
```

Examples:
- conversational search;
- AI query interpretation;
- recommendations;
- alerts;
- seller trust;
- price intelligence.

Phoenix Atlas should therefore measure not only who competitors are, but how quickly their capability sets converge toward Phoenix.

## PD-071 — Feed Schema Interoperability Signal

Tuad supports its own XML format and, for real estate, the external Kyero format.

This proves that a marketplace can accept both proprietary and ecosystem-standard schemas.

Recommended Phoenix model:

```text
FeedSchemaCapability {
  provider
  vertical
  schema_name
  schema_owner
  direction
  documentation_available
}
```

Strategic implication:
Phoenix DevKit should avoid assuming one proprietary feed schema per provider. A reusable schema-adapter layer can create leverage across providers.

## PD-072 — Free-Tier Inventory Visibility Limits

Tuad limits publicly active free listings per main category for ordinary users:
- Real Estate: 5
- Vehicles: 5
- Products: 10
- Services: 5.

Users may have more listings but swap which ones are publicly active. Professionals can use PRO features and XML publication.

This means observed public seller inventory may be lower than the seller's actual inventory.

Recommended evidence:

```text
SellerInventoryEvidence {
  visible_listing_count
  visibility_limit_known
  account_tier
  hidden_inventory_possible
}
```

Therefore:
`visible_listing_count != total_seller_inventory`.

## Marketplace role

Tuad states that it is not owner of listed items and does not participate in transactions between users.

Classification:

```text
accepts_direct_listings = true
provides_search = true
ai_search = true
provides_chat = true
provides_alerts = true
supports_promotions = true
supports_professional_accounts = true
supports_xml_import = true
handles_transaction = false
```

## Trust and seller evidence

Current listing pages expose signals such as:
- Professional;
- seller name;
- seller listing count;
- ratings/no ratings.

Phoenix should preserve these as source-native trust evidence rather than converting them immediately into a universal score.

## Geographic architecture

Tuad emphasizes local discovery ("Encuentra en tu zona").

Phoenix should preserve hierarchical geography and distinguish local proximity from country-level availability.

## Access / integration assessment

Verified:
- public search/listing surfaces;
- professional XML import;
- documented XML schemas/examples;
- AI-based search;
- professional contact channel.

Not verified:
- open public search API;
- public export feed;
- authorized Phoenix inventory API.

Recommended approach:
contact Tuad before production integration and specifically ask whether its existing professional integration infrastructure can support an authorized outbound/search feed or API relationship.

Because Tuad is a small operator with visible technical integration infrastructure, it may be a particularly realistic early partnership target compared with much larger marketplaces.

## Strategic importance to Phoenix

Tuad validates several Phoenix assumptions:
1. conversational search is useful in classifieds;
2. XML professional feeds remain operationally relevant;
3. marketplace search is becoming AI-assisted;
4. source-native AI will reduce the differentiation of a simple AI search box;
5. Phoenix must win through cross-marketplace intelligence, provenance, knowledge and decision support.

Recommended positioning:

```text
Tuad:
single-marketplace AI search

Phoenix:
cross-marketplace acquisition
+ semantic normalization
+ provenance
+ knowledge
+ comparison
+ decision intelligence
```

## Capability Impact

- ai_native_marketplace_search
- competitor_capability_timeline
- conversational_search_capability
- feed_schema_interoperability
- xml_schema_adapter
- seller_inventory_visibility_policy
- professional_account_capability
- partner_surface_direction
- seller_trust_evidence
- local_discovery

## Reusable DevKit Components

1. MarketplaceSearchCapabilityRegistry
2. CompetitorCapabilityTimeline
3. FeedSchemaRegistry
4. XMLSchemaAdapter
5. SellerInventoryVisibilityMapper
6. PartnerSurfaceDirectionMapper
7. SellerTrustEvidenceMapper
8. HierarchicalLocationMapper
9. MarketplaceAICapabilityDetector
10. PartnershipCandidateScorer

## AI Opportunities

Tuad itself already demonstrates AI-assisted query interpretation.

Phoenix should concentrate AI investment on higher-order functions:
- cross-source entity resolution;
- duplicate detection;
- provenance;
- price comparison;
- trust synthesis;
- historical context;
- opportunity scoring;
- explainable recommendation;
- decision support.

## Strategic Score

| Dimension | Score |
|---|---:|
| Spain relevance | 70 |
| Architecture learning | 96 |
| AI competitive intelligence | 100 |
| Partnership accessibility | 90 |
| XML/feed maturity | 92 |
| Open search API readiness | 35 |
| Decision Engine relevance | 96 |
| Provider priority | 72 |

Indicative Strategic Score: 88 / 100.

## Final Decision

GO STRATEGICO CONDIZIONATO.

Tuad should be retained both as:
- a potential authorized Spanish provider/partner;
- a competitive benchmark for AI-native classifieds search.

It may be unusually suitable for an early Phoenix partnership approach because:
- it is an independent/small operator;
- it has documented professional XML infrastructure;
- it actively develops AI search;
- it already works with external feed formats;
- its product direction overlaps Phoenix enough to make a technical conversation meaningful.

Most important conclusion:

> Conversational AI search is becoming a marketplace feature, not a defensible category by itself.

Phoenix's moat must remain:
Acquisition -> Semantic Understanding -> Knowledge -> Decision Intelligence.

## Canonical Discoveries

- PD-069 — AI-Native Marketplace Search
- PD-070 — Competitor Capability Convergence
- PD-071 — Feed Schema Interoperability Signal
- PD-072 — Free-Tier Inventory Visibility Limits

Reinforced:
- PD-015 Personal-Data Minimization
- PD-048 Publisher Traffic Exchange
- PD-056 Trust Evidence, Not Trust Score
- PD-061 Partner Surface Directionality
- PD-064 Professional Publishing Channel

## Sources

Current web research, 2026-08-01:
- https://tuad.es/
- https://tuad.es/my_ads/publish
- https://tuad.es/pages/technical_support_help
- https://tuad.es/pages/legal_warning
- Tuad official LinkedIn company page and current product updates

Phoenix evidence:
- marketplaces_europe.csv
- PHOENIX_ATLAS_CHECKPOINT_001_022_MASTER.md
- KR_024_LOCANTO_ES.md
- KR_025_TABLONDEANUNCIOS_ES.md
- KR_026_ANUNCIOS_ES.md
