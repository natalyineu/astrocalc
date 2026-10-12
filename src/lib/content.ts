import { getT, fmt, list, localeMeta } from '../i18n';
import { SIGN_CORE, SIGN_IDS, type SignId } from '../data/core';
import { pageUrl } from './routes';

export function formatDates(locale: string, start: [number, number], end: [number, number]) {
  const f = new Intl.DateTimeFormat(localeMeta(locale).tag, { month: 'long', day: 'numeric' });
  const d = ([m, day]: [number, number]) => f.format(new Date(2024, m - 1, day));
  return `${d(start)} – ${d(end)}`;
}

export function monthNames(locale: string): string[] {
  const f = new Intl.DateTimeFormat(localeMeta(locale).tag, { month: 'long' });
  return Array.from({ length: 12 }, (_, i) => f.format(new Date(2024, i, 1)));
}

export function signInfo(locale: string, id: SignId) {
  const t = getT(locale);
  const c = SIGN_CORE[id];
  const s = t.signs[id];
  const element = t.elements[c.element] as string;
  const modality = t.modalities[c.modality] as string;
  const ruler = t.planets[c.ruler] as string;
  const dates = formatDates(locale, c.start, c.end);
  const ruledBy = fmt(t.ui.ruledBy, { ruler });
  return {
    id,
    symbol: c.symbol,
    elementId: c.element,
    name: s.name as string,
    keywords: s.keywords as string[],
    strengths: s.strengths as string[],
    challenges: s.challenges as string[],
    love: s.love as string,
    dates, element, modality, ruler, ruledBy,
    summary: fmt(t.ui.signSummary, { dates, element, modality, ruledBy }),
    url: pageUrl(locale, `sign:${id}`),
  };
}

export const allSigns = (locale: string) => SIGN_IDS.map((id) => signInfo(locale, id));
export { fmt, list, getT };
