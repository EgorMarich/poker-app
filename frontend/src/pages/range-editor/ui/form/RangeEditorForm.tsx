import { useForm, Controller } from 'react-hook-form'
import s from './RangeEditorForm.module.scss'
import RootInput from '$/shared/ui/inputs/rootInput/RootInput'
import RootSelect from '$/shared/ui/selects/rootSelect/RootSelect'
import { PositionSection } from './positionSection/PositionSection'
import RangeSection from '../../../../features/rangeSection/RangeSection'
import { useLayoutEffect, useState } from 'react'
import { PrimaryButton } from '$/shared/ui/buttons/primaryButtons/PrimaryButtons'
import { ColorSection } from '$/features/colorsSection/ColorSection'
import { useCreateRange, useUpdateRange } from '$/entities/range/api/useMutation'

import { useRange } from '$/entities/range/api/useQueries'

const POSITIONS = ['UTG', 'UTG+1', 'UTG+2', 'MP', 'HJ', 'CO', 'BTN', 'SB', 'BB'] as const
// type Position = typeof POSITIONS[number]

interface FormData {
  name: string
  description: string
  action: 'open' | 'raise' | '3bet' | 'fold' | 'call' | undefined
  position: number | undefined
  color: string
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  range: Record<string, any>
}

interface RangeEditorFormProps {
  id?: string
}

export const RangeEditorForm = ({ id }: RangeEditorFormProps) => {
  const isEditMode = !!id
  const { data: rangeData } = useRange(isEditMode ? id : '')

  const [isActiveColor, setIsActiveColor] = useState<string | null>(null)
  const [isActivePosition, setIsActivePosition] = useState<number | null>(null)

  const { control, reset, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: '',
      description: '',
      action: undefined,
      position: undefined,
      color: '',
      range: {},
    },
  })

  const { mutate: createRange } = useCreateRange()
  const { mutate: updateRange } = useUpdateRange()

  useLayoutEffect(() => {
    if (!isEditMode || !rangeData) return

    const positionIndex = POSITIONS.findIndex(p => p === rangeData.position)

    reset({
      name: rangeData.name ?? '',
      description: rangeData.description ?? '',
      action: (rangeData.actionType as FormData['action']) ?? undefined,
      position: positionIndex !== -1 ? positionIndex + 1 : undefined,
      color: '',
      range: rangeData.matrix ?? {},
    })

    if (positionIndex !== -1) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsActivePosition(positionIndex + 1)
    }
  }, [isEditMode, rangeData, reset])

  const onSubmit = (data: FormData) => {
    const payload = {
      name: data.name,
      description: data.description,
      actionType: data.action,
      position: data.position != null ? POSITIONS[data.position - 1] : undefined,
      matrix: data.range,
    }

    if (isEditMode && id) {
      updateRange({ id, body: payload })
    } else {
      createRange(payload)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={s.form}>
      <Controller
        name="name"
        control={control}
        rules={{ required: 'Введите название' }}
        render={({ field, fieldState }) => (
          <>
            <RootInput placeholder="Мой диапазон" label="Название" {...field} />
            {fieldState.error && <span>{fieldState.error.message}</span>}
          </>
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field, fieldState }) => (
          <>
            <RootInput placeholder="Опционально" label="Описание" {...field} />
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
              placeholder="Выберите действие"
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
              onChange={posId => {
                setIsActivePosition(posId)
                field.onChange(posId)
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
              onChange={hex => {
                setIsActiveColor(hex)
                field.onChange(hex)
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

      <PrimaryButton type="submit">
        {isEditMode ? 'Обновить' : 'Добавить'}
      </PrimaryButton>
    </form>
  )
}

const actions = [
  { label: 'open', value: 'open' },
  { label: 'raise', value: 'raise' },
  { label: '3bet', value: '3bet' },
  { label: 'Limp', value: 'Limp' },
  { label: 'fold', value: 'fold' },
  { label: 'call', value: 'call' },
]