import { useState } from 'react'
import type { QuizAnswers } from '../components/quiz/useQuizAnswers'
import { copy } from '../content/copy'
import { quizTopics } from '../content/quiz'
import { postQuizAnswers, type QuizAnswerSubmission } from '../services'
import type { GroupAssignment, Subgroup } from '../utils/groupAssignment'
import { scoreQuiz } from '../utils/quizScoring'
import { blankQuizResults, hasCompleteScores, postCorrectFor, scoreAllTopics } from './quizResults'

export function useQuizResults(
  participantId: string | null,
  assignment: GroupAssignment | null,
  subgroup: Subgroup | null,
) {
  const [results, setResults] = useState(blankQuizResults)

  const persist = (submission: QuizAnswerSubmission) => {
    if (!participantId) return

    void postQuizAnswers(participantId, submission).catch((requestError) => {
      console.error(copy.errors.quizSave, requestError)
      // TODO: Surface error, also timout possible.
    })
  }

  const recordPreQuiz = (answers: QuizAnswers) => {
    if (!assignment || !subgroup) return

    setResults((previous) => ({
      ...previous,
      preCorrect: scoreAllTopics(answers),
    }))

    persist({
      assignment,
      subgroup,
      video_id: null,
      video_index: null,
      topic_id: 'pre-quiz',
      answers,
    })
  }

  const recordControlQuiz = (answers: QuizAnswers) => {
    if (assignment !== 'control' || !subgroup) return

    setResults((previous) => ({
      ...previous,
      controlPostCorrect: scoreAllTopics(answers),
    }))

    persist({
      assignment: 'control',
      subgroup,
      video_id: null,
      video_index: null,
      topic_id: 'control-quiz',
      answers,
    })
  }

  const recordExperimentalQuiz = (
    submission: Omit<QuizAnswerSubmission, 'assignment' | 'subgroup'> & { attempt: number },
  ) => {
    if (assignment !== 'experimental' || !subgroup) return

    const topic = quizTopics.find((t) => t.id === submission.topic_id)
    if (topic) {
      const correct = scoreQuiz(topic, submission.answers, 0).correctCount

      // Later attempts overwrite earlier ones, final attempt per topic.
      setResults((previous) => ({
        ...previous,
        experimentalTopicScores: {
          ...previous.experimentalTopicScores,
          [submission.topic_id]: correct,
        },
      }))
    }

    persist({ assignment: 'experimental', subgroup, ...submission })
  }

  const resetQuizResults = () => {
    setResults(blankQuizResults())
  }

  const postCorrect = postCorrectFor(results, assignment)
  const completeScores = hasCompleteScores(results, assignment)

  return {
    results,
    postCorrect,
    completeScores,
    recordPreQuiz,
    recordControlQuiz,
    recordExperimentalQuiz,
    resetQuizResults,
  }
}
