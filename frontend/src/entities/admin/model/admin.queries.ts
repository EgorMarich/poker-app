import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '$/shared/api/query-keys';
import { AdminStats, SubscriptionPlan, User } from '$/shared/api/schemas';
import { ApiResponse } from '$/shared/api/types';
import { api } from '$/shared/api/instance';

export const adminApi = {
  getStats: async (): Promise<AdminStats> => {
    const { data } = await api.get<ApiResponse<AdminStats>>('/admin/stats');
    return data.data;
  },

  getUsers: async (page = 1, limit = 20) => {
    const { data } = await api.get<
      ApiResponse<{
        users: User[];
        total: number;
        page: number;
        pages: number;
      }>
    >(`/admin/users?page=${page}&limit=${limit}`);
    return data.data;
  },

  setRole: async (userId: string, role: 'user' | 'admin') => {
    const { data } = await api.put(`/admin/users/${userId}/role`, { role });
    return data.data;
  },

  setPlan: async (userId: string, plan: SubscriptionPlan) => {
    const { data } = await api.put(`/admin/users/${userId}/plan`, { plan });
    return data.data;
  },

  setActive: async (userId: string, isActive: boolean) => {
    const { data } = await api.put(`/admin/users/${userId}/active`, { isActive });
    return data.data;
  },
};

export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: adminApi.getStats,
    staleTime: 60 * 1000,
  });
}

export function useAdminUsers(page = 1) {
  return useQuery({
    queryKey: queryKeys.admin.users(page),
    queryFn: () => adminApi.getUsers(page),
  });
}

export function useSetUserRole() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'user' | 'admin' }) =>
      adminApi.setRole(userId, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}

export function useSetUserPlan() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, plan }: { userId: string; plan: SubscriptionPlan }) =>
      adminApi.setPlan(userId, plan),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}

export function useSetUserActive() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: string; isActive: boolean }) =>
      adminApi.setActive(userId, isActive),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'users'] }),
  });
}
