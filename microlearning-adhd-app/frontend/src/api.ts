import axios from "axios";
import { type DemographicAnswers, type GroupAssignment } from "./utils/groupAssignment";

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
      study_background: demographics.studyBackground,
      adhd_diagnosis: demographics.adhdDiagnosis,
    },
  );
  return response.data;
}

export async function fetchControlVideo() {
  const response = await api.get<ControlVideo>("/control-video");
  return response.data;
}

export async function fetchExperimentalVideos() {
  const response = await api.get<ExperimentalVideo[]>("/experimental-videos");
  return response.data;
}

export default api;
