import { useState, useCallback, useRef } from 'react'
import { readReaderResume, saveReaderResume, saveLastChapterPath } from '../lib/readerState'
import { 
  extractVisibleTextLength, 
  getTypewriterDurationMs, 
  normalizeChoicesToPlainText, 
  renderTypingHtml, 
  sanitizeHTML, 
  transformChoicesToButtons 
} from '../lib/typewriterContent'

export interface TypewriterState {
  error: string | null
  isLoading: boolean
  isTyping: boolean
  choicesShown: boolean
}

export interface TypewriterActions {
  setError: (error: string | null) => void
  setIsLoading: (loading: boolean) => void
  setIsTyping: (typing: boolean) => void
  setChoicesShown: (shown: boolean) => void
  announce: (msg: string) => void
  restoreScrollSoon: () => void
  cleanupChoices: (container: HTMLElement | null) => void
  revealChoicesStagger: (container: HTMLElement | null) => void
  bindChoiceHandlers: () => void
  scoreFromNode: (node: Element | null) => void
}

export function useTypewriterReader(srcUrl: string, autoStart: boolean = true) {
  const [state, setState] = useState<TypewriterState>({
    error: null,
    isLoading: true,
    isTyping: false,
    choicesShown: false
  })

  const hostRef = useRef<HTMLDivElement>(null)
  const cancelRef = useRef<(() => void) | null>(null)
  const continueRef = useRef<null | (() => void)>(null)
  const liveRef = useRef<HTMLDivElement>(null)
  const storyCacheRef = useRef<string>('')
  const lastUserScrollRef = useRef<number>(Date.now())

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }))
  }, [])

  const setIsLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }))
  }, [])

  const setIsTyping = useCallback((typing: boolean) => {
    setState(prev => ({ ...prev, isTyping: typing }))
  }, [])

  const setChoicesShown = useCallback((shown: boolean) => {
    setState(prev => ({ ...prev, choicesShown: shown }))
  }, [])

  const announce = useCallback((msg: string) => {
    try {
      if (!liveRef.current) return
      liveRef.current.textContent = msg
    } catch {}
  }, [])

  const restoreScrollSoon = useCallback(() => {
    try {
      const x = window.scrollX, y = window.scrollY
      requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(x, y)))
    } catch {}
  }, [])

  const cleanupChoices = useCallback((container: HTMLElement | null) => {
    if (!container) return
    try {
      container.querySelectorAll('.choice-link').forEach((el) => {
        const node = el as HTMLElement
        node.classList.remove('faded', 'disabled', 'choice-empty', 'typing')
        if (node instanceof HTMLButtonElement) { node.disabled = false }
        node.removeAttribute('aria-disabled')
        if (node.tagName.toLowerCase() === 'a') {
          const a = node as HTMLAnchorElement
          const parked = a.getAttribute('data-href')
          if (parked && !a.getAttribute('href')) { a.setAttribute('href', parked) }
          a.removeAttribute('data-href')
        }
      })
      const host = container.closest('.SYNTHOMAREADER')
      if (host) { (host as HTMLElement).classList.add('choices-shown') }
    } catch {}
  }, [])

  const revealChoicesStagger = useCallback((container: HTMLElement | null) => {
    if (!container) return
    try {
      const links = Array.from(container.querySelectorAll<HTMLElement>('.choice-link'))
      if (!links.length) return
      const host = container.closest('.SYNTHOMAREADER') as HTMLElement | null
      if (host) host.classList.add('choices-shown')
      links.forEach((btn) => {
        btn.classList.add('choice-appear')
        btn.classList.remove('visible')
      })
      const baseDelay = 90
      links.forEach((btn, i) => {
        setTimeout(() => { btn.classList.add('visible'); }, Math.min(1200, i * baseDelay))
      })
    } catch {}
  }, [])

  const bindChoiceHandlers = useCallback(() => {
    // Implementation would be moved here from the main component
    // This is a placeholder - full implementation would be quite large
    // placeholder – full implementation lives in TypewriterReader.tsx
  }, [])

  const scoreFromNode = useCallback((node: Element | null) => {
    try {
      if (!node) return
      const tagsAttr = (node.getAttribute('data-tags') || '').trim()
      if (!tagsAttr) return
      const parts = tagsAttr.split(',').map(s => s.trim()).filter(Boolean)
      if (!parts.length) return
      const valid = new Set(['I','E','N','S','F','T','J','P'])
      const hasWeights = parts.some(p => /[+-]\d+$/i.test(p))
      const key = 'mbtiScores'
      let data: Record<string, number> = {}
      try { data = JSON.parse(localStorage.getItem(key) || '{}') } catch {}
      if (hasWeights) {
        for (const p of parts) {
          const up = (p || '').toUpperCase()
          const m = up.match(/^([IENSFTJP])([+-]\d+)$/)
          if (!m || !m[1] || !m[2]) continue
          const letter = m[1] as string
          const delta = parseInt(m[2] as string, 10)
          if (!valid.has(letter)) continue
          const cur = typeof data[letter] === 'number' ? data[letter] : 0
          data[letter] = cur + (isFinite(delta) ? delta : 0)
        }
      } else {
        const first = (parts[0] || '').toUpperCase()
        if (!valid.has(first)) return
        const cur = typeof data[first] === 'number' ? data[first] : 0
        data[first] = cur + 1
      }
      localStorage.setItem(key, JSON.stringify(data))
      try { document.dispatchEvent(new CustomEvent('synthoma:choice-made')); } catch {}
    } catch {}
  }, [])

  return {
    state,
    hostRef,
    cancelRef,
    continueRef,
    liveRef,
    storyCacheRef,
    lastUserScrollRef,
    actions: {
      setError,
      setIsLoading,
      setIsTyping,
      setChoicesShown,
      announce,
      restoreScrollSoon,
      cleanupChoices,
      revealChoicesStagger,
      bindChoiceHandlers,
      scoreFromNode
    }
  }
}
