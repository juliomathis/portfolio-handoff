<!-- Context: project-intelligence/business | Priority: high | Version: 2.7 | Updated: 2026-05-06 -->

# Business Domain

> **Source of truth:** `.opencode/context/project-wiki/index.md`. This file summarizes for agents; the wiki is canonical.

> **Canonical source:** \.opencode/context/project-wiki/ (use specific pages there for authoritative detail).

## Quick Reference

- **Purpose**: Understand why this project exists and who it serves
- **Audience**: Any agent working on content, copy, or strategic decisions
- **Update when**: Scope shifts, new audience identified, or phase status/goals change

## Project Identity

```
Project Name:    Portfolio Handoff
Tagline:         Production-grade personal portfolio as a portfolio artifact
Owner:           Julio Mathis (jumathis@proton.me)
Repo:            portfolio-handoff (GitHub)
Current status:  Phase 9 active; Phase 8 canonical documentation hardening completed on main (2026-05-06)
```

## Problem Statement

A working portfolio site is table stakes for DevOps/SRE/full-stack roles. But a *static site on Vercel* tells a reviewer nothing about infrastructure judgment. The reviewer wants to see how the candidate thinks about cluster ops, GitOps, secret management, and the trade-offs that come with them.

## Solution

Ship a single-page editorial portfolio that serves **two audiences simultaneously**:

1. **Visitors** (recruiters, collaborators, peers): see the portfolio content — a hand-crafted triptych page with project filter.
2. **Technical reviewers**: read the repository to assess DevOps/SRE/full-stack judgment.

The second audience is load-bearing. **Every infrastructure choice is made knowing the repo itself is a portfolio artifact.** The running site proves the code works; the code proves the author can build the running site.

## Success criteria (from `../project-wiki/index.md`)

The project is done when all ten hold:

| # | Criterion |
|---|---|
| 1 | `https://portfolio.<ip-with-dashes>.nip.io` serves the triptych page with valid Let's Encrypt cert |
| 2 | Served page visually matches prototype at 1280px |
| 3 | Usable at 375px / 768px / 1280px |
| 4 | Lighthouse: perf ≥90, a11y ≥95, best-practices ≥95, SEO ≥95 |
| 5 | All content editable via `app/src/content/*.ts` without touching components |
| 6 | `terraform apply` provisions cluster end-to-end in ≤15 min from zero |
| 7 | Image tag bump triggers ArgoCD rollout in ≤3 min |
| 8 | Phase 2 domain-swap content PR fits in ≤5 file changes |
| 9 | `.opencode/context/project-wiki/` is query-able via `qmd` |
| 10 | A new Claude Design handoff can be ingested following a documented workflow |

## Scope

**In scope:** Single triptych page from `Portfolio Triptych.html` + all its sections (Nav, Hero, MorphBar, BodySection, BrainSection, RoomsSection, AllProjects with filter, Contact, Footer), responsive across mobile/tablet/desktop, full infra stack (Terraform → Hetzner VPS → k3s → ArgoCD → ingress-nginx → cert-manager), CI/CD via GitHub Actions, Karpathy three-layer docs.

**Out of scope (Phase 1):** Other handoff pages (Case Study, Portfolio, Wireframes, Headlines) — preserved in `docs/raw/` only. CMS, i18n, analytics, contact form backend, custom domain, multi-node cluster, full observability stack.

**Non-goals:** Pixel-perfection on every viewport. SPA-grade interactivity. Backward compat with prototype's `__activate_edit_mode` hook.

## Audience-driven constraints

- **For recruiters**: the site must load fast and look professional — hence Lighthouse thresholds and mobile responsiveness.
- **For technical reviewers**: the repo must demonstrate competence — hence the "infra is portfolio" framing, explicit ADRs, scoped `AppProject`, KSOPS over ad-hoc secrets, etc.
- **For the author**: the site must be maintainable — hence the hard content/presentation boundary and island-per-page discipline.

## Phase roadmap (from `../project-wiki/index.md`)

| Phase | Scope | Status |
|-------|-------|--------|
| **Phase 0** | Repo init, root files, docs/raw/ import, branch protection | ✅ Done |
| **Phase 1** | Astro scaffold, content layer, styles, Base layout, shell index.astro | ✅ Done |
| **Phase 2** | Port all components + React island (ProjectFilter) | ✅ Implemented |
| **Phase 3** | Tests (Vitest + Playwright + Lighthouse CI) | ✅ Implemented |
| Phase 4 | Containerize (nginx:alpine) | ✅ Implemented (merged) |
| Phase 5 | Terraform infra provisioning | ✅ Implemented (on-demand apply/destroy workflow) |
| Phase 6 | k8s manifests + ArgoCD bootstrap | ✅ Implemented (merged) |
| Phase 7 | CI/CD wiring (GitHub Actions + GitHub App bot) | ✅ Completed |
| Phase 8 | Karpathy three-layer docs | ✅ Completed |
| Phase 9 | Verification + sign-off (v0.1.0 tag) | 🚧 Active |

Estimated total: 6–8 working days end-to-end.

## Open business decisions (deferred, from `../project-wiki/index.md`)

1. **Hetzner region** — `nbg1` default; pick before `terraform apply` based on latency needs.
2. **Analytics** — Plausible / GoatCounter / Umami / none. Defer to post-ship.
3. **Case Study page** — revisit as Phase 2.5 after domain swap.
4. **Self-host fonts** — Google Fonts now; self-host if Lighthouse perf drops.
5. **Repo visibility** — public recommended (free GHCR, visible portfolio artifact).

## Related Files

- [technical-domain.md](technical-domain.md) — stack and architecture
- [decisions-log.md](decisions-log.md) — 18 decisions with rationale
- [business-tech-bridge.md](business-tech-bridge.md) — how infra choices serve portfolio goals
- [living-notes.md](living-notes.md) — current state, open items
- `../project-wiki/index.md` — the canonical wiki index
