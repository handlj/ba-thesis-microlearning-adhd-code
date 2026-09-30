import '@assets/styles/components/Message.css'
import type { ReactNode } from 'react'

type Variant = 'error' | 'status'

const VARIANTS = {
  error: { className: 'message message--error' },
  status: { className: 'message message--status' },
} as const

type MessageProps = {
  variant: Variant
  children: ReactNode
}

function Message({ variant, children }: MessageProps) {
  if (children === null || children === undefined) return null

  const { className } = VARIANTS[variant]

  return <p className={className}>{children}</p>
}

export default Message
