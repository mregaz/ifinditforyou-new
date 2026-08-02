# PHOENIX ATLAS — KNOWLEDGE RECORD 041

## DOSKIO.de — Germany

- Tracker ID: 41
- Country: Germany
- Vertical: General classifieds
- Canonical domain: https://doskio.de/
- Primary audience signal: Russian-language classifieds in Germany
- Lifecycle: ACTIVE
- Research date: 2026-08-02
- Decision: WATCH / LONG-TAIL SOURCE — access and quality validation required
- Integration priority: LOW–MEDIUM
- Indicative Strategic Score: 67 / 100

## Executive Summary

DOSKIO.de is currently active and presents itself as a free-classifieds board in Germany. The interface is primarily Russian-language, while listings themselves can be Russian, German or English.

The current home surface exposes categories for services/business, jobs, vehicles, real estate, children, hobbies, home/garden, electronics, fashion, animals, rentals and free/exchange items.

The source is potentially useful to Phoenix as a niche long-tail source, particularly for cross-language discovery. However, current category/search surfaces show substantial quality and taxonomy leakage: pages for one category can surface unrelated jobs, services, animals, bicycles and foreign-location commercial listings.

No public Phoenix-oriented API/feed was identified in the current research. Production integration should remain disabled until access rights, precision and duplication are measured.

## PD-132 — Interface Language Is Not Listing Language

DOSKIO's navigation/interface is predominantly Russian, but current listings contain German, Russian and English text.

Therefore:

```text
interface_language != listing_language
```

Recommended:

```text
LanguageEvidence {
  interface_language
  title_language
  description_language
  seller_language
  detected_languages[]
  confidence
}
```

Phoenix language filtering and query expansion must operate at listing level.

## PD-133 — Marketplace Audience Can Be Linguistic Rather Than National

DOSKIO is geographically oriented toward Germany while serving a visibly Russian-speaking audience.

This introduces an audience dimension independent from country:

```text
MarketplaceAudience {
  country
  interface_languages[]
  community_languages[]
  diaspora_or_community_focus
}
```

For Phoenix this can be strategically useful: a German search performed only in German may miss inventory marketed to Russian-speaking residents.

## PD-134 — Category Membership Can Be Noisy

Current DOSKIO category pages can return unrelated inventory. For example, pages under children/real-estate/services can surface bicycles, electronics, jobs and unrelated service listings.

Therefore:

```text
navigation_category != reliable_listing_category
```

Recommended provider metric:

```text
category_precision =
results_matching_requested_category / total_results
```

Phoenix should infer/validate category from title, description and structured listing evidence rather than blindly trust the source navigation path.

## PD-135 — Provider Quality Must Be Field-Specific

DOSKIO demonstrates that a provider may have usable geography or price fields while exhibiting weak category precision or language consistency.

A single global provider-quality score hides these differences.

Recommended:

```text
ProviderQualityProfile {
  geo_precision
  category_precision
  language_precision
  freshness_confidence
  duplicate_rate
  price_parse_success
  seller_signal_quality
}
```

Provider selection can then depend on the query type.

## PD-136 — Cross-Language Retrieval Is a Provider Capability

Because inventory is multilingual, Phoenix can gain recall by translating/expanding a user query into provider-relevant languages before retrieval.

Example:

```text
user query: "cucciolo labrador"
        ↓
query expansion
        ├── Labrador Welpe
        ├── Labrador puppy
        └── щенок лабрадора
```

This should be treated as a provider capability rather than a universal rule:

```text
CrossLanguageSearchCapability {
  provider
  useful_languages[]
  expansion_enabled
  translation_strategy
}
```

## Data-quality observations

Current search results show:
- active listings dated in 2026;
- explicit prices and negotiable-price markers;
- German city/district/region locations;
- some generic `Germany` locations;
- some `Other country` locations;
- mixed-language titles/descriptions;
- repeated commercial/product patterns;
- category leakage.

These observations make DOSKIO potentially useful for recall but unsuitable for high-confidence ranking without normalization and quality weighting.

## Access assessment

Verified:
- public HTML marketplace;
- active 2026 listings;
- search and category navigation;
- structured price/location/date signals.

Not identified:
- public search API;
- public catalog export feed;
- documented partner API suitable for Phoenix.

Recommended:

```text
public_html = YES
public_search_api = NOT IDENTIFIED
public_export_feed = NOT IDENTIFIED
production_collection = DISABLED pending permission
preferred_route = contact operator / validate access rights
```

## Recommended validation before integration

1. Obtain explicit permission or licensed access.
2. Measure category precision on representative searches.
3. Measure Germany-only geographic precision.
4. Measure duplicate/repost rate.
5. Detect listing language independently.
6. Test cross-language query expansion.
7. Exclude sensitive/high-risk categories by default.
8. Benchmark incremental recall versus Tier-1 German providers.

## Reusable DevKit Components

1. `LanguageEvidenceMapper`
2. `MarketplaceAudienceRegistry`
3. `CategoryPrecisionMetric`
4. `ProviderQualityProfile`
5. `CrossLanguageSearchCapability`
6. `QueryExpansionEngine`
7. `ListingCategoryValidator`
8. `LongTailProviderGate`

## Strategic Score

| Dimension | Score |
|---|---:|
| Germany relevance | 82 |
| Long-tail inventory potential | 78 |
| Multilingual discovery value | 96 |
| Category precision | 45 |
| Data-quality confidence | 55 |
| Architecture learning | 96 |
| API readiness | 15 |
| Partnership evidence | 35 |
| Decision Engine value | 70 |

**Indicative Strategic Score: 67 / 100**

## Final Decision

### WATCH / LONG-TAIL SOURCE

DOSKIO.de is active and strategically interesting because it exposes multilingual inventory aimed at a linguistic community inside Germany.

It should not be prioritized ahead of major German marketplaces. Its value is incremental recall.

Most important conclusion:

> Phoenix should search markets not only by country and category, but—when the provider warrants it—by the languages and communities through which inventory is actually advertised.

## Canonical Discoveries

- PD-132 — Interface Language Is Not Listing Language
- PD-133 — Marketplace Audience Can Be Linguistic Rather Than National
- PD-134 — Category Membership Can Be Noisy
- PD-135 — Provider Quality Must Be Field-Specific
- PD-136 — Cross-Language Retrieval Is a Provider Capability

Reinforced:
- PD-127 — Navigation Geography Is Not Listing Geography
- PD-131 — Search-Surface Scope Can Be Broader Than User Intent

## Sources

Canonical tracker:
- User-provided `marketplaces_europe(3).csv` — Tracker ID 41 = DOSKIO.de.

Current web research, 2026-08-02:
- https://doskio.de/
- current DOSKIO category and listing surfaces indexed in 2026.

Research limitations:
- No public Phoenix-oriented API/feed was identified.
- Exact commercial reuse/automation rights were not established and require operator confirmation.

This is a strategic/technical assessment, not legal advice.
