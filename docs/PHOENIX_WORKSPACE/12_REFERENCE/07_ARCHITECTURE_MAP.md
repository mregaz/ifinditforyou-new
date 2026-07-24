# Phoenix — Architecture Map

Version: 1.0

Status: Approved

Owner: Phoenix Project

Last Updated: July 2026

---

# 1. Purpose

This document provides a high-level architectural map of the Phoenix platform.

Its objectives are:

- Present the major architectural domains.
- Show relationships between components.
- Improve system understanding.
- Support onboarding.
- Facilitate long-term maintenance.
- Serve as the primary architecture navigation guide.

The Architecture Map complements detailed architecture documentation by providing a simplified system overview.

---

# 2. Architecture Philosophy

Phoenix follows a modular, scalable, and evolvable architecture.

The platform is designed around:

Separation of concerns

Loose coupling

High cohesion

Provider independence

Scalability

Resilience

Observability

Every subsystem has a clearly defined responsibility.

---

# 3. High-Level Architecture

```
                        Phoenix Platform

                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        │                      │                      │
   User Experience         Finder Engine        Administration
        │                      │                      │
        │                      │                      │
        └──────────────┬───────┴──────────────┬───────┘
                       │                      │
                 Provider Layer         Business Layer
                       │                      │
                       │                      │
                External Sources       Payments / Users
                       │                      │
                       └──────────────┬───────┘
                                      │
                               Infrastructure
                                      │
                        Monitoring / Security
```

---

# 4. Architectural Domains

The Phoenix architecture is divided into the following domains.

---

## User Experience

Responsible for:

Web interface

Localization

User interaction

Search experience

Accessibility

---

## Finder Engine

Core orchestration engine.

Responsibilities:

Query parsing

Provider resolution

Provider execution

Aggregation

Ranking

Result generation

The Finder Engine is the heart of Phoenix.

---

## Provider Layer

Responsible for communication with external platforms.

Includes:

Provider Registry

Provider SDK

Parser

Mapper

Validator

Provider Monitoring

Every provider is isolated from the core engine.

---

## Business Layer

Responsible for:

Subscriptions

Payments

Plans

Credits

Customer accounts

Usage analytics

Business rules remain independent from technical implementation.

---

## Administration

Responsible for:

Operational dashboards

Configuration

System monitoring

Provider management

Business reporting

Administration supports platform governance.

---

## Infrastructure

Responsible for:

Hosting

Deployment

Databases

Caching

Networking

Backups

Scalability

Infrastructure enables reliable operation.

---

## Monitoring

Responsible for:

Health checks

Logging

Metrics

Alerts

Performance monitoring

Operational dashboards

Observability supports operational excellence.

---

## Security

Responsible for:

Authentication

Authorization

Secrets

Compliance

Infrastructure protection

Security monitoring

Security is integrated into every architectural domain.

---

# 5. Architectural Relationships

The main dependency flow is:

User

↓

Finder Engine

↓

Provider Layer

↓

External Sources

↓

Result Aggregation

↓

Business Rules

↓

Presentation

Each domain communicates through clearly defined interfaces.

---

# 6. Evolution Strategy

Architecture evolves by:

Adding providers

Extending capabilities

Improving scalability

Increasing automation

Expanding business features

Strengthening governance

Evolution should preserve architectural stability.

---

# 7. Cross-Cutting Concerns

The following concerns affect every domain:

Security

Logging

Monitoring

Error handling

Performance

Documentation

Governance

These concerns are integrated rather than isolated.

---

# 8. Architecture Navigation

Detailed information can be found in:

02_ARCHITECTURE

03_DECISIONS (ADR)

07_PROVIDERS

09_OPERATIONS

13_KNOWLEDGE_GOVERNANCE

The Architecture Map acts as the navigation layer between these domains.

---

# 9. Maintenance

The Architecture Map should be updated:

After architectural changes

After major releases

After new provider categories

After infrastructure evolution

After strategic platform changes

The map reflects the current platform architecture.

---

# 10. Strategic Conclusion

The Architecture Map provides a shared understanding of the Phoenix platform.

By presenting the system at a high level, it enables developers, architects, and business stakeholders to understand how the major domains interact while preserving the modular principles that guide Phoenix's evolution.
