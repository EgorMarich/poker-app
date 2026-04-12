import { api } from '$/shared/api/instance'
import { AiAdviceRequest, AiQuota } from '$/shared/api/schemas'
import { ApiResponse } from '$/shared/api/types'



export interface AiAdviceResponse {
  advice: string
  tokensUsed: number
  quotaRemaining: { daily: number; monthly: number } | null
}

export const aiApi = {
  getAdvice: async (body: AiAdviceRequest): Promise<AiAdviceResponse> => {
    const { data } = await api.post<ApiResponse<AiAdviceResponse>>('/ai/advice', body)
    return data.data
  },

  getQuota: async (): Promise<AiQuota> => {
    const { data } = await api.get<ApiResponse<AiQuota>>('/ai/quota')
    return data.data
  },
}
