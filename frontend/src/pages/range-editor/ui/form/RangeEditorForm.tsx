import { useForm, Controller } from 'react-hook-form';
import s from './RangeEditorForm.module.scss';
import RootInput from '$/shared/ui/inputs/rootInput/RootInput';
import RootSelect from '$/shared/ui/selects/rootSelect/RootSelect';
import { PositionSection } from './positionSection/PositionSection';

import RangeSection from '../../../../features/rangeSection/RangeSection';
import { useState } from 'react';
import { PrimaryButton } from '$/shared/ui/buttons/primaryButtons/PrimaryButtons';
import { ColorSection } from '$/features/colorsSection/ColorSection';
import { useCreateRange } from '$/entities/range/api/useMutation';

export const RangeEditorForm = () => {
  const [isActiveColor, setIsActiveColor] = useState<string | null>(null);
  const [isActivePosition, setIsActivePosition] = useState<number | null>(null);

  const onChangePosition = (id: number) => {
    setIsActivePosition(id);
  };

  const onChangeColor = (hex: string) => {
    setIsActiveColor(hex);
  };

  const {
    control,
    // formState: { errors },
    handleSubmit,
  } = useForm();

  const positions = ['UTG', 'UTG+1', 'UTG+2', 'MP', 'HJ', 'CO', 'BTN', 'SB', 'BB'] as const;
  const { mutate: createRange } = useCreateRange();

  const onSubmit = data => {
    createRange({
      name: data.name,
      description: data.description,
      actionType: data.action,
      position: positions[data.position - 1],
      matrix: data.range,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <>
            <RootInput placeholder="Мой диапозон" label="Название" {...field} />
            {fieldState.error && <span>{fieldState.error.message}</span>}
          </>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <>
            <RootInput placeholder="Опцианально" label="Описание" {...field} />
            {fieldState.error && <span>{fieldState.error.message}</span>}
          </>
        )}
      />

      <Controller
        name="action"
        control={control}
        render={({ field, fieldState }) => (
          <>
            <RootSelect
              placeholder="Выбереие действие"
              label="Действие"
              items={actions}
              {...field}
            />
            {fieldState.error && <span>{fieldState.error.message}</span>}
          </>
        )}
      />

      <Controller
        name="position"
        control={control}
        render={({ field, fieldState }) => (
          <>
            <PositionSection
              isActive={isActivePosition}
              onChange={id => {
                onChangePosition(id);
                field.onChange(id);
              }}
            />
            {fieldState.error && <span>{fieldState.error.message}</span>}
          </>
        )}
      />

      <Controller
        name="color"
        control={control}
        render={({ field, fieldState }) => (
          <>
            <ColorSection
              isActive={isActiveColor}
              onChange={id => {
                onChangeColor(id);
                field.onChange(id);
              }}
            />
            {fieldState.error && <span>{fieldState.error.message}</span>}
          </>
        )}
      />

      <Controller
        name="range"
        control={control}
        render={({ field, fieldState }) => (
          <>
            <RangeSection
              value={field.value}
              onChange={field.onChange}
              selectedColor={isActiveColor ?? '#4CAF50'}
            />
            {fieldState.error && <span>{fieldState.error.message}</span>}
          </>
        )}
      />

      <PrimaryButton type="submit">Добавить</PrimaryButton>
    </form>
  );
};

const actions = [
  {
    label: 'open',
    value: 'open',
  },
  {
    label: 'raise',
    value: 'raise',
  },
  {
    label: '3bet',
    value: '3bet',
  },
  {
    label: 'Limp',
    value: 'Limp',
  },
  {
    label: 'fold',
    value: 'fold',
  },
  {
    label: 'call',
    value: 'call',
  },
];
