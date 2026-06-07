import StudyActions from '../../components/StudyActions.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import LikertQuestionnaire from '../../components/evaluation/LikertQuestionnaire.tsx'
import { copy } from '../../content/copy.ts'
import { panas } from '../../content/panas.ts'

type PanasQuestionnaireProps = {
  values: Record<string, string>
  error: string | null
  onChange: (questionId: string, value: string) => void
  onSubmit: () => void
  onBack?: () => void
}

function PanasQuestionnaire({
  values,
  error,
  onChange,
  onSubmit,
  onBack,
}: PanasQuestionnaireProps) {
  return (
    <StudyPage
      ariaLabelledBy="panas-title"
      cardClassName="study-card--questionnaire"
    >
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
            <button type="button" className="secondary-button" onClick={onBack}>
              {copy.actions.back}
            </button>
          )}
          <button type="submit" className="start-button">
            {panas.actions.proceed}
          </button>
        </StudyActions>
      </form>
    </StudyPage>
  )
}

export default PanasQuestionnaire
