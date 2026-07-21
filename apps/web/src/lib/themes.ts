export interface UiTheme {
  id: string;
  name: { cs: string; en: string };
  cost: number;
  premium: boolean;
  description: { cs: string; en: string };
  palette: readonly [string, string, string];
}

export const UI_THEMES: UiTheme[] = [
  { id: 'synthoma', name: { cs: 'Synthoma', en: 'Synthoma' }, cost: 0, premium: false, description: { cs: 'Chladný systémový kanál s cyanovou a magentou.', en: 'A cold system channel in cyan and magenta.' }, palette: ['#020306', '#00eaff', '#ff19c7'] },
  { id: 'green-matrix', name: { cs: 'Green Matrix', en: 'Green Matrix' }, cost: 0, premium: false, description: { cs: 'Hluboká zeleň, hustší rastr a střídmý terminálový svit.', en: 'Deep green, a denser grid and restrained terminal glow.' }, palette: ['#010701', '#53ff61', '#d8f244'] },
  { id: 'neon-hellfire', name: { cs: 'Neon Hellfire', en: 'Neon Hellfire' }, cost: 0, premium: false, description: { cs: 'Žhavé povrchy, oranžový signál a tvrdší červené hrany.', en: 'Hot surfaces, an orange signal and harder red edges.' }, palette: ['#0d0201', '#ff7a2f', '#ff2e16'] },
  { id: 'cyber-dystopia', name: { cs: 'Cyber Dystopia', en: 'Cyber Dystopia' }, cost: 0, premium: false, description: { cs: 'Ocelové panely, přesný cyan a varovná růžová.', en: 'Steel panels, precise cyan and warning pink.' }, palette: ['#090c12', '#00c8f5', '#ff3d86'] },
  { id: 'acid-glitch', name: { cs: 'Acid Glitch', en: 'Acid Glitch' }, cost: 0, premium: false, description: { cs: 'Fialové vrstvy, kyselá zeleň a záměrně tvrdé posuny.', en: 'Purple layers, acid green and deliberately hard shifts.' }, palette: ['#07010f', '#59ff61', '#d64cff'] },
  { id: 'retro-arcade', name: { cs: 'Retro Arcade', en: 'Retro Arcade' }, cost: 256, premium: true, description: { cs: 'Pixelově ostrý kontrast, cyan, magenta a žlutý marker.', en: 'Pixel-sharp contrast, cyan, magenta and a yellow marker.' }, palette: ['#03020d', '#00f0ff', '#ff43d1'] },
  { id: 'mono', name: { cs: 'Mono BW', en: 'Mono BW' }, cost: 0, premium: false, description: { cs: 'Černobílý diagnostický režim bez neonové záře.', en: 'A black-and-white diagnostic mode without neon glow.' }, palette: ['#080808', '#f0f0f0', '#8f8f8f'] },
  { id: 'mono-light', name: { cs: 'Mono Light', en: 'Mono Light' }, cost: 0, premium: false, description: { cs: 'Světlý laboratorní protokol s ostrými šedými linkami.', en: 'A bright laboratory protocol with crisp grey lines.' }, palette: ['#f7f7f5', '#111111', '#9a9a94'] },
];

export function isThemeUnlocked(theme: UiTheme, hasEntitlement = false): boolean {
  return !theme.premium || hasEntitlement;
}
