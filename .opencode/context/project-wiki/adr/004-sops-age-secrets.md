---
name: ADR 004 - SOPS Age Secrets
description: Use SOPS with age for encrypted secret management in GitOps.
type: project
---

# ADR 004 - SOPS Age Secrets

## Status

Accepted

## Context

GitOps requires versioned manifests while keeping secret values protected. The team needs encrypted-at-rest secrets that can still be reconciled in-cluster.

## Decision

Use SOPS with age, with KSOPS-based decryption at reconcile time.

## Alternatives Considered

- Kubernetes Sealed Secrets as the primary secret workflow.
- External secret manager with runtime injection only.

## Consequences

1. Secrets remain encrypted in git.
2. Additional operational responsibility for key handling.
3. Explicit blast-radius controls required in repo policy.
