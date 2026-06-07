export const adhdScreening = {
  title: '',
  heading: {
    eyebrow: '',
    title: 'Bitte füllen Sie den Fragebogen aus',
    intro:
      'Markieren Sie das Kästchen, das am besten beschreibt, wie Sie sich in den letzten 6 Monaten gefühlt und sich benommen haben.',
  },
  instructions: '',
  actions: {
    proceed: 'Fortfahren',
  },
  validation: {
    allQuestions: 'Bitte beantworten Sie alle Fragen, bevor Sie fortfahren.',
  },
  scale: {
    values: ['1', '2', '3', '4', '5'],
    labels: {
      '1': 'Niemals',
      '2': 'Selten',
      '3': 'Manchmal',
      '4': 'Oft',
      '5': 'Sehr oft',
    },
    optionLabel: (question: string, value: string, label: string) =>
      `${question}: ${value}, ${label}`,
  },
  table: {
    questionColumn: 'Frage',
  },
  questions: [
    {
      id: 'adhd1',
      text: 'Wie oft haben Sie Probleme, die letzten Feinheiten einer Arbeit zum Abschluss zu bringen, nachdem Sie die wesentlichen Punkte erledigt haben?',
    },
    {
      id: 'adhd2',
      text: 'Wie oft fällt es Ihnen schwer, Dinge in die Reihe zu bekommen, wenn Sie an einer Aufgabe arbeiten, bei der Organisation gefragt ist?',
    },
    {
      id: 'adhd3',
      text: 'Wie oft haben Sie Probleme, sich an Termine oder Verabredungen zu erinnern?',
    },
    {
      id: 'adhd4',
      text: 'Wie oft vermeiden Sie oder verzögern Sie, die Aufgabe zu beginnen, wenn Sie vor einer Aufgabe stehen, bei der sehr viel Denkvermögen gefragt ist?',
    },
    {
      id: 'adhd5',
      text: 'Wie oft sind Ihre Hände bzw. Füße bei langem Sitzen in Bewegung?',
    },
    {
      id: 'adhd6',
      text: 'Wie oft fühlen Sie sich übermäßig aktiv und verspüren den Drang Dinge zu tun, als ob Sie von einem Motor angetrieben würden?',
    },
  ],
} as const

export type AdhdScreeningQuestionId =
  (typeof adhdScreening.questions)[number]['id']
