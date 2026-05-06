import { useMemo, useRef, useState } from 'react'
import '../styles/App.css'
import Consent from './Consent.tsx'
import Demographics, { type DemographicAnswers } from './Demographics.tsx'

type Page = 'welcome' | 'consent' | 'demographics' | 'ready'
type GroupAssignment = 'control' | 'experimental'

type BufferedEvent = {
  event: string
  page: Page
  timestamp: string
  payload?: Record<string, string>
}

const STUDY_BUFFER_KEY = 'study.localBuffer'
const STUDY_FLUSHED_KEY = 'study.flushedEvents'

const defaultDemographics: DemographicAnswers = {
  age: '',
  studyBackground: '',
  adhdDiagnosis: '',
}

function stableSerialize(data: Record<string, string>): string {
  return Object.keys(data)
    .sort()
    .map((key) => `${key}:${data[key]}`)
    .join('|')
}

function hashDjb2(value: string): number {
  let hash = 5381
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 33) ^ value.charCodeAt(index)
  }
  return hash >>> 0
}

function assignDeterministicGroup(
  demographics: DemographicAnswers,
): GroupAssignment {
  const serialized = stableSerialize(demographics)
  return hashDjb2(serialized) % 2 === 0 ? 'control' : 'experimental'
}

function App() {
  const [page, setPage] = useState<Page>('welcome')
  const [agreed, setAgreed] = useState(false)
  const [initialBuffer] = useState<BufferedEvent[]>(() => {
    const existing = localStorage.getItem(STUDY_BUFFER_KEY)
    return existing ? (JSON.parse(existing) as BufferedEvent[]) : []
  })
  const [demographics, setDemographics] =
    useState<DemographicAnswers>(defaultDemographics)
  const [demographicError, setDemographicError] = useState<string | null>(null)
  const [assignment, setAssignment] = useState<GroupAssignment | null>(null)
  const bufferRef = useRef<BufferedEvent[]>(initialBuffer)

  const assignmentLabel = useMemo(() => {
    if (!assignment) return null
    return assignment === 'control'
      ? 'Control group'
      : 'Experimental group'
  }, [assignment])

  const persistBuffer = () => {
    localStorage.setItem(STUDY_BUFFER_KEY, JSON.stringify(bufferRef.current))
  }

  const flushBuffer = () => {
    const current = bufferRef.current
    if (current.length === 0) return

    const existing = localStorage.getItem(STUDY_FLUSHED_KEY)
    const parsed: BufferedEvent[] = existing ? JSON.parse(existing) : []
    const next = [...parsed, ...current]
    localStorage.setItem(STUDY_FLUSHED_KEY, JSON.stringify(next))
    bufferRef.current = []
    localStorage.setItem(STUDY_BUFFER_KEY, JSON.stringify(bufferRef.current))
  }

  const addBufferedEvent = (
    event: string,
    currentPage: Page,
    payload?: Record<string, string>,
  ) => {
    bufferRef.current.push({
      event,
      page: currentPage,
      payload,
      timestamp: new Date().toISOString(),
    })
    persistBuffer()
  }

  const transitionTo = (nextPage: Page) => {
    addBufferedEvent('transition', page, { from: page, to: nextPage })
    flushBuffer()
    setPage(nextPage)
  }

  if (page === 'consent') {
    return (
      <Consent
        agreed={agreed}
        onAgreementChange={setAgreed}
        onProceed={() => transitionTo('demographics')}
        onBack={() => {
          transitionTo('welcome')
          setAgreed(false)
          setDemographics(defaultDemographics)
          setDemographicError(null)
          setAssignment(null)
        }}
      />
    )
  }

  if (page === 'demographics') {
    return (
      <Demographics
        values={demographics}
        error={demographicError}
        onChange={(field, value) => {
          setDemographics((previous) => ({ ...previous, [field]: value }))
          if (demographicError) setDemographicError(null)
        }}
        onBack={() => transitionTo('consent')}
        onSubmit={() => {
          const { age, studyBackground, adhdDiagnosis } = demographics
          const parsedAge = Number(age)

          if (!age || !studyBackground || !adhdDiagnosis) {
            setDemographicError('Please answer all questions before continuing.')
            return
          }

          if (!Number.isInteger(parsedAge) || parsedAge < 13 || parsedAge > 120) {
            setDemographicError('Please enter a valid age between 13 and 120.')
            return
          }

          const nextAssignment = assignDeterministicGroup(demographics)
          setAssignment(nextAssignment)
          addBufferedEvent('demographics_submitted', 'demographics', {
            age,
            studyBackground,
            adhdDiagnosis,
            assignment: nextAssignment,
          })
          transitionTo('ready')
        }}
      />
    )
  }

  if (page === 'ready') {
    return (
      <main className="study-page">
        <section className="study-card" aria-labelledby="ready-title">
          <p className="eyebrow">Setup complete</p>
          <h1 id="ready-title">Thank you. You are ready to begin.</h1>
          <p className="intro">
            Your demographic questionnaire is complete, and you have been
            assigned deterministically for this study run.
          </p>
          {assignmentLabel ? (
            <p className="assignment-result">
              Assigned group: <strong>{assignmentLabel}</strong>
            </p>
          ) : null}
          <div className="study-actions">
            <button
              type="button"
              className="start-button"
              onClick={() => {
                transitionTo('welcome')
                setAgreed(false)
                setDemographics(defaultDemographics)
                setDemographicError(null)
                setAssignment(null)
              }}
            >
              Return to welcome
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="study-page">
      <section className="study-card" aria-labelledby="study-title">
        <p className="eyebrow">Microlearning study</p>
        <h1 id="study-title">Welcome, participant.</h1>
        <p className="intro">
          You are about to begin a short study session. Take your time, read
          carefully, and start whenever you are ready.
        </p>

        <div className="study-actions">
          <button
            type="button"
            className="start-button"
            onClick={() => transitionTo('consent')}
          >
            Start study
          </button>
          <p className="status" aria-live="polite">
            No data is collected yet.
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
