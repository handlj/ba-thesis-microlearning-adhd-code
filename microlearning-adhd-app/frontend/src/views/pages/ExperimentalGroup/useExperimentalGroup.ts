import { useRef, useState } from 'react'
import { useQuizAnswers, type QuizAnswers } from '../../../components/quiz/useQuizAnswers.ts'
import type { StudyVideoPlayerHandle } from '../../../components/video/StudyVideoPlayer.tsx'
import { copy } from '../../../content/copy.ts'
import { quizTopics, type QuizQuestion } from '../../../content/quiz.ts'
import { useAsyncResource } from '../../../hooks/useAsyncResource.ts'
import { useScrollToTop } from '../../../hooks/useScrollToTop.ts'
import { useTabAwayLog } from '../../../hooks/useTabAwayLog.ts'
import { getExperimentalVideos, type ExperimentalVideo } from '../../../services/index.ts'
import { getAppConfig } from '../../../utils/config.ts'
import { scoreQuiz, type QuizScore } from '../../../utils/quizScoring.ts'
import type { ExperimentalGroupProps } from './index.tsx'

export type QuizOutcome = {
  next: 'advance' | 'rewatch' | 'complete'
  attemptsExhausted: boolean
}

export function decideQuizOutcome({
  score,
  attempt,
  maxAttempts,
  isLastVideo,
}: {
  score: QuizScore | null
  attempt: number
  maxAttempts: number
  isLastVideo: boolean
}): QuizOutcome {
  const failed = score !== null && !score.passed

  if (failed && attempt < maxAttempts) {
    return { next: 'rewatch', attemptsExhausted: false }
  }

  return {
    next: isLastVideo ? 'complete' : 'advance',
    attemptsExhausted: failed,
  }
}

export type ExperimentalPhase = 'video' | 'quiz'

export function useExperimentalGroup({
  onCompleteIntervention,
  onLogInteraction,
  onSubmitQuiz,
}: ExperimentalGroupProps) {
  const { data, isLoading, error } = useAsyncResource<ExperimentalVideo[]>(
    getExperimentalVideos,
    copy.errors.experimentalVideosLoad,
  )
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<ExperimentalPhase>('video')
  const [hasVideoEnded, setHasVideoEnded] = useState(false)
  const [attemptNumber, setAttemptNumber] = useState(1)
  const [isRewatch, setIsRewatch] = useState(false)
  const [goBackToVideo, setGoBackToVideo] = useState(false)
  const [showRewatchDialog, setShowRewatchDialog] = useState(false)

  const [failedScore, setFailedScore] = useState<QuizScore | null>(null)
  const [failedAnswers, setFailedAnswers] = useState<QuizAnswers | null>(null)

  const playerRef = useRef<StudyVideoPlayerHandle>(null)

  const [resumeSeconds, setResumeSeconds] = useState<number | null>(null)

  const currentTopic = quizTopics[currentIndex]
  const quiz = useQuizAnswers(currentTopic?.questions ?? [])

  const { quiz_pass_threshold: passThreshold, quiz_max_attempts: maxAttempts } = getAppConfig()

  useScrollToTop(`${currentIndex}-${phase}`)

  const videos = data ?? []
  const currentVideo = videos[currentIndex]
  const videoCount = videos.length
  const isLastVideo = currentIndex === videoCount - 1
  const videoContext = {
    videoId: currentVideo?.id ?? null,
    videoIndex: currentIndex + 1,
    videoCount,
  }
  const canProceedFromVideo = hasVideoEnded || isRewatch || goBackToVideo
  const canProceedFromQuiz = currentTopic ? quiz.isComplete : true

  useTabAwayLog({
    eventPrefix: 'experimental',
    eventPayload: { phase, attempt: attemptNumber },
    onLogInteraction,
  })

  const handleVideoEnded = () => setHasVideoEnded(true)
  const handleVideoLoadedMetadata = () => setHasVideoEnded(false)

  const handleToggleAnswer = (questionId: string, optionId: string) => {
    quiz.toggle(questionId, optionId)
  }

  const startRewatch = (score: QuizScore) => {
    setResumeSeconds(score.earliestWrongTimestamp)
    setFailedScore(score)
    setFailedAnswers(quiz.answers)
    setAttemptNumber((prev) => prev + 1)
    setIsRewatch(true)
    setShowRewatchDialog(true)
    setPhase('video')
    quiz.reset()
  }

  const advanceToNextVideo = () => {
    const nextIndex = currentIndex + 1

    setCurrentIndex(nextIndex)
    setPhase('video')
    setHasVideoEnded(false)
    setAttemptNumber(1)
    setIsRewatch(false)
    setGoBackToVideo(false)
    setShowRewatchDialog(false)
    setFailedScore(null)
    setFailedAnswers(null)
    setResumeSeconds(null)
    quiz.reset(quizTopics[nextIndex]?.questions ?? [])
  }

  const dismissRewatchDialog = () => setShowRewatchDialog(false)

  const jumpToQuestion = (question: QuizQuestion) => {
    onLogInteraction('experimental_rewatch_question_selected', {
      ...videoContext,
      topicId: currentTopic?.id ?? null,
      attempt: attemptNumber - 1, // the re-watch attempt is the one that just finished
      questionId: question.id,
      toSeconds: question.videoTimestamp,
    })
    playerRef.current?.requestSeek(question.videoTimestamp)
    setShowRewatchDialog(false)
  }

  const proceedFromVideo = () => {
    if (!canProceedFromVideo) return

    if (isRewatch) {
      onLogInteraction('experimental_video_rewatch_started', {
        ...videoContext,
        attempt: attemptNumber,
      })
    } else {
      onLogInteraction('experimental_video_proceed_clicked', {
        ...videoContext,
        isLastVideo,
      })
    }
    setPhase('quiz')
  }

  const proceedFromQuiz = () => {
    if (!canProceedFromQuiz) return

    const score = currentTopic ? scoreQuiz(currentTopic, quiz.answers, passThreshold) : null

    onLogInteraction('experimental_quiz_submitted', {
      ...videoContext,
      topicId: currentTopic?.id ?? null,
      attempt: attemptNumber,
      correctCount: score?.correctCount ?? null,
      totalQuestions: score?.total ?? null,
      passed: score?.passed ?? null,
    })

    if (currentTopic) {
      onSubmitQuiz({
        video_id: currentVideo?.id ?? null,
        video_index: currentIndex + 1,
        topic_id: currentTopic.id,
        answers: quiz.answers,
        attempt: attemptNumber,
      })
    }

    const outcome = decideQuizOutcome({
      score,
      attempt: attemptNumber,
      maxAttempts,
      isLastVideo,
    })

    if (outcome.next === 'rewatch' && score) {
      onLogInteraction('experimental_quiz_rewatch_started', {
        ...videoContext,
        topicId: currentTopic?.id ?? null,
        attempt: attemptNumber,
        correctCount: score.correctCount ?? null,
        wrongQuestionIds: score.wrongQuestionIds.join(',') ?? null,
        seekTargetSeconds: score.earliestWrongTimestamp ?? null,
      })
      startRewatch(score)
      return
    }

    if (outcome.attemptsExhausted) {
      onLogInteraction('experimental_quiz_attempts_exhausted', {
        ...videoContext,
        topicId: currentTopic?.id ?? null,
        attempt: attemptNumber,
        correctCount: score?.correctCount ?? null,
      })
    }

    if (outcome.next === 'complete') {
      onCompleteIntervention()
      return
    }

    advanceToNextVideo() // outcome is 'advance'
  }

  const backToVideo = () => {
    onLogInteraction('experimental_back_to_video_clicked', { fromPhase: phase, ...videoContext })
    setGoBackToVideo(true)
    setPhase('video')
  }

  return {
    isLoading,
    error,
    phase,
    video: currentVideo,
    canProceedFromVideo,
    canProceedFromQuiz,
    goBackToVideo,
    quiz: {
      questions: currentTopic?.questions ?? [],
      answers: quiz.answers,
      answeredCount: quiz.answeredCount,
      total: quiz.total,
      onToggle: handleToggleAnswer,
    },
    hasVideoEnded,
    handleVideoEnded,
    handleVideoLoadedMetadata,
    proceedFromVideo,
    proceedFromQuiz,
    backToVideo,

    topic: currentTopic,
    videoCount,
    videoContext,
    videoIndex: currentIndex + 1,
    isRewatch,
    isLastVideo,
    attemptNumber,
    maxAttempts,
    passThreshold,
    showRewatchDialog,
    failedScore,
    failedAnswers,
    resumeSeconds,
    dismissRewatchDialog,
    jumpToQuestion,
    playerRef,
  }
}
