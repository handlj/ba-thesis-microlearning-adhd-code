import StudyActions from '../../components/StudyActions.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import LikertQuestionnaire from '../../components/evaluation/LikertQuestionnaire.tsx'
import { copy } from '../../content/copy.ts'
import { fam } from '../../content/fam.ts'
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
    <StudyPage
      ariaLabelledBy="fam-title"
      cardClassName="study-card--questionnaire"
    >
      <StudyHeading
        eyebrow={copy.preIntervention.heading.eyebrow}
        title={copy.preIntervention.heading.title}
        intro={copy.preIntervention.heading.intro}
        id="fam-title"
      />

      <form
        className="study-form"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <LikertQuestionnaire
          modifier="fam"
          title={fam.title}
          instructions={fam.instructions}
          questionColumnLabel={fam.table.questionColumn}
          scale={fam.scale}
          questions={fam.questions}
          values={values}
          error={error}
          onChange={onChange}
        />

        <StudyActions>
          {onBack && (
            <button type="button" 
                    className="secondary-button" 
                    onClick={onBack}
                    disabled={isSubmitting}>
              {copy.actions.back}
            </button>
          )}
                    
          <button type="submit" 
                  className="start-button"
                  disabled={isSubmitting}>
            { isSubmitting ? copy.actions.saving : copy.actions.continue }
          </button>
        </StudyActions>
      </form>
    </StudyPage>
  )
}

export default FAMQuestionnaire
