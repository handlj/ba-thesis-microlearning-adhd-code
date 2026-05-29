export const panas = {
  title: 'PANAS',
  heading: {
    eyebrow: 'Fragebogen zum aktuellen Befinden',
    title: 'PANAS',
    intro:
      'Bitte beantworten Sie diese Aussagen zu Ihrem aktuellen Befinden, bevor Sie fortfahren.',
  },
  instructions:
    'Nun möchten wir gerne von Ihnen wissen, wie Sie sich fühlen. Die folgenden Wörter beschreiben unterschiedliche Gefühle und Empfindungen. Lesen Sie jedes Wort und tragen Sie dann in die Skala neben jedem Wort die Intensität ein. Sie haben die Möglichkeit, zwischen fünf Abstufungen zu wählen. Geben Sie bitte an, wie Sie sich im Moment fühlen.',
  actions: {
    proceed: 'Fortfahren',
  },
  validation: {
    allQuestions: 'Bitte beantworten Sie alle Wörter, bevor Sie fortfahren.',
  },
  scale: {
    values: ['1', '2', '3', '4', '5'],
    labels: {
      '1': 'gar nicht',
      '2': 'ein bisschen',
      '3': 'einigermaßen',
      '4': 'erheblich',
      '5': 'äußerst',
    },
    optionLabel: (question: string, value: string, label: string) =>
      `${question}: ${value}, ${label}`,
  },
  table: {
    questionColumn: 'Wort',
  },
  questions: [
    {
      id: 'panas1',
      text: 'aktiv',
    },
    {
      id: 'panas2',
      text: 'bekümmert',
    },
    {
      id: 'panas3',
      text: 'interessiert',
    },
    {
      id: 'panas4',
      text: 'freudig erregt',
    },
    {
      id: 'panas5',
      text: 'verärgert',
    },
    {
      id: 'panas6',
      text: 'stark',
    },
    {
      id: 'panas7',
      text: 'schuldig',
    },
    {
      id: 'panas8',
      text: 'erschrocken',
    },
    {
      id: 'panas9',
      text: 'feindselig',
    },
    {
      id: 'panas10',
      text: 'angeregt',
    },
    {
      id: 'panas11',
      text: 'stolz',
    },
    {
      id: 'panas12',
      text: 'gereizt',
    },
    {
      id: 'panas13',
      text: 'begeistert',
    },
    {
      id: 'panas14',
      text: 'beschämt',
    },
    {
      id: 'panas15',
      text: 'wach',
    },
    {
      id: 'panas16',
      text: 'nervös',
    },
    {
      id: 'panas17',
      text: 'entschlossen',
    },
    {
      id: 'panas18',
      text: 'aufmerksam',
    },
    {
      id: 'panas19',
      text: 'durcheinander',
    },
    {
      id: 'panas20',
      text: 'ängstlich',
    },
  ],
} as const

export type PanasQuestionId = (typeof panas.questions)[number]['id']
