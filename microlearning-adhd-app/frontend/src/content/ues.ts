export const ues = {
  title: '',
  heading: {
    eyebrow: '',
    title: 'Bitte füllen Sie den Fragebogen aus',
    intro:
      'Bitte geben Sie an, wie sehr Sie jeder Aussage zustimmen oder sie ablehnen.',
  },
  instructions:
    '',
  actions: {
    proceed: 'Fortfahren',
  },
  validation: {
    allQuestions: 'Bitte beantworten Sie alle Aussagen, bevor Sie fortfahren.',
  },
  scale: {
    values: ['1', '2', '3', '4', '5'],
    labels: {
      '1': 'Stimme überhaupt nicht zu',
      '2': 'Stimme nicht zu',
      '3': 'Weder noch',
      '4': 'Stimme zu',
      '5': 'Stimme voll und ganz zu',
    },
    optionLabel: (question: string, value: string, label: string) =>
      `${question}: ${value}, ${label}`,
  },
  table: {
    questionColumn: 'Aussage',
  },
  questions: [
    {
      id: 'ues1',
      text: 'Ich habe mich bei dieser Anwendung vergessen.',
    },
    {
      id: 'ues2',
      text: 'Ich war so in die Anwendung vertieft, dass ich die Zeit vergessen habe.',
    },
    {
      id: 'ues3',
      text: 'Ich blendete alles um mich herum aus, als ich MicroPython verwendete.',
    },
    {
      id: 'ues4',
      text: 'Als ich MicroPython verwendete, vergaß ich alles um mich herum.',
    },
    {
      id: 'ues5',
      text: 'Die Zeit verging wie im Flug, als ich MicroPython anwendete.',
    },
    {
      id: 'ues6',
      text: 'Ich war gänzlich in die Anwendung vertieft.',
    },
    {
      id: 'ues7',
      text: 'Als ich MicroPython verwendete, konnte ich mich gehen lassen.',
    },
    {
      id: 'ues8',
      text: 'Ich war frustriert, während ich MicroPython nutzte.',
    },
    {
      id: 'ues9',
      text: 'Ich fand die Anwendung von MicroPython verwirrend.',
    },
    {
      id: 'ues10',
      text: 'Ich fühlte mich genervt während der Verwendung von MicroPython.',
    },
    {
      id: 'ues11',
      text: 'Ich fühlte mich entmutigt, während ich MicroPython nutzte.',
    },
    {
      id: 'ues12',
      text: 'Die Benutzung von MicroPython war anstrengend.',
    },
    {
      id: 'ues13',
      text: 'Diese Erfahrung war anspruchsvoll.',
    },
    {
      id: 'ues14',
      text: 'Ich hatte die Kontrolle über MicroPython.',
    },
    {
      id: 'ues15',
      text: 'Ich konnte nicht alle Anwendungen ausführen, die ich mit MicroPython ausführen wollte.',
    },
    {
      id: 'ues16',
      text: 'MicroPython war attraktiv.',
    },
    {
      id: 'ues17',
      text: 'MicroPython war ästhetisch ansprechend.',
    },
    {
      id: 'ues18',
      text: 'Mir gefielen die Grafiken und Bilder von MicroPython.',
    },
    {
      id: 'ues19',
      text: 'MicroPython spricht auf visuelle Sinne an.',
    },
    {
      id: 'ues20',
      text: 'Das Bildschirmlayout von MicroPython war optisch ansprechend.',
    },
    {
      id: 'ues21',
      text: 'Die Nutzung von MicroPython hat sich gelohnt.',
    },
    {
      id: 'ues22',
      text: 'Ich erachte meine Erfahrungen mit MicroPython als erfolgreich.',
    },
    {
      id: 'ues23',
      text: 'Die Erfahrung mit MicroPython hat nicht so funktioniert, wie ich es mir vorgestellt hatte.',
    },
    {
      id: 'ues24',
      text: 'Meine Erfahrung mit MicroPython hat sich gelohnt.',
    },
    {
      id: 'ues25',
      text: 'Ich würde MicroPython meiner Familie und meinen Freunden weiterempfehlen.',
    },
    {
      id: 'ues26',
      text: 'Aus Neugierde habe ich MicroPython weitergenutzt.',
    },
    {
      id: 'ues27',
      text: 'Der Inhalt von MicroPython hat meine Neugier geweckt.',
    },
    {
      id: 'ues28',
      text: 'Ich war wirklich von der Erfahrung mit MicroPython fasziniert.',
    },
    {
      id: 'ues29',
      text: 'Die Anwendung hat mich in ihren Bann gezogen.',
    },
    {
      id: 'ues30',
      text: 'Diese Erfahrung hat Spaß gemacht',
    },
  ],
} as const

export type UesQuestionId = (typeof ues.questions)[number]['id']
