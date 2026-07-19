import { useRef, useState } from 'react'
import '../../../assets/styles/App.css'
import StudyActions from '../../components/StudyActions.tsx'
import StudyFacts from '../../components/StudyFacts.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import { icons } from '../../components/icons.tsx'
import Consent from '../pages/Consent.tsx'
import Demographics from '../pages/Demographics.tsx'
import AdhdScreeningQuestionnaire from '../questionnaires/AdhdScreeningQuestionnaire.tsx'
import PanasQuestionnaire from '../questionnaires/PanasQuestionnaire.tsx'
import FAMQuestionnaire from '../questionnaires/FAMQuestionnaire.tsx'
import Ready from '../pages/Ready.tsx'
import UESQuestionnaire from '../questionnaires/UESQuestionnaire.tsx'
import FollowUpQuestionnaire from '../questionnaires/FollowUpQuestionnaire.tsx'
import ControlGroup from '../pages/ControlGroup.tsx'
import ExperimentalGroup from '../pages/ExperimentalGroup.tsx'
import ThankYou from '../pages/ThankYou.tsx'
import QuizFeedback from '../pages/QuizFeedback.tsx'
import {
  postConsentSession,
  postInteractionEvent,
  postAdhdScreening,
  postDemographics,
  postFam,
  postPanasPost,
  postPanasPre,
  postPostInterventionQuestionnaire,
  postQuizAnswers,
  postUes,
  type PostInterventionAnswers,
  type QuizAnswerSubmission,
  type StudyInteractionPayload,
} from '../../services/index.ts'
import { type DemographicAnswers, type GroupAssignment } from '../../utils/groupAssignment.ts'
import { validateDemographics } from '../../utils/demographicsValidation.ts'
import { copy } from '../../content/copy.ts'
import { scoreQuiz } from '../../utils/quizScoring.ts'
import { allQuizQuestions, quizTopics, type QuizTopic } from '../../content/quiz.ts'
import type { QuizAnswers } from '../../components/quiz/useQuizAnswers.ts'
import { useScrollToTop } from '../../hooks/useScrollToTop.ts'
import { adhdScreening } from '../../content/adhdScreening.ts'
import { fam } from '../../content/fam.ts'
import { panas } from '../../content/panas.ts'
import { ues } from '../../content/ues.ts'
import PreQuiz from './PreQuiz.tsx'

type Page =
  | 'welcome'
  | 'consent'
  | 'demographics'
  | 'adhdScreening'
  | 'prePanas'
  | 'ready'
  | 'fam'
  | 'preQuiz'
  | 'control'
  | 'experimental'
  | 'postPanas'
  | 'ues'
  | 'followUp'
  | 'feedback'
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
  adhdOfficialDiagnosis: '',
  adhdMedication: '',
}

const defaultFamAnswers = fam.questions.reduce<Record<string, string>>(
  (answers, question) => {
    answers[question.id] = ''
    return answers
  },
  {},
)

const defaultAdhdScreeningAnswers = adhdScreening.questions.reduce<
  Record<string, string>
>((answers, question) => {
  answers[question.id] = ''
  return answers
}, {})

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
  // Set initial page, deviations from "welcome" are only for testing purposes and have to be reverted before deployment
  const [page, setPage] = useState<Page>('welcome') 
  const [agreed, setAgreed] = useState(false)
  const [initialBuffer] = useState<BufferedEvent[]>(() => {
    const existing = localStorage.getItem(STUDY_BUFFER_KEY)
    return existing ? (JSON.parse(existing) as BufferedEvent[]) : []
  })
  const [demographics, setDemographics] =
    useState<DemographicAnswers>(defaultDemographics)
  const [adhdScreeningAnswers, setAdhdScreeningAnswers] =
    useState<Record<string, string>>(defaultAdhdScreeningAnswers)
  const [famAnswers, setFamAnswers] =
    useState<Record<string, string>>(defaultFamAnswers)
  const [prePanasAnswers, setPrePanasAnswers] =
    useState<Record<string, string>>(defaultPanasAnswers)
  const [postInterventionAnswers, setPostInterventionAnswers] =
    useState<PostInterventionAnswers>(defaultPostInterventionAnswers)
  const [postPanasAnswers, setPostPanasAnswers] =
    useState<Record<string, string>>(defaultPanasAnswers)
  const [uesAnswers, setUesAnswers] =
    useState<Record<string, string>>(defaultUesAnswers)
  const [participantId, setParticipantId] = useState<string | null>(() =>
    localStorage.getItem(PARTICIPANT_ID_KEY),
  )
  const [consentError, setConsentError] = useState<string | null>(null)
  const [demographicError, setDemographicError] = useState<string | null>(null)
  const [adhdScreeningError, setAdhdScreeningError] = useState<string | null>(
    null,
  )
  const [prePanasError, setPrePanasError] = useState<string | null>(null)
  const [famError, setFamError] = useState<string | null>(null)
  const [preQuizError, setPreQuizError] = useState<string | null>(null)
  const [postPanasError, setPostPanasError] = useState<string | null>(null)
  const [uesError, setUesError] = useState<string | null>(null)
  const [followUpError, setFollowUpError] = useState<string | null>(null)
  const [isSavingConsent, setIsSavingConsent] = useState(false)
  const [isSavingDemographics, setIsSavingDemographics] = useState(false)
  const [isSavingFollowUp, setIsSavingFollowUp] = useState(false)
  const [assignment, setAssignment] = useState<GroupAssignment | null>(null)
  const [wantsFeedback, setWantsFeedback] = useState<'yes' | 'no'>('no')
  const [preQuizCorrect, setPreQuizCorrect] = useState<number | null>(null)
  const [controlPostQuizCorrect, setControlPostQuizCorrect] = useState<
    number | null
  >(null)
  const [experimentalTopicScores, setExperimentalTopicScores] = useState<
    Record<string, number>
  >({})
  const bufferRef = useRef<BufferedEvent[]>(initialBuffer)
  const isSavingQuestionnaireRef = useRef(false)

  useScrollToTop(page)

  const resetStudyState = () => {
    setAgreed(false)
    setDemographics(defaultDemographics)
    setAdhdScreeningAnswers(defaultAdhdScreeningAnswers)
    setFamAnswers(defaultFamAnswers)
    setPrePanasAnswers(defaultPanasAnswers)
    setPostInterventionAnswers(defaultPostInterventionAnswers)
    setPostPanasAnswers(defaultPanasAnswers)
    setUesAnswers(defaultUesAnswers)
    setParticipantId(null)
    setConsentError(null)
    setDemographicError(null)
    setAdhdScreeningError(null)
    setPrePanasError(null)
    setFamError(null)
    setPreQuizError(null)
    setPostPanasError(null)
    setUesError(null)
    setFollowUpError(null)
    setIsSavingConsent(false)
    setIsSavingDemographics(false)
    setIsSavingFollowUp(false)
    setAssignment(null)
    setWantsFeedback('no')
    setPreQuizCorrect(null)
    setControlPostQuizCorrect(null)
    setExperimentalTopicScores({})
    localStorage.removeItem(PARTICIPANT_ID_KEY)
  }

  // The pre-quiz and control post-quiz both use the flat 20-question bank.
  // scoreQuiz only reads `.questions`, so a topic-shaped wrapper is enough; the
  // pass threshold is irrelevant to correctCount.
  const scoreAll = (answers: QuizAnswers) =>
    scoreQuiz({ questions: allQuizQuestions } as QuizTopic, answers, 0)
      .correctCount

  const returnToWelcome = () => {
    transitionTo('welcome')
    resetStudyState()
  }

  const completeIntervention = () => {
    transitionTo('postPanas')
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

    void postInteractionEvent(participantId, {
      group,
      page: interactionPage,
      event_type: eventType,
      payload,
    }).catch((requestError) => {
      console.error(copy.errors.interactionPersist, requestError)
    })
  }

  const submitQuizForGroup = (
    submission: Omit<QuizAnswerSubmission, 'group'> & {
      group: GroupAssignment
    },
  ) => {
    if (!participantId) {
      return
    }

    void postQuizAnswers(participantId, submission).catch((requestError) => {
      console.error(copy.errors.quizSave, requestError)
    })
  }

  const handleConsentProceed = async () => {
    if (!agreed || isSavingConsent) return

    try {
      setConsentError(null)
      setIsSavingConsent(true)
      const consentSession = await postConsentSession()
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
      await postDemographics(participantId, demographics)
      addBufferedEvent('demographics_submitted', 'demographics', {
        participantId,
        age: demographics.age,
        studyBackground: demographics.studyBackground,
        adhdDiagnosis: demographics.adhdDiagnosis,
      })
      transitionTo('adhdScreening')
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

  const handleAdhdScreeningSubmit = async () => {
    const missingAnswer = adhdScreening.questions.some(
      (question) => !adhdScreeningAnswers[question.id]?.trim(),
    )

    if (missingAnswer) {
      setAdhdScreeningError(adhdScreening.validation.allQuestions)
      return
    }

    if (!participantId) {
      setAdhdScreeningError(copy.errors.questionnaireMissingSession)
      return
    }

    if (isSavingQuestionnaireRef.current) return

    try {
      isSavingQuestionnaireRef.current = true
      setAdhdScreeningError(null)
      const response = await postAdhdScreening(participantId, adhdScreeningAnswers)
      setAssignment(response.assignment)
      addBufferedEvent('adhd_screening_submitted', 'adhdScreening', {
        participantId,
        assignment: response.assignment,
        ...adhdScreeningAnswers,
      })
      transitionTo('prePanas')
    } catch (requestError) {
      setAdhdScreeningError(
        requestError instanceof Error
          ? requestError.message
          : copy.errors.questionnaireSave,
      )
    } finally {
      isSavingQuestionnaireRef.current = false
    }
  }

  const handlePrePanasSubmit = async () => {
    const missingAnswer = panas.questions.some(
      (question) => !prePanasAnswers[question.id]?.trim(),
    )

    if (missingAnswer) {
      setPrePanasError(panas.validation.allQuestions)
      return
    }

    if (!participantId || !assignment) {
      setPrePanasError(copy.errors.questionnaireMissingSession)
      return
    }

    if (isSavingQuestionnaireRef.current) return

    try {
      isSavingQuestionnaireRef.current = true
      setPrePanasError(null)
      await postPanasPre(participantId, assignment, prePanasAnswers)
      addBufferedEvent('pre_intervention_panas_submitted', 'prePanas', {
        participantId,
        assignment,
        ...prePanasAnswers,
      })
      transitionTo('ready')
    } catch (requestError) {
      setPrePanasError(
        requestError instanceof Error
          ? requestError.message
          : copy.errors.questionnaireSave,
      )
    } finally {
      isSavingQuestionnaireRef.current = false
    }
  }

  const handlePreQuizSubmit = () => {
    if (!participantId || !assignment) {
      setPreQuizError(copy.errors.questionnaireMissingSession)
      return
    }

    if (assignment === 'control') {
      transitionTo('control')
    } else if (assignment === 'experimental') {
      transitionTo('experimental')
    }
  }

  const handleFamSubmit = async () => {
    const missingAnswer = fam.questions.some(
      (question) => !famAnswers[question.id]?.trim(),
    )

    if (missingAnswer) {
      setFamError(copy.validation.preInterventionAllQuestions)
      return
    }

    if (!participantId || !assignment) {
      setFamError(copy.errors.questionnaireMissingSession)
      return
    }

    if (isSavingQuestionnaireRef.current) return

    try {
      isSavingQuestionnaireRef.current = true
      setFamError(null)
      await postFam(participantId, assignment, famAnswers)
      addBufferedEvent('pre_intervention_fam_submitted', 'fam', {
        participantId,
        assignment,
        ...famAnswers,
      })

      transitionTo('preQuiz')
    } catch (requestError) {
      setFamError(
        requestError instanceof Error
          ? requestError.message
          : copy.errors.questionnaireSave,
      )
    } finally {
      isSavingQuestionnaireRef.current = false
    }
  }

  const handlePostPanasSubmit = async () => {
    const missingAnswer = panas.questions.some(
      (question) => !postPanasAnswers[question.id]?.trim(),
    )

    if (missingAnswer) {
      setPostPanasError(panas.validation.allQuestions)
      return
    }

    if (!participantId || !assignment) {
      setPostPanasError(copy.errors.questionnaireMissingSession)
      return
    }

    if (isSavingQuestionnaireRef.current) return

    try {
      isSavingQuestionnaireRef.current = true
      setPostPanasError(null)
      await postPanasPost(participantId, assignment, postPanasAnswers)
      addBufferedEvent('post_intervention_panas_submitted', 'postPanas', {
        participantId,
        assignment,
        ...postPanasAnswers,
      })
      transitionTo('ues')
    } catch (requestError) {
      setPostPanasError(
        requestError instanceof Error
          ? requestError.message
          : copy.errors.questionnaireSave,
      )
    } finally {
      isSavingQuestionnaireRef.current = false
    }
  }

  const handleUesSubmit = async () => {
    const missingAnswer = ues.questions.some(
      (question) => !uesAnswers[question.id]?.trim(),
    )

    if (missingAnswer) {
      setUesError(ues.validation.allQuestions)
      return
    }

    if (!participantId || !assignment) {
      setUesError(copy.errors.questionnaireMissingSession)
      return
    }

    if (isSavingQuestionnaireRef.current) return

    try {
      isSavingQuestionnaireRef.current = true
      setUesError(null)
      await postUes(participantId, assignment, uesAnswers)
      addBufferedEvent('post_intervention_ues_submitted', 'ues', {
        participantId,
        assignment,
        ...uesAnswers,
      })
      transitionTo('followUp')
    } catch (requestError) {
      setUesError(
        requestError instanceof Error
          ? requestError.message
          : copy.errors.questionnaireSave,
      )
    } finally {
      isSavingQuestionnaireRef.current = false
    }
  }

  const handleFollowUpSubmit = async () => {
    if (!participantId || !assignment) {
      setFollowUpError(
        copy.errors.postInterventionMissingSession,
      )
      return
    }

    try {
      setFollowUpError(null)
      setIsSavingFollowUp(true)
      await postPostInterventionQuestionnaire(
        participantId,
        assignment,
        postInterventionAnswers,
      )
      addBufferedEvent('post_intervention_submitted', 'followUp', {
        participantId,
        assignment,
      })
      const hasScores =
        preQuizCorrect !== null &&
        (assignment === 'control'
          ? controlPostQuizCorrect !== null
          : Object.keys(experimentalTopicScores).length > 0)
      transitionTo(wantsFeedback === 'yes' && hasScores ? 'feedback' : 'thankYou')
    } catch (requestError) {
      setFollowUpError(
        requestError instanceof Error
          ? requestError.message
          : copy.errors.postInterventionSave,
      )
    } finally {
      setIsSavingFollowUp(false)
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

  if (page === 'adhdScreening') {
    return (
      <AdhdScreeningQuestionnaire
        values={adhdScreeningAnswers}
        error={adhdScreeningError}
        onChange={(questionId, value) => {
          setAdhdScreeningAnswers((previous) => ({
            ...previous,
            [questionId]: value,
          }))
          if (adhdScreeningError) setAdhdScreeningError(null)
        }}
        onBack={() => transitionTo('demographics')}
        onSubmit={handleAdhdScreeningSubmit}
      />
    )
  }

  if (page === 'prePanas') {
    return (
      <PanasQuestionnaire
        values={prePanasAnswers}
        error={prePanasError}
        onChange={(questionId, value) => {
          setPrePanasAnswers((previous) => ({ ...previous, [questionId]: value }))
          if (prePanasError) setPrePanasError(null)
        }}
        onBack={() => transitionTo('adhdScreening')}
        onSubmit={handlePrePanasSubmit}
      />
    )
  }

  if (page === 'ready') {
    return (
      <Ready
        assignment={assignment}
        onContinue={() => transitionTo('fam')}
        onReturnToWelcome={returnToWelcome}
        onLogInteraction={(eventType, payload) => {
          if (assignment) {
            logStudyInteraction(assignment, eventType, payload, 'ready')
          }
        }}
      />
    )
  }

  if (page === 'fam') {
    return (
      <FAMQuestionnaire
        values={famAnswers}
        error={famError}
        onChange={(questionId, value) => {
          setFamAnswers((previous) => ({ ...previous, [questionId]: value }))
          if (famError) setFamError(null)
        }}
        onBack={() => transitionTo('ready')}
        onSubmit={handleFamSubmit}
      />
    )
  }

  if (page === 'preQuiz') {
    return (
      <PreQuiz
        onSubmit={handlePreQuizSubmit}
        onBack={() => transitionTo('fam')}
        onLogInteraction={(eventType, payload) => {
          if (preQuizError) setPreQuizError(null)
          if (assignment) {
            logStudyInteraction(assignment, eventType, payload, 'preQuiz')
          }
        }}
        onSubmitQuiz={(answers) => {
          if (!assignment) return
          setPreQuizCorrect(scoreAll(answers))
          submitQuizForGroup({
            group: assignment,
            video_id: null,
            video_index: null,
            topic_id: 'pre-quiz',
            answers,
          })
        }}
        error={preQuizError}
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
        onSubmitQuiz={(answers) => {
          setControlPostQuizCorrect(scoreAll(answers))
          submitQuizForGroup({
            group: 'control',
            video_id: null,
            video_index: null,
            topic_id: 'all',
            answers,
          })
        }}
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
        onSubmitQuiz={(submission) => {
          const topic = quizTopics.find((t) => t.id === submission.topic_id)
          if (topic) {
            const correct = scoreQuiz(topic, submission.answers, 0).correctCount
            // Later attempts overwrite earlier ones → final attempt per topic.
            setExperimentalTopicScores((previous) => ({
              ...previous,
              [submission.topic_id]: correct,
            }))
          }
          submitQuizForGroup({ group: 'experimental', ...submission })
        }}
      />
    )
  }

  if (page === 'postPanas') {
    return (
      <PanasQuestionnaire
        values={postPanasAnswers}
        error={postPanasError}
        onChange={(questionId, value) => {
          setPostPanasAnswers((previous) => ({ ...previous, [questionId]: value }))
          if (postPanasError) setPostPanasError(null)
        }}
        onSubmit={handlePostPanasSubmit}
      />
    )
  }

  if (page === 'ues') {
    return (
      <UESQuestionnaire
        values={uesAnswers}
        error={uesError}
        onChange={(questionId, value) => {
          setUesAnswers((previous) => ({ ...previous, [questionId]: value }))
          if (uesError) setUesError(null)
        }}
        onSubmit={handleUesSubmit}
      />
    )
  }

  if (page === 'followUp') {
    return (
      <FollowUpQuestionnaire
        values={postInterventionAnswers}
        wantsFeedback={wantsFeedback}
        error={followUpError}
        isSubmitting={isSavingFollowUp}
        onChange={(field, value) => {
          setPostInterventionAnswers((previous) => ({ ...previous, [field]: value }))
          if (followUpError) setFollowUpError(null)
        }}
        onWantsFeedbackChange={setWantsFeedback}
        onSubmit={handleFollowUpSubmit}
      />
    )
  }

  if (page === 'feedback' && assignment) {
    return (
      <QuizFeedback
        assignment={assignment}
        preCorrect={preQuizCorrect ?? 0}
        postCorrect={
          assignment === 'control'
            ? controlPostQuizCorrect ?? 0
            : Object.values(experimentalTopicScores).reduce(
                (sum, correct) => sum + correct,
                0,
              )
        }
        onContinue={() => transitionTo('thankYou')}
      />
    )
  }

  if (page === 'thankYou') {
    return <ThankYou onReturnToStart={returnToWelcome} />
  }

  return (
    <StudyPage  ariaLabelledBy="study-title" 
                cardClassName="study-card--landing">
      <StudyHeading
        eyebrow={copy.welcome.heading.eyebrow}
        title={copy.welcome.heading.title}
        intro={copy.welcome.heading.intro}
        id="study-title"
      />

      <StudyFacts facts={copy.welcome.facts} />

      <div  className="study-steps"
            aria-labelledby="welcome-steps-title">

        <h2 id="welcome-steps-title">
          {copy.welcome.steps.title}
        </h2>

        <ol className="study-steps__list">
          {copy.welcome.steps.items.map((item) => (
            <li key={item} 
                className="study-steps__item">
              {item}
            </li>
          ))}
        </ol>
      </div>

      <StudyActions>
        <button
          type="button"
          className="start-button"
          onClick={() => transitionTo('consent')}
        >
          {copy.actions.startStudy}
        </button>

        <p  className="status status-note"
            aria-live="polite">
          <span className="status-note__icon"
                aria-hidden="true">
            {icons.lock}
          </span>
          {copy.welcome.status.noDataCollected}
        </p>
      </StudyActions>
    </StudyPage>
  )
}

export default App
