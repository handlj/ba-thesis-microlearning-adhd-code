import StudyActions from '../../components/StudyActions.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import FAM from '../../components/evaluation/FAM.tsx'
import { copy } from '../../content/copy.ts'

type FAMQuestionnaireProps = {
  values: Record<string, string>
  error: string | null
  onChange: (questionId: string, value: string) => void
  onSubmit: () => void
  onBack: () => void
}

function FAMQuestionnaire({
  values,
  error,
  onChange,
  onSubmit,
  onBack,
}: FAMQuestionnaireProps) {
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

export default FAMQuestionnaire
