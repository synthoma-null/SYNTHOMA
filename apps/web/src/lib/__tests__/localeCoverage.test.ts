import fs from 'node:fs';
import path from 'node:path';
import { translations } from '../i18n';
import { UI_THEMES } from '../themes';

describe('canonical locale coverage', () => {
  it('provides non-empty Czech and English values for every UI catalog key', () => {
    for (const [key, value] of Object.entries(translations)) {
      expect({ key, value: value.cs }).toEqual({ key, value: expect.any(String) });
      expect({ key, value: value.en }).toEqual({ key, value: expect.any(String) });
      expect(value.cs.trim()).not.toBe('');
      expect(value.en.trim()).not.toBe('');
    }
  });

  it('provides both locales from one canonical theme list', () => {
    expect(UI_THEMES).toHaveLength(8);
    for (const theme of UI_THEMES) {
      expect(theme.name.cs).toBeTruthy();
      expect(theme.name.en).toBeTruthy();
      expect(theme.description.cs).toBeTruthy();
      expect(theme.description.en).toBeTruthy();
    }
  });

  it('passes URL locale through middleware into the server layout', () => {
    const middleware = fs.readFileSync(path.join(process.cwd(), 'middleware.ts'), 'utf8');
    const layout = fs.readFileSync(path.join(process.cwd(), 'app/layout.tsx'), 'utf8');
    expect(middleware).toContain("request.nextUrl.searchParams.get('locale')");
    expect(middleware).toContain("requestHeaders.set('x-synthoma-locale', locale)");
    expect(layout).toContain("requestHeaders.get('x-synthoma-locale') === 'en'");
    expect(layout).toContain('<html lang={initialLang}');
    expect(layout).toContain('<LangProvider initialLang={initialLang}>');
  });
});
