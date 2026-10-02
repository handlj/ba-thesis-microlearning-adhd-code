import StudyActions from '../../../components/StudyActions.tsx'
import StudyHeading from '../../../components/StudyHeading.tsx'
import StudyPage from '../../../components/StudyPage.tsx'
import StudyVideoPlayer from '../../../components/video/StudyVideoPlayer.tsx'
import { type StudyInteractionPayload } from '../../../services/index.ts'
import { actionsCopy } from '@content/common/actions.ts'
import { videoGateCopy } from '@content/common/videoGate.ts'
import { controlGroupCopy } from '@content/pages/controlGroup.ts'
import { getVideoPlayerFeatures } from '../../../utils/videoFeatures.ts'
import { withEmphasis } from '../../../utils/richText.tsx'
import Message from '../../../components/Message.tsx'
import { useControlGroup } from './useControlGroup.ts'
import Quiz from './Quiz.tsx'

export type ControlGroupProps = {
  onCompleteIntervention: () => void
  onLogInteraction: (eventType: string, payload?: StudyInteractionPayload) => void
  onSubmitQuiz: (answers: Record<string, string[]>) => void
  participantId: string
}

function ControlGroup(props: ControlGroupProps) {
  const {
    isLoading,
    error,
    phase,
    video,
    canProceedFromVideo,
    canProceedFromQuiz,
    quiz,
    handleVideoEnded,
    handleVideoLoadedMetadata,
    proceedFromVideo,
    proceedFromQuiz,
    backToVideo,
  } = useControlGroup(props)

  return (
    <StudyPage ariaLabelledBy="control-title" variant="video">
      <StudyHeading {...controlGroupCopy.heading[phase]} id="control-title" />

      <Message variant="status">{isLoading ? controlGroupCopy.status.loading : null}</Message>

      <Message variant="error">{error}</Message>

      {video && phase === 'video' ? (
        <div className="video-panel">
          <StudyVideoPlayer
            src={video.video_url}
            eventPrefix="control_video"
            features={getVideoPlayerFeatures('control')}
            onLogInteraction={props.onLogInteraction}
            onEnded={handleVideoEnded}
            onLoadedMetadata={handleVideoLoadedMetadata}
          />

          <Message variant="status">
            {canProceedFromVideo
              ? videoGateCopy.finishedBeforeQuiz
              : withEmphasis(videoGateCopy.watchFullVideo)}
          </Message>
        </div>
      ) : null}

      {phase === 'quiz' ? (
        <Quiz
          questions={quiz.questions}
          answers={quiz.answers}
          answeredCount={quiz.answeredCount}
          total={quiz.total}
          onToggle={quiz.onToggle}
          canSubmit={canProceedFromQuiz}
          onSubmit={proceedFromQuiz}
          onBackToVideo={backToVideo}
        />
      ) : null}

      {phase === 'video' ? (
        <StudyActions className="study-actions--stacked">
          <button
            type="button"
            className="primary-button"
            disabled={!canProceedFromVideo}
            onClick={proceedFromVideo}
          >
            {actionsCopy.continue}
          </button>
        </StudyActions>
      ) : null}
    </StudyPage>
  )
}

export default ControlGroup
