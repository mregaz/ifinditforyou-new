# PHOENIX ATLAS — KNOWLEDGE RECORD 052

## Rightmove — United Kingdom

- Tracker ID: 52
- Country: United Kingdom
- Vertical: Property / residential sales / rentals / property intelligence
- Canonical domain: https://www.rightmove.co.uk/
- Lifecycle: ACTIVE
- Research date: 2026-08-02
- Decision: GO STRATEGICO — licensed/API/data-services route
- Integration priority: VERY HIGH for Property Capability Pack
- Discovery continuity: PD-194 → PD-200

## Executive Summary

Rightmove is the UK's largest property platform and states that it accounts for more than 80% of time spent on UK property portals.

Rightmove is strategically important to Phoenix not only as a live property-search source, but as a mature property-intelligence platform. Its Data Services combine listing-derived price, supply and demand signals with third-party datasets and provide professional products for investors, lenders, surveyors, developers, housing associations and local authorities.

Rightmove exposes secure API integrations for selected professional products including its Automated Valuation Model and Property Risk Alerts. It also operates API/data-feed specifications for members/CRM integrations. These interfaces are licensed and purpose-specific; their existence does not imply a general public listing-search API or unrestricted resale rights.

Rightmove also combines current listings with historical listing media and official sold-price data from HM Land Registry and Registers of Scotland.

For Phoenix, this makes Rightmove a Tier-1 Property Capability Pack and Decision Intelligence target, with authorized commercial access as the preferred route.

## PD-194 — Asking Price and Sold Price Are Different Evidence Classes

Rightmove combines:
- current asking-price data from property listings;
- historical sold-price data from HM Land Registry / Registers of Scotland.

Phoenix must not collapse these into one `price`.

Recommended:

```text
PropertyPriceEvidence {
  price_type
  amount
  date
  source
  status
}
```

Suggested types:
- asking_price;
- reduced_asking_price;
- agreed_price_signal;
- registered_sold_price;
- estimated_value.

This distinction is fundamental for property decisioning.

## PD-195 — Historical Listing Media Can Enrich Official Transaction Records

Rightmove's Sold House Prices surface can display official sold-price history alongside images, floorplans and information retained from previous Rightmove advertisements.

Recommended:

```text
PropertyHistoryEvidence {
  transaction_record
  historic_listing
  historic_images
  historic_floorplan
  listing_date
  sold_date
}
```

A property is therefore a persistent entity whose evidence can span multiple listing and transaction events.

## PD-196 — Valuation Must Carry Confidence

Rightmove's Automated Valuation Model returns automated valuations with a confidence score and is used for more than 400,000 property valuations per month.

Recommended:

```text
ValuationEvidence {
  estimated_value
  valuation_method
  confidence_score
  comparable_basis
  generated_at
}
```

Phoenix must never present an algorithmic estimate as equivalent to an observed market transaction.

## PD-197 — Property Risk Is Multi-Dimensional Decision Evidence

Rightmove Property Risk Alerts can evaluate environmental, lending, market, recent-activity, idiosyncratic and valuation risks.

Examples include:
- flood risk;
- subsidence;
- listed-building status;
- price outlier;
- HPI volatility;
- recent turnover;
- HMLR conflicts.

Recommended:

```text
PropertyRiskEvidence {
  risk_domain
  signal
  severity
  source
  observed_at
}
```

This is a major expansion of Phoenix Decision Intelligence beyond ranking properties by price/location.

## PD-198 — Search Alerts Are Event-Driven Inventory Matching

Rightmove Property Alerts send matching properties when a property is newly added or reduced.

This reinforces Phoenix's future Alert Engine:

```text
SavedIntent
   ↓
InventoryEvent
   ↓
Match
   ↓
Alert
```

The relevant event is not only `new_listing`; it can also be `price_reduction`.

Recommended event types:
- LISTING_CREATED
- PRICE_REDUCED
- STATUS_CHANGED
- LISTING_REMOVED
- LISTING_RELISTED

## PD-199 — Marketplace Data Products Can Be More Valuable Than Raw Listings

Rightmove Data Services offers:
- Market Intelligence Centre;
- Bespoke Data Analysis;
- Development Insight;
- Surveyors Comparable Tool;
- Automated Valuation Model;
- Property Risk Alerts.

This demonstrates a strategic maturity ladder:

```text
Raw Listings
    ↓
Normalized Market Data
    ↓
Comparable Evidence
    ↓
Valuation
    ↓
Risk Intelligence
    ↓
Decision Support
```

Phoenix should aspire to the same transformation across multiple verticals.

## PD-200 — API Existence Must Preserve Purpose and Licence Scope

Rightmove exposes APIs/data feeds for specific professional workflows, but its API terms state that specifications/data feeds remain Rightmove IP and impose purpose/use restrictions.

Therefore:

```text
api_exists = true
```

must never become:

```text
all_data_reuse_allowed = true
```

Recommended:

```text
AccessGrant {
  interface
  authorized_purpose
  permitted_data
  redistribution_rights
  commercial_rights
  geography
  expiry
}
```

Phoenix needs rights-aware API configuration, not merely API credentials.

## Data / Decision Intelligence

Rightmove Data Services states that it collects listing price, supply and demand data and combines this with third-party data.

Examples of available signals include:
- asking prices;
- price reductions;
- rental yields;
- new listings;
- available stock;
- sales agreed;
- time on market;
- unique enquirers;
- calls;
- emails.

This makes Rightmove particularly valuable as a benchmark for Phoenix's future Property Intelligence layer.

## Access Posture

Verified:
- public consumer property-search surface;
- professional Data Services;
- secure API integration for selected valuation/risk products;
- member/CRM API/data-feed specifications;
- CSV export in selected professional analytics products.

Important restriction:
- these interfaces are licensed and use-case specific;
- API/data-feed existence does not establish a general public listing API;
- unrestricted resale/commercial exploitation is not established.

Recommended:

```text
unauthorized_collection = DO NOT USE
preferred_route = licensed Rightmove Data Services / authorized integration
```

## Reusable DevKit Components

1. `PropertyPriceEvidenceMapper`
2. `PropertyHistoryEvidenceMapper`
3. `ValuationEvidenceMapper`
4. `PropertyRiskEvidenceMapper`
5. `InventoryEventMapper`
6. `PropertyComparableAdapter`
7. `AccessGrantRegistry`
8. `PropertyCapabilityPack`
9. `MarketIntelligenceAdapter`
10. `PropertyEntityResolver`

## Strategic Score

| Dimension | Score |
|---|---:|
| UK property relevance | 100 |
| Inventory relevance | 100 |
| Historical evidence | 100 |
| Valuation intelligence | 100 |
| Risk intelligence | 100 |
| Professional data maturity | 100 |
| Official integration evidence | 95 |
| Architecture learning | 100 |
| Partnership value | 100 |
| Decision Engine value | 100 |

**Indicative Strategic Score: 99 / 100**

## Final Decision

### GO STRATEGICO — LICENSED DATA/API ROUTE

Rightmove is a Tier-1 Phoenix property target.

The central conclusion is:

> The highest-value property provider is not merely a source of listings. It can connect current inventory, historical advertisements, official transactions, valuation confidence, market signals and risk evidence into one persistent property intelligence graph.

## Canonical Discoveries

- PD-194 — Asking Price and Sold Price Are Different Evidence Classes
- PD-195 — Historical Listing Media Can Enrich Official Transaction Records
- PD-196 — Valuation Must Carry Confidence
- PD-197 — Property Risk Is Multi-Dimensional Decision Evidence
- PD-198 — Search Alerts Are Event-Driven Inventory Matching
- PD-199 — Marketplace Data Products Can Be More Valuable Than Raw Listings
- PD-200 — API Existence Must Preserve Purpose and Licence Scope

## Sources

Current official Rightmove research, 2026-08-02:
- Rightmove Press Centre — About Rightmove
- Rightmove Data Services
- Rightmove Automated Valuation Model
- Rightmove Property Risk Alerts
- Rightmove Surveyors Comparable Tool
- Rightmove Market Intelligence Centre
- Rightmove Sold House Prices
- Rightmove Customer FAQ — Sold House Price data
- Rightmove Customer FAQ — Property Alerts
- Rightmove APIs — Terms and Conditions

Research limitations:
- Some published scale figures on Data Services pages cite older annual-report/analytics periods and must retain their source dates.
- No unrestricted public listing-search API for Phoenix was established.
- API/data-feed access is product-, licence- and purpose-specific.

This is a strategic/technical assessment, not legal advice.
