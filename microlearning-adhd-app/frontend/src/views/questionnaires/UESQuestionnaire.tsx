import StudyActions from '../../components/StudyActions.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import LikertQuestionnaire from '../../components/evaluation/LikertQuestionnaire.tsx'
import { copy } from '../../content/copy.ts'
import { ues } from '../../content/ues.ts'

type UESQuestionnaireProps = {
  values: Record<string, string>
  error: string | null
  isSubmitting: boolean
  onChange: (questionId: string, value: string) => void
  onSubmit: () => void
}

function UESQuestionnaire({ 
  values, 
  error, 
  isSubmitting, 
  onChange, 
  onSubmit
}: UESQuestionnaireProps) {
  return (
    <StudyPage
      ariaLabelledBy="ues-title"
      cardClassName="study-card--questionnaire"
    >
      <StudyHeading
        eyebrow={ues.heading.eyebrow}
        title={ues.heading.title}
        intro={ues.heading.intro}
        id="ues-title"
      />

      <form
        className="study-form"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <LikertQuestionnaire
          modifier="ues"
          title={ues.title}
          instructions={ues.instructions}
          questionColumnLabel={ues.table.questionColumn}
          scale={ues.scale}
          questions={ues.questions}
          values={values}
          error={error}
          onChange={onChange}
        />

        <StudyActions>
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

export default UESQuestionnaire
