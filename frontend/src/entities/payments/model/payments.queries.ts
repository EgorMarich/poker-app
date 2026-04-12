
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '$/shared/api/query-keys'
import { Payment, Subscription, SubscriptionPlan } from '$/shared/api/schemas'
import { ApiResponse } from '$/shared/api/types'
import { api } from '$/shared/api/instance'

export const paymentsApi = {
  getSubscription: async (): Promise<Subscription> => {
    const { data } = await api.get<ApiResponse<Subscription>>('/payments/subscription')
    return data.data
  },

  createPayment: async (plan: SubscriptionPlan) => {
    const { data } = await api.post<ApiResponse<{
      paymentId: string
      confirmationUrl: string
      amount: string
      currency: string
      plan: string
      testMode?: boolean; 
    }>>('/payments/create', { plan })
    return data.data
  },

  getHistory: async (): Promise<Payment[]> => {
    const { data } = await api.get<ApiResponse<Payment[]>>('/payments/history')
    return data.data
  },

  cancelSubscription: async () => {
    const { data } = await api.delete<ApiResponse<{ message: string }>>('/payments/subscription')
    return data.data
  },
}


export function useSubscription() {
  return useQuery({
    queryKey: queryKeys.payments.subscription,
    queryFn: paymentsApi.getSubscription,
    staleTime: 5 * 60 * 1000,
  })
}

export function usePaymentHistory() {
  return useQuery({
    queryKey: queryKeys.payments.history,
    queryFn: paymentsApi.getHistory,
  })
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: (plan: SubscriptionPlan) => paymentsApi.createPayment(plan),
    onSuccess: ({ confirmationUrl }) => {
      // Redirect to YooKassa payment page
      window.location.href = confirmationUrl
    },
  })
}

export function useCancelSubscription() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: paymentsApi.cancelSubscription,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.payments.subscription })
      qc.invalidateQueries({ queryKey: queryKeys.profile })
    },
  })
}
