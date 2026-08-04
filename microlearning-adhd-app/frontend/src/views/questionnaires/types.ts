export type LikertQuestionnaireProps = {
  values: Record<string, string>
  error: string | null
  isSubmitting: boolean
  onChange: (questionId: string, value: string) => void
  onSubmit: () => void
  onBack?: () => void
}
