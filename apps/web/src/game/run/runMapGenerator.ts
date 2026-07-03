import type { RunMap, RunMapNode, RunNodeType, RunType } from './runTypes';

// ── Seeded RNG (mulberry32) ───────────────────────────────────────────────────

function mulberry32(seed: number): () => number {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedToNumber(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pickRandom<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)] as T;
}

function makeNodeId(depth: number, branch: number): string {
  return `node-d${depth}-b${branch}`;
}

// ── Fixed MVP map layout ──────────────────────────────────────────────────────
//
// Depth 0: start
// Depth 1: combat-1 | event-1 | rest-1        (3 branches)
// Depth 2: trap-1   | elite-1 | market-1       (3 branches, same indices)
// Depth 3: combat-2 | dialogue-1 | archive-1   (3 branches)
// Depth 4: (merge) elite-2                     (1 node)
// Depth 5: boss-1                              (1 node)

type NodeTemplate = { type: RunNodeType; encounterPool: string[] };

function getBranchTemplates(runType: RunType): NodeTemplate[][] {
  const baseTemplates: NodeTemplate[][] = [
    // depth 1
    [
      { type: 'combat', encounterPool: ['combat-sumovy-bezec', 'combat-archivni-chyba'] },
      { type: 'event', encounterPool: ['event-pamet', 'event-sarkasmin-terminal'] },
      { type: 'rest', encounterPool: ['rest-sektor-klidny'] },
    ],
    // depth 2
    [
      { type: 'trap', encounterPool: ['trap-skryta-past'] },
      { type: 'elite', encounterPool: ['elite-formularovy-dozorce'] },
      { type: 'market', encounterPool: ['market-relekvie'] },
    ],
    // depth 3
    [
      { type: 'combat', encounterPool: ['combat-acidova-larva', 'combat-sumovy-bezec'] },
      { type: 'dialogue', encounterPool: ['event-sarkasmin-terminal'] },
      { type: 'archive', encounterPool: ['archive-lore'] },
    ],
    // depth 4 (merge)
    [
      { type: 'elite', encounterPool: ['elite-zrcadlovy-subjekt'] },
    ],
    // depth 5 (boss)
    [
      { type: 'boss', encounterPool: ['boss-nekonecny-formular'] },
    ],
  ];

  if (runType === 'sarcastic') {
    // Swap some combat nodes for dialogue/sarcasm events
    return baseTemplates.map((depth, depthIndex) =>
      depth.map((tmpl) => {
        if (tmpl.type === 'combat') {
          return { ...tmpl, encounterPool: ['event-sarkasmin-terminal', 'combat-sumovy-bezec'] };
        }
        if (tmpl.type === 'dialogue') {
          return { ...tmpl, encounterPool: ['event-sarkasmin-terminal', 'event-pamet'] };
        }
        return tmpl;
      })
    );
  }

  if (runType === 'calm') {
    // Calm sees more rest and archive, fewer trap/elite
    return baseTemplates.map((depth) =>
      depth.map((tmpl) => {
        if (tmpl.type === 'trap') {
          return { ...tmpl, type: 'rest', encounterPool: ['rest-sektor-klidny'] };
        }
        if (tmpl.type === 'elite') {
          return { ...tmpl, encounterPool: [...tmpl.encounterPool, 'rest-sektor-klidny'] };
        }
        return tmpl;
      })
    );
  }

  if (runType === 'void_rush') {
    // More combat and elite pressure
    return baseTemplates.map((depth) =>
      depth.map((tmpl) => {
        if (tmpl.type === 'event') {
          return { ...tmpl, type: 'combat', encounterPool: ['combat-acidova-larva', 'combat-sumovy-bezec'] };
        }
        if (tmpl.type === 'rest') {
          return { ...tmpl, type: 'trap', encounterPool: ['trap-skryta-past'] };
        }
        return tmpl;
      })
    );
  }

  return baseTemplates;
}

// ── SVG layout constants ──────────────────────────────────────────────────────

const NODE_X_POSITIONS = [200, 400, 600];
const NODE_Y_BASE = 80;
const NODE_Y_STEP = 110;
const NODE_X_CENTER = 400;

// ── Generator ─────────────────────────────────────────────────────────────────

export function generateRunMap(seed: string, runType: RunType = 'standard'): RunMap {
  const rng = mulberry32(seedToNumber(seed));
  const nodes: RunMapNode[] = [];

  // Start node
  const startNode: RunMapNode = {
    id: 'node-start',
    x: NODE_X_CENTER,
    y: NODE_Y_BASE,
    depth: 0,
    type: 'start',
    encounterId: 'rest-sektor-klidny',
    next: [],
    visited: false,
    available: true,
  };
  nodes.push(startNode);

  let prevDepthIds: string[] = ['node-start'];
  const branchTemplates = getBranchTemplates(runType);

  for (let depth = 1; depth <= branchTemplates.length; depth++) {
    const templates = branchTemplates[depth - 1]!;
    const isMergeDepth = templates.length === 1;
    const currentDepthIds: string[] = [];

    const xPositions = isMergeDepth
      ? [NODE_X_CENTER]
      : NODE_X_POSITIONS.slice(0, templates.length);

    for (let b = 0; b < templates.length; b++) {
      const tmpl = templates[b]!;
      const encounterId = pickRandom(tmpl.encounterPool, rng);
      const nodeId = isMergeDepth ? `node-d${depth}` : makeNodeId(depth, b);

      const node: RunMapNode = {
        id: nodeId,
        x: xPositions[b] ?? NODE_X_CENTER,
        y: NODE_Y_BASE + depth * NODE_Y_STEP,
        depth,
        type: tmpl.type,
        encounterId,
        next: [],
        visited: false,
        available: false,
      };

      nodes.push(node);
      currentDepthIds.push(nodeId);
    }

    // Wire edges: depth 1 → each branch connects to start; depth 4 → all depth-3 branches connect to elite-2
    if (depth === 1) {
      const startN = nodes.find((n) => n.id === 'node-start')!;
      startN.next = [...currentDepthIds];
    } else if (isMergeDepth) {
      // all prev nodes point to this single merge node
      for (const prevId of prevDepthIds) {
        const prevNode = nodes.find((n) => n.id === prevId)!;
        prevNode.next = [currentDepthIds[0]!];
      }
    } else {
      // same-index branch connections (each depth-N branch connects to same-index depth-N+1)
      for (let b = 0; b < prevDepthIds.length; b++) {
        const prevId = prevDepthIds[b];
        if (!prevId) continue;
        const prevNode = nodes.find((n) => n.id === prevId)!;
        // connect to same branch + adjacent (creates choices)
        const targets: string[] = [currentDepthIds[b]!];
        if (b > 0 && currentDepthIds[b - 1]) targets.unshift(currentDepthIds[b - 1]!);
        prevNode.next = [...new Set(targets)];
      }
    }

    prevDepthIds = currentDepthIds;
  }

  return { nodes, seed };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getAvailableNodes(map: RunMap, currentNodeId: string): RunMapNode[] {
  const current = map.nodes.find((n) => n.id === currentNodeId);
  if (!current) return [];
  return map.nodes.filter((n) => current.next.includes(n.id));
}

export function markVisited(map: RunMap, nodeId: string): RunMap {
  return {
    ...map,
    nodes: map.nodes.map((n) => {
      if (n.id === nodeId) return { ...n, visited: true, available: false };
      return n;
    }),
  };
}

export function markAvailable(map: RunMap, nodeIds: string[]): RunMap {
  return {
    ...map,
    nodes: map.nodes.map((n) => ({
      ...n,
      available: nodeIds.includes(n.id),
    })),
  };
}
