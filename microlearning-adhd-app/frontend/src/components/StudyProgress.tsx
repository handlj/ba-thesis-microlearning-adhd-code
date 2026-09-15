import type { CSSProperties } from 'react'

import { copy } from '../content/copy.ts'
import type { Page } from '../shell/pageOrder.ts'
import { studyProgress } from '../shell/studyPhases.ts'

type StudyProgressProps = {
  page: Page
}

function StudyProgress({ page }: StudyProgressProps) {
  const progress = studyProgress(page)
  if (!progress) return null

  const { phases } = copy.studyProgress

  return (
    <nav className="study-progress">
      <ol className="study-progress__segments">
        {progress.segments.map((segment) => (
          <li
            key={segment.phase}
            className={`study-progress__segment study-progress__segment--${segment.state}`}
            style={{ '--fill': segment.fill } as CSSProperties}
          >
            <span className="study-progress__track">
              <span className="study-progress__fill" />
            </span>

            <span className="study-progress__label">
              <span className="study-progress__text">{phases[segment.phase].label}</span>
            </span>
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default StudyProgress
