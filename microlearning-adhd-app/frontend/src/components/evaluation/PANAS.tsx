import { panas } from '../../content/panas'

type PanasAnswers = Record<string, string>

type PanasProps = {
  values: PanasAnswers
  error?: string | null
  onChange: (questionId: string, value: string) => void
}

function PANAS({ values, error, onChange }: PanasProps) {
  const answered = Object.values(values).filter(Boolean).length
  const total = panas.questions.length

  return (
    <section className="panas-questionnaire" aria-labelledby="panas-title">
      <h2 className="panas-title" id="panas-title">
        {panas.title}
      </h2>
      <p className="panas-instructions">{panas.instructions}</p>
      <p className="questionnaire-progress" aria-live="polite">
        {answered} von {total} beantwortet
      </p>

      <div className="panas-table-wrap">
        <table className="panas-table">
          <thead>
            <tr>
              <th className="panas-question-heading" scope="col">
                <span className="sr-only">{panas.table.questionColumn}</span>
              </th>
              {panas.scale.values.map((scaleValue) => (
                <th className="panas-scale-heading" scope="col" key={scaleValue}>
                  <span className="panas-scale-label">
                    {panas.scale.labels[scaleValue as keyof typeof panas.scale.labels]}
                  </span>
                  <span>{scaleValue}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {panas.questions.map((question, index) => (
              <tr key={question.id}>
                <th className="panas-question-cell" scope="row">
                  <span className="panas-question-number">{index + 1}.</span>
                  <span>{question.text}</span>
                </th>
                {panas.scale.values.map((scaleValue) => {
                  const inputId = `${question.id}-${scaleValue}`
                  const scaleLabel =
                    panas.scale.labels[scaleValue as keyof typeof panas.scale.labels]

                  return (
                    <td className="panas-option-cell" key={scaleValue}>
                      <label className="panas-option" htmlFor={inputId}>
                        <input
                          id={inputId}
                          type="radio"
                          name={question.id}
                          value={scaleValue}
                          checked={values[question.id] === scaleValue}
                          onChange={(event) => {
                            onChange(question.id, event.target.value)
                          }}
                          aria-label={panas.scale.optionLabel(
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

export default PANAS
