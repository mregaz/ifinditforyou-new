# PHOENIX ATLAS — KNOWLEDGE RECORD 026

## Anuncios.es

- **Tracker ID:** 26
- **Country:** Spain
- **Canonical domain:** https://www.anuncios.es
- **Marketplace type:** Horizontal classifieds / contact marketplace
- **Lifecycle:** ACTIVE
- **Research date:** 2026-08-01
- **Decision:** GO CONDIZIONATO — authorization/partnership preferred
- **Integration priority:** MEDIUM
- **Indicative Strategic Score:** 79 / 100

---

## 1. Executive Summary

Anuncios.es is an active Spanish horizontal-classifieds portal operating since 2005 according to its current site footer.

The marketplace covers multiple verticals including:

- real estate;
- jobs;
- motor;
- electronics and games;
- animals and pets;
- services;
- adult/personals;
- clairvoyance/tarot;
- barter/exchange;
- other general classifieds.

The platform acts primarily as a technology/contact layer between users and states that it does not intervene in transactions or charge a sales commission.

For Phoenix, the most important feature is not its inventory alone but its **paid renewal mechanics**. Listings can be automatically renewed at short intervals, including every hour. This means source ordering by recency may reflect purchased visibility rather than actual listing age.

That creates a major Decision Engine requirement:

> Phoenix must distinguish chronological freshness from paid resurfacing.

---

## 2. Current operating status

Current 2026 pages and newly indexed listings confirm that Anuncios.es remains operational.

The homepage currently advertises:

- user registration;
- listing publication using credits;
- up to 40 photographs;
- website/social links;
- video links;
- direct-call buttons;
- direct WhatsApp conversation;
- map address;
- descriptions up to 4,000 characters;
- detailed listing statistics;
- personal storefronts;
- paid highlighted listings;
- PRO placement.

The tracker identification as `Anuncios.es`, Spain, general classifieds is therefore valid.

---

## 3. Marketplace model

The Terms describe Anuncios.es as a platform where third parties publish products, services, rentals, exchanges and other offers.

The platform states that:

```text
handles_transaction = false
charges_sales_commission = false
facilitates_contact = true
accepts_direct_listings = true
supports_paid_visibility = true
supports_user_storefronts = true
supports_favorites = true
```

This is a classic contact-marketplace model rather than a transaction marketplace.

---

## 4. Critical ranking issue — paid resurfacing

Anuncios.es sells automatic renewal of listings.

The Terms describe auto-renewal intervals including:

```text
1 hour
2 hours
3 hours
6 hours
24 hours
```

The 2026 homepage additionally advertises promoted renewal intervals such as:

```text
1h
2h
4h
8h
16h
24h
```

The exact commercial options may change over time, but the architectural fact is stable:

> Listings can purchase repeated resurfacing.

Therefore a source ordering such as:

```text
"recent"
"latest"
"top"
```

cannot be trusted as chronological evidence without additional metadata.

---

## 5. New Discovery — PD-065

### Commercial Resurfacing ≠ Freshness

A listing can move upward because it was renewed or promoted, not because the item was newly listed.

Recommended Phoenix model:

```text
ListingVisibilityEvidence {
  first_seen_at
  source_published_at
  source_last_seen_at
  source_renewed_at
  promotion_active
  renewal_interval
  visibility_reason
}
```

Possible `visibility_reason` values:

```text
new_listing
manual_renewal
automatic_renewal
paid_promotion
organic_ranking
unknown
```

Phoenix ranking must avoid interpreting commercial resurfacing as new inventory.

---

## 6. New Discovery — PD-066

### Source Position Is Not Source Relevance

Anuncios.es offers paid products that can keep a listing:

- highlighted above non-highlighted listings;
- fixed in first position for a period;
- repeatedly renewed.

Therefore:

```text
source_position != organic_relevance
```

Recommended contract:

```text
SourceRankingEvidence {
  source_position
  promotion_detected
  promotion_type
  ranking_basis_known
  observed_at
}
```

Phoenix should calculate its own independent Decision Score.

This materially strengthens **PD-014 Promotion Provenance**.

---

## 7. New Discovery — PD-067

### Marketplace Storefront Layer

Anuncios.es allows users to create a personal storefront inside the marketplace with:

- logo;
- description;
- links;
- photo gallery;
- grouped listings.

This suggests a seller can function as a mini-catalog inside a broader classifieds platform.

Recommended Phoenix model:

```text
SellerSurface {
  seller_id
  surface_type
  storefront_url
  listing_count
  professional_signals
  external_links
}
```

This can improve:

- seller entity resolution;
- duplicate detection;
- inventory-scale estimation;
- professional/private classification.

---

## 8. New Discovery — PD-068

### Contact-Channel Richness as Marketplace Capability

Listings may expose multiple contact paths:

```text
internal contact
telephone
WhatsApp
website
social link
map/location
```

Phoenix should model contact-channel capability without necessarily collecting personal contact data.

Recommended:

```text
ContactCapability {
  internal_message
  phone_available
  whatsapp_available
  external_site_available
  map_available
}
```

This is capability metadata, not permission to ingest or expose personal information.

It reinforces **PD-015 Personal-Data Minimization Layer**.

---

## 9. Trust and fraud model

Anuncios.es states that it attempts to review and keep the portal free of inappropriate, false or fraudulent ads but does not guarantee their absence.

It encourages users to report suspicious listings and provides anti-fraud guidance.

The Terms prohibit listings that:

- are false or misleading;
- impersonate people or companies;
- expose third-party data without consent;
- are duplicated;
- are published by robots/external software;
- are in the wrong category;
- place adult content outside the adult section;
- violate applicable law.

Phoenix should preserve these rules as **Source Quality Evidence**, not as a guarantee of listing trustworthiness.

---

## 10. Personal data and sensitive verticals

The site processes user data including email, phone, city and IP information.

Its Terms expressly state that third parties may not use portal data to send unsolicited advertising or store personal data without consent.

Phoenix therefore should apply:

```text
personal_contact_collection = disabled_by_default
sensitive_vertical_ingestion = disabled_by_default
adult_categories = isolated
```

The marketplace visibly includes adult/personals categories, reinforcing **PD-033 Sensitive Vertical Isolation**.

---

## 11. Intellectual property / access

The Terms state that website content is protected by Spanish intellectual-property law and that access does not grant a license for reproduction or distribution without prior express consent.

The Terms also prohibit users from publishing ads via robots or external software.

No open public search API or Phoenix-suitable public data feed was identified during this research.

Therefore:

```text
public_html = yes
official_open_search_api = not_identified
public_export_feed = not_identified
automated_reproduction_right = not_established
production_integration = authorization/legal review required
```

Phoenix should not infer automated reuse permission from public accessibility.

---

## 12. Content-license / syndication signal

When users publish an ad, the Terms grant Anuncios.es broad rights to use that ad, including reproduction, distribution, public communication and transformation.

This indicates that Anuncios.es has a broad internal content-exploitation license.

However, it does **not** automatically grant those same rights to Phoenix.

Phoenix must preserve the distinction:

```text
source_has_license_to_content != phoenix_has_license_to_content
```

This reinforces permission-aware provider architecture.

---

## 13. Pricing / identity signal

The 2026 homepage explains that publication is no longer entirely free and uses a minimal credit-based publication fee, citing user-identification/fraud-reduction requirements.

Current page text shows a very low per-listing credit price. Older 2026 indexed pages show a different amount, indicating that pricing changes over time.

Phoenix should therefore never hard-code marketplace prices from one observation.

Recommended evidence:

```text
CommercialPolicyEvidence {
  policy
  value
  currency
  observed_at
  source
}
```

---

## 14. Capability Impact

Anuncios.es adds or reinforces:

- `commercial_resurfacing_detection`
- `promotion_provenance`
- `source_position_bias`
- `renewal_aware_freshness`
- `seller_storefront_surface`
- `seller_inventory_scale`
- `contact_capability_mapper`
- `personal_data_minimization`
- `sensitive_vertical_gate`
- `source_quality_evidence`
- `commercial_policy_evidence`

---

## 15. Reusable DevKit components

Recommended:

1. `CommercialResurfacingDetector`
2. `ListingVisibilityEvidenceMapper`
3. `SourceRankingEvidenceMapper`
4. `PromotionProvenanceMapper`
5. `RenewalAwareFreshnessMapper`
6. `SellerStorefrontResolver`
7. `SellerInventoryScaleEstimator`
8. `ContactCapabilityMapper`
9. `SensitiveVerticalGate`
10. `CommercialPolicyEvidenceRegistry`

---

## 16. AI Opportunities

AI can help with:

- identifying likely promoted/resurfaced listings;
- distinguishing genuinely new inventory from renewed inventory;
- estimating original listing age;
- clustering a seller's storefront inventory;
- detecting duplicate ads;
- detecting suspicious/fraud-like text;
- normalizing very broad categories;
- identifying seller professionalism signals;
- separating organic relevance from paid visibility.

---

## 17. Strategic Scoring

| Dimension | Score |
|---|---:|
| Spain relevance | 76 |
| Inventory breadth | 85 |
| Architecture learning | 94 |
| Freshness/ranking intelligence | 98 |
| Trust intelligence | 76 |
| Direct API readiness | 25 |
| Permission clarity for Phoenix | 40 |
| Decision Engine value | 92 |
| Provider priority | 60 |

**Indicative Strategic Score: 79 / 100**

---

## 18. Final Decision

### GO CONDIZIONATO — AUTHORIZATION/PARTNERSHIP PREFERRED

Anuncios.es is strategically useful, especially as a laboratory for ranking and freshness intelligence.

It should not be a first-wave Phoenix provider ahead of major Spanish sources.

The primary value is architectural:

> A marketplace can sell recency-like visibility.

Therefore Phoenix must never equate:

```text
source_top_position
source_recent_position
```

with:

```text
newest_listing
best_listing
highest_decision_value
```

Phoenix must rank independently from the marketplace's commercial ranking system.

---

## 19. Canonical Discoveries

- **PD-065 — Commercial Resurfacing ≠ Freshness**
- **PD-066 — Source Position Is Not Source Relevance**
- **PD-067 — Marketplace Storefront Layer**
- **PD-068 — Contact-Channel Richness as Marketplace Capability**

Reinforced:

- PD-014 Promotion Provenance
- PD-015 Personal-Data Minimization Layer
- PD-033 Sensitive Vertical Isolation
- PD-054 Renewal-Aware Freshness

---

## 20. Sources

Current web research performed 2026-08-01:

- https://anuncios.es/
- https://anuncios.es/condiciones-de-uso-6
- https://anuncios.es/servicios/
- current 2026 category and listing pages indexed under anuncios.es

Phoenix tracker evidence:

- PHOENIX_ATLAS_PROVIDER_TRACKER_UPDATED_011.csv
- marketplaces_europe.csv

This dossier is a strategic and technical assessment, not legal advice.
