---
name: Testing
description: Testing strategy and validation requirements for portfolio-handoff.
type: project
---

# Testing

## Goals and Quality Gates

Validation enforces the Phase 1 quality bar:

1. Lighthouse performance >= 0.90 (median), accessibility >= 0.95, best-practices >= 0.95, SEO >= 0.95.
2. Type/content contract integrity remains intact.
3. Key UX flows (render, filter behavior, accessibility baseline) remain stable.

## Canonical Validation Commands

Run from repo root:

1. `pnpm --dir app check`
2. `pnpm --dir app test`
3. `pnpm --dir app build`
4. `pnpm --dir app test:e2e`
5. `pnpm --dir app lhci`

CI runs the same command family via `.github/workflows/ci.yml`.

## Test Layers

### 1) Unit Tests (Vitest)

- Config: `app/vitest.config.ts`
- Scope: `app/tests/unit/**/*.test.ts`
- Focus:
  - content contracts and export shape
  - app shell/component invariants (including single-island rule)
  - pure logic (`filter-projects`)

### 2) End-to-End Tests (Playwright)

- Config: `app/playwright.config.ts`
- Scope: `app/tests/e2e/*.spec.ts`
- Current browser target: Chromium
- Focus:
  - smoke render stability
  - responsive visual baselines at 375/768/1280
  - keyboard and filter interaction behavior
  - serious/critical accessibility violation gate (`@axe-core/playwright`)

### 3) Lighthouse CI

- Config: `app/lighthouserc.json`
- Collect mode: static `dist/` output, `numberOfRuns: 5`, median aggregation for performance gate
- Recommended deterministic local invocation:
  - `PUBLIC_FONT_DISPLAY=optional pnpm --dir app build`
  - `pnpm --dir app lhci`

## Local Validation Workflow

1. Install deps once: `pnpm --dir app install --frozen-lockfile`.
2. Run `check`, `test`, and `build` before opening PR updates.
3. Run `test:e2e` for UI-impacting changes.
4. Run `lhci` for performance-sensitive or release-gate changes.

## Generated Artifact Policy

Do not commit local validation artifacts:

- `app/.lighthouseci/`
- `app/lighthouse-reports/`
- `app/test-results/`
- `app/playwright-report/`

Committed snapshots under `app/tests/e2e/*-snapshots/` are intentional baselines.

## Failure Triage Cheatsheet

1. **`check` failure:** usually type/content contract drift; verify `app/src/lib/types.ts` and `app/src/content/*.ts` alignment.
2. **Unit failure:** isolate with `pnpm --dir app test -- --reporter=verbose`.
3. **E2E visual diff:** inspect screenshot diffs and confirm intended responsive changes before updating baselines.
4. **LHCI miss:** rerun with `PUBLIC_FONT_DISPLAY=optional`; if still failing, investigate regressions before lowering thresholds.

## PR-Ready Checklist

1. All five canonical validation commands pass locally or in CI.
2. No transient artifacts are staged.
3. If snapshots changed, PR description explains why baseline updates are expected.
