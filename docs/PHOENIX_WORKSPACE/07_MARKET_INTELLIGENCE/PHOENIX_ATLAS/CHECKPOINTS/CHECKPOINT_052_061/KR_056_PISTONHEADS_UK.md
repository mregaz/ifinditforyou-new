# PHOENIX ATLAS — KNOWLEDGE RECORD 056

## PistonHeads — United Kingdom

- Tracker ID: 56
- Country: United Kingdom
- Vertical: Premium / performance / enthusiast automotive marketplace and auctions
- Canonical domain: https://www.pistonheads.com/
- Operator: CarGurus UK Limited
- Corporate family: CarGurus
- Lifecycle: ACTIVE
- Research date: 2026-08-02
- Decision: GO STRATEGICO — partnership/licensed route
- Integration priority: HIGH for enthusiast/performance Automotive Capability Pack
- Discovery continuity: PD-221 → PD-227

## Executive Summary

PistonHeads is an active UK automotive marketplace focused on premium, performance and enthusiast vehicles. It combines classifieds, curated online auctions, editorial buying guidance and a large enthusiast community.

Its About page reports more than 1.3 million members and more than 200,000 cars for sale at the current observation point. PistonHeads was acquired by CarGurus in 2019 but continues to operate as an independent brand.

For Phoenix, PistonHeads is valuable because specialist automotive discovery contains evidence classes that broad marketplaces often underweight: community expertise, editorial context, auction bidding behaviour, curated consignment, seller interaction, reserve mechanics and transaction fees.

The current Terms prohibit systematic extraction of data by automated mechanisms except in strict conformance with the Robots Exclusion Protocol. That exception must not be interpreted as a commercial reuse licence. Phoenix should pursue permission, partnership or licensed access before production aggregation.

## PD-221 — Specialist Community Is Domain Evidence

PistonHeads combines a marketplace with more than two decades of editorial content, buying guides and enthusiast forums.

Recommended:

```text
DomainCommunityEvidence {
  provider
  subject
  editorial_depth
  community_depth
  discussion_context
  evidence_date
}
```

Community discussion can improve interpretation of rare/performance vehicles, but community opinion must remain separate from verified vehicle facts.

## PD-222 — Auction Curation Is Listing Provenance

PistonHeads states that auction vehicles are selected by its team and listings are developed with sellers using professional photography and detailed descriptions.

Recommended:

```text
ListingCurationEvidence {
  curated
  curator
  professional_photography
  editorial_description
  seller_interview
}
```

A curated auction listing has a different provenance from a self-service classified advert.

## PD-223 — Bid Activity Is Market-Interest Evidence

Auction surfaces expose current bids and bid counts.

Recommended:

```text
AuctionDemandEvidence {
  current_bid
  bid_count
  reserve_state
  time_remaining
  observed_at
}
```

Bid count can signal active market interest, but it is not equivalent to final market value.

## PD-224 — Reserve State Changes Transaction Probability

PistonHeads auctions can have a reserve, no reserve, or a reserve that has been met/approached.

Recommended:

```text
AuctionReserveEvidence {
  reserve_exists
  reserve_amount_public
  reserve_met
  no_reserve
}
```

A high bid below reserve is not equivalent to an executable transaction price.

## PD-225 — Buyer Fee Belongs in Acquisition Cost

Current PistonHeads auctions charge the winning buyer a non-refundable fee of 6% + VAT, with a minimum of £695 + VAT.

Recommended:

```text
AcquisitionCostEvidence {
  hammer_or_sale_price
  buyer_fee
  tax_on_fee
  transport
  registration
  other_costs
  total_acquisition_cost
}
```

Phoenix should compare total acquisition cost, not headline winning bid alone.

## PD-226 — Auction Platform Facilitation Can End Before Asset Payment

After a successful auction, PistonHeads charges the buyer fee and introduces buyer and seller; the parties then arrange vehicle payment, collection/shipping and associated costs.

Recommended:

```text
TransactionResponsibilityEvidence {
  platform_collects_asset_payment
  platform_collects_fee
  buyer_seller_settlement
  shipping_responsibility
  tax_registration_responsibility
}
```

Marketplace transaction mediation is therefore multi-stage rather than binary.

## PD-227 — Specialist Inventory Needs Collectability Evidence

PistonHeads focuses heavily on premium, performance, classic and enthusiast vehicles, including modified and rare examples.

Recommended future Phoenix model:

```text
CollectabilityEvidence {
  rarity
  special_edition
  originality
  modification_state
  provenance
  enthusiast_demand
  editorial_significance
}
```

These dimensions can materially affect value beyond age, mileage and generic market comparables.

They must be evidence-based and should not be collapsed into a speculative single collectability score.

## Current Marketplace Evidence

Current official surfaces show:
- classifieds and auctions;
- more than 200,000 cars for sale at observation;
- more than 1.3 million members;
- premium/performance positioning;
- curated auctions;
- professional photography and descriptions;
- reserve/no-reserve mechanics;
- Make an Offer;
- buyer fees;
- seller/customer support;
- community/forum Q&A;
- editorial reviews and buying guides.

## Corporate Context

PistonHeads was acquired by CarGurus in 2019 and remains an independent brand while using CarGurus technology to enhance classifieds/site experience.

Recommended:

```text
CorporateCapabilityGraph
CarGurus
  └── PistonHeads
       ├── classifieds
       ├── auctions
       ├── editorial
       └── community
```

Phoenix must not assume shared commercial data rights across corporate-family products.

## Access Posture

Current PistonHeads Terms prohibit systematic extraction of data/data fields using automated mechanisms such as robots, crawlers or spiders, except in strict conformance with the Robots Exclusion Protocol.

Therefore:

```text
public_html = YES
systematic_automated_extraction = RESTRICTED
robots_conformance_exception = PRESENT
commercial_reuse_rights = NOT ESTABLISHED
```

Preferred Phoenix route:

```text
permission / partnership / licensed interface
```

Robots compliance alone is not sufficient evidence of commercial aggregation rights.

## Reusable DevKit Components

1. `DomainCommunityEvidenceMapper`
2. `ListingCurationEvidenceMapper`
3. `AuctionDemandEvidenceMapper`
4. `AuctionReserveEvidenceMapper`
5. `AcquisitionCostCalculator`
6. `TransactionResponsibilityMapper`
7. `CollectabilityEvidenceMapper`
8. `AuctionCapabilityPack`
9. `EnthusiastVehicleCapabilityPack`
10. `CorporateCapabilityGraph`

## Strategic Score

| Dimension | Score |
|---|---:|
| UK enthusiast automotive relevance | 100 |
| Premium/performance inventory | 100 |
| Auction intelligence | 98 |
| Community intelligence | 100 |
| Editorial depth | 100 |
| Collectability learning | 100 |
| Architecture learning | 100 |
| Public API readiness | 20 |
| Partnership value | 94 |
| Decision Engine value | 98 |

**Indicative Strategic Score: 94 / 100**

## Final Decision

### GO STRATEGICO — PARTNERSHIP / LICENSED ROUTE

PistonHeads is a high-value specialist source for Phoenix Automotive, especially for performance, premium, classic and enthusiast vehicles.

Central conclusion:

> Specialist automotive value cannot be modeled from price, age and mileage alone. Phoenix must preserve curation, auction demand, reserve state, total acquisition cost, community expertise, provenance and collectability evidence as distinct signals.

## Canonical Discoveries

- PD-221 — Specialist Community Is Domain Evidence
- PD-222 — Auction Curation Is Listing Provenance
- PD-223 — Bid Activity Is Market-Interest Evidence
- PD-224 — Reserve State Changes Transaction Probability
- PD-225 — Buyer Fee Belongs in Acquisition Cost
- PD-226 — Auction Platform Facilitation Can End Before Asset Payment
- PD-227 — Specialist Inventory Needs Collectability Evidence

Reinforced:
- PD-056 — Trust Evidence, Not Trust Score
- PD-099 — Auction Transaction Evidence
- PD-102 — Auction Fees Belong in Total Acquisition Cost
- PD-214 — Vehicle Value Depends on Transaction Context
- PD-217 — Vehicle History Is Multi-Source Risk Evidence
- PD-219 — Model Boundaries Must Be Explicit

## Sources

Current official PistonHeads research, 2026-08-02:
- https://www.pistonheads.com/about-us
- https://www.pistonheads.com/buy
- https://www.pistonheads.com/buy/auctions
- https://www.pistonheads.com/buy/auctions/how-auctions-work
- https://www.pistonheads.com/sell
- https://www.pistonheads.com/terms-and-conditions
- https://www.pistonheads.com/auction-terms-and-conditions

Research limitations:
- Marketplace inventory counts are dynamic.
- No public Phoenix-oriented catalog API was established.
- Robots-conformance language does not establish commercial reuse rights.
- Collectability must remain evidence-based and model-bounded.

This is a strategic/technical assessment, not legal advice.
