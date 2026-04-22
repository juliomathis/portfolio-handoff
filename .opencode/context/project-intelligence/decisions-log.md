<!-- Context: project-intelligence/decisions | Priority: high | Version: 2.1 | Updated: 2026-04-22 -->

# Decisions Log

> **Source of truth:** `../project-wiki/adr/` and `../project-wiki/operations.md`. This file summarizes the 18 decisions for agents.

> **Canonical source:** \.opencode/context/project-wiki/ (use specific pages there for authoritative detail).

## Quick Reference

- **Purpose**: Record why each architectural choice was made
- **18 decisions total** — 6 have dedicated ADRs (001–006); the rest are "standard by consensus"
- **Status of all below:** Decided (2026-04-19), still in force as of 2026-04-22

## The six ADR-tracked decisions

### Decision 1 — Deployment target: Kubernetes (k3s)
**ADR:** 003 | **Status:** Decided | **Date:** 2026-04-19

**Context:** Where to host the portfolio site.
**Decision:** Self-managed k3s on single-node Hetzner CX11.
**Alternatives:** Vercel, GitHub Pages, plain VPS, managed k8s.
**Rationale:** Infrastructure is part of the portfolio artifact. Demonstrating k8s competence is a feature, not overhead. Cheapest real cluster ($4/mo).
**Impact (+):** Full control, full stack demo-able.
**Impact (−):** Single point of failure (accepted trade-off; see `../project-wiki/operations.md`); OOM risk on 2GB RAM (mitigation: resource limits + top monitoring).

### Decision 2 — Framework: Astro + React islands
**ADR:** 001 | **Status:** Decided

**Alternatives:** Next.js, Vite+React, vanilla HTML/JS.
**Rationale:** 95% of page is static. Keep JS scoped to one island (filter) instead of SPA-wide hydration. Best fit for "web standards" + k8s-friendly + portfolio perf.
**Impact:** One and only one React island allowed (`ProjectFilter.tsx`). Mobile nav uses `<details>`, not JS. Adding a second island requires an ADR.

### Decision 3 — Deployment workflow: GitOps with ArgoCD
**ADR:** 002 | **Status:** Decided

**Alternatives:** Push-deploy (CI does `kubectl apply`), Flux.
**Rationale:** Declarative, k8s-native, matches real-world SRE practice, highest resume signal.
**Impact:** Every cluster change goes through git. `kubectl apply` outside ArgoCD is drift that `selfHeal: true` will revert.

### Decision 4 — Secrets: SOPS + age (KSOPS runtime)
**ADR:** 004 | **Status:** Decided

**Alternatives:** Sealed-secrets, External Secrets Operator, argocd-vault-plugin.
**Rationale:** GitOps-compatible, no in-cluster operator required.
**Phase 1:** No secrets in cluster. **Phase 2:** Cloudflare token as encrypted Secret, decrypted at manifest-gen time by KSOPS on custom `argocd-repo-server` image.
**Trade-off:** `--enable-alpha-plugins --enable-exec` + mounted age key = wider blast radius. Mitigations in `../project-wiki/operations.md` (branch protection, CODEOWNERS, scoped GitHub App, in-cluster-only key, pod egress limits).

### Decision 5 — Domain/DNS: two-phase nip.io → Cloudflare
**ADR:** 005 | **Status:** Decided

**Rationale:** Full pipeline testable before spending money. Trivial swap when ready.
**Phase 1:** `portfolio.<ip-with-dashes>.nip.io`, HTTP-01 challenge.
**Phase 2:** custom domain via Cloudflare + DNS-01.

### Decision 6 — Runtime server: nginx:alpine
**ADR:** 006 | **Status:** Decided

**Alternatives:** Caddy, a Go static server, just nginx (non-alpine).
**Rationale:** Industry-standard, tiny image, mature, trivial config.
**Impact:** Custom `nginx.conf` needed for gzip/brotli/cache/`/healthz`/a11y headers.

---

## Decisions without separate ADRs (standard by consensus)

These were user-approved during brainstorming; no separate ADR because they're industry default at the chosen scale.

| # | Decision | Chosen | Why |
|---|---|---|---|
| 7 | Language | TypeScript strict | Catches content↔component wiring bugs |
| 8 | Styling | Vanilla CSS + PostCSS (autoprefixer, nesting, custom-media) | Matches prototype, no lock-in, smallest output |
| 9 | Registry | GHCR | GitHub-native, free for public repos |
| 10 | CI provider | GitHub Actions | Native integration |
| 11 | ADR format | Frontmatter (`type: project`) + Nygard body | qmd-queryable + recruiter-familiar |
| 12 | Polish level | "Mid" (unit + E2E + Lighthouse CI + probes + Prom annotations) | Disciplined without bloat |
| 13 | Cluster type | Self-managed k3s single-node | Cheapest real cluster |
| 14 | ArgoCD project | Scoped `AppProject` named `portfolio`, not `default` | `default` permits any source/destination — standing red flag |
| 15 | CI → main mechanism | GitHub App with bypass permission | Deploy keys and `GITHUB_TOKEN` can't bypass branch protection |
| 16 | Mobile nav | Native `<details>`/`<summary>` (no JS) | Keeps interactivity to one island; no focus trap/scroll-lock documented as deliberate P1 constraint |
| 17 | Image pull policy | `Always` + immutable SHAs | Cheap hardening against tag-reuse edge cases |
| 18 | Kubeconfig mode | `0600` root-only | Default `0644` leaks cluster-admin to any non-root process |

---

## Accepted trade-offs (from `../project-wiki/operations.md`)

These are known compromises that were explicitly reviewed and kept:

| Trade-off | Why accepted | Mitigation |
|---|---|---|
| Single-node cluster = SPOF | Portfolio, not revenue service | Vercel fallback documented |
| Bootstrap not fully git-only once Phase 2 secrets exist (age key must be restored before decryption) | DR at this scale acceptable | Runbook step: restore `argocd-sops-age` before sync |
| Custom `argocd-repo-server-ksops` image needs maintenance on upgrades | Pinned, yearly-ish rebuild | Process documented in operations.md |
| Cloudflare token split across Terraform + SOPS in Phase 2 | Split responsibilities (DNS vs. ACME DNS-01) | One cutover checklist validates both |
| KSOPS blast radius (`--enable-alpha-plugins --enable-exec` + mounted age key) | Phase 2 convenience | Branch protection, CODEOWNERS, scoped GitHub App write path, pod egress limits, Phase 3 narrowing path |

---

## Revision history

| v | Date | Change |
|---|------|--------|
| 1 | 2026-04-19 | Initial 18 decisions recorded during brainstorming |
| 1.1–1.11 | 2026-04-19 | Eleven review passes on `.opencode/context/project-wiki/index.md` (see its revision table) |
| 2.0 | 2026-04-22 | Summarized here after Phase 0 + Phase 1 completion |
| 2.1 | 2026-04-22 | Status metadata refreshed after Phase 0-3 audit; decisions unchanged |

## Related Files

- [technical-domain.md](technical-domain.md) — what these decisions imply for the stack
- [business-tech-bridge.md](business-tech-bridge.md) — why each technical decision serves portfolio goals
- `../project-wiki/operations.md` and `../project-wiki/index.md` — canonical source
- `.opencode/context/project-wiki/adr/` — dedicated ADRs
