/** @jest-environment node */
export {};
// Runs only against an explicitly configured isolated local database and HTTP server.
const dbUrl = process.env.SYNTHOMA_POSTGRES_TEST_URL;
const origin = process.env.SYNTHOMA_HTTP_TEST_ORIGIN;
const enabled = Boolean(dbUrl && origin && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin));
const integration = enabled ? describe : describe.skip;

integration('managed publication over HTTP', () => {
  let prisma: typeof import('../../../lib/prisma').default;
  let disconnect: typeof import('../../../lib/prisma').disconnectPrisma;
  const chapterId = `audit-http-${process.pid}`;
  beforeAll(async () => {
    const target = new URL(dbUrl!);
    if (!['localhost', '127.0.0.1'].includes(target.hostname) || !/^\/synthoma_test/.test(target.pathname)) throw new Error('Isolated test database required');
    process.env.DATABASE_URL = dbUrl;
    ({ default: prisma, disconnectPrisma: disconnect } = await import('../../../lib/prisma'));
    await prisma.managedChapter.create({ data: { id: chapterId, bookId: 'synthoma-null', title: 'Publication integration', createdById: 'audit-ci', updatedById: 'audit-ci', isCustom: true, visibility: 'published', accessPolicy: 'free', bodyHtml: '<p>PUBLICATION_HTTP_MARKER</p><img src=x onerror=alert(1)>' } });
  });
  afterAll(async () => { await prisma?.managedChapter.deleteMany({ where: { id: chapterId } }); await disconnect?.(); });
  it('publishes, sanitizes, locks and hides a custom chapter through real routing', async () => {
    const free = await fetch(`${origin}/chapter/${chapterId}`);
    expect(free.status).toBe(200);
    const html = await free.text();
    expect(html).toContain('PUBLICATION_HTTP_MARKER');
    expect(html).not.toContain('onerror=');
    await prisma.managedChapter.update({ where: { id: chapterId }, data: { accessPolicy: 'entitlement', mnemCost: 64 } });
    const locked = await fetch(`${origin}/api/chapter/${chapterId}`);
    expect(locked.status).toBe(403);
    expect(await locked.text()).not.toContain('PUBLICATION_HTTP_MARKER');
    await prisma.managedChapter.update({ where: { id: chapterId }, data: { visibility: 'hidden' } });
    expect((await fetch(`${origin}/api/chapter/${chapterId}`)).status).toBe(404);
    const hiddenPage = await fetch(`${origin}/chapter/${chapterId}`);
    expect(await hiddenPage.text()).not.toContain('PUBLICATION_HTTP_MARKER');
  }, 60_000);
});
