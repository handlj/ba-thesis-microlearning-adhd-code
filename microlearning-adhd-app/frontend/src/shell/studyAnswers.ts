import { adhdScreening } from "../content/adhdScreening"
import { defaultDemographics } from "../content/demographics"
import { fam } from "../content/fam"
import { panas } from "../content/panas"
import { ues } from "../content/ues"
import type { PostInterventionAnswers } from "../services"
import { blankAnswers } from "../utils/blankAnswers"
import type { DemographicAnswers } from "../utils/groupAssignment"

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
    followUp: { openFeedback: '' }
  }
}
