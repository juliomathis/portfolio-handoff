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

terraform -chdir="${ROOT_DIR}" destroy -auto-approve
