'use client';

import type { RunMap, RunMapNode, RunNodeType } from '../../../game/run/runTypes';

interface RunMapViewProps {
  map: RunMap;
  currentNodeId: string;
  onSelectNode: (nodeId: string) => void;
}

const NODE_ICONS: Record<RunNodeType, string> = {
  start: '◈',
  combat: '⚔',
  elite: '⬟',
  boss: '☠',
  event: '?',
  trap: '⚡',
  dialogue: '◉',
  market: '◫',
  rest: '♦',
  archive: '▣',
};

const NODE_LABELS: Record<RunNodeType, string> = {
  start: 'START',
  combat: 'SOUBOJ',
  elite: 'ELITE',
  boss: 'BOSS',
  event: 'EVENT',
  trap: 'PAST',
  dialogue: 'DIALOG',
  market: 'TRŽIŠTĚ',
  rest: 'ODPOČINEK',
  archive: 'ARCHIV',
};

const SVG_WIDTH = 600;
const SVG_HEIGHT = 640;

export default function RunMapView({ map, currentNodeId, onSelectNode }: RunMapViewProps) {
  const currentNode = map.nodes.find((n) => n.id === currentNodeId);

  const edges: { x1: number; y1: number; x2: number; y2: number; key: string }[] = [];
  for (const node of map.nodes) {
    for (const nextId of node.next) {
      const next = map.nodes.find((n) => n.id === nextId);
      if (next) {
        edges.push({ x1: node.x, y1: node.y, x2: next.x, y2: next.y, key: `${node.id}-${nextId}` });
      }
    }
  }

  return (
    <div className="run-map v1-panel v1-enter">
      <div className="run-map__header">
        <span className="run-map__title">MAPA PRŮCHODU</span>
        {currentNode && (
          <span className="run-map__current">
            Aktuální sektor: <strong className="v1-badge v1-badge--accent">{NODE_LABELS[currentNode.type]}</strong>
          </span>
        )}
      </div>

      <svg
        className="run-map__svg"
        viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Mapa průchodu Prázdnotou"
      >
        {edges.map((edge) => (
          <line
            key={edge.key}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            className="run-map__edge v1-map-edge"
          />
        ))}

        {map.nodes.map((node) => {
          const isCurrent = node.id === currentNodeId;
          const isVisited = node.visited;
          const isAvailable = node.available && !isCurrent;
          const isClickable = node.available;

          let nodeClass = 'run-map__node v1-map-node';
          if (isCurrent) nodeClass += ' run-map__node--current v1-map-node--current';
          else if (isVisited) nodeClass += ' run-map__node--visited';
          else if (isAvailable) nodeClass += ' run-map__node--available v1-map-node--available';
          else nodeClass += ' run-map__node--locked';
          nodeClass += ` run-map__node--${node.type}`;

          return (
            <g
              key={node.id}
              className={`${nodeClass} ${isClickable ? 'run-map__node--clickable v1-map-node--clickable' : ''}`}
              onClick={() => isClickable && onSelectNode(node.id)}
              tabIndex={isClickable ? 0 : -1}
              onKeyDown={(e) => e.key === 'Enter' && isClickable && onSelectNode(node.id)}
              aria-label={isClickable ? `Vstoupit do ${NODE_LABELS[node.type]}` : node.type}
            >
              <circle cx={node.x} cy={node.y} r={28} className="run-map__node-circle v1-map-node-circle" />
              <text
                x={node.x}
                y={node.y + 6}
                textAnchor="middle"
                className="run-map__node-icon v1-map-node-icon"
              >
                {NODE_ICONS[node.type]}
              </text>
              <text
                x={node.x}
                y={node.y + 44}
                textAnchor="middle"
                className="run-map__node-label v1-map-node-label"
              >
                {NODE_LABELS[node.type]}
              </text>
              {isClickable && (
                <circle cx={node.x} cy={node.y} r={34} className="run-map__node-pulse v1-map-node-pulse" />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
