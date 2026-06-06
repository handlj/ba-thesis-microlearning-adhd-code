import { copy } from './copy'
import type { StudyQuestion } from '../components/forms'
import { buildOptionsFromCopy } from '../components/forms'

export type DemographicQuestionId = keyof typeof copy.demographics.questions

type NumberFieldConfig = { type: 'number'; min?: number; max?: number }

const fieldConfig: Partial<Record<DemographicQuestionId, NumberFieldConfig>> = {
  age: { type: 'number', min: 13, max: 120 },
}

export const demographicQuestions: StudyQuestion<DemographicQuestionId>[] = (
  Object.keys(copy.demographics.questions) as DemographicQuestionId[]
).map((id) => {
  const q = copy.demographics.questions[id]
  const config = fieldConfig[id]

  if (config?.type === 'number') {
    return {
      id,
      type: 'number',
      label: q.label,
      ...('placeholder' in q && { placeholder: q.placeholder as string }),
      min: config.min,
      max: config.max,
      required: true,
    }
  }

  return {
    id,
    type: 'select',
    label: q.label,
    ...('placeholder' in q && { placeholder: q.placeholder as string }),
    options: 'options' in q ? buildOptionsFromCopy(q.options as Record<string, string>) : [],
    required: true,
  }
})
