import StudyActions from '../../components/StudyActions.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import LikertQuestionnaire from '../../components/evaluation/LikertQuestionnaire.tsx'
import { actionsCopy } from '@content/common/actions.ts'
import { fam } from '@content/questionnaires/fam.ts'
import type { LikertQuestionnaireProps } from './types.ts'

function FAMQuestionnaire({
  values,
  error,
  isSubmitting,
  onChange,
  onSubmit,
  onBack,
}: LikertQuestionnaireProps) {
  return (
    <StudyPage ariaLabelledBy="fam-title" variant="questionnaire">
      <StudyHeading {...fam.heading} id="fam-title" />

      <form
        className="study-form"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <LikertQuestionnaire
          modifier="fam"
          scale={fam.scale}
          questions={fam.questions}
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

export default FAMQuestionnaire
