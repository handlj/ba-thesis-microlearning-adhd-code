import StudyActions from '../../components/StudyActions.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import LikertQuestionnaire from '../../components/evaluation/LikertQuestionnaire.tsx'
import { actionsCopy } from '@content/common/actions.ts'
import { panas } from '@content/questionnaires/panas.ts'
import type { LikertQuestionnaireProps } from './types.ts'

function PanasQuestionnaire({
  values,
  error,
  isSubmitting,
  onChange,
  onSubmit,
  onBack,
}: LikertQuestionnaireProps) {
  return (
    <StudyPage variant="questionnaire">
      <StudyHeading {...panas.heading} />

      <form
        className="study-form"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <LikertQuestionnaire
          modifier="panas"
          scale={panas.scale}
          questions={panas.questions}
          values={values}
          error={error}
          onChange={onChange}
        />

        <StudyActions>
          {onBack && (
            <button
              type="button"
              className="secondary-button"
              onClick={onBack}
              disabled={isSubmitting}
            >
              {actionsCopy.back}
            </button>
          )}
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? actionsCopy.saving : actionsCopy.continue}
          </button>
        </StudyActions>
      </form>
    </StudyPage>
  )
}

export default PanasQuestionnaire
