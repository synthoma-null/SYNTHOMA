import type { CardUnlock } from './cyklusTypes';

export const CYKLUS_UNLOCKS: CardUnlock[] = [
  {
    id: 'archive_pool_unlock',
    poolId: 'archive_pool',
    condition: { type: 'sector', sector: 'archive' },
  },
  {
    id: 'glitchka_pool_unlock',
    poolId: 'glitchka_pool',
    condition: { type: 'hasFlag', flag: 'glitchka_disappointed' },
  },
  {
    id: 'market_pool_unlock',
    poolId: 'market_pool',
    condition: { type: 'hasFlag', flag: 'heard_token_direction' },
  },
  {
    id: 'mirror_pool_unlock',
    poolId: 'mirror_pool',
    condition: { type: 'hasItem', itemId: 'mirror_shard' },
  },
  {
    id: 'acid_pool_unlock',
    poolId: 'acid_pool',
    condition: { type: 'hasFlag', flag: 'acid_pool_unlocked' },
  },
  {
    id: 'form_office_pool_unlock',
    poolId: 'form_office_pool',
    condition: { type: 'hasFlag', flag: 'form_office_unlocked' },
  },
  {
    id: 'memory_beast_pool_unlock',
    poolId: 'memory_beast_pool',
    condition: { type: 'hasItem', itemId: 'memory_beast_mark' },
  },
  {
    id: 'relationship_followups_unlock',
    poolId: 'relationship_followups',
    condition: { type: 'hasFlag', flag: 'unfinished_conversation_active' },
  },
  {
    id: 'sarkasma_debt_pool_unlock',
    poolId: 'sarkasma_debt_pool',
    condition: { type: 'hasFlag', flag: 'sarkasma_debt' },
  },
  {
    id: 'sealarium_pool_unlock',
    poolId: 'sealarium_pool',
    condition: { type: 'hasItem', itemId: 'rubber_seal' },
  },
  {
    id: 'memory_sandbox_pool_unlock',
    poolId: 'memory_sandbox_pool',
    condition: { type: 'hasFlag', flag: 'childhood_anchor_active' },
  },
  {
    id: 'noise_pool_unlock',
    poolId: 'noise_pool',
    condition: { type: 'hasFlag', flag: 'noise_resident_active' },
  },
  {
    id: 'archive_forbidden_pool_unlock',
    poolId: 'archive_forbidden_pool',
    condition: { type: 'hasFlag', flag: 'forbidden_archive_opened' },
  },
  {
    id: 'token_market_pool_unlock',
    poolId: 'token_market_pool',
    condition: { type: 'hasFlag', flag: 'heard_token_direction' },
  },
  {
    id: 'soft_bug_pool_unlock',
    poolId: 'soft_bug_pool',
    condition: { type: 'hasItem', itemId: 'soft_bug' },
  },
  {
    id: 'shadow_pool_unlock',
    poolId: 'shadow_pool',
    condition: { type: 'hasFlag', flag: 'shadow_follows_scheduled' },
  },
  {
    id: 'wrong_name_pool_unlock',
    poolId: 'wrong_name_pool',
    condition: { type: 'hasFlag', flag: 'wrong_name_returns' },
  },
  {
    id: 'market_sells_no_pool_unlock',
    poolId: 'market_sells_no_pool',
    condition: { type: 'hasItem', itemId: 'returned_no' },
  },
  {
    id: 'glitch_pool_unlock',
    poolId: 'glitch_pool',
    condition: { type: 'cycleAtLeast', cycle: 0 },
  },
  {
    id: 'residuum_pool_unlock',
    poolId: 'residuum_pool',
    condition: { type: 'sector', sector: 'residuum' },
  },
  {
    id: 'archive_scent_pool_unlock',
    poolId: 'archive_scent_pool',
    condition: { type: 'hasFlag', flag: 'archive_scent_active' },
  },
  {
    id: 'desire_aftercare_pool_unlock',
    poolId: 'desire_aftercare_pool',
    condition: { type: 'hasImprint', imprintId: 'wanted_without_erasing' },
  },
  {
    id: 'blackbox_aftermath_pool_unlock',
    poolId: 'blackbox_aftermath_pool',
    condition: { type: 'hasAnyFlag', flags: ['anonymization_refused', 'named_error_claimed'] },
  },
  {
    id: 'sandbox_aftermath_pool_unlock',
    poolId: 'sandbox_aftermath_pool',
    condition: { type: 'hasAnyFlag', flags: ['dirty_laugh_active', 'safe_mistake_active'] },
  },
  {
    id: 'romance_aftermath_pool_unlock',
    poolId: 'romance_aftermath_pool',
    condition: { type: 'hasAnyFlag', flags: ['tender_static_active', 'stay_without_owning_active'] },
  },
  {
    id: 'toll_dvanactnik_pool_unlock',
    poolId: 'toll_dvanactnik_pool',
    condition: { type: 'unlockedPool', poolId: 'market_pool' },
  },
  {
    id: 'toll_debt_pool_unlock',
    poolId: 'toll_debt_pool',
    condition: { type: 'hasAnyFlag', flags: ['debt_named_active', 'late_fee_deferred', 'paid_with_fake_memory', 'unpaid_exit_active'] },
  },
  {
    id: 'detective_echo_case_pool_unlock',
    poolId: 'detective_echo_case_pool',
    condition: { type: 'unlockedPool', poolId: 'archive_pool' },
  },
  {
    id: 'detective_cold_case_pool_unlock',
    poolId: 'detective_cold_case_pool',
    condition: { type: 'hasAnyFlag', flags: ['case_questioned', 'case_left_open', 'wrong_culprit_accused'] },
  },
  {
    id: 'sarkasma_therapy_pool_unlock',
    poolId: 'sarkasma_therapy_pool',
    condition: { type: 'unlockedPool', poolId: 'sarkasma_pool' },
  },
  {
    id: 'sarkasma_aftercare_pool_unlock',
    poolId: 'sarkasma_aftercare_pool',
    condition: { type: 'hasAnyFlag', flags: ['sarkasma_cut_held', 'scalpel_taken_back', 'cut_that_held_active'] },
  },
  {
    id: 'glitchka_chat_pool_unlock',
    poolId: 'glitchka_chat_pool',
    condition: { type: 'unlockedPool', poolId: 'memory_sandbox_pool' },
  },
  {
    id: 'glitchka_deeper_chat_pool_unlock',
    poolId: 'glitchka_deeper_chat_pool',
    condition: { type: 'hasAnyFlag', flags: ['held_without_fixing_active', 'allowed_silence_active', 'brave_small_talk_active', 'fake_glitchka_exposed'] },
  },
];
