import { useEffect, useState } from 'react'
import StudyActions from '../components/StudyActions.tsx'
import StudyHeading from '../components/StudyHeading.tsx'
import StudyPage from '../components/StudyPage.tsx'
import { StudyForm, type FormAnswerValue, type StudyQuestion } from '../components/forms'
import { fetchControlVideo, type ControlVideo } from '../api.ts'

type ControlGroupProps = {
  onBackToStart: () => void
}

type ControlPhase = 'video' | 'quiz'

type ControlQuizAnswers = {
  mainTopic: string
  perceivedClarity: string
}

type ControlQuizQuestionId = keyof ControlQuizAnswers

const defaultControlQuizAnswers: ControlQuizAnswers = {
  mainTopic: '',
  perceivedClarity: '',
}

const controlQuizQuestions: StudyQuestion<ControlQuizQuestionId>[] = [
  {
    id: 'mainTopic',
    type: 'radio',
    label: 'What was the reference video mainly about?',
    required: true,
    options: [
      { value: 'study-material', label: 'The study material shown in the video' },
      { value: 'demographics', label: 'The demographic questionnaire' },
      { value: 'technical-setup', label: 'Browser or technical setup instructions' },
    ],
  },
  {
    id: 'perceivedClarity',
    type: 'radio',
    label: 'How clear was the reference video?',
    required: true,
    options: [
      { value: 'clear', label: 'Clear' },
      { value: 'somewhat-clear', label: 'Somewhat clear' },
      { value: 'not-clear', label: 'Not clear' },
    ],
  },
]

function ControlGroup({ onBackToStart }: ControlGroupProps) {
  const [video, setVideo] = useState<ControlVideo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [canContinue, setCanContinue] = useState(false)
  const [phase, setPhase] = useState<ControlPhase>('video')
  const [quizAnswers, setQuizAnswers] = useState<ControlQuizAnswers>(
    defaultControlQuizAnswers,
  )

  const isQuizComplete = Object.values(quizAnswers).every(Boolean)

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

  const handleQuizChange = (
    field: ControlQuizQuestionId,
    value: FormAnswerValue,
  ) => {
    if (!Array.isArray(value)) {
      setQuizAnswers((previousAnswers) => ({
        ...previousAnswers,
        [field]: value,
      }))
    }
  }

  const showQuiz = () => {
    if (canContinue) {
      setPhase('quiz')
    }
  }

  const submitQuiz = () => {
    if (isQuizComplete) {
      onBackToStart()
    }
  }

  return (
    <StudyPage ariaLabelledBy="control-title" cardClassName="study-card--video">
      <StudyHeading
        eyebrow="Control group"
        title={phase === 'video' ? 'Watch the reference video' : 'Complete the post-video quiz'}
        intro={
          phase === 'video'
            ? 'Watch the full backend-served video before continuing to the short sample quiz.'
            : 'Answer both sample questions to finish this temporary control-group flow.'
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

      {phase === 'quiz' ? (
        <StudyForm
          questions={controlQuizQuestions}
          values={quizAnswers}
          onChange={handleQuizChange}
          onSubmit={submitQuiz}
          actions={
            <StudyActions>
              <button
                type="button"
                className="secondary-button"
                onClick={() => setPhase('video')}
              >
                Back to video
              </button>
              <button type="submit" className="start-button" disabled={!isQuizComplete}>
                Continue
              </button>
            </StudyActions>
          }
        />
      ) : null}

      {isLoading ? <p className="video-status">Loading control video from the backend...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {phase === 'video' ? (
        <StudyActions className="study-actions--stacked">
          <button type="button" className="secondary-button" onClick={onBackToStart}>
            Return to welcome
          </button>
          <button type="button" className="start-button" disabled={!canContinue} onClick={showQuiz}>
            Continue
          </button>
        </StudyActions>
      ) : null}
    </StudyPage>
  )
}

export default ControlGroup
