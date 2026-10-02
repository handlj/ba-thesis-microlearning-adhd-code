import StudyActions from '../../components/StudyActions.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import LikertQuestionnaire from '../../components/evaluation/LikertQuestionnaire.tsx'
import { actionsCopy } from '@content/common/actions.ts'
import { adhdScreening } from '@content/questionnaires/adhdScreening.ts'
import type { LikertQuestionnaireProps } from './types.ts'

function AdhdScreeningQuestionnaire({
  values,
  error,
  isSubmitting,
  onChange,
  onSubmit,
}: LikertQuestionnaireProps) {
  return (
    <StudyPage variant="questionnaire">
      <StudyHeading {...adhdScreening.heading} />

      <form
        className="study-form"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <LikertQuestionnaire
          modifier="adhd"
          scale={adhdScreening.scale}
          questions={adhdScreening.questions}
          values={values}
          error={error}
          onChange={onChange}
        />

        <StudyActions>
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? actionsCopy.saving : actionsCopy.continue}
          </button>
        </StudyActions>
      </form>
    </StudyPage>
  )
}

export default AdhdScreeningQuestionnaire
