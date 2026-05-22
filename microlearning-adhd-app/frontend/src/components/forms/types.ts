import type { ReactNode } from 'react'

export type QuestionOption = {
  value: string
  label: string
}

export type FormAnswerValue = string | string[]

export type FormAnswers = Record<string, FormAnswerValue>

export type QuestionChangeHandler<QuestionId extends string = string> = (
  questionId: QuestionId,
  value: FormAnswerValue,
) => void

type BaseQuestion<QuestionId extends string = string> = {
  id: QuestionId
  label: string
  required?: boolean
  helpText?: ReactNode
}

export type TextQuestionDefinition<QuestionId extends string = string> =
  BaseQuestion<QuestionId> & {
    type: 'text' | 'number'
    placeholder?: string
    min?: number
    max?: number
    inputMode?: 'text' | 'numeric' | 'decimal' | 'email' | 'search' | 'tel' | 'url'
    autoComplete?: string
  }

export type SelectQuestionDefinition<QuestionId extends string = string> =
  BaseQuestion<QuestionId> & {
    type: 'select'
    options: QuestionOption[]
    placeholder?: string
  }

export type RadioQuestionDefinition<QuestionId extends string = string> =
  BaseQuestion<QuestionId> & {
    type: 'radio'
    options: QuestionOption[]
  }

export type CheckboxQuestionDefinition<QuestionId extends string = string> =
  BaseQuestion<QuestionId> & {
    type: 'checkbox'
    options: QuestionOption[]
  }

export type StudyQuestion<QuestionId extends string = string> =
  | TextQuestionDefinition<QuestionId>
  | SelectQuestionDefinition<QuestionId>
  | RadioQuestionDefinition<QuestionId>
  | CheckboxQuestionDefinition<QuestionId>
