export const quizCopy = {
  intro:
    'Beantworten Sie bitte die folgenden Fragen so gut Sie können.\n\n Bei allen Fragen ist **genau eine** Antwortalternative korrekt.\n Bitte beantworten Sie **alle** Fragen, bevor Sie fortfahren.',
  score: {
    caption: 'Fragen richtig beantwortet',
    outOf: (total: number) => `von ${total}`,
  },
} as const
