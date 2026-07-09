import api from "../client";
import type { ConsentSession } from "../types/consent";


export async function createConsentSession() {
  const response = await api.post<ConsentSession>("/participants/consent", {
    consented: true,
  });
  return response.data;
}
