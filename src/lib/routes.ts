import { enabledLocales, getT, localeMeta } from '../i18n';
import { SIGN_IDS, TOOL_IDS, STATIC_PAGE_IDS } from '../data/core';

export interface Page {
  id: string;           // language-neutral page id, shared across locales (used for hreflang)
  view: string;         // which view component renders it
  locale: string;
  path: string;         // path below /<locale>/ ('' = locale home)
  props: Record<string, any>;
}

let pages: Page[] | undefined;
const byKey = new Map<string, Page>();

/** Every page of every enabled locale. To add a page type: add ids here + a view + locale keys. */
export function allPages(): Page[] {
  if (pages) return pages;
  const out: Page[] = [];
  for (const { code } of enabledLocales()) {
    const t = getT(code);
    const add = (id: string, view: string, path: string, props: Record<string, any> = {}) =>
      out.push({ id, view, locale: code, path, props });

    add('home', 'home', '');
    for (const tool of TOOL_IDS) add(`tool:${tool}`, `tool:${tool}`, t.tools[tool].slug);
    for (const s of SIGN_IDS) add(`sign:${s}`, 'sign', `${t.signPage.dir}/${t.signs[s].slug}`, { sign: s });
    for (let i = 0; i < SIGN_IDS.length; i++) {
      for (let j = i; j < SIGN_IDS.length; j++) {
        const a = SIGN_IDS[i], b = SIGN_IDS[j];
        add(`pair:${a}:${b}`, 'pair',
          `${t.tools.compatibility.slug}/${t.signs[a].slug}-${t.compat.connector}-${t.signs[b].slug}`, { a, b });
      }
    }
    for (const p of STATIC_PAGE_IDS) add(`page:${p}`, 'static', t.pages[p].slug, { page: p });
  }

  const seen = new Set<string>();
  for (const p of out) {
    const key = `${p.locale}/${p.path}`;
    if (seen.has(key)) throw new Error(`Duplicate URL in locale: ${key} (check slugs in locales/${p.locale}.json)`);
    seen.add(key);
    byKey.set(`${p.locale}|${p.id}`, p);
  }
  return (pages = out);
}

const toUrl = (locale: string, path: string) => `/${locale}/${path}${path ? '/' : ''}`;

/** Localized URL of a page id; falls back to the English page if the locale lacks it. */
export function pageUrl(locale: string, id: string): string {
  allPages();
  const p = byKey.get(`${locale}|${id}`) ?? byKey.get(`en|${id}`)!;
  return toUrl(p.locale, p.path);
}

export function alternates(id: string) {
  allPages();
  return enabledLocales()
    .map((l) => ({ locale: l.code, tag: l.tag, native: l.native, page: byKey.get(`${l.code}|${id}`) }))
    .filter((x) => x.page)
    .map((x) => ({ locale: x.locale, tag: x.tag, native: x.native, path: toUrl(x.locale, x.page!.path) }));
}

export { localeMeta };
