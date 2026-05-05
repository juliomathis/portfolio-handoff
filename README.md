# portfolio-handoff

Production implementation of the Claude Design portfolio handoff.

## Project docs

- Canonical summary docs: `.opencode/context/project-intelligence/`
- Canonical detailed docs: `.opencode/context/project-wiki/index.md`
- Canonical source references: `.opencode/reference/navigation.md`
- Legacy backup (temporary): `docs/` and `IMPLEMENTATION_PLAN.md`

## Phase status

Phases 0–5 are implemented on the active branch (including Phase 5 infrastructure provisioning baseline). `infra/terraform/` now supports an on-demand lifecycle via `up.sh`/`down.sh` so cost-bearing servers run only when needed. Phase 6 (Kubernetes manifests + ArgoCD bootstrap prep) is the current workstream. For current task scope, use canonical docs under `.opencode/context/project-wiki/` and `.opencode/context/project-intelligence/`; treat `IMPLEMENTATION_PLAN.md` as a legacy baseline/checklist reference.

## On-demand infrastructure lifecycle

- Start validation window: `./infra/terraform/up.sh`
- Stop cost-bearing resources: `./infra/terraform/down.sh`

`up.sh` resolves current public IP for SSH allow-listing and runs Terraform init/validate/plan/apply. Use `down.sh` immediately after tests to avoid idle spend.
