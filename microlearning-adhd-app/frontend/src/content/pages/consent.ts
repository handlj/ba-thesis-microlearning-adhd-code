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
        heading: '',
        text: '\nFür die Auszahlung und Dokumentation der Aufwandsentschädigung ist es erforderlich, bestimmte personenbezogene Daten zu erheben.\n Diese Angaben werden ausschließlich zum Zweck der Abwicklung und Dokumentation der Auszahlung verarbeitet und getrennt von den im Rahmen der Studie erhobenen Forschungsdaten aufbewahrt. Eine Verknüpfung mit den individuellen Studienergebnissen erfolgt nicht.\n\n Bei Beschwerden kann auch anonym eine Nachricht an die TU Graz abgegeben werden:\n https://www.tugraz.at/en/about-this-page/electronic-mailbox-for-anonymous-tips-whistleblowing',
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
  agreement: {
    text: 'Ich habe die vorstehende Einverständniserklärung gelesen, verstanden und stimme ihr zu.',
    ai: 'Ich bestätige die Aufgaben eigenständig und ohne Hilfe von KI-Tools zu erledigen.',
  },
  actions: {
    proceed: 'Fortfahren',
  },
  errors: {
    save: 'Die Einwilligung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
  },
} as const
