export const DICE_CRITICAL_FAIL = 1;
export const DICE_FAIL_MAX = 2;
export const DICE_SUCCESS_MIN = 4;
export const DICE_BONUS = 6;

export const GAME_VERSION = 2;
export const GAME_STORAGE_KEY = 'synthoma:game:v2';
export const ROOM_CODE_LENGTH = 6;
export const VOID_PRESSURE_MAX = 20;
export const BOSS_HP = 10;
export const BOSS_TURNS_TO_DEFEAT = 3;
export const FRAGMENTS_PER_PLAYER = 3;
export const MAX_PLAYERS = 6;
export const MIN_PLAYERS = 2;
export const MAX_HAND_SIZE = 5;
export const DRAW_ON_TURN_START = 1;
export const VOID_PRESSURE_PER_TURN = 1;
export const VOID_GLOBAL_EVENT_EVERY_N_TURNS = 3;

export const PLAYER_COLORS = ['#00b6f1', '#ff4fa0', '#ffe600', '#7b2fff', '#ff7700', '#00ff88'] as const;
export type PlayerColor = typeof PLAYER_COLORS[number];
