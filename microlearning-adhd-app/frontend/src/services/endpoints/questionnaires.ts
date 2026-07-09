import type { GroupAssignment } from "../../utils/groupAssignment";
import api from "../client";
import type {
  AdhdScreeningSubmission,
  QuestionnaireSubmission,
} from "../types/questionnaires";


// Converts the string-valued Likert answers held in component state into the
// numeric map the backend expects.
function toNumericAnswers(answers: Record<string, string>) {
  return Object.fromEntries(
    Object.entries(answers).map(([questionId, value]) => [
      questionId,
      Number(value),
    ]),
  );
}

async function postLikertQuestionnaire(
  participantId: string,
  path: string,
  assignment: GroupAssignment,
  answers: Record<string, string>,
) {
  const response = await api.post<QuestionnaireSubmission>(
    `/participants/${participantId}/${path}`,
    {
      assignment,
      answers: toNumericAnswers(answers),
    },
  );
  return response.data;
}

// The ADHD screening is special: its result determines the group assignment, so
// it posts only the answers and receives the freshly drawn assignment back.
export async function postAdhdScreening(
  participantId: string,
  answers: Record<string, string>,
) {
  const response = await api.post<AdhdScreeningSubmission>(
    `/participants/${participantId}/adhd-screening`,
    {
      answers: toNumericAnswers(answers),
    },
  );
  return response.data;
}

export async function postPanasPre(
  participantId: string,
  assignment: GroupAssignment,
  answers: Record<string, string>,
) {
  return postLikertQuestionnaire(participantId, "panas-pre", assignment, answers);
}

export async function postPanasPost(
  participantId: string,
  assignment: GroupAssignment,
  answers: Record<string, string>,
) {
  return postLikertQuestionnaire(participantId, "panas-post", assignment, answers);
}

export async function postFam(
  participantId: string,
  assignment: GroupAssignment,
  answers: Record<string, string>,
) {
  return postLikertQuestionnaire(participantId, "fam", assignment, answers);
}

export async function postUes(
  participantId: string,
  assignment: GroupAssignment,
  answers: Record<string, string>,
) {
  return postLikertQuestionnaire(participantId, "ues", assignment, answers);
}
