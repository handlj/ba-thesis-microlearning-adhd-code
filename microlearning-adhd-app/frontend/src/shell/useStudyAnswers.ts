import { useState } from 'react'
import type { PostInterventionAnswers } from '../services'
import type { DemographicAnswers } from '../utils/groupAssignment'
import { type LikertSection, blankStudyAnswers } from './studyAnswers'

export function useStudyAnswers() {
  const [answers, setAnswers] = useState(blankStudyAnswers)

  const setLikertAnswer = (section: LikertSection, questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [questionId]: value
      }
    }))
  }

  const setDemographicAnswer = (field: keyof DemographicAnswers, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      demographics: {
        ...prev.demographics,
        [field]: value
      }
    }))
  }

  const setFollowUpAnswer = (field: keyof PostInterventionAnswers, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      followUp: {
        ...prev.followUp,
        [field]: value
      }
    }))
  }

  const resetAnswers = () => { setAnswers(blankStudyAnswers()) }

  return { answers, setLikertAnswer, setDemographicAnswer, setFollowUpAnswer, resetAnswers }
}