import type { ReactNode } from 'react'

type StudyPageProps = {
  ariaLabelledBy: string
  cardClassName?: string
  children: ReactNode
}

function StudyPage({ ariaLabelledBy, cardClassName, children }: StudyPageProps) {
  const sectionClassName = cardClassName
    ? `study-card ${cardClassName}`
    : 'study-card'

  return (
    <main className="study-page">
      <section className={sectionClassName} aria-labelledby={ariaLabelledBy}>
        {children}
      </section>
    </main>
  )
}

export default StudyPage