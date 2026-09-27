import { useCallback, useEffect, useState } from 'react'

function detectInstalled() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

function detectIos() {
  if (typeof navigator === 'undefined') return false
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

export function usePwaInstall() {
  const [installed, setInstalled] = useState(detectInstalled)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [iosHintOpen, setIosHintOpen] = useState(false)

  const isIos = detectIos()

  useEffect(() => {
    const onBeforeInstall = (event) => {
      event.preventDefault()
      setDeferredPrompt(event)
    }

    const onInstalled = () => {
      setInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)

    const media = window.matchMedia('(display-mode: standalone)')
    const onDisplayMode = () => setInstalled(detectInstalled())
    media.addEventListener('change', onDisplayMode)

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
      media.removeEventListener('change', onDisplayMode)
    }
  }, [])

  const canPromptInstall = Boolean(deferredPrompt)
  const canShowIosHelp = isIos && !installed && !canPromptInstall
  const showInstallButton = !installed && (canPromptInstall || canShowIosHelp)

  const install = useCallback(async () => {
    if (installed) return

    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice
      setDeferredPrompt(null)
      if (choice?.outcome === 'accepted') {
        setInstalled(true)
      }
      return
    }

    if (canShowIosHelp) {
      setIosHintOpen(true)
    }
  }, [canShowIosHelp, deferredPrompt, installed])

  const closeIosHint = useCallback(() => setIosHintOpen(false), [])

  return {
    installed,
    showInstallButton,
    install,
    iosHintOpen,
    closeIosHint,
    canPromptInstall,
    canShowIosHelp,
  }
}
