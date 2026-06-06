import type { QuestionOption } from './types'

const copyOptionKeyToValue = (key: string) =>
  key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

export const buildOptionsFromCopy = (options: Record<string, string>): QuestionOption[] =>
  Object.entries(options).map(([key, label]) => ({
    value: copyOptionKeyToValue(key),
    label,
  }))
