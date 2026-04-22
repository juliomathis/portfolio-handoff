---
description: Validate .opencode documentation consistency
---

# Validate Repo

Validate the local repository documentation state.

## Checks

1. Required `.opencode/context/project-wiki/` pages exist.
2. Required ADR files under `.opencode/context/project-wiki/adr/` exist.
3. Required `.opencode/reference/` files and directories exist.
4. Known broken reference patterns are absent.

## Commands

1. `rg -n "legacy-plan-typo\\.md|legacy-skill-file\\.md|legacy-scout-name\\.md|deprecated-subagent-name|missing-registry-file\\.json" .opencode --glob "*.md"`
2. `ls .opencode/context/project-wiki/index.md .opencode/context/project-wiki/architecture.md .opencode/context/project-wiki/deployment.md .opencode/context/project-wiki/infrastructure.md .opencode/context/project-wiki/operations.md .opencode/context/project-wiki/content-authoring.md .opencode/context/project-wiki/testing.md .opencode/context/project-wiki/design-system.md .opencode/context/project-wiki/log.md .opencode/context/project-wiki/coverage-map.md .opencode/context/project-wiki/legacy-backup-status.md .opencode/context/project-wiki/migration-report-2026-04-22.md`
3. `ls .opencode/context/project-wiki/adr/001-astro-react-islands.md .opencode/context/project-wiki/adr/002-gitops-argocd.md .opencode/context/project-wiki/adr/003-k3s-hetzner-single-node.md .opencode/context/project-wiki/adr/004-sops-age-secrets.md .opencode/context/project-wiki/adr/005-two-phase-domain-rollout.md .opencode/context/project-wiki/adr/006-nginx-over-caddy.md`
4. `ls .opencode/reference/navigation.md .opencode/reference/raw-handoff .opencode/reference/reference`
