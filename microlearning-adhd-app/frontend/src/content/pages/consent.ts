import { studyContact } from '../common/studyContact.ts'

export const consentCopy = {
  heading: {
    eyebrow: 'Teilnehmer*inneninformation und Einwilligung',
    title: '',
  },
  document: {
    title: 'Einverständniserklärung',
    intro:
      'Willkommen zur Studie „MicroPython“ vom Institute of Human-Centred Computing der TU Graz. Das Ziel der vorliegenden Studie ist es, zu untersuchen, wie Python-Grundlagen mit unterschiedlichen Lernmethoden erlernt werden können.',
    sections: [
      {
        heading: 'Studienablauf',
        text: 'Die Studie wird in etwa eine Stunde in Anspruch nehmen. Zu Beginn werden ein paar Fragebögen vorgegeben, anschließend werden Ihre Python-Vorkenntnisse in einem kurzen Quiz erhoben, dabei ist es kein Problem, wenn Sie keine der Fragen beantworten können. Danach wird die kurze Lerneinheit begonnen. Abschließend folgen ein weiteres Quiz und Fragebögen.',
      },
      {
        heading: 'Datenschutz',
        text: 'Alle von Ihnen erfassten Daten werden in anonymisierter Form erhoben, weiterverarbeitet und gespeichert. Zu keiner Zeit ist ab diesem Zeitpunkt ein Rückschluss auf Ihre Person durch Dritte möglich. Die Daten werden gemäß den Bestimmungen der derzeit gültigen Datenschutzrichtlinien weiterverarbeitet. Wir bestätigen, dass das österreichische Datenschutzgesetz eingehalten wird. Eine Weitergabe der Daten erfolgt nur in anonymisierter Form. Auch für etwaige Publikationen werden nur die anonymisierten Daten verwendet',
      },
      {
        heading: 'Rückfragen',
        text: `Sie haben das Recht, die Untersuchung ohne die Angabe von Gründen und ohne Nachteile Ihrerseits zu jedem Zeitpunkt der Untersuchung abzubrechen. Bei Rückfragen können Sie jederzeit die Studienleitung kontaktieren: ${studyContact.name}; ${studyContact.email}`,
      },
      {
        heading: 'Einverständnis',
        text: 'Ich stimme zu, dass die im Rahmen dieser Studie erhobenen Daten in anonymisierter Form dokumentiert und in anonymisierter Form lokal gespeichert und in anonymisierter Form als Basis für Publikationen herangezogen und ggf. weitergegeben werden. Ich bestätige volljährig zu sein.',
      },
    ],
  },
  agreement:
    'Ich habe die vorstehende Einverständniserklärung gelesen, verstanden und stimme ihr zu.',
  actions: {
    proceed: 'Fortfahren',
  },
  errors: {
    save: 'Die Einwilligung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
  },
} as const
