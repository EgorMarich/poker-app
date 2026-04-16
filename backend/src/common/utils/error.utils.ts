// src/common/utils/error.utils.ts
import { AxiosError } from 'axios';

export interface AppError {
  message: string;
  status?: number;
  data?: any;
  response?: {
    status?: number;
    data?: any;
  };
}

export function extractErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Unknown error occurred';
}

export function extractErrorDetails(error: unknown): AppError {

  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError;
    return {
      message: axiosError.message,
      status: axiosError.response?.status,
      data: axiosError.response?.data,
      response: {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
      },
    };
  }
  
  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }
  
  return {
    message: String(error),
  };
}