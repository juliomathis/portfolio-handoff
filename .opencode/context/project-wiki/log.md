---
name: Operations Log
description: Append-only operational log for documentation and migration events.
type: project
---

# Operations Log

## [2026-05-06] infra | phase 9 direct argo rollout timing evidence

- Provisioned a fresh validation window with `/usr/bin/time -p ./infra/terraform/up.sh` (`real 25.36` seconds), then disabled root self-heal and pointed the portfolio app at validation branches for controlled timing capture.
- Created and pushed `validation/phase9-rollout-timing` (`b61ff095`) with a single deployment image-tag bump (`818ea7c...` -> `db20a63...`) to trigger a real GitOps rollout.
- Captured Argo operation timing directly from application status: `startedAt=2026-05-06T15:12:57Z`, `finishedAt=2026-05-06T15:13:21Z` (24 seconds total).
- Verified rollout outcome: `k3s kubectl -n portfolio rollout status deployment/portfolio` succeeded and deployment image resolved to `ghcr.io/juliomathis/portfolio:db20a63ca7e3e60aadc24e8da0a763919d91059c`.
- Verified live endpoint after rollout: `curl -I https://portfolio.178-105-89-214.nip.io` returned `HTTP/2 200`.
- Ended validation session with `/usr/bin/time -p ./infra/terraform/down.sh` (`Destroy complete`, `real 64.45` seconds).

## [2026-05-06] infra | phase 9 nip.io host-reconciler fix + live validation

- Implemented `k8s/manifests/portfolio/ingress-host-reconciler.yaml` and wired it into `k8s/manifests/portfolio/kustomization.yaml` as an Argo `PostSync` hook, plus `ignoreDifferences` on host fields in `k8s/apps/root.yaml`.
- Reproduced hook failures in a live window and fixed root causes: non-shell kubectl image and invalid dual-stack host construction; final hook resolves IPv4 from ingress status and patches configmap + ingress host fields.
- Validated Argo sync at revision `a33b710` shows hook success (`kind: Job`, `hookType: PostSync`, message `Reached expected number of succeeded pods`).
- Verified reconciled runtime state: `portfolio-ingress-config.data.host` and ingress rule host both set to `portfolio.178-105-89-214.nip.io`.
- Verified criterion endpoint: `curl -I https://portfolio.178-105-89-214.nip.io` returns `HTTP/2 200` with valid TLS.
- Ended validation session with `./infra/terraform/down.sh` (`Destroy complete`, `real 32.32` seconds).

## [2026-05-06] infra | phase 9 timed on-demand validation window

- Executed `/usr/bin/time -p ./infra/terraform/up.sh` with required runtime vars (`TF_VAR_ssh_public_key`, `TF_VAR_github_repo`) and recorded `real 28.21` seconds from zero state.
- Verified bootstrap readiness on node (`cloud-init status --wait`, `k3s kubectl get nodes -o wide`, `k3s kubectl get pods -A` all healthy).
- Probed `https://portfolio.178-105-89-214.nip.io`; endpoint progressed from connect-refused to TLS SAN mismatch (`curl: (60)`), so valid host certificate was not yet served.
- Confirmed ingress/certificate hostname remained templated as `portfolio.replace-with-dashed-ip.nip.io`, with cert-manager order/challenge bound to the placeholder host.
- Ran `./infra/terraform/down.sh` immediately after evidence capture; first attempt failed on missing required vars, rerun with explicit `TF_VAR_*` values succeeded (`Destroy complete`, `real 16.77` seconds).

## [2026-05-06] verify | phase 9 evidence capture (local gates + qmd)

- Switched to `feature/phase-9-evidence-capture` from latest `origin/main`; deleted merged kickoff branch `feature/phase-9-verification-signoff` locally/remotely.
- Local validation suite passed in this session:
  - `pnpm --dir app check`
  - `pnpm --dir app test`
  - `pnpm --dir app test:e2e`
  - `pnpm --dir app build`
  - `PUBLIC_FONT_DISPLAY=optional pnpm --dir app build`
  - `pnpm --dir app lhci`
- Lighthouse representative run summary from `app/lighthouse-reports/manifest.json`: performance `1.00`, accessibility `0.98`, best-practices `1.00`, SEO `1.00`.
- `qmd query "ArgoCD" -c portfolio-core-wiki -c portfolio-core-reference --no-rerank -C 20 -n 5` returned canonical wiki docs (`adr/002-gitops-argocd.md`, `operations.md`, `infrastructure.md`).
- Remaining sign-off items requiring additional windows/evidence: live nip.io TLS probe with infra up, timed `terraform apply` <=15 min session, and direct Argo rollout timing capture for image-bump <=3 min criterion.

## [2026-05-06] ops | phase 8 merge cleanup + phase 9 kickoff

- Confirmed PR #34 merged to `main` (`cd8f932`) and completed Phase 8 canonical runbook hardening scope.
- Switched to latest `origin/main`, created `feature/phase-9-verification-signoff`, and deleted merged Phase 8 branch `feature/phase-8-docs-hardening` locally/remotely.
- Synced phase-transition status across `README.md`, `AGENTS.md`, and `.opencode/context/project-intelligence/{navigation,business-domain,technical-domain,living-notes}.md`.

## [2026-05-06] docs | phase 8 canonical wiki hardening (architecture/testing/content)

- Expanded `architecture.md` from brief summary to explicit runtime/deploy/provisioning flows, invariants, and responsibility boundaries.
- Expanded `testing.md` with canonical command matrix, layer-specific scope (Vitest/Playwright/LHCI), and failure triage guidance.
- Expanded `content-authoring.md` with file-by-file ownership map, content-edit workflows, and type-change guardrails.
- Added handoff-ingestion workflow documentation in `content-authoring.md` and a Phase 9 sign-off evidence matrix in `operations.md`.
- Expanded `design-system.md` with token layer definitions, typography/layout rules, accessibility constraints, and style-change workflow.

## [2026-05-06] ops | phase 7 closeout + phase 8 kickoff prep

- Confirmed Phase 7 closeout merges on `main`: Dependabot PR #20 (`818ea7c`) followed by bot deploy-bump PR #32 (`ffce26d`) with single-file scope (`k8s/manifests/portfolio/deployment.yaml`).
- Created `feature/phase-8-documentation-signoff` from latest `origin/main` to start the Phase 8 documentation and sign-off preparation track.
- Hardened `.github/workflows/image.yml` fallback matching so deploy-bump PR fallback is used for both branch-protection rejections (`GH006`) and non-fast-forward race rejections (`fetch first`).
- Synced phase-transition status across `README.md`, `AGENTS.md`, and `.opencode/context/project-intelligence/{navigation,business-domain,technical-domain,living-notes}.md`.

## [2026-05-06] ci | phase 7 protected-main image workflow validation

- Investigated `Image` workflow failure on run `25431964338`: image build/push succeeded, but deploy bump failed at `git push origin HEAD:main` with `GH006` (`Changes must be made through a pull request.`).
- Shipped fallback automation in `.github/workflows/image.yml` via PR #23 (`dd410f8`) so bump logic opens a PR when direct push is blocked.
- Resolved fallback auth/permission issues through PR #26 (`de38267`) and PR #28 (`78de54c`), landing the working split: app token for git write path, `github.token` + `pull-requests: write` for `gh pr create`.
- Enabled repository Actions workflow permission gate (`can_approve_pull_request_reviews: true`) required for workflow-created PR operations.
- Triggered validation runs using app-path docs PRs #24 (`40993e4`), #27 (`2509b8f`), and #29 (`db20a63`) because `image.yml` is scoped to `on.push.paths: app/**`.
- Confirmed successful protected-main fallback on run `25432877022`: workflow created bot PR #30 (`bot/deploy-image-db20a63ca7e3e60aadc24e8da0a763919d91059c`), diff scope was only `k8s/manifests/portfolio/deployment.yaml`, and merged commit `9546fa5` updated image tag to immutable SHA `db20a63ca7e3e60aadc24e8da0a763919d91059c`.

## [2026-05-05] ops | phase 6 merge cleanup + phase 7 branch kickoff

- Confirmed PR #14 merged to `main` and fast-forwarded local `main`.
- Deleted merged Phase 6 branch `feature/phase-6-k8s-argocd-bootstrap-prep` locally and remotely.
- Created `feature/phase-7-ci-cd-github-actions-bot` from updated `main` to begin Phase 7 wiring.
- Synced canonical phase status docs across `README.md`, `AGENTS.md`, and `.opencode/context/project-intelligence/{navigation,business-domain,technical-domain,living-notes}.md`.

## [2026-05-05] infra | phase 6 live bootstrap validation window

- Ran on-demand validation window via `./infra/terraform/up.sh`, then verified bootstrap readiness (`cloud-init status --wait`, node `Ready`, core pods running).
- Diagnosed and fixed bootstrap blockers: Argo root app destination namespace omission (runtime patch) and missing `kube-system` destination in `AppProject: portfolio` (persisted in `infra/terraform/cloud-init.tftpl` and `k8s/bootstrap/argocd-appproject.yaml`).
- Validated cert-manager + issuer reconciliation and successful TLS issuance for `portfolio.<dashed-ip>.nip.io`.
- Built local portfolio image (`ghcr.io/juliomathis/portfolio:phase6-f3d8d2b`), imported into k3s runtime for this validation window, and confirmed `curl -I https://portfolio.178-105-89-214.nip.io` returns `HTTP/2 200`.
- Ended validation window with `./infra/terraform/down.sh` to return compute spend to zero.

## [2026-05-05] ops | phase 5 merge cleanup + phase 6 branch kickoff

- Confirmed PR #12 merged to `main` and fast-forwarded local `main`.
- Deleted merged Phase 5 branch `feature/phase-5-infrastructure-provisioning` locally and remotely.
- Created `feature/phase-6-k8s-argocd-bootstrap-prep` from updated `main` to begin Phase 6 preparation.

## [2026-05-05] docs | on-demand infra lifecycle runbook hardening

- Documented canonical on-demand lifecycle usage in `AGENTS.md`, `project-wiki/infrastructure.md`, and `project-wiki/operations.md`.
- Standardized operator workflow: `./infra/terraform/up.sh` before validation and `./infra/terraform/down.sh` immediately after.
- Added explicit token-handling and cost-control guidance to reduce accidental always-on spend.

## [2026-05-05] infra | phase 5 apply-destroy validation + on-demand lifecycle

- Ran `terraform apply` for Phase 5 validation; initial server create failed because `cx11` is unavailable in the selected region/account.
- Queried available server types, switched to `cx23`, and re-ran `terraform apply` successfully.
- Verified bootstrap readiness (`cloud-init status --wait`, k3s node Ready, core pods Running), then executed `terraform destroy` to stop ongoing compute cost.
- Added `infra/terraform/up.sh` and `infra/terraform/down.sh` for on-demand server lifecycle (spin up only when needed, tear down after verification).
- Updated defaults/docs for lifecycle safety (`server_type` default to `cx23`, Phase 5 marked complete, Phase 6 prep active).

## [2026-05-05] infra | phase 5 local plan validation

- Loaded local Hetzner token from operator-managed shell secret source and executed `terraform plan -input=false -refresh=false` in `infra/terraform/`.
- Plan result: create-only baseline (`hcloud_ssh_key`, `hcloud_firewall`, `hcloud_server`) with expected outputs; no apply executed.
- Updated canonical status docs to reflect that local `terraform init/fmt/validate/plan` is complete and `terraform apply` is a deliberate pending decision.

## [2026-05-05] infra | phase 5 terraform scaffolding baseline

- Added `infra/terraform/` baseline files: `versions.tf`, `backend.tf`, `main.tf`, `variables.tf`, `outputs.tf`, `cloud-init.tftpl`, `terraform.tfvars.example`, and local Terraform `.gitignore`.
- Installed Terraform 1.15.1 on the operator workstation and verified local non-mutating checks (`terraform init`, `terraform fmt -check`, `terraform validate`).
- Deferred token-gated `terraform plan` until Hetzner API token creation is unblocked.

## [2026-05-04] docs | phase 5 preparation sync

- Removed transient lookup artifacts under `.tmp/external-context/pnpm/` after Phase 4 documentation and validation work.
- Updated canonical status docs to mark Phase 4 containerization as implemented on branch and Phase 5 infrastructure provisioning prep as active (`README.md`, `AGENTS.md`, `.opencode/context/project-intelligence/{navigation,business-domain,technical-domain,living-notes}.md`).
- Aligned technical baseline note for container runtime image size to the validated `<50 MB` threshold used in Phase 4 checks.

## [2026-05-04] ops | branch cleanup + phase 4 kickoff sync

- Verified `docs/new_arci-followup` was fully merged into `main` (no commits left between branch and `origin/main`).
- Switched to latest `main`, created `feature/phase-4-containerization`, and deleted `docs/new_arci-followup` both locally and on remote.
- Updated runtime/docs context to mark Phase 4 as active (`README.md`, `AGENTS.md`, `.opencode/context/project-intelligence/{navigation,business-domain,technical-domain,living-notes}.md`).

## [2026-04-22] migrate | .opencode canonicalization started

- Approved migration design in `.opencode/context/project-intelligence/2026-04-22-opencode-only-agentic-docs-design.md`
- Started migration of raw docs and operational wiki into `.opencode/`
- Set legacy mode: keep `docs/` and `IMPLEMENTATION_PLAN.md` as temporary backup

## [2026-04-22] audit | phase 0-3 implementation review + status sync

- Audited repository implementation against `IMPLEMENTATION_PLAN.md` §16 (Phase 0-3).
- Result: implementation is largely complete; main issues were documentation/checklist drift, not missing Phase 2/3 code.
- Recorded deviation: Phase 0 initial-commit checklist text (`chore: initial scaffold with Karpathy three-layer docs`) does not exactly match reflog initial message (`chore: inital scaffold`). Accepted as historical deviation (no history rewrite), documented in `.opencode/reference/reference/phase-0-governance-audit-2026-04-22.md`.
- Synced phase status in canonical summary docs: `README.md` and `.opencode/context/project-intelligence/{navigation,business-domain,technical-domain,living-notes}.md`.
- Branch-protection policy remains externally configured; evidence capture process is documented in `.opencode/reference/reference/phase-0-governance-audit-2026-04-22.md`.

## [2026-04-22] audit | branch-protection evidence captured

- Executed `gh api repos/juliomathis/portfolio-handoff/branches/main/protection`.
- Stored raw API output at `.opencode/reference/reference/branch-protection-main-2026-04-22.json`.
- Updated `.opencode/reference/reference/phase-0-governance-audit-2026-04-22.md` checklist to complete Phase 0 governance evidence capture.
