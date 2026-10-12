// Usage: node scripts/check-i18n.mjs
// Reports translation coverage, placeholder mismatches and invalid slugs per locale.
import fs from 'node:fs';
import { LOCALES_DIR, readLocale, flatten, placeholders, isSlugKey, slugOk } from './lib.mjs';

const en = flatten(readLocale('en'));
const codes = fs.readdirSync(LOCALES_DIR).map((f) => f.replace('.json', '')).filter((c) => c !== 'en');
let bad = false;

for (const code of codes) {
  const flat = flatten(readLocale(code));
  const missing = Object.keys(en).filter((k) => !(k in flat) || flat[k] === '');
  const issues = [];
  for (const [k, v] of Object.entries(flat)) {
    if (!(k in en)) { issues.push(`unknown key ${k}`); continue; }
    if (placeholders(v) !== placeholders(en[k])) issues.push(`placeholder mismatch ${k}`);
    if (isSlugKey(k) && !slugOk(v)) issues.push(`bad slug ${k}="${v}"`);
  }
  const pct = (100 * (1 - missing.length / Object.keys(en).length)).toFixed(1);
  console.log(`${code}: ${pct}% translated, ${missing.length} missing, ${issues.length} issues`);
  issues.slice(0, 10).forEach((i) => console.log('   -', i));
  if (issues.length) bad = true;
}
process.exit(bad ? 1 : 0);
