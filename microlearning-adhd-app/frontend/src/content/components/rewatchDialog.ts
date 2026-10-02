export const rewatchDialogCopy = {
  dialogTitle: 'Quiz erneut starten',
  attemptLabel: (current: number, total: number) => `Versuch ${current} von ${total}`,
  thresholdLabel: (threshold: number, total: number) => `Ziel: ${threshold} von ${total} richtig`,
  thresholdMarkerLabel: 'Bestehensgrenze',
  reviewScoreTitle: 'Ihr Ergebnis',
  reviewCorrectTitle: 'Korrekt beantwortete Fragen',
  reviewCorrectNote: (count: number) =>
    count === 1
      ? 'Diese Frage ist gespeichert und muss nicht erneut beantwortet werden.'
      : `Diese ${count} Fragen sind gespeichert und müssen nicht erneut beantwortet werden.`,
  reviewWrongTitle: 'Noch einmal ansehen',
  chapterHint: (title: string, time: string) => `${title} · ${time}`,
  reviewOptionsNote: 'Ihre bisherige Auswahl ist bei jeder Frage markiert.',
  nextStepsCompact:
    'Das Video startet automatisch **an einer passenden Stelle**. Sie können das Quiz jederzeit erneut starten.',
  jumpStepCompact:
    '**Klicken Sie auf eine Frage**, um direkt dorthin zu springen oder drücken Sie auf Weiter, um automatisch an eine passende Stelle im Video zu gelangen.',
  standardRewatchNote:
    'Drücken Sie auf Weiter, um automatisch an eine passende Stelle im Video zu gelangen.',
} as const
