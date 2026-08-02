# PHOENIX ATLAS — KNOWLEDGE RECORD 039

## Hood.de — Germany

- Tracker ID: 39
- Country: Germany
- Vertical: Multi-category marketplace / fixed-price commerce / auctions
- Canonical domain: https://www.hood.de/
- Lifecycle: ACTIVE
- Research date: 2026-08-02
- Decision: GO STRATEGICO — pursue authorized API/partner access
- Integration priority: VERY HIGH
- Indicative Strategic Score: 96 / 100

## Executive Summary

Hood.de is an active German marketplace founded in 1999. Current official press material reports more than 10 million offers, roughly 5,000 commercial sellers and 2–3 million visitors per month.

It supports both private and professional sellers, Hood Shops, fixed-price purchasing, classic auctions, instant-purchase auctions and negotiated price proposals.

Most importantly for Phoenix, Hood publicly documents professional technical interfaces: CSV import/export, API usage, data feeds, direct integrations and partner connectors. This makes Hood materially more integration-friendly than many German classifieds sources already examined.

The public material found is seller-oriented rather than a verified public search API for third-party discovery engines. Phoenix should therefore pursue authorized API/partner access rather than assume that the seller API grants catalog-consumption rights.

## PD-122 — API Existence Does Not Imply Consumer-Search Rights

Hood explicitly documents API use and professional interfaces for sellers to publish/manage inventory and initiate automated sales processing.

That proves structured technical infrastructure exists.

It does not prove Phoenix may use that API to search or redistribute the whole marketplace catalog.

Recommended:

```text
InterfaceCapability {
  interface_type
  direction
  actor
  operations[]
  catalog_read_scope
  redistribution_rights
  authorization_required
}
```

For current Hood evidence:

```text
actor = seller/professional merchant
direction = merchant <-> marketplace
catalog_search_rights_for_phoenix = NOT VERIFIED
```

This strongly reinforces Partner Surface Directionality.

## PD-123 — Marketplace Payment Orchestration Can Be Seller-Selectable

Hood states that available payment methods depend on seller settings.

If the seller uses Hood payment processing, the checkout can expose methods including PayPal, cards, Giropay, Ivy, Apple Pay and Google Pay.

If the seller uses its own payment processing, other methods can be offered, including Amazon Pay, Klarna, bank transfer, invoice, COD and cash on pickup.

Therefore payment architecture can vary per seller inside one marketplace:

```text
PaymentRouteEvidence {
  seller
  marketplace_payment_enabled
  payment_methods[]
  external_payment_methods[]
  protection_context
}
```

A marketplace-wide payment assumption would be incorrect.

## PD-124 — Offer Format Is a Decision Variable

Hood supports several sale formats:
- professional shop item;
- classic auction;
- auction with optional Buy Now before the first bid;
- instant-purchase auction for private sellers;
- negotiated price proposal/counterproposal.

The same underlying product can therefore require different user decisions depending on sale format.

Recommended:

```text
OfferFormat {
  fixed_price
  classic_auction
  auction_with_buy_now
  instant_purchase
  negotiated_offer
}
```

Decision logic should consider time, bid state, negotiation possibility and purchase immediacy.

## PD-125 — Buyer Protection Can Be External and Provider-Specific

Hood's safety guidance points buyers to protections offered by payment providers such as Amazon Pay, Klarna and PayPal.

Protection is therefore not necessarily a Hood-native universal guarantee.

Recommended:

```text
ProtectionEvidence {
  marketplace
  protection_provider
  payment_method
  buyer_type
  eligibility
  exclusions
}
```

This reinforces the principle that protection follows transaction context/payment rail.

## PD-126 — Marketplace Distribution Can Extend Through External Acquisition Channels

Hood's current press material states that seller reach is amplified through channels including Google, Bing, Google Shopping, idealo, social media, affiliates, YouTube and TV.

This creates another distribution layer:

```text
Seller Inventory
   ↓
Hood Marketplace
   ↓
External discovery/acquisition channels
```

Phoenix should distinguish:
- inventory origin;
- marketplace surface;
- external marketing/distribution channel.

This extends Distribution Network evidence beyond publisher networks.

## Trust and seller evidence

Hood maintains transaction feedback:
- positive/neutral/negative rating;
- written comment;
- detailed seller star ratings after sufficient review volume.

Its safety guidance encourages checking seller ratings and other trust evidence before high-value prepayment.

This reinforces dimensional seller reputation and transaction-context trust.

## Seller verification

Current help material documents bank-account verification for sellers, including a test-transfer verification path. Failure to complete verification can restrict listing activity.

This is useful identity/payment evidence but should not be generalized into a universal `seller_verified` boolean.

## Search and inventory

Current Hood pages expose:
- millions of marketplace items;
- more than 10,000 product categories;
- title search;
- optional description search;
- category-restricted search;
- advanced search.

Current press material reports:
- >10 million offers;
- ~5,000 commercial sellers;
- 2–3 million visitors/month.

These figures are time-bounded source evidence.

## Technical integration evidence

Current Hood Shop feature documentation includes:
- CSV import/export;
- API usage;
- data feeds;
- direct integrations;
- automated daily feed retrieval;
- partner integrations such as Afterbuy, magnalister and PlentyOne.

This makes Hood a high-priority partnership candidate.

Recommended questions:
1. Is a read/search catalog API available to approved partners?
2. Can Phoenix receive active-listing feeds?
3. Are deltas/deletions available?
4. Are auction bid state and end time available?
5. Can payment/protection context be exposed?
6. Are seller reputation fields available?
7. Can Phoenix deep-link listings under a partner agreement?
8. What caching/storage rules apply?

## Access posture

Verified:
- active public marketplace;
- professional seller API/interface capability;
- CSV/data-feed/direct integration infrastructure;
- seller-oriented API use.

Not verified:
- unrestricted public search API for third-party aggregators;
- public bulk catalog export rights for Phoenix.

Therefore:

```text
public_html = YES
seller_api = YES
professional_feeds = YES
public_third_party_search_api = NOT VERIFIED
production_scraping = avoid
preferred_route = authorized API / partner feed / commercial agreement
```

## Capability Impact

- interface_directionality
- seller_selectable_payment_route
- offer_format
- external_payment_protection
- external_distribution_channels
- dimensional_seller_reputation
- seller_verification
- marketplace_api_partner_surface

## Reusable DevKit Components

1. `InterfaceCapabilityRegistry`
2. `PaymentRouteEvidenceMapper`
3. `OfferFormatMapper`
4. `ProtectionEvidenceMapper`
5. `DistributionChannelEvidenceMapper`
6. `SellerReputationEvidenceMapper`
7. `SellerVerificationEvidenceMapper`
8. `MarketplacePartnerAccessRegistry`

## Strategic Score

| Dimension | Score |
|---|---:|
| Germany relevance | 96 |
| Inventory breadth | 96 |
| Official technical integration evidence | 100 |
| Partnership potential | 100 |
| Transaction-model intelligence | 98 |
| Auction/fixed-price versatility | 98 |
| Architecture learning | 99 |
| Public search API certainty | 55 |
| Decision Engine value | 94 |

**Indicative Strategic Score: 96 / 100**

## Final Decision

### GO STRATEGICO — AUTHORIZED API/PARTNER ACCESS

Hood.de is one of the strongest German candidates studied so far because it combines substantial inventory with explicit professional API/feed infrastructure.

Phoenix should not assume the seller-facing API grants catalog search/redistribution rights. Instead, Hood should become a high-priority partnership target.

Most important conclusion:

> The existence of an official API is only the beginning of access analysis. Phoenix must know who the API is for, which direction data flows, and which rights accompany it.

## Canonical Discoveries

- PD-122 — API Existence Does Not Imply Consumer-Search Rights
- PD-123 — Marketplace Payment Orchestration Can Be Seller-Selectable
- PD-124 — Offer Format Is a Decision Variable
- PD-125 — Buyer Protection Can Be External and Provider-Specific
- PD-126 — Marketplace Distribution Can Extend Through External Acquisition Channels

Reinforced:
- PD-009 Protection-Aware Decisioning
- PD-010 Search/Transaction Separation
- PD-061 Partner Surface Directionality
- PD-090 Transaction Capability Is a Ladder, Not a Boolean
- PD-096 Protection Eligibility Is Listing/Transaction Context
- PD-110 Marketplace Transaction Role Can Be Delegated
- PD-114 Distribution Network Can Extend Beyond Marketplace Inventory

## Sources

Canonical tracker:
- User-provided `marketplaces_europe(3).csv` — Tracker ID 39 = Hood.de, Germany.

Current official Hood research, 2026-08-02:
- https://www.hood.de/
- https://www.hood.de/ueberHood.htm
- https://www.hood.de/presse.htm
- https://www.hood.de/shop-features.htm
- https://www.hood.de/top-news/65/schnittstelle-fuer-verkaeufer.htm
- https://www.hood.de/tip/422/informationen-fuer-kaeufer.htm
- https://www.hood.de/tip/548/angebotsformate-zum-verkauf.htm
- https://www.hood.de/tip/419/486/tipps-zum-sicheren-einkaufen-mit-kaeuferschutz.htm
- https://www.hood.de/tips/1135/kaeufer-bewerten.htm

Phoenix continuity:
- KR_038_CLASF_DE.md ended at PD-121.

This is a strategic/technical assessment, not legal advice.
