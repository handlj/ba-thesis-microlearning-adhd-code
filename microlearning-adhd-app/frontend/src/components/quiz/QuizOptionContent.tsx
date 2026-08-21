import type { QuizOption } from '../../content/quiz.ts'
import { renderInlineCode } from './renderInlineCode.tsx'

function QuizOptionContent({ option }: { option: QuizOption }) {
  return (
    <div className="quiz-option-content">
      {option.text ? <span>{renderInlineCode(option.text)}</span> : null}

      {option.code ? (
        <pre className="quiz-code quiz-code--option">
          <code>{option.code}</code>
        </pre>
      ) : null}
    </div>
  )
}

export default QuizOptionContent
