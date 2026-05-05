# portfolio-handoff

Production implementation of the Claude Design portfolio handoff.

## Project docs

- Canonical summary docs: `.opencode/context/project-intelligence/`
- Canonical detailed docs: `.opencode/context/project-wiki/index.md`
- Canonical source references: `.opencode/reference/navigation.md`
- Legacy backup (temporary): `docs/` and `IMPLEMENTATION_PLAN.md`

## Phase status

Phases 0–6 are implemented on `main` (including Phase 6 Kubernetes manifests + ArgoCD bootstrap baseline with live on-demand validation). `infra/terraform/` supports an on-demand lifecycle via `up.sh`/`down.sh` so cost-bearing servers run only when needed. Phase 7 (CI/CD wiring via GitHub Actions + GitHub App bot automation) is the current workstream. For current task scope, use canonical docs under `.opencode/context/project-wiki/` and `.opencode/context/project-intelligence/`; treat `IMPLEMENTATION_PLAN.md` as a legacy baseline/checklist reference.

## Phase 7 CI/CD wiring (current branch)

- PR quality gate: `.github/workflows/ci.yml` runs `pnpm --dir app check`, `test`, `build`, `test:e2e`, and `lhci` on pull requests for `app/**` and CI workflow changes.
- Main deploy automation: `.github/workflows/image.yml` runs on `main` pushes for `app/**`, builds and pushes `ghcr.io/juliomathis/portfolio:<git-sha>`, then updates only `k8s/manifests/portfolio/deployment.yaml`.
- Deployment bump safety: image workflow short-circuits no-op reruns and hard-fails if staged changes include any path other than `k8s/manifests/portfolio/deployment.yaml`.
- Bot credentials: GitHub App token generation requires Actions secrets `PORTFOLIO_BOT_APP_ID` and `PORTFOLIO_BOT_PRIVATE_KEY`; GHCR push uses `GITHUB_TOKEN` with `packages: write`.
- Out of scope in Phase 7: do **not** add `.github/workflows/terraform.yml`; Terraform remains operator-run via `./infra/terraform/up.sh` and `./infra/terraform/down.sh`.

## On-demand infrastructure lifecycle

- Start validation window: `./infra/terraform/up.sh`
- Stop cost-bearing resources: `./infra/terraform/down.sh`

`up.sh` resolves current public IP for SSH allow-listing and runs Terraform init/validate/plan/apply. Use `down.sh` immediately after tests to avoid idle spend.
