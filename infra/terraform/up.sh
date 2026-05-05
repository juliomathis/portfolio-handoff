#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SECRETS_FILE="${HOME}/.config/portfolio-handoff/secrets.env"

if [[ -f "${SECRETS_FILE}" ]]; then
  # shellcheck source=/dev/null
  source "${SECRETS_FILE}"
fi

if [[ -z "${TF_VAR_hcloud_token:-}" ]]; then
  printf 'TF_VAR_hcloud_token is not set. Configure %s or export it in this shell.\n' "${SECRETS_FILE}" >&2
  exit 1
fi

CURRENT_IP="$(curl -4fsSL https://api.ipify.org)"
ADMIN_CIDR="${CURRENT_IP}/32"

printf 'Using admin_ip_cidr=%s\n' "${ADMIN_CIDR}"

terraform -chdir="${ROOT_DIR}" init
terraform -chdir="${ROOT_DIR}" fmt -check
terraform -chdir="${ROOT_DIR}" validate
terraform -chdir="${ROOT_DIR}" plan -input=false -refresh=false -var "admin_ip_cidr=${ADMIN_CIDR}" -out=tfplan
terraform -chdir="${ROOT_DIR}" apply -input=false -auto-approve tfplan
rm -f "${ROOT_DIR}/tfplan"

terraform -chdir="${ROOT_DIR}" output
