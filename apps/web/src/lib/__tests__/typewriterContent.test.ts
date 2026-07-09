/**
 * Unit tests for typewriterContent.ts
 * Tests: sanitizeHTML, splitContentAtChoices, transformChoicesToButtons,
 *        extractVisibleTextLength, normalizeChoicesToPlainText
 */

import {
  sanitizeHTML,
  splitContentAtChoices,
  transformChoicesToButtons,
  extractVisibleTextLength,
  normalizeChoicesToPlainText,
} from '../typewriterContent';

// ─── sanitizeHTML ────────────────────────────────────────────────────

describe('sanitizeHTML', () => {
  it('removes <script> tags', () => {
    const input = '<p>hello</p><script>alert("xss")</script><p>world</p>';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('<script');
    expect(result).toContain('hello');
    expect(result).toContain('world');
  });

  it('removes <iframe> tags', () => {
    const input = '<div><iframe src="https://evil.com"></iframe></div>';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('<iframe');
  });

  it('removes <object> and <embed> tags', () => {
    const input = '<object data="x"></object><embed src="y">';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('<object');
    expect(result).not.toContain('<embed');
  });

  it('removes on* event handler attributes', () => {
    const input = '<p onclick="alert(1)" onmouseover="hack()">text</p>';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('onclick');
    expect(result).not.toContain('onmouseover');
    expect(result).toContain('text');
  });

  it('removes javascript: URLs from href', () => {
    const input = '<a href="javascript:alert(1)">click</a>';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('javascript:');
    expect(result).toContain('click');
  });

  it('removes javascript: URLs from src', () => {
    const input = '<img src="javascript:void(0)">';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('javascript:');
  });

  it('removes style attributes', () => {
    const input = '<p style="color:red;background:url(evil)">text</p>';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('style=');
    expect(result).toContain('text');
  });

  it('preserves safe href attributes', () => {
    const input = '<a href="/books/chapter1.html">link</a>';
    const result = sanitizeHTML(input);
    expect(result).toContain('href="/books/chapter1.html"');
  });

  it('preserves https href attributes', () => {
    const input = '<a href="https://example.com">link</a>';
    const result = sanitizeHTML(input);
    expect(result).toContain('href="https://example.com"');
  });

  it('preserves hash href attributes', () => {
    const input = '<a href="#section">link</a>';
    const result = sanitizeHTML(input);
    expect(result).toContain('href="#section"');
  });

  it('removes relative href that does not start with / or #', () => {
    const input = '<a href="file:///etc/passwd">link</a>';
    const result = sanitizeHTML(input);
    expect(result).not.toContain('href=');
  });

  it('preserves data-* attributes', () => {
    const input = '<p class="choice" data-tags="N" data-next="chapter2">text</p>';
    const result = sanitizeHTML(input);
    expect(result).toContain('data-tags="N"');
    expect(result).toContain('data-next="chapter2"');
  });

  it('preserves class attributes', () => {
    const input = '<p class="dialog log">text</p>';
    const result = sanitizeHTML(input);
    expect(result).toContain('class="dialog log"');
  });

  it('returns original html on empty input', () => {
    expect(sanitizeHTML('')).toBe('');
  });
});

// ─── splitContentAtChoices ───────────────────────────────────────────

describe('splitContentAtChoices', () => {
  it('splits content before choices, choice block, and remainder', () => {
    const html = '<p>intro text</p><p class="choice" data-tags="N">Option A</p><p class="choice" data-tags="S">Option B</p><p>after text</p>';
    const root = document.createElement('div');
    root.innerHTML = html;
    document.body.appendChild(root);

    const result = splitContentAtChoices(document, root);

    expect(result.preHtml).toContain('intro text');
    expect(result.preHtml).not.toContain('Option A');

    expect(result.choiceBlockHtml).toContain('Option A');
    expect(result.choiceBlockHtml).toContain('Option B');

    expect(result.remainderHtml).toContain('after text');
    expect(result.remainderHtml).not.toContain('Option A');

    document.body.removeChild(root);
  });

  it('returns all content as preHtml when no choices exist', () => {
    const html = '<p>just text</p><p>more text</p>';
    const root = document.createElement('div');
    root.innerHTML = html;
    document.body.appendChild(root);

    const result = splitContentAtChoices(document, root);

    expect(result.preHtml).toContain('just text');
    expect(result.preHtml).toContain('more text');
    expect(result.choiceBlockHtml).toBe('');
    expect(result.remainderHtml).toBe('');

    document.body.removeChild(root);
  });

  it('excludes #story-cache from output', () => {
    const html = '<p>visible</p><div id="story-cache"><p>hidden cached content</p></div>';
    const root = document.createElement('div');
    root.innerHTML = html;
    document.body.appendChild(root);

    const result = splitContentAtChoices(document, root);

    expect(result.preHtml).toContain('visible');
    expect(result.preHtml).not.toContain('hidden cached content');

    document.body.removeChild(root);
  });
});

// ─── transformChoicesToButtons ────────────────────────────────────────

describe('transformChoicesToButtons', () => {
  it('wraps choice content in a button element', () => {
    const html = '<p class="choice" data-next="ch2" data-tags="N">Go forward</p>';
    const result = transformChoicesToButtons(html);
    expect(result).toContain('<button');
    expect(result).toContain('class="choice-link"');
    expect(result).toContain('data-next="ch2"');
    expect(result).toContain('data-tags="N"');
    expect(result).toContain('Go forward');
  });

  it('does not double-wrap if choice-link anchor already exists', () => {
    const html = '<p class="choice"><a class="choice-link" href="/ch2">Go</a></p>';
    const result = transformChoicesToButtons(html);
    // Should not have a nested button inside the anchor
    expect(result).not.toContain('<button');
    expect(result).toContain('choice-link');
  });

  it('adds choice-group class to parent of multiple choices', () => {
    const html = '<div><p class="choice" data-tags="N">A</p><p class="choice" data-tags="S">B</p></div>';
    const result = transformChoicesToButtons(html);
    expect(result).toContain('choice-group');
    expect(result).toContain('data-choice-group="1"');
  });

  it('preserves data-ui attribute', () => {
    const html = '<p class="choice" data-ui="highlight" data-tags="J">Choice</p>';
    const result = transformChoicesToButtons(html);
    expect(result).toContain('data-ui="highlight"');
  });
});

// ─── extractVisibleTextLength ────────────────────────────────────────

describe('extractVisibleTextLength', () => {
  it('counts visible text length excluding hidden elements', () => {
    const html = '<p>Hello world</p><div class="hidden">secret</div>';
    const len = extractVisibleTextLength(html);
    expect(len).toBe('Hello world'.length);
  });

  it('excludes #story-cache content', () => {
    const html = '<p>Visible</p><div id="story-cache"><p>Lots of cached text here</p></div>';
    const len = extractVisibleTextLength(html);
    expect(len).toBe('Visible'.length);
  });

  it('returns 0 for empty HTML', () => {
    expect(extractVisibleTextLength('')).toBe(0);
  });
});

// ─── normalizeChoicesToPlainText ─────────────────────────────────────

describe('normalizeChoicesToPlainText', () => {
  it('disables anchor choice-links by removing href and adding aria-disabled', () => {
    const html = '<p class="choice"><a class="choice-link" href="/ch2">Go</a></p>';
    const result = normalizeChoicesToPlainText(html);
    expect(result).not.toMatch(/<a\b[^>]*\shref="\/ch2"/);
    expect(result).toContain('data-href="/ch2"');
    expect(result).toContain('aria-disabled="true"');
    expect(result).toContain('typing');
  });

  it('disables button choice-links', () => {
    const html = '<p class="choice" data-tags="N" data-next="x">Go</p>';
    const result = normalizeChoicesToPlainText(html);
    expect(result).toContain('disabled');
    expect(result).toContain('aria-disabled="true"');
  });
});
