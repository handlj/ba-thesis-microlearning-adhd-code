import StudyActions from '../../components/StudyActions.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import LikertQuestionnaire from '../../components/evaluation/LikertQuestionnaire.tsx'
import { copy } from '../../content/copy.ts'
import { adhdScreening } from '../../content/adhdScreening.ts'

type AdhdScreeningQuestionnaireProps = {
  values: Record<string, string>
  error: string | null
  onChange: (questionId: string, value: string) => void
  onSubmit: () => void
  onBack?: () => void
}

function AdhdScreeningQuestionnaire({
  values,
  error,
  onChange,
  onSubmit,
  onBack,
}: AdhdScreeningQuestionnaireProps) {
  return (
    <StudyPage
      ariaLabelledBy="adhd-title"
      cardClassName="study-card--questionnaire"
    >
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
          {onBack && (
            <button type="button" 
                    className="secondary-button" 
                    onClick={onBack}>
              {copy.actions.back}
            </button>
          )}
          <button type="submit" 
                  className="start-button">
            {adhdScreening.actions.proceed}
          </button>
        </StudyActions>
      </form>
    </StudyPage>
  )
}

export default AdhdScreeningQuestionnaire
