import s from './OpponentsSection.module.scss'
import { OpponentsSlider } from '$/shared/ui/slider/Slider'
import { OpponentSlot } from '../OpponentSlot/OpponentSlot'

interface Range {
  id: string
  name: string
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  matrix: Record<string, any>
}

interface OpponentsSectionProps {
  count: number
  onCountChange: (count: number) => void
  ranges: Range[]
  opponentRanges: (string | null)[]
  onRangeSelect: (index: number, rangeId: string | null) => void
}

export const OpponentsSection = ({
  count,
  onCountChange,
  ranges,
  opponentRanges,
  onRangeSelect,
}: OpponentsSectionProps) => {
  return (
    <div className={s.root}>
      <OpponentsSlider value={count} onChange={onCountChange} />

      <div className={s.slots}>
        {Array.from({ length: count }, (_, i) => (
          <OpponentSlot
            key={i}
            index={i}
            ranges={ranges}
            selectedRangeId={opponentRanges[i] ?? null}
            onSelect={(rangeId: string | null) => onRangeSelect(i, rangeId)}
          />
        ))}
      </div>
    </div>
  )
}