import { queryKeys } from '$/shared/api/query-keys';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { rangesApi } from './api';

export function useRanges() {
  return useQuery({
    queryKey: queryKeys.ranges.all,
    queryFn: rangesApi.getAll,
    staleTime: 2 * 60 * 1000,
    retry: false,
  });
}

export const useGetAllRanges = queryOptions({
  queryKey: queryKeys.ranges.all,
  queryFn: rangesApi.getAll,
  staleTime: 10 * 60 * 1000,
  
});

export function useRange(id: string | null) {
  return useQuery({
    queryKey: queryKeys.ranges.one(id || ''),
    queryFn: () => rangesApi.getOne(id!),
    enabled: !!id, // Запрос выполнится ТОЛЬКО если есть id
  });
}
export function useRangesQuota() {
  return useQuery({
    queryKey: queryKeys.ranges.quota,
    queryFn: rangesApi.getQuota,
    staleTime: 60 * 1000,
  });
}
