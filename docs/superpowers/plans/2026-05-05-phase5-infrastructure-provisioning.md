# Phase 5 Infrastructure Provisioning (Preparation) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare reproducible Terraform infrastructure scaffolding and a local validation workflow for the portfolio platform without applying infrastructure in this phase.

**Architecture:** Establish a single root Terraform stack under `infra/terraform/` that provisions the Phase 1 Hetzner baseline (server, firewall, SSH key) and injects cloud-init via `templatefile()`. Keep state local for Phase 1, enforce local operator validation gates (`init`, `fmt -check`, `validate`, `plan`), and explicitly defer apply/cutover work to subsequent approved steps.

**Tech Stack:** Terraform CLI (1.15.x constraint), Hetzner provider (`hetznercloud/hcloud ~> 1.58`), cloud-init, k3s bootstrap script flow, Markdown runbooks

---

## Scope Baseline (Subtask 01)

### In scope
- Create and document the Phase 5 Terraform file layout in `infra/terraform/`.
- Define provider/version constraints using:
  - Terraform `required_version = "~> 1.15.0"`
  - `hetznercloud/hcloud` provider `version = "~> 1.58"`
- Define the cloud-init integration contract for `hcloud_server.user_data` using `templatefile()`.
- Define a local-only operator verification path:
  1. `terraform init`
  2. `terraform fmt -check`
  3. `terraform validate`
  4. `terraform plan`
- Prepare documentation updates needed to keep phase-status narratives synchronized across canonical docs.

### Out of scope
- Any `terraform apply`, `terraform destroy`, or live infrastructure mutation.
- Any Phase 6+ implementation surfaces:
  - `k8s/`
  - `.github/workflows/`
- ArgoCD/Kubernetes manifest authoring beyond cloud-init contract definition.
- Remote backend rollout (Phase 1.5) and Terraform CI workflow enablement.

---

## Constraints

- Keep Terraform as **local-only** workflow in Phase 1 (no Terraform CI workflow).
- Preserve canonical-doc authority in `.opencode/context/` when conflicts exist with legacy docs.
- Keep the open Hetzner region decision (`nbg1` default vs alternatives) as a pre-apply decision, not a planning blocker.
- Keep implementation scoped to preparation artifacts and validation workflow design.
- Keep all generated local validation artifacts and transient outputs out of git.

---

## Verification Checklist (for this planning scope)

- [ ] Plan explicitly prohibits `terraform apply` in this phase.
- [ ] Plan explicitly prohibits Phase 6/7 implementation work.
- [ ] Provider baseline pinned to `hetznercloud/hcloud ~> 1.58`.
- [ ] Local validation command sequence is defined and ordered.
- [ ] Canonical documentation sync targets are listed before execution begins.

---

## Planned Task Sequence

1. Baseline scope and constraints for Phase 5 prep.
2. Define Terraform baseline scaffolding specification.
3. Define cloud-init `templatefile()` integration contract.
4. Define local operator verification workflow.
5. Define canonical documentation synchronization matrix.
6. Finalize execution plan with risk controls and approval hold-point.

---

## Terraform Baseline Scaffolding Specification (Subtask 02)

### Planned file tree (`infra/terraform/`)

```text
infra/terraform/
├── main.tf          # terraform + provider blocks, core Hetzner resources, cloud-init wiring
├── variables.tf     # typed input contract (sensitive + non-sensitive vars)
├── outputs.tf       # operator outputs (ip, ssh command, nip.io URL)
├── backend.tf       # explicit local backend stance for Phase 1
├── versions.tf      # required_version + required_providers (optional split if main.tf kept lean)
├── terraform.tfvars.example  # non-secret template for operator inputs
├── cloud-init.tftpl # cloud-init template consumed by templatefile()
└── .gitignore       # ignore local state and plan artifacts
```

### Baseline resource specification

- Provider: `hetznercloud/hcloud` with `version = "~> 1.58"`.
- Terraform core: `required_version = "~> 1.15.0"`.
- Baseline resources for Phase 5 prep scope:
  - `hcloud_ssh_key`
  - `hcloud_firewall`
  - `hcloud_server`
- `hcloud_server.user_data` is wired through `templatefile()` and receives a typed variable map.

### Provider/version decisions

- Use `~> 1.58` for `hetznercloud/hcloud` to align with current provider guidance.
- Keep versions explicit in HCL (no floating provider ranges).
- Commit `.terraform.lock.hcl` once initialization is executed during implementation.
- Keep this phase at planning/prep level only; version pinning is specified now and enacted during implementation.

### Local-state and safety guardrails

- Backend stance in Phase 1: local state only.
- Do not add `.github/workflows/terraform.yml` in this phase.
- Keep sensitive values out of tracked files:
  - do not commit real `.tfvars`
  - do not commit `*.tfstate*`
  - do not commit plan artifacts (`tfplan`, binary plans, JSON plans)
- Add `infra/terraform/.gitignore` entries for all transient Terraform artifacts.
- Keep apply and destroy operations explicitly out of Subtask 02 scope.

### Dry-run verification expectations (no apply)

Run from `infra/terraform/` during implementation:

1. `terraform init`
2. `terraform fmt -check`
3. `terraform validate`
4. `terraform plan`

Expected outcomes:
- init succeeds and installs locked provider versions.
- fmt check passes with no formatting drift.
- validate exits successfully with no schema/config errors.
- plan renders a deterministic create-only proposal for baseline resources, with no apply executed.

### Notes

- Canonical `.opencode/context` currently captures local-only workflow and Phase 5 scope, but does not yet fully encode provider-version pin detail; this plan section records that explicit baseline for implementation.

---

## Cloud-init `templatefile()` Integration Contract (Subtask 03)

### Responsibility boundary

- Terraform provisions base infrastructure (`hcloud_ssh_key`, `hcloud_firewall`, `hcloud_server`).
- cloud-init payload (via `hcloud_server.user_data`) is responsible for first-boot bootstrap actions only:
  - install k3s
  - bootstrap ArgoCD root objects
  - leave steady-state reconciliation to GitOps controllers
- This section defines integration contract only; no live bootstrap/apply is executed in this phase.

### Contract shape in Terraform

- `hcloud_server.user_data` is rendered with:

```hcl
user_data = templatefile("${path.module}/cloud-init.tftpl", {
  github_repo    = var.github_repo
  admin_ip_cidr  = var.admin_ip_cidr
  # additional typed keys as approved by implementation task
})
```

- Template contract rules:
  - template file is UTF-8 text (`cloud-init.tftpl`)
  - second argument to `templatefile()` is an object/map
  - variable names in template follow Terraform identifier constraints
  - `templatefile()` is non-recursive (do not nest `templatefile()` calls)

### Input variable expectations

- Inputs passed into `templatefile()` must be explicitly declared in `variables.tf` with type annotations.
- Non-secret operational values (repo URL, region/location choices, CIDRs) are passed as plain typed variables.
- Secrets are not part of Subtask 03 planning scope; if future contract extensions include sensitive fields, mark those variables `sensitive = true` and treat plan/state artifacts as sensitive operational data.

### Safety and reproducibility rules

- Keep cloud-init template under `infra/terraform/` as a tracked immutable input (`cloud-init.tftpl`) for deterministic planning.
- Do not generate template files dynamically at runtime.
- Keep initialization actions idempotent where possible, but defer behavior-level hardening details to implementation subtasks.

### Plan-only validation expectations (no apply)

During implementation, contract validation is limited to non-mutating checks:

1. `terraform init`
2. `terraform validate`
3. `terraform plan -input=false`

Optional automation gate for CI-like local checks:
- `terraform plan -detailed-exitcode` (0 = no diff, 2 = diff present, 1 = error)

No `terraform apply` is permitted in this subtask.

### Outcome of Subtask 03

- The plan contains an explicit, testable contract for wiring `cloud-init.tftpl` into `hcloud_server.user_data` with typed inputs, local-only validation, and no live infrastructure mutation.

---

## Local Operator Verification Workflow (Subtask 04)

### Ordered local-only workflow

Run from `infra/terraform/`:

1. `terraform init`
2. `terraform fmt -check`
3. `terraform validate`
4. `terraform plan -input=false`

### Pass/fail signals

- `init`
  - **Pass:** provider plugins resolve and initialization exits `0`
  - **Fail:** auth/provider/download/backend errors block all subsequent steps
- `fmt -check`
  - **Pass:** no output drift and exit `0`
  - **Fail:** non-zero exit indicates formatting drift; fix and rerun
- `validate`
  - **Pass:** configuration is syntactically and structurally valid
  - **Fail:** type/schema/reference errors must be resolved before plan
- `plan -input=false`
  - **Pass:** speculative execution produced without mutating infra
  - **Fail:** unresolved variable/auth/provider/resource contract errors

### Explicit prohibition for this phase

- `terraform apply` is prohibited in this planning phase.
- `terraform destroy` is prohibited in this planning phase.
- No CI Terraform workflow is introduced in Phase 1 (`.github/workflows/terraform.yml` remains out of scope).

### Troubleshooting notes (common pre-plan failures)

- **Missing credentials (`HCLOUD_TOKEN`)**
  - symptom: provider auth failure during `init`/`plan`
  - action: export token locally and rerun
- **Unset required variables**
  - symptom: `plan` prompts or errors when `-input=false` is used
  - action: provide values via local `.tfvars` (untracked) or `TF_VAR_*`
- **Formatting drift**
  - symptom: `fmt -check` non-zero
  - action: run `terraform fmt`, recheck
- **Validation contract mismatch**
  - symptom: variable/resource reference/type errors
  - action: resolve schema/reference mismatch before any further step

---

## Canonical Documentation Synchronization Matrix (Subtask 05)

### Files requiring Phase 5 prep status alignment

| File | Update intent (Phase 5 prep only) |
|---|---|
| `README.md` | Keep top-level phase summary aligned with current branch/workstream status |
| `AGENTS.md` | Keep active phase focus + transition checklist aligned with current phase |
| `.opencode/context/project-intelligence/navigation.md` | Keep “Current phase” entry accurate |
| `.opencode/context/project-intelligence/business-domain.md` | Keep roadmap/status table aligned for Phase 5 prep |
| `.opencode/context/project-intelligence/technical-domain.md` | Keep technical state section aligned with infra-prep progress |
| `.opencode/context/project-intelligence/living-notes.md` | Keep completed/in-flight status and active constraints current |
| `.opencode/context/project-wiki/log.md` | Append operational event entries for phase transitions/sync events |

### Update-scope guardrail

- Only Phase 5 preparation status and planning-relevant deltas are updated.
- Do not introduce Phase 6/7 implementation status in these sync updates.
- Do not edit `.opencode/context/project-wiki/index.md` without explicit user request.

### Sync verification checklist

- [ ] All listed files reflect the same Phase 5 status wording.
- [ ] No listed file claims Phase 6/7 implementation has begun.
- [ ] Operations log has an append-only entry for the sync event.
- [ ] References to local-only Terraform policy are consistent where mentioned.

### Approval checkpoint

- After sync edits are prepared, stop for a user approval checkpoint before moving from planning phase artifacts to implementation-phase Terraform file creation.

---

## Finalized Execution and Risk Controls (Subtask 06)

### Ordered execution phases (mapped to subtasks)

1. **Subtask 01** — Scope and constraints baseline
2. **Subtask 02** — Terraform baseline scaffolding specification
3. **Subtask 03** — Cloud-init `templatefile()` contract
4. **Subtask 04** — Local operator verification workflow
5. **Subtask 05** — Canonical documentation synchronization matrix
6. **Subtask 06** — Final risk controls + approval hold-point (this section)

### Unresolved decision list (must stay explicit)

1. **Hetzner region selection** (`nbg1` default vs alternatives) — required before any future `terraform apply`, not a planning blocker.
2. **Operator input finalization** (`admin_ip_cidr`, SSH key source path, GitHub repo URL format) — must be fixed before first live plan/apply in implementation phase.

### Risk register (planning phase)

| Risk | Impact | Control |
|---|---|---|
| Provider/version drift from plan assumptions | Non-reproducible behavior across operators | Pin Terraform/provider versions and commit lockfile during implementation |
| Accidental introduction of apply actions in prep phase | Unreviewed live infra mutation | Hard no-apply rule in this phase + explicit verification gate wording |
| Terraform artifacts accidentally committed | Secret/state leakage and noisy diffs | `infra/terraform/.gitignore` policy + review gate on tracked files |
| Status drift across canonical docs | Confusing handoff and phase ambiguity | Mandatory synchronization matrix + append-only log entry |

### Verification gates before implementation phase

- Gate 1: plan document complete for Subtasks 01–06.
- Gate 2: task package validates (`task-cli validate`).
- Gate 3: next-phase execution starts only after explicit user approval.

### Final scope lock

- This plan phase does **not** execute `terraform apply` or `terraform destroy`.
- This plan phase does **not** implement Phase 6/7 surfaces (`k8s/`, `.github/workflows/`).
- Any scope expansion requires explicit decision change approval.
