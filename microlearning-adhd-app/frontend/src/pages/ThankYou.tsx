import StudyActions from '../components/StudyActions.tsx'
import StudyHeading from '../components/StudyHeading.tsx'
import StudyPage from '../components/StudyPage.tsx'
import { copy } from '../content/copy'

type ThankYouProps = {
  onReturnToStart: () => void
}

function ThankYou({ onReturnToStart }: ThankYouProps) {
  return (
    <StudyPage ariaLabelledBy="thank-you-title" cardClassName="study-card--ready">
      <StudyHeading
        eyebrow={copy.thankYou.heading.eyebrow}
        title={copy.thankYou.heading.title}
        intro={copy.thankYou.heading.intro}
        id="thank-you-title"
      />

      <StudyActions>
        <button type="button" className="start-button" onClick={onReturnToStart}>
          {copy.actions.returnToStart}
        </button>
      </StudyActions>
    </StudyPage>
  )
}

export default ThankYou
