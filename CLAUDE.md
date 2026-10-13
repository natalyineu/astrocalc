# AstroCalc: instructions for Claude sessions

Multilingual static site of astrology calculators, monetised with display ads (AdSense).
Goal: grow organic search traffic cheaply and automatically; first target is $50/month ad revenue.
Owner: natalyineu (GitHub). Communicate with the owner in Russian; code, comments and commit messages in English.

## Stack and commands

Astro 5 (static output) + `astronomy-engine` (moon position, new moon). No backend, no database.

```bash
npm install
npm run dev                 # http://localhost:4321 (theme switcher visible)
npm run build               # static site into dist/ (~98 pages per enabled locale)
node scripts/check-i18n.mjs # translation coverage, placeholder and slug validation
ANTHROPIC_API_KEY=... node scripts/translate.mjs <code>   # fill missing keys for a locale
```

Build for production: `SITE_URL=https://<domain> PUBLIC_THEME=<theme> npm run build`.

## Architecture (read before changing anything)

- `src/data/core.ts`: language-neutral facts (sign ids, element, modality, ruler, date ranges, tool ids).
- `src/lib/astro.ts`: calculations (sun sign, moon sign, life path, Chinese zodiac). Pure, runs in the browser too.
- `src/lib/compat.ts`: compatibility scoring. Returns numbers and text *keys*, never text.
- `src/i18n/config.ts`: list of candidate languages. A language is built only if
  `src/i18n/locales/<code>.json` exists. `en.json` is the source of truth.
- `src/i18n/index.ts`: `getT(locale)` deep-merges the locale over English, so a missing key falls back to
  English (arrays fall back unless the same length). `fmt()` replaces `{placeholders}`.
- `src/lib/routes.ts`: registry of every page (id, view, locale, path). Slugs are translated per locale;
  duplicate URLs fail the build. `pageUrl(locale, id)` and `alternates(id)` (hreflang) come from here.
- `src/pages/[lang]/[...path].astro`: single catch-all route, maps `page.view` to a component in `src/views/`.
- `src/pages/index.astro`: language chooser (x-default is English). `sitemap.xml.ts` and `robots.txt.ts` are endpoints.
- `src/layouts/Base.astro`: head (canonical, hreflang, og, AdSense and GA via env), header, footer, all CSS.
  Themes are CSS-variable sets under `[data-theme="genz|millennial|genx|boomer|cosmic"]`.
- `src/components/MatchApp.astro`: the two-date synastry calculator (home page and compatibility page), ported from
  `docs/reference/astromatch-reference.html`: sign preview, animated calculation, score, 4 bars, 3 insight cards,
  9:16 story card (canvas PNG download), shareable link `?a=&b=&n1=&n2=`. Strings live in `match.*` of each locale;
  insights reuse `compat.elementPairs`, `compat.modalityPairs`, sign challenges. Scores come from `lib/compat.ts`.
- Calculator pages embed their strings as JSON in `<script type="application/json" id="data">` and a module
  script reads it. Never hard-code user-visible text in views or scripts; it must come from the locale files.

### Adding things

- **New language**: add the code to `LOCALES` if missing, run `translate.mjs <code>`, run `check-i18n.mjs`,
  build. For RTL languages `dir` is already handled via `LocaleMeta.dir`.
- **New tool**: add the id to `TOOL_IDS` in `core.ts`, a view in `src/views/tools/`, register it in the
  `VIEWS` map in `[...path].astro`, add `tools.<id>`, `nav.<id>` and `home.toolDescriptions.<id>` to `en.json`,
  then translate. It appears in nav, home, sitemap and hreflang automatically.
- **New programmatic page family**: add page ids in `routes.ts` (see how sign and pair pages are generated),
  a view, and locale keys. Planned: "born on <date>" (366 pages), life-path pair compatibility,
  Chinese-animal pairs, daily horoscope per sign.

## Rules and gotchas

- Slug keys (`*.slug`, `signPage.dir`, `compat.connector`) must be lowercase ASCII with hyphens.
- Keep placeholders (`{name}`) identical across locales; `check-i18n.mjs` enforces it.
- Astro templates break on a bare `<` or `<=` in expressions (parsed as a tag). Compute in the frontmatter.
- Dates and month names use `Intl` with the locale tag; do not translate them by hand.
- Copy for pages must be useful and unique-ish (Google penalises thin AI content). Prefer richer templates
  over more pages when quality is low.
- No secrets in the repo. AdSense and analytics ids are build-time env vars:
  `PUBLIC_ADSENSE_CLIENT`, `PUBLIC_AD_SLOT_CONTENT`, `PUBLIC_GA_ID`, `PUBLIC_THEME`, `PUBLIC_THEME_SWITCHER`,
  `PUBLIC_KOFI_URL`, `PUBLIC_TELEGRAM_URL` (the support block in the calculator is hidden until set).
- Git author for this repo must be `natalyineu` with the GitHub noreply email
  (`git config --local user.name natalyineu`). Never commit with a work email.

## Current state

- Done: 5 calculators, 12 sign pages, 78 compatibility pairs, about/privacy; i18n architecture with hreflang
  sitemap; English locale complete (~100 pages); 5 visual themes with a dev switcher; scripts for translation.
- Locales present: en, es, ru, pt, de, fr (es/ru/pt/de/fr translated by hand, not yet proofread by native speakers).
- Placeholders to fill before launch: contact email in `pages.about` / `pages.privacy` of each locale.
- Not decided: final theme (owner is comparing; default is `astromatch` (matches docs/reference/astromatch-reference.html)), domain name, hosting.

## Next steps (in order)

1. Translate and enable `es`, `ru`, `pt`, `de`, `fr` (best traffic and ad RPM); verify with `check-i18n.mjs`.
2. Owner picks a theme; set it as the default, remove the switcher from production, polish that theme only.
3. Buy a domain (owner approves any spend), deploy `dist/` to Cloudflare Pages or Vercel, set `SITE_URL`.
4. Submit `/sitemap.xml` to Google Search Console; apply for AdSense once ~30 indexed pages exist.
5. Programmatic expansion (see above) and a daily-horoscope page for repeat visits.
6. Later: a Chrome extension (moon sign / sign lookup) that links back to the site. Ads cannot run inside
   extensions under Chrome Web Store / MV3 rules, so the extension is only a traffic funnel.

## Open item for the owner

The first two commits still carry a work email in the author field. Fixing it needs a history rewrite and
`git push --force` to this private repo; do it only after the owner explicitly confirms.
