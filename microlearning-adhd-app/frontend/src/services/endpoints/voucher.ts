import api from '../client'

import type { VoucherIssue } from '../types/voucher'

export async function postVoucherRequest(participantId: string) {
  const response = await api.post<VoucherIssue>(`/participants/${participantId}/voucher`)
  return response.data
}
