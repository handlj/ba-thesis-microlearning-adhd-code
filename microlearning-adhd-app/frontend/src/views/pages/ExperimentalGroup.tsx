import { useEffect, useRef, useState } from 'react'
import StudyActions from '../../components/StudyActions.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import ExperimentalGroupQuizzes from './ExperimentalGroupQuizzes.tsx'
import type { QuizAnswers } from '../../components/quiz/useQuizAnswers.ts'
import { quizTopics } from '../../content/quiz.ts'
import {
  getExperimentalVideos,
  type ExperimentalVideo,
  type StudyInteractionPayload,
} from '../../services/index.ts'
import { copy } from '../../content/copy.ts'
import { getAppConfig } from '../../utils/config.ts'
import { scoreQuiz } from '../../utils/quizScoring.ts'

type ExperimentalGroupProps = {
  onBackToStart: () => void
  onCompleteIntervention: () => void
  onLogInteraction: (eventType: string, payload?: StudyInteractionPayload) => void
  onSubmitQuiz: (submission: {
    video_id: string | null
    video_index: number | null
    topic_id: string
    answers: QuizAnswers
    attempt: number
  }) => void
}

type ExperimentalPhase = 'video' | 'quiz'

function ExperimentalGroup({
  onBackToStart,
  onCompleteIntervention,
  onLogInteraction,
  onSubmitQuiz,
}: ExperimentalGroupProps) {
  const [videos, setVideos] = useState<ExperimentalVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<ExperimentalPhase>('video')
  const [hasVideoEnded, setHasVideoEnded] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)
  const [currentQuizAnswers, setCurrentQuizAnswers] = useState<QuizAnswers>({})
  const [attemptNumber, setAttemptNumber] = useState(1)
  const [isRewatch, setIsRewatch] = useState(false)
  const [showRewatchNotice, setShowRewatchNotice] = useState(false)
  const [failedScore, setFailedScore] = useState<{ correct: number; total: number } | null>(
    null,
  )
  const previousVideoTimeRef = useRef(0)
  const pendingSeekSecondsRef = useRef<number | null>(null)
  const rewatchDialogRef = useRef<HTMLDialogElement>(null)
  const { quiz_pass_threshold: passThreshold, quiz_max_attempts: maxAttempts } =
    getAppConfig()

  useEffect(() => {
    const dialog = rewatchDialogRef.current
    if (!dialog) return
    if (showRewatchNotice && !dialog.open) dialog.showModal()
    if (!showRewatchNotice && dialog.open) dialog.close()
  }, [showRewatchNotice])

  useEffect(() => {
    let active = true

    const loadVideos = async () => {
      try {
        setIsLoading(true)
        const response = await getExperimentalVideos()

        if (!active) {
          return
        }

        setVideos(response)
        setError(null)
      } catch (requestError) {
        if (!active) {
          return
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : copy.errors.experimentalVideosLoad,
        )
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    void loadVideos()

    return () => {
      active = false
    }
  }, [])

  const currentVideo = videos[currentIndex]
  const videoCount = videos.length
  const isLastVideo = currentIndex === videoCount - 1
  const currentTopic = quizTopics[currentIndex]

  const getCurrentVideoPayload = () => ({
    videoId: currentVideo?.id ?? null,
    videoTitle: currentVideo?.title ?? null,
    videoIndex: currentIndex + 1,
    videoCount,
  })

  const resetStepState = () => {
    setPhase('video')
    setHasVideoEnded(false)
    setQuizComplete(false)
    setCurrentQuizAnswers({})
    setAttemptNumber(1)
    setIsRewatch(false)
    setShowRewatchNotice(false)
    setFailedScore(null)
    previousVideoTimeRef.current = 0
    pendingSeekSecondsRef.current = null
  }

  const handleProceedFromVideo = () => {
    if (!hasVideoEnded && !isRewatch) {
      return
    }

    if (isRewatch) {
      onLogInteraction('experimental_quiz_retake_started', {
        ...getCurrentVideoPayload(),
        attempt: attemptNumber,
      })
    } else {
      onLogInteraction('experimental_video_proceed_clicked', {
        ...getCurrentVideoPayload(),
        isLastVideo,
      })
    }

    setPhase('quiz')
  }

  const canProceedFromQuiz = currentTopic ? quizComplete : true

  const handleProceedFromQuiz = () => {
    if (!canProceedFromQuiz) {
      return
    }

    const score = currentTopic
      ? scoreQuiz(currentTopic, currentQuizAnswers, passThreshold)
      : null

    onLogInteraction('experimental_quiz_submitted', {
      ...getCurrentVideoPayload(),
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
        answers: currentQuizAnswers,
        attempt: attemptNumber,
      })
    }

    if (score && !score.passed && attemptNumber < maxAttempts) {
      onLogInteraction('experimental_quiz_failed_rewatch', {
        ...getCurrentVideoPayload(),
        topicId: currentTopic?.id ?? null,
        attempt: attemptNumber,
        correctCount: score.correctCount,
        wrongQuestionIds: score.wrongQuestionIds.join(','),
        seekTargetSeconds: score.earliestWrongTimestamp,
      })
      pendingSeekSecondsRef.current = score.earliestWrongTimestamp
      setFailedScore({ correct: score.correctCount, total: score.total })
      setAttemptNumber((previousAttempt) => previousAttempt + 1)
      setIsRewatch(true)
      setShowRewatchNotice(true)
      setQuizComplete(false)
      setCurrentQuizAnswers({})
      setPhase('video')
      return
    }

    if (score && !score.passed) {
      onLogInteraction('experimental_quiz_attempts_exhausted', {
        ...getCurrentVideoPayload(),
        topicId: currentTopic?.id ?? null,
        attempt: attemptNumber,
        correctCount: score.correctCount,
      })
    }

    if (isLastVideo) {
      onCompleteIntervention()
      return
    }

    setCurrentIndex((previousIndex) => previousIndex + 1)
    resetStepState()
  }

  const returnToWelcome = () => {
    onLogInteraction('experimental_back_clicked', {
      fromPhase: phase,
      ...getCurrentVideoPayload(),
    })
    onBackToStart()
  }

  const handleVideoSeek = (nextTime: number) => {
    const previousTime = previousVideoTimeRef.current
    const deltaSeconds = nextTime - previousTime

    if (deltaSeconds > 1) {
      onLogInteraction('experimental_video_skipped', {
        ...getCurrentVideoPayload(),
        fromSeconds: Math.round(previousTime),
        toSeconds: Math.round(nextTime),
      })
    }

    if (deltaSeconds < -1) {
      onLogInteraction('experimental_video_rewatched', {
        ...getCurrentVideoPayload(),
        fromSeconds: Math.round(previousTime),
        toSeconds: Math.round(nextTime),
      })
    }

    previousVideoTimeRef.current = nextTime
  }

  return (
    <StudyPage 
      ariaLabelledBy="experimental-title" 
      cardClassName="study-card--video">
    
      <StudyHeading
        eyebrow={copy.experimentalGroup.heading.eyebrow}
        title={copy.experimentalGroup.heading.title}
        intro={copy.experimentalGroup.heading.intro}
        id="experimental-title"/>

      {isLoading ? (
        <p className="video-status">
          {copy.experimentalGroup.status.loading}
        </p>
      ) : null}

      {error ? 
      <p className="error-text">
        {error}
      </p> 
      : null}

      {!isLoading && !error && videoCount === 0 ? (
        <p className="video-status">
          {copy.experimentalGroup.status.noVideos}
        </p>
      ) : null}

      {currentVideo ? (
        <div className="video-panel">
          <p className="sequence-progress">
            {copy.experimentalGroup.progress(currentIndex + 1, videoCount)}
          </p>

          {phase === 'video' ? (
            <>
              <div className="video-meta">
                <p className="video-kicker">
                  {currentVideo.title}
                </p>
                <p className="video-description">
                  {currentVideo.description}
                </p>
              </div>

              <dialog
                ref={rewatchDialogRef}
                className="rewatch-dialog"
                aria-labelledby="rewatch-dialog-title"
                onCancel={(event) => {
                  event.preventDefault()
                }}
              >
                {failedScore ? (
                  <>
                    <p className="rewatch-dialog__eyebrow">
                      {copy.experimentalGroup.retry.attemptLabel(attemptNumber, maxAttempts)}
                    </p>

                    <h2 id="rewatch-dialog-title" 
                        className="rewatch-dialog__title"
                    >
                      {copy.experimentalGroup.retry.dialogTitle}
                    </h2>

                    <p className="rewatch-dialog__body">
                      {copy.experimentalGroup.retry.notice(
                        failedScore.correct,
                        failedScore.total,
                      )}
                    </p>

                    <div className="rewatch-dialog__actions">
                      <button
                        type="button"
                        className="start-button"
                        onClick={() => {
                          setShowRewatchNotice(false)
                        }}
                      >
                        {copy.actions.continue}
                      </button>
                    </div>
                  </>
                ) : null}
              </dialog>
              
              <div className="video-shell">
                <video
                  key={currentVideo.id}
                  className="video-frame"
                  controls
                  preload="metadata"
                  onEnded={() => {
                    setHasVideoEnded(true)
                    onLogInteraction('experimental_video_ended', getCurrentVideoPayload())
                  }}
                  onLoadedMetadata={(event) => {
                    setHasVideoEnded(false)
                    const seekTarget = pendingSeekSecondsRef.current
                    if (seekTarget !== null) {
                      pendingSeekSecondsRef.current = null
                      // Set the ref first so onSeeking does not log the
                      // programmatic jump as experimental_video_skipped.
                      previousVideoTimeRef.current = seekTarget
                      if (seekTarget > 0) {
                        event.currentTarget.currentTime = seekTarget
                      }
                    } else {
                      previousVideoTimeRef.current = 0
                    }
                  }}
                  onSeeking={(event) => handleVideoSeek(event.currentTarget.currentTime)}
                  onTimeUpdate={(event) => {
                    previousVideoTimeRef.current = event.currentTarget.currentTime
                  }}
                >
                  <source src={currentVideo.video_url} 
                          type="video/mp4" />
                  {copy.video.unsupported}
                </video>
              </div>
              <p className="video-status" 
                aria-live="polite">
                {hasVideoEnded
                  ? copy.experimentalGroup.status.videoFinished
                  : isRewatch
                    ? copy.experimentalGroup.status.rewatch
                    : copy.video.watchFullVideo}
              </p>
            </>
          ) : currentTopic ? (
            <>
              <ExperimentalGroupQuizzes
                key={`${currentVideo.id}-attempt-${attemptNumber}`}
                topic={currentTopic}
                videoContext={getCurrentVideoPayload()}
                onLogInteraction={onLogInteraction}
                onCompletionChange={setQuizComplete}
                onAnswersChange={setCurrentQuizAnswers}
              />
              <p className="video-status" 
                aria-live="polite">
                {quizComplete
                  ? copy.experimentalGroup.status.allAnswered
                  : copy.experimentalGroup.status.answerAllQuestions}
              </p>
            </>
          ) : null}
        </div>
      ) : null}

      <StudyActions className="study-actions--stacked">
        <button type="button" 
                className="secondary-button" 
                onClick={returnToWelcome}>
          {copy.actions.returnToWelcome}
        </button>

        {currentVideo && phase === 'video' ? (
          <button
            type="button"
            className="start-button"
            disabled={!hasVideoEnded && !isRewatch}
            onClick={handleProceedFromVideo}
          >
            {isRewatch ? copy.actions.retakeQuiz : copy.actions.startQuiz}
          </button>
        ) : null}

        {currentVideo && phase === 'quiz' ? (
          <button
            type="button"
            className="start-button"
            disabled={!canProceedFromQuiz}
            onClick={handleProceedFromQuiz}
          >
            {isLastVideo ? copy.actions.continue : copy.actions.nextVideo}
          </button>
        ) : null}

      </StudyActions>
    </StudyPage>
  )
}

export default ExperimentalGroup
