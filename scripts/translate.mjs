// Usage: ANTHROPIC_API_KEY=... node scripts/translate.mjs <code> [--force]
// Translates every key missing from src/i18n/locales/<code>.json using the English source.
// Re-run any time you add keys to en.json: only missing keys are sent.
import { readLocale, writeLocale, flatten, unflatten, placeholders, isSlugKey, slugOk } from './lib.mjs';
import { LOCALES } from '../src/i18n/config.ts';

const code = process.argv[2];
const force = process.argv.includes('--force');
const meta = LOCALES.find((l) => l.code === code);
if (!meta || code === 'en') { console.error('Usage: translate.mjs <locale code from src/i18n/config.ts, not en>'); process.exit(1); }
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) { console.error('Set ANTHROPIC_API_KEY'); process.exit(1); }
const MODEL = process.env.TRANSLATE_MODEL || 'claude-sonnet-5-5';

const enTree = readLocale('en');
const en = flatten(enTree);
const existing = flatten(readLocale(code) || {});
const todo = Object.keys(en).filter((k) => force || !existing[k]);
console.log(`${meta.name}: ${todo.length} of ${Object.keys(en).length} keys to translate`);

const SYSTEM = `You translate UI text and SEO copy for an astrology-calculator website from English into ${meta.name} (${meta.tag}).
Rules:
- Return ONLY a JSON object mapping each given key to its translation. No commentary.
- Keep placeholders like {name}, {a}, {score} exactly unchanged. Word order may change.
- Natural, idiomatic, SEO-friendly wording as a native speaker would search for it. Use the term native speakers actually use for "zodiac sign", "moon sign", "compatibility", "life path number".
- Keys ending in ".slug", or equal to "signPage.dir" or "compat.connector" are URL slugs: output lowercase ASCII only (a-z, 0-9, single hyphens), transliterating/romanizing if needed, no spaces.
- Keep symbols such as "·", "→", "←", "–", "%" and "°".
- Do not translate the site name "AstroCalc".`;

async function ask(batch) {
  const body = {
    model: MODEL, max_tokens: 8000, system: SYSTEM,
    messages: [{ role: 'user', content: JSON.stringify(Object.fromEntries(batch.map((k) => [k, en[k]]))) }],
  };
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify(body),
    });
    if (!res.ok) { console.error(`API ${res.status}: ${await res.text()}`); continue; }
    const text = (await res.json()).content.map((c) => c.text || '').join('');
    try { return JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1)); }
    catch { console.error('Unparseable response, retrying'); }
  }
  throw new Error('Translation batch failed');
}

const out = { ...existing };
const BATCH = 40;
for (let i = 0; i < todo.length; i += BATCH) {
  const batch = todo.slice(i, i + BATCH);
  const got = await ask(batch);
  for (const k of batch) {
    const v = got[k];
    if (typeof v !== 'string' || !v) { console.warn('missing', k); continue; }
    if (placeholders(v) !== placeholders(en[k])) { console.warn('placeholder mismatch, skipped', k); continue; }
    if (isSlugKey(k) && !slugOk(v)) { console.warn('bad slug, skipped', k, v); continue; }
    out[k] = v;
  }
  console.log(`  ${Math.min(i + BATCH, todo.length)}/${todo.length}`);
}
writeLocale(code, unflatten(out, enTree));
console.log(`Wrote src/i18n/locales/${code}.json. Run: node scripts/check-i18n.mjs`);
