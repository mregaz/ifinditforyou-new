# iFindItForYou Growth

STATUS: CERTIFIED
VERSION: 1.0
SUBSYSTEM: Go-To-Market / Growth
LOCATION: `docs/PHOENIX_WORKSPACE/09_GO_TO_MARKET/GROWTH/`
INITIAL PAID ADVERTISING BUDGET: 0 CHF

## Purpose

The iFindItForYou Growth subsystem governs the evidence-driven validation and development of the product's go-to-market model.

Its purpose is to determine how iFindItForYou can acquire, activate and retain real users with an initial paid advertising budget of 0 CHF while preserving Product, Engineering, Atlas, privacy, evidence and publication boundaries.

Growth validates demand and distribution. Growth does not authorize product implementation.

## Scope

The Growth subsystem governs:

- growth strategy;
- positioning and messaging;
- acquisition-channel prioritization;
- founder-led early-user acquisition;
- growth experiments;
- competitor distribution intelligence;
- Atlas-to-Growth derivation;
- 0→25→100→1000 growth phases;
- Growth evidence classification;
- public Growth artifact governance;
- Growth-to-Product handoff.

It does not govern Phoenix runtime architecture, product feature authorization, automated telemetry architecture, provider implementation, Atlas canonical records, DevKit architecture, or unrestricted publication of Atlas intelligence.

## Strategic Baseline

- Validation beachhead: Swiss used Vespa, scooter and enthusiast-motorcycle seekers.
- Category: Multi-marketplace finding assistant.
- Core promise: Describe the hard-to-find item once. We search the marketplaces you would otherwise check one by one.
- Initial acquisition: founder-led, help-first, evidence-driven.
- Initial paid advertising budget: 0 CHF.
- North Star: Weekly Qualified Search Successes (WQSS).

These are navigation-level summaries. Canonical definitions remain in the authority documents below.

## Document Navigation

- `01_STRATEGY/IFINDITFORYOU_GROWTH_STRATEGY_v1.0.md`
- `02_POSITIONING/IFINDITFORYOU_POSITIONING_AND_MESSAGING_v1.0.md`
- `03_CHANNELS/IFINDITFORYOU_ZERO_BUDGET_CHANNEL_MAP_v1.0.md`
- `04_EXECUTION/IFINDITFORYOU_FIRST_100_USERS_PLAYBOOK_v1.0.md`
- `04_EXECUTION/IFINDITFORYOU_0_TO_1000_ROADMAP_v1.0.md`
- `05_EXPERIMENTS/IFINDITFORYOU_GROWTH_EXPERIMENT_BACKLOG_v1.0.md`
- `06_INTELLIGENCE/IFINDITFORYOU_COMPETITOR_DISTRIBUTION_INTELLIGENCE_v1.0.md`
- `06_INTELLIGENCE/IFINDITFORYOU_ATLAS_TO_GROWTH_STRATEGY_v1.0.md`
- `07_EVIDENCE/` — experiment results, benchmarks, interview synthesis, channel scorecards and future Growth checkpoints.

## Document Authority Matrix

| Governed domain | Canonical authority |
|---|---|
| Strategic thesis / JTBD / beachhead | Growth Strategy |
| WQSS definition | Growth Strategy |
| Positioning / messaging / claims | Positioning & Messaging |
| Channel priority / channel stop rules | Zero-Budget Channel Map |
| Founder workflow / interviews / outreach | First 100 Users Playbook |
| Experiment IDs / sequence / experiment thresholds | Growth Experiment Backlog |
| Competitor evidence / distribution patterns | Competitor Distribution Intelligence |
| Atlas publication eligibility | Atlas to Growth Strategy |
| Phase boundaries / KPIs / GO-STOP-PIVOT / calendar | 0 to 1000 Roadmap |
| Evidence classification model | Growth README |
| Growth → Product boundary | Growth README |
| Public-artifact operational governance | Growth README |
| Automated Phoenix telemetry | Outside Growth authority |

Each governed domain has exactly one canonical authority. Supporting documents may summarize or reference canonical decisions but must not redefine them. If duplicated content diverges, the designated domain authority prevails.

## Conflict Resolution

1. Identify the governed domain.
2. Identify its canonical authority.
3. Treat the authority document as controlling.
4. Do not silently merge conflicting values.
5. Determine whether the supporting document is stale or the authority itself requires revision.
6. Modify the authority first when a governed decision changes.
7. Synchronize dependent documents.
8. Run cross-document regression.
9. Record material strategic changes through Growth governance.

## Evidence Model

Material Growth claims are classified independently by:

**CLAIM STATE**
- `FACT`
- `INFERENCE`
- `HYPOTHESIS`
- `UNKNOWN`

**SOURCE GRADE**
- `A` — primary / authoritative direct evidence
- `B` — strong independent secondary evidence
- `C` — community / founder / observational / qualitative evidence
- `N/A` — only where no supporting-source claim is being made

Claim State and Source Grade are independent. Repetition is not evidence. Inference is not fact. Hypothesis is not fact. Unknown is not false. Experimental thresholds are decision rules, not industry benchmarks. Experiment results establish facts only within their recorded scope. Coverage does not imply completeness.

## WQSS Governance

- WQSS definition: Growth Strategy.
- Phase WQSS targets: 0 to 1000 Roadmap.
- Manual measurement procedure: First 100 Users Playbook.
- Automated WQSS telemetry: not authorized by the Growth subsystem.

During early validation, WQSS must remain measurable without automated Phoenix telemetry.

## Atlas Boundary

Phoenix Atlas is a private intelligence source and public-content opportunity substrate. Atlas records are not public Growth artifacts. Atlas signals do not constitute publication authorization.

Atlas-derived material may enter public Growth workflows only through the publication eligibility rules defined by `IFINDITFORYOU_ATLAS_TO_GROWTH_STRATEGY_v1.0.md`.

## Publication Governance

Every governed public Growth artifact requires:

- Owner;
- Author;
- Reviewer;
- Verified-at date where freshness matters;
- Source record;
- Scope;
- Limitations;
- Refresh policy;
- Correction / withdrawal authority.

Publication states: `DRAFT`, `REVIEWED`, `PUBLISHED`, `STALE`, `WITHDRAWN`.

FACT/A does not imply publication authorization. Unknown permission means do not publish. Unknown material provenance means do not publish. User activity does not imply publication consent. AI drafting does not replace verification. Programmatic generation does not imply programmatic publication. Material errors require correction or withdrawal.

## Growth → Product Boundary

Growth may define metrics and hypotheses, collect minimum necessary manual evidence, measure WQSS manually, identify repeated user needs, and produce Product Requirement Candidates.

Growth may not authorize Phoenix features, telemetry events, analytics identifiers, analytics vendors, analytics retention, Product database requirements, tracking scripts, third-party analytics SDKs, or provider implementation.

```text
GROWTH EVIDENCE
→ VALIDATED USER NEED
→ PRODUCT REQUIREMENT CANDIDATE
→ PRODUCT REVIEW
→ ACCEPT / REJECT / DEFER
```

Only an accepted Product decision may proceed through Requirements → Architecture → Specification → Implementation → Validation.

## Early Validation Measurement

Manual founder-led measurement is permitted. Examples include completed search, user-confirmed useful result, user-reported click/save/share, repeat request, monitoring intent, referral, founder effort, coverage gap and trust issue.

Manual Growth observations are research evidence. They are not Phoenix telemetry schemas. `UNKNOWN` is a valid observation and must not be silently converted to `NO`. User-confirmed and system-observed are distinct evidence types.

## Experiment and Phase Governance

Experiment IDs, ordering and experiment-specific success/failure thresholds are owned by the Growth Experiment Backlog.

Phase targets, transitions, GO/STOP/PIVOT gates and operating calendar are owned by the 0 to 1000 Roadmap.

An experiment threshold must not silently redefine a phase gate. A phase gate must not silently redefine an experiment threshold.

## Document Status

- `DRAFT` — work in progress.
- `REVIEWED` — substantive review complete; not certified.
- `FROZEN` — a specific contract or decision boundary is locked against informal change.
- `CERTIFIED` — the artifact or governed pack completed the defined certification process.
- `SUPERSEDED` — a newer canonical artifact replaced it.

`FROZEN` does not mean `CERTIFIED`.

## Change Control

A material governed change must identify the affected authority domain, modify the canonical authority first, classify supporting evidence, identify and synchronize dependent documents, run cross-document regression, and update certification status when required.

No material strategic decision may be changed solely inside a supporting document.

## Research Boundary

New external research is commissioned only when an identified evidence gap cannot be resolved from the existing Growth corpus, Atlas evidence or controlled first-party experiments.

Research produces evidence. Governance produces decisions.

## Repository Boundary

This subsystem belongs to `docs/PHOENIX_WORKSPACE/09_GO_TO_MARKET/GROWTH/`.

It does not belong to `docs/PHOENIX_WORKSPACE/17_DEVKIT/`.

## Master Record Boundary

The Master Record registers the existence, status, location and major certified decisions of the Growth subsystem. It does not duplicate the full Growth Strategy, experiment backlog, roadmap or evidence corpus.
