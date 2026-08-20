import { StudyForm } from '../../../components/forms/index.ts'
import StudyActions from '../../../components/StudyActions.tsx'
import StudyHeading from '../../../components/StudyHeading.tsx'
import StudyPage from '../../../components/StudyPage.tsx'
import { copy } from '../../../content/copy.ts'
import {
  demographicsCopy,
  type DemographicAnswers,
  type DemographicQuestionId,
} from '../../../content/demographics.ts'
import { useDemographics } from './useDemographics.ts'

export type DemographicProps = {
  values: DemographicAnswers
  error: string | null
  isSubmitting: boolean
  onChange: (field: DemographicQuestionId, value: string) => void
  onBack: () => void
  onSubmit: () => void
}

function Demographics(props: DemographicProps) {
  const { values, error, isSubmitting, onBack, onSubmit } = props
  const { visibleFormQuestions, handleChange } = useDemographics(props)

  return (
    <StudyPage ariaLabelledBy="demographics-title" cardClassName="study-card--form">
      <StudyHeading
        eyebrow={demographicsCopy.heading.eyebrow}
        title={demographicsCopy.heading.title}
        intro={demographicsCopy.heading.intro}
        id="demographics-title"
      />

      <StudyForm
        questions={visibleFormQuestions}
        values={values}
        error={error}
        onChange={handleChange}
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

export default Demographics
