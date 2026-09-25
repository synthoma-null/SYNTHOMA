import { readStorage, writeStorage } from './browser';

export function getGameClientToken(): string {
  const existing = readStorage('synthoma_game_token');
  if (existing && /^v2_[a-f0-9]{64}$/.test(existing)) return existing;
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const token = `v2_${Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('')}`;
  writeStorage('synthoma_game_token', token);
  return token;
}
