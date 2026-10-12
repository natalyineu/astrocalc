# AstroCalc

Static astrology-calculator site (Astro + astronomy-engine). 98 pages: 5 calculators,
12 sign pages, 78 zodiac-compatibility pairs, about/privacy.

## Commands

```bash
npm run dev      # local dev server
npm run build    # static build into dist/
```

## Before launch

1. Buy a domain and build with `SITE_URL=https://yourdomain.com npm run build`
   (used for canonical URLs and sitemap).
2. Deploy `dist/` to Cloudflare Pages or Vercel (free).
3. Set contact email in `src/pages/about.astro` and `src/pages/privacy.astro`.
4. Submit `/sitemap-index.xml` to Google Search Console.
5. After AdSense approval, set env vars at build time:
   - `PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX`
   - `PUBLIC_AD_SLOT_CONTENT=<ad unit id>`
   - `PUBLIC_GA_ID=G-XXXXXXXXXX` (optional analytics)

## Growth ideas (programmatic pages)

- Moon sign in each sign × sun sign combos (144 pages)
- Birthday pages: "Born on March 5: zodiac sign and traits" (366 pages)
- Chinese zodiac per year (1930-2030) and animal × animal compatibility
- Life path number compatibility (e.g. 3 and 7)
- Daily horoscope page per sign for repeat visits
