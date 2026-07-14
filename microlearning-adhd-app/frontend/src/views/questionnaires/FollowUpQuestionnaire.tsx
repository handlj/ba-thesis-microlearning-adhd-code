import { StudyForm, type FormAnswerValue, type StudyQuestion } from '../../components/forms/index.ts'
import StudyActions from '../../components/StudyActions.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import { type PostInterventionAnswers } from '../../services/index.ts'
import { copy } from '../../content/copy.ts'

type PostInterventionQuestionId = keyof PostInterventionAnswers
type FollowUpQuestionId = PostInterventionQuestionId | 'wantsFeedback'

const postInterventionQuestions: StudyQuestion<FollowUpQuestionId>[] = [
  {
    id: 'openFeedback',
    type: 'text',
    label: copy.postIntervention.questions.openFeedback.label,
    placeholder: copy.postIntervention.questions.openFeedback.placeholder,
    required: false,
  },
  {
    id: 'wantsFeedback',
    type: 'radio',
    label: copy.postIntervention.questions.wantsFeedback.label,
    options: [
      { value: 'yes', label: copy.postIntervention.questions.wantsFeedback.options.yes },
      { value: 'no', label: copy.postIntervention.questions.wantsFeedback.options.no },
    ],
  },
]

type FollowUpQuestionnaireProps = {
  values: PostInterventionAnswers
  wantsFeedback: 'yes' | 'no'
  error: string | null
  isSubmitting: boolean
  onChange: (field: keyof PostInterventionAnswers, value: string) => void
  onWantsFeedbackChange: (value: 'yes' | 'no') => void
  onSubmit: () => void
}

function FollowUpQuestionnaire({
  values,
  wantsFeedback,
  error,
  isSubmitting,
  onChange,
  onWantsFeedbackChange,
  onSubmit,
}: FollowUpQuestionnaireProps) {
  const mergedValues = { ...values, wantsFeedback }

  const isComplete = postInterventionQuestions.every((q) => {
    if (q.required) {
      const value = mergedValues[q.id]
      return value !== undefined && value !== ''
    }
    return true
  })

  return (
    <StudyPage  ariaLabelledBy="follow-up-title" 
                cardClassName="study-card--form">
      <StudyHeading
        eyebrow={copy.postIntervention.heading.eyebrow}
        title={copy.postIntervention.heading.title}
        intro={copy.postIntervention.heading.intro}
        id="follow-up-title"
      />

      <StudyForm
        questions={postInterventionQuestions}
        values={mergedValues}
        error={error}
        onChange={(field, value: FormAnswerValue) => {
          if (Array.isArray(value)) {
            return
          }
          if (field === 'wantsFeedback') {
            onWantsFeedbackChange(value === 'yes' ? 'yes' : 'no')
          } else {
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
