export const thankYouCopy = {
  heading: {
    eyebrow: 'Studie abgeschlossen',
    title: 'Vielen Dank für Ihre Teilnahme.',
    intro:
      'Ihr Beitrag hilft uns zu verstehen, wie Lernerfahrungen in Zukunft besser gestaltet werden können.',
  },
  facts: [
    {
      icon: 'check',
      label: 'Ihre Antworten',
      value: 'Übermittelt und anonymisiert gespeichert',
    },
  ],
  voucher: {
    label: 'Gutscheincode',
    instructions:
      'Notieren Sie sich diesen Code, um eine Belohnung zu erhalten. Diese können Sie sich bei der Studienleitung an der unten angeführten Adresse abholen.',
    address:
      'Büro von Lisa Berger, Institute of Human-Centered Computing (HCC)\n 8010 Graz, Sandgasse 36, 3. Stock',
    copyHint: 'Zum Kopieren klicken',
    copied: 'Kopiert!',
    loading: 'Ihr Code wird erstellt …',
    loadError: 'Ihr Code konnte nicht erstellt werden. Bitte versuchen Sie es erneut.',
    retry: 'Erneut versuchen',
    alreadyIssued:
      'Für diese Teilnahme wurde bereits ein Code ausgestellt. Bitte wenden Sie sich an die Studienleitung.',
  },
  status: {
    closeWindow: 'Sie können dieses Fenster nun schließen',
  },
  contact: {
    label: 'Rückfragen zur Studie',
  },
  actions: {
    returnToStart: 'Zurück zum Start',
  },
} as const
