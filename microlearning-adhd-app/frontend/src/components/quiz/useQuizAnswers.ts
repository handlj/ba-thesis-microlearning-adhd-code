import { useState } from 'react'
import type { QuizQuestion } from '../../content/quiz.ts'
import { blankAnswersMultiSelect } from '../../utils/blankAnswers.ts'

export type QuizAnswers = Record<string, string[]>

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
      const next = willBeChecked ? [optionId] : []

      return { ...previousAnswers, [questionId]: next }
    })

    return willBeChecked
  }

  const reset = (nextQuestions: QuizQuestion[] = questions) => {
    setAnswers(blankAnswersMultiSelect(nextQuestions))
  }

  const resetKeeping = (keptQuestionIds: readonly string[]) => {
    setAnswers((previousAnswers) => ({
      ...blankAnswersMultiSelect(questions),
      ...Object.fromEntries(keptQuestionIds.map((id) => [id, previousAnswers[id] ?? []])),
    }))
  }

  return {
    answers,
    isComplete,
    answeredCount,
    total: questions.length,
    toggle,
    reset,
    resetKeeping,
  }
}
