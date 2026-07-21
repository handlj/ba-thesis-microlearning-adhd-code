import type { ReactNode } from 'react'

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export const videoIcons: Record<string, ReactNode> = {
  play: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M8 5.5l11 6.5-11 6.5z" fill="currentColor" />
    </svg>
  ),
  pause: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <rect x="7" y="5" width="3.6" height="14" rx="1.4" fill="currentColor" />
      <rect x="13.4" y="5" width="3.6" height="14" rx="1.4" fill="currentColor" />
    </svg>
  ),
  replay: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M20 12a8 8 0 1 1-2.6-5.9" {...strokeProps} />
      <path d="M20 4v4h-4" {...strokeProps} />
    </svg>
  ),
  volume: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M4 9.5h3.2L12 5.6v12.8L7.2 14.5H4z" fill="currentColor" />
      <path d="M15.5 9.4a3.6 3.6 0 0 1 0 5.2" {...strokeProps} />
      <path d="M18.2 6.9a7.2 7.2 0 0 1 0 10.2" {...strokeProps} />
    </svg>
  ),
  volumeMuted: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M4 9.5h3.2L12 5.6v12.8L7.2 14.5H4z" fill="currentColor" />
      <path d="M16 9.8l4.4 4.4M20.4 9.8L16 14.2" {...strokeProps} />
    </svg>
  ),
  fullscreen: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M4 9V5.6A1.6 1.6 0 0 1 5.6 4H9" {...strokeProps} />
      <path d="M15 4h3.4A1.6 1.6 0 0 1 20 5.6V9" {...strokeProps} />
      <path d="M20 15v3.4a1.6 1.6 0 0 1-1.6 1.6H15" {...strokeProps} />
      <path d="M9 20H5.6A1.6 1.6 0 0 1 4 18.4V15" {...strokeProps} />
    </svg>
  ),
  fullscreenExit: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M9 4v3.4A1.6 1.6 0 0 1 7.4 9H4" {...strokeProps} />
      <path d="M20 9h-3.4A1.6 1.6 0 0 1 15 7.4V4" {...strokeProps} />
      <path d="M15 20v-3.4a1.6 1.6 0 0 1 1.6-1.6H20" {...strokeProps} />
      <path d="M4 15h3.4A1.6 1.6 0 0 1 9 16.6V20" {...strokeProps} />
    </svg>
  ),
  speed: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M4.6 17.4a8.6 8.6 0 1 1 14.8 0" {...strokeProps} />
      <path d="M12 13.2l4-4.2" {...strokeProps} />
      <circle cx="12" cy="14.2" r="1.5" fill="currentColor" />
    </svg>
  ),
}
