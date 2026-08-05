import type { GroupAssignment, Subgroup } from '../../utils/groupAssignment'
import api from '../client'
import type { AdhdScreeningSubmission, QuestionnaireSubmission } from '../types/questionnaires'

// Converts the string-valued Likert answers held in component state into the
// numeric map the backend expects.
function toNumericAnswers(answers: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(answers).map(([questionId, value]) => [questionId, Number(value)]),
  )
}

async function postLikertQuestionnaire(
  participantId: string,
  path: string,
  assignment: GroupAssignment,
  subgroup: Subgroup,
  answers: Record<string, string>,
) {
  const response = await api.post<QuestionnaireSubmission>(
    `/participants/${participantId}/${path}`,
    {
      assignment,
      subgroup,
      answers: toNumericAnswers(answers),
    },
  )
  return response.data
}

/* postAdhdScreening returns groupAssignment and subgroup */
export async function postAdhdScreening(participantId: string, answers: Record<string, string>) {
  const response = await api.post<AdhdScreeningSubmission>(
    `/participants/${participantId}/adhd-screening`,
    {
      answers: toNumericAnswers(answers),
    },
  )
  return response.data
}

export async function postPanasPre(
  participantId: string,
  assignment: GroupAssignment,
  subgroup: Subgroup,
  answers: Record<string, string>,
) {
  return postLikertQuestionnaire(participantId, 'panas-pre', assignment, subgroup, answers)
}

export async function postPanasPost(
  participantId: string,
  assignment: GroupAssignment,
  subgroup: Subgroup,
  answers: Record<string, string>,
) {
  return postLikertQuestionnaire(participantId, 'panas-post', assignment, subgroup, answers)
}

export async function postFam(
  participantId: string,
  assignment: GroupAssignment,
  subgroup: Subgroup,
  answers: Record<string, string>,
) {
  return postLikertQuestionnaire(participantId, 'fam', assignment, subgroup, answers)
}

export async function postUes(
  participantId: string,
  assignment: GroupAssignment,
  subgroup: Subgroup,
  answers: Record<string, string>,
) {
  return postLikertQuestionnaire(participantId, 'ues', assignment, subgroup, answers)
}
