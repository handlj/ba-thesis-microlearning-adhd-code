import { copy } from '../content/copy';
import { type DemographicAnswers } from './groupAssignment';

import { getAppConfig } from './config';

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

  const appConfig = getAppConfig()
  const parsedAge = Number(demographics.age)
  if (!Number.isInteger(parsedAge) || parsedAge < appConfig.min_age || parsedAge > appConfig.max_age) {
    return {
      valid: false,
      error: copy.validation.demographicsAgeRange(appConfig.min_age, appConfig.max_age),
    }
  }

  return { valid: true }
}
