export const fam = {
  title: 'FAM',
  instructions:
    'Nun wollen wir wissen, wie deine momentane Einstellung zu der beschriebenen Aufgabe ist. Dazu findest du auf dieser Seite Aussagen. Kreuze bitte jene Zahl an, die auf dich am Besten passt.',
  scale: {
    low: 'trifft nicht zu',
    high: 'trifft zu',
    values: ['1', '2', '3', '4', '5', '6', '7'],
    optionLabel: (question: string, value: string) => `${question}: ${value}`,
  },
  table: {
    questionColumn: 'Aussage',
  },
  questions: [
    {
      id: 'fam1',
      text: 'Ich mag solche Rätsel und Knobeleien.',
    },
    {
      id: 'fam2',
      text: 'Ich glaube, der Schwierigkeit dieser Aufgabe gewachsen zu sein.',
    },
    {
      id: 'fam3',
      text: 'Wahrscheinlich werde ich die Aufgabe nicht schaffen.',
    },
    {
      id: 'fam4',
      text: 'Bei der Aufgabe mag ich die Rolle des Wissenschaftlers, der Zusammenhänge entdeckt.',
    },
    {
      id: 'fam5',
      text: 'Ich fühle mich unter Druck, bei der Aufgabe gut abschneiden zu müssen.',
    },
    {
      id: 'fam6',
      text: 'Die Aufgabe ist eine richtige Herausforderung für mich.',
    },
    {
      id: 'fam7',
      text: 'Nach dem Lesen der Instruktion erscheint mir die Aufgabe sehr interessant.',
    },
    {
      id: 'fam8',
      text: 'Ich bin sehr gespannt darauf, wie gut ich hier abschneiden werde.',
    },
    {
      id: 'fam9',
      text: 'Ich fürchte mich ein wenig davor, dass ich mich hier blamieren könnte.',
    },
    {
      id: 'fam10',
      text: 'Ich bin fest entschlossen, mich bei dieser Aufgabe voll anzustrengen.',
    },
    {
      id: 'fam11',
      text: 'Bei Aufgaben wie dieser brauche ich keine Belohnung, sie machen mir auch so viel Spaß.',
    },
    {
      id: 'fam12',
      text: 'Es ist mir etwas peinlich, hier zu versagen.',
    },
    {
      id: 'fam13',
      text: 'Ich glaube, dass kann jeder schaffen.',
    },
    {
      id: 'fam14',
      text: 'Ich glaube, ich schaffe diese Aufgabe nicht.',
    },
    {
      id: 'fam15',
      text: 'Wenn ich die Aufgabe schaffe, werde ich schon ein wenig stolz auf meine Tüchtigkeit sein.',
    },
    {
      id: 'fam16',
      text: 'Wenn ich an die Aufgabe denke, bin ich etwas beunruhigt.',
    },
    {
      id: 'fam17',
      text: 'Eine solche Aufgabe würde ich auch in meiner Freizeit bearbeiten.',
    },
    {
      id: 'fam18',
      text: 'Die konkreten Leistungsanforderungen hier lähmen mich.',
    },
  ],
} as const

export type FamQuestionId = (typeof fam.questions)[number]['id']
