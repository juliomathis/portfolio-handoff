output "vps_ip" {
  value = hcloud_server.portfolio.ipv4_address
}

output "nip_io_url" {
  value = "https://portfolio.${replace(hcloud_server.portfolio.ipv4_address, ".", "-")}.nip.io"
}

output "ssh_command" {
  value = "ssh root@${hcloud_server.portfolio.ipv4_address}"
}
