'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.warn('SW registered: ', registration)
          })
          .catch((registrationError) => {
            console.error('SW registration failed: ', registrationError)
          })
      })
    }
  }, [])

  return null
}
