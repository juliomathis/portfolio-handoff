---
name: Deployment
description: CI and GitOps deployment flow for portfolio-handoff.
type: project
---

# Deployment

## CI Flow

1. PR validation runs checks/tests (`ci.yml`) on relevant changes.
2. Merge to `main` with `app/**` changes triggers image build and push (`image.yml`).
3. Deployment manifest tag update is handled by CI bot logic with protected-branch fallback.

## Image Workflow (`.github/workflows/image.yml`)

1. Build app and publish immutable image tag: `ghcr.io/juliomathis/portfolio:<git-sha>`.
2. Update `k8s/manifests/portfolio/deployment.yaml` image line.
3. Stage guard: fail unless the staged diff is exactly `k8s/manifests/portfolio/deployment.yaml`.
4. Commit as app bot identity (`<app-slug>[bot]`).
5. Attempt direct `git push origin HEAD:main`.
6. If direct push fails due branch protection (`GH006`) or a non-fast-forward race (`fetch first`/`non-fast-forward`):
   - push branch `bot/deploy-image-<sha>`
   - create PR `chore(deploy): bump portfolio image to <sha>`
7. Merge bot PR through normal branch-protection policy.

## Required Repo Settings

- Actions secrets:
  - `PORTFOLIO_BOT_APP_ID`
  - `PORTFOLIO_BOT_PRIVATE_KEY`
- Workflow permissions for `image.yml` include:
  - `contents: read`
  - `packages: write`
  - `pull-requests: write`
- Repository Actions workflow setting must allow GitHub Actions to create pull requests (`can_approve_pull_request_reviews: true`).

## GitOps Flow

1. ArgoCD watches repository state.
2. Drift between desired and live state triggers sync.
3. Kubernetes rolls out updated deployment.
