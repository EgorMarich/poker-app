
import { api } from '$/shared/api/instance'
import { ApiResponse } from '$/shared/api/types'

export const trainingApi = {
  getScenarios: async (difficulty?: string) => {
    const params = difficulty ? `?difficulty=${difficulty}` : ''
    const { data } = await api.get<ApiResponse<any[]>>(`/training/scenarios${params}`)
    return data.data
  },

  getStats: async () => {
    const { data } = await api.get<ApiResponse<any>>('/training/stats')
    return data.data
  },

  submitAttempt: async (body: {
    scenarioId: string
    selectedOptionId: string
    timeSpentSec?: number
  }) => {
    const { data } = await api.post<ApiResponse<{
      isCorrect: boolean
      correctOptionId: string
      explanation: string
    }>>('/training/attempt', body)
    return data.data
  },
}