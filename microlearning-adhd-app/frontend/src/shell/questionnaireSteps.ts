import { adhdScreening } from '../content/adhdScreening'
import { copy } from '../content/copy'
import { fam } from '../content/fam'
import { panas } from '../content/panas'
import { ues } from '../content/ues'
import {
  postAdhdScreening,
  postFam,
  postPanasPost,
  postPanasPre,
  postUes,
  type QuestionnaireSubmission,
} from '../services'
import type { GroupAssignment, Subgroup } from '../utils/groupAssignment'
import type { LikertSection } from './studyAnswers'
import type { StepKey } from './studySteps'

export type Allocation = {
  assignment: GroupAssignment
  subgroup: Subgroup
}

type Base = {
  questions: readonly { id: string }[]
  invalidMessage: string
}

export type StepDef =
  | (Base & {
      needsAssignment: true
      run: (ctx: {
        participantId: string
        assignment: GroupAssignment
        subgroup: Subgroup
        answers: Record<string, string>
      }) => Promise<QuestionnaireSubmission>
    })
  | (Base & {
      needsAssignment?: false
      run: (ctx: { participantId: string; answers: Record<string, string> }) => Promise<void>
    })

export type StepConfig = StepDef & { step: StepKey; section: LikertSection }

export const QUESTIONNAIRE_KEYS = ['adhdScreening', 'prePanas', 'fam', 'postPanas', 'ues'] as const

export type QuestionnaireKey = (typeof QUESTIONNAIRE_KEYS)[number]

const prePanasStep: StepDef = {
  questions: panas.questions,
  invalidMessage: panas.validation.allQuestions,
  needsAssignment: true,
  run: ({ participantId, assignment, subgroup, answers }) =>
    postPanasPre(participantId, assignment, subgroup, answers),
}

const famStep: StepDef = {
  questions: fam.questions,
  invalidMessage: copy.validation.preInterventionAllQuestions,
  needsAssignment: true,
  run: ({ participantId, assignment, subgroup, answers }) =>
    postFam(participantId, assignment, subgroup, answers),
}

const postPanasStep: StepDef = {
  questions: panas.questions,
  invalidMessage: panas.validation.allQuestions,
  needsAssignment: true,
  run: ({ participantId, assignment, subgroup, answers }) =>
    postPanasPost(participantId, assignment, subgroup, answers),
}

const uesStep: StepDef = {
  questions: ues.questions,
  invalidMessage: ues.validation.allQuestions,
  needsAssignment: true,
  run: ({ participantId, assignment, subgroup, answers }) =>
    postUes(participantId, assignment, subgroup, answers),
}

export function questionnaireStepConfigs(
  onAssigned: (assignment: Allocation) => void,
): Record<QuestionnaireKey, StepConfig> {
  const defs: Record<QuestionnaireKey, StepDef> = {
    adhdScreening: {
      questions: adhdScreening.questions,
      invalidMessage: adhdScreening.validation.allQuestions,
      run: async ({ participantId, answers }) => {
        const response = await postAdhdScreening(participantId, answers)
        onAssigned({ assignment: response.assignment, subgroup: response.subgroup })
      },
    },
    prePanas: prePanasStep,
    fam: famStep,
    postPanas: postPanasStep,
    ues: uesStep,
  }

  return Object.fromEntries(
    (Object.entries(defs) as [QuestionnaireKey, StepDef][]).map(([key, def]) => [
      key,
      { ...def, step: key, section: key },
    ]),
  ) as Record<QuestionnaireKey, StepConfig>
}
