import { useEffect } from 'react'
import QuizProgressHeader from '../../components/quiz/QuizProgressHeader.tsx'
import QuizQuestionField from '../../components/quiz/QuizQuestionField.tsx'
import {
  useQuizAnswers,
  type QuizAnswers,
} from '../../components/quiz/useQuizAnswers.ts'
import type { QuizTopic } from '../../content/quiz.ts'
import type { StudyInteractionPayload } from '../../services/index.ts'

type ExperimentalGroupQuizzesProps = {
  topic: QuizTopic
  videoContext: StudyInteractionPayload
  onLogInteraction: (eventType: string, payload?: StudyInteractionPayload) => void
  onCompletionChange: (complete: boolean) => void
  onAnswersChange: (answers: QuizAnswers) => void
}

// Renders the quiz questions for a single topic after the matching video.
// The parent remounts this component per video and per attempt
// (key={`${video.id}-attempt-${attemptNumber}`}) so selection state resets
// between steps and retakes; completeness is reported up to gate the parent's
// "next" button.
function ExperimentalGroupQuizzes({
  topic,
  videoContext,
  onLogInteraction,
  onCompletionChange,
  onAnswersChange,
}: ExperimentalGroupQuizzesProps) {
  const { answers, isComplete, answeredCount, total, toggle } = useQuizAnswers(
    topic.questions,
  )

  useEffect(() => {
    onCompletionChange(isComplete)
  }, [isComplete, onCompletionChange])

  useEffect(() => {
    onAnswersChange(answers)
  }, [answers, onAnswersChange])

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
      <QuizProgressHeader 
        answered={answeredCount} 
        total={total} 
      />
      
      <p className="video-kicker">
        {topic.title}
      </p>
      
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
