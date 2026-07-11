export interface UiTheme {
  id: string;
  label: string;
  cost: number;
  description: string;
  palette: readonly [string, string, string];
}

export const UI_THEMES: UiTheme[] = [
  { id: 'synthoma', label: 'Synthoma', cost: 0, description: 'Chladný systémový kanál s cyanovou a magentou.', palette: ['#020306', '#00eaff', '#ff19c7'] },
  { id: 'green-matrix', label: 'Green Matrix', cost: 64, description: 'Hluboká zeleň, hustší rastr a střídmý terminálový svit.', palette: ['#010701', '#53ff61', '#d8f244'] },
  { id: 'neon-hellfire', label: 'Neon Hellfire', cost: 128, description: 'Žhavé povrchy, oranžový signál a tvrdší červené hrany.', palette: ['#0d0201', '#ff7a2f', '#ff2e16'] },
  { id: 'cyber-dystopia', label: 'Cyber Dystopia', cost: 64, description: 'Ocelové panely, přesný cyan a varovná růžová.', palette: ['#090c12', '#00c8f5', '#ff3d86'] },
  { id: 'acid-glitch', label: 'Acid Glitch', cost: 128, description: 'Fialové vrstvy, kyselá zeleň a záměrně tvrdé posuny.', palette: ['#07010f', '#59ff61', '#d64cff'] },
  { id: 'retro-arcade', label: 'Retro Arcade', cost: 256, description: 'Pixelově ostrý kontrast, cyan, magenta a žlutý marker.', palette: ['#03020d', '#00f0ff', '#ff43d1'] },
  { id: 'mono', label: 'Mono BW', cost: 128, description: 'Černobílý diagnostický režim bez neonové záře.', palette: ['#080808', '#f0f0f0', '#8f8f8f'] },
  { id: 'mono-light', label: 'Mono Light', cost: 128, description: 'Světlý laboratorní protokol s ostrými šedými linkami.', palette: ['#f7f7f5', '#111111', '#9a9a94'] },
];
