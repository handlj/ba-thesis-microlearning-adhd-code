import type { ReactNode } from 'react'

type StudyActionsProps = {
  children: ReactNode
  className?: string
}

function StudyActions({ children, className }: StudyActionsProps) {
  const actionsClassName = className
    ? `study-actions ${className}`
    : 'study-actions'

  return <div className={actionsClassName}>{children}</div>
}

export default StudyActions