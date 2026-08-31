# IFINDITFORYOU GROWTH EXPERIMENT BACKLOG v1.0

## Product boundary

This backlog owns experiment IDs, ordering and experiment-specific thresholds. An experiment may test a user need or prototype, but it does **not** authorize a Phoenix feature, provider, telemetry event, database change or analytics implementation. Any implementation-dependent experiment first becomes a Product Requirement Candidate and requires Product/Engineering review.

## Decision rules

- **P0:** execute in first 14 days.
- **P1:** execute after at least 10 real searches.
- **P2:** promising but dependent on signal or capability.
- **P3:** defer/reject for now.

| ID | Pri. | Hypothesis / target | Channel & action | Cost | Time | Success metric | Failure threshold | Learning / next action |
|---|---|---|---|---:|---:|---|---|---|
| EXP-01 | P0 | Vespa seekers feel multi-site pain | recruit 10 active seekers; manual concierge search | 0 | 10h | 5 completed, 3 WQSS | <2 WQSS | validate/pivot beachhead |
| EXP-02 | P0 | proposed message is understood in 5 sec | 20 message interviews | 0 | 4h | ≥60% accurate explanation | <40% | rewrite category/promise |
| EXP-03 | P0 | multi-source output beats manual memory | blind compare on 10 queries | 0 | 8h | saves ≥15 min or adds useful source in 5/10 | <3/10 advantage | improve coverage or stop |
| EXP-04 | P0 | users want monitoring after no immediate find | ask 10 unsuccessful users | 0 | 1h | ≥3 monitoring intents | 0 | deprioritize alerts/retention |
| EXP-05 | P0 | source/timestamp improves trust | show with/without provenance | 0 | 3h | +20% click/useful rating | no lift | simplify trust UI |
| EXP-06 | P0 | case study generates qualified demand | publish one Vespa comparison | 0 | 5h | 5 qualified visits, 2 searches | 0 searches/100 views | change topic/CTA |
| EXP-07 | P0 | club partnership can recruit without spam | pitch 5 Swiss clubs | 0 | 3h | 1 pilot accepted | 0/5 | revise exchange or channel |
| EXP-08 | P0 | fulfilled users refer peers | ask after WQSS | 0 | 1h | 3 intros/20 asks | 0 | test share artifact |
| EXP-09 | P0 | specific search form improves completion | compare free text vs guided | 0 | 4h | +20% completion | no lift | keep simplest form |
| EXP-10 | P0 | provider coverage is adequate | 20 benchmark searches | 0 | 10h | ≥50% with 2 useful sources | <40% | narrow market/add sources |
| EXP-11 | P1 | “Friday Find Clinic” creates repeat cadence | 4 weekly clinics | 0 | 16h | 5 users/session, 40% WQSS | <2 users/session twice | stop/change format |
| EXP-12 | P1 | anonymized searches are shareable | share-result page | infra | 1d | ≥10% share rate | <3% | interview sharing motivation |
| EXP-13 | P1 | rare-parts subset has stronger pull | 10 part searches | 0 | 8h | WQSS > vehicle baseline | lower than baseline | stay vehicle-first |
| EXP-14 | P1 | German copy expands reach | DE landing/interviews | 0 | 4h | same comprehension as EN/IT ±10% | >20% worse | rewrite/localize |
| EXP-15 | P1 | French copy expands Romandie | FR landing + VCCSR outreach | 0 | 4h | 5 searches, 2 WQSS | 0 searches | defer region |
| EXP-16 | P1 | specialist shop sees customer value | 10 shop interviews | 0 | 6h | 2 referral pilots | 0 | change partner segment |
| EXP-17 | P1 | transparent “not found” retains trust | structured no-result report | 0 | 3h | ≥50% says useful | <20% | improve coverage disclosure |
| EXP-18 | P1 | saved search drives return | manual email follow-up | 0 | 4h | 20% return in 14d | <10% | delay product alert build |
| EXP-19 | P1 | price/source comparison earns links | one data report | 0 | 8h | 2 earned mentions/links | 0 after 20 pitches | change format/data |
| EXP-20 | P1 | creator co-search reaches buyers | pitch 5 micro-creators | 0 | 5h | 1 collaboration, 5 searches | 0/5 | revise creator value |
| EXP-21 | P2 | public-safe marketplace guide ranks | 5 long-tail guides | 0 | 15h | impressions in 30–45d | none | improve demand/topic/internal links |
| EXP-22 | P2 | Product Hunt yields feedback | launch after 25+ users | 0 | 2d | 50 qualified visitors, 10 searches | <3 searches | treat as event, not engine |
| EXP-23 | P2 | Show HN values technical finder | live demo + architecture story | 0 | 1d | substantive feedback + 10 searches | moderation/no engagement | do not repeat |
| EXP-24 | P2 | watch segment has willingness-to-pay | 10 interviews only | 0 | 6h | 5 strong pain, 2 paid-intent | trust objections dominate | defer until controls |
| EXP-25 | P2 | instruments offer easier repeatability | 10 Swiss searches/interviews | 0 | 7h | ≥4 WQSS | <2 | deprioritize |
| EXP-26 | P2 | Atlas directory creates discovery | 10 public-safe pages | 0 | 20h | 10 qualified visits/mo/page by day 60 | <2 | stop scaling templates |
| EXP-27 | P2 | “someone else is looking” loop is valuable | opt-in shared demand page | infra | 2d | 10% opt-in, 2 referrals | privacy concern | stop/redesign |
| EXP-28 | P3 | generic social posting acquires users | broad brand posts | 0 | ongoing | — | low intent expected | do not execute initially |
| EXP-29 | P3 | paid ads can force learning | search/social ads | >0 | — | — | violates initial rule | defer until conversion proof |
| EXP-30 | P3 | scrape community member lists | unsolicited outreach | unacceptable | — | — | privacy/rule violation | prohibited |

## First three experiments

1. `EXP-01` — 10 concierge Vespa/moto searches.
2. `EXP-02` — five-second positioning comprehension.
3. `EXP-10` — provider-coverage benchmark.

These three test demand, message and product reality before investing in scalable distribution.
