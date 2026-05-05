variable "hcloud_token" {
  type        = string
  sensitive   = true
  description = "Hetzner Cloud API token"
}

variable "ssh_public_key" {
  type        = string
  description = "Admin SSH public key in OpenSSH format"
}

variable "admin_ip_cidr" {
  type        = string
  description = "Admin IP in CIDR notation for SSH and kube-api access"
}

variable "server_type" {
  type        = string
  default     = "cx23"
  description = "Hetzner server type"
}

variable "location" {
  type        = string
  default     = "nbg1"
  description = "Hetzner location"
}

variable "github_repo" {
  type        = string
  description = "HTTPS repository URL used by ArgoCD bootstrap"
}

variable "cloudflare_api_token" {
  type        = string
  sensitive   = true
  default     = null
  nullable    = true
  description = "Phase 2 only: Cloudflare API token"
}

variable "cloudflare_zone_id" {
  type        = string
  default     = null
  nullable    = true
  description = "Phase 2 only: Cloudflare zone id"
}
