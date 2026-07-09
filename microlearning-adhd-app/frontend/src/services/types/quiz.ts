import { type GroupAssignment } from "./../../utils/groupAssignment";


export type QuizSubmission = {
  participant_id: string;
  answer_count: number;
  submitted_at: string;
};


export type QuizAnswerSubmission = {
  group: GroupAssignment;
  video_id: string | null;
  video_index: number | null;
  topic_id: string;
  answers: Record<string, string[]>;
};
