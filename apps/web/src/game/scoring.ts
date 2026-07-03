import type { GameState, GameResult, PlayerResult } from './types';
import { computeGameArchetype, buildShareText } from './profile';

export function computeOtisk(
  fragmentsFinished: number,
  laugh: number,
  noise: number,
  profileScore: number,
): number {
  return fragmentsFinished * 10 + laugh * 3 - noise * 2 + profileScore;
}

function profileScore(profile: import('./types').GameProfileVector): number {
  return (
    profile.courage * 2 +
    profile.tenderness * 2 +
    profile.cooperation * 3 +
    profile.dominance +
    profile.sarcasm +
    profile.chaos -
    profile.caution
  );
}

export function computeGameResult(state: GameState): GameResult {
  const playerResults: PlayerResult[] = state.players.map((player) => {
    const finishedPieces = state.pieces.filter((p) => p.playerId === player.id && p.finished);
    const fragmentsFinished = finishedPieces.length;
    const ps = profileScore(player.profile);
    const otisk = computeOtisk(fragmentsFinished, player.resources.laugh, player.resources.noise, ps);
    const archetype = computeGameArchetype(player.profile);
    const shareText = buildShareText(player, archetype, fragmentsFinished, player.sabotageCount, player.auditsSurvived);

    return {
      playerId: player.id,
      name: player.name,
      color: player.color,
      otisk,
      fragmentsFinished,
      noise: player.resources.noise,
      laugh: player.resources.laugh,
      sabotageCount: player.sabotageCount,
      auditsSurvived: player.auditsSurvived,
      archetype: archetype.title,
      shareText,
      profile: player.profile,
    };
  }).sort((a, b) => b.otisk - a.otisk);

  const won = state.status === 'finished' && !state.bossActive;
  const winnerId = playerResults[0]?.playerId;

  let reason: GameResult['reason'] = 'fragments';
  if (state.bossActive && state.bossTurnsLeft === 0) reason = 'boss_victory';
  else if (state.voidPressure >= 20 && !state.bossActive) reason = 'void_collapse';
  else if (state.finalRound) reason = 'fragments';

  return {
    won,
    reason,
    players: playerResults,
    voidPressure: state.voidPressure,
    turnsPlayed: state.turnNumber,
    ...(winnerId !== undefined ? { winnerId } : {}),
  };
}
