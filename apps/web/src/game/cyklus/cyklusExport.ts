import type { CyklusRunState, StatKey, CyklusChoiceRecord, ProfileResult } from './cyklusTypes';
import { STAT_LABELS, SECTOR_LABELS } from './cyklusTypes';
import { CYKLUS_CARDS, CYKLUS_ITEMS, CYKLUS_IMPRINTS } from './content';
import { SUBJECT_UPGRADES, SUBJECT_SCARS, type RunReward } from './cyklusProgression';
import { formatDelta } from './cyklusFormat';
import { computeProfile } from './cyklusProfile';
import { computeEnding, analyzeDeath } from './cyklusEnding';
import { composeBehavioralAnalysis } from './cyklusSummary';
import { generateRunCodename } from './cyklusSummary';

function formatProfileLabel(profile: ProfileResult): string {
  const label = profile.dominantLabel;
  return label.endsWith('-like') ? label : `${label}-like`;
}

export interface NearestExtreme {
  stat: StatKey;
  value: number;
  direction: 'low' | 'high';
  distance: number;
}

export function getNearestExtreme(stats: CyklusRunState['stats']): NearestExtreme | null {
  let nearest: NearestExtreme | null = null;
  for (const key of Object.keys(stats) as StatKey[]) {
    const v = stats[key];
    const distLow = v;
    const distHigh = 100 - v;
    const dist = Math.min(distLow, distHigh);
    const direction: 'low' | 'high' = distLow <= distHigh ? 'low' : 'high';
    if (!nearest || dist < nearest.distance) {
      nearest = { stat: key, value: v, direction, distance: dist };
    }
  }
  return nearest;
}

function findKeyMoment(state: CyklusRunState): string | null {
  const records = state.history;
  if (records.length === 0) return null;
  const combo = records.find((r) => r.flagsGained.some((f) => f.startsWith('combo_')));
  if (combo) {
    const card = CYKLUS_CARDS[combo.cardId];
    return `${card?.title ?? combo.cardId} spustila neobvyklou kombinaci.`;
  }
  const crisis = records.filter((r) => {
    const card = CYKLUS_CARDS[r.cardId];
    return card?.category === 'crisis';
  });
  const crisisRecord = crisis[0];
  if (crisisRecord) {
    const card = CYKLUS_CARDS[crisisRecord.cardId];
    return `${card?.title ?? crisisRecord.cardId} přivedla run do krizového bodu.`;
  }
  const maxDelta = records
    .map((r) => ({ record: r, totalDelta: Object.values(r.statDelta).reduce((a, b) => a + Math.abs(b), 0) }))
    .sort((a, b) => b.totalDelta - a.totalDelta)[0];
  if (maxDelta && maxDelta.totalDelta > 0) {
    const card = CYKLUS_CARDS[maxDelta.record.cardId];
    return `${card?.title ?? maxDelta.record.cardId} způsobila největší statový posun.`;
  }
  return null;
}

function findRiskiestChoice(state: CyklusRunState): string | null {
  const records = state.history;
  if (records.length === 0) return null;
  let riskiest: { record: CyklusChoiceRecord; risk: number } | null = null;
  for (const r of records) {
    const card = CYKLUS_CARDS[r.cardId];
    if (!card) continue;
    const risk = Object.entries(r.statDelta).reduce((sum, [k, v]) => {
      const stat = k as StatKey;
      const after = r.statsAfter[stat];
      const pushedToExtreme = (after > 70 && v > 0) || (after < 30 && v < 0);
      return sum + (pushedToExtreme ? Math.abs(v) * 2 : 0);
    }, 0);
    if (risk > 0 && (!riskiest || risk > riskiest.risk)) {
      riskiest = { record: r, risk };
    }
  }
  if (!riskiest) return null;
  const card = CYKLUS_CARDS[riskiest.record.cardId];
  return `${card?.title ?? riskiest.record.cardId} (${riskiest.record.direction === 'yes' ? 'přijetí' : 'odmítnutí'}) tě nejvíc přiblížilo hranici.`;
}

function findStabilizingAnchor(state: CyklusRunState): string | null {
  const records = state.history;
  if (records.length === 0) return null;
  const stabilizing = records
    .map((r) => {
      const card = CYKLUS_CARDS[r.cardId];
      const stabilization = Object.entries(r.statDelta).reduce((sum, [k, v]) => {
        const key = k as StatKey;
        const after = r.statsAfter[key] ?? 0;
        const before = after - v;
        const beforeDist = Math.abs(before - 50);
        const afterDist = Math.abs(after - 50);
        return sum + (afterDist < beforeDist ? Math.abs(v) : 0);
      }, 0);
      return { record: r, stabilization, card };
    })
    .sort((a, b) => b.stabilization - a.stabilization)[0];
  if (stabilizing && stabilizing.stabilization > 0) {
    return `${stabilizing.card?.title ?? stabilizing.record.cardId} přitáhla staty zpátky k rovnováze.`;
  }
  return null;
}

export function exportRunLog(state: CyklusRunState, mode: 'short' | 'full' = 'full', reward?: RunReward): string {
  const profile = computeProfile(state);
  const ending = computeEnding(state);
  const death = analyzeDeath(state);
  const codename = generateRunCodename(state);
  const sectors = [...new Set(state.visitedSectors)].map((s) => SECTOR_LABELS[s]).join(' → ');
  const near = getNearestExtreme(state.stats);
  const profileLabel = formatProfileLabel(profile);

  if (mode === 'short') {
    const lines: string[] = [
      'SYNTHOMA: CYKLUS',
      `Kódové označení: ${codename}`,
      '────────────────────────────────────',
      `Konec: ${ending?.title ?? 'neznámý'}`,
      `Profil: ${profileLabel} · ${profile.archetype}`,
      `Trasa: ${sectors}`,
    ];
    if (death) {
      lines.push(`Příčina: ${STAT_LABELS[death.stat]} ${death.extreme === 'high' ? '(přetlak)' : '(krize)'}`);
    }
    if (near) {
      lines.push(`Nejbližší hrozba: ${STAT_LABELS[near.stat]} ${near.value} (vzdálenost ${near.distance})`);
    }
    if (ending?.text) lines.push('', ending.text);
    lines.push('', '────────────────────────────────────');
    lines.push('Záznam vygenerován systémem SYNTHOMA.');
    return lines.join('\n');
  }

  const lines: string[] = [
    'SYNTHOMA: CYKLUS',
    `Kódové označení: ${codename}`,
    '────────────────────────────────────',
    `Seed: ${state.seed ?? 'neznámý'}`,
    `Cykly: ${state.cycle}`,
    `Celkem voleb: ${state.totalChoices}`,
    '',
    `Konec: ${ending?.title ?? 'neznámý'}`,
    `Profil: ${profileLabel}`,
    `Archetyp: ${profile.archetype}`,
    '',
    'Staty při konci:',
    `  Energie:  ${state.stats.energy}`,
    `  Paměť:    ${state.stats.memory}`,
    `  Vazba:    ${state.stats.bond}`,
    `  Kontrola: ${state.stats.control}`,
    '',
    `Trasa: ${sectors}`,
    '',
  ];

  if (state.inventory.length > 0) {
    lines.push('Inventář:');
    for (const id of state.inventory) lines.push(`  · ${CYKLUS_ITEMS[id]?.title ?? id}`);
    lines.push('');
  }

  if (state.imprints.length > 0) {
    lines.push('Otisky:');
    for (const id of state.imprints) lines.push(`  · ${CYKLUS_IMPRINTS[id]?.title ?? id}`);
    lines.push('');
  }

  if (death?.topContributors.length) {
    lines.push(`Primární příčina: ${STAT_LABELS[death.stat]} ${death.extreme === 'high' ? '(přetlak)' : '(krize)'}`);
    lines.push('Nejvíce přispěly:');
    for (const c of death.topContributors) {
      const card = CYKLUS_CARDS[c.cardId];
      lines.push(`  ${card?.title ?? c.cardId}  ${formatDelta(c.delta)}`);
    }
    lines.push('');
  }

  if (near) {
    lines.push(`Největší hrozba příštího cyklu: ${STAT_LABELS[near.stat]} ${near.value} (vzdálenost ${near.distance})`);
    lines.push('');
  }

  if (state.goals && state.goals.length > 0) {
    const completed = state.goals.filter((g) => g.completed);
    if (completed.length > 0) {
      lines.push('Splněné cíle:');
      for (const g of completed) lines.push(`  · ${g.title}${g.rewardTitle ? ` · ${g.rewardTitle}` : ''}`);
      lines.push('');
    }
  }

  if (reward) {
    const residuum = reward.currencies.residuum ?? 0;
    const special = Object.entries(reward.currencies)
      .filter(([k, v]) => k !== 'residuum' && v > 0)
      .map(([k, v]) => `${k}: +${v}`);
    if (residuum > 0 || special.length > 0) {
      lines.push('Odměny:');
      if (residuum > 0) lines.push(`  · Reziduum: +${residuum}`);
      for (const s of special) lines.push(`  · ${s}`);
      if (reward.unlockedUpgrades.length > 0) {
        lines.push('  Nové protokoly:');
        for (const id of reward.unlockedUpgrades) lines.push(`    · ${SUBJECT_UPGRADES[id]?.title ?? id}`);
      }
      if (reward.unlockedScars.length > 0) {
        lines.push('  Nové jizvy:');
        for (const id of reward.unlockedScars) lines.push(`    · ${SUBJECT_SCARS[id]?.title ?? id}`);
      }
      if (Object.keys(reward.craftingMaterials).length > 0) {
        lines.push('  Suroviny:');
        for (const [id, amount] of Object.entries(reward.craftingMaterials)) {
          if (amount && amount > 0) lines.push(`    · ${id}: +${amount}`);
        }
      }
      if (reward.unlockedRecipes.length > 0) {
        lines.push('  Odemčené recepty:');
        for (const id of reward.unlockedRecipes) lines.push(`    · ${id}`);
      }
      if (Object.keys(reward.profileMastery).length > 0) {
        lines.push('  Profilový posun:');
        for (const [key, value] of Object.entries(reward.profileMastery)) {
          if (value) lines.push(`    · ${key}: ${formatDelta(value)}`);
        }
      }
      if (reward.voidRoomHints.length > 0) {
        lines.push('  Prázdnota doporučuje:');
        for (const id of reward.voidRoomHints) lines.push(`    · ${id}`);
      }
      if (reward.recommendedActions.length > 0) {
        lines.push('  Další kroky:');
        for (const a of reward.recommendedActions) lines.push(`    · ${a}`);
      }
      lines.push('');
    }
  }

  const keyMoment = findKeyMoment(state);
  if (keyMoment) {
    lines.push('Klíčový moment:');
    lines.push(`  · ${keyMoment}`);
    lines.push('');
  }

  const riskiest = findRiskiestChoice(state);
  if (riskiest) {
    lines.push('Nejnebezpečnější rozhodnutí:');
    lines.push(`  · ${riskiest}`);
    lines.push('');
  }

  const anchor = findStabilizingAnchor(state);
  if (anchor) {
    lines.push('Stabilizační kotva:');
    lines.push(`  · ${anchor}`);
    lines.push('');
  }

  const behavior = composeBehavioralAnalysis(state);
  if (behavior.length > 0) {
    lines.push('Styl průchodu:');
    for (const b of behavior) lines.push(`  · ${b}`);
    lines.push('');
  }

  if (state.cycleSummaries && state.cycleSummaries.length > 0) {
    lines.push('Souhrny cyklů:');
    for (const s of state.cycleSummaries) lines.push(`  ${s}`);
    lines.push('');
  }

  if (ending?.text) {
    lines.push('Systémový komentář:');
    lines.push(ending.text);
    lines.push('');
  }

  lines.push('────────────────────────────────────');
  lines.push('Záznam vygenerován systémem SYNTHOMA.');

  return lines.join('\n');
}
