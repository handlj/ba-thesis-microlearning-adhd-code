import api from '../client'

import type { DemographicAnswers } from '@content/pages/demographics.ts'
import type { DemographicsSubmission } from '../types/demographics'

export async function postDemographics(participantId: string, demographics: DemographicAnswers) {
  const response = await api.post<DemographicsSubmission>(
    `/participants/${participantId}/demographics`,
    {
      age: Number(demographics.age),
      gender: demographics.gender,
      gender_other: demographics.genderOther,
      highest_education: demographics.highestEducation,
      currently_studying: demographics.currentlyStudying,
      study_background: demographics.studyBackground,
      device: demographics.device,
      adhd_diagnosis: demographics.adhdDiagnosis,
      adhd_official_diagnosis: demographics.adhdOfficialDiagnosis,
      adhd_medication: demographics.adhdMedication,
      has_other_diagnoses: demographics.hasOtherDiagnoses,
      other_diagnoses: demographics.otherDiagnoses,
      python_programming_experience: demographics.pythonProgrammingExperience,
      python_programming_ability: demographics.pythonProgrammingAbility,
      other_programming_experience: demographics.otherProgrammingExperience,
      other_programming_languages: demographics.otherProgrammingLanguages,
      general_programming_ability: demographics.generalProgrammingAbility,
    },
  )
  return response.data
}
