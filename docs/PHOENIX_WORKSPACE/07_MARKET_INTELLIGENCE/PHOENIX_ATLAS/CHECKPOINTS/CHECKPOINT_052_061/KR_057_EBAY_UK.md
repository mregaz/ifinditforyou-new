# PHOENIX ATLAS — KNOWLEDGE RECORD 057

## eBay UK — United Kingdom

- Tracker ID: 57
- Country: United Kingdom
- Vertical: General marketplace / auctions / recommerce / collectibles
- Canonical domain: https://www.ebay.co.uk/
- Provider family: eBay
- API marketplace ID: EBAY_GB
- Lifecycle: ACTIVE
- Research date: 2026-08-02
- Decision: GO STRATEGICO — official Buy APIs / partner route
- Integration priority: VERY HIGH
- Discovery continuity: PD-228 → PD-234

## Executive Summary

eBay UK is a Tier-1 Phoenix marketplace because it combines broad inventory, fixed-price and auction commerce, structured seller evidence, category taxonomy, official Browse/Feed/Offer APIs, authenticity services and buyer protection.

Phoenix has already studied eBay Spain. This UK record therefore focuses on genuinely incremental UK/provider-architecture findings rather than duplicating existing eBay-family discoveries.

The eBay Developers Program explicitly supports the Great Britain marketplace as `EBAY_GB`. Browse API supports keyword/category/GTIN/product/aspect search, image search in GB, item detail retrieval, seller evidence and vehicle-parts compatibility. Feed API resources are also supported for GB.

Production access to Buy APIs can require eligibility checks, eBay approval and contracts. Phoenix should use the official partner/API path rather than scrape consumer pages.

## PD-228 — Marketplace Family Capability Can Differ by Country Surface

The eBay Buy API support matrix shows that API capability is marketplace-specific.

Great Britain supports:
- Browse item_summary
- Browse item
- Feed resources
- searchByImage
- Offer API
- Marketing API
- Marketplace Insights API (restricted)

Recommended:

MarketplaceCapabilityMatrix {
  provider_family
  marketplace_id
  capability
  availability
  access_tier
  observed_at
}

A capability verified for eBay UK must not automatically be assumed for every eBay country surface.

## PD-229 — Seller Legal Type Is Marketplace Evidence

The Browse API can return `sellerAccountType` as BUSINESS or INDIVIDUAL on EBAY_GB.

Recommended:

SellerLegalContextEvidence {
  seller
  account_type
  jurisdiction
  source
  observed_at
}

This matters because UK buyer fees and protections differ depending on whether the seller is a UK private seller or business seller.

## PD-230 — Buyer Protection Cost Can Be Embedded in Displayed Price

For eligible purchases from UK-based private sellers, eBay UK adds a Buyer Protection fee to the item price shown to buyers. Vehicles, Classified Ads and Property are excluded.

Recommended:

DisplayedPriceEvidence {
  displayed_price
  seller_receives
  embedded_buyer_fee
  fee_basis
  excluded_category
}

Phoenix must not assume that displayed marketplace price equals seller proceeds.

This is distinct from the classic model where buyer fees are only added later at checkout.

## PD-231 — Protection Coverage Is Category-Dependent

eBay Money Back Guarantee excludes categories including motor vehicles, motorbikes, boats, aircraft, real estate, classified ads and certain other products/services.

Recommended:

ProtectionEligibilityEvidence {
  protection_program
  category
  eligible
  exclusion_reason
  transaction_requirements
}

A provider-level badge such as “Buyer Protection” must never be generalized to every listing on that provider.

## PD-232 — Authentication Eligibility Is Rule-Based and Transaction-Contextual

eBay UK's Authenticity Guarantee covers selected categories including watches, sneakers, fashion, handbags, trading cards and jewellery, subject to category-, price-, seller-, buyer- and delivery-location rules.

Recommended:

AuthenticationEligibilityEvidence {
  program
  category
  price_threshold
  seller_location_requirement
  buyer_location_requirement
  delivery_requirement
  listing_format_requirement
  eligible
}

Authentication is not a simple provider-wide boolean.

## PD-233 — Physical Authentication Can Verify Listing Consistency Separately From Authenticity

eBay's Authenticity Guarantee inspection can verify whether item condition/details match the listing. In some cases an authenticator may be unable to provide full authenticity verification while still checking listing consistency.

Recommended:

InspectionEvidence {
  authenticity_verified
  listing_consistency_verified
  condition_verified
  inspected_by
  inspection_outcome
}

Phoenix must distinguish:
- authentic;
- consistent with listing;
- condition verified;
rather than collapse all into a single `verified` field.

## PD-234 — Official Marketplace APIs Can Impose UX/Ranking Constraints

eBay's Buy API requirements impose user-experience rules for some partner checkout experiences. For example, partners may be required to surface fixed-price items and may be prohibited from re-sorting eBay-provided browse results in specific flows.

Recommended:

ProviderPresentationConstraint {
  provider
  integration_mode
  required_filters[]
  prohibited_transformations[]
  ranking_constraints
  display_requirements[]
}

Official API access therefore does not imply complete freedom over downstream ranking/presentation.

Phoenix Provider SDK must be capable of enforcing contractual presentation constraints per integration mode.

## Official API Evidence

The Browse API supports:
- keyword search
- category search
- GTIN
- eBay Product ID
- item aspects
- filters
- image search
- item details
- seller data
- item location
- return policy
- payment methods
- vehicle compatibility

For `EBAY_GB`, search-by-image is supported.

The API exposes `itemOriginDate`, which is retained if an item is relisted. This is useful for Phoenix listing-age and relisting intelligence.

Feed API support for GB also creates a potential high-scale ingestion route, subject to authorization and applicable API terms.

## Access Posture

Verified:
- official eBay Developers Program
- `EBAY_GB` marketplace
- Browse API
- Feed API support
- Offer API support
- production access controls

Recommended:

production_scraping = DO NOT USE
preferred_route = official eBay Buy APIs / approved partner integration

Production access for Buy APIs can require:
- standard eligibility
- provider approval
- contracts

## Strategic Score

| Dimension | Score |
|---|---:|
| UK marketplace relevance | 100 |
| Inventory breadth | 100 |
| Official API maturity | 100 |
| Seller evidence | 100 |
| Buyer protection intelligence | 100 |
| Authentication intelligence | 100 |
| Auction capability | 100 |
| Architecture learning | 100 |
| Partnership value | 100 |
| Decision Engine value | 100 |

**Indicative Strategic Score: 100 / 100**

## Final Decision

### GO STRATEGICO — OFFICIAL API / PARTNER ROUTE

eBay UK is a Tier-1 Phoenix provider.

Central conclusion:

> Marketplace intelligence must preserve not only listing and seller evidence, but also country-specific capability, seller legal type, embedded buyer fees, category-specific protection, rule-based authentication eligibility and provider-imposed presentation constraints.

## Canonical Discoveries

- PD-228 — Marketplace Family Capability Can Differ by Country Surface
- PD-229 — Seller Legal Type Is Marketplace Evidence
- PD-230 — Buyer Protection Cost Can Be Embedded in Displayed Price
- PD-231 — Protection Coverage Is Category-Dependent
- PD-232 — Authentication Eligibility Is Rule-Based and Transaction-Contextual
- PD-233 — Physical Authentication Can Verify Listing Consistency Separately From Authenticity
- PD-234 — Official Marketplace APIs Can Impose UX/Ranking Constraints

Reinforced:
- eBay Spain family discoveries
- PD-056 — Trust Evidence, Not Trust Score
- PD-099 — Auction Transaction Evidence
- PD-102 — Auction Fees Belong in Total Acquisition Cost
- PD-190 — Integration Geography Is a Contractual Capability
- PD-200 — API Existence Must Preserve Purpose and Licence Scope
- PD-220 — Production API Access Can Require Certification

## Sources

Current official eBay research, 2026-08-02:
- eBay Developers Program — Buy API Support by Marketplace
- eBay Developers Program — Browse API
- eBay Developers Program — Buy APIs Requirements
- eBay UK — Buyer Protection
- eBay UK — Money Back Guarantee
- eBay UK — Authenticity Guarantee
- eBay UK — Fees for private/business sellers

Research limitations:
- Marketplace rules and fee structures are time-sensitive.
- Some Buy APIs/capabilities are restricted or limited release.
- Production access is subject to eligibility, approval and contracts.
- UK findings must not automatically be generalized to other eBay country surfaces.

This is a strategic/technical assessment, not legal advice.
