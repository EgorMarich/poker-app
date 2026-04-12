import {  useSuspenseQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { authApi } from '../api/auth.api'
import { queryKeys } from '$/shared/api/query-keys'


export function useTelegramAuth() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (initData: string) => authApi.telegram(initData),
    onSuccess: ({ accessToken }) => {
      localStorage.setItem('access_token', accessToken)
      qc.invalidateQueries({ queryKey: queryKeys.profile })
    },
  })
}

export function useProfile() {
  return useSuspenseQuery({
    queryKey: queryKeys.profile,
    queryFn: async () => {
      const token = localStorage.getItem('access_token')
      if (!token) return null
      return authApi.profile()
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useLogout() {
  const qc = useQueryClient()

  return () => {
    localStorage.removeItem('access_token')
    qc.clear()
  }
}