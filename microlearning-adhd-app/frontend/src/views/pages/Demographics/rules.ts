import type { DemographicAnswers, DemographicQuestionId } from '../../../content/demographics'
import { DEMOGRAPHIC_QUESTIONS, demographicsCopy } from '../../../content/demographics'
import { getAppConfig } from '../../../utils/config'

export type DemographicValidationResult = { valid: true } | { valid: false; error: string }

export function resolveDemographicQuestionVisibility(
  answers: DemographicAnswers,
): Set<DemographicQuestionId> {
  const visibleQuestions = new Set<DemographicQuestionId>()

  for (const question of DEMOGRAPHIC_QUESTIONS) {
    const visibilityCondition = question.visibleIf
    const isQuestionVisible =
      !visibilityCondition ||
      (visibleQuestions.has(visibilityCondition.field) &&
        visibilityCondition.equals.includes(answers[visibilityCondition.field]))

    if (isQuestionVisible) visibleQuestions.add(question.id)
  }

  return visibleQuestions
}

export function reconcileDemographicAnswers(
  previous: DemographicAnswers,
  current: DemographicAnswers,
): DemographicAnswers {
  const previouslyVisibleQuestions = resolveDemographicQuestionVisibility(previous)
  const currentlyVisibleQuestions = resolveDemographicQuestionVisibility(current)

  return Object.fromEntries(
    DEMOGRAPHIC_QUESTIONS.map((q) => {
      if (!currentlyVisibleQuestions.has(q.id)) return [q.id, q.valueIfHidden ?? '']
      if (!previouslyVisibleQuestions.has(q.id)) return [q.id, '']
      return [q.id, current[q.id]]
    }),
  ) as DemographicAnswers
}

export function validateDemographicAnswers(
  answers: DemographicAnswers,
): DemographicValidationResult {
  const visibleQuestions = resolveDemographicQuestionVisibility(answers)

  if (![...visibleQuestions].every((qId) => Boolean(answers[qId]))) {
    return { valid: false, error: demographicsCopy.validation.allQuestions }
  }

  const { min_age: minAge, max_age: maxAge } = getAppConfig()
  const inputAge = Number(answers.age)

  if (!Number.isInteger(inputAge) || inputAge < minAge || inputAge > maxAge) {
    return { valid: false, error: demographicsCopy.validation.ageRange(minAge, maxAge) }
  }

  return { valid: true }
}
