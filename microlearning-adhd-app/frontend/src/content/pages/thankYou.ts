import { studyContact } from '../common/studyContact.ts'

export const thankYouCopy = {
  heading: {
    eyebrow: 'Studie abgeschlossen',
    title: 'Vielen Dank für Ihre Teilnahme.',
    intro:
      'Ihr Beitrag hilft uns zu verstehen, wie Lernerfahrungen in Zukunft besser gestaltet werden können.',
  },
  voucher: {
    label: 'Gutscheincode',
    instructions:
      'Notieren Sie sich diesen Code, um eine Aufwandsentschädigung zu erhalten. Diese können Sie sich bei der Studienleitung an der unten angeführten Adresse abholen.',
    copyHint: 'Zum Kopieren klicken',
    copied: 'Kopiert!',
    copyFailed: 'Kopieren nicht möglich. Bitte notieren Sie sich den Code.',
    loading: 'Ihr Code wird erstellt …',
    loadError: 'Ihr Code konnte nicht erstellt werden. Bitte versuchen Sie es erneut.',
    retry: 'Erneut versuchen',
    alreadyIssued:
      'Für diese Teilnahme wurde bereits ein Code ausgestellt. Bitte wenden Sie sich an die Studienleitung.',
  },
  pickup: {
    rows: [
      {
        label: 'Büro von',
        value: `**${studyContact.name}**\nInstitute of Human-Centred Computing (HCC)`,
      },
      { label: 'Adresse', value: '**Sandgasse 36**, 8010 Graz' },
      { label: 'Raum', value: '**DH03 142**, 3. Stock' },
      { label: 'Abholzeiten', value: '**Mo-Fr, 08:00-15:00 Uhr**' },
    ],
    contactLabel: 'Rückfragen',
  },
  status: {
    closeWindow: 'Sie können dieses Fenster nun schließen',
  },
} as const
