import { useEffect, useState } from 'react'
import StudyActions from '../components/StudyActions.tsx'
import StudyHeading from '../components/StudyHeading.tsx'
import StudyPage from '../components/StudyPage.tsx'
import { fetchControlVideo, type ControlVideo } from '../api.ts'

type ControlGroupProps = {
  onBackToStart: () => void
}

function ControlGroup({ onBackToStart }: ControlGroupProps) {
  const [video, setVideo] = useState<ControlVideo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [canContinue, setCanContinue] = useState(false)

  useEffect(() => {
    let active = true

    const loadVideo = async () => {
      try {
        setIsLoading(true)
        const response = await fetchControlVideo()

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
            : 'Could not load the control video.',
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
    <StudyPage ariaLabelledBy="control-title" cardClassName="study-card--video">
      <StudyHeading
        eyebrow="Control group"
        title="Watch the reference video"
        intro="This page fetches a backend-served video so we can test the control-group flow before the next study step."
        id="control-title"
      />

      {video ? (
        <div className="video-panel">
          <div className="video-meta">
            <p className="video-kicker">{video.title}</p>
            <p className="video-description">{video.description}</p>
          </div>
          <div className="video-shell">
            <video
              className="video-frame"
              controls
              preload="metadata"
              onEnded={() => setCanContinue(true)}
              onLoadedMetadata={() => setCanContinue(false)}
            >
              <source src={video.video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <p className="video-status" aria-live="polite">
            {canContinue
              ? 'The video finished. You can continue.'
              : 'Watch the full video before continuing.'}
          </p>
        </div>
      ) : null}

      {isLoading ? <p className="video-status">Loading control video from the backend...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      <StudyActions className="study-actions--stacked">
        <button type="button" className="secondary-button" onClick={onBackToStart}>
          Return to welcome
        </button>
        <button type="button" className="start-button" disabled={!canContinue} onClick={onBackToStart}>
          Continue
        </button>
      </StudyActions>
    </StudyPage>
  )
}

export default ControlGroup