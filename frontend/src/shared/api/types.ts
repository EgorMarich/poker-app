import { AxiosError } from 'axios';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface QuotaError {
  code: 'RANGE_LIMIT_EXCEEDED' | 'AI_QUOTA_EXCEEDED' | 'AI_MONTHLY_QUOTA_EXCEEDED';
  currentPlan: string;
  limit?: number;
  upgradeRequired: boolean;
}

export function isQuotaError(
  error: unknown
): error is AxiosError<{ message: string } & QuotaError> {
  if (error instanceof AxiosError && error.response?.status === 403) {
    return !!error.response.data?.upgradeRequired;
  }
  return false;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? error.message;
  }
  return 'Unknown error';
}
