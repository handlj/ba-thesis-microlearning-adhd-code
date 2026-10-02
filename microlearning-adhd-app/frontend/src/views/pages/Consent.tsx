import '@assets/styles/pages/Consent.css'
import { Fragment } from 'react'
import StudyActions from '../../components/StudyActions.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import { actionsCopy } from '@content/common/actions.ts'
import { consentCopy } from '@content/pages/consent.ts'
import Message from '../../components/Message.tsx'

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
    <StudyPage ariaLabelledBy="consent-title" variant="consent">
      <StudyHeading {...consentCopy.heading} id="consent-title" />

      <div className="consent__content">
        <h1>{consentCopy.document.title}</h1>

        <p>{consentCopy.document.intro}</p>

        {consentCopy.document.sections.map((section) => (
          <Fragment key={section.heading}>
            <h2>{section.heading}</h2>
            <p>{section.text}</p>
          </Fragment>
        ))}
      </div>

      <label className="consent__agreement">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(event) => onAgreementChange(event.target.checked)}
        />

        <span>{consentCopy.agreement}</span>
      </label>

      <Message variant="error">{error}</Message>

      <StudyActions>
        <button type="button" className="secondary-button" onClick={onBack} disabled={isSubmitting}>
          {actionsCopy.back}
        </button>

        <button
          type="button"
          className="primary-button"
          onClick={onProceed}
          disabled={!agreed || isSubmitting}
        >
          {isSubmitting ? actionsCopy.saving : consentCopy.actions.proceed}
        </button>
      </StudyActions>
    </StudyPage>
  )
}

export default Consent
