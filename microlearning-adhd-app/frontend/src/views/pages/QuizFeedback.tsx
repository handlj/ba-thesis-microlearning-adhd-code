import StudyActions from '../../components/StudyActions.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import { copy } from '../../content/copy.ts'
import { allQuizQuestions } from '../../content/quiz.ts'
import { type GroupAssignment } from '../../utils/groupAssignment.ts'

type QuizFeedbackProps = {
  assignment: GroupAssignment
  preCorrect: number
  postCorrect: number
  onContinue: () => void
}

type FeedbackStatProps = {
  label: string
  correct: number
  total: number
  variant: 'before' | 'after'
}

function FeedbackStat({ label, correct, total, variant }: FeedbackStatProps) {
  const fillPercent = total > 0 ? Math.round((correct / total) * 100) : 0

  return (
    <div className={`feedback-stat feedback-stat--${variant}`}>
      <p className="feedback-stat__label">{label}</p>
      <p className="feedback-stat__value" aria-hidden="true">
        {correct}
        <span className="feedback-stat__total">{copy.quizFeedback.outOf(total)}</span>
      </p>
      <div className="feedback-stat__bar" aria-hidden="true">
        <span
          className="feedback-stat__bar-fill"
          style={{ width: `${fillPercent}%` }}
        />
      </div>
      <p className="feedback-stat__caption" aria-hidden="true">
        {copy.quizFeedback.scoreCaption}
      </p>
      <span className="sr-only">
        {copy.quizFeedback.srScore(label, correct, total)}
      </span>
    </div>
  )
}

function QuizFeedback({
  assignment,
  preCorrect,
  postCorrect,
  onContinue,
}: QuizFeedbackProps) {
  const total = allQuizQuestions.length
  const afterLabel =
    assignment === 'control'
      ? copy.quizFeedback.afterLabelControl
      : copy.quizFeedback.afterLabelExperimental

  // Relative improvement, shown only when the participant actually improved
  // (omitted for pre = 0, no change, or a worse result).
  const showImprovement = preCorrect > 0 && postCorrect > preCorrect
  const improvementPercent = showImprovement
    ? Math.round(((postCorrect - preCorrect) / preCorrect) * 100)
    : 0

  return (
    <StudyPage
      ariaLabelledBy="quiz-feedback-title"
      cardClassName="study-card--ready"
    >
      <StudyHeading
        eyebrow={copy.quizFeedback.heading.eyebrow}
        title={copy.quizFeedback.heading.title}
        intro={copy.quizFeedback.heading.intro}
        id="quiz-feedback-title"
      />

      <div className="feedback-scores">
        <FeedbackStat
          label={copy.quizFeedback.beforeLabel}
          correct={preCorrect}
          total={total}
          variant="before"
        />
        <FeedbackStat
          label={afterLabel}
          correct={postCorrect}
          total={total}
          variant="after"
        />
      </div>

      {showImprovement ? (
        <div  className="feedback-delta" 
              role="status">
          
          <span className="feedback-delta__icon" 
                aria-hidden="true">
            
            <svg viewBox="0 0 24 24" width="18" height="18" role="img">
              <path
                d="M12 19V6M6 12l6-6 6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          
          <span className="feedback-delta__value">
            +{improvementPercent}&nbsp;%
          </span>
          
          <span className="feedback-delta__label">
            {copy.quizFeedback.improvementLabel}
          </span>
        </div>
      ) : null}

      <StudyActions>
        <button type="button" 
                className="start-button" 
                onClick={onContinue}>
          {copy.actions.continue}
        </button>
      </StudyActions>
    </StudyPage>
  )
}

export default QuizFeedback
