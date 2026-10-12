// Language-neutral facts. All human-readable text lives in src/i18n/locales/*.json.
export const SIGN_IDS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
] as const;
export type SignId = (typeof SIGN_IDS)[number];

export type ElementId = 'fire' | 'earth' | 'air' | 'water';
export type ModalityId = 'cardinal' | 'fixed' | 'mutable';

interface Core {
  symbol: string;
  element: ElementId;
  modality: ModalityId;
  ruler: string;
  start: [number, number]; // [month, day]
  end: [number, number];
}

export const SIGN_CORE: Record<SignId, Core> = {
  aries: { symbol: '♈', element: 'fire', modality: 'cardinal', ruler: 'mars', start: [3, 21], end: [4, 19] },
  taurus: { symbol: '♉', element: 'earth', modality: 'fixed', ruler: 'venus', start: [4, 20], end: [5, 20] },
  gemini: { symbol: '♊', element: 'air', modality: 'mutable', ruler: 'mercury', start: [5, 21], end: [6, 20] },
  cancer: { symbol: '♋', element: 'water', modality: 'cardinal', ruler: 'moon', start: [6, 21], end: [7, 22] },
  leo: { symbol: '♌', element: 'fire', modality: 'fixed', ruler: 'sun', start: [7, 23], end: [8, 22] },
  virgo: { symbol: '♍', element: 'earth', modality: 'mutable', ruler: 'mercury', start: [8, 23], end: [9, 22] },
  libra: { symbol: '♎', element: 'air', modality: 'cardinal', ruler: 'venus', start: [9, 23], end: [10, 22] },
  scorpio: { symbol: '♏', element: 'water', modality: 'fixed', ruler: 'pluto', start: [10, 23], end: [11, 21] },
  sagittarius: { symbol: '♐', element: 'fire', modality: 'mutable', ruler: 'jupiter', start: [11, 22], end: [12, 21] },
  capricorn: { symbol: '♑', element: 'earth', modality: 'cardinal', ruler: 'saturn', start: [12, 22], end: [1, 19] },
  aquarius: { symbol: '♒', element: 'air', modality: 'fixed', ruler: 'uranus', start: [1, 20], end: [2, 18] },
  pisces: { symbol: '♓', element: 'water', modality: 'mutable', ruler: 'neptune', start: [2, 19], end: [3, 20] },
};

export const TOOL_IDS = ['zodiac-sign', 'moon-sign', 'compatibility', 'life-path', 'chinese-zodiac'] as const;
export type ToolId = (typeof TOOL_IDS)[number];

export const STATIC_PAGE_IDS = ['about', 'privacy'] as const;
