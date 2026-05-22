import CheckboxQuestion from './CheckboxQuestion'
import RadioQuestion from './RadioQuestion'
import SelectQuestion from './SelectQuestion'
import TextQuestion from './TextQuestion'
import type { FormAnswerValue, QuestionChangeHandler, StudyQuestion } from './types'

type QuestionFieldProps<QuestionId extends string = string> = {
  question: StudyQuestion<QuestionId>
  value?: FormAnswerValue
  onChange: QuestionChangeHandler<QuestionId>
}

function QuestionField<QuestionId extends string = string>({
  question,
  value,
  onChange,
}: QuestionFieldProps<QuestionId>) {
  switch (question.type) {
    case 'text':
    case 'number':
      return <TextQuestion question={question} value={value} onChange={onChange} />
    case 'select':
      return <SelectQuestion question={question} value={value} onChange={onChange} />
    case 'radio':
      return <RadioQuestion question={question} value={value} onChange={onChange} />
    case 'checkbox':
      return <CheckboxQuestion question={question} value={value} onChange={onChange} />
  }
}

export default QuestionField
