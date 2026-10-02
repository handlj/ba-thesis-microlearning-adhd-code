import { adhdScreening } from '@content/questionnaires/adhdScreening.ts'
import { defaultDemographics, type DemographicAnswers } from '@content/pages/demographics.ts'
import { fam } from '@content/questionnaires/fam.ts'
import { panas } from '@content/questionnaires/panas.ts'
import { ues } from '@content/questionnaires/ues.ts'
import type { PostInterventionAnswers } from '../services'
import { blankAnswers } from '../utils/blankAnswers'

export const LIKERT_SECTIONS = ['adhdScreening', 'fam', 'prePanas', 'postPanas', 'ues'] as const
export type LikertSection = (typeof LIKERT_SECTIONS)[number]

export type StudyAnswers = Record<LikertSection, Record<string, string>> & {
  demographics: DemographicAnswers
  followUp: PostInterventionAnswers
}

export function blankStudyAnswers(): StudyAnswers {
  return {
    demographics: { ...defaultDemographics },
    adhdScreening: blankAnswers(adhdScreening.questions),
    fam: blankAnswers(fam.questions),
    prePanas: blankAnswers(panas.questions),
    postPanas: blankAnswers(panas.questions),
    ues: blankAnswers(ues.questions),
    followUp: { openFeedback: '' },
  }
}
