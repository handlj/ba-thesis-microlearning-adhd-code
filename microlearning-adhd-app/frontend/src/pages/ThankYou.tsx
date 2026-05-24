import StudyActions from '../components/StudyActions.tsx'
import StudyHeading from '../components/StudyHeading.tsx'
import StudyPage from '../components/StudyPage.tsx'

type ThankYouProps = {
  onReturnToStart: () => void
}

function ThankYou({ onReturnToStart }: ThankYouProps) {
  return (
    <StudyPage ariaLabelledBy="thank-you-title" cardClassName="study-card--ready">
      <StudyHeading
        eyebrow="Study complete"
        title="Thank you for completing the study."
        intro="Your responses have been submitted. If you have questions about this study, please contact study-contact@example.com."
        id="thank-you-title"
      />

      <StudyActions>
        <button type="button" className="start-button" onClick={onReturnToStart}>
          Return to start
        </button>
      </StudyActions>
    </StudyPage>
  )
}

export default ThankYou
