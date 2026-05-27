import { type DemographicAnswers } from '../utils/groupAssignment'
import { StudyForm, type FormAnswerValue, type StudyQuestion } from '../components/forms'
import StudyActions from '../components/StudyActions.tsx'
import StudyHeading from '../components/StudyHeading.tsx'
import StudyPage from '../components/StudyPage.tsx'
import { copy } from '../content/copy'

type DemographicQuestionId = keyof DemographicAnswers

const demographicQuestions: StudyQuestion<DemographicQuestionId>[] = [
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
    options: [
      {
        value: 'computer-science',
        label: copy.demographics.questions.studyBackground.options.computerScience,
      },
      {
        value: 'stem-other',
        label: copy.demographics.questions.studyBackground.options.stemOther,
      },
      {
        value: 'non-stem',
        label: copy.demographics.questions.studyBackground.options.nonStem,
      },
      {
        value: 'not-studying',
        label: copy.demographics.questions.studyBackground.options.notStudying,
      },
    ],
  },
  {
    id: 'adhdDiagnosis',
    type: 'select',
    label: copy.demographics.questions.adhdDiagnosis.label,
    required: true,
    options: [
      {
        value: 'diagnosed',
        label: copy.demographics.questions.adhdDiagnosis.options.diagnosed,
      },
      {
        value: 'not-diagnosed',
        label: copy.demographics.questions.adhdDiagnosis.options.notDiagnosed,
      },
      {
        value: 'prefer-not-to-say',
        label: copy.demographics.questions.adhdDiagnosis.options.preferNotToSay,
      },
    ],
  },
]

type DemographicsProps = {
  values: DemographicAnswers
  error: string | null
  isSubmitting: boolean
  onChange: (field: keyof DemographicAnswers, value: string) => void
  onBack: () => void
  onSubmit: () => void
}

function Demographics({
  values,
  error,
  isSubmitting,
  onChange,
  onBack,
  onSubmit,
}: DemographicsProps) {
  return (
    <StudyPage ariaLabelledBy="demographics-title" cardClassName="study-card--form">
      <StudyHeading
        eyebrow={copy.demographics.heading.eyebrow}
        title={copy.demographics.heading.title}
        intro={copy.demographics.heading.intro}
        id="demographics-title"
      />

      <StudyForm
        questions={demographicQuestions}
        values={values}
        error={error}
        onChange={(field, value: FormAnswerValue) => {
          if (!Array.isArray(value)) {
            onChange(field, value)
          }
        }}
        onSubmit={onSubmit}
        actions={
          <StudyActions>
            <button
              type="button"
              className="secondary-button"
              onClick={onBack}
              disabled={isSubmitting}
            >
              {copy.actions.back}
            </button>
            <button type="submit" className="start-button" disabled={isSubmitting}>
              {isSubmitting ? copy.actions.saving : copy.actions.continue}
            </button>
          </StudyActions>
        }
      />
    </StudyPage>
  )
}

export type { DemographicAnswers }
export default Demographics
