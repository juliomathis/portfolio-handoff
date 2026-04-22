---
name: QMD Search Playbook
description: Token-efficient QMD retrieval strategy for this repository.
type: project
---

# QMD Search Playbook

Use this playbook to minimize token usage while keeping retrieval quality high.

## Mandatory First Step

Run this before broad reads/grep:

```bash
qmd query "<topic>" -c portfolio-core-wiki -c portfolio-core-reference --no-rerank -C 20 -n 5
```

If needed, second pass:

```bash
qmd query "<topic>" -c portfolio-core-wiki -c portfolio-core-reference -c portfolio-core-intel --no-rerank -C 20 -n 5
```

## Collections

Use these collection names:

- `portfolio-core-wiki`
- `portfolio-core-intel`
- `portfolio-core-reference`
- `portfolio-opencode` (full corpus, fallback only)

## Default Query Strategy (Cheapest First)

1. Query only core collections.
2. Start with wiki + reference collections only.
3. Disable rerank for first pass.
4. Keep result count small.
5. Open only 1-2 files with `qmd get`.

Example:

```bash
qmd query "rollback runbook" -c portfolio-core-wiki -c portfolio-core-reference --no-rerank -C 20 -n 5
```

## Typed Query For Better Precision

Use typed query docs when simple query is noisy.

```bash
qmd query $'lex: "Rollback Runbook"\nvec: how to roll back deployment safely' -c portfolio-core-wiki --no-rerank -C 25 -n 5
```

If you need high-level project summaries (scope/decisions), add `portfolio-core-intel` as a second-pass collection.

## Read Narrow, Not Wide

After search, read only the target file section:

```bash
qmd get context/project-wiki/operations.md:1 -l 140
```

For multiple known files:

```bash
qmd multi-get "context/project-wiki/{operations,testing}.md" -l 120
```

## Escalation Rule

Escalate to full corpus only if core search misses:

```bash
qmd query "<topic>" -c portfolio-opencode --no-rerank -C 20 -n 5
```

Only enable reranking when precision is still poor:

```bash
qmd query "<topic>" -c portfolio-opencode -C 40 -n 5
```

## Token-Cost Guardrails

1. Start with `--no-rerank`.
2. Keep `-n` between 3 and 5.
3. Keep `-C` between 20 and 30 unless needed.
4. Use `qmd get` with line limits instead of loading full docs.
5. Stay in core collections by default.

## Quick Recipes

Canonical policy lookup:

```bash
qmd query "canonical docs legacy backup" -c portfolio-core-wiki -c portfolio-core-intel --no-rerank -C 20 -n 5
```

Migration status lookup:

```bash
qmd query "migration report verification summary" -c portfolio-core-wiki --no-rerank -C 20 -n 5
```

Command validation lookup:

```bash
qmd query "validate repo command" -c portfolio-opencode --no-rerank -C 20 -n 5
```
