import type { StudyQuestion } from '../components/forms'
import { buildOptionsFromCopy } from '../components/forms'
import { copy } from './copy'

export type DemographicQuestionId = keyof typeof copy.demographics.questions

type FieldConfig = { type: 'number' | 'text' }

const fieldConfig: Partial<Record<DemographicQuestionId, FieldConfig>> = {
  age: { type: 'number' },
  studyBackground: { type: 'text' },
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
      required: true,
    }
  }
  else if (config?.type === 'text') {
    return {
      id,
      type: 'text',
      label: q.label,
      ...('placeholder' in q && { placeholder: q.placeholder as string }),
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
