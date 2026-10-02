import { StudyForm } from '../../../components/forms/index.ts'
import StudyActions from '../../../components/StudyActions.tsx'
import StudyHeading from '../../../components/StudyHeading.tsx'
import StudyPage from '../../../components/StudyPage.tsx'
import { actionsCopy } from '@content/common/actions.ts'
import {
  demographicsCopy,
  type DemographicAnswers,
  type DemographicQuestionId,
} from '@content/pages/demographics.ts'
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
  const { visibleFormSections, handleChange } = useDemographics(props)

  return (
    <StudyPage variant="form">
      <StudyHeading {...demographicsCopy.heading} />

      <StudyForm
        sections={visibleFormSections}
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
              {actionsCopy.back}
            </button>

            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? actionsCopy.saving : actionsCopy.continue}
            </button>
          </StudyActions>
        }
      />
    </StudyPage>
  )
}

export default Demographics
