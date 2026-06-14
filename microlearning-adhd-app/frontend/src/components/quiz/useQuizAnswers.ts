import { useState } from 'react'
import type { QuizQuestion } from '../../content/quiz.ts'

export type QuizAnswers = Record<string, string[]>

const createEmptyAnswers = (questions: QuizQuestion[]): QuizAnswers =>
  questions.reduce<QuizAnswers>((answers, question) => {
    answers[question.id] = []
    return answers
  }, {})

// Shared multi-select answer state for the quiz screens (control + experimental).
// `toggle` keeps the state updater pure and returns the resulting checked state
// so callers can log the interaction exactly once, outside of React's updater
// (which StrictMode invokes twice in development).
export function useQuizAnswers(questions: QuizQuestion[]) {
  const [answers, setAnswers] = useState<QuizAnswers>(() =>
    createEmptyAnswers(questions),
  )

  const isComplete = questions.every(
    (question) => (answers[question.id]?.length ?? 0) > 0,
  )

  const toggle = (questionId: string, optionId: string): boolean => {
    const current = answers[questionId] ?? []
    const willBeChecked = !current.includes(optionId)

    setAnswers((previousAnswers) => {
      const previousCurrent = previousAnswers[questionId] ?? []
      const next = willBeChecked
        ? [...previousCurrent, optionId]
        : previousCurrent.filter((value) => value !== optionId)

      return { ...previousAnswers, [questionId]: next }
    })

    return willBeChecked
  }

  return { answers, isComplete, toggle }
}
