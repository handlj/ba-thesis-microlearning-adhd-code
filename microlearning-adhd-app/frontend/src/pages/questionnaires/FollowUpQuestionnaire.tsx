import { StudyForm, type FormAnswerValue, type StudyQuestion } from '../../components/forms/index.ts'
import StudyActions from '../../components/StudyActions.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import { type PostInterventionAnswers } from '../../services/api.ts'
import { copy } from '../../content/copy.ts'

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
    required: false,
  },
]

type FollowUpQuestionnaireProps = {
  values: PostInterventionAnswers
  error: string | null
  isSubmitting: boolean
  onChange: (field: keyof PostInterventionAnswers, value: string) => void
  onSubmit: () => void
}

function FollowUpQuestionnaire({
  values,
  error,
  isSubmitting,
  onChange,
  onSubmit,
}: FollowUpQuestionnaireProps) {
  const isComplete = Object.values(values).every((value) => value.trim())

  return (
    <StudyPage ariaLabelledBy="follow-up-title" cardClassName="study-card--form">
      <StudyHeading
        eyebrow={copy.postIntervention.heading.eyebrow}
        title={copy.postIntervention.heading.title}
        intro={copy.postIntervention.heading.intro}
        id="follow-up-title"
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

export default FollowUpQuestionnaire
