import { useState } from 'react'
import './App.css'

function App() {
  const [started, setStarted] = useState(false)

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
            onClick={() => setStarted(true)}
          >
            Start study
          </button>
          <p className="status" aria-live="polite">
            {started ? 'The study is starting now.' : 'No data is collected yet.'}
          </p>
        </div>
      </section>
    </main>
  )
}

export default App
