# PHOENIX ATLAS — KNOWLEDGE RECORD 040

## Global-Free-Classified-Ads — Germany

- Tracker ID: 40
- Country scope: Germany surface inside a global classifieds network
- Vertical: Horizontal classifieds / services / jobs / real estate / vehicles / goods / animals
- Global domain: https://www.global-free-classified-ads.com/
- Germany surface: https://germany.global-free-classified-ads.com/
- Lifecycle: ACTIVE
- Research date: 2026-08-02
- Decision: WATCH / LOW-PRIORITY GO FOR PARTNERSHIP VALIDATION; no production integration until access rights and data quality are validated
- Integration priority: LOW–MEDIUM
- Indicative Strategic Score: 68 / 100

## Executive Summary

Global-Free-Classified-Ads.com is an active global classifieds network with a live Germany surface and granular regional/city subdomains.

The German surface currently exposes categories including real estate, rentals, jobs, vehicles, services, items for sale, business opportunities, education/training, pets and announcements. The location selector exposes German Länder and city-level surfaces such as Berlin and Hamburg.

The platform states that free listings remain active for 30 or 60 days and can be renewed repeatedly; renewal returns the listing to the top of its category.

The platform also states that it is not involved in user transactions and provides internal messaging, favorites and advanced search to registered users.

A key quality finding is that a country-filtered category can still contain listings whose actual item location is outside the selected country. Current Germany category pages provide examples of this behavior. Therefore `surface_country = Germany` must not be treated as proof that every listing is physically located in Germany.

No public Phoenix-oriented search API or export feed was identified. The site's help material documents editorial rules and automated moderation, but this research did not establish third-party catalog access rights. Production integration should remain disabled until explicit permission/partnership terms are obtained.

## PD-127 — Navigation Geography Is Not Listing Geography

The Germany surface can display listings whose actual listing location is outside Germany.

For example, current Germany real-estate results include items explicitly located in Serbia, Georgia, Belize, Greece, Sri Lanka and the Philippines alongside German results. Current Germany computer-hardware results also include an item located in California.

Therefore:

```text
surface_country
    !=
listing_country
```

Recommended model:

```text
GeographyEvidence {
  navigation_country
  navigation_region
  listing_country
  listing_region
  listing_city
  seller_country
  inferred_geography
  confidence
}
```

Phoenix must normalize geography from listing-level evidence, not from the page/subdomain alone.

This is essential for avoiding false local matches.

## PD-128 — Renewal Can Create Indefinite Listing Lifetimes

The platform states that free ads can be published for 30 or 60 days and renewed repeatedly. Renewal extends the duration and returns the ad to the top of its category.

Therefore a listing can remain visible indefinitely while repeatedly resurfacing.

Recommended:

```text
ListingLifecycleEvidence {
  initial_publication_at
  nominal_duration
  renewal_supported
  renewal_count_known
  last_renewed_at
  current_expiry
  resurfaced_by_renewal
}
```

A recently surfaced listing may represent an old underlying offer.

This strongly reinforces renewal-aware freshness.

## PD-129 — Geographic Amplification Can Create Multi-Surface Presence

The help center exposes a feature titled `Show This Offer in More Locations`, and the platform describes global/local reach.

This implies that a single underlying offer may be deliberately distributed across multiple geographic surfaces.

Recommended:

```text
GeographicDistributionEvidence {
  canonical_listing_id
  primary_location
  additional_surfaces[]
  amplification_type
  duplicate_expected
}
```

Phoenix deduplication must distinguish intentional multi-location amplification from genuinely distinct listings.

## PD-130 — Automated Moderation Is Source Governance Evidence, Not Listing Verification

The platform documents automated moderation algorithms for prohibited or suspicious categories such as get-rich-quick schemes.

That demonstrates source-level governance.

It does not prove that every accepted listing has been factually verified.

Recommended:

```text
ModerationEvidence {
  source
  automated_moderation
  moderation_scope
  prohibited_content_rules
  factual_verification_known
}
```

Phoenix must not convert `platform moderates content` into `listing is trustworthy`.

This reinforces Trust Evidence, Not Trust Score.

## PD-131 — Search-Surface Scope Can Be Broader Than User Intent

Because global inventory can appear inside a country/category navigation context, Phoenix should treat source search scope as evidence rather than truth.

Recommended:

```text
SearchScopeEvidence {
  requested_country
  source_surface_country
  returned_listing_country
  scope_match
}
```

Provider quality metrics should include geographic precision:

```text
geo_precision =
results_matching_requested_geography / total_results
```

This creates a measurable Provider Quality dimension.

## Platform capabilities

Current official/help surfaces document:
- free ad posting;
- registration/login;
- internal personal messaging;
- favorites;
- advanced search;
- categories and location hierarchy;
- 30/60-day listing duration;
- repeat renewal;
- seller-rating help content;
- editorial policies;
- automated moderation;
- prohibited-content rules;
- multi-location visibility;
- search-engine indexing.

## Transaction model

The help center explicitly includes guidance titled `Global-Free-Classified-Ads.com is NOT involved in user transactions`.

Phoenix should therefore classify it primarily as:

```text
discovery = yes
contact = yes
marketplace_payment = no
transaction_intermediation = no
```

Any payment/protection relationship must be evaluated outside the platform.

## Data-quality considerations

The source deserves conservative quality weighting because:
- Germany navigation can surface foreign listings;
- free renewable listings can persist for long periods;
- multi-location amplification can create duplicate-like presence;
- categories include high-spam-risk areas such as business opportunities and services;
- automated moderation exists but does not equal factual verification.

This does not make the source unusable. It means Phoenix needs stronger normalization, deduplication and confidence scoring.

## Access / API assessment

Verified:
- public Germany HTML surface;
- region/city subdomains;
- public search/category navigation;
- account-based messaging/favorites;
- automated moderation;
- multi-location distribution features.

Not identified:
- public search API for third-party aggregators;
- public catalog export feed;
- documented Phoenix-style partner API.

Recommended:

```text
public_html = YES
public_search_api = NOT IDENTIFIED
public_export_feed = NOT IDENTIFIED
production_collection = DISABLED pending explicit permission
preferred_route = contact operator / validate partner access
```

Because access rights were not established, Phoenix should not infer permission merely from public accessibility.

## Partnership questions

1. Is a licensed search/catalog feed available?
2. Can Germany-only inventory be requested at listing level?
3. Are canonical IDs preserved across multi-location publication?
4. Can original publication and renewal timestamps be distinguished?
5. Are deletion/expiry events available?
6. Can seller-rating data be licensed?
7. Can moderation state be exposed?
8. What caching, storage and redistribution rights apply?

## Capability Impact

- listing_level_geography
- renewal_aware_freshness
- geographic_distribution_provenance
- moderation_evidence
- search_scope_quality
- provider_geo_precision
- cross_surface_deduplication
- discovery_only_transaction_model

## Reusable DevKit Components

1. `GeographyEvidenceMapper`
2. `ListingLifecycleEvidenceMapper`
3. `GeographicDistributionEvidenceMapper`
4. `ModerationEvidenceMapper`
5. `SearchScopeEvidenceMapper`
6. `ProviderGeoPrecisionMetric`
7. `CrossSurfaceDeduplicator`
8. `ProviderQualityScore`

## Strategic Score

| Dimension | Score |
|---|---:|
| Germany surface availability | 90 |
| Inventory/category breadth | 88 |
| Local geography structure | 88 |
| Data-quality confidence | 55 |
| Freshness confidence | 50 |
| Architecture learning | 97 |
| API readiness | 20 |
| Partnership evidence | 45 |
| Decision Engine value | 72 |
| Integration priority | 55 |

**Indicative Strategic Score: 68 / 100**

## Final Decision

### WATCH / LOW-PRIORITY GO FOR PARTNERSHIP VALIDATION

Global-Free-Classified-Ads Germany is active and potentially useful as a long-tail discovery source, but it should not rank alongside Tier-1 German providers such as Kleinanzeigen or Hood.

Before production integration Phoenix needs:
- explicit access permission;
- geographic precision testing;
- duplicate-rate measurement;
- stale/renewed listing analysis;
- seller-quality analysis.

Most important conclusion:

> A country-specific marketplace surface does not guarantee country-specific inventory. Phoenix must validate geography at the listing level and measure provider precision empirically.

## Canonical Discoveries

- PD-127 — Navigation Geography Is Not Listing Geography
- PD-128 — Renewal Can Create Indefinite Listing Lifetimes
- PD-129 — Geographic Amplification Can Create Multi-Surface Presence
- PD-130 — Automated Moderation Is Source Governance Evidence, Not Listing Verification
- PD-131 — Search-Surface Scope Can Be Broader Than User Intent

Reinforced:
- PD-054 Renewal-Aware Freshness
- PD-056 Trust Evidence, Not Trust Score
- PD-057 Mixed-Origin Marketplace
- PD-065 Commercial Resurfacing ≠ Freshness
- PD-114 Distribution Network Can Extend Beyond Marketplace Inventory
- PD-117 Promotion Mechanics Can Mutate Freshness
- PD-126 Marketplace Distribution Can Extend Through External Acquisition Channels

## Sources

Canonical tracker:
- User-provided `marketplaces_europe(3).csv` — Tracker ID 40 = Global-free-classified-ads.

Current research, 2026-08-02:
- https://germany.global-free-classified-ads.com/
- https://germany.global-free-classified-ads.com/changelocation/
- https://berlincity.global-free-classified-ads.com/
- https://germany.global-free-classified-ads.com/real-estate-for-sale-cid-13
- https://germany.global-free-classified-ads.com/computer-for-sale-cid-11
- https://www.global-free-classified-ads.com/help/
- https://www.global-free-classified-ads.com/help/knowledgebase.php
- https://www.global-free-classified-ads.com/help/knowledgebase.php?article=10
- https://www.global-free-classified-ads.com/help/knowledgebase.php?article=2
- https://www.global-free-classified-ads.com/help/knowledgebase.php?category=7

Phoenix continuity:
- KR_039_HOOD_DE.md ended at PD-126.

This is a strategic/technical assessment, not legal advice.
