import api from "../client";
import type { ConsentSession } from "../types/consent";


export async function postConsentSession() {
  const response = await api.post<ConsentSession>("/participants/consent", {
    consented: true,
  });
  return response.data;
}
