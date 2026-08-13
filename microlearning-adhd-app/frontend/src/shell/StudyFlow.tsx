import { useState, type ComponentType, type ReactNode } from 'react'
import '@assets/styles/App.css'
import { type GroupAssignment, type Subgroup } from '../utils/groupAssignment.ts'
import { useScrollToTop } from '../hooks/useScrollToTop.ts'
import { useStudyAnswers } from '../shell/useStudyAnswers.ts'
import type { Page } from '../shell/pageOrder.ts'
import { useStepStatus } from '../shell/useStepStatus.ts'
import { createInteractionLogger } from '../shell/interactionLog.ts'
import { useQuizResults } from '../shell/useQuizResults.ts'
import { isPageInsideSession, nextPage, previousPage } from '../shell/pageOrder.ts'
import Welcome from '../views/pages/Welcome.tsx'
import Consent from '../views/pages/Consent.tsx'
import AdhdScreeningQuestionnaire from '../views/questionnaires/AdhdScreeningQuestionnaire.tsx'
import Demographics from '../views/pages/Demographics.tsx'
import PanasQuestionnaire from '../views/questionnaires/PanasQuestionnaire.tsx'
import Ready from '../views/pages/Ready.tsx'
import FAMQuestionnaire from '../views/questionnaires/FAMQuestionnaire.tsx'
import PreQuiz from '../views/pages/PreQuiz.tsx'
import ControlGroup from '../views/pages/ControlGroup'
import ExperimentalGroup from '../views/pages/ExperimentalGroup'
import UESQuestionnaire from '../views/questionnaires/UESQuestionnaire.tsx'
import FollowUpQuestionnaire from '../views/questionnaires/FollowUpQuestionnaire.tsx'
import QuizFeedback from '../views/pages/QuizFeedback.tsx'
import ThankYou from '../views/pages/ThankYou.tsx'
import { QUESTIONNAIRE_KEYS, type Allocation, type QuestionnaireKey } from './questionnaireSteps.ts'
import type { LikertQuestionnaireProps } from '../views/questionnaires/types.ts'
import { buildStudySubmissions } from './studySubmission.ts'
import { resetStudySubgroup, setStudySubgroup } from '../utils/videoFeatures.ts'
import { useReloadWarning } from '../hooks/useReloadWarning.ts'

function StudyFlow() {
  const [currentPage, setCurrentPage] = useState<Page>('welcome')

  const [participantId, setParticipantId] = useState<string>('')
  const [groupAssignment, setGroupAssignment] = useState<GroupAssignment | null>(null)
  const [subgroup, setSubgroup] = useState<Subgroup | null>(null)
  const [consent, setConsent] = useState<boolean>(false)

  const {
    errors,
    setStepError,
    clearStepError,
    resetStepErrors,
    savingStep,
    setSavingStep,
    submitLockRef,
  } = useStepStatus()
  const {
    answers,
    resetAnswers,
    changeLikertAnswer,
    changeDemographicAnswer,
    changeFollowUpAnswer,
  } = useStudyAnswers(clearStepError)
  const {
    results,
    postCorrect,
    completeScores,
    recordPreQuiz,
    recordControlQuiz,
    recordExperimentalQuiz,
    resetQuizResults,
  } = useQuizResults(participantId, groupAssignment, subgroup)

  useScrollToTop(currentPage)
  useReloadWarning(isPageInsideSession(currentPage))

  const logInteraction = createInteractionLogger(participantId, groupAssignment, subgroup)

  const handleAllocated = ({ assignment, subgroup: allocatedSubgroup }: Allocation) => {
    setGroupAssignment(assignment)
    setSubgroup(allocatedSubgroup)
    setStudySubgroup(allocatedSubgroup)
  }

  // --- navigation ---

  const resetStudyState = () => {
    setConsent(false)
    resetAnswers()
    setParticipantId('')
    resetStepErrors()
    setSavingStep(null)
    setGroupAssignment(null)
    setSubgroup(null)
    resetStudySubgroup()
    resetQuizResults()
    submitLockRef.current = false
  }

  const goTo = (targetPage: Page) => {
    if (targetPage === 'welcome') resetStudyState()
    setCurrentPage(targetPage)
  }

  const goNext = (from: Page) => {
    const targetPage = nextPage(from)
    if (targetPage) goTo(targetPage)
  }

  const goBack = () => {
    const targetPage = previousPage(currentPage)
    if (targetPage) goTo(targetPage)
  }

  // --- submissions ---

  // buildStudySubmissions only captures submitLockRef into the async event-handler closures it returns; it never reads .current during render.
  // eslint-disable-next-line react-hooks/refs
  const submit = buildStudySubmissions({
    answers,
    participantId,
    groupAssignment,
    subgroup,
    consented: consent,
    completeScores,
    savingStep,
    submitLockRef,
    setStepError,
    setSavingStep,
    setParticipantId,
    onAssigned: handleAllocated,
    goTo,
    goNext,
  })

  const QUESTIONNAIRE_VIEWS: Record<QuestionnaireKey, ComponentType<LikertQuestionnaireProps>> = {
    adhdScreening: AdhdScreeningQuestionnaire,
    prePanas: PanasQuestionnaire,
    fam: FAMQuestionnaire,
    postPanas: PanasQuestionnaire,
    ues: UESQuestionnaire,
  }

  const questionnaireRoutes = Object.fromEntries(
    QUESTIONNAIRE_KEYS.map((key) => [
      key,
      () => {
        const QuestionnaireComponent = QUESTIONNAIRE_VIEWS[key]

        return (
          <QuestionnaireComponent
            values={answers[key]}
            error={errors[key]}
            isSubmitting={savingStep === key}
            onChange={changeLikertAnswer(key)}
            onSubmit={submit[key]}
          />
        )
      },
    ]),
  ) as Record<QuestionnaireKey, () => ReactNode>

  // --- routes ---
  const welcomeScreen = () => (
    <Welcome
      onStart={() => {
        resetStudyState()
        goNext('welcome')
      }}
    />
  )

  const routes: Record<Page, () => ReactNode> = {
    ...questionnaireRoutes,
    welcome: welcomeScreen,
    consent: () => (
      <Consent
        agreed={consent}
        error={errors.consent}
        isSubmitting={savingStep === 'consent'}
        onAgreementChange={(nextAgreed) => {
          setConsent(nextAgreed)
          clearStepError('consent')
        }}
        onProceed={submit.consent}
        onBack={goBack}
      />
    ),
    demographics: () => (
      <Demographics
        values={answers.demographics}
        error={errors.demographics}
        isSubmitting={savingStep === 'demographics'}
        onChange={changeDemographicAnswer}
        onBack={goBack}
        onSubmit={submit.demographics}
      />
    ),
    ready: () => (
      <Ready
        assignment={groupAssignment}
        subgroup={subgroup}
        onContinue={() => goNext('ready')}
        onLogInteraction={logInteraction('ready')}
      />
    ),
    preQuiz: () => (
      <PreQuiz
        onSubmit={submit.preQuiz}
        onLogInteraction={(eventType, payload) => {
          clearStepError('preQuiz')
          logInteraction('preQuiz')(eventType, payload)
        }}
        onSubmitQuiz={recordPreQuiz}
        error={errors.preQuiz}
      />
    ),
    control: () => (
      <ControlGroup
        onCompleteIntervention={() => goNext('control')}
        onLogInteraction={logInteraction('control')}
        onSubmitQuiz={recordControlQuiz}
      />
    ),
    experimental: () => (
      <ExperimentalGroup
        onCompleteIntervention={() => goNext('experimental')}
        onLogInteraction={logInteraction('experimental')}
        onSubmitQuiz={recordExperimentalQuiz}
      />
    ),
    followUp: () => (
      <FollowUpQuestionnaire
        values={answers.followUp}
        error={errors.followUp}
        isSubmitting={savingStep === 'followUp'}
        onChange={changeFollowUpAnswer}
        onSubmit={submit.followUp}
      />
    ),
    feedback: () =>
      groupAssignment ? (
        <QuizFeedback
          assignment={groupAssignment}
          preCorrect={results.preCorrect ?? 0}
          postCorrect={postCorrect ?? 0}
          onContinue={() => goNext('feedback')}
        />
      ) : (
        welcomeScreen()
      ),
    thankYou: () => <ThankYou onReturnToStart={() => goTo('welcome')} />,
  }

  return routes[currentPage]()
}

export default StudyFlow
