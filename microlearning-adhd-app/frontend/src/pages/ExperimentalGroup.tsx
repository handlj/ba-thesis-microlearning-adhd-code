import StudyActions from '../components/StudyActions.tsx'
import StudyHeading from '../components/StudyHeading.tsx'
import StudyPage from '../components/StudyPage.tsx'

type ExperimentalGroupProps = {
  onBackToStart: () => void
}

function ExperimentalGroup({ onBackToStart }: ExperimentalGroupProps) {
  return (
    <StudyPage ariaLabelledBy="experimental-title" cardClassName="study-card--video">
      <StudyHeading
        eyebrow="Experimental group"
        title="Experimental page coming next"
        intro="This branch is wired into the flow so the ready page can route correctly, but the experimental content will be added in the next pass."
        id="experimental-title"
      />

      <StudyActions className="study-actions--stacked">
        <button type="button" className="secondary-button" onClick={onBackToStart}>
          Return to welcome
        </button>
      </StudyActions>
    </StudyPage>
  )
}

export default ExperimentalGroup