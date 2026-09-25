import { sanitizeChapterHtml } from '../sanitizeChapterHtml';

describe('chapter publication HTML policy', () => {
  it.each([
    '<img src=x onerror=alert(1)>',
    '<a href=javascript:alert(1)>link</a>',
    '<a href="jav&#x61;script:alert(1)">link</a>',
    '<svg><g onload=alert(1)></g></svg>',
    '<iframe srcdoc="<script>alert(1)</script>"></iframe>',
    '<object data="https://example.com"></object>',
    '<p style="color:red" onclick="alert(1)">text</p>',
  ])('removes executable markup: %s', (source) => {
    const result = sanitizeChapterHtml(source);
    expect(result).not.toMatch(/onerror|onclick|onload|javascript:|<script|<iframe|<object|<svg|style=/i);
  });

  it('preserves narrative choices, accessibility and effect classes', () => {
    const result = sanitizeChapterHtml('<section class="fx-glitch" data-decision-id="one"><button aria-label="Volba" data-choice="E">Zůstat</button><p lang="cs">Paměť &amp; čas</p></section>');
    expect(result).toContain('data-decision-id="one"');
    expect(result).toContain('aria-label="Volba"');
    expect(result).toContain('class="fx-glitch"');
    expect(result).toContain('type="button"');
    expect(result).toContain('Paměť &amp; čas');
    expect(sanitizeChapterHtml(result)).toBe(result);
  });

  it('drops document head content and protects external links', () => {
    const result = sanitizeChapterHtml('<html><head><title>Private</title></head><body><a href="https://example.com" target="_blank">Story</a></body></html>');
    expect(result).not.toContain('Private');
    expect(result).toContain('rel="noopener noreferrer"');
  });
});
