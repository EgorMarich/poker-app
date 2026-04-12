import { api } from '$/shared/api/instance'
import { CreateSessionForm, Session, SessionStats, UpdateSessionForm } from '$/shared/api/schemas'
import { ApiResponse } from '$/shared/api/types'


export const sessionsApi = {
  getAll: async (): Promise<Session[]> => {
    const { data } = await api.get<ApiResponse<Session[]>>('/sessions')
    return data.data
  },

  getOne: async (id: string): Promise<Session> => {
    const { data } = await api.get<ApiResponse<Session>>(`/sessions/${id}`)
    return data.data
  },

  getStats: async (): Promise<SessionStats> => {
    const { data } = await api.get<ApiResponse<SessionStats>>('/sessions/stats')
    return data.data
  },

  create: async (body: CreateSessionForm): Promise<Session> => {
    const { data } = await api.post<ApiResponse<Session>>('/sessions', body)
    return data.data
  },

  update: async (id: string, body: UpdateSessionForm): Promise<Session> => {
    const { data } = await api.put<ApiResponse<Session>>(`/sessions/${id}`, body)
    return data.data
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/sessions/${id}`)
  },
}
