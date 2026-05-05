---
name: Operations
description: Runbooks for bootstrap, rollout, rollback, and phase transitions.
type: project
---

# Operations

## Bootstrap Runbook

Use the on-demand lifecycle scripts:

1. `./infra/terraform/up.sh`
2. verify bootstrap state:
   - `cloud-init status --wait`
   - `k3s kubectl get nodes -o wide`
   - `k3s kubectl get pods -A`
3. confirm HTTPS endpoint returns 200 OK with valid certificate once ingress/cert-manager/app surfaces are in place.

## Cost-control Runbook (required)

Default posture: **servers should be off when not actively validating infrastructure**.

1. Start validation window with `./infra/terraform/up.sh`.
2. Execute required infrastructure checks.
3. End session with `./infra/terraform/down.sh`.

If validation fails mid-session, still run `down.sh` after collecting diagnostics to avoid unintended spend.

## Token Handling

- Preferred source: `~/.config/portfolio-handoff/secrets.env`.
- Required variable: `TF_VAR_hcloud_token`.
- Never commit token-bearing tfvars files.

## Domain Cutover Runbook

Precondition: Execute only during Phase 2 domain migration window.

1. Prepare DNS and cert-manager issuer migration inputs.
2. Apply manifest changes via git.
3. Verify certificate issuance and endpoint response.

## Rollback Runbook

1. Revert the rollout commit on `main` (or restore the previous deployment manifest tag).
2. Let ArgoCD reconcile previous desired state.
3. Verify endpoint health and cert validity.
