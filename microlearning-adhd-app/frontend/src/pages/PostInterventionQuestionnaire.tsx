import { useState } from 'react'
import { StudyForm, type FormAnswerValue, type StudyQuestion } from '../components/forms'
import StudyActions from '../components/StudyActions.tsx'
import StudyHeading from '../components/StudyHeading.tsx'
import StudyPage from '../components/StudyPage.tsx'
import UES from '../components/evaluation/UES.tsx'
import { type PostInterventionAnswers } from '../api.ts'
import { copy } from '../content/copy'
import { ues } from '../content/ues'

type PostInterventionQuestionId = keyof PostInterventionAnswers

const postInterventionQuestions: StudyQuestion<PostInterventionQuestionId>[] = [
  {
    id: 'attentionSupport',
    type: 'radio',
    label: copy.postIntervention.questions.attentionSupport.label,
    required: true,
    options: [
      { value: 'strongly-agree', label: copy.postIntervention.agreementOptions.stronglyAgree },
      { value: 'agree', label: copy.postIntervention.agreementOptions.agree },
      { value: 'neutral', label: copy.postIntervention.agreementOptions.neutral },
      { value: 'disagree', label: copy.postIntervention.agreementOptions.disagree },
    ],
  },
  {
    id: 'contentClarity',
    type: 'radio',
    label: copy.postIntervention.questions.contentClarity.label,
    required: true,
    options: [
      { value: 'strongly-agree', label: copy.postIntervention.agreementOptions.stronglyAgree },
      { value: 'agree', label: copy.postIntervention.agreementOptions.agree },
      { value: 'neutral', label: copy.postIntervention.agreementOptions.neutral },
      { value: 'disagree', label: copy.postIntervention.agreementOptions.disagree },
    ],
  },
  {
    id: 'workloadFit',
    type: 'radio',
    label: copy.postIntervention.questions.workloadFit.label,
    required: true,
    options: [
      { value: 'strongly-agree', label: copy.postIntervention.agreementOptions.stronglyAgree },
      { value: 'agree', label: copy.postIntervention.agreementOptions.agree },
      { value: 'neutral', label: copy.postIntervention.agreementOptions.neutral },
      { value: 'disagree', label: copy.postIntervention.agreementOptions.disagree },
    ],
  },
  {
    id: 'preferredFormat',
    type: 'radio',
    label: copy.postIntervention.questions.preferredFormat.label,
    required: true,
    options: [
      {
        value: 'single-video',
        label: copy.postIntervention.questions.preferredFormat.options.singleVideo,
      },
      {
        value: 'short-videos',
        label: copy.postIntervention.questions.preferredFormat.options.shortVideos,
      },
      { value: 'text', label: copy.postIntervention.questions.preferredFormat.options.text },
      { value: 'mixed', label: copy.postIntervention.questions.preferredFormat.options.mixed },
    ],
  },
  {
    id: 'openFeedback',
    type: 'text',
    label: copy.postIntervention.questions.openFeedback.label,
    placeholder: copy.postIntervention.questions.openFeedback.placeholder,
    required: true,
  },
]

type PostInterventionQuestionnaireProps = {
  values: PostInterventionAnswers
  uesValues: Record<string, string>
  error: string | null
  uesError: string | null
  isSubmitting: boolean
  onChange: (field: keyof PostInterventionAnswers, value: string) => void
  onUesChange: (questionId: string, value: string) => void
  onUesProceed: () => boolean
  onSubmit: () => void
}

function PostInterventionQuestionnaire({
  values,
  uesValues,
  error,
  uesError,
  isSubmitting,
  onChange,
  onUesChange,
  onUesProceed,
  onSubmit,
}: PostInterventionQuestionnaireProps) {
  const [isShowingFollowUpQuestions, setIsShowingFollowUpQuestions] = useState(false)
  const isComplete = Object.values(values).every((value) => value.trim())

  if (!isShowingFollowUpQuestions) {
    return (
      <StudyPage
        ariaLabelledBy="post-intervention-title"
        cardClassName="study-card--questionnaire"
      >
        <StudyHeading
          eyebrow={ues.heading.eyebrow}
          title={ues.heading.title}
          intro={ues.heading.intro}
          id="post-intervention-title"
        />

        <form
          className="study-form"
          onSubmit={(event) => {
            event.preventDefault()
            if (onUesProceed()) {
              setIsShowingFollowUpQuestions(true)
            }
          }}
        >
          <UES values={uesValues} error={uesError} onChange={onUesChange} />

          <StudyActions>
            <button type="submit" className="start-button">
              {ues.actions.proceed}
            </button>
          </StudyActions>
        </form>
      </StudyPage>
    )
  }

  return (
    <StudyPage ariaLabelledBy="post-intervention-title" cardClassName="study-card--form">
      <StudyHeading
        eyebrow={copy.postIntervention.heading.eyebrow}
        title={copy.postIntervention.heading.title}
        intro={copy.postIntervention.heading.intro}
        id="post-intervention-title"
      />

      <StudyForm
        questions={postInterventionQuestions}
        values={values}
        error={error}
        onChange={(field, value: FormAnswerValue) => {
          if (!Array.isArray(value)) {
            onChange(field, value)
          }
        }}
        onSubmit={onSubmit}
        actions={
          <StudyActions>
            <button
              type="submit"
              className="start-button"
              disabled={!isComplete || isSubmitting}
            >
              {isSubmitting ? copy.actions.saving : copy.actions.completeStudy}
            </button>
          </StudyActions>
        }
      />
    </StudyPage>
  )
}

export default PostInterventionQuestionnaire
