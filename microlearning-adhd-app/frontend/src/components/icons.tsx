import type { ReactNode } from 'react'

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export const icons: Record<string, ReactNode> = {
  clock: (
    <svg viewBox="0 0 24 24" width="18" height="18" role="img">
      <circle cx="12" cy="12" r="9" {...strokeProps} />
      <path d="M12 7v5.2l3.4 2" {...strokeProps} />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" width="18" height="18" role="img">
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.5" {...strokeProps} />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" {...strokeProps} />
    </svg>
  ),
  headphones: (
    <svg viewBox="0 0 24 24" width="18" height="18" role="img">
      <path d="M4 15.5v-3a8 8 0 0 1 16 0v3" {...strokeProps} />
      <rect x="2.8" y="14.5" width="4.4" height="6.2" rx="2.2" {...strokeProps} />
      <rect x="16.8" y="14.5" width="4.4" height="6.2" rx="2.2" {...strokeProps} />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" width="18" height="18" role="img">
      <path d="M4.5 12.6l4.6 4.6L19.5 6.8" {...strokeProps} />
    </svg>
  ),
  exit: (
    <svg viewBox="0 0 24 24" width="18" height="18" role="img">
      <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" {...strokeProps} />
      <path d="M9 8l-4 4 4 4M5 12h9" {...strokeProps} />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" width="18" height="18" role="img">
      <rect x="3" y="5.5" width="18" height="13" rx="2.6" {...strokeProps} />
      <path d="M3.8 7.5l8.2 5.8 8.2-5.8" {...strokeProps} />
    </svg>
  ),
}

export type IconName = keyof typeof icons
