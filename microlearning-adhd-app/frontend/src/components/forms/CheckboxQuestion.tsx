import { useId } from 'react'
import type { CheckboxQuestionDefinition, FormAnswerValue, QuestionChangeHandler } from './types'

type CheckboxQuestionProps<QuestionId extends string = string> = {
  question: CheckboxQuestionDefinition<QuestionId>
  value?: FormAnswerValue
  onChange: QuestionChangeHandler<QuestionId>
}

function CheckboxQuestion<QuestionId extends string = string>({
  question,
  value,
  onChange,
}: CheckboxQuestionProps<QuestionId>) {
  const generatedId = useId()
  const groupId = `${question.id}-${generatedId}`
  const helpId = `${groupId}-help`
  const selectedValues = Array.isArray(value) ? value : []

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
          const checked = selectedValues.includes(option.value)

          return (
            <label className="choice-option" key={option.value} htmlFor={optionId}>
              <input
                id={optionId}
                type="checkbox"
                name={question.id}
                value={option.value}
                checked={checked}
                onChange={(event) => {
                  const nextValues = event.target.checked
                    ? [...selectedValues, option.value]
                    : selectedValues.filter((selectedValue) => selectedValue !== option.value)

                  onChange(question.id, nextValues)
                }}
              />
              <span>{option.label}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export default CheckboxQuestion
