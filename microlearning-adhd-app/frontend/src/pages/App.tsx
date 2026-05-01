import { useState } from 'react'
import '../styles/App.css'
import Consent from './Consent.tsx'

function App() {
  const [page, setPage] = useState<'welcome' | 'consent' | 'ready'>('welcome')
  const [agreed, setAgreed] = useState(false)

  if (page === 'consent') {
    return (
      <Consent
        agreed={agreed}
        onAgreementChange={setAgreed}
        onProceed={() => setPage('ready')}
        onBack={() => {
          setPage('welcome')
          setAgreed(false)
        }}
      />
    )
  }

  if (page === 'ready') {
    return (
      <main className="study-page">
        <section className="study-card" aria-labelledby="ready-title">
          <p className="eyebrow">Consent confirmed</p>
          <h1 id="ready-title">Thank you for agreeing.</h1>
          <p className="intro">
            You can now continue to the demographic questions and the study
            tasks.
          </p>
          <div className="study-actions">
            <button
              type="button"
              className="start-button"
              onClick={() => {
                setPage('welcome')
                setAgreed(false)
              }}
            >
              Return to welcome
            </button>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="study-page">
      <section className="study-card" aria-labelledby="study-title">
        <p className="eyebrow">Microlearning study</p>
        <h1 id="study-title">Welcome, participant.</h1>
        <p className="intro">
          You are about to begin a short study session. Take your time, read
          carefully, and start whenever you are ready.
        </p>

        <div className="study-actions">
          <button
            type="button"
            className="start-button"
            onClick={() => setPage('consent')}
          >
            Start study
          </button>
          <p className="status" aria-live="polite">
            No data is collected yet.
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
