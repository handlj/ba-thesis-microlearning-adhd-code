import { PAGE_ORDER, type Page } from './pageOrder'
import type { GroupAssignment, Subgroup } from '../utils/groupAssignment'
import { blankStudyAnswers, type StudyAnswers } from './studyAnswers'
import { blankQuizResults, type QuizResults } from './quizResults'
import { setStudySubgroup } from '../utils/videoFeatures'

const SESSION_STORAGE_KEY = 'microlearning-study-snapshot'
const SNAPSHOT_VERSION = 1
const SNAPSHOT_EXPIRATION_MS = 1000 * 60 * 60 * 2 // 2 hours

export type Snapshot = {
  version: number
  savedAt: string
  currentPage: Page
  participantId: string
  groupAssignment: GroupAssignment | null
  subgroup: Subgroup | null
  consent: boolean
  answers: StudyAnswers
  quizResults: QuizResults
}

export type SnapshotInput = Omit<Snapshot, 'version' | 'savedAt'>

function isResumable(snapshot: Snapshot): boolean {
  if (snapshot.version !== SNAPSHOT_VERSION) return false
  if (!PAGE_ORDER.includes(snapshot.currentPage)) return false
  if (snapshot.currentPage === 'welcome') return false
  if (!snapshot.participantId && snapshot.currentPage !== 'consent') return false

  const savedAt = Date.parse(snapshot.savedAt)

  return Number.isFinite(savedAt) && Date.now() - savedAt < SNAPSHOT_EXPIRATION_MS
}

function mergeStudyAnswers(stored: Partial<StudyAnswers> | undefined): StudyAnswers {
  const blankAnswers = blankStudyAnswers()

  return Object.fromEntries(
    Object.entries(blankAnswers).map(([section, answers]) => {
      const storedSection = stored?.[section as keyof StudyAnswers] as
        Record<string, string> | undefined

      return [
        section,
        Object.fromEntries(
          Object.keys(answers).map((questionId) => {
            const storedValue = storedSection?.[questionId]

            return [
              questionId,
              typeof storedValue === 'string'
                ? storedValue
                : (answers as Record<string, string>)[questionId],
            ]
          }),
        ),
      ]
    }),
  ) as StudyAnswers
}

function mergeQuizResults(stored: Partial<QuizResults> | undefined): QuizResults {
  const blank = blankQuizResults()
  const storedScores = stored?.experimentalTopicScores

  return {
    preCorrect: typeof stored?.preCorrect === 'number' ? stored.preCorrect : blank.preCorrect,
    controlPostCorrect:
      typeof stored?.controlPostCorrect === 'number'
        ? stored.controlPostCorrect
        : blank.controlPostCorrect,
    experimentalTopicScores:
      storedScores && typeof storedScores === 'object'
        ? Object.fromEntries(
            Object.entries(storedScores).filter(([, score]) => typeof score === 'number'),
          )
        : blank.experimentalTopicScores,
  }
}

export function readSnapshot(): Snapshot | null {
  try {
    const stored = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!stored) return null

    const parsed = JSON.parse(stored) as Snapshot

    if (!isResumable(parsed)) {
      clearSnapshot()
      return null
    }

    return {
      ...parsed,
      answers: mergeStudyAnswers(parsed.answers),
      quizResults: mergeQuizResults(parsed.quizResults),
    }
  } catch (error) {
    console.error('Error reading snapshot from sessionStorage:', error)
    clearSnapshot()
    return null
  }
}

export function writeSnapshot(snapshotInput: SnapshotInput): void {
  const snapshot: Snapshot = {
    ...snapshotInput,
    version: SNAPSHOT_VERSION,
    savedAt: new Date().toISOString(),
  } satisfies Snapshot

  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(snapshot))
  } catch (error) {
    console.error('Error writing snapshot to sessionStorage:', error)
  }
}

export function hasSnapshot(): boolean {
  try {
    return sessionStorage.getItem(SESSION_STORAGE_KEY) !== null
  } catch (error) {
    console.error('Error reading snapshot presence from sessionStorage:', error)
    return false
  }
}

export function clearSnapshot(): void {
  try {
    sessionStorage.removeItem(SESSION_STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing snapshot from sessionStorage:', error)
  }
}

export function setSubgroupFromSnapshot(): void {
  const snapshot = readSnapshot()
  if (snapshot?.subgroup) {
    setStudySubgroup(snapshot.subgroup)
  }
}
