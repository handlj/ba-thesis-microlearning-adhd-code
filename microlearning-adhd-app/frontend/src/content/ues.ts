export const ues = {
  title: 'User Engagement Scale',
  heading: {
    eyebrow: 'Post-intervention questionnaire',
    title: 'User Engagement Scale',
    intro:
      'Please answer the following statements before proceeding to the final questions.',
  },
  instructions:
    'Please indicate how much you agree or disagree with each statement.',
  actions: {
    proceed: 'Proceed',
  },
  validation: {
    allQuestions: 'Please answer all statements before proceeding.',
  },
  scale: {
    values: ['1', '2', '3', '4', '5'],
    labels: {
      '1': 'Strongly disagree',
      '2': 'Disagree',
      '3': 'Neither agree nor disagree',
      '4': 'Agree',
      '5': 'Strongly Agree',
    },
    optionLabel: (question: string, value: string, label: string) =>
      `${question}: ${value}, ${label}`,
  },
  table: {
    questionColumn: 'Statement',
  },
  questions: [
    {
      id: 'ues1',
      text: 'I lost myself in this experience.',
    },
    {
      id: 'ues2',
      text: 'I was so involved in this experience that I lost track of time.',
    },
    {
      id: 'ues3',
      text: 'I blocked out things around me when I was using Application X.',
    },
    {
      id: 'ues4',
      text: 'When I was using Application X, I lost track of the world around me.',
    },
    {
      id: 'ues5',
      text: 'The time I spent using Application X just slipped away.',
    },
    {
      id: 'ues6',
      text: 'I was absorbed in this experience.',
    },
    {
      id: 'ues7',
      text: 'During this experience I let myself go.',
    },
    {
      id: 'ues8',
      text: 'I felt frustrated while using this Application X.',
    },
    {
      id: 'ues9',
      text: 'I found this Application X confusing to use.',
    },
    {
      id: 'ues10',
      text: 'I felt annoyed while using Application X.',
    },
    {
      id: 'ues11',
      text: 'I felt discouraged while using this Application X.',
    },
    {
      id: 'ues12',
      text: 'Using this Application X was taxing',
    },
    {
      id: 'ues13',
      text: 'This experience was demanding.',
    },
    {
      id: 'ues14',
      text: 'I felt in control while using this Application X.',
    },
    {
      id: 'ues15',
      text: 'I could not do some of the things I needed to do while using Application X.',
    },
    {
      id: 'ues16',
      text: 'This Application X was attractive',
    },
    {
      id: 'ues17',
      text: 'This Application X was aesthetically appealing.',
    },
    {
      id: 'ues18',
      text: 'I liked the graphics and images of Application X.',
    },
    {
      id: 'ues19',
      text: 'Application X appealed to be visual senses.',
    },
    {
      id: 'ues20',
      text: 'The screen layout of Application X was visually pleasing.',
    },
    {
      id: 'ues21',
      text: 'Using Application X was worthwhile',
    },
    {
      id: 'ues22',
      text: 'I consider my experience a success.',
    },
    {
      id: 'ues23',
      text: 'This experience did not work out the way I had planned.',
    },
    {
      id: 'ues24',
      text: 'My experience was rewarding.',
    },
    {
      id: 'ues25',
      text: 'I would recommend Application X to my family and friends',
    },
    {
      id: 'ues26',
      text: 'I continued to use Application X out of curiosity.',
    },
    {
      id: 'ues27',
      text: 'The content of Application X incited my curiosity.',
    },
    {
      id: 'ues28',
      text: 'I was really drawn into this experience.',
    },
    {
      id: 'ues29',
      text: 'I felt involved in this experience.',
    },
    {
      id: 'ues30',
      text: 'This experience was fun.',
    },
  ],
} as const

export type UesQuestionId = (typeof ues.questions)[number]['id']
