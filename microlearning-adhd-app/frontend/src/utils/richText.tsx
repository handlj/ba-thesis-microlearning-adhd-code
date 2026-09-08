import { Fragment, type ReactNode } from 'react'

/*
  A minimal formatting convention for the strings in copy.ts, so wording and
  its formatting stay together in the content file instead of being split
  across the content file and the components:

    **bold**       an emphasised run
    a line break   a <br /> within the same paragraph
    a blank line   a new paragraph
    "- " lines     a block of them becomes a key-point list (toBlocks only)

  Authors may indent continuation lines to match the surrounding object
  literal; leading and trailing whitespace per line is dropped.
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

export function toParagraphs(text: string, className?: string): ReactNode {
  const paragraphs = splitParagraphs(text)

  return (
    <>
      {paragraphs.map((paragraph, index) => (
        <p key={index} className={paragraphClass(className)}>
          {withEmphasis(paragraph)}
        </p>
      ))}
    </>
  )
}

export function toBlocks(text: string, className?: string): ReactNode {
  return (
    <>
      {splitParagraphs(text).map((block, index) => {
        const items = listItems(block)

        if (!items) {
          return (
            <p key={index} className={paragraphClass(className)}>
              {withEmphasis(block)}
            </p>
          )
        }

        return (
          <ul key={index} className="rich-text__list">
            {items.map((item, itemIndex) => (
              <li key={itemIndex} className="rich-text__item">
                {/* Wrapped, so an emphasised run stays inside the text column
                    instead of becoming a grid item of its own. */}
                <span>{withEmphasis(item)}</span>
              </li>
            ))}
          </ul>
        )
      })}
    </>
  )
}

function listItems(block: string): string[] | null {
  const lines = block.split('\n')

  if (!lines.every((line) => line.startsWith('- '))) {
    return null
  }

  return lines.map((line) => line.slice(2).trim())
}

function paragraphClass(className?: string): string {
  return [className, 'rich-text__paragraph'].filter(Boolean).join(' ')
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
