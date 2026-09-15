import { createContext } from 'react'
import type { Page } from './pageOrder'

export const StudyProgressContext = createContext<Page | null>(null)
