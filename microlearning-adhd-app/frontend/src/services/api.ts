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
  assignment: GroupAssignment;
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
      attention_support: answers.attentionSupport,
      content_clarity: answers.contentClarity,
      workload_fit: answers.workloadFit,
      preferred_format: answers.preferredFormat,
      open_feedback: answers.openFeedback,
    },
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
