import { LOCALES, DEFAULT_LOCALE, type LocaleMeta } from './config';

const files = import.meta.glob('./locales/*.json', { eager: true, import: 'default' }) as Record<string, any>;
const raw: Record<string, any> = {};
for (const [p, mod] of Object.entries(files)) raw[p.match(/\/([^/]+)\.json$/)![1]] = mod;

function merge(base: any, over: any): any {
  if (Array.isArray(base)) return Array.isArray(over) && over.length === base.length ? over : base;
  if (base && typeof base === 'object') {
    const out: any = {};
    for (const k of Object.keys(base)) out[k] = merge(base[k], over?.[k]);
    return out;
  }
  return typeof over === typeof base && over !== '' ? over : base;
}

const cache = new Map<string, any>();
/** Full translation tree for a locale, with English filling any gaps. */
export function getT(locale: string) {
  if (!cache.has(locale)) cache.set(locale, merge(raw[DEFAULT_LOCALE], raw[locale]));
  return cache.get(locale);
}

export const enabledLocales = (): LocaleMeta[] => LOCALES.filter((l) => raw[l.code]);
export const localeMeta = (code: string) => LOCALES.find((l) => l.code === code)!;

/** Replace {name} placeholders. */
export function fmt(tpl: string, vars: Record<string, string | number> = {}): string {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

export function list(locale: string, items: string[]): string {
  return new Intl.ListFormat(localeMeta(locale).tag, { style: 'long', type: 'conjunction' }).format(items);
}
