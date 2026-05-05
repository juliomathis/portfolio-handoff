provider "hcloud" {
  token = var.hcloud_token
}

resource "hcloud_ssh_key" "admin" {
  name       = "portfolio-admin"
  public_key = var.ssh_public_key
}

resource "hcloud_firewall" "portfolio" {
  name = "portfolio-fw"

  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "22"
    source_ips = [
      var.admin_ip_cidr,
    ]
  }

  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "6443"
    source_ips = [
      var.admin_ip_cidr,
    ]
  }

  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "80"
    source_ips = [
      "0.0.0.0/0",
      "::/0",
    ]
  }

  rule {
    direction = "in"
    protocol  = "tcp"
    port      = "443"
    source_ips = [
      "0.0.0.0/0",
      "::/0",
    ]
  }
}

resource "hcloud_server" "portfolio" {
  name         = "portfolio"
  image        = "debian-12"
  server_type  = var.server_type
  location     = var.location
  ssh_keys     = [hcloud_ssh_key.admin.id]
  firewall_ids = [hcloud_firewall.portfolio.id]

  user_data = templatefile("${path.module}/cloud-init.tftpl", {
    github_repo = var.github_repo
  })

  public_net {
    ipv4_enabled = true
    ipv6_enabled = true
  }

  labels = {
    project    = "portfolio"
    managed_by = "terraform"
  }
}
