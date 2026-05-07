import { useMemo, useRef, useState } from 'react'
import '../styles/App.css'
import StudyActions from '../components/StudyActions.tsx'
import StudyHeading from '../components/StudyHeading.tsx'
import StudyPage from '../components/StudyPage.tsx'
import Consent from './Consent.tsx'
import Demographics from './Demographics.tsx'
import ControlGroup from './ControlGroup.tsx'
import ExperimentalGroup from './ExperimentalGroup.tsx'
import { assignDeterministicGroup, type DemographicAnswers, type GroupAssignment } from '../utils/groupAssignment'
import { validateDemographics } from '../utils/demographicsValidation'

type Page = 'welcome' | 'consent' | 'demographics' | 'ready' | 'control' | 'experimental'

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

  const resetStudyState = () => {
    setAgreed(false)
    setDemographics(defaultDemographics)
    setDemographicError(null)
    setAssignment(null)
  }

  const returnToWelcome = () => {
    transitionTo('welcome')
    resetStudyState()
  }

  const continueFromReady = () => {
    if (assignment === 'control') {
      transitionTo('control')
      return
    }

    if (assignment === 'experimental') {
      transitionTo('experimental')
    }
  }

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
        onBack={returnToWelcome}
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
          const validation = validateDemographics(demographics)
          if (!validation.valid) {
            setDemographicError(validation.error)
            return
          }

          const nextAssignment = assignDeterministicGroup(demographics)
          setAssignment(nextAssignment)
          addBufferedEvent('demographics_submitted', 'demographics', {
            age: demographics.age,
            studyBackground: demographics.studyBackground,
            adhdDiagnosis: demographics.adhdDiagnosis,
            assignment: nextAssignment,
          })
          transitionTo('ready')
        }}
      />
    )
  }

  if (page === 'ready') {
    return (
      <StudyPage ariaLabelledBy="ready-title" cardClassName="study-card--ready">
        <StudyHeading
          eyebrow="Setup complete"
          title="Thank you. You are ready to begin."
          intro="Your demographic questionnaire is complete, and you have been assigned deterministically for this study run. The next page loads your group-specific study material."
          id="ready-title"
        />
        <StudyActions>
          {assignmentLabel ? (
            <p className="assignment-result">
              Assigned group: <strong>{assignmentLabel}</strong>
            </p>
          ) : null}
          <button
            type="button"
            className="start-button"
            onClick={continueFromReady}
            disabled={!assignment}
          >
            Continue
          </button>
          <button type="button" className="secondary-button" onClick={returnToWelcome}>
            Return to welcome
          </button>
        </StudyActions>
      </StudyPage>
    )
  }

  if (page === 'control') {
    return <ControlGroup onBackToStart={returnToWelcome} />
  }

  if (page === 'experimental') {
    return <ExperimentalGroup onBackToStart={returnToWelcome} />
  }

  return (
    <StudyPage ariaLabelledBy="study-title" cardClassName="study-card--landing">
      <StudyHeading
        eyebrow="Microlearning study"
        title="Welcome, participant."
        intro="You are about to begin a short study session. Take your time, read carefully, and start whenever you are ready."
        id="study-title"
      />

      <StudyActions>
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
      </StudyActions>
    </StudyPage>
  )
}

export default App
