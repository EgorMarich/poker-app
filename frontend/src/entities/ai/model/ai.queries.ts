import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { aiApi } from '../api/api';

import { AiAdviceRequest } from '$/shared/api/schemas';
import { API_URL } from '$/shared/api/instance';
import { isQuotaError } from '$/shared/api/types';
import { queryKeys } from '$/shared/api/query-keys';

export function useAiQuota() {
  return useQuery({
    queryKey: queryKeys.ai.quota,
    queryFn: aiApi.getQuota,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

export function useAiAdvice() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: AiAdviceRequest) => aiApi.getAdvice(body),
    onSuccess: () => {
      // Refresh quota after each query
      qc.invalidateQueries({ queryKey: queryKeys.ai.quota });
    },
    onError: error => {
      if (isQuotaError(error)) {
        // Show upgrade modal — check error.response.data.upgradeRequired
      }
    },
  });
}

interface UseAiStreamOptions {
  onChunk?: (chunk: string) => void;
  onEnd?: (quotaRemaining: number | null) => void;
  onError?: (message: string) => void;
  onQuotaExceeded?: () => void;
}

export function useAiStream(options: UseAiStreamOptions = {}) {
  const socketRef = useRef<Socket | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [response, setResponse] = useState('');
  const qc = useQueryClient();

  const connect = () => {
    if (socketRef.current?.connected) return;

    const token = localStorage.getItem('access_token');
    socketRef.current = io(`${API_URL.replace('/api/v1', '')}/ai`, {
      auth: { token },
      transports: ['websocket'],
    });

    socketRef.current.on('stream-start', () => {
      setIsStreaming(true);
      setResponse('');
    });

    socketRef.current.on('stream-chunk', ({ content }: { content: string }) => {
      setResponse(prev => prev + content);
      options.onChunk?.(content);
    });

    socketRef.current.on('stream-end', ({ quotaRemaining }: { quotaRemaining: number }) => {
      setIsStreaming(false);
      options.onEnd?.(quotaRemaining);
      qc.invalidateQueries({ queryKey: queryKeys.ai.quota });
    });

    socketRef.current.on('stream-error', ({ message }: { message: string }) => {
      setIsStreaming(false);
      options.onError?.(message);
    });

    socketRef.current.on('quota-exceeded', () => {
      setIsStreaming(false);
      options.onQuotaExceeded?.();
      qc.invalidateQueries({ queryKey: queryKeys.ai.quota });
    });
  };

  const ask = useCallback(
    (body: AiAdviceRequest) => {
      connect();
      socketRef.current?.emit('stream-advice', body);
    },
    [connect]
  );

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
  }, []);

  return { ask, disconnect, isStreaming, response };
}
