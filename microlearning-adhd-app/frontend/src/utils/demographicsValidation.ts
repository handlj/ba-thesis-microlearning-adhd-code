import { copy } from '../content/copy';
import { MAX_AGE, MIN_AGE } from './config';
import { type DemographicAnswers } from './groupAssignment';

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
  if (!Number.isInteger(parsedAge) || parsedAge < MIN_AGE || parsedAge > MAX_AGE) {
    return {
      valid: false,
      error: copy.validation.demographicsAgeRange,
    }
  }

  return { valid: true }
}
