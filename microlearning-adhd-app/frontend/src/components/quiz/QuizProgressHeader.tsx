import { genericIcons } from '@assets/icons/genericIcons.tsx'

import ProgressPill from '../ProgressPill.tsx'

type QuizProgressHeaderProps = {
  answered: number
  total: number
  topic?: string
  sequence?: string
  onHelp?: () => void
}

function QuizProgressHeader({ answered, total, topic, sequence, onHelp }: QuizProgressHeaderProps) {
  return (
    <div className="quiz-progress-header">
      <ProgressPill answered={answered} total={total} />

      {topic ? <p className="quiz-progress-header__topic">{topic}</p> : null}

      {sequence || onHelp ? (
        <div className="quiz-progress-header__end">
          {sequence ? <p className="quiz-progress-header__sequence">{sequence}</p> : null}

          {onHelp ? (
            <button type="button" className="quiz-progress-header__help" onClick={onHelp}>
              {genericIcons.help}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export default QuizProgressHeader
