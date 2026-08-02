# PHOENIX ATLAS — KNOWLEDGE RECORD 033

## eBay.es — Spain

- Tracker ID: 33
- Country: Spain
- Vertical: Auctions / marketplace / multi-category commerce
- Canonical domain: https://www.ebay.es/
- Provider family: eBay Global Marketplace
- Lifecycle: ACTIVE
- Research date: 2026-08-01
- Decision: GO — reuse eBay global API core with EBAY_ES locale/policy configuration
- Integration priority: VERY HIGH
- Indicative Strategic Score: 97 / 100

## Executive Summary

eBay.es is the Spanish marketplace surface of the global eBay ecosystem.

Unlike many Atlas sources, Phoenix does not need to begin from HTML extraction. eBay operates an official Developers Program and Buy/Browse APIs. Current official marketplace enumerations explicitly identify Spain as `EBAY_ES`, and eBay's Buy API support documentation includes Spain.

The Browse API supports keyword/category/product/GTIN searches, item-detail retrieval and rich decision-support fields such as seller, shipping, returns, availability and product-review data.

This makes eBay.es one of the clearest examples of Phoenix's preferred architecture:

```text
SharedGlobalProviderCore
        +
MarketplaceLocaleConfiguration
        +
Policy / Eligibility Matrix
```

The correct implementation is therefore not `EbaySpainScraper`.

It is an `EbayGlobalProvider` configured for `EBAY_ES`.

## Reuse from eBay.fr

The earlier eBay France Atlas research established the shared API/provider-family model. Spain strongly confirms it.

Recommended:

```text
EbayGlobalProvider
├── EBAY_FR
├── EBAY_ES
├── EBAY_IT
├── EBAY_DE
├── EBAY_GB
└── ...
```

Locale adapters should cover language, currency, category taxonomy, shipping geography, program eligibility and legal/policy differences.

## Official API surface

Current eBay developer documentation confirms:

- Browse API item search;
- keyword search;
- category search;
- GTIN/product search;
- item detail retrieval;
- image-search capability for eligible use cases;
- seller/shipping/return information;
- availability information;
- product-review data;
- marketplace-specific operation.

Spain has the canonical marketplace identifier:

`EBAY_ES`

and is included in Buy API marketplace support.

This is high-confidence official integration evidence.

## PD-094 — Marketplace Code Is a First-Class Provider Configuration

A global marketplace API can expose a canonical machine-readable marketplace identifier.

Recommended Phoenix contract:

```text
MarketplaceConfiguration {
  provider_family
  marketplace_code
  country
  language
  currency
  canonical_domain
}
```

For Spain:

```text
provider_family = ebay
marketplace_code = EBAY_ES
country = ES
canonical_domain = ebay.es
```

This is more robust than switching providers based on hostname alone.

## PD-095 — API-Native Provider Families Should Maximize Shared Core

When a provider exposes a global API with explicit marketplace identifiers, Phoenix should minimize locale-specific implementation.

Recommended architecture:

```text
EbayGlobalProvider
├── SharedAuth
├── SharedBrowseClient
├── SharedMapper
├── SharedErrorHandling
├── SharedRateLimitHandling
└── MarketplaceConfig
    ├── EBAY_ES
    ├── EBAY_FR
    └── ...
```

Only genuine marketplace differences belong in locale configuration.

This is stronger than merely sharing parser utilities.

## PD-096 — Protection Eligibility Is Listing/Transaction Context

eBay Spain's buyer/seller protection documentation shows that protection is not universal across every category or transaction.

For example, seller-protection documentation identifies exclusions including vehicles, real estate, websites/businesses for sale, classifieds, services, digital/intangible goods and some business-equipment categories.

Therefore:

```text
marketplace_has_buyer_protection = true
```

is insufficient.

Phoenix needs:

```text
ProtectionEligibilityEvidence {
  marketplace
  listing_category
  transaction_type
  payment_path
  seller_status
  eligibility
  exclusions[]
}
```

Protection is contextual evidence.

## PD-097 — Cross-Marketplace Program Eligibility

eBay's Authenticity Guarantee demonstrates that a seller in Spain can participate in a trust program through another eBay marketplace.

Current documentation states that eligible items sold on eBay.de can originate from sellers in Spain and several other European countries.

This means:

```text
seller_country
!=
marketplace_surface
!=
trust_program_country
```

Recommended model:

```text
ProgramEligibility {
  program
  listing_marketplace
  seller_country
  buyer_country
  category
  price_threshold
  eligibility
}
```

This matters for cross-border Phoenix results.

## PD-098 — Verification Can Validate Both Authenticity and Condition

eBay Authenticity Guarantee does not only check whether an eligible item is genuine. The verifier also checks whether its condition matches the listing description/photos.

Therefore trust evidence can have multiple dimensions:

```text
ItemVerificationEvidence {
  authenticity_verified
  condition_verified
  verifier_type
  verification_stage
  return_reverification
}
```

This is particularly valuable for:
- watches;
- sneakers;
- luxury bags;
- collectibles.

Phoenix should preserve the exact verification scope instead of reducing it to a generic `verified=true`.

## Trust and transaction infrastructure

eBay.es supports a mature trust stack including:
- buyer money-back guarantee for eligible purchases;
- seller protections;
- return/dispute workflows;
- counterfeit-item policies;
- VeRO intellectual-property enforcement;
- seller feedback/reputation;
- authenticity programs in eligible cross-border scenarios.

Phoenix should model these as separate evidence classes, not one marketplace trust score.

## Transaction model

eBay is much deeper in the transaction funnel than classifieds sources.

Potential capability ladder:

```text
discovery
listing
offer/bid
checkout
payment
shipping
tracking
return
refund
dispute
feedback
authentication (eligible items/programs)
```

Phoenix's initial role should remain discovery/decision support unless a future product decision explicitly expands transaction responsibilities.

## Search and data richness

The Browse API can expose or support evidence around:
- item ID;
- title;
- price;
- condition;
- images;
- seller;
- seller feedback;
- item location;
- shipping;
- returns;
- availability/end date;
- categories;
- item aspects;
- product IDs/GTIN;
- product review data;
- compatibility for relevant categories.

This is a strong fit for the Universal Listing Envelope plus vertical capability packs.

## Access posture

Recommended:

```text
public_html = yes
official_api = YES
browse_api = YES
marketplace_code = EBAY_ES
production_scraping = unnecessary / avoid
preferred_route = official eBay API
developer_program = verified
```

API access remains subject to eBay developer terms, scopes, application credentials, rate limits and feature-specific eligibility.

Phoenix should never interpret "official API exists" as unrestricted rights to every dataset or every downstream use.

## DevKit implications

Recommended reusable components:

1. `EbayGlobalProvider`
2. `EbayMarketplaceConfig`
3. `EbayBrowseClient`
4. `EbayTaxonomyAdapter`
5. `ProtectionEligibilityMapper`
6. `CrossMarketplaceProgramEligibilityMapper`
7. `ItemVerificationEvidenceMapper`
8. `SellerReputationEvidenceMapper`
9. `TransactionCapabilityMapper`
10. `ProviderRateLimitPolicy`

## Strategic Score

| Dimension | Score |
|---|---:|
| Spain marketplace relevance | 98 |
| Inventory breadth | 100 |
| Official API maturity | 100 |
| Provider-family reuse | 100 |
| Trust/protection intelligence | 99 |
| Cross-border intelligence | 100 |
| Decision Engine value | 96 |
| Implementation leverage | 100 |
| Unauthorized scraping need | 0 |

**Indicative Strategic Score: 97 / 100**

## Final Decision

### GO — EBAY GLOBAL API CORE + EBAY_ES CONFIGURATION

eBay.es should be a high-priority Phoenix provider, but not a standalone Spanish scraper.

The preferred architecture is:

```text
Phoenix
  ↓
EbayGlobalProvider
  ↓
Official Browse/Buy APIs
  ↓
EBAY_ES Marketplace Configuration
```

Most important conclusions:

1. Official marketplace codes should be first-class Phoenix configuration.
2. API-native global providers should maximize shared implementation.
3. Buyer/seller protection is context-dependent, not a marketplace boolean.
4. Trust programs can span seller country and marketplace boundaries.
5. Verification scope must distinguish authenticity from condition.
6. eBay should be accessed through official APIs rather than unnecessary HTML scraping.

## Canonical Discoveries

- PD-094 — Marketplace Code Is a First-Class Provider Configuration
- PD-095 — API-Native Provider Families Should Maximize Shared Core
- PD-096 — Protection Eligibility Is Listing/Transaction Context
- PD-097 — Cross-Marketplace Program Eligibility
- PD-098 — Verification Can Validate Both Authenticity and Condition

Reinforced:
- PD-009 Protection-Aware Decisioning
- PD-010 Search/Transaction Separation
- PD-056 Trust Evidence, Not Trust Score
- PD-059 Cross-Country Provider Family
- PD-090 Transaction Capability Is a Ladder, Not a Boolean
- PD-091 Reputation Should Be Dimensional

## Sources

Phoenix evidence:
- PHOENIX_ATLAS_PROVIDER_TRACKER.csv — Tracker ID 33
- KR_032_COCHES_NET_ES.md — canonical Discovery continuity through PD-093
- KR_018_EBAY_FR.md — prior eBay-family research

Current official web research, 2026-08-01:
- eBay Developers Program
- eBay Browse API documentation
- eBay Buy API marketplace-support documentation
- eBay MarketplaceIdEnum documentation (`EBAY_ES`)
- eBay.es Money Back Guarantee
- eBay.es Seller Protection
- eBay.es Authenticity Guarantee
- eBay.es counterfeit-item policy

This is a strategic/technical assessment, not legal advice.
