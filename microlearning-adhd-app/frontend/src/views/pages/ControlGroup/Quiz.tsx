import StudyActions from '../../../components/StudyActions.tsx'
import QuizProgressHeader from '../../../components/quiz/QuizProgressHeader.tsx'
import QuizQuestionField from '../../../components/quiz/QuizQuestionField.tsx'
import { type QuizAnswers } from '../../../components/quiz/useQuizAnswers.ts'
import { type QuizQuestion } from '../../../content/quiz.ts'
import { copy } from '../../../content/copy.ts'

type QuizProps = {
  questions: QuizQuestion[]
  answers: QuizAnswers
  answeredCount: number
  total: number
  onToggle: (questionId: string, optionId: string) => void
  canSubmit: boolean
  onSubmit: () => void
  onBackToVideo: () => void
}

function Quiz({
  questions,
  answers,
  answeredCount,
  total,
  onToggle,
  canSubmit,
  onSubmit,
  onBackToVideo,
}: QuizProps) {
  return (
    <form
      className="study-form"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <QuizProgressHeader answered={answeredCount} total={total} />

      <div className="quiz-question-list">
        {questions.map((question, questionIndex) => (
          <QuizQuestionField
            key={question.id}
            question={question}
            index={questionIndex + 1}
            selected={answers[question.id] ?? []}
            onToggle={(optionId) => onToggle(question.id, optionId)}
          />
        ))}
      </div>

      <StudyActions>
        <button type="button" className="secondary-button" onClick={onBackToVideo}>
          {copy.actions.backToVideo}
        </button>

        <button type="submit" className="start-button" disabled={!canSubmit}>
          {copy.actions.continue}
        </button>
      </StudyActions>
    </form>
  )
}

export default Quiz
