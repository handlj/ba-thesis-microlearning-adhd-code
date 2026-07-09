import { type GroupAssignment } from "./../../utils/groupAssignment";


export type QuestionnaireSubmission = {
  participant_id: string;
  submitted_at: string;
};


export type AdhdScreeningSubmission = {
  participant_id: string;
  assignment: GroupAssignment;
  submitted_at: string;
};
