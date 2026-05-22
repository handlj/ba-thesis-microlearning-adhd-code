import { type DemographicAnswers } from '../utils/groupAssignment'
import { StudyForm, type FormAnswerValue, type StudyQuestion } from '../components/forms'
import StudyActions from '../components/StudyActions.tsx'
import StudyHeading from '../components/StudyHeading.tsx'
import StudyPage from '../components/StudyPage.tsx'

type DemographicQuestionId = keyof DemographicAnswers

const demographicQuestions: StudyQuestion<DemographicQuestionId>[] = [
  {
    id: 'age',
    type: 'number',
    label: 'Age',
    placeholder: 'Enter your age',
    min: 13,
    max: 120,
    required: true,
  },
  {
    id: 'studyBackground',
    type: 'select',
    label: 'Study background',
    required: true,
    options: [
      { value: 'computer-science', label: 'Computer science' },
      { value: 'stem-other', label: 'Other STEM discipline' },
      { value: 'non-stem', label: 'Non-STEM discipline' },
      { value: 'not-studying', label: 'Not currently studying' },
    ],
  },
  {
    id: 'adhdDiagnosis',
    type: 'select',
    label: 'ADHD diagnosis status',
    required: true,
    options: [
      { value: 'diagnosed', label: 'Diagnosed' },
      { value: 'not-diagnosed', label: 'Not diagnosed' },
      { value: 'prefer-not-to-say', label: 'Prefer not to say' },
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
        eyebrow="Demographic questionnaire"
        title="Before we start the study tasks"
        intro="Please answer the following questions. These answers are used for deterministic group assignment in this pilot phase."
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
              Back
            </button>
            <button type="submit" className="start-button" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Continue'}
            </button>
          </StudyActions>
        }
      />
    </StudyPage>
  )
}

export type { DemographicAnswers }
export default Demographics
