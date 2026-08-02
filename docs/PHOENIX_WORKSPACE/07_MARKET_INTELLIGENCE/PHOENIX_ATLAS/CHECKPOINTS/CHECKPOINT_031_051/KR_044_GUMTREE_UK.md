# PHOENIX ATLAS — KNOWLEDGE RECORD 044

## Gumtree.com — United Kingdom

- Tracker ID: 44
- Country: United Kingdom
- Vertical: Horizontal classifieds / recommerce / motors / jobs / property / services
- Canonical domain: https://www.gumtree.com/
- Operator: Gumtree.com Limited
- Lifecycle: ACTIVE
- Research date: 2026-08-02
- Decision: GO STRATEGICO — authorized partnership/data access only
- Integration priority: VERY HIGH
- Indicative Strategic Score: 97 / 100

## Executive Summary

Gumtree is one of the United Kingdom's largest online classifieds and recommerce platforms. Current official material describes around 10 million monthly users, while an older About Us data snapshot reports millions of live listings across the site.

Most importantly, Gumtree is currently evolving from a traditional classifieds/contact marketplace into a hybrid transactional marketplace.

In 2025–2026 Gumtree introduced integrated payment and delivery for eligible categories using partners including Mangopay and ShipStation/carrier integrations. Eligible listings can now expose Buy Now, tracked delivery, buyer protection and payment holding until delivery conditions are satisfied, while many other categories and listings still operate through traditional local contact/off-platform transaction flows.

This makes Gumtree a critical Phoenix architecture case:

> Transaction capability must be modeled at listing/category/seller level, not assigned once to the whole marketplace.

Current Terms explicitly prohibit robots, spiders, scrapers and other automated means from accessing Gumtree and collecting content without express written permission.

Therefore Phoenix must not implement unauthorized production scraping.

The preferred route is formal partnership / feed / API / licensed catalog access.

---

## 1. Current platform scale

Current Gumtree career/company material describes approximately 10 million people using the platform monthly.

An official historical About Us snapshot reported:
- 9.2m unique visitors/month;
- 62m visits/month;
- 2.2m live listings across the full site/month;
- 1.8m live For Sale listings/month;
- 302k Motors listings/month.

The latter figures are based on 2021 data and must remain timestamped historical evidence, not current statistics.

Current 2026 product material confirms the marketplace remains highly active and is being modernized around trust, payments, delivery and recommendations.

---

## 2. Marketplace role

Current Terms state that Gumtree provides the platform/tools for buyers, sellers and service providers to connect and is not generally a party to the underlying sale/service agreement.

However, Gumtree now also offers optional:
- payment facilitation;
- delivery;
- dispute assistance;
- buyer protection;
- KYC/identity verification.

Therefore its role is no longer adequately described by:

```text
transaction_marketplace = false
```

Instead Phoenix needs listing-level transaction capability.

---

## PD-149 — Marketplace Transactionality Can Be Partial and Progressive

Gumtree currently contains at least two transaction modes:

```text
Traditional Gumtree Listing
  → message/contact
  → meet / arrange payment
  → transaction outside integrated marketplace flow

Eligible Gumtree Listing
  → Buy Now
  → Mangopay payment
  → funds held
  → tracked delivery
  → buyer protection
  → seller payout
```

Recommended:

```text
ListingTransactionCapability {
  contact_only
  buy_now
  integrated_payment
  escrow_or_hold
  integrated_delivery
  buyer_protection
  dispute_support
}
```

A marketplace can migrate gradually from classifieds to e-commerce without every listing acquiring the same capabilities simultaneously.

This is a stronger version of PD-090 Transaction Capability Is a Ladder.

---

## PD-150 — Transaction Eligibility Is a Matrix

Current Terms state that payment/delivery are available only for eligible ads and that eligibility can depend on:
- category;
- price threshold;
- seller type.

Current Terms explicitly state that payment/delivery services apply to eligible ads from private sellers.

Current 2026 delivery guidance lists supported categories including:
- tech/gaming;
- headphones/speakers;
- fashion/clothing;
- books/DVDs/media;
- small appliances.

Recommended:

```text
TransactionEligibility {
  category
  subcategory
  price
  seller_type
  delivery_enabled
  payment_enabled
  protection_enabled
}
```

Therefore:

```text
Gumtree supports Buy Now
```

is true but incomplete.

The correct question is:

> Is this specific listing eligible for Buy Now, integrated delivery and buyer protection?

---

## PD-151 — Payment Hold State Is Transaction Evidence

Gumtree's current Terms state that eligible buyer payments are initially held under the control of the payment processor until release conditions are met, such as delivery confirmation, acceptance or expiry of the dispute period.

Recommended:

```text
PaymentState {
  initiated
  authorized
  held
  delivery_pending
  dispute_window
  released
  refunded
  disputed
}
```

Phoenix should distinguish:
- marketplace payment capability;
- payment processor;
- current transaction state.

This extends PD-110 Marketplace Transaction Role Can Be Delegated.

Current payment partner:
`Mangopay UK Limited`.

---

## PD-152 — Promotion Can Rewrite Apparent Publication Date

Gumtree's `Bump Up` feature moves an ad back to the top of its category.

Current official help states that a successful Bump Up changes the displayed posted date to the date the Bump Up was applied, rather than preserving the original publication date.

Ads normally remain live for 30 or 60 days depending on category, and a Bump Up can extend their lifetime.

Therefore:

```text
displayed_posted_date
        !=
original_publication_date
```

Recommended:

```text
ListingFreshnessEvidence {
  original_first_seen_at
  source_displayed_posted_at
  bump_detected
  bump_at
  expiry_extension
}
```

This reinforces PD-117 Promotion Mechanics Can Mutate Freshness and proves that freshness semantics must remain provider-specific.

---

## PD-153 — Verification Badge Must Preserve Verification Method

Gumtree launched Business Seller Verification in 2026.

Official current material describes checks including:
- photo-to-ID verification;
- company registration lookup;
- adverse media screening;
- address validation;
- electoral roll matching;
- broader authenticity checks.

Verified businesses can receive different badges, including:
- Identity Verified for sole traders;
- Business Verified for limited companies.

Recommended:

```text
BusinessVerificationEvidence {
  badge
  entity_type
  identity_check
  company_registry_check
  address_check
  adverse_media_check
  authenticity_check
  observed_at
}
```

Phoenix should not reduce this rich evidence to:

```text
verified = true
```

This strongly reinforces dimensional trust evidence.

---

## PD-154 — Integrated Logistics Can Convert Local Inventory Into National Inventory

Historically, Gumtree's core value proposition emphasized local discovery.

Current 2026 delivery support allows eligible items to be sold across the UK with:
- home delivery;
- parcelshop delivery;
- lockers;
- tracking;
- prepaid label / QR workflows.

This changes the effective geography of inventory.

Recommended:

```text
ListingReach {
  pickup_only
  local_delivery
  national_delivery
  delivery_radius
  carrier_supported
}
```

A listing physically located in Manchester may now be economically accessible to a buyer in London.

Therefore Phoenix should distinguish:
- listing location;
- pickup geography;
- delivery geography;
- buyer reachable geography.

---

## PD-155 — Marketplace Infrastructure Can Be Composed From Specialist Partners

Gumtree's transaction stack is assembled using specialist providers.

Verified examples:
- Mangopay for payment infrastructure;
- ShipStation API / carrier integrations for logistics orchestration;
- delivery/carrier services for parcel movement.

Recommended:

```text
MarketplaceInfrastructureRole {
  capability
  marketplace
  infrastructure_provider
  responsibility
}
```

This gives Phoenix a clearer view of where trust, payment and delivery risk actually sits.

A marketplace can own the user experience while outsourcing regulated or specialist infrastructure.

---

## 3. Professional / feed ecosystem

Gumtree for Business documents professional accounts, Pro Console, account managers and volume advertising.

Current property-business material explicitly states that online agents can post using a **feed**.

Therefore structured ingestion exists at least for specific professional verticals.

Direction:

```text
Property agent
   ↓ feed
Gumtree
```

This is not evidence that Gumtree exposes an outbound search feed to Phoenix.

It reinforces Partner Surface Directionality.

Recommended partnership questions:
1. Is a licensed catalog/search feed available to discovery/comparison partners?
2. Can listing deltas/removals be consumed?
3. Can transaction-capability fields be exposed?
4. Can delivery eligibility be exposed?
5. Can verified business badges/checks be surfaced?
6. Can Bump Up/original publication timestamps be distinguished?
7. Are professional feeds standardized?
8. Can deep links and referral attribution be licensed?

---

## 4. Ranking / promotion mechanics

Current promotion options include:
- Featured Ads;
- Spotlight;
- Bump Up;
- Urgent;
- URL linking.

Featured Ads rotate in promoted category positions.
Spotlight rotates on the homepage.
Bump Up moves the ad to the top and can mutate its posted date.
Some Services promotions support auto-renewal in 2026.

Phoenix must therefore preserve promotion provenance independently from organic relevance.

---

## 5. Trust and safety

Current Gumtree safety infrastructure includes:
- dedicated trust/safety operations;
- user reporting;
- moderation;
- duplicate/prohibited-listing rules;
- business verification;
- profile/review history;
- integrated buyer protection for eligible transactions;
- UK Online Safety Act compliance processes;
- product safety/recall guidance.

Gumtree states that it actively detects/removes illegal or harmful content.

This is source-governance evidence, not proof that every listing is factual or safe.

---

## 6. Buyer protection scope

Current Terms state that Buyer Protection applies when:
- an eligible item is purchased using Buy Now;
- payment is made through the approved payment provider;
- the transaction uses Gumtree payment/delivery services.

Potential covered cases include:
- non-delivery;
- significantly not as described;
- transit damage.

Therefore buyer protection must remain tied to the specific transaction path.

---

## 7. Access / scraping compliance

Current Terms explicitly prohibit:

- robots;
- spiders;
- scrapers;
- other automated means

used to access Gumtree and collect content without express written permission.

They also prohibit:
- bypassing access restrictions;
- collecting user information without consent;
- copying/distributing user content without consent;
- unreasonable infrastructure load.

Therefore:

```text
public_html = YES
public_general_search_api = NOT IDENTIFIED
professional_inbound_feeds = YES (vertical-specific evidence)
unauthorized_scraping = EXPLICIT NO-GO
preferred_route = written permission / commercial partnership / licensed feed/API
```

This is one of the clearest access classifications in Atlas.

---

## 8. Distribution / syndication

Current Terms state that some Gumtree features can display ads on other sites, services, applications, tools or third-party platforms including social media.

Therefore Gumtree can also act as a distribution hub.

This reinforces:
- distribution-network evidence;
- syndication provenance;
- cross-surface duplicate awareness.

---

## 9. Phoenix Decision Engine opportunity

Gumtree creates an important mixed-marketplace decision flow:

```text
Listing
  ↓
Is integrated transaction enabled?
  ├── NO → local/off-platform risk model
  └── YES
        ↓
      Buy Now
        ↓
      payment held
        ↓
      tracked delivery
        ↓
      buyer protection
```

Therefore two visually similar Gumtree listings may have meaningfully different:
- transaction risk;
- delivery reach;
- dispute support;
- payment protection;
- total convenience.

Phoenix can explain this difference.

---

## 10. Capability Impact

- partial_transactionality
- transaction_eligibility_matrix
- payment_hold_state
- provider_specific_freshness
- business_verification_evidence
- delivery_reach
- infrastructure_provider_graph
- professional_feed_capability
- buyer_protection_context
- distribution_provenance

---

## 11. Reusable DevKit Components

1. `ListingTransactionCapabilityMapper`
2. `TransactionEligibilityMapper`
3. `PaymentStateMapper`
4. `FreshnessEvidenceMapper`
5. `BusinessVerificationEvidenceMapper`
6. `ListingReachMapper`
7. `MarketplaceInfrastructureGraph`
8. `ProfessionalFeedCapabilityRegistry`
9. `BuyerProtectionEvidenceMapper`
10. `DistributionProvenanceMapper`

---

## 12. Strategic Score

| Dimension | Score |
|---|---:|
| UK marketplace relevance | 100 |
| Inventory breadth | 100 |
| Recommerce importance | 100 |
| Transaction intelligence | 100 |
| Trust/safety intelligence | 98 |
| Professional integration evidence | 90 |
| Architecture learning | 100 |
| Partnership strategic value | 98 |
| Public search API certainty | 25 |
| Unauthorized scraping suitability | 0 |
| Decision Engine value | 100 |

**Indicative Strategic Score: 97 / 100**

---

## 13. Final Decision

### GO STRATEGICO — AUTHORIZED PARTNERSHIP / DATA ACCESS ONLY

Gumtree should be considered a Tier-1 UK Phoenix target.

But it must not be implemented as an unauthorized scraper.

The central architectural conclusion is:

> A marketplace can be simultaneously a traditional classifieds platform and a transactional e-commerce platform. The capability belongs to the listing/transaction context, not simply to the marketplace brand.

This is directly relevant to Phoenix because the Decision Engine must compare not only products and prices, but also **how safely, quickly and conveniently each item can actually be acquired**.

---

## 14. Canonical Discoveries

- PD-149 — Marketplace Transactionality Can Be Partial and Progressive
- PD-150 — Transaction Eligibility Is a Matrix
- PD-151 — Payment Hold State Is Transaction Evidence
- PD-152 — Promotion Can Rewrite Apparent Publication Date
- PD-153 — Verification Badge Must Preserve Verification Method
- PD-154 — Integrated Logistics Can Convert Local Inventory Into National Inventory
- PD-155 — Marketplace Infrastructure Can Be Composed From Specialist Partners

Reinforced:
- PD-014 Promotion Provenance
- PD-054 Renewal-Aware Freshness
- PD-056 Trust Evidence, Not Trust Score
- PD-061 Partner Surface Directionality
- PD-090 Transaction Capability Is a Ladder, Not a Boolean
- PD-096 Protection Eligibility Is Listing/Transaction Context
- PD-110 Marketplace Transaction Role Can Be Delegated
- PD-117 Promotion Mechanics Can Mutate Freshness
- PD-126 Marketplace Distribution Can Extend Through External Acquisition Channels

---

## 15. Sources

Canonical tracker:
- User-provided `marketplaces_europe(3).csv` — Tracker ID 44 = Gumtree.com / United Kingdom / general classifieds.

Current official research, 2026-08-02:
- https://www.gumtree.com/termsofuse
- https://www.gumtree.com/info/life/about-us/
- https://careers.gumtree.com/
- https://www.gumtree.com/info/safety/
- https://www.gumtree.com/info/safety/p/gumtree-for-business/gumtree-business-account/
- https://www.gumtree.com/info/life/gumtree-for-business/property/
- https://www.gumtree.com/info/safety/p/selling/gumtree-ad-promotion-costs/
- https://www.gumtree.com/info/safety/p/selling/gumtree-ad-bump-up-not-working/
- https://www.gumtree.com/info/safety/p/advice-guides/buying-and-selling-on-gumtree/ad-charges-on-gumtree/
- https://www.gumtree.com/info/safety/p/advice-guides/repost-delete-edit-your-gumtree-ad/
- https://www.gumtree.com/info/safety/p/payments/auto-renewal-of-featured-ads-bump-ups-in-services/
- https://www.gumtree.com/info/life/p/gumtree/press/gumtree-mangopay-wallet-first-marketplace-payments/
- https://www.gumtree.com/info/life/p/gumtree/press/gumtree-partners-shipstation-delivery/
- https://www.gumtree.com/info/life/p/gumtree/delivery-on-gumtree/how-to-buy-and-sell-completely-online/
- https://www.gumtree.com/info/life/p/gumtree/delivery-on-gumtree/buy-with-delivery-on-gumtree/
- https://www.gumtree.com/info/life/p/gumtree/gumtree-for-business/gumtree-business-seller-verification-launch/

Phoenix continuity:
- Tracker 43 Copart.de ended at PD-148.

This is a strategic/technical assessment, not legal advice.
