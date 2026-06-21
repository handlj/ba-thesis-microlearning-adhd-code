import axios from "axios";
import { type DemographicAnswers, type GroupAssignment } from "./../utils/groupAssignment";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export type ControlVideo = {
  title: string;
  description: string;
  video_url: string;
};

export type InstructionVideo = {
  video_url: string;
};

export type ExperimentalVideo = {
  id: string;
  title: string;
  description: string;
  video_url: string;
};

export type ConsentSession = {
  participant_id: string;
  consented_at: string;
};

export type DemographicsSubmission = {
  participant_id: string;
};

export type AdhdScreeningSubmission = {
  participant_id: string;
  assignment: GroupAssignment;
  submitted_at: string;
};

export type PostInterventionAnswers = {
  attentionSupport: string;
  contentClarity: string;
  workloadFit: string;
  preferredFormat: string;
  openFeedback: string;
};

export type PostInterventionSubmission = {
  participant_id: string;
  submitted_at: string;
};

export type StudyInteractionPayload = Record<string, string | number | boolean | null>;

export type StudyInteractionEvent = {
  group: GroupAssignment;
  page: string;
  event_type: string;
  occurred_at: string;
  payload?: StudyInteractionPayload;
};

export type StudyInteractionEventResponse = {
  id: number;
  received_at: string;
};

export async function createConsentSession() {
  const response = await api.post<ConsentSession>("/participants/consent", {
    consented: true,
  });
  return response.data;
}

export async function submitDemographics(
  participantId: string,
  demographics: DemographicAnswers,
) {
  const response = await api.post<DemographicsSubmission>(
    `/participants/${participantId}/demographics`,
    {
      age: Number(demographics.age),
      gender: demographics.gender,
      study_background: demographics.studyBackground,
      adhd_diagnosis: demographics.adhdDiagnosis,
    },
  );
  return response.data;
}

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

export type QuestionnaireSubmission = {
  participant_id: string;
  submitted_at: string;
};

export type QuizSubmission = {
  participant_id: string;
  answer_count: number;
  submitted_at: string;
};

export type QuizAnswerSubmission = {
  group: GroupAssignment;
  video_id: string | null;
  video_index: number | null;
  topic_id: string;
  answers: Record<string, string[]>;
};

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

async function submitLikertQuestionnaire(
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
export async function submitAdhdScreening(
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

export async function submitPanasPre(
  participantId: string,
  assignment: GroupAssignment,
  answers: Record<string, string>,
) {
  return submitLikertQuestionnaire(participantId, "panas-pre", assignment, answers);
}

export async function submitPanasPost(
  participantId: string,
  assignment: GroupAssignment,
  answers: Record<string, string>,
) {
  return submitLikertQuestionnaire(participantId, "panas-post", assignment, answers);
}

export async function submitFam(
  participantId: string,
  assignment: GroupAssignment,
  answers: Record<string, string>,
) {
  return submitLikertQuestionnaire(participantId, "fam", assignment, answers);
}

export async function submitUes(
  participantId: string,
  assignment: GroupAssignment,
  answers: Record<string, string>,
) {
  return submitLikertQuestionnaire(participantId, "ues", assignment, answers);
}

export async function submitQuizAnswers(
  participantId: string,
  submission: QuizAnswerSubmission,
) {
  const response = await api.post<QuizSubmission>(
    `/participants/${participantId}/quiz`,
    submission,
  );
  return response.data;
}

export async function fetchControlVideo() {
  const response = await api.get<ControlVideo>("/control-video");
  return response.data;
}

export async function fetchInstructionVideo() {
  const response = await api.get<InstructionVideo>("/instruction-video");
  return response.data;
}

export async function fetchExperimentalVideos() {
  const response = await api.get<ExperimentalVideo[]>("/experimental-videos");
  return response.data;
}

export async function recordInteractionEvent(
  participantId: string,
  event: Omit<StudyInteractionEvent, "occurred_at">,
) {
  const response = await api.post<StudyInteractionEventResponse>(
    `/participants/${participantId}/events`,
    {
      ...event,
      occurred_at: new Date().toISOString(),
    },
  );
  return response.data;
}

export default api;
