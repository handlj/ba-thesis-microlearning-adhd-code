import axios from 'axios'
import { useRef, useState } from 'react'
import { postVoucherRequest } from '../services'

export type VoucherStatus = 'idle' | 'loading' | 'error' | 'alreadyIssued'

const HTTP_CONFLICT = 409

export function useVoucher(restoredCode: string | null | undefined) {
  const [voucherCode, setVoucherCode] = useState<string | null>(restoredCode ?? null)
  const [voucherStatus, setVoucherStatus] = useState<VoucherStatus>('idle')
  const requestLockRef = useRef(false)

  const requestVoucher = async (participantId: string) => {
    if (requestLockRef.current || voucherCode) return
    if (!participantId) {
      setVoucherStatus('error')
      return
    }

    requestLockRef.current = true
    setVoucherStatus('loading')

    try {
      const { code } = await postVoucherRequest(participantId)
      setVoucherCode(code)
      setVoucherStatus('idle')
    } catch (requestError) {
      const alreadyIssued =
        axios.isAxiosError(requestError) && requestError.response?.status === HTTP_CONFLICT
      if (!alreadyIssued) console.error('Voucher request failed:', requestError)
      setVoucherStatus(alreadyIssued ? 'alreadyIssued' : 'error')
    } finally {
      requestLockRef.current = false
    }
  }

  const resetVoucher = () => {
    setVoucherCode(null)
    setVoucherStatus('idle')
  }

  return { voucherCode, voucherStatus, requestVoucher, resetVoucher }
}
