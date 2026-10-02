export const readyCopy = {
  heading: {
    eyebrow: 'Einführungsvideo',
    title: 'Bitte sehen Sie sich das Einführungsvideo an.',
  },
  facts: [
    {
      icon: 'play',
      label: 'Videoinhalt',
      value: 'Eine kurze Einführung in die Lerneinheit.',
    },
    {
      icon: 'headphones',
      label: 'Vorbereitung',
      value: 'Prüfen Sie die Audiowiedergabe.',
    },
  ],
  status: {
    loading: 'Einführungsvideo wird geladen...',
    loadError: 'Das Einführungsvideo konnte nicht geladen werden.',
    videoFinished: 'Das Video ist beendet. Sie können jetzt fortfahren.',
  },
  readinessNote:
    'Fahren Sie erst fort, wenn Sie sich für **mindestens 30 Minuten** ohne Unterbrechung konzentrieren können.',
} as const
