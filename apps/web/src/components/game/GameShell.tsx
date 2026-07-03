'use client';

import { useReducer, useEffect, useCallback } from 'react';
import type { GameState, GamePiece } from '../../game/types';
import { gameReducer, type GameAction } from '../../game/reducer';
import { BoardMap } from './BoardMap';
import { DiceRoller } from './DiceRoller';
import { StoryEventModal } from './StoryEventModal';
import { CardHand } from './CardHand';
import { PlayerPanel } from './PlayerPanel';
import { VoidTrack } from './VoidTrack';
import { GameLog } from './GameLog';
import { EndGameReport } from './EndGameReport';
import { computeGameResult } from '../../game/scoring';
import { getNeighbors } from '../../game/boardMap';

interface Props {
  initialState: GameState;
  myPlayerId?: string | undefined;
  onAction?: (action: GameAction) => void;
  isOnline?: boolean | undefined;
}

export function GameShell({ initialState, myPlayerId, onAction, isOnline }: Props) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    if (JSON.stringify(initialState) !== JSON.stringify(state) && isOnline) {
      dispatch({ type: 'LOAD_STATE', state: initialState });
    }
  }, [initialState, isOnline]);

  const emit = useCallback((action: GameAction) => {
    dispatch(action);
    onAction?.(action);
  }, [onAction]);

  const activePlayer = state.players.find((p) => p.id === state.activePlayerId);
  const isMyTurn = myPlayerId ? state.activePlayerId === myPlayerId : true;
  const myPlayer = myPlayerId ? state.players.find((p) => p.id === myPlayerId) : activePlayer;

  const movePiece = state.movement;
  const currentMovingPiece = movePiece
    ? state.pieces.find((p) => p.id === movePiece.pieceId)
    : undefined;
  const movementChoices = currentMovingPiece
    ? getNeighbors(currentMovingPiece.nodeId)
    : [];

  const selectablePieces: string[] = state.phase === 'select_piece'
    ? state.pieces
        .filter((p) => p.playerId === state.activePlayerId && !p.finished)
        .map((p) => p.id)
    : [];

  const activePieceNodeIds = selectablePieces
    .map((pid) => state.pieces.find((p) => p.id === pid)?.nodeId)
    .filter((id): id is string => !!id);

  const movementNodeIds = movementChoices.map((n) => n.id);
  const highlightedNodes = state.phase === 'select_piece'
    ? activePieceNodeIds
    : state.phase === 'move'
    ? movementNodeIds
    : [];

  const handleNodeClick = (nodeId: string) => {
    if (state.phase === 'select_piece') {
      const piece = state.pieces.find((p) => p.nodeId === nodeId && p.playerId === state.activePlayerId && !p.finished);
      if (piece) emit({ type: 'SELECT_PIECE', pieceId: piece.id });
    } else if (state.phase === 'move' && movementNodeIds.includes(nodeId)) {
      emit({ type: 'MOVE_STEP', directionNodeId: nodeId });
    }
  };

  if (state.status === 'finished') {
    const result = computeGameResult(state);
    return <EndGameReport result={result} onPlayAgain={() => window.location.reload()} />;
  }

  return (
    <div className="game-shell">
      <aside className="game-sidebar-left">
        <VoidTrack pressure={state.voidPressure} bossActive={state.bossActive} bossHp={state.bossHp} />
        <PlayerPanel
          players={state.players}
          pieces={state.pieces}
          activePlayerId={state.activePlayerId}
          myPlayerId={myPlayerId}
        />
      </aside>

      <main className="game-main">
        {state.finalRound && (
          <div className="final-round-banner">★ FINÁLNÍ KOLO — posledních šance!</div>
        )}

        <BoardMap
          board={state.board}
          pieces={state.pieces}
          activeNodeIds={highlightedNodes}
          onNodeClick={isMyTurn ? handleNodeClick : undefined}
        />

        <div className="game-controls">
          <div className="game-turn-info">
            <span className="turn-label">Tah {state.turnNumber}</span>
            <span className="active-player">{activePlayer?.name ?? '?'} — {state.phase.toUpperCase()}</span>
          </div>

          {isMyTurn && state.phase === 'roll' && (
            <DiceRoller
              dice={state.dice}
              canRoll
              onRoll={() => emit({ type: 'ROLL_DICE' })}
            />
          )}

          {!isMyTurn && state.dice && (
            <DiceRoller dice={state.dice} canRoll={false} onRoll={() => {}} />
          )}

          {isMyTurn && state.phase === 'select_piece' && (
            <div className="phase-hint">Klikni na fragment, který chceš pohybovat.</div>
          )}

          {isMyTurn && state.phase === 'move' && movePiece && (
            <div className="phase-hint">
              Kroků zbývá: {movePiece.stepsRemaining} — klikni na cílové pole.
            </div>
          )}

          {isMyTurn && (state.phase === 'card' || state.phase === 'end') && (
            <button
              className="btn-end-turn"
              onClick={() => emit({ type: 'END_TURN' })}
              type="button"
            >
              UKONČIT TAH
            </button>
          )}
        </div>

        {isMyTurn && myPlayer && (
          <CardHand
            hand={myPlayer.hand}
            phase={state.phase}
            isMyTurn={isMyTurn}
            onPlayCard={(cardId) => emit({ type: 'PLAY_CARD', cardId })}
          />
        )}
      </main>

      <aside className="game-sidebar-right">
        <GameLog log={state.log} />
      </aside>

      {state.pendingEvent && isMyTurn && (
        <StoryEventModal
          event={state.pendingEvent}
          onResolve={(choiceId) => emit({ type: 'RESOLVE_EVENT', choiceId })}
        />
      )}
    </div>
  );
}
