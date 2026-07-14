import { dynamicParams, generateStaticParams } from './page';

describe('public Cyklus card route', () => {
  it('pre-renders only public catalog cards and rejects hidden dynamic ids', () => {
    const ids = generateStaticParams().map(({ id }) => id);

    expect(dynamicParams).toBe(false);
    expect(ids.length).toBeGreaterThan(0);
    expect(ids).not.toContain('tutorial_00_welcome');
  });
});
