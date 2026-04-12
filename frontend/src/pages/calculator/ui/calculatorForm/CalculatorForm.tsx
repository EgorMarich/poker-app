import { Controller, useForm } from 'react-hook-form';
import { Hand, SelectedCards } from '$/features/hand/Hand';
import s from './CalculatorForm.module.scss';
import RootSelect from '$/shared/ui/selects/rootSelect/RootSelect';
import { useState } from 'react';
import { OpponentsSlider } from '$/shared/ui/slider/Slider';
import { calculateEquity } from '../../lib/calculateEquity';
import { mapUICards } from '../../lib/adapters';
import { PrimaryButton } from '$/shared/ui/buttons/primaryButtons/PrimaryButtons';
import { ResultSection } from '../resultSection/ResultSection';
import { SecondaryButton } from '$/shared/ui/buttons/secondaryButtons/SecondaryButtons';
import clsx from 'clsx';
import { ResetButton } from '$/shared/ui/buttons/tertiaryButtons/ResetButton';
import { useQuery } from '@tanstack/react-query';
import { useGetAllRanges } from '$/entities/range/api/useQueries';

interface CalculatorFormData {
  playerHand: SelectedCards;
  boardCards: SelectedCards;
  players?: number;
  position?: string;
  range?: string;
}

export const CalculatorForm = () => {
  const { control, handleSubmit, watch } = useForm<CalculatorFormData>({
    defaultValues: {
      playerHand: [],
      boardCards: [],
      players: 2,
    },
  });

  const { data: ranges } = useQuery(useGetAllRanges)

  const [isShow, setIsShow] = useState<boolean>(false);
  const [equityResult, setEquityResult] = useState<number | null>(0.0);

  const playerHand = watch('playerHand');
  const boardCards = watch('boardCards');

  const onSubmit = (formData: CalculatorFormData) => {
    const heroCards = mapUICards(formData.playerHand);
    const mappedBoard = mapUICards(formData.boardCards);

    const selectedRange = ranges?.find(r => String(r.id) === formData.range);

    const opponents = Array(formData.players! - 1)
      .fill({})
      .map((_, i) => (i === 0 && selectedRange ? { range: selectedRange.matrix } : {}));

    const equity = calculateEquity({
      heroHand: heroCards,
      board: mappedBoard,
      opponents,
      simulations: 10000,
    });

    setEquityResult(equity);
  };

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
                  return 'Выберите ровно 2 карты для вашей руки';
                }
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <div className={s.fieldWrapper}>
                <Hand
                  label="Ваша рука"
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
                  return 'Максимум 5 карт на борде';
                }
                return true;
              },
            }}
            render={({ field, fieldState }) => (
              <div className={s.fieldWrapper}>
                <Hand
                  label="Карты на борде"
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
            <OpponentsSlider value={field.value ?? 1} onChange={field.onChange} />
          )}
        />

        <div className={clsx(s.action, isShow && s.actionWithRange)}>
          {!isShow ? (
            <SecondaryButton type="button" onClick={() => setIsShow(true)} icon>
              Диапозон
            </SecondaryButton>
          ) : (
            <div className={s.selection}>
              <Controller
                name="range"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <RootSelect
                      placeholder="Выберите диапазон"
                      label="Действие"
                      items={
                        ranges?.map(range => ({ label: range.name, value: String(range.id) })) || []
                      }
                      {...field}
                    />
                    {fieldState.error && <span>{fieldState.error.message}</span>}
                  </>
                )}
              />
            </div>
          )}
          <div className={s.submitButtons}>
            <PrimaryButton type="submit">Рассчитать</PrimaryButton>
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
