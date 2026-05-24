import { StudyForm, type FormAnswerValue, type StudyQuestion } from '../components/forms'
import StudyActions from '../components/StudyActions.tsx'
import StudyHeading from '../components/StudyHeading.tsx'
import StudyPage from '../components/StudyPage.tsx'
import { type PostInterventionAnswers } from '../api.ts'

type PostInterventionQuestionId = keyof PostInterventionAnswers

const postInterventionQuestions: StudyQuestion<PostInterventionQuestionId>[] = [
  {
    id: 'attentionSupport',
    type: 'radio',
    label: 'The study material helped me stay focused.',
    required: true,
    options: [
      { value: 'strongly-agree', label: 'Strongly agree' },
      { value: 'agree', label: 'Agree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'disagree', label: 'Disagree' },
    ],
  },
  {
    id: 'contentClarity',
    type: 'radio',
    label: 'The content was easy to understand.',
    required: true,
    options: [
      { value: 'strongly-agree', label: 'Strongly agree' },
      { value: 'agree', label: 'Agree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'disagree', label: 'Disagree' },
    ],
  },
  {
    id: 'workloadFit',
    type: 'radio',
    label: 'The amount of work felt manageable.',
    required: true,
    options: [
      { value: 'strongly-agree', label: 'Strongly agree' },
      { value: 'agree', label: 'Agree' },
      { value: 'neutral', label: 'Neutral' },
      { value: 'disagree', label: 'Disagree' },
    ],
  },
  {
    id: 'preferredFormat',
    type: 'radio',
    label: 'Which format would you prefer for future learning material?',
    required: true,
    options: [
      { value: 'single-video', label: 'One longer video' },
      { value: 'short-videos', label: 'Several short videos' },
      { value: 'text', label: 'Written material' },
      { value: 'mixed', label: 'A mix of formats' },
    ],
  },
  {
    id: 'openFeedback',
    type: 'text',
    label: 'Is there anything you would improve about the learning experience?',
    placeholder: 'Share a short comment',
    required: true,
  },
]

type PostInterventionQuestionnaireProps = {
  values: PostInterventionAnswers
  error: string | null
  isSubmitting: boolean
  onChange: (field: keyof PostInterventionAnswers, value: string) => void
  onSubmit: () => void
}

function PostInterventionQuestionnaire({
  values,
  error,
  isSubmitting,
  onChange,
  onSubmit,
}: PostInterventionQuestionnaireProps) {
  const isComplete = Object.values(values).every((value) => value.trim())

  return (
    <StudyPage ariaLabelledBy="post-intervention-title" cardClassName="study-card--form">
      <StudyHeading
        eyebrow="Post-intervention questionnaire"
        title="Tell us about the study material"
        intro="Please answer these short sample questions before completing the study."
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
              {isSubmitting ? 'Saving...' : 'Complete study'}
            </button>
          </StudyActions>
        }
      />
    </StudyPage>
  )
}

export default PostInterventionQuestionnaire
