import { type GroupAssignment, type Subgroup } from './../../utils/groupAssignment'

export type StudyInteractionPayload = Record<string, string | number | boolean | null>

export type StudyInteractionEvent = {
  assignment: GroupAssignment
  subgroup: Subgroup
  page: string
  event_type: string
  occurred_at: string
  payload?: StudyInteractionPayload
}

export type StudyInteractionEventResponse = {
  id: number
  received_at: string
}
