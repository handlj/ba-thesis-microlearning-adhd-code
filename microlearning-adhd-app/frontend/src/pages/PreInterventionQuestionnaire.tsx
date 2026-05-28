import StudyActions from '../components/StudyActions.tsx'
import StudyHeading from '../components/StudyHeading.tsx'
import StudyPage from '../components/StudyPage.tsx'
import FAM from '../components/evaluation/FAM.tsx'
import { copy } from '../content/copy'

type PreInterventionQuestionnaireProps = {
  values: Record<string, string>
  error: string | null
  onChange: (questionId: string, value: string) => void
  onBack: () => void
  onSubmit: () => void
}

function PreInterventionQuestionnaire({
  values,
  error,
  onChange,
  onBack,
  onSubmit,
}: PreInterventionQuestionnaireProps) {
  return (
    <StudyPage
      ariaLabelledBy="pre-intervention-title"
      cardClassName="study-card--questionnaire"
    >
      <StudyHeading
        eyebrow={copy.preIntervention.heading.eyebrow}
        title={copy.preIntervention.heading.title}
        intro={copy.preIntervention.heading.intro}
        id="pre-intervention-title"
      />

      <form
        className="study-form"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <FAM values={values} error={error} onChange={onChange} />

        <StudyActions>
          <button type="button" className="secondary-button" onClick={onBack}>
            {copy.actions.back}
          </button>
          <button type="submit" className="start-button">
            {copy.actions.continue}
          </button>
        </StudyActions>
      </form>
    </StudyPage>
  )
}

export default PreInterventionQuestionnaire
