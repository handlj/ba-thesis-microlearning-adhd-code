import api from "../client";

import type { DemographicAnswers } from "../../utils/groupAssignment";
import type { DemographicsSubmission } from "../types/demographics";


export async function submitDemographics(
  participantId: string,
  demographics: DemographicAnswers,
) {
  const response = await api.post<DemographicsSubmission>(
    `/participants/${participantId}/demographics`,
    {
      age: Number(demographics.age),
      gender: demographics.gender,
      study_background: demographics.studyBackground,
      adhd_diagnosis: demographics.adhdDiagnosis,
    },
  );
  return response.data;
}
