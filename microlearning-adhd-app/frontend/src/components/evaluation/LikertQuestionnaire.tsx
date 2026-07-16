import ProgressPill from '../ProgressPill.tsx'

type LikertScale = {
  values: readonly string[]
  labels?: Readonly<Record<string, string>>
  low?: string
  high?: string
  optionLabel: (question: string, value: string, label: string) => string
}

type LikertQuestion = {
  id: string
  text: string
}

type LikertQuestionnaireProps = {
  title?: string
  instructions?: string
  questionColumnLabel: string
  modifier: string
  scale: LikertScale
  questions: readonly LikertQuestion[]
  values: Record<string, string>
  error?: string | null
  onChange: (questionId: string, value: string) => void
}

function LikertQuestionnaire({
  title,
  instructions,
  questionColumnLabel,
  modifier,
  scale,
  questions,
  values,
  error,
  onChange,
}: LikertQuestionnaireProps) {
  const answered = Object.values(values).filter(Boolean).length
  const total = questions.length
  const sectionTitleId = `${modifier}-questionnaire-title`

  return (
    <section
      className="likert-questionnaire"
      aria-labelledby={title ? sectionTitleId : undefined}
    >
      
      {title ? (
        <h2 className="likert-title" 
            id={sectionTitleId}>
          {title}
        </h2>
      ) : null}
      
      {instructions ? 
        <p className="likert-instructions">
          {instructions}
        </p>
      : null}

      <div className="likert-table-wrap">
        <table className={`likert-table likert-table--${modifier}`}>
          <thead>
            <tr>
              <th className="likert-question-heading" 
                  scope="col">
                <span className="sr-only">
                  {questionColumnLabel}
                </span>
                
                <ProgressPill 
                  answered={answered} 
                  total={total} 
                />
              </th>
              
              {scale.values.map((scaleValue, index) => {
                const label = scale.labels
                  ? scale.labels[scaleValue]
                  : index === 0
                    ? scale.low
                    : index === scale.values.length - 1
                      ? scale.high
                      : undefined

                return (
                  <th className="likert-scale-heading" 
                      scope="col" key={scaleValue}>
                    {label ? 
                      <span className="likert-scale-label">
                        {label}
                      </span>
                    : null}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {questions.map((question, index) => (
              <tr key={question.id}>
                <th className="likert-question-cell" scope="row">
                  <span className="likert-question">
                    <span className="likert-question-number"
                          aria-hidden="true">
                      {index + 1}
                    </span>

                    <span className="likert-question-text">
                      {question.text}
                    </span>
                  </span>
                </th>
                {scale.values.map((scaleValue) => {
                  const inputId = `${question.id}-${scaleValue}`
                  const scaleLabel = scale.labels?.[scaleValue] ?? scaleValue

                  return (
                    <td className="likert-option-cell" key={scaleValue}>
                      <label  className="likert-option" 
                              htmlFor={inputId}>
                        <input
                          id={inputId}
                          type="radio"
                          name={question.id}
                          value={scaleValue}
                          checked={values[question.id] === scaleValue}
                          onChange={(event) => {
                            onChange(question.id, event.target.value)
                          }}
                          aria-label={scale.optionLabel(
                            question.text,
                            scaleValue,
                            scaleLabel,
                          )}
                        />
                        
                        <span aria-hidden="true">
                          {scaleValue}
                        </span>
                      </label>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error ? 
        <p className="error-text">
          {error}
        </p>
      : null}
    </section>
  )
}

export default LikertQuestionnaire
