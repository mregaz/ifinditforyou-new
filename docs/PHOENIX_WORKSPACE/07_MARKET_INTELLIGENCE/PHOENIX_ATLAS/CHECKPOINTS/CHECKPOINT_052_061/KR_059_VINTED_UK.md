# PHOENIX ATLAS — KNOWLEDGE RECORD 059

## Vinted — United Kingdom

- Tracker ID: 59
- Country: United Kingdom
- Vertical: Fashion / second-hand / recommerce / selected electronics
- Canonical domain: https://www.vinted.co.uk/
- Lifecycle: ACTIVE
- Research date: 2026-08-02
- Decision: GO STRATEGICO — Pro/partner integration route where eligible
- Integration priority: VERY HIGH
- Discovery continuity: PD-242 → PD-248

## Executive Summary

Vinted UK is a major recommerce marketplace with integrated payments, Buyer Protection, shipping, verification services, Pro seller infrastructure and selected partner API access.

For Phoenix, Vinted is especially valuable because its transaction architecture is tightly integrated into the listing lifecycle: Buyer Protection applies to Buy Now purchases, payment release depends on delivery/issue state, integrated shipping can be mandatory for verification-eligible orders, and optional Item/Electronics Verification introduces physical inspection before delivery.

Vinted Pro Integrations exposes an API for selected professional sellers, especially high-end second-hand fashion sellers, but the API is seller/inventory-management oriented rather than evidence of an unrestricted marketplace search API.

Phoenix should therefore treat Vinted as a Tier-1 recommerce target, but pursue authorized partner/commercial access rather than consumer-page scraping.

## PD-242 — Protection Applies to a Transaction Path, Not to Mere Listing Presence

Vinted Buyer Protection applies to purchases made through the `Buy now` button.

If the buyer does not use Buy Now, the platform's Buyer Protection flow does not apply.

Recommended:

```text
TransactionProtectionEvidence {
  transaction_path
  buy_now_used
  payment_system_used
  protection_applies
}
```

A listing on Vinted is not automatically a protected transaction.

## PD-243 — Payment Release Is State-Dependent

Vinted holds transaction proceeds until delivery/issue conditions are resolved. If the buyer does not report an issue within the applicable period, the order completes and payment is released.

Recommended:

```text
TransactionState {
  paid
  shipped
  delivered
  issue_window_open
  disputed
  completed
  seller_paid
}
```

Phoenix should preserve payment-release state as transaction evidence.

## PD-244 — Verification Can Insert a Physical Inspection Hub Into Fulfilment

Item Verification and Electronics Verification can route an item to a verification hub before it reaches the buyer.

For eligible electronics, the verification process can check:
- functionality
- condition
- attributes
- authenticity

Recommended:

```text
VerificationFulfilmentEvidence {
  verification_type
  hub_required
  authenticity_check
  functionality_check
  condition_check
  listing_consistency_check
  report_available
}
```

This is a materially different fulfilment path from ordinary peer-to-peer shipping.

## PD-245 — Integrated Shipping Can Be Mandatory Because of Verification Eligibility

Vinted states that integrated shipping is the only available option for orders bought with verification services and for certain items eligible for verification.

Recommended:

```text
ShippingConstraintEvidence {
  integrated_shipping_required
  reason
  verification_eligible
  carrier_options[]
}
```

Shipping capability can therefore be constrained by trust/safety requirements.

## PD-246 — Pro Seller Status Changes Legal and Return Context

Vinted distinguishes ordinary members from Pro sellers.

Current Pro seller requirements include identity, business registration and traceability information. Purchases from Pro sellers follow different refund/return rules from consumer-to-consumer purchases.

Recommended:

```text
SellerRegulatoryContext {
  seller_type
  business_registration
  identity_verified
  traceability_required
  return_regime
  consumer_law_context
}
```

Phoenix must preserve seller legal context, not merely seller reputation.

## PD-247 — Partner API Eligibility Can Be Business-Model Specific

Vinted Pro Integrations is available only to selected professional sellers and explicitly targets second-hand luxury/designer sellers who meet technical requirements.

Current requirements include:
- API implementation capability
- taxonomy mapping
- setup/onboarding period

Recommended:

```text
PartnerAPIEligibility {
  seller_type
  vertical
  scale
  technical_requirements[]
  approval_required
}
```

An official API may be available only to a narrow business model, not to general third-party search engines.

## PD-248 — International Recommerce Can Internalize Customs and Currency Friction

Vinted UK supports selected international selling/buying flows with integrated shipping and customs handling.

Current UK help describes international sales with the US and Australia where:
- integrated shipping is used
- customs are handled within the flow
- Buyer Protection still applies
- import VAT may be refunded where applicable

Recommended:

```text
CrossBorderTransactionEvidence {
  origin_country
  destination_country
  integrated_shipping
  customs_handled
  import_vat
  currency_conversion
  protection_applies
}
```

Phoenix should treat international recommerce as a richer transaction context than merely cross-border location matching.

## Current Trust / Safety Evidence

Vinted currently provides:
- Buyer Protection for Buy Now purchases
- mandatory Buyer Protection fee
- refund/dispute workflows
- anti-counterfeit policies
- automated and human moderation
- Item Verification
- Electronics Verification
- Pro seller identity/business requirements
- verified reviews from real buyers in standard selling guidance
- shipping compensation under integrated shipping conditions

Important semantic distinctions:
- moderation != factual verification
- buyer protection != legal consumer rights
- private seller != Pro seller
- verification eligibility != verification completed

## Access / Integration Posture

Verified:
- active marketplace
- Vinted Pro Integrations API
- selected Pro seller eligibility
- partner onboarding route
- API-based inventory synchronization
- shipping-label automation

Not established:
- unrestricted public search API
- public full-marketplace export feed
- general Phoenix catalog rights

Recommended:

```text
production_scraping = DO NOT USE
preferred_route = Vinted Pro/partner integration or commercial agreement
```

## Reusable DevKit Components

1. `TransactionProtectionEvidenceMapper`
2. `TransactionStateMapper`
3. `VerificationFulfilmentMapper`
4. `ShippingConstraintMapper`
5. `SellerRegulatoryContextMapper`
6. `PartnerAPIEligibilityRegistry`
7. `CrossBorderTransactionEvidenceMapper`
8. `FashionRecommerceCapabilityPack`
9. `VerificationHubWorkflow`
10. `IntegratedShippingPolicyMapper`

## Strategic Score

| Dimension | Score |
|---|---:|
| UK fashion relevance | 100 |
| Recommerce relevance | 100 |
| Transaction integration | 100 |
| Protection intelligence | 100 |
| Verification intelligence | 100 |
| Shipping integration | 100 |
| Pro seller infrastructure | 98 |
| Partner API maturity | 95 |
| Architecture learning | 100 |
| Decision Engine value | 99 |

**Indicative Strategic Score: 99 / 100**

## Final Decision

### GO STRATEGICO — PRO/PARTNER INTEGRATION ROUTE

Vinted is a Tier-1 Phoenix fashion/recommerce target.

Central conclusion:

> Recommerce decision intelligence must understand not only item, price and seller, but also the exact purchase path, payment-release state, verification hub, shipping constraints, seller legal status and cross-border transaction context.

## Canonical Discoveries

- PD-242 — Protection Applies to a Transaction Path, Not to Mere Listing Presence
- PD-243 — Payment Release Is State-Dependent
- PD-244 — Verification Can Insert a Physical Inspection Hub Into Fulfilment
- PD-245 — Integrated Shipping Can Be Mandatory Because of Verification Eligibility
- PD-246 — Pro Seller Status Changes Legal and Return Context
- PD-247 — Partner API Eligibility Can Be Business-Model Specific
- PD-248 — International Recommerce Can Internalize Customs and Currency Friction

Reinforced:
- PD-056 — Trust Evidence, Not Trust Score
- PD-090 — Transaction Capability Is a Ladder, Not a Boolean
- PD-096 — Protection Eligibility Is Listing/Transaction Context
- PD-150 — Transaction Eligibility Is a Matrix
- PD-200 — API Existence Must Preserve Purpose and Licence Scope
- PD-241 — Buyer and Seller Protection Can Have Different Eligibility Rules

## Sources

Current official Vinted UK research, 2026-08-02:
- Vinted Buyer Protection
- Vinted Refund Policy
- Vinted Returning an item
- Vinted Item authenticity / counterfeits policy
- Vinted Electronics Verification
- Vinted Shipping
- Vinted Mandatory information for Pro sellers
- Vinted Pro Integrations
- Vinted International sales
- Vinted Selling basics

Research limitations:
- Partner API scope is seller-side and eligibility-restricted.
- No unrestricted public catalog/search API was established.
- Buyer Protection and return rules differ between standard and Pro sellers.
- International eligibility/routes are time-sensitive.

This is a strategic/technical assessment, not legal advice.
