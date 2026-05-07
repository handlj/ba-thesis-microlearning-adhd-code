import axios from "axios";

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

export async function fetchControlVideo() {
  const response = await api.get<ControlVideo>("/control-video");
  return response.data;
}

export default api;
