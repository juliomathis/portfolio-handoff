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
