import { type DemographicAnswers } from '../../utils/groupAssignment.ts'
import { StudyForm, type FormAnswerValue } from '../../components/forms/index.ts'
import StudyActions from '../../components/StudyActions.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import { copy } from '../../content/copy.ts'
import { demographicQuestions } from '../../content/demographics.ts'

import { getAppConfig } from '../../utils/config.ts'

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
  const appConfig = getAppConfig()
  const isStudying = values.currentlyStudying === 'yes'
  const isDiagnosed = values.adhdDiagnosis === 'diagnosed'
  const visibleQuestions = demographicQuestions
    .filter((q) => q.id !== 'studyBackground' || isStudying)
    .filter((q) => q.id !== 'adhdOfficialDiagnosis' || isDiagnosed)
    .filter((q) => q.id !== 'adhdMedication' || isDiagnosed)

    .map((q) => (q.type === 'number' ? { ...q, min: appConfig.min_age, max: appConfig.max_age } : q))


  const handleChange = (field: keyof DemographicAnswers, value: string) => {
    onChange(field, value)
    if (field === 'currentlyStudying') {
      if (value === 'no') {
        onChange('studyBackground', 'not-studying')
      }
      else if (value === 'yes') {
        onChange('studyBackground', '')
      }
    }
    else if (field === 'adhdDiagnosis') {
      if (value !== 'diagnosed') {
        onChange('adhdOfficialDiagnosis', 'not-diagnosed')
        onChange('adhdMedication', 'not-diagnosed')
      }
      else {
        onChange('adhdOfficialDiagnosis', '')
        onChange('adhdMedication', '')
      }
    }
  }

  return (
    <StudyPage ariaLabelledBy="demographics-title" cardClassName="study-card--form">
      <StudyHeading
        eyebrow={copy.demographics.heading.eyebrow}
        title={copy.demographics.heading.title}
        intro={copy.demographics.heading.intro}
        id="demographics-title"
      />

      <StudyForm
        questions={visibleQuestions}
        values={values}
        error={error}
        onChange={(field, value: FormAnswerValue) => {
          if (!Array.isArray(value)) {
            handleChange(field, value)
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
