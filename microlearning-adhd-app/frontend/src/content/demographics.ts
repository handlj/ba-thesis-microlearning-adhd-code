import { copy } from './copy'
import type { DemographicAnswers } from '../utils/groupAssignment'
import type { StudyQuestion } from '../components/forms'
import { buildOptionsFromCopy } from '../components/forms'

type DemographicQuestionId = keyof DemographicAnswers

export const demographicQuestions: StudyQuestion<DemographicQuestionId>[] = [
  {
    id: 'age',
    type: 'number',
    label: copy.demographics.questions.age.label,
    placeholder: copy.demographics.questions.age.placeholder,
    min: 13,
    max: 120,
    required: true,
  },
  {
    id: 'studyBackground',
    type: 'select',
    label: copy.demographics.questions.studyBackground.label,
    required: true,
    options: buildOptionsFromCopy(copy.demographics.questions.studyBackground.options),
  },
  {
    id: 'adhdDiagnosis',
    type: 'select',
    label: copy.demographics.questions.adhdDiagnosis.label,
    required: true,
    options: buildOptionsFromCopy(copy.demographics.questions.adhdDiagnosis.options),
  },
]
