# PHOENIX ATLAS — KNOWLEDGE RECORD 043

## Copart.de — Germany

- Tracker ID: 43
- Country: Germany
- Vertical: Used / damaged / salvage vehicle auctions
- Canonical domain: https://www.copart.de/
- Lifecycle: ACTIVE
- Research date: 2026-08-02
- Decision: GO STRATEGICO — authorized partnership/data access target
- Integration priority: VERY HIGH for Vehicle Decision Intelligence
- Discovery continuity: PD-143 → PD-148

## Executive Summary

Copart Germany is an active online vehicle-auction platform with thousands of used and accident-damaged vehicles and live auctions Monday through Friday.

Unlike Autobid's dealer-only wholesale model, current Copart Germany exposes multiple membership/access tiers including guest, private and business memberships. Private members can currently buy up to three vehicles per year for personal use, while business tiers have different bid-volume and buying-power limits.

Copart is especially valuable to Phoenix because it introduces salvage/damage context, membership-dependent buying power, a non-trivial fee stack, Buy It Now alongside bidding, payment deadlines, storage/removal costs and integrated vehicle delivery.

The economically meaningful price is therefore not the displayed bid alone.

No public Phoenix-oriented bulk search/catalog API was verified in this research. Production access should be negotiated/authorized.

## PD-143 — Access Tier Can Change Transaction Capacity

Copart membership does more than unlock access. It changes how much and how often a user can transact.

Current Germany evidence includes:
- Guest: browsing/learning access;
- Private: up to 3 vehicles/year;
- Business Basic: up to €5,000 bid per auction and 1 vehicle per auction;
- Business Premium: up to €300,000 daily and up to 30 vehicles per auction.

Recommended:

```text
TransactionCapacity {
  membership_tier
  buyer_type
  bid_value_limit
  vehicle_count_limit
  time_window
  simultaneous_bid_capability
}
```

Eligibility and capacity are separate concepts.

## PD-144 — Salvage Condition Is an Economic Context, Not Just a Defect Flag

Copart inventory includes used and accident-damaged vehicles, including repairable vehicles and vehicles useful for parts.

Phoenix should not reduce this to:

```text
damaged = true
```

Recommended:

```text
VehicleEconomicCondition {
  condition_class
  damage_context
  repairability
  parts_value_context
  roadworthiness_known
  inspection_evidence
  intended_market
}
```

A damaged vehicle may be valuable as a repair candidate, donor vehicle or parts source. Ranking depends on the user's objective.

## PD-145 — Auction Acquisition Cost Includes Post-Sale Friction

Copart Germany's published fee material shows that the winning/sale price is only one component.

Potential cost components include:
- buyer/member fee;
- virtual bid fee;
- lot retrieval fee;
- VAT where applicable;
- document handling;
- late payment;
- late removal/storage;
- delivery/transport;
- relist consequences when a transaction is reversed.

Recommended:

```text
VehicleAcquisitionCost {
  sale_price
  buyer_fee
  virtual_bid_fee
  retrieval_fee
  taxes
  document_fee
  storage_risk
  delivery_cost
  other_mandatory_costs
}
```

This specializes PD-105 Auction Price Is a Stack for vehicle acquisition.

## PD-146 — Buying Power Can Be State-Dependent

Copart states that buying power/vehicle-count capacity is not automatically reset after every auction; it resets after purchased vehicles are paid in full.

Therefore capacity depends on account transaction state:

```text
BuyingPowerState {
  membership_capacity
  outstanding_purchases
  paid_in_full
  currently_available_capacity
}
```

A static membership entitlement is insufficient to know whether the user can place another bid.

## PD-147 — Purchase Modality Changes Time-to-Ownership

Eligible vehicles can offer Buy It Now in addition to bidding.

Therefore two otherwise similar vehicles can have different acquisition paths:

```text
Auction vehicle
  → bid
  → wait/live auction
  → outcome

Buy It Now vehicle
  → predetermined price
  → immediate purchase confirmation
  → payment
```

Recommended:

```text
AcquisitionModality {
  live_auction
  pre_bid
  buy_it_now
  immediate_purchase
}
```

Phoenix ranking can use urgency and certainty as decision variables, not price alone.

## PD-148 — Logistics Feasibility Is Part of Vehicle Decisioning

Copart Germany provides delivery within Germany and neighboring countries, currently up to 1,000 km from a Copart location, with delivery requested through the member portal/app.

Special handling matters: the buyer is responsible for unloading vehicles that cannot roll.

Recommended:

```text
VehicleLogisticsEvidence {
  pickup_location
  delivery_available
  delivery_radius
  delivery_eta
  non_rolling
  unloading_requirement
  transport_cost
}
```

A cheap salvage vehicle far away or unable to roll may be a worse acquisition than a more expensive local vehicle.

## Current platform evidence

Current official Copart Germany pages report roughly 5,000+ vehicles in inventory, with the exact count changing continuously. Live auctions operate Monday–Friday.

Membership currently includes guest, private, business Basic and business Premium options.

Current official fee pages state that displayed auction prices are net and that fees and VAT where applicable must be added.

Payment is due immediately after sale, with a short settlement window before late-payment fees can apply.

## Strategic implication for Phoenix

Copart creates a strong Vehicle Decision Intelligence equation:

```text
Displayed bid
+ mandatory fees
+ tax context
+ damage/repair context
+ logistics
+ membership constraints
+ time-to-acquisition
= REAL ACQUISITION DECISION
```

This is materially richer than listing aggregation.

## Access posture

Verified:
- active public marketplace information;
- member auction platform;
- guest/private/business membership structure;
- live bidding and Buy It Now;
- fee schedules;
- delivery service.

Not verified:
- public third-party catalog/search API;
- public bulk export feed licensed for Phoenix;
- unrestricted redistribution rights.

Recommended:

```text
public_information = YES
member_platform = YES
public_phoenix_api = NOT VERIFIED
production_collection = DISABLED until authorized
preferred_route = partnership / licensed feed / authorized interface
```

## Partnership questions

1. Is a catalog/search API or partner feed available?
2. Can Phoenix receive structured damage/condition fields?
3. Are final auction results licensable for valuation?
4. Can Buy It Now eligibility/prices be exposed?
5. Can fee schedules be consumed programmatically?
6. Can delivery estimates be calculated through an interface?
7. Can membership/access requirements be surfaced?
8. What storage/caching/display rights apply?
9. Can consumer-facing decision intelligence be built from licensed data?
10. Are Germany and other Copart countries accessible through a shared provider-family agreement?

## Reusable DevKit Components

1. `TransactionCapacityMapper`
2. `VehicleEconomicConditionMapper`
3. `VehicleAcquisitionCostCalculator`
4. `BuyingPowerStateMapper`
5. `AcquisitionModalityMapper`
6. `VehicleLogisticsEvidenceMapper`
7. `SalvageVehicleCapabilityPack`
8. `VehicleDecisionCostEngine`

## Final Decision

### GO STRATEGICO — AUTHORIZED DATA/PARTNERSHIP TARGET

Copart.de is a high-value Phoenix source because it adds salvage-market and acquisition-cost intelligence unavailable from ordinary retail classifieds.

The central conclusion is:

> For damaged and auctioned vehicles, the lowest visible bid is not necessarily the cheapest vehicle to acquire. Phoenix must reason over condition, fees, transaction capacity and logistics.

## Canonical Discoveries

- PD-143 — Access Tier Can Change Transaction Capacity
- PD-144 — Salvage Condition Is an Economic Context, Not Just a Defect Flag
- PD-145 — Auction Acquisition Cost Includes Post-Sale Friction
- PD-146 — Buying Power Can Be State-Dependent
- PD-147 — Purchase Modality Changes Time-to-Ownership
- PD-148 — Logistics Feasibility Is Part of Vehicle Decisioning

Reinforced:
- PD-104 — Auction Participation Has Financial Preconditions
- PD-105 — Auction Price Is a Stack, Not a Number
- PD-124 — Offer Format Is a Decision Variable
- PD-137 — Market Layer Is a First-Class Provider Dimension
- PD-140 — Wholesale Price Evidence Must Not Be Compared Directly With Retail Asking Price

## Sources

Current official Copart Germany research, 2026-08-02:
- https://www.copart.de/en/
- https://www.copart.de/en/content/de/en/support/faq-topics/membership
- https://www.copart.de/en/Content/DE/DE/Support/How-to-Buy/Place-Bids
- https://www.copart.de/en/content/de/en/support/faq-topics/fees-and-payments
- https://www.copart.de/en/content/de/en/damaged-cars
- https://www.copart.de/en/content/de/en/support/how-to-buy/delivery

Research limitations:
- Inventory counts are dynamic.
- Fee schedules can change and must be timestamped.
- No public Phoenix-oriented catalog API was verified.

This is a strategic/technical assessment, not legal advice.
