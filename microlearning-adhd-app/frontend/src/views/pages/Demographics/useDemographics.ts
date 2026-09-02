import type { FormAnswerValue, FormSectionDefinition } from '../../../components/forms'
import type { DemographicQuestionId } from '../../../content/demographics'
import {
  DEMOGRAPHIC_QUESTIONS,
  DEMOGRAPHIC_SECTIONS,
  demographicFormQuestions,
  demographicQuestionSections,
} from '../../../content/demographics'
import { getAppConfig } from '../../../utils/config'
import type { DemographicProps } from './index'
import { reconcileDemographicAnswers, resolveDemographicQuestionVisibility } from './rules'

export function useDemographics({ values, onChange }: DemographicProps) {
  const { min_age: minAge, max_age: maxAge } = getAppConfig()
  const visibleQuestions = resolveDemographicQuestionVisibility(values)

  const visibleFormQuestions = demographicFormQuestions
    .filter((q) => visibleQuestions.has(q.id))
    .map((q) => (q.type === 'number' ? { ...q, min: minAge, max: maxAge } : q))

  const visibleFormSections: FormSectionDefinition<DemographicQuestionId>[] =
    DEMOGRAPHIC_SECTIONS.map((section) => ({
      id: section.id,
      title: section.title,
      questions: visibleFormQuestions.filter(
        (q) => demographicQuestionSections[q.id] === section.id,
      ),
    })).filter((section) => section.questions.length > 0)

  const handleChange = (field: DemographicQuestionId, value: FormAnswerValue) => {
    if (Array.isArray(value)) return

    const reconciledAnswers = reconcileDemographicAnswers(values, { ...values, [field]: value })

    for (const question of DEMOGRAPHIC_QUESTIONS) {
      const nextValue = reconciledAnswers[question.id]
      if (nextValue !== values[question.id]) onChange(question.id, nextValue)
    }
  }

  return { visibleFormSections, handleChange }
}
