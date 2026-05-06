---
name: Architecture
description: System architecture and boundaries for the portfolio-handoff project.
type: project
---

# Architecture

## System Summary

Portfolio-handoff is a production-grade single-page Astro site with a single React island, deployed to k3s via ArgoCD GitOps.

## Core Boundaries

| Concern | Primary paths | Contract |
|---|---|---|
| Content | `app/src/content/*.ts` | Content changes should not require component edits |
| Presentation | `app/src/{pages,layouts,components,islands,styles}` | One hydrated island only (`ProjectFilter.tsx`) |
| Infrastructure | `infra/`, `k8s/`, `.github/workflows/` | Cluster/app lifecycle is git-driven and reviewable |

Components should consume typed content through `app/src/lib/types.ts`, not inline literals.

## Runtime Topology

```text
Visitor (HTTPS)
  -> Hetzner CX23 public IP
    -> Cloud firewall (80/443 world, 22/6443 admin CIDR)
      -> k3s single-node cluster
        -> ingress-nginx (hostNetwork)
          -> Service portfolio (ClusterIP)
            -> Deployment portfolio (nginx container serving Astro dist)

Supporting controllers on-cluster:
- ArgoCD for GitOps reconciliation
- cert-manager for certificate issuance
```

## Request Flow

1. Browser resolves `portfolio.<ip-with-dashes>.nip.io` to the node IP.
2. ingress-nginx terminates TLS and routes by host/path.
3. Traffic reaches `Service/portfolio` and then the `Deployment/portfolio` pod.
4. nginx serves prebuilt static assets and the single island hydration bundle.

## Deployment Flow (Push to Live)

1. Merge to `main` with `app/**` changes triggers `.github/workflows/image.yml`.
2. Workflow builds app, publishes `ghcr.io/juliomathis/portfolio:<git-sha>`.
3. Workflow updates only `k8s/manifests/portfolio/deployment.yaml`.
4. Workflow attempts direct push to `main`; on protected-branch (`GH006`) or non-fast-forward race (`fetch first`) failure, it pushes `bot/deploy-image-<sha>` and opens a bump PR.
5. After bump PR merge, ArgoCD detects drift and reconciles deployment state.
6. Kubernetes performs rolling update; readiness gates switch traffic to the new pod.

## Provisioning Flow (Zero to Cluster)

1. Operator runs `./infra/terraform/up.sh`.
2. Terraform provisions Hetzner server/firewall/SSH key resources.
3. cloud-init installs k3s, deploys ArgoCD bootstrap, applies scoped `AppProject` and root app.
4. ArgoCD syncs child apps from `k8s/apps/` and manifests from `k8s/manifests/`.
5. Operator verifies readiness and tears down with `./infra/terraform/down.sh` after validation windows.

## Architecture Invariants

1. **Single React island:** `app/src/islands/ProjectFilter.tsx` is the only hydrated component.
2. **Immutable image tags:** deployment image tags use git SHAs; never `latest`.
3. **Scoped Argo permissions:** all applications run under `AppProject: portfolio`, not `default`.
4. **PR-driven protected main:** automation must preserve branch protection and review policy.
5. **Canonical docs live in `.opencode/`:** `docs/` and `IMPLEMENTATION_PLAN.md` remain legacy backup.

## Repository Responsibility Map

| Path | Responsibility | Typical change cadence |
|---|---|---|
| `app/src/content/` | Portfolio data/content | frequent |
| `app/src/components/`, `app/src/styles/` | Page rendering and styling | moderate |
| `.github/workflows/` | CI/CD automation | low |
| `k8s/` | Desired cluster and app manifests | low |
| `infra/terraform/` | Base infrastructure provisioning | low |

## Related

- [deployment.md](deployment.md) for CI/GitOps workflow details.
- [infrastructure.md](infrastructure.md) for Terraform/on-demand lifecycle runbook.
- [operations.md](operations.md) for validation, rollback, and incident procedures.
