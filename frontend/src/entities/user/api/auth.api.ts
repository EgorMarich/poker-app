// import { api } from '$/shared/api/instance'
// import { AuthResponse, LoginForm, RegisterForm } from '$/shared/api/schemas'
// import { ApiResponse } from '$/shared/api/types'




// export const authApi = {
//   // Primary — Telegram Mini App
//   telegram: async (initData: string): Promise<AuthResponse> => {
//     const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/telegram', { initData })
//     return data.data
//   },

//   // Fallback — email/password (web version)
//   login: async (body: LoginForm): Promise<AuthResponse> => {
//     const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', body)
//     return data.data
//   },

//   register: async (body: RegisterForm): Promise<AuthResponse> => {
//     const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', body)
//     return data.data
//   },

//   profile: async () => {
//     const { data } = await api.get<ApiResponse<AuthResponse['user']>>('/auth/profile')
//     return data.data
//   },

//   updateProfile: async (body: { username?: string; avatarUrl?: string }) => {
//     const { data } = await api.put<ApiResponse<AuthResponse['user']>>('/auth/profile', body)
//     return data.data
//   },

//   changePassword: async (body: { currentPassword: string; newPassword: string }) => {
//     const { data } = await api.put<ApiResponse<{ message: string }>>('/auth/change-password', body)
//     return data.data
//   },
// }



import { api } from '$/shared/api/instance'
import { AuthResponse } from '$/shared/api/schemas'
import { ApiResponse } from '$/shared/api/types'

export const authApi = {
  telegram: async (initData: string): Promise<AuthResponse> => {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/telegram', { initData })
    return data.data
  },

  profile: async (): Promise<AuthResponse['user']> => {
    const { data } = await api.get<ApiResponse<AuthResponse['user']>>('/auth/profile')
    return data.data
  },
}