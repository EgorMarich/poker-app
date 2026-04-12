import { Input } from '@base-ui/react/input';
import s from './RootInput.module.scss';
import { ChangeEvent } from 'react';
import clsx from 'clsx';
import { typography } from '$/shared/typography/typography';

interface RootInputProps {
  placeholder?: string;
  type?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  name?: string;
}

export default function RootInput({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  name,
}: RootInputProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };


  return (
    <label className={clsx(s.label, typography({ variant: 'bodySmSemiBold'}))}>
      {label}
      <Input
        type={type}
        placeholder={placeholder}
        className={s.input}
        value={value ?? ''}
        onChange={handleChange}
        name={name}
      />
    </label>
  );
}
