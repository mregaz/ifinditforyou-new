# PHOENIX ATLAS — KNOWLEDGE RECORD 054

## OnTheMarket — United Kingdom

- Tracker ID: 54
- Country: United Kingdom
- Vertical: Property / residential sales / rentals / valuation / sold prices
- Canonical domain: https://www.onthemarket.com/
- Operator: OnTheMarket Limited / Agents' Mutual Limited
- Corporate family: CoStar Group
- Lifecycle: ACTIVE
- Research date: 2026-08-02
- Decision: GO STRATEGICO — permissioned / commercial data route
- Integration priority: VERY HIGH
- Indicative Strategic Score: 98 / 100
- Discovery continuity: PD-208 → PD-213

## Executive Summary

OnTheMarket is an active UK residential property portal and, since December 2023, part of CoStar Group.

Its current consumer surface includes:
- property for sale;
- property to rent;
- sold prices;
- instant valuation;
- agent valuation;
- property alerts;
- keyword-based preference search;
- travel-time search;
- collaborative/shared property lists;
- locality and amenity proximity features.

A strategically important differentiator is its `Only With Us` inventory: OnTheMarket states that thousands of new properties each month are available on its portal 24 hours or more before appearing on Rightmove or Zoopla.

For Phoenix, this demonstrates that source value is not only about inventory size. A provider can create value through **temporal exclusivity**.

OnTheMarket's current Terms also provide a nuanced automated-access rule. Automated programs are prohibited unless they identify themselves uniquely in the User-Agent field and fully comply with the Robots Exclusion Protocol. This is not a blanket permission for commercial aggregation; copying, storing, republishing, deep linking and commercial/business use remain restricted without prior written consent.

Therefore Phoenix should not interpret robots-compliant crawling as a general commercial licence. The preferred route remains explicit permission / licensed integration.

## Corporate context

CoStar Group completed its acquisition of OnTheMarket in December 2023.

CoStar describes OnTheMarket as one of the UK's major residential property portals and has invested heavily in growth.

This puts OnTheMarket inside a broader real-estate information/marketplace family that includes major commercial-property and analytics capabilities.

Phoenix should preserve:
- marketplace surface identity;
- corporate ownership;
- possible shared technology/data capabilities;
without assuming inventory or licence rights are automatically shared.

## PD-208 — Temporal Exclusivity Is Provider Value

OnTheMarket's `Only With Us` proposition gives selected inventory a period of exclusivity before it appears on competing portals.

Recommended:

```text
InventoryExclusivityEvidence {
  provider
  listing
  exclusive_from
  exclusive_until
  exclusivity_duration
  competing_surfaces
  evidence_source
}
```

Strategic implication:

```text
same_property
same_price
same_attributes
```

can still have different provider value if one source exposes it earlier.

Phoenix Provider Priority should therefore consider **time-to-market advantage**, not only inventory count.

## PD-209 — Advertiser-Supplied Property Data Is Source Assertion, Not Verification

OnTheMarket's Terms explicitly state that property details are supplied by third-party advertisers such as:
- estate agents;
- letting agents;
- new-home developers.

OnTheMarket states that it does not verify those property details and makes no warranty as to their accuracy/completeness.

Recommended:

```text
PropertyFieldEvidence {
  field
  value
  supplied_by
  verified_by_platform
  confidence
}
```

This is crucial:

`structured_property_field != independently_verified_fact`.

Phoenix must distinguish source structure from evidence quality.

## PD-210 — Automated Access Permission Can Be Protocol-Conditional

OnTheMarket's Terms prohibit automated access/search/display/link collection except for a `Permitted Program` that:
- identifies itself uniquely in the User-Agent field;
- fully complies with the Robots Exclusion Protocol.

Recommended:

```text
AutomatedAccessPolicy {
  automated_access_allowed
  user_agent_identification_required
  robots_compliance_required
  commercial_reuse_rights
  storage_rights
  deep_link_rights
}
```

Important:

robots-compliant automated access does **not** imply rights to:
- copy;
- store;
- republish;
- deep-link;
- commercially exploit content.

Phoenix therefore needs separate dimensions for:
1. technical crawl permission;
2. content-use rights;
3. commercial rights.

## PD-211 — Preference Search Can Combine Semantic and Functional Constraints

OnTheMarket currently offers:
- keyword feature search;
- travel-time search;
- `Very Important Places` proximity;
- guided `Help Me Choose`.

This demonstrates that property intent is richer than:

```text
location + price + bedrooms
```

Recommended:

```text
PropertyIntent {
  required_features[]
  preferred_features[]
  travel_time_constraints[]
  important_places[]
  hard_constraints[]
  soft_preferences[]
}
```

Phoenix can use the same model across multiple property sources even when source-native search capabilities differ.

## PD-212 — Valuation Modality Is a First-Class Evidence Type

OnTheMarket offers both:
- instant online valuation;
- local-agent valuation.

The site explicitly describes an in-person agent valuation as more accurate because the agent can inspect the property and local context.

Recommended:

```text
ValuationEvidence {
  valuation_type
  estimated_value
  model_or_agent
  inspection_performed
  local_expert
  generated_at
}
```

Suggested types:
- automated_online;
- agent_remote;
- agent_in_person.

Phoenix should never treat these valuation modalities as equivalent observations.

## PD-213 — Corporate Acquisition Can Expand Marketplace Capability Surface

Following acquisition by CoStar Group, OnTheMarket gained access to the capital, technology and real-estate information ecosystem of CoStar.

The current OnTheMarket homepage also links commercial-property discovery through LoopNet.

Recommended:

```text
CorporateCapabilityGraph {
  corporate_group
  marketplace_surface
  sibling_product
  capability
  inventory_relationship_known
}
```

This is not evidence that Phoenix can combine or access all CoStar/OnTheMarket/LoopNet data under one licence.

It is evidence that marketplace capability can expand through corporate-family integration.

## Sold Price Evidence

OnTheMarket exposes sold house prices sourced from:
- Land Registry;
- Registers of Scotland.

This reinforces Phoenix's existing distinction between:
- asking price;
- valuation;
- registered sold price.

## Alerts

OnTheMarket offers instant property alerts when new matching properties hit the market.

Because some inventory is exclusive for 24+ hours, alert latency becomes strategically important:

```text
listing_first_seen
    ↓
provider_exclusive_window
    ↓
alert_delivery
    ↓
user_action
```

A faster provider can create real user value even if the same listing appears elsewhere later.

## Access / Compliance

Current Terms establish:

```text
public_html = YES
automated_access = CONDITIONAL
permitted_program_requires_unique_user_agent = YES
robots_protocol_compliance = YES
copy/store/republish = RESTRICTED
deep_linking = RESTRICTED
commercial_use = REQUIRES AUTHORIZATION
```

Phoenix must not infer commercial integration rights from the `Permitted Program` clause.

Recommended production route:

```text
explicit written permission
or
commercial partnership
or
licensed feed/API
```

## Partnership Questions

1. Is there a licensed listing feed/API for comparison/discovery partners?
2. Can Phoenix receive `Only With Us` timing/exclusivity metadata?
3. Are listing deltas/removals available?
4. Can sold-price and valuation products be licensed?
5. Can original advertiser/source provenance be exposed?
6. Are agent/developer identifiers stable?
7. Can Phoenix deep-link individual listings under commercial agreement?
8. Are CoStar/LoopNet relationships relevant to a broader agreement?
9. What caching/storage rights apply?
10. What SLA applies to listing freshness?

## Reusable DevKit Components

1. `InventoryExclusivityEvidenceMapper`
2. `PropertyFieldEvidenceMapper`
3. `AutomatedAccessPolicyMapper`
4. `PropertyIntentMapper`
5. `ValuationModalityMapper`
6. `CorporateCapabilityGraph`
7. `ListingFirstSeenTracker`
8. `ProviderTimeToMarketMetric`
9. `PropertyCapabilityPack`
10. `CommercialAccessRegistry`

## Strategic Score

| Dimension | Score |
|---|---:|
| UK property relevance | 100 |
| Time-to-market advantage | 100 |
| Property search richness | 98 |
| Valuation value | 94 |
| Sold-price intelligence | 96 |
| Corporate-family leverage | 100 |
| Architecture learning | 100 |
| Access-policy clarity | 95 |
| Partnership value | 98 |
| Decision Engine value | 98 |

**Indicative Strategic Score: 98 / 100**

## Final Decision

### GO STRATEGICO — PERMISSIONED / COMMERCIAL DATA ROUTE

OnTheMarket is a Tier-1 Phoenix property target.

The central conclusion is:

> Provider value is not only about how much inventory a source has. It can also come from how early the source exposes that inventory, how clearly it expresses user intent, and how much evidence provenance it preserves.

## Canonical Discoveries

- PD-208 — Temporal Exclusivity Is Provider Value
- PD-209 — Advertiser-Supplied Property Data Is Source Assertion, Not Verification
- PD-210 — Automated Access Permission Can Be Protocol-Conditional
- PD-211 — Preference Search Can Combine Semantic and Functional Constraints
- PD-212 — Valuation Modality Is a First-Class Evidence Type
- PD-213 — Corporate Acquisition Can Expand Marketplace Capability Surface

Reinforced:
- PD-082 — Geographic Resolution Is a Data Capability
- PD-195 — Historical Listing Media Can Enrich Official Transaction Records
- PD-198 — Search Alerts Are Event-Driven Inventory Matching
- PD-200 — API Existence Must Preserve Purpose and Licence Scope
- PD-206 — Travel-Time Search Is Functional Geography

## Sources

Canonical tracker:
- User-provided `marketplaces_europe(3).csv` — Tracker ID 54 = OnTheMarket / UK / Immobiliare.

Current official research, 2026-08-02:
- https://www.onthemarket.com/
- https://www.onthemarket.com/about/
- https://www.onthemarket.com/terms/
- https://www.onthemarket.com/instant-valuation/
- https://www.onthemarket.com/property-valuation/
- https://www.onthemarket.com/uk-house-prices/
- OnTheMarket current property-alert / search guidance.

Corporate evidence:
- CoStar Group announcement confirming completion of OnTheMarket acquisition on 12 December 2023.

Research limitations:
- No general public Phoenix listing API was established.
- `Permitted Program` automated-access language must not be confused with content-commercialization rights.
- Exclusivity timing is source-reported and should be preserved as provider evidence.

This is a strategic/technical assessment, not legal advice.
