import '@assets/styles/components/ProgressPill.css'
type ProgressPillProps = {
  answered: number
  total: number
}

function ProgressPill({ answered, total }: ProgressPillProps) {
  const isComplete = answered === total

  return (
    <span
      className={isComplete ? 'progress-pill progress-pill--complete' : 'progress-pill'}
      aria-live="polite"
    >
      <span className="progress-pill__dot" aria-hidden="true" />
      {answered} von {total} beantwortet
    </span>
  )
}

export default ProgressPill
