import { useEffect, useRef } from 'react'
import type { LogInteraction } from '../shell/interactionLog.ts'

export type NavigationType = PerformanceNavigationTiming['type'] | 'unknown'

export function getNavigationType(): NavigationType {
  const [entry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
  return entry?.type ?? 'unknown'
}

type ReloadLogOptions = {
  isActive: boolean
  page: string
  restoredFromSnapshot: boolean
  hasSnapshot: () => boolean
  logInteraction: LogInteraction
}

export function useReloadLog({
  isActive,
  page,
  restoredFromSnapshot,
  hasSnapshot,
  logInteraction,
}: ReloadLogOptions) {
  const loggingRef = useRef({ page, restoredFromSnapshot, hasSnapshot, logInteraction })

  useEffect(() => {
    loggingRef.current = { page, restoredFromSnapshot, hasSnapshot, logInteraction }
  })

  const reloadLogged = useRef(false)

  useEffect(() => {
    if (!isActive || reloadLogged.current) return
    if (getNavigationType() !== 'reload') return

    reloadLogged.current = true

    const {
      page: reloadedPage,
      restoredFromSnapshot: restored,
      logInteraction: log,
    } = loggingRef.current

    log('study_page_reload', { page: reloadedPage, restored_from_snapshot: restored })
  }, [isActive])

  useEffect(() => {
    if (!isActive) return

    const handlePageHide = () => {
      const {
        page: currentPage,
        hasSnapshot: snapshotPresent,
        logInteraction: log,
      } = loggingRef.current

      log(
        'study_page_unload',
        {
          page: currentPage,
          has_snapshot: snapshotPresent(),
          document_navigation_type: getNavigationType(),
        },
        { keepAlive: true },
      )
    }

    window.addEventListener('pagehide', handlePageHide)

    return () => {
      window.removeEventListener('pagehide', handlePageHide)
    }
  }, [isActive])
}
