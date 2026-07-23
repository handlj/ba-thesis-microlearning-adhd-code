import type { ReactNode } from 'react'
import QuestionField from './QuestionField'
import type { FormAnswerValue, QuestionChangeHandler, StudyQuestion } from './types'
import Message from '../Message'

type StudyFormProps<QuestionId extends string = string> = {
  questions: StudyQuestion<QuestionId>[]
  values: Partial<Record<QuestionId, FormAnswerValue>>
  error?: string | null
  actions: ReactNode
  onChange: QuestionChangeHandler<QuestionId>
  onSubmit: () => void
}

function StudyForm<QuestionId extends string = string>({
  questions,
  values,
  error,
  actions,
  onChange,
  onSubmit,
}: StudyFormProps<QuestionId>) {
  return (
    <form
      className="study-form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      {questions.map((question) => (
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
