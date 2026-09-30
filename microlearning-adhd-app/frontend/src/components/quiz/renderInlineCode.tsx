import '@assets/styles/components/quiz/QuizCode.css'
import { Fragment, type ReactNode } from 'react'

export function renderInlineCode(text: string): ReactNode {
  const segments = text.split('`')

  return segments.map((segment, index) => {
    const isCode = index % 2 === 1

    if (isCode) {
      return (
        <code className="quiz-inline-code" key={index}>
          {segment}
        </code>
      )
    }

    return <Fragment key={index}>{segment}</Fragment>
  })
}
