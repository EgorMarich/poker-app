import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { sessionsApi } from '../api/sessions.api'
import { CreateSessionForm, UpdateSessionForm } from '$/shared/api/schemas'
import { queryKeys } from '$/shared/api/query-keys'



export function useSessions() {
  return useQuery({
    queryKey: queryKeys.sessions.all,
    queryFn: sessionsApi.getAll,
    staleTime: 2 * 60 * 1000,
  })
}

export function useSession(id: string) {
  return useQuery({
    queryKey: queryKeys.sessions.one(id),
    queryFn: () => sessionsApi.getOne(id),
    enabled: !!id,
  })
}

export function useSessionStats() {
  return useQuery({
    queryKey: queryKeys.sessions.stats,
    queryFn: sessionsApi.getStats,
    staleTime: 5 * 60 * 1000,
  })
}


export function useCreateSession() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (body: CreateSessionForm) => sessionsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.sessions.all })
      qc.invalidateQueries({ queryKey: queryKeys.sessions.stats })
    },
  })
}

export function useUpdateSession() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateSessionForm }) =>
      sessionsApi.update(id, body),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.sessions.one(updated.id), updated)
      qc.invalidateQueries({ queryKey: queryKeys.sessions.all })
      qc.invalidateQueries({ queryKey: queryKeys.sessions.stats })
    },
  })
}

export function useFinishSession() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, cashOut, notes }: { id: string; cashOut: number; notes?: string }) =>
      sessionsApi.update(id, { cashOut, status: 'completed', generalNotes: notes }),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.sessions.one(updated.id), updated)
      qc.invalidateQueries({ queryKey: queryKeys.sessions.all })
      qc.invalidateQueries({ queryKey: queryKeys.sessions.stats })
    },
  })
}

export function useDeleteSession() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => sessionsApi.remove(id),
    onSuccess: (_, deletedId) => {
      // eslint-disable-next-line
      qc.setQueryData(queryKeys.sessions.all, (old: any[]) =>
        old?.filter((s) => s.id !== deletedId) ?? [],
      )
      qc.invalidateQueries({ queryKey: queryKeys.sessions.stats })
    },
  })
}
