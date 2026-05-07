import { type DemographicAnswers } from '../utils/groupAssignment'
import StudyActions from '../components/StudyActions.tsx'
import StudyHeading from '../components/StudyHeading.tsx'
import StudyPage from '../components/StudyPage.tsx'

type DemographicsProps = {
  values: DemographicAnswers
  error: string | null
  onChange: (field: keyof DemographicAnswers, value: string) => void
  onBack: () => void
  onSubmit: () => void
}

function Demographics({
  values,
  error,
  onChange,
  onBack,
  onSubmit,
}: DemographicsProps) {
  return (
    <StudyPage ariaLabelledBy="demographics-title" cardClassName="study-card--form">
      <StudyHeading
        eyebrow="Demographic questionnaire"
        title="Before we start the study tasks"
        intro="Please answer the following questions. These answers are used for deterministic group assignment in this pilot phase."
        id="demographics-title"
      />

      <form
        className="demographic-form"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <label>
          <span>Age</span>
          <input
            type="number"
            value={values.age}
            onChange={(event) => onChange('age', event.target.value)}
            min={13}
            max={120}
            placeholder="Enter your age"
            required
          />
        </label>

        <label>
          <span>Study background</span>
          <select
            value={values.studyBackground}
            onChange={(event) => onChange('studyBackground', event.target.value)}
            required
          >
            <option value="">Select one</option>
            <option value="computer-science">Computer science</option>
            <option value="stem-other">Other STEM discipline</option>
            <option value="non-stem">Non-STEM discipline</option>
            <option value="not-studying">Not currently studying</option>
          </select>
        </label>

        <label>
          <span>ADHD diagnosis status</span>
          <select
            value={values.adhdDiagnosis}
            onChange={(event) => onChange('adhdDiagnosis', event.target.value)}
            required
          >
            <option value="">Select one</option>
            <option value="diagnosed">Diagnosed</option>
            <option value="not-diagnosed">Not diagnosed</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </label>

        {error ? <p className="error-text">{error}</p> : null}

        <StudyActions>
          <button type="button" className="secondary-button" onClick={onBack}>
            Back
          </button>
          <button type="submit" className="start-button">
            Continue
          </button>
        </StudyActions>
      </form>
    </StudyPage>
  )
}

export type { DemographicAnswers }
export default Demographics
