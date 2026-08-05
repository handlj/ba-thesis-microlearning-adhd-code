import { type GroupAssignment, type Subgroup } from './../../utils/groupAssignment'

export type QuestionnaireSubmission = {
  participant_id: string
  submitted_at: string
}

export type AdhdScreeningSubmission = {
  participant_id: string
  assignment: GroupAssignment
  subgroup: Subgroup
  submitted_at: string
}
