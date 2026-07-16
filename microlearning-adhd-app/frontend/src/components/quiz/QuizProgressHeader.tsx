import ProgressPill from '../ProgressPill.tsx'

type QuizProgressHeaderProps = {
  answered: number
  total: number
  topic?: string
  sequence?: string
}

function QuizProgressHeader({ answered, total, topic, sequence }: QuizProgressHeaderProps) {
  return (
    <div className="quiz-progress-header">
      <ProgressPill 
        answered={answered} 
        total={total} 
      />

      {topic ? (
        <p className="quiz-progress-header__topic">
          {topic}
        </p>
      ) : null}

      {sequence ? (
        <p className="quiz-progress-header__sequence">
          {sequence}
        </p>
      ) : null}
    </div>
  )
}

export default QuizProgressHeader
