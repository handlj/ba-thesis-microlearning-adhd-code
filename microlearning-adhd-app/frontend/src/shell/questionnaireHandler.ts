import axios from 'axios'
import { copy } from '../content/copy'
import type { GroupAssignment } from '../utils/groupAssignment'
import type { Page } from './pageOrder'
import type { QuestionnaireKey, StepConfig } from './questionnaireSteps'
import { questionnaireStepConfigs } from './questionnaireSteps'
import type { StudyAnswers } from './studyAnswers'
import type { StepKey } from './studySteps'

type QuestionnaireStepDeps = {
  answers: StudyAnswers
  participantId: string | null
  assignment: GroupAssignment | null
  submitLockRef: { current: boolean }
  setStepError: (step: StepKey, error: string | null) => void
  setSavingStep: (step: StepKey | null) => void
  transitionTo: (page: Page) => void
  onAssigned: (assignment: GroupAssignment) => void
}

export function buildQuestionnaireHandlers(
  deps: QuestionnaireStepDeps,
): Record<QuestionnaireKey, () => Promise<void>> {
  const {
    answers,
    participantId,
    assignment,
    submitLockRef,
    setStepError,
    setSavingStep,
    transitionTo,
    onAssigned,
  } = deps

  const buildHandler = (config: StepConfig) => async () => {
    const given = answers[config.section]

    if (config.questions.some((question) => !given[question.id]?.trim())) {
      setStepError(config.step, config.invalidMessage)
      return
    }

    if (!participantId) {
      setStepError(config.step, copy.errors.questionnaireMissingSession)
      return
    }

    let invoke: () => Promise<Record<string, string> | void>

    if (config.needsAssignment) {
      if (!assignment) {
        setStepError(config.step, copy.errors.questionnaireMissingSession)
        return
      }

      const settled = assignment

      invoke = () => config.run({ participantId, assignment: settled, answers: given })
    } else {
      invoke = () => config.run({ participantId, answers: given })
    }

    if (submitLockRef.current) return
    setSavingStep(config.step)

    try {
      submitLockRef.current = true

      await invoke()

      setStepError(config.step, null)
      transitionTo(config.next)

    } catch (requestError) {

      const message = axios.isAxiosError(requestError) && requestError.code === 'ECONNABORTED'
        ? copy.errors.timeout
        : requestError instanceof Error
          ? requestError.message
          : copy.errors.questionnaireSave

      setStepError(config.step, message)
    } finally {
      submitLockRef.current = false
      setSavingStep(null)
    }
  }

  const configs = questionnaireStepConfigs(onAssigned)

  return Object.fromEntries(
    Object.entries(configs).map(([key, config]) => [key, buildHandler(config)]),
  ) as Record<QuestionnaireKey, () => Promise<void>>
}
