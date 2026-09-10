import { useEffect, useId, useRef, type ReactNode } from 'react'
import { genericIcons } from '@assets/icons/genericIcons.tsx'
import QuizOptionContent from './quiz/QuizOptionContent.tsx'
import { renderInlineCode } from './quiz/renderInlineCode.tsx'
import type { QuizAnswers } from './quiz/useQuizAnswers.ts'
import { formatDuration } from './video/formatDuration.ts'
import { copy } from '../content/copy.ts'
import type { QuizQuestion } from '../content/quiz.ts'
import { findChapterFromTimestamp, type VideoChapter } from '../content/videoChapters.ts'
import type { QuizScore } from '../utils/quizScoring.ts'
import { withEmphasis } from '../utils/richText.tsx'

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

type SectionHeaderProps = {
  icon: ReactNode
  title: string
  note?: string
  tone?: 'correct'
}

function SectionHeader({ icon, title, note, tone }: SectionHeaderProps) {
  return (
    <div className="rewatch-card__header">
      <span
        className={`rewatch-card__badge${tone ? ` rewatch-card__badge--${tone}` : ''}`}
        aria-hidden="true"
      >
        {icon}
      </span>

      <div>
        <p className="rewatch-card__title">{title}</p>

        {note ? <p className="rewatch-card__note">{note}</p> : null}
      </div>
    </div>
  )
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
        {index}
      </span>

      <span className="rewatch-review__body">
        <span className="rewatch-review__prompt">{renderInlineCode(question.prompt)}</span>

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

      <ul className="rewatch-review__options">
        {question.options.map((option) => {
          const isSelected = selectedOptionIds.includes(option.id)

          return (
            <li
              key={option.id}
              className={`rewatch-option${isSelected ? ' rewatch-option--selected' : ''}`}
            >
              <span className="rewatch-option__marker" aria-hidden="true">
                {isSelected ? genericIcons.cross : null}
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
    <section className="rewatch-card" aria-hidden="true">
      <SectionHeader
        icon={genericIcons.check}
        title={retry.reviewCorrectTitle}
        note={retry.reviewCorrectNote(items.length)}
        tone="correct"
      />

      <ul className="rewatch-review__chips">
        {items.map(({ question, index }) => (
          <li key={question.id} className="rewatch-review__chip">
            <span className="rewatch-review__chip-icon">{genericIcons.check}</span>
            {index}
          </li>
        ))}
      </ul>
    </section>
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
  const titleId = useId()
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

  const wrongNote = onSeekToQuestion
    ? `${retry.reviewOptionsNote} ${retry.jumpStepCompact}`
    : retry.reviewOptionsNote

  return (
    <dialog
      ref={dialogRef}
      className="study-modal rewatch-dialog"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault()
      }}
    >
      {score ? (
        <>
          <p className="study-modal__eyebrow">{retry.attemptLabel(attempt, maxAttempts)}</p>

          <h2 id={titleId} className="study-modal__title" ref={titleRef} tabIndex={-1}>
            {retry.dialogTitle}
          </h2>

          <div className="rewatch-sections">
            <section className="rewatch-card">
              <SectionHeader icon={genericIcons.target} title={retry.reviewScoreTitle} />

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
            </section>

            {correct.length > 0 ? <CorrectQuestionMarker items={correct} /> : null}

            {wrong.length > 0 ? (
              <section className="rewatch-card">
                <SectionHeader
                  icon={genericIcons.cross}
                  title={retry.reviewWrongTitle}
                  note={wrongNote}
                />

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
              </section>
            ) : null}
          </div>

          <div className="study-modal__actions">
            <p className="status status-note">
              <span className="status-note__icon" aria-hidden="true">
                {genericIcons.play}
              </span>

              <span className="status-note__text">{withEmphasis(retry.nextStepsCompact)}</span>
            </p>

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
