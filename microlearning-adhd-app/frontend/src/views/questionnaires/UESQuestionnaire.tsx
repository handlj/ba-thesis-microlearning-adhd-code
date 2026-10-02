import StudyActions from '../../components/StudyActions.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import LikertQuestionnaire from '../../components/evaluation/LikertQuestionnaire.tsx'
import { actionsCopy } from '@content/common/actions.ts'
import { ues } from '@content/questionnaires/ues.ts'
import type { LikertQuestionnaireProps } from './types.ts'

function UESQuestionnaire({
  values,
  error,
  isSubmitting,
  onChange,
  onSubmit,
}: LikertQuestionnaireProps) {
  return (
    <StudyPage variant="questionnaire">
      <StudyHeading {...ues.heading} />

      <form
        className="study-form"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <LikertQuestionnaire
          modifier="ues"
          scale={ues.scale}
          questions={ues.questions}
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

export default UESQuestionnaire
