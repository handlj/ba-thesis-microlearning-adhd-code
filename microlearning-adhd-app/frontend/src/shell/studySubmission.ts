import { copy } from '../content/copy'
import { postConsentSession, postDemographics, postPostInterventionQuestionnaire } from '../services'
import { validateDemographics } from '../utils/demographicsValidation'
import type { GroupAssignment } from '../utils/groupAssignment'
import type { Page } from './pageOrder'
import { questionnaireStepConfigs, type QuestionnaireKey, type StepConfig } from './questionnaireSteps'
import { runSubmission, type SubmissionStatus } from './runSubmission'
import type { StudyAnswers } from './studyAnswers'
import type { StepKey } from './studySteps'

type StudySubmissionDeps = {
  answers: StudyAnswers
  participantId: string
  groupAssignment: GroupAssignment | null
  consented: boolean
  completeScores: boolean
  savingStep: StepKey | null
  submitLockRef: { current: boolean }
  setStepError: (step: StepKey, error: string | null) => void
  setSavingStep: (step: StepKey | null) => void
  setParticipantId: (id: string) => void
  onAssigned: (assignment: GroupAssignment) => void
  goTo: (page: Page) => void
  goNext: (from: Page) => void
}

export type StudySubmissions = Record<Exclude<StepKey, 'followUp'>, () => Promise<void>> & {
  followUp: (wantsFeedback: 'yes' | 'no') => Promise<void>
}

export function buildStudySubmissions(deps: StudySubmissionDeps): StudySubmissions {
  const status: SubmissionStatus = {
    submitLockRef: deps.submitLockRef,
    setStepError: deps.setStepError,
    setSavingStep: deps.setSavingStep,
  }

  const buildHandler = (config: StepConfig) => async () => {
    const { participantId, groupAssignment, answers } = deps
    const given = answers[config.section]

    if (config.questions.some((question) => !given[question.id]?.trim())) {
      deps.setStepError(config.step, config.invalidMessage)
      return
    }

    if (!participantId) {
      deps.setStepError(config.step, copy.errors.questionnaireMissingSession)
      return
    }

    let invoke: () => Promise<Record<string, string> | void>

    if (config.needsAssignment) {
      if (!groupAssignment) {
        deps.setStepError(config.step, copy.errors.questionnaireMissingSession)
        return
      }

      invoke = () => config.run({ participantId, assignment: groupAssignment, answers: given })
    } else {
      invoke = () => config.run({ participantId, answers: given })
    }

    await runSubmission(status, config.step, copy.errors.questionnaireSave, async () => {
      await invoke()
      deps.goNext(config.step)
    })
  }

  const questionnaireHandlers = Object.fromEntries(
    Object.entries(questionnaireStepConfigs(deps.onAssigned)).map(([key, config]) => [key, buildHandler(config)]),
  ) as Record<QuestionnaireKey, () => Promise<void>>

  const handleConsent = async () => {
    if (!deps.consented || deps.savingStep === 'consent') return

    await runSubmission(status, 'consent', copy.errors.consentSave, async () => {
      if (deps.participantId) {
        deps.goNext('consent')
        return
      }
      const consentSession = await postConsentSession()
      deps.setParticipantId(consentSession.participant_id)
      deps.goNext('consent')
    })
  }

  const handleDemographics = async () => {
    const validation = validateDemographics(deps.answers.demographics)
    if (!validation.valid) {
      deps.setStepError('demographics', validation.error)
      return
    }

    const { participantId } = deps
    if (!participantId) {
      deps.setStepError('demographics', copy.errors.demographicsMissingSession)
      return
    }

    await runSubmission(status, 'demographics', copy.errors.demographicsSave, async () => {
      await postDemographics(participantId, deps.answers.demographics)
      deps.goNext('demographics')
    })
  }

  // preQuiz persists nothing here — the quiz answers are posted by
  // useQuizResults.recordPreQuiz — so it never touches runSubmission.
  const handlePreQuiz = async () => {
    const { participantId, groupAssignment } = deps
    if (!participantId || !groupAssignment) {
      deps.setStepError('preQuiz', copy.errors.questionnaireMissingSession)
      return
    }

    deps.goTo(groupAssignment) // GroupAssignment members are also Page members
  }

  const handleFollowUp = async (wantsFeedback: 'yes' | 'no') => {
    const { participantId, groupAssignment } = deps
    if (!participantId || !groupAssignment) {
      deps.setStepError('followUp', copy.errors.postInterventionMissingSession)
      return
    }

    await runSubmission(status, 'followUp', copy.errors.postInterventionSave, async () => {
      await postPostInterventionQuestionnaire(participantId, groupAssignment, deps.answers.followUp)
      deps.goTo(wantsFeedback === 'yes' && deps.completeScores ? 'feedback' : 'thankYou')
    })
  }

  return {
    ...questionnaireHandlers,
    consent: handleConsent,
    demographics: handleDemographics,
    preQuiz: handlePreQuiz,
    followUp: handleFollowUp,
  }
}
