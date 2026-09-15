import type { Page } from './pageOrder'

export const STUDY_PHASES = ['intro', 'priorKnowledge', 'learning', 'closing'] as const

export type StudyPhase = (typeof STUDY_PHASES)[number]

type PagePosition = { phase: StudyPhase; step: number } | null

const PAGE_POSITION = {
  welcome: null,
  consent: { phase: 'intro', step: 0 },
  demographics: { phase: 'intro', step: 1 },
  adhdScreening: { phase: 'intro', step: 2 },
  prePanas: { phase: 'intro', step: 3 },
  ready: { phase: 'priorKnowledge', step: 0 },
  fam: { phase: 'priorKnowledge', step: 1 },
  preQuiz: { phase: 'priorKnowledge', step: 2 },
  control: { phase: 'learning', step: 0 },
  experimental: { phase: 'learning', step: 0 },
  postPanas: { phase: 'closing', step: 0 },
  ues: { phase: 'closing', step: 1 },
  followUp: { phase: 'closing', step: 2 },
  feedback: { phase: 'closing', step: 3 },
  thankYou: null,
} as const satisfies Record<Page, PagePosition>

const PHASE_STEP_COUNT = Object.values(PAGE_POSITION).reduce<Record<StudyPhase, number>>(
  (counts, position) => {
    if (position) counts[position.phase] = Math.max(counts[position.phase], position.step + 1)
    return counts
  },
  { intro: 0, priorKnowledge: 0, learning: 0, closing: 0 },
)

export type PhaseState = 'complete' | 'current' | 'upcoming'

export type PhaseSegment = {
  phase: StudyPhase
  state: PhaseState
  fill: number
}

export type StudyProgress = {
  segments: PhaseSegment[]
}

export function studyProgress(page: Page): StudyProgress | null {
  const position: PagePosition = PAGE_POSITION[page]
  if (!position) return null

  const currentIndex = STUDY_PHASES.indexOf(position.phase)

  const segments = STUDY_PHASES.map((phase, index): PhaseSegment => {
    if (index < currentIndex) return { phase, state: 'complete', fill: 1 }
    if (index > currentIndex) return { phase, state: 'upcoming', fill: 0 }
    return { phase, state: 'current', fill: position.step / PHASE_STEP_COUNT[phase] }
  })

  return { segments }
}
