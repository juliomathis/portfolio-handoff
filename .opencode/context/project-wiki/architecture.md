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
