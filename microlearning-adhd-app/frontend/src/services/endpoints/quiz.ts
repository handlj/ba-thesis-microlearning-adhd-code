import api from "../client";
import type { QuizAnswerSubmission, QuizSubmission } from "../types/quiz";


export async function submitQuizAnswers(
  participantId: string,
  submission: QuizAnswerSubmission,
) {
  const response = await api.post<QuizSubmission>(
    `/participants/${participantId}/quiz`,
    submission,
  );
  return response.data;
}
