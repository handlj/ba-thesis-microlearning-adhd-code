import { Fragment, type ReactNode } from 'react'

// Splits a string on backtick pairs and wraps the inner segments in <code>.
// Example: "x ist vom Typ `int`" -> ["x ist vom Typ ", <code>int</code>]
// Unbalanced trailing backticks are rendered as plain text.
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
