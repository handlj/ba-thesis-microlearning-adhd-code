import { useEffect, useState } from 'react'
import StudyActions from '../components/StudyActions.tsx'
import StudyHeading from '../components/StudyHeading.tsx'
import StudyPage from '../components/StudyPage.tsx'
import { fetchExperimentalVideos, type ExperimentalVideo } from '../api.ts'

type ExperimentalGroupProps = {
  onBackToStart: () => void
}

type ExperimentalPhase = 'video' | 'quiz'

const sampleQuizOptions = [
  'A short introduction to the topic',
  'A long written assignment',
  'A live group discussion',
]

function ExperimentalGroup({ onBackToStart }: ExperimentalGroupProps) {
  const [videos, setVideos] = useState<ExperimentalVideo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<ExperimentalPhase>('video')
  const [hasVideoEnded, setHasVideoEnded] = useState(false)
  const [quizAnswer, setQuizAnswer] = useState('')

  useEffect(() => {
    let active = true

    const loadVideos = async () => {
      try {
        setIsLoading(true)
        const response = await fetchExperimentalVideos()

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
            : 'Could not load the experimental videos.',
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

  const resetStepState = () => {
    setPhase('video')
    setHasVideoEnded(false)
    setQuizAnswer('')
  }

  const handleProceedFromVideo = () => {
    if (!hasVideoEnded) {
      return
    }

    if (isLastVideo) {
      onBackToStart()
      return
    }

    setPhase('quiz')
  }

  const handleProceedFromQuiz = () => {
    if (!quizAnswer) {
      return
    }

    setCurrentIndex((previousIndex) => previousIndex + 1)
    resetStepState()
  }

  return (
    <StudyPage ariaLabelledBy="experimental-title" cardClassName="study-card--video">
      <StudyHeading
        eyebrow="Experimental group"
        title="Complete the microlearning sequence"
        intro="Watch each video fully, answer the short sample quiz, and continue through the five-part sequence."
        id="experimental-title"
      />

      {isLoading ? (
        <p className="video-status">Loading experimental videos from the backend...</p>
      ) : null}

      {error ? <p className="error-text">{error}</p> : null}

      {!isLoading && !error && videoCount === 0 ? (
        <p className="video-status">No experimental videos are available yet.</p>
      ) : null}

      {currentVideo ? (
        <div className="video-panel">
          <p className="sequence-progress">
            Video {currentIndex + 1} of {videoCount}
          </p>

          {phase === 'video' ? (
            <>
              <div className="video-meta">
                <p className="video-kicker">{currentVideo.title}</p>
                <p className="video-description">{currentVideo.description}</p>
              </div>
              <div className="video-shell">
                <video
                  key={currentVideo.id}
                  className="video-frame"
                  controls
                  preload="metadata"
                  onEnded={() => setHasVideoEnded(true)}
                  onLoadedMetadata={() => setHasVideoEnded(false)}
                >
                  <source src={currentVideo.video_url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              <p className="video-status" aria-live="polite">
                {hasVideoEnded
                  ? isLastVideo
                    ? 'The final video finished. You can continue.'
                    : 'The video finished. You can answer the quiz.'
                  : 'Watch the full video before continuing.'}
              </p>
            </>
          ) : (
            <div className="quiz-panel" aria-labelledby="sample-quiz-title">
              <div>
                <p className="video-kicker">Sample quiz</p>
                <h2 id="sample-quiz-title" className="quiz-title">
                  What did this lesson ask you to complete?
                </h2>
              </div>
              <div className="quiz-options">
                {sampleQuizOptions.map((option) => (
                  <label className="choice-option" key={option}>
                    <input
                      type="radio"
                      name={`experimental-quiz-${currentVideo.id}`}
                      value={option}
                      checked={quizAnswer === option}
                      onChange={(event) => setQuizAnswer(event.target.value)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              <p className="video-status" aria-live="polite">
                {quizAnswer
                  ? 'Answer selected. You can continue.'
                  : 'Select any answer to continue.'}
              </p>
            </div>
          )}
        </div>
      ) : null}

      <StudyActions className="study-actions--stacked">
        <button type="button" className="secondary-button" onClick={onBackToStart}>
          Return to welcome
        </button>
        {currentVideo && phase === 'video' ? (
          <button
            type="button"
            className="start-button"
            disabled={!hasVideoEnded}
            onClick={handleProceedFromVideo}
          >
            {isLastVideo ? 'Continue' : 'Start quiz'}
          </button>
        ) : null}
        {currentVideo && phase === 'quiz' ? (
          <button
            type="button"
            className="start-button"
            disabled={!quizAnswer}
            onClick={handleProceedFromQuiz}
          >
            Next video
          </button>
        ) : null}
      </StudyActions>
    </StudyPage>
  )
}

export default ExperimentalGroup
