import type { CardChoice, CardChoiceOrder, SwipeCard } from './cyklusTypes';

export type PhysicalCardSide = 'left' | 'right';

export const DEFAULT_CARD_CHOICE_ORDER: CardChoiceOrder = ['no', 'yes'];

// These IDs are matched to the actual poster content, not to the original source filenames.
export const CYKLUS_CARD_ART_IDS = [
  'acid_filter',
  'admin_access',
  'archive_key',
  'archive_key_warms',
  'auto_repair_patch',
  'black_folder',
  'black_folder_rustles',
  'blank_form',
  'cache_of_pain',
  'childhood_spade',
  'childhood_spade_digs',
  'choose_acid_yellow',
  'choose_archive',
  'choose_form_office',
  'choose_glitchka_nest',
  'choose_market',
  'choose_memory_sandbox',
  'choose_mirror',
  'choose_residuum',
  'choose_sarkasma_terminal',
  'choose_tai_core',
  'confession_challenge',
  'crisis_bond_abandonment',
  'crisis_bond_suffocation',
  'crisis_control_breakdown',
  'crisis_control_tyranny',
  'crisis_energy_depletion',
  'crisis_memory_flood',
  'crisis_memory_loss',
  'disconnect_peripherals',
  'entity_archive',
  'entity_form',
  'entity_glitchka',
  'entity_sarkasma',
  'entity_tai',
  'faulty_update',
  'forbidden_log',
  'glitch_pebble',
  'glitch_pebble_multiplies',
  'gravity_outage',
  'hard_restart',
  'incoming_message',
  'manual_mode',
  'mirror_shard',
  'mirror_shard_hums',
  'noise_clump',
  'noise_filter',
  'noise_pet_calls',
  'observer_mode',
  'overclock',
  'pebble_with_glasses',
  'power_save',
  'restart_0',
  'restart_1',
  'restart_2',
  'restart_3',
  'restart_4',
  'restart_5',
  'rubber_seal',
  'rusty_token',
  'rusty_token_whispers',
  'sarkasma_account',
  'sarkasma_returns',
  'unknown_process',
  'wrong_map',
  'wrong_map_leads',
] as const;

const cardArtIds = new Set<string>(CYKLUS_CARD_ART_IDS);

export function applyCardPresentations(cards: Record<string, SwipeCard>): Record<string, SwipeCard> {
  return Object.fromEntries(Object.entries(cards).map(([id, card]) => {
    if (card.presentation || !cardArtIds.has(id)) return [id, card];
    return [id, {
      ...card,
      presentation: {
        mode: 'poster-then-text' as const,
        artSrc: `/cards/cyklus/${id}.webp`,
        artAlt: `Obrazový záznam: ${card.title}`,
        choiceOrder: ['yes', 'no'] as const,
        focalPoint: 'center',
        revealLabel: 'OTEVŘÍT ZÁZNAM',
      },
    }];
  }));
}

export function getCardChoiceOrder(card: SwipeCard): CardChoiceOrder {
  return card.presentation?.choiceOrder ?? DEFAULT_CARD_CHOICE_ORDER;
}

export function getChoiceForPhysicalSide(card: SwipeCard, side: PhysicalCardSide): CardChoice {
  const order = getCardChoiceOrder(card);
  return side === 'left' ? order[0] : order[1];
}
