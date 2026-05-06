<!-- Context: project-intelligence/nav | Priority: high | Version: 2.5 | Updated: 2026-05-06 -->

# Project Intelligence — portfolio-handoff

> Entry point for agent discovery. This wiki summarizes `.opencode/context/project-wiki/index.md` for context loading. The wiki is the source of truth.

> **Canonical source:** \.opencode/context/project-wiki/ (use specific pages there for authoritative detail).

## What this project is (one-liner)

A production-grade personal portfolio site for Julio Mathis, shipped as an Astro + React-islands single-page app on a self-managed k3s cluster — built so the **repository itself is a portfolio artifact** for DevOps/SRE/full-stack reviewers.

**Current phase:** Phase 7 active (CI/CD wiring), with protected-main `Image` workflow fallback validated on `main`.

## Structure

```
.opencode/context/project-intelligence/
├── navigation.md              # This file — entry point
├── business-domain.md         # What the project is, who it serves, scope, success criteria
├── technical-domain.md        # Stack, architecture, contracts, current state
├── decisions-log.md           # 18 decisions + accepted trade-offs (see ../project-wiki/adr/ and ../project-wiki/operations.md)
├── business-tech-bridge.md    # How infra choices serve portfolio goals
└── living-notes.md            # Current state, open items, phase progress
```

## Quick Routes

| What you need | File | When to read it |
|---------------|------|-----------------|
| Why this project exists, scope | `business-domain.md` | Content/copy work, strategic questions |
| Stack, architecture, file layout | `technical-domain.md` | Any code/infra implementation |
| Why a decision was made | `decisions-log.md` | Before overriding or questioning a choice |
| How infra serves the portfolio goal | `business-tech-bridge.md` | Reviewer-facing documentation work |
| What's done, what's open | `living-notes.md` | Starting a new task |
| Full canonical detail | `../project-wiki/index.md` | When summaries aren't enough |

## Load order for full context

1. `navigation.md` (this file)
2. `business-domain.md` — establishes scope
3. `technical-domain.md` — establishes stack
4. `decisions-log.md` — establishes constraints
5. `living-notes.md` — establishes current state
6. `business-tech-bridge.md` — only if explaining to reviewers
7. `../project-wiki/index.md` + topic pages (`architecture.md`, `deployment.md`, `infrastructure.md`, `operations.md`, `testing.md`) — as needed for deep detail

## Usage notes

- **Files are summaries, not canonical.** If a summary contradicts `../project-wiki/index.md`, the wiki wins. Open an update task.
- **MVI rule:** each file < 200 lines. If growing past that, split or push detail into `../project-wiki/` pages.
- **Updated 2026-05-06** to reflect Phase 7 post-merge CI/CD validation and deploy-bump fallback behavior.

## Maintenance

- Update after each phase completes (see `../project-wiki/index.md`)
- Update when a decision changes or a new ADR lands
- Keep `living-notes.md` current with open questions

## Related

- [`../project-wiki/index.md`](../project-wiki/index.md) — canonical implementation wiki index
- [`../../reference/raw-handoff/2026-04-19/`](../../reference/raw-handoff/2026-04-19/) — original Claude Design handoff (immutable)
- [`../importance-profile.md`](../importance-profile.md) — core/optional/archive loading policy
- `.opencode/context/project-wiki/` — canonical project wiki
- `.opencode/context/core/` — framework-level standards (code, tests, docs, security)
