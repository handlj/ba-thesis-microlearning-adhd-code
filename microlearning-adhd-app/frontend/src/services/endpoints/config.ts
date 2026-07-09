import api from "../client";
import type { Config } from "../types/config";

export async function getConfig() {
  const response = await api.get<Config>("/config");
  return response.data;
}