import type { CyklusRunState, CyklusRunSummary, ProfileKey, ProfileResult, SectorId, StatKey } from './cyklusTypes';
import { CYKLUS_IMPRINTS, CYKLUS_ITEMS } from './content';

export function computeBaselineProfileFromHistory(history: CyklusRunSummary[]): Partial<Record<ProfileKey, number>> {
  if (history.length === 0) return {};
  const weights = history.slice(-5).map((_, i, arr) => (i + 1) / arr.length); // newer runs weigh more
  const weightedSum: Partial<Record<ProfileKey, number>> = {};
  let totalWeight = 0;
  history.slice(-5).forEach((summary, i) => {
    const weight = weights[i] ?? 1;
    totalWeight += weight;
    for (const [key, value] of Object.entries(summary.profile ?? {})) {
      const k = key as ProfileKey;
      weightedSum[k] = (weightedSum[k] ?? 0) + value * weight;
    }
  });
  if (totalWeight === 0) return {};
  const result: Partial<Record<ProfileKey, number>> = {};
  for (const [key, value] of Object.entries(weightedSum)) {
    const k = key as ProfileKey;
    result[k] = value / totalWeight;
  }
  return result;
}

function pickAxis(a: string, b: string, av: number, bv: number): string {
  const diff = av - bv;
  if (Math.abs(diff) <= 1) return 'x';
  return diff > 0 ? a : b;
}

function resolveFallbackArchetype(
  state: CyklusRunState,
  type: string,
  dominant: ProfileKey,
): string {
  const stats = state.stats;
  const maxStat = (Object.entries(stats) as [StatKey, number][]).sort((a, b) => b[1] - a[1])[0]?.[0];
  const minStat = (Object.entries(stats) as [StatKey, number][]).sort((a, b) => a[1] - b[1])[0]?.[0];
  const extremeStat = maxStat && stats[maxStat] >= 85 ? maxStat : minStat && stats[minStat] <= 15 ? minStat : undefined;

  const sectorCounts: Record<string, number> = {};
  for (const sector of state.visitedSectors) {
    sectorCounts[sector] = (sectorCounts[sector] ?? 0) + 1;
  }
  const topSector = (Object.entries(sectorCounts) as [SectorId, number][]).sort((a, b) => b[1] - a[1])[0]?.[0];
  const sectorVariety = Object.keys(sectorCounts).length;

  const itemTags = new Set(state.inventory.flatMap((id) => CYKLUS_ITEMS[id]?.tags ?? []));
  const imprintTags = new Set(state.imprints.flatMap((id) => CYKLUS_IMPRINTS[id]?.tags ?? []));
  const hasItemOrImprint = (tag: string) => itemTags.has(tag) || imprintTags.has(tag);
  const hasItem = (id: string) => state.inventory.includes(id);
  const hasImprint = (id: string) => state.imprints.includes(id);

  const cleanType = type.replace(/x/g, '');
  const firstTwo = cleanType.slice(0, 2);
  const firstLetter = cleanType[0];

  // Dominant function + stat / sector combinations
  if ((dominant === 'Ni' || dominant === 'Si') && (extremeStat === 'memory' || topSector === 'archive')) {
    return 'Archivní potápěč';
  }
  if ((dominant === 'Te' || dominant === 'Ti') && (extremeStat === 'control' || topSector === 'form_office')) {
    return 'Kontrolní mučedník';
  }
  if ((dominant === 'Se' || firstLetter === 'E') && (extremeStat === 'energy' || topSector === 'acid_yellow')) {
    return 'Přehřátý operátor';
  }
  if ((dominant === 'Fi' || dominant === 'Fe') && (extremeStat === 'bond' || topSector === 'residuum')) {
    return 'Nositel cizího ticha';
  }
  if ((dominant === 'Ne' || dominant === 'Ti') && (topSector === 'mirror' || hasItemOrImprint('noise'))) {
    return 'Lovec vzoru';
  }
  if ((topSector === 'void' && sectorVariety >= 3) || sectorVariety >= 5) {
    return 'Sběrač špatných dveří';
  }
  if (hasItemOrImprint('glitchka') || hasItemOrImprint('glitch') || hasImprint('glitchka_sits_next_to_you')) {
    return 'Měkký glitch v lidském kabátě';
  }
  if (topSector === 'form_office' || hasItem('blank_form') || hasItem('rubber_stamp')) {
    return 'Prázdnotní úředník';
  }

  return 'Neklasifikovatelný subjekt';
}

export function computeProfile(state: CyklusRunState): ProfileResult {
  const p = state.profile;
  const eiPick = pickAxis('E', 'I', p.E ?? 0, p.I ?? 0);
  const snPick = pickAxis('S', 'N', p.S ?? 0, p.N ?? 0);
  const tfPick = pickAxis('T', 'F', p.T ?? 0, p.F ?? 0);
  const jpPick = pickAxis('J', 'P', p.J ?? 0, p.P ?? 0);
  const type = `${eiPick}${snPick}${tfPick}${jpPick}`;
  const uncertainAxis = [
    eiPick === 'x' ? 'E/I' : null,
    snPick === 'x' ? 'S/N' : null,
    tfPick === 'x' ? 'T/F' : null,
    jpPick === 'x' ? 'J/P' : null,
  ].filter(Boolean).join(', ') || undefined;

  const functions: { key: ProfileKey; score: number }[] = [
    { key: 'Ni' as ProfileKey, score: p.Ni ?? 0 }, { key: 'Ne' as ProfileKey, score: p.Ne ?? 0 },
    { key: 'Si' as ProfileKey, score: p.Si ?? 0 }, { key: 'Se' as ProfileKey, score: p.Se ?? 0 },
    { key: 'Ti' as ProfileKey, score: p.Ti ?? 0 }, { key: 'Te' as ProfileKey, score: p.Te ?? 0 },
    { key: 'Fi' as ProfileKey, score: p.Fi ?? 0 }, { key: 'Fe' as ProfileKey, score: p.Fe ?? 0 },
  ].sort((a, b) => b.score - a.score);
  const dominant = functions[0]?.key ?? 'Ni';
  const shadow = functions[functions.length - 1]?.key ?? 'Se';

  // profileConfidence: how decisive are all 4 axes (0–100)
  const axisDiffs = [
    Math.abs((p.E ?? 0) - (p.I ?? 0)),
    Math.abs((p.S ?? 0) - (p.N ?? 0)),
    Math.abs((p.T ?? 0) - (p.F ?? 0)),
    Math.abs((p.J ?? 0) - (p.P ?? 0)),
  ];
  const totalAxisPoints =
    (p.E ?? 0) + (p.I ?? 0) + (p.S ?? 0) + (p.N ?? 0) +
    (p.T ?? 0) + (p.F ?? 0) + (p.J ?? 0) + (p.P ?? 0);
  const profileConfidence = totalAxisPoints <= 0
    ? 0
    : Math.min(100, Math.round((axisDiffs.reduce((a, b) => a + b, 0) / totalAxisPoints) * 100));

  // subjectStability: based on stats distance from extremes
  const extremeCount = Object.values(state.stats).filter((v) => v < 15 || v > 85).length;
  const stability = Math.max(0, Math.min(100, 100 - extremeCount * 25));

  const cleanType = type.replace(/x/g, '');
  const archetypes: Record<string, string> = {
    INFJ: 'Prorok v mlze', INFP: 'Archivář citu', INTJ: 'Tichý architekt', INTP: 'Schéma ve tmě',
    ENFJ: 'Most mezi světy', ENFP: 'Rozbíječ forem', ENTJ: 'Velitel restartu', ENTP: 'Nepřítel protokolu',
    ISFJ: 'Strážce ztracených řádů', ISFP: 'Tichý tvůrce zázraků', ISTJ: 'Pevný záznam', ISTP: 'Samoúčelný nástroj',
    ESFJ: 'Slunečné rozhraní', ESFP: 'Divoký signál', ESTJ: 'Ředitel systému', ESTP: 'Adrenalinový kabel',
  };
  const dominantLabel = uncertainAxis ? `${type}-like` : type;
  const archetype = archetypes[cleanType] ?? resolveFallbackArchetype(state, type, dominant);
  return {
    dominantLabel,
    dominantFunction: dominant,
    shadowFunction: shadow,
    stability,
    profileConfidence,
    ...(uncertainAxis ? { uncertainAxis } : {}),
    archetype,
  };
}
