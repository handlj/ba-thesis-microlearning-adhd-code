import { useState } from 'react'
import '@assets/styles/App.css'
import StudyActions from '../../components/StudyActions.tsx'
import StudyFacts from '../../components/StudyFacts.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import { genericIcons } from '@assets/icons/genericIcons.tsx'
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
  postDemographics,
  postPostInterventionQuestionnaire,
  postQuizAnswers,
  type QuizAnswerSubmission,
  type StudyInteractionPayload,
} from '../../services/index.ts'
import { type GroupAssignment } from '../../utils/groupAssignment.ts'
import { validateDemographics } from '../../utils/demographicsValidation.ts'
import { copy } from '../../content/copy.ts'
import { scoreQuiz } from '../../utils/quizScoring.ts'
import { allQuizQuestions, quizTopics, type QuizTopic } from '../../content/quiz.ts'
import type { QuizAnswers } from '../../components/quiz/useQuizAnswers.ts'
import { useScrollToTop } from '../../hooks/useScrollToTop.ts'
import PreQuiz from './PreQuiz.tsx'
import { useStudyAnswers } from '../../shell/useStudyAnswers.ts'
import type { Page } from '../../shell/pageOrder.ts'
import { buildQuestionnaireHandlers } from '../../shell/questionnaireHandler.ts'
import { useStepStatus } from '../../shell/useStepStatus.ts'

const PARTICIPANT_ID_KEY = 'study.participantId'

function App() {

  /* 
    Set landing page
    Deviations from "welcome" are made only for testing purposes.
    These have to be reverted before deployment.
  */
  const [page, setPage] = useState<Page>('welcome') // default: 'welcome'
   
  const [agreed, setAgreed] = useState(false)
    
  const { answers, setLikertAnswer, setDemographicAnswer, setFollowUpAnswer, resetAnswers } = useStudyAnswers()
  const { errors, setStepError, clearStepError, resetStepErrors, savingStep, setSavingStep, submitLockRef } = useStepStatus()
    
  const [participantId, setParticipantId] = useState<string | null>(() =>
    localStorage.getItem(PARTICIPANT_ID_KEY),
  )
  
  const [assignment, setAssignment] = useState<GroupAssignment | null>(null)
  const [wantsFeedback, setWantsFeedback] = useState<'yes' | 'no'>('no')
  const [preQuizCorrect, setPreQuizCorrect] = useState<number | null>(null)
  const [controlPostQuizCorrect, setControlPostQuizCorrect] = useState<
    number | null
  >(null)
  const [experimentalTopicScores, setExperimentalTopicScores] = useState<
    Record<string, number>
  >({})

  useScrollToTop(page)

  const resetStudyState = () => {
    setAgreed(false)
    resetAnswers()
    setParticipantId(null)
    resetStepErrors()
    setSavingStep(null)
    submitLockRef.current = false
    setAssignment(null)
    setWantsFeedback('no')
    setPreQuizCorrect(null)
    setControlPostQuizCorrect(null)
    setExperimentalTopicScores({})
    localStorage.removeItem(PARTICIPANT_ID_KEY) // FIXME: Is PARTICIPANT_ID_KEY needed (in localStorage)?
  }

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

  const transitionTo = (nextPage: Page) => {
    setPage(nextPage)
  }

  const logStudyInteraction = (
    assignment: GroupAssignment,
    eventType: string,
    payload?: StudyInteractionPayload,
    interactionPage: string = assignment,
  ) => {
    if (!participantId) {
      return
    }

    void postInteractionEvent(participantId, {
      assignment,
      page: interactionPage,
      event_type: eventType,
      payload,
    }).catch((requestError) => {
      console.error(copy.errors.interactionPersist, requestError)
    })
  }

  const submitQuizForGroup = (
    submission: Omit<QuizAnswerSubmission, 'assignment'> & {
      assignment: GroupAssignment
    },
  ) => {
    if (!participantId) {
      return
    }

    void postQuizAnswers(participantId, submission).catch((requestError) => {
      console.error(copy.errors.quizSave, requestError)
    })
  }

  // buildQuestionnaireHandlers only captures submitLockRef into the async
  // event-handler closures it returns; it never reads .current during render.
  // eslint-disable-next-line react-hooks/refs
  const submit = buildQuestionnaireHandlers({
    answers,
    participantId,
    assignment,
    submitLockRef,
    setStepError,
    setSavingStep,
    transitionTo,
    onAssigned: setAssignment,
  })

  const handleConsentProceed = async () => { // TODO: Rename to handleConsentSubmit for consistency
    if (!agreed || savingStep === 'consent') return

    if (submitLockRef.current) return

    try {
      submitLockRef.current = true
      clearStepError('consent')
      setSavingStep('consent')

      const consentSession = await postConsentSession()
      setParticipantId(consentSession.participant_id)

      localStorage.setItem(PARTICIPANT_ID_KEY, consentSession.participant_id)

      transitionTo('demographics')
    } catch (requestError) {
      setStepError('consent',
        requestError instanceof Error
          ? requestError.message
          : copy.errors.consentSave,
      )
    } finally {
      submitLockRef.current = false
      setSavingStep(null)
    }
  }

  const handleDemographicsSubmit = async () => {
    const validation = validateDemographics(answers.demographics)
    if (!validation.valid) {
      setStepError('demographics', validation.error)
      return
    }

    if (!participantId) {
      setStepError('demographics', copy.errors.demographicsMissingSession)
      return
    }

    if (submitLockRef.current) return

    try {
      submitLockRef.current = true
      clearStepError('demographics')
      setSavingStep('demographics')

      await postDemographics(participantId, answers.demographics)

      transitionTo('adhdScreening')
    } catch (requestError) {
      setStepError('demographics',
        requestError instanceof Error
          ? requestError.message
          : copy.errors.demographicsSave,
      )
    } finally {
      submitLockRef.current = false
      setSavingStep(null)
    }
  }

  const handlePreQuizSubmit = () => {
    if (!participantId || !assignment) {
      setStepError('preQuiz', copy.errors.questionnaireMissingSession)
      return
    }

    if (assignment === 'control') {
      transitionTo('control')
    } else if (assignment === 'experimental') {
      transitionTo('experimental')
    }
  }

  const handleFollowUpSubmit = async () => {
    if (!participantId || !assignment) {
      setStepError('followUp', copy.errors.postInterventionMissingSession)
      return
    }

    if (submitLockRef.current) return

    try {
      submitLockRef.current = true
      clearStepError('followUp')
      setSavingStep('followUp')

      await postPostInterventionQuestionnaire(
        participantId,
        assignment,
        answers.followUp,
      )

      const hasScores =
        preQuizCorrect !== null &&
        (assignment === 'control'
          ? controlPostQuizCorrect !== null
          : Object.keys(experimentalTopicScores).length > 0)
      transitionTo(wantsFeedback === 'yes' && hasScores ? 'feedback' : 'thankYou')
    } catch (requestError) {
      setStepError('followUp',
        requestError instanceof Error
          ? requestError.message
          : copy.errors.postInterventionSave,
      )
    } finally {
      submitLockRef.current = false
      setSavingStep(null)
    }
  }

  if (page === 'consent') {
    return (
      <Consent
        agreed={agreed}
        error={errors.consent}
        isSubmitting={savingStep === 'consent'}
        onAgreementChange={(nextAgreed) => {
          setAgreed(nextAgreed)
          clearStepError('consent')
        }}
        onProceed={handleConsentProceed}
        onBack={returnToWelcome}
      />
    )
  }

  if (page === 'demographics') {
    return (
      <Demographics
        values={answers.demographics}
        error={errors.demographics}
        isSubmitting={savingStep === 'demographics'}
        onChange={(field, value) => {
          setDemographicAnswer(field, value)
          clearStepError('demographics')
        }}
        onBack={() => transitionTo('consent')}
        onSubmit={handleDemographicsSubmit}
      />
    )
  }

  if (page === 'adhdScreening') {
    return (
      <AdhdScreeningQuestionnaire
        values={answers.adhdScreening}
        error={errors.adhdScreening}
        isSubmitting={savingStep === 'adhdScreening'}
        onChange={(questionId, value) => {
          setLikertAnswer('adhdScreening', questionId, value)
          clearStepError('adhdScreening')
        }}
        onBack={() => transitionTo('demographics')}
        onSubmit={submit.adhdScreening}
      />
    )
  }

  if (page === 'prePanas') {
    return (
      <PanasQuestionnaire
        values={answers.prePanas}
        error={errors.prePanas}
        isSubmitting={savingStep === 'prePanas'}
        onChange={(questionId, value) => {
          setLikertAnswer('prePanas', questionId, value)
          clearStepError('prePanas')
        }}
        onBack={() => transitionTo('adhdScreening')}
        onSubmit={submit.prePanas}
      />
    )
  }

  if (page === 'ready') {
    return (
      <Ready
        assignment={assignment}
        onContinue={() => transitionTo('fam')}
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
        values={answers.fam}
        error={errors.fam}
        isSubmitting={savingStep === 'fam'}
        onChange={(questionId, value) => {
          setLikertAnswer('fam', questionId, value)
          clearStepError('fam')
        }}
        onBack={() => transitionTo('ready')}
        onSubmit={submit.fam}
      />
    )
  }

  if (page === 'preQuiz') {
    return (
      <PreQuiz
        onSubmit={handlePreQuizSubmit}
        onBack={() => transitionTo('fam')}
        onLogInteraction={(eventType, payload) => {
          clearStepError('preQuiz')
          if (assignment) {
            logStudyInteraction(assignment, eventType, payload, 'preQuiz')
          }
        }}
        onSubmitQuiz={(answers) => {
          if (!assignment) return
          setPreQuizCorrect(scoreAll(answers))
          submitQuizForGroup({
            assignment,
            video_id: null,
            video_index: null,
            topic_id: 'pre-quiz',
            answers,
          })
        }}
        error={errors.preQuiz}
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
            assignment: 'control',
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
          submitQuizForGroup({ assignment: 'experimental', ...submission })
        }}
      />
    )
  }

  if (page === 'postPanas') {
    return (
      <PanasQuestionnaire
        values={answers.postPanas}
        error={errors.postPanas}
        isSubmitting={savingStep === 'postPanas'}
        onChange={(questionId, value) => {
          setLikertAnswer('postPanas', questionId, value)
          clearStepError('postPanas')
        }}
        onSubmit={submit.postPanas}
      />
    )
  }

  if (page === 'ues') {
    return (
      <UESQuestionnaire
        values={answers.ues}
        error={errors.ues}
        isSubmitting={savingStep === 'ues'}
        onChange={(questionId, value) => {
          setLikertAnswer('ues', questionId, value)
          clearStepError('ues')
        }}
        onSubmit={submit.ues}
      />
    )
  }

  if (page === 'followUp') {
    return (
      <FollowUpQuestionnaire
        values={answers.followUp}
        wantsFeedback={wantsFeedback}
        error={errors.followUp}
        isSubmitting={savingStep === 'followUp'}
        onChange={(field, value) => {
          setFollowUpAnswer(field, value)
          clearStepError('followUp')
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
            {genericIcons.lock}
          </span>
          {copy.welcome.status.noDataCollected}
        </p>
      </StudyActions>
    </StudyPage>
  )
}

export default App
