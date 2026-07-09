import api from "../client";
import type { ControlVideo, ExperimentalVideo, InstructionVideo } from "../types/videos";


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
