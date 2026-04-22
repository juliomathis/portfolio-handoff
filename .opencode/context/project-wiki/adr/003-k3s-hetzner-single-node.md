---
name: ADR 003 - k3s Hetzner Single Node
description: Choose single-node k3s on Hetzner as Phase 1 deployment target.
type: project
---

# ADR 003 - k3s Hetzner Single Node

## Status

Accepted

## Context

Phase 1 needs a low-cost environment that still reflects Kubernetes production workflows. Operational complexity must stay manageable for a single-operator portfolio setup.

## Decision

Use single-node k3s on Hetzner for Phase 1.

## Alternatives Considered

- Local-only Docker Compose deployment for Phase 1.
- Managed multi-node Kubernetes from the start.

## Consequences

1. Low-cost realistic Kubernetes environment.
2. Single point of failure accepted for portfolio scope.
3. Upgrade path remains open for later phases.
