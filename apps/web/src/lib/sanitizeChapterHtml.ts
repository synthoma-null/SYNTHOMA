import sanitizeHtml from 'sanitize-html';

/** Shared publication/preview policy: no executable HTML or inline CSS. */
export function sanitizeChapterHtml(source: string): string {
  return sanitizeHtml(source, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'article', 'section', 'aside', 'header', 'footer', 'main', 'nav', 'figure', 'figcaption', 'img', 'button', 'details', 'summary', 'audio', 'video', 'source', 'track', 'mark', 'time', 'wbr'],
    allowedAttributes: {
      '*': ['id', 'class', 'title', 'lang', 'dir', 'role', 'aria-*', 'data-*', 'tabindex', 'hidden'],
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'loading', 'decoding'],
      button: ['type', 'disabled'],
      audio: ['src', 'controls', 'preload', 'loop', 'muted'],
      video: ['src', 'poster', 'controls', 'preload', 'loop', 'muted', 'playsinline', 'width', 'height'],
      source: ['src', 'type'], track: ['src', 'kind', 'srclang', 'label', 'default'],
      details: ['open'], time: ['datetime'], td: ['colspan', 'rowspan'], th: ['colspan', 'rowspan', 'scope'],
    },
    allowedSchemes: ['https', 'http', 'mailto'],
    allowedSchemesByTag: { img: ['https', 'http'], audio: ['https', 'http'], video: ['https', 'http'], source: ['https', 'http'], track: ['https', 'http'] },
    allowProtocolRelative: false,
    nonTextTags: ['script', 'style', 'textarea', 'option', 'iframe', 'object', 'embed', 'svg', 'math', 'head'],
    transformTags: {
      a: (tagName, attribs) => ({ tagName, attribs: { ...attribs, ...(attribs.target === '_blank' ? { rel: 'noopener noreferrer' } : {}) } }),
      button: (tagName, attribs) => ({ tagName, attribs: { ...attribs, type: 'button' } }),
    },
  }).trim();
}
