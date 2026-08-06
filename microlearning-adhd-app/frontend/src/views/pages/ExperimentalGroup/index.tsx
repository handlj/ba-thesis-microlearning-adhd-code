import RewatchDialog from '../../../components/RewatchDialog.tsx'
import StudyActions from '../../../components/StudyActions.tsx'
import StudyHeading from '../../../components/StudyHeading.tsx'
import StudyPage from '../../../components/StudyPage.tsx'
import StudyVideoPlayer from '../../../components/video/StudyVideoPlayer.tsx'
import type { QuizAnswers } from '../../../components/quiz/useQuizAnswers.ts'
import { getVideoChapters } from '../../../content/videoChapters.ts'
import { type StudyInteractionPayload } from '../../../services/index.ts'
import { copy } from '../../../content/copy.ts'
import { getVideoPlayerFeatures } from '../../../utils/videoFeatures.ts'
import { withEmphasis } from '../../../utils/richText.tsx'
import Message from '../../../components/Message.tsx'
import { useExperimentalGroup } from './useExperimentalGroup.ts'
import Quizzes from './Quizzes.tsx'

export type ExperimentalGroupProps = {
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

function ExperimentalGroup(props: ExperimentalGroupProps) {
  const {
    isLoading,
    error,
    phase,
    video,
    canProceedFromVideo,
    canProceedFromQuiz,
    goBackToVideo,
    quiz,
    hasVideoEnded,
    handleVideoEnded,
    handleVideoLoadedMetadata,
    proceedFromVideo,
    proceedFromQuiz,
    backToVideo,
    topic,
    videoCount,
    videoContext,
    videoIndex,
    isRewatch,
    isLastVideo,
    attemptNumber,
    maxAttempts,
    passThreshold,
    showRewatchDialog,
    failedScore,
    resumeSeconds,
    dismissRewatchDialog,
  } = useExperimentalGroup(props)

  const sequence = copy.experimentalGroup.progress(videoIndex, videoCount)

  return (
    <StudyPage ariaLabelledBy="experimental-title" cardClassName="study-card--video">
      <StudyHeading
        eyebrow={copy.experimentalGroup.heading.eyebrow}
        title={copy.experimentalGroup.heading.title}
        intro={copy.experimentalGroup.heading.intro}
        id="experimental-title"
      />

      <Message variant="status">{isLoading ? copy.experimentalGroup.status.loading : null}</Message>

      <Message variant="error">{error}</Message>

      <Message variant="status">
        {videoCount === 0 && !isLoading && !error ? copy.experimentalGroup.status.noVideos : null}
      </Message>

      {video ? (
        <div className="video-panel">
          {phase === 'video' ? (
            <>
              <p className="sequence-progress">{sequence}</p>

              <RewatchDialog
                open={showRewatchDialog}
                score={failedScore}
                attempt={attemptNumber}
                maxAttempts={maxAttempts}
                passThreshold={passThreshold}
                onDismiss={dismissRewatchDialog}
              />

              <StudyVideoPlayer
                key={`${video.id}-attempt-${attemptNumber}`}
                src={video.video_url}
                eventPrefix="experimental_video"
                eventPayload={videoContext}
                chapters={getVideoChapters(video.id)}
                features={getVideoPlayerFeatures('experimental')}
                initialSeekSeconds={resumeSeconds}
                onLogInteraction={props.onLogInteraction}
                onEnded={handleVideoEnded}
                onLoadedMetadata={handleVideoLoadedMetadata}
              />

              <Message variant="status">
                {hasVideoEnded
                  ? copy.experimentalGroup.status.videoFinished
                  : isRewatch || goBackToVideo
                    ? copy.experimentalGroup.status.rewatch
                    : withEmphasis(copy.video.watchFullVideo)}
              </Message>
            </>
          ) : topic ? (
            <>
              <Quizzes
                title={topic.title}
                sequence={sequence}
                questions={quiz.questions}
                answers={quiz.answers}
                answeredCount={quiz.answeredCount}
                total={quiz.total}
                onToggle={quiz.onToggle}
              />

              <Message variant="status">
                {canProceedFromQuiz
                  ? copy.experimentalGroup.status.allAnswered
                  : copy.experimentalGroup.status.answerAllQuestions}
              </Message>
            </>
          ) : null}
        </div>
      ) : null}

      <StudyActions className="study-actions--stacked">
        {video && phase === 'video' ? (
          <button
            type="button"
            className="start-button"
            disabled={!canProceedFromVideo}
            onClick={proceedFromVideo}
          >
            {isRewatch ? copy.actions.retakeQuiz : copy.actions.startQuiz}
          </button>
        ) : null}

        {video && phase === 'quiz' ? (
          <>
            <button type="button" className="secondary-button" onClick={backToVideo}>
              {copy.actions.back}
            </button>

            <button
              type="button"
              className="start-button"
              disabled={!canProceedFromQuiz}
              onClick={proceedFromQuiz}
            >
              {isLastVideo ? copy.actions.continue : copy.actions.nextVideo}
            </button>
          </>
        ) : null}
      </StudyActions>
    </StudyPage>
  )
}

export default ExperimentalGroup
