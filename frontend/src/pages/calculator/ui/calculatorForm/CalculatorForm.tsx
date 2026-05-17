import { Controller, useForm } from 'react-hook-form';
import { Hand, SelectedCards } from '$/features/hand/Hand';
import s from './CalculatorForm.module.scss';
import { useState } from 'react';
import { calculateEquity } from '../../lib/calculateEquity';
import { mapUICards } from '../../lib/adapters';
import { PrimaryButton } from '$/shared/ui/buttons/primaryButtons/PrimaryButtons';
import { ResultSection } from '../resultSection/ResultSection';
import { ResetButton } from '$/shared/ui/buttons/tertiaryButtons/ResetButton';
import { useQuery } from '@tanstack/react-query';
import { useGetAllRanges } from '$/entities/range/api/useQueries';
import { useTranslation } from 'react-i18next';
import { OpponentsSection } from '../OpponentSection/OpponentSection';

interface CalculatorFormData {
  playerHand: SelectedCards;
  boardCards: SelectedCards;
  players?: number;
}

export const CalculatorForm = () => {
  const { t } = useTranslation();

  const { control, handleSubmit, watch } = useForm<CalculatorFormData>({
    defaultValues: {
      playerHand: [],
      boardCards: [],
      players: 2,
    },
  });

  const { data: ranges = [] } = useQuery(useGetAllRanges);

  const [equityResult, setEquityResult] = useState<number | null>(0.0);
  const [opponentRanges, setOpponentRanges] = useState<(string | null)[]>([])

  function handleRangeSelect(index: number, rangeId: string | null) {
    setOpponentRanges(prev => {
      const next = [...prev]
      next[index] = rangeId
      return next
    })
  }

  function handleCountChange(count: number) {
    setOpponentRanges(prev => prev.slice(0, count - 1))
  }

  const playerHand = watch('playerHand');
  const boardCards = watch('boardCards');

  const onSubmit = (formData: CalculatorFormData) => {
    const heroCards = mapUICards(formData.playerHand)
    const mappedBoard = mapUICards(formData.boardCards)

    const opponents = Array.from({ length: formData.players && formData.players - 1 || 0 }, (_, i) => {
      const rangeId = opponentRanges[i] ?? null
      const selectedRange = ranges.find(r => r.id === Number(rangeId))
      return selectedRange ? { range: selectedRange.matrix } : {}
    })

    const equity = calculateEquity({
      heroHand: heroCards,
      board: mappedBoard,
      opponents,
      simulations: 10000,
    })

    setEquityResult(equity)
  }

  return (
    <div className={s.root}>
      <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
        <div className={s.section}>
          <Controller
            name="playerHand"
            control={control}
            rules={{
              validate: value => {
                if (value.length !== 2) {
                  return t('errors.selectTwoCards');
                }
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <div className={s.fieldWrapper}>
                <Hand
                  label={t('calculator.yourHand')}
                  maxCards={2}
                  value={field.value}
                  onChange={field.onChange}
                  disabledCards={boardCards}
                />
                {fieldState.error && <span className={s.error}>{fieldState.error.message}</span>}
              </div>
            )}
          />
        </div>

        <div className={s.section}>
          <Controller
            name="boardCards"
            control={control}
            rules={{
              validate: value => {
                if (value.length > 5) {
                  return t('errors.maxFiveCards');
                }
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <div className={s.fieldWrapper}>
                <Hand
                  label={t('calculator.board')}
                  maxCards={5}
                  value={field.value}
                  onChange={field.onChange}
                  disabledCards={playerHand}
                />
                {fieldState.error && <span className={s.error}>{fieldState.error.message}</span>}
              </div>
            )}
          />
        </div>

        <Controller
          name="players"
          control={control}
          render={({ field }) => (
            <OpponentsSection
              count={field.value || 0}
              onCountChange={(count) => {
                field.onChange(count)
                handleCountChange(count)
              }}
              ranges={ranges.map(r => ({
                id: String(r.id),
                name: r.name,
                matrix: r.matrix,
              }))}
              opponentRanges={opponentRanges}
              onRangeSelect={handleRangeSelect}
            />
          )}
        />

        <div className={s.action}>
          <div className={s.submitButtons}>
            <PrimaryButton type="submit">{ t('common.calculate') }</PrimaryButton>
            <ResetButton
              type="button"
              onClick={() => {
                setEquityResult(0.0);
              }}
            />
          </div>
        </div>
      </form>
      <ResultSection equity={equityResult} />
    </div>
  );
};