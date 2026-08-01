# PHOENIX ATLAS — KNOWLEDGE RECORD 029

## CiudadAnuncios.es

- Tracker ID: 29
- Country: Spain
- Canonical domain: https://www.ciudadanuncios.es/
- Marketplace type: Horizontal classifieds / city-subdomain network
- Lifecycle: ACTIVE
- Research date: 2026-08-01
- Decision: GO CONDIZIONATO — architecture/intelligence value high; production access requires policy verification
- Integration priority: MEDIUM
- Indicative Strategic Score: 80 / 100

## Executive Summary

CiudadAnuncios.es is an active Spanish classifieds network with broad inventory across Vehicles, Housing, Buy/Sell, Pets, Personals, Jobs, Classes, Services and Community.

At research time its homepage exposed tens of thousands of listings across the principal categories and fresh July 2026 inventory.

The site has a distinctive geographic architecture: city/locality-specific subdomains such as `madrid.ciudadanuncios.es`, `barcelona.ciudadanuncios.es`, and many smaller municipalities.

It also exposes an international footer network linking country-specific sister brands across Europe, Latin America, Africa, Asia, Australia and North America, frequently under different brand/domain names.

This makes CiudadAnuncios strategically valuable as a case of a **multi-brand international classifieds network whose shared architecture is not expressed through one common brand**.

## Current inventory evidence

Homepage category counts observed during research included approximately:

- Vehicles: 4,262
- Housing and premises: 7,129
- Buy/Sell: 7,110
- Pets: 2,551
- Personals: 7,575
- Employment: 12,725
- Classes/Workshops: 2,945
- Services: 15,548
- Community: 859

These are point-in-time observations and must be stored with an observation timestamp.

Current listings dated July 2026 confirm that the marketplace remains active.

## Geographic architecture

CiudadAnuncios uses locality-specific subdomains.

Examples:
- madrid.ciudadanuncios.es
- barcelona.ciudadanuncios.es
- granollers.ciudadanuncios.es
- torrevieja.ciudadanuncios.es
- cornella.ciudadanuncios.es

Recommended Phoenix model:

```text
Marketplace
  ↓
Country
  ↓
Province
  ↓
Municipality / Locality
  ↓
Host Surface
  ↓
Category
  ↓
Listing
```

The host itself is useful geographic evidence.

## PD-076 — Hostname as Geographic Evidence

A marketplace may encode location in the hostname rather than only in listing fields or URL paths.

Recommended contract:

```text
HostLocationEvidence {
  hostname
  inferred_locality
  inferred_country
  confidence
  observed_at
}
```

This evidence should be reconciled with the listing's explicit location, not blindly trusted.

Use cases:
- geographic normalization;
- anomaly detection;
- duplicate detection;
- source-quality checks.

## International network

The Spanish homepage directly links sister classifieds surfaces for countries including:

- Argentina
- Australia
- Brazil
- Chile
- Colombia
- South Africa
- India
- Mexico
- Nigeria
- Pakistan
- Peru
- Philippines
- Portugal
- Russia
- Singapore
- United Kingdom
- United States
- Venezuela

These sites use multiple brands/domains, including CiudadAnuncios, ChaosAds and other localized names.

This differs from Locanto, where a global provider family largely retains one recognizable brand.

## PD-077 — Latent Provider Family

A provider family may exist even when its country sites use different brand names and domains.

Recommended model:

```text
ProviderFamilyEvidence {
  family_id
  member_domain
  member_brand
  country
  evidence_type
  evidence_source
  confidence
}
```

Possible evidence:
- official cross-linking;
- shared footer;
- shared templates;
- shared account system;
- shared legal operator;
- shared technical infrastructure.

For CiudadAnuncios, official cross-linking provides strong family evidence, while legal ownership should remain unresolved until separately verified.

Strategic implication:

`same provider family` must not be inferred only from `same brand name`.

## PD-078 — Cross-Vertical Staleness Variance

CiudadAnuncios shows very different freshness characteristics by category.

Some categories contain current 2026 listings, while deeper category pages retain listings dating back many years.

Therefore a marketplace-level freshness score is insufficient.

Recommended model:

```text
VerticalFreshnessEvidence {
  provider
  locale
  vertical
  newest_seen_at
  oldest_visible_at
  median_age_estimate
  stale_tail_present
  observed_at
}
```

Phoenix should estimate freshness by **Provider × Locale × Vertical**.

This strengthens PD-063 Listing Expiry Policy as Ranking Evidence.

## PD-079 — Structured Listing Anomaly Evidence

Current vehicle pages expose strongly structured fields such as make, model, transmission, displacement, year and price.

Observed listings also contain apparent inconsistencies, for example implausible combinations of vehicle identity, price, engine data or description.

Phoenix should not treat structured source fields as inherently trustworthy.

Recommended model:

```text
ListingConsistencyEvidence {
  title_vs_attributes
  price_plausibility
  description_vs_category
  make_model_consistency
  temporal_consistency
  anomaly_score
}
```

This is a strong AI/Decision Engine opportunity.

## Sensitive verticals

The site includes a large Personals/Contactos section with multiple relationship categories.

Therefore:

`sensitive_vertical_ingestion = disabled_by_default`

and these categories should be excluded from standard Finder/product-search scope.

## Eligible inventory

Because a meaningful portion of total inventory is Personals, Jobs and Services, raw marketplace totals would overstate the inventory useful to Phoenix product discovery.

This reinforces PD-075 Category Mix Can Distort Marketplace Value.

Phoenix should calculate:
- total inventory;
- Phoenix-eligible inventory;
- eligible inventory by vertical;
- fresh eligible inventory.

## Access / integration assessment

Verified:
- public homepage;
- public category/search surfaces;
- public listing surfaces;
- city/locality subdomains;
- listing publication surface;
- international sister-site links.

Not identified during this research:
- public search API;
- public export feed;
- documented Phoenix-suitable partner API.

The privacy-policy link is publicly exposed, but sufficient current Terms/automation-policy evidence was not recovered to classify automated collection as permitted.

Therefore:

```text
public_html = yes
public_search_api = not_identified
public_export_feed = not_identified
automation_permission = unresolved
production_scraping = disabled until terms/robots/authorization verified
```

## Architecture value

CiudadAnuncios contributes strongly to Phoenix because it combines:

1. broad horizontal inventory;
2. location encoded in hostnames;
3. international multi-brand network structure;
4. cross-vertical freshness variance;
5. structured-but-not-necessarily-trustworthy listing data;
6. significant non-product/sensitive inventory.

## Capability Impact

- hostname_location_evidence
- locality_subdomain_resolver
- latent_provider_family
- multi_brand_provider_family
- vertical_freshness_evidence
- listing_consistency_evidence
- eligible_inventory_calculator
- sensitive_vertical_gate
- international_network_registry

## Reusable DevKit Components

1. `HostnameLocationResolver`
2. `HostLocationEvidenceMapper`
3. `LatentProviderFamilyResolver`
4. `InternationalNetworkRegistry`
5. `VerticalFreshnessAnalyzer`
6. `ListingConsistencyAnalyzer`
7. `EligibleInventoryCalculator`
8. `SensitiveVerticalGate`
9. `ProviderLocaleVerticalScorer`

## AI Opportunities

AI can add substantial value through:
- detecting structured listing inconsistencies;
- stale-listing estimation;
- duplicate clustering across city hosts;
- cross-country provider-family discovery;
- geographic anomaly detection;
- category normalization;
- eligible-inventory classification;
- fraud/low-quality listing scoring.

## Strategic Score

| Dimension | Score |
|---|---:|
| Spain inventory breadth | 86 |
| Architecture learning | 94 |
| Geographic intelligence | 98 |
| Provider-family intelligence | 92 |
| Freshness intelligence | 91 |
| Open API readiness | 25 |
| Access-policy certainty | 30 |
| Decision Engine value | 90 |
| Immediate provider priority | 58 |

Indicative Strategic Score: 80 / 100.

## Final Decision

GO CONDIZIONATO.

CiudadAnuncios is not yet a first-wave integration because authorized automated access has not been established.

However, it is a high-value Atlas source for Phoenix architecture.

Most important conclusions:

1. Location may be encoded in the host itself.
2. A provider family may span different brands and domains.
3. Freshness must be measured per vertical, not per marketplace.
4. Structured marketplace data still requires consistency validation.
5. Provider priority must use fresh Phoenix-eligible inventory rather than raw listing totals.

## Canonical Discoveries

- PD-076 — Hostname as Geographic Evidence
- PD-077 — Latent Provider Family
- PD-078 — Cross-Vertical Staleness Variance
- PD-079 — Structured Listing Anomaly Evidence

Reinforced:
- PD-033 Sensitive Vertical Isolation
- PD-063 Listing Expiry Policy as Ranking Evidence
- PD-074 Locale Liquidity Is a Provider-Level Variable
- PD-075 Category Mix Can Distort Marketplace Value

## Sources

Current web research performed 2026-08-01:
- https://www.ciudadanuncios.es/
- https://madrid.ciudadanuncios.es/
- https://barcelona.ciudadanuncios.es/
- current category pages for vehicles, housing, buy/sell, pets, personals and services

Phoenix tracker source:
- PHOENIX_ATLAS_PROVIDER_TRACKER_UPDATED_012.csv / equivalent Atlas tracker evidence.

No public search API/export feed was identified in the research performed for this record.
