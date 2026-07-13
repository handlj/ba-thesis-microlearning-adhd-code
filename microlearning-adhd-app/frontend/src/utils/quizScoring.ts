import type { QuizTopic } from '../content/quiz.ts'
import type { QuizAnswers } from '../components/quiz/useQuizAnswers.ts'

export type QuizScore = {
  correctCount: number
  total: number
  passed: boolean
  wrongQuestionIds: string[]
  earliestWrongTimestamp: number
}

// A question counts as correct only if the selected option ids match the
// options marked `correct` exactly (questions have one-to-many correct
// answers, so partial selections are wrong).
export function scoreQuiz(
  topic: QuizTopic,
  answers: QuizAnswers,
  passThreshold: number,
): QuizScore {
  const wrongQuestions = topic.questions.filter((question) => {
    const correctIds = question.options
      .filter((option) => option.correct)
      .map((option) => option.id)
    const selectedIds = answers[question.id] ?? []

    return (
      selectedIds.length !== correctIds.length ||
      !correctIds.every((id) => selectedIds.includes(id))
    )
  })

  const total = topic.questions.length
  const correctCount = total - wrongQuestions.length

  return {
    correctCount,
    total,
    passed: correctCount >= passThreshold,
    wrongQuestionIds: wrongQuestions.map((question) => question.id),
    earliestWrongTimestamp:
      wrongQuestions.length > 0
        ? Math.min(...wrongQuestions.map((question) => question.videoTimestamp))
        : 0,
  }
}
