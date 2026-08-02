# PHOENIX ATLAS — KNOWLEDGE RECORD 034

## Bidspirit Spain

- Tracker ID: 34
- Country: Spain / global auction network
- Vertical: Auctions / art / collectibles / jewelry / books / coins and specialist categories
- Canonical Spain surface: https://es.bidspirit.com/
- Operator: Bidspirit (R.A) Ltd.
- Lifecycle: ACTIVE
- Research date: 2026-08-01
- Decision: GO STRATEGICO CONDIZIONATO — partnership/platform route preferred
- Integration priority: HIGH for Auction Capability Pack
- Indicative Strategic Score: 92 / 100

## Executive Summary

Bidspirit is not merely an auction-listing portal. It is an end-to-end SaaS technology platform for auction houses and a global discovery/bidding portal for collectors.

The Spanish surface aggregates auctions from multiple independent auction houses, while Bidspirit provides the technical infrastructure for digital catalogs, live and timed auctions, bidder management, analytics, auctioneer tooling and white-label/custom-site solutions.

Bidspirit explicitly states that auction houses retain control over inventory, auction processes and customer relationships.

For Phoenix this creates an important distinction:

```text
Bidspirit = Platform / Discovery Surface
Auction House = Inventory & Transaction Authority
Lot = Auction-specific item
```

This architecture is materially different from a conventional marketplace.

No public Phoenix-oriented search API was identified in the research performed. Because Bidspirit explicitly welcomes partnership inquiries and sells technology/services to auction houses, a commercial/platform discussion is the preferred route before any production collection.

## Spain surface

The Spanish portal currently exposes:
- upcoming auctions;
- Buy It Now;
- auction results;
- future auctions;
- auction houses;
- cross-catalog lot search;
- specialist portals such as coins, stamps, books, jewelry, paintings and toys.

Current results show active Spanish auction houses and locations including Madrid, Barcelona, Valencia, Sevilla, Bilbao and Lugo.

Historical results remain searchable, creating useful auction-price evidence when rights permit.

## PD-099 — Platform Operator and Inventory Authority Are Separate Roles

Bidspirit states that auction houses maintain full control over their inventory, auction processes and customer relationships while Bidspirit supplies technology and visibility.

Phoenix should therefore model:

```text
MarketplaceRoleEvidence {
  discovery_platform
  technology_operator
  inventory_authority
  transaction_authority
  seller
  auction_house
}
```

The website displaying a lot is not necessarily the entity controlling that lot.

This strengthens provenance and legal/access reasoning.

## PD-100 — Auction Lot Requires Event Context

A lot cannot be normalized like an ordinary fixed-price listing without preserving its auction event.

Recommended:

```text
AuctionLot {
  lot_id
  auction_id
  auction_house
  auction_date
  auction_part
  lot_number
  title
  starting_price
  current_price
  estimate
  currency
  status
  bidding_type
  location
}
```

The same object can appear in different auctions over time, so `lot_id` alone is not a durable product identity.

## PD-101 — Auction Result Is Historical Market Evidence

Bidspirit exposes extensive past-auction results.

For Phoenix, an ended auction is not merely stale inventory. It can become valuation/comparable evidence:

```text
AuctionResultEvidence {
  item_identity
  auction_house
  auction_date
  starting_price
  hammer_or_result_price
  currency
  sold_status
  provenance
}
```

This can be highly valuable for art, watches, jewelry, coins, books and collectibles.

Therefore:
`expired listing != useless listing`.

In auction verticals, historical outcomes may be more valuable than current asking prices.

## PD-102 — Auction Modality Is a First-Class Transaction Capability

Bidspirit supports multiple sale modes, including direct/fixed-price sales and auctions. Its product tooling also supports live and scheduled/timed auction experiences.

Phoenix needs:

```text
AuctionModality {
  fixed_price
  live
  timed
  absentee_bid
  phone_bid
  floor_bid
  internet_bid
}
```

Different modalities imply different time sensitivity, user actions and comparison logic.

This extends PD-090 Transaction Capability Is a Ladder.

## PD-103 — White-Label Infrastructure Can Hide Provider-Family Technology

Bidspirit offers custom website/white-label solutions for auction houses and an automatic catalog loader capable of importing catalogs from customer sites.

Therefore the same underlying technology may appear under multiple auction-house brands/domains.

Recommended evidence:

```text
TechnologyProviderEvidence {
  technology_provider
  marketplace_surface
  auction_house
  white_label
  evidence_source
  confidence
}
```

This extends PD-077 Latent Provider Family but distinguishes corporate ownership from shared technology infrastructure.

## SaaS architecture evidence

Bidspirit's official product page describes:
- unified online/floor bidding interface;
- auctioneer console;
- floor display with live price/currency updates;
- automatic catalog loader;
- analytics/reporting;
- virtual auctioneer;
- end-to-end auction-house management.

This means Phoenix should classify Bidspirit as both:
1. consumer discovery/bidding surface;
2. B2B auction infrastructure provider.

## Automatic catalog loader

Bidspirit states that its technology can read a catalog from a customer's site and import it into its own database.

This is strategically important because it proves a structured ingestion/syndication workflow exists inside the platform.

It does NOT prove that Phoenix has permission to consume or redistribute those catalogs.

However, it makes partnership/feed discussions materially more plausible than with a purely consumer-facing marketplace.

## Cross-border architecture

Bidspirit exposes regional portals including Spain, USA, Italy, Portugal, Israel, UK/Ireland, Germany/Austria/Switzerland, Benelux, India and Canada, plus all-region search.

This suggests:

```text
BidspiritGlobalPlatform
├── RegionPortal
├── AuctionHouse
├── Auction
└── Lot
```

A shared global adapter with region configuration is preferable to independent country scrapers if authorized access is obtained.

## Access / compliance posture

Verified:
- public catalog/search surfaces;
- public auction results;
- global/Spain portals;
- platform terms;
- partnership contact;
- auction-house SaaS product;
- white-label/custom website offering.

Not identified:
- public general search API suitable for Phoenix;
- public export API/feed for third-party search engines.

Recommended:

```text
public_html = yes
public_search_api = not_identified
public_export_feed = not_identified
partnership_surface = YES
B2B_data_infrastructure = YES
production_automation = disabled until authorized
preferred_route = partnership / authorized platform integration
```

Bidspirit's terms also make clear that users are bound both by Bidspirit terms and the seller/auction-house terms, reinforcing multi-party policy evaluation.

## Multi-party policy implication

An auction lot can be governed by:
- Bidspirit platform terms;
- auction-house/seller terms;
- lot-specific notices;
- transaction/service terms.

Phoenix therefore needs policy provenance by layer rather than a single `provider_terms` field.

Potential future model:

```text
PolicyStack {
  platform_policy
  seller_policy
  auction_policy
  lot_policy
  transaction_policy
}
```

This is recorded as an architectural implication but not assigned a new PD in this checkpoint to avoid over-fragmenting the ledger.

## Auction Capability Pack

Recommended fields/capabilities:

```text
auction_house
auction_id
auction_part
lot_number
sale_modality
start_time
end_time
starting_price
current_bid
estimate_low
estimate_high
result_price
currency
buyer_premium
bid_increment
reserve_status
lot_status
catalog_pdf
location
shipping
condition_report
provenance
authorship
period
materials
dimensions
```

Not every source exposes every field.

## AI / Decision Engine Opportunities

Authorized Bidspirit data could support:
- comparable auction-result discovery;
- historical price normalization;
- artist/maker/entity normalization;
- cross-auction duplicate detection;
- lot reappearance detection;
- estimate-vs-result analysis;
- auction-house performance evidence;
- condition/provenance comparison;
- currency normalization;
- time-sensitive bid decision support.

## Reusable DevKit Components

1. `AuctionCapabilityPack`
2. `AuctionEventMapper`
3. `AuctionLotMapper`
4. `AuctionResultEvidenceMapper`
5. `AuctionModalityMapper`
6. `MarketplaceRoleEvidenceMapper`
7. `TechnologyProviderEvidenceMapper`
8. `AuctionHouseRegistry`
9. `HistoricalComparableAdapter`
10. `PolicyStackMapper`

## Strategic Score

| Dimension | Score |
|---|---:|
| Auction vertical relevance | 98 |
| Spain relevance | 90 |
| Historical-result intelligence | 100 |
| Architecture learning | 100 |
| Cross-border reuse | 96 |
| B2B/partnership potential | 96 |
| Public API readiness | 30 |
| Decision Engine value | 97 |
| Auction Capability Pack value | 100 |

**Indicative Strategic Score: 92 / 100**

## Final Decision

### GO STRATEGICO CONDIZIONATO — PARTNERSHIP/PLATFORM ROUTE

Bidspirit should be treated as:
- a high-value auction discovery source;
- a historical comparable-data candidate;
- a benchmark for Phoenix AuctionCapabilityPack;
- a global auction technology platform;
- a strong partnership target;
- not an unauthorized scraping target.

Most important conclusion:

> In auction markets, Phoenix must model the platform, auction house, auction event and lot as separate entities. Historical auction results are not dead inventory; they are decision evidence.

## Canonical Discoveries

- PD-099 — Platform Operator and Inventory Authority Are Separate Roles
- PD-100 — Auction Lot Requires Event Context
- PD-101 — Auction Result Is Historical Market Evidence
- PD-102 — Auction Modality Is a First-Class Transaction Capability
- PD-103 — White-Label Infrastructure Can Hide Provider-Family Technology

Reinforced:
- PD-010 Search/Transaction Separation
- PD-056 Trust Evidence, Not Trust Score
- PD-077 Latent Provider Family
- PD-090 Transaction Capability Is a Ladder, Not a Boolean
- PD-093 Valuation Methodology Is Decision Evidence
- PD-095 API-Native Provider Families Should Maximize Shared Core

## Sources

Current web research, 2026-08-01:
- https://es.bidspirit.com/portal/
- https://es.bidspirit.com/ui/about
- https://es.bidspirit.com/ui/product
- https://es.bidspirit.com/ui/results/all/
- https://bidspirit.com/services/portal/legal/en/terms.html

Phoenix continuity:
- Tracker ID 34 from the canonical Atlas sequence after Tracker 33 eBay.es
- KR_033_EBAY_ES.md ending at PD-098

This is a strategic/technical assessment, not legal advice.
