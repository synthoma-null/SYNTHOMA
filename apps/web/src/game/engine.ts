import type {
  GameState,
  GamePiece,
  GamePlayer,
  StoryEffect,
  CardEffect,
  GameLogEntry,
  GameLogEntryType,
} from './types';
import { rollD6FromSeed, advanceSeed, pickRandom, shuffleArray } from './dice';
import { getNode, getNeighbors, getPortalTarget, FINISH_NODE_ID, BOSS_NODE_ID } from './boardMap';
import { pickStoryEvent } from './storyEvents';
import { getTrapById } from './traps';
import { getCardById } from './cards';
import {
  VOID_PRESSURE_MAX,
  VOID_PRESSURE_PER_TURN,
  VOID_GLOBAL_EVENT_EVERY_N_TURNS,
  BOSS_HP,
  BOSS_TURNS_TO_DEFEAT,
  MAX_HAND_SIZE,
  DRAW_ON_TURN_START,
} from './constants';

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeid(): string {
  return Math.random().toString(36).slice(2, 9);
}

function addLog(
  state: GameState,
  type: GameLogEntryType,
  message: string,
  playerId?: string,
): GameState {
  const entry: GameLogEntry = {
    id: makeid(),
    turn: state.turnNumber,
    ...(playerId !== undefined ? { playerId } : {}),
    type,
    message,
    ts: Date.now(),
  };
  return { ...state, log: [...state.log.slice(-99), entry] };
}

function updatePlayer(state: GameState, playerId: string, updates: Partial<GamePlayer>): GameState {
  return {
    ...state,
    players: state.players.map((p) => (p.id === playerId ? { ...p, ...updates } : p)),
  };
}

function updatePiece(state: GameState, pieceId: string, updates: Partial<GamePiece>): GameState {
  return {
    ...state,
    pieces: state.pieces.map((p) => (p.id === pieceId ? { ...p, ...updates } : p)),
  };
}

function getActivePlayer(state: GameState): GamePlayer | undefined {
  return state.players.find((p) => p.id === state.activePlayerId);
}

function getPiecesOf(state: GameState, playerId: string): GamePiece[] {
  return state.pieces.filter((p) => p.playerId === playerId && !p.finished);
}

// ── Effect applicator ────────────────────────────────────────────────────────

export function applyStoryEffect(
  state: GameState,
  effect: StoryEffect | CardEffect,
  targetPlayerId: string,
  targetPieceId?: string,
): GameState {
  let s = state;

  switch (effect.kind) {
    case 'gain_resource': {
      const p = s.players.find((x) => x.id === targetPlayerId);
      if (!p) break;
      s = updatePlayer(s, targetPlayerId, {
        resources: { ...p.resources, [effect.resource]: Math.max(0, p.resources[effect.resource] + effect.amount) },
      });
      break;
    }
    case 'lose_resource': {
      const p = s.players.find((x) => x.id === targetPlayerId);
      if (!p) break;
      s = updatePlayer(s, targetPlayerId, {
        resources: { ...p.resources, [effect.resource]: Math.max(0, p.resources[effect.resource] - effect.amount) },
      });
      break;
    }
    case 'move_to': {
      if (targetPieceId) {
        s = updatePiece(s, targetPieceId, { nodeId: effect.nodeId });
      }
      break;
    }
    case 'move_steps': {
      if (targetPieceId && s.movement) {
        s = { ...s, movement: { ...s.movement, stepsRemaining: s.movement.stepsRemaining + effect.steps } };
      }
      break;
    }
    case 'move_back': {
      if (targetPieceId) {
        const piece = s.pieces.find((p) => p.id === targetPieceId);
        if (piece) {
          const visited = s.movement?.visitedNodeIds ?? [];
          const backIdx = Math.max(0, visited.length - 1 - effect.steps);
          const backNodeId = visited[backIdx] ?? piece.nodeId;
          s = updatePiece(s, targetPieceId, { nodeId: backNodeId });
        }
      }
      break;
    }
    case 'draw_cards': {
      const player = s.players.find((x) => x.id === targetPlayerId);
      if (!player) break;
      const available = s.deck.slice(0, effect.amount);
      const remaining = s.deck.slice(effect.amount);
      const newHand = [...player.hand, ...available].slice(0, MAX_HAND_SIZE);
      s = updatePlayer(s, targetPlayerId, { hand: newHand });
      s = { ...s, deck: remaining };
      break;
    }
    case 'discard_card': {
      const player = s.players.find((x) => x.id === targetPlayerId);
      if (!player || player.hand.length === 0) break;
      const discarded = player.hand.slice(0, effect.amount);
      s = updatePlayer(s, targetPlayerId, { hand: player.hand.slice(effect.amount) });
      s = { ...s, discard: [...s.discard, ...discarded] };
      break;
    }
    case 'skip_turn': {
      const player = s.players.find((x) => x.id === targetPlayerId);
      if (player) {
        s = updatePlayer(s, targetPlayerId, { status: 'active' });
        s = addLog(s, 'system', `${player.name} přeskočí ${effect.turns} tah(y).`);
      }
      break;
    }
    case 'global_void': {
      const newPressure = Math.max(0, Math.min(VOID_PRESSURE_MAX, s.voidPressure + effect.amount));
      s = { ...s, voidPressure: newPressure };
      if (effect.amount > 0) s = addLog(s, 'void', `Prázdnota roste o ${effect.amount}. Tlak: ${newPressure}/${VOID_PRESSURE_MAX}`);
      if (effect.amount < 0) s = addLog(s, 'void', `Prázdnota snížena o ${Math.abs(effect.amount)}. Tlak: ${newPressure}/${VOID_PRESSURE_MAX}`);
      break;
    }
    case 'swap_positions': {
      const targets = s.players.filter((p) => p.id !== targetPlayerId && p.status === 'active');
      if (targets.length === 0) break;
      const { item: targetPlayer, nextSeed } = pickRandom(targets, s.rngState.toString());
      s = { ...s, rngState: parseInt(nextSeed.split(':').pop() ?? '0', 10) || s.rngState + 1 };
      const myPieces = getPiecesOf(s, targetPlayerId).map((p) => p.id);
      const theirPieces = getPiecesOf(s, targetPlayer.id).map((p) => p.id);
      const myNodes = myPieces.map((id) => s.pieces.find((p) => p.id === id)?.nodeId ?? 'start');
      const theirNodes = theirPieces.map((id) => s.pieces.find((p) => p.id === id)?.nodeId ?? 'start');
      s = { ...s, pieces: s.pieces.map((piece) => {
        const myIdx = myPieces.indexOf(piece.id);
        const theirIdx = theirPieces.indexOf(piece.id);
        if (myIdx >= 0 && theirNodes[myIdx]) return { ...piece, nodeId: theirNodes[myIdx]! };
        if (theirIdx >= 0 && myNodes[theirIdx]) return { ...piece, nodeId: myNodes[theirIdx]! };
        return piece;
      })};
      s = addLog(s, 'card', `Výměna pozic: ${getActivePlayer(s)?.name ?? '?'} ↔ ${targetPlayer.name}`);
      break;
    }
    case 'steal_laugh': {
      const victim = s.players.find((p) => p.id !== targetPlayerId && p.status === 'active');
      if (!victim) break;
      const stolen = Math.min(effect.amount, victim.resources.laugh);
      s = updatePlayer(s, victim.id, { resources: { ...victim.resources, laugh: victim.resources.laugh - stolen } });
      const thief = s.players.find((p) => p.id === targetPlayerId);
      if (thief) s = updatePlayer(s, targetPlayerId, { resources: { ...thief.resources, laugh: thief.resources.laugh + stolen } });
      break;
    }
    case 'pass_card_left': {
      const activePlayers = s.players.filter((p) => p.status === 'active');
      if (activePlayers.length < 2) break;
      const newPlayers = activePlayers.map((player, i) => {
        const leftIdx = (i + activePlayers.length - 1) % activePlayers.length;
        const leftPlayer = activePlayers[leftIdx]!;
        const cardToPass = player.hand[0];
        const received = leftPlayer.hand[0];
        return {
          ...player,
          hand: cardToPass
            ? [cardToPass, ...player.hand.slice(1).filter((c) => c !== received)]
            : player.hand,
        };
      });
      s = { ...s, players: s.players.map((p) => newPlayers.find((np) => np.id === p.id) ?? p) };
      break;
    }
    case 'pass_noise': {
      const activePlayer = s.players.find((p) => p.id === targetPlayerId);
      if (!activePlayer) break;
      const targets2 = s.players.filter((p) => p.id !== targetPlayerId && p.status === 'active');
      if (targets2.length === 0) break;
      const { item: target2 } = pickRandom(targets2, s.rngState.toString());
      const noiseToPass = activePlayer.resources.noise;
      s = updatePlayer(s, targetPlayerId, { resources: { ...activePlayer.resources, noise: 0 } });
      const victim2 = s.players.find((p) => p.id === target2.id);
      if (victim2) s = updatePlayer(s, target2.id, { resources: { ...victim2.resources, noise: victim2.resources.noise + noiseToPass } });
      break;
    }
    case 'cancel_event': {
      const { pendingEvent: _pe, ...sWithoutEvent } = s;
  s = sWithoutEvent as GameState;
      break;
    }
    case 'cancel_trap': {
      if (targetPieceId) {
        const piece = s.pieces.find((p) => p.id === targetPieceId);
        if (piece) {
          const node = getNode(piece.nodeId);
          if (node?.trapId) {
            s = {
              ...s,
              board: {
                ...s.board,
                nodes: s.board.nodes.map((n) => {
                  if (n.id !== piece.nodeId) return n;
                  const { trapId: _t, ...rest } = n;
                  return rest as typeof n;
                }),
              },
            };
          }
        }
      }
      break;
    }
    case 'place_trap': {
      break;
    }
    case 'send_to_start': {
      if (targetPieceId) s = updatePiece(s, targetPieceId, { nodeId: 'start' });
      break;
    }
    case 'reroll_dice': {
      const { dice: _dr, ...sNoDiceR } = s;
      s = sNoDiceR as GameState;
      break;
    }
    case 'trigger_trap': {
      break;
    }
    case 'roll_table': {
      break;
    }
    case 'custom': {
      break;
    }
    default:
      break;
  }

  return s;
}

// ── Phase: ROLL ──────────────────────────────────────────────────────────────

export function rollDice(state: GameState): GameState {
  if (state.phase !== 'roll') return state;
  const { result, nextSeed } = rollD6FromSeed(state.rngState.toString());
  const newRngState = parseInt(nextSeed.split(':').pop() ?? '1', 10) || state.rngState + 1;
  let s: GameState = {
    ...state,
    dice: { value: result, rolledAt: Date.now() },
    rngState: newRngState,
    phase: 'select_piece',
  };
  const player = getActivePlayer(s);
  s = addLog(s, 'roll', `${player?.name ?? '?'} hodil ${result}.`, state.activePlayerId);
  return s;
}

// ── Phase: SELECT_PIECE ──────────────────────────────────────────────────────

export function selectPiece(state: GameState, pieceId: string): GameState {
  if (state.phase !== 'select_piece') return state;
  if (!state.dice) return state;

  const piece = state.pieces.find((p) => p.id === pieceId);
  if (!piece || piece.playerId !== state.activePlayerId || piece.finished) return state;

  return {
    ...state,
    phase: 'move',
    movement: {
      pieceId,
      stepsRemaining: state.dice.value,
      visitedNodeIds: [piece.nodeId],
    },
  };
}

// ── Phase: MOVE (step by step) ───────────────────────────────────────────────

export function moveStep(state: GameState, directionNodeId: string): GameState {
  if (state.phase !== 'move' || !state.movement) return state;

  const { pieceId, stepsRemaining, visitedNodeIds } = state.movement;
  const piece = state.pieces.find((p) => p.id === pieceId);
  if (!piece) return state;

  const currentNode = getNode(piece.nodeId);
  if (!currentNode) return state;

  const neighbors = getNeighbors(piece.nodeId);
  const target = neighbors.find((n) => n.id === directionNodeId);
  if (!target) return state;

  let s = updatePiece(state, pieceId, { nodeId: directionNodeId });
  const newVisited = [...visitedNodeIds, directionNodeId];
  const newSteps = stepsRemaining - 1;

  // Portal teleport
  if (target.type === 'portal') {
    const portalDest = getPortalTarget(directionNodeId);
    if (portalDest) {
      s = updatePiece(s, pieceId, { nodeId: portalDest.id });
      s = addLog(s, 'move', `Fragment vstoupil do portálu → ${portalDest.label}`, state.activePlayerId);
    }
  }

  // Finish node
  if (directionNodeId === FINISH_NODE_ID || target.type === 'finish') {
    s = updatePiece(s, pieceId, { finished: true, nodeId: FINISH_NODE_ID });
    const player = s.players.find((p) => p.id === piece.playerId);
    const player2 = { ...player!, resources: { ...player!.resources, fragments: player!.resources.fragments + 1 } };
    s = updatePlayer(s, piece.playerId, player2);
    s = addLog(s, 'move', `${player?.name ?? '?'} dostal fragment do Jádra!`, piece.playerId);
    const { movement: _mv1, ...sNoMv1 } = s;
    s = { ...sNoMv1, phase: 'end' as const };
    s = checkWinLose(s);
    return s;
  }

  if (newSteps <= 0) {
    const { movement: _mv2, ...sNoMv2 } = s;
    s = sNoMv2 as GameState;
    s = resolveNodeEntry(s, pieceId);
    return s;
  }

  // Auto-advance if only one path
  const updatedPiece = s.pieces.find((p) => p.id === pieceId)!;
  const nextNeighbors = getNeighbors(updatedPiece.nodeId);
  s = { ...s, movement: { pieceId, stepsRemaining: newSteps, visitedNodeIds: newVisited } };

  if (nextNeighbors.length === 1) {
    return moveStep(s, nextNeighbors[0]!.id);
  }

  return s;
}

// ── Resolve node entry ───────────────────────────────────────────────────────

export function resolveNodeEntry(state: GameState, pieceId: string): GameState {
  const piece = state.pieces.find((p) => p.id === pieceId);
  if (!piece) return { ...state, phase: 'end' };

  const currentNodeDef = state.board.nodes.find((n) => n.id === piece.nodeId);
  if (!currentNodeDef) return { ...state, phase: 'end' };

  let s = state;

  // Check for trap
  if (currentNodeDef.trapId) {
    const trap = getTrapById(currentNodeDef.trapId);
    if (trap) {
      s = addLog(s, 'trap', `Past: ${trap.name}!`, piece.playerId);
      s = applyStoryEffect(s, trap.triggerEffect, piece.playerId, pieceId);
      s = { ...s, board: { ...s.board, nodes: s.board.nodes.map((n) => {
        if (n.id !== piece.nodeId) return n;
        const { trapId: _t3, ...rest3 } = n;
        return rest3 as typeof n;
      }) } };
      s = { ...s, phase: 'end' };
      return s;
    }
  }

  // Boss node
  if (currentNodeDef.type === 'boss' || piece.nodeId === BOSS_NODE_ID) {
    s = addLog(s, 'boss', 'Fragment vstoupil k Nekonečnému Formuláři!', piece.playerId);
    const { event: bossEvent, nextSeed } = pickStoryEvent('boss', s.rngState.toString());
    s = { ...s, rngState: parseInt(nextSeed.split(':').pop() ?? '0', 10) || s.rngState + 1 };
    if (bossEvent) {
      s = { ...s, pendingEvent: { event: bossEvent, pieceId, nodeId: piece.nodeId }, phase: 'event' };
      return s;
    }
    s = { ...s, phase: 'end' };
    return s;
  }

  // Pick story event for node type
  if (currentNodeDef.type !== 'safe' && currentNodeDef.type !== 'start') {
    const { event, nextSeed } = pickStoryEvent(currentNodeDef.type, s.rngState.toString());
    s = { ...s, rngState: parseInt(nextSeed.split(':').pop() ?? '0', 10) || s.rngState + 1 };
    if (event) {
      s = { ...s, pendingEvent: { event, pieceId, nodeId: piece.nodeId }, phase: 'event' };
      return s;
    }
  }

  return { ...s, phase: 'card' };
}

// ── Phase: EVENT ─────────────────────────────────────────────────────────────

export function resolveEvent(state: GameState, choiceId?: string): GameState {
  if (state.phase !== 'event' || !state.pendingEvent) return state;

  const { event, pieceId } = state.pendingEvent;
  const player = getActivePlayer(state);
  if (!player) return state;

  let s = state;
  s = addLog(s, 'event', `${event.logLabel}: ${event.title}`, player.id);

  let effectToApply = event.effect;

  if (choiceId && event.choices) {
    const choice = event.choices.find((c) => c.id === choiceId);
    if (choice) {
      effectToApply = choice.effect;
      if (choice.profileDelta) {
        const newProfile = { ...player.profile };
        for (const [key, val] of Object.entries(choice.profileDelta)) {
          (newProfile as Record<string, number>)[key] = ((newProfile as Record<string, number>)[key] ?? 0) + (val ?? 0);
        }
        s = updatePlayer(s, player.id, { profile: newProfile });
      }
    }
  }

  if (event.profileDelta && !choiceId) {
    const newProfile = { ...player.profile };
    for (const [key, val] of Object.entries(event.profileDelta)) {
      (newProfile as Record<string, number>)[key] = ((newProfile as Record<string, number>)[key] ?? 0) + (val ?? 0);
    }
    s = updatePlayer(s, player.id, { profile: newProfile });
  }

  s = applyStoryEffect(s, effectToApply, player.id, pieceId);
  const { pendingEvent: _pev, ...sNoPe } = s;
  s = { ...sNoPe, phase: 'card' as const };

  return s;
}

// ── Phase: CARD ──────────────────────────────────────────────────────────────

export function playCard(state: GameState, cardId: string, targetPlayerId?: string): GameState {
  const player = getActivePlayer(state);
  if (!player) return state;
  if (!player.hand.includes(cardId)) return state;

  const card = getCardById(cardId);
  if (!card) return state;

  let s = state;
  const newHand = player.hand.filter((id) => id !== cardId);
  s = updatePlayer(s, player.id, { hand: newHand });
  s = { ...s, discard: [...s.discard, cardId] };

  const resolvedTargetId = targetPlayerId ?? player.id;
  s = applyStoryEffect(s, card.effect, resolvedTargetId);
  s = addLog(s, 'card', `${player.name} zahrál: "${card.title}"`, player.id);

  if (card.type === 'sabotage') {
    s = updatePlayer(s, player.id, { sabotageCount: player.sabotageCount + 1 });
  }

  return s;
}

// ── Phase: END TURN ──────────────────────────────────────────────────────────

export function endTurn(state: GameState): GameState {
  if (state.phase !== 'card' && state.phase !== 'end') return state;

  let s = state;

  // Void pressure rises each turn
  const newPressure = Math.min(VOID_PRESSURE_MAX, s.voidPressure + VOID_PRESSURE_PER_TURN);
  s = { ...s, voidPressure: newPressure };

  // Draw a card for next turn
  const player = getActivePlayer(s);
  if (player && player.hand.length < MAX_HAND_SIZE && s.deck.length > 0) {
    const drawn = s.deck.slice(0, DRAW_ON_TURN_START);
    s = { ...s, deck: s.deck.slice(DRAW_ON_TURN_START) };
    s = updatePlayer(s, player.id, { hand: [...player.hand, ...drawn] });
  }

  // Next active player
  const activePlayers = s.players.filter((p) => p.status === 'active');
  const currentIdx = activePlayers.findIndex((p) => p.id === s.activePlayerId);
  const nextIdx = (currentIdx + 1) % activePlayers.length;
  const nextPlayer = activePlayers[nextIdx];
  if (!nextPlayer) return s;

  const newTurnNumber = s.turnNumber + 1;
  const { dice: _d2, ...sNoDice2 } = s;
  s = { ...sNoDice2, activePlayerId: nextPlayer.id, turnNumber: newTurnNumber, phase: 'roll' as const };

  // Global void event every N turns
  if (newTurnNumber % VOID_GLOBAL_EVENT_EVERY_N_TURNS === 0) {
    s = applyGlobalVoidEvent(s);
  }

  // Final round tracking
  if (s.finalRound) {
    const remaining = s.finalRound.remainingPlayerIds.filter((id) => id !== player?.id);
    if (remaining.length === 0) {
      s = { ...s, status: 'finished' };
      s = addLog(s, 'system', 'Finální kolo skončilo. Konec hry!');
      return s;
    }
    s = { ...s, finalRound: { ...s.finalRound, remainingPlayerIds: remaining } };
  }

  // Boss timer
  if (s.bossActive && s.bossTurnsLeft !== undefined) {
    const newBossTurns = s.bossTurnsLeft - 1;
    if (newBossTurns <= 0) {
      s = { ...s, status: 'finished', bossActive: false };
      s = addLog(s, 'boss', 'Nekonečný Formulář zvítězil. Systém padá.');
      return s;
    }
    s = { ...s, bossTurnsLeft: newBossTurns };
  }

  s = addLog(s, 'system', `Tah ${newTurnNumber}: ${nextPlayer.name} je na řadě.`);
  return s;
}

// ── Check win/lose ────────────────────────────────────────────────────────────

export function checkWinLose(state: GameState): GameState {
  let s = state;

  // Void collapse → trigger boss
  if (s.voidPressure >= VOID_PRESSURE_MAX && !s.bossActive && s.status === 'playing') {
    s = { ...s, bossActive: true, bossHp: BOSS_HP, bossTurnsLeft: BOSS_TURNS_TO_DEFEAT };
    s = addLog(s, 'boss', 'Prázdnota dosáhla maxima! Nekonečný Formulář se zhmotnil!');
    return s;
  }

  // Check for first player who finished all 3 pieces
  for (const player of s.players) {
    const pieces = s.pieces.filter((p) => p.playerId === player.id);
    const allFinished = pieces.every((p) => p.finished);
    if (allFinished && !s.finalRound && s.status === 'playing') {
      const others = s.players.filter((p) => p.id !== player.id && p.status === 'active').map((p) => p.id);
      s = { ...s, finalRound: { triggeredByPlayerId: player.id, remainingPlayerIds: others } };
      s = addLog(s, 'final_round', `${player.name} dostál všechny fragmenty do Jádra! Spouští se FINÁLNÍ KOLO!`);
      if (others.length === 0) {
        s = { ...s, status: 'finished' };
      }
      return s;
    }
  }

  return s;
}

// ── Global void event ────────────────────────────────────────────────────────

export function applyGlobalVoidEvent(state: GameState): GameState {
  const { event, nextSeed } = pickStoryEvent('void_global', state.rngState.toString());
  let s = { ...state, rngState: parseInt(nextSeed.split(':').pop() ?? '0', 10) || state.rngState + 1 };
  if (!event) return s;

  s = addLog(s, 'void', `GLOBÁLNÍ EVENT: ${event.logLabel}`);

  // Apply global effect to all players
  const activePlayers = s.players.filter((p) => p.status === 'active');
  for (const player of activePlayers) {
    s = applyStoryEffect(s, event.effect, player.id);
  }

  return s;
}

// ── Deck reshuffle ────────────────────────────────────────────────────────────

export function reshuffleDeck(state: GameState): GameState {
  if (state.deck.length > 5) return state;
  const { shuffled, nextSeed } = shuffleArray(state.discard, state.rngState.toString());
  return {
    ...state,
    deck: [...state.deck, ...shuffled],
    discard: [],
    rngState: parseInt(nextSeed.split(':').pop() ?? '0', 10) || state.rngState + 1,
  };
}
