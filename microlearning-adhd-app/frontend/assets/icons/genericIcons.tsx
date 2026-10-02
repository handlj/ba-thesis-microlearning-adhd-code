import type { ReactNode } from 'react'

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

export const genericIcons: Record<string, ReactNode> = {
  clock: (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <circle cx="12" cy="12" r="9" {...strokeProps} />
      <path d="M12 7v5.2l3.4 2" {...strokeProps} />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2.5" {...strokeProps} />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" {...strokeProps} />
    </svg>
  ),
  headphones: (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path d="M4 15.5v-3a8 8 0 0 1 16 0v3" {...strokeProps} />
      <rect x="2.8" y="14.5" width="4.4" height="6.2" rx="2.2" {...strokeProps} />
      <rect x="16.8" y="14.5" width="4.4" height="6.2" rx="2.2" {...strokeProps} />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <circle cx="12" cy="12" r="9" {...strokeProps} />
      <path d="M10.2 8.6l5.4 3.4-5.4 3.4z" {...strokeProps} />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path d="M4.5 12.6l4.6 4.6L19.5 6.8" {...strokeProps} />
    </svg>
  ),
  target: (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <circle cx="12" cy="12" r="8.5" {...strokeProps} />
      <circle cx="12" cy="12" r="4" {...strokeProps} />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  cross: (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path d="M6.8 6.8l10.4 10.4M17.2 6.8L6.8 17.2" {...strokeProps} />
    </svg>
  ),
  exit: (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" {...strokeProps} />
      <path d="M9 8l-4 4 4 4M5 12h9" {...strokeProps} />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <rect x="3" y="5.5" width="18" height="13" rx="2.6" {...strokeProps} />
      <path d="M3.8 7.5l8.2 5.8 8.2-5.8" {...strokeProps} />
    </svg>
  ),
  help: (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <circle cx="12" cy="12" r="9" {...strokeProps} />
      <path d="M9.4 9.3a2.7 2.7 0 1 1 3.5 2.9c-.7.3-1.1.9-1.1 1.7v.5" {...strokeProps} />
      <path d="M12 17.4h.01" {...strokeProps} />
    </svg>
  ),
  gift: (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <rect x="3.5" y="8" width="17" height="4.5" rx="1.2" {...strokeProps} />
      <path d="M5 12.5v6.3a1.7 1.7 0 0 0 1.7 1.7h10.6a1.7 1.7 0 0 0 1.7-1.7v-6.3M12 8v12.5" {...strokeProps} />
      <path d="M12 8c-1.2-2.8-4.6-4-5.4-2.1C6 7.4 8.4 8 12 8zM12 8c1.2-2.8 4.6-4 5.4-2.1C18 7.4 15.6 8 12 8z" {...strokeProps} />
    </svg>
  ),
  copy: (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2.4" {...strokeProps} />
      <path d="M15.5 8.5V6.4A2.4 2.4 0 0 0 13.1 4H6.4A2.4 2.4 0 0 0 4 6.4v6.7a2.4 2.4 0 0 0 2.4 2.4h2.1" {...strokeProps} />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" width="18" height="18">
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" {...strokeProps} />
      <circle cx="12" cy="10" r="2.4" {...strokeProps} />
    </svg>
  ),
}

export type IconName = keyof typeof genericIcons
