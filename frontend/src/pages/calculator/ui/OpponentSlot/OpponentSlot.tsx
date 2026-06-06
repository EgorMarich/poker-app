import { useState } from 'react';
import clsx from 'clsx';
import s from './OpponentSlot.module.scss';
import { typography } from '$/shared/typography/typography';
import { useTranslation } from 'react-i18next';
import RootSelect from '$/shared/ui/selects/rootSelect/RootSelect';
import EditIcon from './assets/editor.svg?react';
interface Range {
  id: string;
  name: string;
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  matrix: Record<string, any>;
}

interface OpponentSlotProps {
  index: number;
  ranges: Range[];
  selectedRangeId: string | null;
  onSelect: (rangeId: string | null) => void;
}

const RANKS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

function getHandNotation(r: number, c: number) {
  if (r === c) return `${RANKS[r]}${RANKS[c]}`;
  if (r < c) return `${RANKS[r]}${RANKS[c]}s`;
  return `${RANKS[c]}${RANKS[r]}o`;
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
function RangeMiniGrid({ matrix }: { matrix: Record<string, any> }) {
  return (
    <div className={s.grid}>
      {Array.from({ length: 13 }, (_, r) =>
        Array.from({ length: 13 }, (_, c) => {
          const hand = getHandNotation(r, c);
          const cell = matrix[hand];
          const isSelected =
            cell?.selected || (typeof cell === 'string' && cell !== 'fold' && cell !== null);
          const color = cell?.color ?? null;

          return (
            <div
              key={`${r}-${c}`}
              className={s.cell}
              style={{
                backgroundColor: isSelected && color ? color : isSelected ? '#3b82f6' : undefined,
              }}
            />
          );
        })
      )}
    </div>
  );
}

export const OpponentSlot = ({ index, ranges, selectedRangeId, onSelect }: OpponentSlotProps) => {
  const { t } = useTranslation();
  const [showGrid, setShowGrid] = useState(false);

  const selectedRange = ranges.find(r => r.id === selectedRangeId) ?? null;

  return (
    <div className={s.root}>
      <div className={s.header}>
        <span className={clsx(s.label, typography({ variant: 'caption', color: 'gray-400' }))}>
          {t('calculator.opponent')} {index + 1}
        </span>

        <div className={s.controls}>
          <RootSelect
            value={selectedRangeId ?? ''}
            placeholder={t('calculator.selectRange')}
            onChange={val => onSelect(val || null)}
            items={ranges.map(i => ({ label: i.name, value: i.id }))}
          />

          {selectedRange && (
            <EditIcon
              className={clsx(s.editorIcon, s.gridToggle, showGrid && s.gridToggleActive)}
              onClick={() => setShowGrid(v => !v)}
            />
          )}

          {selectedRangeId && (
            <button
              type="button"
              className={s.clearBtn}
              onClick={() => {
                onSelect(null);
                setShowGrid(false);
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {showGrid && selectedRange && (
        <div className={s.gridWrapper}>
          <span
            className={clsx(s.gridLabel, typography({ variant: 'caption', color: 'gray-500' }))}
          >
            {selectedRange.name}
          </span>
          <RangeMiniGrid matrix={selectedRange.matrix} />
        </div>
      )}
    </div>
  );
};
