# PHOENIX ATLAS — KNOWLEDGE RECORD 047

## Friday-Ad — United Kingdom

- Tracker ID: 47
- Country: United Kingdom
- Vertical: Horizontal classifieds / local commerce / motors / jobs / services / property / animals / events
- Canonical domain: https://www.friday-ad.co.uk/
- Operator family: Friday Media Group
- Lifecycle: ACTIVE
- Research date: 2026-08-02
- Decision: GO CONDIZIONATO — strong local/long-tail UK source; commercial licence/partnership required
- Integration priority: MEDIUM-HIGH
- Indicative Strategic Score: 84 / 100
- Discovery continuity: PD-167 → PD-171

## Executive Summary

Friday-Ad is an active UK classifieds marketplace with roots dating to 1975. Current official material describes it as the original home of local ads and a platform connecting local buyers, sellers, businesses and communities throughout the UK.

The marketplace covers For Sale, Motors, Jobs, Services, Property, Animals, Events and Adult categories, with local search, an app, in-app messaging, alerts, free ad placement and paid promotional upgrades.

The technically important Phoenix finding is that **marketplace behavior differs by surface**. Friday-Ad's help documentation states that most For Sale ads can appear both on the website and in the app, while special labels or paid positioning for upgraded ads are currently shown only on the website.

Friday Media Group's privacy policy also states that information submitted to Friday-Ad may be shared with other relevant marketplace sites in the group's portfolio.

Therefore a single underlying ad can have:
- multiple distribution surfaces;
- surface-specific promotion state;
- potentially different ranking/visibility semantics.

Current Terms prohibit commercial use of site content without a licence and require contact if content is to be used beyond ordinary permitted linking/use. No public Phoenix-oriented catalog/search API was identified.

## Current marketplace evidence

Friday-Ad currently exposes:
- free ad placement;
- local/country search;
- app and website;
- in-app messaging;
- search alerts;
- For Sale inventory;
- Motors;
- Jobs;
- Services;
- Property;
- Animals;
- Events;
- Adult categories;
- business profiles;
- paid advert upgrades.

Current About material says more than 362,000 ads are placed online each week and 2.3 million visitors are attracted per year. These metrics must remain time-bounded source evidence.

A current business page separately describes more than 75k ads within major categories. These figures measure different things and must not be collapsed into one inventory statistic.

## PD-167 — Listing Surface Is a First-Class Context

Friday-Ad documents that most For Sale ads can appear on both:
- the website;
- the mobile app.

But promoted labels/positioning do not necessarily behave identically across those surfaces.

Recommended:

```text
ListingSurfaceEvidence {
  listing_id
  surface
  visible
  promotion_visible
  ranking_behavior
  observed_at
}
```

Possible surfaces:
- web;
- iOS app;
- Android app;
- partner marketplace;
- external distribution.

Phoenix should not assume that one listing has one universal presentation state.

## PD-168 — Promotion Semantics Can Be Surface-Specific

Friday-Ad currently offers:
- Boost to the top;
- Featured top;
- Homepage featured.

Official help states that upgraded positioning/labels are currently visible on the website, while the same For Sale ad may also appear in the app without those same promotion effects.

Therefore:

```text
promotion_state(web)
    !=
promotion_state(app)
```

Recommended:

```text
SurfacePromotionEvidence {
  promotion_type
  surface
  position_effect
  label_visible
  homepage_effect
}
```

This strengthens Phoenix's Promotion Provenance model by adding **surface** as a required dimension.

## PD-169 — Group-Level Marketplace Syndication Can Create Hidden Duplicate Paths

Friday Media Group's privacy policy states that information submitted to Friday-Ad can also be shared with other relevant marketplace sites in the group's portfolio.

That creates a potential provenance chain:

```text
Seller
  ↓
Friday-Ad
  ↓
Friday Media Group portfolio site(s)
  ↓
Phoenix
```

Recommended:

```text
GroupSyndicationEvidence {
  source_marketplace
  corporate_group
  destination_marketplace_known
  listing_identity_preserved
  user_data_shared
  observed_at
}
```

Phoenix should expect duplicates or near-duplicates across corporate sibling sites even when the sibling brand/domain differs.

## PD-170 — Marketplace Scale Metrics Need Metric-Type Provenance

Friday-Ad's official pages currently expose different scale statements:
- one page says more than 362k ads are placed online each week;
- another business page describes more than 75k ads in major categories;
- other pages expose live result counts per category.

These may all be valid because they measure different things:
- ad submissions/placements;
- live inventory;
- selected-category inventory;
- audience traffic.

Recommended:

```text
MarketplaceScaleEvidence {
  metric_name
  metric_value
  metric_unit
  population_scope
  period
  observed_at
  source
}
```

Phoenix must not compare marketplace "size" without first normalizing what the metric actually measures.

## PD-171 — Local Marketplace Reach Can Include Business Discovery, Not Only Listings

Friday-Ad's business ecosystem includes free business profiles and local-business discovery in addition to ordinary classifieds.

Recommended:

```text
LocalCommerceCapability {
  classified_listing
  business_profile
  service_provider_profile
  local_discovery
  job_advertising
  property_advertising
}
```

For Phoenix, a local service/business profile may be a different entity type from a one-off listing.

This can expand the Acquisition Engine from:
`listings`
to:
`listings + local business entities`.

## Transaction and trust model

Friday-Ad's safety advice remains strongly local/classifieds-oriented:
- meet face to face;
- inspect the item before paying;
- use well-lit/public meeting places;
- be cautious with money-transfer services.

This indicates:

```text
discovery = yes
contact = yes
integrated_marketplace_payment = not identified
local_in_person_exchange = strongly supported/recommended
```

The app supports safer in-app messaging and message alerts.

Phoenix should therefore model Friday-Ad primarily as a contact/local-exchange marketplace rather than infer integrated transaction protection.

## Sensitive vertical

Friday-Ad currently exposes an Adult category gated by an 18+ acknowledgement.

Phoenix standard Finder scope should keep:

```text
sensitive_vertical_ingestion = disabled_by_default
```

This reinforces Sensitive Vertical Isolation.

## Access / licensing posture

Current Friday Media Group Terms state:
- site content is protected by intellectual-property rights;
- site content must not be used for commercial purposes without obtaining a licence;
- if a party wants to make broader use of site content, Friday Media Group should be contacted;
- ordinary linking is constrained to the homepage and specific conditions.

No public Phoenix-oriented catalog/search API or export feed was identified in this research.

Therefore:

```text
public_html = YES
public_search_api = NOT IDENTIFIED
public_export_feed = NOT IDENTIFIED
commercial_content_use = LICENCE REQUIRED
production_collection = DISABLED until authorized
preferred_route = licence / partnership / authorized data interface
```

The Terms did not yield an explicit crawler/scraper clause in the current text searched, so Phoenix should not invent one. The commercial-licence restriction alone is sufficient to keep production ingestion disabled until permission is obtained.

## Professional / business opportunity

Friday-Ad operates a business-oriented surface with:
- business profiles;
- property advertising;
- vacancy/job advertising;
- local-service discovery;
- business promotion.

This makes it a credible partnership candidate, especially for:
- local services;
- small businesses;
- jobs;
- property;
- Motors.

Recommended partnership questions:
1. Is there a licensed search/catalog feed?
2. Are listing IDs shared between web/app/group sites?
3. Can original vs promoted ranking be exposed?
4. Can partner/group syndication destinations be identified?
5. Are deltas/deletions available?
6. Can business profiles be licensed separately from listings?
7. Are local-service/business entity feeds available?
8. What rights apply to deep links, thumbnails, cached metadata and snippets?

## Phoenix strategic value

Friday-Ad is not as large/strategically central as Gumtree, but it can add:
- local UK inventory;
- small business/service discovery;
- long-tail For Sale inventory;
- property/jobs;
- local-community signals.

Its greatest architectural value is the proof that:

```text
same listing
× different surface
× different promotion state
× possible corporate syndication
```

must be explicitly modeled.

## Reusable DevKit Components

1. `ListingSurfaceEvidenceMapper`
2. `SurfacePromotionEvidenceMapper`
3. `GroupSyndicationEvidenceMapper`
4. `MarketplaceScaleEvidenceRegistry`
5. `LocalCommerceCapabilityMapper`
6. `BusinessEntityMapper`
7. `SensitiveVerticalGate`
8. `MarketplaceLicensePolicyGate`

## Strategic Score

| Dimension | Score |
|---|---:|
| UK local-market relevance | 88 |
| Inventory breadth | 86 |
| Local business/services value | 93 |
| Surface/provenance learning | 100 |
| Group-syndication learning | 96 |
| Architecture learning | 98 |
| Public API readiness | 20 |
| Partnership potential | 75 |
| Decision Engine value | 80 |
| Immediate provider priority | 72 |

**Indicative Strategic Score: 84 / 100**

## Final Decision

### GO CONDIZIONATO — LOCAL/LONG-TAIL UK PARTNER TARGET

Friday-Ad is an active and useful secondary UK provider candidate, particularly for local commerce, services and long-tail classifieds.

It should not be integrated through unlicensed commercial extraction.

The central conclusion is:

> A listing's identity, promotion and visibility must be evaluated per surface. The same underlying advert can behave differently on web, app and sibling marketplace networks.

## Canonical Discoveries

- PD-167 — Listing Surface Is a First-Class Context
- PD-168 — Promotion Semantics Can Be Surface-Specific
- PD-169 — Group-Level Marketplace Syndication Can Create Hidden Duplicate Paths
- PD-170 — Marketplace Scale Metrics Need Metric-Type Provenance
- PD-171 — Local Marketplace Reach Can Include Business Discovery, Not Only Listings

Reinforced:
- PD-014 — Promotion Provenance
- PD-033 — Sensitive Vertical Isolation
- PD-062 — Marketplace Syndication Rights as Provenance Evidence
- PD-114 — Distribution Network Can Extend Beyond Marketplace Inventory
- PD-126 — Marketplace Distribution Can Extend Through External Acquisition Channels
- PD-152 — Promotion Can Rewrite Apparent Publication Date

## Sources

Canonical tracker:
- User-provided `marketplaces_europe(3).csv` — row/Tracker ID 47 = Friday-Ad / UK / general classifieds.

Current official research, 2026-08-02:
- https://www.friday-ad.co.uk/
- https://www.friday-ad.co.uk/about.php
- https://www.friday-ad.co.uk/terms.php
- https://www.friday-ad.co.uk/privacy.php
- https://help.friday-ad.co.uk/hc/en-us/articles/360001663154-Is-there-a-Friday-Ad-app-that-I-can-download
- https://help.friday-ad.co.uk/hc/en-us/articles/360001842054-How-can-I-get-my-advert-to-the-top-of-the-listings
- https://help.friday-ad.co.uk/hc/en-us/articles/360001176394-Buying-and-Selling-Advice-Stay-Safe
- https://business.friday-ad.co.uk/
- https://business.friday-ad.co.uk/joinfridayadonline/
- https://business.friday-ad.co.uk/business-profiles/advertise-your-properties/
- https://business.friday-ad.co.uk/business-profiles/advertise-vacancies/

This is a strategic/technical assessment, not legal advice.
