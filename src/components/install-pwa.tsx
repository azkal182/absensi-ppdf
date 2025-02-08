'use client'
import { useEffect, useState } from 'react'

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    })
  }, [])

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
    }
  }

  return <button onClick={handleInstall}>Install PWA</button>
}

export default InstallPWA
