export const welcomeCopy = {
  heading: {
    eyebrow: 'MicroPython',
    title: 'Herzlich Willkommen!',
    intro:
      'Sie beginnen gleich eine Studiensitzung zum Erlernen von Grundlagen in der Programmiersprache Python. Hier sehen Sie zusammengefasst, was Sie erwartet.',
  },
  facts: [
    {
      icon: 'clock',
      label: 'Dauer',
      value: 'Etwa 60 Minuten',
    },
    {
      icon: 'headphones',
      label: 'Notwendige Ausstattung',
      value: 'Lautsprecher oder Kopfhörer',
    },
  ],
  steps: {
    title: 'Ihr Ablauf',
  },
  reward: {
    title: 'Belohnung',
    text: 'Nach erfolgreichem Abschluss dieser Studie erhalten Sie einen Code, mit dem Sie sich eine Belohnung abholen können. Mehr dazu nach der Studie.',
  },
  status: {
    noDataCollected: 'Ohne Ihr Einverständnis werden keine Daten erhoben.',
  },
  actions: {
    start: 'Studie starten',
  },
} as const
