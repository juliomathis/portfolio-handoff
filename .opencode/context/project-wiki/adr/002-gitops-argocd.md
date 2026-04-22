---
name: ADR 002 - GitOps ArgoCD
description: Choose ArgoCD GitOps over push-deploy patterns.
type: project
---

# ADR 002 - GitOps ArgoCD

## Status

Accepted

## Context

The platform needs a repeatable deployment workflow with clear source-of-truth state. Drift correction should be automated from repository history.

## Decision

Use ArgoCD to reconcile cluster state from git.

## Alternatives Considered

- Push-based CI/CD deployments to the cluster.
- Manual kubectl apply operations for each release.

## Consequences

1. Declarative deployment history in repository.
2. Clear drift management.
3. Requires disciplined manifest change process.
