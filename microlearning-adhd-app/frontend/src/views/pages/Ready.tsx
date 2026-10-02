import { useState } from 'react'
import {
  getInstructionVideo,
  type InstructionVideo,
  type StudyInteractionPayload,
} from '../../services/index.ts'
import StudyActions from '../../components/StudyActions.tsx'
import StudyFacts from '../../components/StudyFacts.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import StudyVideoPlayer from '../../components/video/StudyVideoPlayer.tsx'
import { genericIcons } from '@assets/icons/genericIcons.tsx'
import { actionsCopy } from '@content/common/actions.ts'
import { videoGateCopy } from '@content/common/videoGate.ts'
import { readyCopy } from '@content/pages/ready.ts'
import { type GroupAssignment, type Subgroup } from '../../utils/groupAssignment.ts'
import { getVideoPlayerFeatures } from '../../utils/videoFeatures.ts'
import { withEmphasis } from '../../utils/richText.tsx'
import Message from '../../components/Message.tsx'
import { useAsyncResource } from '../../hooks/useAsyncResource.ts'

type ReadyProps = {
  assignment: GroupAssignment | null
  subgroup: Subgroup | null
  onContinue: () => void
  onLogInteraction: (eventType: string, payload?: StudyInteractionPayload) => void
}

function Ready({ assignment, subgroup, onContinue, onLogInteraction }: ReadyProps) {
  const {
    data: video,
    isLoading,
    error,
  } = useAsyncResource<InstructionVideo>(getInstructionVideo, readyCopy.status.loadError)
  const [hasVideoEnded, setHasVideoEnded] = useState(false)
  const canContinue = Boolean(assignment && subgroup && hasVideoEnded)

  return (
    <StudyPage variant="video">
      <StudyHeading {...readyCopy.heading} />

      <StudyFacts facts={readyCopy.facts} />

      <Message variant="status">{isLoading ? readyCopy.status.loading : null}</Message>

      <Message variant="error">{error}</Message>

      {video ? (
        <div className="video-panel">
          <StudyVideoPlayer
            src={video.video_url}
            eventPrefix="ready_instruction_video"
            eventPayload={{ videoUrl: video.video_url }}
            features={getVideoPlayerFeatures('instruction')}
            onLogInteraction={onLogInteraction}
            onEnded={() => setHasVideoEnded(true)}
            onLoadedMetadata={() => setHasVideoEnded(false)}
          />

          <Message variant="status">
            {hasVideoEnded
              ? readyCopy.status.videoFinished
              : withEmphasis(videoGateCopy.watchFullVideo)}
          </Message>
        </div>
      ) : null}

      <StudyActions>
        <button
          type="button"
          className="primary-button"
          onClick={onContinue}
          disabled={!canContinue}
        >
          {actionsCopy.continue}
        </button>

        <p className="status-note">
          <span className="status-note__icon">{genericIcons.clock}</span>

          <span className="status-note__text">{withEmphasis(readyCopy.readinessNote)}</span>
        </p>
      </StudyActions>
    </StudyPage>
  )
}

export default Ready
