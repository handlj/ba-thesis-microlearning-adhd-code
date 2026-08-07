import { useEffect, useRef } from 'react'
import type { StudyInteractionPayload } from '../services'

const MIN_AWAY_MS = 500

const SIGNALS = {
  visibility: { away: 'tab_hidden', back: 'tab_visible' },
  focus: { away: 'window_blurred', back: 'window_focused' },
} as const

type AwaySignal = keyof typeof SIGNALS

type TabAwayLogOptions = {
  eventPrefix: string
  eventPayload?: StudyInteractionPayload
  onLogInteraction?: (eventType: string, payload?: StudyInteractionPayload) => void
}

export function useTabAwayLog({ eventPrefix, eventPayload, onLogInteraction }: TabAwayLogOptions) {
  const loggingRef = useRef({ onLogInteraction, eventPayload })
  useEffect(() => {
    loggingRef.current = { onLogInteraction, eventPayload }
  })

  useEffect(() => {
    const log = (eventType: string, extra: StudyInteractionPayload) => {
      const { onLogInteraction: handler, eventPayload: payload } = loggingRef.current
      handler?.(`${eventPrefix}_${eventType}`, { ...payload, ...extra })
    }

    const createTracker = (signal: AwaySignal) => {
      let startedAt: number | null = null
      let openTimer: number | null = null
      let isOpen = false

      return {
        start() {
          if (startedAt !== null) return
          startedAt = performance.now()

          openTimer = window.setTimeout(() => {
            openTimer = null
            isOpen = true
            log(SIGNALS[signal].away, {
              signal,
              isFullscreen: document.fullscreenElement !== null,
            })
          }, MIN_AWAY_MS)
        },

        end() {
          if (startedAt === null) return

          const awayMs = performance.now() - startedAt
          startedAt = null

          if (openTimer !== null) {
            window.clearTimeout(openTimer)
            openTimer = null
          }

          if (!isOpen) return
          isOpen = false

          log(SIGNALS[signal].back, {
            signal,
            awaySeconds: Math.round(awayMs / 100) / 10,
          })
        },

        dispose() {
          if (openTimer !== null) {
            window.clearTimeout(openTimer)
          }
        },
      }
    }

    const visibility = createTracker('visibility')
    const focus = createTracker('focus')

    const handleVisibilityChange = () => {
      if (document.hidden) {
        visibility.start()
        focus.end()
        return
      }

      visibility.end()
    }

    const handleBlur = () => {
      if (document.hidden) return
      focus.start()
    }

    const handleFocus = () => focus.end()

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)

    log('tab_monitoring_started', {
      isTouchDevice: navigator.maxTouchPoints > 0,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      minAwayMs: MIN_AWAY_MS,
    })

    return () => {
      visibility.dispose()
      focus.dispose()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
    }
  }, [eventPrefix])
}
