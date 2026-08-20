import { useState } from 'react'
import type { DemographicAnswers } from '../content/demographics'
import type { PostInterventionAnswers } from '../services'
import { type LikertSection, type StudyAnswers, blankStudyAnswers } from './studyAnswers'
import type { StepKey } from './studySteps'

export function useStudyAnswers(
  clearStepError: (step: StepKey) => void,
  initialAnswers?: StudyAnswers,
) {
  const [answers, setAnswers] = useState(() => initialAnswers ?? blankStudyAnswers())

  const changeLikertAnswer = (section: LikertSection) => (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [questionId]: value,
      },
    }))
    clearStepError(section)
  }

  const changeDemographicAnswer = (field: keyof DemographicAnswers, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      demographics: {
        ...prev.demographics,
        [field]: value,
      },
    }))
    clearStepError('demographics')
  }

  const changeFollowUpAnswer = (field: keyof PostInterventionAnswers, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      followUp: {
        ...prev.followUp,
        [field]: value,
      },
    }))
    clearStepError('followUp')
  }

  const resetAnswers = () => {
    setAnswers(blankStudyAnswers())
  }

  return {
    answers,
    resetAnswers,
    changeLikertAnswer,
    changeDemographicAnswer,
    changeFollowUpAnswer,
  }
}
