import { useId } from 'react'
import type { FormAnswerValue, QuestionChangeHandler, SelectQuestionDefinition } from './types'

type SelectQuestionProps<QuestionId extends string = string> = {
  question: SelectQuestionDefinition<QuestionId>
  value?: FormAnswerValue
  onChange: QuestionChangeHandler<QuestionId>
}

function SelectQuestion<QuestionId extends string = string>({
  question,
  value,
  onChange,
}: SelectQuestionProps<QuestionId>) {
  const generatedId = useId()
  const selectId = `${question.id}-${generatedId}`
  const helpId = `${selectId}-help`
  const selectedValue = Array.isArray(value) ? '' : value ?? ''

  return (
    <div className="question-field">
      <label className="question-label" htmlFor={selectId}>
        {question.label}
      </label>
      {question.helpText ? (
        <p className="question-help" id={helpId}>
          {question.helpText}
        </p>
      ) : null}
      <select
        id={selectId}
        className="question-control"
        value={selectedValue}
        onChange={(event) => onChange(question.id, event.target.value)}
        required={question.required}
        aria-describedby={question.helpText ? helpId : undefined}
      >
        <option value="">{question.placeholder ?? 'Select one'}</option>
        {question.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SelectQuestion
