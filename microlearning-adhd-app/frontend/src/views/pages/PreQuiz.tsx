import StudyActions from '../../components/StudyActions.tsx'
import QuizProgressHeader from '../../components/quiz/QuizProgressHeader.tsx'
import QuizQuestionField from '../../components/quiz/QuizQuestionField.tsx'
import { useQuizAnswers } from '../../components/quiz/useQuizAnswers.ts'
import { allQuizQuestions } from '../../content/quiz.ts'
import type { StudyInteractionPayload } from '../../services/index.ts'
import { copy } from '../../content/copy.ts'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'

type PreQuizProps = {
  onSubmit: () => void
  onBack: () => void
  onLogInteraction: (eventType: string, payload?: StudyInteractionPayload) => void
  onSubmitQuiz: (answers: Record<string, string[]>) => void
  error: string | null
}

function PreQuiz({
  onSubmit,
  onBack,
  onLogInteraction,
  onSubmitQuiz,
  error
}: PreQuizProps) {
  const { answers, isComplete, answeredCount, total, toggle } =
    useQuizAnswers(allQuizQuestions)

  const handleToggle = (questionId: string, optionId: string) => {
    const checked = toggle(questionId, optionId)
    onLogInteraction('pre_quiz_answer_selected', {
      questionId,
      optionId,
      checked,
    })
  }

  const handleSubmit = () => {
    if (!isComplete) {
      return
    }

    onLogInteraction('pre_quiz_submitted', {
      answers: JSON.stringify(answers),
    })
    onSubmitQuiz(answers)
    onSubmit()
  }

  return (
    <StudyPage
      ariaLabelledBy="preQuiz-title"
      cardClassName="study-card--video"
    >
      <StudyHeading
        eyebrow={copy.controlGroup.heading.eyebrow}
        title={copy.controlGroup.heading.quizTitle}
        intro={copy.controlGroup.heading.quizIntro}
        id="preQuiz-title"
      />
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

      {allQuizQuestions.map((question, questionIndex) => (
        <QuizQuestionField
          key={question.id}
          question={question}
          index={questionIndex + 1}
          selected={answers[question.id] ?? []}
          onToggle={(optionId) => handleToggle(question.id, optionId)}
        />
      ))}

      <StudyActions>
        <button type="button" 
                className="secondary-button" 
                onClick={onBack}>
          {copy.actions.back}
        </button>

        <button type="submit" 
                className="start-button" 
                disabled={!isComplete}>
          {copy.actions.continue}
        </button>
      </StudyActions>

      {error ? 
      <p className="error-text">
        {error}
      </p>
       : null}
    </form>
    </StudyPage>
  )
}

export default PreQuiz
