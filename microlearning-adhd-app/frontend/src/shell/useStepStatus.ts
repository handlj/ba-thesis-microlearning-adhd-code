import { useRef, useState } from 'react'
import type { StepKey } from './studySteps'
import { blankStepErrors } from './studySteps'

export function useStepStatus() {
  const [errors, setErrors] = useState(blankStepErrors)
  const [savingStep, setSavingStep] = useState<StepKey | null>(null)
  const submitLockRef = useRef(false)
  const setStepError = (step: StepKey, error: string | null) => {
    setErrors((prev) => (prev[step] === error ? prev : { ...prev, [step]: error }))
  }
  const clearStepError = (step: StepKey) => {
    setErrors((prev) => (prev[step] === null ? prev : { ...prev, [step]: null }))
  }

  const resetStepErrors = () => { setErrors(blankStepErrors()) }

  return { errors, setStepError, clearStepError, resetStepErrors, savingStep, setSavingStep, submitLockRef }
}
