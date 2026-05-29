import { ues } from '../../content/ues'

type UesAnswers = Record<string, string>

type UesProps = {
  values: UesAnswers
  error?: string | null
  onChange: (questionId: string, value: string) => void
}

function UES({ values, error, onChange }: UesProps) {
  return (
    <section className="ues-questionnaire" aria-labelledby="ues-title">
      <h2 className="ues-title" id="ues-title">
        {ues.title}
      </h2>
      <p className="ues-instructions">{ues.instructions}</p>

      <div className="ues-table-wrap">
        <table className="ues-table">
          <thead>
            <tr>
              <th className="ues-question-heading" scope="col">
                <span className="sr-only">{ues.table.questionColumn}</span>
              </th>
              {ues.scale.values.map((scaleValue) => (
                <th className="ues-scale-heading" scope="col" key={scaleValue}>
                  <span className="ues-scale-label">
                    {ues.scale.labels[scaleValue as keyof typeof ues.scale.labels]}
                  </span>
                  <span>{scaleValue}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ues.questions.map((question, index) => (
              <tr key={question.id}>
                <th className="ues-question-cell" scope="row">
                  <span className="ues-question-number">{index + 1}.</span>
                  <span>{question.text}</span>
                </th>
                {ues.scale.values.map((scaleValue) => {
                  const inputId = `${question.id}-${scaleValue}`
                  const scaleLabel =
                    ues.scale.labels[scaleValue as keyof typeof ues.scale.labels]

                  return (
                    <td className="ues-option-cell" key={scaleValue}>
                      <label className="ues-option" htmlFor={inputId}>
                        <input
                          id={inputId}
                          type="radio"
                          name={question.id}
                          value={scaleValue}
                          checked={values[question.id] === scaleValue}
                          onChange={(event) => {
                            onChange(question.id, event.target.value)
                          }}
                          aria-label={ues.scale.optionLabel(
                            question.text,
                            scaleValue,
                            scaleLabel,
                          )}
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

export default UES
