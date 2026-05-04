<!-- Context: project-intelligence/technical | Priority: high | Version: 2.3 | Updated: 2026-05-04 -->

# Technical Domain

> **Source of truth:** `../project-wiki/architecture.md`, `../project-wiki/deployment.md`, `../project-wiki/infrastructure.md`, `../project-wiki/operations.md`, `../project-wiki/testing.md`, and `../project-wiki/index.md`. This file is an agent-facing summary.

> **Canonical source:** \.opencode/context/project-wiki/ (use specific pages there for authoritative detail).

## Quick Reference

- **Purpose**: Understand the stack, architecture, and technical contracts
- **Update when**: Stack changes, new phase completes, or an ADR is added

## Primary Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Language | TypeScript (strict) | 5.9.x | Catches content→component wiring bugs |
| Framework | Astro + React islands | Astro 6, React 19 | 95% static + one hydrated filter island |
| Styling | Vanilla CSS + PostCSS | autoprefixer, nesting, custom-media | Matches prototype, no lock-in |
| Runtime | nginx:alpine | — | Tiny, mature, trivial config |
| Container | Docker (multi-stage, multi-arch buildx) | — | Standard |
| Registry | GHCR | — | GitHub-native, free for public repos |
| CI | GitHub Actions | — | Native integration |
| Cluster | k3s (single-node) | v1.30+ | Lightweight, cheapest real k8s |
| Host | Hetzner CX11 VPS | — | ~$4/mo, educational, full control |
| GitOps | ArgoCD | — | Declarative, k8s-native, high resume signal |
| TLS | cert-manager + Let's Encrypt | — | Automatic, standard |
| DNS (P1) | `nip.io` wildcard (dash form) | — | No domain purchase needed to test full pipeline |
| DNS (P2) | Cloudflare | — | DNS-01 challenge for wildcard certs |
| Secrets | SOPS + age | — | GitOps-compatible, in-cluster only |
| Secrets runtime | KSOPS on custom `argocd-repo-server` image | — | Decrypts at manifest generation time |
| IaC | Terraform (local state, Phase 1) | — | Remote state deferred to Phase 1.5 |
| Testing | Vitest (unit) + Playwright (E2E) + Lighthouse CI | — | "Mid polish level" per `../project-wiki/testing.md` |

## Architecture (see `../project-wiki/architecture.md`)

```
Visitor → HTTPS :443
  → Hetzner CX11 (public IP)
    → Cloud Firewall (80/443 world, 22/6443 admin)
    → k3s
      → ingress-nginx (hostNetwork on node IP)
      → portfolio Service (ClusterIP :80)
      → portfolio Deployment (nginx:alpine serving /dist)
      → cert-manager (HTTP-01 in P1, DNS-01 in P2)
      → ArgoCD (watches k8s/apps/, reconciles all)

CI path:
Author → main → GitHub Actions image.yml
  → astro build → docker buildx → push ghcr.io/<user>/portfolio:<sha>
  → sed -i deployment.yaml → git push via GitHub App token (bypasses branch protection)
  → ArgoCD detects drift → rolling update → readiness → new pod live (~2.5 min total)
```

## Three concerns, hard boundaries (see `../project-wiki/architecture.md`)

| Concern | Lives in | Cadence |
|---------|----------|---------|
| Content (copy, projects, links) | `app/src/content/*.ts` | weekly |
| Presentation (markup, styles) | `app/src/components/`, `pages/`, `styles/` | per handoff (~quarterly) |
| Infrastructure (cluster, pipeline, manifests) | `infra/`, `k8s/`, `.github/workflows/` | rarely after bootstrap |

**Contract:** components never contain copy, only types and slots. Types live in `app/src/lib/types.ts`. This is what makes the "edit content without touching components" success criterion real.

## Repository structure (canonical, from `../project-wiki/index.md`)

```
portfolio-handoff/
├─ README.md, LICENSE, CLAUDE.md, .opencode/context/project-wiki/index.md
├─ .editorconfig, .gitignore, .gitattributes, .sops.yaml
├─ app/                        ← Astro application (Phases 1–4 complete; Phase 5 prep active)
│  ├─ src/{pages,layouts,components,islands,content,styles,lib}/
│  ├─ tests/{unit,e2e}/
│  ├─ Dockerfile, nginx.conf   ← Phase 4
│  └─ package.json             ← Astro 6, React 19, postcss-*
├─ infra/terraform/            ← Phase 5
├─ k8s/
│  ├─ bootstrap/               ← ArgoCD install + AppProject + root app
│  ├─ apps/                    ← one Application per stack (cert-manager, ingress-nginx, portfolio, cert-manager-issuers)
│  └─ manifests/               ← plain kustomize for portfolio; cert-manager issuer configs
├─ .github/workflows/          ← ci.yml, image.yml (NO terraform.yml in Phase 1)
└─ .opencode/{reference,context/project-wiki}/            ← canonical docs layout
```

## Current state vs plan

**Done (Phase 0 + 1 + 2 + 3):**
- Repo initialized, root scaffolding
- `.opencode/reference/raw-handoff/2026-04-19/` imported (triptych + supporting prototypes)
- Astro 6 + React 19 installed in `app/`
- `app/src/{content,layouts,lib,pages,styles}/` scaffolded per `../project-wiki/index.md`
- `app/src/lib/types.ts` — the content contract
- `app/src/content/*.ts` — all prototype data ported
- Styles: `tokens.css`, `reset.css`, `typography.css`, `global.css`, `breakpoints.css`
- `Base.astro` layout + composed `index.astro` page
- Component port complete in `app/src/components/*.astro`
- One React island implemented in `app/src/islands/ProjectFilter.tsx`
- Phase 2 presentation styling in `app/src/styles/phase2.css`
- Test stack configured: `vitest.config.ts`, `playwright.config.ts`, `lighthouserc.json`
- Unit and E2E suites present in `app/tests/{unit,e2e}/` with responsive snapshots committed
- Phase 4 containerization assets added: `app/Dockerfile`, `app/nginx.conf`, `app/.dockerignore` with local runtime verification

**In progress (Phase 5 preparation):** `infra/terraform/` scaffolding and local `terraform init/plan` workflow design.

**Not yet:** any `infra/` or `k8s/` directory, `.github/workflows/`.

## Critical technical contracts

1. **Content types are the boundary.** `app/src/lib/types.ts` defines `Project`, `HeroColumn`, etc. Any component prop that takes content MUST use these types. CI runs `tsc --noEmit`.
2. **One React island only.** `islands/ProjectFilter.tsx` is the sole client-hydrated component. Mobile nav is `<details>`/`<summary>` — zero JS. Adding another island requires an ADR.
3. **Image tags are immutable SHAs.** `ghcr.io/<user>/portfolio:<git-sha>`. No `latest`. `imagePullPolicy: Always` paired with digest match for cheap hardening.
4. **`AppProject: portfolio`** (scoped), not `default`. Hardcoded allow-lists for sourceRepos and clusterResourceWhitelist per `../project-wiki/deployment.md`.
5. **Kubeconfig is `0600` root-only** on the node. `sudo` required for `kubectl`. Small UX cost, real hardening.
6. **CI → main goes through a GitHub App** (`portfolio-bot`), not `GITHUB_TOKEN` or a deploy key — those do NOT bypass branch protection. See `../project-wiki/deployment.md`.
7. **Terraform is local-only in Phase 1.** Remote state is Phase 1.5. CI has NO `terraform.yml` (v4.6 unblock).
8. **KSOPS is the Phase 2 secret runtime.** Custom `argocd-repo-server` image with pinned `ksops` binary + age Secret + `kustomize.buildOptions: --enable-alpha-plugins --enable-exec`. Security trade-off documented in `../project-wiki/operations.md`.

## Responsive breakpoints (see `../project-wiki/architecture.md`)

- 375px (mobile) — hamburger nav (native `<details>`), stacked triptych
- 768px (tablet) — adjusted grid
- 1280px (desktop) — prototype target, full triptych

Shared via `@custom-media` at-rules in `breakpoints.css` (requires `postcss-custom-media`).

## Performance targets

- Lighthouse perf ≥90, a11y ≥95, best-practices ≥95, SEO ≥95 (enforced in CI)
- Image size baseline (Phase 4 runtime): < 50 MB
- Push-to-live: ~2.5 min
- `terraform apply` to live site: ≤15 min from zero

## Related Files

- [business-domain.md](business-domain.md) — why we're doing this
- [decisions-log.md](decisions-log.md) — the 18 decisions
- [business-tech-bridge.md](business-tech-bridge.md) — why infra choices serve business
- [living-notes.md](living-notes.md) — current state + open issues
- `../project-wiki/architecture.md`, `../project-wiki/deployment.md`, `../project-wiki/infrastructure.md`, `../project-wiki/operations.md`, `../project-wiki/testing.md`, `../project-wiki/index.md` — canonical technical references
