# OpenCode-Only Agentic Docs Consolidation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate all agentic documentation into `.opencode/`, make `.opencode` the canonical documentation source, and keep `docs/` + `IMPLEMENTATION_PLAN.md` as temporary read-only backup.

**Architecture:** Use a three-zone docs architecture entirely under `.opencode`: (1) concise project summaries in `context/project-intelligence`, (2) detailed runbooks and ADRs in `context/project-wiki`, and (3) immutable source artifacts in `reference/`. Migrate content first, then repair internal references and command docs, then run validation scans and publish migration reports.

**Tech Stack:** Markdown, shell commands (`cp`, `mkdir`, `ls`), `rg`, Python 3 for validation scripts

---

## Global Execution Rules For This Plan

- Do not delete `docs/` or `IMPLEMENTATION_PLAN.md` in this pass.
- Do not commit unless the user explicitly requests commits.
- Prefer deterministic copy + verification over manual rewrites when possible.

---

### Task 1: Scaffold Canonical `.opencode` Documentation Structure

**Files:**
- Create: `.opencode/context/project-wiki/`
- Create: `.opencode/context/project-wiki/adr/`
- Create: `.opencode/reference/raw-handoff/2026-04-19/`
- Create: `.opencode/reference/reference/`
- Create: `.opencode/reference/navigation.md`
- Modify: `.opencode/context/navigation.md`
- Test: directory and file existence checks

- [ ] **Step 1: Verify missing target structure (expected to fail before creation)**

Run:

```bash
ls ".opencode/context/project-wiki" ".opencode/reference" ".opencode/reference/raw-handoff/2026-04-19"
```

Expected: at least one "No such file or directory" line.

- [ ] **Step 2: Create target directories**

Run:

```bash
mkdir -p ".opencode/context/project-wiki/adr" ".opencode/reference/raw-handoff/2026-04-19" ".opencode/reference/reference"
```

- [ ] **Step 3: Create reference navigation page**

Write `.opencode/reference/navigation.md`:

```markdown
# Reference Navigation

Canonical reference artifacts for this repository.

## Structure

- `raw-handoff/2026-04-19/` - immutable Claude Design export artifacts
- `reference/karpathy-llm-wiki.md` - external reference document used by this project

## Rules

1. Files under `raw-handoff/` are immutable.
2. Canonical operational docs live under `.opencode/context/project-wiki/`.
3. `docs/` and `IMPLEMENTATION_PLAN.md` are temporary legacy backup only.
```

- [ ] **Step 4: Update context root navigation to include project-wiki and reference layers**

Update `.opencode/context/navigation.md` to:

```markdown
# Context Navigation

Use this file as the entrypoint for context discovery.

## Domains
- `core/navigation.md` - shared engineering standards and workflows
- `project-intelligence/navigation.md` - project-specific summaries and decisions
- `project-wiki/index.md` - detailed runbooks, architecture docs, and ADRs

## References
- `.opencode/reference/navigation.md` - immutable handoff and source references
```

- [ ] **Step 5: Verify scaffold exists**

Run:

```bash
ls ".opencode/context/project-wiki" ".opencode/context/project-wiki/adr" ".opencode/reference" ".opencode/reference/raw-handoff/2026-04-19" ".opencode/reference/reference"
```

Expected: all paths list successfully.

---

### Task 2: Migrate Immutable Raw and Reference Artifacts Into `.opencode/reference`

**Files:**
- Create: `.opencode/reference/raw-handoff/2026-04-19/*` (copied)
- Create: `.opencode/reference/reference/karpathy-llm-wiki.md` (copied)
- Create: `.opencode/reference/raw-handoff/2026-04-19/MANIFEST.md`
- Test: source/destination filename parity checks

- [ ] **Step 1: Record source file lists**

Run:

```bash
python - <<'PY'
from pathlib import Path
src = Path('docs/raw/handoff-2026-04-19')
files = sorted([p.relative_to(src).as_posix() for p in src.rglob('*')])
for f in files:
    print(f)
PY
```

Expected: full list of handoff files/directories printed.

- [ ] **Step 2: Copy handoff directory and karpathy reference**

Run:

```bash
cp -a "docs/raw/handoff-2026-04-19/." ".opencode/reference/raw-handoff/2026-04-19/" && cp "docs/raw/reference/karpathy-llm-wiki.md" ".opencode/reference/reference/karpathy-llm-wiki.md"
```

- [ ] **Step 3: Create immutable manifest**

Write `.opencode/reference/raw-handoff/2026-04-19/MANIFEST.md`:

```markdown
# Raw Handoff Manifest - 2026-04-19

This directory is a verbatim backup of the original Claude Design handoff artifacts.

## Immutability Policy

1. Do not edit files in this directory.
2. If a new handoff arrives, create a new timestamped sibling directory.
3. Canonical implementation docs live in `.opencode/context/project-wiki/`.

## Source

- Original location: `docs/raw/handoff-2026-04-19/`
- Migrated on: 2026-04-22
```

- [ ] **Step 4: Verify source and destination file parity**

Run:

```bash
python - <<'PY'
from pathlib import Path
src = Path('docs/raw/handoff-2026-04-19')
dst = Path('.opencode/reference/raw-handoff/2026-04-19')
src_set = {p.relative_to(src).as_posix() for p in src.rglob('*')}
dst_set = {p.relative_to(dst).as_posix() for p in dst.rglob('*')}
missing = sorted(src_set - dst_set)
extra = sorted(dst_set - src_set - {'MANIFEST.md'})
print('missing:', len(missing))
print('extra:', len(extra))
if missing:
    print('\n'.join(missing))
if extra:
    print('\n'.join(extra))
PY
```

Expected: `missing: 0` and `extra: 0`.

---

### Task 3: Build Canonical Project Wiki Skeleton Under `.opencode/context/project-wiki`

**Files:**
- Create: `.opencode/context/project-wiki/index.md`
- Create: `.opencode/context/project-wiki/log.md`
- Create: `.opencode/context/project-wiki/architecture.md`
- Create: `.opencode/context/project-wiki/deployment.md`
- Test: required wiki files existence check

- [ ] **Step 1: Create canonical project wiki index**

Write `.opencode/context/project-wiki/index.md`:

```markdown
---
name: Project Wiki Index
description: Canonical index for detailed portfolio-handoff runbooks and architecture docs.
type: project
---

# Project Wiki Index

This is the canonical detailed documentation index for this repository.

## Canonicality

- Canonical detailed docs: `.opencode/context/project-wiki/`
- Canonical summaries: `.opencode/context/project-intelligence/`
- Legacy backup (temporary): `docs/` and `IMPLEMENTATION_PLAN.md`

## Pages

- [architecture.md](architecture.md)
- [deployment.md](deployment.md)
- [infrastructure.md](infrastructure.md)
- [operations.md](operations.md)
- [content-authoring.md](content-authoring.md)
- [testing.md](testing.md)
- [design-system.md](design-system.md)
- [log.md](log.md)
- [coverage-map.md](coverage-map.md)
- [legacy-backup-status.md](legacy-backup-status.md)
- [migration-report-2026-04-22.md](migration-report-2026-04-22.md)

## ADRs

- [001-astro-react-islands.md](adr/001-astro-react-islands.md)
- [002-gitops-argocd.md](adr/002-gitops-argocd.md)
- [003-k3s-hetzner-single-node.md](adr/003-k3s-hetzner-single-node.md)
- [004-sops-age-secrets.md](adr/004-sops-age-secrets.md)
- [005-two-phase-domain-rollout.md](adr/005-two-phase-domain-rollout.md)
- [006-nginx-over-caddy.md](adr/006-nginx-over-caddy.md)
```

- [ ] **Step 2: Create operations log page**

Write `.opencode/context/project-wiki/log.md`:

```markdown
---
name: Operations Log
description: Append-only operational log for documentation and migration events.
type: project
---

# Operations Log

## [2026-04-22] migrate | .opencode canonicalization started

- Approved migration design in `.opencode/context/project-intelligence/2026-04-22-opencode-only-agentic-docs-design.md`
- Started migration of raw docs and operational wiki into `.opencode/`
- Set legacy mode: keep `docs/` and `IMPLEMENTATION_PLAN.md` as temporary backup
```

- [ ] **Step 3: Create architecture page**

Write `.opencode/context/project-wiki/architecture.md`:

```markdown
---
name: Architecture
description: System architecture and boundaries for the portfolio-handoff project.
type: project
---

# Architecture

## System Summary

Portfolio-handoff is a production-grade single-page Astro site with a single React island, deployed to k3s via ArgoCD GitOps.

## Core Boundaries

1. Content: `app/src/content/*.ts`
2. Presentation: `app/src/{pages,layouts,components,styles}`
3. Infrastructure: `infra/`, `k8s/`, `.github/workflows/`

## Deployment Topology

1. Hetzner VPS -> k3s single node
2. ingress-nginx + cert-manager + ArgoCD
3. Portfolio deployment served by nginx container
```

- [ ] **Step 4: Create deployment page**

Write `.opencode/context/project-wiki/deployment.md`:

```markdown
---
name: Deployment
description: CI and GitOps deployment flow for portfolio-handoff.
type: project
---

# Deployment

## CI Flow

1. PR validation runs checks and tests.
2. Merge to main triggers image build and push.
3. Deployment manifest tag update is committed by CI bot logic.

## GitOps Flow

1. ArgoCD watches repository state.
2. Drift between desired and live state triggers sync.
3. Kubernetes rolls out updated deployment.
```

- [ ] **Step 5: Verify core wiki skeleton exists**

Run:

```bash
ls ".opencode/context/project-wiki/index.md" ".opencode/context/project-wiki/log.md" ".opencode/context/project-wiki/architecture.md" ".opencode/context/project-wiki/deployment.md"
```

Expected: all files listed.

---

### Task 4: Add Remaining Operational Wiki Pages

**Files:**
- Create: `.opencode/context/project-wiki/infrastructure.md`
- Create: `.opencode/context/project-wiki/operations.md`
- Create: `.opencode/context/project-wiki/content-authoring.md`
- Create: `.opencode/context/project-wiki/testing.md`
- Create: `.opencode/context/project-wiki/design-system.md`
- Test: existence + frontmatter presence checks

- [ ] **Step 1: Create infrastructure page**

Write `.opencode/context/project-wiki/infrastructure.md`:

```markdown
---
name: Infrastructure
description: Terraform, Hetzner, and k3s infrastructure details.
type: project
---

# Infrastructure

## Provisioning

1. Terraform creates server, firewall, and SSH resources.
2. cloud-init installs k3s and bootstraps ArgoCD root objects.
3. Operator fetches kubeconfig post-boot.

## Runtime Baseline

- Single-node k3s (Phase 1 target)
- ingress-nginx, cert-manager, ArgoCD
- Portfolio workload served via containerized static nginx
```

- [ ] **Step 2: Create operations runbook page**

Write `.opencode/context/project-wiki/operations.md`:

```markdown
---
name: Operations
description: Runbooks for bootstrap, rollout, rollback, and phase transitions.
type: project
---

# Operations

## Bootstrap Runbook

1. Apply Terraform locally.
2. Verify node and core workloads are healthy.
3. Confirm HTTPS endpoint accessibility.

## Domain Cutover Runbook

1. Prepare DNS and cert-manager issuer migration inputs.
2. Apply manifest changes via git.
3. Verify certificate issuance and endpoint response.

## Rollback Runbook

1. Revert rollout PR.
2. Let ArgoCD reconcile previous desired state.
3. Verify endpoint health and cert validity.
```

- [ ] **Step 3: Create content authoring page**

Write `.opencode/context/project-wiki/content-authoring.md`:

```markdown
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

## Workflow

1. Edit content file.
2. Run project checks.
3. Open PR with content-only scope when possible.
```

- [ ] **Step 4: Create testing page**

Write `.opencode/context/project-wiki/testing.md`:

```markdown
---
name: Testing
description: Testing strategy and validation requirements for portfolio-handoff.
type: project
---

# Testing

## Test Layers

1. Unit tests for pure logic.
2. E2E checks for core user flows.
3. CI-level quality and build checks.

## Validation Focus

1. Content contract integrity.
2. Runtime render correctness.
3. Deployment readiness.
```

- [ ] **Step 5: Create design system page**

Write `.opencode/context/project-wiki/design-system.md`:

```markdown
---
name: Design System
description: Design token and styling approach for the portfolio implementation.
type: project
---

# Design System

## Foundations

1. Token-driven styling under `app/src/styles/`.
2. Shared responsive breakpoints using `@custom-media`.
3. Consistent typography and spacing primitives.

## Practical Rules

1. Add new tokens in token files, not inline styles.
2. Keep section styling consistent with existing triptych language.
3. Preserve accessibility-oriented contrast and focus visibility.
```

- [ ] **Step 6: Verify all operational wiki pages have frontmatter**

Run:

```bash
python - <<'PY'
from pathlib import Path
pages = [
    '.opencode/context/project-wiki/infrastructure.md',
    '.opencode/context/project-wiki/operations.md',
    '.opencode/context/project-wiki/content-authoring.md',
    '.opencode/context/project-wiki/testing.md',
    '.opencode/context/project-wiki/design-system.md',
]
for p in pages:
    text = Path(p).read_text(encoding='utf-8')
    ok = text.startswith('---\n')
    print(p, 'frontmatter:', 'ok' if ok else 'missing')
PY
```

Expected: all lines end with `frontmatter: ok`.

---

### Task 5: Create ADR Set Under Canonical Project Wiki

**Files:**
- Create: `.opencode/context/project-wiki/adr/001-astro-react-islands.md`
- Create: `.opencode/context/project-wiki/adr/002-gitops-argocd.md`
- Create: `.opencode/context/project-wiki/adr/003-k3s-hetzner-single-node.md`
- Create: `.opencode/context/project-wiki/adr/004-sops-age-secrets.md`
- Create: `.opencode/context/project-wiki/adr/005-two-phase-domain-rollout.md`
- Create: `.opencode/context/project-wiki/adr/006-nginx-over-caddy.md`
- Test: ADR file existence and title checks

- [ ] **Step 1: Create ADR 001 and ADR 002**

Write `.opencode/context/project-wiki/adr/001-astro-react-islands.md`:

```markdown
---
name: ADR 001 - Astro React Islands
description: Choose Astro with React islands over a full SPA model.
type: project
---

# ADR 001 - Astro React Islands

## Decision

Use Astro with one React island for interactive filtering.

## Consequences

1. Lower client JS by default.
2. Strong content/presentation separation.
3. Additional islands require explicit design justification.
```

Write `.opencode/context/project-wiki/adr/002-gitops-argocd.md`:

```markdown
---
name: ADR 002 - GitOps ArgoCD
description: Choose ArgoCD GitOps over push-deploy patterns.
type: project
---

# ADR 002 - GitOps ArgoCD

## Decision

Use ArgoCD to reconcile cluster state from git.

## Consequences

1. Declarative deployment history in repository.
2. Clear drift management.
3. Requires disciplined manifest change process.
```

- [ ] **Step 2: Create ADR 003 and ADR 004**

Write `.opencode/context/project-wiki/adr/003-k3s-hetzner-single-node.md`:

```markdown
---
name: ADR 003 - k3s Hetzner Single Node
description: Choose single-node k3s on Hetzner as Phase 1 deployment target.
type: project
---

# ADR 003 - k3s Hetzner Single Node

## Decision

Use single-node k3s on Hetzner for Phase 1.

## Consequences

1. Low-cost realistic Kubernetes environment.
2. Single point of failure accepted for portfolio scope.
3. Upgrade path remains open for later phases.
```

Write `.opencode/context/project-wiki/adr/004-sops-age-secrets.md`:

```markdown
---
name: ADR 004 - SOPS Age Secrets
description: Use SOPS with age for encrypted secret management in GitOps.
type: project
---

# ADR 004 - SOPS Age Secrets

## Decision

Use SOPS with age, with KSOPS-based decryption at reconcile time.

## Consequences

1. Secrets remain encrypted in git.
2. Additional operational responsibility for key handling.
3. Explicit blast-radius controls required in repo policy.
```

- [ ] **Step 3: Create ADR 005 and ADR 006**

Write `.opencode/context/project-wiki/adr/005-two-phase-domain-rollout.md`:

```markdown
---
name: ADR 005 - Two Phase Domain Rollout
description: Start with nip.io then migrate to Cloudflare-managed domain.
type: project
---

# ADR 005 - Two Phase Domain Rollout

## Decision

Use nip.io in Phase 1 and Cloudflare DNS in Phase 2.

## Consequences

1. Faster initial go-live without domain purchase.
2. Clear migration runbook needed for cutover.
3. Temporary dual-path DNS handling in transition period.
```

Write `.opencode/context/project-wiki/adr/006-nginx-over-caddy.md`:

```markdown
---
name: ADR 006 - Nginx Over Caddy
description: Use nginx:alpine runtime image for static serving.
type: project
---

# ADR 006 - Nginx Over Caddy

## Decision

Use nginx:alpine for runtime static file serving.

## Consequences

1. Mature predictable runtime behavior.
2. Explicit config ownership in repo.
3. Minimal runtime surface area.
```

- [ ] **Step 4: Verify all ADR files exist and contain matching heading**

Run:

```bash
python - <<'PY'
from pathlib import Path
base = Path('.opencode/context/project-wiki/adr')
files = sorted(base.glob('*.md'))
print('count:', len(files))
for f in files:
    text = f.read_text(encoding='utf-8')
    print(f.name, 'title_ok:', '# ADR ' in text)
PY
```

Expected: `count: 6` and `title_ok: True` for each file.

---

### Task 6: Repair `project-intelligence` References and Canonical Pointers

**Files:**
- Modify: `.opencode/context/project-intelligence/navigation.md`
- Modify: `.opencode/context/project-intelligence/business-domain.md`
- Modify: `.opencode/context/project-intelligence/technical-domain.md`
- Modify: `.opencode/context/project-intelligence/decisions-log.md`
- Modify: `.opencode/context/project-intelligence/business-tech-bridge.md`
- Modify: `.opencode/context/project-intelligence/living-notes.md`
- Test: grep scans for stale references

- [ ] **Step 1: Confirm stale references currently exist (expected fail state)**

Run:

```bash
rg -n "legacy-plan-typo\.md|docs/wiki|docs/raw|docs/new-architecture-branch" ".opencode/context/project-intelligence" --glob "*.md"
```

Expected: one or more matches.

- [ ] **Step 2: Replace canonical references with `.opencode` destinations**

Apply these exact replacements across the six files:

```text
`legacy-plan-typo.md` -> `.opencode/context/project-wiki/index.md`
`/docs/wiki/` -> `.opencode/context/project-wiki/`
`docs/wiki/adr/*` -> `.opencode/context/project-wiki/adr/*`
`docs/raw/handoff-2026-04-19/` -> `.opencode/reference/raw-handoff/2026-04-19/`
`docs/raw/reference/karpathy-llm-wiki.md` -> `.opencode/reference/reference/karpathy-llm-wiki.md`
```

Also replace stale branch-status text in `living-notes.md` with:

```markdown
**Branch state:** Working branch is active. `.opencode/` is canonical for agentic docs. Legacy docs remain as temporary backup.
```

- [ ] **Step 3: Verify stale references were removed**

Run:

```bash
rg -n "legacy-plan-typo\.md|docs/new-architecture-branch" ".opencode/context/project-intelligence" --glob "*.md"
```

Expected: no output.

- [ ] **Step 4: Verify intentional legacy-backup mention remains explicit**

Run:

```bash
rg -n "legacy backup|temporary backup|read-only backup" ".opencode/context/project-intelligence" --glob "*.md"
```

Expected: at least one match indicating transitional backup policy.

---

### Task 7: Repair `.opencode` Internal Path and Command Contradictions

**Files:**
- Modify: `.opencode/skill/context7/navigation.md`
- Modify: `.opencode/skill/context7/README.md`
- Modify: `.opencode/agent/subagents/core/context-retriever.md`
- Modify: `.opencode/context/core/navigation.md`
- Modify: `.opencode/context/core/visual-development.md`
- Modify: `.opencode/command/context.md`
- Modify: `.opencode/command/validate-repo.md`
- Modify: `.opencode/command/test.md`
- Modify: `.opencode/command/commit.md`
- Test: contradiction grep scan

- [ ] **Step 1: Fix Context7 broken filename/path references**

Apply these replacements:

```text
legacy-skill-file.md -> SKILL.md
legacy-scout-name.md -> externalscout.md
```

- [ ] **Step 2: Fix obsolete standards file references in context-retriever**

Apply these replacements in `.opencode/agent/subagents/core/context-retriever.md`:

```text
.opencode/context/core/standards/code.md -> .opencode/context/core/standards/code-quality.md
.opencode/context/core/standards/tests.md -> .opencode/context/core/standards/test-coverage.md
```

- [ ] **Step 3: Remove openagents-repo dependency references not present in this repository**

Update `.opencode/context/core/navigation.md` and `.opencode/context/core/visual-development.md` so they no longer point to `.opencode/context/openagents-repo/...` or `.opencode/context/development/...` paths that do not exist here.

Use this replacement text in `core/navigation.md` related section:

```markdown
## Related Context

- **Project summaries** -> `../project-intelligence/navigation.md`
- **Project detailed wiki** -> `../project-wiki/index.md`
```

Use this replacement text in `core/visual-development.md` related section:

```markdown
## Related Context

- **UI Design Workflow**: `.opencode/context/core/workflows/design-iteration.md`
- **Task Delegation**: `.opencode/context/core/workflows/task-delegation.md`
- **Code Standards**: `.opencode/context/core/standards/code-quality.md`
- **Project Design System**: `.opencode/context/project-wiki/design-system.md`
- **Agent Capabilities**: `.opencode/agent/core/openagent.md`
```

- [ ] **Step 4: Align command docs with repository reality and safety rules**

Replace `.opencode/command/test.md` with:

```markdown
---
description: Run portfolio app validation checks
---

# Test Command

Run checks in `app/` using scripts that actually exist.

## Sequence

1. `pnpm --dir app check`
2. `pnpm --dir app test`
3. `pnpm --dir app build`

## Notes

- Stop and report on first failure.
- Do not auto-fix without explicit user request.
```

Replace `.opencode/command/commit.md` with:

```markdown
---
description: Prepare commit guidance when user explicitly requests a commit
---

# Commit Command

## Safety Rules

1. Never auto-commit.
2. Never auto-stage all files.
3. Never auto-push.
4. Only proceed when the user explicitly asks for a commit.

## Workflow

1. Inspect staged and unstaged changes.
2. Propose a commit message.
3. Commit only the intended files after user confirmation.
```

Replace `.opencode/command/validate-repo.md` with:

```markdown
---
description: Validate .opencode documentation consistency
---

# Validate Repo

Validate the local repository documentation state.

## Checks

1. Required `.opencode/context/project-wiki/` pages exist.
2. Required `.opencode/reference/` files exist.
3. Known broken reference patterns are absent.

## Commands

1. `rg -n "legacy-plan-typo\\.md|legacy-skill-file\\.md|legacy-scout-name\\.md|deprecated-subagent-name|missing-registry-file\\.json" .opencode --glob "*.md"`
2. `ls .opencode/context/project-wiki/index.md .opencode/reference/navigation.md`
```

Modify `.opencode/command/context.md` frontmatter dependencies so it references only existing subagents:

```yaml
dependencies:
  - subagent:contextscout
```

- [ ] **Step 5: Run contradiction scan and require zero matches**

Run:

```bash
rg -n "legacy-skill-file\.md|legacy-scout-name\.md|\.opencode/context/core/standards/code\.md|\.opencode/context/core/standards/tests\.md|openagents-repo|deprecated-subagent-name|missing-registry-file\.json|git add \.|always run and push|legacy-plan-typo\.md|docs/new-architecture-branch" ".opencode" --glob "*.md"
```

Expected: no output.

---

### Task 8: Add Coverage Map and Legacy Backup Status Pages

**Files:**
- Create: `.opencode/context/project-wiki/coverage-map.md`
- Create: `.opencode/context/project-wiki/legacy-backup-status.md`
- Create: `.opencode/context/project-wiki/migration-report-2026-04-22.md`
- Test: pages linked from project-wiki index and non-empty

- [ ] **Step 1: Create source-to-destination coverage map**

Write `.opencode/context/project-wiki/coverage-map.md`:

```markdown
---
name: Coverage Map
description: Mapping from legacy docs and implementation plan into canonical .opencode locations.
type: project
---

# Coverage Map

## Mapping

1. `IMPLEMENTATION_PLAN.md` -> `.opencode/context/project-wiki/*.md` and `.opencode/context/project-intelligence/*.md`
2. `docs/wiki/index.md` -> `.opencode/context/project-wiki/index.md`
3. `docs/raw/handoff-2026-04-19/*` -> `.opencode/reference/raw-handoff/2026-04-19/*`
4. `docs/raw/reference/karpathy-llm-wiki.md` -> `.opencode/reference/reference/karpathy-llm-wiki.md`

## Canonical Rule

During migration transition, `.opencode/` is canonical and legacy docs are backup only.
```

- [ ] **Step 2: Create legacy backup status page**

Write `.opencode/context/project-wiki/legacy-backup-status.md`:

```markdown
---
name: Legacy Backup Status
description: Transitional status of docs/ and IMPLEMENTATION_PLAN.md while .opencode becomes canonical.
type: project
---

# Legacy Backup Status

## Current State

1. Legacy backup retained: `docs/` and `IMPLEMENTATION_PLAN.md`
2. Canonical docs location: `.opencode/`
3. Legacy docs should not receive new updates

## Deletion Gate

Legacy docs can be removed only after explicit user approval following migration verification.
```

- [ ] **Step 3: Create migration report page**

Write `.opencode/context/project-wiki/migration-report-2026-04-22.md`:

```markdown
---
name: Migration Report 2026-04-22
description: Outcome of .opencode canonicalization migration and consistency repair.
type: project
---

# Migration Report - 2026-04-22

## Completed

1. Added canonical project wiki under `.opencode/context/project-wiki/`
2. Migrated raw and reference artifacts to `.opencode/reference/`
3. Repaired broken and stale `.opencode` references
4. Marked legacy docs as temporary backup

## Pending By Design

1. Deletion of `docs/` and `IMPLEMENTATION_PLAN.md` awaits explicit user approval.
```

- [ ] **Step 4: Verify index links include new pages**

Run:

```bash
rg -n "coverage-map\.md|legacy-backup-status\.md|migration-report-2026-04-22\.md" ".opencode/context/project-wiki/index.md"
```

Expected: all three links found.

---

### Task 9: Update Top-Level Repository Pointers For Canonical `.opencode` Docs

**Files:**
- Modify: `README.md`
- Modify: `docs/wiki/index.md`
- Test: README and legacy index mention canonical `.opencode` location

- [ ] **Step 1: Update README to point to canonical `.opencode` docs**

Replace docs section in `README.md` with:

```markdown
## Project docs

- Canonical summary docs: `.opencode/context/project-intelligence/`
- Canonical detailed docs: `.opencode/context/project-wiki/index.md`
- Canonical source references: `.opencode/reference/navigation.md`
- Legacy backup (temporary): `docs/` and `IMPLEMENTATION_PLAN.md`
```

- [ ] **Step 2: Mark legacy wiki index as backup-only**

Rewrite `docs/wiki/index.md` to:

```markdown
# Legacy Documentation Index (Backup)

This directory is temporary legacy backup.

Canonical documentation now lives under `.opencode/`:

- `.opencode/context/project-intelligence/`
- `.opencode/context/project-wiki/index.md`
- `.opencode/reference/navigation.md`
```

- [ ] **Step 3: Verify canonical pointer text appears in both files**

Run:

```bash
rg -n "Canonical|\.opencode/context/project-wiki/index\.md|Legacy backup" "README.md" "docs/wiki/index.md"
```

Expected: matches in both files.

---

### Task 10: Final Validation Sweep and Readiness Report

**Files:**
- Modify: `.opencode/context/project-wiki/migration-report-2026-04-22.md`
- Test: full validation command set

- [ ] **Step 1: Validate required canonical files exist**

Run:

```bash
python - <<'PY'
from pathlib import Path
required = [
    '.opencode/context/project-wiki/index.md',
    '.opencode/context/project-wiki/architecture.md',
    '.opencode/context/project-wiki/deployment.md',
    '.opencode/context/project-wiki/infrastructure.md',
    '.opencode/context/project-wiki/operations.md',
    '.opencode/context/project-wiki/content-authoring.md',
    '.opencode/context/project-wiki/testing.md',
    '.opencode/context/project-wiki/design-system.md',
    '.opencode/context/project-wiki/log.md',
    '.opencode/context/project-wiki/coverage-map.md',
    '.opencode/context/project-wiki/legacy-backup-status.md',
    '.opencode/context/project-wiki/migration-report-2026-04-22.md',
    '.opencode/reference/navigation.md',
    '.opencode/reference/reference/karpathy-llm-wiki.md',
]
missing = [p for p in required if not Path(p).exists()]
print('missing:', len(missing))
for p in missing:
    print(p)
PY
```

Expected: `missing: 0`.

- [ ] **Step 2: Validate contradiction patterns are absent in `.opencode`**

Run:

```bash
rg -n "legacy-plan-typo\.md|legacy-skill-file\.md|legacy-scout-name\.md|deprecated-subagent-name|missing-registry-file\.json|docs/new-architecture-branch" ".opencode" --glob "*.md"
```

Expected: no output.

- [ ] **Step 3: Validate legacy backup still exists (by design)**

Run:

```bash
ls "docs" "IMPLEMENTATION_PLAN.md"
```

Expected: both paths present.

- [ ] **Step 4: Append final verification section to migration report**

Append to `.opencode/context/project-wiki/migration-report-2026-04-22.md`:

```markdown
## Verification Summary

1. Canonical `.opencode` docs structure exists and is populated.
2. Known contradiction patterns have been removed from `.opencode` docs.
3. Legacy docs remain present as temporary backup.
4. Repository is ready for a separate user-approved legacy deletion pass.
```

- [ ] **Step 5: Execution handoff checkpoint (no deletion yet)**

Report status to user:

```text
Migration complete with `.opencode` canonicalized.
Legacy backup retained intentionally.
Ready for optional follow-up pass to delete `docs/` and `IMPLEMENTATION_PLAN.md`.
```

---

## Plan Self-Review

### Spec coverage

Covered explicitly:

1. Hybrid canonicalization architecture under `.opencode`.
2. Migration of docs/wiki + raw/reference into `.opencode` destinations.
3. Contradiction and path repair across `.opencode` content.
4. Canonicality + legacy backup policy.
5. Validation and readiness reporting.

### Placeholder scan

No TODO/TBD placeholders used. Each task specifies exact file paths, text content, and commands.

### Consistency scan

Canonical targets and naming are consistent across tasks:

- `.opencode/context/project-intelligence/` -> summaries
- `.opencode/context/project-wiki/` -> detailed docs
- `.opencode/reference/` -> immutable source/reference artifacts
