# PHOENIX ATLAS — KNOWLEDGE RECORD 028

## Anunciosparatodos — Spain

- Tracker ID: 28
- Country: Spain
- Tracker URL: https://www.anunciosparatodos.es
- Current Spanish surface: https://es.anunciosparatodos.com/
- Provider family: Anuncios Para Todos
- Marketplace type: Horizontal classifieds / multi-country locale network
- Lifecycle: ACTIVE, with canonical-surface correction required
- Research date: 2026-08-01
- Decision: GO CONDIZIONATO — low-priority Spain source; access rights must be verified before automation
- Integration priority: LOW
- Indicative Strategic Score: 67 / 100

## Executive Summary

The tracker correctly identifies the Anuncios Para Todos marketplace, but its URL model is stale/incomplete.

The current Spanish marketplace is served at:

`https://es.anunciosparatodos.com/`

while the root `.com` surface serves Portugal.

This is therefore another Phoenix case where marketplace identity, country locale and domain must be modeled separately.

The Spanish surface is active and exposes broad classifieds taxonomy, but observed category counts are currently small compared with the Portuguese root surface. This makes Spain a lower-priority provider candidate while still making the network architecturally useful.

## Current Spain surface

The Spanish locale currently presents free classifieds across:
- employment;
- animals;
- services;
- motor;
- housing/locales;
- dating/personals;
- general goods;
- consoles/video games;
- events.

The site also exposes registration, free listing publication, contact/support, terms, privacy and cookie-policy surfaces.

Current observed homepage counts show relatively low Spanish inventory in several commercial categories, while personals/dating is more represented.

These counts are observations at research time, not durable market-size statistics.

## Provider-family / locale architecture

The same brand operates a Portuguese root surface at `anunciosparatodos.com` and a Spanish locale at `es.anunciosparatodos.com`.

Recommended model:

```text
AnunciosParaTodosNetwork
├── PT → anunciosparatodos.com
└── ES → es.anunciosparatodos.com
```

The tracker URL `anunciosparatodos.es` should be preserved as historical/alias evidence, but Phoenix should use the verified current Spanish surface as canonical for the locale.

## PD-073 — Locale Surface Can Replace Country TLD

A marketplace may move from a country-code domain model to a subdomain-locale model.

Recommended Phoenix identity:

```text
MarketplaceLocaleSurface {
  marketplace_id
  country
  language
  canonical_url
  legacy_urls[]
  observed_at
}
```

Therefore:
`brand identity != domain identity != locale identity`.

This extends PD-053 Marketplace Surface Migration.

## PD-074 — Locale Liquidity Is a Provider-Level Variable

A global/multi-country marketplace family can have radically different inventory density by locale.

At research time, Spain displayed low counts in many commercial categories, while the Portuguese root marketplace showed materially larger inventory.

Phoenix must therefore score provider usefulness at locale/vertical level, not only at brand level.

Recommended model:

```text
ProviderLiquidityEvidence {
  provider_family
  locale
  vertical
  observed_listing_count
  observed_at
  confidence
}
```

Strategic implication:

A technically reusable Provider Family does not imply equal business priority in every country.

## PD-075 — Category Mix Can Distort Marketplace Value

The Spanish surface currently shows a comparatively larger share of dating/personals than several commerce verticals.

A raw total-listing count can therefore exaggerate usefulness for Phoenix's intended product-search use cases.

Recommended model:

```text
MarketplaceInventoryMix {
  locale
  vertical
  listing_count
  phoenix_eligible
  observed_at
}
```

Provider prioritization should use **eligible inventory**, not total inventory.

## Sensitive verticals

The marketplace includes a substantial dating/personals taxonomy.

Phoenix should keep:

`sensitive_vertical_ingestion = disabled_by_default`

and exclude such inventory from ordinary Finder/product-search workflows.

This reinforces PD-033 Sensitive Vertical Isolation.

## Account and contact signals

The network exposes personal and company account types on its registration surface.

The Portuguese publication/help surface also documents phone association with listings and notes additional phone confirmation in dating/personals contexts.

These are useful family-level capability signals, but Phoenix should not assume every locale has identical policy behavior without locale verification.

## Access / API assessment

Verified:
- public category/search surfaces;
- public listing/detail surfaces;
- account registration;
- free publication;
- support/contact surface.

Not identified during this research:
- public search API;
- public export feed;
- documented partner inventory API;
- documented Phoenix-suitable outbound feed.

The site's terms link is present, but the research did not obtain sufficiently reliable terms text to make a definitive automated-access permission determination.

Therefore:

```text
public_html = yes
public_search_api = not_identified
public_export_feed = not_identified
automation_permission = unresolved
production_scraping = DO NOT ENABLE until terms/robots/authorization are verified
```

This is intentionally different from sources where explicit scraper prohibitions were verified.

## Strategic value

For Phoenix Spain, direct inventory priority is currently low.

Architectural value is higher because the source demonstrates:
- locale/domain migration;
- multi-country provider-family reuse;
- strong locale liquidity differences;
- category-mix distortion;
- sensitive-vertical dominance risk.

## Capability Impact

- locale_surface_registry
- canonical_marketplace_resolver
- legacy_domain_history
- provider_family_locale_adapter
- locale_liquidity_evidence
- eligible_inventory_mix
- sensitive_vertical_gate
- provider_priority_by_locale
- provider_priority_by_vertical

## Reusable DevKit Components

1. `MarketplaceLocaleSurfaceRegistry`
2. `CanonicalMarketplaceResolver`
3. `DomainMigrationDetector`
4. `ProviderLiquidityEvidenceMapper`
5. `EligibleInventoryCalculator`
6. `MarketplaceInventoryMixMapper`
7. `ProviderLocalePriorityScorer`
8. `SensitiveVerticalGate`

## Strategic Score

| Dimension | Score |
|---|---:|
| Spain inventory value | 42 |
| Provider-family reuse | 85 |
| Architecture learning | 88 |
| Locale intelligence | 95 |
| API readiness | 25 |
| Access-policy certainty | 30 |
| Decision Engine relevance | 74 |
| Immediate provider priority | 35 |

Indicative Strategic Score: 67 / 100.

## Final Decision

GO CONDIZIONATO — LOW-PRIORITY SPAIN SOURCE.

Do not prioritize implementation now.

Recommended actions:
1. Correct the canonical Spanish surface in Atlas.
2. Preserve the old `.es` URL as migration/history evidence.
3. Track the brand as a multi-country Provider Family.
4. Score inventory separately by locale and Phoenix-eligible vertical.
5. Exclude sensitive/personals inventory from standard Finder scope.
6. Verify terms, robots and authorization before any automated production collection.
7. Revisit only if Spanish eligible inventory grows or a partnership/feed opportunity appears.

## Canonical Discoveries

- PD-073 — Locale Surface Can Replace Country TLD
- PD-074 — Locale Liquidity Is a Provider-Level Variable
- PD-075 — Category Mix Can Distort Marketplace Value

Reinforced:
- PD-033 Sensitive Vertical Isolation
- PD-053 Marketplace Surface Migration

## Sources

Phoenix tracker:
- PHOENIX_ATLAS_PROVIDER_TRACKER_UPDATED_012.csv
- marketplaces_europe.csv

Current web research, 2026-08-01:
- https://es.anunciosparatodos.com/
- https://www.anunciosparatodos.com/
- current registration/publication/contact surfaces on anunciosparatodos.com

No public API/export-feed documentation was identified in the research performed for this record.
