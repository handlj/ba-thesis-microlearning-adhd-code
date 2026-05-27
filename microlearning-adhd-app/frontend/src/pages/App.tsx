import { useRef, useState } from 'react'
import '../styles/App.css'
import StudyActions from '../components/StudyActions.tsx'
import StudyHeading from '../components/StudyHeading.tsx'
import StudyPage from '../components/StudyPage.tsx'
import Consent from './Consent.tsx'
import Demographics from './Demographics.tsx'
import Ready from './Ready.tsx'
import ControlGroup from './ControlGroup.tsx'
import ExperimentalGroup from './ExperimentalGroup.tsx'
import PostInterventionQuestionnaire from './PostInterventionQuestionnaire.tsx'
import ThankYou from './ThankYou.tsx'
import {
  createConsentSession,
  recordInteractionEvent,
  submitDemographics,
  submitPostInterventionQuestionnaire,
  type PostInterventionAnswers,
  type StudyInteractionPayload,
} from '../api.ts'
import { type DemographicAnswers, type GroupAssignment } from '../utils/groupAssignment'
import { validateDemographics } from '../utils/demographicsValidation'
import { copy } from '../content/copy'

type Page =
  | 'welcome'
  | 'consent'
  | 'demographics'
  | 'ready'
  | 'control'
  | 'experimental'
  | 'postIntervention'
  | 'thankYou'

type BufferedEvent = {
  event: string
  page: Page
  timestamp: string
  payload?: Record<string, string>
}

const STUDY_BUFFER_KEY = 'study.localBuffer'
const STUDY_FLUSHED_KEY = 'study.flushedEvents'
const PARTICIPANT_ID_KEY = 'study.participantId'

const defaultDemographics: DemographicAnswers = {
  age: '',
  studyBackground: '',
  adhdDiagnosis: '',
}

const defaultPostInterventionAnswers: PostInterventionAnswers = {
  attentionSupport: '',
  contentClarity: '',
  workloadFit: '',
  preferredFormat: '',
  openFeedback: '',
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
  const [postInterventionAnswers, setPostInterventionAnswers] =
    useState<PostInterventionAnswers>(defaultPostInterventionAnswers)
  const [participantId, setParticipantId] = useState<string | null>(() =>
    localStorage.getItem(PARTICIPANT_ID_KEY),
  )
  const [consentError, setConsentError] = useState<string | null>(null)
  const [demographicError, setDemographicError] = useState<string | null>(null)
  const [postInterventionError, setPostInterventionError] = useState<string | null>(null)
  const [isSavingConsent, setIsSavingConsent] = useState(false)
  const [isSavingDemographics, setIsSavingDemographics] = useState(false)
  const [isSavingPostIntervention, setIsSavingPostIntervention] = useState(false)
  const [assignment, setAssignment] = useState<GroupAssignment | null>(null)
  const bufferRef = useRef<BufferedEvent[]>(initialBuffer)

  const resetStudyState = () => {
    setAgreed(false)
    setDemographics(defaultDemographics)
    setPostInterventionAnswers(defaultPostInterventionAnswers)
    setParticipantId(null)
    setConsentError(null)
    setDemographicError(null)
    setPostInterventionError(null)
    setIsSavingConsent(false)
    setIsSavingDemographics(false)
    setIsSavingPostIntervention(false)
    setAssignment(null)
    localStorage.removeItem(PARTICIPANT_ID_KEY)
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

  const completeIntervention = () => {
    transitionTo('postIntervention')
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

  const logStudyInteraction = (
    group: GroupAssignment,
    eventType: string,
    payload?: StudyInteractionPayload,
    interactionPage: string = group,
  ) => {
    if (!participantId) {
      return
    }

    void recordInteractionEvent(participantId, {
      group,
      page: interactionPage,
      event_type: eventType,
      payload,
    }).catch((requestError) => {
      console.error(copy.errors.interactionPersist, requestError)
    })
  }

  const handleConsentProceed = async () => {
    if (!agreed || isSavingConsent) return

    try {
      setConsentError(null)
      setIsSavingConsent(true)
      const consentSession = await createConsentSession()
      setParticipantId(consentSession.participant_id)
      localStorage.setItem(PARTICIPANT_ID_KEY, consentSession.participant_id)
      addBufferedEvent('consent_submitted', 'consent', {
        participantId: consentSession.participant_id,
      })
      transitionTo('demographics')
    } catch (requestError) {
      setConsentError(
        requestError instanceof Error
          ? requestError.message
          : copy.errors.consentSave,
      )
    } finally {
      setIsSavingConsent(false)
    }
  }

  const handleDemographicsSubmit = async () => {
    const validation = validateDemographics(demographics)
    if (!validation.valid) {
      setDemographicError(validation.error)
      return
    }

    if (!participantId) {
      setDemographicError(
        copy.errors.demographicsMissingSession,
      )
      return
    }

    try {
      setDemographicError(null)
      setIsSavingDemographics(true)
      const response = await submitDemographics(participantId, demographics)
      setAssignment(response.assignment)
      addBufferedEvent('demographics_submitted', 'demographics', {
        participantId,
        age: demographics.age,
        studyBackground: demographics.studyBackground,
        adhdDiagnosis: demographics.adhdDiagnosis,
        assignment: response.assignment,
      })
      transitionTo('ready')
    } catch (requestError) {
      setDemographicError(
        requestError instanceof Error
          ? requestError.message
          : copy.errors.demographicsSave,
      )
    } finally {
      setIsSavingDemographics(false)
    }
  }

  const handlePostInterventionSubmit = async () => {
    const missingAnswer = Object.values(postInterventionAnswers).some(
      (value) => !value.trim(),
    )

    if (missingAnswer) {
      setPostInterventionError(copy.errors.postInterventionMissingAnswers)
      return
    }

    if (!participantId || !assignment) {
      setPostInterventionError(
        copy.errors.postInterventionMissingSession,
      )
      return
    }

    try {
      setPostInterventionError(null)
      setIsSavingPostIntervention(true)
      await submitPostInterventionQuestionnaire(
        participantId,
        assignment,
        postInterventionAnswers,
      )
      addBufferedEvent('post_intervention_submitted', 'postIntervention', {
        participantId,
        assignment,
      })
      transitionTo('thankYou')
    } catch (requestError) {
      setPostInterventionError(
        requestError instanceof Error
          ? requestError.message
          : copy.errors.postInterventionSave,
      )
    } finally {
      setIsSavingPostIntervention(false)
    }
  }

  if (page === 'consent') {
    return (
      <Consent
        agreed={agreed}
        error={consentError}
        isSubmitting={isSavingConsent}
        onAgreementChange={(nextAgreed) => {
          setAgreed(nextAgreed)
          if (consentError) setConsentError(null)
        }}
        onProceed={handleConsentProceed}
        onBack={returnToWelcome}
      />
    )
  }

  if (page === 'demographics') {
    return (
      <Demographics
        values={demographics}
        error={demographicError}
        isSubmitting={isSavingDemographics}
        onChange={(field, value) => {
          setDemographics((previous) => ({ ...previous, [field]: value }))
          if (demographicError) setDemographicError(null)
        }}
        onBack={() => transitionTo('consent')}
        onSubmit={handleDemographicsSubmit}
      />
    )
  }

  if (page === 'ready') {
    return (
      <Ready
        assignment={assignment}
        onContinue={continueFromReady}
        onReturnToWelcome={returnToWelcome}
        onLogInteraction={(eventType, payload) => {
          if (assignment) {
            logStudyInteraction(assignment, eventType, payload, 'ready')
          }
        }}
      />
    )
  }

  if (page === 'control') {
    return (
      <ControlGroup
        onBackToStart={returnToWelcome}
        onCompleteIntervention={completeIntervention}
        onLogInteraction={(eventType, payload) =>
          logStudyInteraction('control', eventType, payload)
        }
      />
    )
  }

  if (page === 'experimental') {
    return (
      <ExperimentalGroup
        onBackToStart={returnToWelcome}
        onCompleteIntervention={completeIntervention}
        onLogInteraction={(eventType, payload) =>
          logStudyInteraction('experimental', eventType, payload)
        }
      />
    )
  }

  if (page === 'postIntervention') {
    return (
      <PostInterventionQuestionnaire
        values={postInterventionAnswers}
        error={postInterventionError}
        isSubmitting={isSavingPostIntervention}
        onChange={(field, value) => {
          setPostInterventionAnswers((previous) => ({ ...previous, [field]: value }))
          if (postInterventionError) setPostInterventionError(null)
        }}
        onSubmit={handlePostInterventionSubmit}
      />
    )
  }

  if (page === 'thankYou') {
    return <ThankYou onReturnToStart={returnToWelcome} />
  }

  return (
    <StudyPage ariaLabelledBy="study-title" cardClassName="study-card--landing">
      <StudyHeading
        eyebrow={copy.welcome.heading.eyebrow}
        title={copy.welcome.heading.title}
        intro={copy.welcome.heading.intro}
        id="study-title"
      />

      <StudyActions>
        <button
          type="button"
          className="start-button"
          onClick={() => transitionTo('consent')}
        >
          {copy.actions.startStudy}
        </button>
        <p className="status" aria-live="polite">
          {copy.welcome.status.noDataCollected}
        </p>
      </StudyActions>
    </StudyPage>
  )
}

export default App
