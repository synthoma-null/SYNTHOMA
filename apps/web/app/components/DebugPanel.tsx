'use client'

import { useState, useEffect } from 'react'
import { readStorage, writeStorage } from '../../src/lib/browser'

interface DebugInfo {
  url: string
  userAgent: string
  localStorage: Record<string, string>
  sessionStorage: Record<string, string>
  theme: string
  animations: boolean
  fontSize: string
  opacity: string
  mbtiScores: Record<string, number>
}

export default function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)

  const collectDebugInfo = () => {
    try {
      const ls: Record<string, string> = {}
      const ss: Record<string, string> = {}
      
      // Collect localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) ls[key] = localStorage.getItem(key) || ''
      }
      
      // Collect sessionStorage
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key) ss[key] = sessionStorage.getItem(key) || ''
      }
      
      // Get MBTI scores
      let mbtiScores: Record<string, number> = {}
      try {
        mbtiScores = JSON.parse(localStorage.getItem('mbtiScores') || '{}')
      } catch {}
      
      const info: DebugInfo = {
        url: window.location.href,
        userAgent: navigator.userAgent,
        localStorage: ls,
        sessionStorage: ss,
        theme: readStorage('theme', 'synthoma') || 'synthoma',
        animations: readStorage('animationsDisabled', 'false') !== 'true',
        fontSize: readStorage('fontSize', '1') || '1',
        opacity: readStorage('opacity', '0.8') || '0.8',
        mbtiScores
      }
      
      setDebugInfo(info)
    } catch (error) {
      console.error('Debug info collection failed:', error)
    }
  }

  const clearAllStorage = () => {
    try {
      localStorage.clear()
      sessionStorage.clear()
      collectDebugInfo()
    } catch (error) {
      console.error('Clear storage failed:', error)
    }
  }

  const exportDebugInfo = () => {
    if (!debugInfo) return
    
    const dataStr = JSON.stringify(debugInfo, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `synthoma-debug-${new Date().toISOString().slice(0, 19)}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const toggleDebug = () => {
    const current = readStorage('debug', 'false')
    const next = current === 'true' ? 'false' : 'true'
    writeStorage('debug', next)
    window.location.reload()
  }

  useEffect(() => {
    if (isOpen) {
      collectDebugInfo()
    }
  }, [isOpen])

  // Keyboard shortcut: Ctrl+Shift+D
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        setIsOpen(!isOpen)
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: '#ff00ff',
          color: '#000',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          fontFamily: 'monospace',
          zIndex: 9999,
          opacity: 0.7
        }}
        title="Debug Panel (Ctrl+Shift+D)"
      >
        🐞
      </button>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        background: 'rgba(0, 0, 0, 0.9)',
        color: '#00ffff',
        fontFamily: 'monospace',
        fontSize: '12px',
        zIndex: 10000,
        overflow: 'auto'
      }}
    >
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#ff00ff' }}>🐞 SYNTHOMA Debug Panel</h2>
          <div>
            <button
              onClick={collectDebugInfo}
              style={{
                background: '#00ffff',
                color: '#000',
                border: 'none',
                padding: '4px 8px',
                marginRight: '8px',
                cursor: 'pointer'
              }}
            >
              Refresh
            </button>
            <button
              onClick={exportDebugInfo}
              style={{
                background: '#00ff00',
                color: '#000',
                border: 'none',
                padding: '4px 8px',
                marginRight: '8px',
                cursor: 'pointer'
              }}
            >
              Export
            </button>
            <button
              onClick={clearAllStorage}
              style={{
                background: '#ff0000',
                color: '#fff',
                border: 'none',
                padding: '4px 8px',
                marginRight: '8px',
                cursor: 'pointer'
              }}
            >
              Clear Storage
            </button>
            <button
              onClick={toggleDebug}
              style={{
                background: '#ffff00',
                color: '#000',
                border: 'none',
                padding: '4px 8px',
                marginRight: '8px',
                cursor: 'pointer'
              }}
            >
              Toggle Debug
            </button>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: '#666',
                color: '#fff',
                border: 'none',
                padding: '4px 8px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </div>
        </div>

        {debugInfo && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <h3 style={{ color: '#ffff00', marginBottom: '10px' }}>🌐 Browser Info</h3>
              <div style={{ background: 'rgba(0,255,255,0.1)', padding: '10px', marginBottom: '20px' }}>
                <div><strong>URL:</strong> {debugInfo.url}</div>
                <div><strong>User Agent:</strong> {debugInfo.userAgent}</div>
              </div>

              <h3 style={{ color: '#ffff00', marginBottom: '10px' }}>⚙️ Settings</h3>
              <div style={{ background: 'rgba(0,255,255,0.1)', padding: '10px', marginBottom: '20px' }}>
                <div><strong>Theme:</strong> {debugInfo.theme}</div>
                <div><strong>Animations:</strong> {debugInfo.animations ? 'Enabled' : 'Disabled'}</div>
                <div><strong>Font Size:</strong> {debugInfo.fontSize}</div>
                <div><strong>Opacity:</strong> {debugInfo.opacity}</div>
              </div>

              <h3 style={{ color: '#ffff00', marginBottom: '10px' }}>🧠 MBTI Scores</h3>
              <div style={{ background: 'rgba(0,255,255,0.1)', padding: '10px', marginBottom: '20px' }}>
                {Object.entries(debugInfo.mbtiScores).length > 0 ? (
                  Object.entries(debugInfo.mbtiScores).map(([key, value]) => (
                    <div key={key}><strong>{key}:</strong> {value}</div>
                  ))
                ) : (
                  <div>No MBTI scores found</div>
                )}
              </div>
            </div>

            <div>
              <h3 style={{ color: '#ffff00', marginBottom: '10px' }}>💾 Local Storage ({Object.keys(debugInfo.localStorage).length} items)</h3>
              <div style={{ background: 'rgba(0,255,255,0.1)', padding: '10px', marginBottom: '20px', maxHeight: '200px', overflow: 'auto' }}>
                {Object.entries(debugInfo.localStorage).map(([key, value]) => (
                  <div key={key} style={{ marginBottom: '4px' }}>
                    <strong>{key}:</strong> {value.length > 50 ? value.substring(0, 50) + '...' : value}
                  </div>
                ))}
              </div>

              <h3 style={{ color: '#ffff00', marginBottom: '10px' }}>📝 Session Storage ({Object.keys(debugInfo.sessionStorage).length} items)</h3>
              <div style={{ background: 'rgba(0,255,255,0.1)', padding: '10px', marginBottom: '20px', maxHeight: '200px', overflow: 'auto' }}>
                {Object.entries(debugInfo.sessionStorage).map(([key, value]) => (
                  <div key={key} style={{ marginBottom: '4px' }}>
                    <strong>{key}:</strong> {value.length > 50 ? value.substring(0, 50) + '...' : value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '20px', fontSize: '11px', opacity: 0.7 }}>
          Press Ctrl+Shift+D to toggle debug panel
        </div>
      </div>
    </div>
  )
}
