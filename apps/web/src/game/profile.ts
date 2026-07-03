import type { GameProfileVector, GamePlayer } from './types';

export interface GameArchetype {
  id: string;
  title: string;
  description: string;
  conditions: Partial<GameProfileVector>;
}

const ARCHETYPES: GameArchetype[] = [
  {
    id: 'sarkastic-smuggler',
    title: 'Sarkastický pašerák Prázdnoty',
    description: 'Máš sarkasmus jako strategii a chaos jako životní styl. Prázdnota tě neohromuje. Spíš tě nudí.',
    conditions: { sarcasm: 2, chaos: 1 },
  },
  {
    id: 'cautious-archivist',
    title: 'Opatrný archivář',
    description: 'Zaznamenáváš, plánuješ, odkládáš. Jednou tě Archiv odmění. Nebo ne. Ale záznamy zůstanou.',
    conditions: { caution: 3, cooperation: 1 },
  },
  {
    id: 'chaotic-navigator',
    title: 'Chaotický navigátor',
    description: 'Mapy jsou pro lidi, kteří si nechtějí zapamatovat výsledky svých rozhodnutí. Ty je nepoužíváš.',
    conditions: { chaos: 3, courage: 1 },
  },
  {
    id: 'empathic-fragment',
    title: 'Empatický fragment',
    description: 'Staráš se o ostatní i v systému, který neví, co empatie znamená. To je buď síla, nebo naivita. Pravděpodobně obojí.',
    conditions: { tenderness: 3, cooperation: 2 },
  },
  {
    id: 'dominant-executor',
    title: 'Dominantní exekutor',
    description: 'Systém se naučil tvé jméno. Systém by raději, kdyby ho neznal. Ale systém nemá na výběr.',
    conditions: { dominance: 3, courage: 1 },
  },
  {
    id: 'void-survivor',
    title: 'Přeživší Prázdnoty',
    description: 'Prošel jsi vším a ještě si tady. Systém to neplánoval. Ty taky ne. Ale funguje to.',
    conditions: { caution: 2, courage: 2 },
  },
  {
    id: 'ironic-oracle',
    title: 'Ironický věštec',
    description: 'Věděl jsi, co se stane. Řekl jsi to. Nikdo tě neposlouchal. Máš pravdu a je ti líto, že ji máš.',
    conditions: { sarcasm: 3, tenderness: 1 },
  },
  {
    id: 'cooperative-ghost',
    title: 'Kooperativní přízrak',
    description: 'Pracuješ s ostatními tak dobře, že si tě skoro nevšimli. To byl plán.',
    conditions: { cooperation: 3 },
  },
];

export function computeGameArchetype(profile: GameProfileVector): GameArchetype {
  let bestMatch = ARCHETYPES[0]!;
  let bestScore = -1;

  for (const archetype of ARCHETYPES) {
    let score = 0;
    for (const [key, threshold] of Object.entries(archetype.conditions)) {
      const playerVal = (profile as unknown as Record<string, number>)[key] ?? 0;
      if (playerVal >= (threshold ?? 0)) score += playerVal;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = archetype;
    }
  }

  return bestMatch;
}

export function buildShareText(player: GamePlayer, archetype: GameArchetype, fragmentsFinished: number, sabotageCount: number, auditsSurvived: number): string {
  const lines = [
    `${player.name} se stal: ${archetype.title}.`,
    `Dostal ${fragmentsFinished} fragment${fragmentsFinished === 1 ? '' : 'y'} do Jádra, ${sabotageCount}× sabotoval, ${auditsSurvived}× přežil audit.`,
    `Systém doporučuje: méně portálů. Doporučení ignorováno.`,
  ];
  return lines.join(' ');
}
