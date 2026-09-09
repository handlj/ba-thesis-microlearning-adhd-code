import StudyActions from '../../components/StudyActions.tsx'
import QuizProgressHeader from '../../components/quiz/QuizProgressHeader.tsx'
import QuizQuestionField from '../../components/quiz/QuizQuestionField.tsx'
import { useQuizAnswers } from '../../components/quiz/useQuizAnswers.ts'
import { preQuizQuestions } from '../../content/quiz.ts'
import type { StudyInteractionPayload } from '../../services/index.ts'
import { copy } from '../../content/copy.ts'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import Message from '../../components/Message.tsx'
import TextDialog from '../../components/TextDialog.tsx'
import { useState } from 'react'

type PreQuizProps = {
  onSubmit: () => void
  onLogInteraction: (eventType: string, payload?: StudyInteractionPayload) => void
  onSubmitQuiz: (answers: Record<string, string[]>) => void
  error: string | null
}

function PreQuiz({ onSubmit, onLogInteraction, onSubmitQuiz, error }: PreQuizProps) {
  const [showTextDialog, setShowTextDialog] = useState(true)

  const { answers, isComplete, answeredCount, total, toggle } = useQuizAnswers(preQuizQuestions)

  const handleToggle = (questionId: string, optionId: string) => {
    toggle(questionId, optionId)
  }

  const handleShowHint = () => {
    onLogInteraction('pre_quiz_hint_reopened')
    setShowTextDialog(true)
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
    <StudyPage ariaLabelledBy="preQuiz-title" cardClassName="study-card--video">
      <StudyHeading
        eyebrow={copy.preQuiz.heading.eyebrow}
        title={copy.preQuiz.heading.title}
        intro={copy.preQuiz.heading.intro}
        id="preQuiz-title"
      />

      <TextDialog
        open={showTextDialog}
        eyebrow={copy.preQuiz.dialog.eyebrow}
        title={copy.preQuiz.dialog.title}
        content={copy.preQuiz.dialog.content}
        onDismiss={() => {
          setShowTextDialog(false)
        }}
      />

      <form
        className="study-form"
        onSubmit={(event) => {
          event.preventDefault()
          handleSubmit()
        }}
      >
        <QuizProgressHeader answered={answeredCount} total={total} onHelp={handleShowHint} />

        <div className="quiz-question-list">
          {preQuizQuestions.map((question, questionIndex) => (
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
          <button type="submit" className="start-button" disabled={!isComplete}>
            {copy.actions.continue}
          </button>
        </StudyActions>

        <Message variant="error">{error}</Message>
      </form>
    </StudyPage>
  )
}

export default PreQuiz
