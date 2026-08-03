import axios from 'axios'
import { copy } from '../content/copy'
import type { StepKey } from './studySteps'

export type SubmissionStatus = {
  submitLockRef: { current: boolean }
  setStepError: (step: StepKey, error: string | null) => void
  setSavingStep: (step: StepKey | null) => void
}

export function submissionErrorMessage(requestError: unknown, fallbackMessage: string): string {
  if (axios.isAxiosError(requestError) && requestError.code === 'ECONNABORTED') {
    return copy.errors.timeout
  }

  // Insert more specific error handling here if needed; fallbackMessage should not be reached at this point.
  if (requestError instanceof Error) {
    return requestError.message
  }

  return fallbackMessage
}

export async function runSubmission(
  status: SubmissionStatus,
  step: StepKey,
  fallbackMessage: string,
  invoke: () => Promise<void>,
): Promise<void> {
  const { submitLockRef, setStepError, setSavingStep } = status

  if (submitLockRef.current) return

  try {
    submitLockRef.current = true
    setStepError(step, null)
    setSavingStep(step)

    await invoke()
  } catch (requestError) {
    setStepError(step, submissionErrorMessage(requestError, fallbackMessage))
  } finally {
    submitLockRef.current = false
    setSavingStep(null)
  }
}
