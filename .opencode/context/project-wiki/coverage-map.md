---
name: Coverage Map
description: Mapping from legacy docs and implementation plan into canonical .opencode locations.
type: project
---

# Coverage Map

## Mapping

1. `IMPLEMENTATION_PLAN.md` -> `.opencode/context/project-wiki/*.md` and `.opencode/context/project-intelligence/*.md`
2. `docs/wiki/*` -> `.opencode/context/project-wiki/*`
3. `docs/raw/handoff-2026-04-19/*` -> `.opencode/reference/raw-handoff/2026-04-19/*`
4. `docs/raw/reference/karpathy-llm-wiki.md` -> `.opencode/reference/reference/karpathy-llm-wiki.md`

## Canonical Rule

During migration transition, `.opencode/` is canonical and legacy docs are backup only.
