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
      label:
        'Möchten Sie im nächsten Fenster eine Rückmeldung zu Ihren Ergebnissen in den Coding-Quizzes erhalten?',
      options: {
        yes: 'Ja',
        no: 'Nein',
      },
    },
  },
  actions: {
    complete: 'Studie abschließen',
  },
  status: {
    reward: {
      wantsFeedback:
        'Nach der Rückmeldung zu Ihren Ergebnissen erhalten Sie den Code für Ihre Aufwandsentschädigung.',
      noFeedback: 'Im nächsten Fenster erhalten Sie den Code für Ihre Aufwandsentschädigung.',
    },
  },
  errors: {
    save: 'Der Post-Interventions-Fragebogen konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
  },
} as const
