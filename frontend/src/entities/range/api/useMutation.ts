import { queryKeys } from "$/shared/api/query-keys";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rangesApi } from "./api";
import { CreateRangeForm, UpdateRangeForm } from "$/shared/api/schemas";
import { isQuotaError } from "$/shared/api/types";

export function useCreateRange() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateRangeForm) => rangesApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.ranges.all });
      qc.invalidateQueries({ queryKey: queryKeys.ranges.quota });
    },
    onError: error => {
      if (isQuotaError(error)) {
        // Caller can check error.response.data.upgradeRequired
        // and show upgrade modal
      }
    },
  });
}

export function useUpdateRange() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateRangeForm }) => rangesApi.update(id, body),
    onSuccess: updated => {
      // @ts-expect-error: Range type missing id property, will be updated in next PR
      qc.setQueryData(queryKeys.ranges.one(updated.id), updated);
      qc.invalidateQueries({ queryKey: queryKeys.ranges.all });
    },
  });
}

export function useDeleteRange() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rangesApi.remove(id),
    onSuccess: (_, deletedId) => {
      qc.setQueryData(
        queryKeys.ranges.all,
        // eslint-disable-next-line
        (old: any[]) => old?.filter(r => r.id !== deletedId) ?? []
      );
      qc.invalidateQueries({ queryKey: queryKeys.ranges.quota });
    },
  });
}
