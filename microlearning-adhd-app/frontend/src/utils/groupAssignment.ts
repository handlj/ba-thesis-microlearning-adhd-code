import type { copy } from '../content/copy'

export type GroupAssignment = 'control' | 'experimental'

export type DemographicAnswers = Record<keyof typeof copy.demographics.questions, string>
