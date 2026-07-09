import api from "../client";

import type { GroupAssignment } from "../../utils/groupAssignment";
import type { PostInterventionAnswers, PostInterventionSubmission } from "../types/postIntervention";


export async function submitPostInterventionQuestionnaire(
  participantId: string,
  assignment: GroupAssignment,
  answers: PostInterventionAnswers,
) {
  const response = await api.post<PostInterventionSubmission>(
    `/participants/${participantId}/post-intervention`,
    {
      assignment,
      open_feedback: answers.openFeedback,
    },
  );
  return response.data;
}
