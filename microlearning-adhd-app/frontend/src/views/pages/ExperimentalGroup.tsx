import { useEffect, useRef, useState } from 'react'
import StudyActions from '../../components/StudyActions.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import ExperimentalGroupQuizzes from './ExperimentalGroupQuizzes.tsx'
import type { QuizAnswers } from '../../components/quiz/useQuizAnswers.ts'
import { quizTopics } from '../../content/quiz.ts'
import {
  fetchExperimentalVideos,
  type ExperimentalVideo,
  type StudyInteractionPayload,
} from '../../services/index.ts'
import { copy } from '../../content/copy.ts'

type ExperimentalGroupProps = {
  onBackToStart: () => void
  onCompleteIntervention: () => void
  onLogInteraction: (eventType: string, payload?: StudyInteractionPayload) => void
  onSubmitQuiz: (submission: {
    video_id: string | null
    video_index: number | null
    topic_id: string
    answers: QuizAnswers
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
  const previousVideoTimeRef = useRef(0)

  useEffect(() => {
    let active = true

    const loadVideos = async () => {
      try {
        setIsLoading(true)
        const response = await fetchExperimentalVideos()

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
    previousVideoTimeRef.current = 0
  }

  const handleProceedFromVideo = () => {
    if (!hasVideoEnded) {
      return
    }

    onLogInteraction('experimental_video_proceed_clicked', {
      ...getCurrentVideoPayload(),
      isLastVideo,
    })

    setPhase('quiz')
  }

  const canProceedFromQuiz = currentTopic ? quizComplete : true

  const handleProceedFromQuiz = () => {
    if (!canProceedFromQuiz) {
      return
    }

    onLogInteraction('experimental_quiz_submitted', {
      ...getCurrentVideoPayload(),
      topicId: currentTopic?.id ?? null,
    })
    if (currentTopic) {
      onSubmitQuiz({
        video_id: currentVideo?.id ?? null,
        video_index: currentIndex + 1,
        topic_id: currentTopic.id,
        answers: currentQuizAnswers,
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
    <StudyPage ariaLabelledBy="experimental-title" cardClassName="study-card--video">
      <StudyHeading
        eyebrow={copy.experimentalGroup.heading.eyebrow}
        title={copy.experimentalGroup.heading.title}
        intro={copy.experimentalGroup.heading.intro}
        id="experimental-title"
      />

      {isLoading ? (
        <p className="video-status">{copy.experimentalGroup.status.loading}</p>
      ) : null}

      {error ? <p className="error-text">{error}</p> : null}

      {!isLoading && !error && videoCount === 0 ? (
        <p className="video-status">{copy.experimentalGroup.status.noVideos}</p>
      ) : null}

      {currentVideo ? (
        <div className="video-panel">
          <p className="sequence-progress">
            {copy.experimentalGroup.progress(currentIndex + 1, videoCount)}
          </p>

          {phase === 'video' ? (
            <>
              <div className="video-meta">
                <p className="video-kicker">{currentVideo.title}</p>
                <p className="video-description">{currentVideo.description}</p>
              </div>
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
                  onLoadedMetadata={() => {
                    setHasVideoEnded(false)
                    previousVideoTimeRef.current = 0
                  }}
                  onSeeking={(event) => handleVideoSeek(event.currentTarget.currentTime)}
                  onTimeUpdate={(event) => {
                    previousVideoTimeRef.current = event.currentTarget.currentTime
                  }}
                >
                  <source src={currentVideo.video_url} type="video/mp4" />
                  {copy.video.unsupported}
                </video>
              </div>
              <p className="video-status" aria-live="polite">
                {hasVideoEnded
                  ? copy.experimentalGroup.status.videoFinished
                  : copy.video.watchFullVideo}
              </p>
            </>
          ) : currentTopic ? (
            <>
              <ExperimentalGroupQuizzes
                key={currentVideo.id}
                topic={currentTopic}
                videoContext={getCurrentVideoPayload()}
                onLogInteraction={onLogInteraction}
                onCompletionChange={setQuizComplete}
                onAnswersChange={setCurrentQuizAnswers}
              />
              <p className="video-status" aria-live="polite">
                {quizComplete
                  ? copy.experimentalGroup.status.allAnswered
                  : copy.experimentalGroup.status.answerAllQuestions}
              </p>
            </>
          ) : null}
        </div>
      ) : null}

      <StudyActions className="study-actions--stacked">
        <button type="button" className="secondary-button" onClick={returnToWelcome}>
          {copy.actions.returnToWelcome}
        </button>
        {currentVideo && phase === 'video' ? (
          <button
            type="button"
            className="start-button"
            disabled={!hasVideoEnded}
            onClick={handleProceedFromVideo}
          >
            {copy.actions.startQuiz}
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
