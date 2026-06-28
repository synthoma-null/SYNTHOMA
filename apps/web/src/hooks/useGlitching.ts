import { useEffect, useCallback, useRef, type RefObject } from 'react'

interface GlitchHTMLElement extends HTMLElement {
  __glitchOrig?: string | undefined
  __glitchTimer?: number | undefined
  __glitchBusy?: number | undefined
  __glitchMeasure?: HTMLElement | undefined
  __glitchOverlay?: HTMLElement | undefined
}

export function useGlitching(hostRef: RefObject<HTMLElement | null>, isTypingRef: RefObject<boolean>) {
  const glitchCleanupRef = useRef<Array<() => void>>([])

  const enhanceGlitching = useCallback((container: HTMLElement | null) => {
    if (!container) return
    try {
      const prefersReduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
      const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      const pick = () => GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length)) || '#'
      const targets = Array.from(container.querySelectorAll<HTMLElement>('.glitching'))

      targets.forEach((el) => {
        const glitchEl = el as GlitchHTMLElement
        if (prefersReduced) return

        try {
          const label = el.getAttribute('aria-label')
          if (label && el.querySelector('.glitching-char')) {
            el.textContent = label
          }
        } catch {}

        const origText = (el.textContent || '').toString()
        if (!glitchEl.__glitchOrig) { glitchEl.__glitchOrig = origText }
        const source = () => String(glitchEl.__glitchOrig || origText)
        if (glitchEl.__glitchTimer) return

        // Per-element measurer to keep character width stable
        let measurer = glitchEl.__glitchMeasure
        if (!measurer) {
          measurer = document.createElement('span')
          measurer.style.visibility = 'hidden'
          measurer.style.position = 'absolute'
          measurer.style.left = '-99999px'
          measurer.style.top = '0'
          measurer.style.whiteSpace = 'pre'
          try {
            const cs = getComputedStyle(el)
            measurer.style.font = cs.font
            measurer.style.letterSpacing = cs.letterSpacing
            measurer.style.fontKerning = 'none'
            measurer.style.fontVariantLigatures = cs.fontVariantLigatures
          } catch {}
          document.body.appendChild(measurer)
          glitchEl.__glitchMeasure = measurer
        }

        const totalWidth = (text: string) => {
          try { measurer!.textContent = text; return measurer!.getBoundingClientRect().width; } catch { return 0; }
        }

        const runJitter = () => {
          try {
            if (glitchEl.__glitchBusy) return
            const text = source()
            const indices = Array.from(text).map((c, i) => ({ c, i })).filter(x => /[A-Za-z0-9Á-Žá-ž]/u.test(x.c))
            if (!indices.length) return
            glitchEl.__glitchBusy = 1

            const busyGuard = window.setTimeout(() => {
              try {
                glitchEl.__glitchBusy = 0
                const overlay = glitchEl.__glitchOverlay
                if (overlay) { overlay.remove(); glitchEl.__glitchOverlay = undefined; }
              } catch {}
            }, 2500)

            const pickIdx = indices[Math.floor(Math.random() * indices.length)]?.i ?? 0
            const frames = 5 + Math.floor(Math.random() * 4)
            const frameDelay = 80 + Math.floor(Math.random() * 30)
            const keepCase = (ch: string, repl: string) => {
              if (ch.toUpperCase() === ch && ch.toLowerCase() !== ch) return repl.toUpperCase()
              if (ch.toLowerCase() === ch && ch.toUpperCase() !== ch) return repl.toLowerCase()
              return repl
            }
            let k = 0
            let kerningPatched = false

            const step = () => {
              try {
                if (!kerningPatched) { try { (el as HTMLElement).style.fontKerning = 'none'; kerningPatched = true; } catch {} }
                const base = source()
                const arr = Array.from(base)
                const origChar: string = arr[pickIdx] ?? ''
                const baseWidth = totalWidth(base)
                let replacement: string | undefined

                for (let tries = 0; tries < 30; tries++) {
                  const cand = pick()
                  const testArr = arr.slice()
                  testArr[pickIdx] = keepCase(origChar, cand)
                  const w2 = totalWidth(testArr.join(''))
                  if (Math.abs(w2 - baseWidth) < 0.02) { replacement = cand; break; }
                }

                if (typeof replacement === 'undefined') {
                  k++
                  window.setTimeout(step, frameDelay)
                  return
                }

                if (k < frames) {
                  let overlay = glitchEl.__glitchOverlay
                  if (!overlay) {
                    overlay = document.createElement('span')
                    overlay.style.position = 'absolute'
                    overlay.style.pointerEvents = 'none'
                    overlay.style.willChange = 'transform, contents'
                    overlay.style.whiteSpace = 'pre'
                    try { (el as HTMLElement).style.position = (getComputedStyle(el).position === 'static') ? 'relative' : getComputedStyle(el).position; } catch {}
                    el.appendChild(overlay)
                    glitchEl.__glitchOverlay = overlay
                  }

                  const loc = findTextNodeForIndex(el as HTMLElement, pickIdx)
                  if (loc.node) {
                    const r = document.createRange()
                    r.setStart(loc.node, loc.localOffset)
                    r.setEnd(loc.node, loc.localOffset + 1)
                    const rect = r.getBoundingClientRect()
                    const hostRect = (el as HTMLElement).getBoundingClientRect()
                    overlay.textContent = keepCase(origChar, replacement)
                    try { const cs = getComputedStyle(el as HTMLElement); (overlay.style as any).font = cs.font; overlay.style.letterSpacing = cs.letterSpacing; } catch {}
                    overlay.style.left = `${rect.left - hostRect.left}px`
                    overlay.style.top = `${rect.top - hostRect.top}px`
                  }
                  k++
                  window.setTimeout(step, frameDelay)
                } else {
                  const overlay = glitchEl.__glitchOverlay
                  if (overlay) { try { overlay.remove(); } catch {} glitchEl.__glitchOverlay = undefined; }
                  if (kerningPatched) { try { (el as HTMLElement).style.fontKerning = ''; } catch {} }
                  glitchEl.__glitchBusy = 0
                  try { window.clearTimeout(busyGuard); } catch {}
                }
              } catch {
                glitchEl.__glitchBusy = 0
                try {
                  const overlay = glitchEl.__glitchOverlay;
                  if (overlay) {
                    overlay.remove();
                  }
                  glitchEl.__glitchOverlay = undefined;
                } catch {}
              }
            }
            step()
          } catch {}
        }

        const tid = window.setInterval(runJitter, 700 + Math.floor(Math.random() * 500))
        glitchEl.__glitchTimer = tid
        // Register cleanup so interval is cleared on content reload / unmount
        glitchCleanupRef.current.push(() => {
          window.clearInterval(tid)
          const ov = glitchEl.__glitchOverlay
          if (ov) { try { ov.remove(); } catch {} glitchEl.__glitchOverlay = undefined; }
          const ms = glitchEl.__glitchMeasure
          if (ms) { try { ms.remove(); } catch {} glitchEl.__glitchMeasure = undefined; }
          glitchEl.__glitchTimer = undefined
          glitchEl.__glitchBusy = 0
        })
      })
    } catch {}
  }, [])

  const findTextNodeForIndex = (host: HTMLElement, globalIndex: number): { node: Text | null, localOffset: number } => {
    try {
      let acc = 0
      const tw = document.createTreeWalker(host, NodeFilter.SHOW_TEXT, {
        acceptNode: (n: Node) => (n.nodeValue && n.nodeValue.length) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
      } as any)
      let cur: Text | null = tw.nextNode() as Text | null
      while (cur) {
        const len = cur.data.length
        if (acc + len > globalIndex) {
          return { node: cur, localOffset: globalIndex - acc }
        }
        acc += len
        cur = tw.nextNode() as Text | null
      }
    } catch {}
    return { node: null, localOffset: 0 }
  }

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const tick = () => enhanceGlitching(host)
    try { tick(); } catch {}

    let debounceTimer: ReturnType<typeof setTimeout> | null = null
    const obs = new MutationObserver(() => {
      // Skip observer firing during active typewriter animation (prevents mobile thrashing)
      if (isTypingRef.current) return
      if (debounceTimer) clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => { try { requestAnimationFrame(tick); } catch {} }, 300)
    })
    obs.observe(host, { childList: true, subtree: true })

    const onVis = () => { try { if (document.visibilityState === 'visible') tick(); } catch {} }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      try {
        obs.disconnect()
        document.removeEventListener('visibilitychange', onVis)
      } catch {}
      // Clear all registered glitch intervals
      glitchCleanupRef.current.forEach(fn => { try { fn(); } catch {} })
      glitchCleanupRef.current = []
    }
  }, [hostRef, isTypingRef, enhanceGlitching])

  return { enhanceGlitching, glitchCleanupRef }
}
