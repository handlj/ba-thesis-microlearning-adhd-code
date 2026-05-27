import { useEffect, useRef, useState } from 'react'
import { fetchInstructionVideo, type InstructionVideo, type StudyInteractionPayload } from '../api.ts'
import StudyActions from '../components/StudyActions.tsx'
import StudyHeading from '../components/StudyHeading.tsx'
import StudyPage from '../components/StudyPage.tsx'
import { copy } from '../content/copy'
import { type GroupAssignment } from '../utils/groupAssignment'

type ReadyProps = {
  assignment: GroupAssignment | null
  onContinue: () => void
  onReturnToWelcome: () => void
  onLogInteraction: (eventType: string, payload?: StudyInteractionPayload) => void
}

function Ready({
  assignment,
  onContinue,
  onReturnToWelcome,
  onLogInteraction,
}: ReadyProps) {
  const [video, setVideo] = useState<InstructionVideo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasVideoEnded, setHasVideoEnded] = useState(false)
  const previousVideoTimeRef = useRef(0)
  const assignmentLabel = assignment
    ? copy.ready.groupLabels[assignment]
    : null
  const canContinue = Boolean(assignment && hasVideoEnded)

  useEffect(() => {
    let active = true

    const loadVideo = async () => {
      try {
        setIsLoading(true)
        const response = await fetchInstructionVideo()

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

  const handleVideoSeek = (nextTime: number) => {
    const previousTime = previousVideoTimeRef.current
    const deltaSeconds = nextTime - previousTime

    if (deltaSeconds > 1) {
      onLogInteraction('ready_instruction_video_skipped', {
        fromSeconds: Math.round(previousTime),
        toSeconds: Math.round(nextTime),
      })
    }

    if (deltaSeconds < -1) {
      onLogInteraction('ready_instruction_video_rewatched', {
        fromSeconds: Math.round(previousTime),
        toSeconds: Math.round(nextTime),
      })
    }

    previousVideoTimeRef.current = nextTime
  }

  return (
    <StudyPage ariaLabelledBy="ready-title" cardClassName="study-card--video">
      <StudyHeading
        eyebrow={copy.ready.heading.eyebrow}
        title={copy.ready.heading.title}
        intro={copy.ready.heading.intro}
        id="ready-title"
      />

      <div className="ready-instructions" aria-labelledby="ready-instructions-title">
        <h2 id="ready-instructions-title">{copy.ready.instructions.title}</h2>
        <ul className="ready-instruction-list">
          {copy.ready.instructions.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {isLoading ? <p className="video-status">{copy.ready.status.loading}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {video ? (
        <div className="video-panel">
          <div className="video-meta">
            <p className="video-kicker">{copy.ready.video.title}</p>
            <p className="video-description">{copy.ready.video.description}</p>
          </div>
          <div className="video-shell">
            <video
              className="video-frame"
              controls
              preload="metadata"
              onEnded={() => {
                setHasVideoEnded(true)
                onLogInteraction('ready_instruction_video_ended', {
                  videoUrl: video.video_url,
                })
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
              <source src={video.video_url} type="video/mp4" />
              {copy.video.unsupported}
            </video>
          </div>
          <p className="video-status" aria-live="polite">
            {hasVideoEnded
              ? copy.ready.status.videoFinished
              : copy.video.watchFullVideo}
          </p>
        </div>
      ) : null}

      <StudyActions>
        {/* TODO: Remove this visible assignment label before deployment. */}
        {assignmentLabel ? (
          <p className="assignment-result">
            {copy.ready.assignmentLabel} <strong>{assignmentLabel}</strong>
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
        <button type="button" className="secondary-button" onClick={onReturnToWelcome}>
          {copy.actions.returnToWelcome}
        </button>
        <p className="ready-note" aria-live="polite">
          {copy.ready.readinessNote}
        </p>
      </StudyActions>
    </StudyPage>
  )
}

export default Ready
