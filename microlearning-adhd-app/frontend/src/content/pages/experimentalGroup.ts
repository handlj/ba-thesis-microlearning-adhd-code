import { quizCopy } from '../common/quiz.ts'

export const experimentalGroupCopy = {
  heading: {
    video: {
      title: 'Sehen Sie sich das Lernvideo an.',
      intro: 'Sehen Sie sich das Video vollständig an, bevor Sie mit dem Quiz fortfahren.',
    },
    quiz: {
      title: 'Beantworten Sie die Quizfragen.',
      intro: quizCopy.intro,
    },
  },
  status: {
    allAnswered: 'Alle Fragen beantwortet. Sie können fortfahren.',
    answerAllQuestions: 'Bitte beantworten Sie alle Fragen, um fortzufahren.',
    loading: 'Experimentelle Videos werden vom Backend geladen...',
    loadError: 'Die experimentellen Videos konnten nicht geladen werden.',
    noVideos: 'Es sind noch keine experimentellen Videos verfügbar.',
    rewatch: 'Sie können das Video erneut ansehen oder das Quiz sofort neu starten.',
  },
  actions: {
    startQuiz: 'Quiz starten',
    retakeQuiz: 'Quiz erneut starten',
    nextVideo: 'Nächstes Video',
  },
  progress: (current: number, total: number) => `Video ${current} von ${total}`,
} as const
