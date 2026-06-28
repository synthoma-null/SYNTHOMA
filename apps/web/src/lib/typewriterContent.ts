export type TypewriterSegment = {
  preHtml: string;
  choiceBlockHtml: string;
  remainderHtml: string;
};

export function sanitizeHTML(html: string): string {
  try {
    const root = document.createElement("div");
    root.innerHTML = html;
    root.querySelectorAll("script, iframe, object, embed").forEach((el) => el.remove());
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, null);
    const toClean: Element[] = [];
    while (walker.nextNode()) {
      toClean.push(walker.currentNode as Element);
    }
    toClean.forEach((el) => {
      Array.from(el.attributes).forEach((attr) => {
        const name = attr.name.toLowerCase();
        if (name.startsWith("on")) {
          el.removeAttribute(attr.name);
          return;
        }
        if (name === "href" || name === "src") {
          const val = (attr.value || "").trim();
          if (/^\s*javascript:/i.test(val)) {
            el.removeAttribute(attr.name);
            return;
          }
          if (!(val.startsWith("http://") || val.startsWith("https://") || val.startsWith("//") || val.startsWith("/") || val.startsWith("#"))) {
            el.removeAttribute(attr.name);
          }
        }
        if (name === "style") {
          el.removeAttribute(attr.name);
        }
      });
    });
    return root.innerHTML;
  } catch {
    return html;
  }
}

export function revealHtmlPreserve(srcHtml: string, count: number): string {
  try {
    const container = document.createElement("div");
    container.innerHTML = srcHtml;
    container.querySelectorAll("#story-cache, .hidden").forEach((el) => el.remove());
    let remaining = Math.max(0, count);
    const stripNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        (node as Text).nodeValue = "";
        return;
      }
      const el = node as Element;
      while (el.firstChild) el.removeChild(el.firstChild);
    };
    const processNode = (node: Node) => {
      if (remaining <= 0) {
        stripNode(node);
        return;
      }
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.nodeValue || "";
        const len = text.length;
        if (remaining >= len) {
          remaining -= len;
        } else {
          node.nodeValue = text.slice(0, Math.max(0, remaining));
          remaining = 0;
        }
        return;
      }
      Array.from(node.childNodes).forEach(processNode);
    };
    Array.from(container.childNodes).forEach(processNode);
    return container.innerHTML;
  } catch {
    return srcHtml;
  }
}

export function renderTypingHtml(srcHtml: string, count: number): string {
  try {
    const container = document.createElement("div");
    container.innerHTML = revealHtmlPreserve(srcHtml, count);
    container.querySelectorAll("a, button").forEach((el) => {
      if (el instanceof HTMLButtonElement) {
        el.disabled = true;
        el.style.pointerEvents = "none";
      }
    });
    return container.innerHTML;
  } catch {
    return srcHtml;
  }
}

export function transformChoicesToButtons(html: string): string {
  try {
    const root = document.createElement("div");
    root.innerHTML = html;
    const nodes = Array.from(root.querySelectorAll("p.choice")) as HTMLElement[];
    nodes.forEach((p) => {
      const existingAnchor = p.querySelector("a.choice-link[href]");
      if (existingAnchor) return;
      const btn = document.createElement("button");
      btn.className = "choice-link";
      btn.type = "button";
      for (const attr of Array.from(p.attributes)) {
        if (attr.name.startsWith("data-")) {
          btn.setAttribute(attr.name, attr.value);
        }
      }
      btn.innerHTML = p.innerHTML;
      p.innerHTML = "";
      p.appendChild(btn);
    });
    // Group only contiguous adjacent p.choice siblings into wrapper divs.
    // DO NOT mark the shared parent as data-choice-group — in long chapters all
    // p.choice elements share the same parent (<body>/root div), which would make
    // the entire chapter one group and lock all choices after the first click.
    const visited = new Set<HTMLElement>();
    nodes.forEach((p) => {
      if (visited.has(p)) return;
      // Collect the contiguous block of adjacent p.choice siblings
      const block: HTMLElement[] = [p];
      let sib: Element | null = p.previousElementSibling;
      while (sib && sib.tagName.toLowerCase() === 'p' && (sib as HTMLElement).classList.contains('choice')) {
        block.unshift(sib as HTMLElement);
        sib = sib.previousElementSibling;
      }
      sib = p.nextElementSibling;
      while (sib && sib.tagName.toLowerCase() === 'p' && (sib as HTMLElement).classList.contains('choice')) {
        block.push(sib as HTMLElement);
        sib = sib.nextElementSibling;
      }
      block.forEach((n) => visited.add(n));
      const first = block[0];
      if (block.length > 1 && first) {
        // Wrap the contiguous block in a div that acts as the group scope
        const wrapper = document.createElement('div');
        wrapper.setAttribute('data-choice-group', '1');
        wrapper.classList.add('choice-group');
        const parent = first.parentElement;
        if (parent) {
          parent.insertBefore(wrapper, first);
          block.forEach((n) => wrapper.appendChild(n));
        }
      }
    });
    return root.innerHTML;
  } catch {
    return html;
  }
}

export function normalizeChoicesToPlainText(html: string): string {
  try {
    const root = document.createElement("div");
    root.innerHTML = transformChoicesToButtons(html);
    root.querySelectorAll("a.choice-link").forEach((a) => {
      const href = a.getAttribute("href");
      if (href) {
        a.setAttribute("data-href", href);
        a.removeAttribute("href");
      }
      (a as HTMLElement).setAttribute("aria-disabled", "true");
      (a as HTMLElement).classList.add("typing");
    });
    root.querySelectorAll("button.choice-link").forEach((b) => {
      try {
        (b as HTMLButtonElement).disabled = true;
      } catch {}
      (b as HTMLElement).setAttribute("aria-disabled", "true");
      (b as HTMLElement).classList.add("typing");
    });
    return root.innerHTML;
  } catch {
    return html;
  }
}

export function extractVisibleTextLength(html: string): number {
  try {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    tmp.querySelectorAll("#story-cache, .hidden").forEach((el) => el.remove());
    return ((tmp.textContent || "").trim()).length;
  } catch {
    return 0;
  }
}

export function splitContentAtChoices(doc: Document, root: HTMLElement): TypewriterSegment {
  const cutoffNode = root.querySelector("#story-cache");
  const firstChoice = root.querySelector("p.choice, .choice-link");
  let preHtml = "";
  let choiceBlockHtml = "";
  let remainderHtml = "";

  if (firstChoice) {
    const rPre = doc.createRange();
    rPre.setStart(root, 0);
    rPre.setEndBefore(firstChoice);
    const wrapPre = doc.createElement("div");
    wrapPre.appendChild(rPre.cloneContents());
    preHtml = wrapPre.innerHTML;

    let last = firstChoice as Element;
    let cursor = firstChoice.nextElementSibling;
    while (cursor && cursor.tagName.toLowerCase() === "p" && (cursor as HTMLElement).classList.contains("choice")) {
      last = cursor;
      cursor = cursor.nextElementSibling;
    }

    const rChoiceBlock = doc.createRange();
    rChoiceBlock.setStartBefore(firstChoice);
    rChoiceBlock.setEndAfter(last);
    const wrapChoice = doc.createElement("div");
    wrapChoice.appendChild(rChoiceBlock.cloneContents());
    choiceBlockHtml = wrapChoice.innerHTML;

    const rRemain = doc.createRange();
    rRemain.setStartAfter(last);
    if (cutoffNode && cutoffNode.parentNode) {
      rRemain.setEndBefore(cutoffNode);
    } else {
      const endNode: Node = (root.lastChild ?? root) as Node;
      rRemain.setEndAfter(endNode);
    }
    const wrapRemain = doc.createElement("div");
    wrapRemain.appendChild(rRemain.cloneContents());
    remainderHtml = wrapRemain.innerHTML;
  } else {
    const rAll = doc.createRange();
    rAll.setStart(root, 0);
    if (cutoffNode && cutoffNode.parentNode) {
      rAll.setEndBefore(cutoffNode);
    } else {
      const endNode: Node = (root.lastChild ?? root) as Node;
      rAll.setEndAfter(endNode);
    }
    const wrapAll = doc.createElement("div");
    wrapAll.appendChild(rAll.cloneContents());
    preHtml = wrapAll.innerHTML;
  }

  return { preHtml, choiceBlockHtml, remainderHtml };
}

export function getTypewriterDurationMs(host: HTMLElement, textLength: number): number {
  const css = getComputedStyle(host);
  const raw = css.getPropertyValue("--typewriter-duration").trim();
  if (raw.endsWith("ms")) return Math.min(6000, Math.max(300, parseFloat(raw)));
  if (raw.endsWith("s")) return Math.min(6000, Math.max(300, parseFloat(raw) * 1000));
  return Math.min(6000, Math.max(300, Math.round(Math.max(1, textLength) * 5)));
}
