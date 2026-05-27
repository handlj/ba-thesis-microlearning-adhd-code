import { useEffect, useRef, useState } from 'react'
import StudyActions from '../components/StudyActions.tsx'
import StudyHeading from '../components/StudyHeading.tsx'
import StudyPage from '../components/StudyPage.tsx'
import { StudyForm, type FormAnswerValue, type StudyQuestion } from '../components/forms'
import { fetchControlVideo, type ControlVideo, type StudyInteractionPayload } from '../api.ts'
import { copy } from '../content/copy'

type ControlGroupProps = {
  onBackToStart: () => void
  onCompleteIntervention: () => void
  onLogInteraction: (eventType: string, payload?: StudyInteractionPayload) => void
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
    label: copy.controlGroup.quiz.questions.mainTopic.label,
    required: true,
    options: [
      {
        value: 'study-material',
        label: copy.controlGroup.quiz.questions.mainTopic.options.studyMaterial,
      },
      {
        value: 'demographics',
        label: copy.controlGroup.quiz.questions.mainTopic.options.demographics,
      },
      {
        value: 'technical-setup',
        label: copy.controlGroup.quiz.questions.mainTopic.options.technicalSetup,
      },
    ],
  },
  {
    id: 'perceivedClarity',
    type: 'radio',
    label: copy.controlGroup.quiz.questions.perceivedClarity.label,
    required: true,
    options: [
      {
        value: 'clear',
        label: copy.controlGroup.quiz.questions.perceivedClarity.options.clear,
      },
      {
        value: 'somewhat-clear',
        label: copy.controlGroup.quiz.questions.perceivedClarity.options.somewhatClear,
      },
      {
        value: 'not-clear',
        label: copy.controlGroup.quiz.questions.perceivedClarity.options.notClear,
      },
    ],
  },
]

function ControlGroup({
  onBackToStart,
  onCompleteIntervention,
  onLogInteraction,
}: ControlGroupProps) {
  const [video, setVideo] = useState<ControlVideo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [canContinue, setCanContinue] = useState(false)
  const [phase, setPhase] = useState<ControlPhase>('video')
  const [quizAnswers, setQuizAnswers] = useState<ControlQuizAnswers>(
    defaultControlQuizAnswers,
  )
  const previousVideoTimeRef = useRef(0)

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

  const handleQuizChange = (
    field: ControlQuizQuestionId,
    value: FormAnswerValue,
  ) => {
    if (!Array.isArray(value)) {
      setQuizAnswers((previousAnswers) => ({
        ...previousAnswers,
        [field]: value,
      }))
      onLogInteraction('control_quiz_answer_selected', {
        questionId: field,
        answer: value,
      })
    }
  }

  const showQuiz = () => {
    if (canContinue) {
      onLogInteraction('control_video_proceed_clicked', {
        videoTitle: video?.title ?? null,
      })
      setPhase('quiz')
    }
  }

  const submitQuiz = () => {
    if (isQuizComplete) {
      onLogInteraction('control_quiz_submitted', {
        mainTopic: quizAnswers.mainTopic,
        perceivedClarity: quizAnswers.perceivedClarity,
      })
      onCompleteIntervention()
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
    <StudyPage ariaLabelledBy="control-title" cardClassName="study-card--video">
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
              <source src={video.video_url} type="video/mp4" />
              {copy.video.unsupported}
            </video>
          </div>
          <p className="video-status" aria-live="polite">
            {canContinue
              ? copy.controlGroup.status.videoFinished
              : copy.video.watchFullVideo}
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
                onClick={returnToVideo}
              >
                {copy.actions.backToVideo}
              </button>
              <button type="submit" className="start-button" disabled={!isQuizComplete}>
                {copy.actions.continue}
              </button>
            </StudyActions>
          }
        />
      ) : null}

      {isLoading ? <p className="video-status">{copy.controlGroup.status.loading}</p> : null}
      {error ? <p className="error-text">{error}</p> : null}

      {phase === 'video' ? (
        <StudyActions className="study-actions--stacked">
          <button type="button" className="secondary-button" onClick={returnToWelcome}>
            {copy.actions.returnToWelcome}
          </button>
          <button type="button" className="start-button" disabled={!canContinue} onClick={showQuiz}>
            {copy.actions.continue}
          </button>
        </StudyActions>
      ) : null}
    </StudyPage>
  )
}

export default ControlGroup
