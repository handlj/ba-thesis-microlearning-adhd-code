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
      text: 'Ich war völlig in dieses Erlebnis vertieft.',
    },
    {
      id: 'ues2',
      text: 'Ich war so in dieses Erlebnis vertieft, dass ich das Zeitgefühl verlor.',
    },
    {
      id: 'ues3',
      text: 'Ich habe die Dinge um mich herum ausgeblendet, während ich die Anwendung nutzte.',
    },
    {
      id: 'ues4',
      text: 'Während ich die Anwendung nutzte, vergaß ich die Welt um mich herum.',
    },
    {
      id: 'ues5',
      text: 'Die Zeit, die ich mit der Anwendung verbrachte, verging wie im Flug.',
    },
    {
      id: 'ues6',
      text: 'Ich war von diesem Erlebnis gefesselt.',
    },
    {
      id: 'ues7',
      text: 'Während dieses Erlebnisses ließ ich mich völlig darauf ein.',
    },
    {
      id: 'ues8',
      text: 'Ich fühlte mich frustriert, während ich die Anwendung nutzte.',
    },
    {
      id: 'ues9',
      text: 'Ich fand die Nutzung der Anwendung verwirrend.',
    },
    {
      id: 'ues10',
      text: 'Ich fühlte mich genervt, während ich die Anwendung nutzte.',
    },
    {
      id: 'ues11',
      text: 'Ich fühlte mich entmutigt, während ich die Anwendung nutzte.',
    },
    {
      id: 'ues12',
      text: 'Die Nutzung der Anwendung war anstrengend.',
    },
    {
      id: 'ues13',
      text: 'Dieses Erlebnis war fordernd.',
    },
    {
      id: 'ues14',
      text: 'Ich fühlte mich beim Nutzen der Anwendung in Kontrolle.',
    },
    {
      id: 'ues15',
      text: 'Einige Dinge, die ich tun musste, konnte ich während der Nutzung der Anwendung nicht erledigen.',
    },
    {
      id: 'ues16',
      text: 'Die Anwendung war ansprechend.',
    },
    {
      id: 'ues17',
      text: 'Die Anwendung war ästhetisch ansprechend.',
    },
    {
      id: 'ues18',
      text: 'Mir gefielen die Grafiken und Bilder der Anwendung.',
    },
    {
      id: 'ues19',
      text: 'Die Anwendung sprach meine visuellen Sinne an.',
    },
    {
      id: 'ues20',
      text: 'Das Bildschirmlayout der Anwendung war optisch ansprechend.',
    },
    {
      id: 'ues21',
      text: 'Die Nutzung der Anwendung hat sich gelohnt.',
    },
    {
      id: 'ues22',
      text: 'Ich betrachte mein Erlebnis als Erfolg.',
    },
    {
      id: 'ues23',
      text: 'Dieses Erlebnis verlief nicht so, wie ich es geplant hatte.',
    },
    {
      id: 'ues24',
      text: 'Mein Erlebnis war lohnend.',
    },
    {
      id: 'ues25',
      text: 'Ich würde die Anwendung meiner Familie und meinen Freunden weiterempfehlen.',
    },
    {
      id: 'ues26',
      text: 'Ich habe die Anwendung aus Neugier weiter genutzt.',
    },
    {
      id: 'ues27',
      text: 'Der Inhalt der Anwendung weckte meine Neugier.',
    },
    {
      id: 'ues28',
      text: 'Ich wurde von diesem Erlebnis wirklich in den Bann gezogen.',
    },
    {
      id: 'ues29',
      text: 'Ich fühlte mich in dieses Erlebnis eingebunden.',
    },
    {
      id: 'ues30',
      text: 'Dieses Erlebnis hat Spaß gemacht.',
    },
  ],
} as const

export type UesQuestionId = (typeof ues.questions)[number]['id']
