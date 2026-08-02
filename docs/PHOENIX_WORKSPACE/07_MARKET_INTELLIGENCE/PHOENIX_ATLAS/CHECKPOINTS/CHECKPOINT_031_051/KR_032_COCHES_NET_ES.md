# PHOENIX ATLAS — KNOWLEDGE RECORD 032

## Coches.net — Spain

- Tracker ID: 32
- Country: Spain
- Vertical: Automotive
- Canonical domain: https://www.coches.net/
- Operator: Adevinta Motor, S.L.U.
- Corporate family signal: Adevinta
- Lifecycle: ACTIVE
- Research date: 2026-08-01
- Decision: GO STRATEGICO — permissioned/commercial integration only
- Integration priority: VERY HIGH for Automotive Capability Pack
- Indicative Strategic Score: 95 / 100

## Executive Summary

Coches.net is a mature Spanish automotive marketplace and professional tooling ecosystem operated by Adevinta Motor, S.L.U.

Its current product surface goes substantially beyond listing search. It includes:

- used/new/KM0 vehicle inventory;
- professional dealer surfaces;
- structured automotive filters;
- market-price labeling;
- free vehicle valuation;
- verified dealer reviews;
- financing-related workflows;
- online vehicle reservation;
- professional inventory/customer management tools;
- AI-generated content on selected sections;
- explicit ranking transparency.

For Phoenix, Coches.net is valuable both as an inventory provider candidate and as a benchmark for an Automotive Decision Intelligence layer.

The current Terms contain explicit restrictions against extraction using robots, scraping, data mining or equivalent techniques in portal usage contexts. Production automated collection should therefore remain disabled unless an authorized commercial/API/feed route is obtained.

---

## 1. Current scale and inventory evidence

The current used-car surface states that hundreds of thousands of vehicles are available.

At research time, the public second-hand page exposed approximately:

- 248k available vehicles;
- more than 143k professional-seller listings;
- a large majority of professional vehicles carrying at least a one-year warranty;
- current market averages for price, mileage and model year.

These figures are point-in-time source evidence and must not be treated as permanent statistics.

Coches.net's valuation page states that more than 600,000 vehicles are advertised annually in its database and that comparable vehicles are used to calculate an average market value after excluding out-of-market prices.

---

## 2. Automotive vertical richness

Coches.net demonstrates that the Phoenix AutomotiveCapabilityPack should support substantially richer structured data than a generic FinderResult.

Recommended fields/capabilities:

```text
make
model
version
body_type
fuel
transmission
registration_year
mileage
engine_power
engine_displacement
price_cash
price_financed
monthly_payment
vehicle_condition
new_km0_used
warranty
professional_seller
dealer
location
market_price_label
reservation_available
financing_available
vehicle_history_available
seller_reviews
```

---

## 3. PD-089 — Source-Native Decision Labels Are Derived Evidence

Coches.net exposes price-quality labels such as:

```text
Super precio
Buen precio
Precio justo
```

These are not raw listing attributes.

They are **derived judgments produced by the source**.

Phoenix should model:

```text
DerivedDecisionEvidence {
  source
  evidence_type
  label
  methodology_known
  inputs_known
  observed_at
}
```

Examples:
- source_price_assessment;
- source_value_label;
- source_recommendation;
- source_risk_label.

Strategic rule:

> Phoenix may use a marketplace's decision label as evidence, but must not silently convert it into Phoenix's own conclusion.

This creates explainability and protects Decision Engine independence.

---

## 4. PD-090 — Transaction Capability Is a Ladder, Not a Boolean

Coches.net supports an online vehicle reservation service for selected dealer listings.

Current terms describe a refundable 99€ reservation that temporarily blocks the vehicle for two business days. The eventual vehicle purchase remains a separate contract directly between buyer and dealer.

Therefore:

```text
handles_transaction = false
```

is too simplistic.

Recommended capability ladder:

```text
TransactionCapability {
  discovery
  contact
  financing_request
  reservation
  payment_intermediation
  purchase_contract
  fulfillment
}
```

A marketplace can participate deeply in the funnel without becoming the seller or contracting party.

This strengthens Phoenix's earlier Search/Transaction Separation pattern.

---

## 5. PD-091 — Reputation Should Be Dimensional

Coches.net dealer pages expose verified reviews and review dimensions including signals such as:

- friendliness;
- accuracy of listings;
- expert advice;
- professionalism;
- dealer reputation;
- response speed.

A single 4.3/5 score loses important information.

Recommended Phoenix model:

```text
SellerReputationEvidence {
  source
  overall_rating
  review_count
  dimensions {
    listing_accuracy
    responsiveness
    professionalism
    expertise
    friendliness
    reputation
  }
  verified_review_signal
  observed_at
}
```

This can materially improve seller comparison and explainable trust scoring.

---

## 6. PD-092 — AI-Generated Source Content Needs Provenance

Coches.net's current Terms state that certain sections/services may contain content generated with AI and that such content is labeled.

The Terms identify Amazon Bedrock as the model-service platform and explicitly warn that generated content may be inaccurate, biased or subjective and should not be the sole basis for purchase decisions.

Phoenix therefore needs:

```text
ContentProvenance {
  source
  generated_by_ai
  ai_provider
  human_review_status
  source_disclaimer
  observed_at
}
```

Strategic implication:

> AI-generated marketplace text is not equivalent to source-verified factual data.

Phoenix should preserve this distinction before using source text in its own reasoning.

---

## 7. PD-093 — Valuation Methodology Is Decision Evidence

Coches.net describes a vehicle-valuation methodology based on:

1. its vehicle database;
2. finding similar vehicles;
3. excluding out-of-market sale prices;
4. calculating an average sale price from remaining comparables.

This is valuable because Phoenix can preserve not only a valuation output, but also **how the valuation was produced**.

Recommended:

```text
ValuationEvidence {
  source
  estimated_value
  methodology
  comparable_population
  outlier_handling
  geography
  observed_at
}
```

Different providers may produce different valuations from different datasets.

Phoenix should compare valuation evidence rather than assume one source is canonical.

---

## 8. Ranking transparency

Current Coches.net Terms document principal ranking factors including:

- match to user search/filter criteria;
- publication or renewal date;
- paid prominence;
- information quality/completeness.

The Terms explicitly state that paid products can improve positioning and that information quality can also affect ranking.

This strongly reinforces:

- PD-014 Promotion Provenance;
- PD-054 Renewal-Aware Freshness;
- PD-066 Source Position Is Not Source Relevance;
- PD-088 Source Relevance Ranking Can Encode Quality Signals.

Phoenix should preserve:

```text
SourceRankingMethod {
  query_match
  publication_or_renewal
  paid_visibility
  listing_quality
}
```

but compute an independent Decision Score.

---

## 9. Dealer/professional ecosystem

Coches.net requires professional sellers/dealers above specified selling thresholds to use professional accounts.

Its PRO environment includes tools for managing:

- vehicle inventory;
- advertisements;
- customer leads/contacts;
- professional publishing.

This is another strong signal that the source has structured B2B inventory pipelines, even though no open Phoenix-suitable export/search API was identified in this research.

Recommended partnership inquiry should explicitly ask about:
- dealer feed formats;
- inventory export;
- partner APIs;
- licensed search access;
- delta/update feeds;
- vehicle identifiers;
- dealer identifiers.

---

## 10. Vehicle history / risk intelligence

Coches.net has longstanding integration/content around vehicle-history data such as CARFAX and Spanish vehicle reports.

Potential evidence classes include:

```text
VehicleHistoryEvidence {
  mileage_consistency
  stolen_signal
  import_export
  prior_use
  administrative_encumbrance
  inspection_history
  ownership_history
}
```

Phoenix should not reproduce third-party history data without appropriate rights, but should recognize **vehicle-history availability** as a provider capability.

---

## 11. Access and compliance

Current Conditions identify Adevinta Motor, S.L.U. as portal owner/operator.

The Terms contain explicit prohibition language regarding content extraction via robots, scraping, data mining or similar techniques in portal usage rules, alongside intellectual-property and database protections.

Therefore Phoenix posture:

```text
public_html = yes
official_public_search_api = not_identified
public_export_feed = not_identified
professional_platform = verified
structured_professional_infrastructure = verified
unauthorized_automated_collection = NO-GO
preferred_route = commercial / partner / authorized feed or API
```

A technical ability to parse public pages does not create permission to operate a production provider.

---

## 12. Adevinta corporate-family implication

The Terms contain explicit references to publication across other Adevinta-group portals.

Phoenix should therefore treat Coches.net as part of a broader corporate/provider-family graph rather than an isolated domain.

This does not imply that all Adevinta marketplaces share inventory or identifiers.

Recommended:

```text
CorporateGroup
  ↓
BusinessUnit
  ↓
MarketplaceSurface
```

with explicit evidence for each cross-publication or shared capability.

---

## 13. Automotive Decision Engine opportunity

Coches.net reveals a useful future Phoenix flow:

```text
Vehicle Listing
      ↓
Normalization
      ↓
Market Price Evidence
      +
Seller Reputation
      +
Warranty
      +
Vehicle History Capability
      +
Professional/Private Seller
      +
Reservation/Financing Capability
      ↓
Phoenix Automotive Decision Score
```

This is much more valuable than simply sorting by price.

---

## 14. Capability Impact

- automotive_vertical_pack
- source_native_decision_evidence
- transaction_capability_ladder
- dimensional_seller_reputation
- ai_content_provenance
- valuation_methodology_evidence
- source_ranking_method
- professional_inventory_channel
- vehicle_history_capability
- corporate_provider_family

---

## 15. Reusable DevKit Components

1. `AutomotiveCapabilityPack`
2. `DerivedDecisionEvidenceMapper`
3. `TransactionCapabilityMapper`
4. `SellerReputationDimensionMapper`
5. `AIContentProvenanceMapper`
6. `ValuationEvidenceMapper`
7. `SourceRankingMethodMapper`
8. `ProfessionalInventoryCapabilityRegistry`
9. `VehicleHistoryCapabilityMapper`
10. `CorporateProviderFamilyRegistry`

---

## 16. Strategic Score

| Dimension | Score |
|---|---:|
| Spain automotive relevance | 100 |
| Inventory value | 98 |
| Automotive data richness | 100 |
| Seller trust intelligence | 96 |
| Valuation/decision intelligence | 98 |
| Transaction capability learning | 97 |
| Architecture learning | 99 |
| Public API readiness | 30 |
| Partnership strategic value | 96 |
| Unauthorized scraping suitability | 0 |

**Indicative Strategic Score: 95 / 100**

---

## 17. Final Decision

### GO STRATEGICO — PERMISSIONED/COMMERCIAL INTEGRATION ONLY

Coches.net should be classified as:

- top-tier Spanish automotive provider candidate;
- benchmark for Phoenix AutomotiveCapabilityPack;
- source of market-price and valuation evidence;
- trust/reputation benchmark;
- transaction-funnel benchmark;
- high-value partnership target;
- NO-GO for unauthorized production scraping.

Most important conclusion:

> Automotive search becomes decision intelligence only when Phoenix can separate raw vehicle facts from source-derived price judgments, seller trust evidence, history signals and transaction capabilities.

Phoenix should ingest those layers independently and preserve their provenance.

---

## 18. Canonical Discoveries

- **PD-089 — Source-Native Decision Labels Are Derived Evidence**
- **PD-090 — Transaction Capability Is a Ladder, Not a Boolean**
- **PD-091 — Reputation Should Be Dimensional**
- **PD-092 — AI-Generated Source Content Needs Provenance**
- **PD-093 — Valuation Methodology Is Decision Evidence**

Reinforced:

- PD-014 Promotion Provenance
- PD-054 Renewal-Aware Freshness
- PD-056 Trust Evidence, Not Trust Score
- PD-066 Source Position Is Not Source Relevance
- PD-088 Source Relevance Ranking Can Encode Quality Signals

---

## 19. Sources

Phoenix source:
- PHOENIX_ATLAS_PROVIDER_TRACKER.csv — Tracker ID 32
- KR_031_YAENCONTRE_ES.md — Discovery continuity through PD-088

Current official/current web research, 2026-08-01:
- https://www.coches.net/condiciones-de-uso/
- https://www.coches.net/segunda-mano/
- https://www.coches.net/tasacion-de-coches/
- https://pro.coches.net/
- https://ayuda.coches.net/
- https://www.coches.net/condiciones-de-uso-reserva
- current Coches.net dealer/review pages

This is a strategic/technical assessment, not legal advice.
