import type { GameState } from './types';
import {
  rollDice,
  selectPiece,
  moveStep,
  resolveEvent,
  playCard,
  endTurn,
} from './engine';

export type GameAction =
  | { type: 'ROLL_DICE' }
  | { type: 'SELECT_PIECE'; pieceId: string }
  | { type: 'MOVE_STEP'; directionNodeId: string }
  | { type: 'RESOLVE_EVENT'; choiceId?: string | undefined }
  | { type: 'PLAY_CARD'; cardId: string; targetPlayerId?: string | undefined }
  | { type: 'END_TURN' }
  | { type: 'LOAD_STATE'; state: GameState };

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ROLL_DICE':
      return rollDice(state);

    case 'SELECT_PIECE':
      return selectPiece(state, action.pieceId);

    case 'MOVE_STEP':
      return moveStep(state, action.directionNodeId);

    case 'RESOLVE_EVENT':
      return resolveEvent(state, action.choiceId);

    case 'PLAY_CARD':
      return playCard(state, action.cardId, action.targetPlayerId);

    case 'END_TURN':
      return endTurn(state);

    case 'LOAD_STATE':
      return action.state;

    default:
      return state;
  }
}
