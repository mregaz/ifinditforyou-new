# PHOENIX ATLAS — KNOWLEDGE RECORD 025

## Tablondeanuncios.com

- **Tracker ID:** 25
- **Country:** Spain
- **Operator:** Servicios Generales de Comercio Online, SL (SGCO)
- **Marketplace type:** Horizontal classifieds / contact marketplace
- **Lifecycle:** ACTIVE
- **Research date:** 2026-08-01
- **Decision:** GO CONDIZIONATO — permissioned integration only
- **Indicative Strategic Score:** 81 / 100

---

## 1. Executive Summary

Tablondeanuncios.com is an active Spanish classifieds platform covering a wide range of verticals, including:

- motor;
- real estate;
- jobs;
- computing;
- home;
- sports;
- travel;
- students;
- leisure;
- business;
- local market;
- services;
- personals.

The platform presents itself as one of the oldest free-classifieds portals in Spain and states that more than ten thousand ads are published daily.

The source is strategically interesting for Phoenix because it combines:

- broad multi-vertical inventory;
- strong geographic taxonomy;
- recent listing activity;
- alerting;
- favorites;
- seller/contact workflows;
- paid promotion;
- XML bulk-publication capability;
- syndication to third-party surfaces.

However, the Terms explicitly prohibit robots, spiders, scrapers and other automated means for accessing the portal to copy, remove, renew or publish content.

Therefore Phoenix should not build a production crawler without authorization.

---

## 2. Current Marketplace Surface

Current public navigation includes provinces throughout Spain and major verticals.

Observed category counts include substantial inventory in Motor, Computing, Sports, Services, Contacts and Employment.

The platform exposes:
- search;
- latest listings;
- provincial pages;
- category pages;
- listing detail pages;
- favorites;
- alerts;
- reporting;
- contact forms;
- paid highlighting;
- premium services.

---

## 3. Marketplace Role

Tablondeanuncios primarily acts as a contact platform between:
- private sellers;
- professionals;
- companies;
- buyers / applicants.

Its Terms state that it facilitates contact and is not itself the contracting party to transactions between users.

Recommended Phoenix classification:

```text
MarketplaceCapabilities {
  accepts_direct_listings = true
  provides_search = true
  provides_alerts = true
  provides_favorites = true
  facilitates_contact = true
  handles_transaction = false
  supports_paid_promotion = true
  supports_bulk_publishing = true
}
```

---

## 4. Listing Lifecycle

Free listings remain published for up to six months from the last renewal.

Paid listings may have shorter or category-dependent lifetimes.

Users can:
- modify;
- renew;
- deactivate;
- delete.

The platform can also perform publication/renewal actions when appropriate.

This reinforces Phoenix's **Renewal-Aware Freshness** model.

Recommended fields:

```text
first_seen_at
source_published_at
source_last_renewed_at
source_expiry_policy
phoenix_last_seen_at
```

A renewed six-month listing must not be treated as newly created inventory.

---

## 5. Syndication

The Terms state that Tablondeanuncios may distribute listings, fully or partially, to third-party portals such as:

- aggregators;
- search engines;
- social networks;
- blogs.

This creates another explicit syndication chain:

```text
Seller
  ↓
Tablondeanuncios
  ↓
Third-party aggregator/search/social/blog
  ↓
Phoenix
```

Phoenix must therefore preserve provenance and detect cross-surface duplicates.

---

## 6. Automation / Access Policy

The Terms explicitly prohibit using:

- robots;
- spiders;
- scrapers;
- other automated means

to access the portal in order to copy, remove, renew or publish content.

They also prohibit bypassing measures used to restrict access.

Therefore:

```text
public_html = yes
automated_collection = prohibited_without_permission
official_open_search_api = not_identified
production_scraping = no-go
authorized_integration = preferred
```

---

## 7. Critical Opportunity — Bulk XML / Pasarela

The Terms explicitly say that users who wish to publish ads in bulk through a gateway should contact the company.

They also refer to bulk publication through XML files.

This is strong evidence of a structured ingestion surface.

Important direction:

```text
Publisher
   ↓
XML / Pasarela
   ↓
Tablondeanuncios
```

This does NOT prove that Tablondeanuncios exposes inventory feeds to Phoenix.

However, it demonstrates:
- structured bulk data ingestion exists;
- professional collaboration exists;
- XML-based partner workflows are operationally recognized.

This strengthens PD-061 Partner Surface Directionality.

---

## 8. New Discovery — PD-062

### Marketplace Syndication Rights as Provenance Evidence

When marketplace terms explicitly authorize republication to third-party surfaces, Phoenix should record that as part of provenance.

Recommended model:

```text
SyndicationPolicy {
  marketplace
  may_republish
  destination_types[]
  scope
  observed_at
}
```

Possible destination types:
- aggregator
- search_engine
- social_network
- blog
- partner_site
- unknown

This helps explain why duplicate copies of the same listing may legitimately appear outside the original marketplace.

---

## 9. New Discovery — PD-063

### Listing Expiry Policy as Ranking Evidence

Marketplace expiry rules affect data reliability.

Recommended contract:

```text
ListingLifecyclePolicy {
  default_expiry_days
  paid_expiry_days
  renewable
  renewal_resets_visibility
  source_can_extend
}
```

Phoenix should incorporate listing-lifecycle policy into freshness confidence.

Example:

A source where free listings remain live six months requires more aggressive stale-listing detection than a source with short-lived inventory.

---

## 10. New Discovery — PD-064

### Professional Publishing Channel

Tablondeanuncios distinguishes between free private publishing and professional/premium/bulk publishing.

Phoenix should model:

```text
SellerPublicationMode {
  private_free
  professional_premium
  professional_partner
  bulk_feed
}
```

This can become useful evidence for:
- seller type;
- inventory scale;
- listing duplication risk;
- freshness expectations;
- commercial relationships.

---

## 11. Promotion Provenance

The platform supports paid highlighting and premium publishing.

Therefore Phoenix ranking must distinguish:

```text
source_relevance
source_paid_visibility
phoenix_decision_score
```

Paid placement on the source must never silently become a Phoenix quality signal.

This reinforces PD-014 Promotion Provenance.

---

## 12. Moderation / Quality Rules

The Terms include controls against:
- duplicate listings;
- false or misleading content;
- unauthorized URLs;
- misuse of trademarks/copyrighted content;
- illegal or restricted categories;
- certain job-listing abuses;
- identity misuse.

This does not prove individual listing accuracy, but it is useful **Source Quality Evidence**.

Recommended:

```text
SourceQualityEvidence {
  duplicate_policy
  identity_policy
  prohibited_content_policy
  moderation_rules
  professional_rules
}
```

---

## 13. Sensitive Verticals

The site includes a Contacts section with adult-oriented subcategories.

Phoenix should apply:

```text
sensitive_vertical_ingestion = disabled_by_default
```

and isolate these categories from standard marketplace search.

This reinforces PD-033 Sensitive Vertical Isolation.

---

## 14. Geographic Architecture

The platform has extensive province-level structure and local discovery.

Recommended mapping:

```text
Spain
  ↓
Province
  ↓
Municipality / locality
  ↓
Category
  ↓
Listing
```

Phoenix should retain source geography as structured evidence rather than flattening it into a single string.

---

## 15. DevKit Components

Recommended reusable components:

1. `MarketplaceAccessPolicyGate`
2. `ListingLifecyclePolicyMapper`
3. `RenewalAwareFreshnessMapper`
4. `SyndicationPolicyRegistry`
5. `BulkPublishingCapabilityRegistry`
6. `SellerPublicationModeMapper`
7. `PromotionProvenanceMapper`
8. `SensitiveVerticalGate`
9. `HierarchicalLocationMapper`
10. `SourceQualityEvidenceMapper`

---

## 16. AI Opportunities

AI can help with:
- stale listing detection;
- duplicate clustering;
- renewed-versus-new listing inference;
- seller type classification;
- cross-surface syndication detection;
- spam/fraud risk estimation;
- category normalization;
- geographic normalization;
- distinguishing paid visibility from organic relevance.

---

## 17. Strategic Scoring

| Dimension | Score |
|---|---:|
| Spain market relevance | 82 |
| Inventory breadth | 88 |
| Architecture learning | 91 |
| Freshness/lifecycle value | 93 |
| Partnership evidence | 80 |
| Open API readiness | 30 |
| Authorized integration potential | 68 |
| Decision Engine value | 82 |
| Compliance complexity | 40 |

**Indicative Strategic Score: 81 / 100**

---

## 18. Final Decision

### GO CONDIZIONATO — PERMISSIONED INTEGRATION ONLY

Tablondeanuncios is strategically relevant to Phoenix because of:
- multi-vertical coverage;
- active inventory;
- geographic depth;
- alerting and favorites;
- explicit listing lifecycle;
- syndication;
- professional publication;
- structured XML bulk-ingestion capability.

But Phoenix should **not** build an unauthorized production scraper because the Terms explicitly prohibit automated scraping/access.

Recommended path:

1. Keep Tablondeanuncios as a strategic Spanish source.
2. Add it to the partnership / authorized-access pipeline.
3. Ask specifically about:
   - outbound feeds;
   - partner APIs;
   - referral programs;
   - authorized inventory access;
   - bulk data agreements.
4. Reuse Phoenix lifecycle/provenance components before any provider implementation.
5. Disable sensitive verticals by default.

---

## 19. Canonical Discoveries

- **PD-062 — Marketplace Syndication Rights as Provenance Evidence**
- **PD-063 — Listing Expiry Policy as Ranking Evidence**
- **PD-064 — Professional Publishing Channel**

Reinforced:
- PD-014 Promotion Provenance
- PD-033 Sensitive Vertical Isolation
- PD-054 Renewal-Aware Freshness
- PD-061 Partner Surface Directionality

---

## 20. Sources

Primary/current web sources researched 2026-08-01:

- https://www.tablondeanuncios.com/
- https://www.tablondeanuncios.com/pol_respons.php
- https://www.tablondeanuncios.com/buscador/
- https://www.tablondeanuncios.com/anuncios-clasificados-categorias/
- https://www.tablondeanuncios.com/ultimos-mil-anuncios.php
- https://www.tablondeanuncios.com/ayuda_general_contenido.php

Phoenix sources:
- PHOENIX_ATLAS_CHECKPOINT_001_022_MASTER.md
- PHOENIX_ATLAS_DISCOVERY_LEDGER_CHECKPOINT.md
- KR_024_LOCANTO_ES.md
