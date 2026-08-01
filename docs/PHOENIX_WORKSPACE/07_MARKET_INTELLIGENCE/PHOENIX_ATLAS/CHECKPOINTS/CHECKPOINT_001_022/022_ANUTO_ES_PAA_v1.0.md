# PHOENIX ATLAS — PROVIDER ARCHITECTURE ANALYSIS

## 022 — ANUTO (SPAIN)

**Version:** 1.0  
**Analysis date:** 2026-08-01  
**Atlas sequence:** 022 / 61  
**Tracker domain:** https://www.anuto.com  
**Current operational surface:** https://es.anuto.app  
**Country:** Spain  
**Marketplace family:** Horizontal classifieds / local real-time marketplace  
**Strategic tier:** Tier 3  
**Final decision:** GO STRATEGICO LIMITATO / NO-GO FOR UNAUTHORIZED AUTOMATION  
**Integration priority:** LOW-MEDIUM  
**Indicative score:** 62 / 100

---

# 1. Executive Summary

Anuto is an active general-classifieds marketplace, but the tracker URL is stale. The current Spanish marketplace operates principally at `es.anuto.app`, while `anuto.com` was not verified as the live marketplace surface during this research.

The platform exposes categories including:

- buying and selling;
- vehicles;
- real estate;
- jobs;
- business;
- services;
- training;
- leisure.

Its positioning emphasizes free classified publication, local discovery, real-time updates, integrated chat, profile/reputation signals and free renewal of listings every 12 hours.

For Phoenix, Anuto is more valuable as an architectural and lifecycle-intelligence case than as a Tier-1 source.

A crucial compliance result was found: Anuto's Terms explicitly prohibit automated means such as spiders, robots and crawlers from downloading information from the service, except compliant search engines and non-commercial public archives.

Therefore:

> Phoenix must not implement production scraping of Anuto without authorization.

---

# 2. Tracker Correction

Original tracker record:

```text
ID = 22
site = Anuto
url = https://www.anuto.com
country = Spain
status = DA_ANALIZZARE
```

Verified current state:

```text
brand = Anuto Marketplace
active_surface = https://es.anuto.app
legacy_or_stale_tracker_domain = https://www.anuto.com
marketplace_status = active
tracker_status = needs_url_update
```

This is not a dead marketplace.

It is a **domain/surface migration case**.

---

# 3. Marketplace Model

Anuto is a horizontal classifieds platform supporting local buying and selling.

Observed platform concepts include:

- free listing publication;
- category browsing;
- geographic/local search;
- price;
- listing description;
- seller profile;
- chat;
- ratings;
- favorites;
- map/location search;
- real-time listing refresh;
- manual renewal every 12 hours.

The platform also has country-specific deployments beyond Spain.

Examples verified through current public search include Argentina, Peru, Ecuador and Mexico.

This suggests a multi-country marketplace architecture using localized subdomains.

---

# 4. Spain Category Architecture

Main categories observed:

```text
Compraventa
Vehículos
Inmuebles
Empleo
Negocios
Servicios
Formación
Ocio
```

This makes Anuto a heterogeneous source requiring category-aware normalization.

Potential Phoenix vertical mapping:

```text
Compraventa -> general_marketplace
Vehículos -> vehicles
Inmuebles -> real_estate
Empleo -> jobs
Negocios -> business
Servicios -> services
Formación -> education
Ocio -> leisure
```

---

# 5. Real-Time Marketplace Pattern

Anuto explicitly emphasizes:

- publication in real time;
- current listings;
- ability to renew ads every 12 hours;
- live-style discovery.

This creates an important Phoenix issue:

## Listing Freshness versus Listing Renewal

A listing can appear recent because the seller renewed it.

Therefore:

```text
listing_rank_recency != original_publication_recency
```

Phoenix should distinguish:

```text
first_seen_at
source_published_at
source_refreshed_at
source_renewed_at
phoenix_last_seen_at
```

This prevents renewed listings from being falsely interpreted as newly created inventory.

---

# 6. External-Link / Cross-Marketplace Evidence

Current Anuto listings were observed containing links to Wallapop listings or seller profiles.

This creates a valuable intelligence pattern.

A marketplace listing may itself reference another marketplace.

Example:

```text
Seller
  ↓
Anuto Listing
  ↓
Wallapop URL
```

Phoenix should detect such relationships because they may indicate:

- duplicated inventory;
- cross-posting;
- canonical source ambiguity;
- seller syndication;
- stale mirror listings.

This strengthens the earlier Source Provenance work introduced by Trovit.

---

# 7. Trust / Seller Signals

Public profile pages expose signals such as:

```text
phone_verified / unverified
items_sold
ratings
chat
```

Phoenix should not simply normalize all seller scores into one generic reputation number.

Recommended contract:

```text
SellerTrustEvidence
{
  source
  signal_type
  signal_value
  verification_scope
  observed_at
}
```

Examples:

```text
phone_verified
rating_count
rating_score
items_sold
```

---

# 8. Access and Compliance

Anuto Terms explicitly prohibit automated means including:

- spiders;
- robots;
- crawlers;
- data-attack tools;
- similar automated mechanisms used to download information.

Exceptions are described for compliant internet search engines and non-commercial public archives following robots.txt.

Therefore Phoenix classification should be:

```text
access_mode = permissioned_only
public_html_visible = true
automated_collection_allowed = false
official_open_search_api = not_identified
production_scraping = forbidden_without_permission
partnership_preferred = true
```

Public visibility is not equivalent to permission for systematic ingestion.

---

# 9. API / Feed Status

No open general-purpose consumer search API was identified in this research.

Therefore:

```text
public_search_api = not_found
authorized_feed = not_found
partner_api = unknown
```

Phoenix should not infer that no private or partner integration exists; only that no public integration suitable for Phoenix was verified.

---

# 10. Strategic Value

Anuto appears substantially smaller than Tier-1 Spanish marketplaces such as Wallapop or Milanuncios.

Its direct inventory value is therefore moderate.

Its research value is higher because it exposes:

- domain migration;
- localized multi-country architecture;
- free-renewal freshness distortion;
- cross-posted marketplace URLs;
- seller verification signals;
- real-time marketplace positioning;
- explicit automation restrictions.

---

# 11. Phoenix Discoveries

## PD-045 — Marketplace Surface Migration

Marketplace identity must be separate from its domain.

Recommended model:

```text
MarketplaceIdentity
{
  marketplace_id
  brand
  canonical_domain
  previous_domains[]
  locale_surfaces[]
  migration_history[]
}
```

A URL change must not create a new marketplace identity.

---

## PD-046 — Renewal-Aware Freshness

Renewal or bumping must not reset Phoenix's understanding of listing age.

Recommended fields:

```text
first_seen_at
source_published_at
source_refreshed_at
source_renewed_at
phoenix_last_seen_at
```

---

## PD-047 — Cross-Marketplace Listing Reference

Phoenix should detect URLs embedded inside listing text that point to another marketplace.

Possible uses:

- canonical-source selection;
- duplicate detection;
- seller cross-post detection;
- provenance mapping;
- inventory graph construction.

---

## PD-048 — Trust Evidence, Not Trust Score

Source-specific seller verification signals should first be preserved as evidence.

Only the Decision Engine should derive normalized trust estimates.

---

# 12. Capability Impact

Anuto adds or strengthens:

- `marketplace_surface_migration`
- `canonical_domain_history`
- `multi_country_subdomain_mapping`
- `renewal_aware_freshness`
- `listing_bump_detection`
- `cross_marketplace_url_detection`
- `seller_cross_post_graph`
- `seller_trust_evidence`
- `local_map_search`
- `real_time_listing_semantics`
- `permissioned_provider_gate`

---

# 13. DevKit Components

Recommended reusable components:

1. `CanonicalMarketplaceResolver`
2. `DomainMigrationDetector`
3. `LocaleSurfaceRegistry`
4. `ListingRenewalDetector`
5. `FreshnessEvidenceMapper`
6. `CrossMarketplaceURLExtractor`
7. `CanonicalListingSourceResolver`
8. `SellerTrustEvidenceMapper`
9. `MarketplacePermissionGate`
10. `TrackerURLValidator`

---

# 14. AI Opportunities

AI may assist with:

- identifying the canonical marketplace when domains change;
- recognizing old versus new marketplace surfaces;
- detecting listing cross-posts;
- clustering duplicate inventory;
- extracting embedded marketplace links from descriptions;
- separating original publication from renewed visibility;
- detecting low-quality/spam-like listings;
- normalizing heterogeneous category vocabularies;
- explaining trust evidence to users.

---

# 15. Competitive Advantage for Phoenix

Anuto's model remains marketplace-centric.

Phoenix can create additional value by understanding listings across platforms.

Example:

```text
Anuto listing
      +
Wallapop listing
      +
other source
      ↓
Entity Resolution
      ↓
Same Item / Same Seller?
      ↓
Canonical Listing
      ↓
Decision Intelligence
```

This is a concrete example of Phoenix operating above individual marketplaces.

---

# 16. Scoring

| Dimension | Score |
|---|---:|
| Spanish market relevance | 55 |
| Inventory uniqueness | 50 |
| Architecture learning value | 82 |
| International reuse | 78 |
| Trust-signal value | 72 |
| Decision Engine value | 70 |
| Integration feasibility without permission | 20 |
| Partnership potential | 55 |
| Provider reuse | 75 |

**Indicative Strategic Score: 62 / 100**

---

# 17. Final Decision

## GO STRATEGICO LIMITATO

Anuto should remain in Phoenix Atlas, but it should not be prioritized ahead of major Spanish providers.

### Engineering decision

**NO-GO for unauthorized automated ingestion.**

### Strategic decision

Keep Anuto as:

- a secondary Spanish marketplace candidate;
- a domain-migration case;
- a renewal-aware freshness case;
- a cross-marketplace provenance case;
- a seller-trust evidence case.

### Recommended next action

1. Correct tracker URL from `anuto.com` to the current canonical Spanish surface `es.anuto.app`.
2. Record the legacy domain/history instead of overwriting it.
3. Do not develop a production scraper.
4. Consider authorized access only if coverage analysis later shows meaningful incremental inventory.
5. Reuse the new discoveries in the Phoenix Core/DevKit before implementing any Anuto-specific provider.

---

# 18. Sources

Web research performed 2026-08-01.

Primary/current sources:

- Anuto Marketplace Spain — https://es.anuto.app/
- Anuto Terms — https://es.anuto.app/info/terms
- Anuto Marketplace — https://anuto.app/
- Apple App Store — Anuto España
- Anuto localized marketplace surfaces (Argentina, Peru, Ecuador, Mexico)

Phoenix tracker source:

- PHOENIX_ATLAS_PROVIDER_TRACKER_UPDATED_012.csv
