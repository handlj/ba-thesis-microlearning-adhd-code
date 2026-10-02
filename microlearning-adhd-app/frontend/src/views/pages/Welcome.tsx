import '@assets/styles/pages/Welcome.css'
import StudyActions from '../../components/StudyActions.tsx'
import StudyFacts from '../../components/StudyFacts.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import { studyProgressCopy } from '@content/components/studyProgress.ts'
import { welcomeCopy } from '@content/pages/welcome.ts'
import { STUDY_PHASES } from '../../shell/studyPhases.ts'
import { genericIcons } from '@assets/icons/genericIcons.tsx'

type WelcomeProps = { onStart: () => void }

function Welcome({ onStart }: WelcomeProps) {
  return (
    <StudyPage ariaLabelledBy="study-title" variant="landing">
      <StudyHeading {...welcomeCopy.heading} id="study-title" />

      <StudyFacts facts={welcomeCopy.facts} />

      <div className="study-steps">
        <h2>{welcomeCopy.steps.title}</h2>

        <ol className="study-steps__list">
          {STUDY_PHASES.map((phase) => {
            const { description } = studyProgressCopy.phases[phase]

            return (
              <li key={phase} className="study-steps__item">
                <span>{description}</span>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="study-steps reward-card">
        <h2>{welcomeCopy.reward.title}</h2>

        <p>{welcomeCopy.reward.text}</p>
      </div>

      <StudyActions>
        <button type="button" className="primary-button" onClick={onStart}>
          {welcomeCopy.actions.start}
        </button>

        <p className="status-note">
          <span className="status-note__icon">{genericIcons.lock}</span>
          {welcomeCopy.status.noDataCollected}
        </p>
      </StudyActions>
    </StudyPage>
  )
}

export default Welcome
