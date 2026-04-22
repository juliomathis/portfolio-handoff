---
name: ADR 006 - Nginx Over Caddy
description: Use nginx:alpine runtime image for static serving.
type: project
---

# ADR 006 - Nginx Over Caddy

## Status

Accepted

## Context

Runtime serving for the static site should be predictable and easy to operate. The image choice should favor explicit configuration and low operational surprise.

## Decision

Use nginx:alpine for runtime static file serving.

## Alternatives Considered

- Caddy-based runtime image for automatic convenience features.
- Node.js static server process in the runtime container.

## Consequences

1. Mature predictable runtime behavior.
2. Explicit config ownership in repo.
3. Minimal runtime surface area.
