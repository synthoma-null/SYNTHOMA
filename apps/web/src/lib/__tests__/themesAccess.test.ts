import { UI_THEMES, isThemeUnlocked } from '../themes';

describe('reader theme access', () => {
  it('keeps every theme except Retro Arcade free', () => {
    expect(UI_THEMES.filter((theme) => !theme.premium).map((theme) => theme.id)).toHaveLength(7);
    expect(UI_THEMES.filter((theme) => !theme.premium).every((theme) => theme.cost === 0)).toBe(true);
  });

  it('keeps Retro Arcade locked without its entitlement', () => {
    const retro = UI_THEMES.find((theme) => theme.id === 'retro-arcade');
    expect(retro).toMatchObject({ premium: true, cost: 256 });
    expect(retro && isThemeUnlocked(retro, false)).toBe(false);
  });

  it('makes Retro Arcade available after entitlement resolution', () => {
    const retro = UI_THEMES.find((theme) => theme.id === 'retro-arcade');
    expect(retro && isThemeUnlocked(retro, true)).toBe(true);
  });
});
