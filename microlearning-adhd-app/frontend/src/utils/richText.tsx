import { Fragment, type ReactNode } from 'react'

export function withEmphasis(text: string): ReactNode[] {
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
  return text
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
    .split(/\n{2,}/)
    .filter((paragraph) => paragraph.length > 0)
}
