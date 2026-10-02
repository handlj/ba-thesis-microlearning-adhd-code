import '@assets/styles/components/ProgressPill.css'
type ProgressPillProps = {
  answered: number
  total: number
}

function ProgressPill({ answered, total }: ProgressPillProps) {
  const isComplete = answered === total

  return (
    <span className={isComplete ? 'progress-pill progress-pill--complete' : 'progress-pill'}>
      <span className="progress-pill__dot" />
      {answered} von {total} beantwortet
    </span>
  )
}

export default ProgressPill
