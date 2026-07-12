export const adhdScreening = {
  title: '',
  heading: {
    eyebrow: '',
    title: 'Bitte füllen Sie den Fragebogen aus',
    intro:
      'Bitte beantworten Sie die nachstehenden Fragen, indem Sie sich nach jedem angegebenen Kriterium anhand der Skala rechts auf der Seite bewerten. Kreuzen Sie als Antwort auf jede Frage das Kästchen an, das am besten beschreibt, wie Sie sich in den letzten 6 Monaten gefühlt und verhalten haben.',
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
    {
      id: 'adhd7',
      text: 'Wie oft machen Sie Flüchtigkeitsfehler, wenn Sie an einem langweiligen oder schwierigen Projekt arbeiten müssen?',
    },
    {
      id: 'adhd8',
      text: 'Wie oft haben Sie Schwierigkeiten, aufmerksam zu bleiben, wenn Sie langweilige oder sich wiederholende Arbeiten verrichten?',
    },
    {
      id: 'adhd9',
      text: 'Wie oft haben Sie Schwierigkeiten, sich auf das, was man Ihnen sagt, zu konzentrieren, selbst wenn man Sie direkt anspricht?',
    },
    {
      id: 'adhd10',
      text: 'Wie oft verlegen Sie Dinge zuhause oder bei der Arbeit bzw. haben Schwierigkeiten, sie zu finden?',
    },
    {
      id: 'adhd11',
      text: 'Wie oft lassen Sie sich durch Aktivitäten oder Geräusche in Ihrer Umgebung ablenken?',
    },
    {
      id: 'adhd12',
      text: 'Wie oft verlassen Sie Ihren Platz bei Besprechungen oder in anderen Situationen, wo von Ihnen erwartet wird, dass Sie sitzen bleiben?',
    },
    {
      id: 'adhd13',
      text: 'Wie oft sind Sie unruhig oder zappelig?',
    },
    {
      id: 'adhd14',
      text: 'Wie oft haben Sie Schwierigkeiten, abzuschalten und sich zu entspannen, wenn Sie Zeit für sich haben?',
    },
    {
      id: 'adhd15',
      text: 'Wie oft passiert es Ihnen, dass Sie in geselligen Situationen zu viel reden?',
    },
    {
      id: 'adhd16',
      text: 'Wie oft kommt es in einer Unterhaltung vor, dass Sie die Sätze Ihrer Gesprächspartner beenden, bevor diese sie selbst beenden können?',
    },
    {
      id: 'adhd17',
      text: 'Wie oft haben Sie Schwierigkeiten zu warten, bis Sie an der Reihe sind?',
    },
    {
      id: 'adhd18',
      text: 'Wie häufig unterbrechen Sie andere Leute, wenn diese arbeiten oder mit anderen Dingen beschäftigt sind?',
    },
  ],
} as const

export type AdhdScreeningQuestionId =
  (typeof adhdScreening.questions)[number]['id']
