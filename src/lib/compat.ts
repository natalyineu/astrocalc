import { SIGN_IDS, SIGN_CORE, type SignId } from '../data/core';

const ELEMENT_BASE: Record<string, number> = {
  'fire-fire': 82, 'earth-earth': 84, 'air-air': 80, 'water-water': 86,
  'air-fire': 85, 'earth-water': 87,
  'earth-fire': 58, 'air-earth': 52, 'fire-water': 48, 'air-water': 60,
};
const pairKey = (a: string, b: string) => [a, b].sort().join('-');

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}
const clamp = (n: number) => Math.max(20, Math.min(98, Math.round(n)));

export interface Compat {
  a: SignId; b: SignId;
  overall: number; love: number; friendship: number; communication: number; trust: number;
  rating: 'excellent' | 'strong' | 'good' | 'challenging';
  elementKey: string; modalityKey: string;
}

/** Language-neutral scores; text comes from the locale files via the keys returned. */
export function compatibility(a: SignId, b: SignId): Compat {
  const [x, y] = [a, b].sort();
  const ca = SIGN_CORE[a], cb = SIGN_CORE[b];
  const elementKey = pairKey(ca.element, cb.element);
  const modalityKey = pairKey(ca.modality, cb.modality);
  let base = ELEMENT_BASE[elementKey];
  if (Math.abs(SIGN_IDS.indexOf(a) - SIGN_IDS.indexOf(b)) === 6) base += 8; // opposites attract
  if (modalityKey === 'fixed-fixed' && a !== b) base -= 3;

  const j = (salt: string, span = 7) => (hash(`${x}-${y}-${salt}`) % (span * 2 + 1)) - span;
  const has = (e: string) => ca.element === e || cb.element === e;
  const overall = clamp(base + j('overall', 4));
  return {
    a, b, overall,
    love: clamp(base + j('love') + (has('water') ? 3 : 0)),
    friendship: clamp(base + j('friend') + (has('air') ? 3 : 0)),
    communication: clamp(base + j('comm') + (ca.element === 'air' && cb.element === 'air' ? 4 : 0)),
    trust: clamp(base + j('trust') + (ca.modality === 'fixed' || cb.modality === 'fixed' ? 3 : 0)),
    rating: overall >= 85 ? 'excellent' : overall >= 72 ? 'strong' : overall >= 58 ? 'good' : 'challenging',
    elementKey, modalityKey,
  };
}
