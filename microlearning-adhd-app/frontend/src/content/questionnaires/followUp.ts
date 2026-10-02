export const followUpCopy = {
  heading: {
    title: 'Teilen Sie uns Ihre Einschätzung mit',
    intro: 'Bitte beantworten Sie die folgenden Fragen, bevor Sie die Studie abschließen.',
  },
  questions: {
    openFeedback: {
      label: 'Gibt es etwas, das Sie an der Lernerfahrung verbessern würden?',
      placeholder: 'Teilen Sie einen kurzen Kommentar',
    },
    wantsFeedback: {
      label: 'Möchten Sie eine Rückmeldung zu Ihren Ergebnissen in den Coding-Quizzen erhalten?',
      options: {
        yes: 'Ja',
        no: 'Nein',
      },
    },
  },
  actions: {
    complete: 'Studie abschließen',
  },
  errors: {
    save: 'Der Post-Interventions-Fragebogen konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
  },
} as const
