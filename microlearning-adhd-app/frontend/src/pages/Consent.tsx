import '../styles/Consent.css'
import StudyActions from '../components/StudyActions.tsx'
import StudyHeading from '../components/StudyHeading.tsx'
import StudyPage from '../components/StudyPage.tsx'

type ConsentProps = {
  agreed: boolean
  onAgreementChange: (agreed: boolean) => void
  onProceed: () => void
  onBack: () => void
}

function Consent({ agreed, onAgreementChange, onProceed, onBack }: ConsentProps) {
  return (
    <StudyPage ariaLabelledBy="consent-title" cardClassName="consent-card">
      <StudyHeading
        eyebrow="Participant information and consent"
        title="Before we collect any data"
        intro="This study investigates how learners engage with short microlearning materials. Before starting, please review the information below."
        id="consent-title"
      />

      <div className="consent-content">
        <h2>What data we collect</h2>
        <ul>
          <li>Basic demographic answers such as age range and study background.</li>
          <li>Responses to study questions and interaction timings.</li>
          <li>Technical metadata needed to ensure data quality.</li>
        </ul>

        <h2>How your data is handled</h2>
        <ul>
          <li>Your responses are used for academic research purposes only.</li>
          <li>Data is stored securely and reported in aggregated form.</li>
          <li>You may stop participation at any time before submission.</li>
        </ul>
      </div>

      <label className="checkbox-row consent-check">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(event) => onAgreementChange(event.target.checked)}
        />
        <span>
          I have read the information above and agree to proceed to the
          demographic questions.
        </span>
      </label>

      <StudyActions>
        <button type="button" className="secondary-button" onClick={onBack}>
          Back
        </button>
        <button
          type="button"
          className="start-button"
          onClick={onProceed}
          disabled={!agreed}
        >
          Proceed
        </button>
      </StudyActions>
    </StudyPage>
  )
}

export default Consent