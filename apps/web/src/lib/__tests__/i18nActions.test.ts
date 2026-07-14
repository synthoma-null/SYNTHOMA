import { getT } from '../i18n';

describe('shared action localization', () => {
  it('keeps Czech navigation and status actions fully localized', () => {
    const t = getT('cs');
    expect([
      t('action.open'),
      t('action.read'),
      t('action.continue'),
      t('action.locked'),
      t('action.unlock'),
      t('action.close'),
      t('status.collection'),
      t('status.discovered'),
      t('status.unknown'),
    ]).toEqual(['OTEVŘÍT', 'ČÍST', 'POKRAČOVAT', 'UZAMČENO', 'ODEMKNOUT', 'ZAVŘÍT', 'SBÍRKA', 'OBJEVENO', 'NEZAZNAMENÁNO']);
  });

  it('preserves the complete English action vocabulary', () => {
    const t = getT('en');
    expect([t('action.open'), t('action.read'), t('action.continue')]).toEqual(['OPEN', 'READ', 'CONTINUE']);
  });
});
