import { useEffect } from 'react'

export function useReloadWarning(isActive: boolean) {
  useEffect(() => {
    if (!isActive) {
      return
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isActive])
}
