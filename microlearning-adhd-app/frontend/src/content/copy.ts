export const copy = {
  actions: {
    back: 'Zurück',
    backToVideo: 'Zurück zum Video',
    completeStudy: 'Studie abschließen',
    continue: 'Weiter',
    nextVideo: 'Nächstes Video',
    proceed: 'Fortfahren',
    returnToStart: 'Zurück zum Start',
    returnToWelcome: 'Zurück zur Begrüßung',
    saving: 'Wird gespeichert...',
    startQuiz: 'Quiz starten',
    startStudy: 'Studie starten',
  },
  errors: {
    consentSave: 'Die Einwilligung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
    controlVideoLoad: 'Das Kontrollvideo konnte nicht geladen werden.',
    demographicsMissingSession:
      'Die Einwilligung wurde für diese Sitzung nicht gespeichert. Bitte kehren Sie zur Einwilligungsseite zurück und versuchen Sie es erneut.',
    demographicsSave: 'Die demografischen Angaben konnten nicht gespeichert werden. Bitte versuchen Sie es erneut.',
    experimentalVideosLoad: 'Die experimentellen Videos konnten nicht geladen werden.',
    interactionPersist: 'Das Interaktionsereignis konnte nicht gespeichert werden.',
    postInterventionMissingAnswers:
      'Bitte beantworten Sie alle Fragen, bevor Sie die Studie abschließen.',
    postInterventionMissingSession:
      'Sitzungsdaten der Studie fehlen. Bitte kehren Sie zur Startseite zurück und versuchen Sie es erneut.',
    postInterventionSave:
      'Der Post-Interventions-Fragebogen konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
  },
  validation: {
    demographicsAllQuestions: 'Bitte beantworten Sie alle Fragen, bevor Sie fortfahren.',
    demographicsAgeRange: 'Bitte geben Sie ein gültiges Alter zwischen 13 und 120 ein.',
    preInterventionAllQuestions:
      'Bitte beantworten Sie alle Aussagen, bevor Sie fortfahren.',
  },
  video: {
    unsupported: 'Ihr Browser unterstützt das Video-Element nicht.',
    watchFullVideo: 'Sehen Sie sich das vollständige Video an, bevor Sie fortfahren.',
  },
  welcome: {
    heading: {
      eyebrow: 'Microlearning-Studie',
      title: 'Willkommen, Teilnehmer:in.',
      intro:
        'Sie beginnen gleich eine kurze Studiensitzung. Nehmen Sie sich Zeit, lesen Sie sorgfältig und starten Sie, sobald Sie bereit sind.',
    },
    status: {
      noDataCollected: 'Es werden noch keine Daten erhoben.',
    },
  },
  consent: {
    heading: {
      eyebrow: 'Teilnehmer:inneninformation und Einwilligung',
      title: 'Bevor wir Daten erheben',
      intro:
        'Diese Studie untersucht, wie Lernende mit kurzen Microlearning-Materialien arbeiten. Bitte lesen Sie vor dem Start die folgenden Informationen.',
    },
    sections: [
      {
        title: 'Welche Daten wir erheben',
        items: [
          'Grundlegende demografische Angaben wie Altersbereich und Studienhintergrund.',
          'Antworten auf Studienfragen und Interaktionszeitpunkte.',
          'Technische Metadaten, die zur Sicherstellung der Datenqualität benötigt werden.',
        ],
      },
      {
        title: 'Wie Ihre Daten verarbeitet werden',
        items: [
          'Ihre Antworten werden ausschließlich für akademische Forschungszwecke verwendet.',
          'Die Daten werden sicher gespeichert und in aggregierter Form berichtet.',
          'Sie können die Teilnahme jederzeit vor der Übermittlung beenden.',
        ],
      },
    ],
    agreement:
      'Ich habe die obigen Informationen gelesen und stimme zu, mit den demografischen Fragen fortzufahren.',
  },
  demographics: {
    heading: {
      eyebrow: 'Demografischer Fragebogen',
      title: 'Bevor wir mit den Studienaufgaben beginnen',
      intro:
        'Bitte beantworten Sie die folgenden Fragen. Diese Antworten werden in dieser Pilotphase für die deterministische Gruppenzuordnung verwendet.',
    },
    questions: {
      age: {
        label: 'Alter',
        placeholder: 'Geben Sie Ihr Alter ein',
      },
      studyBackground: {
        label: 'Studienhintergrund',
        options: {
          computerScience: 'Informatik',
          stemOther: 'Andere MINT-Fachrichtung',
          nonStem: 'Nicht-MINT-Fachrichtung',
          notStudying: 'Derzeit nicht studierend',
        },
      },
      adhdDiagnosis: {
        label: 'ADHS-Diagnosestatus',
        options: {
          diagnosed: 'Diagnostiziert',
          notDiagnosed: 'Nicht diagnostiziert',
          preferNotToSay: 'Keine Angabe',
        },
      },
    },
  },
  preIntervention: {
    heading: {
      eyebrow: 'Fragebogen vor der Lernphase',
      title: 'Ihre Einschätzung vor der Aufgabe',
      intro:
        'Bitte beantworten Sie die folgenden Aussagen, bevor Sie mit der Vorbereitung auf die Lernphase fortfahren.',
    },
  },
  ready: {
    heading: {
      eyebrow: 'Vorbereitung auf die Lernphase',
      title: 'Bitte sehen Sie sich die Einführung an.',
      intro:
        'Im folgenden Video erhalten Sie die wichtigsten Hinweise zur Microlearning-Intervention. Nutzen Sie es auch, um die Videowiedergabe vorab zu testen.',
    },
    assignmentLabel: 'Zugeordnete Gruppe:',
    instructions: {
      title: 'Vor dem Start',
      items: [
        'Testen Sie bitte Ihre Lautsprecher oder Kopfhörer und stellen Sie eine angenehme Lautstärke ein.',
        'Starten Sie das Video und prüfen Sie, ob Bild und Ton ohne Probleme wiedergegeben werden.',
        'Klicken Sie erst auf Weiter, wenn Sie bereit sind, sich für etwa 20 Minuten möglichst ohne Unterbrechung zu konzentrieren.',
      ],
    },
    video: {
      title: 'Einführungsvideo zur Studie',
      description:
        'Sehen Sie sich das vollständige Video an. Danach wird die Schaltfläche zum Fortfahren freigeschaltet.',
    },
    status: {
      loading: 'Einführungsvideo wird vom Backend geladen...',
      loadError: 'Das Einführungsvideo konnte nicht geladen werden.',
      videoFinished: 'Das Video ist beendet. Sie können fortfahren, sobald Sie bereit sind.',
    },
    readinessNote:
      'Bitte fahren Sie nur fort, wenn Sie jetzt etwa 20 Minuten konzentriert und möglichst ohne Unterbrechung arbeiten können.',
    groupLabels: {
      control: 'Kontrollgruppe',
      experimental: 'Experimentalgruppe',
    },
  },
  controlGroup: {
    heading: {
      eyebrow: 'Kontrollgruppe',
      videoTitle: 'Sehen Sie sich das Referenzvideo an',
      quizTitle: 'Bearbeiten Sie das Quiz nach dem Video',
      videoIntro:
        'Sehen Sie sich das vollständig vom Backend bereitgestellte Video an, bevor Sie mit dem kurzen Beispielquiz fortfahren.',
      quizIntro:
        'Beantworten Sie beide Beispielfragen, um diesen vorläufigen Ablauf für die Kontrollgruppe abzuschließen.',
    },
    status: {
      loading: 'Kontrollvideo wird vom Backend geladen...',
      videoFinished: 'Das Video ist beendet. Sie können fortfahren.',
    },
    quiz: {
      questions: {
        mainTopic: {
          label: 'Worum ging es im Referenzvideo hauptsächlich?',
          options: {
            studyMaterial: 'Das im Video gezeigte Studienmaterial',
            demographics: 'Der demografische Fragebogen',
            technicalSetup: 'Browser- oder technische Einrichtungsanweisungen',
          },
        },
        perceivedClarity: {
          label: 'Wie verständlich war das Referenzvideo?',
          options: {
            clear: 'Verständlich',
            somewhatClear: 'Eher verständlich',
            notClear: 'Nicht verständlich',
          },
        },
      },
    },
  },
  experimentalGroup: {
    heading: {
      eyebrow: 'Experimentalgruppe',
      title: 'Bearbeiten Sie die Microlearning-Sequenz',
      intro:
        'Sehen Sie sich jedes Video vollständig an, beantworten Sie das kurze Beispielquiz und arbeiten Sie die vierteilige Sequenz durch.',
    },
    status: {
      answerSelected: 'Antwort ausgewählt. Sie können fortfahren.',
      loading: 'Experimentelle Videos werden vom Backend geladen...',
      noVideos: 'Es sind noch keine experimentellen Videos verfügbar.',
      selectAnswer: 'Wählen Sie eine Antwort aus, um fortzufahren.',
      videoFinished: 'Das Video ist beendet. Sie können das Quiz beantworten.',
    },
    progress: (current: number, total: number) => `Video ${current} von ${total}`,
    quiz: {
      kicker: 'Beispielquiz',
      question: 'Was sollten Sie in dieser Lektion bearbeiten?',
      options: [
        'Eine kurze Einführung in das Thema',
        'Eine lange schriftliche Aufgabe',
        'Eine Live-Gruppendiskussion',
      ],
    },
  },
  postIntervention: {
    heading: {
      eyebrow: 'Post-Interventions-Fragebogen',
      title: 'Teilen Sie uns Ihre Einschätzung zum Studienmaterial mit',
      intro: 'Bitte beantworten Sie diese kurzen Beispielfragen, bevor Sie die Studie abschließen.',
    },
    questions: {
      attentionSupport: {
        label: 'Das Studienmaterial hat mir geholfen, konzentriert zu bleiben.',
      },
      contentClarity: {
        label: 'Der Inhalt war leicht verständlich.',
      },
      workloadFit: {
        label: 'Der Arbeitsaufwand fühlte sich gut bewältigbar an.',
      },
      preferredFormat: {
        label: 'Welches Format würden Sie für zukünftiges Lernmaterial bevorzugen?',
        options: {
          singleVideo: 'Ein längeres Video',
          shortVideos: 'Mehrere kurze Videos',
          text: 'Schriftliches Material',
          mixed: 'Eine Mischung aus Formaten',
        },
      },
      openFeedback: {
        label: 'Gibt es etwas, das Sie an der Lernerfahrung verbessern würden?',
        placeholder: 'Teilen Sie einen kurzen Kommentar',
      },
    },
    agreementOptions: {
      stronglyAgree: 'Stimme voll zu',
      agree: 'Stimme zu',
      neutral: 'Neutral',
      disagree: 'Stimme nicht zu',
    },
  },
  thankYou: {
    heading: {
      eyebrow: 'Studie abgeschlossen',
      title: 'Vielen Dank für Ihre Teilnahme an der Studie.',
      intro:
        'Ihre Antworten wurden übermittelt. Wenn Sie Fragen zu dieser Studie haben, wenden Sie sich bitte an jan.handler@student.tugraz.at.',
    },
  },
} as const
