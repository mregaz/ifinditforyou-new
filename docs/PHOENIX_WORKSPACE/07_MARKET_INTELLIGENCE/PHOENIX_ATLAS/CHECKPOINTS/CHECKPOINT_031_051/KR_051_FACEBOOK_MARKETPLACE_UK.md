# PHOENIX ATLAS — KNOWLEDGE RECORD 051

## Facebook Marketplace — United Kingdom

- Tracker ID: 51
- Country: United Kingdom
- Vertical: Social marketplace / recommerce / vehicles / general goods
- Canonical surface: Facebook Marketplace
- Provider family: Meta / Facebook
- Lifecycle: ACTIVE
- Research date: 2026-08-02
- Decision: GO STRATEGICO — official permission/integration only
- Integration priority: VERY HIGH
- Indicative Strategic Score: 98 / 100
- Discovery continuity: PD-187 → PD-193

## Executive Summary

Facebook Marketplace is one of the world's largest marketplace surfaces and is deeply embedded in Facebook's identity, messaging and social graph.

Meta states in July 2026 that Marketplace turns ten this year and that globally around 430 million items and 44 million vehicles are listed each month.

Meta is also expanding seller tooling through the new Seller app, AI-assisted listing creation, inventory management, unified inbox and performance analytics, while Facebook Verified adds selfie-based identity verification that can appear on Marketplace profiles.

The most important integration fact for Phoenix is access policy: Meta's Automated Data Collection Terms explicitly prohibit automated data collection from Meta Company Products without prior express written permission.

Meta also operates a formal Facebook Marketplace Integration program for eligible online-classifieds partners in the European Economic Area. That program proves that an official feed/API-like integration path exists in Meta's architecture, including listing catalogs, freshness requirements and click-through to partner marketplaces.

However, the verified Integration Terms are specifically scoped to the EEA. The United Kingdom is not automatically covered by those terms after Brexit. Phoenix must therefore not assume that an EEA partner integration grants UK Marketplace access.

For Phoenix UK, the correct route is direct authorization / commercial integration discussion with Meta.

## Current scale and product evolution

Meta's July 2026 product material reports globally:
- approximately 430 million items listed per month;
- approximately 44 million vehicles listed per month.

Meta also states that Marketplace began from Facebook Groups and now supports local goods, vehicles, fashion, electronics and other categories.

Current seller tooling includes:
- AI-assisted listing creation;
- inventory management;
- unified buyer-message inbox;
- performance metrics;
- sold-listing insights;
- price suggestions;
- category suggestions.

These figures and features are global/product-level evidence and must not be treated as UK-specific counts unless Meta publishes a UK breakdown.

## PD-187 — Social Identity Is Marketplace Evidence

Facebook Marketplace listings are attached to Facebook identities rather than isolated marketplace-only seller accounts.

With Facebook Verified, eligible users can complete selfie-based identity verification and display a verified badge across Marketplace and other Facebook surfaces.

Recommended:

```text
SocialIdentityEvidence {
  platform_identity
  profile_age
  identity_verified
  verification_method
  social_surface
  marketplace_profile
}
```

Important:

Meta explicitly says the Facebook Verified badge means a real person completed verification, not that Meta endorses that person or guarantees trustworthiness.

Therefore:
`identity_verified != trustworthy_seller`.

## PD-188 — Marketplace Reputation May Not Be Transaction-Verified

Facebook's current Help Centre states that seller ratings can become publicly visible after enough eligible ratings, but Meta does **not verify that reviewers actually purchased the product or used the service**.

Recommended:

```text
ReputationEvidence {
  source
  rating
  rating_count
  transaction_verified
  visibility_threshold
}
```

For Facebook Marketplace:

```text
transaction_verified = false / not guaranteed
```

This is a major trust-quality distinction.

## PD-189 — Marketplace Inventory Can Mix Native and Partner Listings

Meta has introduced third-party marketplace inventory into Facebook Marketplace.

Current Meta product material describes partner listings from marketplaces such as eBay and Poshmark in supported rollouts, where partner inventory appears inside Marketplace and buyers are redirected to the partner site for checkout.

The EEA Marketplace Partner Program similarly allows eligible classifieds partners to send their C2C listings to Facebook Marketplace.

Recommended:

```text
ListingOrigin {
  native_user_listing
  partner_listing
  partner_marketplace
  checkout_destination
}
```

A Facebook Marketplace result is therefore not necessarily inventory originating on Facebook.

This strongly reinforces Mixed-Origin Marketplace provenance.

## PD-190 — Integration Geography Is a Contractual Capability

Meta's verified Marketplace Integration Terms are explicitly scoped to the European Economic Area.

Therefore:

```text
technical_integration_exists = true
```

does not imply:

```text
integration_available_in_UK = true
```

Recommended:

```text
IntegrationGeography {
  provider
  program
  eligible_regions[]
  eligible_countries[]
  contractual_scope
  observed_at
}
```

Geographic availability must be modeled as part of access rights, not inferred from technical capability.

## PD-191 — Partner Integration Can Have Freshness SLAs

Meta's Marketplace Integration Terms require partners to provide listing catalogs and meet service-level/freshness requirements.

Recommended:

```text
PartnerFeedSLA {
  provider
  refresh_requirement
  deletion_requirement
  freshness_standard
  suspension_policy
}
```

This is strategically important for Phoenix:

> Authorized marketplace integrations can impose contractual freshness quality, not merely technical refresh schedules.

Phoenix's future partner layer should therefore support SLA compliance monitoring.

## PD-192 — AI Can Become the Seller's Listing Author

Meta's 2026 Seller app and Marketplace AI tooling can generate or suggest:
- title;
- description;
- price;
- category;
from listing photos and seller inputs.

Recommended:

```text
ListingFieldProvenance {
  field
  seller_entered
  ai_generated
  ai_suggested
  seller_confirmed
}
```

This extends prior AI-content discoveries: AI can now influence price and categorization, not only descriptive prose.

Phoenix should preserve uncertainty when source fields may themselves be AI-derived.

## PD-193 — Social Interaction Is Shopping Evidence

Meta is increasingly adding social interaction directly to Marketplace:
- collections;
- collaborative shopping;
- comments;
- reactions;
- Messenger/WhatsApp sharing;
- friend-assisted seller chats.

Recommended:

```text
SocialCommerceEvidence {
  reaction_count
  comment_signal
  collection_membership
  collaborative_buying
  social_share_context
}
```

These signals may help discovery but must not automatically become quality/trust signals.

Popularity, virality and purchase quality are different concepts.

## Automated access / scraping policy

Meta's Automated Data Collection Terms explicitly state that automated data collection cannot be performed without Meta's express written permission.

The definition expressly includes:
- web scrapers;
- bots;
- robots;
- spiders;
- crawlers;
- automated/programmatic mechanisms.

Therefore:

```text
public_surface = YES
unauthorized_automated_collection = EXPLICIT NO-GO
production_scraping = DISABLED
preferred_route = Meta-authorized integration / API / commercial agreement
```

Phoenix must not attempt to bypass login, anti-bot, rate-limiting or other technical restrictions.

## Partner integration architecture

The verified EEA Marketplace Integration Terms show that Meta's partner architecture can include:
- partner listing catalog;
- listing content feed;
- eligibility rules;
- freshness/service-level standards;
- APIs/SDKs/technology;
- click-through to partner marketplace;
- partner-controlled checkout;
- CPC integration fees.

This is highly relevant to Phoenix strategically even though the verified contract scope is EEA, not automatically UK.

Potential Phoenix role:

```text
Phoenix marketplace
    ↓ listing catalog
Meta Marketplace integration
    ↓ discovery
Facebook user
    ↓ CTA
Phoenix
    ↓ checkout / source marketplace
```

This suggests Facebook Marketplace could one day be not only a provider **to** Phoenix but potentially a distribution channel **for** Phoenix inventory/results, depending on eligibility and product model.

## Trust and safety

Current Meta product/help evidence includes:
- Facebook Verified;
- Marketplace buyer/seller ratings;
- Commerce Policies;
- Community Standards;
- fraud/scam rules;
- profile-level identity context.

But Phoenix must preserve evidence semantics:
- identity verification proves identity matching, not honesty;
- ratings may not be transaction-verified;
- social popularity does not prove product quality.

## UK-specific caution

The current research does **not** establish:
- a UK-specific public Marketplace catalog API;
- UK eligibility for the EEA Marketplace Partner Program;
- bulk Phoenix access to UK Marketplace inventory;
- rights to redistribute Facebook Marketplace listing data.

Therefore UK provider activation must remain disabled until Meta gives explicit authorization.

## Reusable DevKit Components

1. `SocialIdentityEvidenceMapper`
2. `ReputationVerificationMapper`
3. `ListingOriginMapper`
4. `IntegrationGeographyRegistry`
5. `PartnerFeedSLAMonitor`
6. `ListingFieldProvenanceMapper`
7. `SocialCommerceEvidenceMapper`
8. `MarketplaceAccessPolicyGate`
9. `PartnerCatalogAdapter`
10. `DistributionChannelRegistry`

## Strategic Score

| Dimension | Score |
|---|---:|
| UK relevance | 100 |
| Global inventory scale | 100 |
| Social identity intelligence | 100 |
| Seller tooling maturity | 100 |
| AI listing intelligence | 100 |
| Partner integration evidence | 100 |
| UK API/access certainty | 35 |
| Trust evidence richness | 98 |
| Architecture learning | 100 |
| Partnership strategic value | 100 |
| Unauthorized scraping suitability | 0 |
| Decision Engine value | 97 |

**Indicative Strategic Score: 98 / 100**

## Final Decision

### GO STRATEGICO — META-AUTHORIZED INTEGRATION ONLY

Facebook Marketplace is a Tier-1 Phoenix strategic target, but absolutely not an unauthorized scraping target.

The strongest Phoenix opportunity may eventually be two-directional:

```text
Facebook Marketplace
        → Phoenix acquisition source (if authorized)

Phoenix
        → Facebook Marketplace distribution partner (if eligible)
```

The central conclusion is:

> Facebook Marketplace demonstrates that marketplace intelligence now includes identity, social context, AI-generated listing data, partner-origin inventory and contractual feed freshness — all of which Phoenix must preserve separately.

## Canonical Discoveries

- PD-187 — Social Identity Is Marketplace Evidence
- PD-188 — Marketplace Reputation May Not Be Transaction-Verified
- PD-189 — Marketplace Inventory Can Mix Native and Partner Listings
- PD-190 — Integration Geography Is a Contractual Capability
- PD-191 — Partner Integration Can Have Freshness SLAs
- PD-192 — AI Can Become the Seller's Listing Author
- PD-193 — Social Interaction Is Shopping Evidence

Reinforced:
- PD-056 — Trust Evidence, Not Trust Score
- PD-057 — Mixed-Origin Marketplace
- PD-061 — Partner Surface Directionality
- PD-092 — AI-Generated Source Content Needs Provenance
- PD-112 — Marketplace AI Can Generate Structured Listing Inputs
- PD-153 — Verification Badge Must Preserve Verification Method
- PD-169 — Group-Level Marketplace Syndication Can Create Hidden Duplicate Paths

## Sources

Canonical tracker:
- Phoenix Atlas tracker — ID 51 = Facebook Marketplace / UK / social marketplace.

Current official Meta research, 2026-08-02:
- Meta Newsroom, "Connecting Real People on Facebook", July 2026.
- Meta Newsroom, "Introducing Seller, an App for Facebook Marketplace Sellers", July 2026.
- Meta Newsroom, "Introducing Facebook Verified", July 2026.
- Meta Newsroom, "Facebook Marketplace Gets a Glow Up", November 2025.
- Meta Newsroom, Marketplace Partner Program / European Commission response updates, 2025.
- Facebook Automated Data Collection Terms.
- Facebook Marketplace Integration Terms of Service for the European Economic Area.
- Facebook Help Centre, Marketplace ratings.

Research limitations:
- Global Marketplace scale is not a UK-specific inventory count.
- EEA Marketplace Integration Terms do not automatically apply to the UK.
- No UK-specific public Phoenix catalog/search API was verified.

This is a strategic/technical assessment, not legal advice.
