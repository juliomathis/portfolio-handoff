# Phase 0 Governance Audit Notes (2026-04-22)

## Scope

- Branch-protection evidence for `main`
- Initial-commit checklist deviation vs implementation plan text

## Branch-protection evidence

**Status:** Verified via GitHub API (`gh`) on 2026-04-22.

Repository-local docs can assert intent, but GitHub branch-protection policy is configured in repository settings and must be verified via API/UI evidence.

Suggested verification command:

```bash
gh api repos/<owner>/<repo>/branches/main/protection
```

Executed command:

```bash
gh api repos/juliomathis/portfolio-handoff/branches/main/protection
```

Evidence artifact:

- `.opencode/reference/reference/branch-protection-main-2026-04-22.json`

Evidence checklist:

- [x] Capture branch-protection JSON/API output
- [x] Capture settings screenshot or policy export (optional but useful) — optional item satisfied by API JSON evidence for this audit pass
- [x] Link evidence from `.opencode/context/project-wiki/log.md`

## Accepted historical deviation

- `IMPLEMENTATION_PLAN.md` Phase 0 checklist expects first commit text:
  - `chore: initial scaffold with Karpathy three-layer docs`
- Reflog shows initial commit message:
  - `chore: inital scaffold`

**Decision:** Accepted historical deviation. No history rewrite.

## Follow-up trigger

Complete branch-protection evidence capture before either:

1. Phase 7 CI/CD completion, or
2. Release tag `v0.1.0`
