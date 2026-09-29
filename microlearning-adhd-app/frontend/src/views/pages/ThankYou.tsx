import { useEffect, useRef, useState } from 'react'
import Message from '../../components/Message.tsx'
import StudyActions from '../../components/StudyActions.tsx'
import StudyFacts from '../../components/StudyFacts.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import { genericIcons } from '@assets/icons/genericIcons.tsx'
import { copy } from '../../content/copy.ts'
import { withEmphasis } from '../../utils/richText.tsx'
import type { VoucherStatus } from '../../shell/useVoucher.ts'

const COPIED_FEEDBACK_MS = 2000

type ThankYouProps = {
  voucherCode: string | null
  voucherStatus: VoucherStatus
  onRetryVoucher: () => void
  onReturnToStart: () => void
}

function ThankYou({ voucherCode, voucherStatus, onRetryVoucher, onReturnToStart }: ThankYouProps) {
  const { voucher } = copy.thankYou

  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLSpanElement>(null)
  const resetTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(resetTimer.current), [])

  const selectCode = () => {
    if (codeRef.current) window.getSelection()?.selectAllChildren(codeRef.current)
  }

  const copyCode = async () => {
    if (!voucherCode) return

    try {
      await navigator.clipboard.writeText(voucherCode)
    } catch {
      selectCode()
      return
    }

    setCopied(true)
    window.clearTimeout(resetTimer.current)
    resetTimer.current = window.setTimeout(() => setCopied(false), COPIED_FEEDBACK_MS)
  }

  return (
    <StudyPage ariaLabelledBy="thank-you-title" cardClassName="study-card--ready">
      <StudyHeading
        eyebrow={copy.thankYou.heading.eyebrow}
        title={copy.thankYou.heading.title}
        intro={copy.thankYou.heading.intro}
        id="thank-you-title"
      />

      <section className="voucher-card" aria-labelledby="voucher-title">
        <p id="voucher-title" className="voucher-card__label">
          <span className="voucher-card__label-icon" aria-hidden="true">
            {genericIcons.gift}
          </span>
          {voucher.label}
        </p>

        {voucherCode ? (
          <>
            <button
              type="button"
              className="voucher-card__code"
              onClick={copyCode}
              aria-label={`${voucherCode} – ${voucher.copyHint}`}
            >
              <span ref={codeRef}>{voucherCode}</span>

              <span className="voucher-card__code-icon" aria-hidden="true">
                {copied ? genericIcons.check : genericIcons.copy}
              </span>
            </button>

            <p className="voucher-card__hint" aria-live="polite">
              {copied ? voucher.copied : voucher.copyHint}
            </p>
          </>
        ) : voucherStatus === 'loading' ? (
          <Message variant="status">{voucher.loading}</Message>
        ) : voucherStatus === 'alreadyIssued' ? (
          <Message variant="error">{voucher.alreadyIssued}</Message>
        ) : (
          <>
            <Message variant="error">{voucher.loadError}</Message>

            <button type="button" className="start-button" onClick={onRetryVoucher}>
              {voucher.retry}
            </button>
          </>
        )}

        <p className="voucher-card__instructions">{voucher.instructions}</p>

        <p className="voucher-card__address">
          <span className="voucher-card__address-icon" aria-hidden="true">
            {genericIcons.pin}
          </span>
          <span>{withEmphasis(voucher.address)}</span>
        </p>
      </section>

      <StudyFacts facts={copy.thankYou.facts}>
        <div className="contact-card">
          <span className="contact-card__icon" aria-hidden="true">
            {genericIcons.mail}
          </span>

          <div className="contact-card__body">
            <p className="contact-card__label">{copy.thankYou.contact.label}</p>

            <p className="contact-card__name">{copy.thankYou.contact.name}</p>

            <a className="contact-card__link" href={`mailto:${copy.thankYou.contact.email}`}>
              {copy.thankYou.contact.email}
            </a>
          </div>
        </div>
      </StudyFacts>

      <StudyActions>
        <button type="button" className="start-button" onClick={onReturnToStart}>
          {copy.actions.returnToStart}
        </button>

        <p className="status status-note">
          <span className="status-note__icon" aria-hidden="true">
            {genericIcons.exit}
          </span>

          <span className="status-note__text">{copy.thankYou.status.closeWindow}</span>
        </p>
      </StudyActions>
    </StudyPage>
  )
}

export default ThankYou
