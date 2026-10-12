import { defineConfig } from 'astro/config';

// Set SITE_URL when building for production (used for canonical, hreflang, sitemap).
const site = process.env.SITE_URL || 'https://example.com';

export default defineConfig({
  site,
  trailingSlash: 'always',
  build: { format: 'directory' },
});
