import StudyActions from '../../components/StudyActions.tsx'
import QuizProgressHeader from '../../components/quiz/QuizProgressHeader.tsx'
import QuizQuestionField from '../../components/quiz/QuizQuestionField.tsx'
import { useQuizAnswers } from '../../components/quiz/useQuizAnswers.ts'
import { preQuizQuestions } from '../../content/quiz.ts'
import type { StudyInteractionPayload } from '../../services/index.ts'
import { actionsCopy } from '@content/common/actions.ts'
import { preQuizCopy } from '@content/pages/preQuiz.ts'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import Message from '../../components/Message.tsx'
import TextDialog from '../../components/TextDialog.tsx'
import { permuteQuestionOptions } from '../../utils/optionPermutation.ts'
import { useMemo, useState } from 'react'

type PreQuizProps = {
  onSubmit: () => void
  onLogInteraction: (eventType: string, payload?: StudyInteractionPayload) => void
  onSubmitQuiz: (answers: Record<string, string[]>) => void
  error: string | null
  participantId: string
}

function PreQuiz({ onSubmit, onLogInteraction, onSubmitQuiz, error, participantId }: PreQuizProps) {
  const [showTextDialog, setShowTextDialog] = useState(true)

  const questions = useMemo(
    () => permuteQuestionOptions(preQuizQuestions, participantId),
    [participantId],
  )

  const { answers, isComplete, answeredCount, total, toggle } = useQuizAnswers(questions)

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
    <StudyPage variant="video">
      <StudyHeading {...preQuizCopy.heading} />

      <TextDialog
        open={showTextDialog}
        {...preQuizCopy.dialog}
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
          {questions.map((question, questionIndex) => (
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
          <button type="submit" className="primary-button" disabled={!isComplete}>
            {actionsCopy.continue}
          </button>
        </StudyActions>

        <Message variant="error">{error}</Message>
      </form>
    </StudyPage>
  )
}

export default PreQuiz
