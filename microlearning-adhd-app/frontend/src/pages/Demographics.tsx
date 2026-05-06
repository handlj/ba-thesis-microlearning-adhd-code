type DemographicAnswers = {
  age: string
  studyBackground: string
  adhdDiagnosis: string
}

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
    <main className="study-page">
      <section className="study-card study-card--form" aria-labelledby="demographics-title">
        <p className="eyebrow">Demographic questionnaire</p>
        <h1 id="demographics-title">Before we start the study tasks</h1>
        <p className="intro">
          Please answer the following questions. These answers are used for
          deterministic group assignment in this pilot phase.
        </p>

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
              onChange={(event) =>
                onChange('studyBackground', event.target.value)
              }
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

          <div className="study-actions">
            <button type="button" className="secondary-button" onClick={onBack}>
              Back
            </button>
            <button type="submit" className="start-button">
              Continue
            </button>
          </div>
        </form>
      </section>
    </main>
  )
}

export type { DemographicAnswers }
export default Demographics
