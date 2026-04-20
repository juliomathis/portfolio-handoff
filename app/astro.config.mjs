import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

export const resolveSiteUrl = (publicSiteUrl = process.env.PUBLIC_SITE_URL) =>
  publicSiteUrl || "http://localhost:4321";

export default defineConfig({
  site: resolveSiteUrl(),
  integrations: [react(), sitemap()],
});
