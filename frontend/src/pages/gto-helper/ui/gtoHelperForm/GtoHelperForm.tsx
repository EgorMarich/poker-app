import { Controller, useForm } from 'react-hook-form';
import { Hand, SelectedCards } from '$/features/hand/Hand';
import s from './GtoHelperForm.module.scss';
import RootSelect from '$/shared/ui/selects/rootSelect/RootSelect';
import { useState } from 'react';
import { PrimaryButton } from '$/shared/ui/buttons/primaryButtons/PrimaryButtons';
import { SecondaryButton } from '$/shared/ui/buttons/secondaryButtons/SecondaryButtons';
import clsx from 'clsx';
import { ResetButton } from '$/shared/ui/buttons/tertiaryButtons/ResetButton';
import { PositionSection } from '$/pages/range-editor/ui/form/positionSection/PositionSection';
import RootInput from '$/shared/ui/inputs/rootInput/RootInput';
import Textarea from '$/shared/ui/textarea/Textarea';
import { GtoFormData } from '$/shared/hooks/useGtoHelper';
import { useTranslation } from 'react-i18next';

interface CalculatorFormData {
  playerHand: SelectedCards;
  boardCards: SelectedCards;
  position?: number;
  range?: string;
  bank?: string;
  bid?: string;
  info?: string;
}

interface GtoHelperFormProps {
  onSubmit: (data: GtoFormData) => void;
  isPending: boolean;
  rangeItems?: { id: string; label: string; value: string }[];
}

export const GtoHelperForm = ({ onSubmit, isPending, rangeItems }: GtoHelperFormProps) => {
  const { t } = useTranslation();
  const { control, handleSubmit, watch, reset } = useForm<CalculatorFormData>({
    defaultValues: { playerHand: [], boardCards: [] },
  });

  const [isActivePosition, setIsActivePosition] = useState<number | null>(null);
  const [isShow, setIsShow] = useState(false);

  const playerHand = watch('playerHand');
  const boardCards = watch('boardCards');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
      <div className={s.section}>
        <Controller
          name="playerHand"
          control={control}
          rules={{ validate: v => v.length === 2 || t('selectTwoCards') }}
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
          rules={{ validate: v => v.length <= 5 || t('errors.maxFiveCards') }}
          render={({ field, fieldState }) => (
            <div className={s.fieldWrapper}>
              <Hand
                label={ t('calculator.board')}
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
        name="position"
        control={control}
        render={({ field, fieldState }) => (
          <>
            <PositionSection
              isActive={isActivePosition}
              onChange={id => {
                setIsActivePosition(id);
                field.onChange(id);
              }}
            />
            {fieldState.error && <span>{fieldState.error.message}</span>}
          </>
        )}
      />

      <div className={s.context}>
        <div className={s.sum}>
          <Controller
            name="bank"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <RootInput placeholder={t('gto.bankPlaceholder')} label={t('gto.bank')} {...field} />
                {fieldState.error && <span>{fieldState.error.message}</span>}
              </>
            )}
          />
          <Controller
            name="bid"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <RootInput placeholder={t('gto.bidPlaceholder')} label={t('gto.bid')} {...field} />
                {fieldState.error && <span>{fieldState.error.message}</span>}
              </>
            )}
          />
        </div>

        <Controller
          name="info"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <Textarea
                placeholder={ t( 'gto.additionalInfoPlaceholder') }
                label={t('gto.additionalInfo')}
                {...field}
              />
              {fieldState.error && <span>{fieldState.error.message}</span>}
            </>
          )}
        />
      </div>

      <div className={clsx(s.action, isShow && s.actionWithRange)}>
        {!isShow ? (
          <SecondaryButton type="button" onClick={() => setIsShow(true)} icon>
            { t('gto.rangeLabel')}
          </SecondaryButton>
        ) : (
          <div className={s.selection}>
            <Controller
              name="range"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <RootSelect
                    placeholder={ t('gto.selectRange') }
                    label={t('gto.range')}
                    items={rangeItems ?? []}
                    {...field}
                  />
                  {fieldState.error && <span>{fieldState.error.message}</span>}
                </>
              )}
            />
          </div>
        )}
        <div className={s.submitButtons}>
          <PrimaryButton type="submit" disabled={isPending}>
            {isPending ? t('gto.analyzing') : t('common.calculate')}
          </PrimaryButton>
          <ResetButton
            type="button"
            onClick={() => {
              reset();
              setIsActivePosition(null);
              setIsShow(false);
            }}
          />
        </div>
      </div>
    </form>
  );
};
