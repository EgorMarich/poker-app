import clsx from 'clsx';
import s from './ColorSection.module.scss';
import { COLORS } from './config/data';
import { ColorSectionProps } from './config/types';
import { typography } from '$/shared/typography/typography';

export const ColorSection = ({ isActive, onChange }: ColorSectionProps) => {
  return (
    <div className={clsx(s.root, typography({ variant: 'bodySmSemiBold'}))}>
      Цвет
      <div className={s.colors}>
        {COLORS.map(item => (
          <div
            key={item.id}
            onClick={() => onChange(item.hex)}
            className={clsx(s.color, s[item.color], isActive == item.hex && s.active)}
          />
        ))}
      </div>
    </div>
  );
};
