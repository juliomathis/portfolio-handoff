---
name: OpenCode Docs Consolidation Design
description: Design for migrating all agentic documentation into .opencode while keeping legacy docs as temporary backup.
type: project
date: 2026-04-22
status: approved-design
---

# OpenCode Docs Consolidation Design

## Goal

Consolidate all agentic documentation into `.opencode/` so it becomes the single canonical location for project knowledge and operational guidance.

## User Constraints

1. Use approach 3 (hybrid canonicalization).
2. Keep `docs/` and `IMPLEMENTATION_PLAN.md` as temporary backup during migration.
3. End-state target: all agentic docs live in `.opencode/`.

## Non-Goals

1. No infrastructure/application feature implementation.
2. No content rewrite beyond consistency, link repair, and structural migration.
3. No immediate deletion of legacy docs during this migration pass.

## Canonical Information Architecture

### 1) Summary layer (fast agent load)

Keep and refine:

- `.opencode/context/project-intelligence/navigation.md`
- `.opencode/context/project-intelligence/business-domain.md`
- `.opencode/context/project-intelligence/technical-domain.md`
- `.opencode/context/project-intelligence/decisions-log.md`
- `.opencode/context/project-intelligence/business-tech-bridge.md`
- `.opencode/context/project-intelligence/living-notes.md`

Purpose: concise project orientation, current state, key constraints.

### 2) Detailed project wiki layer (operational truth)

Add:

- `.opencode/context/project-wiki/index.md`
- `.opencode/context/project-wiki/log.md`
- `.opencode/context/project-wiki/architecture.md`
- `.opencode/context/project-wiki/deployment.md`
- `.opencode/context/project-wiki/infrastructure.md`
- `.opencode/context/project-wiki/operations.md`
- `.opencode/context/project-wiki/content-authoring.md`
- `.opencode/context/project-wiki/testing.md`
- `.opencode/context/project-wiki/design-system.md`
- `.opencode/context/project-wiki/adr/001-astro-react-islands.md`
- `.opencode/context/project-wiki/adr/002-gitops-argocd.md`
- `.opencode/context/project-wiki/adr/003-k3s-hetzner-single-node.md`
- `.opencode/context/project-wiki/adr/004-sops-age-secrets.md`
- `.opencode/context/project-wiki/adr/005-two-phase-domain-rollout.md`
- `.opencode/context/project-wiki/adr/006-nginx-over-caddy.md`

Purpose: detailed runbooks, architecture docs, and ADRs formerly distributed in `docs/wiki/` + `IMPLEMENTATION_PLAN.md`.

### 3) Immutable source/reference layer

Add:

- `.opencode/reference/raw-handoff/2026-04-19/*` (copy of current `docs/raw/handoff-2026-04-19/*`)
- `.opencode/reference/reference/karpathy-llm-wiki.md`

Purpose: preserve provenance and source artifacts for future handoff diff workflows.

## Migration Phases

### Phase A: Create canonical destinations

Create `project-wiki` and `reference` directories under `.opencode`.

### Phase B: Content migration with fidelity

1. Copy `docs/wiki/*` into `.opencode/context/project-wiki/*`.
2. Copy `docs/raw/handoff-2026-04-19/*` into `.opencode/reference/raw-handoff/2026-04-19/*`.
3. Copy `docs/raw/reference/karpathy-llm-wiki.md` into `.opencode/reference/reference/`.
4. Fill missing high-value detail from `IMPLEMENTATION_PLAN.md` into the new wiki pages where needed.

### Phase C: Normalization and deduplication

1. Keep project-intelligence files summary-focused.
2. Move procedural depth into project-wiki pages.
3. Ensure each topic has one canonical page.

### Phase D: Contradiction and link repair in `.opencode`

Repair known breakages:

1. Replace all legacy plan-typo references with canonical `.opencode` pages (and transitional pointers to `IMPLEMENTATION_PLAN.md` while backup exists).
2. Fix wrong file names/paths (e.g. legacy skill filename, legacy scout filename, `code.md`, `tests.md`, `openagents-repo` paths).
3. Align command docs with actual repo behavior and safe git policy.
4. Remove assumptions about missing components (missing registry file and missing subagents) or mark commands as not applicable.

### Phase E: Legacy freeze (temporary backup mode)

1. Leave `docs/` and `IMPLEMENTATION_PLAN.md` untouched.
2. Add explicit "legacy backup" note in canonical `.opencode` index pages.
3. Stop updating legacy docs after migration completion.

## Contradiction Resolution Rules

1. `.opencode` is canonical after migration.
2. Legacy docs are read-only backup.
3. Broken or stale references in `.opencode` are fixed immediately.
4. Summary files never carry full runbook detail.
5. Detailed docs must live in `project-wiki` only.

## Validation and Acceptance Criteria

Migration is complete when all are true:

1. No broken `.opencode` internal links/references.
2. No `.opencode` references to nonexistent files (legacy typo names, legacy skill filename, etc.).
3. Required wiki pages + ADR pages exist under `.opencode/context/project-wiki/`.
4. Raw handoff and Karpathy reference exist under `.opencode/reference/`.
5. Coverage mapping exists from source docs to new `.opencode` destinations.
6. Canonicality statement is explicit in `.opencode` navigation.
7. Legacy backup status is explicitly documented.

## Source-to-Destination Coverage Map

1. `IMPLEMENTATION_PLAN.md` -> `.opencode/context/project-wiki/*` + summary refresh in `project-intelligence/*`.
2. `docs/wiki/*` -> `.opencode/context/project-wiki/*`.
3. `docs/raw/handoff-2026-04-19/*` -> `.opencode/reference/raw-handoff/2026-04-19/*`.
4. `docs/raw/reference/karpathy-llm-wiki.md` -> `.opencode/reference/reference/karpathy-llm-wiki.md`.

## Risks and Mitigations

1. Risk: silent data loss during migration.
   - Mitigation: coverage map + gap scan before freeze.
2. Risk: path drift from old names to new structure.
   - Mitigation: repo-wide reference scan and targeted fixes.
3. Risk: accidental edits to backup docs causing divergence.
   - Mitigation: explicit legacy freeze notice and canonical pointer.

## Final Transition (Not in this pass)

After user review confirms migration quality, run a final deletion pass to remove `docs/` and `IMPLEMENTATION_PLAN.md`.
