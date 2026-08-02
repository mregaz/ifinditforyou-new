# PHOENIX ATLAS — KNOWLEDGE RECORD 049

## Okoloo — United Kingdom

- Tracker ID: 49
- Country: United Kingdom
- Category: General classifieds
- Canonical domain: https://www.okoloo.co.uk/
- Lifecycle: ACTIVE
- Research date: 2026-08-02
- Decision: WATCH / LOW-PRIORITY LONG-TAIL SOURCE
- Production integration: DISABLED pending permission and quality validation
- Discovery continuity: PD-177 → PD-181

## Executive Summary

The canonical Phoenix tracker identifies ID 49 as Okoloo, UK, general classifieds.

Okoloo is currently active. Indexed public surfaces report roughly 19,822 ads and expose a broad classifieds taxonomy spanning motors, property, jobs, services, fashion, electronics, leisure, pets and home.

The platform also distinguishes Offered, Wanted, Swap and Donation listings; Particular vs Professional sellers; watchlists; email alerts; and Pro online shops.

However, sampled current surfaces show severe geography and semantic-quality problems. UK category pages contain listings whose location text points to New York, Berlin, Delhi, Abu Dhabi, Las Vegas and other non-UK places. Donation and category labels can also be used in ways that do not reliably describe the listing's economic meaning.

The main domain currently presents request verification to automated access, while indexed category pages remain visible to search engines. This is an important access signal: Phoenix must not attempt to bypass anti-bot verification.

No public Phoenix-oriented search API or bulk export feed was identified.

## PD-177 — Listing Intent Is Independent From Category

Okoloo exposes distinct intent/mode filters:
- Offered
- Wanted
- Swap
- Donation

These modes cut across marketplace categories.

Recommended:

```text
ListingIntent {
  offered
  wanted
  swap
  donation
}
```

Category answers "what is it?" while intent answers "what transaction/demand mode is this?"

## PD-178 — Transaction Label Must Be Validated Against Listing Semantics

Current Donation and Swap surfaces contain entries whose title, price, category or description appear inconsistent with a literal donation/swap interpretation.

Therefore source labels cannot automatically be treated as economic truth.

Recommended:

```text
ListingIntentEvidence {
  source_intent
  inferred_intent
  intent_consistency
  price_consistency
  semantic_confidence
}
```

This extends Provider Quality from category/geography precision into transaction-intent precision.

## PD-179 — Geography Can Be Internally Contradictory Within One Result

Current Okoloo results can combine:
- a UK county/region label;
- a postcode-like value;
- a city/location string outside the UK.

Examples observed on UK category pages include New York, Berlin, Delhi, Abu Dhabi and Las Vegas.

Recommended:

```text
GeographyEvidence {
  navigation_country
  source_region
  postcode
  locality
  inferred_country
  consistency
}
```

Phoenix should resolve geography from multiple fields rather than trusting any single location label.

## PD-180 — Access Friction Is a Provider Capability Signal

The Okoloo root currently presents a request-verification screen to automated retrieval, while indexed category/search pages remain discoverable.

Recommended:

```text
AccessSurfaceEvidence {
  surface
  public_browser_access
  automated_access_challenge
  indexed_by_search_engines
  api_available
}
```

A provider can be publicly browsable yet technically hostile to automated collection.

Phoenix must never bypass anti-bot or verification controls; such a signal should route the provider toward partnership/manual authorization.

## PD-181 — Professional Commerce Can Be Embedded Inside a Classifieds Marketplace

Okoloo exposes:
- Particular sellers
- Professional sellers
- Pro accounts
- Pro online shops

Current shop directory pages expose business storefronts with listing counts and categories.

Recommended:

```text
SellerCommerceMode {
  private_classified
  professional_classified
  pro_storefront
}
```

This reinforces the distinction between a one-off private listing and persistent commercial inventory.

## Data Quality Assessment

Strengths:
- broad taxonomy
- explicit listing intent modes
- seller-type distinction
- shops/pro accounts
- watchlist and email alert
- price and media filters
- broad UK regional navigation

Weaknesses:
- severe geographic inconsistency in sampled results
- semantic/category noise
- questionable Donation/Swap precision
- duplicate/spam-like patterns visible in sampled pages
- automated-access verification on root surface

## Transaction Model

Okoloo's own policy description characterizes the service as a technology marketplace where independent users meet to exchange goods and services and act on their own behalf.

No integrated Phoenix-relevant marketplace payment/protection rail was identified in this research.

Primary model:

```text
Discovery → contact → user-to-user transaction
```

## Access Posture

Verified:
- active public/indexed classifieds surfaces
- automated request verification on root
- member/pro account model
- shops
- email alerts/watchlists

Not identified:
- public catalog/search API
- public bulk export feed
- licensed Phoenix data interface

Recommended:

```text
production_collection = DISABLED
anti_bot_bypass = PROHIBITED
preferred_route = permission / partnership / licensed interface
```

## Reusable DevKit Components

1. `ListingIntentMapper`
2. `ListingIntentEvidenceValidator`
3. `GeographyConsistencyResolver`
4. `AccessSurfaceEvidenceMapper`
5. `SellerCommerceModeMapper`
6. `IntentPrecisionMetric`
7. `ProviderQualityProfile`

## Strategic Score

| Dimension | Score |
|---|---:|
| UK relevance | 70 |
| Inventory breadth | 84 |
| Intent-model learning | 98 |
| Professional seller/storefront value | 85 |
| Geography confidence | 35 |
| Semantic-quality confidence | 40 |
| Architecture learning | 96 |
| Public API readiness | 10 |
| Immediate integration value | 42 |
| Decision Engine value | 72 |

**Indicative Strategic Score: 67 / 100**

## Final Decision

### WATCH / LOW-PRIORITY LONG-TAIL SOURCE

Okoloo is active and architecturally useful, but sampled data quality is too inconsistent for Phoenix to treat it as a high-confidence UK source.

Production integration should require explicit access permission and empirical quality benchmarks.

Central conclusion:

> Phoenix must separate what a listing is (category), what the user wants to do with it (intent), and whether the source's own labels are semantically credible.

## Canonical Discoveries

- PD-177 — Listing Intent Is Independent From Category
- PD-178 — Transaction Label Must Be Validated Against Listing Semantics
- PD-179 — Geography Can Be Internally Contradictory Within One Result
- PD-180 — Access Friction Is a Provider Capability Signal
- PD-181 — Professional Commerce Can Be Embedded Inside a Classifieds Marketplace

Reinforced:
- PD-127 — Navigation Geography Is Not Listing Geography
- PD-131 — Search-Surface Scope Can Be Broader Than User Intent
- PD-135 — Provider Quality Must Be Field-Specific
- PD-163 — Marketplace Policy and Observed Inventory Can Diverge
- PD-173 — Seller Storefront Can Coexist With Classified Listings

## Sources

Canonical tracker:
- PHOENIX_ATLAS_PROVIDER_TRACKER_UPDATED_015.csv — ID 49, UK, Okoloo, https://www.okoloo.co.uk, Annunci generalisti.

Current web research, 2026-08-02:
- https://www.okoloo.co.uk/
- https://www.okoloo.co.uk/ads_search.php?cat=24
- https://www.okoloo.co.uk/ads_search.php?cat=18
- https://www.okoloo.co.uk/ads_search.php?swap=1
- https://www.okoloo.co.uk/ads_search.php?donation=1
- https://www.okoloo.co.uk/shops_search.php
- https://www.okoloo.co.uk/Page-2-Rules-and-Policies

Research limitations:
- Current root access uses request verification.
- No anti-bot control was bypassed.
- No public Phoenix-oriented API/feed was identified.
- Inventory and counts are dynamic.

This is a strategic/technical assessment, not legal advice.
