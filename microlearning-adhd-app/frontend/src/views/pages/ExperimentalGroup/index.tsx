import RewatchDialog from '../../../components/RewatchDialog.tsx'
import StudyActions from '../../../components/StudyActions.tsx'
import StudyHeading from '../../../components/StudyHeading.tsx'
import StudyPage from '../../../components/StudyPage.tsx'
import StudyVideoPlayer from '../../../components/video/StudyVideoPlayer.tsx'
import type { QuizAnswers } from '../../../components/quiz/useQuizAnswers.ts'
import { getVideoChapters } from '../../../content/videoChapters.ts'
import { type StudyInteractionPayload } from '../../../services/index.ts'
import { actionsCopy } from '@content/common/actions.ts'
import { videoGateCopy } from '@content/common/videoGate.ts'
import { experimentalGroupCopy } from '@content/pages/experimentalGroup.ts'
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
  participantId: string
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
    failedAnswers,
    resumeSeconds,
    dismissRewatchDialog,
    jumpToQuestion,
    playerRef,
  } = useExperimentalGroup(props)

  const sequence = experimentalGroupCopy.progress(videoIndex, videoCount)

  const features = getVideoPlayerFeatures('experimental')
  const chapters = getVideoChapters(video?.id)

  return (
    <StudyPage variant="video">
      <StudyHeading {...experimentalGroupCopy.heading[phase]} />

      <Message variant="status">{isLoading ? experimentalGroupCopy.status.loading : null}</Message>

      <Message variant="error">{error}</Message>

      <Message variant="status">
        {videoCount === 0 && !isLoading && !error ? experimentalGroupCopy.status.noVideos : null}
      </Message>

      {video ? (
        <div className="video-panel">
          {phase === 'video' ? (
            <>
              <p className="sequence-progress">{sequence}</p>

              <RewatchDialog
                open={showRewatchDialog}
                score={failedScore}
                questions={topic?.questions ?? []}
                submittedAnswers={failedAnswers}
                chapters={chapters}
                showChapterHints={features.chapterLabels}
                onSeekToQuestion={features.chapterNavigation ? jumpToQuestion : undefined}
                attempt={attemptNumber}
                maxAttempts={maxAttempts}
                passThreshold={passThreshold}
                onDismiss={dismissRewatchDialog}
              />

              <StudyVideoPlayer
                key={`${video.id}-attempt-${attemptNumber}`}
                ref={playerRef}
                src={video.video_url}
                eventPrefix="experimental_video"
                eventPayload={videoContext}
                chapters={chapters}
                features={features}
                initialSeekSeconds={resumeSeconds}
                onLogInteraction={props.onLogInteraction}
                onEnded={handleVideoEnded}
                onLoadedMetadata={handleVideoLoadedMetadata}
              />

              <Message variant="status">
                {hasVideoEnded
                  ? videoGateCopy.finishedBeforeQuiz
                  : isRewatch || goBackToVideo
                    ? experimentalGroupCopy.status.rewatch
                    : withEmphasis(videoGateCopy.watchFullVideo)}
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
                frozenQuestionIds={quiz.frozenQuestionIds}
              />

              <Message variant="status">
                {canProceedFromQuiz
                  ? experimentalGroupCopy.status.allAnswered
                  : experimentalGroupCopy.status.answerAllQuestions}
              </Message>
            </>
          ) : null}
        </div>
      ) : null}

      <StudyActions className="study-actions--stacked">
        {video && phase === 'video' ? (
          <button
            type="button"
            className="primary-button"
            disabled={!canProceedFromVideo}
            onClick={proceedFromVideo}
          >
            {isRewatch
              ? experimentalGroupCopy.actions.retakeQuiz
              : experimentalGroupCopy.actions.startQuiz}
          </button>
        ) : null}

        {video && phase === 'quiz' ? (
          <button
            type="button"
            className="primary-button"
            disabled={!canProceedFromQuiz}
            onClick={proceedFromQuiz}
          >
            {isLastVideo ? actionsCopy.continue : experimentalGroupCopy.actions.nextVideo}
          </button>
        ) : null}
      </StudyActions>
    </StudyPage>
  )
}

export default ExperimentalGroup
