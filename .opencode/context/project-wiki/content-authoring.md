---
name: Content Authoring
description: Edit portfolio content without touching presentation components.
type: project
---

# Content Authoring

## Authoring Contract

1. Edit only `app/src/content/*.ts` for content changes.
2. Keep `app/src/lib/types.ts` as source of truth for content contracts.
3. Do not embed content text directly into component files.

## Content File Map

| File | Purpose |
|---|---|
| `app/src/content/site.ts` | site metadata, nav labels, brand markers |
| `app/src/content/hero.ts` | hero heading and triptych columns |
| `app/src/content/body-section.ts` | body cards and section header |
| `app/src/content/brain-section.ts` | brain node cards and section header |
| `app/src/content/rooms-section.ts` | rooms posters, summary panel, section header |
| `app/src/content/projects.ts` | all project entries + legend/intro copy |
| `app/src/content/contact.ts` | contact heading and outbound links |
| `app/src/content/index.ts` | barrel exports consumed by page/components |

## Common Authoring Tasks

1. **Change copy only:** edit the relevant `app/src/content/*.ts` file and keep field keys unchanged.
2. **Add a project:** append one record in `app/src/content/projects.ts` using existing boolean tag schema (`hw`, `sw`, `eco`).
3. **Update nav labels/anchors:** edit `app/src/content/site.ts`; keep href format as in-page hash links.
4. **Change contact links:** edit `app/src/content/contact.ts`; keep `mailto:` or valid URL form.

## Standard Workflow

1. Edit content file.
2. Run from repo root:
   - `pnpm --dir app check`
   - `pnpm --dir app test`
   - `pnpm --dir app build`
3. Open PR with content-only scope when possible.

## When Types Must Change

Only change `app/src/lib/types.ts` when a real content model change is required.

If types change:

1. Update affected content files to satisfy the new type contract.
2. Update any component/island props consuming that contract.
3. Re-run `check`, `test`, `build`, and `test:e2e` before opening PR.

## Content PR Checklist

1. Diff stays in `app/src/content/**` unless type/prop wiring requires broader edits.
2. No component receives hard-coded editorial copy.
3. All references remain semantically correct (anchors, years, links, tag booleans).
4. Validation commands pass.

## New Handoff Ingestion Workflow

Use this when a new Claude Design handoff replaces or extends triptych content.

1. Copy source artifacts into `.opencode/reference/raw-handoff/<date>/` unchanged.
2. Diff the new source content against current `app/src/content/*.ts` outputs.
3. Port only required content/model changes into typed content files.
4. If data shape changed, update `app/src/lib/types.ts` and dependent components/islands.
5. Run validation (`check`, `test`, `build`, and E2E when layout/content semantics changed).
6. Append an ingest/change summary entry to `.opencode/context/project-wiki/log.md`.

## Guardrails

1. Do not move canonical docs into `docs/`; keep `.opencode/` as source of truth.
2. Do not alter the single-island rule during content edits.
3. Do not commit transient local test/lighthouse artifacts.
