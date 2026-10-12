import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: replace with the real domain once it is bought.
const site = process.env.SITE_URL || 'https://example.com';

export default defineConfig({
  site,
  integrations: [sitemap()],
  trailingSlash: 'never',
  build: { format: 'file' },
});
