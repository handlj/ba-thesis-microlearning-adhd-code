import type { ReactNode } from 'react'
import FormSection from './FormSection'
import QuestionField from './QuestionField'
import type {
  FormAnswerValue,
  FormSectionDefinition,
  QuestionChangeHandler,
  StudyQuestion,
} from './types'
import Message from '../Message'

type StudyFormContent<QuestionId extends string = string> =
  | { questions: StudyQuestion<QuestionId>[]; sections?: never }
  | { sections: FormSectionDefinition<QuestionId>[]; questions?: never }

type StudyFormProps<QuestionId extends string = string> = StudyFormContent<QuestionId> & {
  values: Partial<Record<QuestionId, FormAnswerValue>>
  error?: string | null
  actions: ReactNode
  onChange: QuestionChangeHandler<QuestionId>
  onSubmit: () => void
}

function StudyForm<QuestionId extends string = string>(props: StudyFormProps<QuestionId>) {
  const { values, error, actions, onChange, onSubmit } = props

  return (
    <form
      className="study-form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      {props.sections
        ? props.sections.map((section) => (
            <FormSection key={section.id} section={section} values={values} onChange={onChange} />
          ))
        : props.questions.map((question) => (
            <QuestionField
              key={question.id}
              question={question}
              value={values[question.id]}
              onChange={onChange}
            />
          ))}

      <Message variant="error">{error}</Message>

      {actions}
    </form>
  )
}

export default StudyForm
