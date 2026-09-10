import { DONT_KNOW_OPTION, type QuizOption, type QuizQuestion } from '../content/quiz.ts'

const FNV_OFFSET_BASIS = 2166136261
const FNV_PRIME = 16777619

const PINNED_OPTION_IDS = new Set<QuizOption['id']>([DONT_KNOW_OPTION.id])

export function hashSeed(input: string): number {
  let hash = FNV_OFFSET_BASIS >>> 0

  for (let index = 0; index < input.length; index += 1) {
    hash = (hash ^ input.charCodeAt(index)) >>> 0
    hash = Math.imul(hash, FNV_PRIME) >>> 0
  }

  return hash >>> 0
}

export function mulberry32(seed: number): () => number {
  let state = seed >>> 0

  return () => {
    state = (state + 0x6d2b79f5) >>> 0

    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1) >>> 0
    t = (t ^ (t + (Math.imul(t ^ (t >>> 7), t | 61) >>> 0))) >>> 0

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function shuffleOptions(
  options: QuizOption[],
  participantId: string,
  questionId: string,
): QuizOption[] {
  const shuffled = options.filter((option) => !PINNED_OPTION_IDS.has(option.id))
  const pinned = options.filter((option) => PINNED_OPTION_IDS.has(option.id))

  const nextRandom = mulberry32(hashSeed(`${participantId}:${questionId}`))

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(nextRandom() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return [...shuffled, ...pinned]
}

export function permuteQuestionOptions(
  questions: QuizQuestion[],
  participantId: string,
): QuizQuestion[] {
  if (!participantId) return questions

  return questions.map((question) => ({
    ...question,
    options: shuffleOptions(question.options, participantId, question.id),
  }))
}
