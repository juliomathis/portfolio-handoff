# Context Importance Profile

This file defines token-efficient context loading tiers for this repository.

## Tier Policy

1. `core`: always eligible, load by default.
2. `optional`: load only when explicit triggers/complexity thresholds are met.
3. `archive`: do not load.

## Mandatory QMD-First Rule

1. MUST run QMD retrieval before broad context reads.
2. First pass collections: `portfolio-core-wiki` + `portfolio-core-reference`.
3. Second pass (if needed): add `portfolio-core-intel`.
4. Escalation only on miss: `portfolio-opencode`.
5. Do not load `archive` tier docs.

## Core Tier (Default)

Load these first for nearly all tasks:

- `.opencode/context/navigation.md`
- `.opencode/context/project-intelligence/navigation.md`
- `.opencode/context/project-intelligence/business-domain.md`
- `.opencode/context/project-intelligence/technical-domain.md`
- `.opencode/context/project-intelligence/decisions-log.md`
- `.opencode/context/project-intelligence/business-tech-bridge.md`
- `.opencode/context/project-intelligence/living-notes.md`
- `.opencode/context/project-wiki/index.md`
- `.opencode/context/project-wiki/architecture.md`
- `.opencode/context/project-wiki/deployment.md`
- `.opencode/context/project-wiki/infrastructure.md`
- `.opencode/context/project-wiki/operations.md`
- `.opencode/context/project-wiki/content-authoring.md`
- `.opencode/context/project-wiki/testing.md`
- `.opencode/context/project-wiki/design-system.md`
- `.opencode/context/project-wiki/coverage-map.md`
- `.opencode/context/project-wiki/legacy-backup-status.md`
- `.opencode/context/project-wiki/migration-report-2026-04-22.md`
- `.opencode/context/project-wiki/log.md`
- `.opencode/context/project-wiki/adr/*.md`
- `.opencode/context/project-wiki/qmd-search-playbook.md`
- `.opencode/reference/navigation.md`
- `.opencode/reference/reference/karpathy-llm-wiki.md`
- `.opencode/reference/raw-handoff/2026-04-19/MANIFEST.md`

## Optional Tier (Trigger-Based)

Only load these when triggers apply.

### Optional Group A: Engineering Standards and Workflows
- Paths: `.opencode/context/core/**`
- Trigger when:
  - task mentions security, code review, testing standards, delegation, or context-system mechanics
  - task complexity is high (4+ files, cross-cutting changes, or multi-agent orchestration)

### Optional Group B: Command Docs
- Paths:
  - `.opencode/command/context.md`
  - `.opencode/command/test.md`
  - `.opencode/command/validate-repo.md`
- Trigger when:
  - user asks to run/validate command behavior
  - task is specifically about operational command docs

### Optional Group C: Skills
- Paths:
  - `.opencode/skill/task-management/**`
  - `.opencode/skill/context7/**`
- Trigger when:
  - task-management CLI is used
  - external library/API documentation is needed

### Optional Group D: Full Raw Handoff Artifacts
- Path: `.opencode/reference/raw-handoff/2026-04-19/*`
- Trigger when:
  - visual parity checks are requested
  - source-provenance diffing is requested

## Archive Tier (Do Not Load)

These are retained for history/tooling compatibility but are not part of default runtime context.

- `.opencode/agent/**`
- `.opencode/command/analyze-patterns.md`
- `.opencode/command/clean.md`
- `.opencode/command/optimize.md`
- `.opencode/command/commit.md`
- `.opencode/plans/*.md`
- `.opencode/context/project-intelligence/2026-04-22-opencode-only-agentic-docs-design.md`

## Complexity Gate

Promote from `core` to `optional` loading only if one or more are true:

1. change scope > 3 files
2. cross-domain work (docs + commands + workflows)
3. explicit external-library docs needed
4. security/test/review policy decision needed

Otherwise remain `core`-only.

## QMD Collections For Token Efficiency

- `portfolio-core-wiki` (core runbooks/ADRs)
- `portfolio-core-reference` (core reference docs)
- `portfolio-core-intel` (core project summaries, load second-pass when needed)
- `portfolio-opencode` (full corpus, optional escalation only)

Default query should target `portfolio-core-wiki` + `portfolio-core-reference` first.
Add `portfolio-core-intel` only when strategic summaries are needed.
Use `portfolio-opencode` only if core collections do not answer the question.
