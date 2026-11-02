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
    title: 'Aufwandsentschädigung',
    text: 'Nach erfolgreichem Abschluss dieser Studie erhalten Sie eine Aufwandsentschädigung in Form eines 10€ Stadt-Graz Gutscheins. Diesen können Sie sich am Institute of Human-Centred Computing abholen mittels eines Codes, den Sie am Ende der Studie erhalten.',
  },
  status: {
    noDataCollected: 'Ohne Ihr Einverständnis werden keine Daten erhoben.',
  },
  actions: {
    start: 'Studie starten',
  },
} as const
