# PHOENIX ATLAS — KNOWLEDGE RECORD 035

## Gobid.es — Spain

- Tracker ID: 35
- Country: Spain / international Gobid network
- Vertical: Industrial, judicial, insolvency and private online auctions
- Canonical domain: https://www.gobid.es/
- Spain operator: GOBID ESPAÑA SL
- Provider family: Gobid Group
- Lifecycle: ACTIVE
- Research date: 2026-08-01
- Decision: GO STRATEGICO CONDIZIONATO — authorization/partnership only
- Integration priority: HIGH for Industrial Auction Capability Pack
- Indicative Strategic Score: 94 / 100

## Executive Summary

Gobid.es is an active Spanish online-auction platform within Gobid Group. It specializes in asset liquidation and remarketing across industrial machinery, vehicles, real estate, business assets, logistics, nautical, construction, agriculture, jewelry, gaming, electronics and art/collectibles.

The Spanish site states that Gobid España acts as an "Entidad Especializada" in regulated liquidation processes and offers end-to-end asset-sale management.

Gobid's auction mechanics are substantially richer than ordinary listing marketplaces: deposits, static bids, hidden proxy/dynamic bids, reserve prices, automatic time extensions, multi-level auctions, lot combinations, whole-auction lots, Buy Now and provisional awards.

For Phoenix this is a high-value benchmark for an IndustrialAuctionCapabilityPack.

Access is not open for reuse: Gobid's Terms reserve intellectual-property rights and prohibit copying, downloading, publishing or distributing site information without written authorization except for personal use. No public Phoenix-suitable search API/export feed was identified. Production collection should therefore remain disabled pending authorization.

## Current Spain surface

Current Gobid.es exposes active auctions involving:
- industrial machinery and equipment;
- vehicles;
- real estate;
- business branches/business units;
- construction assets;
- logistics;
- agricultural machinery;
- woodworking;
- plastics;
- printing;
- food/restaurant equipment;
- office furniture;
- jewelry;
- gaming;
- Apple products;
- art and collectibles.

Current auction pages also distinguish judicial/insolvency procedures and private sales.

## Corporate/provider family

Gobid.es explicitly identifies itself as part of Gobid Group, which operates proprietary platforms including Gobid.es, Gobid.it and Gobidreal.

Recommended:

```text
GobidGroup
├── Gobid.es
├── Gobid.it
└── Gobidreal
```

Do not assume all platforms expose identical inventory or transaction rules.

## PD-104 — Auction Participation Has Financial Preconditions

Gobid auctions can require a specific security deposit before a bidder is authorized to participate.

Recommended:

```text
ParticipationRequirement {
  registration_required
  auction_registration_required
  deposit_required
  deposit_amount
  deposit_currency
  deposit_scope
  refund_policy
  forfeiture_conditions
}
```

Search availability and bid eligibility are different states.

Phoenix Decision Intelligence should be able to explain not only "this lot exists" but "what is required to participate."

## PD-105 — Auction Price Is a Stack, Not a Number

Gobid explains that the starting/current bid does not include all transaction costs. Specific auction conditions can add buyer's premium, assistance costs and taxes.

Therefore:

```text
AuctionPriceStack {
  starting_price
  current_bid
  minimum_increment
  buyer_premium
  assistance_fees
  taxes
  deposit
  estimated_total_acquisition_cost
}
```

Comparing auction lots solely by displayed bid price can be materially misleading.

Phoenix should compare estimated acquisition cost whenever the required components are available.

## PD-106 — Auction End Time Can Be Dynamic

Gobid uses extra-time mechanics: qualifying late bids can extend the auction repeatedly. The documentation also states that the extra-time mechanism can operate at auction level rather than merely at individual-lot level.

Therefore:

```text
AuctionTimeEvidence {
  scheduled_end_at
  extension_rule
  extension_duration
  extension_scope
  current_effective_end_at
  final_end_at
}
```

A scheduled end timestamp is not necessarily the real closing time.

This matters for alerts and time-sensitive Decision Intelligence.

## PD-107 — Auction Allocation Can Be Combinatorial

Gobid supports:
- individual lots;
- lot combinations;
- whole-auction Lot 0;
- multi-level auctions where higher-level combinations can take priority over lower-level groups.

This means the apparent highest bid on an individual lot may not determine the final allocation.

Recommended:

```text
AuctionAllocationStructure {
  individual_lots
  combinations[]
  whole_lot
  levels[]
  priority_rules
}
```

This is fundamentally different from standard marketplace inventory and from simple one-lot auctions.

## PD-108 — Highest Bid Can Be Provisional

Gobid documentation states that when reserve conditions are satisfied, the highest bidder can receive provisional award confirmation; when reserve is not reached, award can depend on the discretion of the procedural authority.

Therefore:

```text
AwardStatus {
  leading_bid
  reserve_reached
  provisional_award
  authority_confirmation_required
  final_award
}
```

Phoenix must not translate `highest_bidder` into `buyer` or `sold` prematurely.

## Bidding mechanics

Gobid documents:
- static bids;
- dynamic/proxy maximum bids;
- automatic bid increments;
- minimum bid increments;
- visible or hidden reserve prices;
- extra time;
- no-minimum-price auctions;
- multi-level auctions;
- Buy Now;
- whole lots;
- combinations.

This validates a much richer auction state machine than the generic Finder model.

## Historical-result limitation

Gobid's FAQ states that prices from completed auctions are not simply exposed as an unrestricted public historical-results dataset; requests for such information are handled separately.

This differentiates Gobid from Bidspirit, where historical auction results are a prominent discovery surface.

Therefore Phoenix should score:
- current inventory value;
- historical comparable accessibility;
separately.

## Access / compliance

Gobid's published Terms state that information may not be copied, downloaded, published or distributed without written authorization, except for personal use.

No public general-purpose search API or Phoenix-suitable export feed was identified in this research.

Recommended posture:

```text
public_html = yes
public_search_api = not_identified
public_export_feed = not_identified
commercial_sale_service = verified
production_collection = NO-GO without written authorization
preferred_route = partnership / authorized feed / commercial agreement
```

## Partnership opportunity

Gobid explicitly markets end-to-end online-auction and industrial remarketing services.

A Phoenix discussion should ask:
1. Is a partner search/catalog feed available?
2. Can active auction/lot metadata be licensed?
3. Can effective end-time updates be consumed programmatically?
4. Are bid/current-price fields available to partners?
5. Can fees, buyer premium and reserve status be exposed?
6. Are Spanish and international Gobid surfaces accessible under one agreement?
7. Can Gobidreal be included?
8. What caching/display rules apply?

## Industrial Auction Capability Pack

Recommended fields/capabilities:

```text
procedure_type
court_or_authority
sale_number
auction_id
lot_id
lot_number
lot_combination
whole_lot
auction_level
asset_category
location
starting_price
current_bid
minimum_increment
reserve_status
buyer_premium
assistance_fees
taxes
deposit_required
deposit_amount
scheduled_end
effective_end
extension_rule
proxy_bid_supported
buy_now_supported
award_status
pickup_conditions
inspection_visit
```

## AI / Decision Engine Opportunities

Authorized Gobid data could enable:
- total acquisition-cost estimation;
- industrial-asset normalization;
- comparable machinery discovery;
- bid-vs-reserve reasoning;
- auction deadline alerts that understand extensions;
- lot/combination optimization;
- judicial/private-sale distinction;
- procedural-risk explanation;
- geographic/logistics cost reasoning;
- cross-Gobid-family deduplication.

## Reusable DevKit Components

1. `IndustrialAuctionCapabilityPack`
2. `ParticipationRequirementMapper`
3. `AuctionPriceStackMapper`
4. `AuctionTimeEvidenceMapper`
5. `AuctionAllocationStructureMapper`
6. `AwardStatusMapper`
7. `ProxyBidCapabilityMapper`
8. `ReservePriceEvidenceMapper`
9. `AuctionProcedureMapper`
10. `GobidProviderFamilyRegistry`

## Strategic Score

| Dimension | Score |
|---|---:|
| Industrial auction relevance | 100 |
| Spain relevance | 94 |
| Auction-mechanics intelligence | 100 |
| Architecture learning | 100 |
| Decision Engine value | 98 |
| Corporate-family reuse | 94 |
| Partnership potential | 94 |
| Historical-result accessibility | 55 |
| Public API readiness | 25 |
| Unauthorized reuse suitability | 0 |

**Indicative Strategic Score: 94 / 100**

## Final Decision

### GO STRATEGICO CONDIZIONATO — AUTHORIZATION/PARTNERSHIP ONLY

Gobid.es is a high-value Phoenix source and architectural benchmark, but not an unauthorized scraping target.

The central lesson is:

> An industrial auction is not a listing with a changing price. It is a financial and procedural state machine.

Phoenix must understand participation requirements, the full acquisition-cost stack, dynamic closing rules, combinatorial lot allocation and provisional awards before it can provide meaningful decision support.

## Canonical Discoveries

- PD-104 — Auction Participation Has Financial Preconditions
- PD-105 — Auction Price Is a Stack, Not a Number
- PD-106 — Auction End Time Can Be Dynamic
- PD-107 — Auction Allocation Can Be Combinatorial
- PD-108 — Highest Bid Can Be Provisional

Reinforced:
- PD-090 Transaction Capability Is a Ladder, Not a Boolean
- PD-100 Auction Lot Requires Event Context
- PD-101 Auction Result Is Historical Market Evidence
- PD-102 Auction Modality Is a First-Class Transaction Capability
- PD-103 White-Label Infrastructure Can Hide Provider-Family Technology

## Sources

Phoenix tracker evidence:
- PHOENIX_ATLAS_PROVIDER_TRACKER_UPDATED_014.csv — Tracker ID 35 = Gobid.es, Spain, industrial auctions.
- KR_034_BIDSPIRIT_ES.md — Discovery continuity through PD-103.

Current web research, 2026-08-01:
- https://www.gobid.es/es/home
- https://www.gobid.es/es/subastas/
- https://www.gobid.es/es/como-funciona/
- https://www.gobid.es/es/vender-con-nosotros/
- https://www.gobid.es/popup.php?info=condizioniUso
- current auction-specific conditions on Gobid.es
- https://www.gobidgroup.com/en/

This is a strategic/technical assessment, not legal advice.
