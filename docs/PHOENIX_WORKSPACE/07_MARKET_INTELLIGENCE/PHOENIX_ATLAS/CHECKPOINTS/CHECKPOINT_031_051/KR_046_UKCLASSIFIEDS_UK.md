# PHOENIX ATLAS — KNOWLEDGE RECORD 046

## UKClassifieds.co.uk — United Kingdom

- Tracker ID: 46
- Country: United Kingdom
- Vertical: Horizontal classifieds / services / goods / vehicles / property / jobs / pets / travel / community
- Canonical domain: https://www.ukclassifieds.co.uk/
- Lifecycle: ACTIVE
- Research date: 2026-08-02
- Decision: GO CONDIZIONATO — long-tail/secondary UK provider; written permission required for commercial reuse
- Integration priority: MEDIUM
- Indicative Strategic Score: 74 / 100
- Discovery continuity: PD-162 → PD-166

## Executive Summary

UK Classifieds is an active UK classifieds platform operating for more than 18 years.

Current search/category surfaces expose roughly 90k ads overall, with very strong concentration in Services and meaningful inventory in For Sale, Vehicles, Property, Jobs, Pets, Travel and Community.

The platform offers:
- free standard ads;
- paid premium/promoted positioning;
- saved searches and email alerts;
- seller-type filtering (Personal / Company);
- locality/radius search;
- favorites;
- company/business profiles.

The most important Phoenix finding is that UK surface context is not perfectly reliable as geographic truth. Current UK pages can expose listings whose actual location is "International" or outside the UK, despite FAQ policy stating that goods/services located outside UK and Ireland are not permitted.

This makes UK Classifieds a useful secondary source only if Phoenix applies listing-level geography validation and provider-quality scoring.

Current Terms reserve all rights, prohibit commercial use without prior written consent, and prohibit harvesting user data. No public Phoenix-oriented search API/export feed was identified.

## Current inventory structure

Current homepage/search surfaces expose categories including:
- For Sale
- Vehicles
- Property
- Services
- Jobs
- Pets
- Travel
- Community
- Boats

At research time, Services dominated the marketplace by a large margin.

Current search surfaces also expose:
- Personal vs Company seller filter
- item age filter
- price filter
- location/radius filter
- "Newly listed", lower price, higher price sort modes
- saved-search alerts

## PD-162 — Provider Inventory Concentration Must Be Measured

A horizontal marketplace may technically support many categories while most of its real inventory is concentrated in only one or two verticals.

Recommended:

```text
ProviderInventoryConcentration {
  provider
  total_inventory
  vertical_distribution[]
  concentration_ratio
  observed_at
}
```

For UK Classifieds, Services currently dominate the visible inventory.

Strategic implication:

> Category breadth does not imply balanced provider value.

Provider priority should depend on the vertical requested by the user.

## PD-163 — Marketplace Policy and Observed Inventory Can Diverge

UK Classifieds FAQ states that ads for goods/services located outside the UK and Ireland are not allowed.

Yet current indexed listings on UK surfaces include examples explicitly labeled "International" or located outside the UK.

Recommended:

```text
PolicyComplianceEvidence {
  provider
  policy_rule
  observed_violation
  violation_type
  observed_at
}
```

Phoenix should not assume that marketplace moderation fully enforces stated policy.

This strengthens the distinction between governance rules and actual listing quality.

## PD-164 — Company Identity Is a Source-Native Seller Type

Current UK Classifieds filters explicitly distinguish:

```text
Personal
Company
```

and the platform maintains a Companies directory / business-profile surface.

Recommended:

```text
SellerTypeEvidence {
  source
  seller_type
  business_profile_available
  company_listing_count
  observed_at
}
```

This is source-native evidence and should remain separate from Phoenix's own professional-seller inference.

## PD-165 — Promotion Layer Can Be Explicitly Separated From Organic Results

Current search pages expose a distinct `Premium listings` section before ordinary results.

FAQ also states that standard ads are free while paid upgrades can place listings on the homepage or above other listings.

Recommended:

```text
PromotionEvidence {
  premium
  promotion_position
  homepage_featured
  organic_position_unknown
}
```

This is a cleaner case than sources where promotion is visually mixed into organic results.

Phoenix should preserve the explicit source promotion flag and exclude it from quality/relevance scoring.

## PD-166 — Provider Quality Can Be Evaluated Against Its Own Policy

Because UK Classifieds publishes explicit rules (e.g. geographic restrictions, prohibited categories) and current inventory can be inspected, Phoenix can measure:

```text
ProviderPolicyPrecision =
observed_compliant_results / sampled_results
```

This introduces a stronger Provider Quality concept:

```text
ProviderQualityProfile {
  geo_precision
  category_precision
  policy_precision
  freshness_confidence
  duplicate_rate
  seller_signal_quality
}
```

A marketplace's own policies can become a benchmark for empirically testing source quality.

## Access / compliance

Current Terms state:
- no implied license/right is granted by making the service available;
- commercial use of the website/service requires prior written consent;
- users may not collect or harvest data about other users;
- website/content rights are reserved.

No public Phoenix-oriented search API or catalog export feed was identified.

Therefore:

```text
public_html = YES
public_search_api = NOT IDENTIFIED
public_export_feed = NOT IDENTIFIED
commercial_reuse_without_permission = NO-GO
production_collection = DISABLED
preferred_route = written permission / partnership
```

## Transaction model

UK Classifieds acts primarily as a discovery/contact platform.

Current Terms disclaim responsibility for dealings with third parties and do not present the platform as the seller/transaction counterparty.

Recommended:

```text
discovery = yes
contact = yes
marketplace_payment = not identified
transaction_intermediation = no evidence
```

## Trust / moderation

Current FAQ prohibits categories including:
- adult content
- endangered species/CITES items
- restricted dog breeds
- prescription medicines / illegal drugs / tobacco
- certain occult/spellcasting services
- counterfeit/pirated software
- weapons
- non-UK/Ireland goods/services

The platform provides "Trade Safely" guidance and fraud warnings.

These are governance signals, not proof of factual verification.

## Strategic value to Phoenix

UK Classifieds should be treated as a secondary/long-tail UK source rather than a Tier-1 provider.

Best use cases:
- Services
- local professionals
- general For Sale
- additional recall after Gumtree/major sources

Lower confidence areas:
- geographic precision
- moderation/policy enforcement
- category balance

## Reusable DevKit Components

1. `ProviderInventoryConcentrationMapper`
2. `PolicyComplianceEvidenceMapper`
3. `SellerTypeEvidenceMapper`
4. `PromotionEvidenceMapper`
5. `ProviderPolicyPrecisionMetric`
6. `ProviderQualityProfile`
7. `ListingGeographyValidator`
8. `LongTailProviderGate`

## Strategic Score

| Dimension | Score |
|---|---:|
| UK relevance | 82 |
| Inventory breadth | 85 |
| Services vertical value | 95 |
| General product-market value | 68 |
| Architecture learning | 95 |
| Data-quality confidence | 58 |
| Geographic precision confidence | 55 |
| Public API readiness | 15 |
| Partnership evidence | 45 |
| Decision Engine value | 73 |

**Indicative Strategic Score: 74 / 100**

## Final Decision

### GO CONDIZIONATO — SECONDARY / LONG-TAIL UK PROVIDER

UK Classifieds is active and potentially useful, particularly for Services and incremental local recall.

It should not be prioritized ahead of Gumtree or other stronger UK marketplaces.

Production integration requires:
- written permission/commercial access;
- empirical geo-precision testing;
- category precision testing;
- duplicate/stale-listing analysis;
- policy-compliance sampling.

Most important conclusion:

> Phoenix can measure provider quality not only against user intent, but against the marketplace's own published rules.

## Canonical Discoveries

- PD-162 — Provider Inventory Concentration Must Be Measured
- PD-163 — Marketplace Policy and Observed Inventory Can Diverge
- PD-164 — Company Identity Is a Source-Native Seller Type
- PD-165 — Promotion Layer Can Be Explicitly Separated From Organic Results
- PD-166 — Provider Quality Can Be Evaluated Against Its Own Policy

Reinforced:
- PD-056 — Trust Evidence, Not Trust Score
- PD-127 — Navigation Geography Is Not Listing Geography
- PD-130 — Automated Moderation Is Source Governance Evidence, Not Listing Verification
- PD-131 — Search-Surface Scope Can Be Broader Than User Intent
- PD-135 — Provider Quality Must Be Field-Specific

## Sources

Canonical tracker:
- User-provided `marketplaces_europe(3).csv` — Tracker ID 46 = UKclassifieds.co.uk / United Kingdom / general classifieds.

Current web research, 2026-08-02:
- https://www.ukclassifieds.co.uk/
- https://www.ukclassifieds.co.uk/search
- https://www.ukclassifieds.co.uk/services
- https://www.ukclassifieds.co.uk/for-sale
- https://www.ukclassifieds.co.uk/help-p65
- https://www.ukclassifieds.co.uk/terms-p25
- https://www.ukclassifieds.co.uk/companies

This is a strategic/technical assessment, not legal advice.
