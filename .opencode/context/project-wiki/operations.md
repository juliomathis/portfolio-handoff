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

## CI Deploy-Bump Runbook (Phase 7)

Use this when `Image` workflow runs after `main` merges.

1. Check latest run: `gh run list --workflow Image --branch main --limit 1`.
2. If bump step fails, inspect logs: `gh run view <run-id> --log-failed`.
3. Expected protected-main behavior:
    - direct push to `main` may fail with `GH006`
    - direct push may also fail with non-fast-forward (`fetch first`) when `main` advances during the run
    - workflow then pushes `bot/deploy-image-<sha>` and opens a PR bump
4. If PR creation fails with permission errors, verify:
   - `.github/workflows/image.yml` includes `permissions.pull-requests: write`
   - repo Actions workflow setting allows GitHub Actions to create pull requests
5. Merge created bump PR, then verify only `k8s/manifests/portfolio/deployment.yaml` changed.

## Domain Cutover Runbook

Precondition: Execute only during Phase 2 domain migration window.

1. Prepare DNS and cert-manager issuer migration inputs.
2. Apply manifest changes via git.
3. Verify certificate issuance and endpoint response.

## Rollback Runbook

1. Revert the rollout commit on `main` (or restore the previous deployment manifest tag).
2. Let ArgoCD reconcile previous desired state.
3. Verify endpoint health and cert validity.

## Success Criteria Evidence Matrix

Use this matrix during Phase 9 sign-off.

| Criterion | Evidence source |
|---|---|
| 1. nip.io endpoint serves site with valid TLS | `curl -I https://portfolio.<ip-with-dashes>.nip.io` output captured in ops log |
| 2. Visual alignment with prototype at desktop | `app/tests/e2e/responsive.spec.ts` desktop snapshot review |
| 3. Usable at 375/768/1280 | Playwright responsive snapshots and passing E2E run |
| 4. Lighthouse thresholds met | `pnpm --dir app lhci` pass output + reports |
| 5. Content editable without component changes | content-only PR diff + unit contract tests |
| 6. `terraform apply` <=15 min from zero | timed validation window recorded in ops log |
| 7. Image bump to rollout <=3 min | `Image` run + bump PR merge + Argo reconcile timing note |
| 8. Phase 2 domain swap <=5-file content PR | migration PR diff statistics in ops log |
| 9. Wiki queryable via qmd | `qmd query "ArgoCD"` returns project wiki docs |
| 10. New handoff ingest workflow documented | `.opencode/context/project-wiki/content-authoring.md` ingestion section |

## Phase 9 Verification Snapshot (2026-05-06)

| Criterion | Status | Notes |
|---|---|---|
| 1. nip.io endpoint serves site with valid TLS | Pass (branch validated) | Phase 9 follow-up branch revision `a33b710` introduced a PostSync host-reconciler hook; live validation now shows reconciled dashed host and `curl -I https://portfolio.178-105-89-214.nip.io` returning `HTTP/2 200`. |
| 2. Visual alignment with prototype at desktop | Pass (automated) | `playwright` desktop snapshot baseline test passed (`responsive.spec.ts`). |
| 3. Usable at 375/768/1280 | Pass | Responsive snapshot suite passed at all three target widths. |
| 4. Lighthouse thresholds met | Pass | `lhci` passed with representative scores perf 1.00, a11y 0.98, bp 1.00, SEO 1.00. |
| 5. Content editable without component changes | Pass (contract) | Typed content boundary and contract tests pass (`content-data`/`components-phase2` coverage). |
| 6. `terraform apply` <=15 min from zero | Pass | Timed 2026-05-06 run: `/usr/bin/time -p ./infra/terraform/up.sh` completed in `real 28.21` seconds from zero state. |
| 7. Image bump to rollout <=3 min | Partial | Successful Image runs observed (2m04 and 3m59), but direct Argo rollout timing from a live cluster session is not yet captured. |
| 8. Phase 2 domain swap <=5-file content PR | Deferred | No merged domain-swap PR exists yet in current phase history. |
| 9. Wiki queryable via qmd | Pass | `qmd query "ArgoCD"` returns core wiki docs (`adr/002`, `operations`, `infrastructure`). |
| 10. New handoff ingest workflow documented | Pass | Documented under `content-authoring.md` (`New Handoff Ingestion Workflow`). |
