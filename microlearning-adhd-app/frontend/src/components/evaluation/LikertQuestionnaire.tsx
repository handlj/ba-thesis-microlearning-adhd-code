import '@assets/styles/components/evaluation/LikertQuestionnaire.css'
import ProgressPill from '../ProgressPill.tsx'
import Message from '../Message.tsx'

type LikertScale = {
  values: readonly string[]
  labels?: Readonly<Record<string, string>>
  low?: string
  high?: string
}

type LikertQuestion = {
  id: string
  text: string
}

type LikertQuestionnaireHeaderProps = {
  modifier: string
  scale: LikertScale
  questions: readonly LikertQuestion[]
  values: Record<string, string>
  error?: string | null
  onChange: (questionId: string, value: string) => void
}

function LikertQuestionnaire({
  modifier,
  scale,
  questions,
  values,
  error,
  onChange,
}: LikertQuestionnaireHeaderProps) {
  const answered = Object.values(values).filter(Boolean).length
  const total = questions.length

  return (
    <section className="likert-questionnaire">
      <div className="likert-questionnaire__table-wrap">
        <table className={`likert-table likert-table--${modifier}`}>
          <thead>
            <tr>
              <th className="likert-table__question-heading">
                <ProgressPill answered={answered} total={total} />
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
                  <th className="likert-table__scale-heading" key={scaleValue}>
                    {label ? <span className="likert-table__scale-label">{label}</span> : null}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {questions.map((question, index) => (
              <tr key={question.id}>
                <th className="likert-table__question-cell">
                  <span className="likert-table__question">
                    <span className="likert-table__question-number">{index + 1}</span>

                    <span className="likert-table__question-text">{question.text}</span>
                  </span>
                </th>
                {scale.values.map((scaleValue) => {
                  const inputId = `${question.id}-${scaleValue}`

                  return (
                    <td className="likert-table__option-cell" key={scaleValue}>
                      <label className="likert-table__option" htmlFor={inputId}>
                        <input
                          id={inputId}
                          type="radio"
                          name={question.id}
                          value={scaleValue}
                          checked={values[question.id] === scaleValue}
                          onChange={(event) => {
                            onChange(question.id, event.target.value)
                          }}
                        />

                        <span>{scaleValue}</span>
                      </label>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Message variant="error">{error}</Message>
    </section>
  )
}

export default LikertQuestionnaire
