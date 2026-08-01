# PHOENIX ATLAS — KNOWLEDGE RECORD 030

## idealista.com — Spain

- Tracker ID: 30
- Country: Spain
- Vertical: Real estate
- Operator: Idealista, S.A.U.
- Lifecycle: ACTIVE
- Research date: 2026-08-01
- Decision: GO STRATEGICO — API/data partnership only; NO unauthorized scraping
- Integration priority: VERY HIGH
- Indicative Strategic Score: 96 / 100

## Executive Summary

idealista is both a real-estate marketplace and a professional data/technology ecosystem. Official idealista/data services advertise APIs, big-data solutions, historical data, widgets, custom solutions, comparable-property data, valuations, cadastral data, neighborhood metrics and sociodemographic data.

Its General Terms explicitly prohibit accessing, monitoring or copying content with robots, spiders, scrapers or other automated/manual processes without express written permission, and prohibit commercial/competitive reuse without prior written permission.

Phoenix route: official API/data/commercial partnership, not unauthorized scraping.

## Official data evidence

Current idealista/data figures observed:
- 2,632,762 properties in quarterly data;
- 21 years of historical data since 2005;
- 2.064 billion searches per quarter;
- more than 15,500 geographic zones.

These are time-bounded official observations.

## PD-080 — Provider Can Be Both Inventory Source and Intelligence Source

A provider may contribute listing inventory and market intelligence.

```text
Provider
├── Listing Inventory
└── Market Intelligence
    ├── historical prices
    ├── demand
    ├── supply
    ├── comparables
    ├── valuations
    ├── geography
    └── sociodemographics
```

## PD-081 — Knowledge API Can Outrank Listing API Strategically

For Decision Intelligence, comparables, historical prices and market context may create more value than adding another raw listing source.

Provider scoring should separate inventory value, knowledge value and decision value.

## PD-082 — Geographic Resolution Is a Data Capability

Model geographic resolution explicitly: country, region, province, municipality, district, neighborhood, census section and coordinates.

## PD-083 — Historical Depth Is a Provider Moat

idealista/data advertises 21 years of historical data. Historical depth enables trend analysis, anomaly detection, market-cycle context and explainable recommendations.

## PD-084 — Search Demand Is Market Evidence

idealista/data states that it uses billions of quarterly searches to understand market demand. Phoenix should eventually distinguish supply evidence from demand evidence when lawfully available.

## Access / compliance

General Terms prohibit automated copying/scraping without express written permission and prohibit bypassing robot/access restrictions.

```text
public_html = yes
unauthorized_scraping = NO-GO
official_data_services = yes
official_api_services = yes
widgets = yes
data_files = yes
custom_solutions = yes
production_route = commercial/API partnership
```

The existence of APIs does not imply every listing-search use case is licensed. Phoenix must request the exact dataset/use case.

## Professional ecosystem

idealista also exposes professional tooling and services including idealista/tools, listing export, API service, valuations, electronic signature and selected online reservation services.

Its tools ecosystem also includes AI-assisted listing-description functionality.

## RealEstateCapabilityPack

Recommended fields/capabilities include property type, operation type, price, price/m², surface, rooms, bathrooms, floor, condition, energy rating, hierarchical location, coordinates, valuation, comparables, historical price context, supply, demand and neighborhood metrics.

## Partnership questions

Ask idealista:
1. Which APIs/datasets are available to external technology companies?
2. Is current listing inventory licensable?
3. Can comparables/metrics APIs support a consumer decision product?
4. What historical/geographic fields are licensed?
5. Can idealista data be combined with third-party marketplace data?
6. What caching/storage/display rules apply?
7. Is a sandbox/pilot available?
8. What commercial model applies?

## Strategic Score

| Dimension | Score |
|---|---:|
| Spain real-estate relevance | 100 |
| Data richness | 100 |
| Historical intelligence | 100 |
| Geographic intelligence | 98 |
| Official API/data maturity | 98 |
| Decision Engine value | 100 |
| Unauthorized scraping suitability | 0 |
| Partnership strategic value | 96 |
| Architecture learning | 99 |

Indicative Strategic Score: 96 / 100.

## Final Decision

GO STRATEGICO — API/DATA PARTNERSHIP ONLY.

Most important conclusion:

Phoenix should not measure providers only by how many listings they can supply. Some providers can supply the market knowledge required to understand whether a listing is actually a good decision.

## Canonical Discoveries

- PD-080 — Provider Can Be Both Inventory Source and Intelligence Source
- PD-081 — Knowledge API Can Outrank Listing API Strategically
- PD-082 — Geographic Resolution Is a Data Capability
- PD-083 — Historical Depth Is a Provider Moat
- PD-084 — Search Demand Is Market Evidence

## Sources

Phoenix tracker evidence:
- marketplaces_europe.csv
- PHOENIX_ATLAS_PROVIDER_TRACKER_UPDATED_015.csv
- PHOENIX_ATLAS_CHECKPOINT_001_022_MASTER.md

Official idealista sources researched 2026-08-01:
- https://www.idealista.com/
- https://www.idealista.com/ayuda/articulos/legal-statement/?lang=en
- https://www.idealista.com/data/
- https://www.idealista.com/data/asesoramiento-inmobiliario-tecnologico/
- https://www.idealista.com/data/asesoramiento-inmobiliario-tecnologico/api-comparables-y-metricas/
- https://www.idealista.com/data/estudios-de-mercado/
