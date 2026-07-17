import '../../../assets/styles/Consent.css'
import StudyActions from '../../components/StudyActions.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import { copy } from '../../content/copy.ts'

type ConsentProps = {
  agreed: boolean
  error: string | null
  isSubmitting: boolean
  onAgreementChange: (agreed: boolean) => void
  onProceed: () => void
  onBack: () => void
}

function Consent({
  agreed,
  error,
  isSubmitting,
  onAgreementChange,
  onProceed,
  onBack,
}: ConsentProps) {
  return (
    <StudyPage 
      ariaLabelledBy="consent-title" 
      cardClassName="consent-card"
    >

      <StudyHeading
        eyebrow={copy.consent.heading.eyebrow}
        title={copy.consent.heading.title}
        intro={copy.consent.heading.intro}
        id="consent-title"
      />

      {/* TODO: Refactor user-facing strings into a centralized location */}
      <div className="consent-content">

        <h1>Einverständniserklärung</h1>

        <p>
          Willkommen zur Studie „MicroPython“ vom Institut for Human-Centred Computing der TU Graz. Das Ziel der vorliegenden Studie ist es, zu untersuchen, wie Python-Grundlagen mit unterschiedlichen Lernmethoden erlernt werden können.
        </p>

        <h2>Studienablauf</h2>
        <p>
          Die Studie wird in etwa eine Stunde in Anspruch nehmen. Zu Beginn werden ein paar Fragebögen vorgegeben, anschließend werden Ihre Python-Vorkenntnisse in einem kurzen Quiz erhoben, dabei ist es kein Problem, wenn Sie keine der Fragen beantworten können. Danach wird die kurze Lerneinheit begonnen. Abschließend folgen ein weiteres Quiz und Fragebögen.
        </p>

        <h2>Datenschutz</h2>
        <p>
          Alle von Ihnen erfassten Daten werden in anonymisierter Form erhoben, weiterverarbeitet und gespeichert. Zu keiner Zeit ist ab diesem Zeitpunkt ein Rückschluss auf Ihre Person durch Dritte möglich. Die Daten werden gemäß den Bestimmungen der derzeit gültigen Datenschutzrichtlinien weiterverarbeitet. Wir bestätigen, dass das österreichische Datenschutzgesetz eingehalten wird. Eine Weitergabe der Daten erfolgt nur in anonymisierter Form. Auch für etwaige Publikationen werden nur die anonymisierten Daten verwendet
        </p>

        <h2>Rückfragen</h2>
        <p>
          Sie haben das Recht, die Untersuchung ohne die Angabe von Gründen und ohne Nachteile Ihrerseits zu jedem Zeitpunkt der Untersuchung abzubrechen. Bei Rückfragen können Sie jederzeit die Studienleitung kontaktieren: Dr. rer. nat. Lisa Berger; lisa.berger@tugraz.at
        </p>

        <h2>Einverständnis</h2>
        <p>
          Ich stimme zu, dass die im Rahmen dieser Studie erhobenen Daten in anonymisierter Form dokumentiert und in anonymisierter Form lokal gespeichert und in anonymisierter Form als Basis für Publikationen herangezogen und ggf. weitergegeben werden. Ich bestätige volljährig zu sein.
        </p>
      </div>

      <label  className="checkbox-row 
              consent-check">
        
        <input
          type="checkbox"
          checked={agreed}
          onChange={(event) => onAgreementChange(event.target.checked)}
        />
        
        <span>{copy.consent.agreement}</span>
      </label>

      {error ? 
      <p className="error-text">
        {error}
      </p>
       : null}

      <StudyActions>
        <button
          type="button"
          className="secondary-button"
          onClick={onBack}
          disabled={isSubmitting}
        >
          {copy.actions.back}
        </button>
        
        <button
          type="button"
          className="start-button"
          onClick={onProceed}
          disabled={!agreed || isSubmitting}
        >
          {isSubmitting ? copy.actions.saving : copy.actions.proceed}
        </button>
      </StudyActions>
    </StudyPage>
  )
}

export default Consent
