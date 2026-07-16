import StudyActions from '../../components/StudyActions.tsx'
import QuizProgressHeader from '../../components/quiz/QuizProgressHeader.tsx'
import QuizQuestionField from '../../components/quiz/QuizQuestionField.tsx'
import { useQuizAnswers } from '../../components/quiz/useQuizAnswers.ts'
import { allQuizQuestions } from '../../content/quiz.ts'
import type { StudyInteractionPayload } from '../../services/index.ts'
import { copy } from '../../content/copy.ts'

type ControlGroupQuizProps = {
  onSubmit: () => void
  onBackToVideo: () => void
  onLogInteraction: (eventType: string, payload?: StudyInteractionPayload) => void
  onSubmitQuiz: (answers: Record<string, string[]>) => void
}

function ControlGroupQuiz({
  onSubmit,
  onBackToVideo,
  onLogInteraction,
  onSubmitQuiz,
}: ControlGroupQuizProps) {
  const { answers, isComplete, answeredCount, total, toggle } =
    useQuizAnswers(allQuizQuestions)

  const handleToggle = (questionId: string, optionId: string) => {
    const checked = toggle(questionId, optionId)
    onLogInteraction('control_quiz_answer_selected', {
      questionId,
      optionId,
      checked,
    })
  }

  const handleSubmit = () => {
    if (!isComplete) {
      return
    }

    onLogInteraction('control_quiz_submitted', {
      answers: JSON.stringify(answers),
    })
    onSubmitQuiz(answers)
    onSubmit()
  }

  return (
    <form
      className="study-form"
      onSubmit={(event) => {
        event.preventDefault()
        handleSubmit()
      }}
    >
      <QuizProgressHeader 
        answered={answeredCount} 
        total={total} 
      />

      <div className="quiz-question-list">
        {allQuizQuestions.map((question, questionIndex) => (
          <QuizQuestionField
            key={question.id}
            question={question}
            index={questionIndex + 1}
            selected={answers[question.id] ?? []}
            onToggle={(optionId) => handleToggle(question.id, optionId)}
          />
        ))}
      </div>

      <StudyActions>
        <button type="button" 
                className="secondary-button" 
                onClick={onBackToVideo}>
          {copy.actions.backToVideo}
        </button>

        <button type="submit" 
                className="start-button" 
                disabled={!isComplete}>
          {copy.actions.continue}
        </button>
      </StudyActions>
    </form>
  )
}

export default ControlGroupQuiz
