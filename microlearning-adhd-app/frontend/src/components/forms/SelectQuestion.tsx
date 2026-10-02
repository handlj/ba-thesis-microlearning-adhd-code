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
  const selectedValue = Array.isArray(value) ? '' : (value ?? '')

  return (
    <div className="question-field">
      <label className="question-field__label" htmlFor={selectId}>
        {question.label}
      </label>
      {question.helpText ? <p className="question-field__help">{question.helpText}</p> : null}
      <select
        id={selectId}
        className="question-field__control"
        value={selectedValue}
        onChange={(event) => onChange(question.id, event.target.value)}
        required={question.required}
      >
        <option value="">{question.placeholder ?? 'Antwort wählen'}</option>
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
