
import { api } from '$/shared/api/instance'
import type { ApiResponse } from '$/shared/api/types'

export interface ReferralStats {
  promoCode: string
  total: number
  rewarded: number
  pending: number
}

export const referralApi = {
  getStats: async (): Promise<ReferralStats> => {
    const { data } = await api.get<ApiResponse<ReferralStats>>('/referral/stats')
    return data.data
  },
}