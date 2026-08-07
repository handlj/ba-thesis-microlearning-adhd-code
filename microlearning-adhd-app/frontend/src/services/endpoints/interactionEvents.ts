import api, { API_BASE_URL } from '../client'
import type {
  StudyInteractionEvent,
  StudyInteractionEventResponse,
} from '../types/interactionEvent'

type InteractionEventBody = Omit<StudyInteractionEvent, 'occurred_at'>

function stampOccurredAt(event: InteractionEventBody): StudyInteractionEvent {
  return {
    ...event,
    occurred_at: new Date().toISOString(),
  }
}

export async function postInteractionEvent(participantId: string, event: InteractionEventBody) {
  const response = await api.post<StudyInteractionEventResponse>(
    `/participants/${participantId}/events`,
    {
      ...event,
      occurred_at: stampOccurredAt(event).occurred_at,
    },
  )
  return response.data
}

export async function postInteractionEventKeepAlive(
  participantId: string,
  event: InteractionEventBody,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/participants/${participantId}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stampOccurredAt(event)),
    keepalive: true,
  })

  if (!response.ok) {
    throw new Error(`Failed to post interaction event: ${response.statusText}`)
  }
}
