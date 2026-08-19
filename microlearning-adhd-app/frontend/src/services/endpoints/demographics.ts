import api from '../client'

import type { DemographicAnswers } from '../../utils/groupAssignment'
import type { DemographicsSubmission } from '../types/demographics'

export async function postDemographics(participantId: string, demographics: DemographicAnswers) {
  const response = await api.post<DemographicsSubmission>(
    `/participants/${participantId}/demographics`,
    {
      age: Number(demographics.age),
      gender: demographics.gender,
      highest_education: demographics.highestEducation,
      currently_studying: demographics.currentlyStudying,
      study_background: demographics.studyBackground,
      adhd_diagnosis: demographics.adhdDiagnosis,
      adhd_official_diagnosis: demographics.adhdOfficialDiagnosis,
      adhd_medication: demographics.adhdMedication,
      device: demographics.device,
      general_programming_experience: demographics.generalProgrammingExperience,
      general_programming_languages: demographics.generalProgrammingLanguages,
      general_programming_ability: demographics.generalProgrammingAbility,
      python_programming_experience: demographics.pythonProgrammingExperience,
      python_programming_ability: demographics.pythonProgrammingAbility,
    },
  )
  return response.data
}
