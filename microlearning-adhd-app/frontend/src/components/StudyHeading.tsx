import { toParagraphs } from '../utils/richText.tsx'

type StudyHeadingProps = {
  eyebrow?: string
  title: string
  intro?: string
}

function StudyHeading({ eyebrow, title, intro }: StudyHeadingProps) {
  return (
    <>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}

      <h1>{title}</h1>

      {intro ? toParagraphs(intro, 'intro') : null}
    </>
  )
}

export default StudyHeading
