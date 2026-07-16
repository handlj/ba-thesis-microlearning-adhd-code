type ProgressPillProps = {
  answered: number
  total: number
}

// Answered-so-far status, shared by the questionnaire and quiz sticky headers.
// Turns green once nothing is left open, so participants can see at a glance
// that the page is ready to submit.
function ProgressPill({ answered, total }: ProgressPillProps) {
  const isComplete = answered === total

  return (
    <span className={
            isComplete ? 
              'progress-pill progress-pill--complete' : 
              'progress-pill'
            }
          aria-live="polite">
      
      <span 
        className="progress-pill__dot"
        aria-hidden="true" 
      />

      {answered} von {total} beantwortet
    </span>
  )
}

export default ProgressPill
