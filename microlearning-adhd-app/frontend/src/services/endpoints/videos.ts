import api from "../client";
import type { ControlVideo, ExperimentalVideo, InstructionVideo } from "../types/videos";


export async function getControlVideo() {
  const response = await api.get<ControlVideo>("/control-video");
  return response.data;
}

export async function getInstructionVideo() {
  const response = await api.get<InstructionVideo>("/instruction-video");
  return response.data;
}

export async function getExperimentalVideos() {
  const response = await api.get<ExperimentalVideo[]>("/experimental-videos");
  return response.data;
}
