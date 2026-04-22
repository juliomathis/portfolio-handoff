---
name: Operations
description: Runbooks for bootstrap, rollout, rollback, and phase transitions.
type: project
---

# Operations

## Bootstrap Runbook

1. Apply Terraform locally.
2. Verify node is Ready and core workloads are Healthy/Synced in ArgoCD.
3. Confirm HTTPS endpoint returns 200 OK with a valid certificate.

## Domain Cutover Runbook

Precondition: Execute only during Phase 2 domain migration window.

1. Prepare DNS and cert-manager issuer migration inputs.
2. Apply manifest changes via git.
3. Verify certificate issuance and endpoint response.

## Rollback Runbook

1. Revert the rollout commit on `main` (or restore the previous deployment manifest tag).
2. Let ArgoCD reconcile previous desired state.
3. Verify endpoint health and cert validity.
