import { useId } from 'react'
import type { QuizQuestion } from '../../content/quiz.ts'
import { genericIcons } from '@assets/icons/genericIcons.tsx'
import QuizOptionContent from './QuizOptionContent.tsx'
import { renderInlineCode } from './renderInlineCode.tsx'

type QuizQuestionFieldProps = {
  question: QuizQuestion
  selected: string[]
  onToggle: (optionId: string) => void
  index?: number
  isFrozen?: boolean
}

function QuizQuestionField({
  question,
  selected,
  onToggle,
  index,
  isFrozen = false,
}: QuizQuestionFieldProps) {
  const generatedId = useId()
  const groupId = `${question.id}-${generatedId}`

  const shownOptions = isFrozen
    ? question.options.filter((option) => selected.includes(option.id))
    : question.options

  return (
    <fieldset
      className={`question-field 
              quiz-question${isFrozen ? ' quiz-question--frozen' : ''}`}
    >
      <legend
        className="question-label 
              quiz-prompt"
      >
        {typeof index === 'number' ? (
          isFrozen ? (
            <span className="quiz-question-number quiz-question-number--frozen" aria-hidden="true">
              {genericIcons.check}
            </span>
          ) : (
            <span className="quiz-question-number" aria-hidden="true">
              {index}
            </span>
          )
        ) : null}

        <span>{renderInlineCode(question.prompt)}</span>
      </legend>

      {question.code ? (
        <pre className="quiz-code">
          <code>{question.code}</code>
        </pre>
      ) : null}

      <div className="choice-list">
        {shownOptions.map((option) => {
          const optionId = `${groupId}-${option.id}`
          const checked = selected.includes(option.id)

          if (isFrozen) {
            return (
              <div className="choice-option choice-option--frozen" key={option.id}>
                <span className="quiz-checkbox quiz-checkbox--frozen" aria-hidden="true">
                  {genericIcons.check}
                </span>

                <QuizOptionContent option={option} />
              </div>
            )
          }

          return (
            <label
              className="choice-option 
                    choice-option--quiz"
              key={option.id}
              htmlFor={optionId}
            >
              <input
                id={optionId}
                type="checkbox"
                name={question.id}
                value={option.id}
                checked={checked}
                onChange={() => onToggle(option.id)}
              />
              <span className="quiz-checkbox" aria-hidden="true">
                {genericIcons.check}
              </span>

              <QuizOptionContent option={option} />
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export default QuizQuestionField
