import { useState } from 'react'
import { useQuizAnswers } from '../../../components/quiz/useQuizAnswers.ts'
import { copy } from '../../../content/copy.ts'
import { allQuizQuestions } from '../../../content/quiz.ts'
import { useAsyncResource } from '../../../hooks/useAsyncResource.ts'
import { useScrollToTop } from '../../../hooks/useScrollToTop.ts'
import { getControlVideo, type ControlVideo } from '../../../services/index.ts'
import type { ControlGroupProps } from './index.tsx'

export type ControlPhase = 'video' | 'quiz'

export function useControlGroup({
  onBackToStart,
  onCompleteIntervention,
  onLogInteraction,
  onSubmitQuiz,
}: ControlGroupProps) {
  const {
    data: video,
    isLoading,
    error,
  } = useAsyncResource<ControlVideo>(getControlVideo, copy.errors.controlVideoLoad)
  const [phase, setPhase] = useState<ControlPhase>('video')
  const [hasVideoEnded, setHasVideoEnded] = useState(false)
  const quiz = useQuizAnswers(allQuizQuestions)

  useScrollToTop(phase)

  const canProceedFromVideo = hasVideoEnded
  const canProceedFromQuiz = quiz.isComplete

  const handleVideoEnded = () => setHasVideoEnded(true)
  const handleVideoLoadedMetadata = () => setHasVideoEnded(false)

  const handleToggleAnswer = (questionId: string, optionId: string) => {
    quiz.toggle(questionId, optionId)
  }

  const proceedFromVideo = () => {
    if (!canProceedFromVideo) return
    onLogInteraction('control_video_proceed_clicked')
    setPhase('quiz')
  }

  const proceedFromQuiz = () => {
    if (!canProceedFromQuiz) return

    onLogInteraction('control_quiz_submitted', { answers: JSON.stringify(quiz.answers) })
    onSubmitQuiz(quiz.answers)
    onCompleteIntervention()
  }

  const backToVideo = () => {
    onLogInteraction('control_back_to_video_clicked')
    quiz.reset()
    setPhase('video')
  }

  const returnToWelcome = () => {
    onLogInteraction('control_back_clicked', { fromPhase: phase })
    onBackToStart()
  }

  return {
    isLoading,
    error,
    phase,
    video,
    canProceedFromVideo,
    canProceedFromQuiz,
    quiz: {
      questions: allQuizQuestions,
      answers: quiz.answers,
      answeredCount: quiz.answeredCount,
      total: quiz.total,
      onToggle: handleToggleAnswer,
    },
    handleVideoEnded,
    handleVideoLoadedMetadata,
    proceedFromVideo,
    proceedFromQuiz,
    backToVideo,
    returnToWelcome,
  }
}
