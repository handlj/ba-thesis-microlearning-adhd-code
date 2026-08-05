import api from '../client'

import type { GroupAssignment, Subgroup } from '../../utils/groupAssignment'
import type { PostInterventionAnswers, PostInterventionSubmission } from '../types/postIntervention'

export async function postPostInterventionQuestionnaire(
  participantId: string,
  assignment: GroupAssignment,
  subgroup: Subgroup,
  answers: PostInterventionAnswers,
) {
  const response = await api.post<PostInterventionSubmission>(
    `/participants/${participantId}/post-intervention`,
    {
      assignment,
      subgroup,
      open_feedback: answers.openFeedback,
    },
  )
  return response.data
}
