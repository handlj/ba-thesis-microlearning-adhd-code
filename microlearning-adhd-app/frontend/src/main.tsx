import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './views/pages/App.tsx'

import { getConfig } from './services/index.ts'
import { setAppConfig } from './utils/config.ts'


async function bootstrap() {
  const root = createRoot(document.getElementById('root')!)
  try {
    setAppConfig(await getConfig());
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  }
  catch {
    root.render(<p>Die Anwendung konnte nicht geladen werden. Bitte laden Sie die Seite neu.</p>)
  }
}

bootstrap();
