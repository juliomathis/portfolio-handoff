# portfolio-handoff

Production implementation of the Claude Design portfolio handoff.

## Project docs

- Canonical summary docs: `.opencode/context/project-intelligence/`
- Canonical detailed docs: `.opencode/context/project-wiki/index.md`
- Canonical source references: `.opencode/reference/navigation.md`
- Legacy backup (temporary): `docs/` and `IMPLEMENTATION_PLAN.md`

## Phase status

Phases 0–9 are completed on `main` (including Phase 7 CI/CD wiring, Phase 8 canonical runbook hardening, and Phase 9 verification/sign-off evidence updates under `.opencode/`). `infra/terraform/` supports an on-demand lifecycle via `up.sh`/`down.sh` so cost-bearing servers run only when needed. For `v0.1.0` sign-off, criteria 1–7, 9, and 10 are evidenced as pass; criterion 8 (Phase 2 domain-swap content PR) is explicitly deferred until the first real domain migration window. For current task scope, use canonical docs under `.opencode/context/project-wiki/` and `.opencode/context/project-intelligence/`; treat `IMPLEMENTATION_PLAN.md` as a legacy baseline/checklist reference.

## Phase 7 CI/CD wiring (completed baseline)

- PR quality gate: `.github/workflows/ci.yml` runs `pnpm --dir app check`, `test`, `build`, `test:e2e`, and `lhci` on pull requests for `app/**` and CI workflow changes.
- Main deploy automation: `.github/workflows/image.yml` runs on `main` pushes for `app/**`, builds and pushes `ghcr.io/juliomathis/portfolio:<git-sha>`, then updates only `k8s/manifests/portfolio/deployment.yaml`.
- Deployment bump safety: image workflow short-circuits no-op reruns, hard-fails if staged changes include any path other than `k8s/manifests/portfolio/deployment.yaml`, and falls back to bot branch + PR when direct push fails due branch protection (`GH006`) or non-fast-forward races.
- Bot credentials: GitHub App token generation requires Actions secrets `PORTFOLIO_BOT_APP_ID` and `PORTFOLIO_BOT_PRIVATE_KEY`; GHCR push uses `GITHUB_TOKEN` with `packages: write`.
- Out of scope in Phase 7: do **not** add `.github/workflows/terraform.yml`; Terraform remains operator-run via `./infra/terraform/up.sh` and `./infra/terraform/down.sh`.

## Phase 8 documentation hardening (completed baseline)

- Canonical wiki pages for architecture/testing/content/design/operations were expanded to reviewer-grade runbooks.
- Operations runbook now includes a Phase 9 success-criteria evidence matrix.
- Handoff-ingestion workflow is documented under content authoring guidance.

## Phase 9 verification + sign-off (completed baseline)

- Verification evidence matrix is captured in `.opencode/context/project-wiki/operations.md`.
- Session-by-session validation evidence is logged in `.opencode/context/project-wiki/log.md`.
- Live nip.io TLS and direct Argo rollout timing evidence have been captured in on-demand infra windows.

## On-demand infrastructure lifecycle

- Start validation window: `./infra/terraform/up.sh`
- Stop cost-bearing resources: `./infra/terraform/down.sh`

`up.sh` resolves current public IP for SSH allow-listing and runs Terraform init/validate/plan/apply. Use `down.sh` immediately after tests to avoid idle spend.
