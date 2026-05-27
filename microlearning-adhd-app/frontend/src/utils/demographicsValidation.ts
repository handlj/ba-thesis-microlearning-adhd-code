import { type DemographicAnswers } from './groupAssignment'
import { copy } from '../content/copy'

export type ValidationResult =
  | { valid: true }
  | { valid: false; error: string }

export function validateDemographics(
  demographics: DemographicAnswers,
): ValidationResult {
  const { age, studyBackground, adhdDiagnosis } = demographics
  const parsedAge = Number(age)

  if (!age || !studyBackground || !adhdDiagnosis) {
    return {
      valid: false,
      error: copy.validation.demographicsAllQuestions,
    }
  }

  if (!Number.isInteger(parsedAge) || parsedAge < 13 || parsedAge > 120) {
    return {
      valid: false,
      error: copy.validation.demographicsAgeRange,
    }
  }

  return { valid: true }
}
