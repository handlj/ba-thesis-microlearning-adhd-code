import { useId } from 'react'
import type { FormAnswerValue, QuestionChangeHandler, RadioQuestionDefinition } from './types'

type RadioQuestionProps<QuestionId extends string = string> = {
  question: RadioQuestionDefinition<QuestionId>
  value?: FormAnswerValue
  onChange: QuestionChangeHandler<QuestionId>
}

function RadioQuestion<QuestionId extends string = string>({
  question,
  value,
  onChange,
}: RadioQuestionProps<QuestionId>) {
  const generatedId = useId()
  const groupId = `${question.id}-${generatedId}`
  const helpId = `${groupId}-help`
  const selectedValue = Array.isArray(value) ? '' : value ?? ''

  return (
    <fieldset
      className="question-field"
      aria-describedby={question.helpText ? helpId : undefined}
    >
      <legend className="question-label">{question.label}</legend>
      {question.helpText ? (
        <p className="question-help" id={helpId}>
          {question.helpText}
        </p>
      ) : null}
      <div className="choice-list">
        {question.options.map((option) => {
          const optionId = `${groupId}-${option.value}`

          return (
            <label className="choice-option" key={option.value} htmlFor={optionId}>
              <input
                id={optionId}
                type="radio"
                name={question.id}
                value={option.value}
                checked={selectedValue === option.value}
                onChange={(event) => onChange(question.id, event.target.value)}
                required={question.required}
              />
              <span>{option.label}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export default RadioQuestion
