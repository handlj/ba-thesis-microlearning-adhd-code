import type { StudyQuestion } from '../../../components/forms/types.ts'
import { buildOptionsFromCopy } from '../../../components/forms/utils.ts'
import {
  DEMOGRAPHIC_QUESTIONS,
  type DemographicQuestionId,
  type DemographicSectionId,
} from '@content/pages/demographics.ts'

export const demographicQuestionSections = Object.fromEntries(
  DEMOGRAPHIC_QUESTIONS.map((q) => [q.id, q.section]),
) as Record<DemographicQuestionId, DemographicSectionId>

// Runtime Validation on Self-Gated Visibility Conditions of Demographic Questions
const alreadyProcessedDemographicQuestions = new Set<DemographicQuestionId>()
for (const question of DEMOGRAPHIC_QUESTIONS) {
  if (question.visibleIf && !alreadyProcessedDemographicQuestions.has(question.visibleIf.field)) {
    throw new Error(
      `Demographic question "${question.id}" self-gates its visibility condition via "${question.visibleIf.field}"`,
    )
  }
  alreadyProcessedDemographicQuestions.add(question.id)
}

export const demographicFormQuestions: StudyQuestion<DemographicQuestionId>[] =
  DEMOGRAPHIC_QUESTIONS.map((q): StudyQuestion<DemographicQuestionId> => {
    const base = {
      id: q.id,
      label: q.label,
      placeholder: q.placeholder,
      required: true,
    }

    return q.type === 'number' || q.type === 'text'
      ? { ...base, type: q.type }
      : { ...base, type: 'select', options: buildOptionsFromCopy(q.options ?? {}) }
  })
