# PHOENIX ATLAS — KNOWLEDGE RECORD 042

## Autobid.de — Germany

- Tracker ID: 42
- Country: Germany / European B2B reach
- Vertical: B2B vehicle auctions
- Canonical domain: https://autobid.de/
- Operator / brand owner: Auktion & Markt AG
- Lifecycle: ACTIVE
- Research date: 2026-08-02
- Decision: GO STRATEGICO — B2B intelligence/partnership target; authorized access required
- Integration priority: VERY HIGH for professional vehicle intelligence
- Indicative Strategic Score: 96 / 100

## Executive Summary

Autobid.de is an active, dealer-only B2B vehicle-auction platform operated by Auktion & Markt AG. Official current material states that up to 4,500 vehicles are auctioned weekly, more than 150,000 annually, with buyers across Europe and auctions/interfaces available in 22 languages.

The platform is not a consumer marketplace. Participation is restricted to verified motor-vehicle dealers, and some auctions/brand portals impose still narrower eligibility rules.

Autobid combines online auctions with Netlive (online + live) auctions, brand-specific portals, vehicle-condition documentation, payment collection, transport/logistics and cross-border services.

For Phoenix this is strategically important because it introduces professional-market inventory and wholesale price evidence that can differ materially from consumer asking prices.

No public Phoenix-oriented catalog/search API was verified in the research. The correct route is authorized B2B partnership/data access, not assumption of public catalog rights.

## Canonical tracker evidence

The Phoenix Atlas canonical tracker identifies:

- ID 42
- Germany
- Autobid.de
- https://www.autobid.de
- Category: `Aste auto B2B`

Discovery continuity enters this record after DOSKIO.de PD-136.

## Current scale and operating model

Official Autobid material currently reports:
- up to 1,500 vehicles available/auctioned per day;
- up to 4,500 vehicles auctioned per week;
- more than 150,000 vehicles annually;
- up to 30,000 buyers;
- 22 languages;
- sales across roughly 40 European countries;
- nine auction centres in Germany plus logistics infrastructure.

Supply comes from professional sources including manufacturers, brand subsidiaries/dealerships, banks, leasing companies, rental companies, fleets and municipal enterprises.

Vehicle types include passenger cars, commercial vehicles, trucks, accident vehicles, special/municipal vehicles, caravans/motorhomes, motorcycles, e-bikes and electric/hybrid vehicles.

## PD-137 — Market Layer Is a First-Class Provider Dimension

Autobid is explicitly B2B and restricts bidding to verified vehicle dealers.

Therefore Phoenix cannot classify vehicle sources only by country/category.

Recommended:

```text
MarketLayer {
  consumer
  professional
  wholesale
  dealer_only
  closed_network
}
```

For Autobid:

```text
market_layer = dealer_only / wholesale
```

This matters because a wholesale auction price is not directly equivalent to a retail consumer asking price.

## PD-138 — Access Eligibility Can Be Hierarchical

Registration as a dealer does not automatically mean access to every auction.

Autobid exposes:
- open auctions for registered/approved dealers;
- brand portals;
- closed portals restricted to specific dealer networks, such as MINI/BMW dealer-only contexts.

Recommended:

```text
AccessEligibility {
  platform_eligible
  auction_eligible
  portal_eligible
  brand_network_required
  country_requirements
  business_age_requirement
  verification_state
}
```

Access is therefore hierarchical:

```text
PUBLIC DISCOVERY
      ↓
REGISTERED DEALER
      ↓
APPROVED BIDDER
      ↓
AUCTION ELIGIBILITY
      ↓
CLOSED BRAND-PORTAL ELIGIBILITY
```

This extends earlier participation-requirement discoveries.

## PD-139 — Vehicle Condition Evidence Can Outrank Generic Listing Metadata

Autobid documents vehicles using structured condition capture and numerous photographs. Current brand-portal listings can include detailed tyre measurements, equipment, condition descriptions, mileage/owner data and appraisal attachments.

Some auction notices explicitly state that where generic auction information conflicts with attached vehicle-condition documentation, the condition documentation prevails.

Recommended:

```text
VehicleConditionEvidence {
  source_type
  appraiser
  inspection_date
  mileage
  previous_owners
  damage[]
  tyre_data[]
  equipment[]
  photos[]
  attachments[]
  precedence
}
```

Phoenix should preserve evidence precedence rather than flatten all fields into one listing object.

## PD-140 — Wholesale Price Evidence Must Not Be Compared Directly With Retail Asking Price

Autobid provides professional auction clearing/bid evidence from a dealer-only market.

Consumer marketplaces generally expose retail asking prices.

These represent different market layers:

```text
Wholesale auction price
        !=
Retail asking price
        !=
Retail transaction price
```

Recommended:

```text
PriceMarketContext {
  market_layer
  price_type
  buyer_type
  seller_type
  transaction_stage
  taxes_and_fees_context
}
```

This can become extremely valuable for Phoenix vehicle valuation.

A consumer user might benefit from knowing that a retail asking price is high/low relative to professional wholesale evidence, but Phoenix must never present the values as directly equivalent without adjustment.

## PD-141 — Auction Inventory Can Be Segmented by Access Portal

Autobid operates dedicated brand portals, including open and closed surfaces.

Therefore one provider family can expose inventory through multiple access-controlled portals:

```text
AutobidProviderFamily
├── autobid.de
├── bmw.autobid.de
├── mini.autobid.de
├── bmw-yuc.autobid.de
├── vwn.autobid.de
└── car-auctions.de
```

Recommended:

```text
AuctionPortalEvidence {
  provider_family
  portal
  supplier_or_brand
  open_or_closed
  eligibility
  inventory_overlap_known
}
```

Portal identity is relevant to both access rights and inventory provenance.

## PD-142 — Auction Outcome Can Require Post-Bid Confirmation

Current Autobid auction conditions show that some vehicles can remain subject to confirmation after bidding. A bidder can be bound while the supplier still decides whether to accept the result, with notification following after the auction.

Therefore:

```text
highest_bid
    !=
final_sale
```

Recommended:

```text
AuctionOutcomeState {
  leading_bid
  auction_closed
  subject_to_confirmation
  supplier_acceptance_pending
  accepted
  rejected
  final_sale
}
```

This reinforces the provisional-award logic previously discovered in industrial auctions, but now inside professional vehicle remarketing.

## Bidding mechanics

Autobid documentation for its auction ecosystem describes:
- manual incremental bids;
- arbitrary visible bid amounts;
- automatic bidding agents with hidden maximum bid;
- online auctions;
- Netlive auctions;
- auctions subject to reservation/confirmation.

Recommended vehicle-auction capability fields include:

```text
auction_type
auction_number
auction_country
auction_status
supplier
brand_portal
start_time
end_time
starting_price
current_bid
bid_increment
automatic_bid_supported
reservation_or_confirmation
vehicle_location
condition_report
transport_available
```

## Transaction orchestration

Auktion & Markt states that it collects payment from purchasing dealers and transfers the selling price after the auction.

It also arranges transport/logistics and supports cross-border movement.

Therefore Autobid is more than a discovery layer:

```text
Discovery
Auction execution
Payment collection
Vehicle documentation
Transport/logistics
Cross-border support
```

Phoenix should model these as separate transaction/service capabilities.

## Cross-border evidence

Autobid operates across Europe. Official current material says nearly 30% of registered dealers come from European countries outside Germany, while vehicles are sold across approximately 40 European countries.

Transport documentation includes intra-EU and third-country flows.

This makes Autobid valuable for future cross-border vehicle-cost reasoning:

```text
purchase_price
+ auction fees
+ taxes
+ transport
+ registration/import context
= acquisition context
```

Exact taxes/registration costs remain jurisdiction-specific and must not be inferred without evidence.

## API / access assessment

Verified:
- public corporate/auction information;
- public auction schedules and some indexed vehicle/portal pages;
- authenticated dealer platform;
- professional B2B auction infrastructure.

Not verified:
- public third-party catalog/search API;
- public bulk export feed licensed for Phoenix;
- unrestricted commercial redistribution rights.

Recommended:

```text
public_information = YES
dealer_platform = YES
public_phoenix_search_api = NOT VERIFIED
partner_data_access = TO INVESTIGATE
production_collection = DISABLED until authorized
preferred_route = B2B partnership / licensed feed / authorized interface
```

Because much of the economically useful inventory is dealer-gated, unauthorized scraping would also fail to represent the actual access model correctly.

## Partnership questions

1. Is a catalog/search API or data feed available to approved technology partners?
2. Can Phoenix access auction schedules and vehicle metadata without bidding rights?
3. Can condition reports/appraisal data be licensed?
4. Are current bid, starting price and final result data available?
5. Can wholesale historical results be licensed for valuation?
6. Are brand portals included in one data agreement?
7. Can access/eligibility flags be exposed?
8. Are transport estimates available programmatically?
9. What storage, caching and redistribution rights apply?
10. Can data be used to generate consumer-facing valuation intelligence without exposing dealer-only restricted inventory?

## Phoenix strategic opportunity

Autobid could contribute something different from ordinary vehicle marketplaces:

```text
Consumer listings
        +
Professional wholesale auction evidence
        +
Vehicle condition evidence
        =
better valuation intelligence
```

Potential Decision Engine uses:
- wholesale-to-retail spread analysis;
- dealer acquisition benchmark;
- condition-adjusted price reasoning;
- cross-border acquisition analysis;
- auction-vs-fixed-price comparison;
- professional supply signals;
- EV/HEV remarketing evidence;
- fleet/leasing disposal intelligence.

This should only be implemented under appropriate data rights.

## Reusable DevKit Components

1. `MarketLayerMapper`
2. `AccessEligibilityMapper`
3. `VehicleConditionEvidenceMapper`
4. `PriceMarketContextMapper`
5. `AuctionPortalEvidenceMapper`
6. `AuctionOutcomeStateMapper`
7. `ProfessionalVehicleAuctionCapabilityPack`
8. `CrossBorderAcquisitionContext`
9. `EvidencePrecedenceResolver`
10. `WholesaleRetailComparisonGuard`

## Strategic Score

| Dimension | Score |
|---|---:|
| German vehicle-market relevance | 98 |
| B2B/wholesale intelligence | 100 |
| Inventory scale | 98 |
| Condition-data value | 100 |
| Cross-border intelligence | 98 |
| Architecture learning | 100 |
| Decision Engine value | 100 |
| Partnership value | 98 |
| Public API certainty | 30 |
| Consumer-direct inventory suitability | 45 |

**Indicative Strategic Score: 96 / 100**

## Final Decision

### GO STRATEGICO — AUTHORIZED B2B DATA/PARTNERSHIP TARGET

Autobid.de should not be treated as another consumer vehicle marketplace. Its primary Phoenix value is professional wholesale and vehicle-condition intelligence.

The central conclusion is:

> A vehicle price has meaning only inside its market layer. Phoenix must know whether it is looking at a consumer asking price, a dealer wholesale bid, an auction result or a final retail transaction before comparing values.

## Canonical Discoveries

- PD-137 — Market Layer Is a First-Class Provider Dimension
- PD-138 — Access Eligibility Can Be Hierarchical
- PD-139 — Vehicle Condition Evidence Can Outrank Generic Listing Metadata
- PD-140 — Wholesale Price Evidence Must Not Be Compared Directly With Retail Asking Price
- PD-141 — Auction Inventory Can Be Segmented by Access Portal
- PD-142 — Auction Outcome Can Require Post-Bid Confirmation

Reinforced:
- PD-104 — Auction Participation Has Financial Preconditions
- PD-105 — Auction Price Is a Stack, Not a Number
- PD-108 — Highest Bid Can Be Provisional
- PD-135 — Provider Quality Must Be Field-Specific

## Sources

Phoenix canonical tracker:
- `PHOENIX_ATLAS_PROVIDER_TRACKER.csv` — Tracker ID 42 = Germany / Autobid.de / `Aste auto B2B`.
- `KR_041_DOSKIO_DE.md` — Discovery continuity through PD-136.

Official/current Autobid research, 2026-08-02:
- https://autobid.de/en/buy
- https://autobid.de/en/about-us
- https://autobid.de/en/registration
- https://autobid.de/en/locations
- https://autobid.de/en/transport
- https://autobid.de/en/sell
- current Autobid manuals and auction-condition notices
- current Autobid/BMW brand-portal vehicle pages

Research limitations:
- No public third-party Phoenix-oriented catalog/search API was verified.
- Commercial reuse and redistribution rights require explicit agreement.
- Some detailed auction rules vary by auction/portal and must be modeled at auction level.

This is a strategic/technical assessment, not legal advice.
