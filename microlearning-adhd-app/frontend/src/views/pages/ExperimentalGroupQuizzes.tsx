import { useEffect } from 'react'
import QuizQuestionField from '../../components/quiz/QuizQuestionField.tsx'
import { useQuizAnswers } from '../../components/quiz/useQuizAnswers.ts'
import type { QuizTopic } from '../../content/quiz.ts'
import type { StudyInteractionPayload } from '../../services/api.ts'

type ExperimentalGroupQuizzesProps = {
  topic: QuizTopic
  videoContext: StudyInteractionPayload
  onLogInteraction: (eventType: string, payload?: StudyInteractionPayload) => void
  onCompletionChange: (complete: boolean) => void
}

// Renders the quiz questions for a single topic after the matching video.
// The parent remounts this component per video (key={video.id}) so selection
// state resets between steps; completeness is reported up to gate the parent's
// "next" button.
function ExperimentalGroupQuizzes({
  topic,
  videoContext,
  onLogInteraction,
  onCompletionChange,
}: ExperimentalGroupQuizzesProps) {
  const { answers, isComplete, toggle } = useQuizAnswers(topic.questions)

  useEffect(() => {
    onCompletionChange(isComplete)
  }, [isComplete, onCompletionChange])

  const handleToggle = (questionId: string, optionId: string) => {
    const checked = toggle(questionId, optionId)
    onLogInteraction('experimental_quiz_answer_selected', {
      ...videoContext,
      topicId: topic.id,
      questionId,
      optionId,
      checked,
    })
  }

  return (
    <div className="quiz-panel">
      <p className="video-kicker">{topic.title}</p>
      <div className="quiz-question-list">
        {topic.questions.map((question, questionIndex) => (
          <QuizQuestionField
            key={question.id}
            question={question}
            index={questionIndex + 1}
            selected={answers[question.id] ?? []}
            onToggle={(optionId) => handleToggle(question.id, optionId)}
          />
        ))}
      </div>
    </div>
  )
}

export default ExperimentalGroupQuizzes
