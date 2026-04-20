import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://portfolio.127-0-0-1.nip.io",
  integrations: [react(), sitemap()],
});
