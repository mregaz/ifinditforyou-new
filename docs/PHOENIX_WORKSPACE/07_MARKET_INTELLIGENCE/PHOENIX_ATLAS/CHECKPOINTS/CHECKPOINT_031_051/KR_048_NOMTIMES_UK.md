# PHOENIX ATLAS — KNOWLEDGE RECORD 048

## NomTimes — United Kingdom

- Tracker ID: 48
- Country: United Kingdom
- Vertical: General marketplace / classifieds / small-business storefronts
- Canonical domain: https://www.nomtimes.co.uk/
- Lifecycle: ACTIVE
- Research date: 2026-08-02
- Decision: GO CONDIZIONATO — secondary UK source; rights/API validation required
- Integration priority: MEDIUM
- Discovery continuity: PD-172 → PD-176

## Executive Summary

NomTimes UK is active and combines traditional classifieds with lightweight marketplace/e-commerce capabilities. Current public surfaces expose For Sale, Buy Now, Motors, Gifts, Free Items and Wanted listings, with category, geography, condition and price filters.

Its About page targets small businesses and independent sellers, allowing personalized marketplaces/storefronts, collection-only listings and online-payment sales.

Current listing surfaces expose materially different fulfilment/transaction signals: Collection only/available, Fast Post and Buy Now. NomTimes therefore should not be modeled as a simple contact-only classifieds source.

The platform also operates country-specific sibling surfaces such as NomTimes India, demonstrating a provider-family architecture with localized currency, geography and inventory.

No public Phoenix-oriented catalog/search API or export feed was identified. Commercial data-use rights require separate verification before production integration.

## PD-172 — Fulfilment Capability Is Listing-Level Evidence

NomTimes listings expose Collection only, Collection available, Fast Post, postage prices/free postage and Buy Now.

Recommended model: `FulfilmentCapability` with collection, shipping, postage and buy-now fields.

## PD-173 — Seller Storefront Can Coexist With Classified Listings

NomTimes says small businesses and independent sellers can create personalized marketplaces. Public seller-shop pages expose multiple items under one storefront.

Phoenix should distinguish an individual listing from the persistent seller/storefront entity behind it.

## PD-174 — Wanted Listings Turn Marketplace Search Into Bidirectional Discovery

NomTimes exposes Wanted listings and states that users can post what they need and notify people who may have it.

This reverses ordinary discovery from seller inventory → buyer query into buyer demand → potential seller.

## PD-175 — Provider Family Can Reuse Product Architecture Across Countries

NomTimes operates localized country surfaces including UK and India. The India surface reuses the core marketplace concepts while localizing currency, geography and inventory.

Phoenix should model these as country surfaces of one provider family.

## PD-176 — Category Pages Can Contain Cross-Category Recommendation Inventory

Current category pages can show the primary result set alongside unrelated recommendation modules. A page with no direct House Clearance results, for example, still displays unrelated More Items and Home & Garden inventory.

Extraction must distinguish primary results, recommended results and cross-category modules to avoid false category attribution.

## Current Data Evidence

Public surfaces expose:
- UK country/region geography
- categories
- condition: Used / New / Like New
- price ranges
- Free Items
- Buy Now filtering
- newest/highest/lowest price sorting
- price or Enquire
- collection/shipping evidence
- seller storefronts
- Sold state on some listings

## Access Posture

Verified: public HTML search/category surfaces, seller storefronts, Buy Now and fulfilment signals, localized country surfaces.

Not identified: public third-party catalog/search API, bulk export feed or documented Phoenix-oriented partner interface.

Production collection should remain disabled pending rights verification; preferred route is permission, partnership or licensed interface.

## Reusable DevKit Components

1. FulfilmentCapabilityMapper
2. SellerCommerceSurfaceMapper
3. DemandListingMapper
4. ProviderFamilyRegistry
5. ResultModuleEvidenceMapper
6. MarketplaceTransactionCapabilityMapper
7. CountrySurfaceResolver

## Strategic Score

| Dimension | Score |
|---|---:|
| UK relevance | 76 |
| General inventory breadth | 82 |
| Transaction/fulfilment evidence | 88 |
| Seller storefront value | 90 |
| Demand/Wanted architecture | 96 |
| Architecture learning | 96 |
| Data-quality confidence | 66 |
| Public API readiness | 15 |
| Partnership evidence | 40 |
| Decision Engine value | 80 |

**Indicative Strategic Score: 79 / 100**

## Final Decision

### GO CONDIZIONATO — SECONDARY UK PROVIDER

NomTimes is worth retaining as a secondary UK provider candidate, but production ingestion should wait for rights/access validation.

> A marketplace result is not only an item. It can carry fulfilment, transaction, seller-storefront and demand-side context, and the parser must also know which page module produced it.

## Canonical Discoveries

- PD-172 — Fulfilment Capability Is Listing-Level Evidence
- PD-173 — Seller Storefront Can Coexist With Classified Listings
- PD-174 — Wanted Listings Turn Marketplace Search Into Bidirectional Discovery
- PD-175 — Provider Family Can Reuse Product Architecture Across Countries
- PD-176 — Category Pages Can Contain Cross-Category Recommendation Inventory

## Sources

Current web research, 2026-08-02:
- https://www.nomtimes.co.uk/aboutus
- https://www.nomtimes.co.uk/items
- https://www.nomtimes.co.uk/for-sale/
- https://www.nomtimes.co.uk/buy-now/
- https://www.nomtimes.co.uk/free/
- https://www.nomtimes.in/

Research limitations:
- No public Phoenix-oriented catalog/search API was identified.
- Commercial reuse/automation rights require explicit verification.
- Public inventory is dynamic.

This is a strategic/technical assessment, not legal advice.
