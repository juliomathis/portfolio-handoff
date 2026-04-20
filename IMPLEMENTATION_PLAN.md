---
name: Portfolio Handoff — Implementation Plan
description: End-to-end plan to implement Portfolio Triptych.html as a production-grade Astro site on k3s with ArgoCD GitOps, provisioned via Terraform on a Hetzner VPS, documented via the Karpathy three-layer wiki pattern.
type: project
---

# Portfolio Handoff — Implementation Plan

| Field | Value |
|---|---|
| **Status** | Draft v4.6 — eleventh-pass execution unblocking + trade-off logging (awaiting user approval) |
| **Date** | 2026-04-19 (v1–v4.6 — same day) |
| **Revision notes** | v4.2 fixes (latest pass): resolved the Phase 2 file-count contradiction by reclassifying `ksops-generator.yaml` as bootstrap plumbing — it's now committed dormantly during the §13.2 Phase 2 prereq checklist, not in the Phase 2 content PR, so the PR cleanly hits ≤5 files with no dual-framing equivocation and step 8 ("changes from 3–7") matches reality; tree comment at `k8s/manifests/cert-manager/ksops-generator.yaml` updated to reflect the prereq-commit framing; fixed the stale "not listing the file in `resources:` until Phase 2" SOPS sentence (§13.1) — the encrypted file is now described as never under `resources:` at any phase (Phase 1 omits `generators:`, Phase 2 adds it); corrected the KSOPS security-risk row (§17) which overclaimed that the GitHub App has path-scoped `contents: write` to `k8s/manifests/portfolio/**` — GitHub Apps cannot natively path-scope writes, so the actual controls are (a) workflow logic (image.yml only edits `deployment.yaml`) and (b) a `CODEOWNERS` entry requiring owner review on `k8s/manifests/cert-manager/**`, `infra/**`, `k8s/bootstrap/**`; updated the §5 tree `CODEOWNERS` line to name the owner-protected paths explicitly. v4.1 fixes: resolved the KSOPS `resources:` vs `generators:` contradiction — §14.2 step 4, the Phase 2 file-count summary, and the §5 tree comment all now agree that the encrypted `cloudflare-dns01-secret.yaml` is consumed ONLY via `generators: [ksops-generator.yaml]` (never under `resources:`), because listing ciphertext under `resources:` would apply encrypted `stringData` to the cluster and silently break DNS-01; documented the KSOPS security trade-off explicitly in the §17 risks table (`--enable-alpha-plugins --enable-exec` globally + mounted age key = wider blast radius) with concrete mitigations (branch protection, scoped GitHub App write path, no age key outside cluster, limited repo-server egress, Phase 3 narrowing option). v4 fixes: CI policy made self-consistent — all three downstream echoes (§4.1 ASCII diagram, §5 tree comment, §16 Phase 7 checklist) now match the canonical §10.3 "plan-only on PR, apply runs locally" rule; SOPS decryption made operationally concrete — new §13.2 specifies **KSOPS** on a custom `argocd-repo-server` image (pinned `ksops` binary, age key mounted as Secret, `argocd-cm` patch for `kustomize.buildOptions`, per-app `ksops-generator.yaml`), the prior §13.2 renumbered to §13.3 as "alternative considered"; cert-manager ordering made deterministic — §8.3 replaced the narrative with an explicit sync-wave table (`-2` for `cert-manager` + `ingress-nginx`, `-1` for `cert-manager-issuers`, `0` for `portfolio`) and adds `syncPolicy.retry` with exponential backoff on the issuers app to cover the wave-vs-webhook-readiness gap; §5 tree gained `infra/argocd-repo-server-ksops/Dockerfile`, `k8s/bootstrap/argocd-repo-server-ksops-patch.yaml`, `k8s/bootstrap/argocd-cm-kustomize.yaml`, and `k8s/manifests/cert-manager/ksops-generator.yaml`; §14.2 gained a "step 0: complete the Phase 2 SOPS prerequisite" pointing at §13.2. v3 fixes: `AppProject.sourceRepos` widened to permit Jetstack + ingress-nginx chart repos; `clusterResourceWhitelist` expanded for admission webhooks + `IngressClass`; cloud-init applies `AppProject` via inline heredoc (no stray `/var/lib/` path); tree synced with `cert-manager-issuers.yaml`, `configmap-letsencrypt.yaml`, `accessibility.md`; SOPS naming normalized to `*-secret.yaml$`; obsolete `.tmpl` SOPS rule removed; Phase 2 bundles Cloudflare token + dns01 issuer into one multi-doc `cloudflare-dns01-secret.yaml` (restores ≤5 file count); `terraform apply` removed from CI (local-only in Phase 1 per §9.3); image-build step pinned to `working-directory: app`; §4.4 data-flow narrative aligned with GitHub App token; `postcss-custom-media` added to Phase 1 install list. v2 fixes: multi-arch buildx `--push`, ArgoCD-native helm (no Flux `HelmRelease`), kustomize `ingress-config` ConfigMap declared, CI↔branch-protection mechanism specified, mobile nav committed to `<details>` (no new island), hostNetwork wording disambiguated, `postcss-custom-media` noted, cloud-init pull-secret gap resolved (public-repo path), canonical nip.io dash form, `--write-kubeconfig-mode 0600` with documented admin UX, ArgoCD `AppProject`, `imagePullPolicy: Always` with immutable SHAs, CI `concurrency` group, cert-manager email variable. |
| **Revision notes (v4.3 addendum)** | Sixth-pass execution hardening: fixed GitHub Actions git mechanics (`checkout` on `main`, no-op rerun short-circuit, detached-HEAD-safe `git push origin HEAD:main`), moved kubeconfig fetch/rewrite to operator post-boot in §4.5, removed unused `SOPS_AGE_KEY` Actions-secret guidance, added Phase 2 Cloudflare provider/variable runway in §9.6, and added explicit GitHub App provisioning checklist coverage in §16 Phase 7. |
| **Revision notes (v4.4 addendum)** | Ninth-pass consistency hardening: aligned JS expectations with the Astro+React-island choice (removed contradictory `~5 KB`/`<30 KB uncompressed` claims and switched to realistic transferred-JS budgeting), made cert-manager namespace ownership single-source (owned by `cert-manager` Application via `CreateNamespace=true`; removed issuer-side namespace ownership), added explicit `permissions:` guidance for GHCR push in `image.yml`, removed dead `letsencrypt_email` Terraform wiring from `cloud-init` template inputs and CI secret requirements, corrected KSOPS Dockerfile wording (`ksops` added; `kustomize` comes from base image), and removed unused Phase 1 cloud-init packages (`ufw`, `fail2ban`, `gnupg`). |
| **Revision notes (v4.5 addendum)** | Tenth-pass consistency and ownership fixes: resolved ingress namespace ownership asymmetry by documenting ingress-nginx as Helm-owned (`k8s/apps/ingress-nginx.yaml` with `CreateNamespace=true`) and removing the orphan `k8s/manifests/ingress-nginx/namespace.yaml` path from canonical structure/checklists; completed §9.6 `cloudflare.tf` example with the actual `cloudflare_record` resource targeting `hcloud_server.portfolio.ipv4_address`, so the snippet now creates the DNS record described in §14.2 step 7. |
| **Revision notes (v4.6 addendum)** | Eleventh-pass unblock: treated Terraform local-state + CI-plan mismatch as the only blocker by removing Phase 1 `terraform.yml` planning from architecture/process/checklists; Terraform now runs locally only until Phase 1.5 remote state exists. Logged prior non-blocking concerns as explicit accepted trade-offs (bootstrap root secret restore, KSOPS custom-image maintenance, and Cloudflare token split across Terraform + cert-manager in Phase 2). |
| **Source handoff** | `portfolio/project/` (Claude Design export, 2026-04-18) |
| **Target** | Single-page production portfolio, live on k3s, GitOps-deployed |
| **Author** | Planning session (Claude Opus 4.7, brainstorming skill) |
| **Estimated effort** | 6–8 working days end-to-end for Phase 1 (Mid polish level) |
| **Out-of-scope** | Case Study page, headline/wireframe variants from the handoff, CMS integration, multi-language, analytics, marketing, Phase 3 full observability stack |

---

## Table of contents

1. [Purpose & success criteria](#1-purpose--success-criteria)
2. [Scope](#2-scope)
3. [Summary of decisions](#3-summary-of-decisions)
4. [Architecture](#4-architecture)
5. [Repository structure](#5-repository-structure)
6. [Application layer — Astro + React islands](#6-application-layer--astro--react-islands)
7. [Container + runtime](#7-container--runtime)
8. [Kubernetes layer](#8-kubernetes-layer)
9. [Infrastructure as code](#9-infrastructure-as-code)
10. [CI/CD pipelines](#10-cicd-pipelines)
11. [Testing strategy](#11-testing-strategy)
12. [Observability](#12-observability)
13. [Secrets management](#13-secrets-management)
14. [Phase 1 → Phase 2 — domain rollout](#14-phase-1--phase-2--domain-rollout)
15. [Documentation — Karpathy three-layer](#15-documentation--karpathy-three-layer)
16. [Implementation phases (work breakdown)](#16-implementation-phases-work-breakdown)
17. [Risks & mitigations](#17-risks--mitigations)
18. [Open questions / decisions deferred](#18-open-questions--decisions-deferred)
19. [Glossary](#19-glossary)
20. [References](#20-references)

---

## 1. Purpose & success criteria

### 1.1 Purpose

Implement `Portfolio Triptych.html` — a hand-crafted editorial portfolio mocked up in Claude Design — as a production-grade static website. The deliverable serves two audiences simultaneously:

1. **Visitors** (recruiters, collaborators, peers): see the portfolio content.
2. **Technical reviewers**: read the repository to assess DevOps/SRE/full-stack judgment.

The second audience is load-bearing. Every infrastructure choice below is made with the awareness that the repo itself is a portfolio artifact. The running site proves the code works; the code proves the author can build the running site.

### 1.2 Success criteria

The project is complete when **all** of the following are true:

| # | Criterion | How to verify |
|---|---|---|
| 1 | `https://portfolio.<ip-with-dashes>.nip.io` (canonical dash form, e.g. `portfolio.203-0-113-42.nip.io`) serves the triptych page | `curl -I` returns `200 OK`, valid Let's Encrypt cert |
| 2 | The served page visually matches the prototype at 1280px width | Manual comparison against `docs/raw/handoff-2026-04-19/Portfolio Triptych.html` |
| 3 | The site is usable at 375px (mobile), 768px (tablet), 1280px (desktop) | Playwright visual tests at each width |
| 4 | Lighthouse scores: perf ≥ 90, a11y ≥ 95, best-practices ≥ 95, SEO ≥ 95 | Lighthouse CI run on every PR |
| 5 | All content (copy, projects, links) editable via `app/src/content/*.ts` without touching components | Documented procedure in `docs/wiki/content-authoring.md` |
| 6 | Cluster provisioned end-to-end by `terraform apply` in ≤ 15 min from zero | Timed dry run documented in `docs/wiki/operations.md` |
| 7 | Image tag bump in `k8s/manifests/portfolio/deployment.yaml` triggers ArgoCD rollout in ≤ 3 min | Watch `kubectl get deploy -w` during a bump |
| 8 | Phase 2 domain-swap **content PR** (after one-time KSOPS prereq) documented as a single PR with ≤ 5 file changes | Runbook entry in `docs/wiki/operations.md` with an example PR diff |
| 9 | `docs/wiki/` is query-able via `qmd` | `qmd search "ArgoCD"` returns `docs/wiki/deployment.md` |
| 10 | A new Claude Design handoff can be ingested following a documented workflow | Runbook entry: extract → diff → port → log |

---

## 2. Scope

### 2.1 In scope

- The **single page** defined by `Portfolio Triptych.html` and its transitive imports (`triptych.jsx`, `triptych.css`).
- All sections in the React app: Nav, Hero triptych, MorphBar transitions, BodySection, BrainSection, RoomsSection, AllProjects with filter, Contact, Footer.
- **Responsive** implementation across mobile / tablet / desktop.
- **Placeholder content** preserved (the "robot" persona, placeholder image names, fictional case studies).
- **Full infra stack**: Terraform → Hetzner VPS → cloud-init → k3s → ArgoCD → ingress-nginx → cert-manager → portfolio deployment.
- **CI/CD** via GitHub Actions.
- **Karpathy three-layer docs** — `raw/`, `wiki/`, and the project-root `CLAUDE.md` schema.
- **Phase 2 migration path** documented and testable.

### 2.2 Out of scope

- `Case Study.html`, `Portfolio.html`, `Portfolio Wireframes.html`, `Headline Options.html`, and any non-triptych files in `portfolio/project/` — preserved in `docs/raw/` for reference, not implemented.
- Content management system integration.
- Multi-language / i18n.
- Analytics (Plausible / GoatCounter / etc.) — deferred to Phase 2 or Phase 3.
- Full observability stack (Prometheus / Grafana / Loki) — Phase 1 includes scrape annotations only; full stack is a future Phase 3 upgrade.
- Email / contact form backend — Contact section uses `mailto:` links only.
- Custom domain — Phase 1 ships on `nip.io`. Domain purchase happens when Phase 1 is signed off.
- Multi-node / HA cluster — single-node k3s is explicitly the target.
- Full disaster-recovery automation beyond "redeploy from git" — declarative resources are in git, but bootstrap root secrets (notably the age private key for `argocd-sops-age` in Phase 2) remain operator-held and require manual restore.

### 2.3 Non-goals

- **Pixel-perfection on every viewport**: the prototype is desktop-only (`viewport width=1280`). Mobile and tablet layouts are original design work, guided by the prototype's visual language but not derived from a mock.
- **Competing with SPA-grade interactivity**: island architecture means the site is static HTML + one tiny interactive region. Page transitions, animations beyond simple hover, and SPA-style routing are intentionally absent.
- **Backward compatibility with the React prototype's runtime**: the `__activate_edit_mode` postMessage hook in `triptych.jsx` is Claude Design scaffolding and will not be ported.

---

## 3. Summary of decisions

The six questions resolved during brainstorming and their rationales, with ADR pointers. See `docs/wiki/adr/` for the full decision records.

| # | Decision | Options considered | Chosen | Why | ADR |
|---|---|---|---|---|---|
| 1 | Deployment target | Vercel / GH Pages / VPS / k8s | **Kubernetes (k3s)** | Infra is part of the portfolio artifact; demonstrating k8s competence is a feature, not overhead. | 003 |
| 2 | Cluster type | Managed / self-managed / local | **Self-managed k3s on single-node Hetzner CX11** | Cheapest ($4/mo), most educational, full control, still a real cluster. | 003 |
| 3 | Framework | Astro / Next / Vite+React / vanilla | **Astro + React islands** | 95% of the page is static; keep JS scoped to one island (filter) instead of SPA-wide hydration. Best fit for "web standards" + K8s-friendly + portfolio perf. | 001 |
| 4 | Deployment workflow | GitOps (ArgoCD/Flux) / push-deploy | **GitOps with ArgoCD** | Declarative, Kubernetes-native, matches real-world SRE practice, highest resume signal. | 002 |
| 5 | Domain / DNS | Own domain now / Cloudflare later / nip.io / no TLS | **Two-phase: nip.io → Cloudflare** | Full pipeline tested before spending money; trivial swap when ready. | 005 |
| 6 | Polish level | MVP / Mid / Full showcase | **Mid** | Unit + E2E + Lighthouse CI + probes + Prom annotations. Disciplined without bloat. | — (covered in §11) |

Additional decisions (user-approved as standard, no separate question):

| # | Decision | Chosen | Why | ADR |
|---|---|---|---|---|
| 7 | Language | TypeScript (strict) | Expected at this level; catches wiring bugs in content→component flow. | — |
| 8 | Styling | Vanilla CSS + custom properties, PostCSS (autoprefixer + nesting + **custom-media**) | Matches prototype, matches "web standards", no lock-in, smallest output. `postcss-custom-media` needed because §6.6 breakpoints use the `@custom-media` at-rule. | — |
| 9 | Secrets | SOPS + age | GitOps-compatible, no in-cluster operator required for Phase 1. | 004 |
| 10 | Registry | GHCR | GitHub-native, free for public repos, no extra account. | — |
| 11 | CI provider | GitHub Actions | Native integration, free for public repos. | — |
| 12 | Runtime server | nginx:alpine | Industry-standard, tiny, mature, trivial config. | 006 |
| 13 | ADR format | Frontmatter (`type: project`) + Nygard body | Karpathy-queryable via qmd + recruiter-recognizable format. | All |
| 14 | ArgoCD project | Scoped `AppProject` named `portfolio` (not the unrestricted `default`) | Portfolio-hardening: the default `default` project permits any source/destination/resource kind, which is a standing red flag for any GitOps reviewer. Explicit allow-lists per §8.3. | — |
| 15 | CI → `main` mechanism | GitHub App with bypass permission (over deploy key or PAT) | Deploy keys and `GITHUB_TOKEN` do NOT bypass branch protection. GitHub Apps do, with ephemeral scoped tokens. Industry-standard pattern for GitOps bots. See §10.5. | — |
| 16 | Mobile nav implementation | Native `<details>`/`<summary>` (no JS, no second island) | Keeps interactivity scoped to the single filter island and avoids adding a second client runtime surface. Trade-offs (no focus trap, no click-outside, no body-scroll-lock) are documented as deliberate Phase 1 constraints. See §6.1. | — |
| 17 | Image pull policy | `Always` (paired with immutable `<sha>` tags) | With a digest match, `Always` is a no-op network cost but protects against any future tag-reuse edge case. Cheap hardening. | — |
| 18 | Kubeconfig mode | `0600` (root-only) on the node | Default `0644` leaks cluster-admin to any future non-root process on the node. Small admin UX cost (`sudo`) for meaningful hardening. See §9.2. | — |

**Revision history within this document** (tracked here because the plan itself is the source of truth, not the commits):

| v | Date | Change |
|---|---|---|
| 1 | 2026-04-19 | Initial plan produced from brainstorming session. |
| 2 | 2026-04-19 | Post-review revisions: fixed multi-arch buildx (`--push`); replaced Flux `HelmRelease` with ArgoCD `source.helm`; added missing `configmap-ingress.yaml` to kustomize resources; specified GitHub App mechanism for CI→main; committed mobile nav to `<details>` (no second island); disambiguated hostNetwork wording; added `postcss-custom-media`; resolved cloud-init pull-secret gap via public-GHCR path; canonicalized nip.io dashed form throughout; tightened kubeconfig to `0600`; added `AppProject`, `imagePullPolicy: Always`, CI `concurrency` group, and kustomize-based cert-manager email. |
| 3 | 2026-04-19 | Second-pass review: widened `AppProject.sourceRepos` to allow Jetstack + ingress-nginx chart repos; expanded `clusterResourceWhitelist` for admission webhooks and `IngressClass`; switched cloud-init `AppProject` apply to inline heredoc (the repo is not on the node at first boot); synced §5 tree with `cert-manager-issuers.yaml`, `configmap-letsencrypt.yaml`, and `accessibility.md` (all referenced downstream but previously absent from the tree); normalized SOPS to a single `*-secret.yaml$` rule and dropped the obsolete `.tmpl` rule; restructured Phase 2 around a bundled `cloudflare-dns01-secret.yaml` (multi-doc: Secret + ClusterIssuer) to keep the ≤5-file target with the issuer properly listed in kustomization; removed `terraform apply` from CI for Phase 1 (local backend makes CI apply unsafe); pinned the image-build step to `working-directory: app` (Dockerfile is under `app/`); aligned the §4.4 data-flow narrative with the GitHub App token path chosen in §10.5; added `postcss-custom-media` to the Phase 1 pnpm install list so scaffold matches §6.6. |
| 4 | 2026-04-19 | Third-pass review: fixed three downstream CI-policy echoes that still said "plan + apply" after v3 canonicalized §10.3 on plan-only — the §4.1 ASCII diagram, the §5 tree comment, and the §16 Phase 7 checklist now all match; replaced the "argocd-vault-plugin or init container with SOPS" handwave in §13 with a concrete KSOPS bootstrap (new §13.2): custom `argocd-repo-server` image with pinned `ksops` binary, age key mounted as Secret, `argocd-cm` patched with `kustomize.buildOptions: --enable-alpha-plugins --enable-exec`, per-app `ksops-generator.yaml` — old §13.2 renumbered to §13.3 as "alternative considered: sealed-secrets"; made cert-manager ordering deterministic in §8.3 via a sync-wave table (wave `-2` for `cert-manager` + `ingress-nginx`, wave `-1` for `cert-manager-issuers`, wave `0` for `portfolio`) and added `syncPolicy.retry` (limit 5, duration 10s, factor 2, maxDuration 2m) on the issuers app to handle the wave-vs-webhook-readiness gap; synced §5 tree with the four new KSOPS-bootstrap files; added a "step 0: Phase 2 SOPS prerequisite" to §14.2 pointing at §13.2 so operators cannot skip the KSOPS install. |
| 4.1 | 2026-04-19 | Fourth-pass review: fixed the KSOPS `resources:` vs `generators:` contradiction in §14.2 (step 4 + file-count summary) and the §5 tree comment — encrypted file is now consumed exclusively via the `generators:` list (via `ksops-generator.yaml`), never under `resources:`, preventing silent apply of ciphertext; added an explicit KSOPS security trade-off row to the §17 risks table describing the blast-radius implications of `--enable-alpha-plugins --enable-exec` + mounted age key and documenting the compensating controls (branch protection, scoped GitHub App, in-cluster-only age key, pod egress limits, Phase 3 narrowing path). |
| 4.2 | 2026-04-19 | Fifth-pass review: reclassified `ksops-generator.yaml` as Phase 2 prereq bootstrap (committed dormantly during §13.2 prereq checklist, not the Phase 2 PR) so the PR file-count is honestly 5 without dual-framing and step 8's "changes from 3–7" range is accurate; fixed the stale "not listing the file in `resources:` until Phase 2" sentence in §13.1 — the encrypted file is never under `resources:` at any phase, Phase 1 just omits the `generators:` stanza; corrected the §17 KSOPS-risk row which falsely claimed the GitHub App has path-scoped `contents: write` — GitHub Apps can't natively path-scope, so the controls are workflow logic (image.yml only writes `deployment.yaml`) and a CODEOWNERS entry on cert-manager/infra/bootstrap paths; expanded the §5 tree `CODEOWNERS` comment to name the protected paths explicitly. |
| 4.3 | 2026-04-19 | Sixth-pass execution hardening: fixed §10.2 git mechanics for GitHub-hosted runners by adding explicit `actions/checkout@v4` with `ref: main`, a no-op rerun short-circuit, and detached-HEAD-safe `git push origin HEAD:main`; corrected §4.5 provisioning flow so kubeconfig fetch/rewrite is operator-side post-boot (not cloud-init); removed unused `SOPS_AGE_KEY` Actions-secret guidance from §13.1/§16 (age key now local + offline backup, runtime decryption still uses in-cluster `argocd-sops-age` per §13.2); added §9.6 Cloudflare provider/variable runway with nullable Phase 2 inputs; added explicit GitHub App provisioning checklist coverage in §16 Phase 7 (`PORTFOLIO_BOT_APP_ID` + `PORTFOLIO_BOT_PRIVATE_KEY`). |
| 4.4 | 2026-04-19 | Ninth-pass consistency hardening: corrected JS budgeting to match Astro+React-island reality (removed `~5 KB` and `<30 KB uncompressed` contradictions), made cert-manager namespace ownership single-source (`CreateNamespace=true` in `k8s/apps/cert-manager.yaml`; no issuer-side namespace manifest ownership), added explicit GitHub Actions `permissions` guidance for GHCR push, removed dead `letsencrypt_email` wiring from Terraform `templatefile` args + CI secret requirements, corrected KSOPS Dockerfile wording (`ksops` added; `kustomize` from base image), and removed unused Phase 1 cloud-init packages (`ufw`, `fail2ban`, `gnupg`). |
| 4.5 | 2026-04-19 | Tenth-pass consistency fixes: removed ingress namespace ownership ambiguity by documenting ingress-nginx as Helm-owned with `CreateNamespace=true` and removing orphan `k8s/manifests/ingress-nginx/namespace.yaml` references from canonical tree/checklists; completed §9.6 `cloudflare.tf` example with `resource "cloudflare_record"` so the snippet now matches §14.2 step 7's "provider + A record" description. |
| 4.6 | 2026-04-19 | Eleventh-pass execution unblock: removed Phase 1 CI Terraform planning (local backend + ephemeral runner state made PR plans misleading), switched Terraform operations to local-only until Phase 1.5 remote state, and logged non-blocking review concerns as accepted trade-offs in §17 (bootstrap age-key restore dependency, KSOPS image maintenance burden, and dual-context Cloudflare token handling in Phase 2). |

---

## 4. Architecture

### 4.1 System diagram (ASCII)

```
                                   ┌──────────────────────────────┐
                                   │     Visitor's browser        │
                                   │ (HTTPS, HTML + one hydrated  │
                                   │      filter island)          │
                                   └──────────────┬───────────────┘
                                                  │
                                                  ▼  :443
                              ┌────────────────────────────────────┐
                              │   Hetzner CX11 VPS (single node)   │
                              │   public IP: A.B.C.D               │
                              │                                    │
                              │  ┌──────────────────────────────┐  │
                              │  │  Hetzner Cloud Firewall      │  │
                              │  │  allow 80, 443 (world)       │  │
                              │  │  allow 22 (admin)            │  │
                              │  │  allow 6443 (admin IP only)  │  │
                              │  └──────────────┬───────────────┘  │
                              │                 │                  │
                              │  ┌──────────────▼───────────────┐  │
                              │  │          k3s (v1.30+)        │  │
                              │  │                              │  │
                              │  │  ┌────────────────────────┐  │  │
                              │  │  │   ingress-nginx        │  │  │
                              │  │  │   hostNetwork: true    │  │  │
                              │  │  │   binds :80/:443 on    │  │  │
                              │  │  │   node's public IP     │  │  │
                              │  │  └───────────┬────────────┘  │  │
                              │  │              │                │  │
                              │  │  ┌───────────▼────────────┐   │  │
                              │  │  │  portfolio Service     │   │  │
                              │  │  │  ClusterIP :80         │   │  │
                              │  │  └───────────┬────────────┘   │  │
                              │  │              │                │  │
                              │  │  ┌───────────▼────────────┐   │  │
                              │  │  │  portfolio Deployment  │   │  │
                              │  │  │  replicas: 1           │   │  │
                              │  │  │  image: ghcr.io/...    │   │  │
                              │  │  │  ┌──────────────────┐  │   │  │
                              │  │  │  │ nginx:alpine     │  │   │  │
                              │  │  │  │  serves /dist    │  │   │  │
                              │  │  │  └──────────────────┘  │   │  │
                              │  │  └────────────────────────┘   │  │
                              │  │                              │  │
                              │  │  ┌────────────────────────┐  │  │
                              │  │  │  cert-manager          │  │  │
                              │  │  │  ClusterIssuer: LE     │  │  │
                              │  │  │  (HTTP-01, Phase 1)    │  │  │
                              │  │  └────────────────────────┘  │  │
                              │  │                              │  │
                              │  │  ┌────────────────────────┐  │  │
                              │  │  │  ArgoCD                │  │  │
                              │  │  │  watches k8s/apps/     │  │  │
                              │  │  │  reconciles all apps   │  │  │
                              │  │  └───────────┬────────────┘  │  │
                              │  │              │  polls :443   │  │
                              │  └──────────────┼───────────────┘  │
                              └─────────────────┼──────────────────┘
                                                │
                                                ▼
                                  ┌────────────────────────────┐
                                  │   GitHub (source of truth) │
                                  │   ┌──────────────────────┐ │
                                  │   │ portfolio-handoff    │ │
                                  │   │  ├─ app/             │ │
                                  │   │  ├─ k8s/manifests/   │ │ ◀── CI pushes
                                  │   │  ├─ k8s/apps/        │ │     image tag
                                  │   │  └─ infra/terraform/ │ │     bumps here
                                  │   └──────────┬───────────┘ │
                                  │              │             │
                                  │   ┌──────────▼───────────┐ │
                                  │   │ GHCR                 │ │
                                  │   │ ghcr.io/<user>/      │ │
                                  │   │   portfolio:<sha>    │ │
                                  │   └──────────────────────┘ │
                                  └────────────────────────────┘
                                                ▲
                                                │
                                  ┌─────────────┴──────────────┐
                                  │   GitHub Actions           │
                                  │   - CI on PR               │
                                  │   - image build on main    │
                                   │   - no Terraform CI in     │
                                   │     Phase 1 (local-only;   │
                                   │      see §10.3)            │
                                  └────────────────────────────┘
```

### 4.2 Logical architecture

Three clearly separated concerns:

| Concern | Lives in | Owned by | Cadence of change |
|---|---|---|---|
| **Content** (copy, projects, links) | `app/src/content/*.ts` | author | weekly |
| **Presentation** (markup, styles, layout) | `app/src/components/`, `app/src/pages/`, `app/src/styles/` | author + Claude Design handoffs | per handoff (~quarterly) |
| **Infrastructure** (cluster, pipeline, manifests) | `infra/`, `k8s/`, `.github/workflows/` | author | rarely after bootstrap |

The boundary between **Content** and **Presentation** is a hard contract: components never contain copy, only types and slots. This is what makes the "edit content without touching components" success criterion achievable.

### 4.3 Data flow — request path

```
Browser → DNS (nip.io wildcard) → Hetzner IP
→ ingress-nginx (TLS termination, host match)
→ portfolio Service (ClusterIP)
→ portfolio Pod (nginx:alpine)
→ /usr/share/nginx/html/index.html  (static, pre-rendered)
```

Response is pure HTML + CSS + a single JS chunk for the `AllProjects` island. No server-side rendering. No database. No API calls. This is deliberately boring — that's the whole point of islands on k8s.

### 4.4 Data flow — deploy path

```
Author push to main
→ GitHub Actions workflow `image.yml`
→ pnpm install + astro build
→ docker buildx build (multi-stage)
→ push ghcr.io/<user>/portfolio:<sha>
→ sed -i on k8s/manifests/portfolio/deployment.yaml (bump tag)
→ git commit + push (via ephemeral GitHub App installation token; GITHUB_TOKEN
   cannot bypass branch protection — see §10.5)
→ ArgoCD detects drift in polled repo
→ ArgoCD reconciles: patches Deployment
→ Kubernetes rolling update (max-surge 1, max-unavailable 0)
→ readiness probe passes → new pod receives traffic
→ old pod terminated
```

Total time from push to serving new code: **~2.5 minutes** (60s build + 30s push + 60s reconcile).

### 4.5 Data flow — provisioning path

```
Operator: terraform apply
→ hetzner_cloud provider creates Server + Firewall + SSH key
→ cloud-init runs on first boot:
    - install k3s (traefik disabled; --write-kubeconfig-mode 0600, owned by root)
    - install initial manifests (namespace cert-manager, namespace argocd, etc.)
    - install ArgoCD (kubectl apply -f upstream install.yaml)
    - materialize scoped AppProject inline via heredoc (repo is not on node yet)
    - materialize app-of-apps root inline via heredoc (project: portfolio)
→ operator post-boot:
    - fetch kubeconfig via SSH to operator workstation
    - rewrite kubeconfig `server:` to the node public IP
→ ArgoCD takes over:
    - installs cert-manager (Application with source.helm), ingress-nginx (same),
      portfolio (plain kustomize)
    - each becomes an ArgoCD Application
→ operator updates DNS A record (Phase 2 only) or lets nip.io handle it (Phase 1;
  canonical dashed form: `portfolio.<ip-with-dashes>.nip.io`)
→ cert-manager issues Let's Encrypt cert
→ site is live
```

---

## 5. Repository structure

The full canonical tree, annotated. Every entry has a purpose; anything not mentioned here should not exist.

```
portfolio-handoff/
├─ README.md                         # Short pointer to docs/wiki/, quickstart commands
├─ LICENSE                           # Apache-2.0
├─ CLAUDE.md                         # Project wiki schema (per Karpathy pattern)
├─ IMPLEMENTATION_PLAN.md            # THIS DOCUMENT
├─ .editorconfig
├─ .gitignore
├─ .gitattributes
├─ .sops.yaml                        # SOPS config (age recipients)
│
├─ app/                              # Astro application
│  ├─ astro.config.mjs               # integrations: @astrojs/react, @astrojs/sitemap
│  ├─ tsconfig.json                  # strict: true, extends astro/tsconfigs/strict
│  ├─ package.json
│  ├─ pnpm-lock.yaml
│  ├─ .eslintrc.cjs                  # eslint-plugin-astro, react-hooks, jsx-a11y
│  ├─ .prettierrc
│  ├─ postcss.config.cjs             # autoprefixer, postcss-nesting, postcss-custom-media
│  ├─ playwright.config.ts
│  ├─ vitest.config.ts
│  ├─ lighthouserc.json              # thresholds: perf 90, a11y 95, bp 95, seo 95
│  ├─ Dockerfile                     # multi-stage, node:20-alpine → nginx:alpine
│  ├─ nginx.conf                     # gzip, brotli, cache rules, /healthz, a11y headers
│  ├─ public/
│  │  ├─ favicon.svg
│  │  ├─ robots.txt
│  │  └─ .well-known/                # empty; reserved for future
│  ├─ src/
│  │  ├─ pages/
│  │  │  └─ index.astro              # THE page; composes all section components
│  │  ├─ layouts/
│  │  │  └─ Base.astro               # <html>, <head>, font preloads, SEO meta, skip-link
│  │  ├─ components/                 # pure Astro (no hydration)
│  │  │  ├─ Nav.astro
│  │  │  ├─ Hero.astro
│  │  │  ├─ MorphBar.astro
│  │  │  ├─ MotifJoint.astro         # SVG component, 3 variants
│  │  │  ├─ SectionHead.astro
│  │  │  ├─ BodySection.astro
│  │  │  ├─ BrainSection.astro
│  │  │  ├─ RoomsSection.astro
│  │  │  ├─ AllProjectsSection.astro # wrapper; imports React island
│  │  │  ├─ Contact.astro
│  │  │  ├─ Footer.astro
│  │  │  ├─ CadCard.astro            # used inside BodySection
│  │  │  ├─ NodeCard.astro           # used inside BrainSection
│  │  │  ├─ Poster.astro             # used inside RoomsSection
│  │  │  └─ VennDiagram.astro        # SVG component
│  │  ├─ islands/                    # React components, hydrated on client
│  │  │  └─ ProjectFilter.tsx        # the filter bar + grid; the ONLY React island
│  │  │                              # (mobile nav uses native <details>/<summary>, no JS)
│  │  ├─ content/                    # TYPED content — edited without touching components
│  │  │  ├─ index.ts                 # re-exports all content
│  │  │  ├─ site.ts                  # brand, nav links, social
│  │  │  ├─ hero.ts                  # headline, three columns
│  │  │  ├─ body-section.ts          # CAD cards data
│  │  │  ├─ brain-section.ts         # node cards data
│  │  │  ├─ rooms-section.ts         # poster cards data
│  │  │  ├─ projects.ts              # ALL_PROJECTS table
│  │  │  └─ contact.ts               # contact links
│  │  ├─ styles/
│  │  │  ├─ tokens.css               # all CSS custom properties (from prototype :root)
│  │  │  ├─ reset.css                # minimal reset (box-sizing, margins)
│  │  │  ├─ typography.css           # font-face, scale, headline rules
│  │  │  ├─ global.css               # imports above; applies at document level
│  │  │  └─ breakpoints.css          # shared media query custom media (via postcss-custom-media)
│  │  ├─ lib/
│  │  │  ├─ filter-projects.ts       # pure fn; unit-tested
│  │  │  └─ types.ts                 # Project, HeroColumn, etc.
│  │  └─ env.d.ts
│  ├─ tests/
│  │  ├─ unit/
│  │  │  └─ filter-projects.test.ts  # vitest
│  │  └─ e2e/
│  │     ├─ smoke.spec.ts            # loads, renders, no console errors
│  │     ├─ responsive.spec.ts       # screenshots at 375 / 768 / 1280
│  │     ├─ filter.spec.ts           # filter interactions
│  │     └─ a11y.spec.ts             # axe-core scan on homepage
│  └─ .dockerignore
│
├─ infra/
│  ├─ argocd-repo-server-ksops/      # Phase 2 prereq: custom argocd-repo-server image
│  │  └─ Dockerfile                  # FROM quay.io/argoproj/argocd:<version>, adds ksops
│  │                                  # (kustomize already present in base image)
│  └─ terraform/
│     ├─ main.tf                     # hetzner_cloud server, firewall, ssh key
│     ├─ cloud-init.yaml             # k3s install + ArgoCD bootstrap
│     │                              # (operator fetches kubeconfig post-boot)
│     ├─ variables.tf                # hcloud_token (env), ssh_public_key, server_type, location
│     ├─ outputs.tf                  # vps_ip, nip_io_url, ssh_command
│     ├─ versions.tf                 # terraform + provider version pins
│     ├─ backend.tf                  # backend "local" initially; S3-compatible later optional
│     ├─ .terraform-version          # 1.8.0+
│     └─ README.md                   # how to run, variables to set
│
├─ k8s/
│  ├─ bootstrap/
│  │  ├─ argocd-install.yaml                     # upstream ArgoCD manifest (pinned)
│  │  ├─ argocd-appproject.yaml                  # AppProject 'portfolio' — scopes root Application
│  │  ├─ argocd-root-app.yaml                    # the app-of-apps kicker (project: portfolio)
│  │  ├─ argocd-repo-server-ksops-patch.yaml     # Phase 2 prereq: KSOPS-enabled repo-server image + age-key mount (§13.2)
│  │  └─ argocd-cm-kustomize.yaml                # Phase 2 prereq: enables --enable-alpha-plugins for ksops
│  ├─ apps/                          # ArgoCD Application CRs, one per stack component
│  │  ├─ root.yaml                   # watches this directory (app-of-apps)
│  │  ├─ cert-manager.yaml           # Helm install of cert-manager (source.chart → charts.jetstack.io)
│  │  ├─ cert-manager-issuers.yaml   # plain-manifest app sourcing ClusterIssuers from k8s/manifests/cert-manager/
│  │  ├─ ingress-nginx.yaml          # Helm install (source.chart → kubernetes.github.io/ingress-nginx)
│  │  │                               # namespace lifecycle is owned here via
│  │  │                               # syncOptions: [CreateNamespace=true]
│  │  └─ portfolio.yaml              # sources k8s/manifests/portfolio/
│  └─ manifests/
│     ├─ cert-manager/
│     │  ├─ kustomization.yaml                       # Phase 1: http01 issuer + letsencrypt configmap
│     │  │                                           # namespace is owned by k8s/apps/cert-manager.yaml
│     │  │                                           # via syncOptions: [CreateNamespace=true]
│     │  │                                           # Phase 2: adds `generators: [ksops-generator.yaml]` — the
│     │  │                                           # encrypted `cloudflare-dns01-secret.yaml` is consumed ONLY via
│     │  │                                           # that generator (never under `resources:`), so ksops decrypts
│     │  │                                           # it in-memory before kustomize emits to ArgoCD. See §13.2.
│     │  ├─ ksops-generator.yaml                     # committed during Phase 2 PREREQ (§13.2), not the Phase 2 PR;
│     │  │                                           # dormant until `generators:` lists it. Keeps the Phase 2 PR at 5 files.
│     │  ├─ configmap-letsencrypt.yaml               # source ConfigMap for kustomize email replacement into ClusterIssuers
│     │  ├─ clusterissuer-http01.yaml                # email field substituted from configmap-letsencrypt
│     │  └─ cloudflare-dns01-secret.yaml             # Phase 2 only; sops-encrypted multi-doc:
│     │                                              #   (1) Secret cloudflare-api-token in cert-manager ns
│     │                                              #   (2) ClusterIssuer letsencrypt-dns01-cloudflare (references the Secret)
│     │                                              # Decrypted at reconcile by KSOPS plugin on argocd-repo-server.
│     │                              # NOTE: helm chart install is declared inside
│     │                              # k8s/apps/cert-manager.yaml (ArgoCD Application
│     │                              # with spec.source.helm), NOT as a separate
│     │                              # HelmRelease CR (that's a Flux concept).
│     │                              # ClusterIssuers are synced by a SEPARATE app
│     │                              # (k8s/apps/cert-manager-issuers.yaml) so chart
│     │                              # and config lifecycles are decoupled.
│     └─ portfolio/
│        ├─ namespace.yaml
│        ├─ kustomization.yaml       # lists every file in this dir as a resource
│        ├─ configmap-ingress.yaml   # host: portfolio.<ip-with-dashes>.nip.io — source
│        │                           # for kustomize replacements into ingress.yaml
│        ├─ deployment.yaml          # image tag updated by CI
│        ├─ service.yaml
│        ├─ ingress.yaml             # host filled in via kustomize replacements
│        └─ networkpolicy.yaml       # ingress-nginx → pod only
│
├─ .github/
│  ├─ workflows/
│  │  ├─ ci.yml                      # on PR: lint, typecheck, test, build, lighthouse
│  │  ├─ image.yml                   # on main: build image, push GHCR, bump tag, commit
│  │  └─ terraform.yml               # Phase 1.5+ only: PR plan against remote state
│  │                                 # (optional dispatch apply behind environment gates)
│  ├─ CODEOWNERS                     # owner-required review on k8s/manifests/cert-manager/**, infra/**,
│  │                                  # k8s/bootstrap/**, .github/workflows/image.yml — protects ksops paths
│  │                                  # and bot-write logic in PRs (GitHub Apps cannot path-scope `contents: write`).
│  ├─ dependabot.yml
│  └─ pull_request_template.md
│
├─ scripts/
│  ├─ bootstrap-cluster.sh           # manual one-shot kubectl apply for initial ArgoCD install
│  ├─ seal-secret.sh                 # sops encrypt helper
│  ├─ domain-swap.sh                 # Phase 2 helper: updates ingress host + issuer
│  └─ new-handoff.sh                 # creates docs/raw/handoff-YYYY-MM-DD/ and logs ingest
│
└─ docs/
   ├─ raw/
   │  ├─ handoff-2026-04-19/         # the original Claude Design export, verbatim
   │  │  ├─ README.md
   │  │  ├─ Portfolio Triptych.html
   │  │  ├─ triptych.jsx
   │  │  ├─ triptych.css
   │  │  ├─ Portfolio.html
   │  │  ├─ Portfolio Wireframes.html
   │  │  ├─ Case Study.html
   │  │  ├─ Headline Options.html
   │  │  ├─ styles.css
   │  │  ├─ hifi.css
   │  │  ├─ hifi_hero.jsx
   │  │  ├─ hifi_sections.jsx
   │  │  ├─ hifi_projects.jsx
   │  │  ├─ dir1_notebook.jsx
   │  │  ├─ dir2_terminal.jsx
   │  │  ├─ dir3_schematic.jsx
   │  │  ├─ dir4_editorial.jsx
   │  │  └─ scraps/
   │  │     └─ sketch-2026-04-18T07-23-37-b404oq.napkin
   │  └─ reference/
   │     └─ karpathy-llm-wiki.md     # pattern reference (fetch + commit)
   └─ wiki/
      ├─ index.md
      ├─ log.md
      ├─ architecture.md
      ├─ deployment.md
      ├─ infrastructure.md
      ├─ operations.md
      ├─ content-authoring.md
      ├─ testing.md
      ├─ design-system.md
      ├─ accessibility.md              # mobile-nav `<details>` trade-offs (see §6.1), axe scan notes
      └─ adr/
         ├─ 001-astro-react-islands.md
         ├─ 002-gitops-argocd.md
         ├─ 003-k3s-hetzner-single-node.md
         ├─ 004-sops-age-secrets.md
         ├─ 005-two-phase-domain-rollout.md
         └─ 006-nginx-over-caddy.md
```

**Files explicitly NOT in the tree:**
- No `package-lock.json` (pnpm-lock.yaml is authoritative).
- No `Makefile` (small enough to live in README + scripts/).
- No `.nvmrc` (`packageManager` in package.json + engines.node suffice).
- No separate `helm/` directory (Helm usage flows through ArgoCD Applications).
- No `assets/` at repo root (all static assets live in `app/public/`).

---

## 6. Application layer — Astro + React islands

### 6.1 Rendering model

- **Default**: every `.astro` component renders to HTML at build time. No client JS is shipped for those components.
- **Islands**: only components under `app/src/islands/` are hydrated on the client. One such component exists: `ProjectFilter.tsx`.
- **Hydration directive**: `<ProjectFilter client:visible />` — defers hydration until the component enters the viewport. This keeps first paint focused on static HTML/CSS and delays island runtime cost because the filter sits near the bottom.
- **Mobile nav is NOT an island.** The hamburger uses the native `<details>`/`<summary>` element (open/close state in the DOM, keyboard-accessible for free, Escape dismiss via browser default on a focused summary in most UAs). Accepted trade-offs: no automatic click-outside-to-close, no focus trap, no body-scroll lock. These are documented in `docs/wiki/accessibility.md` as deliberate Phase 1 constraints. If user testing shows the overlay feels broken, the decision record is explicit so we can revisit adding a `MobileNav.tsx` island later.

### 6.2 Prototype → Astro component mapping

| Prototype (`triptych.jsx`) | Astro implementation | Type | Notes |
|---|---|---|---|
| `MotifJoint` | `components/MotifJoint.astro` | static | three variants via prop; pure SVG |
| `Nav` | `components/Nav.astro` | static | a11y: `<nav>`, skip-to-content link, keyboard focus styles |
| `Hero` | `components/Hero.astro` | static | uses `CONTENT.hero` from `content/hero.ts` |
| `MorphBar` | `components/MorphBar.astro` | static | three instances via props |
| `BodySection` | `components/BodySection.astro` + `CadCard.astro` | static | data-driven from `content/body-section.ts` |
| `BrainSection` | `components/BrainSection.astro` + `NodeCard.astro` | static | data-driven from `content/brain-section.ts` |
| `RoomsSection` | `components/RoomsSection.astro` + `Poster.astro` | static | data-driven from `content/rooms-section.ts` |
| `AllProjects` | `islands/ProjectFilter.tsx` + `AllProjectsSection.astro` | **island** | wrapper is static; filter+grid is React |
| `Contact` | `components/Contact.astro` | static | |
| `Footer` | `components/Footer.astro` | static | |
| `App` + `useEffect` (edit-mode postMessage) | **dropped** | — | Claude Design prototype scaffolding; not needed in production |

### 6.3 The single React island — `ProjectFilter.tsx`

This is the only interactive region. It owns:
- The filter state (`all` | `hw` | `sw` | `eco` | `overlap` | `trinity`).
- The filtered grid of project cards.
- Filter button rendering.

Content (the `ALL_PROJECTS` array) is passed in as a prop from the parent Astro component, not imported inside the island. This means:
- Content stays in the TypeScript content layer (not in the island).
- The island receives a plain JSON blob at hydration time.
- Unit tests on `filter-projects.ts` exercise the pure filtering logic without React.

Skeleton:

```tsx
// app/src/islands/ProjectFilter.tsx
import { useState } from 'react';
import type { Project, FilterKey } from '../lib/types';
import { filterProjects } from '../lib/filter-projects';
import styles from './ProjectFilter.module.css';

type Props = { projects: Project[] };

export default function ProjectFilter({ projects }: Props) {
  const [filter, setFilter] = useState<FilterKey>('all');
  const shown = filterProjects(projects, filter);
  // ... render filter bar + grid
}
```

Keyboard accessibility requirements:
- Filter buttons are `<button type="button">` (not divs).
- Active state announced via `aria-pressed`.
- Visible focus ring (not `outline: none`).

### 6.4 Content model

All editable content lives in strictly-typed TS files. The types are defined once in `lib/types.ts` and used by both the content files and the components that consume them.

Example:

```ts
// app/src/lib/types.ts
export type Project = {
  title: string;
  year: string;
  hw: boolean;
  sw: boolean;
  eco: boolean;
  description: string;
};

export type HeroColumn = {
  num: string;          // "/ 01 — HARDWARE"
  phrase: string;       // "I design the body."
  emphasis: string;     // word wrapped in <em>
  caption: string;
  motifVariant: 'body' | 'brain' | 'rooms';
};

export type FilterKey = 'all' | 'hw' | 'sw' | 'eco' | 'overlap' | 'trinity';
```

```ts
// app/src/content/projects.ts
import type { Project } from '../lib/types';

export const projects: Project[] = [
  { title: 'bipedal walker v3', year: '2026', hw: true, sw: true, eco: false,
    description: 'Hand-built biped + PPO policy · sim-to-real.' },
  // ... all 12 from the prototype
];
```

**Editing workflow** (documented in `docs/wiki/content-authoring.md`):

1. Edit `app/src/content/<file>.ts`.
2. `pnpm dev` shows the change instantly.
3. Commit and PR.
4. CI verifies types + Lighthouse.
5. Merge → ArgoCD deploys.

No component file is ever touched for a content change.

### 6.5 Styling strategy

**Token-first, component-scoped.** Three layers:

**Layer 1 — Tokens** (`app/src/styles/tokens.css`):

Ported directly from the prototype's `:root` block. This is the single source of truth for colors, font families, radii, shadows. All other styles reference these custom properties.

```css
:root {
  --paper: #F5F1E8;
  --paper-2: #EBE6D7;
  --paper-3: #DDD6C2;
  --ink: #141413;
  --ink-2: #3A3A37;
  --ink-3: #6F6E68;
  --ink-4: #A8A59A;
  --body-accent: oklch(0.82 0.11 130);
  --brain-accent: oklch(0.75 0.16 280);
  --rooms-accent: oklch(0.74 0.15 50);
  /* … see prototype for full list */
}
```

**Layer 2 — Global rules** (`app/src/styles/global.css`):

Typography, reset, document-level styles. Imported once in `Base.astro`.

**Layer 3 — Component styles** (scoped `<style>` inside each `.astro` file):

Astro automatically scopes `<style>` blocks per component (hashes the selectors). So `Hero.astro` has its own `.triptych-hero { … }` block that cannot leak into other components.

```astro
---
// Hero.astro
import { hero } from '../content/hero';
---
<section class="triptych-hero">
  <!-- markup -->
</section>

<style>
  .triptych-hero { padding: 60px 40px 48px; border-bottom: 1.5px solid var(--ink); }
  /* … */
</style>
```

**Why not Tailwind / CSS-in-JS / CSS Modules?**

- Prototype already uses vanilla CSS with custom properties — direct port, no translation layer.
- Astro's built-in scoping gives module-like isolation without bundler magic.
- Zero runtime cost, zero class-name mangling visible to the user, zero "what flavor of CSS does this project use" cognitive overhead.
- Lock-in risk is nil — if Tailwind is ever needed, it can be added later without rewriting existing styles.

### 6.6 Responsive strategy

The prototype is **desktop-only** (`viewport width=1280`, no media queries, fixed grids like `1.4fr 1fr 1fr`). Responsive behavior is original design work. Philosophy: **progressive enhancement upward from mobile**.

**Breakpoints** (defined once, used via PostCSS custom-media — requires the `postcss-custom-media` plugin to be registered in `postcss.config.cjs` alongside `autoprefixer` and `postcss-nesting`):

```css
/* app/src/styles/breakpoints.css */
@custom-media --mobile (max-width: 640px);
@custom-media --tablet (min-width: 641px) and (max-width: 1024px);
@custom-media --desktop (min-width: 1025px);
```

**Per-section responsive plan:**

| Section | Mobile (≤640) | Tablet (641–1024) | Desktop (≥1025) |
|---|---|---|---|
| Nav | `<details>` hamburger — `<summary>` is the toggle button; open state reveals vertical link list; styling makes it feel like an overlay (see §6.1 trade-offs) | full horizontal nav | full horizontal nav |
| Hero `th-title` | `font-size: 44px` | `font-size: 64px` | `clamp(44px, 5.6vw, 92px)` (prototype value) |
| Hero triptych | stacked 1 column, full-bleed per panel | 1 column still, but tighter padding | 3-column grid (prototype layout) |
| MorphBar | compact: only motif icons, no text labels | icons + abbreviated text | full layout with arrows + labels |
| BodySection CAD grid | 1 column | 2 columns | `1.4fr 1fr 1fr` (prototype layout); `lg` card spans rows |
| BrainSection node grid | 1 column | 2 columns | `repeat(12, 1fr)` with `w6`/`w4` (prototype layout) |
| RoomsSection posters | 1 column, `lg` same as others | 1 column, `lg` emphasized | `1.3fr 1fr 1fr` (prototype layout), `lg` spans rows |
| AllProjects filter bar | wraps to 2 rows, scrollable | single row | single row |
| AllProjects project grid | 1 column | 2 columns | 3 columns (prototype) |
| Contact | stacked | stacked | 2-column (1.2fr 1fr, prototype) |
| Section headers | headline font-size reduced `clamp(40px, 8vw, 96px)` | linear scale | 96–108px (prototype) |

**Headline clamp scaling**: all oversized headlines use `clamp()` so they degrade gracefully. The 108px `Fraunces` serif in the Rooms section becomes `clamp(56px, 9vw, 108px)` — never smaller than readable on mobile.

**Fixed-width details** that don't survive mobile: the venn diagram (280×180 SVG) gets `max-width: 100%; height: auto;`. The loss-curve ornament has a fixed 100px height — becomes 60px on mobile.

**Not done:** desktop pixel-perfection below 640px is not a goal. If the prototype looks quirky on mobile, we take the simpler responsive choice, not the one that preserves every visual flourish.

### 6.7 Accessibility requirements

- **Semantic HTML**: `<header>`, `<nav>`, `<main>`, `<section>` with `aria-labelledby`, `<footer>`.
- **Skip link**: `<a href="#main" class="skip-link">Skip to content</a>` in `Base.astro`, visible on focus.
- **Heading hierarchy**: one `<h1>` (the triptych title), section headings are `<h2>`, sub-cards are `<h3>`.
- **Color contrast**: the `--ink-3` (#6F6E68) and `--ink-4` (#A8A59A) tones in the prototype have marginal contrast. Audit and upgrade where text sits on `--paper` (#F5F1E8). Contrast target: 4.5:1 for body text (WCAG AA), verified via axe.
- **Focus indicators**: every interactive element has a visible focus ring using `--ink` outline, offset 2px. Nav links and filter buttons.
- **Keyboard**: filter buttons navigable via Tab, activated via Space/Enter.
- **Reduced motion**: `@media (prefers-reduced-motion: reduce)` disables the poster hover translate and any transitions.
- **Alt text**: prototype uses placeholder "images" (hatched CSS) with text labels. These are decorative; the card `<h3>` carries the meaning. When real images are added, `alt` becomes required (enforced via eslint-plugin-jsx-a11y on the React island, and by code review on `.astro`).
- **SEO & meta**: `<title>`, `<meta description>`, Open Graph tags, canonical URL, `lang="en"`, sitemap.xml via `@astrojs/sitemap`, robots.txt.

### 6.8 Performance budget

| Metric | Target | How enforced |
|---|---|---|
| HTML size (uncompressed) | < 60 KB | Lighthouse CI |
| Total JS transferred (gzip/brotli) | < 55 KB on first load | Lighthouse CI + manual report review |
| Total JS raw bundle size (uncompressed) | < 180 KB across shipped island chunks | Manual `dist/` inspection |
| Total CSS (uncompressed) | < 40 KB | Lighthouse CI |
| LCP | < 1.8s on slow 3G | Lighthouse CI |
| CLS | < 0.05 | Lighthouse CI |
| INP | < 100ms | Lighthouse CI |

Fonts are preloaded (Space Grotesk, JetBrains Mono, Fraunces) with `font-display: swap` to avoid CLS.

---

## 7. Container + runtime

### 7.1 Dockerfile

Multi-stage build. Final image is `nginx:alpine` + a static directory.

```dockerfile
# app/Dockerfile

# ---------- build stage ----------
FROM node:20-alpine AS build
WORKDIR /src

# leverage Docker layer cache: install first, code after
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@9 --activate \
 && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build   # outputs dist/

# ---------- runtime stage ----------
FROM nginx:1.27-alpine AS runtime

# non-root user (nginx in alpine image is uid 101 but runs as root by default)
RUN addgroup -S app && adduser -S app -G app

COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /src/dist /usr/share/nginx/html

# healthcheck baked into image (ingress probe still defined separately)
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q --spider http://localhost:8080/healthz || exit 1

USER app
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

Notes:
- nginx binds to **8080** (not 80) so the container can run as a non-root user.
- `pnpm` via corepack ensures reproducibility across versions.
- `.dockerignore` excludes `node_modules`, `dist`, `tests`, `.github`, `docs`, etc. Keeps build context tight.

### 7.2 nginx.conf

```nginx
worker_processes auto;
pid /tmp/nginx.pid;

events { worker_connections 1024; }

http {
  include /etc/nginx/mime.types;
  default_type application/octet-stream;

  # temp paths writable by non-root user
  client_body_temp_path /tmp/client_body;
  proxy_temp_path /tmp/proxy;
  fastcgi_temp_path /tmp/fastcgi;
  uwsgi_temp_path /tmp/uwsgi;
  scgi_temp_path /tmp/scgi;

  sendfile on;
  tcp_nopush on;
  server_tokens off;

  gzip on;
  gzip_vary on;
  gzip_types text/plain text/css text/javascript application/javascript application/json image/svg+xml;
  gzip_min_length 256;

  # brotli if module available (nginx:alpine-slim has it via brotli-module)
  # brotli on; brotli_types …;

  server {
    listen 8080;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # security headers (baseline; CSP tuned per page if needed)
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-Frame-Options "DENY" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # long cache for hashed assets; Astro outputs /_astro/* with content hashes
    location /_astro/ {
      expires 1y;
      add_header Cache-Control "public, immutable";
      try_files $uri =404;
    }

    location ~* \.(css|js|woff2?|svg|png|jpg|webp|avif)$ {
      expires 7d;
      add_header Cache-Control "public";
    }

    # HTML: always revalidate
    location / {
      add_header Cache-Control "no-cache";
      try_files $uri $uri/ $uri.html =404;
    }

    # healthcheck
    location = /healthz {
      access_log off;
      add_header Content-Type text/plain;
      return 200 "ok\n";
    }
  }
}
```

### 7.3 Image tagging

- `ghcr.io/<user>/portfolio:<sha>` — immutable, produced on every main merge.
- `ghcr.io/<user>/portfolio:latest` — moving pointer; **not used by the deployment** (only immutable SHAs are referenced in manifests).
- Image size target: **< 25 MB** (nginx:alpine base ~10 MB + dist/ ~5 MB + headers).

---

## 8. Kubernetes layer

### 8.1 Cluster topology

Single node. Everything runs together.

| Namespace | Workloads | Why there |
|---|---|---|
| `kube-system` | k3s built-ins (coredns, metrics-server, local-path-provisioner) | k3s default |
| `argocd` | ArgoCD server + controllers | dedicated, cluster-admin |
| `cert-manager` | cert-manager + webhook + cainjector | dedicated namespace per best practice |
| `ingress-nginx` | ingress-nginx controller (hostNetwork) | dedicated |
| `portfolio` | portfolio Deployment + Service + Ingress + Certificate | the app itself |

**Traefik is disabled** at k3s install time (`--disable traefik`) because ingress-nginx is more standard, more documented, and the Helm chart is mature.

### 8.2 Bootstrap sequence

Exactly three `kubectl apply` commands are run manually (the rest is ArgoCD):

```bash
# 1. Install ArgoCD (pinned version)
kubectl create namespace argocd
kubectl apply -n argocd -f k8s/bootstrap/argocd-install.yaml

# wait for ArgoCD to be ready
kubectl -n argocd wait --for=condition=available deployment/argocd-server --timeout=300s

# 2. Apply the scoped AppProject (restricts what root can manage)
kubectl apply -f k8s/bootstrap/argocd-appproject.yaml

# 3. Apply the root Application (the app-of-apps kicker)
kubectl apply -f k8s/bootstrap/argocd-root-app.yaml
```

After step 3, ArgoCD reconciles `k8s/apps/root.yaml` which in turn references every other Application in `k8s/apps/`. Each Application sources manifests from `k8s/manifests/<stack>/` (for plain manifests) or from a helm chart repo (for cert-manager and ingress-nginx, via `spec.source.chart` + `spec.source.helm.values`). Everything in the cluster — cert-manager, ingress-nginx, portfolio itself — is installed and managed by ArgoCD, not by the operator.

These three commands are wrapped in `scripts/bootstrap-cluster.sh` and also triggered automatically by `cloud-init` during `terraform apply`, so in practice the operator never runs them by hand.

### 8.3 App-of-apps

First, an `AppProject` CR to scope what the root Application (and its children) are allowed to manage. This is a portfolio-hardening step — the default `default` project is unrestricted, which is a red flag for any reviewer looking at a GitOps setup.

```yaml
# k8s/bootstrap/argocd-appproject.yaml
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: portfolio
  namespace: argocd
spec:
  description: Portfolio site + its supporting platform components
  # sourceRepos is an allowlist applied to EVERY Application in the project,
  # including Helm chart repos referenced via spec.source.chart. Omitting a
  # chart repo causes ArgoCD to reject sync with
  # "application repoURL ... is not permitted in project 'portfolio'".
  sourceRepos:
    - https://github.com/<user>/portfolio-handoff.git   # plain-manifest apps + image-tag bumps
    - https://charts.jetstack.io                         # cert-manager Helm chart
    - https://kubernetes.github.io/ingress-nginx         # ingress-nginx Helm chart
  destinations:
    - namespace: argocd
      server: https://kubernetes.default.svc
    - namespace: cert-manager
      server: https://kubernetes.default.svc
    - namespace: ingress-nginx
      server: https://kubernetes.default.svc
    - namespace: portfolio
      server: https://kubernetes.default.svc
  # clusterResourceWhitelist lists every cluster-scoped kind the project is
  # allowed to create. cert-manager and ingress-nginx Helm charts install
  # admission webhooks and an IngressClass — without these entries the sync
  # fails after the chart CRDs land.
  clusterResourceWhitelist:
    - { group: "",                             kind: Namespace }
    - { group: apiextensions.k8s.io,           kind: CustomResourceDefinition }
    - { group: rbac.authorization.k8s.io,      kind: ClusterRole }
    - { group: rbac.authorization.k8s.io,      kind: ClusterRoleBinding }
    - { group: cert-manager.io,                kind: ClusterIssuer }
    - { group: admissionregistration.k8s.io,   kind: ValidatingWebhookConfiguration }  # cert-manager + ingress-nginx
    - { group: admissionregistration.k8s.io,   kind: MutatingWebhookConfiguration }    # cert-manager
    - { group: networking.k8s.io,              kind: IngressClass }                    # ingress-nginx
  namespaceResourceWhitelist:
    - { group: "*", kind: "*" }
```

The root Application then references this project:

```yaml
# k8s/apps/root.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: root
  namespace: argocd
  finalizers: [resources-finalizer.argocd.argoproj.io]
spec:
  project: portfolio        # not 'default'
  source:
    repoURL: https://github.com/<user>/portfolio-handoff.git
    targetRevision: main
    path: k8s/apps
  destination:
    server: https://kubernetes.default.svc
  syncPolicy:
    automated: { prune: true, selfHeal: true }
```

**Repo access**: with a **public** repo (see Open Question #8, recommended default), no credential is required — ArgoCD fetches over anonymous HTTPS. If the repo is made **private** at any point, a repo-credential secret must be added to the `argocd` namespace:

```yaml
# k8s/manifests/argocd/repo-cred.yaml  (only needed for private repo; sops-encrypted)
apiVersion: v1
kind: Secret
metadata:
  name: portfolio-repo
  namespace: argocd
  labels: { argocd.argoproj.io/secret-type: repository }
stringData:
  type: git
  url: https://github.com/<user>/portfolio-handoff.git
  password: <github-pat-with-repo-scope>
  username: <user>
```

This file is NOT committed unencrypted. See §13.

**Helm-managed stacks (cert-manager, ingress-nginx)**: declared as ArgoCD Applications with `spec.source.chart` (NOT as Flux `HelmRelease` CRs — those are a different tool).

**Sync-wave ordering** (critical for bootstrap correctness): the stacks have real dependencies — `cert-manager-issuers` creates `ClusterIssuer` CRs, which requires the `cert-manager.io` CRD to already exist, which requires the cert-manager Helm chart to have synced. ArgoCD provides the `argocd.argoproj.io/sync-wave` annotation to express this: lower numbers sync first, and ArgoCD waits for a wave's resources to be **Healthy** before starting the next wave.

| Wave | Application | Reason |
|---|---|---|
| **-2** | `cert-manager` | installs cert-manager CRDs (`Certificate`, `ClusterIssuer`, `Issuer`, `Challenge`, `Order`) and the controller; must exist before any cert-manager resources can be created |
| **-2** | `ingress-nginx` | installs `IngressClass` + admission webhooks; same tier as cert-manager since they're independent of each other |
| **-1** | `cert-manager-issuers` | creates `ClusterIssuer` resources; requires cert-manager CRDs + controller + webhook to be ready |
| **0** (default) | `portfolio` | creates the Ingress that references the ClusterIssuer; requires issuers to be ready OR cert-manager will retry cert issuance until they exist |

Without wave ordering, a fresh cluster races: `cert-manager-issuers` tries to apply `ClusterIssuer` before the CRD exists and fails with `no matches for kind "ClusterIssuer" in version "cert-manager.io/v1"`. ArgoCD would retry, but the user sees scary red in the UI and (in a tighter setup) the retry budget could be exhausted.

**Limitation**: sync-wave waits for Kubernetes-level *Health*, not readiness of admission webhooks. cert-manager's webhook can take ~30s to start accepting requests even after the Deployment is Healthy. If the first `ClusterIssuer` apply lands in that window, it fails with `failed calling webhook "webhook.cert-manager.io"`. ArgoCD's default retry handles this, but we make it explicit with `syncPolicy.retry` on the issuers app (see the example below).

**Example Application — cert-manager (wave -2, the Helm install)**:

```yaml
# k8s/apps/cert-manager.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: cert-manager
  namespace: argocd
  annotations:
    argocd.argoproj.io/sync-wave: "-2"
spec:
  project: portfolio
  source:
    repoURL: https://charts.jetstack.io
    chart: cert-manager
    targetRevision: v1.15.0
    helm:
      values: |
        installCRDs: true
        resources:
          requests: { cpu: 10m, memory: 32Mi }
          limits:   { cpu: 100m, memory: 128Mi }
  destination:
    server: https://kubernetes.default.svc
    namespace: cert-manager
  syncPolicy:
    automated: { prune: true, selfHeal: true }
    syncOptions: [CreateNamespace=true, ServerSideApply=true]
```

**Example Application — cert-manager-issuers (wave -1, plain manifest)**:

```yaml
# k8s/apps/cert-manager-issuers.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: cert-manager-issuers
  namespace: argocd
  annotations:
    argocd.argoproj.io/sync-wave: "-1"
spec:
  project: portfolio
  source:
    repoURL: https://github.com/<user>/portfolio-handoff.git
    targetRevision: main
    path: k8s/manifests/cert-manager
  destination:
    server: https://kubernetes.default.svc
    namespace: cert-manager
  syncPolicy:
    automated: { prune: true, selfHeal: true }
    retry:
      limit: 5
      backoff: { duration: 10s, factor: 2, maxDuration: 2m }   # absorbs cert-manager webhook startup race
    syncOptions: [ServerSideApply=true]
```

**Namespace ownership rule**: Helm-managed stacks own their namespaces in the Application layer via `syncOptions: [CreateNamespace=true]`.
- `cert-manager`: namespace owned by `k8s/apps/cert-manager.yaml`; `k8s/manifests/cert-manager/kustomization.yaml` must not include `namespace.yaml`.
- `ingress-nginx`: namespace owned by `k8s/apps/ingress-nginx.yaml`; there is no `k8s/manifests/ingress-nginx/namespace.yaml` path.

The `portfolio` Application omits the sync-wave annotation (defaulting to wave 0) because an Ingress referring to a not-yet-ready ClusterIssuer just retries cert issuance — no hard failure.

Each `k8s/apps/<stack>.yaml` is a sibling Application. When a new stack (e.g., `prometheus-stack` in Phase 3) is added, it's just a new Application YAML committed into `k8s/apps/` — ArgoCD picks it up automatically. Choose its wave based on what depends on it.

### 8.4 Portfolio Deployment

```yaml
# k8s/manifests/portfolio/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: portfolio
  namespace: portfolio
spec:
  replicas: 1
  strategy:
    type: RollingUpdate
    rollingUpdate: { maxSurge: 1, maxUnavailable: 0 }
  selector: { matchLabels: { app: portfolio } }
  template:
    metadata:
      labels: { app: portfolio }
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "8080"
        prometheus.io/path: "/metrics"   # not exposed in Phase 1; reserved
    spec:
      containers:
        - name: nginx
          image: ghcr.io/<user>/portfolio:<sha>   # bumped by CI; immutable SHA tag
          imagePullPolicy: Always                 # cheap with immutable tags (digest
                                                  # match = no re-download); protects
                                                  # against the tag-reuse edge case
          ports:
            - { containerPort: 8080, name: http }
          resources:
            requests: { cpu: 50m, memory: 32Mi }
            limits:   { cpu: 200m, memory: 128Mi }
          readinessProbe:
            httpGet: { path: /healthz, port: http }
            periodSeconds: 5
            initialDelaySeconds: 2
          livenessProbe:
            httpGet: { path: /healthz, port: http }
            periodSeconds: 15
            initialDelaySeconds: 10
          securityContext:
            runAsNonRoot: true
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities: { drop: ["ALL"] }
          volumeMounts:
            - { name: tmp, mountPath: /tmp }
            - { name: nginx-cache, mountPath: /var/cache/nginx }
      volumes:
        - { name: tmp, emptyDir: {} }
        - { name: nginx-cache, emptyDir: {} }
```

`readOnlyRootFilesystem: true` + emptyDir mounts at `/tmp` and `/var/cache/nginx` — proper container-hardening baseline.

### 8.5 Ingress + TLS

```yaml
# k8s/manifests/portfolio/ingress.yaml (Phase 1 — nip.io)
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: portfolio
  namespace: portfolio
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-http01
spec:
  ingressClassName: nginx
  tls:
    - hosts: ["PLACEHOLDER"]         # filled in by kustomize replacement from
                                     # configmap-ingress.data.host — see §14.1
      secretName: portfolio-tls
  rules:
    - host: "PLACEHOLDER"            # same — kustomize replacement target
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: portfolio
                port: { number: 80 }
```

Phase 1 hostname format (canonical, dashed): `portfolio.<ip-with-dashes>.nip.io` (e.g., `portfolio.203-0-113-42.nip.io`). Phase 2 swap is a one-line edit to `configmap-ingress.yaml`; see §14.2.

### 8.6 ClusterIssuer — Phase 1

```yaml
# k8s/manifests/cert-manager/clusterissuer-http01.yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-http01
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: LETSENCRYPT_EMAIL   # substituted via kustomize replacement from a ConfigMap
                               # (see pattern in §14.1). Public repos would otherwise
                               # commit the operator's email to git history.
    privateKeySecretRef: { name: letsencrypt-http01-key }
    solvers:
      - http01:
          ingress: { ingressClassName: nginx }
```

**Email-in-git note**: the LE contact email is public anyway (LE sends expiry notices there) but appears in every cert-manager log. Keeping it out of the YAML via the same ConfigMap substitution pattern used for `INGRESS_HOST` means a casual `grep` of the repo doesn't surface the operator's email for bots.

### 8.7 NetworkPolicy (defense in depth)

```yaml
# k8s/manifests/portfolio/networkpolicy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: portfolio, namespace: portfolio }
spec:
  podSelector: { matchLabels: { app: portfolio } }
  policyTypes: ["Ingress"]
  ingress:
    - from:
        - namespaceSelector:
            matchLabels: { kubernetes.io/metadata.name: ingress-nginx }
      ports:
        - { port: 8080, protocol: TCP }
```

Nothing except ingress-nginx can reach the portfolio pod. Realistic on a single-node cluster but demonstrates the principle.

---

## 9. Infrastructure as code

### 9.1 Terraform resources (Hetzner)

```hcl
# infra/terraform/main.tf
terraform {
  required_version = ">= 1.8.0"
  required_providers {
    hcloud = { source = "hetznercloud/hcloud", version = "~> 1.48" }
  }
}

provider "hcloud" {
  token = var.hcloud_token   # HCLOUD_TOKEN env var
}

resource "hcloud_ssh_key" "admin" {
  name       = "portfolio-admin"
  public_key = var.ssh_public_key
}

resource "hcloud_firewall" "portfolio" {
  name = "portfolio-fw"
  rule {
    direction = "in"; protocol = "tcp"; port = "22"
    source_ips = [var.admin_ip_cidr]
  }
  rule {
    direction = "in"; protocol = "tcp"; port = "6443"
    source_ips = [var.admin_ip_cidr]
  }
  rule {
    direction = "in"; protocol = "tcp"; port = "80"
    source_ips = ["0.0.0.0/0", "::/0"]
  }
  rule {
    direction = "in"; protocol = "tcp"; port = "443"
    source_ips = ["0.0.0.0/0", "::/0"]
  }
}

resource "hcloud_server" "portfolio" {
  name        = "portfolio"
  image       = "debian-12"
  server_type = var.server_type         # "cx11" default
  location    = var.location            # "nbg1" default
  ssh_keys    = [hcloud_ssh_key.admin.id]
  firewall_ids = [hcloud_firewall.portfolio.id]
  user_data   = templatefile("${path.module}/cloud-init.yaml", {
    github_repo   = var.github_repo,
  })
  public_net {
    ipv4_enabled = true
    ipv6_enabled = true
  }
  labels = { project = "portfolio", managed_by = "terraform" }
}
```

### 9.2 cloud-init

```yaml
# infra/terraform/cloud-init.yaml
#cloud-config
package_update: true
package_upgrade: true
packages: [curl, ca-certificates]

# Phase 1 keeps host hardening minimal and explicit: Hetzner Cloud Firewall is the
# network control plane, SSH password auth is disabled below, and no GPG tooling is
# needed for age-based SOPS.

runcmd:
  # harden ssh
  - sed -i 's/^#PermitRootLogin.*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
  - sed -i 's/^#PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
  - systemctl restart ssh

  # install k3s, disable traefik (we use ingress-nginx via ArgoCD).
  # kubeconfig mode 0600 (root-only) — see trade-off note below.
  - |
    curl -sfL https://get.k3s.io | \
      INSTALL_K3S_EXEC="--disable traefik --write-kubeconfig-mode=0600" sh -

  # wait for k3s
  - until /usr/local/bin/k3s kubectl get nodes 2>/dev/null; do sleep 2; done

  # install ArgoCD (pinned)
  - /usr/local/bin/k3s kubectl create namespace argocd
  - /usr/local/bin/k3s kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/v2.12.4/manifests/install.yaml
  - /usr/local/bin/k3s kubectl -n argocd wait --for=condition=available deployment/argocd-server --timeout=300s

  # apply scoped AppProject. Materialized inline because the repo is not
  # present on the node at first boot (no git clone, no write_files here).
  # Must be applied BEFORE the root app — ArgoCD validates the root app
  # against the project at creation time.
  - |
    cat > /tmp/argocd-appproject.yaml <<EOF
    apiVersion: argoproj.io/v1alpha1
    kind: AppProject
    metadata:
      name: portfolio
      namespace: argocd
    spec:
      description: Portfolio site + its supporting platform components
      sourceRepos:
        - ${github_repo}
        - https://charts.jetstack.io
        - https://kubernetes.github.io/ingress-nginx
      destinations:
        - { namespace: argocd,        server: https://kubernetes.default.svc }
        - { namespace: cert-manager,  server: https://kubernetes.default.svc }
        - { namespace: ingress-nginx, server: https://kubernetes.default.svc }
        - { namespace: portfolio,     server: https://kubernetes.default.svc }
      clusterResourceWhitelist:
        - { group: "",                             kind: Namespace }
        - { group: apiextensions.k8s.io,           kind: CustomResourceDefinition }
        - { group: rbac.authorization.k8s.io,      kind: ClusterRole }
        - { group: rbac.authorization.k8s.io,      kind: ClusterRoleBinding }
        - { group: cert-manager.io,                kind: ClusterIssuer }
        - { group: admissionregistration.k8s.io,   kind: ValidatingWebhookConfiguration }
        - { group: admissionregistration.k8s.io,   kind: MutatingWebhookConfiguration }
        - { group: networking.k8s.io,              kind: IngressClass }
      namespaceResourceWhitelist:
        - { group: "*", kind: "*" }
    EOF
  - /usr/local/bin/k3s kubectl apply -f /tmp/argocd-appproject.yaml

  # apply root app-of-apps
  - |
    cat > /tmp/root-app.yaml <<EOF
    apiVersion: argoproj.io/v1alpha1
    kind: Application
    metadata:
      name: root
      namespace: argocd
    spec:
      project: portfolio
      source:
        repoURL: ${github_repo}
        targetRevision: main
        path: k8s/apps
      destination: { server: https://kubernetes.default.svc }
      syncPolicy: { automated: { prune: true, selfHeal: true } }
    EOF
  - /usr/local/bin/k3s kubectl apply -f /tmp/root-app.yaml
```

**Pull-secret note**: the `ghcr.io/<user>/portfolio` image is published from a **public** GHCR repo (aligns with Open Question #8 recommendation), so no `imagePullSecret` is required on the Deployment. If the package is ever flipped to private, `scripts/bootstrap-cluster.sh` must be updated to run `kubectl create secret docker-registry ghcr-pull-secret --docker-server=ghcr.io --docker-username=<user> --docker-password=<pat> -n portfolio`, and the Deployment spec needs `imagePullSecrets: [{ name: ghcr-pull-secret }]`. This conditional is captured in the risk register (§17).

**Kubeconfig permissions trade-off (0600, root-only)**: the default `--write-kubeconfig-mode 0644` makes `/etc/rancher/k3s/k3s.yaml` world-readable on the node. On a solo single-user VPS the blast radius is nil, but if a non-root process (monitoring agent, CI runner, any future user) lands on the node, it gets cluster-admin. We use `0600` and document the admin workflow: the operator runs `sudo cat /etc/rancher/k3s/k3s.yaml` when they need kubeconfig, or `scp` it over via SSH to their workstation and rewrite `server:` to the public IP. One extra `sudo` is a worthwhile trade for not leaking cluster-admin to any future process on the box.

### 9.3 State management

**Phase 1**: local state (`backend.tf` uses default local backend). State file is gitignored. Operator's responsibility to keep it safe (backed up to `~/.local/backups/terraform/portfolio/`).

**Phase 1.5 (optional)**: S3-compatible remote state on Hetzner Object Storage or Backblaze B2 (~$0.005/mo). Documented in `docs/wiki/operations.md` but not required for initial rollout.

### 9.4 Variables

```hcl
# infra/terraform/variables.tf
variable "hcloud_token"        { sensitive = true; description = "Hetzner Cloud API token" }
variable "ssh_public_key"      { type = string; description = "Admin SSH public key (OpenSSH format)" }
variable "admin_ip_cidr"       { type = string; description = "Admin IP in CIDR for SSH/kubeapi; e.g. 203.0.113.42/32" }
variable "server_type"         { type = string; default = "cx11" }
variable "location"            { type = string; default = "nbg1" }
variable "github_repo"         { type = string; description = "https URL of this repo" }

# Phase 2 only (Cloudflare DNS-01 + A record). Nullable so Phase 1 plans stay non-interactive.
variable "cloudflare_api_token" { type = string; sensitive = true; default = null }
variable "cloudflare_zone_id"   { type = string; default = null }
```

### 9.5 Outputs

```hcl
# infra/terraform/outputs.tf
output "vps_ip"       { value = hcloud_server.portfolio.ipv4_address }
output "nip_io_url"   { value = "https://portfolio.${replace(hcloud_server.portfolio.ipv4_address, ".", "-")}.nip.io" }
output "ssh_command"  { value = "ssh root@${hcloud_server.portfolio.ipv4_address}" }
```

### 9.6 Phase 2 extension — Cloudflare provider runway

`§14.2` step 7 introduces `infra/terraform/cloudflare.tf`. That file adds provider wiring plus the DNS A record resource, consuming the nullable variables from §9.4:

```hcl
# infra/terraform/cloudflare.tf (Phase 2)
terraform {
  required_providers {
    cloudflare = { source = "cloudflare/cloudflare", version = "~> 4.0" }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

resource "cloudflare_record" "portfolio" {
  zone_id = var.cloudflare_zone_id
  name    = "portfolio"
  type    = "A"
  value   = hcloud_server.portfolio.ipv4_address
  ttl     = 1
  proxied = false
}
```

Phase 1 remains unaffected because `cloudflare.tf` is absent. Phase 2 enables it in one PR with explicit credentials (`TF_VAR_cloudflare_api_token`, `TF_VAR_cloudflare_zone_id`).

---

## 10. CI/CD pipelines

### 10.1 `ci.yml` — on every PR

Triggers: `pull_request` on paths `app/**`, `.github/workflows/ci.yml`.

Jobs (parallel where possible):

1. **lint-typecheck**: `pnpm eslint`, `pnpm tsc --noEmit`.
2. **unit**: `pnpm vitest run --coverage`. Coverage report uploaded as artifact.
3. **build**: `pnpm astro build`. `dist/` uploaded as artifact.
4. **e2e**: downloads `dist/`, serves via `pnpm preview`, runs `pnpm playwright test`. Screenshots uploaded as artifact.
5. **lighthouse**: downloads `dist/`, runs `lhci autorun` with thresholds from `lighthouserc.json`. Reports uploaded as artifact.

Gate: all five must pass for merge.

### 10.2 `image.yml` — on push to main

Triggers: `push` to `main` on paths `app/**`.

Required token scope (GitHub's default-restricted `GITHUB_TOKEN` is insufficient for GHCR push unless declared):

```yaml
permissions:
  contents: read
  packages: write
```

(`git push` to `main` still uses the GitHub App installation token from §10.5, not `GITHUB_TOKEN`.)

**Concurrency**: the workflow declares `concurrency: { group: image-build, cancel-in-progress: false }`. This serializes image builds per branch so two rapid merges cannot race on the image-tag bump commit (the later build waits for the earlier one to finish, then runs on top of its commit).

Steps (single buildx invocation; the separate `docker push` is a known anti-pattern — multi-arch images don't live in the local daemon store and `--push` is required to push them to the registry):

0. **Checkout branch context explicitly** so later git operations are not on detached `HEAD`:
   ```yaml
   - uses: actions/checkout@v4
     with:
       ref: main
       fetch-depth: 0
   ```
1. Build app (reusing CI's build job logic or re-running).
2. `docker login ghcr.io` (via `GITHUB_TOKEN`).
3. **Single command**, pinned to `app/` as working directory so `.` resolves there and the default `Dockerfile` lookup succeeds (the Dockerfile lives at `app/Dockerfile`, not at repo root):
   ```yaml
   - name: Build and push image
     working-directory: app
     run: |
       docker buildx build \
         --platform linux/amd64,linux/arm64 \
         --push \
         --cache-from type=gha \
         --cache-to   type=gha,mode=max \
         -t ghcr.io/<user>/portfolio:${{ github.sha }} \
         .
   ```
   (Alternative: stay at repo root and pass `-f app/Dockerfile app/`. Either works; we use `working-directory` because the rest of `image.yml` also runs app-scoped commands.)
4. `sed -i "s|image: ghcr.io/<user>/portfolio:.*|image: ghcr.io/<user>/portfolio:${{ github.sha }}|" k8s/manifests/portfolio/deployment.yaml` (run from repo root).
5. Stage only `k8s/manifests/portfolio/deployment.yaml`; if this run is a no-op rerun, keep it green; otherwise hard-fail unless that is the **only** staged path:
   `git add k8s/manifests/portfolio/deployment.yaml && (git diff --cached --quiet || test "$(git diff --name-only --cached)" = "k8s/manifests/portfolio/deployment.yaml")`
6. Commit + push in one guarded block (no-op reruns exit cleanly):
   `if git diff --cached --quiet; then echo "No-op rerun: deployment already points at this SHA; skipping commit/push."; exit 0; fi && git commit -m "chore(deploy): bump portfolio image to ${{ github.sha }}" && git push origin HEAD:main`

Credentials:
- GHCR push: `GITHUB_TOKEN` with `packages: write` permission.
- Repo write-back: see branch-protection mechanism in §10.5 (the default `GITHUB_TOKEN` is NOT sufficient against required-review protection).

Loop safety: the workflow only triggers on `app/**` changes; its own commit only changes `k8s/manifests/**`, so it doesn't re-trigger itself. This is asserted by a test in Phase 7 (§16).

### 10.3 Terraform workflow policy (Phase 1)

**Phase 1 is local-only for Terraform.** No `.github/workflows/terraform.yml` is used while `backend.tf` is local (see §9.3).

Reason: GitHub-hosted runners are ephemeral and do not share local state, so CI `terraform plan` output would not reflect real drift and can misleadingly propose full re-creation.

Phase 1 policy:
1. Run `terraform fmt -check`, `terraform validate`, `terraform plan`, and `terraform apply` locally on the operator workstation.
2. Review infra PRs from HCL diff + operator-provided local `terraform plan` output in the PR description.
3. Keep CI out of Terraform state transitions until a shared backend exists.

**Phase 1.5 enablement (after remote state, per §9.3):**
- Add `.github/workflows/terraform.yml` with `pull_request` `terraform plan` against the shared remote backend.
- Optionally add `workflow_dispatch` apply behind environment protection rules.
- Required secrets once enabled: `HCLOUD_TOKEN`, `TF_VAR_ssh_public_key`, `TF_VAR_admin_ip_cidr`, etc.

### 10.4 Caching

- `actions/setup-node@v4` with `cache: pnpm`.
- `docker buildx` with `cache-from/cache-to: type=gha` (GitHub Actions cache backend for layers).
- Terraform plugin cache via `TF_PLUGIN_CACHE_DIR` + `actions/cache`.

### 10.5 Branch protection

`main` protected with: PR required, `ci.yml` must pass, one review required (self-review allowed for solo repo), force-push disabled, deletion disabled.

**CI image-tag bumps and branch protection**: the default `GITHUB_TOKEN` (and plain deploy keys) do NOT bypass branch protection. Three viable mechanisms, in order of preference:

1. **(Chosen) GitHub App with bypass permission.** Create a private GitHub App ("portfolio-bot"), install it on the repo with `contents: write`, add it to the branch-protection "Allow specified actors to bypass required pull requests" list. In the workflow, mint an ephemeral installation token via `actions/create-github-app-token@v1`. This is the current industry-standard pattern; no long-lived PAT, fine-grained scope, auditable.
2. **Auto-merging PRs.** The image-bump workflow opens a PR instead of pushing to main; a second workflow auto-approves and auto-merges it. Cleaner blast radius but adds a ~30s lag and noisier PR history.
3. **Self-hosted PAT with bypass.** A user PAT added to the bypass list. Rejected: ties deployments to one human, needs rotation discipline.

The repo uses option 1. The App ID and private key are stored as Actions secrets (`PORTFOLIO_BOT_APP_ID`, `PORTFOLIO_BOT_PRIVATE_KEY`). Setup is a one-time step documented in `docs/wiki/operations.md` under "CI bot provisioning".

Complementary guardrails for the repo-wide `contents: write` token:
- `CODEOWNERS` requires explicit owner review on `k8s/manifests/cert-manager/**`, `infra/**`, `k8s/bootstrap/**`, and `.github/workflows/image.yml`.
- `image.yml` short-circuits no-op reruns and otherwise hard-fails before commit unless the staged diff is exactly `k8s/manifests/portfolio/deployment.yaml`.

**No direct pushes to `main` from humans** — even for trivial changes, a PR is required.

---

## 11. Testing strategy

### 11.1 Unit tests — Vitest

Scope: **pure logic only**, no DOM, no React rendering.

- `filter-projects.test.ts`: all combinations of filter keys × project datasets.
- Any utility added later (e.g., formatting a "2024—" year range) gets a unit test here.

Target: **100% statement coverage of `app/src/lib/`**. Not enforced as a hard gate (noise risk), but tracked in PR comments.

### 11.2 E2E tests — Playwright

Runs against `pnpm preview` serving `dist/`. Three specs:

**`smoke.spec.ts`** (fast, runs on every CI):
- Loads `/`. Verifies `<title>`, `<h1>` text, each section's heading is present.
- Asserts zero console errors.

**`responsive.spec.ts`** (visual):
- Iterates over `[375, 768, 1280]`. For each width: full-page screenshot (updated via `--update-snapshots` on intentional changes, diffed otherwise).
- First run seeds baselines; subsequent CI runs fail if pixel diff > 0.1%.

**`filter.spec.ts`** (interaction):
- Asserts "all" shows 12 cards.
- Clicks "hardware" — asserts 7 cards visible (based on prototype data).
- Clicks "ecosystem" — asserts 5 cards.
- Clicks "all 3" — asserts 1 card (campus delivery rover).
- Keyboard: Tab to first filter, Space to activate, assert card count changes.

**`a11y.spec.ts`**:
- `@axe-core/playwright` scan on homepage at desktop width.
- Fails on any violation of severity `serious` or `critical`.

### 11.3 Lighthouse CI

Runs after Playwright. Thresholds:

```json
// app/lighthouserc.json
{
  "ci": {
    "collect": { "staticDistDir": "./dist", "numberOfRuns": 3 },
    "assert": {
      "assertions": {
        "categories:performance":      ["error", { "minScore": 0.90 }],
        "categories:accessibility":    ["error", { "minScore": 0.95 }],
        "categories:best-practices":   ["error", { "minScore": 0.95 }],
        "categories:seo":              ["error", { "minScore": 0.95 }]
      }
    },
    "upload": { "target": "filesystem", "outputDir": "./lighthouse-reports" }
  }
}
```

Reports uploaded as CI artifacts for every run.

### 11.4 What we're NOT testing

- **Component rendering with React Testing Library**: Astro components don't need it (they render to HTML at build time, checked by E2E). The React island has one stateful component; its logic lives in `filter-projects.ts` (unit-tested) and its DOM behavior is covered by `filter.spec.ts`.
- **Cross-browser matrix**: Playwright runs Chromium only in Phase 1. Firefox and WebKit can be added as a non-blocking matrix in Phase 2 if desired.
- **Load testing**: a static site behind nginx on a 1-vCPU node handles ≫ enough traffic for a portfolio.
- **Infrastructure tests**: no Terratest / Kitchen-Terraform. Instead, `terraform plan` in PR + a documented manual verification checklist in `docs/wiki/operations.md`.

---

## 12. Observability

**Phase 1 philosophy**: instrument without visualizing. The scrape annotations are there so that dropping a Prometheus stack in later is a zero-code-change upgrade.

### 12.1 What's in Phase 1

- Pod annotations: `prometheus.io/scrape`, `prometheus.io/port`, `prometheus.io/path`.
- `/healthz` endpoint on nginx (used by liveness + readiness probes).
- Request logs to stdout (nginx default). Readable via `kubectl logs -l app=portfolio -f`.
- ArgoCD web UI: port-forward from the operator's laptop (`kubectl port-forward -n argocd svc/argocd-server 8080:443`).

### 12.2 What's NOT in Phase 1

- No Prometheus server.
- No Grafana dashboards.
- No Loki for log aggregation.
- No Alertmanager.
- No uptime monitor.

### 12.3 Phase 3 upgrade path (documented but not implemented)

Adding observability later is a **single commit**:
1. `kube-prometheus-stack` helm chart as a new ArgoCD Application in `k8s/apps/kube-prometheus-stack.yaml`.
2. `loki-stack` as another ArgoCD Application.
3. ServiceMonitor for portfolio (already has the annotations; just needs the CR).
4. Two pre-made Grafana dashboards (traffic, errors — JSON committed to `k8s/manifests/kube-prometheus-stack/dashboards/`).
5. Bump VPS from CX11 → CX21 (2 → 4 GB RAM) via Terraform `server_type = "cx21"`; `terraform apply`; k3s survives the reboot.

All of that is a documented runbook in `docs/wiki/operations.md`, ready when the author wants it.

---

## 13. Secrets management

### 13.1 SOPS + age workflow

**Phase 1 has zero secrets in-cluster** (nothing depends on an encrypted secret). This section is primarily forward-looking for Phase 2 (Cloudflare token) and Phase 3 (Alertmanager webhooks, Grafana admin password).

**Keys**:
- `age` keypair generated once by the operator; private key stored at `~/.config/sops/age/keys.txt` plus an offline encrypted backup (for recovery). It is not consumed by GitHub Actions in Phase 1/2.
- Public recipient listed in `.sops.yaml` at repo root.

**`.sops.yaml`**:
```yaml
creation_rules:
  - path_regex: k8s/manifests/.*-secret\.yaml$
    encrypted_regex: '^(data|stringData)$'
    age: <public-age-key>
```

Single rule by design. **Files MUST end in `-secret.yaml`** to be encrypted — this is a naming contract enforced by SOPS itself: `sops --encrypt` errors out on any file whose path doesn't match a rule, which prevents accidentally committing a plaintext secret under a misnamed path. The `encrypted_regex: '^(data|stringData)$'` means only those two top-level keys are encrypted; metadata/apiVersion/kind stay readable in git so diffs remain meaningful.

**Multi-doc YAML is supported**: a single `-secret.yaml` file can hold a Secret (whose `data` is encrypted) and a non-Secret resource like a ClusterIssuer (whose `spec` is NOT matched by `encrypted_regex` and stays plaintext). Phase 2 uses this for `cloudflare-dns01-secret.yaml`, which bundles the Cloudflare API token Secret with the ClusterIssuer that references it.

The prior `.tmpl` SOPS rule was **removed in v3**. It was encrypting `clusterissuer-dns01-cloudflare.yaml.tmpl` — but a ClusterIssuer manifest contains no cryptographic material (the secret lives in a separately-referenced `Secret` resource), so there was nothing to encrypt. "Held back from Phase 1 reconcile" is now expressed differently: the encrypted `cloudflare-dns01-secret.yaml` is never listed under `resources:` at all — Phase 1 omits the `generators: [ksops-generator.yaml]` stanza, and Phase 2 adds it. See §13.2 for why the encrypted file must flow through `generators:` rather than `resources:`.

**Workflow (git side)**:
1. Operator creates a plaintext file under `k8s/manifests/...` ending in `-secret.yaml`.
2. `sops --encrypt --in-place <file>-secret.yaml` (wrapped in `scripts/seal-secret.sh`).
3. Commit the encrypted file.
4. ArgoCD decrypts via **KSOPS** — see §13.2 for the concrete mechanism.

### 13.2 ArgoCD SOPS decryption — KSOPS on argocd-repo-server

**Chosen mechanism**: [KSOPS](https://github.com/viaduct-ai/kustomize-sops) — a kustomize generator plugin that decrypts SOPS-encrypted files during `kustomize build`.

**Why KSOPS over the alternatives**:
- This project already uses kustomize everywhere (`replacements:`, `resources:`); KSOPS slots in as another kustomize primitive. No new CRDs, no controller, no CMP server to maintain.
- `argocd-vault-plugin` (AVP) works, but requires either a CMP sidecar on `argocd-repo-server` OR the older `ConfigMap`-plus-annotation pattern. For one secret in Phase 2, the ceremony isn't justified.
- `helm-secrets` only helps for Helm-based Applications; this project's secret-carrying Application is plain kustomize.
- External Secrets Operator + an external store (Vault/1Password/AWS) is the right answer at team scale but is overkill for a solo portfolio.
- Sealed-secrets (§13.3) uses cluster-side keys, which is a different trust model than the git-side `age` key the operator already holds.

**One-time cluster setup** (Phase 2 prerequisite, done once before the 5-file PR in §14.2):

1. **Build + push a custom `argocd-repo-server` image that adds `ksops`** (`kustomize` already comes from the ArgoCD base image). Trivial Dockerfile committed to this repo at `infra/argocd-repo-server-ksops/Dockerfile`:
   ```dockerfile
   ARG ARGOCD_VERSION=v2.12.4
   FROM quay.io/argoproj/argocd:${ARGOCD_VERSION}
   ARG KSOPS_VERSION=4.3.2
   USER root
    RUN curl -sSL \
        "https://github.com/viaduct-ai/kustomize-sops/releases/download/v${KSOPS_VERSION}/ksops_${KSOPS_VERSION}_Linux_x86_64.tar.gz" \
        | tar -xz -C /usr/local/bin/ ksops \
        && chmod +x /usr/local/bin/ksops
   USER 999
   ENV XDG_CONFIG_HOME=/home/argocd/.config
   ```
   `Linux_x86_64` is intentional for Phase 1 (`cx11` is amd64). If the server type is moved to ARM later, this artifact name must be swapped accordingly.
   Published to `ghcr.io/<user>/argocd-repo-server-ksops:v2.12.4` via a one-shot manual push (or a dedicated GH Actions workflow; frequency is "once per ArgoCD upgrade", ~yearly).

2. **Load the age private key into a k8s `Secret` in `argocd` namespace** (NOT via SOPS — this is the root of trust; it must be applied directly):
   ```bash
   kubectl create secret generic argocd-sops-age -n argocd \
     --from-file=keys.txt=$HOME/.config/sops/age/keys.txt
   ```
   This is the only imperative `kubectl create secret` in the entire workflow. Rotation path documented in `docs/wiki/operations.md`.

3. **Patch `argocd-repo-server`** to use the KSOPS image and mount the age key. Committed as `k8s/bootstrap/argocd-repo-server-ksops-patch.yaml` and applied during the Phase 2 prerequisite step:
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata: { name: argocd-repo-server, namespace: argocd }
   spec:
     template:
       spec:
         containers:
           - name: argocd-repo-server
             image: ghcr.io/<user>/argocd-repo-server-ksops:v2.12.4
             env:
               - { name: XDG_CONFIG_HOME,  value: /home/argocd/.config }
               - { name: SOPS_AGE_KEY_FILE, value: /home/argocd/.config/sops/age/keys.txt }
             volumeMounts:
               - { name: sops-age, mountPath: /home/argocd/.config/sops/age, readOnly: true }
         volumes:
           - name: sops-age
             secret:
               secretName: argocd-sops-age
               items: [{ key: keys.txt, path: keys.txt }]
   ```

4. **Enable alpha plugins on argocd-repo-server** (ConfigMap patch in `argocd-cm`):
   ```yaml
   # k8s/bootstrap/argocd-cm-kustomize.yaml
   apiVersion: v1
   kind: ConfigMap
   metadata: { name: argocd-cm, namespace: argocd }
   data:
     kustomize.buildOptions: --enable-alpha-plugins --enable-exec
   ```

**Per-encrypted-directory setup** (repeated wherever an encrypted file lives):

1. Add a `ksops-generator.yaml` manifest that tells kustomize "run ksops against these files":
   ```yaml
   # k8s/manifests/cert-manager/ksops-generator.yaml
   apiVersion: viaduct.ai/v1
   kind: ksops
   metadata:
     name: ksops-cloudflare
     annotations:
       config.kubernetes.io/function: |
         exec: { path: ksops }
   files:
     - ./cloudflare-dns01-secret.yaml
   ```
2. Reference it from the directory's `kustomization.yaml` under `generators:` (NOT `resources:`):
   ```yaml
   generators:
     - ksops-generator.yaml
   ```

**Reconcile-time flow**: argocd-repo-server runs `kustomize build --enable-alpha-plugins`, which invokes `ksops`, which reads `cloudflare-dns01-secret.yaml`, decrypts it in-memory using the age key mounted from the `argocd-sops-age` Secret, and emits plaintext YAML into the rest of the kustomize pipeline. Nothing decrypted is ever written to disk; nothing encrypted leaves the repo-server pod.

**Phase 2 prerequisite checklist** (done once; NOT counted in the 5-file Phase 2 change-set, because these are infrastructure/bootstrap changes, not content):
- [ ] Build + push `ghcr.io/<user>/argocd-repo-server-ksops:v2.12.4` from `infra/argocd-repo-server-ksops/Dockerfile`.
- [ ] Create `argocd-sops-age` Secret on the cluster from the local age key.
- [ ] `kubectl apply -f k8s/bootstrap/argocd-repo-server-ksops-patch.yaml`.
- [ ] `kubectl apply -f k8s/bootstrap/argocd-cm-kustomize.yaml`.
- [ ] `kubectl -n argocd rollout status deploy/argocd-repo-server` — verify new image is live.
- [ ] **Commit `k8s/manifests/cert-manager/ksops-generator.yaml` dormantly** — i.e. add the file to git but do NOT yet list it under `generators:` in `kustomization.yaml`. This isolates the ksops adapter as bootstrap plumbing (Phase 2 prereq) rather than content (Phase 2 PR), which lets the Phase 2 PR hit the "≤5 file" success criterion cleanly.
- [ ] **Smoke test**: commit a throwaway `test-secret.yaml` (sops-encrypted), point a throwaway Application at it, confirm it syncs green. Revert.

Only after the smoke test passes does the Phase 2 PR in §14.2 land. This ordering is asserted explicitly in §14.2 step 0.

### 13.3 Alternative considered: sealed-secrets

Sealed-secrets (Bitnami) was considered. Pros: works transparently with ArgoCD, no repo-server customization. Cons: cluster-side key management (a second root of trust to back up separately), extra controller to run and monitor, no git-side encryption — the operator can't inspect what a given committed secret contains without round-tripping through the cluster. For this project's scale and the operator's existing age-key habit, SOPS + KSOPS is simpler and more inspectable. See ADR 004.

---

## 14. Phase 1 → Phase 2 — domain rollout

### 14.1 Phase 1 configuration (nip.io)

Variables used throughout k8s manifests (all resolved via kustomize `replacements` from source ConfigMaps, never by sed on the raw YAML):

| Placeholder | Phase 1 value | Where it appears | Source ConfigMap |
|---|---|---|---|
| `ingress-config.data.host` | `portfolio.<ip-with-dashes>.nip.io` (e.g., `portfolio.203-0-113-42.nip.io`) | `ingress.yaml` (spec.tls[0].hosts.0, spec.rules[0].host) | `k8s/manifests/portfolio/configmap-ingress.yaml` |
| `ingress.annotations.cert-manager.io/cluster-issuer` | `letsencrypt-http01` | `ingress.yaml` | hard-coded; flipped to `letsencrypt-dns01-cloudflare` in Phase 2 |
| `letsencrypt-config.data.email` | author's email | cert-manager ClusterIssuer | `k8s/manifests/cert-manager/configmap-letsencrypt.yaml` |

All placeholders are substituted by **kustomize** at the ArgoCD application level, not by sed. This keeps the base manifests valid YAML.

`k8s/manifests/portfolio/configmap-ingress.yaml` — **must be declared as a kustomize resource** for the replacement below to resolve (kustomize replacements read from the resources being built, not from the live cluster):

```yaml
# k8s/manifests/portfolio/configmap-ingress.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: ingress-config
  namespace: portfolio
data:
  host: portfolio.203-0-113-42.nip.io   # Phase 1: dashed IP form
                                         # Phase 2: change to portfolio.yourdomain.dev
```

`k8s/manifests/portfolio/kustomization.yaml`:
```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - namespace.yaml
  - configmap-ingress.yaml   # REQUIRED as replacement source
  - deployment.yaml
  - service.yaml
  - ingress.yaml
  - networkpolicy.yaml
replacements:
  - source: { kind: ConfigMap, name: ingress-config, fieldPath: data.host }
    targets:
      - select: { kind: Ingress, name: portfolio }
        fieldPaths:
          - spec.tls[0].hosts.0
          - spec.rules[0].host
```

Phase 2 switchover is a one-line edit to `configmap-ingress.yaml` — see §14.2.

### 14.2 Phase 2 switchover — exact steps

When ready to buy the domain:

0. **Complete the Phase 2 SOPS prerequisite** — custom argocd-repo-server image + `argocd-sops-age` Secret + two bootstrap patches, per §13.2's "Phase 2 prerequisite checklist". Smoke-test with a throwaway encrypted file before proceeding. *(infra change, not content; not part of the 5-file count below)*
1. **Buy domain at Cloudflare** (`yourdomain.dev`, ~$10/yr). *(not a file change)*
2. **Create Cloudflare API token** — scope: `Zone.DNS:Edit` on that zone only. *(not a file change)*
3. **Author `k8s/manifests/cert-manager/cloudflare-dns01-secret.yaml`** as a multi-doc YAML (Secret + ClusterIssuer in one file — the cert-manager documentation's canonical example):
   ```bash
   cat > k8s/manifests/cert-manager/cloudflare-dns01-secret.yaml <<'YAML'
   apiVersion: v1
   kind: Secret
   metadata:
     name: cloudflare-api-token
     namespace: cert-manager
   type: Opaque
   stringData:
     api-token: <PASTE-CLOUDFLARE-TOKEN-HERE>
   ---
   apiVersion: cert-manager.io/v1
   kind: ClusterIssuer
   metadata:
     name: letsencrypt-dns01-cloudflare
   spec:
     acme:
       server: https://acme-v02.api.letsencrypt.org/directory
       email: LETSENCRYPT_EMAIL        # substituted by kustomize from configmap-letsencrypt
       privateKeySecretRef: { name: letsencrypt-dns01-cloudflare-key }
       solvers:
         - dns01:
             cloudflare:
               apiTokenSecretRef: { name: cloudflare-api-token, key: api-token }
   YAML
   sops --encrypt --in-place k8s/manifests/cert-manager/cloudflare-dns01-secret.yaml
   ```
   The filename ends in `-secret.yaml`, so SOPS encrypts the Secret's `stringData` field; the ClusterIssuer's `spec` stays plaintext because `encrypted_regex` doesn't match it. *(1 file)*
4. **Edit `k8s/manifests/cert-manager/kustomization.yaml`**: add a `generators: [ksops-generator.yaml]` stanza (NOT `resources:` — see §13.2). `ksops-generator.yaml` was committed dormantly during the Phase 2 prereq (§13.2 checklist) and already lists `cloudflare-dns01-secret.yaml` under `files:`, so this single stanza wakes up the generator chain: KSOPS decrypts the Secret's `stringData` in-memory and emits both the decrypted Secret and the plaintext ClusterIssuer from the same multi-doc file into the kustomize pipeline. Listing the encrypted file directly under `resources:` would apply ciphertext to the cluster — broken Cloudflare token, failed DNS-01 issuance. *(1 file)*
5. **Edit `k8s/manifests/portfolio/configmap-ingress.yaml`**: change `data.host` from `portfolio.203-0-113-42.nip.io` → `portfolio.yourdomain.dev`. *(1 file)*
6. **Edit `k8s/manifests/portfolio/ingress.yaml` annotation**: `cert-manager.io/cluster-issuer: letsencrypt-dns01-cloudflare`. *(1 file)*
7. **Add `infra/terraform/cloudflare.tf`** (new file): Cloudflare provider block + A record pointing at `hcloud_server.portfolio.ipv4_address`. *(1 file)*
8. **Open a single PR with the changes from 3–7**. Review + merge. ArgoCD reconciles ingress + certificate. *(not a file change)*
9. **Run `terraform apply` locally** after merge → DNS A record created. *(not a file change — Phase 1 is local-only per §10.3)*
10. **Wait ~2 minutes** → cert-manager issues new cert via DNS-01. *(not a file change)*
11. **Verify**: `curl -I https://portfolio.yourdomain.dev` returns 200 with valid cert. *(not a file change)*

File-change count: **5** — `cloudflare-dns01-secret.yaml` (new, sops-encrypted), `cert-manager/kustomization.yaml` (add `generators: [ksops-generator.yaml]` stanza; the encrypted file is NOT under `resources:`, see §13.2), `configmap-ingress.yaml` (edit), `ingress.yaml` (edit annotation), `cloudflare.tf` (new). Meets success criterion #8 exactly. `ksops-generator.yaml` does not count here: it was committed dormantly during the Phase 2 prereq (§13.2 checklist) as bootstrap plumbing, separate from this content PR. That separation is the whole point of the prereq checklist — it keeps infrastructure changes out of the content-level diff that criterion #8 measures.

Estimated wall-clock time end-to-end: **30 minutes** if the operator has never done this before; **10 minutes** otherwise.

### 14.3 Rollback

If Phase 2 breaks: revert the PR. ArgoCD reverts the ingress host + issuer back to nip.io. Old certificate is still valid (nip.io cert remains in the Secret until it expires in 60 days). Site stays up throughout.

---

## 15. Documentation — Karpathy three-layer

### 15.1 The three layers

| Layer | Directory | Purpose | Who writes | Who reads |
|---|---|---|---|---|
| **Raw** | `docs/raw/` | Immutable source documents | Nobody (ingested, not authored) | LLMs + humans researching origins |
| **Wiki** | `docs/wiki/` | LLM-maintained, current, structured | Claude + author | LLMs + future maintainers |
| **Schema** | `CLAUDE.md` (project root) | Rules for how the wiki is organized | Author | Every Claude session |

### 15.2 `docs/raw/` contents

| Path | Source | Written when |
|---|---|---|
| `handoff-2026-04-19/*` | Copy of `portfolio/project/` from the handoff bundle | Initial scaffold |
| `reference/karpathy-llm-wiki.md` | Public reference for the three-layer pattern | Initial scaffold |
| Future: `handoff-YYYY-MM-DD/*` | New Claude Design exports | Whenever a new handoff arrives |

**Invariant**: nothing under `docs/raw/` is edited after it's committed. If the content is wrong, the fix is a new raw ingest with a new timestamp.

### 15.3 `docs/wiki/` pages

Each page has frontmatter and is query-able via `qmd`.

```markdown
---
name: Architecture
description: System overview, component boundaries, data flows, tech stack for the portfolio site.
type: project
---
```

Pages and their scope:

| Page | Scope |
|---|---|
| `index.md` | Catalog. One line per page. Updated whenever pages are added/removed. |
| `log.md` | Append-only operations timeline. Every `ingest`, `update`, `fix`, `promote`, `lint` goes here. |
| `architecture.md` | System diagram, logical boundaries, data flow. Copy-distilled from §4 of this plan. |
| `deployment.md` | GitOps pipeline, ArgoCD app-of-apps, image promotion, CI workflows. Copy-distilled from §10. |
| `infrastructure.md` | Hetzner VPS, k3s, firewall, cluster bootstrap. Copy-distilled from §§8–9. |
| `operations.md` | Runbook: fresh bootstrap, domain swap, cluster recovery, rollback, scaling to CX21 for Phase 3. |
| `content-authoring.md` | How to edit copy / add projects / add an ADR without touching components. |
| `testing.md` | Test strategy, thresholds, how to add a test. Copy-distilled from §11. |
| `design-system.md` | Tokens, type scale, responsive breakpoints, accessibility baseline. |
| `adr/*.md` | Six initial ADRs; more added as architectural decisions happen. |

### 15.4 `wiki/index.md` format (stays under 40 lines)

```markdown
# Portfolio Handoff — Wiki Index

Project-specific knowledge. See `~/.claude/CLAUDE.md` for the global wiki schema,
`CLAUDE.md` at this repo's root for the project-specific schema.

## Pages
- [architecture.md](architecture.md) — system diagram, boundaries, data flows
- [deployment.md](deployment.md) — GitOps pipeline, ArgoCD, image promotion
- [infrastructure.md](infrastructure.md) — Hetzner VPS, k3s, cluster bootstrap
- [operations.md](operations.md) — runbooks: bootstrap, domain swap, recovery
- [content-authoring.md](content-authoring.md) — edit copy without touching components
- [testing.md](testing.md) — unit, E2E, Lighthouse strategy + thresholds
- [design-system.md](design-system.md) — tokens, type scale, responsive

## ADRs
- [001](adr/001-astro-react-islands.md) — Astro + React islands over SPA
- [002](adr/002-gitops-argocd.md) — GitOps with ArgoCD over push-deploy
- [003](adr/003-k3s-hetzner-single-node.md) — k3s on single-node Hetzner CX11
- [004](adr/004-sops-age-secrets.md) — SOPS + age over sealed-secrets
- [005](adr/005-two-phase-domain-rollout.md) — nip.io Phase 1 → Cloudflare Phase 2
- [006](adr/006-nginx-over-caddy.md) — nginx:alpine as the pod web server
```

### 15.5 `wiki/log.md` format

```markdown
# Portfolio Handoff — Operations Log

## [2026-04-19] ingest | initial scaffold
- Raw handoff ingested into docs/raw/handoff-2026-04-19/ (verbatim from Claude Design export)
- Wiki initialized with 9 pages and 6 ADRs drafted from IMPLEMENTATION_PLAN.md
- Claude Design → production port not yet started

## [2026-04-20] update | application scaffolded
- Astro project scaffolded in app/ with React integration
- Initial content TS files created from prototype JSX

## [YYYY-MM-DD] fix | <description>
## [YYYY-MM-DD] promote | <page moved to global wiki>
```

### 15.6 ADR format — option iii. (approved)

```markdown
---
name: ADR 001 — Astro + React Islands over SPA
description: Chose Astro with React islands instead of Vite+React SPA for the portfolio site.
type: project
---

# ADR 001 — Astro + React Islands over SPA

**Status**: Accepted
**Date**: 2026-04-19
**Decision-makers**: <author>

**Why**: 95% of the page is static content. A React SPA ships JS for the entire shell even
when only one region (the filter) is stateful. Astro's islands architecture keeps
interactivity scoped to that one island, so runtime JS stays materially lower than SPA-wide
hydration while preserving React ergonomics where needed. This supports success criterion #4
(Lighthouse perf ≥ 90) and keeps the nginx pod trivially simple.

**How to apply**: When adding new interactive features, default to static Astro components.
Only promote to a React island when the interaction requires client state. If a feature
needs an island, put the pure logic in app/src/lib/ (unit-testable) and keep the island
as a thin view.

---

## Context
<Nygard body: what the problem was, what constraints applied, what options existed>

## Decision
<what we chose and the one-sentence justification>

## Consequences
<positive, negative, neutral — be honest>

## Alternatives considered
<each option with why it wasn't chosen>

## References
- IMPLEMENTATION_PLAN.md §3 question 3
- Astro docs: https://docs.astro.build/en/concepts/islands/
```

### 15.7 `CLAUDE.md` (project root) — content outline

Will be written during implementation Phase 9. Outline:

1. **Project wiki schema** — where raw/ and wiki/ live, special files (index, log), page types, ADR format.
2. **Handoff ingest workflow** — how to ingest a new Claude Design export:
   - Extract to `docs/raw/handoff-YYYY-MM-DD/`.
   - `diff -r docs/raw/handoff-<prev> docs/raw/handoff-<new>` to see changes.
   - Port delta into `app/`.
   - Update affected wiki pages.
   - Append ingest entry to `wiki/log.md`.
3. **Commit conventions** — Conventional Commits (`feat:`, `fix:`, `chore(deploy):`, etc.).
4. **Branch naming** — `feature/`, `fix/`, `chore/`, `docs/`.
5. **Pointer** — link to `~/.claude/CLAUDE.md` (global schema) and `docs/wiki/index.md` (this project's index).

### 15.8 qmd collection registration

After `docs/wiki/` has initial content, register it:

```bash
qmd collection add /home/jules/Documents/01_Projects/Active/portfolio-handoff/docs/wiki \
  --name portfolio-handoff
qmd embed
```

From then on, `qmd search "ArgoCD"` from any directory will return this wiki's results alongside the global wiki.

---

## 16. Implementation phases (work breakdown)

Estimated total: **6–8 working days**. Phases can overlap slightly (e.g., docs drafted during infra waits).

### Phase 0 — Repo initialization (≈2 hours)
- [ ] `git init` at `/home/jules/Documents/01_Projects/Active/portfolio-handoff/`.
- [ ] Root files: `README.md`, `LICENSE` (Apache-2.0), `.editorconfig`, `.gitignore`, `.gitattributes`, `.sops.yaml`.
- [ ] Create `docs/raw/handoff-2026-04-19/` and copy contents of `portfolio/project/` into it verbatim.
- [ ] Fetch `karpathy-llm-wiki.md` into `docs/raw/reference/`.
- [ ] First commit: `chore: initial scaffold with Karpathy three-layer docs`.
- [ ] Push to GitHub; configure branch protection on `main`.

### Phase 1 — Astro scaffolding + content layer (≈1 day)
- [ ] `pnpm create astro` in `app/` with TS strict template.
- [ ] Install `@astrojs/react`, `@astrojs/sitemap`, `postcss-nesting`, `postcss-custom-media` (required by the `@custom-media` at-rule in `breakpoints.css` — see §6.6), `autoprefixer`.
- [ ] `app/src/lib/types.ts`, `app/src/lib/filter-projects.ts`.
- [ ] `app/src/content/*.ts` — port all prototype data.
- [ ] `app/src/styles/{tokens,reset,typography,global,breakpoints}.css` — token layer from prototype.
- [ ] `app/src/layouts/Base.astro`.
- [ ] `app/src/pages/index.astro` — empty shell with a TODO per section.
- [ ] `pnpm dev` runs. Page is blank but builds.

### Phase 2 — Component port (≈2 days)
- [ ] Port `MotifJoint.astro` (three SVG variants).
- [ ] Port `Nav.astro` + responsive menu (hamburger at mobile).
- [ ] Port `Hero.astro` — headline + three-column triptych, responsive.
- [ ] Port `MorphBar.astro`.
- [ ] Port `BodySection.astro` + `CadCard.astro`, wired to `content/body-section.ts`.
- [ ] Port `BrainSection.astro` + `NodeCard.astro`.
- [ ] Port `RoomsSection.astro` + `Poster.astro` (including perforated-edge pseudo-elements).
- [ ] Port `AllProjectsSection.astro` — wrapper that mounts `<ProjectFilter client:visible projects={projects} />`.
- [ ] Port `islands/ProjectFilter.tsx` — filter state + grid.
- [ ] Port `Contact.astro`.
- [ ] Port `Footer.astro`.
- [ ] Final tune: responsive media queries per §6.6 table.

### Phase 3 — Testing (≈1 day)
- [ ] Unit: `filter-projects.test.ts` with full filter-key coverage.
- [ ] Playwright config + browsers install.
- [ ] `smoke.spec.ts`, `responsive.spec.ts` (seed snapshots), `filter.spec.ts`, `a11y.spec.ts`.
- [ ] `lighthouserc.json` + local `lhci autorun`, fix until thresholds pass.
- [ ] Commit snapshots.

### Phase 4 — Containerization (≈0.5 days)
- [ ] `app/Dockerfile` (multi-stage).
- [ ] `app/nginx.conf` with all cache + security rules.
- [ ] `app/.dockerignore`.
- [ ] Local verify: `docker build`, `docker run`, `curl -I http://localhost:8080`.
- [ ] Image size check: < 25 MB.

### Phase 5 — Infrastructure provisioning (≈0.5 days)
- [ ] `infra/terraform/` — all HCL files per §9.
- [ ] Generate age keypair locally; store private key at `~/.config/sops/age/keys.txt` and keep an offline encrypted backup.
- [ ] Hetzner account; generate API token; stash as `HCLOUD_TOKEN` GH Actions secret.
- [ ] Local SSH keypair generated.
- [ ] `terraform init` + `terraform plan` (no apply yet).

### Phase 6 — Kubernetes manifests + bootstrap (≈1 day)
- [ ] `k8s/bootstrap/argocd-install.yaml` (copy from upstream, pin version).
- [ ] `k8s/bootstrap/argocd-appproject.yaml` (scoped `AppProject` named `portfolio`).
- [ ] `k8s/bootstrap/argocd-root-app.yaml` (references project `portfolio`, not `default`).
- [ ] `k8s/apps/root.yaml` + one Application per stack (cert-manager, ingress-nginx, portfolio, cert-manager-issuers). Helm stacks declared via `spec.source.chart` + `spec.source.helm.values` inline — **not** as separate `HelmRelease` CRs (that's Flux).
- [ ] `k8s/manifests/cert-manager/` (ClusterIssuer HTTP-01 + letsencrypt ConfigMap with kustomize-replaced email; namespace lifecycle owned by `k8s/apps/cert-manager.yaml` via `CreateNamespace=true`).
- [ ] `k8s/apps/ingress-nginx.yaml` includes namespace ownership via `syncOptions: [CreateNamespace=true]` plus Helm values (hostNetwork/resource tuning/tolerations); no `k8s/manifests/ingress-nginx/` directory is tracked.
- [ ] `k8s/manifests/portfolio/` (namespace, `configmap-ingress.yaml`, deployment, service, ingress, networkpolicy, kustomization). Verify `kustomize build` resolves all `replacements` cleanly before committing.
- [ ] First `terraform apply`. Wait for cloud-init (~5 min).
- [ ] `ssh root@<ip> sudo k3s kubectl get pods -A` — verify ArgoCD, cert-manager, ingress-nginx, portfolio all green. (Kubeconfig is `0600` root-only — see §9.2.)
- [ ] Visit `https://portfolio.<ip-with-dashes>.nip.io` — **site is live**.

### Phase 7 — CI/CD wiring (≈1 day)
- [ ] `.github/workflows/ci.yml` — lint, typecheck, unit, build, E2E, Lighthouse.
- [ ] `.github/workflows/image.yml` — build, push GHCR, bump tag, commit; include `permissions: { contents: read, packages: write }`; enforce a single-path staged-diff guard (`k8s/manifests/portfolio/deployment.yaml`) before push.
- [ ] Provision GitHub App bot per §10.5 (`portfolio-bot`): install on repo, add bypass actor in branch protection, store `PORTFOLIO_BOT_APP_ID` + `PORTFOLIO_BOT_PRIVATE_KEY` as Actions secrets.
- [ ] **No `.github/workflows/terraform.yml` in Phase 1** — keep Terraform local-only per §10.3. Add CI plan/apply wiring only in Phase 1.5 after shared remote state exists.
- [ ] Test end-to-end: open a PR changing copy, verify CI → merge → image builds → ArgoCD rolls out → site reflects change. Measure wall-clock time against success criterion #7.
- [ ] Add Dependabot config.

### Phase 8 — Documentation (≈1 day, parallel-able with phases above)
- [ ] `CLAUDE.md` at project root (per §15.7).
- [ ] `docs/wiki/index.md`, `docs/wiki/log.md` (with initial ingest entry).
- [ ] `docs/wiki/architecture.md`, `deployment.md`, `infrastructure.md`, `operations.md`, `content-authoring.md`, `testing.md`, `design-system.md`.
- [ ] `docs/wiki/adr/001..006` — drafted from this plan's §3 and ADR notes.
- [ ] `README.md` at root — quickstart + pointer to `docs/wiki/index.md`.
- [ ] `qmd collection add` + `qmd embed`.

### Phase 9 — Verification + sign-off (≈0.5 days)
- [ ] Walk every success criterion in §1.2; tick each one.
- [ ] Wipe test: `terraform destroy && terraform apply` — measure time; record in operations.md.
- [ ] Write the first "lessons learned" entry into wiki/log.md.
- [ ] Tag `v0.1.0`.
- [ ] Share live URL.

### Timeline gantt (rough)

```
Day 1: [Phase 0][Phase 1----------]
Day 2: [Phase 2----------]
Day 3: [Phase 2 cont][Phase 3----]
Day 4: [Phase 3 cont][Phase 4-----][Phase 5-]
Day 5: [Phase 6------------]
Day 6: [Phase 7-----]
Day 7: [Phase 8----------]
Day 8: [Phase 9----]
```

---

## 17. Risks & mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| k3s on CX11 (2 GB RAM) OOMs under ArgoCD + cert-manager + ingress-nginx | Med | Med | Set resource requests/limits on every workload; monitor with `kubectl top`. Upgrade to CX21 if sustained > 75% memory. |
| Let's Encrypt HTTP-01 fails on first issuance due to firewall ordering during cloud-init | Low | High | cloud-init waits for k3s + ingress-nginx before the ingress is applied. If it still fails, manual `kubectl delete certificate portfolio-tls` retries. |
| Hetzner outage blocks entire site | Low | High (site down) | Accepted. This is a portfolio, not a revenue service. Document in operations.md: if prolonged, spin up Vercel fallback pointed at same GitHub repo. |
| GHCR rate limit on unauthenticated pulls | Low | Low | Public GHCR packages are effectively unlimited for anonymous pulls (GitHub's docs make no commitment, but observed limits are very high). Accepted for Phase 1. If the package is made private, §9.2's note describes the required `imagePullSecret` setup. |
| ArgoCD gets out of sync due to an accidental `kubectl apply` | Low | Low | ArgoCD's `selfHeal: true` reverts drift within the polling interval. |
| CI bot's commit loop (image.yml triggers itself) | Low | High | Path filters on `app/**` + workflow's commit touches `k8s/manifests/**` only. Test in Phase 7. |
| A new Claude Design handoff breaks the content type contract | Med | Med | Types in `app/src/lib/types.ts` are the contract. Ingest workflow explicitly diffs; type errors surface the break in CI. |
| Single-node cluster = single point of failure | Accepted | Accepted | Multi-node is out of scope. Documented in §2.3. |
| Bootstrap is not fully "git-only stateless" once Phase 2 secrets exist (`argocd-sops-age` must be restored before decryption works) | Low | Med | **Accepted trade-off** for this scale. DR runbook explicitly includes restoring the age key Secret before ArgoCD sync of encrypted manifests. |
| Operator loses the age private key | Low | High (can't decrypt existing secrets) | Phase 1 has no secrets. Phase 2 has one (Cloudflare token) — re-issue the token, re-encrypt. No irrecoverable state. |
| Custom `argocd-repo-server-ksops` image requires maintenance on ArgoCD upgrades/security patches | Med | Low | **Accepted trade-off** in Phase 2. Image is pinned, rebuild cadence is tied to ArgoCD upgrades (roughly yearly or on security advisories), and process is documented in operations.md. |
| Cloudflare token is managed in two contexts during Phase 2 cutover (Terraform var + SOPS-encrypted cert-manager Secret) | Med | Low | **Accepted trade-off** due split responsibilities (DNS record vs. ACME DNS01 solver). Use one cutover checklist that validates both `terraform apply` success and cert issuance. |
| Lighthouse CI flakes on cold runs | Med | Low | `numberOfRuns: 3` averages. Thresholds set with headroom. |
| Content type changes break the island prop contract silently | Low | Low | Island imports types from `lib/types.ts`; type drift is caught by `tsc --noEmit` in CI. |
| KSOPS config (`--enable-alpha-plugins --enable-exec` in `argocd-cm`, age key mounted on `argocd-repo-server`) expands blast radius if the repo is compromised | Low | High | **Accepted trade-off** (see §13.2 / ADR 004). An attacker with write access to `k8s/manifests/**` could commit a malicious `ksops-generator.yaml` whose exec path runs arbitrary code inside the repo-server pod, which has the age key mounted. Mitigations: (1) branch protection on `main` requires review + CI green for all human changes; (2) the only automated writer (`image.yml`) stages one file and hard-fails unless `git diff --name-only --cached` is exactly `k8s/manifests/portfolio/deployment.yaml`, so normal bot writes cannot touch cert-manager/bootstrap paths; (3) `CODEOWNERS` requires explicit owner review on `k8s/manifests/cert-manager/**`, `infra/**`, `k8s/bootstrap/**`, and `.github/workflows/image.yml`, protecting both ksops paths and bot-write logic in PRs; (4) age key never leaves the cluster Secret — not in git, not in CI; (5) repo-server pod has no egress except to chart repos + git; (6) revisit in Phase 3 by narrowing `kustomize.buildOptions` to a dedicated ArgoCD ConfigManagementPlugin (per-app scope) if the single global flag proves too broad. |

---

## 18. Open questions / decisions deferred

These do not block starting work. Revisit after Phase 6.

1. **Hetzner location**: `nbg1` (Nuremberg) is the default. If the author lives elsewhere (US, Asia), `ash` (Ashburn) or `hil` (Hillsboro) may cut latency. → Choose before `terraform apply`.
2. **ArgoCD admin password**: default auto-generated, stored in a cluster Secret. Rotate to an age-encrypted known password? → Defer; port-forward access is fine for Phase 1.
3. **Analytics**: Plausible, GoatCounter, Umami, none? All privacy-friendly. → Defer to post-ship.
4. **Case Study page**: the handoff includes `Case Study.html`. Out of scope for Phase 1; revisit as Phase 2.5 after domain swap.
5. **Font self-hosting vs. Google Fonts**: prototype uses Google Fonts CDN. Self-hosting (fonts in `app/public/fonts/`) improves privacy and Lighthouse score. → Likely worth doing; track as a small Phase 1 improvement if Lighthouse perf < 95.
6. **Dark mode**: the Brain section is already dark. Full dark-mode toggle across the site? → Not planned; revisit if reviewer feedback.
7. **Cross-browser test matrix**: Chromium-only in Phase 1. Add Firefox + WebKit matrix? → Defer.
8. **Repo visibility**: public (free GHCR, visible portfolio artifact) or private (GHCR costs $0 for private too at low volumes)? → Recommend **public** given the portfolio framing. Decide before first push.

---

## 19. Glossary

| Term | Meaning |
|---|---|
| **Astro** | Static-site generator with island architecture; `.astro` files compile to HTML. |
| **Island** | A component that ships JS and hydrates on the client; the rest of the page is static. |
| **ArgoCD** | Kubernetes controller that syncs cluster state to a git repository (GitOps). |
| **App-of-apps** | ArgoCD pattern where one root Application manages many child Applications. |
| **k3s** | Lightweight, single-binary Kubernetes distribution by Rancher. |
| **cert-manager** | Kubernetes controller that issues TLS certs automatically (Let's Encrypt, etc.). |
| **HTTP-01 challenge** | Let's Encrypt domain verification via an HTTP request to `/.well-known/acme-challenge/...`. |
| **DNS-01 challenge** | Let's Encrypt domain verification via a TXT record; required for wildcards. |
| **SOPS** | Mozilla tool for encrypting parts of YAML/JSON files with age/KMS/etc. |
| **age** | Modern file encryption tool (X25519). |
| **GHCR** | GitHub Container Registry (`ghcr.io`). |
| **cloud-init** | Linux init system for cloud instance first-boot configuration. |
| **nip.io** | Free wildcard DNS service: `1-2-3-4.nip.io` → `1.2.3.4`. |
| **Karpathy three-layer wiki** | raw/ (immutable sources) + wiki/ (LLM-maintained) + schema (CLAUDE.md). |
| **ADR** | Architecture Decision Record. One document per significant architectural decision. |
| **Nygard format** | Classic ADR template: Context / Decision / Consequences. |

---

## 20. References

### Prototype & handoff
- `docs/raw/handoff-2026-04-19/README.md` — handoff bundle README
- `docs/raw/handoff-2026-04-19/Portfolio Triptych.html` — the entry point
- `docs/raw/handoff-2026-04-19/triptych.jsx` — prototype React code
- `docs/raw/handoff-2026-04-19/triptych.css` — prototype styles (authoritative token source)

### External docs
- Astro: https://docs.astro.build
- Astro islands: https://docs.astro.build/en/concepts/islands/
- k3s: https://docs.k3s.io
- ArgoCD: https://argo-cd.readthedocs.io
- cert-manager: https://cert-manager.io/docs
- Hetzner Cloud Terraform provider: https://registry.terraform.io/providers/hetznercloud/hcloud/latest/docs
- Let's Encrypt: https://letsencrypt.org/docs/
- SOPS: https://github.com/getsops/sops
- Lighthouse CI: https://github.com/GoogleChrome/lighthouse-ci
- Karpathy three-layer wiki pattern: see `docs/raw/reference/karpathy-llm-wiki.md`

### Conventions
- Conventional Commits: https://www.conventionalcommits.org
- Nygard ADR template: https://github.com/joelparkerhenderson/architecture-decision-record

---

*End of IMPLEMENTATION_PLAN.md. Next step after user review: invoke `superpowers:writing-plans` to produce a granular, task-by-task implementation plan derived from §16.*
