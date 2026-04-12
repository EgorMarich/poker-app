import { useState } from 'react';
import { useRanges } from '$/entities/range/api/useQueries';
import { useAiAdvice } from '$/entities/ai/model/ai.queries';

const POSITIONS = ['UTG', 'UTG+1', 'UTG+2', 'MP', 'HJ', 'CO', 'BTN', 'SB', 'BB'];

export interface GtoFormData {
  playerHand: { suit: string; rank: string }[];
  boardCards: { suit: string; rank: string }[];
  position?: number;
  bank?: string;
  bid?: string;
  range?: string;
  info?: string;
}

export function useGtoHelper() {
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const { data: ranges } = useRanges();
  const { mutate: getAdvice, isPending } = useAiAdvice();

  const rangeItems =
    ranges?.map(r => ({
      id: r.id,
      label: r.name,
      value: r.id,
    })) ?? [];

  function buildPrompt(data: GtoFormData): string {
    const hand = data.playerHand.map(c => `${c.rank}${c.suit}`).join('');
    const board = data.boardCards.map(c => `${c.rank}${c.suit}`).join(' ');
    const position = data.position != null ? POSITIONS[data.position - 1] : null;

    const parts: string[] = [];
    if (hand) parts.push(`Рука: ${hand}`);
    if (board) parts.push(`Борд: ${board}`);
    if (position) parts.push(`Позиция: ${position}`);
    if (data.bank) parts.push(`Банк: ${data.bank} BB`);
    if (data.bid) parts.push(`Ставка: ${data.bid} BB`);
    if (data.info) parts.push(`Доп. инфо: ${data.info}`);
    parts.push('Что делать? Дай GTO совет.');

    return parts.join('\n');
  }

  function submit(data: GtoFormData) {
    setAiResponse(null);

    getAdvice(
      {
        prompt: buildPrompt(data),
        context: {
          hand: data.playerHand.map(c => `${c.rank}${c.suit}`).join(''),
          board: data.boardCards.map(c => `${c.rank}${c.suit}`).join(' ') || undefined,
          position: data.position != null ? POSITIONS[data.position - 1] : undefined,
          pot: data.bank ? parseFloat(data.bank) : undefined,
          rangeId: data.range || undefined,
        },
      },
      {
        onSuccess: res => setAiResponse(res.advice),
      }
    );
  }

  return { submit, isPending, aiResponse, rangeItems };
}
