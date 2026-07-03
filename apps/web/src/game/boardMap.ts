import type { BoardNode, BoardEdge, BoardGraph } from './types';

export const BOARD_NODES: BoardNode[] = [
  { id: 'start',       x: 80,  y: 300, type: 'start',    label: 'START',           next: ['safe-1', 'glitch-1'] },
  { id: 'safe-1',      x: 190, y: 220, type: 'safe',     label: 'Klid',            next: ['noise-1'] },
  { id: 'noise-1',     x: 300, y: 160, type: 'noise',    label: 'Šumová mina',     next: ['safe-2', 'trap-1'] },
  { id: 'safe-2',      x: 420, y: 120, type: 'safe',     label: 'Prázdná mříž',   next: ['portal-a'] },
  { id: 'portal-a',    x: 540, y: 100, type: 'portal',   label: 'Portál A',        next: ['market-1'], portalPair: 'portal-a2' },
  { id: 'market-1',    x: 660, y: 120, type: 'market',   label: 'Tržiště',         next: ['noise-2'] },
  { id: 'noise-2',     x: 760, y: 180, type: 'noise',    label: 'Šumová mina',     next: ['trap-2', 'safe-3'] },
  { id: 'safe-3',      x: 860, y: 240, type: 'safe',     label: 'Výpadek',         next: ['archive-1'] },
  { id: 'archive-1',   x: 920, y: 300, type: 'archive',  label: 'Archiv',          next: ['trap-3'] },
  { id: 'trap-2',      x: 840, y: 350, type: 'trap',     label: 'Audit',           next: ['safe-4'] },
  { id: 'safe-4',      x: 760, y: 420, type: 'safe',     label: 'Buffer',          next: ['sarkasma-1', 'shortcut-1'] },
  { id: 'sarkasma-1',  x: 660, y: 460, type: 'sarkasma', label: 'Sarkasmin terminál', next: ['noise-3'] },
  { id: 'noise-3',     x: 560, y: 500, type: 'noise',    label: 'Šumová mina',     next: ['trap-4'] },
  { id: 'trap-4',      x: 450, y: 520, type: 'trap',     label: 'Paměťová smyčka', next: ['portal-b'] },
  { id: 'portal-b',    x: 340, y: 500, type: 'portal',   label: 'Portál B',        next: ['market-2'], portalPair: 'portal-b2' },
  { id: 'market-2',    x: 230, y: 460, type: 'market',   label: 'Vadné relikvie',  next: ['trap-5'] },
  { id: 'trap-5',      x: 140, y: 420, type: 'trap',     label: 'Formulář 47c',    next: ['glitch-2', 'safe-1'] },
  { id: 'trap-1',      x: 300, y: 280, type: 'trap',     label: 'Kult acidové žluti', next: ['safe-2'] },
  { id: 'trap-3',      x: 840, y: 140, type: 'trap',     label: 'Falešný checkpoint', next: ['safe-3', 'noise-2'] },
  { id: 'glitch-1',    x: 190, y: 380, type: 'glitch',   label: 'Glitch zkratka',  next: ['safe-4'], shortcutTo: 'safe-4' },
  { id: 'glitch-2',    x: 220, y: 320, type: 'glitch',   label: 'Glitch zkratka',  next: ['sarkasma-1'], shortcutTo: 'sarkasma-1' },
  { id: 'glitch-3',    x: 700, y: 300, type: 'glitch',   label: 'Glitch zkratka',  next: ['boss'], shortcutTo: 'boss' },
  { id: 'shortcut-1',  x: 700, y: 360, type: 'shortcut', label: 'Nelegální zkratka', next: ['noise-3', 'glitch-3'] },
  { id: 'shortcut-2',  x: 500, y: 300, type: 'shortcut', label: 'Podezřelá cesta', next: ['archive-1', 'trap-2'] },
  { id: 'portal-a2',   x: 540, y: 400, type: 'portal',   label: 'Portál A\'',      next: ['shortcut-2'], portalPair: 'portal-a' },
  { id: 'portal-b2',   x: 400, y: 200, type: 'portal',   label: 'Portál B\'',      next: ['noise-1', 'trap-1'], portalPair: 'portal-b' },
  { id: 'portal-c',    x: 620, y: 280, type: 'portal',   label: 'Portál C',        next: ['noise-4'], portalPair: 'portal-c2' },
  { id: 'portal-c2',   x: 380, y: 340, type: 'portal',   label: 'Portál C\'',      next: ['trap-5'], portalPair: 'portal-c' },
  { id: 'noise-4',     x: 720, y: 120, type: 'noise',    label: 'Šumová mina',     next: ['trap-3', 'safe-3'] },
  { id: 'safe-5',      x: 500, y: 220, type: 'safe',     label: 'Uzel identity',   next: ['portal-c', 'shortcut-2'] },
  { id: 'safe-6',      x: 460, y: 380, type: 'safe',     label: 'Checkpoint',      next: ['portal-c2', 'noise-3'] },
  { id: 'boss',        x: 860, y: 480, type: 'boss',     label: 'Nekonečný Formulář', next: ['finish'] },
  { id: 'finish',      x: 920, y: 520, type: 'finish',   label: 'JÁDRO',           next: [] },
  { id: 'trap-a',      x: 600, y: 200, type: 'trap',     label: 'Admin v pátek',   next: ['safe-5', 'noise-4'] },
  { id: 'trap-b',      x: 440, y: 440, type: 'trap',     label: 'Nekonečná fronta', next: ['safe-6', 'portal-b'] },
  { id: 'trap-c',      x: 320, y: 400, type: 'trap',     label: 'Panika systému',  next: ['market-2', 'glitch-2'] },
];

function makeEdges(nodes: BoardNode[]): BoardEdge[] {
  const edges: BoardEdge[] = [];
  const seen = new Set<string>();

  for (const node of nodes) {
    for (const nextId of node.next) {
      const edgeKey = [node.id, nextId].sort().join('--');
      if (seen.has(edgeKey)) continue;
      seen.add(edgeKey);

      let kind: BoardEdge['kind'] = 'normal';
      if (node.type === 'shortcut' || node.type === 'glitch') kind = 'shortcut';
      if (node.type === 'portal') kind = 'portal';

      edges.push({ id: `${node.id}->${nextId}`, from: node.id, to: nextId, kind });
    }
  }

  for (const node of nodes) {
    if (node.portalPair) {
      const edgeKey = [node.id, node.portalPair].sort().join('--');
      if (!seen.has(edgeKey)) {
        seen.add(edgeKey);
        edges.push({ id: `portal:${node.id}<->${node.portalPair}`, from: node.id, to: node.portalPair, kind: 'portal' });
      }
    }
  }

  return edges;
}

export const BOARD_EDGES: BoardEdge[] = makeEdges(BOARD_NODES);

export const BOARD: BoardGraph = {
  nodes: BOARD_NODES,
  edges: BOARD_EDGES,
};

export function getNode(id: string): BoardNode | undefined {
  return BOARD_NODES.find((n) => n.id === id);
}

export function getNeighbors(id: string): BoardNode[] {
  const node = getNode(id);
  if (!node) return [];
  return node.next.map((nid) => getNode(nid)).filter((n): n is BoardNode => !!n);
}

export function getPortalTarget(id: string): BoardNode | undefined {
  const node = getNode(id);
  if (!node?.portalPair) return undefined;
  return getNode(node.portalPair);
}

export function getBoardEdges(): BoardEdge[] {
  return BOARD_EDGES;
}

export const START_NODE_ID = 'start';
export const FINISH_NODE_ID = 'finish';
export const BOSS_NODE_ID = 'boss';
