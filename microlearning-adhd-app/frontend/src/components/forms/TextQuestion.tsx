import { useId } from 'react'
import type { FormAnswerValue, QuestionChangeHandler, TextQuestionDefinition } from './types'

type TextQuestionProps<QuestionId extends string = string> = {
  question: TextQuestionDefinition<QuestionId>
  value?: FormAnswerValue
  onChange: QuestionChangeHandler<QuestionId>
}

function TextQuestion<QuestionId extends string = string>({
  question,
  value,
  onChange,
}: TextQuestionProps<QuestionId>) {
  const generatedId = useId()
  const inputId = `${question.id}-${generatedId}`
  const helpId = `${inputId}-help`
  const textValue = Array.isArray(value) ? '' : value ?? ''

  return (
    <div className="question-field">
      <label className="question-label" htmlFor={inputId}>
        {question.label}
      </label>
      {question.helpText ? (
        <p className="question-help" id={helpId}>
          {question.helpText}
        </p>
      ) : null}
      <input
        id={inputId}
        className="question-control"
        type={question.type}
        value={textValue}
        onChange={(event) => onChange(question.id, event.target.value)}
        placeholder={question.placeholder}
        min={question.min}
        max={question.max}
        inputMode={question.inputMode}
        autoComplete={question.autoComplete}
        required={question.required}
        aria-describedby={question.helpText ? helpId : undefined}
      />
    </div>
  )
}

export default TextQuestion
