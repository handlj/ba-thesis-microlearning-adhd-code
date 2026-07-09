import api from "../client";
import type { StudyInteractionEvent, StudyInteractionEventResponse } from "../types/interactionEvent";


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
