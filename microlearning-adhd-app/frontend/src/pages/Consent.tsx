import '../styles/Consent.css'

type ConsentProps = {
  agreed: boolean
  onAgreementChange: (agreed: boolean) => void
  onProceed: () => void
  onBack: () => void
}

function Consent({ agreed, onAgreementChange, onProceed, onBack }: ConsentProps) {
  return (
    <main className="study-page">
      <section className="study-card consent-card" aria-labelledby="consent-title">
        <p className="eyebrow">Participant information and consent</p>
        <h1 id="consent-title">Before we collect any data</h1>

        <div className="consent-content">
          <p>
            This study investigates how learners engage with short microlearning
            materials. Before starting, please review the information below.
          </p>

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

        <div className="study-actions">
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
        </div>
      </section>
    </main>
  )
}

export default Consent