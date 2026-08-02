# PHOENIX ATLAS — KNOWLEDGE RECORD 058

## Depop — United Kingdom

- Tracker ID: 58
- Country: United Kingdom
- Vertical: Fashion / second-hand / social commerce
- Canonical domain: https://www.depop.com/
- Operator: Depop Limited
- Lifecycle: ACTIVE
- Research date: 2026-08-02
- Decision: GO STRATEGICO — private partner API / commercial integration route
- Integration priority: VERY HIGH for Fashion / Recommerce Capability Pack
- Discovery continuity: PD-235 → PD-241

## Executive Summary

Depop is a large global fashion marketplace with strong UK roots and a social-commerce model.

Current official figures report approximately 56.3 million registered users, more than 68 million items for sale, up to 600,000 new listings per day and more than USD 6 billion of goods sold by the community to date.

For Phoenix, Depop is particularly valuable because it combines:
- social resale;
- buyer-side marketplace fees;
- integrated payments via Depop Payments / Stripe;
- Depop Protection;
- offers and automated negotiation;
- boosted listings with explicit attribution windows;
- private partner APIs for enterprise sellers and cross-listing tools;
- OAuth2 and webhook-based order/inventory integration.

The API is not public. Depop explicitly requires prospective integrators to contact the company for access.

Phoenix should therefore pursue a partner/commercial integration rather than scrape the consumer marketplace.

## PD-235 — Listing Price Is Not Buyer Transaction Cost

In the UK, Depop applies a Marketplace fee to buyers.

The buyer's transaction amount can include:
- item sale price;
- shipping;
- taxes/duties;
- Marketplace fee.

The Marketplace fee can be up to 5% of the item purchase price plus a fixed amount up to £1, excluding taxes and shipping.

Recommended:

```text
BuyerTransactionCost {
  listing_price
  shipping
  taxes
  marketplace_fee
  total
}
```

Phoenix must not compare fashion items solely using their listing price when marketplace-specific buyer fees alter the true acquisition cost.

## PD-236 — Merchant of Record Can Depend on Payment Context

Depop's current Terms state that the merchant-of-record entity can vary depending on payment currency and payment-instrument location.

For the UK, the merchant of record is Depop Limited.

Recommended:

```text
MerchantOfRecordEvidence {
  marketplace
  transaction_country
  payment_currency
  payment_instrument_location
  merchant_of_record
}
```

Transaction responsibility can therefore depend on payment context, not only marketplace domain.

## PD-237 — Partner API Can Be Seller-Centric Rather Than Marketplace-Search-Centric

Depop operates a private Selling API for partners.

Capabilities include:
- create/update/delete products;
- read own products;
- order management;
- refunds;
- offers automation;
- shop details;
- webhooks;
- sandbox/testing.

Authentication supports:
- API keys for direct partners managing their own shops;
- OAuth 2.0 for third-party applications used by multiple sellers.

The API is explicitly private and not open to the general public.

Recommended:

```text
PartnerAPIScope {
  actor
  own_inventory_read
  own_inventory_write
  orders
  offers
  shop
  public_catalog_search
}
```

For current Depop partner API evidence:

```text
public_catalog_search = NOT ESTABLISHED
```

This reinforces that `official API exists` does not mean Phoenix can search the entire marketplace.

## PD-238 — Accepted Offer Is Not Yet a Transaction

Depop's Make Offer flow allows a seller to accept an offer, but the item remains available until the buyer actually purchases it.

The accepted offer is time-limited; the buyer typically has 24 hours to complete purchase.

Recommended:

```text
OfferState {
  pending
  accepted
  countered
  declined
  expired
  converted_to_purchase
}
```

Important:

```text
offer_accepted != item_reserved
offer_accepted != transaction_complete
```

Phoenix must preserve negotiation state separately from inventory availability.

## PD-239 — Promotion Attribution Can Extend Beyond the Impression Moment

Depop Boosted Listings charge a fee when a buyer interacts with a boosted listing and then purchases within a defined attribution window.

Current UK policy uses a 28-day attribution window and a 12% boosting fee for eligible boosted sales.

Recommended:

```text
PromotionAttributionEvidence {
  promotion_type
  interaction_at
  attribution_window
  conversion_at
  promotion_fee
}
```

A promotion can economically affect a transaction long after the original promoted impression.

This is more precise than a simple `promoted=true` flag.

## PD-240 — Marketplace Scale Requires Metric-Type Separation

Depop publishes several scale metrics:
- registered users;
- items for sale;
- new listings per day;
- cumulative goods sold.

These are not interchangeable.

Recommended:

```text
MarketplaceScaleEvidence {
  metric_type
  value
  unit
  period
  cumulative_or_snapshot
  observed_at
}
```

This reinforces Phoenix's rule that marketplace size must retain metric provenance.

## PD-241 — Buyer and Seller Protection Can Have Different Eligibility Rules

Depop Protection for buyers and sellers is not symmetric.

Buyer Protection can cover eligible purchases when an item:
- does not arrive;
- arrives damaged;
- is significantly not as described.

Seller Protection has additional eligibility constraints. Current UK seller protection applies to eligible sales up to £250 and requires compliance with Depop shipping requirements where applicable.

Recommended:

```text
ProtectionProgramEvidence {
  party
  transaction_value_limit
  payment_method
  shipping_method
  claim_window
  covered_events[]
}
```

Phoenix must model buyer protection and seller protection separately.

## Current UK Fee / Payment Evidence

Current official UK seller-fee guidance states:
- no Depop selling fee for UK sellers;
- Depop Payments processing fee: 2.9% + £0.30;
- Boosted Listings fee: 12% for eligible boosted sales.

Buyer-side Marketplace fee:
- up to 5% of item purchase price;
- plus fixed amount up to £1;
- exact amount shown at checkout.

These fees are time-sensitive and must retain observation date.

## API / Integration Architecture

The current private Selling API includes:
- OAuth 2.0 with PKCE;
- API-key authentication for direct partners;
- product endpoints;
- order endpoints;
- offer endpoints;
- shop endpoint;
- webhooks;
- sandbox environment;
- OpenAPI specification.

Current documentation explicitly says access must be requested from Depop.

This makes Depop a strong partner-integration candidate but not a public catalog API source.

## Social / Recommerce Value

Depop's product model is highly compatible with Phoenix fashion intelligence because it combines:
- second-hand fashion inventory;
- negotiation;
- seller shops;
- promotional visibility;
- rapid listing creation;
- community-led trends.

Potential Phoenix Fashion Capability Pack fields include:

```text
brand
category
size
condition
colour
style
era
seller_shop
original_price
listing_price
offer_state
boosted
shipping
buyer_fee
protection
```

## Access Posture

Verified:
- active public marketplace;
- private Selling API;
- partner onboarding route;
- API-key and OAuth2 integrations;
- sandbox and webhooks.

Not established:
- public full-marketplace search API;
- unrestricted catalog export;
- unrestricted commercial redistribution.

Recommended:

```text
production_scraping = DO NOT USE
preferred_route = private partner API / commercial agreement
```

## Reusable DevKit Components

1. `BuyerTransactionCostMapper`
2. `MerchantOfRecordMapper`
3. `PartnerAPIScopeRegistry`
4. `OfferStateMapper`
5. `PromotionAttributionMapper`
6. `MarketplaceScaleEvidenceRegistry`
7. `ProtectionProgramEvidenceMapper`
8. `FashionRecommerceCapabilityPack`
9. `PartnerOAuthAdapter`
10. `PartnerWebhookAdapter`

## Strategic Score

| Dimension | Score |
|---|---:|
| UK fashion relevance | 100 |
| Recommerce relevance | 100 |
| Inventory scale | 100 |
| Transaction intelligence | 100 |
| Negotiation intelligence | 100 |
| Partner API maturity | 98 |
| Promotion intelligence | 100 |
| Protection intelligence | 98 |
| Architecture learning | 100 |
| Decision Engine value | 98 |

**Indicative Strategic Score: 99 / 100**

## Final Decision

### GO STRATEGICO — PRIVATE PARTNER API / COMMERCIAL ROUTE

Depop is a Tier-1 Phoenix fashion/recommerce target.

Central conclusion:

> Fashion marketplace intelligence must distinguish listing price from buyer transaction cost, accepted offers from completed transactions, buyer protection from seller protection, and partner inventory APIs from public marketplace-search APIs.

## Canonical Discoveries

- PD-235 — Listing Price Is Not Buyer Transaction Cost
- PD-236 — Merchant of Record Can Depend on Payment Context
- PD-237 — Partner API Can Be Seller-Centric Rather Than Marketplace-Search-Centric
- PD-238 — Accepted Offer Is Not Yet a Transaction
- PD-239 — Promotion Attribution Can Extend Beyond the Impression Moment
- PD-240 — Marketplace Scale Requires Metric-Type Separation
- PD-241 — Buyer and Seller Protection Can Have Different Eligibility Rules

Reinforced:
- PD-061 — Partner Surface Directionality
- PD-090 — Transaction Capability Is a Ladder, Not a Boolean
- PD-096 — Protection Eligibility Is Listing/Transaction Context
- PD-150 — Transaction Eligibility Is a Matrix
- PD-170 — Marketplace Scale Metrics Need Metric-Type Provenance
- PD-200 — API Existence Must Preserve Purpose and Licence Scope
- PD-234 — Official Marketplace APIs Can Impose UX/Ranking Constraints

## Sources

Canonical tracker:
- User-provided `marketplaces_europe(4).csv` — Tracker ID 58 = Depop / UK / Fashion / second-hand.

Current official research, 2026-08-02:
- Depop Newsroom — Facts and figures
- Depop Help Centre — Marketplace fee
- Depop Help Centre — Seller fees and charges
- Depop Help Centre — Make Offer
- Depop Help Centre — Auto-respond to offers
- Depop Help Centre — Depop Protection for buyers
- Depop Help Centre — Depop Protection for sellers
- Depop Help Centre — Boosted Listings / Boosted Listings Policy
- Depop Terms of Service, updated 2 July 2026
- Depop Partner Selling API documentation
- Depop Partner API authentication / reference / changelog

Research limitations:
- Fees and marketplace policies are time-sensitive.
- The Selling API is private and partner-scoped.
- No public full-catalog search API was established.
- UK findings must not automatically be generalized to all Depop country/payment contexts.

This is a strategic/technical assessment, not legal advice.
