import QuizProgressHeader from '../../../components/quiz/QuizProgressHeader.tsx'
import QuizQuestionField from '../../../components/quiz/QuizQuestionField.tsx'
import { type QuizAnswers } from '../../../components/quiz/useQuizAnswers.ts'
import type { QuizQuestion } from '../../../content/quiz.ts'

type QuizzesProps = {
  questions: QuizQuestion[]
  answers: QuizAnswers
  answeredCount: number
  total: number
  onToggle: (questionId: string, optionId: string) => void
  title: string
  sequence: string
}

function Quizzes({
  questions,
  answers,
  answeredCount,
  total,
  onToggle,
  title,
  sequence,
}: QuizzesProps) {
  return (
    <div className="quiz-panel">
      <QuizProgressHeader
        answered={answeredCount}
        total={total}
        topic={title}
        sequence={sequence}
      />

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
    </div>
  )
}

export default Quizzes
