import '@assets/styles/pages/ThankYou.css'
import { useEffect, useRef, useState } from 'react'
import Message from '../../components/Message.tsx'
import StudyActions from '../../components/StudyActions.tsx'
import StudyHeading from '../../components/StudyHeading.tsx'
import StudyPage from '../../components/StudyPage.tsx'
import { genericIcons } from '@assets/icons/genericIcons.tsx'
import { studyContact } from '@content/common/studyContact.ts'
import { thankYouCopy } from '@content/pages/thankYou.ts'
import { withEmphasis } from '../../utils/richText.tsx'
import type { VoucherStatus } from '../../shell/useVoucher.ts'

const COPIED_FEEDBACK_MS = 2000

type CopyState = 'idle' | 'copied' | 'failed'

type ThankYouProps = {
  voucherCode: string | null
  voucherStatus: VoucherStatus
  onRequestVoucher: () => void
}

function ThankYou({ voucherCode, voucherStatus, onRequestVoucher }: ThankYouProps) {
  const { voucher, pickup } = thankYouCopy
  const copyHints = { idle: voucher.copyHint, copied: voucher.copied, failed: voucher.copyFailed }

  const [copyState, setCopyState] = useState<CopyState>('idle')
  const codeRef = useRef<HTMLSpanElement>(null)
  const resetTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(resetTimer.current), [])

  useEffect(() => {
    if (!voucherCode && voucherStatus === 'idle') onRequestVoucher()
  }, [voucherCode, voucherStatus, onRequestVoucher])

  const selectCode = () => {
    if (codeRef.current) window.getSelection()?.selectAllChildren(codeRef.current)
  }

  const copyCode = async () => {
    if (!voucherCode) return

    window.clearTimeout(resetTimer.current)

    try {
      await navigator.clipboard.writeText(voucherCode)
    } catch {
      selectCode()
      setCopyState('failed')
      return
    }

    setCopyState('copied')
    resetTimer.current = window.setTimeout(() => setCopyState('idle'), COPIED_FEEDBACK_MS)
  }

  return (
    <StudyPage variant="ready">
      <StudyHeading {...thankYouCopy.heading} />

      <section className="voucher-card">
        <p className="caps-label caps-label--blue voucher-card__label">
          <span className="icon-badge icon-badge--blue">{genericIcons.gift}</span>
          {voucher.label}
        </p>

        {voucherCode ? (
          <>
            <button type="button" className="voucher-card__code" onClick={copyCode}>
              <span ref={codeRef}>{voucherCode}</span>

              <span className="voucher-card__code-icon">
                {copyState === 'copied' ? genericIcons.check : genericIcons.copy}
              </span>
            </button>

            <p className="voucher-card__hint">{copyHints[copyState]}</p>

            <p className="voucher-card__instructions">{voucher.instructions}</p>
          </>
        ) : voucherStatus === 'error' ? (
          <>
            <Message variant="error">{voucher.loadError}</Message>

            <button type="button" className="primary-button" onClick={onRequestVoucher}>
              {voucher.retry}
            </button>
          </>
        ) : voucherStatus === 'alreadyIssued' ? (
          <Message variant="error">{voucher.alreadyIssued}</Message>
        ) : (
          <Message variant="status">{voucher.loading}</Message>
        )}
      </section>

      <div className="pickup">
        {pickup.rows.map((row) => (
          <div key={row.label} className="pickup__row">
            <p className="pickup__label">{row.label}</p>

            <p className="pickup__value">{withEmphasis(row.value)}</p>
          </div>
        ))}

        <div className="pickup__row">
          <p className="pickup__label">{pickup.contactLabel}</p>

          <p className="pickup__value">
            <a className="pickup__link" href={`mailto:${studyContact.email}`}>
              {studyContact.email}
            </a>
          </p>
        </div>
      </div>

      <StudyActions>
        <p className="status-note">
          <span className="status-note__icon">{genericIcons.exit}</span>

          <span className="status-note__text">{thankYouCopy.status.closeWindow}</span>
        </p>
      </StudyActions>
    </StudyPage>
  )
}

export default ThankYou
