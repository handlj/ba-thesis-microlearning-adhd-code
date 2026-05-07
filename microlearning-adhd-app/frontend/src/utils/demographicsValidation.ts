import { type DemographicAnswers } from './groupAssignment'

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
      error: 'Please answer all questions before continuing.',
    }
  }

  if (!Number.isInteger(parsedAge) || parsedAge < 13 || parsedAge > 120) {
    return {
      valid: false,
      error: 'Please enter a valid age between 13 and 120.',
    }
  }

  return { valid: true }
}
