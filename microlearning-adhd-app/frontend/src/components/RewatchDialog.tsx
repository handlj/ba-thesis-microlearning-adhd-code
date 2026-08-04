import { useEffect, useRef } from 'react'
import { copy } from '../content/copy.ts'

type RewatchScore = {
  correct: number
  total: number
}

type RewatchDialogProps = {
  open: boolean
  score: RewatchScore | null
  attempt: number
  maxAttempts: number
  passThreshold: number
  onDismiss: () => void
}

function RewatchDialog({
  open,
  score,
  attempt,
  maxAttempts,
  passThreshold,
  onDismiss,
}: RewatchDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="rewatch-dialog"
      aria-labelledby="rewatch-dialog-title"
      onCancel={(event) => {
        event.preventDefault()
      }}
    >
      {score ? (
        <>
          <p className="rewatch-dialog__eyebrow">
            {copy.experimentalGroup.retry.attemptLabel(attempt, maxAttempts)}
          </p>

          <h2 id="rewatch-dialog-title" className="rewatch-dialog__title">
            {copy.experimentalGroup.retry.dialogTitle}
          </h2>

          <div className="rewatch-score">
            <p className="rewatch-score__value" aria-hidden="true">
              {score.correct}
              <span className="rewatch-score__total">
                {copy.experimentalGroup.retry.outOf(score.total)}
              </span>
            </p>

            <div className="rewatch-score__track" aria-hidden="true">
              <div className="rewatch-score__bar">
                <span
                  className="rewatch-score__bar-fill"
                  style={{
                    width: `${
                      score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0
                    }%`,
                  }}
                />
              </div>

              {score.total > 0 ? (
                <span
                  className="rewatch-score__threshold"
                  style={{
                    left: `${Math.min(100, Math.max(0, (passThreshold / score.total) * 100))}%`,
                  }}
                  title={copy.experimentalGroup.retry.thresholdMarkerLabel}
                />
              ) : null}
            </div>

            <p className="rewatch-score__caption" aria-hidden="true">
              {copy.experimentalGroup.retry.scoreCaption}
            </p>

            <p className="rewatch-score__threshold-caption" aria-hidden="true">
              <span className="rewatch-score__threshold-dot" />

              {copy.experimentalGroup.retry.thresholdLabel(passThreshold, score.total)}
            </p>

            <span className="sr-only">
              {copy.experimentalGroup.retry.srScore(score.correct, score.total)}{' '}
              {copy.experimentalGroup.retry.thresholdLabel(passThreshold, score.total)}
            </span>
          </div>

          <div className="rewatch-next">
            <p className="rewatch-next__title">{copy.experimentalGroup.retry.nextStepsTitle}</p>

            <ul className="rewatch-next__list">
              {copy.experimentalGroup.retry.nextSteps.map((step, index) => (
                <li key={index} className="rewatch-next__item">
                  <span className="rewatch-next__marker" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span className="rewatch-next__text">{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rewatch-dialog__actions">
            <button type="button" className="start-button" onClick={onDismiss}>
              {copy.actions.continue}
            </button>
          </div>
        </>
      ) : null}
    </dialog>
  )
}

export default RewatchDialog
