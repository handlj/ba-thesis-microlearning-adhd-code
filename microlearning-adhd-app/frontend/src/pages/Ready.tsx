import StudyActions from '../components/StudyActions.tsx'
import StudyHeading from '../components/StudyHeading.tsx'
import StudyPage from '../components/StudyPage.tsx'
import { copy } from '../content/copy'
import { type GroupAssignment } from '../utils/groupAssignment'

type ReadyProps = {
  assignment: GroupAssignment | null
  onContinue: () => void
  onReturnToWelcome: () => void
}

function Ready({ assignment, onContinue, onReturnToWelcome }: ReadyProps) {
  const assignmentLabel = assignment
    ? copy.ready.groupLabels[assignment]
    : null

  return (
    <StudyPage ariaLabelledBy="ready-title" cardClassName="study-card--ready">
      <StudyHeading
        eyebrow={copy.ready.heading.eyebrow}
        title={copy.ready.heading.title}
        intro={copy.ready.heading.intro}
        id="ready-title"
      />
      <StudyActions>
        {assignmentLabel ? (
          <p className="assignment-result">
            {copy.ready.assignmentLabel} <strong>{assignmentLabel}</strong>
          </p>
        ) : null}
        <button
          type="button"
          className="start-button"
          onClick={onContinue}
          disabled={!assignment}
        >
          {copy.actions.continue}
        </button>
        <button type="button" className="secondary-button" onClick={onReturnToWelcome}>
          {copy.actions.returnToWelcome}
        </button>
      </StudyActions>
    </StudyPage>
  )
}

export default Ready
