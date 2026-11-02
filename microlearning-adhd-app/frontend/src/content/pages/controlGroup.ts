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
    loading: 'Video wird geladen...',
    loadError: 'Das Video konnte nicht geladen werden.',
  },
} as const
