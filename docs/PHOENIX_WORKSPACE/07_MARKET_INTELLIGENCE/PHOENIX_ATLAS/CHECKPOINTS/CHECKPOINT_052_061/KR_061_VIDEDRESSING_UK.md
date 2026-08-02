# PHOENIX ATLAS — KNOWLEDGE RECORD 061

## Videdressing — United Kingdom / historical marketplace record

- Tracker ID: 61
- Tracker classification: UK / Luxury Fashion
- Canonical historical domain: https://www.videdressing.com/
- Vertical: Second-hand fashion / luxury recommerce
- Lifecycle: CLOSED
- Closure date: 1 July 2023
- Research date: 2026-08-02
- Decision: NO-GO as provider; RETAIN as historical intelligence
- Integration priority: NONE
- Discovery continuity: PD-256 → PD-260

## Executive Summary

The canonical Phoenix tracker ends with Videdressing as Tracker 61.

Current research establishes that Videdressing is no longer an active marketplace. The French second-hand fashion/luxury platform was acquired by Leboncoin in 2018 and permanently closed on 1 July 2023. New listings and orders stopped earlier, on 12 April 2023, and users were directed toward Leboncoin.

Therefore Phoenix must not create a live provider integration for Videdressing.

However, Videdressing is strategically valuable as the final Atlas case because it demonstrates that provider lifecycle is a first-class architectural concern. A marketplace can be acquired, absorbed, stop accepting inventory, stop transactions, and ultimately disappear while its capabilities or user flows migrate into a successor platform.

## PD-256 — Provider Closure Is a First-Class Lifecycle State

Recommended:

ProviderLifecycle {
  ACTIVE
  ACQUIRED
  MIGRATING
  TRANSACTIONS_DISABLED
  CLOSED
  ABSORBED
}

Videdressing proves that `provider exists in tracker` does not imply `provider is currently operational`.

Every Phoenix provider should be revalidated before implementation and periodically afterward.

## PD-257 — Acquisition Does Not Guarantee Brand Survival

Leboncoin acquired Videdressing in 2018, initially describing the acquisition as a way to retain the brand/business model while gaining its transactional expertise.

The standalone marketplace nevertheless closed in 2023.

Recommended:

AcquisitionLifecycleEvidence {
  acquired_at
  acquirer
  initial_continuity_intent
  later_status
  brand_survives
}

Corporate acquisition and provider continuity are separate facts.

## PD-258 — Marketplace Capabilities Can Survive Provider Closure

At acquisition, Videdressing was valued partly for expertise in transaction, payment and delivery functionality. When the standalone service closed, users were directed toward Leboncoin and the marketplace was effectively absorbed.

Recommended:

CapabilityMigrationEvidence {
  source_provider
  destination_provider
  capability
  migration_confirmed
  user_redirect
  observed_at
}

Phoenix should preserve historical capability lineage even when the original provider disappears.

## PD-259 — Shutdown Can Be a Multi-Stage Operational Process

Videdressing did not move directly from active to nonexistent.

Reported shutdown sequence:
- closure announced;
- 12 April 2023: new listings/orders no longer possible;
- 1 July 2023: permanent closure.

Recommended:

ProviderShutdownEvidence {
  announcement_at
  listing_disabled_at
  ordering_disabled_at
  final_closure_at
  successor_destination
}

This matters for Phoenix because a provider may remain reachable while already being operationally unusable.

## PD-260 — Historical Providers Must Be Preserved, Not Silently Deleted

Videdressing should remain in Phoenix Atlas with:

```text
lifecycle = CLOSED
integration = NO-GO
historical_value = YES
successor = Leboncoin
```

Deleting closed providers would erase:
- market evolution;
- acquisition history;
- capability migration;
- integration lessons;
- previous discovery provenance.

Phoenix Atlas is therefore not merely a live provider directory. It is also a longitudinal marketplace intelligence system.

## Historical Context

Videdressing was founded in 2009 as a collaborative second-hand fashion/luxury marketplace.

It was acquired by Leboncoin in November 2018.

Contemporary reporting around the acquisition described:
- strong second-hand fashion positioning;
- transactional expertise;
- payment and delivery capabilities;
- strategic value to Leboncoin's fashion categories.

In February 2023, closure was announced.

The service permanently closed on 1 July 2023 and was absorbed into the broader Leboncoin ecosystem.

## Access Posture

```text
active_marketplace = NO
new_listings = NO
new_orders = NO
provider_integration = NO-GO
historical_research = RETAIN
successor_analysis = Leboncoin
```

No scraping, API investigation or commercial integration should be pursued for the defunct provider.

## Reusable DevKit Components

1. ProviderLifecycleRegistry
2. ProviderRevalidationJob
3. AcquisitionLifecycleMapper
4. CapabilityMigrationMapper
5. ProviderShutdownMapper
6. HistoricalProviderRegistry
7. SuccessorProviderResolver
8. ProviderDeprecationWorkflow

## Strategic Score

A conventional live-provider score is not appropriate because the marketplace is closed.

| Dimension | Assessment |
|---|---|
| Live inventory | NONE |
| Integration opportunity | NONE |
| Historical intelligence | HIGH |
| Lifecycle architecture learning | VERY HIGH |
| Capability-lineage value | HIGH |
| Decision Engine live value | NONE |

## Final Decision

### NO-GO AS LIVE PROVIDER — RETAIN AS HISTORICAL INTELLIGENCE

Central conclusion:

> A provider disappearing from the market is itself valuable intelligence. Phoenix must know when a marketplace is active, acquired, migrating, transaction-disabled, closed or absorbed, and must preserve where its capabilities and users moved.

## Canonical Discoveries

- PD-256 — Provider Closure Is a First-Class Lifecycle State
- PD-257 — Acquisition Does Not Guarantee Brand Survival
- PD-258 — Marketplace Capabilities Can Survive Provider Closure
- PD-259 — Shutdown Can Be a Multi-Stage Operational Process
- PD-260 — Historical Providers Must Be Preserved, Not Silently Deleted

Reinforced:
- PD-207 — Public API Retirement Is a Lifecycle Event
- Corporate Capability Graph concepts
- provider revalidation principles

## Sources

Canonical Phoenix evidence:
- Phoenix tracker — Tracker 61 = Videdressing / UK / Luxury Fashion.

External verification:
- EcommerceMag, 15 February 2023 — reported permanent closure on 1 July 2023 and halt to new listings/orders from 12 April 2023.
- CB News, 22 November 2018 — reported Leboncoin acquisition of Videdressing.
- Clipperton, 22 November 2018 — acquisition transaction and Videdressing's second-hand fashion/luxury positioning.
- Contemporary reporting describing absorption into Leboncoin.

Research limitation:
- Videdressing is historical, not a current provider.
- Tracker geography/category are preserved as canonical Atlas classification even though historical corporate reporting primarily describes Videdressing as a French marketplace.

This is a strategic/technical assessment, not legal advice.
