---
name: ADR 001 - Astro React Islands
description: Choose Astro with React islands over a full SPA model.
type: project
---

# ADR 001 - Astro React Islands

## Status

Accepted

## Context

The portfolio is content-first with only small interactive needs. The architecture should minimize client-side JavaScript by default.

## Decision

Use Astro with one React island for interactive filtering.

## Alternatives Considered

- Full React SPA for all pages and interactions.
- Pure static Astro pages with no client-side islands.

## Consequences

1. Lower client JS by default.
2. Strong content/presentation separation.
3. Additional islands require a new ADR.
