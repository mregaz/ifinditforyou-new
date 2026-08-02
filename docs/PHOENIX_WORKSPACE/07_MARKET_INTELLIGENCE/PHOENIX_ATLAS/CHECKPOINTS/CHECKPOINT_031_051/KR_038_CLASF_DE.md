# PHOENIX ATLAS — KNOWLEDGE RECORD 038

## Clasf.de — Germany

- Tracker ID: 38
- Tracker source classification: Germany / general classifieds
- Historical domain: https://www.clasf.de/
- Provider family: Clasf
- Current lifecycle assessment: RETIRED / NO ACTIVE GERMAN MARKETPLACE SURFACE VERIFIED
- Research date: 2026-08-02
- Decision: NO-GO AS CURRENT GERMAN PROVIDER; retain as provider-family/lifecycle intelligence
- Integration priority: NONE for Germany until reactivation is verified
- Indicative Strategic Score: 42 / 100 as current German source

## Executive Summary

Tracker 38 requires a correction of lifecycle, not a conventional provider integration analysis.

The original Atlas CSV identifies `Clasf.de` as a German general-classifieds source. Current research does not support treating it as an active German Clasf marketplace.

The current official Clasf global country selector lists active European surfaces for Spain, France, Italy and Portugal, but not Germany. Independent current domain evidence reports that `clasf.de` / `www.clasf.de` redirect into `clasf.com`, whose current title is "Clasf around the world".

Therefore Phoenix should preserve the historical Tracker ID but classify the German surface as retired/unverified rather than silently substituting another Clasf country.

Clasf remains an active international provider family. Germany is the missing surface.

## Current provider-family evidence

The current official global Clasf page lists country surfaces across Africa, Asia, America and Europe.

Current Europe list:
- Spain
- France
- Italy
- Portugal

Germany is absent.

Current third-party domain evidence reports:
- `clasf.de`
- `www.clasf.de`

as redirecting to `clasf.com`.

The current global page does not expose Germany as a selectable marketplace.

This is sufficient for a conservative Atlas lifecycle decision:

`Clasf.de = not currently verified as an active German marketplace surface`.

## PD-119 — Tracker Presence Does Not Prove Current Provider Existence

A provider appearing in the original research tracker is historical evidence that it was considered a candidate. It is not proof that the provider remains active today.

Phoenix Atlas therefore needs explicit lifecycle verification before technical analysis:

```text
ProviderLifecycle {
  tracker_id
  historical_domain
  current_domain
  status
  verified_at
  evidence[]
}
```

Suggested states:

```text
ACTIVE
REDIRECTED
RETIRED
ACQUIRED
REBRANDED
DORMANT
UNREACHABLE
UNVERIFIED
```

This prevents engineering work from being spent on dead provider surfaces.

## PD-120 — Redirect Target Does Not Automatically Replace Marketplace Identity

`clasf.de` redirecting toward the global Clasf surface does not prove that the global site contains a German marketplace.

Phoenix must distinguish:

```text
domain_redirect
        !=
marketplace_successor
```

A redirect can represent:
- retirement;
- consolidation;
- rebranding;
- generic corporate landing;
- migration;
- temporary routing.

A successor relationship must be independently verified.

Therefore Phoenix should not automatically rewrite:

```text
Clasf.de → Clasf.com Germany
```

because no current German Clasf marketplace was verified.

## PD-121 — Provider-Family Country Coverage Is Time-Varying

Clasf remains an international provider family, but its currently exposed country matrix does not include Germany.

Country support therefore needs temporal provenance:

```text
ProviderCountryCoverage {
  provider_family
  country
  surface
  status
  observed_at
}
```

The existence of a provider family in France, Spain or Italy does not imply that its German surface remains operational.

This strengthens the Atlas `ProviderFamily + MarketplaceSurface` architecture introduced earlier.

## Why this matters for Phoenix

Without lifecycle validation Phoenix could:
1. create a parser for a retired domain;
2. misclassify a global landing page as German inventory;
3. waste monitoring capacity;
4. create false provider-health alerts;
5. silently ingest another country's listings;
6. report coverage that Phoenix does not actually possess.

Therefore lifecycle validation should occur before:
- scraping feasibility;
- API research;
- parser design;
- provider registration;
- capability scoring.

## Recommended Provider Resolver behavior

A future Phoenix registry should support:

```text
RegisteredProvider {
  id
  family
  surface
  country
  lifecycle
  enabled
  last_verified_at
}
```

For Tracker 38:

```text
id = clasf_de
family = clasf
country = DE
lifecycle = RETIRED_OR_UNVERIFIED
enabled = false
```

## Clasf family reuse

Clasf itself remains relevant to Atlas because active country surfaces exist.

Any existing Clasf provider-family research should be reused for:
- Spain;
- France;
- Italy;
- Portugal;
- other currently verified Clasf countries.

But German enablement must remain false until an active German surface is verified.

## API / feed / scraping assessment

Because no active German marketplace surface was verified, a German API/feed/scraping assessment would be artificial.

For `Clasf.de`:

```text
active_german_html_surface = NOT VERIFIED
german_search_api = NOT IDENTIFIED
german_partner_feed = NOT IDENTIFIED
production_provider = DISABLED
scraping_decision = NOT APPLICABLE / NO-GO
```

Phoenix should not attempt to bypass the redirect or reconstruct a retired German service.

If Clasf later reactivates Germany, Atlas should create a new verification event rather than overwrite this historical record.

## Capability Impact

- provider_lifecycle_registry
- redirect_provenance
- provider_country_coverage
- stale_tracker_detection
- provider_health_validation
- provider_family_surface_separation

## Reusable DevKit Components

1. `ProviderLifecycleRegistry`
2. `ProviderSurfaceVerifier`
3. `RedirectProvenanceMapper`
4. `ProviderCountryCoverageRegistry`
5. `StaleTrackerDetector`
6. `ProviderHealthCheck`
7. `ProviderEnablementGate`

## Strategic Score

| Dimension | Score |
|---|---:|
| Current Germany inventory value | 0 |
| Current German provider readiness | 0 |
| Provider-family intelligence | 72 |
| Lifecycle architecture learning | 100 |
| Atlas reconciliation value | 100 |
| Integration priority | 0 |
| Decision Engine value | 25 |

**Indicative Strategic Score: 42 / 100 as a current German source.**

The low score does not mean the research was unimportant. The lifecycle discovery itself is highly valuable because it prevents a false integration.

## Final Decision

### NO-GO AS CURRENT GERMAN PROVIDER

Do not implement `Clasf.de` as an active Phoenix Germany provider.

Retain Tracker 38 as a historical/lifecycle record and keep the Clasf provider family separately available for countries whose current surfaces are verified.

Most important conclusion:

> Phoenix must verify that a marketplace surface still exists before deciding how to integrate it.

## Canonical Discoveries

- PD-119 — Tracker Presence Does Not Prove Current Provider Existence
- PD-120 — Redirect Target Does Not Automatically Replace Marketplace Identity
- PD-121 — Provider-Family Country Coverage Is Time-Varying

Reinforced:
- PD-059 Cross-Country Provider Family
- PD-085 Corporate Ownership Does Not Collapse Surface Identity
- PD-094 Marketplace Code Is a First-Class Provider Configuration
- PD-095 API-Native Provider Families Should Maximize Shared Core

## Sources

User-provided canonical tracker:
- `marketplaces_europe(3).csv` — Tracker ID 38 identifies Clasf.de as Germany / general classifieds.

Current web research, 2026-08-02:
- https://www.clasf.com/ — current official Clasf global country selector; Germany absent.
- Current domain-resolution evidence reporting `clasf.de` and `www.clasf.de` redirecting to `clasf.com`.
- Current Clasf company/profile evidence listing international country surfaces without Germany.

Research limitation:
- No active German Clasf marketplace surface, German search API, or German partner feed was verified.
- This record intentionally does not infer that Clasf Germany exists merely because the historical domain still redirects.

This is a strategic/technical assessment, not legal advice.
