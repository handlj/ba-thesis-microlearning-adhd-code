import { useEffect, useState } from 'react'
import { getInstructionVideo, type InstructionVideo, type StudyInteractionPayload } from '../../services/index.ts'
import StudyActions from '../../components/StudyActions.tsx'
import StudyFacts from '../../components/StudyFacts.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import StudyVideoPlayer from '../../components/video/StudyVideoPlayer.tsx'
import { genericIcons } from '@assets/icons/genericIcons.tsx'
import { copy } from '../../content/copy.ts'
import { type GroupAssignment } from '../../utils/groupAssignment.ts'
import { getVideoPlayerFeatures } from '../../utils/videoFeatures.ts'
import { withEmphasis } from '../../utils/richText.tsx'
import Message from '../../components/Message.tsx'

type ReadyProps = {
  assignment: GroupAssignment | null
  onContinue: () => void
  onLogInteraction: (eventType: string, payload?: StudyInteractionPayload) => void
}

function Ready({
  assignment,
  onContinue,
  onLogInteraction,
}: ReadyProps) {
  const [video, setVideo] = useState<InstructionVideo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasVideoEnded, setHasVideoEnded] = useState(false)
  const assignmentLabel = assignment
    ? copy.ready.groupLabels[assignment]
    : null
  const canContinue = Boolean(assignment && hasVideoEnded)

  useEffect(() => {
    let active = true

    const loadVideo = async () => {
      try {
        setIsLoading(true)
        const response = await getInstructionVideo()

        if (!active) {
          return
        }

        setVideo(response)
        setError(null)
      } catch (requestError) {
        if (!active) {
          return
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : copy.ready.status.loadError,
        )
      } finally {
        if (active) {
          setIsLoading(false)
        }
      }
    }

    void loadVideo()

    return () => {
      active = false
    }
  }, [])

  return (
    <StudyPage  ariaLabelledBy="ready-title" 
                cardClassName="study-card--video">
      <StudyHeading
        eyebrow={copy.ready.heading.eyebrow}
        title={copy.ready.heading.title}
        intro={copy.ready.heading.intro}
        id="ready-title"
      />

      <StudyFacts facts={copy.ready.facts} />

      <Message variant="status">
        {isLoading ? copy.ready.status.loading : null}
      </Message>

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
        {/* TODO: Remove this visible assignment label before deployment. */}
        {assignmentLabel ? (
          <p className="assignment-result">
            {copy.ready.assignmentLabel}
            <strong>
              {assignmentLabel}
            </strong>
          </p>
        ) : null}

        <button
          type="button"
          className="start-button"
          onClick={onContinue}
          disabled={!canContinue}
        >
          {copy.actions.continue}
        </button>

        <p className="status status-note">
          <span className="status-note__icon"
                aria-hidden="true">
            {genericIcons.clock}
          </span>

          <span className="status-note__text">
            {withEmphasis(copy.ready.readinessNote)}
          </span>
        </p>
      </StudyActions>
    </StudyPage>
  )
}

export default Ready
