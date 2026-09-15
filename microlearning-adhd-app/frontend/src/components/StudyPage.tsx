import { use, type ReactNode } from 'react'

import { StudyProgressContext } from '../shell/studyProgressContext.ts'
import StudyProgress from './StudyProgress.tsx'

type StudyPageProps = {
  ariaLabelledBy: string
  cardClassName?: string
  children: ReactNode
}

function StudyPage({ ariaLabelledBy, cardClassName, children }: StudyPageProps) {
  const sectionClassName = cardClassName ? `study-card ${cardClassName}` : 'study-card'
  const page = use(StudyProgressContext)

  return (
    <main className="study-page">
      {page ? <StudyProgress page={page} /> : null}

      <section className={sectionClassName} aria-labelledby={ariaLabelledBy}>
        {children}
      </section>
    </main>
  )
}

export default StudyPage
