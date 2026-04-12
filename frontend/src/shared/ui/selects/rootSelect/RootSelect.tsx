import * as React from 'react';
import { Select } from '@base-ui/react/select';
import { Field } from '@base-ui/react/field';
import styles from './RootSelect.module.scss';
import { typography } from '$/shared/typography/typography';

interface item {
  label: string;
  value: string;
}

interface RootSelectProps {
  label: string;
  items: item[];
  placeholder: string;
  onChange: (value: string) => void;
}

export default function RootSelect({ label, items, onChange, placeholder }: RootSelectProps) {
  const handleValueChange = (selectedValue: string | null) => {
    onChange?.(selectedValue || '');
  };

  return (
    <Field.Root className={styles.Field}>
      <Field.Label className={styles.Label} nativeLabel={false} render={<div />}>
        <p className={typography({ variant: 'bodySmSemiBold' })}>{label}</p>
      </Field.Label>
      <Select.Root items={items} onValueChange={handleValueChange}>
        <Select.Trigger className={styles.Select}>
          <Select.Value className={styles.Value} placeholder={placeholder} />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner className={styles.Positioner} sideOffset={8}>
            <Select.Popup className={styles.Popup}>
              <Select.ScrollUpArrow className={styles.ScrollArrow} />
              <Select.List className={styles.List}>
                {items.map(({ label, value }) => (
                  <Select.Item key={label} value={value} className={styles.Item}>
                    <Select.ItemText className={styles.ItemText}>{label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.List>
              <Select.ScrollDownArrow className={styles.ScrollArrow} />
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </Field.Root>
  );
}
