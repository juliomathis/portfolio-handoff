# Portfolio Handoff Runtime Overrides

This file defines repository-specific runtime rules for `portfolio-handoff`.

Base global policy: `/home/jules/.config/opencode/AGENTS.md`.

Unless explicitly overridden below, global rules remain in force.

**Repo override:** task-level commits are the default in this repository and override the global "No auto-commits" rule for this repo only.

## Coding Norms

1. TDD is required for all feature and bugfix work:
   - write or update a failing test first
   - implement the minimal change to pass
   - rerun relevant tests to green
2. Keep changes scoped to the current task/phase in `IMPLEMENTATION_PLAN.md`; if no plan exists, scope strictly to the user's explicitly requested task.
3. Treat all files under `docs/raw/**` as immutable ingested source artifacts; never edit in place.
4. Prefer small, readable, task-focused diffs; avoid unrelated refactors unless explicitly requested.
5. Keep inline comments minimal; add comments only for non-obvious logic.

## Git/Commit Norms

1. Commit at task level by default: one meaningful task equals one commit.
2. Run task-relevant verification before each commit.
3. Use Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`), optional scope allowed.
4. Stage only task-related files.
5. Never commit secrets, credentials, or unrelated changes.
6. Destructive git commands remain prohibited (`reset --hard`, `push --force`, `checkout .`, `add -A`, `clean -f`).

## Permission Gates (Ask vs Proceed)

Ask before proceeding for high-risk actions:
- destructive or irreversible operations
- live infra state mutations (`terraform apply/destroy`, live `kubectl apply/delete`, DNS/domain mutations)
- security or billing posture changes
- actions requiring missing credentials/secrets
- ambiguous high-impact architecture decisions

Proceed without asking for routine low-risk actions:
- local edits and refactors already in scope
- lint/typecheck/test/build commands
- read-only investigation and diagnostics
- non-destructive verification commands

## Verification Before Completion

1. Use diff-based verification: run checks mapped to changed paths.
2. Include fresh evidence in updates: commands run and pass/fail result.
3. Minimum verification matrix:
   - `app/**`: targeted tests plus available lint/type/build checks
   - `infra/terraform/**`: `terraform fmt -check`, `terraform validate`, `terraform plan` (never apply without permission)
   - `k8s/**`: render/validate manifests (for example `kustomize build` on changed paths)
   - `.github/workflows/**`: workflow lint/validation when tooling exists
   - docs-only changes: run lightweight checks if configured, else state no automation exists
4. Never claim "done", "fixed", or "passing" without fresh verification output.
