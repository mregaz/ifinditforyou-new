# PHOENIX ATLAS — KNOWLEDGE RECORD 037

## markt.de — Germany

- Tracker ID: 37
- Country: Germany
- Vertical: Horizontal classifieds / local commerce
- Canonical domain: https://www.markt.de/
- Lifecycle: ACTIVE
- Research date: 2026-08-01
- Decision: GO STRATEGICO CONDIZIONATO — written authorization required
- Integration priority: HIGH
- Indicative Strategic Score: 89 / 100

## Executive Summary

markt.de is an active German horizontal-classifieds platform with broad local inventory. A current 2026 company recruitment document describes it as the central consumer portal in a network connecting online classifieds with more than 150 regional daily newspapers, with more than 2 million offers daily and 6 million users per month.

markt.de is primarily a discovery/contact layer rather than a native payment platform. Its safety guidance explicitly states that it has no own payment system.

Its current Terms explicitly prohibit automated collection using crawlers, spiders or scrapers without express written permission.

## PD-114 — Distribution Network Can Extend Beyond Marketplace Inventory

markt.de's regional-publisher ecosystem means marketplace reach can extend beyond its canonical domain.

Recommended evidence:

```text
DistributionNetworkEvidence {
  marketplace
  network
  partner_surface_type
  distribution_scope
  inventory_relationship_known
}
```

Phoenix should distinguish inventory origin, discovery surface and distribution surface.

## PD-115 — Verification Is Multi-Dimensional and Sparse

Current member/listing surfaces expose separate states such as age, phone and bank-detail verification, plus membership age.

Recommended:

```text
IdentityVerificationEvidence {
  age_verified
  phone_verified
  bank_verified
  business_status
  member_since
}
```

Do not collapse these into `verified_seller=true`.

## PD-116 — Marketplace May Deliberately Remain Outside Payment Flow

markt.de states that it does not operate its own payment system. Buyer and seller determine payment; the platform recommends safer practices such as personal pickup or trusted external payment systems with buyer protection.

Recommended:

```text
PaymentCapability {
  marketplace_payment
  external_payment
  buyer_protection_native
  buyer_protection_external
}
```

This is a transaction model, not merely a missing feature.

## PD-117 — Promotion Mechanics Can Mutate Freshness

markt.de documents paid Top Ads and PushUp products. Top Ads occupy paid positions above ordinary results. PushUp moves an advertisement to the top and sets its displayed date to the current time.

Therefore:

```text
source_displayed_date != original_publication_date
```

for PushUp listings.

Recommended:

```text
PromotionFreshnessPolicy {
  promotion_type
  changes_position
  mutates_displayed_date
  rotation_behavior
}
```

This directly contrasts with Kleinanzeigen Top Ad, which does not alter original listing age.

## PD-118 — AI Provenance Can Be a Marketplace Policy Requirement

Current markt.de Terms require AI-created or AI-modified content to be clearly labeled and prohibit unlabeled AI content and deepfakes.

Recommended:

```text
AIContentDisclosureEvidence {
  disclosure_required
  disclosure_present
  ai_modified
  ai_generated
  deepfake_prohibited
}
```

Source disclosure is evidence, although absence of a label cannot prove absence of AI use.

## Additional architecture evidence

- Internal mailbox communication protects contact details during initial interaction.
- Current Terms generally require listing locations in Germany or Switzerland, with stated exceptions.
- Sensitive personals/adult categories exist and should remain disabled by default in standard Phoenix ingestion.
- Current job surfaces contain `Partner-Anzeige` labels, suggesting partner-origin inventory; the exact technical feed mechanism was not established.

## Access / compliance

Current Terms explicitly prohibit automated reading/collection using crawlers, spiders or scrapers without express written permission and prohibit bypassing technical access restrictions.

```text
public_html = yes
public_general_search_api = not_identified
public_export_feed = not_identified
partner_inventory_signals = yes
unauthorized_scraping = EXPLICIT NO-GO
preferred_route = written authorization / partnership
```

## Partnership questions

1. Is there a licensed search/catalog feed?
2. How are Partner-Anzeige listings ingested?
3. Can the regional publisher network expose a common feed?
4. Are deletion/update deltas available?
5. Can original publication time be separated from PushUp time?
6. Can verification dimensions be exposed?
7. Are sensitive categories separable?
8. What caching/deep-link/display rules apply?

## Reusable DevKit Components

1. `DistributionNetworkEvidenceMapper`
2. `IdentityVerificationEvidenceMapper`
3. `PaymentCapabilityMapper`
4. `PromotionFreshnessPolicyMapper`
5. `AIContentDisclosureEvidenceMapper`
6. `PartnerOriginProvenanceMapper`
7. `MarketplaceGeographyPolicyMapper`
8. `SensitiveVerticalGate`
9. `MarketplaceAccessPolicyGate`

## Strategic Score

| Dimension | Score |
|---|---:|
| Germany relevance | 94 |
| Inventory breadth | 94 |
| Local/regional reach | 98 |
| Architecture learning | 98 |
| Trust evidence richness | 93 |
| Promotion/freshness intelligence | 100 |
| Distribution-network intelligence | 97 |
| Public API readiness | 20 |
| Partnership potential | 88 |
| Unauthorized scraping suitability | 0 |
| Decision Engine value | 89 |

**Indicative Strategic Score: 89 / 100**

## Final Decision

GO STRATEGICO CONDIZIONATO — WRITTEN AUTHORIZATION REQUIRED.

Most important conclusion:

> Phoenix cannot interpret a marketplace listing's displayed date, verification status, payment safety or distribution surface without understanding the marketplace-specific policy that produced those signals.

## Canonical Discoveries

- PD-114 — Distribution Network Can Extend Beyond Marketplace Inventory
- PD-115 — Verification Is Multi-Dimensional and Sparse
- PD-116 — Marketplace May Deliberately Remain Outside Payment Flow
- PD-117 — Promotion Mechanics Can Mutate Freshness
- PD-118 — AI Provenance Can Be a Marketplace Policy Requirement

Reinforced:
- PD-056 Trust Evidence, Not Trust Score
- PD-057 Mixed-Origin Marketplace
- PD-065 Commercial Resurfacing ≠ Freshness
- PD-090 Transaction Capability Is a Ladder, Not a Boolean
- PD-091 Reputation Should Be Dimensional
- PD-092 AI-Generated Source Content Needs Provenance
- PD-111 Ranking Promotion Can Preserve Original Listing Age
- PD-112 Marketplace AI Can Generate Structured Listing Inputs

## Sources

Current research, 2026-08-01:
- https://www.markt.de/nutzungsbedingungen.htm
- https://www.markt.de/ratgeber/haus-garten/sicherheitshinweise/
- https://www.markt.de/kleidung-verkaufen.htm
- https://www.markt.de/ratgeber/haus-garten/zusatzoptionen/
- current markt.de listing/member pages
- 2026 markt.de recruitment/company document describing scale and regional publisher network

Phoenix continuity:
- Tracker 37 follows Tracker 36 Kleinanzeigen.de.
- KR_036_KLEINANZEIGEN_DE.md ended at PD-113.

This is a strategic/technical assessment, not legal advice.
