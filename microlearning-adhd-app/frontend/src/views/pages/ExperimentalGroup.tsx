import { useEffect, useRef, useState } from 'react'
import StudyActions from '../../components/StudyActions.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import StudyVideoPlayer from '../../components/video/StudyVideoPlayer.tsx'
import { useScrollToTop } from '../../hooks/useScrollToTop.ts'
import ExperimentalGroupQuizzes from './ExperimentalGroupQuizzes.tsx'
import type { QuizAnswers } from '../../components/quiz/useQuizAnswers.ts'
import { quizTopics } from '../../content/quiz.ts'
import { getVideoChapters } from '../../content/videoChapters.ts'
import {
  getExperimentalVideos,
  type ExperimentalVideo,
  type StudyInteractionPayload,
} from '../../services/index.ts'
import { copy } from '../../content/copy.ts'
import { getAppConfig } from '../../utils/config.ts'
import { getVideoPlayerFeatures } from '../../utils/videoFeatures.ts'
import { scoreQuiz } from '../../utils/quizScoring.ts'
import { withEmphasis } from '../../utils/richText.tsx'

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
  /*
    Where a rewatch should pick up: the timestamp of the earliest question the
    participant got wrong. The player seeks there once, without logging it as a
    participant seek.
  */
  const [resumeSeconds, setResumeSeconds] = useState<number | null>(null)
  const rewatchDialogRef = useRef<HTMLDialogElement>(null)
  const { quiz_pass_threshold: passThreshold, quiz_max_attempts: maxAttempts } =
  getAppConfig()
  
  useScrollToTop(`${currentIndex}-${phase}`)

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
    setResumeSeconds(null)
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
      setResumeSeconds(score.earliestWrongTimestamp)
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
          {phase === 'video' ? (
            <>
              <p className="sequence-progress">
                {copy.experimentalGroup.progress(currentIndex + 1, videoCount)}
              </p>

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

                    <div className="rewatch-score">
                      <p  className="rewatch-score__value" 
                          aria-hidden="true">
                        {failedScore.correct}
                        <span className="rewatch-score__total">
                          {copy.experimentalGroup.retry.outOf(failedScore.total)}
                        </span>
                      </p>
                      
                      <div  className="rewatch-score__track" 
                            aria-hidden="true">
                        <div className="rewatch-score__bar">
                          <span
                            className="rewatch-score__bar-fill"
                            style={{
                              width: `${
                                failedScore.total > 0
                                  ? Math.round((failedScore.correct / failedScore.total) * 100)
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                        
                        {failedScore.total > 0 ? (
                          <span
                            className="rewatch-score__threshold"
                            style={{
                              left: `${Math.min(
                                100,
                                Math.max(0, (passThreshold / failedScore.total) * 100),
                              )}%`,
                            }}
                            title={copy.experimentalGroup.retry.thresholdMarkerLabel}
                          />
                        ) : null}
                      </div>
                      
                      <p  className="rewatch-score__caption"         
                          aria-hidden="true">
                        {copy.experimentalGroup.retry.scoreCaption}
                      </p>
                      
                      <p  className="rewatch-score__threshold-caption"     
                          aria-hidden="true">
                        <span 
                          className="rewatch-score__threshold-dot" 
                        />
                        
                        {copy.experimentalGroup.retry.thresholdLabel(
                          passThreshold,
                          failedScore.total,
                        )}
                      </p>
                      
                      <span className="sr-only">
                        {copy.experimentalGroup.retry.srScore(
                          failedScore.correct,
                          failedScore.total,
                        )}{' '}
                        
                        {copy.experimentalGroup.retry.thresholdLabel(
                          passThreshold,
                          failedScore.total,
                        )}
                      </span>
                    </div>

                    <div className="rewatch-next">
                      <p className="rewatch-next__title">
                        {copy.experimentalGroup.retry.nextStepsTitle}
                      </p>
                      
                      <ul className="rewatch-next__list">
                        {copy.experimentalGroup.retry.nextSteps.map((step, index) => (
                          <li key={index} className="rewatch-next__item">
                            <span className="rewatch-next__marker" 
                                  aria-hidden="true">
                              {index + 1}
                            </span>
                            <span className="rewatch-next__text">{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

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
              
              <StudyVideoPlayer
                key={`${currentVideo.id}-attempt-${attemptNumber}`}
                src={currentVideo.video_url}
                eventPrefix="experimental_video"
                eventPayload={getCurrentVideoPayload()}
                chapters={getVideoChapters(currentVideo.id)}
                features={getVideoPlayerFeatures('experimental')}
                initialSeekSeconds={resumeSeconds}
                onLogInteraction={onLogInteraction}
                onEnded={() => setHasVideoEnded(true)}
                onLoadedMetadata={() => setHasVideoEnded(false)}
              />

              <p className="video-status"
                aria-live="polite">
                {hasVideoEnded
                  ? copy.experimentalGroup.status.videoFinished
                  : isRewatch
                    ? copy.experimentalGroup.status.rewatch
                    : withEmphasis(copy.video.watchFullVideo)}
              </p>
            </>
          ) : currentTopic ? (
            <>
              <ExperimentalGroupQuizzes
                key={`${currentVideo.id}-attempt-${attemptNumber}`}
                topic={currentTopic}
                sequence={copy.experimentalGroup.progress(currentIndex + 1, videoCount)}
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
