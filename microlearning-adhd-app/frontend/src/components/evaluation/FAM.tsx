import { fam } from '../../content/fam'

type FamAnswers = Record<string, string>

type FamProps = {
  values: FamAnswers
  error?: string | null
  onChange: (questionId: string, value: string) => void
}

function FAM({ values, error, onChange }: FamProps) {
  const answered = Object.values(values).filter(Boolean).length
  const total = fam.questions.length

  return (
    <section className="fam-questionnaire" aria-labelledby="fam-title">
      <h2 className="fam-title" id="fam-title">
        {fam.title}
      </h2>
      <p className="fam-instructions">{fam.instructions}</p>
      <p className="questionnaire-progress" aria-live="polite">
        {answered} von {total} beantwortet
      </p>

      <div className="fam-table-wrap">
        <table className="fam-table">
          <thead>
            <tr>
              <th className="fam-question-heading" scope="col">
                <span className="sr-only">{fam.table.questionColumn}</span>
              </th>
              {fam.scale.values.map((scaleValue, index) => (
                <th className="fam-scale-heading" scope="col" key={scaleValue}>
                  {index === 0 ? (
                    <span className="fam-scale-endpoint">{fam.scale.low}</span>
                  ) : null}
                  {index === fam.scale.values.length - 1 ? (
                    <span className="fam-scale-endpoint">{fam.scale.high}</span>
                  ) : null}
                  <span>{scaleValue}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fam.questions.map((question, index) => (
              <tr key={question.id}>
                <th className="fam-question-cell" scope="row">
                  <span className="fam-question-number">{index + 1}.</span>
                  <span>{question.text}</span>
                </th>
                {fam.scale.values.map((scaleValue) => {
                  const inputId = `${question.id}-${scaleValue}`

                  return (
                    <td className="fam-option-cell" key={scaleValue}>
                      <label className="fam-option" htmlFor={inputId}>
                        <input
                          id={inputId}
                          type="radio"
                          name={question.id}
                          value={scaleValue}
                          checked={values[question.id] === scaleValue}
                          onChange={(event) => {
                            onChange(question.id, event.target.value)
                          }}
                          aria-label={fam.scale.optionLabel(question.text, scaleValue)}
                        />
                        <span aria-hidden="true">{scaleValue}</span>
                      </label>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error ? <p className="error-text">{error}</p> : null}
    </section>
  )
}

export default FAM
