# PHOENIX ATLAS — KNOWLEDGE RECORD 060

## Vestiaire Collective — United Kingdom

- Tracker ID: 60
- Country: United Kingdom
- Vertical: Luxury fashion / authenticated recommerce
- Canonical domain: https://www.vestiairecollective.com/
- Lifecycle: ACTIVE
- Research date: 2026-08-02
- Decision: GO STRATEGICO — partnership/licensed access preferred
- Integration priority: VERY HIGH for Luxury Fashion Capability Pack
- Discovery continuity: PD-249 → PD-255

## Executive Summary

Vestiaire Collective is a strategically important luxury-fashion recommerce marketplace. The canonical Phoenix tracker identifies it as Tracker 60, UK, Luxury fashion.

Its architecture differs materially from ordinary second-hand marketplaces because fulfilment can follow three distinct trust/logistics paths: Authenticated Shipping, Direct Shipping, or Express Delivery. Authentication and Quality Control can therefore be either pre-purchase-stocked, transaction-time physical inspection, or bypassed under eligible Direct Shipping rules.

This makes Vestiaire Collective an excellent benchmark for Phoenix's Luxury Fashion Capability Pack.

No unrestricted public Phoenix-oriented marketplace-search API was established in this research. Production integration should therefore use permission, partnership or licensed access.

## PD-249 — Fulfilment Path Is Trust Evidence

Vestiaire Collective exposes three delivery paths:
- Authenticated Shipping;
- Direct Shipping;
- Express Delivery.

Recommended:

FulfilmentTrustPath {
  mode
  physical_authentication
  quality_control
  inventory_prepositioned
  seller_to_buyer_direct
}

The same marketplace can therefore expose materially different trust levels depending on the fulfilment path selected for a specific item/order.

## PD-250 — Authentication Can Be Optional Based on Transaction Eligibility

Direct Shipping bypasses Vestiaire Collective's pre-delivery physical authentication.

Eligibility depends on factors including item price, buyer/seller geography and, for some items, brand/professional-seller rules.

Recommended:

AuthenticationRoutingEvidence {
  authentication_required
  authentication_optional
  eligibility_basis[]
  selected_shipping_mode
}

Phoenix must not infer `Vestiaire listing = physically authenticated`.

## PD-251 — Authentication and Quality Conformity Are Separate Checks

Authenticated Shipping includes both:
- authentication against brand criteria;
- quality control against listing description, including condition, colour and size.

Recommended:

LuxuryInspectionEvidence {
  authenticity_result
  listing_conformity_result
  condition_result
  colour_result
  size_result
}

This reinforces the Atlas rule that authenticity and listing consistency are distinct evidence dimensions.

## PD-252 — Pre-Authenticated Inventory Changes Delivery Semantics

Express Delivery indicates that an item is already held by Vestiaire Collective, has already passed authenticity and quality-conformity checks, and can be dispatched rapidly.

Recommended:

InventoryCustodyEvidence {
  held_by_marketplace
  pre_authenticated
  quality_checked
  ready_to_dispatch
}

Phoenix should distinguish seller-held inventory from marketplace-custodied inventory.

## PD-253 — Authentication Has an Explicit Economic Cost

For UK Authenticated Shipping, Vestiaire Collective currently states an authentication fee of £15. If Direct Shipping is unavailable, physical authentication may be included within the buyer service fee.

Recommended:

TrustServiceCostEvidence {
  service
  fee
  currency
  embedded_in_other_fee
  optional
  mandatory
}

Trust infrastructure therefore belongs in Total Acquisition Cost.

## PD-254 — Professional Seller Status Changes Return Rights

Vestiaire Collective currently provides a 14-day change-of-mind return policy for purchases from Professional Sellers.

Return routing also depends on fulfilment path:
- Direct Shipping can return directly to the professional seller;
- authenticated transactions can return through Vestiaire Collective for condition checking/storage/relisting.

Recommended:

ReturnPathEvidence {
  seller_type
  return_window
  fulfilment_mode
  return_destination
  reinspection_required
}

Return rights and logistics are transaction-contextual.

## PD-255 — Seller Economics Need Net-Proceeds Modeling

Current UK seller fees include a selling fee plus payment-processing fee, with fixed fee bands at low/high item values.

Recommended:

SellerNetProceeds {
  sale_price
  selling_fee
  processing_fee
  other_deductions
  net_proceeds
}

Phoenix should distinguish buyer acquisition cost from seller net proceeds. These are two different economic views of the same transaction.

## Access Posture

Verified:
- active public marketplace;
- sophisticated authentication/quality-control workflow;
- professional seller model;
- international logistics;
- direct and authenticated shipping.

Not established:
- unrestricted public marketplace-search API;
- unrestricted catalog feed;
- Phoenix commercial redistribution rights.

Recommended:

production_scraping = DO NOT USE
preferred_route = partnership / licensed access / authorized interface

## Reusable DevKit Components

1. FulfilmentTrustPathMapper
2. AuthenticationRoutingMapper
3. LuxuryInspectionEvidenceMapper
4. InventoryCustodyMapper
5. TrustServiceCostMapper
6. ReturnPathMapper
7. SellerNetProceedsCalculator
8. LuxuryFashionCapabilityPack
9. AuthenticationWorkflow
10. TransactionEconomicsMapper

## Strategic Score

| Dimension | Score |
|---|---:|
| Luxury-fashion relevance | 100 |
| Authentication intelligence | 100 |
| Quality-control intelligence | 100 |
| Fulfilment intelligence | 100 |
| Professional seller context | 98 |
| Transaction economics | 98 |
| Architecture learning | 100 |
| Public API readiness | 25 |
| Partnership value | 98 |
| Decision Engine value | 100 |

Indicative Strategic Score: 92 / 100

## Final Decision

### GO STRATEGICO — PARTNERSHIP / LICENSED ACCESS

Central conclusion:

> Luxury recommerce requires Phoenix to model the trust path of each transaction: whether an item is physically authenticated, who holds it, which conformity checks occurred, what those trust services cost, and which return regime applies.

## Canonical Discoveries

- PD-249 — Fulfilment Path Is Trust Evidence
- PD-250 — Authentication Can Be Optional Based on Transaction Eligibility
- PD-251 — Authentication and Quality Conformity Are Separate Checks
- PD-252 — Pre-Authenticated Inventory Changes Delivery Semantics
- PD-253 — Authentication Has an Explicit Economic Cost
- PD-254 — Professional Seller Status Changes Return Rights
- PD-255 — Seller Economics Need Net-Proceeds Modeling

Reinforced:
- PD-056 — Trust Evidence, Not Trust Score
- PD-096 — Protection Eligibility Is Listing/Transaction Context
- PD-150 — Transaction Eligibility Is a Matrix
- PD-225 — Buyer Fee Belongs in Acquisition Cost
- PD-232 — Authentication Eligibility Is Rule-Based and Transaction-Contextual
- PD-233 — Physical Authentication Can Verify Listing Consistency Separately From Authenticity
- PD-244 — Verification Can Insert a Physical Inspection Hub Into Fulfilment
- PD-246 — Pro Seller Status Changes Legal and Return Context

## Sources

Canonical Phoenix evidence:
- PHOENIX_ATLAS_PROVIDER_TRACKER.csv — Tracker 60 = Vestiaire Collective / UK / Luxury fashion.

Current official Vestiaire Collective research, 2026-08-02:
- Buyer: Shipping Options
- Buyer/Seller: Direct Shipping
- Buyer: Authentication Fees
- Seller: Selling with Authentication
- Professional Seller Return Policy
- Seller: Selling Fees
- Buyer/Seller Item Conditions
- Buyer/Seller Terms & Conditions

Research limitations:
- Fees, eligibility thresholds and shipping routes are time-sensitive.
- No unrestricted public Phoenix-oriented catalog/search API was established.
- Authentication availability must be evaluated per transaction/item, not provider-wide.

This is a strategic/technical assessment, not legal advice.
