import type { Page } from './pageOrder'

export const STEP_KEYS = [
  'consent',
  'demographics',
  'adhdScreening',
  'prePanas',
  'fam',
  'preQuiz',
  'postPanas',
  'ues',
  'followUp',
] as const satisfies readonly Page[]

export type StepKey = (typeof STEP_KEYS)[number]
export type StepError = Record<StepKey, string | null>

export const blankStepErrors = (): StepError =>
  Object.fromEntries(STEP_KEYS.map((key) => [key, null])) as StepError
