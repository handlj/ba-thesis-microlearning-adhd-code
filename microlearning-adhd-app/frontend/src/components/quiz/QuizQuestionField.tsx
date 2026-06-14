import { useId } from 'react'
import type { QuizQuestion } from '../../content/quiz.ts'
import { renderInlineCode } from './renderInlineCode.tsx'

type QuizQuestionFieldProps = {
  question: QuizQuestion
  selected: string[]
  onToggle: (optionId: string) => void
  index?: number
}

// Renders a single multi-select quiz question. Reuses the existing form styling
// (question-field / choice-list / choice-option) and adds comfortable embedding
// for inline and multi-line code snippets.
function QuizQuestionField({ question, selected, onToggle, index }: QuizQuestionFieldProps) {
  const generatedId = useId()
  const groupId = `${question.id}-${generatedId}`

  return (
    <fieldset className="question-field quiz-question">
      <legend className="question-label quiz-prompt">
        {typeof index === 'number' ? (
          <span className="quiz-question-number">{index}.</span>
        ) : null}
        <span>{renderInlineCode(question.prompt)}</span>
      </legend>

      {question.code ? (
        <pre className="quiz-code">
          <code>{question.code}</code>
        </pre>
      ) : null}

      <div className="choice-list">
        {question.options.map((option) => {
          const optionId = `${groupId}-${option.id}`
          const checked = selected.includes(option.id)

          return (
            <label className="choice-option" key={option.id} htmlFor={optionId}>
              <input
                id={optionId}
                type="checkbox"
                name={question.id}
                value={option.id}
                checked={checked}
                onChange={() => onToggle(option.id)}
              />
              <span className="quiz-option-content">
                {option.text ? <span>{renderInlineCode(option.text)}</span> : null}
                {option.code ? (
                  <pre className="quiz-code quiz-code--option">
                    <code>{option.code}</code>
                  </pre>
                ) : null}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export default QuizQuestionField
