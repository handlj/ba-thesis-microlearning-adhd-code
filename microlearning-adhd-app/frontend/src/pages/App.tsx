import { useRef, useState } from 'react'
import '../../assets/styles/App.css'
import StudyActions from '../components/StudyActions.tsx'
import StudyHeading from '../components/StudyHeading.tsx'
import StudyPage from '../components/StudyPage.tsx'
import Consent from './Consent.tsx'
import Demographics from './Demographics.tsx'
import PreInterventionQuestionnaire from './PreInterventionQuestionnaire.tsx'
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
} from '../services/api.ts'
import { type DemographicAnswers, type GroupAssignment } from '../utils/groupAssignment'
import { validateDemographics } from '../utils/demographicsValidation'
import { copy } from '../content/copy'
import { fam } from '../content/fam'
import { panas } from '../content/panas'
import { ues } from '../content/ues'

type Page =
  | 'welcome'
  | 'consent'
  | 'demographics'
  | 'preIntervention'
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
  gender: '',
  highestEducation: '',
  currentlyStudying: '',
  studyBackground: '',
  adhdDiagnosis: '',
}

const defaultPreInterventionAnswers = fam.questions.reduce<Record<string, string>>(
  (answers, question) => {
    answers[question.id] = ''
    return answers
  },
  {},
)

const defaultPanasAnswers = panas.questions.reduce<Record<string, string>>(
  (answers, question) => {
    answers[question.id] = ''
    return answers
  },
  {},
)

const defaultPostInterventionAnswers: PostInterventionAnswers = {
  attentionSupport: '',
  contentClarity: '',
  workloadFit: '',
  preferredFormat: '',
  openFeedback: '',
}

const defaultUesAnswers = ues.questions.reduce<Record<string, string>>(
  (answers, question) => {
    answers[question.id] = ''
    return answers
  },
  {},
)

function App() {
  const [page, setPage] = useState<Page>('welcome')
  const [agreed, setAgreed] = useState(false)
  const [initialBuffer] = useState<BufferedEvent[]>(() => {
    const existing = localStorage.getItem(STUDY_BUFFER_KEY)
    return existing ? (JSON.parse(existing) as BufferedEvent[]) : []
  })
  const [demographics, setDemographics] =
    useState<DemographicAnswers>(defaultDemographics)
  const [preInterventionAnswers, setPreInterventionAnswers] =
    useState<Record<string, string>>(defaultPreInterventionAnswers)
  const [preInterventionPanasAnswers, setPreInterventionPanasAnswers] =
    useState<Record<string, string>>(defaultPanasAnswers)
  const [postInterventionAnswers, setPostInterventionAnswers] =
    useState<PostInterventionAnswers>(defaultPostInterventionAnswers)
  const [postInterventionPanasAnswers, setPostInterventionPanasAnswers] =
    useState<Record<string, string>>(defaultPanasAnswers)
  const [uesAnswers, setUesAnswers] =
    useState<Record<string, string>>(defaultUesAnswers)
  const [participantId, setParticipantId] = useState<string | null>(() =>
    localStorage.getItem(PARTICIPANT_ID_KEY),
  )
  const [consentError, setConsentError] = useState<string | null>(null)
  const [demographicError, setDemographicError] = useState<string | null>(null)
  const [preInterventionError, setPreInterventionError] = useState<string | null>(null)
  const [preInterventionPanasError, setPreInterventionPanasError] =
    useState<string | null>(null)
  const [postInterventionError, setPostInterventionError] = useState<string | null>(null)
  const [postInterventionPanasError, setPostInterventionPanasError] =
    useState<string | null>(null)
  const [uesError, setUesError] = useState<string | null>(null)
  const [isSavingConsent, setIsSavingConsent] = useState(false)
  const [isSavingDemographics, setIsSavingDemographics] = useState(false)
  const [isSavingPostIntervention, setIsSavingPostIntervention] = useState(false)
  const [assignment, setAssignment] = useState<GroupAssignment | null>(null)
  const bufferRef = useRef<BufferedEvent[]>(initialBuffer)

  const resetStudyState = () => {
    setAgreed(false)
    setDemographics(defaultDemographics)
    setPreInterventionAnswers(defaultPreInterventionAnswers)
    setPreInterventionPanasAnswers(defaultPanasAnswers)
    setPostInterventionAnswers(defaultPostInterventionAnswers)
    setPostInterventionPanasAnswers(defaultPanasAnswers)
    setUesAnswers(defaultUesAnswers)
    setParticipantId(null)
    setConsentError(null)
    setDemographicError(null)
    setPreInterventionError(null)
    setPreInterventionPanasError(null)
    setPostInterventionError(null)
    setPostInterventionPanasError(null)
    setUesError(null)
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
      transitionTo('preIntervention')
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

  const handlePreInterventionSubmit = () => {
    const missingAnswer = fam.questions.some(
      (question) => !preInterventionAnswers[question.id]?.trim(),
    )

    if (missingAnswer) {
      setPreInterventionError(copy.validation.preInterventionAllQuestions)
      return
    }

    setPreInterventionError(null)
    addBufferedEvent('pre_intervention_fam_submitted', 'preIntervention', {
      ...(participantId ? { participantId } : {}),
      ...(assignment ? { assignment } : {}),
      ...preInterventionAnswers,
    })
    transitionTo('ready')
  }

  const handlePreInterventionPanasProceed = () => {
    const missingAnswer = panas.questions.some(
      (question) => !preInterventionPanasAnswers[question.id]?.trim(),
    )

    if (missingAnswer) {
      setPreInterventionPanasError(panas.validation.allQuestions)
      return false
    }

    setPreInterventionPanasError(null)
    addBufferedEvent('pre_intervention_panas_submitted', 'preIntervention', {
      ...(participantId ? { participantId } : {}),
      ...(assignment ? { assignment } : {}),
      ...preInterventionPanasAnswers,
    })
    return true
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

  const handleUesProceed = () => {
    const missingAnswer = ues.questions.some(
      (question) => !uesAnswers[question.id]?.trim(),
    )

    if (missingAnswer) {
      setUesError(ues.validation.allQuestions)
      return false
    }

    setUesError(null)
    addBufferedEvent('post_intervention_ues_submitted', 'postIntervention', {
      ...(participantId ? { participantId } : {}),
      ...(assignment ? { assignment } : {}),
      ...uesAnswers,
    })
    return true
  }

  const handlePostInterventionPanasProceed = () => {
    const missingAnswer = panas.questions.some(
      (question) => !postInterventionPanasAnswers[question.id]?.trim(),
    )

    if (missingAnswer) {
      setPostInterventionPanasError(panas.validation.allQuestions)
      return false
    }

    setPostInterventionPanasError(null)
    addBufferedEvent('post_intervention_panas_submitted', 'postIntervention', {
      ...(participantId ? { participantId } : {}),
      ...(assignment ? { assignment } : {}),
      ...postInterventionPanasAnswers,
    })
    return true
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

  if (page === 'preIntervention') {
    return (
      <PreInterventionQuestionnaire
        values={preInterventionAnswers}
        panasValues={preInterventionPanasAnswers}
        error={preInterventionError}
        panasError={preInterventionPanasError}
        onChange={(questionId, value) => {
          setPreInterventionAnswers((previous) => ({
            ...previous,
            [questionId]: value,
          }))
          if (preInterventionError) setPreInterventionError(null)
        }}
        onPanasChange={(questionId, value) => {
          setPreInterventionPanasAnswers((previous) => ({
            ...previous,
            [questionId]: value,
          }))
          if (preInterventionPanasError) setPreInterventionPanasError(null)
        }}
        onPanasProceed={handlePreInterventionPanasProceed}
        onBack={() => transitionTo('demographics')}
        onSubmit={handlePreInterventionSubmit}
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
        panasValues={postInterventionPanasAnswers}
        uesValues={uesAnswers}
        error={postInterventionError}
        panasError={postInterventionPanasError}
        uesError={uesError}
        isSubmitting={isSavingPostIntervention}
        onChange={(field, value) => {
          setPostInterventionAnswers((previous) => ({ ...previous, [field]: value }))
          if (postInterventionError) setPostInterventionError(null)
        }}
        onPanasChange={(questionId, value) => {
          setPostInterventionPanasAnswers((previous) => ({
            ...previous,
            [questionId]: value,
          }))
          if (postInterventionPanasError) setPostInterventionPanasError(null)
        }}
        onPanasProceed={handlePostInterventionPanasProceed}
        onUesChange={(questionId, value) => {
          setUesAnswers((previous) => ({
            ...previous,
            [questionId]: value,
          }))
          if (uesError) setUesError(null)
        }}
        onUesProceed={handleUesProceed}
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
