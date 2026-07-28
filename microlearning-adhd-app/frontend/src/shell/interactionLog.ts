import { copy } from '../content/copy.ts'
import { postInteractionEvent, type StudyInteractionPayload } from '../services/index.ts'
import type { GroupAssignment } from '../utils/groupAssignment.ts'

export type LogInteraction = (
  eventType: string,
  payload?: StudyInteractionPayload
) => void

export function createInteractionLogger(
  participantId: string,
  assignment: GroupAssignment | null,
): (interactionPage: string) => LogInteraction {
  return (interactionPage) => (eventType, payload) => {
    if (!participantId || !assignment) return

    void postInteractionEvent(participantId, {
      assignment,
      page: interactionPage,
      event_type: eventType,
      payload,
    }).catch((requestError) => {
      console.error(copy.errors.interactionPersist, requestError)
    })
  }
}
