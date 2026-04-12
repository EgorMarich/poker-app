import { Slider } from '@base-ui/react/slider';
import styles from './Slider.module.scss';

type OpponentsSliderProps = {
  value: number;
  onChange: (value: number) => void;
};

export function OpponentsSlider({ value, onChange }: OpponentsSliderProps) {
  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Количество оппонентов: {value}</span>

      <Slider.Root min={1} max={7} step={1} value={value} onValueChange={val => onChange(val)}>
        <Slider.Control className={styles.Control}>
          <Slider.Track className={styles.Track}>
            <Slider.Indicator className={styles.Indicator} />
            <Slider.Thumb className={styles.Thumb} />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>

      <div className={styles.marks}>
        {[1, 2, 3, 4, 5, 6, 7].map(n => (
          <span key={n}>{n}</span>
        ))}
      </div>
    </div>
  );
}
