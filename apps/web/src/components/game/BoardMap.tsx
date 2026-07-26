'use client';

import type { BoardGraph, BoardNode, BoardEdge, GamePiece } from '../../game/types';

interface Props {
  board: BoardGraph;
  pieces: GamePiece[];
  activeNodeIds?: string[] | undefined;
  onNodeClick?: ((nodeId: string) => void) | undefined;
}

const NODE_TYPE_COLOR: Record<string, string> = {
  start: '#00b6f1',
  safe: '#1a2233',
  noise: '#ff4fa0',
  trap: '#ff3300',
  portal: '#7b2fff',
  market: '#ffe600',
  archive: '#00aaff',
  glitch: '#00ff88',
  sarkasma: '#ff7700',
  shortcut: '#aaffee',
  boss: '#ff0055',
  finish: '#ffffff',
};

const NODE_TYPE_ICON: Record<string, string> = {
  start: '◈',
  safe: '○',
  noise: '⚡',
  trap: '⚠',
  portal: '⊛',
  market: '◆',
  archive: '▣',
  glitch: '∿',
  sarkasma: '◉',
  shortcut: '→',
  boss: '☠',
  finish: '★',
};

function PieceMarker({ piece, x, y, idx }: { piece: GamePiece; x: number; y: number; idx: number }) {
  const colors: Record<string, string> = {
    memory: '#00b6f1',
    laugh: '#ffe600',
    choice: '#ff4fa0',
  };
  const size = 10;
  const offset = idx * 14 - 21;
  return (
    <g>
      <circle
        cx={x + offset}
        cy={y + 22}
        r={size / 2 + 1}
        fill="rgba(0,0,0,0.6)"
      />
      <circle
        cx={x + offset}
        cy={y + 22}
        r={size / 2}
        fill={colors[piece.kind] ?? '#fff'}
        opacity={piece.finished ? 0.3 : 1}
      />
    </g>
  );
}

function NodeTile({ node, isActive, onClick, pieces }: {
  node: BoardNode;
  isActive: boolean;
  onClick?: (() => void) | undefined;
  pieces: GamePiece[];
}) {
  const color = NODE_TYPE_COLOR[node.type] ?? '#888';
  const icon = NODE_TYPE_ICON[node.type] ?? '?';
  const hasTrap = !!node.trapId;

  return (
    <g
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      role="button"
      aria-label={node.label}
    >
      <circle
        cx={node.x}
        cy={node.y}
        r={18}
        fill={isActive ? 'rgba(0,255,224,0.15)' : 'rgba(10,14,26,0.9)'}
        stroke={isActive ? '#00b6f1' : color}
        strokeWidth={isActive ? 2.5 : 1.5}
        strokeDasharray={hasTrap ? '3 2' : undefined}
      />
      <text
        x={node.x}
        y={node.y + 5}
        textAnchor="middle"
        fontSize={14}
        fill={color}
        fontFamily="monospace"
        style={{ pointerEvents: 'none', userSelect: 'none' }}
      >
        {icon}
      </text>
      {hasTrap && (
        <text x={node.x + 12} y={node.y - 10} fontSize={8} fill="#ff3300" fontFamily="monospace">
          {node.trapVisible ? '⚠' : '?'}
        </text>
      )}
      {pieces.map((piece, i) => (
        <PieceMarker key={piece.id} piece={piece} x={node.x} y={node.y} idx={i} />
      ))}
    </g>
  );
}

export function BoardMap({ board, pieces, activeNodeIds = [], onNodeClick }: Props) {
  const { nodes, edges } = board;

  const edgePath = (edge: BoardEdge): string => {
    const from = nodes.find((n) => n.id === edge.from);
    const to = nodes.find((n) => n.id === edge.to);
    if (!from || !to) return '';
    return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
  };

  const edgeColor = (kind: BoardEdge['kind']): string => {
    if (kind === 'portal') return '#7b2fff';
    if (kind === 'shortcut') return '#00ff88';
    return '#1e2d45';
  };

  const piecesByNode = new Map<string, GamePiece[]>();
  for (const piece of pieces) {
    if (!piece.finished) {
      if (!piecesByNode.has(piece.nodeId)) piecesByNode.set(piece.nodeId, []);
      piecesByNode.get(piece.nodeId)!.push(piece);
    }
  }

  return (
    <div className="board-map-container">
      <svg
        viewBox="0 0 1000 620"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto', maxHeight: '600px' }}
      >
        <rect width="1000" height="620" fill="#080c16" rx="12" />

        {/* Edges */}
        {edges.map((edge) => (
          <path
            key={edge.id}
            d={edgePath(edge)}
            stroke={edgeColor(edge.kind)}
            strokeWidth={edge.kind === 'portal' ? 1.5 : 1}
            strokeDasharray={edge.kind === 'portal' ? '4 3' : edge.kind === 'shortcut' ? '6 2' : undefined}
            fill="none"
            opacity={0.6}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node) => (
          <NodeTile
            key={node.id}
            node={node}
            isActive={activeNodeIds.includes(node.id)}
            onClick={activeNodeIds.includes(node.id) && onNodeClick ? () => onNodeClick(node.id) : undefined}
            pieces={piecesByNode.get(node.id) ?? []}
          />
        ))}

        {/* Legend */}
        <g transform="translate(840, 20)">
          {Object.entries(NODE_TYPE_ICON).map(([type, icon], i) => (
            <g key={type} transform={`translate(0, ${i * 18})`}>
              <text x={0} y={0} fontSize={11} fill={NODE_TYPE_COLOR[type] ?? '#888'} fontFamily="monospace">
                {icon} {type}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
