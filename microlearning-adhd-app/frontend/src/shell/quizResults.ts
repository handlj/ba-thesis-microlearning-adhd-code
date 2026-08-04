import type { QuizAnswers } from '../components/quiz/useQuizAnswers'
import { allQuizQuestions, type QuizTopic } from '../content/quiz'
import type { GroupAssignment } from '../utils/groupAssignment.ts'
import { scoreQuiz } from '../utils/quizScoring.ts'

export type QuizResults = {
  preCorrect: number | null
  controlPostCorrect: number | null
  experimentalTopicScores: Record<string, number>
}

export const blankQuizResults = (): QuizResults => ({
  preCorrect: null,
  controlPostCorrect: null,
  experimentalTopicScores: {},
})

export const scoreAllTopics = (answers: QuizAnswers) =>
  scoreQuiz({ questions: allQuizQuestions } as QuizTopic, answers, 0).correctCount

export const postCorrectFor = (results: QuizResults, assignment: GroupAssignment | null) => {
  if (!assignment) return null

  return assignment === 'control'
    ? (results.controlPostCorrect ?? 0)
    : Object.values(results.experimentalTopicScores).reduce((sum, score) => sum + score, 0)
}

export const hasCompleteScores = (results: QuizResults, assignment: GroupAssignment | null) => {
  if (!assignment) return false

  return (
    results.preCorrect !== null &&
    (assignment === 'control'
      ? results.controlPostCorrect !== null
      : Object.keys(results.experimentalTopicScores).length > 0)
  )
}
