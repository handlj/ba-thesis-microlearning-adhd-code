
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
    questionnaireMissingSession:
      'Sitzungsdaten der Studie fehlen. Bitte kehren Sie zur Startseite zurück und versuchen Sie es erneut.',
    questionnaireSave:
      'Der Fragebogen konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
    quizSave:
      'Die Quiz-Antworten konnten nicht gespeichert werden. Bitte versuchen Sie es erneut.',
  },
  validation: {
    demographicsAllQuestions: 'Bitte beantworten Sie alle Fragen, bevor Sie fortfahren.',
    demographicsAgeRange: (minAge: number, maxAge: number) =>
      `Bitte geben Sie ein Alter zwischen ${minAge} und ${maxAge} Jahren an.`,
    preInterventionAllQuestions:
      'Bitte beantworten Sie alle Aussagen, bevor Sie fortfahren.',
  },
  video: {
    unsupported: 'Ihr Browser unterstützt das Video-Element nicht.',
    watchFullVideo: 'Sehen Sie sich das vollständige Video an, bevor Sie fortfahren.',
  },
  welcome: {
    heading: {
      eyebrow: 'MicroPython',
      title: 'Herzlich Willkommen!',
      intro:
        'Sie beginnen gleich eine kurze Studiensitzung. Nehmen Sie sich Zeit, lesen Sie alle Informationen sorgfältig und starten Sie, sobald Sie bereit sind.',
    },
    status: {
      noDataCollected: 'Ohne Ihr ausdrückliches Einverständnis werden keine Daten erhoben.',
    },
  },
  // TODO: Remove outdated consent content, source of truth is now in Consent.tsx. Consider moving the remaining content to a dedicated file for better maintainability.
  consent: {
    heading: {
      eyebrow: 'Teilnehmer*inneninformation und Einwilligung',
      title: '',
      intro:
        '',
    },
    sections: [
      {
        title: 'Welche Daten wir erheben',
        items: [
          'Grundlegende demografische Angaben wie Alter, Geschlecht und Studienhintergrund.',
          'Antworten auf Fragebögen und Interaktionszeitpunkte.',
          'Technische Metadaten, die zur Sicherstellung der Datenqualität benötigt werden.',
        ],
      },
      {
        title: 'Wie Ihre Daten verarbeitet werden',
        items: [
          'Ihre Antworten werden ausschließlich für akademische Forschungszwecke verwendet.',
          'Die Daten werden sicher gespeichert und in aggregierter Form berichtet.',
          'Sie können die Teilnahme jederzeit ohne Angabe von Gründen beenden.',
        ],
      },
      {
        title: 'Kontakt und weitere Informationen',
        items: [
          'Wenn Sie Fragen zur Studie oder zur Datenverarbeitung haben, kontaktieren Sie uns bitte unter jan.handler@student.tugraz.at.',
        ],
      }
    ],
    agreement:
      'Ich habe die vorstehende Einverständniserklärung gelesen, verstanden und stimme ihr zu.',
  },
  demographics: {
    heading: {
      eyebrow: '',
      title: 'Bevor wir loslegen',
      intro:
        'Bitte beantworten Sie die folgenden Fragen zu Ihrer Person. Alle Angaben werden anonymisiert verarbeitet und lassen keinerlei Rückschluss auf Sie zu.',
    },
    questions: {
      age: {
        label: 'Alter',
        placeholder: 'Geben Sie Ihr Alter ein',
      },
      gender: {
        label: 'Geschlecht',
        placeholder: 'Wählen Sie Ihr Geschlecht',
        options: {
          male: 'Männlich',
          female: 'Weiblich',
          other: 'Sonstiges',
          preferNotToSay: 'Keine Angabe',
        }
      },
      highestEducation: {
        label: 'Höchster Bildungsabschluss',
        placeholder: 'Wählen Sie Ihren höchsten Bildungsabschluss',
        options: {
          noneOrMandatory: 'Kein Abschluss oder Pflichtschulabschluss',
          highSchool: 'Matura/Abitur oder gleichwertig',
          bachelor: 'Bachelorabschluss',
          master: 'Masterabschluss',
          doctorate: 'Promotion',
          other: 'Anderer Abschluss',
          preferNotToSay: 'Keine Angabe',
        },
      },
      currentlyStudying: {
        label: 'Derzeit studierend',
        placeholder: 'Wählen Sie aus, ob Sie derzeit studieren',
        options: {
          yes: 'Ja',
          no: 'Nein',
        },
      },
      studyBackground: {
        label: 'Studienhintergrund',
        placeholder: 'Geben Sie Ihre aktuelle Studienrichtung an',
      },
      adhdDiagnosis: {
        label: 'ADHS-Diagnosestatus',
        placeholder: 'Wählen Sie Ihren aktuellen ADHS-Diagnosestatus',
        options: {
          diagnosed: 'Diagnostiziert',
          selfDiagnosed: 'Selbstdiagnostiziert',
          notDiagnosed: 'Nicht diagnostiziert',
          preferNotToSay: 'Keine Angabe',
        },
      },
      adhdOfficialDiagnosis: {
        label: 'Offizielle ADHS-Diagnose (Wenn diagnostiziert)',
        placeholder: 'Wählen Sie Ihre entsprechende Diagnose aus',
        options: {
          combined: 'Aufmerksamkeitsdefizit- und Hyperaktivitätsstörung, kombiniert (ICD-11 6A05.2)',
          inattentive: 'Aufmerksamkeitsdefizit- und Hyperaktivitätsstörung, vorwiegend unkonzentriert (ICD-11 6A05.0)',
          hyperactiveImpulsive: 'Aufmerksamkeitsdefizit- und Hyperaktivitätsstörung, vorwiegend hyperaktiv-impulsiv (ICD-11 6A05.1)',
          notSpecified: 'Nicht näher bezeichnet (ICD-11 6A05.Z)',
        }
      },
      adhdMedication: {
        label: 'ADHS-Medikamenteneinnahme',
        options: {
          yes: 'Ja',
          no: 'Nein',
          preferNotToSay: 'Keine Angabe',
        },
      },
    },
  },
  preIntervention: {
    heading: {
      eyebrow: '',
      title: 'Bitte füllen Sie den Fragebogen aus',
      intro:
        'Bevor wir starten, wollen wir wissen, wie deine momentane Einstellung zu der beschriebenen Aufgabe ist. Dazu findest du auf dieser Seite Aussagen. Kreuze bitte jene Zahl an, die auf dich am Besten passt.',
    },
  },
  ready: {
    heading: {
      eyebrow: '',
      title: 'Bitte sehen Sie sich das Einführungsvideo an.',
      intro:
        'Im folgenden Video erhalten Sie die wichtigsten Hinweise zur nachfolgenden Lerneinheit. Nutzen Sie es auch, um die Videowiedergabe vorab zu testen. Nachdem Sie das Video vollständig angesehen haben, wird die Schaltfläche zum Fortfahren freigeschaltet.',
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
      title: '',
      description:
        '',
    },
    status: {
      loading: 'Einführungsvideo wird vom geladen...',
      loadError: 'Das Einführungsvideo konnte nicht geladen werden.',
      videoFinished: 'Das Video ist beendet. Sie können fortfahren, sobald Sie bereit sind, sich für etwa 20 Minuten möglichst ohne Unterbrechung zu konzentrieren.',
    },
    readinessNote:
      '',
    groupLabels: {
      control: 'Kontrollgruppe',
      experimental: 'Experimentalgruppe',
    },
  },
  controlGroup: {
    heading: {
      eyebrow: '',
      videoTitle: 'Sehen Sie sich nun das Lernvideo an.',
      quizTitle: 'Bearbeiten Sie nun die folgenden Quizfragen',
      videoIntro:
        '',
      quizIntro:
        '',
    },
    status: {
      loading: 'Kontrollvideo wird geladen...',
      videoFinished: 'Das Video ist beendet. Sie können nun zum Quiz fortfahren.',
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
      title: 'Bearbeiten Sie die Videos und Quizfragen',
      intro:
        'Sehen Sie sich jedes Video vollständig an und bearbeiten Sie das nachfolgende Quiz, bevor Sie zum nächsten Video weitergehen.',
    },
    status: {
      allAnswered: 'Alle Fragen beantwortet. Sie können fortfahren.',
      answerAllQuestions: 'Bitte beantworten Sie alle Fragen, um fortzufahren.',
      loading: 'Experimentelle Videos werden vom Backend geladen...',
      noVideos: 'Es sind noch keine experimentellen Videos verfügbar.',
      videoFinished: 'Das Video ist beendet. Sie können nun zum Quiz fortfahren.',
    },
    progress: (current: number, total: number) => `Video ${current} von ${total}`,
    quiz: {
      kicker: '',
      question: 'Was sollten Sie in dieser Lektion lernen?',
      options: [
        'Eine kurze Einführung in das Thema',
        'Eine lange schriftliche Aufgabe',
        'Eine Live-Gruppendiskussion',
      ],
    },
  },
  postIntervention: {
    heading: {
      eyebrow: '',
      title: 'Teilen Sie uns Ihre Einschätzung mit',
      intro: 'Bitte beantworten Sie die folgenden Fragen, bevor Sie die Studie abschließen.',
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
        'Ihre Antworten wurden übermittelt. Sie können dieses Fenster nun schließen und die Studie beenden. Bei Rückfragen können Sie jederzeit die Studienleitung kontaktieren: Dr. rer. nat. Lisa Berger; lisa.berger@tugraz.at',
    },
  },
} as const
