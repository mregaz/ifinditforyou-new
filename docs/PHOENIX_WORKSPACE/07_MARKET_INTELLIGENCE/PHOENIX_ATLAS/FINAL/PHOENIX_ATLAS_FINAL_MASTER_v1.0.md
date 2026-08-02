# PHOENIX ATLAS — FINAL MASTER v1.0

**Status:** COMPLETE / LIVING INTELLIGENCE ASSET  
**Finalization date:** 2026-08-02  
**Canonical tracker scope:** 61 marketplace/provider entries  
**Discovery frontier:** PD-260

## 1. Mission

Phoenix Atlas began as marketplace research and evolved into a structured intelligence system for deciding:

- what a provider is;
- whether it still exists;
- how Phoenix may access it;
- which corporate/provider family it belongs to;
- which vertical capabilities it exposes;
- what trust/protection evidence exists;
- how listings and transactions should be interpreted;
- what can be reused in Phoenix DevKit;
- whether the provider should be integrated, partnered with, licensed, monitored or retained only historically.

## 2. Canonical Architecture

```text
Marketplace Identity
        ↓
Lifecycle
        ↓
Access / Compliance
        ↓
Provider Family / Corporate Group
        ↓
Marketplace Surface
        ↓
Data Model / Vertical Capability Pack
        ↓
Ranking / Promotion Provenance
        ↓
Trust / Protection / Authentication
        ↓
Transaction / Fulfilment / Returns
        ↓
Provenance / Deduplication
        ↓
Economics / Total Acquisition Cost
        ↓
Knowledge
        ↓
Phoenix Decision Intelligence
```

## 3. Completion State

The canonical 61-source tracker is resolved end-to-end.

- Tracker 1–2: archived/evidenced research
- Tracker 3–9: Gap Repair resolved
- Tracker 10–22: archived/evidenced research, with Mitula standalone consolidation added
- Tracker 23–30: completed checkpoint
- Tracker 31–51: completed checkpoint
- Tracker 52–61: completed checkpoint
- Tracker 61 Videdressing: historical/closed provider retained in Atlas

## 4. Core Architectural Themes Established

### Provider governance
- Permissioned provider architecture
- Access matrices
- Commercial surface vs data surface
- Official API/feed/partnership preference
- Provider lifecycle and deprecation

### Provider families
- Cross-country provider families
- Corporate capability graphs
- Family-level integration
- Marketplace-surface identity
- Competitor families

### Listing intelligence
- Universal listing envelope
- Vertical capability packs
- Listing freshness vs republishing
- Paid promotion provenance
- Source ranking provenance
- Seller context

### Trust intelligence
- Trust Evidence, Not Trust Score
- Marketplace protection eligibility
- Authentication eligibility
- Verification fulfilment paths
- Reputation provenance
- Seller legal context

### Transaction intelligence
- Search vs transaction separation
- Payment-release states
- Return-path evidence
- Cross-border transaction context
- Buyer acquisition cost
- Seller net proceeds

### Property intelligence
- Asking price vs transaction price
- AVM / comparable evidence
- Valuation confidence/ranges
- Persistent property identity
- Geographic precision
- Risk and energy evidence

### Automotive intelligence
- Vehicle-history evidence
- Valuation context
- Condition/specification adjustments
- Specialist-community evidence
- Compatibility evidence

### Lifecycle intelligence
- Active / acquired / migrating / transaction-disabled / closed / absorbed
- Capability migration
- Historical-provider preservation

## 5. DevKit Impact

Atlas should feed reusable DevKit primitives rather than one-off provider code.

Priority reusable concepts include:

- ProviderLifecycleRegistry
- ProviderFamilyRegistry
- CorporateCapabilityGraph
- ProviderAccessSurfaceRegistry
- ProviderAccessMatrix
- MarketplaceSurfaceRegistry
- UniversalListingEnvelope
- VerticalCapabilityPack
- RankingEvidence
- PromotionProvenance
- SellerContext
- TrustEvidence
- AuthenticationEligibilityEvidence
- FulfilmentTrustPath
- ReturnPathEvidence
- SourceProvenanceChain
- Deduplication / Entity Resolution
- TotalAcquisitionCost
- SellerNetProceeds
- PropertyValuationEvidence
- VehicleHistoryEvidence

## 6. Integration Doctrine

Phoenix must not equate research completion with permission to integrate.

Preferred order:

```text
Official API
    ↓
Official feed
    ↓
Licensed data access
    ↓
Partnership
    ↓
Explicitly authorized interface
    ↓
No integration
```

Consumer-site scraping is not the default architecture.

## 7. Identifier Constitution

Never conflate:

```text
Tracker ID
Research Record ID
Discovery ID
```

These are independent identifiers with independent lifecycles.

## 8. Atlas v1.0 Declaration

### PHOENIX ATLAS v1.0 IS COMPLETE.

“Complete” means the original 61-source research catalog has a resolved state and the known historical gaps have been reconciled.

Atlas now changes mode:

```text
RESEARCH CAMPAIGN
        ↓
INTELLIGENCE ASSET
        ↓
ARCHITECTURE INPUT
        ↓
PROVIDER STRATEGY
        ↓
PHOENIX DECISION ENGINE
```

## 9. Next Strategic Phase

The next phase should not be another indiscriminate marketplace list.

Recommended sequence:

1. Extract Atlas architecture requirements into Phoenix DevKit.
2. Rank providers by implementation/business value.
3. Select a small authorized Provider Portfolio for Release 1.0.
4. Create ADRs for Provider Family, Access Matrix, Trust Evidence and Provenance.
5. Establish periodic Atlas lifecycle revalidation.
6. Use Atlas findings to guide Ranking Engine and Decision Engine design.

## 10. Final Principle

> Phoenix Atlas is not a list of websites. It is the knowledge layer that tells Phoenix what a source means, what can be trusted, what can be accessed, how evidence must be interpreted, and whether integration creates real user value.
