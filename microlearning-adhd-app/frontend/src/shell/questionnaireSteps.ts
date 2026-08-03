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
  type QuestionnaireSubmission
} from '../services'
import type { GroupAssignment } from '../utils/groupAssignment'
import type { LikertSection } from './studyAnswers'
import type { StepKey } from './studySteps'

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
      answers: Record<string, string>
    }) => Promise<QuestionnaireSubmission>
  })
  | (Base & {
    needsAssignment?: false
    run: (ctx: {
      participantId: string
      answers: Record<string, string>
    }) => Promise<void>
  })

export type StepConfig = StepDef & { step: StepKey; section: LikertSection }

export const QUESTIONNAIRE_KEYS = [
  'adhdScreening',
  'prePanas',
  'fam',
  'postPanas',
  'ues',
] as const

export type QuestionnaireKey = (typeof QUESTIONNAIRE_KEYS)[number]

const prePanasStep: StepDef = {
  questions: panas.questions,
  invalidMessage: panas.validation.allQuestions,
  needsAssignment: true,
  run: ({ participantId, assignment, answers }) =>
    postPanasPre(participantId, assignment, answers),
}

const famStep: StepDef = {
  questions: fam.questions,
  invalidMessage: copy.validation.preInterventionAllQuestions,
  needsAssignment: true,
  run: ({ participantId, assignment, answers }) =>
    postFam(participantId, assignment, answers),
}

const postPanasStep: StepDef = {
  questions: panas.questions,
  invalidMessage: panas.validation.allQuestions,
  needsAssignment: true,
  run: ({ participantId, assignment, answers }) =>
    postPanasPost(participantId, assignment, answers),
}

const uesStep: StepDef = {
  questions: ues.questions,
  invalidMessage: ues.validation.allQuestions,
  needsAssignment: true,
  run: ({ participantId, assignment, answers }) =>
    postUes(participantId, assignment, answers),
}

export function questionnaireStepConfigs(
  onAssigned: (assignment: GroupAssignment) => void,
): Record<QuestionnaireKey, StepConfig> {
  const defs: Record<QuestionnaireKey, StepDef> = {
    adhdScreening: {
      questions: adhdScreening.questions,
      invalidMessage: adhdScreening.validation.allQuestions,
      run: async ({ participantId, answers }) => {
        const response = await postAdhdScreening(participantId, answers)
        onAssigned(response.assignment)
      },
    },
    prePanas: prePanasStep,
    fam: famStep,
    postPanas: postPanasStep,
    ues: uesStep,
  }

  return Object.fromEntries(
    (Object.entries(defs) as [QuestionnaireKey, StepDef][]).map(
      ([key, def]) => [key, { ...def, step: key, section: key }],
    ),
  ) as Record<QuestionnaireKey, StepConfig>
}
