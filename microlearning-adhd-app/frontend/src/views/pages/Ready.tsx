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
import { copy } from '../../content/copy.ts'
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
  } = useAsyncResource<InstructionVideo>(getInstructionVideo, copy.ready.status.loadError)
  const [hasVideoEnded, setHasVideoEnded] = useState(false)
  const canContinue = Boolean(assignment && subgroup && hasVideoEnded)

  return (
    <StudyPage ariaLabelledBy="ready-title" cardClassName="study-card--video">
      <StudyHeading
        eyebrow={copy.ready.heading.eyebrow}
        title={copy.ready.heading.title}
        intro={copy.ready.heading.intro}
        id="ready-title"
      />

      <StudyFacts facts={copy.ready.facts} />

      <Message variant="status">{isLoading ? copy.ready.status.loading : null}</Message>

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
              ? copy.ready.status.videoFinished
              : withEmphasis(copy.video.watchFullVideo)}
          </Message>
        </div>
      ) : null}

      <StudyActions>
        <button type="button" className="start-button" onClick={onContinue} disabled={!canContinue}>
          {copy.actions.continue}
        </button>

        <p className="status status-note">
          <span className="status-note__icon" aria-hidden="true">
            {genericIcons.clock}
          </span>

          <span className="status-note__text">{withEmphasis(copy.ready.readinessNote)}</span>
        </p>
      </StudyActions>
    </StudyPage>
  )
}

export default Ready
