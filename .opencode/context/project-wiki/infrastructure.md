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
