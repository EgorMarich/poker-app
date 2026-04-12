import { api } from '$/shared/api/instance';
import { CreateRangeForm, RangeQuota, UpdateRangeForm } from '$/shared/api/schemas';
import { ApiResponse } from '$/shared/api/types';

interface MatrixCell {
  color: string;
  selected: boolean;
}

interface MatrixData {
  [handNotation: string]: MatrixCell;
}

interface Range {
  id: number;
  name: string;
  description: string;
  position: string;
  matrix: MatrixData;
  actionType: string;
}

export const rangesApi = {
  getAll: async (): Promise<Range[]> => {
    const { data } = await api.get<ApiResponse<Range[]>>('/ranges');
    return data.data;
  },

  getOne: async (id: string): Promise<Range> => {
    const { data } = await api.get<ApiResponse<Range>>(`/ranges/${id}`);
    return data.data;
  },

  getQuota: async (): Promise<RangeQuota> => {
    const { data } = await api.get<ApiResponse<RangeQuota>>('/ranges/quota');
    return data.data;
  },

  create: async (body: CreateRangeForm): Promise<Range> => {
    const { data } = await api.post<ApiResponse<Range>>('/ranges', body);
    return data.data;
  },

  update: async (id: string, body: UpdateRangeForm): Promise<Range> => {
    const { data } = await api.put<ApiResponse<Range>>(`/ranges/${id}`, body);
    return data.data;
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/ranges/${id}`);
  },
};
