import { copy } from '../content/copy.ts'
import {
  postInteractionEvent,
  postInteractionEventKeepAlive,
  type StudyInteractionPayload,
} from '../services/index.ts'
import type { GroupAssignment, Subgroup } from '../utils/groupAssignment.ts'

export type LogInteraction = (eventType: string, payload?: StudyInteractionPayload) => void

export function createInteractionLogger(
  participantId: string,
  assignment: GroupAssignment | null,
  subgroup: Subgroup | null,
): (interactionPage: string) => LogInteraction {
  return (interactionPage) => (eventType, payload) => {
    if (!participantId || !assignment || !subgroup) return

    const event = {
      assignment,
      subgroup,
      page: interactionPage,
      event_type: eventType,
      payload,
    }

    const request =
      document.visibilityState === 'hidden'
        ? postInteractionEventKeepAlive(participantId, event)
        : postInteractionEvent(participantId, event)

    void request.catch((requestError) => {
      console.error(copy.errors.interactionPersist, requestError)
    })
  }
}
