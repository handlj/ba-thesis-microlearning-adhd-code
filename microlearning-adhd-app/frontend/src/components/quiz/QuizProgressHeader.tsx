type QuizProgressHeaderProps = {
  answered: number
  total: number
}

// Sticky bar pinned to the top of the quiz screens, mirroring the questionnaire's
// progress header so participants always see how many questions they've answered.
function QuizProgressHeader({ answered, total }: QuizProgressHeaderProps) {
  return (
    <div className="quiz-progress-header">
      <span className="quiz-progress" aria-live="polite">
        {answered} von {total} beantwortet
      </span>
    </div>
  )
}

export default QuizProgressHeader
