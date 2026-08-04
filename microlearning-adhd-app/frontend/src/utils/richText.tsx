import { Fragment, type ReactNode } from 'react'

/*
  A minimal formatting convention for the strings in copy.ts, so wording and
  its formatting stay together in the content file instead of being split
  across the content file and the components:

    **bold**       an emphasised run
    a line break   a <br /> within the same paragraph
    a blank line   a new paragraph

  Authors may indent continuation lines to match the surrounding object
  literal; leading and trailing whitespace per line is dropped.
*/

/*
  Inline formatting only: **bold** and single line breaks. Returns nodes to be
  placed inside a caller-provided element.
*/
export function withEmphasis(text: string): ReactNode[] {
  // A capturing split alternates plain text and marked runs, so every odd
  // index is exactly the content that sat between a pair of markers.
  return text
    .split(/\*\*(.+?)\*\*/g)
    .map((segment, index) =>
      index % 2 === 1 ? <strong key={index}>{segment}</strong> : withLineBreaks(segment, index),
    )
}

function withLineBreaks(segment: string, segmentIndex: number): ReactNode {
  const lines = segment.split('\n')

  if (lines.length === 1) {
    return segment
  }

  return (
    <Fragment key={segmentIndex}>
      {lines.map((line, index) => (
        <Fragment key={index}>
          {index > 0 ? <br /> : null}
          {line}
        </Fragment>
      ))}
    </Fragment>
  )
}

/*
  Splits text into paragraphs on blank lines and renders each as its own <p>,
  as siblings rather than inside a wrapper, so the caller's existing layout and
  class styling keep applying unchanged. Single-paragraph text therefore renders
  exactly as a plain <p> would.
*/
export function toParagraphs(text: string, className?: string): ReactNode {
  const paragraphs = splitParagraphs(text)

  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={[className, 'rich-text__paragraph'].filter(Boolean).join(' ')}>
          {withEmphasis(paragraph)}
        </p>
      ))}
    </>
  )
}

function splitParagraphs(text: string): string[] {
  return (
    text
      // Trim per line so indented continuation lines in copy.ts stay readable.
      .split('\n')
      .map((line) => line.trim())
      .join('\n')
      .split(/\n{2,}/)
      .filter((paragraph) => paragraph.length > 0)
  )
}
