type StudyHeadingProps = {
  eyebrow: string
  title: string
  intro: string
  id: string
}

function StudyHeading({ eyebrow, title, intro, id }: StudyHeadingProps) {
  return (
    <>
      <p className="eyebrow">{eyebrow}</p>
      <h1 id={id}>{title}</h1>
      <p className="intro">{intro}</p>
    </>
  )
}

export default StudyHeading