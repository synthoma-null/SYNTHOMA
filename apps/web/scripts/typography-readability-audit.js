'use strict';

function numberValue(value) {
  return Number.parseFloat(value) || 0;
}

function textRole(element) {
  const className = typeof element.className === 'string' ? element.className : '';
  if (element.matches('button, a, input, select, textarea, [role="button"], [role="tab"], [role="navigation"] *')) return 'ui';
  if (element.matches('small, time, legend, label') || /meta|label|status|kicker|category|badge|code|progress|counter|machine-links/.test(className)) return 'metadata';
  if (element.matches('p, li, blockquote') || /description|summary|teaser|statement|detail|copy|body|story|hint/.test(className)) return 'content';
  return 'important';
}

function directText(element) {
  return Array.from(element.childNodes)
    .filter((node) => node.nodeType === 3)
    .map((node) => node.textContent || '')
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isVisible(element, view) {
  const style = view.getComputedStyle(element);
  const rect = element.getBoundingClientRect();
  return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
}

function auditTypographyReadability(documentRef, route = documentRef.location?.pathname || '/') {
  const view = documentRef.defaultView;
  if (!view) throw new Error('Typography audit requires a browser document.');

  const violations = [];
  for (const element of documentRef.querySelectorAll('body *')) {
    if (element.closest('[aria-hidden="true"], [hidden], [data-decorative="true"]') || !isVisible(element, view)) continue;
    const text = directText(element);
    if (!text) continue;

    const style = view.getComputedStyle(element);
    const fontSize = numberValue(style.fontSize);
    const letterSpacing = numberValue(style.letterSpacing);
    const opacity = numberValue(style.opacity);
    const role = textRole(element);
    const reasons = [];
    if (fontSize < 12) reasons.push('text-under-12px');
    if (role === 'ui' && fontSize < 13) reasons.push('ui-under-13px');
    if (role === 'content' && fontSize < 15) reasons.push('content-under-15px');
    if (text.length > 45 && letterSpacing > fontSize * 0.12) reasons.push('long-copy-letter-spacing');
    if (opacity < 0.6) reasons.push('low-opacity');
    if (!reasons.length) continue;

    violations.push({
      route,
      element: element.tagName.toLowerCase(),
      className: typeof element.className === 'string' ? element.className : '',
      textSample: text.slice(0, 100),
      role,
      fontSize,
      letterSpacing,
      opacity,
      reasons,
    });
  }

  return violations;
}

module.exports = { auditTypographyReadability };
