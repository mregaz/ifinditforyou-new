# PHOENIX ATLAS — KNOWLEDGE RECORD 053

## Zoopla — United Kingdom

- Tracker ID: 53
- Country: United Kingdom
- Vertical: Property / residential sales / rentals / house prices / valuation / market intelligence
- Canonical domain: https://www.zoopla.co.uk/
- Operator: Zoopla Limited
- Lifecycle: ACTIVE
- Research date: 2026-08-02
- Decision: GO STRATEGICO — commercial data agreement / licensed access
- Integration priority: VERY HIGH
- Indicative Strategic Score: 99 / 100
- Discovery continuity: PD-201 → PD-207

## Executive Summary

Zoopla is a Tier-1 UK property platform combining live for-sale/rental listings, sold-price history, instant valuations, affordability tools, homeowner tracking, estate-agent discovery and housing-market intelligence.

Zoopla states that its valuation model uses HM Land Registry and its own listing/sales data across more than 34 million UK properties, with history built up since its 2007 launch.

Its House Price Index explicitly tracks achieved sales prices rather than asking prices and combines sold prices, mortgage valuations and recently agreed sales data.

Most importantly for Phoenix access architecture, Zoopla's current developer documentation states that the public listings API is no longer publicly available. Commercial users are invited to contact Zoopla to discuss data availability, including the listings API.

Therefore Phoenix should not treat Zoopla as a scraping target. The preferred route is a commercial data agreement / licensed feed or API.

## PD-201 — Property Entity Can Be User-Claimed and Corrected

Zoopla's MyHome flow allows legal homeowners to claim a property and update selected attributes such as:
- bedrooms
- bathrooms
- reception rooms
- property type

These edits are user-asserted property evidence.

Recommended:

```text
PropertyAttributeEvidence {
  field
  value
  source_type
  asserted_by_owner
  verified_by_platform
  effective_at
}
```

A property record can therefore contain:
- official records
- marketplace listing data
- model-derived values
- owner-supplied corrections

Phoenix must preserve provenance by field.

## PD-202 — Owner-Supplied Corrections Need Not Immediately Change Valuation

Zoopla states that changing MyHome property details does not immediately alter the Zoopla estimate.

This proves that property attributes and model valuation can have different update cadences.

Recommended:

```text
ValuationDependencyEvidence {
  property_field_update_at
  valuation_model_refresh_at
  immediate_recalculation
  lag_known
}
```

Phoenix should never infer that a newly corrected field has already propagated into a model estimate.

## PD-203 — Market Index Methodology Defines What the Signal Means

Zoopla's House Price Index tracks achieved sale prices, not asking prices.

Its methodology combines:
- completed sold prices
- mortgage valuations
- recently agreed sales data

Therefore:

```text
market_index_value
```

must carry methodology metadata.

Recommended:

```text
MarketIndexEvidence {
  index_name
  target_measure
  input_data[]
  revisionary
  seasonally_adjusted
  geography
  period
}
```

Without methodology provenance, two property indices can look comparable while measuring different things.

## PD-204 — Buyer Demand Can Be Observed From Enquiry Behaviour

Zoopla's market reporting uses buyer enquiry data to measure demand and first-time buyer activity.

This provides a distinct evidence class from listings and sold prices:

```text
DemandEvidence {
  enquiry_volume
  buyer_segment
  geography
  period
  source
}
```

This reinforces Phoenix's need to separate:
- supply
- asking prices
- achieved prices
- demand signals

when forming market conclusions.

## PD-205 — Home Tracking Is a Persistent User-to-Asset Relationship

Zoopla reports that more than 6 million homeowners use Zoopla to track their home's value and local market changes.

MyHome creates a persistent relation:

```text
User
  ↓ claims/tracks
Property Entity
  ↓
valuation changes
sold-nearby events
market updates
```

Recommended:

```text
TrackedAsset {
  user
  asset
  tracking_started_at
  valuation_updates
  market_events
}
```

This is directly relevant to Phoenix's future persistent monitoring architecture.

## PD-206 — Travel-Time Search Is Functional Geography

Zoopla exposes property search by travel time.

This introduces a different geographic model:

```text
distance
    !=
travel_time
```

A home 10 km away may be less convenient than one 15 km away depending on transport network.

Recommended:

```text
FunctionalGeographyEvidence {
  origin
  destination
  travel_mode
  travel_time
  search_threshold
}
```

For property Decision Intelligence, accessibility can be more useful than straight-line radius.

## PD-207 — Public API Retirement Is a Lifecycle Event

Zoopla's current developer docs explicitly state:

> The Zoopla listings API is no longer publicly available.

Commercial access may still be discussed with Zoopla.

This creates a new API lifecycle concept:

```text
InterfaceLifecycle {
  interface
  previous_status
  current_status
  public_access
  commercial_access
  observed_at
}
```

Phoenix must not rely indefinitely on old API documentation or historical integrations.

Provider integrations should be revalidated over time just like marketplace surfaces.

## Current Product / Data Surface

Current Zoopla features include:
- property for sale
- rental search
- new build
- commercial property
- overseas property
- shared ownership
- house prices
- sold-price research
- instant valuation
- MyHome property tracking
- affordability calculator
- mortgage calculator
- travel-time search
- estate-agent discovery
- saved searches and alerts
- house price index
- rental market reports

## Valuation Evidence

Zoopla states that its instant valuation model uses:
- public records
- HM Land Registry data
- Zoopla's own sales and listings data
- algorithms developed over more than 20 years of experience/data lineage

It also explicitly warns that online valuations cannot fully account for:
- property condition
- unique features
- renovations/improvements

Recommended:

```text
ValuationEvidence {
  value
  model
  data_sources[]
  omitted_factors[]
  confidence_or_limitations
  observed_at
}
```

## Sold Price / Property History

Zoopla's sold-price surface is updated monthly with official data from sources including:
- HM Land Registry
- Registers of Scotland
- survey records
- Royal Mail
- Ordnance Survey

It can also display details/photos from the last time a property was listed on Zoopla.

This reinforces the persistent Property Entity model established with Rightmove.

## Access Posture

Verified:
- current public consumer platform
- developer documentation
- commercial data contact path
- historical/public listings API retired

Current developer statement:

```text
public_listings_api = NO LONGER AVAILABLE
commercial_data_discussion = YES
commercial_listings_api_discussion = YES
```

Recommended:

```text
production_scraping = DO NOT USE
preferred_route = commercial agreement / licensed API or feed
```

The existence of past public APIs does not create present access rights.

## Comparison With Rightmove

Rightmove and Zoopla are complementary architectural benchmarks.

Rightmove emphasized:
- professional data products
- valuation confidence
- risk analytics
- licensed API/data services

Zoopla adds especially strong evidence around:
- owner-claimed property records
- property-value tracking
- public API retirement lifecycle
- travel-time geography
- demand/enquiry evidence
- HPI methodology provenance

Phoenix should not assume that one property provider subsumes the other.

## Reusable DevKit Components

1. `PropertyAttributeEvidenceMapper`
2. `ValuationDependencyMapper`
3. `MarketIndexEvidenceMapper`
4. `DemandEvidenceMapper`
5. `TrackedAssetRegistry`
6. `FunctionalGeographyMapper`
7. `InterfaceLifecycleRegistry`
8. `PropertyEntityResolver`
9. `PropertyCapabilityPack`
10. `CommercialAccessRegistry`

## Strategic Score

| Dimension | Score |
|---|---:|
| UK property relevance | 100 |
| Property database depth | 100 |
| Valuation intelligence | 100 |
| Sold-price intelligence | 100 |
| Demand intelligence | 100 |
| Home-tracking value | 100 |
| Functional geography | 98 |
| Commercial data pathway | 95 |
| Architecture learning | 100 |
| Decision Engine value | 100 |

**Indicative Strategic Score: 99 / 100**

## Final Decision

### GO STRATEGICO — COMMERCIAL DATA AGREEMENT / LICENSED ACCESS

Zoopla is a Tier-1 Property Intelligence target for Phoenix.

The central conclusion is:

> Property intelligence is not just current listings plus sold prices. It also includes owner-corrected property identity, model-update cadence, market-index methodology, demand behaviour, tracked-home relationships and functional geography.

## Canonical Discoveries

- PD-201 — Property Entity Can Be User-Claimed and Corrected
- PD-202 — Owner-Supplied Corrections Need Not Immediately Change Valuation
- PD-203 — Market Index Methodology Defines What the Signal Means
- PD-204 — Buyer Demand Can Be Observed From Enquiry Behaviour
- PD-205 — Home Tracking Is a Persistent User-to-Asset Relationship
- PD-206 — Travel-Time Search Is Functional Geography
- PD-207 — Public API Retirement Is a Lifecycle Event

Reinforced:
- PD-082 — Geographic Resolution Is a Data Capability
- PD-083 — Historical Depth Is a Provider Moat
- PD-084 — Search Demand Is Market Evidence
- PD-194 — Asking Price and Sold Price Are Different Evidence Classes
- PD-195 — Historical Listing Media Can Enrich Official Transaction Records
- PD-196 — Valuation Must Carry Confidence
- PD-198 — Search Alerts Are Event-Driven Inventory Matching
- PD-200 — API Existence Must Preserve Purpose and Licence Scope

## Sources

Current official Zoopla research, 2026-08-02:
- https://www.zoopla.co.uk/
- https://www.zoopla.co.uk/about/
- https://www.zoopla.co.uk/home-values/
- https://www.zoopla.co.uk/house-prices/
- https://www.zoopla.co.uk/discover/property-news/house-price-index/
- https://developers.zoopla.co.uk/

Research limitations:
- Public listings API access is explicitly retired.
- Commercial data availability must be negotiated directly with Zoopla.
- Market/valuation figures are time-sensitive and must retain observation dates.

This is a strategic/technical assessment, not legal advice.
