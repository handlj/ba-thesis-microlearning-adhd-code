import '../styles/Consent.css'
import StudyActions from '../components/StudyActions.tsx'
import StudyHeading from '../components/StudyHeading.tsx'
import StudyPage from '../components/StudyPage.tsx'
import { copy } from '../content/copy'

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
    <StudyPage ariaLabelledBy="consent-title" cardClassName="consent-card">
      <StudyHeading
        eyebrow={copy.consent.heading.eyebrow}
        title={copy.consent.heading.title}
        intro={copy.consent.heading.intro}
        id="consent-title"
      />

      <div className="consent-content">
        {copy.consent.sections.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <label className="checkbox-row consent-check">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(event) => onAgreementChange(event.target.checked)}
        />
        <span>{copy.consent.agreement}</span>
      </label>

      {error ? <p className="error-text">{error}</p> : null}

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
