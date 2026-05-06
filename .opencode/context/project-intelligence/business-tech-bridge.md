<!-- Context: project-intelligence/bridge | Priority: high | Version: 2.1 | Updated: 2026-05-06 -->

# Business ↔ Tech Bridge

> **Source of truth:** `../project-wiki/index.md`. This file summarizes for agents; the wiki is canonical.

> How each infrastructure choice serves the portfolio-as-artifact goal. This is the "why" layer for reviewer-facing conversations.

> **Canonical source:** \.opencode/context/project-wiki/ (use specific pages there for authoritative detail).

## Quick Reference

- **Purpose**: Explain to a reviewer why the infra looks the way it does
- **Core insight**: The repo itself is the portfolio. Every infra choice is a decision a reviewer will see.
- **Update when**: A new trade-off is accepted or a reviewer asks "why is this like this?"

## The core mapping

| Portfolio goal | Technical choice | Why this mapping |
|----------------|------------------|------------------|
| Demonstrate DevOps/SRE judgment | k3s on Hetzner CX23 (not Vercel) | Infra IS the demo. Managed platforms hide the interesting choices. |
| Demonstrate GitOps practice | ArgoCD with scoped `AppProject` | Default `default` project is a red flag to any reviewer. |
| Demonstrate secret hygiene | SOPS + age + KSOPS in Phase 2 | No plaintext secrets in git, no external KMS dependency. |
| Demonstrate CI/branch-protection discipline | GitHub App bot + `image.yml` protected-main fallback PR flow + single-path staged-diff guard | Keep strict PR-only `main` protection while preserving automated, auditable deployment bumps. |
| Demonstrate testing discipline | Vitest + Playwright + Lighthouse CI | "Mid polish" is disciplined without bloat. |
| Demonstrate cost awareness | CX23 baseline, public GHCR (free), nip.io (free) | Shows judgment: match tool to scale, defer spend until Phase 2. |
| Edit content without touching components (success criterion 5) | Typed `app/src/content/*.ts` + `lib/types.ts` contract | Separates the "author" concern from the "designer/dev" concern. |
| Reviewable in ≤15 min | Full `terraform apply` → live site in ≤15 min | A reviewer can clone, provision, and see the site before interest wanes. |

## Key feature ↔ business mappings

### Feature: Single React island (`ProjectFilter.tsx`)

**Business context:** Lighthouse perf ≥90 and fast mobile load are required. SPA-grade JS would tank these.
**Technical:** 95% static HTML. Only the filter hydrates (`client:visible`). Mobile nav is native `<details>` — zero JS.
**Trade-off considered:** SPA (Next.js) — rejected, over-engineered for single page. Vanilla HTML — rejected, filter UX too fiddly without React.
**Reviewer signal:** Candidate knows when *not* to ship React.

### Feature: Scoped `AppProject` (not `default`)

**Business context:** The repo is demo material. A default-project ArgoCD setup would be the first thing a GitOps reviewer flags.
**Technical:** `AppProject: portfolio` with explicit `sourceRepos`, `destinations`, `clusterResourceWhitelist`. Costs ~40 lines of YAML.
**Reviewer signal:** Candidate understands ArgoCD's security model, not just its happy path.

### Feature: GitHub App bot for CI → main

**Business context:** Branch protection on `main` is table stakes. CI still needs to commit image tag bumps.
**Technical:** `image.yml` commits the bump with a GitHub App installation token, attempts direct `main` push, then falls back to `bot/deploy-image-<sha>` + PR creation using `github.token`; staged-diff guard limits changes to `k8s/manifests/portfolio/deployment.yaml`.
**Trade-off considered:** Keep app bypass actor on `main` (not available in this repo), deploy key/PAT (poor audit boundary), or weaken branch protection (rejected).
**Reviewer signal:** Candidate preserves PR-only branch protection and still closes the automation loop with an auditable fallback.

### Feature: KSOPS on custom `argocd-repo-server` image (Phase 2)

**Business context:** Phase 2 adds a Cloudflare API token as a cluster secret. Must remain GitOps-native.
**Technical:** Custom image with pinned `ksops` binary + age Secret + `kustomize.buildOptions: --enable-alpha-plugins --enable-exec`. Decrypts at manifest-gen time, never writes plaintext.
**Trade-off accepted:** Widened blast radius if repo compromised. Mitigated by branch protection + CODEOWNERS + scoped App + pod egress limits + Phase 3 narrowing path.
**Reviewer signal:** Candidate knows sealed-secrets, External Secrets Operator, and argocd-vault-plugin — and chose KSOPS for concrete reasons, documenting the trade-off in `../project-wiki/operations.md`.

## Trade-off decisions (where business and tech pulled opposite)

| Situation | Business wanted | Tech wanted | Chose | Why |
|-----------|-----------------|-------------|-------|-----|
| Phase 1 domain | Real domain + brand | Free nip.io | **nip.io first, swap in Phase 2** | Test full pipeline before spending; document swap as runbook |
| Cluster size | Multi-node HA | Single-node cheap | **Single-node** | Portfolio scale; HA is ceremony without audience |
| Analytics | Show visitor metrics | Ship sooner | **Defer to post-ship** | Analytics without traffic is noise |
| Observability | Full Prom+Grafana+Loki | Scrape annotations only | **Annotations in P1, full stack = P3** | Avoid showcasing underused stack |

## Common reviewer questions (and the answer)

- **"Why k8s for one page?"** → Infra is the portfolio artifact (see `../project-wiki/index.md`). Vercel hides what the reviewer wants to see.
- **"Why not managed k8s?"** → Cost + learning signal. A low-cost single-node CX23 keeps spend aligned with portfolio scale.
- **"Why two phases for DNS?"** → Test the full TLS/ingress pipeline on free DNS before committing to a domain. Cheap insurance.
- **"Why not SPA?"** → Perf budget + JS-as-last-resort discipline. One island, native `<details>`, zero over-hydration.
- **"KSOPS trade-off?"** → Known, documented in `../project-wiki/operations.md`, mitigated by 6 compensating controls, and has a narrowing path for Phase 3.

## Related Files

- [business-domain.md](business-domain.md) — the goals
- [technical-domain.md](technical-domain.md) — the implementation
- [decisions-log.md](decisions-log.md) — the 18 decisions
- `../project-wiki/index.md`, `../project-wiki/infrastructure.md`, and `../project-wiki/operations.md` — canonical framing
