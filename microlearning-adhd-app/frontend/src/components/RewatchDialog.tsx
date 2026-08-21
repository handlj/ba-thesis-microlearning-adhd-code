import { useEffect, useRef } from 'react'
import { genericIcons } from '@assets/icons/genericIcons.tsx'
import QuizOptionContent from './quiz/QuizOptionContent.tsx'
import { renderInlineCode } from './quiz/renderInlineCode.tsx'
import type { QuizAnswers } from './quiz/useQuizAnswers.ts'
import { formatDuration } from './video/formatDuration.ts'
import { copy } from '../content/copy.ts'
import type { QuizQuestion } from '../content/quiz.ts'
import { findChapterFromTimestamp, type VideoChapter } from '../content/videoChapters.ts'
import type { QuizScore } from '../utils/quizScoring.ts'

type RewatchDialogProps = {
  open: boolean
  score: QuizScore | null
  questions: readonly QuizQuestion[]
  submittedAnswers: QuizAnswers | null
  chapters: readonly VideoChapter[]
  showChapterHints: boolean
  onSeekToQuestion?: (question: QuizQuestion) => void
  attempt: number
  maxAttempts: number
  passThreshold: number
  onDismiss: () => void
}

type IndexedQuestion = {
  question: QuizQuestion
  index: number
}

type WrongQuestionProps = IndexedQuestion & {
  chapter: VideoChapter | null
  selectedOptionIds: readonly string[]
  onSeek?: (question: QuizQuestion) => void
}

function WrongQuestionInfo({
  question,
  index,
  chapter,
  selectedOptionIds,
  onSeek,
}: WrongQuestionProps) {
  const retry = copy.experimentalGroup.retry
  const isClickable = Boolean(onSeek)

  const header = (
    <>
      <span className="rewatch-review__marker" aria-hidden="true">
        {genericIcons.cross}
      </span>

      <span className="rewatch-review__body">
        <span className="rewatch-review__prompt">
          <span className="rewatch-review__number" aria-hidden="true">
            {index}
          </span>

          <span>{renderInlineCode(question.prompt)}</span>
        </span>

        {chapter ? (
          <span className="rewatch-review__hint" aria-hidden="true">
            {retry.chapterHint(chapter.title, formatDuration(question.videoTimestamp))}
          </span>
        ) : null}
      </span>

      {isClickable ? (
        <span className="rewatch-review__jump" aria-hidden="true">
          {genericIcons.play}
        </span>
      ) : null}
    </>
  )

  return (
    <li className="rewatch-review__item">
      {onSeek ? (
        <button
          type="button"
          className="rewatch-review__row rewatch-review__row--button"
          onClick={() => onSeek(question)}
        >
          {header}
        </button>
      ) : (
        <div className="rewatch-review__row">{header}</div>
      )}

      {question.code ? (
        <pre className="quiz-code rewatch-review__code">
          <code>{question.code}</code>
        </pre>
      ) : null}

      <p className="rewatch-review__options-label">{retry.reviewOptionsLabel}</p>

      <ul className="rewatch-review__options">
        {question.options.map((option) => {
          const isSelected = selectedOptionIds.includes(option.id)

          return (
            <li
              key={option.id}
              className={`rewatch-option${isSelected ? ' rewatch-option--selected' : ''}`}
            >
              <span className="rewatch-option__marker" aria-hidden="true">
                {isSelected ? genericIcons.check : null}
              </span>

              <QuizOptionContent option={option} />
            </li>
          )
        })}
      </ul>
    </li>
  )
}

function CorrectQuestionMarker({ items }: { items: IndexedQuestion[] }) {
  const retry = copy.experimentalGroup.retry

  return (
    <div className="rewatch-review__correct">
      <p className="rewatch-review__correct-label" aria-hidden="true">
        {retry.reviewCorrectLabel}
      </p>

      <ul className="rewatch-review__chips" aria-hidden="true">
        {items.map(({ question, index }) => (
          <li key={question.id} className="rewatch-review__chip">
            <span className="rewatch-review__chip-icon">{genericIcons.check}</span>
            {index}
          </li>
        ))}
      </ul>
    </div>
  )
}

function RewatchDialog({
  open,
  score,
  questions,
  submittedAnswers,
  chapters,
  showChapterHints,
  onSeekToQuestion,
  attempt,
  maxAttempts,
  passThreshold,
  onDismiss,
}: RewatchDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const retry = copy.experimentalGroup.retry

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      titleRef.current?.focus({ preventScroll: true })
      dialog.scrollTop = 0
    }

    if (!open && dialog.open) dialog.close()
  }, [open])

  const numbered = questions.map((question, index) => ({ question, index: index + 1 }))
  const wrong = score
    ? numbered.filter(({ question }) => score.wrongQuestionIds.includes(question.id))
    : []
  const correct = score
    ? numbered.filter(({ question }) => !score.wrongQuestionIds.includes(question.id))
    : []

  const hint = onSeekToQuestion
    ? `${retry.nextStepsCompact} ${retry.jumpStepCompact}`
    : retry.nextStepsCompact

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
          <p className="rewatch-dialog__eyebrow">{retry.attemptLabel(attempt, maxAttempts)}</p>

          <h2
            id="rewatch-dialog-title"
            className="rewatch-dialog__title"
            ref={titleRef}
            tabIndex={-1}
          >
            {retry.dialogTitle}
          </h2>

          <div className="rewatch-score">
            <p className="rewatch-score__value" aria-hidden="true">
              {score.correctCount}
              <span className="rewatch-score__total">{retry.outOf(score.total)}</span>
            </p>

            <div className="rewatch-score__track" aria-hidden="true">
              <div className="rewatch-score__bar">
                <span
                  className="rewatch-score__bar-fill"
                  style={{
                    width: `${
                      score.total > 0 ? Math.round((score.correctCount / score.total) * 100) : 0
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
                  title={retry.thresholdMarkerLabel}
                />
              ) : null}
            </div>

            <div className="rewatch-score__captions" aria-hidden="true">
              <p className="rewatch-score__caption">{retry.scoreCaption}</p>

              <p className="rewatch-score__threshold-caption">
                <span className="rewatch-score__threshold-dot" />

                {retry.thresholdLabel(passThreshold, score.total)}
              </p>
            </div>
          </div>

          {correct.length > 0 || wrong.length > 0 ? (
            <div className="rewatch-review">
              {correct.length > 0 ? <CorrectQuestionMarker items={correct} /> : null}

              {wrong.length > 0 ? (
                <>
                  <p className="rewatch-review__title">{retry.reviewWrongTitle}</p>

                  <ul className="rewatch-review__list">
                    {wrong.map(({ question, index }) => (
                      <WrongQuestionInfo
                        key={question.id}
                        question={question}
                        index={index}
                        chapter={
                          showChapterHints
                            ? findChapterFromTimestamp(chapters, question.videoTimestamp)
                            : null
                        }
                        selectedOptionIds={submittedAnswers?.[question.id] ?? []}
                        onSeek={onSeekToQuestion}
                      />
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          ) : null}

          <p className="rewatch-hint">{hint}</p>

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
