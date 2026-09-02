import QuestionField from './QuestionField'
import type { FormAnswerValue, FormSectionDefinition, QuestionChangeHandler } from './types'

type FormSectionProps<QuestionId extends string = string> = {
  section: FormSectionDefinition<QuestionId>
  values: Partial<Record<QuestionId, FormAnswerValue>>
  onChange: QuestionChangeHandler<QuestionId>
}

function FormSection<QuestionId extends string = string>({
  section,
  values,
  onChange,
}: FormSectionProps<QuestionId>) {
  return (
    <fieldset className="form-section">
      <legend className="form-section__title">{section.title}</legend>

      <div className="form-section__questions">
        {section.questions.map((question) => (
          <QuestionField
            key={question.id}
            question={question}
            value={values[question.id]}
            onChange={onChange}
          />
        ))}
      </div>
    </fieldset>
  )
}

export default FormSection
