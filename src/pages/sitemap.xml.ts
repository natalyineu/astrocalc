import type { APIRoute } from 'astro';
import { allPages, alternates } from '../lib/routes';

export const GET: APIRoute = ({ site }) => {
  const abs = (p: string) => new URL(p, site).toString();
  const urls = allPages().map((p) => {
    const alts = alternates(p.id);
    const self = alts.find((a) => a.locale === p.locale)!;
    const links = alts
      .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.tag}" href="${abs(a.path)}"/>`)
      .join('\n');
    return `  <url>\n    <loc>${abs(self.path)}</loc>\n${links}\n  </url>`;
  });
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
