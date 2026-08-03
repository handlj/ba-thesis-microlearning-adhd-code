import { useState } from 'react'
import '@assets/styles/App.css'
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
  type StudyInteractionPayload,
} from '../../services/index.ts'
import { type GroupAssignment } from '../../utils/groupAssignment.ts'
import { validateDemographics } from '../../utils/demographicsValidation.ts'
import { copy } from '../../content/copy.ts'
import { useScrollToTop } from '../../hooks/useScrollToTop.ts'
import PreQuiz from './PreQuiz.tsx'
import { useStudyAnswers } from '../../shell/useStudyAnswers.ts'
import type { Page } from '../../shell/pageOrder.ts'
import { buildQuestionnaireHandlers } from '../../shell/questionnaireHandler.ts'
import { useStepStatus } from '../../shell/useStepStatus.ts'
import Welcome from './Welcome.tsx'
import { createInteractionLogger } from '../../shell/interactionLog.ts'
import { useQuizResults } from '../../shell/useQuizResults.ts'
import axios from 'axios'

function App() {

  /* 
    Set landing page
    Deviations from "welcome" are made only for testing purposes.
    These have to be reverted before deployment.
  */
  const [page, setPage] = useState<Page>('welcome') // default: 'welcome'
  const [participantId, setParticipantId] = useState<string | null>(null)
  const [assignment, setAssignment] = useState<GroupAssignment | null>(null)
   
  const [agreed, setAgreed] = useState(false)
    
  const { answers, setLikertAnswer, setDemographicAnswer, setFollowUpAnswer, resetAnswers } = useStudyAnswers()
  const { errors, setStepError, clearStepError, resetStepErrors, savingStep, setSavingStep, submitLockRef } = useStepStatus()
  
  const { results, postCorrect, completeScores, recordPreQuiz, recordControlQuiz, recordExperimentalQuiz, resetQuizResults } = useQuizResults(participantId, assignment)

  useScrollToTop(page)

  const logInteraction = createInteractionLogger(participantId ?? '', assignment)

  const resetStudyState = () => {
    setAgreed(false)
    resetAnswers()
    setParticipantId(null)
    resetStepErrors()
    setSavingStep(null)
    submitLockRef.current = false
    setAssignment(null)
    resetQuizResults()
  }

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

  const logStudyInteraction = ( // TODO: Make redundant through logInteraction and remove this function
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

      transitionTo('demographics')
    } catch (requestError) {

      const message = axios.isAxiosError(requestError) && requestError.code === 'ECONNABORTED'
      ? copy.errors.timeout
      : requestError instanceof Error
        ? requestError.message
        : copy.errors.consentSave

      setStepError('consent', message)
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

      const message = axios.isAxiosError(requestError) && requestError.code === 'ECONNABORTED'
        ? copy.errors.timeout
        : requestError instanceof Error
          ? requestError.message
          : copy.errors.demographicsSave

      setStepError('demographics', message)
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

  const handleFollowUpSubmit = async (wantsFeedback: 'yes' | 'no') => {
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

      transitionTo(wantsFeedback === 'yes' && completeScores ? 'feedback' : 'thankYou')
    } catch (requestError) {

      const message = axios.isAxiosError(requestError) && requestError.code === 'ECONNABORTED'
        ? copy.errors.timeout
        : requestError instanceof Error
          ? requestError.message
          : copy.errors.postInterventionSave

      setStepError('followUp', message)
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
        onLogInteraction={logInteraction('ready')}
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
            logStudyInteraction(assignment, eventType, payload, 'preQuiz') // TODO: Replace through logInteraction as well
          }
        }}
        onSubmitQuiz={(answers) => {
          if (!assignment) return
          recordPreQuiz(answers)
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
        onLogInteraction={logInteraction('control')}
        onSubmitQuiz={(answers) => {
          recordControlQuiz(answers)
        }}
      />
    )
  }

  if (page === 'experimental') {
    return (
      <ExperimentalGroup
        onBackToStart={returnToWelcome}
        onCompleteIntervention={completeIntervention}
        onLogInteraction={logInteraction('experimental')}
        onSubmitQuiz={(submission) => {
          recordExperimentalQuiz(submission)
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
        error={errors.followUp}
        isSubmitting={savingStep === 'followUp'}
        onChange={(field, value) => {
          setFollowUpAnswer(field, value)
          clearStepError('followUp')
        }}
        onSubmit={handleFollowUpSubmit}
      />
    )
  }

  if (page === 'feedback' && assignment) {
    return (
      <QuizFeedback
        assignment={assignment}
        preCorrect={results.preCorrect ?? 0}
        postCorrect={postCorrect ?? 0}
        onContinue={() => transitionTo('thankYou')}
      />
    )
  }

  if (page === 'thankYou') {
    return <ThankYou onReturnToStart={returnToWelcome} />
  }

  return <Welcome onStart={() => transitionTo('consent')} />
}

export default App
