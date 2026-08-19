export const copy = {
  actions: {
    back: 'Zurück',
    backToVideo: 'Zurück zum Video',
    completeStudy: 'Studie abschließen',
    continue: 'Weiter',
    nextVideo: 'Nächstes Video',
    proceed: 'Fortfahren',
    returnToStart: 'Zurück zum Start',
    retakeQuiz: 'Quiz erneut starten',
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
    demographicsSave:
      'Die demografischen Angaben konnten nicht gespeichert werden. Bitte versuchen Sie es erneut.',
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
    quizSave: 'Die Quiz-Antworten konnten nicht gespeichert werden. Bitte versuchen Sie es erneut.',
    timeout:
      'Die Anfrage konnte nicht abgeschlossen werden. Bitte überprüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.',
  },
  validation: {
    demographicsAllQuestions: 'Bitte beantworten Sie alle Fragen, bevor Sie fortfahren.',
    demographicsAgeRange: (minAge: number, maxAge: number) =>
      `Bitte geben Sie ein Alter zwischen ${minAge} und ${maxAge} Jahren an.`,
    preInterventionAllQuestions: 'Bitte beantworten Sie alle Aussagen, bevor Sie fortfahren.',
  },
  video: {
    unsupported: 'Ihr Browser unterstützt das Video-Element nicht.',
    watchFullVideo: 'Sehen Sie sich das vollständige Video an, bevor Sie fortfahren.',
    // Labels for the controls of the shared video player. Most are only ever
    // read out by screen readers or shown as tooltips.
    player: {
      region: 'Videoplayer',
      play: 'Abspielen',
      pause: 'Pausieren',
      replay: 'Erneut abspielen',
      seekSlider: 'Wiedergabeposition',
      elapsedOfTotal: (elapsed: string, total: string) => `${elapsed} von ${total}`,
      mute: 'Ton aus',
      unmute: 'Ton ein',
      volume: 'Lautstärke',
      enterFullscreen: 'Vollbild',
      exitFullscreen: 'Vollbild beenden',
      speed: 'Wiedergabegeschwindigkeit',
      speedOption: (rate: number) => `${rate.toString().replace('.', ',')}×`,
      normalSpeedSuffix: 'Normal',
      chapter: 'Kapitel',
      chapterOf: (title: string) => `Kapitel: ${title}`,
    },
  },
  welcome: {
    heading: {
      eyebrow: 'MicroPython',
      title: 'Herzlich Willkommen!',
      intro:
        'Sie beginnen gleich eine Studiensitzung zum Erlernen von Grundlagen in der Programmiersprache Python. Hier sehen Sie zusammengefasst, was Sie erwartet.',
    },
    facts: [
      {
        icon: 'clock',
        label: 'Dauer',
        value: 'Etwa 60 Minuten',
      },
      {
        icon: 'headphones',
        label: 'Notwendige Ausstattung',
        value: 'Lautsprecher oder Kopfhörer',
      },
    ],
    steps: {
      title: 'Ihr Ablauf',
      items: [
        'Einverständniserklärung und einige kurze Fragebögen.',
        'Ein kurzes Quiz zu Ihren Programmier-Vorkenntnissen. Vorwissen ist nicht nötig.',
        'Eine videogestützte Lerneinheit.',
        'Ein abschließendes Quiz und die letzten Fragebögen.',
      ],
    },
    status: {
      noDataCollected: 'Ohne Ihr Einverständnis werden keine Daten erhoben.',
    },
  },
  consent: {
    heading: {
      eyebrow: 'Teilnehmer*inneninformation und Einwilligung',
      title: '',
      intro: '',
    },
    agreement:
      'Ich habe die vorstehende Einverständniserklärung gelesen, verstanden und stimme ihr zu.',
  },
  demographics: {
    heading: {
      eyebrow: '',
      title: 'Bevor wir loslegen',
      intro:
        'Bitte beantworten Sie die folgenden Fragen zu Ihrer Person und Ihren Programmiervorkenntnissen.\n\n Alle Angaben werden anonymisiert verarbeitet und lassen keinerlei Rückschluss auf Sie zu.',
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
        },
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
        placeholder: 'Studieren Sie derzeit?',
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
          combined:
            'Aufmerksamkeitsdefizit- und Hyperaktivitätsstörung, kombiniert (ICD-11 6A05.2)',
          inattentive:
            'Aufmerksamkeitsdefizit- und Hyperaktivitätsstörung, vorwiegend unkonzentriert (ICD-11 6A05.0)',
          hyperactiveImpulsive:
            'Aufmerksamkeitsdefizit- und Hyperaktivitätsstörung, vorwiegend hyperaktiv-impulsiv (ICD-11 6A05.1)',
          notSpecified: 'Nicht näher bezeichnet (ICD-11 6A05.Z)',
        },
      },
      adhdMedication: {
        label: 'ADHS-Medikamenteneinnahme',
        options: {
          yes: 'Ja',
          no: 'Nein',
          preferNotToSay: 'Keine Angabe',
        },
      },
      device: {
        label: 'Verwendetes Gerät',
        placeholder: 'Wählen Sie Ihr Gerät aus',
        options: {
          desktop: 'Desktop-Computer ("Stand-PC")',
          laptop: 'Laptop',
          tablet: 'Tablet',
          smartphone: 'Smartphone',
          other: 'Anderes Gerät',
        },
      },
      generalProgrammingExperience: {
        label: 'Allgemeine Programmiererfahrung',
        placeholder: 'Haben Sie bereits Programmiererfahrung?',
        options: {
          yes: 'Ja',
          no: 'Nein',
        },
      },
      generalProgrammingLanguages: {
        label: 'Benutzte Programmiersprachen',
        placeholder: 'Welche Programmiersprachen haben Sie bereits verwendet?',
      },
      generalProgrammingAbility: {
        label: 'Allgemeine Programmierfähigkeit',
        placeholder: 'Wie würden Sie Ihre allgemeine Programmierfähigkeit einschätzen?',
        options: {
          beginner: 'Anfänger*in',
          intermediate: 'Fortgeschrittene*r',
          advanced: 'Expert*in',
        },
      },
      pythonProgrammingExperience: {
        label: 'Python-Programmiererfahrung',
        placeholder: 'Haben Sie bereits Erfahrung mit der Programmiersprache Python?',
        options: {
          yes: 'Ja',
          no: 'Nein',
        },
      },
      pythonProgrammingAbility: {
        label: 'Python-Programmierfähigkeit',
        placeholder: 'Wie würden Sie Ihre Python-Programmierfähigkeit einschätzen?',
        options: {
          beginner: 'Anfänger*in',
          intermediate: 'Fortgeschrittene*r',
          advanced: 'Expert*in',
        },
      },
    },
  },
  preIntervention: {
    heading: {
      eyebrow: '',
      title: 'Bitte füllen Sie den Fragebogen aus',
      intro:
        /* Original Instruction Text: 
          Bevor wir starten, wollen wir wissen, wie deine momentane Einstellung zu der beschriebenen Aufgabe ist. Dazu findest du auf dieser Seite  Aussagen. Kreuze bitte jene Zahl an, die auf dich am Besten passt.
        */
        'Bevor wir starten, wollen wir wissen, wie Ihre **momentane Einstellung** zu der beschriebenen Aufgabe ist. Dazu finden Sie auf dieser Seite Aussagen.\n\n Kreuzen Sie bitte jene Zahl an, die auf Sie am Besten passt.',
    },
  },
  ready: {
    heading: {
      eyebrow: 'Einführungsvideo',
      title: 'Bitte sehen Sie sich das Einführungsvideo an.',
      intro: '',
    },
    assignmentLabel: 'Zugeordnete Gruppe:',
    subgroupLabel: 'Zugeordnete Untergruppe:',
    facts: [
      {
        icon: 'play',
        label: 'Videoinhalt',
        value: 'Eine kurze Einführung in die Lerneinheit.',
      },
      {
        icon: 'headphones',
        label: 'Vorbereitung',
        value: 'Prüfen Sie die Audiowiedergabe.',
      },
    ],
    status: {
      loading: 'Einführungsvideo wird geladen...',
      loadError: 'Das Einführungsvideo konnte nicht geladen werden.',
      videoFinished: 'Das Video ist beendet. Sie können jetzt fortfahren.',
    },
    readinessNote:
      'Fahren Sie erst fort, wenn Sie sich für **mindestens 30 Minuten** ohne Unterbrechung konzentrieren können.',
    groupLabels: {
      control: 'Kontrollgruppe',
      experimental: 'Experimentalgruppe',
    },
    subgroupLabels: {
      control: 'Kontrollgruppe',
      standard: 'Standard-Player',
      'enhanced-player': 'Erweiterter Player',
    },
  },
  preQuiz: {
    heading: {
      eyebrow: '',
      title: 'Bitte beantworten Sie die folgenden Quizfragen.',
      intro:
        'Beantworten Sie bitte die folgenden Fragen so gut Sie können.\n\n Bei allen Fragen können **1 bis 4** Antwortalternativen korrekt sein. Wenn Sie sich nicht sicher sind, ist das kein Problem. Wählen Sie dann einfach die Antwortalternativen aus, die für Sie am meisten Sinn ergeben.\n\n Es wird von Ihnen kein Vorwissen erwartet. Bitte beantworten Sie **alle** Fragen, bevor Sie fortfahren.',
    },
  },
  controlGroup: {
    heading: {
      eyebrow: '',
      videoTitle: 'Sehen Sie sich nun das Lernvideo an.',
      quizTitle: 'Bearbeiten Sie nun die folgenden Quizfragen',
      videoIntro: '',
      quizIntro: '',
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
      eyebrow: '',
      title: 'Bearbeiten Sie die Videos und Quizfragen',
      intro:
        'Sehen Sie sich jedes Video vollständig an und bearbeiten Sie das nachfolgende Quiz, bevor Sie zum nächsten Video weitergehen.',
    },
    status: {
      allAnswered: 'Alle Fragen beantwortet. Sie können fortfahren.',
      answerAllQuestions: 'Bitte beantworten Sie alle Fragen, um fortzufahren.',
      loading: 'Experimentelle Videos werden vom Backend geladen...',
      noVideos: 'Es sind noch keine experimentellen Videos verfügbar.',
      rewatch: 'Sie können das Video erneut ansehen oder das Quiz sofort neu starten.',
      videoFinished: 'Das Video ist beendet. Sie können nun zum Quiz fortfahren.',
    },
    retry: {
      dialogTitle: 'Quiz erneut starten',
      attemptLabel: (current: number, total: number) => `Versuch ${current} von ${total}`,
      scoreCaption: 'Fragen richtig beantwortet',
      outOf: (total: number) => `von ${total}`,
      srScore: (correct: number, total: number) =>
        `Sie haben ${correct} von ${total} Fragen richtig beantwortet.`,
      thresholdLabel: (threshold: number, total: number) =>
        `Ziel: ${threshold} von ${total} richtig`,
      thresholdMarkerLabel: 'Bestehensgrenze',
      nextStepsTitle: 'Wie es weitergeht',
      nextSteps: [
        'Sehen Sie sich das Video noch einmal an. Es startet an einer passenden Stelle.',
        'Wenn Sie möchten können Sie das Quiz jederzeit erneut starten.',
      ],
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
      openFeedback: {
        label: 'Gibt es etwas, das Sie an der Lernerfahrung verbessern würden?',
        placeholder: 'Teilen Sie einen kurzen Kommentar',
      },
      wantsFeedback: {
        label: 'Möchten Sie eine Rückmeldung zu Ihren Ergebnissen in den Coding-Quizzen erhalten?',
        options: {
          yes: 'Ja',
          no: 'Nein',
        },
      },
    },
    agreementOptions: {
      stronglyAgree: 'Stimme voll zu',
      agree: 'Stimme zu',
      neutral: 'Neutral',
      disagree: 'Stimme nicht zu',
    },
  },
  quizFeedback: {
    heading: {
      eyebrow: 'Feedback zu Ihrer Quiz-leistung',
      title: 'Ergebnisse',
      intro: 'Hier sehen Sie eine kurze Rückmeldung zu Ihren Antworten in den Quizzes.',
    },
    beforeLabel: 'Vorher',
    afterLabelControl: 'Nachher',
    afterLabelExperimental: 'Nachher (Über alle Videos)',
    scoreCaption: 'Fragen richtig beantwortet',
    outOf: (total: number) => `von ${total}`,
    improvementLabel: 'Verbesserung gegenüber dem Vortest',
    srScore: (label: string, correct: number, total: number) =>
      `${label}: ${correct} von ${total} Fragen richtig beantwortet.`,
  },
  thankYou: {
    heading: {
      eyebrow: 'Studie abgeschlossen',
      title: 'Vielen Dank für Ihre Teilnahme.',
      intro:
        'Ihr Beitrag hilft uns zu verstehen, wie Lernerfahrungen in Zukunft besser gestaltet werden können.',
    },
    facts: [
      {
        icon: 'check',
        label: 'Ihre Antworten',
        value: 'Übermittelt und anonymisiert gespeichert',
      },
      {
        icon: 'exit',
        label: 'Nächster Schritt',
        value: 'Sie können dieses Fenster nun schließen',
      },
    ],
    contact: {
      label: 'Rückfragen zur Studie',
      name: 'Dr. rer. nat. Lisa Berger',
      email: 'lisa.berger@tugraz.at',
    },
  },
} as const
