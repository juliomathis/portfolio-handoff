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

- `app/` — Astro + React-islands application (Phases 0–3 implemented)
- `.opencode/context/` — canonical project intelligence + wiki
- `.opencode/reference/` — immutable handoff/reference artifacts
- `infra/`, `k8s/`, `.github/workflows/` — expected in later phases (not yet present)

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
