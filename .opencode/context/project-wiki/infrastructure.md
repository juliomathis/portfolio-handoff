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

## On-demand lifecycle (cost control)

Phase 5 baseline uses an on-demand lifecycle so compute only runs during validation windows.

### Prerequisites

- Terraform CLI installed on operator workstation.
- Hetzner token available via `TF_VAR_hcloud_token` (recommended source: `~/.config/portfolio-handoff/secrets.env`).
- SSH key available at `~/.ssh/portfolio_hcloud_ed25519` for root access validation.

### Start infrastructure

Run from repo root:

```bash
./infra/terraform/up.sh
```

`up.sh` performs:

1. source token from `~/.config/portfolio-handoff/secrets.env`
2. detect current public IPv4 and set `admin_ip_cidr=<ip>/32`
3. run `terraform init`, `terraform fmt -check`, `terraform validate`
4. run `terraform plan` and `terraform apply`

### Stop infrastructure

Run from repo root as soon as validation is done:

```bash
./infra/terraform/down.sh
```

`down.sh` performs `terraform destroy -auto-approve` and returns active compute to zero.

### Notes

- `server_type` baseline is `cx23` (current available low-cost CX family type in `nbg1`).
- `admin_ip_cidr` is intentionally dynamic per session to avoid SSH lockouts when operator IP changes.
- `terraform.tfvars` is untracked; keep tokens out of git.

## Runtime Baseline

- Single-node k3s (Phase 1 target)
- ingress-nginx, cert-manager, ArgoCD
- Portfolio workload served via containerized static nginx
