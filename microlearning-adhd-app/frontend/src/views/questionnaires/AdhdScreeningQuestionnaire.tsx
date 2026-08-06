import StudyActions from '../../components/StudyActions.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import LikertQuestionnaire from '../../components/evaluation/LikertQuestionnaire.tsx'
import { copy } from '../../content/copy.ts'
import { adhdScreening } from '../../content/adhdScreening.ts'
import type { LikertQuestionnaireProps } from './types.ts'

function AdhdScreeningQuestionnaire({
  values,
  error,
  isSubmitting,
  onChange,
  onSubmit,
}: LikertQuestionnaireProps) {
  return (
    <StudyPage ariaLabelledBy="adhd-title" cardClassName="study-card--questionnaire">
      <StudyHeading
        eyebrow={adhdScreening.heading.eyebrow}
        title={adhdScreening.heading.title}
        intro={adhdScreening.heading.intro}
        id="adhd-title"
      />

      <form
        className="study-form"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <LikertQuestionnaire
          modifier="adhd"
          title={adhdScreening.title}
          instructions={adhdScreening.instructions}
          questionColumnLabel={adhdScreening.table.questionColumn}
          scale={adhdScreening.scale}
          questions={adhdScreening.questions}
          values={values}
          error={error}
          onChange={onChange}
        />

        <StudyActions>
          <button type="submit" className="start-button" disabled={isSubmitting}>
            {isSubmitting ? copy.actions.saving : copy.actions.continue}
          </button>
        </StudyActions>
      </form>
    </StudyPage>
  )
}

export default AdhdScreeningQuestionnaire
