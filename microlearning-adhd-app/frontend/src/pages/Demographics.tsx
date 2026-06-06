import { type DemographicAnswers } from '../utils/groupAssignment'
import { StudyForm, type FormAnswerValue } from '../components/forms'
import StudyActions from '../components/StudyActions.tsx'
import StudyHeading from '../components/StudyHeading.tsx'
import StudyPage from '../components/StudyPage.tsx'
import { copy } from '../content/copy'
import { demographicQuestions } from '../content/demographics'

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
