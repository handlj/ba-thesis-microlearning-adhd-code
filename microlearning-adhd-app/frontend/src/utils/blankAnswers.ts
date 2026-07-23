type Identified = { id: string }

export function blankAnswers(questions: readonly Identified[]): Record<string, string> {
  return Object.fromEntries(questions.map((q) => [q.id, '']))
}

export function blankAnswersMultiSelect(questions: readonly Identified[]): Record<string, string[]> {
  return Object.fromEntries(questions.map((q) => [q.id, []]))
}
