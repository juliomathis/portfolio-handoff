<!-- Context: project-intelligence/notes | Priority: high | Version: 2.6 | Updated: 2026-05-06 -->

# Living Notes

> **Source of truth:** `../project-wiki/index.md`. This file summarizes for agents; the wiki is canonical.

> Active state, open questions, and notes that don't fit elsewhere. Keep current. Archive resolved items.

> **Canonical source:** \.opencode/context/project-wiki/ (use specific pages there for authoritative detail).

## Quick Reference

- **Purpose**: Current state snapshot + open items + gotchas
- **Update**: When a phase completes, when an issue lands, when a question resolves

## Current state (2026-05-06)

**Completed:**
- ✅ **Phase 0** — Repo init, root scaffolding, `.opencode/reference/raw-handoff/2026-04-19/` imported, branch protection on `main`.
- ✅ **Phase 1** — Astro 6 + React 19 in `app/`, TypeScript strict, PostCSS toolchain (autoprefixer + nesting + custom-media), all `app/src/{content,layouts,lib,pages,styles}/` scaffolded, `Base.astro` + shell `index.astro`, content contracts hardened (PRs #4, #5, #6 on the working branch).
- ✅ **Phase 2** — Component port complete (`app/src/components/*.astro` + `islands/ProjectFilter.tsx`) with responsive tuning in `app/src/styles/phase2.css`.
- ✅ **Phase 3** — Testing stack in place (Vitest + Playwright + Lighthouse CI) with unit/E2E suites and committed responsive snapshots.
- ✅ **Phase 4** — Containerization implemented on branch (`app/Dockerfile`, `app/nginx.conf`, `app/.dockerignore`) with local Docker build/run/health/header verification and a 50MB runtime baseline gate.
- ✅ **Phase 5** — Terraform infrastructure provisioning baseline implemented (`infra/terraform/`), including validated local apply/destroy flow and on-demand lifecycle scripts (`up.sh`, `down.sh`).
- ✅ **Phase 6** — Kubernetes manifests + ArgoCD bootstrap baseline implemented (`k8s/bootstrap`, `k8s/apps`, `k8s/manifests`), live-validated in an on-demand window, and merged via PR #14.
- ✅ **Phase 7** — CI/CD wiring completed (`.github/workflows/{ci,image}.yml`) with protected-main deploy-bump fallback validated and merged (`#30`, `#32`).

**In flight:**
- 🚧 **Phase 8** — Canonical documentation hardening + verification/sign-off preparation.

**Branch state:** `main` includes the full Phase 7 remediation sequence for protected-branch image bumps (`#23`, `#24`, `#26`, `#27`, `#28`, `#29`, `#30`, `#32`). Phase 8 kickoff branch: `feature/phase-8-documentation-signoff`.

## Open questions (deferred, from `../project-wiki/index.md`)

| # | Question | Decide by | Status |
|---|----------|-----------|--------|
| 1 | Hetzner region (`nbg1` default vs `ash`/`hil`) | Before next production apply window | Open |
| 2 | ArgoCD admin password — default or age-encrypted | Phase 8 | Deferred, port-forward is fine for P1 |
| 3 | Analytics tool (Plausible/GoatCounter/Umami/none) | Post-ship | Deferred |
| 4 | Case Study page — Phase 2.5? | After domain swap | Deferred |
| 5 | Self-hosted fonts vs Google Fonts | Phase 3 if Lighthouse perf < 95 | Deferred |
| 6 | Dark mode toggle | Only if reviewer feedback | Deferred |
| 7 | Cross-browser test matrix (Firefox/WebKit) | Phase 3+ | Deferred |
| 8 | Repo visibility (public vs private) | Before first push | Recommend public |

## Accepted trade-offs (active, from `../project-wiki/operations.md`)

These are not problems to fix — they're known compromises kept with intent. Flagged here so agents don't "help" by changing them.

- **Single-node k3s = SPOF** — accepted, Vercel fallback documented.
- **Bootstrap not fully git-only once Phase 2 secrets exist** (age key must be manually restored before sync) — accepted at this scale, runbook step documented.
- **Custom `argocd-repo-server-ksops` image maintenance** — accepted, pinned and rebuilt with ArgoCD upgrades.
- **Cloudflare token split across Terraform + SOPS in Phase 2** — accepted, one cutover checklist covers both.
- **KSOPS blast radius** — accepted with 6 compensating controls; Phase 3 narrowing path documented.

## Known risks being monitored (from `../project-wiki/operations.md`)

| Risk | Likelihood | Monitoring |
|------|------------|------------|
| k3s OOM on CX23 under full stack | Med | `kubectl top` after Phase 6 bootstrap; scale up if sustained >75% |
| LE HTTP-01 fails on first issue during cloud-init | Low | cloud-init waits for ingress; manual `kubectl delete certificate` retry |
| CI bot commit loop | Low | Path filters + staged-diff guard + successful protected-main fallback validation (`Image` run `25432877022`) |
| New Claude Design handoff breaks content contract | Med | `tsc --noEmit` in CI surfaces the break |
| Lighthouse CI flakes on cold runs | Med | `numberOfRuns: 3` averages |

## Gotchas for agents working here

1. **Do NOT touch `.opencode/context/project-wiki/index.md` without asking** — it's the canonical wiki index. Suggest changes, don't apply them.
2. **`.opencode/reference/raw-handoff/2026-04-19/*` is immutable** — original Claude Design export, reference only.
3. **Content types are load-bearing** — `app/src/lib/types.ts` is the contract between content and components. Changing types = breaking contract = CI catches it but you still need to update content files.
4. **One React island rule** — `islands/ProjectFilter.tsx` is the ONLY allowed client-hydrated component. Mobile nav uses `<details>`, no JS. Violating this needs an ADR.
5. **No `.github/workflows/terraform.yml` in Phase 1** — Terraform is local-only until Phase 1.5 remote state. Don't "add CI for completeness."
6. **Kubeconfig is `0600` on the node** — `sudo` required for `kubectl`. Documented UX cost; don't "fix" it.
7. **Image tags are git SHAs, never `latest`** — paired with `imagePullPolicy: Always`.
8. **Use on-demand infra lifecycle** — start with `./infra/terraform/up.sh`, stop with `./infra/terraform/down.sh` after validation to avoid idle server cost.

## Patterns worth preserving

- **Frontmatter-based typed content** (`app/src/content/*.ts` with types from `lib/types.ts`) — any new content type follows this pattern.
- **MVI for context docs** — every `.opencode/context/**/*.md` file stays under 200 lines.
- **ADR format** — Nygard body + `type: project` frontmatter, qmd-queryable.

## Recent activity (git log summary)

- 2026-05-06: Merged Dependabot app dependency PR #20 and subsequent bot deploy-bump PR #32; `main` now carries image tag `ghcr.io/juliomathis/portfolio:818ea7c37e97ecedf4ea6f6e076b925ef1fb30d3` in `k8s/manifests/portfolio/deployment.yaml`.
- 2026-05-06: Validated `Image` workflow on `main` with successful run `25432877022`; direct push to protected `main` was rejected as expected (`GH006`), fallback branch/PR automation succeeded, and bot PR #30 merged with only `k8s/manifests/portfolio/deployment.yaml` changed.
- 2026-05-06: Iterated Phase 7 post-merge fixes across PRs #23, #26, and #28 to stabilize protected-main deploy bump behavior, including token path split (`APP_TOKEN` for git push, `github.token` for `gh pr create`) and workflow `pull-requests: write` permission.
- 2026-05-06: Triggered `Image` validations via app-path docs PRs #24, #27, and #29 because `image.yml` is scoped to `on.push.paths: app/**` and has no `workflow_dispatch` trigger.
- 2026-05-05: Merged PR #14 (Phase 6 bootstrap hardening + live validation evidence), switched to latest `main`, deleted `feature/phase-6-k8s-argocd-bootstrap-prep` locally/remotely, and created `feature/phase-7-ci-cd-github-actions-bot` for Phase 7 wiring.
- 2026-05-05: Executed Phase 6 live bootstrap validation window (`up.sh`), fixed Argo bootstrap blockers (`AppProject` destination scope + root destination namespace), confirmed TLS issuance and `HTTP/2 200` on `portfolio.178-105-89-214.nip.io`, then tore infra down with `down.sh`.
- 2026-05-05: Began Phase 6 scaffold (`k8s/bootstrap`, `k8s/apps`, `k8s/manifests`), validated manifest rendering via `kubectl kustomize`, and used on-demand infra windows (`up.sh`/`down.sh`) for safe bootstrap checks.
- 2026-05-05: Merged PR #12 (Phase 5 baseline + on-demand infra lifecycle), switched to latest `main`, deleted `feature/phase-5-infrastructure-provisioning` locally/remotely, and created `feature/phase-6-k8s-argocd-bootstrap-prep` for Phase 6 preparation.
- 2026-05-05: Executed `terraform apply`, verified cloud-init and k3s readiness, then executed `terraform destroy` to return cost-bearing resources to zero.
- 2026-05-05: Added on-demand infrastructure lifecycle scripts (`infra/terraform/up.sh`, `infra/terraform/down.sh`) so servers run only when needed.
- 2026-05-05: Added `infra/terraform/` baseline files (`versions.tf`, `backend.tf`, `main.tf`, `variables.tf`, `outputs.tf`, `cloud-init.tftpl`, `.gitignore`, `terraform.tfvars.example`) and completed local `terraform init/fmt/validate/plan`.
- 2026-05-04: Cleaned transient `.tmp/external-context/pnpm/` artifacts, promoted Phase 4 to completed-on-branch status, and updated canonical runtime/context docs to prepare for Phase 5.
- 2026-05-04: Verified docs follow-up branch fully merged into `main`, deleted `docs/new_arci-followup` locally/remotely, created `feature/phase-4-containerization`, and updated runtime/context docs for Phase 4 kickoff.
- 2026-04-22: Phase 0–3 implementation audit completed; canonical status docs synced to match repository state.
- `760aa32` Merge PR #6 (Phase 1 review hardening)
- `f68f430` fix(phase1): stabilize content contracts and canonical metadata ownership
- `c46dabc` Merge PR #5 (Phase 1 contract/metadata alignment)
- `15e9745` fix(phase1): align content contracts and metadata with plan
- `fee45fa` Merge PR #4 (Phase 1 Astro scaffold)

## Archive

_(No resolved items yet — this section grows as phases complete and issues are fixed.)_

## Onboarding for a new agent/session

1. Read `navigation.md` (sibling file).
2. Read `business-domain.md` for goals.
3. Read `technical-domain.md` for stack + current state.
4. Read this file for open items + gotchas.
5. Read `../project-wiki/index.md` and relevant topic pages (`architecture.md`, `deployment.md`, `infrastructure.md`, `operations.md`, `testing.md`) for canonical detail on the specific area you're touching.

## Related Files

- [navigation.md](navigation.md) — entry point
- [business-domain.md](business-domain.md) — goals
- [technical-domain.md](technical-domain.md) — stack + state
- [decisions-log.md](decisions-log.md) — the 18 decisions
- [business-tech-bridge.md](business-tech-bridge.md) — infra ↔ portfolio-artifact mapping
- `../project-wiki/index.md` — canonical wiki index
