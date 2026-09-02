import { type StudyQuestion } from '../components/forms/types'
import { buildOptionsFromCopy } from '../components/forms/utils'
import { blankAnswers } from '../utils/blankAnswers'

export const demographicsCopy = {
  heading: {
    eyebrow: '',
    title: 'Bevor wir loslegen',
    intro:
      'Bitte beantworten Sie die folgenden Fragen zu Ihrer Person und Ihren Programmiervorkenntnissen.\n\n Alle Angaben werden anonymisiert verarbeitet und lassen keinerlei Rückschluss auf Sie zu.',
  },
  sections: {
    person: 'Persönliche Angaben',
    diagnoses: 'ADHS & weitere Diagnosen',
    programming: 'Programmiervorkenntnisse',
  },
  validation: {
    allQuestions: 'Bitte beantworten Sie alle Fragen, bevor Sie fortfahren.',
    ageRange: (minAge: number, maxAge: number) =>
      `Bitte geben Sie ein Alter zwischen ${minAge} und ${maxAge} Jahren an.`,
  },
  errors: {
    missingSession:
      'Die Einwilligung wurde für diese Sitzung nicht gespeichert. Bitte kehren Sie zur Einwilligungsseite zurück und versuchen Sie es erneut.',
    save: 'Die demografischen Angaben konnten nicht gespeichert werden. Bitte versuchen Sie es erneut.',
  },
} as const

const DEMOGRAPHIC_SECTIONS_TABLE = [
  { id: 'person', title: demographicsCopy.sections.person },
  { id: 'diagnoses', title: demographicsCopy.sections.diagnoses },
  { id: 'programming', title: demographicsCopy.sections.programming },
] as const

export type DemographicSectionId = (typeof DEMOGRAPHIC_SECTIONS_TABLE)[number]['id']

export type DemographicSection = { id: DemographicSectionId; title: string }

export const DEMOGRAPHIC_SECTIONS: readonly DemographicSection[] = DEMOGRAPHIC_SECTIONS_TABLE

const DEMOGRAPHIC_QUESTIONS_TABLE = [
  {
    id: 'age',
    section: 'person',
    type: 'number',
    label: 'Alter',
    placeholder: 'Geben Sie Ihr Alter ein',
  },
  {
    id: 'gender',
    section: 'person',
    label: 'Geschlecht',
    placeholder: 'Wählen Sie Ihr Geschlecht',
    options: {
      male: 'Männlich',
      female: 'Weiblich',
      other: 'Sonstiges',
      preferNotToSay: 'Keine Angabe',
    },
  },
  {
    id: 'highestEducation',
    section: 'person',
    label: 'Höchster Bildungsabschluss',
    placeholder: 'Wählen Sie Ihren höchsten Bildungsabschluss',
    options: {
      noneOrMandatory: 'Kein Abschluss oder Pflichtschulabschluss',
      highSchool: 'Matura/Abitur oder gleichwertig',
      bachelor: 'Bachelorabschluss',
      master: 'Masterabschluss',
      doctorate: 'Promotion',
      other: 'Anderer Abschluss',
      preferNotToSay: 'Keine Angabe',
    },
  },
  {
    id: 'currentlyStudying',
    section: 'person',
    label: 'Derzeit studierend',
    placeholder: 'Studieren Sie derzeit?',
    options: {
      yes: 'Ja',
      no: 'Nein',
    },
  },
  {
    id: 'studyBackground',
    section: 'person',
    type: 'text',
    label: 'Studienhintergrund',
    placeholder: 'Geben Sie Ihre aktuelle Studienrichtung an',
    visibleIf: {
      field: 'currentlyStudying',
      equals: ['yes'],
    },
    valueIfHidden: 'not-studying',
  },
  {
    id: 'device',
    section: 'person',
    label: 'Verwendetes Gerät',
    placeholder: 'Wählen Sie Ihr Gerät aus',
    options: {
      desktop: 'Desktop-Computer ("Stand-PC")',
      laptop: 'Laptop',
      tablet: 'Tablet',
      smartphone: 'Smartphone',
      other: 'Anderes Gerät',
    },
  },
  {
    id: 'adhdDiagnosis',
    section: 'diagnoses',
    label: 'ADHS-Diagnosestatus',
    placeholder: 'Wählen Sie Ihren aktuellen ADHS-Diagnosestatus',
    options: {
      diagnosed: 'Diagnostiziert',
      selfDiagnosed: 'Selbstdiagnostiziert',
      notDiagnosed: 'Nicht diagnostiziert',
      preferNotToSay: 'Keine Angabe',
    },
  },
  {
    id: 'adhdOfficialDiagnosis',
    section: 'diagnoses',
    label: 'Offizielle ADHS-Diagnose (Wenn diagnostiziert)',
    placeholder: 'Wählen Sie Ihre entsprechende Diagnose aus',
    options: {
      combined: 'Aufmerksamkeitsdefizit- und Hyperaktivitätsstörung, kombiniert (ICD-11 6A05.2)',
      inattentive:
        'Aufmerksamkeitsdefizit- und Hyperaktivitätsstörung, vorwiegend unkonzentriert (ICD-11 6A05.0)',
      hyperactiveImpulsive:
        'Aufmerksamkeitsdefizit- und Hyperaktivitätsstörung, vorwiegend hyperaktiv-impulsiv (ICD-11 6A05.1)',
      notSpecified: 'Nicht näher bezeichnet (ICD-11 6A05.Z)',
    },
    visibleIf: {
      field: 'adhdDiagnosis',
      equals: ['diagnosed'],
    },
    valueIfHidden: 'not-diagnosed',
  },
  {
    id: 'adhdMedication',
    section: 'diagnoses',
    label: 'ADHS-Medikamenteneinnahme',
    placeholder: 'Haben Sie heute ADHS-Medikamente eingenommen?',
    options: {
      yes: 'Ja',
      no: 'Nein',
      preferNotToSay: 'Keine Angabe',
    },
    visibleIf: {
      field: 'adhdDiagnosis',
      equals: ['diagnosed'],
    },
    valueIfHidden: 'not-diagnosed',
  },
  {
    id: 'hasOtherDiagnoses',
    section: 'diagnoses',
    label: 'Weitere Diagnosen',
    placeholder: 'Haben Sie weitere Diagnosen einer psychischen Erkrankung?',
    options: {
      yes: 'Ja',
      no: 'Nein',
      preferNotToSay: 'Keine Angabe',
    },
  },
  {
    id: 'otherDiagnoses',
    section: 'diagnoses',
    type: 'text',
    label: 'Weitere Diagnosen',
    placeholder: 'Bitte geben Sie Ihre weiteren Diagnosen an',
    visibleIf: {
      field: 'hasOtherDiagnoses',
      equals: ['yes'],
    },
    valueIfHidden: 'no-other-diagnoses',
  },
  {
    id: 'generalProgrammingExperience',
    section: 'programming',
    label: 'Allgemeine Programmiererfahrung',
    placeholder: 'Haben Sie bereits Programmiererfahrung?',
    options: {
      yes: 'Ja',
      no: 'Nein',
    },
  },
  {
    id: 'generalProgrammingLanguages',
    section: 'programming',
    type: 'text',
    label: 'Benutzte Programmiersprachen',
    placeholder: 'Welche Programmiersprachen haben Sie bereits verwendet?',
    visibleIf: {
      field: 'generalProgrammingExperience',
      equals: ['yes'],
    },
    valueIfHidden: 'no-experience',
  },
  {
    id: 'generalProgrammingAbility',
    section: 'programming',
    label: 'Allgemeine Programmierfähigkeit',
    placeholder: 'Wie würden Sie Ihre allgemeine Programmierfähigkeit einschätzen?',
    options: {
      // These keys must match the demographics scoring in the backend service module
      beginner: 'Anfänger*in',
      intermediate: 'Fortgeschrittene*r',
      expert: 'Expert*in',
    },
    visibleIf: {
      field: 'generalProgrammingExperience',
      equals: ['yes'],
    },
    valueIfHidden: 'no-experience',
  },
  {
    id: 'pythonProgrammingExperience',
    section: 'programming',
    label: 'Python-Programmiererfahrung',
    placeholder: 'Haben Sie bereits Erfahrung mit der Programmiersprache Python?',
    options: {
      yes: 'Ja',
      no: 'Nein',
    },
    visibleIf: {
      field: 'generalProgrammingExperience',
      equals: ['yes'],
    },
    valueIfHidden: 'no',
  },
  {
    id: 'pythonProgrammingAbility',
    section: 'programming',
    label: 'Python-Programmierfähigkeit',
    placeholder: 'Wie würden Sie Ihre Python-Programmierfähigkeit einschätzen?',
    options: {
      // These keys must match the demographics scoring in the backend service module
      beginner: 'Anfänger*in',
      intermediate: 'Fortgeschrittene*r',
      expert: 'Expert*in',
    },
    visibleIf: {
      field: 'pythonProgrammingExperience',
      equals: ['yes'],
    },
    valueIfHidden: 'no-python-experience',
  },
] as const

export type DemographicQuestionId = (typeof DEMOGRAPHIC_QUESTIONS_TABLE)[number]['id']
export type DemographicAnswers = Record<DemographicQuestionId, string>

type BaseQuestion = {
  id: DemographicQuestionId
  section: DemographicSectionId
  type?: 'select' | 'text' | 'number'
  label: string
  placeholder?: string
  options?: Readonly<Record<string, string>>
}

type VisibleIfCondition =
  | { visibleIf?: never; valueIfHidden?: never }
  | {
      visibleIf: { field: DemographicQuestionId; equals: readonly string[] }
      valueIfHidden: string
    }

export type DemographicQuestion = BaseQuestion & VisibleIfCondition

export const DEMOGRAPHIC_QUESTIONS: readonly DemographicQuestion[] = DEMOGRAPHIC_QUESTIONS_TABLE

export const demographicQuestionSections = Object.fromEntries(
  DEMOGRAPHIC_QUESTIONS.map((q) => [q.id, q.section]),
) as Record<DemographicQuestionId, DemographicSectionId>

// Runtime Validation on Self-Gated Visibility Conditions of Demographic Questions
const alreadyProcessedDemographicQuestions = new Set<DemographicQuestionId>()
for (const question of DEMOGRAPHIC_QUESTIONS) {
  if (question.visibleIf && !alreadyProcessedDemographicQuestions.has(question.visibleIf.field)) {
    throw new Error(
      `Demographic question "${question.id}" self-gates its visibility condition via "${question.visibleIf.field}"`,
    )
  }
  alreadyProcessedDemographicQuestions.add(question.id)
}

export const defaultDemographics = blankAnswers(DEMOGRAPHIC_QUESTIONS) as DemographicAnswers

export const demographicFormQuestions: StudyQuestion<DemographicQuestionId>[] =
  DEMOGRAPHIC_QUESTIONS.map((q): StudyQuestion<DemographicQuestionId> => {
    const base = {
      id: q.id,
      label: q.label,
      placeholder: q.placeholder,
      required: true,
    }

    return q.type === 'number' || q.type === 'text'
      ? { ...base, type: q.type }
      : { ...base, type: 'select', options: buildOptionsFromCopy(q.options ?? {}) }
  })
