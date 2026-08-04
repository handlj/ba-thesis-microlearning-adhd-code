import { useState } from 'react'
import type { QuizQuestion } from '../../content/quiz.ts'
import { blankAnswersMultiSelect } from '../../utils/blankAnswers.ts'

export type QuizAnswers = Record<string, string[]>

// Shared multi-select answer state for the quiz screens (control + experimental).
// `toggle` keeps the state updater pure and returns the resulting checked state
// so callers can log the interaction exactly once, outside of React's updater
// (which StrictMode invokes twice in development).
export function useQuizAnswers(questions: QuizQuestion[]) {
  const [answers, setAnswers] = useState<QuizAnswers>(() => blankAnswersMultiSelect(questions))

  const answeredCount = questions.filter(
    (question) => (answers[question.id]?.length ?? 0) > 0,
  ).length
  const isComplete = answeredCount === questions.length

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

  const reset = (nextQuestions: QuizQuestion[] = questions) => {
    setAnswers(blankAnswersMultiSelect(nextQuestions))
  }

  return { answers, isComplete, answeredCount, total: questions.length, toggle, reset }
}
