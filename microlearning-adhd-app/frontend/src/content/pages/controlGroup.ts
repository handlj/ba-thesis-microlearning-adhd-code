import { quizCopy } from '../common/quiz.ts'

export const controlGroupCopy = {
  heading: {
    video: {
      title: 'Sehen Sie sich nun das Lernvideo an.',
    },
    quiz: {
      title: 'Bearbeiten Sie nun die folgenden Quizfragen',
      intro: quizCopy.intro,
    },
  },
  status: {
    loading: 'Kontrollvideo wird geladen...',
    loadError: 'Das Kontrollvideo konnte nicht geladen werden.',
  },
} as const
