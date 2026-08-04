import StudyActions from '../../components/StudyActions.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import LikertQuestionnaire from '../../components/evaluation/LikertQuestionnaire.tsx'
import { copy } from '../../content/copy.ts'
import { panas } from '../../content/panas.ts'
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
    <StudyPage ariaLabelledBy="panas-title" cardClassName="study-card--questionnaire">
      <StudyHeading
        eyebrow={panas.heading.eyebrow}
        title={panas.heading.title}
        intro={panas.heading.intro}
        id="panas-title"
      />

      <form
        className="study-form"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <LikertQuestionnaire
          modifier="panas"
          title={panas.title}
          instructions={panas.instructions}
          questionColumnLabel={panas.table.questionColumn}
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
              {copy.actions.back}
            </button>
          )}
          <button type="submit" className="start-button" disabled={isSubmitting}>
            {isSubmitting ? copy.actions.saving : copy.actions.continue}
          </button>
        </StudyActions>
      </form>
    </StudyPage>
  )
}

export default PanasQuestionnaire
