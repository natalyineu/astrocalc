import * as Astronomy from 'astronomy-engine';
import { SIGN_IDS, SIGN_CORE, type SignId } from '../data/core';

/** Western (tropical) sun sign from month (1-12) and day. */
export function sunSign(month: number, day: number): SignId {
  const key = month * 100 + day;
  for (const id of SIGN_IDS) {
    const { start, end } = SIGN_CORE[id];
    const s = start[0] * 100 + start[1];
    const e = end[0] * 100 + end[1];
    if (s <= e ? key >= s && key <= e : key >= s || key <= e) return id;
  }
  return 'aries';
}

/** Moon sign for an instant (tropical zodiac, true ecliptic of date). */
export function moonSign(date: Date): { id: SignId; degrees: number } {
  const lon = ((Astronomy.EclipticGeoMoon(date).lon % 360) + 360) % 360;
  return { id: SIGN_IDS[Math.floor(lon / 30)], degrees: lon % 30 };
}

/** UTC Date from a local wall-clock time and a UTC offset in hours (e.g. -5, 5.5). */
export function dateFromLocal(y: number, mo: number, d: number, h: number, mi: number, utcOffsetHours: number): Date {
  return new Date(Date.UTC(y, mo - 1, d, h, mi) - utcOffsetHours * 3600_000);
}

function reduce(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) n = String(n).split('').reduce((a, c) => a + Number(c), 0);
  return n;
}
export const lifePathNumber = (y: number, m: number, d: number) => reduce(reduce(y) + reduce(m) + reduce(d));

/** Lunar New Year = the new moon between Jan 21 and Feb 20 (China time, UTC+8). */
export function lunarNewYear(year: number): { month: number; day: number } {
  const nm = Astronomy.SearchMoonPhase(0, new Date(Date.UTC(year, 0, 20, 16)), 35)!;
  const local = new Date(nm.date.getTime() + 8 * 3600_000);
  return { month: local.getUTCMonth() + 1, day: local.getUTCDate() };
}

/** Indices into the 12 animals and 5 elements arrays of the locale files. */
export function chineseZodiac(year: number, month: number, day: number) {
  const lny = lunarNewYear(year);
  const before = month < lny.month || (month === lny.month && day < lny.day);
  const y = before ? year - 1 : year;
  return {
    animal: (((y - 4) % 12) + 12) % 12,
    element: Math.floor(((((y - 4) % 10) + 10) % 10) / 2),
    chineseYear: y,
    beforeNewYear: before,
  };
}
