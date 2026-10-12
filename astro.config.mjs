import { defineConfig } from 'astro/config';

// Set SITE_URL when building for production (used for canonical, hreflang, sitemap).
const site = process.env.SITE_URL || 'https://example.com';

// BASE is a sub-path for project hosting (GitHub Pages: /astrocalc). Empty on a custom domain.
const base = process.env.BASE || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },
});
