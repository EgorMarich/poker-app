import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { trainingApi } from '../api/api'
import { isQuotaError } from '$/shared/api/types'

export const trainingKeys = {
  scenarios: (difficulty?: string) => ['training', 'scenarios', difficulty] as const,
  stats: ['training', 'stats'] as const,
}

export function useScenarios(difficulty?: string) {
  return useQuery({
    queryKey: trainingKeys.scenarios(difficulty),
    queryFn: () => trainingApi.getScenarios(difficulty),
  })
}

export function useTrainingStats() {
  return useQuery({
    queryKey: trainingKeys.stats,
    queryFn: trainingApi.getStats,
  })
}

export function useSubmitAttempt() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: trainingApi.submitAttempt,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: trainingKeys.stats })
    },
    onError: (error) => {
      if (isQuotaError(error)) {
        // показать модалку апгрейда
      }
    },
  })
}