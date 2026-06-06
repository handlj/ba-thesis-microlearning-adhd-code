import { type DemographicAnswers } from './groupAssignment'
import { copy } from '../content/copy'

export type ValidationResult =
  | { valid: true }
  | { valid: false; error: string }

export function validateDemographics(
  demographics: DemographicAnswers,
): ValidationResult {
  const allFilled = (Object.keys(demographics) as (keyof DemographicAnswers)[]).every(
    (key) => Boolean(demographics[key]),
  )

  if (!allFilled) {
    return {
      valid: false,
      error: copy.validation.demographicsAllQuestions,
    }
  }

  const parsedAge = Number(demographics.age)
  if (!Number.isInteger(parsedAge) || parsedAge < 13 || parsedAge > 120) {
    return {
      valid: false,
      error: copy.validation.demographicsAgeRange,
    }
  }

  return { valid: true }
}
