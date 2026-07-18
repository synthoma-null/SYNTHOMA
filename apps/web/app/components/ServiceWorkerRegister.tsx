'use client'

import { useEffect } from 'react'

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    const register = () => {
      void navigator.serviceWorker.register('/sw.js')
        .then((registration) => registration.update())
        .catch((registrationError) => {
          console.error('SW registration failed: ', registrationError)
        })
    }

    if (document.readyState === 'complete') {
      register()
    } else {
      window.addEventListener('load', register, { once: true })
    }

    return () => window.removeEventListener('load', register)
  }, [])

  return null
}
