import '@assets/styles/App.css'
import StudyActions from '../../components/StudyActions.tsx'
import StudyFacts from '../../components/StudyFacts.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import { copy } from '../../content/copy'
import { STUDY_PHASES } from '../../shell/studyPhases.ts'
import { genericIcons } from '@assets/icons/genericIcons.tsx'

type WelcomeProps = { onStart: () => void }

function Welcome({ onStart }: WelcomeProps) {
  return (
    <StudyPage ariaLabelledBy="study-title" cardClassName="study-card--landing">
      <StudyHeading
        eyebrow={copy.welcome.heading.eyebrow}
        title={copy.welcome.heading.title}
        intro={copy.welcome.heading.intro}
        id="study-title"
      />

      <StudyFacts facts={copy.welcome.facts} />

      <div className="study-steps">
        <h2>{copy.welcome.steps.title}</h2>

        <ol className="study-steps__list">
          {STUDY_PHASES.map((phase) => {
            const { description } = copy.studyProgress.phases[phase]

            return (
              <li key={phase} className="study-steps__item">
                <span>{description}</span>
              </li>
            )
          })}
        </ol>
      </div>

      <StudyActions>
        <button type="button" className="start-button" onClick={onStart}>
          {copy.actions.startStudy}
        </button>

        <p className="status status-note">
          <span className="status-note__icon">{genericIcons.lock}</span>
          {copy.welcome.status.noDataCollected}
        </p>
      </StudyActions>
    </StudyPage>
  )
}

export default Welcome
