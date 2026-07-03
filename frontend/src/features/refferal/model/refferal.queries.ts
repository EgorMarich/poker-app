import { useQuery } from '@tanstack/react-query'
import { referralApi } from '../api/refferal.api'

export function useReferralStats() {
  return useQuery({
    queryKey: ['referral', 'stats'],
    queryFn: referralApi.getStats,
    staleTime: 5 * 60 * 1000,
  })
}