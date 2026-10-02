export const studyProgressCopy = {
  phases: {
    intro: {
      label: 'Einstieg',
      description: 'Einverständniserklärung und einige kurze Fragebögen.',
    },
    priorKnowledge: {
      label: 'Vorwissen',
      description:
        'Ein kurzes Einführungsvideo und ein Quiz zu Ihren Programmier-Vorkenntnissen. Vorwissen ist nicht nötig.',
    },
    learning: {
      label: 'Lerneinheit',
      description: 'Eine videogestützte Lerneinheit mit Quizfragen.',
    },
    closing: {
      label: 'Abschluss',
      description: 'Abschließende Fragebögen und eine Rückmeldung zu Ihrem Lernerfolg.',
    },
  },
} as const
