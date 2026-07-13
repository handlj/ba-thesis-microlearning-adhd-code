import { useEffect, useRef, useState } from 'react'
import StudyActions from '../../components/StudyActions.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import ControlGroupQuiz from './ControlGroupQuiz.tsx'
import { getControlVideo, type ControlVideo, type StudyInteractionPayload } from '../../services/index.ts'
import { copy } from '../../content/copy.ts'

type ControlGroupProps = {
  onBackToStart: () => void
  onCompleteIntervention: () => void
  onLogInteraction: (eventType: string, payload?: StudyInteractionPayload) => void
  onSubmitQuiz: (answers: Record<string, string[]>) => void
}

type ControlPhase = 'video' | 'quiz'

function ControlGroup({
  onBackToStart,
  onCompleteIntervention,
  onLogInteraction,
  onSubmitQuiz,
}: ControlGroupProps) {
  const [video, setVideo] = useState<ControlVideo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [canContinue, setCanContinue] = useState(false)
  const [phase, setPhase] = useState<ControlPhase>('video')
  const previousVideoTimeRef = useRef(0)

  useEffect(() => {
    let active = true

    const loadVideo = async () => {
      try {
        setIsLoading(true)
        const response = await getControlVideo()

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
            : copy.errors.controlVideoLoad,
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

  const showQuiz = () => {
    if (canContinue) {
      onLogInteraction('control_video_proceed_clicked', {
        videoTitle: video?.title ?? null,
      })
      setPhase('quiz')
    }
  }

  const returnToWelcome = () => {
    onLogInteraction('control_back_clicked', {
      fromPhase: phase,
    })
    onBackToStart()
  }

  const returnToVideo = () => {
    onLogInteraction('control_back_to_video_clicked')
    setPhase('video')
  }

  const handleVideoSeek = (nextTime: number) => {
    const previousTime = previousVideoTimeRef.current
    const deltaSeconds = nextTime - previousTime

    if (deltaSeconds > 1) {
      onLogInteraction('control_video_skipped', {
        fromSeconds: Math.round(previousTime),
        toSeconds: Math.round(nextTime),
      })
    }

    if (deltaSeconds < -1) {
      onLogInteraction('control_video_rewatched', {
        fromSeconds: Math.round(previousTime),
        toSeconds: Math.round(nextTime),
      })
    }

    previousVideoTimeRef.current = nextTime
  }

  return (
    <StudyPage  ariaLabelledBy="control-title" 
                cardClassName="study-card--video">

      <StudyHeading
        eyebrow={copy.controlGroup.heading.eyebrow}
        title={
          phase === 'video'
            ? copy.controlGroup.heading.videoTitle
            : copy.controlGroup.heading.quizTitle
        }
        intro={
          phase === 'video'
            ? copy.controlGroup.heading.videoIntro
            : copy.controlGroup.heading.quizIntro
        }
        id="control-title"
      />

      {video && phase === 'video' ? (
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
              onEnded={() => {
                setCanContinue(true)
                onLogInteraction('control_video_ended', {
                  videoTitle: video.title,
                })
              }}
              onLoadedMetadata={() => {
                setCanContinue(false)
                previousVideoTimeRef.current = 0
              }}
              onSeeking={(event) => handleVideoSeek(event.currentTarget.currentTime)}
              onTimeUpdate={(event) => {
                previousVideoTimeRef.current = event.currentTarget.currentTime
              }}
            >
              
              <source 
                src={video.video_url} 
                type="video/mp4" 
              />
              
              {copy.video.unsupported}
            </video>
          </div>
          <p  className="video-status" 
              aria-live="polite">
            {canContinue
              ? copy.controlGroup.status.videoFinished
              : copy.video.watchFullVideo}
          </p>
        </div>
      ) : null}

      {phase === 'quiz' ? (
        <ControlGroupQuiz
          onSubmit={onCompleteIntervention}
          onBackToVideo={returnToVideo}
          onLogInteraction={onLogInteraction}
          onSubmitQuiz={onSubmitQuiz}
        />
      ) : null}

      {isLoading ? 
      <p className="video-status">
        {copy.controlGroup.status.loading}
      </p>
       : null}
      
      {error ? 
      <p className="error-text">
        {error}
      </p>
       : null}

      {phase === 'video' ? (
        <StudyActions className="study-actions--stacked">
          <button type="button" 
                  className="secondary-button" 
                  onClick={returnToWelcome}>
            {copy.actions.returnToWelcome}
          </button>

          <button type="button" 
                  className="start-button" 
                  disabled={!canContinue} 
                  onClick={showQuiz}>
            {copy.actions.continue}
          </button>
        </StudyActions>
      ) : null}
    </StudyPage>
  )
}

export default ControlGroup
