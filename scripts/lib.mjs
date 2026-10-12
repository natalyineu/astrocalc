import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const LOCALES_DIR = path.join(ROOT, 'src/i18n/locales');

export const readLocale = (code) => {
  const f = path.join(LOCALES_DIR, `${code}.json`);
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
};
export const writeLocale = (code, obj) =>
  fs.writeFileSync(path.join(LOCALES_DIR, `${code}.json`), JSON.stringify(obj, null, 2) + '\n');

/** Flatten to { 'a.b.0.c': 'string' } (only string leaves). */
export function flatten(obj, prefix = '', out = {}) {
  if (typeof obj === 'string') out[prefix] = obj;
  else if (Array.isArray(obj)) obj.forEach((v, i) => flatten(v, prefix ? `${prefix}.${i}` : String(i), out));
  else if (obj && typeof obj === 'object')
    for (const [k, v] of Object.entries(obj)) flatten(v, prefix ? `${prefix}.${k}` : k, out);
  return out;
}

/** Inverse of flatten, using `shape` (the English tree) to decide arrays vs objects. */
export function unflatten(flat, shape, prefix = '') {
  if (typeof shape === 'string') return flat[prefix];
  if (Array.isArray(shape)) return shape.map((v, i) => unflatten(flat, v, prefix ? `${prefix}.${i}` : String(i)));
  const out = {};
  for (const [k, v] of Object.entries(shape)) out[k] = unflatten(flat, v, prefix ? `${prefix}.${k}` : k);
  return out;
}

export const placeholders = (s) => (s.match(/\{\w+\}/g) || []).sort().join(',');

/** Keys whose value is a URL slug: must be lowercase ASCII, digits and hyphens. */
export const isSlugKey = (k) => /(^|\.)slug$/.test(k) || k === 'signPage.dir' || k === 'compat.connector';
export const slugOk = (s) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s);
