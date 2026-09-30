import { use, type ReactNode } from 'react'

import { StudyProgressContext } from '../shell/studyProgressContext.ts'
import StudyProgress from './StudyProgress.tsx'

type StudyPageVariant = 'landing' | 'form' | 'ready' | 'consent' | 'video' | 'questionnaire'

type StudyPageProps = {
  ariaLabelledBy: string
  variant?: StudyPageVariant
  children: ReactNode
}

function StudyPage({ ariaLabelledBy, variant, children }: StudyPageProps) {
  const pageClassName = variant ? `study-page study-page--${variant}` : 'study-page'
  const page = use(StudyProgressContext)

  return (
    <main className={pageClassName}>
      {page ? <StudyProgress page={page} /> : null}

      <section className="study-card" aria-labelledby={ariaLabelledBy}>
        {children}
      </section>
    </main>
  )
}

export default StudyPage
