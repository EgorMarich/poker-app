import { typography } from '$/shared/typography/typography';
import { CELLS } from './config/data';
import { PosiotionSectionProps, type Cells } from './config/types';
import s from './PositionSection.module.scss';
import clsx from 'clsx';

export const PositionSection = ({
  isActive,
  onChange,
  label = 'Позиция',
}: PosiotionSectionProps) => {
  return (
    <div className={s.root}>
      <div className={typography({ variant: 'bodySmSemiBold' })}>{label}</div>
      <div className={s.cells}>
        {CELLS.map((item: Cells) => (
          <div
            key={item.id}
            onClick={() => onChange(item.id)}
            className={clsx(s.cell, isActive == item.id && s.active)}
          >
            {item.title}
          </div>
        ))}
      </div>
    </div>
  );
};
