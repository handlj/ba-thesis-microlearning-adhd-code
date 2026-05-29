import { useState } from 'react'
import StudyActions from '../components/StudyActions.tsx'
import StudyHeading from '../components/StudyHeading.tsx'
import StudyPage from '../components/StudyPage.tsx'
import FAM from '../components/evaluation/FAM.tsx'
import PANAS from '../components/evaluation/PANAS.tsx'
import { copy } from '../content/copy'
import { panas } from '../content/panas'

type PreInterventionQuestionnaireProps = {
  values: Record<string, string>
  panasValues: Record<string, string>
  error: string | null
  panasError: string | null
  onChange: (questionId: string, value: string) => void
  onPanasChange: (questionId: string, value: string) => void
  onPanasProceed: () => boolean
  onBack: () => void
  onSubmit: () => void
}

function PreInterventionQuestionnaire({
  values,
  panasValues,
  error,
  panasError,
  onChange,
  onPanasChange,
  onPanasProceed,
  onBack,
  onSubmit,
}: PreInterventionQuestionnaireProps) {
  const [isShowingFam, setIsShowingFam] = useState(false)

  if (!isShowingFam) {
    return (
      <StudyPage
        ariaLabelledBy="pre-intervention-title"
        cardClassName="study-card--questionnaire"
      >
        <StudyHeading
          eyebrow={panas.heading.eyebrow}
          title={panas.heading.title}
          intro={panas.heading.intro}
          id="pre-intervention-title"
        />

        <form
          className="study-form"
          onSubmit={(event) => {
            event.preventDefault()
            if (onPanasProceed()) {
              setIsShowingFam(true)
            }
          }}
        >
          <PANAS values={panasValues} error={panasError} onChange={onPanasChange} />

          <StudyActions>
            <button type="submit" className="start-button">
              {panas.actions.proceed}
            </button>
          </StudyActions>
        </form>
      </StudyPage>
    )
  }

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
