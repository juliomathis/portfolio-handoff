# AGENTS.md — portfolio-handoff

Project-level runtime guidance for AI agents working in this repository.

## Canonical documentation

- Canonical summaries: `.opencode/context/project-intelligence/`
- Canonical detailed docs: `.opencode/context/project-wiki/index.md`
- Canonical source references: `.opencode/reference/navigation.md`
- Legacy backup (read-only unless explicitly requested): `docs/` and `IMPLEMENTATION_PLAN.md`

When legacy docs conflict with `.opencode/`, treat `.opencode/` as source of truth.

## Context-first loading order

Load in this order before non-trivial changes:

1. `.opencode/context/navigation.md`
2. `.opencode/context/project-intelligence/navigation.md`
3. `.opencode/context/project-intelligence/technical-domain.md`
4. `.opencode/context/project-intelligence/living-notes.md`
5. `.opencode/context/project-wiki/index.md` (then topic pages as needed)

For standards/workflows, load from `.opencode/context/core/navigation.md`.

## Task → standards mapping

- Code edits: `.opencode/context/core/standards/code-quality.md`
- Test work: `.opencode/context/core/standards/test-coverage.md`
- Documentation: `.opencode/context/core/standards/documentation.md`
- Analysis/audit: `.opencode/context/core/standards/code-analysis.md`
- Reviews: `.opencode/context/core/workflows/code-review.md`
- Delegation: `.opencode/context/core/workflows/task-delegation.md`

## Repository shape (current)

- `app/` — Astro + React-islands application (Phases 0–6 complete; Phase 7 wiring active)
- `.opencode/context/` — canonical project intelligence + wiki
- `.opencode/reference/` — immutable handoff/reference artifacts
- `infra/terraform/` — Phase 5 baseline complete on this branch (on-demand `up.sh`/`down.sh` lifecycle)
- `k8s/` — Phase 6 bootstrap/apps/manifests baseline completed and merged
- `.github/workflows/` — Phase 7 target surface (workflow authoring now in scope)

## Current phase focus

- Active workstream: **Phase 7 — CI/CD wiring (GitHub Actions + GitHub App bot)**
- Current state in `infra/terraform/` + `k8s/`: on-demand lifecycle scripts plus Phase 6 bootstrap/manifests are validated and merged
- Keep Phase 8+ surfaces (Karpathy docs and final sign-off) out of scope until Phase 7 is complete

## On-demand infrastructure lifecycle (Phase 5 baseline)

- Goal: keep cost-bearing Hetzner servers off unless actively validating infrastructure.
- Default operator workflow:
  1. `./infra/terraform/up.sh` to create infrastructure for a validation session
  2. run validation checks
  3. `./infra/terraform/down.sh` immediately after tests to stop spend
- `up.sh` behavior:
  - sources token from `~/.config/portfolio-handoff/secrets.env` (expects `TF_VAR_hcloud_token`)
  - detects current public IPv4 and injects `admin_ip_cidr=<current_ip>/32` for SSH safety
  - runs `terraform init`, `terraform fmt -check`, `terraform validate`, `terraform plan`, `terraform apply`
- `down.sh` behavior:
  - sources token from `~/.config/portfolio-handoff/secrets.env`
  - runs `terraform destroy -auto-approve`
- Never commit secrets (`terraform.tfvars` remains untracked; prefer environment-based token loading).

## Execution cadence

- Continue across subtasks within a phase without stopping for per-task confirmation.
- Pause only when:
  1. reaching a phase boundary,
  2. a decision/scope change is required,
  3. a hard error or validation failure requires user input.
- Do not interrupt momentum with “continue?” prompts between dependent subtasks.
- If the user explicitly asks to pause, follow that request immediately.

## Phase transition checklist (required)

Before moving from one phase to the next:

1. Sync phase status across `README.md`, `AGENTS.md`, `.opencode/context/project-intelligence/{navigation,business-domain,technical-domain,living-notes}.md`, and `.opencode/context/project-wiki/log.md`.
2. Ensure the active phase branch has an open PR; if a previous PR was closed, create a new PR from the current branch.
3. After merge, switch to latest `main`, create the next phase branch from `main`, and clean merged branches locally/remotely.

## Validation commands

Run from repo root:

- `pnpm --dir app check`
- `pnpm --dir app test`
- `pnpm --dir app test:e2e`
- `pnpm --dir app build`
- `pnpm --dir app lhci` (local quality gate)

## Generated artifacts policy

Do not commit transient outputs from local validation runs:

- `app/.lighthouseci/`
- `app/lighthouse-reports/`
- `app/test-results/`
- `app/playwright-report/`

Committed visual baselines under `app/tests/e2e/*-snapshots/` are intentional.
