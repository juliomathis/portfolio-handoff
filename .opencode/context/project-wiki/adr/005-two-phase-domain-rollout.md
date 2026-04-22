---
name: ADR 005 - Two Phase Domain Rollout
description: Start with nip.io then migrate to Cloudflare-managed domain.
type: project
---

# ADR 005 - Two Phase Domain Rollout

## Status

Accepted

## Context

The project needs fast initial exposure without waiting on domain setup. A staged DNS approach reduces Day 1 friction while preserving a clean production endpoint later.

## Decision

Use nip.io in Phase 1 and Cloudflare DNS in Phase 2.

## Alternatives Considered

- Purchase and configure the permanent domain before any public rollout.
- Keep nip.io as the long-term public endpoint.

## Consequences

1. Faster initial go-live without domain purchase.
2. Clear migration runbook needed for cutover.
3. Cutover requires a coordinated Phase 2 checklist (Terraform + SOPS secret updates).
