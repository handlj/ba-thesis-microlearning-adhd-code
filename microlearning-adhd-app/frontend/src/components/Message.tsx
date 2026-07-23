import type { ReactNode } from 'react'

type Variant = 'error' | 'status'

const VARIANTS = {
  error: { className: 'error-text' },
  status: { className: 'status-text' },
} as const

type MessageProps = {
  variant: Variant
  children: ReactNode
}

function Message({ variant, children }: MessageProps) {
  if (children === null || children === undefined) return null

  const { className } = VARIANTS[variant]

  return (
    <p className={className}>
      {children}
    </p>
  )
}

export default Message
